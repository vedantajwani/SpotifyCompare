// js/auth.js
export const CLIENT_ID    = 'a573d0ab2d054084a255df8c127f086a';
export const REDIRECT_URI = 'http://127.0.0.1:3000/callback.html';
export const SCOPES       = ['user-top-read'];

export function getAuthURL(state) {
  const url = new URL('https://accounts.spotify.com/authorize');
  url.searchParams.set('client_id',     CLIENT_ID);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri',  REDIRECT_URI);
  url.searchParams.set('scope',         SCOPES.join(' '));
  url.searchParams.set('state',         state);
  return url.toString();
}
