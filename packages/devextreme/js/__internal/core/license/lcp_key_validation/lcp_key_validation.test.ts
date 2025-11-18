import { describe, expect, it } from '@jest/globals';
import { version as currentVersion } from '@js/core/version';

import { parseVersion } from '../../../utils/version';
import { TokenKind } from '../types';
import { parseDevExpressProductKey } from './lcp_key_validator';
import { LicenseInfo } from './license_info';
import { ProductInfo } from './product_info';

const RAW_DEVELOPER_PRODUCT_LICENSE = 'LCPv1EK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEQtEpQtEpQtEpQtEpQtEpQtEpQtEpQtEpQtEpQtEpQtE>7yFIp@@I%-QpbX<!Q4$I<8;2i-Q!N<;GbRFp<!62g!Q>N-v>K-@2<!Q2pXv>K@v2%d)Ig-QIp-)I7yFI7yFI7yF';

function getTrialLicense(): LicenseInfo {
  const { major, minor } = parseVersion(currentVersion);
  const products = [
    new ProductInfo(parseInt(`${major}${minor}`, 10), 0n),
  ];
  return new LicenseInfo(products);
}

describe('LCP key validation', () => {
  it('serializer returns an invalid license for malformed input', () => {
    const token = parseDevExpressProductKey('not-a-real-license');
    expect(token.kind).toBe(TokenKind.corrupted);
  });

  it('developer product license fixtures parse into valid LicenseInfo instances', () => {
    const key = process.env.DX_PRODUCT_KEY ?? RAW_DEVELOPER_PRODUCT_LICENSE;
    const token = parseDevExpressProductKey(key);
    expect(token.kind).toBe(TokenKind.verified);
  });

  it('trial fallback does not grant product access', () => {
    const trialLicense = getTrialLicense();
    expect(trialLicense.isValid).toBe(true);

    const version = trialLicense.findLatestDevExtremeVersion();

    expect(version).toBe(undefined);
  });
});
