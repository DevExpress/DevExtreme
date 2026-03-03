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

    versionIncompatible: (keyVersion, requiredVersion) =>
        'For evaluation purposes only. Redistribution prohibited. ' +
        `Incompatible DevExpress license key version (${keyVersion}). ` +
        `Download and register an updated DevExpress license key (${requiredVersion}+). ` +
        'Clear IDE/NuGet cache and rebuild your project (devexpress.com/DX1002).',

    resolveFailed:
        'Failed to resolve license key. Placeholder will remain.',
});

module.exports = { MESSAGES };
