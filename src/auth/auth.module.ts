import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { CommonModule } from '@common/common.module';
import { UsersModule } from '@users/users.module';

import { AuthService } from './auth.service';
import { LocalSignupStrategy } from './strategies/local-signup.strategy';
import { LocalLoginStrategy } from './strategies/local-login.strategy';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { JwtAccessTokenAuthGuard } from './guards/jwt-access-token-auth.guard';
import { AuthController } from './auth.controller';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';

@Module({
  imports: [CommonModule, ConfigModule, UsersModule, PassportModule],
  providers: [
    AuthService,
    LocalSignupStrategy,
    LocalLoginStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAccessTokenAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
