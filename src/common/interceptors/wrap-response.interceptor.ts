import { ApiResp } from '@lib/fe-shared';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResp<unknown>> {
    console.log('WrapResponseInterceptor 15');

    return next.handle().pipe(
      tap((data) => {
        console.log('data: ', data);
      }),
      map((data: unknown) => ({
        code: 200,
        data,
        success: true,
      })),
    );
  }
}
