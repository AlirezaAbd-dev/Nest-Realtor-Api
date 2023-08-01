import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface AuthorizedUserType {
  id: number;
  name: string;
  iat: number;
  exp: number;
}

export interface CustomRequest extends Request {
  user?: AuthorizedUserType;
}

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler) {
    const req: CustomRequest = context.switchToHttp().getRequest();
    const token = (req.headers?.['authorization'] as string | undefined)?.split(
      'Bearer ',
    )[1];

    try {
      if (token) {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user as AuthorizedUserType;
      }
    } catch (err) {
      throw new UnauthorizedException('you have to send the token');
    }

    return handler.handle();
  }
}
