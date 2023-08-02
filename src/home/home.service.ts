import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';
import { AuthorizedUserType } from 'src/user/interceptors/user.interceptor';

interface CreateHomeParams {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  images: { url: string }[];
}

interface UpdateHomeParams {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: PropertyType;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) { }

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

  async createHome(body: CreateHomeParams, userId: number) {
    const home = await this.prismaService.home.create({
      data: {
        address: body.address,
        city: body.city,
        land_size: body.landSize,
        number_of_bathrooms: body.numberOfBathrooms,
        number_of_bedrooms: body.numberOfBedrooms,
        price: body.price,
        propertyType: body.propertyType,
        realtor_id: userId,
      },
    });

    await this.prismaService.image.createMany({
      data: [
        ...body.images.map((image) => ({
          url: image.url,
          home_id: home.id,
        })),
      ],
    });

    return new HomeResponseDto(home);
  }

  async updateHome(id: number, body: UpdateHomeParams) {
    const home = await this.prismaService.home.findFirst({
      where: {
        id,
      },
    });

    if (!home) throw new NotFoundException();

    const updatedHome = await this.prismaService.home.update({
      where: {
        id,
      },
      data: body,
    });

    return new HomeResponseDto(updatedHome);
  }

  async deleteHomeById(id: number) {
    await this.prismaService.home.delete({
      where: {
        id,
      },
    });

    return;
  }

  async getRealtorByHomeId(id: number) {
    const home = await this.prismaService.home.findFirst({
      where: {
        id,
      },
      select: {
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    return home.realtor;
  }

  async inquire(user: AuthorizedUserType, homeId: number, message: string) {
    const realtor = await this.getRealtorByHomeId(homeId)

    return await this.prismaService.message.create({
      data: {
        message,
        home_id: homeId,
        realtor_id: realtor.id,
        buyer_id: user.id
      }
    })
  }

  getMessagesByHome(homeId: number) {
    return this.prismaService.message.findMany({
      where: {
        home_id: homeId
      },
      select: {
        message: true,
        buyer: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })
  }
}
