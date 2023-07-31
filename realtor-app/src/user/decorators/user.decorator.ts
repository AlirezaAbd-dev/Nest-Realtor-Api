import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { CustomRequest } from '../interceptors/user.interceptor';

const User = createParamDecorator((data, context: ExecutionContext) => {
  const req: CustomRequest = context.switchToHttp().getRequest();

  return req.user;
});

export { User };
