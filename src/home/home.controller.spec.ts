import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService } from './home.service';

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [{
        provide: HomeService,
        useValue: {
          getHomes: jest.fn().mockReturnValue([])
        }
      }, PrismaService]
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  describe('getHomes', () => {
    it("should contruct filter object correctly", async () => {
      const mockGetHomes = jest.fn().mockReturnValue([])
      jest.spyOn(homeService, "getHomes").mockImplementation(mockGetHomes)
      await controller.getHomes("Tronto", undefined, "1500000")
      expect(mockGetHomes).toBeCalledWith("Tronto", undefined, "1500000", undefined)
    })
  })
});
