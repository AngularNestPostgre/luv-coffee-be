import { JsonWebTokenService } from '@common/services/json-web-token/json-web-token.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EmailJwtKey } from '@common/enums/jwt.enums';
import { UserEntity } from '@users/entities/user.entity';
import { JwtPayload } from '@lib/fe-shared';
import { EmailService } from '@email/email.service';

@Injectable()
export class UserEmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly jwtService: JsonWebTokenService,
  ) {}

  public sendVerificationLink(user: UserEntity): Promise<any> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
    };
    const jwt = this.jwtService.sign(
      payload,
      this.configService.get(EmailJwtKey.Secret),
      `${this.configService.get(EmailJwtKey.Expiration)}s`,
    );

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?jwt=${jwt}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      to: user.email,
      subject: 'Email confirmation',
      text,
    });
  }
}
