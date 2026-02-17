const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const ROBERT_DUVALL_ID = 3087;

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  character?: string;
  genre_ids?: number[];
}

export interface MovieCredits {
  cast: Movie[];
  crew: Array<Movie & { job: string; department: string }>;
}

export interface MovieDetail {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  tagline: string;
}

export interface PersonDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  deathday: string | null;
  place_of_birth: string;
  profile_path: string | null;
  known_for_department: string;
}

export function posterUrl(path: string | null, size = "w342"): string | undefined {
  if (!path) return undefined;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function backdropUrl(path: string | null, size = "w780"): string | undefined {
  if (!path) return undefined;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function profileUrl(path: string | null, size = "h632"): string | undefined {
  if (!path) return undefined;
  return `${IMAGE_BASE}/${size}${path}`;
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY!);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }
  return response.json();
}

export async function getPersonDetail(): Promise<PersonDetail> {
  return tmdbFetch<PersonDetail>(`/person/${ROBERT_DUVALL_ID}`);
}

export async function getMovieCredits(): Promise<MovieCredits> {
  return tmdbFetch<MovieCredits>(`/person/${ROBERT_DUVALL_ID}/movie_credits`);
}

export async function getMovieDetail(movieId: number): Promise<MovieDetail> {
  return tmdbFetch<MovieDetail>(`/movie/${movieId}`);
}

export async function getMovieCreditsForMovie(movieId: number): Promise<{
  cast: Array<{ id: number; name: string; character: string; profile_path: string | null }>;
}> {
  return tmdbFetch(`/movie/${movieId}/credits`);
}
