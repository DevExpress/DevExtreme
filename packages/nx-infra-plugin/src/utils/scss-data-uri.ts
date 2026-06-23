import * as path from 'path';

/**
 * Unquoted `data:` URI payload (used inside Sass/CSS `url("...")`).
 */
export function encodeDataUriContent(
  buffer: Buffer,
  filePathOrExt: string,
  svgEncoding?: string,
): string {
  const ext = path.extname(filePathOrExt).replace('.', '').toLowerCase();

  if (ext === 'svg') {
    const encoding = svgEncoding ?? 'image/svg+xml;charset=UTF-8';
    return `data:${encoding},${encodeURIComponent(buffer.toString())}`;
  }

  return `data:image/${ext};base64,${buffer.toString('base64')}`;
}

/**
 * Quoted data URI for `url(...)` replacement when inlining in assembled SCSS sources.
 */
export function encodeDataUriForCssUrl(
  buffer: Buffer,
  filePathOrExt: string,
  svgEncoding?: string,
): string {
  return `"${encodeDataUriContent(buffer, filePathOrExt, svgEncoding)}"`;
}

export const DATA_URI_SCSS_REGEX =
  /data-uri\((?:'(image\/svg\+xml;charset=UTF-8)',\s)?['"]?([^)'"]+)['"]?\)/g;
