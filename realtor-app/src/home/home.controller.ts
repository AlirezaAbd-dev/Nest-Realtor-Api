import { Controller, Get, Post } from '@nestjs/common';

@Controller('home')
export class HomeController {
  @Get()
  getHomes() {
    return [];
  }

  @Get(':id')
  getHome() {
    return {};
  }

  @Post()
  createHome() {
    return {};
  }

  
}
