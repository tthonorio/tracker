import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTrackingDto } from './dto/create-tracking.dto.js';
import { UpdateTrackingDto } from './dto/update-tracking.dto.js';

@Injectable()
export class TrackingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackingDto: CreateTrackingDto) {
    const { userId, mediaId, status, rating } = createTrackingDto;

    return this.prisma.trackingEntry.create({
      data: {
        userId,
        mediaId,
        status,
        rating,
      },
      include: {
        media: true,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.trackingEntry.findMany({
      where: {
        userId,
      },
      include: {
        media: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(userId: number, mediaId: number) {
    return this.prisma.trackingEntry.findUnique({
      where: {
        userId_mediaId: {
          userId,
          mediaId,
        },
      },
      include: {
        media: true,
      },
    });
  }

  async update(
    userId: number,
    mediaId: number,
    updateTrackingDto: UpdateTrackingDto,
  ) {
    return this.prisma.trackingEntry.update({
      where: {
        userId_mediaId: {
          userId,
          mediaId,
        },
      },
      data: updateTrackingDto,
      include: {
        media: true,
      },
    });
  }

  async remove(userId: number, mediaId: number) {
    return this.prisma.trackingEntry.delete({
      where: {
        userId_mediaId: {
          userId,
          mediaId,
        },
      },
    });
  }
}