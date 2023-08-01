import { ClassSerializerInterceptor, Module, Provider } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

const SerializerInterceptor: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: ClassSerializerInterceptor,
}

@Module({
  imports: [PrismaModule],
  controllers: [HomeController],
  providers: [
    HomeService,
    SerializerInterceptor
  ],
})
export class HomeModule { }
