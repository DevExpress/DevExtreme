import type { LicenseWarningType } from './types';

export const TEMPLATES = Object.freeze({
  warningPrefix: (code: string | number): string => {
    let warningDescription = '';
    switch (code) {
      case 'W0019':
        warningDescription = 'DevExtreme: You are using a trial (evaluation) version.';
        break;
      case 'W0020':
        warningDescription = 'DevExtreme: License Key Has Expired.';
        break;
      case 'W0021':
        warningDescription = 'DevExtreme: License Key Verification Has Failed.';
        break;
      default:
        warningDescription = 'DevExtreme: For evaluation purposes only. Redistribution prohibited.';
        break;
    }
    return `${code} - ${warningDescription}`;
  },

  keyNotFound: 'A devextreme-license generated key has not been specified in the GlobalConfig.',

  keyWasFound: (type: string, path?: string): string => {
    switch (type) {
      case 'envVariable':
        return 'The DevExpress license key was retrieved from the \'DevExpress_License\' environment variable.';
      case 'envPath':
        return 'The DevExpress license key was retrieved from the \'DevExpress_LicensePath\' environment variable.';
      case 'file':
        return `The DevExpress license key was retrieved from file: "${path}".`;
      default:
        return 'The DevExpress license key was retrieved.';
    }
  },

  keyVerificationFailed: (type?: string, keyVersion?: string, requiredVersion?: string): string => {
    switch (type) {
      case 'incompatibleVersion':
        return `Incompatible DevExpress license key version (v${keyVersion}). Download and register an updated DevExpress license key (v${requiredVersion}+). Clear npm/IDE/NuGet cache and rebuild your project (https://devexpress.com/DX1002).`;
      default:
        return '';
    }
  },

  purchaseLicense: 'Please register an existing license (https://devexpress.com/DX1000) or purchase a new license (https://devexpress.com/Buy/) to continue use of the following DevExpress product libraries: DevExtreme - Included in Subscriptions: Universal, DXperience, ASP.NET and Blazor, DevExtreme Complete.',

  installationInstructions: 'If you own a licensed/registered version or if you are using a 30-day trial version of DevExpress product libraries on a development machine, download your personal license key and verify it with the devextreme-license tool (https://devexpress.com/DX1001).',

  // eslint-disable-next-line spellcheck/spell-checker
  lcxUsedInsteadOfLcp: 'A DevExpress license key has been specified instead of a key generated using devextreme-license.',

  oldDevExtremeKey: 'A DevExtreme key (v25.2 or earlier) has been detected in the GlobalConfig. Generate a key with devextreme-license instead.',

  licenseId: (id: string): string => `License ID: ${id}`,
});

export function logLicenseWarning(
  warningType: LicenseWarningType,
  version: string,
  versionInfo?: { keyVersion: string; requiredVersion: string },
): void {
  const T = TEMPLATES;

  const purchaseLine = `${T.warningPrefix('W0019')} ${T.purchaseLicense}`;
  const installLine = `${T.warningPrefix('W0021')} ${T.installationInstructions}`;

  const warnings: string[][] = [[purchaseLine]];

  const pushToLastGroup = (...items: string[]): void => {
    const lastGroup = warnings[warnings.length - 1];
    if (lastGroup.length === 1) {
      lastGroup.push('', ...items);
    } else {
      lastGroup.push(...items);
    }
  };

  switch (warningType) {
    case 'no-key':
      pushToLastGroup(T.keyNotFound);
      warnings.push([installLine]);
      break;

    case 'invalid-key':
      pushToLastGroup(T.keyVerificationFailed());
      warnings.push([installLine]);
      break;

    case 'lcx-used':
      // eslint-disable-next-line spellcheck/spell-checker
      pushToLastGroup(T.keyVerificationFailed(), T.lcxUsedInsteadOfLcp);
      warnings.push([installLine]);
      break;

    case 'old-devextreme-key':
      pushToLastGroup(T.keyVerificationFailed(), T.oldDevExtremeKey);
      warnings.push([installLine]);
      break;

    case 'version-mismatch': {
      const incompatibleLine = `${T.warningPrefix('W0020')} ${T.keyVerificationFailed('incompatibleVersion', versionInfo?.keyVersion, versionInfo?.requiredVersion)}`;
      pushToLastGroup(T.keyVerificationFailed());
      warnings.push([incompatibleLine]);
      break;
    }

    case 'no-devextreme-license':
      // Only the purchase line, no additional details
      break;
    default:
      break;
  }

  warnings.forEach((group) => {
    console.warn(group.join('\n'));
  });
}
