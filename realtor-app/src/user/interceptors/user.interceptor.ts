import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface User {
  id: number;
  name: string;
}

export interface CustomRequest extends Request {
  user?: User;
}

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler) {
    const req: CustomRequest = context.switchToHttp().getRequest();
    const token = (req.headers?.['authorization'] as string | undefined)?.split(
      'Bearer ',
    )[1];

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user as User;
    } catch (err) {
      throw new UnauthorizedException('you have to send the token');
    }

    return handler.handle();
  }
}
