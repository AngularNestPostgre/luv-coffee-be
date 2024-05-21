import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalSignupStrategy extends PassportStrategy(
  Strategy,
  'local-signup',
) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string): Promise<boolean> {
    const isUserRegistered = await this.authService.checkUser(email);

    if (isUserRegistered) {
      throw new ForbiddenException(
        `Email ${email} has already been registered.`,
      );
    }

    return true;
  }
}
