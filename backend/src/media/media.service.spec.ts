import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { MediaService } from './media.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MediaType } from '../generated/prisma/client.js';

describe('MediaService', () => {
  let service: MediaService;

  const configService = {
    get: vi.fn().mockReturnValue('test-api-key'),
  };

  const prismaService = {
    media: {
      upsert: vi.fn(),
    },
    season: {
      upsert: vi.fn(),
    },
    episode: {
      upsert: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.restoreAllMocks();

    configService.get.mockReturnValue('test-api-key');

    prismaService.media.upsert.mockReset();
    prismaService.season.upsert.mockReset();
    prismaService.episode.upsert.mockReset();

    prismaService.media.upsert.mockResolvedValue({
      id: 1,
      tmdbId: 212171,
      type: MediaType.TV,
    });

    prismaService.season.upsert.mockResolvedValue({
      id: 10,
      mediaId: 1,
      tmdbId: 312349,
      seasonNumber: 1,
    });

    prismaService.episode.upsert.mockResolvedValue({
      id: 100,
      seasonId: 10,
      tmdbId: 400001,
      episodeNumber: 1,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
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
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 401,
      }),
    );

    await expect(service.search('interstellar')).rejects.toThrow(
      'TMDB request failed: 401',
    );
  });

  it('should return normalized movie details', async () => {
    const tmdbMovie = {
      id: 157336,
      title: 'Interstellar',
      original_title: 'Interstellar',
      overview: 'The adventures of a group of explorers in space.',
      poster_path: '/interstellar.jpg',
      backdrop_path: '/interstellar-backdrop.jpg',
      release_date: '2014-11-05',
      genres: [
        {
          id: 12,
          name: 'Adventure',
        },
        {
          id: 18,
          name: 'Drama',
        },
      ],
      original_language: 'en',
      production_countries: [
        {
          iso_3166_1: 'US',
          name: 'United States of America',
        },
      ],
      vote_average: 8.5,
      vote_count: 41200,
      tagline: 'Mankind was born on Earth. It was never meant to die here.',
      homepage: 'https://www.interstellarmovie.net/',
      runtime: 169,
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(tmdbMovie), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    const result = await service.getMovieDetails(157336);

    expect(result).toEqual({
      id: 157336,
      type: 'movie',
      title: 'Interstellar',
      originalTitle: 'Interstellar',
      overview: 'The adventures of a group of explorers in space.',
      posterPath: '/interstellar.jpg',
      backdropPath: '/interstellar-backdrop.jpg',
      releaseDate: '2014-11-05',
      genres: [
        {
          id: 12,
          name: 'Adventure',
        },
        {
          id: 18,
          name: 'Drama',
        },
      ],
      originalLanguage: 'en',
      productionCountries: [
        {
          code: 'US',
          name: 'United States of America',
        },
      ],
      rating: 8.5,
      voteCount: 41200,
      tagline: 'Mankind was born on Earth. It was never meant to die here.',
      homepage: 'https://www.interstellarmovie.net/',
      runtime: 169,
    });
  });

  it('should persist movie details in the local database', async () => {
    const tmdbMovie = {
      id: 157336,
      title: 'Interstellar',
      original_title: 'Interstellar',
      overview: 'The adventures of a group of explorers in space.',
      poster_path: '/interstellar.jpg',
      backdrop_path: '/interstellar-backdrop.jpg',
      release_date: '2014-11-05',
      genres: [],
      original_language: 'en',
      production_countries: [],
      vote_average: 8.5,
      vote_count: 41200,
      tagline: null,
      homepage: null,
      runtime: 169,
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(tmdbMovie), {
        status: 200,
      }),
    );

    await service.getMovieDetails(157336);

    expect(prismaService.media.upsert).toHaveBeenCalledWith({
      where: {
        tmdbId_type: {
          tmdbId: 157336,
          type: MediaType.MOVIE,
        },
      },
      update: {},
      create: {
        tmdbId: 157336,
        type: MediaType.MOVIE,
      },
    });
  });

  it('should return normalized TV details', async () => {
    const tmdbTv = {
      id: 212171,
      name: 'Interstellar Ella',
      original_name: 'Interstellar Ella',
      overview: 'A space TV show.',
      poster_path: '/ella.jpg',
      backdrop_path: '/ella-backdrop.jpg',
      first_air_date: '2022-10-31',
      genres: [
        {
          id: 16,
          name: 'Animation',
        },
      ],
      original_language: 'nl',
      production_countries: [
        {
          iso_3166_1: 'BE',
          name: 'Belgium',
        },
      ],
      vote_average: 5,
      vote_count: 2,
      tagline: null,
      homepage: 'https://example.com/interstellar-ella',
      last_air_date: '2023-07-24',
      status: 'Returning Series',
      number_of_seasons: 1,
      number_of_episodes: 52,
      episode_run_time: [11],
      seasons: [
        {
          id: 312349,
          name: 'Season 1',
          overview: '',
          air_date: '2022-10-31',
          episode_count: 1,
          season_number: 1,
          poster_path: '/season1.jpg',
        },
      ],
    };

    const tmdbSeason = {
      id: 312349,
      name: 'Season 1',
      overview: '',
      air_date: '2022-10-31',
      episode_count: 1,
      season_number: 1,
      poster_path: '/season1.jpg',
      episodes: [
        {
          id: 400001,
          episode_number: 1,
        },
      ],
    };

    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify(tmdbTv), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(tmdbSeason), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

    const result = await service.getTvDetails(212171);

    expect(result).toEqual({
      id: 212171,
      type: 'tv',
      title: 'Interstellar Ella',
      originalTitle: 'Interstellar Ella',
      overview: 'A space TV show.',
      posterPath: '/ella.jpg',
      backdropPath: '/ella-backdrop.jpg',
      releaseDate: '2022-10-31',
      genres: [
        {
          id: 16,
          name: 'Animation',
        },
      ],
      originalLanguage: 'nl',
      productionCountries: [
        {
          code: 'BE',
          name: 'Belgium',
        },
      ],
      rating: 5,
      voteCount: 2,
      tagline: null,
      homepage: 'https://example.com/interstellar-ella',
      firstAirDate: '2022-10-31',
      lastAirDate: '2023-07-24',
      status: 'Returning Series',
      numberOfSeasons: 1,
      numberOfEpisodes: 52,
      episodeRunTime: [11],
      seasons: [
        {
          id: 312349,
          name: 'Season 1',
          overview: '',
          airDate: '2022-10-31',
          episodeCount: 1,
          seasonNumber: 1,
          posterPath: '/season1.jpg',
        },
      ],
    });
  });

  it('should persist TV seasons and episodes in the local database', async () => {
    const tmdbTv = {
      id: 212171,
      name: 'Interstellar Ella',
      original_name: 'Interstellar Ella',
      overview: 'A space TV show.',
      poster_path: '/ella.jpg',
      backdrop_path: '/ella-backdrop.jpg',
      first_air_date: '2022-10-31',
      genres: [],
      original_language: 'nl',
      production_countries: [],
      vote_average: 5,
      vote_count: 2,
      tagline: null,
      homepage: null,
      last_air_date: '2023-07-24',
      status: 'Returning Series',
      number_of_seasons: 1,
      number_of_episodes: 1,
      episode_run_time: [11],
      seasons: [
        {
          id: 312349,
          season_number: 1,
        },
      ],
    };

    const tmdbSeason = {
      id: 312349,
      episodes: [
        {
          id: 400001,
          episode_number: 1,
        },
        {
          id: 400002,
          episode_number: 2,
        },
      ],
    };

    prismaService.media.upsert.mockResolvedValue({
      id: 1,
      tmdbId: 212171,
      type: MediaType.TV,
    });

    prismaService.season.upsert.mockResolvedValue({
      id: 10,
      mediaId: 1,
      tmdbId: 312349,
      seasonNumber: 1,
    });

    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify(tmdbTv), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(tmdbSeason), {
          status: 200,
        }),
      );

    await service.getTvDetails(212171);

    expect(prismaService.media.upsert).toHaveBeenCalledWith({
      where: {
        tmdbId_type: {
          tmdbId: 212171,
          type: MediaType.TV,
        },
      },
      update: {},
      create: {
        tmdbId: 212171,
        type: MediaType.TV,
      },
    });

    expect(prismaService.season.upsert).toHaveBeenCalledWith({
      where: {
        mediaId_seasonNumber: {
          mediaId: 1,
          seasonNumber: 1,
        },
      },
      update: {
        tmdbId: 312349,
      },
      create: {
        mediaId: 1,
        tmdbId: 312349,
        seasonNumber: 1,
      },
    });

    expect(prismaService.episode.upsert).toHaveBeenNthCalledWith(1, {
      where: {
        seasonId_episodeNumber: {
          seasonId: 10,
          episodeNumber: 1,
        },
      },
      update: {
        tmdbId: 400001,
      },
      create: {
        seasonId: 10,
        tmdbId: 400001,
        episodeNumber: 1,
      },
    });

    expect(prismaService.episode.upsert).toHaveBeenNthCalledWith(2, {
      where: {
        seasonId_episodeNumber: {
          seasonId: 10,
          episodeNumber: 2,
        },
      },
      update: {
        tmdbId: 400002,
      },
      create: {
        seasonId: 10,
        tmdbId: 400002,
        episodeNumber: 2,
      },
    });
  });

  it('should throw when getting movie details without an API key', async () => {
    configService.get.mockReturnValue(undefined);

    await expect(service.getMovieDetails(157336)).rejects.toThrow(
      'TMDB_API_KEY is not configured',
    );
  });

  it('should throw when getting TV details without an API key', async () => {
    configService.get.mockReturnValue(undefined);

    await expect(service.getTvDetails(212171)).rejects.toThrow(
      'TMDB_API_KEY is not configured',
    );
  });

  it('should throw when TMDB returns an error for movie details', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 404,
      }),
    );

    await expect(service.getMovieDetails(157336)).rejects.toThrow(
      'TMDB movie request failed: 404',
    );
  });

  it('should throw when TMDB returns an error for TV details', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 404,
      }),
    );

    await expect(service.getTvDetails(212171)).rejects.toThrow(
      'TMDB TV request failed: 404',
    );
  });
});