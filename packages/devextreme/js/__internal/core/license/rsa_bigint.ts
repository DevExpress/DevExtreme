import { PublicKey } from './key';

const ZERO = BigInt(0);
const EIGHT = BigInt(8);

function bigIntFromBytes(bytes: Uint8Array): bigint {
  // eslint-disable-next-line no-bitwise
  return bytes.reduce((acc, cur) => (acc << EIGHT) + BigInt(cur), ZERO);
}

interface Args {
  key: PublicKey;
  signature: Uint8Array;
  actual: Uint8Array;
}
export function compareSignatures(args: Args): boolean {
  if (typeof BigInt === 'undefined') {
    return true;
  }
  const actual = bigIntFromBytes(args.actual);

  const signature = bigIntFromBytes(args.signature);
  const exponent = BigInt(args.key.e);
  const modulus = bigIntFromBytes(args.key.n);
  const expected = (signature ** exponent) % modulus;

  return expected === actual;
}
