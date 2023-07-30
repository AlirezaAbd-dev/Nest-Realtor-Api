import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto, generateProductKeyDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post('/key')
  async generateProductKey(@Body() body: generateProductKeyDto) {
    return await this.authService.generateProductKey(body.email, body.userType);
  }
}
