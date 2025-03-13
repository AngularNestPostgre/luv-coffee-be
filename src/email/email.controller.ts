import { Body, Controller, Post } from '@nestjs/common';
import { EmailScheduleDto } from './dto/email-schedule.dto';
import { EmailService } from './email.service';

@Controller('api/email')
export class EmailController {
  constructor(private readonly emailSrvice: EmailService) {}

  @Post('schedule')
  async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    this.emailSrvice.scheduleEmail(emailSchedule);
  }
}
