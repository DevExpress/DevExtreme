import { ServerResponse } from 'node:http';

export function setNoCacheHeaders(res: ServerResponse): void {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

export function setStaticCacheHeaders(res: ServerResponse, searchParams: URLSearchParams): void {
  if (searchParams.has('DX_HTTP_CACHE')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  } else {
    res.setHeader('Cache-Control', 'private, must-revalidate, max-age=0');
  }
}

export function sendHtml(res: ServerResponse, html: string): void {
  setNoCacheHeaders(res);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}

export function sendJson(res: ServerResponse, payload: unknown): void {
  setNoCacheHeaders(res);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export function sendJsonText(res: ServerResponse, payloadText: string): void {
  setNoCacheHeaders(res);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(payloadText);
}

export function sendXml(res: ServerResponse, payload: string): void {
  setNoCacheHeaders(res);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.end(payload);
}

export function sendText(res: ServerResponse, payload: string): void {
  setNoCacheHeaders(res);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(payload);
}

export function sendNotFound(res: ServerResponse): void {
  setNoCacheHeaders(res);
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Not Found');
}
