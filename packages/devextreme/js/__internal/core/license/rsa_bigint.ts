import type { PublicKey } from './key';

interface Args {
  key: PublicKey;
  signature: Uint8Array;
  actual: Uint8Array;
}
export function compareSignatures(args: Args): boolean {
  try {
    const zero = BigInt(0);
    const one = BigInt(1);
    const eight = BigInt(8);

    const modExp = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
      let result = one;
      let b = base;
      let e = exponent;

      while (e) {
        if (e & one) { // eslint-disable-line no-bitwise
          result = (result * b) % modulus;
        }
        b = (b * b) % modulus;
        e >>= one; // eslint-disable-line no-bitwise
      }

      return result;
    };

    const bigIntFromBytes = (bytes: Uint8Array): bigint => bytes.reduce(
      (acc, cur) => (acc << eight) + BigInt(cur), // eslint-disable-line no-bitwise
      zero,
    );

    const actual = bigIntFromBytes(args.actual);

    const signature = bigIntFromBytes(args.signature);
    const exponent = BigInt(args.key.e);
    const modulus = bigIntFromBytes(args.key.n);
    const expected = modExp(signature, exponent, modulus);

    return expected === actual;
  } catch {
    return true;
  }
}
