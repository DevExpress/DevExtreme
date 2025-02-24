/* eslint-disable @stylistic/max-len */
import { describe, expect, it } from '@jest/globals';

import {
  base64ToBytes,
  bytesToHex,
  bytesToWords,
  concatBytes,
  hexToBytes,
  leftRotate,
  stringToBytes,
  wordsToBytes,
  wordsToHex,
} from './byte_utils';

describe('byte utils', () => {
  it.each([
    { value: 0b1, count: 1, expected: 0b10 },
    { value: 0b1, count: 2, expected: 0b100 },
    { value: 0b1, count: 32, expected: 0b1 },
    { value: 0b11011111111111111111111111111110, count: 4, expected: 0b11111111111111111111111111101101 },
  ])('performs left rotation', ({ value, count, expected }) => {
    expect(leftRotate(value, count)).toBe(expected);
  });

  it.each([
    { value: '', expected: [] },
    { value: 'L', expected: [76] },
    { value: 'abc', expected: [97, 98, 99] },
    { value: 'Lorem ipsum dolor sit amet', expected: [76, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109, 32, 100, 111, 108, 111, 114, 32, 115, 105, 116, 32, 97, 109, 101, 116] },
  ])('gets bytes from string', ({ value, expected }) => {
    expect(stringToBytes(value).toString()).toBe(expected.toString());
  });

  it.each([
    { value: '', expected: [] },
    { value: 'TA==', expected: [76] },
    { value: 'YWJj', expected: [97, 98, 99] },
    { value: 'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQ=', expected: [76, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109, 32, 100, 111, 108, 111, 114, 32, 115, 105, 116, 32, 97, 109, 101, 116] },
  ])('gets bytes from base64 string', ({ value, expected }) => {
    expect(base64ToBytes(value)).toEqual(new Uint8Array(expected));
  });

  it.each([
    { value: '', expected: [] },
    { value: '4c', expected: [76] },
    { value: '616263', expected: [97, 98, 99] },
    { value: '4c6f72656d20697073756d20646f6c6f722073697420616d6574', expected: [76, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109, 32, 100, 111, 108, 111, 114, 32, 115, 105, 116, 32, 97, 109, 101, 116] },
  ])('gets bytes from hex string', ({ value, expected }) => {
    expect(hexToBytes(value)).toEqual(new Uint8Array(expected));
  });

  it.each([
    { value: [], expected: [] },
    { value: [0x4c000000], expected: [76, 0, 0, 0] },
    { value: [0x4c6f0000], expected: [76, 111, 0, 0] },
    { value: [0x4c6f7200], expected: [76, 111, 114, 0] },
    { value: [0x4c6f7265], expected: [76, 111, 114, 101] },
    { value: [0x4c6f7265, 0x6d000000], expected: [76, 111, 114, 101, 109, 0, 0, 0] },
    { value: [0x66f7265, 0x6d206970, 0x73756d00], expected: [6, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109, 0] },
  ])('converts words to bytes', ({ value, expected }) => {
    expect(wordsToBytes(new Uint32Array(value))).toEqual(new Uint8Array(expected));
  });

  it.each([
    { value: [], expected: [] },
    { value: [76], expected: [0x4c000000] },
    { value: [76, 111], expected: [0x4c6f0000] },
    { value: [76, 111, 114], expected: [0x4c6f7200] },
    { value: [76, 111, 114, 101], expected: [0x4c6f7265] },
    { value: [76, 111, 114, 101, 109], expected: [0x4c6f7265, 0x6d000000] },
    { value: [6, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109], expected: [0x66f7265, 0x6d206970, 0x73756d00] },
  ])('converts bytes to words', ({ value, expected }) => {
    expect(bytesToWords(new Uint8Array(value)).toString()).toBe(expected.toString());
  });

  it.each([
    { value: [], expected: '' },
    { value: [0x4c6f7265], expected: '4c6f7265' },
    { value: [0x66f7265, 0x6d206970, 0x73756d00], expected: '066f72656d20697073756d00' },
  ])('converts words to hex string', ({ value, expected }) => {
    expect(wordsToHex(new Uint32Array(value)).toString()).toBe(expected);
  });

  it.each([
    { value: [], expected: '' },
    { value: [76, 111, 114, 101], expected: '4c6f7265' },
    { value: [6, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109], expected: '066f72656d20697073756d' },
  ])('converts bytes to hex string', ({ value, expected }) => {
    expect(bytesToHex(new Uint8Array(value)).toString()).toBe(expected);
  });

  it.each([
    { value1: [], value2: [], expected: [] },
    { value1: [6, 111, 114, 101, 109, 32], value2: [], expected: [6, 111, 114, 101, 109, 32] },
    { value1: [], value2: [105, 112, 115, 117, 109], expected: [105, 112, 115, 117, 109] },
    { value1: [6, 111, 114, 101, 109, 32], value2: [105, 112, 115, 117, 109], expected: [6, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109] },
  ])('concatenate byte arrays', ({ value1, value2, expected }) => {
    expect(concatBytes(new Uint8Array(value1), new Uint8Array(value2))).toEqual(new Uint8Array(expected));
  });
});
