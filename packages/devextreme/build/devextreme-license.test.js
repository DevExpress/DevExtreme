'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { encode, getLCPInfo, isTrialExpired } = require('../license/dx-lcx-2-lcp');
const { getDevExpressLCXKey, getMachineLicenseFilePath } = require('../license/dx-get-lcx');
const { TEMPLATES } = require('../license/messages');

const CLI = path.join(__dirname, '..', 'license', 'devextreme-license.js');
const pkg = require('../package.json');

const DAY = 24 * 60 * 60 * 1000;
const DEVEXTREME_HTMLJS_BIT = 1n << 54n;
const DEVEXTREME_ASPNET_BIT = 1n << 17n;
const DXPERIENCE_WIN_BIT = 1n;
const TICKS_EPOCH_OFFSET = 621355968000000000n;
const DOTNET_MAX_TICKS = '3155378975999999999';
const SIGN = 'A'.repeat(136);

const versionCode = () => {
    const [major, minor] = pkg.version.split('.');
    return Number(major) * 10 + Number(minor);
};

const ticks = (ms) => (BigInt(ms) * 10000n + TICKS_EPOCH_OFFSET).toString();

const entry = (version, products, expiration) => `${version},${products},0,${expiration === undefined ? ticks(Date.now() + 365 * DAY) : ticks(expiration)},${ticks(Date.now() + 365 * DAY)}`;

const rawEntry = (version, products, trialTicks) => `${version},${products},0,${trialTicks},${ticks(Date.now() + 365 * DAY)}`;

const createLcp = (...entries) => {
    const payload = `TESTLICENSEID;${entries.join(';')};`;
    return `LCPv1${encode(Buffer.from(SIGN + encode(payload), 'utf8').toString('base64'))}`;
};

const createLcx = (...entries) => {
    const payload = encode(`TESTLICENSEID;${entries.join(';')};`);
    const lcxData = `${SIGN}1\nX${payload.length}\n${payload}`;
    return `LCXv1${Buffer.from(SIGN + encode(lcxData), 'utf8').toString('base64')}`;
};

describe('isTrialExpired', () => {
    const now = Date.UTC(2026, 10, 15);
    const item = (version, products, expiration = Infinity) => ({ version, products, expiration });

    it.each([
        ['expired 4 days ago', [item(262, 0n, now - 4 * DAY)], true],
        ['expired 2 days ago (tolerance)', [item(262, 0n, now - 2 * DAY)], false],
        ['ends in the future', [item(262, 0n, now + DAY)], false],
        ['no Expiration', [item(262, 0n)], false],
        ['DevExtreme licensed', [item(262, DEVEXTREME_HTMLJS_BIT, now - 100 * DAY)], false],
        ['only ASP.NET licensed (valid inside the wrappers)', [item(262, DEVEXTREME_ASPNET_BIT, now - 100 * DAY)], false],
        ['another product licensed', [item(262, DXPERIENCE_WIN_BIT, now - 100 * DAY)], true],
        ['older DevExtreme license, expired trial entry', [item(252, DEVEXTREME_HTMLJS_BIT), item(262, 0n, now - 100 * DAY)], true],
        ['a later entry covers the build', [item(262, 0n, now - 100 * DAY), item(271, DEVEXTREME_HTMLJS_BIT)], false],
        ['no entry for the build version', [item(261, 0n, now - 100 * DAY)], false],
        ['the maximum Expiration wins', [item(262, 0n, now - 100 * DAY), item(262, DXPERIENCE_WIN_BIT, now + DAY)], false],
        ['exactly 3 days ago (the boundary is not expired)', [item(262, 0n, now - 3 * DAY)], false],
        ['3 days and 1 ms ago', [item(262, 0n, now - 3 * DAY - 1)], true],
        ['3 days minus 1 ms ago', [item(262, 0n, now - 3 * DAY + 1)], false],
        ['an expired entry and a later entry with an active trial', [item(262, 0n, now - 100 * DAY), item(271, 0n, now + DAY)], false],
        ['an old DevExtreme license and a newer entry for another product', [item(252, DEVEXTREME_HTMLJS_BIT), item(271, DXPERIENCE_WIN_BIT, now - 100 * DAY)], true],
    ])('%s -> %s', (_, products, expected) => {
        expect(isTrialExpired(products, 262, now)).toBe(expected);
    });

    it('is false without the build version', () => {
        expect(isTrialExpired([item(262, 0n, 1)], undefined, now)).toBe(false);
    });
});

