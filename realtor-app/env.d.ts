import { z } from 'zod';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }
}

const envValidate = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

envValidate.safeParse(process.env);
