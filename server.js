// server.js
require('dotenv').config();
const http  = require('http');
const url   = require('url');
const qs    = require('querystring');
const axios = require('axios');

const CLIENT_ID     = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI  = 'http://127.0.0.1:3000/callback.html';
const PORT          = 3001;

http.createServer(async (req, res) => {
  const p = url.parse(req.url, true);
  if (req.method === 'OPTIONS' && p.pathname === '/exchange_token') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }
  if (req.method === 'POST' && p.pathname === '/exchange_token') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { code } = JSON.parse(body);
        const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        const tokenRes = await axios.post(
          'https://accounts.spotify.com/api/token',
          qs.stringify({
            grant_type:   'authorization_code',
            code,
            redirect_uri: REDIRECT_URI
          }),
          {
            headers: {
              Authorization: `Basic ${creds}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(tokenRes.data));
      } catch (err) {
        const e = err.response?.data || { error: err.message };
        res.writeHead(400, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(e));
      }
    });
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    });
    res.end('Not found');
  }
}).listen(PORT, () => {
  console.log(`Token‑exchange server listening on http://127.0.0.1:${PORT}`);
});
