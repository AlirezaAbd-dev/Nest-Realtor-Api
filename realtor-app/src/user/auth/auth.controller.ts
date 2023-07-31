import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto, generateProductKeyDto } from '../dto/auth.dto';
import { UserType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { User } from '../decorators/user.decorator';
import { AuthorizedUserType } from '../interceptors/user.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

      const isValidProductKey = bcrypt.compare(
        validProductKey,
        body.productKey,
      );

      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }

    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post('/key')
  async generateProductKey(@Body() body: generateProductKeyDto) {
    return await this.authService.generateProductKey(body.email, body.userType);
  }

  @Get('/me')
  me(@User() user: AuthorizedUserType) {
    return user;
  }
}
