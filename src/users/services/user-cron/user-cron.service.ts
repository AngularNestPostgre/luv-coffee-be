import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';

import { UserEntity } from '@users/entities/user.entity';
import { UserRole } from '@lib/fe-shared';
import { EmailJwtKey } from '@common/enums/jwt.enums';

@Injectable()
export class UserCronService {
  private readonly logger = new Logger(UserCronService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Cron job starts every day at midnight.
   * Avoided situation when jwt is expired, but user is not deleted, by:
   *  '.plus({ hours: 23, minutes: 59, seconds: 59 })'
   */
  @Cron('0 0 0 * * *')
  private async removeNotActiveUsers() {
    const users: UserEntity[] = await this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.NotActivated })
      .andWhere(`user.createdAt < :jwtExpiration`, {
        jwtExpiration: DateTime.now()
          .plus({ hours: 23, minutes: 59, seconds: 59 })
          .minus({ seconds: this.configService.get(EmailJwtKey.Expiration) }),
      })
      .getMany();

    if (users.length > 0) {
      await this.userRepository
        .createQueryBuilder('user')
        .delete()
        .where('id IN(:...ids)', { ids: users.map((user) => user.id) })
        .execute();

      this.logger.warn({
        action: 'Not activated users deleted',
        users: users.map((user) => user.email),
      });
    }
  }

  @Cron('0 */30 9-17 * * *')
  private handleCron() {
    this.logger.debug('Called every 30 minutes between 9am and 5pm');
  }
}
