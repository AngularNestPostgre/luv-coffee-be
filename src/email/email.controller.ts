import { Body, Controller, Post } from '@nestjs/common';
import { EmailScheduleDto } from './dto/email-schedule.dto';
import { EmailService } from './email.service';

@Controller('api/email')
export class EmailController {
  constructor(private readonly emailSrvice: EmailService) {}

  @Post('schedule')
  scheduleEmail(@Body() emailSchedule: EmailScheduleDto): void {
    this.emailSrvice.scheduleEmail(emailSchedule);
  }
}
