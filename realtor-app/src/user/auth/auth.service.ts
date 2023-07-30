import { Injectable } from '@nestjs/common';

interface SignupTypes {
  name: string;
  email: string;
  phone: string;
  password: string;
}

@Injectable()
export class AuthService {
  signup(body: SignupTypes) {
    console.log(body);
    return;
  }
}
