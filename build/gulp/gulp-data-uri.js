'use strict';

const replace = require('gulp-replace');
const path = require('path');
const fs = require('fs');
const sass = require('sass');
const glob = require('glob').sync;
const dataUriRegex = /data-uri\((?:'(image\/svg\+xml;charset=UTF-8)',\s)?['"]?([^)'"]+)['"]?\)/g;
const repositoryRoot = path.join(__dirname, '..', '..');

const fullImagesFileList = glob('images/**/*.*').map(fileName => path.resolve(fileName));
const usedImagesFileList = [];

const svg = (buffer, svgEncoding) => {
    const encoding = svgEncoding || 'image/svg+xml;charset=UTF-8';
    const svg = encodeURIComponent(buffer.toString());

    return `"data:${encoding},${svg}"`;
};

const img = (buffer, ext) => {
    return `"data:image/${ext};base64,${buffer.toString('base64')}"`;
};

const handler = (_, svgEncoding, fileName) => {
    const relativePath = path.join(repositoryRoot, fileName);
    const filePath = path.resolve(relativePath);
    usedImagesFileList.push(filePath);
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

const getUnusedImages = () => {
    return fullImagesFileList.filter(fileName =>
        !usedImagesFileList.includes(fileName) &&
        !/images[/\\]icons/.test(fileName));
};

module.exports = {
    gulpPipe: () => replace(dataUriRegex, handler),
    getUnusedImages,
    resolveDataUri: (content) => content.replace(dataUriRegex, handler),
    sassFunctions: {
        'data-uri($args...)': sassFunction
    }
};
