/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Token } from './types';

export declare function parseLicenseKey(
  encodedKey: string | undefined,
  allowAspNetProductCompatibility?: boolean,
): Token;

export function validateLicense(licenseKey: string, version?: string): void {}

export declare function peekValidationPerformed(): boolean;

export function setLicenseCheckSkipCondition(): void {}

export default {
  validateLicense,
};
