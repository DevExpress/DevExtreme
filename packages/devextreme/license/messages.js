'use strict';

const MESSAGES = Object.freeze({
    keyNotFound:
        'For evaluation purposes only. Redistribution prohibited. ' +
        'If you own a licensed/registered version or if you are using a 30-day trial version of DevExpress product libraries on a development machine, ' +
        'download your personal license key (devexpress.com/DX1001) and place DevExpress_License.txt in the following folder: ' +
        '"%AppData%/DevExpress" (Windows) or "$HOME/Library/Application Support/DevExpress" (MacOS) or "$HOME/.config/DevExpress" (Linux). ' +
        'Alternatively, download and run the DevExpress Unified Component Installer to automatically activate your license.',

    trial:
        'For evaluation purposes only. Redistribution prohibited. ' +
        'Please purchase a license to continue use of the following DevExpress product libraries: ' +
        'Universal, DXperience, ASP.NET and Blazor, DevExtreme Complete.',

    resolveFailed:
        'Failed to resolve license key. Placeholder will remain.',
});

const TEMPLATES = Object.freeze({
    warningPrefix: (number) => `Warning number: DX${number}. For evaluation purposes only. Redistribution prohibited.`,
    keyNotFound: 'No valid DevExpress license key was found on this machine.',
    keyWasFound: (type, path) => {
        switch(type) {
            case 'envVariable':
                return 'The DevExpress license key was retrieved from the "DevExpress_License" environment variable.';
            case 'envPath':
                return 'The DevExpress license key was retrieved from the "DevExpress_LicensePath" environment variable.';
            case 'file':
                return `The DevExpress license key was retrieved from file: "${path}".`;
            default:
                return 'The DevExpress license key was retrieved.';
        }
    },
    keyVerificationFailed: (type, keyVersion, requiredVersion) => {
        switch(type) {
            case 'incompatibleVersion':
                return `Incompatible DevExpress license key version (${keyVersion}). Download and register an updated DevExpress license key (${requiredVersion}+). Clear npm/IDE/NuGet cache and rebuild your project.`;
            default:
                return 'License key verification has failed.';
        }
    },
    warningCodeByType: (type) => {
        switch(type) {
            case 'general':
                return 1001;
            case 'incompatibleVersion':
                return 1002;
            default:
                return 1001;
        }
    },
    purchaseLicense: (version) => 
        `Purchase a license to continue use of DevExtreme (v${version}). Included in subscriptions: Universal, DXperience, ASP.NET and Blazor, DevExtreme Complete. To purchase a license, visit https://js.devexpress.com/Buy/`,
    installationInstructions: 'If you own a licensed/registered version or if you are using a 30-day trial version of DevExpress product libraries on a development machine, download your personal license key and verify it with the devextreme-license tools. Setup instructions: https://js.devexpress.com/Documentation/Guide/Common/Licensing',
    oldDevExtremeKey: 'The invalid/old DevExtreme key is used instead of the DevExpress license key.',
    licenseId: (id) => `License ID: ${id}`,
});

module.exports = { MESSAGES, TEMPLATES };
