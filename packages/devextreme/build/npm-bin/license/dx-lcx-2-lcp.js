"use strict";

const LCX_SIGNATURE = "LCXv1";
const LCP_SIGNATURE = "LCPv1";
const SIGN_LENGTH = 68 * 2; // 136 chars

const ENCODE_MAP_STR =
  "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0A\x0B\x0C\x0D\x0E\x0F" +
  "\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F" +
  '\x20x\x220]qA\'u`U?.wOCLyJnz@$*DmsMhlW/T)dKHQ+jNEa6G:VZk9!p>%e7i3S5\\^=P&(Ic,2#rtgY<R_bX-;BfFv[841o{|}~\x7F';

const DECODE_MAP_STR =
  "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0A\x0B\x0C\x0D\x0E\x0F" +
  "\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F" +
  '\x20R\x22f6U`\'aA7Fdp,?#yeYx[KWwQMqk^T+5&r/8ItLDb2C0;H._ElZ@*N>ojOv\\$]m)JncBVsi<XGP=93zS%g:h(u-!14{|}~\x7F';

const ENCODE_MAP = Array.from(ENCODE_MAP_STR);
const DECODE_MAP = Array.from(DECODE_MAP_STR);

function mapString(text, mapArr) {
  if (!text) return text;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    out += code < mapArr.length ? mapArr[code] : text[i];
  }
  return out;
}

function encode(text) {
  return mapString(text, ENCODE_MAP);
}

function decode(text) {
  return mapString(text, DECODE_MAP);
}

function assertNonEmptyString(value, name) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${name} must be a non-empty string`);
  }
}

function readLine(state) {
  const s = state.s;
  const start = state.pos;
  const idx = s.indexOf("\n", start);
  if (idx === -1) {
    state.pos = s.length;
    const line = s.slice(start);
    return line.endsWith("\r") ? line.slice(0, -1) : line;
  }
  state.pos = idx + 1;
  const line = s.slice(start, idx);
  return line.endsWith("\r") ? line.slice(0, -1) : line;
}

function readInt(state) {
  const line = readLine(state);
  const n = parseInt(line, 10);
  if (!Number.isFinite(n) || n < 0) {
    throw new Error("Invalid license data");
  }
  return n;
}

function readString(state, fixedLength) {
  const len = typeof fixedLength === "number" ? fixedLength : readInt(state);
  const start = state.pos;
  const end = start + len;
  if (end > state.s.length) {
    throw new Error("Invalid license data");
  }
  state.pos = end;
  return state.s.slice(start, end);
}

function safeBase64ToUtf8(b64) {
  try {
    return Buffer.from(b64, "base64").toString("utf8");
  } catch {
    throw new Error("Invalid license data");
  }
}

function convertLCXtoLCP(licenseString) {
  assertNonEmptyString(licenseString, "licenseString");
  const input = licenseString.trim();

  if (!input.startsWith(LCX_SIGNATURE)) {
    throw new Error("Unsupported license format");
  }

  const base64Part = input.slice(LCX_SIGNATURE.length);
  const lcx = safeBase64ToUtf8(base64Part);

  if (lcx.length < SIGN_LENGTH) {
    throw new Error("Invalid license data");
  }

  const lcxData = decode(lcx.slice(SIGN_LENGTH));
  const state = { s: lcxData, pos: 0 };
  const signProducts = readString(state, SIGN_LENGTH);

  void readString(state);
  const productsString = readString(state);

  const payloadText = signProducts + productsString;
  const payloadB64 = Buffer.from(payloadText, "utf8").toString("base64");
  const encoded = encode(payloadB64);

  return LCP_SIGNATURE + encoded;
}

function tryConvertLCXtoLCP(licenseString) {
  try {
    return convertLCXtoLCP(licenseString);
  } catch {
    return null;
  }
}

module.exports = {
  convertLCXtoLCP,
  tryConvertLCXtoLCP,
  LCX_SIGNATURE,
  LCP_SIGNATURE,
};
