import { version as currentVersion } from '@js/core/version';

import { parseVersion } from '../../../utils/version';
import {
  LCP_SIGNATURE,
  MAX_TICKS,
  RSA_PUBLIC_KEY_XML,
  SIGN_LENGTH,
} from './const';
import { LicenseInfo } from './license_info';
import { ProductInfo } from './product_info';
import { ProductKind } from './types';
import { encodeString, shiftDecodeText, verifyHash } from './utils';

export class LicenseSerializer {
  isProductOnlyLicense(license: string): boolean {
    return typeof license === 'string' && license.startsWith(LCP_SIGNATURE);
  }

  productsFromString(encodedString: string): { products: ProductInfo[]; licenseId: string } {
    let licenseId = '';
    if (!encodedString) {
      return { products: [], licenseId };
    }
    try {
      const splitInfo = encodedString.split(';');
      [licenseId] = splitInfo;
      const productTuples = splitInfo.slice(1).filter((entry) => entry.length > 0);
      const products = productTuples.map((tuple) => {
        const parts = tuple.split(',');
        const version = Number.parseInt(parts[0], 10);
        const productsValue = BigInt(parts[1]);
        const sourceCodeProducts = BigInt(parts[2]);
        const expirationTicks = BigInt(parts[3]);
        const licenseExpirationTicks = parts.length > 4 ? BigInt(parts[4]) : MAX_TICKS;
        return new ProductInfo(
          version,
          productsValue,
          sourceCodeProducts,
          expirationTicks,
          licenseExpirationTicks,
        );
      });
      return { products, licenseId };
    } catch (error) {
      return { products: [], licenseId: '' };
    }
  }

  getProductsLicense(productsLicenseSource: string): LicenseInfo {
    if (!this.isProductOnlyLicense(productsLicenseSource)) {
      return new LicenseInfo();
    }

    try {
      const productsLicense = atob(
        shiftDecodeText(productsLicenseSource.substring(LCP_SIGNATURE.length)),
      );

      const signature = productsLicense.substring(0, SIGN_LENGTH);
      const productsPayload = productsLicense.substring(SIGN_LENGTH);

      if (!verifyHash(RSA_PUBLIC_KEY_XML, productsPayload, signature)) {
        return new LicenseInfo();
      }

      const {
        products,
        licenseId,
      } = this.productsFromString(
        encodeString(productsPayload, shiftDecodeText),
      );

      return new LicenseInfo(products, productsLicenseSource, licenseId);
    } catch (error) {
      return new LicenseInfo();
    }
  }

  static getVersionId(versionStr: string): number {
    const { major, minor } = parseVersion(versionStr);

    return parseInt(`${major}${minor}`, 10);
  }

  hasDevExtremeLicense(productKey: string): boolean {
    const licenseInfo = this.getProductsLicense(productKey);
    return licenseInfo.hasLicense(
      LicenseSerializer.getVersionId(currentVersion),
      ProductKind.DevExtremeHtmlJs,
    );
  }
}
