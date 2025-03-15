import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class EmailScheduleDto {
  @IsEmail()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  @IsOptional()
  date: string;
}
