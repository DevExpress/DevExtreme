import path, { dirname } from 'path';
import fs from 'fs';
import sass from 'sass-embedded';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataUriRegex = /data-uri\((?:'(image\/svg\+xml;charset=UTF-8)',\s)?['"]?([^)'"]+)['"]?\)/g;

const svg = (buffer, svgEncoding) => {
    const encoding = svgEncoding || 'image/svg+xml;charset=UTF-8';
    const svg = encodeURIComponent(buffer.toString());

    return `"data:${encoding},${svg}"`;
};

const img = (buffer, ext) => {
    return `"data:image/${ext};base64,${buffer.toString('base64')}"`;
};

const handler = (_, svgEncoding, fileName) => {
    const relativePath = path.join(__dirname, '..', fileName);
    const filePath = path.resolve(relativePath);
    const ext = filePath.split('.').pop();
    const data = fs.readFileSync(filePath);
    const buffer = Buffer.from(data);
    const escapedString = ext === 'svg' ? svg(buffer, svgEncoding) : img(buffer, ext);
    return `url(${escapedString})`;
};

const sassFunction = (args) => {
    const hasEncoding = args.getLength() === 2;
    const encoding = hasEncoding ? args.getValue(0).getValue() : null;
    const url = hasEncoding ? args.getValue(1).getValue() : args.getValue(0).getValue();

    return new sass.SassString(handler(null, encoding, url), { quotes: false });
};

export const resolveDataUri = (content) => content.replace(dataUriRegex, handler);

export const sassFunctions = {
    'data-uri($args...)': sassFunction,
};
