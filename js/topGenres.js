import { fetchTopTracks, fetchArtistDetails } from './spotify.js';

/**
 * Fetch up to 500 top-track objects for a user (50 at a time)
 */
async function getTopTrackObjects500(user) {
  const token = localStorage.getItem(`spotify_token_${user}`);
  if (!token) throw new Error(`No token for ${user}`);
  const all = [];
  const BATCH = 50;
  for (let offset = 0; offset < 500; offset += BATCH) {
    const page = await fetchTopTracks(token, BATCH, offset);
    all.push(...page);
    if (page.length < BATCH) break;
  }
  return all;
}

/**
 * Map each top track to its combined genres
 * @returns Array of { name: string, genres: string[] }
 */
export async function getTrackGenres(user) {
  const tracks = await getTopTrackObjects500(user);
  const artistIds = Array.from(
    new Set(tracks.flatMap(t => t.artists.map(a => a.id)))
  );
  const token = localStorage.getItem(`spotify_token_${user}`);
  const artistDetails = [];
  for (let i = 0; i < artistIds.length; i += 50) {
    artistDetails.push(
      ...(await fetchArtistDetails(token, artistIds.slice(i, i + 50)))
    );
  }
  const genreMap = new Map(artistDetails.map(a => [a.id, a.genres]));

  return tracks.map(t => {
    const genres = Array.from(
      new Set(t.artists.flatMap(a => genreMap.get(a.id) || []))
    );
    return { name: t.name, genres };
  });
}

/**
 * Compute frequency of each genre in a user's top tracks
 */
export async function getGenreFrequencies(user) {
  const trackGenres = await getTrackGenres(user);
  const counts = {};
  trackGenres.forEach(({ genres }) => {
    genres.forEach(g => {
      counts[g] = (counts[g] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Merge two genre-frequency arrays
 */
export function mergeGenreFrequencies(freqs1, freqs2) {
  const map = new Map();
  freqs1.forEach(({ genre, count }) => map.set(genre, count));
  freqs2.forEach(({ genre, count }) => {
    map.set(genre, (map.get(genre) || 0) + count);
  });
  return Array.from(map.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get merged genre frequencies between two users
 */
export async function getCommonGenreFrequencies(user1, user2) {
  const [f1, f2] = await Promise.all([
    getGenreFrequencies(user1),
    getGenreFrequencies(user2)
  ]);
  return mergeGenreFrequencies(f1, f2);
}

/**
 * Aggregate sub-genres into main genres using regex matching:
 *   - "hip hop": any word ending with "hop"
 *   - "rap": any word containing "rap"
 *   - "trap": any word containing "trap"
 *   - "drill": any word containing "drill"
 *   - "r&b": exact "r&b" or "rb"
 *   - "soul": any word containing "soul"
 *   - "house": any word containing "house"
 *   - "indie": any word containing "indie"
 *   - "rock": any word containing "rock"
 *   - "pop": any word containing "pop"
 * Returns sorted array descending by count.
 */
export function aggregateMainGenres(freqs) {
  const map = new Map();
  const patterns = [
    { key: 'hip hop',  re: /\b\w*hop\b/ },
    { key: 'rap',      re: /\b\w*rap\b/ },
    { key: 'trap',     re: /\b\w*trap\b/ },
    { key: 'drill',    re: /\b\w*drill\b/ },
    { key: 'r&b',      re: /\b(r&b|rb)\b/ },
    { key: 'soul',     re: /\b\w*soul\b/ },
    { key: 'house',    re: /\b\w*house\b/ },
    { key: 'indie',    re: /\b\w*indie\b/ },
    { key: 'rock',     re: /\b\w*rock\b/ },
    { key: 'pop',      re: /\b\w*pop\b/ }
  ];

  freqs.forEach(({ genre, count }) => {
    const lower = genre.toLowerCase();
    let matched = false;
    for (const { key, re } of patterns) {
      if (re.test(lower)) {
        map.set(key, (map.get(key) || 0) + count);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // keep as-is if no pattern matched
      map.set(genre, (map.get(genre) || 0) + count);
    }
  });

  return Array.from(map.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}
