import { verify } from './rsa_pkcs1_sha1';

export interface License {
  readonly customerId: string;
  readonly maxVersionAllowed: number;
  readonly [k: string]: unknown;
}

interface Payload extends Partial<License> {
  readonly format?: number;
}

export type Token = {
  readonly kind: 'verified';
  readonly payload: License;
} | {
  readonly kind: 'corrupted';
  readonly error: 'general' | 'verification' | 'decoding' | 'deserialization' | 'payload' | 'version';
};

const SPLITIER = '.';
const FORMAT = 1;

const GENERAL_ERROR: Token = { kind: 'corrupted', error: 'general' };
const VERIFICATION_ERROR: Token = { kind: 'corrupted', error: 'verification' };
const DECODING_ERROR: Token = { kind: 'corrupted', error: 'decoding' };
const DESERIALIZATION_ERROR: Token = { kind: 'corrupted', error: 'deserialization' };
const PAYLOAD_ERROR: Token = { kind: 'corrupted', error: 'payload' };
const VERSION_ERROR: Token = { kind: 'corrupted', error: 'version' };

export function parseToken(encodedToken: string | undefined): Token {
  if (encodedToken === undefined) {
    return GENERAL_ERROR;
  }

  const parts = encodedToken.split(SPLITIER);

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
    kind: 'verified',
    payload: {
      customerId,
      maxVersionAllowed,
      ...rest,
    },
  };
}
