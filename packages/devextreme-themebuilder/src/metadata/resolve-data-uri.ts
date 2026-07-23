import * as path from 'path';
import * as fs from 'fs';

const dataUriRegex = /data-uri\((?:'(image\/svg\+xml;charset=UTF-8)',\s)?['"]?([^)'"]+)['"]?\)/g;

const svg = (buffer: Buffer, svgEncoding?: string): string => {
  const encoding = svgEncoding || 'image/svg+xml;charset=UTF-8';
  const encodedSvg = encodeURIComponent(buffer.toString());

  return `"data:${encoding},${encodedSvg}"`;
};

const img = (buffer: Buffer, ext: string): string => `"data:image/${ext};base64,${buffer.toString('base64')}"`;

const handler = (_: string, svgEncoding: string, fileName: string): string => {
  const relativePath = path.join(__dirname, '..', '..', '..', 'devextreme-scss', fileName);
  const filePath = path.resolve(relativePath);
  const ext = filePath.split('.').pop() as string;
  const data = fs.readFileSync(filePath);
  const buffer = Buffer.from(data);
  const escapedString = ext === 'svg' ? svg(buffer, svgEncoding) : img(buffer, ext);
  return `url(${escapedString})`;
};

export const resolveDataUri = (content: string): string => content.replace(dataUriRegex, handler);
