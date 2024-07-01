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

export type Token = {
  readonly kind: TokenKind.verified;
  readonly payload: License;
} | {
  readonly kind: TokenKind.corrupted;
  readonly error: 'general' | 'verification' | 'decoding' | 'deserialization' | 'payload' | 'version';
} | {
  readonly kind: TokenKind.internal;
  readonly internalUsageId: string;
};

export type LicenseVerifyResult = 'W0019' | 'W0020' | 'W0021' | 'W0022';
