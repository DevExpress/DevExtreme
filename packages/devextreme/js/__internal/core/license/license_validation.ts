import config from '@js/core/config';
import errors from '@js/core/errors';
import { fullVersion } from '@js/core/version';

import type { Version } from '../../utils/version';
import {
  assertedVersionsCompatible,
  parseVersion,
} from '../../utils/version';
import {
  BUY_NOW_LINK, LICENSE_KEY_PLACEHOLDER,
  LICENSING_DOC_LINK, RTM_MIN_PATCH_VERSION, SUBSCRIPTION_NAMES,
} from './const';
import { isProductOnlyLicense, parseDevExpressProductKey } from './lcp_key_validation/lcp_key_validator';
import { logLicenseWarning } from './license_warnings';
import { showTrialPanel } from './trial_panel';
import type {
  LicenseCheckParams,
  Token,
} from './types';
import {
  GENERAL_ERROR,
  TokenKind,
} from './types';

let validationPerformed = false;

export function parseLicenseKey(encodedKey: string | undefined): Token {
  if (encodedKey === undefined) {
    return GENERAL_ERROR;
  }

  if (isProductOnlyLicense(encodedKey)) {
    return parseDevExpressProductKey(encodedKey);
  }

  return GENERAL_ERROR;
}

function isPreview(patch: number): boolean {
  return isNaN(patch) || patch < RTM_MIN_PATCH_VERSION;
}

function hasLicensePrefix(licenseKey: string, prefix: string): boolean {
  return licenseKey.trim().startsWith(prefix);
}

function displayTrialPanel(): void {
  const buyNowLink = config().buyNowLink ?? BUY_NOW_LINK;
  const licensingDocLink = config().licensingDocLink ?? LICENSING_DOC_LINK;
  showTrialPanel(buyNowLink, licensingDocLink, fullVersion, SUBSCRIPTION_NAMES);
}

function getLicenseCheckParams({
  licenseKey,
  version,
}: {
  licenseKey: string | undefined;
  version: Version;
}): LicenseCheckParams {
  let preview = false;

  try {
    preview = isPreview(version.patch);

    const { major, minor } = version;

    if (!licenseKey || licenseKey === LICENSE_KEY_PLACEHOLDER) {
      return { preview, error: 'W0019', warningType: 'no-key' };
    }

    if (hasLicensePrefix(licenseKey, 'LCX')) {
      return { preview, error: 'W0021', warningType: 'lcx-used' };
    }

    if (hasLicensePrefix(licenseKey, 'ewog')) {
      return { preview, error: 'W0021', warningType: 'old-devextreme-key' };
    }

    const license = parseLicenseKey(licenseKey);

    if (license.kind === TokenKind.corrupted) {
      if (license.error === 'product-kind') {
        return { preview, error: 'W0021', warningType: 'no-devextreme-license' };
      }
      return { preview, error: 'W0021', warningType: 'invalid-key' };
    }

    if (license.kind !== TokenKind.verified) {
      return { preview, error: 'W0021', warningType: 'invalid-key' };
    }

    if (!(major && minor)) {
      return { preview, error: 'W0021', warningType: 'invalid-key' };
    }

    if (major * 10 + minor > license.payload.maxVersionAllowed) {
      return {
        preview,
        error: 'W0020',
        warningType: 'version-mismatch',
        maxVersionAllowed: license.payload.maxVersionAllowed,
      };
    }

    return { preview, error: undefined };
  } catch {
    return { preview, error: 'W0021', warningType: 'invalid-key' };
  }
}

export function validateLicense(licenseKey: string, versionStr: string = fullVersion): void {
  if (validationPerformed) {
    return;
  }
  validationPerformed = true;

  const version = parseVersion(versionStr);

  assertedVersionsCompatible(version);

  const {
    error, warningType, maxVersionAllowed,
  } = getLicenseCheckParams({
    licenseKey,
    version,
  });

  if (error) {
    displayTrialPanel();
  }

  if (error) {
    if (warningType) {
      const versionInfo = warningType === 'version-mismatch' && maxVersionAllowed !== undefined
        ? {
          keyVersion: `${Math.floor(maxVersionAllowed / 10)}.${maxVersionAllowed % 10}`,
          requiredVersion: `${version.major}.${version.minor}`,
        }
        : undefined;
      logLicenseWarning(warningType, versionStr, versionInfo);
    } else {
      errors.log(error);
    }
  }
}

export function peekValidationPerformed(): boolean {
  return validationPerformed;
}

export function setLicenseCheckSkipCondition(value = true): void {
  /// #DEBUG
  validationPerformed = value;
  /// #ENDDEBUG
}

// NOTE: We need this default export
// to allow QUnit mock the validateLicense function
export default {
  validateLicense,
};
