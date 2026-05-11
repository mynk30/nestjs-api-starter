import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from '../customers/customers.service';
import { AdminsService } from '../admins/admins.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly adminsService: AdminsService,
    private readonly jwtService: JwtService,
  ) {}

  // Helper to generate both tokens
  private async generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'access-secret',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // --- Customer Auth ---

  async registerCustomer(dto: RegisterDto) {
    const { email, password, name } = dto;
    const exists = await this.customersService.findByEmail(email);
    if (exists) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await this.customersService.create({
      name,
      email,
      password: hashedPassword,
    });

    const customerObj = customer.toObject();
    delete (customerObj as any).password;
    return customerObj;
  }

  async loginCustomer(dto: LoginDto) {
    const { email, password } = dto;
    const customer = await this.customersService.findByEmail(email);
    if (!customer) {
      throw new BadRequestException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, customer.password);
    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: customer._id, email: customer.email, type: 'customer' };
    const { accessToken, refreshToken } = await this.generateTokens(payload);

    // Store refresh token in DB
    customer.refreshToken = refreshToken;
    await customer.save();

    const customerObj = customer.toObject();
    delete (customerObj as any).password;
    delete (customerObj as any).refreshToken;

    return {
      accessToken,
      refreshToken,
      user: customerObj,
    };
  }

  // --- Admin Auth ---

  async registerAdmin(dto: RegisterDto) {
    const { email, password, name } = dto;
    const exists = await this.adminsService.findByEmail(email);
    if (exists) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await this.adminsService.create({
      name,
      email,
      password: hashedPassword,
    });

    const adminObj = admin.toObject();
    delete (adminObj as any).password;
    return adminObj;
  }

  async loginAdmin(dto: LoginDto) {
    const { email, password } = dto;
    const admin = await this.adminsService.findByEmail(email);
    if (!admin) {
      throw new BadRequestException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: admin._id, email: admin.email, type: 'admin' };
    const { accessToken, refreshToken } = await this.generateTokens(payload);

    // Store refresh token in DB
    admin.refreshToken = refreshToken;
    await admin.save();

    const adminObj = admin.toObject();
    delete (adminObj as any).password;
    delete (adminObj as any).refreshToken;

    return {
      accessToken,
      refreshToken,
      user: adminObj,
    };
  }

  // --- Common Refresh & Logout ---

  async refresh(providedToken: string) {
    try {
      // 1. Verify refresh token JWT
      const payload = this.jwtService.verify(providedToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });

      // 2. Find user in DB
      let user: any;
      if (payload.type === 'customer') {
        user = await this.customersService.findByEmail(payload.email);
      } else {
        user = await this.adminsService.findByEmail(payload.email);
      }

      if (!user) throw new UnauthorizedException('User not found');

      // 3. Validate token match
      if (user.refreshToken !== providedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 4. Generate new access token
      const newPayload = { sub: user._id, email: user.email, type: payload.type };
      const accessToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'access-secret',
        expiresIn: '15m',
      });

      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(providedToken: string) {
    try {
      const payload = this.jwtService.verify(providedToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });

      let user: any;
      if (payload.type === 'customer') {
        user = await this.customersService.findByEmail(payload.email);
      } else {
        user = await this.adminsService.findByEmail(payload.email);
      }

      if (user && user.refreshToken === providedToken) {
        user.refreshToken = null;
        await user.save();
      }

      return payload; // Return payload so controller knows which cookie to clear
    } catch (e) {
      return null;
    }
  }
}
