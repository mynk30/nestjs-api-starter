import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer/register')
  async registerCustomer(@Body() registerDto: RegisterDto) {
    return this.authService.registerCustomer(registerDto);
  }

  @Post('customer/login')
  @HttpCode(HttpStatus.OK)
  async loginCustomer(@Body() loginDto: LoginDto) {
    return this.authService.loginCustomer(loginDto);
  }

  @Post('admin/register')
  async registerAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.registerAdmin(registerDto);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async loginAdmin(@Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto);
  }
}



