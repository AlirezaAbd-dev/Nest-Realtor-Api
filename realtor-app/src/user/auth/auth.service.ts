import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const user = await this.prismaService.user.create({
      data: {
        email: body.email,
        name: body.name,
        phone: body.phone,
        password: hashedPassword,
        user_type: 'BUYER',
      },
    });

    jwt.sign({ email: user.email }, process.env.JWT_SECRET);

    return user;
  }
}
