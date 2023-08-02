import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';

const mockGetHomes = [
  {
    id: 1,
    address: "2345 William Str",
    city: "Toronto",
    price: 1500000,
    propertyType: PropertyType.RESIDENTIAL,
    image: "img1",
    numberOfBedrooms: 3,
    numberOfBathrooms: 2.5,
    images: [{
      url: "src1"
    }]
  }
]

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeService, {
        provide: PrismaService,
        useValue: {
          home: {
            findMany: jest.fn().mockReturnValue([mockGetHomes])
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
  })
});