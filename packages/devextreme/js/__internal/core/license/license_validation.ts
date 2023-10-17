import errors from '@js/core/errors';
import { version as packageVersion } from '@js/core/version';

import { base64ToBytes } from './byte_utils';
import { PUBLIC_KEY } from './key';
import { pad } from './pkcs1';
import { compareSignatures } from './rsa_bigint';
import { sha1 } from './sha1';

export interface License {
  readonly [k: string]: unknown;
  readonly customerId: string;
  readonly maxVersionAllowed: number;
}

interface Payload extends Partial<License> {
  readonly format?: number;
}

const enum TokenKind {
  corrupted = 'corrupted',
  verified = 'verified',
}

export type Token = {
  readonly kind: TokenKind.verified;
  readonly payload: License;
} | {
  readonly kind: TokenKind.corrupted;
  readonly error: 'general' | 'verification' | 'decoding' | 'deserialization' | 'payload' | 'version';
};
export type LicenseVerifyResult = 'W0019' | 'W0020' | 'W0021' | null;

const SPLITTER = '.';
const FORMAT = 1;

const GENERAL_ERROR: Token = { kind: TokenKind.corrupted, error: 'general' };
const VERIFICATION_ERROR: Token = { kind: TokenKind.corrupted, error: 'verification' };
const DECODING_ERROR: Token = { kind: TokenKind.corrupted, error: 'decoding' };
const DESERIALIZATION_ERROR: Token = { kind: TokenKind.corrupted, error: 'deserialization' };
const PAYLOAD_ERROR: Token = { kind: TokenKind.corrupted, error: 'payload' };
const VERSION_ERROR: Token = { kind: TokenKind.corrupted, error: 'version' };

let isLicenseVerified = false;

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

export function verifyLicense(licenseKey: string, version: string = packageVersion): void {
  if (isLicenseVerified) {
    return;
  }
  isLicenseVerified = true;

  let warning: LicenseVerifyResult = null;

  try {
    if (!licenseKey) {
      warning = 'W0019';
      return;
    }

    const license = parseLicenseKey(licenseKey);

    if (license.kind === TokenKind.corrupted) {
      warning = 'W0021';
      return;
    }

    const [major, minor] = version.split('.').map(Number);

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
  isLicenseVerified = value;
  /// #ENDDEBUG
}

// NOTE: We need this default export
// to allow QUnit mock the verifyLicense function
export default {
  verifyLicense,
};
