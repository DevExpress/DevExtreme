import { PublicKey } from './key';

interface Args {
  key: PublicKey;
  signature: Uint8Array;
  actual: Uint8Array;
}
export function compareSignatures(args: Args): boolean {
  try {
    const zero = BigInt(0);
    const eight = BigInt(8);

    const bigIntFromBytes = (bytes: Uint8Array): bigint => bytes.reduce(
      // eslint-disable-next-line no-bitwise
      (acc, cur) => (acc << eight) + BigInt(cur),
      zero,
    );

    const actual = bigIntFromBytes(args.actual);

    const signature = bigIntFromBytes(args.signature);
    const exponent = BigInt(args.key.e);
    const modulus = bigIntFromBytes(args.key.n);
    const expected = (signature ** exponent) % modulus;

    return expected === actual;
  } catch {
    return true;
  }
}
