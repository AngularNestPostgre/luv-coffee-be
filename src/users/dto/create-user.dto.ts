import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { CreateUser, UserRole } from '@lib/fe-shared';

export class CreateUserDto implements CreateUser {
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6, { message: 'The min length of password is 6' })
  @MaxLength(20, {
    message: `The password can't accept more than 20 characters`,
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/, {
    message:
      'Password should contain at least one numeric digit, one supercase char and one lowercase char',
  })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsOptional()
  @IsEnum(UserRole)
  readonly role: UserRole;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly refreshToken: string;
}
