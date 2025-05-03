// js/spotify.js
export async function fetchTopArtists(token, limit = 20) {
  const res = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Spotify API error');
  const { items } = await res.json();
  return items.map(a => a.name);
}
