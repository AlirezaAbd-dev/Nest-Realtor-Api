import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(
    city?: string,
    maxPrice?: string,
    minPrice?: string,
    propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
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
    });

    if (homes.length === 0) {
      throw new NotFoundException('there is no home!');
    }

    return homes.map(
      (home) => new HomeResponseDto({ ...home, image: home.images[0].url }),
    );
  }

  async getHomeById(id: number) {
    const home = await this.prismaService.home.findFirst({
      where: { id },
      include: {
        images: {
          select: {
            url: true,
          },
        },
        messages: {
          select: {
            buyer_id: true,
            realtor_id: true,
            message: true,
          },
        },
        realtor: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    return new HomeResponseDto(home);
  }
}
