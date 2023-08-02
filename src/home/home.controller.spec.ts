import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService } from './home.service';
import { PropertyType } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = {
  id: 8,
  name: "Alireza",
  email: "alireza@gmail.com",
  phone: "555 555 5555"
}

const mockHome = {
  id: 1,
  address: "2345 William Str",
  city: "Toronto",
  price: 1500000,
  property_type: PropertyType.RESIDENTIAL,
  image: "img1",
  number_of_bedrooms: 3,
  number_of_bathrooms: 2.5,
}

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [{
        provide: HomeService,
        useValue: {
          getHomes: jest.fn().mockReturnValue([]),
          getRealtorByHomeId: jest.fn().mockReturnValue(mockUser),
          updateHomeById: jest.fn().mockReturnValue(mockHome)
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

  describe('updateHome', () => {
    const mockCreateHomeParams = {
      address: "111 Yellow Str",
      city: "Vancouver",
      landSize: 4444,
      numberOfBathrooms: 2,
      numberOfBedrooms: 2,
      price: 3000000,
      propertyType: PropertyType.RESIDENTIAL
    }

    const mockUserInfo = {
      name: "Alireza",
      id: 39,
      iat: 1,
      exp: 2
    }

    it("should throw unauth error if realtor didn't create home", async () => {
      const run = async () => {
        await controller.updateHome(2, mockCreateHomeParams, mockUserInfo)
      }

      await expect(run).rejects.toThrowError(UnauthorizedException)
    })
  })
});
