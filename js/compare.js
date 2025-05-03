// js/compare.js
import { getAuthURL }            from './auth.js';
import { fetchTopTracks, fetchArtistDetails } from './spotify.js';
import { getArtistFrequencies, mergeArtistFrequencies } from './artistFrequency.js';
import {
  getCommonGenreFrequencies,
  aggregateMainGenres
} from './topGenres.js';

// ─── OAuth helpers ────────────────────────────────────────────────────────────
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

// ─── Fetch up to 500 track objects (50 at a time) ─────────────────────────────
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

// ─── Simplify track objects to { name, artists:[], genres:[] } ──────────────
async function getTop500Simple(user) {
  const token  = localStorage.getItem(`spotify_token_${user}`);
  const tracks = await getTopTrackObjects500(user);

  // collect unique artist IDs
  const artistIds = Array.from(new Set(
    tracks.flatMap(t => t.artists.map(a => a.id))
  ));

  // fetch artist genres in batches of 50
  const artistDetails = [];
  for (let i = 0; i < artistIds.length; i += 50) {
    artistDetails.push(
      ...(await fetchArtistDetails(token, artistIds.slice(i, i + 50)))
    );
  }
  const artistMap = new Map(artistDetails.map(a => [a.id, a.genres]));

  return tracks.map(t => {
    const artistNames = t.artists.map(a => a.name);
    const genres = Array.from(new Set(
      t.artists.flatMap(a => artistMap.get(a.id) || [])
    ));
    return { name: t.name, artists: artistNames, genres };
  });
}

// ─── Convert simplified data to CSV text ─────────────────────────────────────
function convertToCsv(data) {
  const rows = [['Track','Artists','Genres']];
  data.forEach(item => {
    rows.push([
      item.name.replace(/"/g,'""'),
      item.artists.join(';').replace(/"/g,'""'),
      item.genres.join(';').replace(/"/g,'""')
    ]);
  });
  return rows.map(r => r.map(f => `"${f}"`).join(',')).join('\n');
}

// ─── Main compare routine ────────────────────────────────────────────────────
async function doCompare() {
  const t1 = localStorage.getItem('spotify_token_user1');
  const t2 = localStorage.getItem('spotify_token_user2');
  if (!t1 || !t2) {
    alert('Please connect both users first.');
    return;
  }

  try {
    // 1) Fetch & simplify both users' top 500
    const [simple1, simple2] = await Promise.all([
      getTop500Simple('user1'),
      getTop500Simple('user2')
    ]);

    // 2) Convert to CSV
    const csv1 = convertToCsv(simple1);
    const csv2 = convertToCsv(simple2);

    // 3) Compute artist frequencies
    const freqs1 = getArtistFrequencies(csv1);
    const freqs2 = getArtistFrequencies(csv2);
    const mergedArtistFreqs = mergeArtistFrequencies(freqs1, freqs2);

    // 4) Compute genre frequencies
    const mergedGenreFreqs = await getCommonGenreFrequencies('user1', 'user2');
    const aggregatedGenreFreqs = aggregateMainGenres(mergedGenreFreqs);

    // 5) Store everything in localStorage & expose globally
    localStorage.setItem('user1ArtistFreqs', JSON.stringify(freqs1));
    localStorage.setItem('user2ArtistFreqs', JSON.stringify(freqs2));
    localStorage.setItem('mergedArtistFreqs',  JSON.stringify(mergedArtistFreqs));
    window.user1ArtistFreqs = freqs1;
    window.user2ArtistFreqs = freqs2;
    window.mergedArtistFreqs  = mergedArtistFreqs;

    localStorage.setItem('mergedGenreFreqs',      JSON.stringify(mergedGenreFreqs));
    localStorage.setItem('aggregatedGenreFreqs', JSON.stringify(aggregatedGenreFreqs));
    window.mergedGenreFreqs      = mergedGenreFreqs;
    window.aggregatedGenreFreqs = aggregatedGenreFreqs;

    console.table(mergedArtistFreqs);
    console.table(mergedGenreFreqs);
    console.table(aggregatedGenreFreqs);

  } catch (err) {
    console.error('Compare error:', err);
    alert(`Error: ${err.message}`);
  }
}

// ─── Enable Compare button once both tokens are present ─────────────────────
window.addEventListener('load', () => {
  const btn = document.getElementById('compare-button');
  if (
    localStorage.getItem('spotify_token_user1') &&
    localStorage.getItem('spotify_token_user2')
  ) {
    btn.disabled = false;
  }
  btn.addEventListener('click', doCompare);
});
