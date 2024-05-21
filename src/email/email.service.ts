import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { CronJob } from 'cron';

import { EmailScheduleDto } from './dto/email-schedule.dto';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.nodemailerTransport = createTransport({
      service: this.configService.get('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  public async sendMail(options: Mail.Options): Promise<any> {
    return await this.nodemailerTransport.sendMail(options);
  }

  public scheduleEmail(emailSchedule: EmailScheduleDto): void {
    const date = emailSchedule.date
      ? new Date(emailSchedule.date)
      : new Date(Date.now() + 1 * 1000);

    const job = new CronJob(date, () => {
      this.sendMail({
        to: emailSchedule.recipient,
        subject: emailSchedule.subject,
        text: emailSchedule.content,
      });
    });

    const jobName = `${date.toISOString()}-${emailSchedule.subject}`;
    this.schedulerRegistry.addCronJob(jobName, job);

    job.start();
    this.logger.warn(`job ${jobName} added`);
  }

  // public cancelAllCronJobs() {
  //   this.schedulerRegistry.getCronJobs().forEach((job) => {
  //     job.stop();
  //   });
  //   this.logger.warn(`All jobs stopped!`);
  // }

  // public deleteCronJob(name: string) {
  //   this.schedulerRegistry.deleteCronJob(name);
  //   this.logger.warn(`Job ${name} deleted!`);
  // }
}
