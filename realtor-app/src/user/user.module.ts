import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class UserModule {}
