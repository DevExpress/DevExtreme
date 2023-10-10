/* eslint-disable no-bitwise */
export function base64ToBytes(base64: string): Uint8Array {
  return new Uint8Array(atob(base64).split('').map((s) => s.charCodeAt(0)));
}

export function hexToBytes(string: string): Uint8Array {
  return new Uint8Array(string.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? []);
}

export function stringToBytes(string: string): Uint8Array {
  const bytes = new Uint8Array(string.length);

  for (let k = 0; k < string.length; k += 1) {
    bytes[k] = string.charCodeAt(k) & 0xFF;
  }

  return bytes;
}

export function wordsToBytes(words: Uint32Array): Uint8Array {
  const bytes = new Uint8Array(words.length * 4);

  for (let k = 0; k < bytes.length; k += 1) {
    bytes[k] = words[k >> 2] >>> (8 * (3 - (k % 4)));
  }

  return bytes;
}

export function bytesToWords(bytes: Uint8Array): Uint32Array {
  const words = new Uint32Array((bytes.length - 1 >> 2) + 1);

  for (let k = 0; k < bytes.length; k += 1) {
    words[k >> 2] |= bytes[k] << (8 * (3 - (k % 4)));
  }
  return words;
}

export function wordsToHex(words: Uint32Array): string {
  return [...words].map((w) => w.toString(16).padStart(8, '0')).join('');
}

export function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function leftRotate(x: number, n: number): number {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

export function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}
