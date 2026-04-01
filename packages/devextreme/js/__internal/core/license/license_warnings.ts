import type { LicenseWarningType } from './types';

const SOURCE = '[devextreme-license]';

export const TEMPLATES = Object.freeze({
  warningPrefix: (code: string | number): string => `Warning number: ${code}. For evaluation purposes only. Redistribution prohibited.`,

  keyNotFound: 'No valid DevExpress license key was found on this machine.',

  keyWasFound: (type: string, path?: string): string => {
    switch (type) {
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

  keyVerificationFailed: (type?: string, keyVersion?: string, requiredVersion?: string): string => {
    switch (type) {
      case 'incompatibleVersion':
        return `Incompatible DevExpress license key version (${keyVersion}). Download and register an updated DevExpress license key (${requiredVersion}+). Clear npm/IDE/NuGet cache and rebuild your project.`;
      default:
        return 'License key verification has failed.';
    }
  },

  purchaseLicense: (version: string): string => `Purchase a license to continue use of DevExtreme (v${version}). Included in subscriptions: Universal, DXperience, ASP.NET and Blazor, DevExtreme Complete. To purchase a license, visit https://js.devexpress.com/Buy/`,

  installationInstructions: 'If you own a licensed/registered version or if you are using a 30-day trial version of DevExpress product libraries on a development machine, download your personal license key and verify it with the devextreme-license tools. Setup instructions: https://js.devexpress.com/Documentation/Guide/Common/Licensing',

  // eslint-disable-next-line spellcheck/spell-checker
  lcxUsedInsteadOfLcp: 'The .NET license key (LCX) is used instead of the DevExpress license key (LCP).',

  oldDevExtremeKey: 'The invalid/old DevExtreme key is used instead of the DevExpress license key.',

  licenseId: (id: string): string => `License ID: ${id}`,
});

export function logLicenseWarning(
  warningType: LicenseWarningType,
  version: string,
  versionInfo?: { keyVersion: string; requiredVersion: string },
): void {
  const T = TEMPLATES;

  const purchaseLine = `${SOURCE}  ${T.warningPrefix('W0019')} ${T.purchaseLicense(version)}`;
  const installLine = `${SOURCE} ${T.warningPrefix('W0021')} ${T.installationInstructions}`;

  const lines: string[] = [purchaseLine];

  switch (warningType) {
    case 'no-key':
      lines.push('', T.keyNotFound, '', installLine);
      break;

    case 'invalid-key':
      lines.push('', T.keyVerificationFailed(), '', installLine);
      break;

    case 'lcx-used':
      // eslint-disable-next-line spellcheck/spell-checker
      lines.push('', T.keyVerificationFailed(), T.lcxUsedInsteadOfLcp, '', installLine);
      break;

    case 'old-devextreme-key':
      lines.push('', T.keyVerificationFailed(), T.oldDevExtremeKey, '', installLine);
      break;

    case 'version-mismatch': {
      const incompatibleLine = `${SOURCE} ${T.warningPrefix('W0020')} ${T.keyVerificationFailed('incompatibleVersion', versionInfo?.keyVersion, versionInfo?.requiredVersion)}`;
      lines.push('', T.keyVerificationFailed(), '', incompatibleLine);
      break;
    }

    case 'no-devextreme-license':
      // Only the purchase line, no additional details
      break;
    default:
      break;
  }

  console.warn(lines.join('\n'));
}
