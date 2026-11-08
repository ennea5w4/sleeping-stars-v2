const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const scripts = new Set(['/js/app.js', '/js/data.js', '/js/sky-decor.js']);
const pages = new Map([
  ['/', 'index.html'], ['/index.html', 'index.html'],
  ['/en/', 'en/index.html'], ['/en/index.html', 'en/index.html'],
  ['/ko/', 'ko/index.html'], ['/ko/index.html', 'ko/index.html']
]);

async function startServer() {
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
      // Serve only actual application resources; never expose tests, Git or dependencies.
      const allowed = pages.has(pathname) || scripts.has(pathname)
        || /^\/img\/(?:duo\/)?[A-Za-z0-9_-]+\.png$/.test(pathname);
      if (!allowed || !['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(404).end();
        return;
      }
      const filename = pages.get(pathname) || pathname.slice(1);
      const content = await fs.readFile(path.join(root, filename));
      const contentType = filename.endsWith('.html') ? 'text/html; charset=utf-8'
        : filename.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'image/png';
      response.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
      server.closeIdleConnections();
    })
  };
}
module.exports = { startServer };
