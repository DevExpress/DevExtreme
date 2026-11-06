import { isProduct, type ProductInfo } from './product_info';
import { ProductKind } from './types';

export interface LicenseInfo {
  readonly products: ProductInfo[];
}

export function isLicenseValid(info: LicenseInfo): boolean {
  return Array.isArray(info.products) && info.products.length > 0;
}

export function getMaxExpiration(info: LicenseInfo): number {
  const expirationDates = info.products
    .map((p) => p.expiration)
    .filter((e) => e > 0 && e !== Infinity);
  if (expirationDates.length === 0) return Infinity;
  return Math.max(...expirationDates);
}

export function getDevExtremeProductKinds(acceptAspNetEntitlement = false): bigint[] {
  return acceptAspNetEntitlement
    ? [ProductKind.DevExtremeHtmlJs, ProductKind.DevExtremeAspNet]
    : [ProductKind.DevExtremeHtmlJs];
}

export function findLatestDevExtremeVersion(
  info: LicenseInfo,
  acceptAspNetEntitlement = false,
): number | undefined {
  if (!isLicenseValid(info)) {
    return undefined;
  }

  const productKinds = getDevExtremeProductKinds(acceptAspNetEntitlement);
  const sorted = [...info.products].sort((a, b) => b.version - a.version);

  return sorted.find((p) => isProduct(p, ...productKinds))?.version;
}

const TRIAL_EXPIRATION_TOLERANCE_MS = 3 * 24 * 60 * 60 * 1000;

function findApplicableProducts(info: LicenseInfo, versionCode: number): ProductInfo[] {
  return info.products.filter((p) => p.version >= versionCode);
}

export function isTrialExpired(
  info: LicenseInfo,
  versionCode: number,
  productKinds: bigint[],
  now = Date.now(),
): boolean {
  if (!isLicenseValid(info)) {
    return false;
  }

  const applicable = findApplicableProducts(info, versionCode);

  if (applicable.some((p) => isProduct(p, ...productKinds))) {
    return false;
  }

  const trialEnds = applicable.map((p) => p.expiration).filter((e) => e > 0);

  if (!trialEnds.length) {
    return false;
  }

  return Math.max(...trialEnds) < now - TRIAL_EXPIRATION_TOLERANCE_MS;
}
