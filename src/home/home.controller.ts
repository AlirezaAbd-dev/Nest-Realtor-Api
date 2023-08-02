import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto, InquireDto, updateHomeDto } from './dtos/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User } from 'src/user/decorators/user.decorator';
import { type AuthorizedUserType } from 'src/user/interceptors/user.interceptor';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) { }

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minPrice') minPrice?: string,
    @Query('propertyType', new ParseEnumPipe(PropertyType, { optional: true }))
    propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    console.log({
      city,
      maxPrice,
      minPrice,
      propertyType,
    });
    return this.homeService.getHomes(city, maxPrice, minPrice, propertyType);
  }

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number): Promise<HomeResponseDto> {
    return this.homeService.getHomeById(id);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: AuthorizedUserType) {
    return this.homeService.createHome(body, user.id);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: updateHomeDto,
    @User() user: AuthorizedUserType,
  ) {
    const realtor = this.homeService.getRealtorByHomeId(id);

    if ((await realtor).id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.updateHome(id, body);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @HttpCode(204)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: AuthorizedUserType,
  ) {
    const realtor = this.homeService.getRealtorByHomeId(id);

    if ((await realtor).id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.deleteHomeById(id);
  }

  @Roles(UserType.BUYER)
  @Post('/inquire/:id')
  inquire(@Param("id", ParseIntPipe) homeId: number, @User() user: AuthorizedUserType, @Body() body: InquireDto) {
    return this.homeService.inquire(user, homeId, body.message)
  }


}
