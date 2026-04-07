/* eslint-disable */

import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { version as currentVersion } from '@js/core/version';

import { parseVersion } from '../../../utils/version';
import { TokenKind } from '../types';
import { parseDevExpressProductKey } from './lcp_key_validator';
import { findLatestDevExtremeVersion, isLicenseValid } from './license_info';
import { createProductInfo } from './product_info';

const DOT_NET_TICKS_EPOCH_OFFSET = 621355968000000000n;
const DOT_NET_TICKS_PER_MS = 10000n;
const DEVEXTREME_HTML_JS_BIT = 1n << 54n;

function msToDotNetTicks(ms: number): string {
  return (BigInt(ms) * DOT_NET_TICKS_PER_MS + DOT_NET_TICKS_EPOCH_OFFSET).toString();
}

function createLcpSource(payload: string): string {
  const signature = 'A'.repeat(136);
  return `LCPv1${btoa(`${signature}${payload}`)}`;
}

function loadParserWithBypassedSignatureCheck() {
  jest.resetModules();
  jest.doMock('./utils', () => {
    const actual = jest.requireActual('./utils') as Record<string, unknown>;
    return {
      ...actual,
      encodeString: (text: string) => text,
      shiftDecodeText: (text: string) => text,
      verifyHash: () => true,
    };
  });

  // eslint-disable-next-line
  const { parseDevExpressProductKey } = require('./lcp_key_validator');
  // eslint-disable-next-line
  const { TokenKind } = require('../types');
  return { parseDevExpressProductKey, TokenKind };
}

function getTrialLicense() {
  const { major, minor } = parseVersion(currentVersion);
  const products = [
    createProductInfo(parseInt(`${major}${minor}`, 10), 0n),
  ];
  return { products };
}

describe('LCP key validation', () => {
  it('serializer returns an invalid license for malformed input', () => {
    const token = parseDevExpressProductKey('not-a-real-license');
    expect(token.kind).toBe(TokenKind.corrupted);
  });

  (process.env.DX_PRODUCT_KEY ? it : it.skip)('developer product license fixtures parse into valid LicenseInfo instances', () => {
    const token = parseDevExpressProductKey(process.env.DX_PRODUCT_KEY as string);
    expect(token.kind).toBe(TokenKind.verified);
  });

  it('trial fallback does not grant product access', () => {
    const trialLicense = getTrialLicense();
    expect(isLicenseValid(trialLicense)).toBe(true);

    const version = findLatestDevExtremeVersion(trialLicense);

    expect(version).toBe(undefined);
  });

  it('does not classify a valid DevExtreme product key as trial-expired when expiration metadata is in the past', () => {
    const { parseDevExpressProductKey, TokenKind } = loadParserWithBypassedSignatureCheck();
    const expiredAt = msToDotNetTicks(Date.UTC(2020, 0, 1));

    const payload = `meta;251,${DEVEXTREME_HTML_JS_BIT},0,${expiredAt};`;
    const token = parseDevExpressProductKey(createLcpSource(payload));

    expect(token.kind).toBe(TokenKind.verified);
  });

  it('returns trial-expired for expired trial keys without DevExtreme product access', () => {
    const { parseDevExpressProductKey, TokenKind } = loadParserWithBypassedSignatureCheck();
    const expiredAt = msToDotNetTicks(Date.UTC(2020, 0, 1));

    const payload = `meta;251,0,0,${expiredAt};`;
    const token = parseDevExpressProductKey(createLcpSource(payload));

    expect(token.kind).toBe(TokenKind.corrupted);
    if (token.kind === TokenKind.corrupted) {
      expect(token.error).toBe('trial-expired');
    }
  });
});
