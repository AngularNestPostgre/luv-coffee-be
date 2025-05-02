import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  HttpCode,
  Get,
  Query,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserEmailService } from '@users/services/user-email/user-email.service';
import { UsersService } from '@users/users.service';

import { Public } from './decorators/public.decorator';
import { LocalLoginAuthGuard } from './guards/local-login-auth.guard';
import { JwtRefreshTokenAuthGuard } from './guards/jwt-refresh-token-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { LocalSignupAuthGuard } from './guards/local-signup-auth.guard';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { UserEntity } from '@users/entities/user.entity';
import { AccessToken, AuthStateQuery, UserRole } from '@lib/fe-shared';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly userEmailService: UserEmailService,
  ) {}

  @Public()
  @Get('auth-state')
  async authState(@Query() query: AuthStateQuery): Promise<UserRole | null> {
    const user: UserEntity = await this.usersService.findByEmail(query.email);
    let userRole: UserRole | null = null;

    if (user) {
      if (
        [
          UserRole.Root,
          UserRole.Admin,
          UserRole.Editor,
          UserRole.User,
        ].includes(user.role)
      ) {
        userRole = UserRole.User;
      } else {
        userRole = user.role;
      }
    }

    return userRole;
  }

  @Public()
  @UseGuards(LocalSignupAuthGuard)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const user: UserEntity = await this.usersService.create({
      ...createUserDto,
      role: UserRole.NotActivated,
    });
    // await this.userEmailService.sendVerificationLink(user);
    return user;
  }

  @Public()
  @UseGuards(LocalLoginAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser): Promise<AccessToken> {
    const { accessToken, refreshToken } = await this.authService.loginUser(
      req.user,
    );
    req.res.setHeader('Set-Cookie', [refreshToken.cookie]);
    return { accessToken: accessToken.jwt };
  }

  @Post('logout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    return { success: true };
  }

  @Public()
  @UseGuards(JwtRefreshTokenAuthGuard)
  @Post('refresh')
  refreshToken(@Req() req: RequestWithUser) {
    const accessToken = this.authService.refreshToken(req.user);
    return { accessToken: accessToken.jwt };
  }
}
