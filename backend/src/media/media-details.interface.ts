export interface MediaGenre {
  id: number;
  name: string;
}

export interface MediaCountry {
  code: string;
  name: string;
}

export interface MediaSeason {
  id: number;
  name: string;
  overview: string;
  airDate: string | null;
  episodeCount: number;
  seasonNumber: number;
  posterPath: string | null;
}

export interface MediaDetails {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  genres: MediaGenre[];
  originalLanguage: string;
  productionCountries: MediaCountry[];
  rating: number;
  voteCount: number;
  tagline: string | null;
  homepage: string | null;
}

export interface MovieDetails extends MediaDetails {
  type: 'movie';
  runtime: number | null;
}

export interface TvDetails extends MediaDetails {
  type: 'tv';
  firstAirDate: string | null;
  lastAirDate: string | null;
  status: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  episodeRunTime: number[];
  seasons: MediaSeason[];
}
