
import BigInteger from './jsbn';
import sha1 from 'sha1';

// see https://datatracker.ietf.org/doc/html/rfc8017#page-47
const DIGEST_INFO_SHA1 = '3021300906052b0e03021a05000414';
const PUBLIC_KEY = {
  e: 65537,
  n: [195,75,254,233,177,137,241,13,85,125,89,41,71,236,22,191,234,165,157,226,170,13,25,143,48,39,28,246,162,219,61,14,68,149,160,15,86,181,133,91,167,185,229,14,195,244,62,88,225,170,15,244,18,232,179,22,95,61,14,104,191,188,116,235,249,15,135,162,89,245,23,246,103,12,133,104,250,95,4,203,233,31,226,169,223,20,227,16,246,236,27,45,154,107,219,169,177,72,81,25,122,87,0,111,212,15,70,183,134,82,163,174,75,0,116,114,204,117,133,216,221,229,247,251,217,20,249,15],
}

export function verify({ text, signature: encodedSignature }:{
  text: string;
  signature: string;
}) {
  const actual = pkcs1pad(new Uint8Array(sha1(text, { asBytes: true })));

  // add zero to make in positive-signed
  const signature = new BigInteger([0, ...fromBase64String(encodedSignature)]);
  const exponent = PUBLIC_KEY.e;
  const modulus = new BigInteger([0, ...PUBLIC_KEY.n]);
  const expected = signature.modPowInt(exponent, modulus);

  return bytesAreEqual(expected.toByteArray(), actual);
};

function pkcs1pad(hash: Uint8Array): Uint8Array {
  const dataLength = (PUBLIC_KEY.n.length * 8 + 6) / 8;
  const data =  concat(fromHexString(DIGEST_INFO_SHA1), hash)
  if (data.length + 10 > dataLength) {
    throw Error('Key is too short for SHA1 signing algorithm');
  }

  var pad = new Uint8Array(dataLength - data.length - 1);
  pad.fill(0xff, 0, pad.length - 1);
  pad[0] = 1;
  pad[pad.length - 1] = 0;

  return concat(pad, data);
};

type Bytes = Uint8Array | number[];

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

  for(let k = 0; k < a.length; k += 1) {
    if(((a[k] ^ b[k]) & 0xFF) !== 0) {
      return false;
    }
  }

  return true;
}

function fromHexString (string: string): number[] {
  return string.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16));
}

function fromBase64String(base64: string): number[] {
  return atob(base64).split('').map(s => s.charCodeAt(0));
}
