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

type LicenseVerifyResult = 'W0019' | 'W0020' | 'W0021' | 'W0022';

export interface LicenseCheckParams {
  preview: boolean;
  internal?: true;
  error: LicenseVerifyResult | undefined;
}

export interface TrialPanelOptions {
  buyNowUrl: string;
  version: string;
}

export interface CustomTrialPanelOptions {
  customMessagePattern: string;
  customLinkText?: string;
  buyNowUrl?: string;
}

export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
}
