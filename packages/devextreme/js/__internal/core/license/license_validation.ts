import errors from '@js/core/errors';
import { version as packageVersion } from '@js/core/version';

import { verify } from './rsa_pkcs1_sha1';

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

export function parseToken(encodedToken: string | undefined): Token {
  if (encodedToken === undefined) {
    return GENERAL_ERROR;
  }

  const parts = encodedToken.split(SPLITTER);

  if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
    return GENERAL_ERROR;
  }

  if (!verify({ text: parts[0], signature: parts[1] })) {
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

export function verifyLicense(licenseToken: string, version: string = packageVersion): void {
  if (isLicenseVerified) {
    return;
  }
  isLicenseVerified = true;

  let warning: LicenseVerifyResult = null;

  try {
    if (!licenseToken) {
      warning = 'W0019';
      return;
    }

    const license = parseToken(licenseToken);

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

/// #DEBUG
export function setLicenseCheckSkipCondition(value = true): void {
  isLicenseVerified = value;
}
/// #ENDDEBUG

// NOTE: We need this default export
// to allow QUnit mock the verifyLicense function
export default {
  verifyLicense,
};
