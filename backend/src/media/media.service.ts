import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MediaSearchResult } from './media-search-result.interface.js';
import {
  MediaDetails,
  MovieDetails,
  TvDetails,
} from './media-details.interface.js';

@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) {}

  async search(query: string): Promise<MediaSearchResult[]> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');

    if (!apiKey) {
      throw new Error('TMDB_API_KEY is not configured');
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      query,
      include_adult: 'false',
      language: 'en-US',
      page: '1',
    });

    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`TMDB request failed: ${response.status}`);
    }

    const data = await response.json();

    return data.results
      .filter(
        (item: { media_type: string }) =>
          item.media_type === 'movie' || item.media_type === 'tv',
      )
      .map(
        (item: {
          id: number;
          media_type: 'movie' | 'tv';
          title?: string;
          name?: string;
          poster_path: string | null;
          overview: string;
          release_date?: string;
          first_air_date?: string;
        }): MediaSearchResult => ({
          id: item.id,
          type: item.media_type,
          title: item.title ?? item.name ?? '',
          posterPath: item.poster_path,
          overview: item.overview,
          releaseDate: item.release_date ?? item.first_air_date ?? null,
        }),
      );
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');

    if (!apiKey) {
      throw new Error('TMDB_API_KEY is not configured');
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`,
    );

    if (!response.ok) {
      throw new Error(`TMDB movie request failed: ${response.status}`);
    }

    const movie = await response.json();

    return {
      id: movie.id,
      type: 'movie',
      title: movie.title,
      originalTitle: movie.original_title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      releaseDate: movie.release_date || null,
      genres: movie.genres ?? [],
      originalLanguage: movie.original_language,
      productionCountries: (movie.production_countries ?? []).map(
        (country: {
          iso_3166_1: string;
          name: string;
        }) => ({
          code: country.iso_3166_1,
          name: country.name,
        }),
      ),
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      tagline: movie.tagline || null,
      homepage: movie.homepage || null,
      runtime: movie.runtime ?? null,
    };
  }

  async getTvDetails(id: number): Promise<TvDetails> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');

    if (!apiKey) {
      throw new Error('TMDB_API_KEY is not configured');
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`,
    );

    if (!response.ok) {
      throw new Error(`TMDB TV request failed: ${response.status}`);
    }

    const tv = await response.json();

    return {
      id: tv.id,
      type: 'tv',
      title: tv.name,
      originalTitle: tv.original_name,
      overview: tv.overview,
      posterPath: tv.poster_path,
      backdropPath: tv.backdrop_path,
      releaseDate: tv.first_air_date || null,
      genres: tv.genres ?? [],
      originalLanguage: tv.original_language,
      productionCountries: (tv.production_countries ?? []).map(
        (country: {
          iso_3166_1: string;
          name: string;
        }) => ({
          code: country.iso_3166_1,
          name: country.name,
        }),
      ),
      rating: tv.vote_average,
      voteCount: tv.vote_count,
      tagline: tv.tagline || null,
      homepage: tv.homepage || null,
      firstAirDate: tv.first_air_date || null,
      lastAirDate: tv.last_air_date || null,
      status: tv.status,
      numberOfSeasons: tv.number_of_seasons,
      numberOfEpisodes: tv.number_of_episodes,
      episodeRunTime: tv.episode_run_time ?? [],
      seasons: (tv.seasons ?? []).map(
        (season: {
          id: number;
          name: string;
          overview: string;
          air_date: string | null;
          episode_count: number;
          season_number: number;
          poster_path: string | null;
        }) => ({
          id: season.id,
          name: season.name,
          overview: season.overview,
          airDate: season.air_date || null,
          episodeCount: season.episode_count,
          seasonNumber: season.season_number,
          posterPath: season.poster_path,
        }),
      ),
    };
  }
}
