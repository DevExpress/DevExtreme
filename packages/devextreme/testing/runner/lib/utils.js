const fs = require('fs');
const path = require('path');

function jsonString(value) {
    return JSON.stringify(value);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeXmlText(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeXmlAttr(value) {
    return escapeXmlText(value)
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function loadPorts(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function safeReadFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch(_) {
        return '';
    }
}

function parseBoolean(value) {
    return String(value).toLowerCase() === 'true';
}

function parseNumber(value) {
    const number = Number(value);
    return Number.isNaN(number) ? 0 : number;
}

function splitCommaList(value) {
    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

function safeDecodeURIComponent(value) {
    try {
        return decodeURIComponent(value);
    } catch(_) {
        return value;
    }
}

function pad2(value) {
    return String(value).padStart(2, '0');
}

function formatDateForSuiteTimestamp(date) {
    return [
        date.getFullYear(),
        pad2(date.getMonth() + 1),
        pad2(date.getDate()),
    ].join('-') + 'T' + [
        pad2(date.getHours()),
        pad2(date.getMinutes()),
        pad2(date.getSeconds()),
    ].join(':');
}

function isContinuousIntegration() {
    return Boolean(process.env.CCNetWorkingDirectory || process.env.DEVEXTREME_TEST_CI);
}

function resolveNodePath() {
    if(process.env.CCNetWorkingDirectory) {
        const customPath = path.join(process.env.CCNetWorkingDirectory, 'node', 'node.exe');
        if(fs.existsSync(customPath)) {
            return customPath;
        }
    }

    return 'node';
}

function readBodyText(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];

        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            resolve(Buffer.concat(chunks).toString('utf8'));
        });

        req.on('error', reject);
    });
}

async function readFormBody(req) {
    const body = await readBodyText(req);
    return Object.fromEntries(new URLSearchParams(body));
}

function getCacheBuster(searchParams) {
    if(searchParams.has('DX_HTTP_CACHE')) {
        const value = searchParams.get('DX_HTTP_CACHE') || '';
        return `DX_HTTP_CACHE=${encodeURIComponent(value)}`;
    }

    return '';
}

function contentWithCacheBuster(contentPath, cacheBuster) {
    if(!cacheBuster) {
        return contentPath;
    }

    return `${contentPath}${contentPath.includes('?') ? '&' : '?'}${cacheBuster}`;
}

function normalizeNumber(value) {
    const number = Number(value);
    if(Number.isNaN(number)) {
        return 0;
    }

    return number;
}

module.exports = {
    contentWithCacheBuster,
    escapeHtml,
    escapeXmlAttr,
    escapeXmlText,
    formatDateForSuiteTimestamp,
    getCacheBuster,
    isContinuousIntegration,
    jsonString,
    loadPorts,
    normalizeNumber,
    pad2,
    parseBoolean,
    parseNumber,
    readBodyText,
    readFormBody,
    resolveNodePath,
    safeDecodeURIComponent,
    safeReadFile,
    splitCommaList,
};
