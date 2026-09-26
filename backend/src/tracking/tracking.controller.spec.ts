import { Test, TestingModule } from '@nestjs/testing';

import { TrackingController } from './tracking.controller.js';
import { TrackingService } from './tracking.service.js';

describe('TrackingController', () => {
  let controller: TrackingController;

  const trackingService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackingController],
      providers: [
        {
          provide: TrackingService,
          useValue: trackingService,
        },
      ],
    }).compile();

    controller = module.get<TrackingController>(TrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});