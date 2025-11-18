/* eslint-disable no-bitwise */
import { MAX_TICKS } from './const';
import { nowTicks } from './utils';

export class ProductInfo {
  public version: number;

  public products: bigint;

  public sourceCodeProducts: bigint;

  public expirationTicks: bigint;

  public licenseExpirationTicks: bigint;

  constructor(
    version: number,
    products: bigint,
    sourceCodeProducts: bigint,
    expirationTicks: bigint,
    licenseExpirationTicks = MAX_TICKS,
  ) {
    this.version = version;
    this.products = BigInt(products);
    this.sourceCodeProducts = BigInt(sourceCodeProducts);
    this.expirationTicks = BigInt(expirationTicks);
    this.licenseExpirationTicks = BigInt(licenseExpirationTicks);
  }

  isProduct(...productIds: bigint[]): boolean {
    if (this.licenseExpirationTicks < nowTicks()) return false;
    if (productIds.length === 1) {
      const flag = BigInt(productIds[0]);
      return (this.products & flag) === flag;
    }
    return productIds.some((id) => (this.products & BigInt(id)) === BigInt(id));
  }

  isVersion(version: number): boolean {
    return this.version === version || this.version === 999;
  }
}