describe('getLCPInfo', () => {
    it('reports an expired trial with the license id', () => {
        const lcp = createLcp(entry(versionCode(), 0, Date.now() - 10 * DAY));
        const info = getLCPInfo(lcp);

        expect(info.warning).toEqual({ type: 'trialExpired' });
        expect(info.licenseId).toBe('TESTLICENSEID');
    });

    it('reports a trial that is not expired', () => {
        const lcp = createLcp(entry(versionCode(), 0, Date.now() + 5 * DAY));

        expect(getLCPInfo(lcp).warning).toEqual({ type: 'trial' });
    });

    it('does not expire a trial that ends with DateTime.MaxValue', () => {
        const lcp = createLcp(rawEntry(versionCode(), 0, DOTNET_MAX_TICKS));

        expect(getLCPInfo(lcp).warning).toEqual({ type: 'trial' });
    });

    it('does not expire a trial with DateTime.MinValue ticks (no trial information)', () => {
        const lcp = createLcp(rawEntry(versionCode(), 0, '0'));

        expect(getLCPInfo(lcp).warning).toEqual({ type: 'trial' });
    });

    it('does not expire an entry that has no trial end', () => {
        const lcp = createLcp(`${versionCode()},0,0`);

        expect(getLCPInfo(lcp).warning).toEqual({ type: 'trial' });
    });

    it('reports nothing for a licensed key', () => {
        const lcp = createLcp(entry(versionCode(), DEVEXTREME_HTMLJS_BIT, Date.now() - 100 * DAY));

        expect(getLCPInfo(lcp).warning).toBeNull();
    });
});

describe('license source text', () => {
    it.each([
        [{ type: 'envVariable' }, 'License Source: Environment Variable (DevExpress_License).'],
        [{ type: 'file', path: '/home/me/.config/DevExpress/DevExpress_License.txt' }, 'License Source: File (/home/me/.config/DevExpress/DevExpress_License.txt).'],
        [{ type: 'file', path: 'C:\\Users\\me\\AppData\\Roaming\\DevExpress\\DevExpress_License.txt' }, 'License Source: File (C:\\Users\\me\\AppData\\Roaming\\DevExpress\\DevExpress_License.txt).'],
    ])('%j', (source, expected) => {
        expect(TEMPLATES.keyWasFound(source.type, source.path)).toBe(expected);
    });
});

