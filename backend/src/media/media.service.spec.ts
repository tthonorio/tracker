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
    configService.get.mockReturnValue('test-api-key');
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
          episode_count: 52,
          season_number: 1,
          poster_path: '/season1.jpg',
        },
      ],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(tmdbTv), {
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
          episodeCount: 52,
          seasonNumber: 1,
          posterPath: '/season1.jpg',
        },
      ],
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
