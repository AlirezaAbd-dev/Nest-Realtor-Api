import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler) {

    

    return handler.handle();
  }
}
