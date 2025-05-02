// js/compare.js
import { getAuthURL } from './auth.js';
import { fetchTopArtists, fetchTopTracks, countGenres } from './spotify.js';

function logoutThenAuth(state) {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://accounts.spotify.com/en/logout';
  document.body.appendChild(iframe);
  setTimeout(() => window.location.href = getAuthURL(state), 500);
}
document.getElementById('connect-user1')
  .addEventListener('click', () => logoutThenAuth('user1'));
document.getElementById('connect-user2')
  .addEventListener('click', () => logoutThenAuth('user2'));

async function getArtists(user) {
  const key = `artists_${user}`;
  let list = JSON.parse(localStorage.getItem(key) || 'null');
  if (!list) {
    const token = localStorage.getItem(`spotify_token_${user}`);
    if (!token) throw new Error(`No token for ${user}`);
    list = await fetchTopArtists(token);
    localStorage.setItem(key, JSON.stringify(list));
  }
  return list;
}

async function getTracks(user) {
  const key = `tracks_${user}`;
  let list = JSON.parse(localStorage.getItem(key) || 'null');
  if (!list) {
    const token = localStorage.getItem(`spotify_token_${user}`);
    if (!token) throw new Error(`No token for ${user}`);
    list = await fetchTopTracks(token);
    localStorage.setItem(key, JSON.stringify(list));
  }
  return list;
}

async function doCompare() {
  const t1 = localStorage.getItem('spotify_token_user1');
  const t2 = localStorage.getItem('spotify_token_user2');
  if (!t1 || !t2) {
    alert('Please connect both users first.');
    return;
  }

  try {
    // 1) Fetch both users' data
    const [a1, a2, tr1, tr2] = await Promise.all([
      getArtists('user1'),
      getArtists('user2'),
      getTracks('user1'),
      getTracks('user2')
    ]);

    // 2) Build side‑by‑side arrays
    const topArtists = {
      user1: a1.map(a => a.name),
      user2: a2.map(a => a.name)
    };
    const topTracks = {
      user1: tr1.map(t => t.name),
      user2: tr2.map(t => t.name)
    };
    const g1 = countGenres(a1), g2 = countGenres(a2);
    const topGenres = {
      user1: Object.keys(g1),
      user2: Object.keys(g2)
    };

    // 3) Compute commons
    const commonArtists = topArtists.user1
      .filter(name => topArtists.user2.includes(name));
    const commonTracks  = topTracks.user1
      .filter(name => topTracks.user2.includes(name));
    const commonGenres  = topGenres.user1
      .filter(g => topGenres.user2.includes(g));

    // 4) Render side‑by‑side
    document.getElementById('artists-data').innerHTML =
      `<strong>User 1:</strong>\n${JSON.stringify(topArtists.user1, null, 2)}\n\n` +
      `<strong>User 2:</strong>\n${JSON.stringify(topArtists.user2, null, 2)}`;

    document.getElementById('tracks-data').innerHTML =
      `<strong>User 1:</strong>\n${JSON.stringify(topTracks.user1, null, 2)}\n\n` +
      `<strong>User 2:</strong>\n${JSON.stringify(topTracks.user2, null, 2)}`;

    document.getElementById('genres-data').innerHTML =
      `<strong>User 1:</strong>\n${JSON.stringify(topGenres.user1, null, 2)}\n\n` +
      `<strong>User 2:</strong>\n${JSON.stringify(topGenres.user2, null, 2)}`;

    // 5) Render commons
    document.getElementById('common-artists').textContent =
      JSON.stringify(commonArtists, null, 2);
    document.getElementById('common-tracks').textContent =
      JSON.stringify(commonTracks, null, 2);
    document.getElementById('common-genres').textContent =
      JSON.stringify(commonGenres, null, 2);

  } catch (err) {
    console.error('Compare error:', err);
    alert(`Error during compare: ${err.message}`);
  }
}

window.addEventListener('load', () => {
  const btn = document.getElementById('compare-button');
  if (
    localStorage.getItem('spotify_token_user1') &&
    localStorage.getItem('spotify_token_user2')
  ) btn.disabled = false;
  btn.addEventListener('click', doCompare);
});
