import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
export function createGameServer({ now = () => new Date() } = {}) {
  return http.createServer(async (req, res) => {
    try {
      const route = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(403).end(); return; }
      if (route === '/api/time') {
        const date = now();
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(req.method === 'HEAD' ? undefined : JSON.stringify({
          timestamp: date.getTime(), timezoneOffsetMinutes: date.getTimezoneOffset(),
        }));
        return;
      }
      const file = path.resolve(root, '.' + (route === '/' ? '/index.html' : route));
      if (!file.startsWith(root)) {
        res.writeHead(403).end(); return;
      }
      const info = await stat(file);
      if (!info.isFile()) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      if (req.method === 'HEAD') res.end(); else createReadStream(file).pipe(res);
    } catch { res.writeHead(404).end('Arquivo não encontrado.'); }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createGameServer().listen(port, '127.0.0.1', () => console.log(`Cenário disponível em http://127.0.0.1:${port}`));
}
