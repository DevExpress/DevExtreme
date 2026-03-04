const fs = require('fs');
const path = require('path');

function createStaticFileService({
    escapeHtml,
    rootDirectory,
    setNoCacheHeaders,
    setStaticCacheHeaders,
}) {
    function tryServeStatic(req, res, pathname, searchParams) {
        const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
        const relativePath = normalizedPath.replace(/^\/+/, '');
        const filePath = path.resolve(path.join(rootDirectory, relativePath));
        const relativeToRoot = path.relative(rootDirectory, filePath);

        if(relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
            setNoCacheHeaders(res);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Forbidden');
            return true;
        }

        if(!fs.existsSync(filePath)) {
            return false;
        }

        setStaticCacheHeaders(res, searchParams);

        const stat = fs.statSync(filePath);

        if(stat.isDirectory()) {
            return sendDirectoryListing(res, pathname, filePath);
        }

        if(stat.isFile()) {
            return sendStaticFile(res, filePath, stat.size);
        }

        return false;
    }

    function sendStaticFile(res, filePath, fileSize) {
        res.statusCode = 200;
        res.setHeader('Content-Type', getContentType(filePath));
        res.setHeader('Content-Length', String(fileSize));

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);

        stream.on('error', () => {
            if(!res.headersSent) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            }
            if(!res.writableEnded) {
                res.end('Internal Server Error');
            }
        });

        return true;
    }

    function sendDirectoryListing(res, requestPath, dirPath) {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        const pathname = requestPath.endsWith('/') ? requestPath : `${requestPath}/`;

        const items = [];

        if(pathname !== '/') {
            const parentPath = pathname
                .split('/')
                .filter(Boolean)
                .slice(0, -1)
                .join('/');
            const href = parentPath ? `/${parentPath}/` : '/';
            items.push(`<li><a href="${escapeHtml(href)}">..</a></li>`);
        }

        entries
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach((entry) => {
                const suffix = entry.isDirectory() ? '/' : '';
                const href = `${pathname}${encodeURIComponent(entry.name)}${suffix}`;
                items.push(`<li><a href="${escapeHtml(href)}">${escapeHtml(entry.name)}${suffix}</a></li>`);
            });

        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Index of ${escapeHtml(pathname)}</title>
</head>
<body>
<h1>Index of ${escapeHtml(pathname)}</h1>
<ul>
${items.join('\n')}
</ul>
</body>
</html>`;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(html);

        return true;
    }

    return {
        tryServeStatic,
    };
}

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    switch(ext) {
        case '.html':
        case '.htm':
            return 'text/html; charset=utf-8';
        case '.css':
            return 'text/css; charset=utf-8';
        case '.js':
        case '.mjs':
            return 'application/javascript; charset=utf-8';
        case '.json':
            return 'application/json; charset=utf-8';
        case '.xml':
        case '.xsl':
            return 'text/xml; charset=utf-8';
        case '.txt':
        case '.md':
        case '.log':
            return 'text/plain; charset=utf-8';
        case '.svg':
            return 'image/svg+xml';
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.gif':
            return 'image/gif';
        case '.ico':
            return 'image/x-icon';
        case '.woff':
            return 'font/woff';
        case '.woff2':
            return 'font/woff2';
        case '.ttf':
            return 'font/ttf';
        case '.eot':
            return 'application/vnd.ms-fontobject';
        case '.map':
            return 'application/json; charset=utf-8';
        case '.wasm':
            return 'application/wasm';
        default:
            return 'application/octet-stream';
    }
}

module.exports = {
    createStaticFileService,
};
