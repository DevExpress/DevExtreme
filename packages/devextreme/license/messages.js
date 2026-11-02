'use strict';

const KEY_SOURCES = Object.freeze({
    envVariable: 'License Source: Environment Variable (DevExpress_License).',
    file: (filePath) => `License Source: File (${filePath}).`,
    default: 'License Source: default.',
});

const WARNING_CODES = Object.freeze({
    general: 1001,
    incompatibleVersion: 1002,
});

const SUBSCRIPTIONS = 'Universal, DXperience, ASP.NET and Blazor, DevExtreme Complete';

const continueUse = (code) => [
    `Please register a valid license (https://devexpress.com/DX${code}) or purchase a new license`,
    '(https://devexpress.com/BUY) to continue use of the following DevExpress product libraries:',
    `DevExtreme - Included in Subscriptions: ${SUBSCRIPTIONS}.`,
].join(' ');

const TEMPLATES = Object.freeze({
    warningPrefix: (number) => `Warning DX${number}:`,

    errorPrefix: (number) => `Error DX${number}:`,

    keyNotFound: 'A valid DevExpress license key was not found on this machine.',

    keyWasFound: (type, filePath) => {
        if(type === 'file') return KEY_SOURCES.file(filePath);
        return KEY_SOURCES[type] || KEY_SOURCES.default;
    },

    keyVerificationFailed: (type, keyVersion, requiredVersion) => {
        if(type === 'incompatibleVersion') {
            return [
                `Incompatible DevExpress license key version (${keyVersion}).`,
                'Use and Redistribution prohibited.',
                `Download and register an updated DevExpress license key (v${requiredVersion}+).`,
                'Clear npm/IDE/NuGet cache and rebuild your project (https://devexpress.com/DX1002).',
            ].join(' ');
        }
        return '';
    },

    warningCodeByType: (type) => WARNING_CODES[type] || WARNING_CODES.general,

    purchaseLicense: (version) => [
        `For evaluation purposes only (v${version}). Redistribution prohibited.`,
        continueUse(1000),
    ].join(' '),

    trialExpired: (version) => [
        `Your 30-day trial has expired (v${version}). Use and Redistribution prohibited.`,
        continueUse(1004),
    ].join(' '),

    installationInstructions: (version) => [
        `License key is missing or uses invalid format (v${version}). Use and Redistribution prohibited.`,
        'If you own a licensed/registered version or if you are using a 30-day trial version',
        'of DevExpress product libraries on a development machine,',
        'download your personal license key (https://devexpress.com/DX1001)',
        'and verify it with the devextreme-license tool.',
    ].join(' '),

    oldDevExtremeKey: (version) =>
        `A DevExtreme key (v25.2 or earlier) has been detected. Use DevExpress license key (v${version}+) instead.`,

    licenseId: (id) => `License ID: ${id}.`,
});

module.exports = { TEMPLATES };
