import { Token, TokenKind } from './types';

export function parseLicenseKey(): Token {
  return {
    kind: TokenKind.verified,
    payload: {
      customerId: '',
      maxVersionAllowed: 0,
    },
  };
}

export function validateLicense(): void {}

export function setLicenseCheckSkipCondition(): void {}

export default {
  validateLicense,
};
