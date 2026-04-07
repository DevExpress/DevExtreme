export interface License {
  readonly [k: string]: unknown;
  readonly customerId: string;
  readonly maxVersionAllowed: number;
}

export enum TokenKind {
  corrupted = 'corrupted',
  verified = 'verified',
  internal = 'internal',
}

export interface ErrorToken {
  readonly kind: TokenKind.corrupted;
  readonly error: 'general' | 'verification' | 'decoding' | 'deserialization' | 'payload' | 'version' | 'product-kind' | 'trial-expired';
}

export interface VerifiedToken {
  readonly kind: TokenKind.verified;
  readonly payload: License;
}

export interface InternalToken {
  readonly kind: TokenKind.internal;
  readonly internalUsageId: string;
}

export type Token = ErrorToken | VerifiedToken | InternalToken;

type LicenseVerifyResult = 'W0019' | 'W0020' | 'W0021' | 'W0022' | 'W0023' | 'W0024';

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
  internal?: true;
  error: LicenseVerifyResult | undefined;
  warningType?: LicenseWarningType;
  maxVersionAllowed?: number;
}
