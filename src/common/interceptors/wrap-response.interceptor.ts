import { ApiResp } from '@lib/fe-shared';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResp<unknown>> {
    console.log('WrapResponseInterceptor');

    return next.handle().pipe(
      map((data: unknown) => ({
        code: 200,
        data,
        success: true,
      })),
    );
  }
}
