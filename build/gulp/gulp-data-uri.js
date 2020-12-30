'use strict';

const replace = require('gulp-replace');
const path = require('path');
const fs = require('fs');
const sass = require('sass');
const dataUriRegex = /data-uri\((?:'(image\/svg\+xml;charset=UTF-8)',\s)?['"]?([^)'"]+)['"]?\)/g;
const repositoryRoot = path.join(__dirname, '..', '..');

const getFilePath = (fileName) => {
    const relativePath = path.join(repositoryRoot, fileName);
    return path.resolve(relativePath);
};

const svg = (buffer, svgEncoding) => {
    const encoding = svgEncoding || 'image/svg+xml;charset=UTF-8';
    const svg = encodeURIComponent(buffer.toString());

    return `"data:${encoding},${svg}"`;
};

const img = (buffer, ext) => {
    return `"data:image/${ext};base64,${buffer.toString('base64')}"`;
};

const handler = (_, svgEncoding, fileName) => {
    const filePath = getFilePath(fileName);
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

    return new sass.types.String(handler(null, encoding, url));
};

const getImagesFromContent = (content) => {
    const result = [];
    let match;

    while((match = dataUriRegex.exec(content)) !== null) {
        const imagePath = getFilePath(match[2]);
        result.push(imagePath);
    }

    return result;
};

module.exports = {
    gulpPipe: () => replace(dataUriRegex, handler),
    getImagesFromContent,
    resolveDataUri: (content) => content.replace(dataUriRegex, handler),
    sassFunctions: {
        'data-uri($args...)': sassFunction
    }
};
