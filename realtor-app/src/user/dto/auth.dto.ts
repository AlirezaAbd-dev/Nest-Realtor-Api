import { UserType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsEnum,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(
    /(0|\+98)?([ ]|-|[()]){0,2}9[0|1|2|3|9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/,
    { message: 'phone must be a valid phone number!' },
  )
  phone: string;

  @IsEmail({}, { message: 'email must be a valid email!' })
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class SigninDto {
  @IsEmail({}, { message: 'email must be a valid email!' })
  email: string;

  @IsString()
  password: string;
}

export class generateProductKeyDto {
  @IsEmail({}, { message: 'email must be a valid email!' })
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
