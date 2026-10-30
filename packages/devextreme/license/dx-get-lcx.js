const fs = require('fs');
const os = require('os');
const path = require('path');

const LICENSE_ENV = 'DevExpress_License';
const LICENSE_PATH_ENV = 'DevExpress_LicensePath';
const LICENSE_FILE = 'DevExpress_License.txt';

function isNonEmptyString(v) {
    return typeof v === 'string' && v.trim().length > 0;
}

function readTextFileIfExists(filePath) {
    try {
        if(!filePath) return null;
        if(!fs.existsSync(filePath)) return null;
        const stat = fs.statSync(filePath);
        if(!stat.isFile()) return null;
        const raw = fs.readFileSync(filePath, 'utf8');
        return isNonEmptyString(raw) ? raw : null;
    } catch{
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

function getMachineLicenseFilePath() {
    const root = process.platform === 'win32' ? process.env.ProgramData : '/usr/share';

    if(!isNonEmptyString(root) || !path.isAbsolute(root)) return null;
    return path.join(root, 'DevExpress', LICENSE_FILE);
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
    } catch{}

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

function readFullVersion() {
    try {
        return require('../core/version').fullVersion;
    } catch{}
    try {
        return String(require('../package.json').version);
    } catch{}
    return '';
}

function buildVersionString(devExtremeVersion) {
    const { major, minor } = devExtremeVersion;
    return `${major}.${minor}`;
}

function getDevExpressLCXKey() {
    const devExtremeVersion = readDevExtremeVersion();
    let currentVersion = '';
    const fullVersion = readFullVersion();
    if(devExtremeVersion) {
        currentVersion = buildVersionString(devExtremeVersion);
    }
    const fromEnv = normalizeKey(process.env[LICENSE_ENV]);
    if(fromEnv) {
        return { key: fromEnv, source: { type: 'envVariable' }, currentVersion, fullVersion };
    }

    const licensePath = resolveFromLicensePathEnv(process.env[LICENSE_PATH_ENV]);
    const fromPath = normalizeKey(readTextFileIfExists(licensePath));
    if(fromPath) {
        return { key: fromPath, source: { type: 'file', path: licensePath }, currentVersion, fullVersion };
    }

    const machinePath = getMachineLicenseFilePath();
    const fromMachine = normalizeKey(readTextFileIfExists(machinePath));
    if(fromMachine) {
        return { key: fromMachine, source: { type: 'file', path: machinePath }, currentVersion, fullVersion };
    }

    const defaultPath = getDefaultLicenseFilePath();
    const fromDefault = normalizeKey(readTextFileIfExists(defaultPath));
    if(fromDefault) {
        return { key: fromDefault, source: { type: 'file', path: defaultPath }, currentVersion, fullVersion };
    }

    return { key: null, source: null, currentVersion, fullVersion };
}

module.exports = {
    getDevExpressLCXKey,
    getMachineLicenseFilePath,
    readDevExtremeVersion,
    buildVersionString
};
