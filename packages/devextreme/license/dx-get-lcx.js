const fs = require('fs');
const os = require('os');
const path = require('path');

const LICENSE_ENV = 'DevExpress_License';
const LICENSE_PATH_ENV = 'DevExpress_LicensePath';
const LICENSE_FILE = 'DevExpress_License.txt';

function isNonEmptyString(v) {
    return typeof v === 'string' && v.trim().length > 0;
}

function hasEnvVar(name) {
    return Object.prototype.hasOwnProperty.call(process.env, name);
}

function readTextFileIfExists(filePath) {
    try {
        if(!filePath) return null;
        if(!fs.existsSync(filePath)) return null;
        const stat = fs.statSync(filePath);
        if(!stat.isFile()) return null;
        const raw = fs.readFileSync(filePath, 'utf8');
        return isNonEmptyString(raw) ? raw : null;
    } catch {
        return null;
    }
}

function normalizeKey(raw) {
    if(!isNonEmptyString(raw)) return null;
    const lines = raw
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

    if(lines.length === 0) return null;
    const lcxLike = lines.find((l) => l.startsWith('LCX'));
    return (lcxLike || lines[0]).trim();
}

function getDefaultLicenseFilePath() {
    const home = os.homedir();

    if(process.platform === 'win32') {
        const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
        return path.join(appData, 'DevExpress', LICENSE_FILE);
    }

    if(process.platform === 'darwin') {
        return path.join(
            home,
            'Library',
            'Application Support',
            'DevExpress',
            LICENSE_FILE
        );
    }

    return path.join(home, '.config', 'DevExpress', LICENSE_FILE);
}

function resolveFromLicensePathEnv(licensePathValue) {
    if(!isNonEmptyString(licensePathValue)) return null;

    const p = licensePathValue.trim();

    try {
        if(fs.existsSync(p)) {
            const stat = fs.statSync(p);
            if(stat.isFile()) return p;
            if(stat.isDirectory()) return path.join(p, LICENSE_FILE);
        }
    } catch {}

    if(p.toLowerCase().endsWith('.txt')) return p;
    return path.join(p, LICENSE_FILE);
}

function readDevExtremeVersion() {
    try {
        const pkgPath = require('path').join(__dirname, '..', 'package.json');
        const pkg = JSON.parse(require('fs').readFileSync(pkgPath, 'utf8'));
        const parts = String(pkg.version || '').split('.');
        const major = parseInt(parts[0], 10);
        const minor = parseInt(parts[1], 10);
        if(!isNaN(major) && !isNaN(minor)) {
            return { major, minor, code: major * 10 + minor };
        }
    } catch{}
    return null;
}

function buildVersionString(devExtremeVersion){
    const { major, minor, code: currentCode } = devExtremeVersion;
    return `${major}.${minor}`;
}

function getDevExpressLCXKey() {
    const devExtremeVersion = readDevExtremeVersion();
    let currentVersion = '';
    if(devExtremeVersion) {
        currentVersion = buildVersionString(devExtremeVersion);
    }
    if(hasEnvVar(LICENSE_ENV)) {
        return { key: normalizeKey(process.env[LICENSE_ENV]), source: { type: 'envVariable' }, currentVersion };
    }

    if(hasEnvVar(LICENSE_PATH_ENV)) {
        const licensePath = resolveFromLicensePathEnv(process.env[LICENSE_PATH_ENV]);
        const key = normalizeKey(readTextFileIfExists(licensePath));
        return { key, source: { type: 'envPath' }, currentVersion };
    }

    const defaultPath = getDefaultLicenseFilePath();
    const fromDefault = normalizeKey(readTextFileIfExists(defaultPath));
    if(fromDefault) {
        return { key: fromDefault, source: { type: 'file', path: defaultPath }, currentVersion };
    }

    return { key: null, source: null, currentVersion };
}

module.exports = {
    getDevExpressLCXKey,
    readDevExtremeVersion,
    buildVersionString
};
