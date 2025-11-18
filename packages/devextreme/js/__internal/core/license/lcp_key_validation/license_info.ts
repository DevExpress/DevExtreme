import type { ProductInfo } from './product_info';
import { ProductKind } from './types';

export class LicenseInfo {
  public readonly products: ProductInfo[];

  constructor(products: ProductInfo[] = []) {
    this.products = products;
  }

  get isValid(): boolean {
    return Array.isArray(this.products) && this.products.length > 0;
  }

  findLatestDevExtremeVersion(): number | undefined {
    if (!this.isValid) {
      return undefined;
    }

    const sorted = [...this.products].sort((a, b) => b.version - a.version);

    return sorted.find((p) => p.isProduct(ProductKind.DevExtremeHtmlJs))?.version;
  }
}
