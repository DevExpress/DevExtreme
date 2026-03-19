import { isProduct, type ProductInfo } from './product_info';
import { ProductKind } from './types';

export interface LicenseInfo {
  readonly products: ProductInfo[];
}

export function isLicenseValid(info: LicenseInfo): boolean {
  return Array.isArray(info.products) && info.products.length > 0;
}

export function findLatestDevExtremeVersion(info: LicenseInfo): number | undefined {
  if (!isLicenseValid(info)) {
    return undefined;
  }

  const sorted = [...info.products].sort((a, b) => b.version - a.version);

  return sorted.find((p) => isProduct(p, ProductKind.DevExtremeHtmlJs))?.version;
}
