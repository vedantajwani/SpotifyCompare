// js/compare.js
import { getAuthURL }    from './auth.js';
import { fetchTopArtists } from './spotify.js';
import { compareLists }    from './compareArtists.js';
import { drawVenn }        from './venn.js';

document.getElementById('connect-user1')
  .addEventListener('click', () => {
    const url = getAuthURL('user1');
    window.location.href = url;
  });

document.getElementById('connect-user2')
  .addEventListener('click', () => {
    const url = getAuthURL('user2');
    window.location.href = url;
  });

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

window.addEventListener('load', async () => {
  const t1 = localStorage.getItem('spotify_token_user1');
  const t2 = localStorage.getItem('spotify_token_user2');
  if (t1 && t2) {
    try {
      const [a1, a2] = await Promise.all([
        getArtists('user1'),
        getArtists('user2')
      ]);
      const { onlyA, onlyB, both } = compareLists(a1, a2);
      drawVenn(onlyA, onlyB, both);
    } catch (e) {
      console.error('Compare error:', e);
    }
  }
});
