import { HTTP_RES_MSG, Http_Response, HTTP_STATUS_CODE } from '@chen/shared';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        // 如果响应头包含 Content-Disposition（文件下载），直接返回原始数据
        if (response.getHeader('Content-Disposition')) {
          return data;
        }
        return {
          code: HTTP_STATUS_CODE.SUCCESS,
          data: data ?? null,
          msg: HTTP_RES_MSG.SUCCESS,
          time: Date.now(),
        } as Http_Response<T>;
      }),
    );
  }
}
