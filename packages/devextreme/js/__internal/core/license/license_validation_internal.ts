import type { Token } from './types';

// @ts-expect-error - only for internal usage
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function parseLicenseKey(encodedKey: string | undefined): Token {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function validateLicense(licenseKey: string, version?: string): void {}

// @ts-expect-error - only for internal usage
export function peekValidationPerformed(): boolean {}

export function setLicenseCheckSkipCondition(): void {}

export default {
  validateLicense,
};
