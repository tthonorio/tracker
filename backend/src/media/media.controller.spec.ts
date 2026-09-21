import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from './media.controller.js';
import { MediaService } from './media.service.js';

describe('MediaController', () => {
  let controller: MediaController;

  const mediaService = {
    search: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        {
          provide: MediaService,
          useValue: mediaService,
        },
      ],
    }).compile();

    controller = module.get<MediaController>(MediaController);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should pass the search query to MediaService', async () => {
    mediaService.search.mockResolvedValue([]);

    await controller.search({ q: 'interstellar' });

    expect(mediaService.search).toHaveBeenCalledWith('interstellar');
  });
});