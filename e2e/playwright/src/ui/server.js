/* eslint-env node */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.md': 'text/markdown',
    '.png': 'image/png',
};

const getFilePath = (reqPath) => {
    if(reqPath.startsWith('/test-results') || reqPath.startsWith('/snapshots')) {
        return path.join(publicDir, '../../../', reqPath);
    }

    return path.join(publicDir, reqPath === '/' ? 'index.html' : reqPath);
};

function handleCopyRequest(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        try {
            const { from, to } = JSON.parse(body);
            if(typeof from !== 'string' || typeof to !== 'string') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid parameters' }));
                return;
            }
            fs.copyFile(from, to, (err) => {
                if(err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            });
        } catch(e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
}

const server = http.createServer((req, res) => {
    const reqPath = req.url.split('?')[0];

    if(req.method === 'POST' && reqPath === '/copy') {
        handleCopyRequest(req, res);
        return;
    }

    const filePath = getFilePath(reqPath);
    const ext = path.extname(filePath);

    fs.readFile(filePath, (err, content) => {
        if(err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(content);
    });
});

server.listen(PORT, () => {
    process.stdout.write(`Server running at http://localhost:${PORT}/`);
});
