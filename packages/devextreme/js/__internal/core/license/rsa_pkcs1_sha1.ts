import sha1 from 'sha-1';

import BigInteger from './jsbn';

type Bytes = Uint8Array | number[];

// see https://datatracker.ietf.org/doc/html/rfc8017#page-47
const ASN1_SHA1 = '3021300906052b0e03021a05000414';
const PUBLIC_KEY = {
  e: 65537,
  n: [
    202, 208, 20, 244, 235, 89, 121, 253, 219, 161, 162, 26, 166, 22, 65, 81, 176, 0, 101, 246,
    34, 101, 128, 51, 224, 52, 194, 227, 113, 10, 4, 96, 201, 33, 171, 251, 204, 57, 164, 28, 89,
    249, 191, 46, 170, 74, 37, 125, 216, 95, 240, 125, 69, 31, 134, 79, 101, 62, 25, 30, 162, 31,
    206, 104, 92, 42, 35, 164, 93, 97, 197, 198, 239, 225, 249, 146, 119, 88, 20, 76, 219, 218,
    113, 0, 29, 246, 132, 116, 37, 252, 113, 87, 200, 99, 171, 146, 136, 182, 216, 226, 97, 67,
    85, 126, 103, 117, 236, 49, 60, 32, 109, 91, 139, 166, 1, 152, 228, 36, 182, 167, 19, 106,
    72, 62, 186, 243, 199, 73,
  ],
};

function fromHexString(string: string): number[] {
  return string.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? [];
}

function concat(a: Bytes, b: Bytes): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}

function bytesAreEqual(a: Bytes, b: Bytes): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let k = 0; k < a.length; k += 1) {
    if (((a[k] ^ b[k]) & 0xff) !== 0) { // eslint-disable-line no-bitwise
      return false;
    }
  }

  return true;
}
// PKCS #1 v1.5
// 0x00 0x01 P 0x00 A H
// P - padding string (0xff...0xff)
// A - ASN.1 encoding of the hash algorithm used
// H - hash value
function pad(hash: Uint8Array): Uint8Array {
  const dataLength = (PUBLIC_KEY.n.length * 8 + 6) / 8;
  const data = concat(fromHexString(ASN1_SHA1), hash);
  if (data.length + 10 > dataLength) {
    throw Error('Key is too short for SHA1 signing algorithm');
  }

  const padding = new Uint8Array(dataLength - data.length);
  padding.fill(0xff, 0, padding.length - 1);
  padding[0] = 0;
  padding[1] = 1;
  padding[padding.length - 1] = 0;

  return concat(padding, data);
}

function fromBase64String(base64: string): number[] {
  return atob(base64).split('').map((s) => s.charCodeAt(0));
}

function normalizeBigIntegerBytes(bytes: number[]): number[] {
  return [0, ...bytes]; // add zero to make it positive-signed
}

// verifies RSASSA-PKCS1-v1.5 signature
export function verify({ text, signature: encodedSignature }: {
  text: string;
  signature: string;
}): boolean {
  const actual = pad(new Uint8Array(fromHexString(sha1(text))));

  const signature = new BigInteger(normalizeBigIntegerBytes(fromBase64String(encodedSignature)));
  const exponent = PUBLIC_KEY.e;
  const modulus = new BigInteger(normalizeBigIntegerBytes(PUBLIC_KEY.n));
  const expected = signature.modPowInt(exponent, modulus);

  return bytesAreEqual(normalizeBigIntegerBytes(expected.toByteArray()), actual);
}
