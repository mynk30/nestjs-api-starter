import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config"
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { AdminsModule } from './admins/admins.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    DatabaseModule,
    AuthModule,
    CustomersModule,
    AdminsModule,
    HealthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
