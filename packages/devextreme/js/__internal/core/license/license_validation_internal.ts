/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Token } from './types';

// @ts-expect-error - only for internal usage
export function parseLicenseKey(encodedKey: string | undefined): Token {}

// @ts-expect-error - only for internal usage
export function isUnsupportedKeyFormat(licenseKey: string | undefined): boolean {}

export function validateLicense(licenseKey: string, version?: string): void {}

// @ts-expect-error - only for internal usage
export function peekValidationPerformed(): boolean {}

export function setLicenseCheckSkipCondition(): void {}

export default {
  validateLicense,
};
