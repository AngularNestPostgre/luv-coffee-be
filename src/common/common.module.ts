import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { LoggingMiddleware } from './middlewares/logging.middleware';
import { JsonWebTokenService } from './services/json-web-token/json-web-token.service';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [JsonWebTokenService],
  exports: [JsonWebTokenService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
