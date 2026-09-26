import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service.js';
import { MediaType, TrackingStatus } from '../generated/prisma/client.js';
import { CreateTrackingDto } from './dto/create-tracking.dto.js';
import { UpdateTrackingDto } from './dto/update-tracking.dto.js';
import { TrackingService } from './tracking.service.js';

describe('TrackingService', () => {
  let service: TrackingService;

  const prismaService = {
    trackingEntry: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<TrackingService>(TrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a tracking entry', async () => {
    const dto: CreateTrackingDto = {
      userId: 1,
      mediaId: 10,
      status: TrackingStatus.PLANNED,
      rating: 8,
    };

    const trackingEntry = {
      id: 1,
      userId: 1,
      mediaId: 10,
      status: TrackingStatus.PLANNED,
      rating: 8,
      media: {
        id: 10,
        tmdbId: 157336,
        type: MediaType.MOVIE,
      },
    };

    prismaService.trackingEntry.create.mockResolvedValue(trackingEntry);

    const result = await service.create(dto);

    expect(prismaService.trackingEntry.create).toHaveBeenCalledWith({
      data: {
        userId: 1,
        mediaId: 10,
        status: TrackingStatus.PLANNED,
        rating: 8,
      },
      include: {
        media: true,
      },
    });

    expect(result).toEqual(trackingEntry);
  });

  it('should return all tracking entries for a user', async () => {
    const trackingEntries = [
      {
        id: 1,
        userId: 1,
        mediaId: 10,
        status: TrackingStatus.WATCHING,
        rating: null,
        media: {
          id: 10,
          tmdbId: 157336,
          type: MediaType.MOVIE,
        },
      },
      {
        id: 2,
        userId: 1,
        mediaId: 20,
        status: TrackingStatus.PLANNED,
        rating: null,
        media: {
          id: 20,
          tmdbId: 212171,
          type: MediaType.TV,
        },
      },
    ];

    prismaService.trackingEntry.findMany.mockResolvedValue(
      trackingEntries,
    );

    const result = await service.findAll(1);

    expect(prismaService.trackingEntry.findMany).toHaveBeenCalledWith({
      where: {
        userId: 1,
      },
      include: {
        media: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    expect(result).toEqual(trackingEntries);
  });

  it('should find one tracking entry for a user and media', async () => {
    const trackingEntry = {
      id: 1,
      userId: 1,
      mediaId: 10,
      status: TrackingStatus.WATCHING,
      rating: 9,
      media: {
        id: 10,
        tmdbId: 157336,
        type: MediaType.MOVIE,
      },
    };

    prismaService.trackingEntry.findUnique.mockResolvedValue(
      trackingEntry,
    );

    const result = await service.findOne(1, 10);

    expect(prismaService.trackingEntry.findUnique).toHaveBeenCalledWith({
      where: {
        userId_mediaId: {
          userId: 1,
          mediaId: 10,
        },
      },
      include: {
        media: true,
      },
    });

    expect(result).toEqual(trackingEntry);
  });

  it('should update a tracking entry', async () => {
    const dto: UpdateTrackingDto = {
      status: TrackingStatus.COMPLETED,
      rating: 10,
    };

    const trackingEntry = {
      id: 1,
      userId: 1,
      mediaId: 10,
      status: TrackingStatus.COMPLETED,
      rating: 10,
      media: {
        id: 10,
        tmdbId: 157336,
        type: MediaType.MOVIE,
      },
    };

    prismaService.trackingEntry.update.mockResolvedValue(
      trackingEntry,
    );

    const result = await service.update(1, 10, dto);

    expect(prismaService.trackingEntry.update).toHaveBeenCalledWith({
      where: {
        userId_mediaId: {
          userId: 1,
          mediaId: 10,
        },
      },
      data: dto,
      include: {
        media: true,
      },
    });

    expect(result).toEqual(trackingEntry);
  });

  it('should remove a tracking entry', async () => {
    const deletedEntry = {
      id: 1,
      userId: 1,
      mediaId: 10,
      status: TrackingStatus.COMPLETED,
      rating: 10,
    };

    prismaService.trackingEntry.delete.mockResolvedValue(
      deletedEntry,
    );

    const result = await service.remove(1, 10);

    expect(prismaService.trackingEntry.delete).toHaveBeenCalledWith({
      where: {
        userId_mediaId: {
          userId: 1,
          mediaId: 10,
        },
      },
    });

    expect(result).toEqual(deletedEntry);
  });
});