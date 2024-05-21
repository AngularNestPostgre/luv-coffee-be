import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { JsonWebTokenService } from '@common/services/json-web-token/json-web-token.service';
import { UsersService } from '@users/users.service';

import { CookieName, TokenType } from './enums/token.enums';
import { AuthTokens, Token } from './interfaces/token.interfaces';
import { AccessJwtKey, RefreshJwtKey } from '@common/enums/jwt.enums';
import { JwtPayload } from '@lib/fe-shared';
import { UserEntity } from '@users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JsonWebTokenService,
    private readonly usersService: UsersService,
  ) {}

  public async checkUser(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    return !!user;
  }

  public getCookiesForLogOut(): string[] {
    return [
      /**
       * Clear '${CookieName.AccessJwt}' cookie is needed if for accessToken we use cookies.
       * But in our application we are keeping accessToken in localStorage.
       */
      // `${CookieName.AccessJwt}=; HttpOnly; Path=/; Max-Age=0`,
      `${CookieName.RefreshJwt}=; HttpOnly; Path=/; Max-Age=0`,
    ];
  }

  public async loginUser(user: UserEntity): Promise<AuthTokens> {
    const accessToken = this.getAccessOrRefreshToken(
      user,
      TokenType.AcessToken,
    );
    const refreshToken = this.getAccessOrRefreshToken(
      user,
      TokenType.RefreshToken,
    );

    await this.usersService.setRefreshToken(refreshToken.jwt, user.id);

    return { accessToken, refreshToken };
  }

  public refreshToken(user: UserEntity): Token {
    return this.getAccessOrRefreshToken(user, TokenType.AcessToken);
  }

  public async validateUser(email: string, pass: string): Promise<UserEntity> {
    const user = await this.usersService.findByEmail(email);
    const passMatch = await bcrypt.compare(pass, user.password);

    if (!user || !passMatch) {
      throw new UnauthorizedException(
        'Please check your account details and try again',
      );
    }

    user.password = undefined;
    return user;
  }

  private getAccessOrRefreshToken(
    user: UserEntity,
    tokenType: TokenType,
  ): Token {
    let jwtSecretKey: string = AccessJwtKey.Secret;
    let jwtExpirationKey: string = AccessJwtKey.Expiration;
    let cookieName: string = CookieName.AccessJwt;

    if (tokenType === TokenType.RefreshToken) {
      jwtSecretKey = RefreshJwtKey.Secret;
      jwtExpirationKey = RefreshJwtKey.Expiration;
      cookieName = CookieName.RefreshJwt;
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const jwtExpirationSeconds =
      this.configService.get<number>(jwtExpirationKey);
    const jwt = this.jwtService.sign(
      payload,
      this.configService.get(jwtSecretKey),
      `${jwtExpirationSeconds}s`,
    );
    const cookie = `${cookieName}=${jwt}; HttpOnly; Path=/; Max-Age=${jwtExpirationSeconds}`;

    return { cookie, jwt };
  }
}
