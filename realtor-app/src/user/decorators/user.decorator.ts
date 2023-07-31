import { createParamDecorator } from '@nestjs/common';
import jwt from "jsonwebtoken"

const User = createParamDecorator(() => {
  return {
    id: 4,
    name: 'Alireza',
  };
});

export { User };
