import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from '@hapi/joi';

import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { CoffeesModule } from './modules/coffees/coffees.module';
import { CoffeeRatingModule } from './modules/coffee-rating/coffee-rating.module';
import { EventsModule } from './modules/events/events.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Env } from '@common/enums/env.enum';

const ENV: Env = process.env.NODE_ENV as Env;

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        autoLoadEntities: true,
        /*
          Ensures that typeorm entoties will be synced with the DB every time we run the app.
          Automatically generate SQL table from all classes with the entity decorator and metadata they contain.
          For development only!
        **/
        synchronize: false,
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env/.env.local' : `.env/.env.${ENV}`,
      validationSchema: Joi.object({
        SERVER_PORT: Joi.number().default(8080),
        DB_NAME: Joi.required(),
        DB_USER: Joi.required(),
        DB_HOST: Joi.required(),
        DB_PORT: Joi.number().default(5432),
        DB_PASSWORD: Joi.required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
      }),
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    AuthModule,
    UsersModule,
    EmailModule,
    CoffeesModule,
    EventsModule,
    CoffeeRatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
