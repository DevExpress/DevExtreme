import { Token } from './types';

// @ts-expect-error - only for internal usage
export function parseLicenseKey(): Token {}

export function validateLicense(): void {}

export function setLicenseCheckSkipCondition(): void {}

export default {
  validateLicense,
};
