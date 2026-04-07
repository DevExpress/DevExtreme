'use strict';

const MESSAGES = Object.freeze({
    keyNotFound: [
        'For evaluation purposes only. Redistribution prohibited.',
        'If you own a licensed/registered version or if you are using a 30-day trial version',
        'of DevExpress product libraries on a development machine,',
        'download your personal license key (devexpress.com/DX1001)',
        'and place DevExpress_License.txt in the following folder:',
        '"%AppData%/DevExpress" (Windows)',
        'or "$HOME/Library/Application Support/DevExpress" (MacOS)',
        'or "$HOME/.config/DevExpress" (Linux).',
        'Alternatively, download and run the DevExpress Unified Component Installer',
        'to automatically activate your license.',
    ].join(' '),

    trial: [
        'For evaluation purposes only. Redistribution prohibited.',
        'Please purchase a license to continue use of the following',
        'DevExpress product libraries:',
        'Universal, DXperience, ASP.NET and Blazor, DevExtreme Complete.',
    ].join(' '),

    resolveFailed: 'Failed to resolve license key. Placeholder will remain.',
});

const KEY_SOURCES = Object.freeze({
    envVariable: 'License source: Environment Variable (DevExpress_License).',
    envPath: 'License source: Environment Variable (DevExpress_LicensePath).',
    file: (filePath) => `License source: File "${filePath}".`,
    default: 'License source: default.',
});

const WARNING_CODES = Object.freeze({
    general: 1001,
    incompatibleVersion: 1002,
    trialExpired: 1003,
});

const TEMPLATES = Object.freeze({
    warningPrefix: (number) =>
        `Warning number: DX${number}. For evaluation purposes only. Redistribution prohibited.`,

    keyNotFound: 'A valid DevExpress license key was not found on this machine.',

    keyWasFound: (type, filePath) => {
        if(type === 'file') return KEY_SOURCES.file(filePath);
        return KEY_SOURCES[type] || KEY_SOURCES.default;
    },

    keyVerificationFailed: (type, keyVersion, requiredVersion) => {
        if(type === 'incompatibleVersion') {
            return [
                `Incompatible DevExpress license key version (${keyVersion}).`,
                `Download and register an updated DevExpress license key (${requiredVersion}+).`,
                'Clear npm/IDE/NuGet cache and rebuild your project (https://devexpress.com/DX1002).',
            ].join(' ');
        }
        if(type === 'trialExpired') {
            return [
                'Your DevExpress trial period has expired.',
                'Purchase a license to continue using DevExpress product libraries.',
            ].join(' ');
        }
        return 'License key verification has failed.';
    },

    warningCodeByType: (type) => WARNING_CODES[type] || WARNING_CODES.general,

    purchaseLicense: [
        'Please register an existing license (https://devexpress.com/DX1000) or purchase a new license',
        '(https://devexpress.com/Buy/) to continue use of the following DevExpress product libraries:',
        'DevExtreme - Included in Subscriptions: Universal, DXperience, ASP.NET and Blazor, DevExtreme Complete.'
    ].join(' '),

    installationInstructions: [
        'If you own a licensed/registered version or if you are using a 30-day trial version',
        'of DevExpress product libraries on a development machine,',
        'download your personal license key and verify it with the devextreme-license tool',
        '(https://devexpress.com/DX1001).',
    ].join(' '),

    oldDevExtremeKey: (version) =>
        `A DevExtreme key (v25_1 or earlier) has been detected. Use DevExpress license key (v${version}+) instead.`,

    licenseId: (id) => `License ID: ${id}`,
});

module.exports = { MESSAGES, TEMPLATES };
