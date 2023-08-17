import { verify } from './rsa_pkcs1_sha1';

export interface License {
  readonly customerId: string;
  readonly maxVersionAllowed: number;
}

export type Token = {
  readonly kind: 'verified';
  readonly payload: License;
} | {
  readonly kind: 'corrupted';
  readonly error: 'format' | 'verification';
};

const SPLITIER = '.';

const FORMAT_ERROR: Token = { kind: 'corrupted', error: 'format' };
const VERIFICATION_ERROR: Token = { kind: 'corrupted', error: 'verification' };

export function parseToken(encodedToken: string | undefined): Token {
  if (encodedToken === undefined) {
    return FORMAT_ERROR;
  }

  const parts = encodedToken.split(SPLITIER);

  if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
    return FORMAT_ERROR;
  }

  const payload = JSON.parse(atob(parts[0]));

  if (!verify({ text: parts[0], signature: parts[1] })) {
    return VERIFICATION_ERROR;
  }

  return {
    kind: 'verified',
    payload: {
      customerId: payload.customerId,
      maxVersionAllowed: payload.maxVersionAllowed,
    },
  };
}