describe('machine-wide key file', () => {
    let tmp;
    let saved;

    const setPlatform = (platform) => Object.defineProperty(process, 'platform', { value: platform, configurable: true });
    const lcx = () => createLcx(entry(versionCode(), 0, Date.now() + 5 * DAY));
    const writeKey = (filePath, content = lcx()) => {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, content);
    };

    beforeEach(() => {
        tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dx-license-machine-'));
        saved = {
            platform: Object.getOwnPropertyDescriptor(process, 'platform'),
            env: { ...process.env },
        };
        ['DevExpress_License', 'DevExpress_LicensePath', 'ProgramData', 'APPDATA'].forEach((name) => delete process.env[name]);
        process.env.HOME = tmp;
        process.env.USERPROFILE = tmp;
        setPlatform('win32');
        process.env.ProgramData = path.join(tmp, 'ProgramData');
        process.env.APPDATA = path.join(tmp, 'AppData');
    });

    afterEach(() => {
        Object.defineProperty(process, 'platform', saved.platform);
        Object.keys(process.env).forEach((name) => { delete process.env[name]; });
        Object.assign(process.env, saved.env);
        fs.rmSync(tmp, { recursive: true, force: true });
    });

    const machineFile = () => path.join(tmp, 'ProgramData', 'DevExpress', 'DevExpress_License.txt');
    const userFile = () => path.join(tmp, 'AppData', 'DevExpress', 'DevExpress_License.txt');

    it('uses %ProgramData%\\DevExpress on Windows', () => {
        expect(getMachineLicenseFilePath()).toBe(machineFile());
    });

    it.each(['linux', 'darwin'])('uses /usr/share/DevExpress on %s like .NET', (platform) => {
        setPlatform(platform);

        expect(getMachineLicenseFilePath()).toBe(path.join('/usr/share', 'DevExpress', 'DevExpress_License.txt'));
    });

    it.each([
        ['is not set', undefined],
        ['is blank', '  '],
        ['is relative', 'ProgramData'],
    ])('has no machine-wide file when ProgramData %s', (_, value) => {
        if(value === undefined) delete process.env.ProgramData;
        else process.env.ProgramData = value;

        expect(getMachineLicenseFilePath()).toBeNull();
    });

    it('finds the key in the machine-wide file and names it', () => {
        writeKey(machineFile());

        expect(getDevExpressLCXKey()).toMatchObject({ source: { type: 'file', path: machineFile() } });
    });

    it('prefers the machine-wide file over the per-user file', () => {
        writeKey(machineFile(), `${lcx()}\n`);
        writeKey(userFile(), 'LCXv1other');

        expect(getDevExpressLCXKey().source).toEqual({ type: 'file', path: machineFile() });
    });

    it('prefers DevExpress_LicensePath over the machine-wide file', () => {
        const folder = path.join(tmp, 'custom');
        writeKey(path.join(folder, 'DevExpress_License.txt'));
        writeKey(machineFile());
        process.env.DevExpress_LicensePath = folder;

        expect(getDevExpressLCXKey().source).toEqual({ type: 'file', path: path.join(folder, 'DevExpress_License.txt') });
    });

    it('prefers DevExpress_License over every file', () => {
        writeKey(machineFile());
        process.env.DevExpress_License = lcx();

        expect(getDevExpressLCXKey().source).toEqual({ type: 'envVariable' });
    });

    it.each([
        ['a missing file', () => undefined],
        ['an empty file', () => writeKey(machineFile(), '')],
        ['a blank file', () => writeKey(machineFile(), ' \n\n ')],
    ])('goes on to the per-user file when the machine-wide file is %s', (_, prepare) => {
        prepare();
        writeKey(userFile());

        expect(getDevExpressLCXKey().source).toEqual({ type: 'file', path: userFile() });
    });

    it('finds nothing when no location has a key', () => {
        expect(getDevExpressLCXKey()).toMatchObject({ key: null, source: null });
    });

    it.each([
        ['empty', ''],
        ['blank', '  '],
    ])('goes on to the files when DevExpress_License is %s', (_, value) => {
        writeKey(userFile());
        process.env.DevExpress_License = value;

        expect(getDevExpressLCXKey().source).toEqual({ type: 'file', path: userFile() });
    });

    it('uses a broken DevExpress_License and does not try the files', () => {
        writeKey(userFile());
        process.env.DevExpress_License = 'LCXv1garbage';

        expect(getDevExpressLCXKey()).toMatchObject({ key: 'LCXv1garbage', source: { type: 'envVariable' } });
    });

    it.each([
        ['a file that does not exist', () => path.join(tmp, 'nowhere', 'key.txt')],
        ['a folder that does not exist', () => path.join(tmp, 'nowhere')],
        ['a folder without the key file', () => { const folder = path.join(tmp, 'empty'); fs.mkdirSync(folder); return folder; }],
        ['a folder with an empty key file', () => { const folder = path.join(tmp, 'blank'); writeKey(path.join(folder, 'DevExpress_License.txt'), ' \n '); return folder; }],
        ['blank', () => '  '],
    ])('goes on to the files when DevExpress_LicensePath is %s', (_, prepare) => {
        process.env.DevExpress_LicensePath = prepare();
        writeKey(userFile());

        expect(getDevExpressLCXKey().source).toEqual({ type: 'file', path: userFile() });
    });
});

