export interface MediaSearchResult {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  overview: string;
  releaseDate: string | null;
}
