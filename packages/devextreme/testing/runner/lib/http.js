function setNoCacheHeaders(res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
}

function setStaticCacheHeaders(res, searchParams) {
    if(searchParams.has('DX_HTTP_CACHE')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else {
        res.setHeader('Cache-Control', 'private, must-revalidate, max-age=0');
    }
}

function sendHtml(res, html) {
    setNoCacheHeaders(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
}

function sendJson(res, payload) {
    setNoCacheHeaders(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(payload));
}

function sendJsonText(res, payloadText) {
    setNoCacheHeaders(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(payloadText);
}

function sendXml(res, payload) {
    setNoCacheHeaders(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.end(payload);
}

function sendText(res, payload) {
    setNoCacheHeaders(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(payload);
}

function sendNotFound(res) {
    setNoCacheHeaders(res);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not Found');
}

module.exports = {
    sendHtml,
    sendJson,
    sendJsonText,
    sendNotFound,
    sendText,
    sendXml,
    setNoCacheHeaders,
    setStaticCacheHeaders,
};
