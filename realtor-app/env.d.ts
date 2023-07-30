import { z } from 'zod';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
    }
  }
}

const envValidate = z.object({
  JWT_SECRET: z.string(),
});

envValidate.safeParse(process.env);
