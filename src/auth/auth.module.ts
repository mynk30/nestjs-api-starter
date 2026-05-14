import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CustomersModule } from '../customers/customers.module';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [
    CustomersModule,
    AdminsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
