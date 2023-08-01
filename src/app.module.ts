import { Module, Provider } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor as UserInterceptorClass } from './user/interceptors/user.interceptor';
import { AuthGuard as AuthGuardClass } from './guards/auth.guard';

const UserInterceptor: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: UserInterceptorClass,
}

const AuthGuard: Provider = {
  provide: APP_GUARD,
  useClass: AuthGuardClass,
}

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AppController],
  providers: [
    AppService,
    UserInterceptor,
    AuthGuard
  ],
})
export class AppModule { }
