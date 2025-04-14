// index.js
import express from 'express';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// In-memory storage
const users = {};

// 1) OAuth login redirect
app.get('/login', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.REDIRECT_URI,
    scope: 'user-read-recently-played'
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

// 2) OAuth callback
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URI
    })
  });
  const { access_token, refresh_token } = await tokenRes.json();

  const profile = await fetch('https://api.spotify.com/v1/me', {
    headers: { 'Authorization': `Bearer ${access_token}` }
  }).then(r => r.json());

  users[profile.id] = users[profile.id] || { plays: [] };
  users[profile.id].refreshToken = refresh_token;

  const ourToken = jwt.sign({ spotifyId: profile.id }, process.env.JWT_SECRET);
  res.send(`Logged in! Your token: ${ourToken}`);
});

// Helper to refresh access token
async function getAccessToken(spotifyId) {
  const refresh_token = users[spotifyId].refreshToken;
  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token
    })
  });
  const { access_token } = await resp.json();
  return access_token;
}

// 3) Poll endpoint (run manually or via cron)
app.post('/poll', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('No token');
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); }
  catch { return res.status(401).send('Bad token'); }

  const access = await getAccessToken(payload.spotifyId);
  const data = await fetch(
    'https://api.spotify.com/v1/me/player/recently-played?limit=10',
    { headers: { 'Authorization': `Bearer ${access}` } }
  ).then(r => r.json());

  users[payload.spotifyId].plays = data.items.map(i => ({
    name: i.track.name,
    at: i.played_at
  }));

  res.send('Polled!');
});

// 4) Top-tracks endpoint
app.get('/top-tracks', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('No token');
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); }
  catch { return res.status(401).send('Bad token'); }

  const plays = users[payload.spotifyId]?.plays || [];
  const counts = {};
  plays.forEach(p => counts[p.name] = (counts[p.name] || 0) + 1);

  const top = Object.entries(counts)
    .sort((a,b) => b[1] - a[1])
    .slice(0,5)
    .map(([name, count]) => ({ name, count }));

  res.json(top);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
