// js/spotify.js

/**
 * Perform a fetch and parse errors safely.
 */
async function safeFetch(url, token) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const text = await res.text();

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  if (!res.ok) {
    console.error(`[safeFetch] ${url} returned ${res.status}`, body);
    const message = body.error?.message 
                 || body.error_description 
                 || body.message 
                 || body;
    throw new Error(`Spotify API ${res.status}: ${message}`);
  }

  return body;
}

/**
 * Fetch the current user's top artists.
 * Returns: [{ id, name, genres, popularity, images }, ...]
 */
export async function fetchTopArtists(token, limit = 50) {
  const data = await safeFetch(
    `https://api.spotify.com/v1/me/top/artists?limit=${limit}`,
    token
  );
  return data.items.map(a => ({
    id: a.id,
    name: a.name,
    genres: a.genres,
    popularity: a.popularity,
    images: a.images
  }));
}

/**
 * Fetch the current user's top tracks.
 * Returns: [{ id, name, artists, album, popularity }, ...]
 */
export async function fetchTopTracks(token, limit = 50) {
  const data = await safeFetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${limit}`,
    token
  );
  return data.items.map(t => ({
    id: t.id,
    name: t.name,
    artists: t.artists.map(a => a.name),
    album: t.album.name,
    popularity: t.popularity
  }));
}

/**
 * Given an array of track IDs, fetch their audio features.
 * Returns: [{ id, danceability, energy, valence, tempo, acousticness, instrumentalness, speechiness, liveness }, ...]
 */
export async function fetchAudioFeatures(token, trackIds = []) {
  if (!trackIds.length) return [];
  const idsParam = trackIds.join(',');
  const data = await safeFetch(
    `https://api.spotify.com/v1/audio-features?ids=${idsParam}`,
    token
  );
  return data.audio_features.map(f => ({
    id: f.id,
    danceability: f.danceability,
    energy: f.energy,
    valence: f.valence,
    tempo: f.tempo,
    acousticness: f.acousticness,
    instrumentalness: f.instrumentalness,
    speechiness: f.speechiness,
    liveness: f.liveness
  }));
}

/**
 * Build a genre→count map from an array of artist objects.
 * E.g. { "pop": 12, "indie rock": 7, ... }
 */
export function countGenres(artists = []) {
  return artists.reduce((acc, art) => {
    art.genres.forEach(g => {
      acc[g] = (acc[g] || 0) + 1;
    });
    return acc;
  }, {});
}
