'use strict';

const KEY_SOURCES = Object.freeze({
    envVariable: 'License source: Environment Variable (DevExpress_License).',
    envPath: 'License source: Environment Variable (DevExpress_LicensePath).',
    file: (filePath) => `License source: File "${filePath}".`,
    default: 'License source: default.',
});

const WARNING_CODES = Object.freeze({
    general: 1001,
    incompatibleVersion: 1002,
});

const TEMPLATES = Object.freeze({
    warningPrefix: (number) =>
        `Warning DX${number}: For evaluation purposes only. Redistribution prohibited.`,

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
        return '';
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
        `A DevExtreme key (v25.2 or earlier) has been detected. Use DevExpress license key (v${version}+) instead.`,

    licenseId: (id) => `License ID: ${id}`,
});

module.exports = { TEMPLATES };
