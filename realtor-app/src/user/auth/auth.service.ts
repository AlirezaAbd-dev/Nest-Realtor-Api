import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface SignupParams {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface SigninParams {
  email: string;
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

    return this.generateJWT(user.name, user.id);
  }

  async signin(body: SigninParams) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user) throw new HttpException('Invalid credentials', 400);

    const comparedPassword = await bcrypt.compare(body.password, user.password);

    if (!comparedPassword) {
      throw new HttpException('Invalid credentials', 400);
    }

    return this.generateJWT(user.name, user.id);
  }

  private async generateJWT(name: string, id: number) {
    const token = sign({ name, id }, process.env.JWT_SECRET, {
      expiresIn: 3600000,
    });
    return token;
  }
}
