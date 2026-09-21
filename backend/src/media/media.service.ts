import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaSearchResult } from './media-search-result.interface.js';

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
}