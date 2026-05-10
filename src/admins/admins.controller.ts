import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('admins')
export class AdminsController {
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
