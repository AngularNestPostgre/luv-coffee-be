import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { RefreshJwtKey } from '@common/enums/jwt.enums';
import { JwtPayload } from '@lib/fe-shared';
import { UsersService } from '@users/users.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Refresh as string,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get(RefreshJwtKey.Secret),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const refreshToken = request.cookies?.Refresh as string;
    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
  }
}
