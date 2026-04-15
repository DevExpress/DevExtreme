export interface License {
  readonly [k: string]: unknown;
  readonly customerId: string;
  readonly maxVersionAllowed: number;
}

export enum TokenKind {
  corrupted = 'corrupted',
  verified = 'verified',
}

export interface ErrorToken {
  readonly kind: TokenKind.corrupted;
  readonly error: 'general' | 'verification' | 'decoding' | 'deserialization' | 'payload' | 'version' | 'product-kind' | 'trial-expired';
}

export interface VerifiedToken {
  readonly kind: TokenKind.verified;
  readonly payload: License;
}

export type Token = ErrorToken | VerifiedToken;

type LicenseVerifyResult = 'W0019' | 'W0020' | 'W0021' | 'W0023';

export const GENERAL_ERROR: ErrorToken = { kind: TokenKind.corrupted, error: 'general' };
export const VERIFICATION_ERROR: ErrorToken = { kind: TokenKind.corrupted, error: 'verification' };
export const DECODING_ERROR: ErrorToken = { kind: TokenKind.corrupted, error: 'decoding' };
export const DESERIALIZATION_ERROR: ErrorToken = { kind: TokenKind.corrupted, error: 'deserialization' };
export const PAYLOAD_ERROR: ErrorToken = { kind: TokenKind.corrupted, error: 'payload' };
export const VERSION_ERROR: ErrorToken = { kind: TokenKind.corrupted, error: 'version' };
export const PRODUCT_KIND_ERROR: ErrorToken = { kind: TokenKind.corrupted, error: 'product-kind' };
export const TRIAL_EXPIRED_ERROR: ErrorToken = { kind: TokenKind.corrupted, error: 'trial-expired' };

export type LicenseWarningType = 'no-key'
  | 'invalid-key'
  | 'lcx-used'
  | 'old-devextreme-key'
  | 'version-mismatch'
  | 'no-devextreme-license'
  | 'trial-expired';

export interface LicenseCheckParams {
  preview: boolean;
  error: LicenseVerifyResult | undefined;
  warningType?: LicenseWarningType;
  maxVersionAllowed?: number;
}
