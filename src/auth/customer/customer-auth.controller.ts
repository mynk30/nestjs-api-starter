import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { LoginDto } from '../dto/auth.dto';

@Controller('auth')
export class CustomerAuthController {
  constructor() {}

  @Post('customer/login')
  @HttpCode(HttpStatus.OK)
  async loginCustomer(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {}
}
