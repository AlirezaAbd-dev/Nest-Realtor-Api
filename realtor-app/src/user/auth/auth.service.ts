import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface SignupTypes {
  name: string;
  email: string;
  phone: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(body: SignupTypes) {
    console.log(body);
    console.log(await this.prismaService.user.findMany());
    return;
  }
}
