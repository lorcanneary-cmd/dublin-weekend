const TMDB_BASE = 'https://api.themoviedb.org/3';
const TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN!;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

export type TMDBTitle = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
  provider_ids: number[];
};

type DiscoverParams = {
  type: 'movie' | 'tv';
  genres: number[];
  services: number[];
  era: 'fresh' | 'any' | 'classic';
  length: 'short' | 'medium' | 'long' | null;
  includeNonEnglish: boolean;
};

function eraParams(era: 'fresh' | 'any' | 'classic', type: 'movie' | 'tv') {
  const now = new Date();
  const year = now.getFullYear();
  const dateKey = type === 'movie' ? 'primary_release_date' : 'first_air_date';
  if (era === 'fresh') return { [`${dateKey}.gte`]: `${year - 2}-01-01` };
  if (era === 'classic') return { [`${dateKey}.lte`]: `${year - 10}-12-31` };
  return {};
}

function lengthParams(length: 'short' | 'medium' | 'long' | null, type: 'movie' | 'tv') {
  if (!length || type === 'tv') return {};
  if (length === 'short') return { 'with_runtime.lte': '90' };
  if (length === 'medium') return { 'with_runtime.gte': '90', 'with_runtime.lte': '150' };
  if (length === 'long') return { 'with_runtime.gte': '150' };
  return {};
}

export async function fetchTitles(params: DiscoverParams): Promise<TMDBTitle[]> {
  const endpoint = params.type === 'movie' ? 'discover/movie' : 'discover/tv';

  const queryObj: Record<string, string> = {
    watch_region: 'IE',
    with_watch_providers: params.services.join('|'),
    with_genres: params.genres.join(','),
    'vote_average.gte': '6.5',
    'vote_count.gte': '150',
    include_adult: 'false',
    sort_by: 'popularity.desc',
    page: '1',
  };

  if (!params.includeNonEnglish) {
    queryObj.with_original_language = 'en';
  }

  Object.assign(queryObj, eraParams(params.era, params.type));
  Object.assign(queryObj, lengthParams(params.length, params.type));

  const query = new URLSearchParams(queryObj);

  const res = await fetch(`${TMDB_BASE}/${endpoint}?${query}`, { headers });
  if (!res.ok) return [];
  const data = await res.json();

  const results = (data.results || []).filter(
    (r: any) => r.poster_path && r.vote_count >= 150
  );

  const withProviders: TMDBTitle[] = await Promise.all(
    results.slice(0, 20).map(async (r: any) => {
      const provRes = await fetch(
        `${TMDB_BASE}/${endpoint.replace('discover/', '')}/${r.id}/watch/providers`,
        { headers }
      );
      let provider_ids: number[] = [];
      if (provRes.ok) {
        const pData = await provRes.json();
        const ie = pData.results?.IE;
        const flatrate = ie?.flatrate || [];
        provider_ids = flatrate.map((p: any) => p.provider_id);
      }
      return {
        id: r.id,
        title: r.title || r.name,
        poster_path: r.poster_path,
        vote_average: r.vote_average,
        vote_count: r.vote_count,
        genre_ids: r.genre_ids,
        release_date: r.release_date,
        first_air_date: r.first_air_date,
        media_type: params.type,
        provider_ids,
      };
    })
  );

  return withProviders.filter(t => t.provider_ids.length > 0);
}

export function posterUrl(path: string) {
  return `https://image.tmdb.org/t/p/w185${path}`;
}
