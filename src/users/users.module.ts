import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '@common/common.module';
import { EmailModule } from '@email/email.module';

import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEmailService } from './services/user-email/user-email.service';
import { UserCronService } from './services/user-cron/user-cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CommonModule,
    ConfigModule,
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserEmailService, UserCronService],
  exports: [UsersService, UserEmailService],
})
export class UsersModule {}
