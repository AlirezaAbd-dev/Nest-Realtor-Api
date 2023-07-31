import { createParamDecorator } from '@nestjs/common';

const User = createParamDecorator(() => {
  return {
    id: 4,
    name: 'Alireza',
  };
});

export { User };
