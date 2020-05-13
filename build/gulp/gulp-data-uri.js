'use strict';

const replace = require('gulp-replace');
const path = require('path');
const fs = require('fs');
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
    const relativePath = path.join(__dirname, '..', '..', fileName);
    const filePath = path.resolve(relativePath);
    const ext = filePath.split('.').pop();
    const data = fs.readFileSync(filePath);
    const buffer = Buffer.from(data);
    const escapedString = ext === 'svg' ? svg(buffer, svgEncoding) : img(buffer, ext);
    return `url(${escapedString})`;
};

module.exports = {
    gulpPipe: () => replace(dataUriRegex, handler),
    resolveDataUri: (content) => content.replace(dataUriRegex, handler)
};
