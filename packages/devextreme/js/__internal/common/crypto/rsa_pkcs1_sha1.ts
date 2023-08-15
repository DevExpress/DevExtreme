import sha1 from 'sha1';

const PUBLIC_KEY = {
  e: 65537,
  n: [195,75,254,233,177,137,241,13,85,125,89,41,71,236,22,191,234,165,157,226,170,13,25,143,48,39,28,246,162,219,61,14,68,149,160,15,86,181,133,91,167,185,229,14,195,244,62,88,225,170,15,244,18,232,179,22,95,61,14,104,191,188,116,235,249,15,135,162,89,245,23,246,103,12,133,104,250,95,4,203,233,31,226,169,223,20,227,16,246,236,27,45,154,107,219,169,177,72,81,25,122,87,0,111,212,15,70,183,134,82,163,174,75,0,116,114,204,117,133,216,221,229,247,251,217,20,249,15],
}

// see https://datatracker.ietf.org/doc/html/rfc8017#page-47
const DIGEST_INFO_SHA1 = '0x3021300906052b0e03021a05000414';

export function verify ({ text, signature: signatureBase64 }:{
  text: string;
  signature: string;
}) {
  const signature = bigIntFromBytes(fromBase64(signatureBase64));
  const exponent = BigInt(PUBLIC_KEY.e);
  const modulus = bigIntFromBytes(new Uint8Array(PUBLIC_KEY.n));
  const expected = (signature ** exponent) % modulus;
  
  const actual = bigIntFromBytes(pkcs1pad(new Uint8Array(sha1(text, { asBytes: true }))));
  
  return expected === actual;
};

function pkcs1pad(hash: Uint8Array): Uint8Array {
  const dataLength = (PUBLIC_KEY.n.length * 8 + 6) / 8;
  const data =  concat(bigIntToBytes(BigInt(DIGEST_INFO_SHA1)), hash)
  if (data.length + 10 > dataLength) {
    throw Error('Key is too short for SHA1 signing algorithm');
  }
  
  var pad = new Uint8Array(dataLength - data.length - 1);
  pad.fill(0xff, 0, pad.length - 1);
  pad[0] = 1;
  pad[pad.length - 1] = 0;
  
  return concat(pad, data);
};

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}

function fromBase64(base64: string ): Uint8Array {
  return new Uint8Array(atob(base64).split('').map(s => s.charCodeAt(0)));
}

const ZERO = BigInt(0);
const EIGHT = BigInt(8);

function bigIntToBytes(value: bigint): Uint8Array {
  const array: number[] = [];
  var current = value;
  while (current !== ZERO) {
    array.push(Number(BigInt.asUintN(8, current)));
    current = current >> EIGHT;
  }
  
  return new Uint8Array(array.reverse());
}

function bigIntFromBytes(bytes: Uint8Array): bigint {
  return bytes.reduce((acc, cur) => (acc << EIGHT) + BigInt(cur) , ZERO);
}
