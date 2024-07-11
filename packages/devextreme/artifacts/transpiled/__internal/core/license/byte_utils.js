"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.base64ToBytes = base64ToBytes;
exports.bytesToHex = bytesToHex;
exports.bytesToWords = bytesToWords;
exports.concatBytes = concatBytes;
exports.hexToBytes = hexToBytes;
exports.leftRotate = leftRotate;
exports.stringToBytes = stringToBytes;
exports.wordsToBytes = wordsToBytes;
exports.wordsToHex = wordsToHex;
/* eslint-disable no-bitwise */
function base64ToBytes(base64) {
  return new Uint8Array(atob(base64).split('').map(s => s.charCodeAt(0)));
}
function hexToBytes(string) {
  var _string$match;
  return new Uint8Array(((_string$match = string.match(/.{1,2}/g)) === null || _string$match === void 0 ? void 0 : _string$match.map(byte => parseInt(byte, 16))) ?? []);
}
function stringToBytes(string) {
  const bytes = new Uint8Array(string.length);
  for (let k = 0; k < string.length; k += 1) {
    bytes[k] = string.charCodeAt(k) & 0xFF;
  }
  return bytes;
}
function wordsToBytes(words) {
  const bytes = new Uint8Array(words.length * 4);
  for (let k = 0; k < bytes.length; k += 1) {
    bytes[k] = words[k >> 2] >>> 8 * (3 - k % 4);
  }
  return bytes;
}
function bytesToWords(bytes) {
  const words = new Uint32Array((bytes.length - 1 >> 2) + 1);
  for (let k = 0; k < bytes.length; k += 1) {
    words[k >> 2] |= bytes[k] << 8 * (3 - k % 4);
  }
  return words;
}
function wordsToHex(words) {
  return [...words].map(w => w.toString(16).padStart(8, '0')).join('');
}
function bytesToHex(bytes) {
  return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
}
function leftRotate(x, n) {
  return (x << n | x >>> 32 - n) >>> 0;
}
function concatBytes(a, b) {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}