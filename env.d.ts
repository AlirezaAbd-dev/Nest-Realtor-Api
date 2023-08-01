import { z } from 'zod';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PRODUCT_KEY_SECRET: string;
      JWT_SECRET: string;
    }
  }
}

const envValidate = z.object({
  DATABASE_URL: z.string(),
  PRODUCT_KEY_SECRET: z.string(),
  JWT_SECRET: z.string(),
});

envValidate.safeParse(process.env);
