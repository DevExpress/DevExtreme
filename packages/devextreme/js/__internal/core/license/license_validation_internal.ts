/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Token } from './types';

export function parseLicenseKey(
  encodedKey: string | undefined,
  acceptAspNetEntitlement?: boolean,
): Token {
  return undefined as unknown as Token;
}

export function validateLicense(licenseKey: string, version?: string): void {}

export function peekValidationPerformed(): boolean {
  return false;
}

export function setLicenseCheckSkipCondition(): void {}

export default {
  validateLicense,
};
