import { Token, TokenKind } from './types';

export function parseLicenseKey(): Token {
  return {
    kind: TokenKind.internal,
    internalUsageId: 'internal',
  };
}

export function validateLicense(): void {}

export function setLicenseCheckSkipCondition(): void {}

export default {
  validateLicense,
};
