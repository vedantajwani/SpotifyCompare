// Stub: fetch Spotify data after OAuth
export async function fetchUserTopTracks(token) {
    const resp = await fetch('https://api.spotify.com/v1/me/top/tracks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return resp.json();
  }
  