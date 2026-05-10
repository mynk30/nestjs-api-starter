import { Injectable, BadRequestException } from '@nestjs/common';
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
    delete customerObj.password;
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
    const accessToken = this.jwtService.sign(payload);

    const customerObj = customer.toObject();
    delete customerObj.password;

    return {
      accessToken,
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
    delete adminObj.password;
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
    const accessToken = this.jwtService.sign(payload);

    const adminObj = admin.toObject();
    delete adminObj.password;

    return {
      accessToken,
      user: adminObj,
    };
  }
}

