import { Controller, Post, Body, HttpCode, HttpStatus, Res, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as fastify from 'fastify';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('customer/register')
  async registerCustomer(@Body() registerDto: RegisterDto) {
    return this.authService.registerCustomer(registerDto);
  }

  @Post('customer/login')
  @HttpCode(HttpStatus.OK)
  async loginCustomer(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) reply: fastify.FastifyReply,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.loginCustomer(loginDto);

    reply.setCookie('customer_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return { accessToken, user };
  }

  @Post('admin/register')
  async registerAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.registerAdmin(registerDto);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async loginAdmin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) reply: fastify.FastifyReply,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.loginAdmin(loginDto);

    reply.setCookie('admin_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return { accessToken, user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: fastify.FastifyRequest,
  ) {
    const customerToken = request.cookies.customer_refresh_token;
    const adminToken = request.cookies.admin_refresh_token;
    const token = customerToken || adminToken;

    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    return this.authService.refresh(token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: fastify.FastifyRequest,
    @Res({ passthrough: true }) reply: fastify.FastifyReply,
  ) {
    const customerToken = request.cookies.customer_refresh_token;
    const adminToken = request.cookies.admin_refresh_token;
    const token = customerToken || adminToken;

    if (!token) {
      return { message: 'Logged out successfully' };
    }

    const payload = await this.authService.logout(token);

    if (payload) {
      if (payload.type === 'customer') {
        reply.clearCookie('customer_refresh_token', { path: '/' });
      } else if (payload.type === 'admin') {
        reply.clearCookie('admin_refresh_token', { path: '/' });
      }
    }

    return { message: 'Logged out successfully' };
  }
}
