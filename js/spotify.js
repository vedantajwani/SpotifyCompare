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
  try { body = JSON.parse(text); }
  catch { body = text; }

  if (!res.ok) {
    const msg = body.error?.message || body.error_description || body.message || body;
    throw new Error(`Spotify API ${res.status}: ${msg}`);
  }
  return body;
}

/**
 * Fetch the current user's top tracks (with artist IDs).
 * @param token  OAuth token
 * @param limit  Number of items (max 50)
 * @param offset Offset into the result (0,50,100,…)
 * @returns [{ id, name, artists:[{id,name}], album, popularity }]
 */
export async function fetchTopTracks(token, limit = 50, offset = 0) {
  const data = await safeFetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&offset=${offset}`,
    token
  );
  return data.items.map(t => ({
    id: t.id,
    name: t.name,
    artists: t.artists.map(a => ({ id: a.id, name: a.name })),
    album: t.album.name,
    popularity: t.popularity
  }));
}

/**
 * Fetch details (including genres) for up to 50 artists at a time.
 * @param token     OAuth token
 * @param artistIds Array of artist IDs (max 50)
 * @returns [{ id, name, genres: [] }]
 */
export async function fetchArtistDetails(token, artistIds = []) {
  if (!artistIds.length) return [];
  const chunk = artistIds.slice(0, 50).join(',');
  const data = await safeFetch(
    `https://api.spotify.com/v1/artists?ids=${chunk}`,
    token
  );
  return data.artists.map(a => ({
    id: a.id,
    name: a.name,
    genres: a.genres
  }));
}
