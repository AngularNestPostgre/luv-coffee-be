import { IsNotEmpty, IsString } from 'class-validator';

export class EmaiConfirmationQueryDto {
  @IsString()
  @IsNotEmpty()
  jwt: string;
}
