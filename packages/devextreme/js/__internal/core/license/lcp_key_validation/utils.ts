/* eslint-disable spellcheck/spell-checker, no-bitwise */
import { base64ToBytes, bigIntFromBytes } from '../byte_utils';
import type { PublicKey } from '../key';
import { pad } from '../pkcs1';
import { compareSignatures } from '../rsa_bigint';
import { sha1 } from '../sha1';
import { DECODE_MAP } from './const';

export const bit = (shift: number): bigint => BigInt(1) << BigInt(shift);

export const parseRsaXml = (xml: string): { modulus: Uint8Array; exponent: number } => {
  const modulusMatch = /<Modulus>([^<]+)<\/Modulus>/.exec(xml);
  const exponentMatch = /<Exponent>([^<]+)<\/Exponent>/.exec(xml);

  if (!modulusMatch || !exponentMatch) {
    throw new Error('Invalid RSA XML key.');
  }

  return {
    modulus: base64ToBytes(modulusMatch[1]),
    exponent: Number(bigIntFromBytes(base64ToBytes(exponentMatch[1]))),
  };
};

export const encodeString = (
  text: string,
  encode: (s: string) => string,
): string => (
  typeof encode === 'function' ? encode(text) : text
);

export const shiftText = (text: string, map: string): string => {
  if (!text) {
    return text || '';
  }

  let result = '';

  for (let i = 0; i < text.length; i += 1) {
    const charCode = text.charCodeAt(i);

    if (charCode < map.length) {
      result += map[charCode];
    } else {
      result += text[i];
    }
  }

  return result;
};

export const shiftDecodeText = (text: string): string => shiftText(text, DECODE_MAP);

const DOT_NET_TICKS_EPOCH_OFFSET = BigInt('621355968000000000');
const DOT_NET_TICKS_PER_MS = BigInt(10000);
const DOT_NET_MAX_VALUE_TICKS = BigInt('3155378975999999999');

export function dotNetTicksToMs(ticksStr: string): number {
  const ticks = BigInt(ticksStr);
  if (ticks >= DOT_NET_MAX_VALUE_TICKS) return Infinity;
  return Number((ticks - DOT_NET_TICKS_EPOCH_OFFSET) / DOT_NET_TICKS_PER_MS);
}

export const verifyHash = (xmlKey: string, data: string, signature: string): boolean => {
  const { modulus, exponent } = parseRsaXml(xmlKey);

  const key: PublicKey = {
    n: modulus,
    e: exponent,
  };

  const sign = base64ToBytes(signature);

  return compareSignatures({
    key,
    signature: sign,
    actual: pad(sha1(data)),
  });
};
