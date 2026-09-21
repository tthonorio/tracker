import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MediaService } from './media.service.js';

describe('MediaService', () => {
  let service: MediaService;

  const configService = {
    get: vi.fn().mockReturnValue('test-api-key'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);

    vi.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return mapped movie and TV results', async () => {
    const tmdbResponse = {
      results: [
        {
          id: 157336,
          media_type: 'movie',
          title: 'Interstellar',
          poster_path: '/interstellar.jpg',
          overview: 'A space movie.',
          release_date: '2014-11-05',
        },
        {
          id: 212171,
          media_type: 'tv',
          name: 'Interstellar Ella',
          poster_path: '/ella.jpg',
          overview: 'A space TV show.',
          first_air_date: '2022-10-31',
        },
      ],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(tmdbResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    const results = await service.search('interstellar');

    expect(results).toEqual([
      {
        id: 157336,
        type: 'movie',
        title: 'Interstellar',
        posterPath: '/interstellar.jpg',
        overview: 'A space movie.',
        releaseDate: '2014-11-05',
      },
      {
        id: 212171,
        type: 'tv',
        title: 'Interstellar Ella',
        posterPath: '/ella.jpg',
        overview: 'A space TV show.',
        releaseDate: '2022-10-31',
      },
    ]);
  });

  it('should ignore people returned by TMDB', async () => {
    const tmdbResponse = {
      results: [
        {
          id: 1,
          media_type: 'person',
          name: 'Christopher Nolan',
        },
        {
          id: 157336,
          media_type: 'movie',
          title: 'Interstellar',
          poster_path: '/interstellar.jpg',
          overview: 'A space movie.',
          release_date: '2014-11-05',
        },
      ],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(tmdbResponse), {
        status: 200,
      }),
    );

    const results = await service.search('interstellar');

    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('movie');
    expect(results[0].title).toBe('Interstellar');
  });

  it('should throw when the TMDB API key is missing', async () => {
    configService.get.mockReturnValue(undefined);

    await expect(service.search('interstellar')).rejects.toThrow(
      'TMDB_API_KEY is not configured',
    );
  });

  it('should throw when TMDB returns an error', async () => {
    configService.get.mockReturnValue('test-api-key');

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 401,
      }),
    );

    await expect(service.search('interstellar')).rejects.toThrow(
      'TMDB request failed: 401',
    );
  });
});
