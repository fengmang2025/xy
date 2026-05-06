const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8765;
const mime = { html: 'text/html', css: 'text/css', js: 'application/javascript' };

http.createServer((req, res) => {
  let file = req.url === '/' ? 'index.html' : req.url.slice(1);
  let fp = path.join(__dirname, file);
  if (fs.existsSync(fp)) {
    let ext = path.extname(fp).slice(1);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
    fs.createReadStream(fp).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(port, () => console.log('Server running at http://localhost:' + port));
