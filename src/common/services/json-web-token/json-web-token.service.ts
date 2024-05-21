import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '@lib/fe-shared';

@Injectable()
export class JsonWebTokenService {
  constructor(private readonly jwtService: JwtService) {}

  public async decodeJwt(token: string, secret: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret,
      });

      if (typeof payload === 'object') {
        return { ...payload };
      }

      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Token expired');
      }

      throw new BadRequestException('Bad token');
    }
  }

  public sign(payload: JwtPayload, secret: string, expiresIn: string): string {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }
}
