import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService } from './home.service';

describe('HomeController', () => {
  let controller: HomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [HomeService, PrismaService]
    }).compile();

    controller = module.get<HomeController>(HomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
