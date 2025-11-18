import { describe, expect, it } from '@jest/globals';
import { version as currentVersion } from '@js/core/version';

import { MAX_TICKS } from './const';
import { LicenseInfo } from './license_info';
import { LicenseSerializer } from './license_serializer';
import { ProductInfo } from './product_info';
import { ProductKind } from './types';
import { dateToTicks } from './utils';

const serializer = new LicenseSerializer();

const TRIAL_LICENSE_KEY = 'TRIAL';

const RAW_DEVELOPER_PRODUCT_LICENSE = 'LCPv1EK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEK)rEQtEpQtEpQtEpQtEpQtEpQtEpQtEpQtEpQtEpQtEpQtE>7yFIp@@I%-QpbX<!Q4$I<8;2i-Q!N<;GbRFp<!62g!Q>N-v>K-@2<!Q2pXv>K@v2%d)Ig-QIp-)I7yFI7yFI7yF';

function getTrialLicense(): LicenseInfo {
  const expiration = dateToTicks(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const products = [
    new ProductInfo(LicenseSerializer.getVersionId(currentVersion), 0n, 0n, expiration, MAX_TICKS),
  ];
  return new LicenseInfo(products, '', TRIAL_LICENSE_KEY);
}

describe('LCP key validation', () => {
  it('serializer returns an invalid license for malformed input', () => {
    const hasLicense = serializer.hasDevExtremeLicense('not-a-real-license');
    expect(hasLicense).toBe(false);
  });

  it('developer product license fixtures parse into valid LicenseInfo instances', () => {
    const key = process.env.DX_PRODUCT_KEY ?? RAW_DEVELOPER_PRODUCT_LICENSE;
    const license = serializer.getProductsLicense(key);
    expect(license.hasLicense(251, ProductKind.DevExtremeHtmlJs)).toBe(true);
  });

  it('trial fallback does not grant product access', () => {
    const trialLicense = getTrialLicense();
    expect(trialLicense.isValid).toBe(true);

    const versionId = LicenseSerializer.getVersionId(currentVersion);

    expect(trialLicense.hasLicense(versionId, ProductKind.DevExtremeHtmlJs)).toBe(false);
  });
});
