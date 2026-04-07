import config from '@js/core/config';
import errors from '@js/core/errors';
import { fullVersion } from '@js/core/version';

import type { Version } from '../../utils/version';
import {
  assertedVersionsCompatible,
  getPreviousMajorVersion,
  parseVersion,
} from '../../utils/version';
import { base64ToBytes } from './byte_utils';
import {
  BUY_NOW_LINK, FORMAT, KEY_SPLITTER, LICENSE_KEY_PLACEHOLDER,
  LICENSING_DOC_LINK, RTM_MIN_PATCH_VERSION, SUBSCRIPTION_NAMES,
} from './const';
import { INTERNAL_USAGE_ID, PUBLIC_KEY } from './key';
import { isProductOnlyLicense, parseDevExpressProductKey } from './lcp_key_validation/lcp_key_validator';
import { logLicenseWarning } from './license_warnings';
import { pad } from './pkcs1';
import { compareSignatures } from './rsa_bigint';
import { sha1 } from './sha1';
import { showTrialPanel } from './trial_panel';
import type {
  License,
  LicenseCheckParams,
  Token,
} from './types';
import {
  DECODING_ERROR,
  DESERIALIZATION_ERROR,
  GENERAL_ERROR,
  PAYLOAD_ERROR,
  TokenKind,
  VERIFICATION_ERROR,
  VERSION_ERROR,
} from './types';

interface Payload extends Partial<License> {
  readonly format?: number;
  readonly internalUsageId?: string;
}

let validationPerformed = false;

// verifies RSASSA-PKCS1-v1.5 signature
function verifySignature({ text, signature: encodedSignature }: {
  text: string;
  signature: string;
}): boolean {
  return compareSignatures({
    key: PUBLIC_KEY,
    signature: base64ToBytes(encodedSignature),
    actual: pad(sha1(text)),
  });
}

export function parseLicenseKey(encodedKey: string | undefined): Token {
  if (encodedKey === undefined) {
    return GENERAL_ERROR;
  }

  if (isProductOnlyLicense(encodedKey)) {
    return parseDevExpressProductKey(encodedKey);
  }

  const parts = encodedKey.split(KEY_SPLITTER);

  if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
    return GENERAL_ERROR;
  }

  if (!verifySignature({ text: parts[0], signature: parts[1] })) {
    return VERIFICATION_ERROR;
  }

  let decodedPayload = '';
  try {
    decodedPayload = atob(parts[0]);
  } catch {
    return DECODING_ERROR;
  }

  let payload: Payload = {};
  try {
    payload = JSON.parse(decodedPayload);
  } catch {
    return DESERIALIZATION_ERROR;
  }

  const {
    customerId, maxVersionAllowed, format, internalUsageId, ...rest
  } = payload;

  if (internalUsageId !== undefined) {
    return {
      kind: TokenKind.internal,
      internalUsageId,
    };
  }

  if (customerId === undefined || maxVersionAllowed === undefined || format === undefined) {
    return PAYLOAD_ERROR;
  }

  if (format !== FORMAT) {
    return VERSION_ERROR;
  }

  return {
    kind: TokenKind.verified,
    payload: {
      customerId,
      maxVersionAllowed,
      ...rest,
    },
  };
}

function isPreview(patch: number): boolean {
  return isNaN(patch) || patch < RTM_MIN_PATCH_VERSION;
}

function hasLicensePrefix(licenseKey: string, prefix: string): boolean {
  return licenseKey.trim().startsWith(prefix);
}

export function isUnsupportedKeyFormat(licenseKey: string | undefined): boolean {
  if (!licenseKey) {
    return false;
  }

  if (hasLicensePrefix(licenseKey, 'LCXv1')) {
    errors.log('W0000', 'config', 'licenseKey', 'LCXv1 is specified in the license key');
    return true;
  }

  return false;
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

    const { major, minor } = preview ? getPreviousMajorVersion(version) : version;

    if (!licenseKey || licenseKey === LICENSE_KEY_PLACEHOLDER) {
      return { preview, error: 'W0019', warningType: 'no-key' };
    }

    if (hasLicensePrefix(licenseKey, 'LCX')) {
      return { preview, error: 'W0021', warningType: 'lcx-used' };
    }

    const license = parseLicenseKey(licenseKey);

    if (license.kind === TokenKind.corrupted) {
      if (license.error === 'product-kind') {
        return { preview, error: 'W0021', warningType: 'no-devextreme-license' };
      }
      if (license.error === 'trial-expired') {
        return { preview, error: 'W0020', warningType: 'trial-expired' };
      }
      return { preview, error: 'W0021', warningType: 'invalid-key' };
    }

    if (license.kind === TokenKind.internal) {
      return { preview, internal: true, error: license.internalUsageId === INTERNAL_USAGE_ID ? undefined : 'W0020' };
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

  const versionsCompatible = assertedVersionsCompatible(version);

  const {
    internal, error, warningType, maxVersionAllowed,
  } = getLicenseCheckParams({
    licenseKey,
    version,
  });

  if (!versionsCompatible && internal) {
    return;
  }

  if (error && !internal) {
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
