import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

const mockGetHomes = [
  {
    id: 1,
    address: "2345 William Str",
    city: "Toronto",
    price: 1500000,
    property_type: PropertyType.RESIDENTIAL,
    image: "img1",
    number_of_bedrooms: 3,
    number_of_bathrooms: 2.5,
    images: [{
      url: "src1"
    }]
  }
]

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

const mockImages = [{
  id: 1,
  url: "src1"
}, {
  id: 2,
  url: "src2"
}]

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeService, {
        provide: PrismaService,
        useValue: {
          home: {
            findMany: jest.fn().mockReturnValue([mockGetHomes]),
            create: jest.fn().mockReturnValue(mockHome)
          },
          image: {
            createMany: jest.fn().mockReturnValue(mockImages)
          }
        }
      }],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("getHomes", () => {
    const city = "Toronto"
    const maxPrice = "1500000"
    const minPrice = "1000000"
    const propertyType = PropertyType.RESIDENTIAL

    it("should call prisma home.findMany with correct params", async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes)

      jest.spyOn(prismaService.home, "findMany").mockImplementation(mockPrismaFindManyHomes)

      await service.getHomes(
        city, maxPrice, minPrice, propertyType
      )

      expect(mockPrismaFindManyHomes).toBeCalledWith({
        select: {
          id: true,
          address: true,
          city: true,
          price: true,
          propertyType: true,
          number_of_bathrooms: true,
          number_of_bedrooms: true,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: {
          ...(city && {
            city,
          }),
          price: {
            ...(minPrice && {
              gte: Number(minPrice),
            }),
            ...(maxPrice && {
              lte: Number(maxPrice),
            }),
          },
          ...(propertyType && { propertyType }),
        },
      })
    })

    it("should throw not found exception if not homes are found", async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([])

      jest.spyOn(prismaService.home, "findMany").mockImplementation(mockPrismaFindManyHomes)

      await expect(service.getHomes(city, maxPrice, minPrice, propertyType)).rejects.toThrowError(NotFoundException)
    })
  })

  describe("createHome", () => {
    const mockCreateHomeParams = {
      address: "111 Yellow Str",
      city: "Vancouver",
      landSize: 4444,
      numberOfBathrooms: 2,
      numberOfBedrooms: 2,
      price: 3000000,
      propertyType: PropertyType.RESIDENTIAL,
      images: [{
        url: "src1"
      }]
    }

    it("should call prisma home.create with the correct payload", async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome)

      jest.spyOn(prismaService.home, "create").mockImplementation(mockCreateHome)

      await service.createHome(mockCreateHomeParams, 2)

      expect(mockCreateHome).toBeCalledWith({
        data: {
          address: "111 Yellow Str",
          city: "Vancouver",
          land_size: 4444,
          number_of_bathrooms: 2,
          number_of_bedrooms: 2,
          price: 3000000,
          propertyType: PropertyType.RESIDENTIAL,
          realtor_id: 2,
        },
      })
    })

    it("should call prisma home.createMany with the correct payload", async () => {
      const mockCreateManyImage = jest.fn().mockReturnValue(mockImages)

      jest.spyOn(prismaService.image, "createMany").mockImplementation(mockCreateManyImage)

      await service.createHome(mockCreateHomeParams, 2)

      expect(mockCreateManyImage).toBeCalledWith({
        data: [{
          url: "src1",
          home_id: 1
        }]
      })
    })
  })
});