describe('devextreme-license', () => {
    let tmp;

    const run = (env, args = [], nodeArgs = []) => {
        const result = spawnSync(process.execPath, [...nodeArgs, CLI, ...args], {
            cwd: tmp,
            encoding: 'utf8',
            env: {
                PATH: process.env.PATH,
                HOME: tmp,
                USERPROFILE: tmp,
                APPDATA: tmp,
                ...env,
            },
        });
        return { code: result.status, stdout: result.stdout, stderr: result.stderr };
    };

    const defaultKeyFile = () => {
        if(process.platform === 'win32') return path.join(tmp, 'DevExpress', 'DevExpress_License.txt');
        if(process.platform === 'darwin') return path.join(tmp, 'Library', 'Application Support', 'DevExpress', 'DevExpress_License.txt');
        return path.join(tmp, '.config', 'DevExpress', 'DevExpress_License.txt');
    };

    const writeKeyFile = (filePath, lcx) => {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, lcx);
    };

    const activeTrialLcx = () => createLcx(entry(versionCode(), 0, Date.now() + 5 * DAY));

    beforeEach(() => {
        tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dx-license-cli-'));
    });

    afterEach(() => {
        fs.rmSync(tmp, { recursive: true, force: true });
    });

    it('fails with DX1004 and writes the key for an expired trial', () => {
        const lcx = createLcx(entry(versionCode(), 0, Date.now() - 10 * DAY));
        const { code, stderr } = run({ DevExpress_License: lcx }, ['--out', 'key.ts']);

        expect(code).toBe(1);
        expect(stderr).toContain(`Error DX1004: Your 30-day trial has expired (v${pkg.version}). Use and Redistribution prohibited. Please register a valid license (https://devexpress.com/DX1004) or purchase a new license (https://devexpress.com/BUY)`);
        expect(stderr).toContain('License ID: TESTLICENSEID. License Source: Environment Variable (DevExpress_License).');
        expect(fs.readFileSync(path.join(tmp, 'key.ts'), 'utf8')).toContain('export const licenseKey = \'LCPv1');
    });

    it('writes nothing but the key and comments to the generated file', () => {
        const lcx = createLcx(entry(versionCode(), DEVEXTREME_HTMLJS_BIT));
        const filePath = path.join(tmp, 'license', 'default.txt');
        fs.mkdirSync(path.dirname(filePath));
        fs.writeFileSync(filePath, lcx);

        const { code } = run({ DevExpress_LicensePath: filePath }, ['--out', 'key.ts']);
        const lines = fs.readFileSync(path.join(tmp, 'key.ts'), 'utf8').split('\n').filter(Boolean);

        expect(code).toBe(0);
        expect(lines.filter((line) => !line.startsWith('//'))).toEqual([expect.stringMatching(/^export const licenseKey = 'LCPv1[^']+';$/)]);
        const content = lines.join('\n');
        expect(content).not.toContain(tmp);
        expect(content).not.toContain('TESTLICENSEID');
        expect(content).not.toContain('LCXv1');
    });

    it('warns with DX1000 and exits with 0 for an active trial', () => {
        const lcx = createLcx(entry(versionCode(), 0, Date.now() + 5 * DAY));
        const { code, stderr } = run({ DevExpress_License: lcx });

        expect(code).toBe(0);
        expect(stderr).toContain(`Warning DX1000: For evaluation purposes only (v${pkg.version}). Redistribution prohibited. Please register a valid license`);
        expect(stderr).toContain('License ID: TESTLICENSEID. License Source: Environment Variable (DevExpress_License).');
    });

    it('does not report a licensed key', () => {
        const lcx = createLcx(entry(versionCode(), DEVEXTREME_HTMLJS_BIT, Date.now() - 100 * DAY));
        const { code, stderr } = run({ DevExpress_License: lcx });

        expect(code).toBe(0);
        expect(stderr).toBe('');
    });

    it('does not fail the build for a key with only the ASP.NET bit', () => {
        const lcx = createLcx(entry(versionCode(), DEVEXTREME_ASPNET_BIT, Date.now() - 100 * DAY));
        const { code, stderr } = run({ DevExpress_License: lcx });

        expect(code).toBe(0);
        expect(stderr).toContain('Warning DX1000: For evaluation purposes only');
        expect(stderr).not.toContain('DX1004');
    });

    it('warns with DX1002 for an incompatible key version', () => {
        const lcx = createLcx(entry(versionCode() - 10, DEVEXTREME_HTMLJS_BIT));
        const { code, stderr } = run({ DevExpress_License: lcx });

        expect(code).toBe(0);
        const [major, minor] = pkg.version.split('.');
        const keyVersion = `v${Math.floor((versionCode() - 10) / 10)}.${(versionCode() - 10) % 10}`;

        expect(stderr).toContain(`Warning DX1002: Incompatible DevExpress license key version (${keyVersion}). Use and Redistribution prohibited. Download and register an updated DevExpress license key (v${major}.${minor}+). Clear npm/IDE/NuGet cache and rebuild your project (https://devexpress.com/DX1002).`);
    });
    it('prints the license ID and the source once for an incompatible key version', () => {
        const lcx = createLcx(entry(versionCode() - 10, DEVEXTREME_HTMLJS_BIT));
        const { stderr } = run({ DevExpress_License: lcx });

        expect(stderr).toContain('Warning DX1000:');
        expect(stderr).toContain('Warning DX1002:');
        expect(stderr.match(/License ID: /g)).toHaveLength(1);
        expect(stderr.match(/License Source: /g)).toHaveLength(1);
        expect(stderr.indexOf('License ID: ')).toBeGreaterThan(stderr.indexOf('Warning DX1002:'));
    });

    describe('where the key comes from', () => {
        it('reports the file of DevExpress_LicensePath as a file', () => {
            const filePath = path.join(tmp, 'license', 'key.txt');
            writeKeyFile(filePath, activeTrialLcx());

            const { code, stderr } = run({ DevExpress_LicensePath: filePath });

            expect(code).toBe(0);
            expect(stderr).toContain(`License ID: TESTLICENSEID. License Source: File (${filePath}).`);
            expect(stderr).not.toContain('DevExpress_LicensePath');
        });

        it('reads the key file from a folder of DevExpress_LicensePath', () => {
            const folder = path.join(tmp, 'license');
            writeKeyFile(path.join(folder, 'DevExpress_License.txt'), activeTrialLcx());

            const { stderr } = run({ DevExpress_LicensePath: folder });

            expect(stderr).toContain(`License Source: File (${path.join(folder, 'DevExpress_License.txt')}).`);
        });

        it('prefers the variable with the key over the files', () => {
            writeKeyFile(defaultKeyFile(), createLcx(entry(versionCode(), DEVEXTREME_HTMLJS_BIT)));

            const { stderr } = run({ DevExpress_License: activeTrialLcx() });

            expect(stderr).toContain('License Source: Environment Variable (DevExpress_License).');
        });

        it('prefers DevExpress_LicensePath over the default file', () => {
            const filePath = path.join(tmp, 'license', 'key.txt');
            writeKeyFile(filePath, activeTrialLcx());
            writeKeyFile(defaultKeyFile(), createLcx(entry(versionCode(), DEVEXTREME_HTMLJS_BIT)));

            const { stderr } = run({ DevExpress_LicensePath: filePath });

            expect(stderr).toContain(`License Source: File (${filePath}).`);
        });

    });

    describe('no key at all', () => {
        // the child process looks like Windows with ProgramData and APPDATA in the temp folder, so it never reads the key folders of the real machine
        const withoutMachineKeys = () => {
            const preload = path.join(tmp, 'no-machine-keys.js');
            fs.writeFileSync(preload, 'Object.defineProperty(process, \'platform\', { value: \'win32\' });\nprocess.env.ProgramData = process.env.APPDATA;\n');
            return ['--require', preload];
        };

        it('prints TRIAL, warns with DX1000 and DX1001 and exits with 0', () => {
            const { code, stdout, stderr } = run({}, [], withoutMachineKeys());

            expect(code).toBe(0);
            expect(stdout).toBe('TRIAL\n');
            expect(stderr).toContain('Warning DX1000: For evaluation purposes only');
            expect(stderr).toContain('A valid DevExpress license key was not found on this machine.');
            expect(stderr).toContain('Warning DX1001: License key is missing or uses invalid format');
            expect(stderr).not.toContain('License ID');
            expect(stderr).not.toContain('License Source');
        });

        it('writes TRIAL to the generated file', () => {
            const { code } = run({}, ['--out', 'key.ts', '--no-gitignore'], withoutMachineKeys());

            expect(code).toBe(0);
            expect(fs.readFileSync(path.join(tmp, 'key.ts'), 'utf8')).toContain('export const licenseKey = \'TRIAL\';');
        });
    });

    describe('a key that cannot be read', () => {
        it('warns with DX1000 and DX1001 and names the source of a broken key', () => {
            const { code, stdout, stderr } = run({ DevExpress_License: 'LCXv1garbage' });

            expect(code).toBe(0);
            expect(stdout).toBe('TRIAL\n');
            expect(stderr).toContain('Warning DX1000: For evaluation purposes only');
            expect(stderr).toContain('License Source: Environment Variable (DevExpress_License).');
            expect(stderr).not.toContain('License ID');
            expect(stderr).toContain('Warning DX1001: License key is missing or uses invalid format');
        });

        it('names the source of an old DevExtreme key', () => {
            const { code, stderr } = run({ DevExpress_License: 'ewogICJmb3JtYXQiOiAxfQ==.AAAA' });

            expect(code).toBe(0);
            expect(stderr).toContain('Warning DX1000: For evaluation purposes only');
            expect(stderr).toContain('License Source: Environment Variable (DevExpress_License).');
            expect(stderr).toContain('A DevExtreme key (v25.2 or earlier) has been detected.');
            expect(stderr).toContain('Warning DX1001');
        });

        it('names the file of a broken key', () => {
            const filePath = path.join(tmp, 'broken.txt');
            writeKeyFile(filePath, 'LCXv1garbage');

            const { stderr } = run({ DevExpress_LicensePath: filePath });

            expect(stderr).toContain(`License Source: File (${filePath}).`);
            expect(stderr).toContain('Warning DX1001');
        });
    });

    describe('the output file', () => {
        const expiredLcx = () => createLcx(entry(versionCode(), 0, Date.now() - 10 * DAY));

        it('is not touched when it already exists', () => {
            fs.writeFileSync(path.join(tmp, 'key.ts'), 'old content');

            const { code, stderr } = run({ DevExpress_License: expiredLcx() }, ['--out', 'key.ts']);

            expect(code).toBe(1);
            expect(stderr).toContain('Output file already exists: key.ts');
            expect(fs.readFileSync(path.join(tmp, 'key.ts'), 'utf8')).toBe('old content');
        });

        it('is overwritten with --force even for an expired trial', () => {
            fs.writeFileSync(path.join(tmp, 'key.ts'), 'old content');

            const { code } = run({ DevExpress_License: expiredLcx() }, ['--out', 'key.ts', '--force']);

            expect(code).toBe(1);
            expect(fs.readFileSync(path.join(tmp, 'key.ts'), 'utf8')).toContain('export const licenseKey = \'LCPv1');
        });

        it('is created in a folder that does not exist', () => {
            const { code } = run({ DevExpress_License: expiredLcx() }, ['--out', path.join('a', 'b', 'key.ts')]);

            expect(code).toBe(1);
            expect(fs.existsSync(path.join(tmp, 'a', 'b', 'key.ts'))).toBe(true);
        });

        it('is not touched when it already exists and the trial is active (exit code 0)', () => {
            fs.writeFileSync(path.join(tmp, 'key.ts'), 'old content');

            const { code } = run({ DevExpress_License: activeTrialLcx() }, ['--out', 'key.ts']);

            expect(code).toBe(0);
            expect(fs.readFileSync(path.join(tmp, 'key.ts'), 'utf8')).toBe('old content');
        });
    });

    it.each([['--help'], ['-h']])('prints the whole help for %s and exits with 0', (flag) => {
        const { code, stdout, stderr } = run({}, [flag]);

        expect(code).toBe(0);
        expect(stderr).toBe('');
        expect(stdout.startsWith('Usage:\n  devextreme-license --out <path> [options]')).toBe(true);
        expect(stdout.trimEnd().endsWith('"prebuild": "devextreme-license --non-modular --out src/.devextreme/license-key.js"')).toBe(true);
    });

    it('does not look for a key when it prints the help', () => {
        const { code, stderr } = run({ DevExpress_License: 'LCXv1garbage' }, ['--help']);

        expect(code).toBe(0);
        expect(stderr).toBe('');
    });

    it('prints the whole key to stdout together with the failure code', () => {
        const { code, stdout } = run({ DevExpress_License: createLcx(entry(versionCode(), 0, Date.now() - 10 * DAY)) });

        expect(code).toBe(1);
        expect(stdout).toMatch(/^LCPv1\S+\n$/);
    });
});
