import errors from '@js/core/errors';

import { LIBRARIES, NBSP, SUBSCRIPTION_NAMES } from './const';
import type { LicenseWarningType } from './types';

export const SUBSCRIPTIONS = SUBSCRIPTION_NAMES.split(NBSP).join(' ');
const BUY_LINK = 'https://devexpress.com/BUY';

export interface LicenseDetails {
  licenseId: string;
  licenseKey: string;
}

const getContinueUseText = (docCode: string): string => `Please register a valid license (https://devexpress.com/${docCode}) or purchase a new license (${BUY_LINK}) to continue use of the following DevExpress product libraries: ${LIBRARIES} - Included in Subscriptions: ${SUBSCRIPTIONS}.`;

export const TEMPLATES = Object.freeze({
  licenseDetails: (details?: LicenseDetails): string => (details
    ? ` License ID: ${details.licenseId}. License Source: Public Key (${details.licenseKey}).`
    : ''),

  purchaseLicense: (version: string): string => `For evaluation purposes only (v${version}). Redistribution prohibited. ${getContinueUseText('DX1000')}`,

  warningPrefix: (code: string | number): string => `${code} -`,

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
        return `Incompatible DevExpress license key version (v${keyVersion}). Use and Redistribution prohibited. Download and register an updated DevExpress license key (v${requiredVersion}+). Clear npm/IDE/NuGet cache and rebuild your project (https://devexpress.com/DX1002).`;
      default:
        return '';
    }
  },

  installationInstructions: (version: string): string => `License key is missing or uses invalid format (v${version}). Use and Redistribution prohibited. If you own a licensed/registered version or if you are using a 30-day trial version of DevExpress product libraries on a development machine, download your personal license key (https://devexpress.com/DX1001) and verify it with the devextreme-license tool.`,

  // eslint-disable-next-line spellcheck/spell-checker
  lcxUsedInsteadOfLcp: 'A DevExpress license key has been specified instead of a key generated using devextreme-license.',

  oldDevExtremeKey: 'A DevExtreme key (v25.2 or earlier) has been detected in the GlobalConfig. Generate a key with devextreme-license instead.',

  licenseId: (id: string): string => `License ID: ${id}`,
});

export function logLicenseWarning(
  warningType: LicenseWarningType,
  version: string,
  versionInfo?: { keyVersion: string; requiredVersion: string },
  details?: LicenseDetails,
): void {
  const T = TEMPLATES;

  if (warningType === 'trial-expired') {
    errors.log('E0124', version, LIBRARIES, SUBSCRIPTIONS, T.licenseDetails(details));
    return;
  }

  const purchaseDetails = warningType === 'version-mismatch' ? '' : T.licenseDetails(details);
  const purchaseLine = `${T.warningPrefix('W0019')} ${T.purchaseLicense(version)}${purchaseDetails}`;
  const installLine = `${T.warningPrefix('W0021')} ${T.installationInstructions(version)}`;

  const warnings: string[][] = [[purchaseLine]];

  const pushToLastGroup = (...items: string[]): void => {
    const lastGroup = warnings[warnings.length - 1];
    const notEmptyItems = items.filter((item) => !!item);

    if (lastGroup.length === 1) {
      lastGroup.push('', ...notEmptyItems);
    } else {
      lastGroup.push(...notEmptyItems);
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
      const incompatibleLine = `${T.warningPrefix('W0020')} ${T.keyVerificationFailed('incompatibleVersion', versionInfo?.keyVersion, versionInfo?.requiredVersion)}${T.licenseDetails(details)}`;
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
