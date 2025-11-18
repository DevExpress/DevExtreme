import type { ProductInfo } from './product_info';

export class LicenseInfo {
  public readonly products: ProductInfo[];

  public readonly productLicenseString: string;

  public licenseId: string;

  readonly #cache: Map<number, ProductInfo[]>;

  constructor(products: ProductInfo[] = [], productLicenseString = '', licenseId = '') {
    this.products = products;
    this.productLicenseString = productLicenseString;
    this.licenseId = licenseId;
    this.#cache = new Map();
  }

  get isValid(): boolean {
    return Array.isArray(this.products) && this.products.length > 0;
  }

  getProducts(version: number): ProductInfo[] {
    if (this.#cache.has(version)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.#cache.get(version)!;
    }
    const result = this.#findBestVersion(version);
    this.#cache.set(version, result);
    return result;
  }

  hasLicense(version: number, ...productIds: bigint[]): boolean {
    if (!this.isValid) return false;
    const ids = productIds.map((id) => BigInt(id));
    return this.getProducts(version).some((product) => product.isProduct(...ids));
  }

  #findBestVersion(version: number): ProductInfo[] {
    if (!this.products || this.products.length === 0) return [];
    const exact = this.products.filter((p) => p.isVersion(version));
    if (exact.length) return exact;
    const sorted = [...this.products].sort((a, b) => b.version - a.version);
    const max = sorted[0];
    if (max.version < version) return [];
    return [max];
  }
}
