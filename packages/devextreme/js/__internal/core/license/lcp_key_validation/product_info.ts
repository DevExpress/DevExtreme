/* eslint-disable no-bitwise */
export class ProductInfo {
  public version: number;

  public products: bigint;

  constructor(
    version: number,
    products: bigint,
  ) {
    this.version = version;
    this.products = BigInt(products);
  }

  isProduct(...productIds: bigint[]): boolean {
    if (productIds.length === 1) {
      const flag = BigInt(productIds[0]);
      return (this.products & flag) === flag;
    }

    return productIds.some((id) => (this.products & BigInt(id)) === BigInt(id));
  }
}
