import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface SignupParams {
  name: string;
  email: string;
  phone: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(body: SignupParams) {
    const emailExist = await this.prismaService.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (emailExist) throw new ConflictException('this user already exists!');

    

    return ;
  }
}
