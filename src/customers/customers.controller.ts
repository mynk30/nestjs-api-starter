import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto, @Request() req) {
    return this.customersService.create(createCustomerDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.customersService.findById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Request() req, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.updateProfile(req.user.id, updateCustomerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAccount(@Request() req) {
    return this.customersService.removeAccount(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Request() req, @Body() data: any) {
    await this.customersService.changePassword(req.user.id, data);
    return { message: 'Password changed successfully' };
  }
}
