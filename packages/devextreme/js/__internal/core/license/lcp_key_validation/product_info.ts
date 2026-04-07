/* eslint-disable no-bitwise */
export interface ProductInfo {
  readonly version: number;
  readonly products: bigint;
  readonly expiration: number;
}

export function createProductInfo(
  version: number,
  products: bigint,
  expiration = Infinity,
): ProductInfo {
  return { version, products: BigInt(products), expiration };
}

export function isProduct(info: ProductInfo, ...productIds: bigint[]): boolean {
  if (productIds.length === 1) {
    const flag = BigInt(productIds[0]);
    return (info.products & flag) === flag;
  }

  return productIds.some((id) => (info.products & BigInt(id)) === BigInt(id));
}
