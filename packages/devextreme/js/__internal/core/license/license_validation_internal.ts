import { Token } from './types';

// @ts-expect-error - only for internal usage
export function parseLicenseKey(encodedKey: string | undefined): Token {}


export function validateLicense(licenseKey: string, version?: string): void {}

export function setLicenseCheckSkipCondition(): void {}

export default {
  validateLicense,
};
