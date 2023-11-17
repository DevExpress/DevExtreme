import errors from '@js/core/errors';
import { version as packageVersion } from '@js/core/version';

import { base64ToBytes } from './byte_utils';
import { PUBLIC_KEY } from './key';
import { pad } from './pkcs1';
import { compareSignatures } from './rsa_bigint';
import { sha1 } from './sha1';
import {
  License, LicenseVerifyResult, Token, TokenKind,
} from './types';

interface Payload extends Partial<License> {
  readonly format?: number;
}

const SPLITTER = '.';
const FORMAT = 1;
const RTM_MIN_PATCH_VERSION = 3;

const GENERAL_ERROR: Token = { kind: TokenKind.corrupted, error: 'general' };
const VERIFICATION_ERROR: Token = { kind: TokenKind.corrupted, error: 'verification' };
const DECODING_ERROR: Token = { kind: TokenKind.corrupted, error: 'decoding' };
const DESERIALIZATION_ERROR: Token = { kind: TokenKind.corrupted, error: 'deserialization' };
const PAYLOAD_ERROR: Token = { kind: TokenKind.corrupted, error: 'payload' };
const VERSION_ERROR: Token = { kind: TokenKind.corrupted, error: 'version' };

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

  const parts = encodedKey.split(SPLITTER);

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
    customerId, maxVersionAllowed, format, ...rest
  } = payload;

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

export function validateLicense(licenseKey: string, version: string = packageVersion): void {
  if (validationPerformed) {
    return;
  }
  validationPerformed = true;

  // eslint-disable-next-line @typescript-eslint/init-declarations
  let warning: LicenseVerifyResult | undefined;

  try {
    const [major, minor, patch] = version.split('.').map(Number);
    const preview = isNaN(patch) || patch < RTM_MIN_PATCH_VERSION;

    if (preview) {
      warning = 'W0022';
      return;
    }

    if (!licenseKey) {
      warning = 'W0019';
      return;
    }

    const license = parseLicenseKey(licenseKey);

    if (license.kind === TokenKind.corrupted) {
      warning = 'W0021';
      return;
    }

    if (!(major && minor)) {
      warning = 'W0021';
      return;
    }

    if (major * 10 + minor > license.payload.maxVersionAllowed) {
      warning = 'W0020';
    }
  } catch (e) {
    warning = 'W0021';
  } finally {
    if (warning) {
      errors.log(warning);
    }
  }
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
