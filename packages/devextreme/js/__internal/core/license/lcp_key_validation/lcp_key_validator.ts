import { FORMAT } from '../const';
import {
  DESERIALIZATION_ERROR,
  type ErrorToken,
  GENERAL_ERROR,
  PRODUCT_KIND_ERROR,
  type Token,
  TokenKind,
  TRIAL_EXPIRED_ERROR,
  VERIFICATION_ERROR,
} from '../types';
import {
  LCP_SIGNATURE,
  RSA_PUBLIC_KEY_XML,
  SIGN_LENGTH,
} from './const';
import { findLatestDevExtremeVersion, getDevExtremeProductKinds, isTrialExpired } from './license_info';
import { createProductInfo, type ProductInfo } from './product_info';
import {
  dotNetTicksToMs,
  encodeString,
  shiftDecodeText,
  verifyHash,
} from './utils';

interface ParsedProducts {
  products: ProductInfo[];
  licenseId: string;
  errorToken?: ErrorToken;
}

export function isProductOnlyLicense(license: string): boolean {
  return typeof license === 'string' && license.startsWith(LCP_SIGNATURE);
}

function productsFromString(encodedString: string): ParsedProducts {
  if (!encodedString) {
    return {
      products: [],
      licenseId: '',
      errorToken: GENERAL_ERROR,
    };
  }

  try {
    const splitInfo = encodedString.split(';');
    const productTuples = splitInfo.slice(1).filter((entry) => entry.length > 0);
    const products = productTuples.map((tuple) => {
      const parts = tuple.split(',');
      const version = Number.parseInt(parts[0], 10);
      const productsValue = BigInt(parts[1]);
      const expiration = parts.length > 3 ? dotNetTicksToMs(parts[3]) : Infinity;
      return createProductInfo(
        version,
        productsValue,
        expiration,
      );
    });

    return {
      products,
      licenseId: splitInfo[0],
    };
  } catch (error) {
    return {
      products: [],
      licenseId: '',
      errorToken: DESERIALIZATION_ERROR,
    };
  }
}

export function parseDevExpressProductKey(
  productsLicenseSource: string,
  acceptAspNetEntitlement = false,
  versionCode?: number,
): Token {
  if (!isProductOnlyLicense(productsLicenseSource)) {
    return GENERAL_ERROR;
  }

  try {
    const productsLicense = atob(
      shiftDecodeText(productsLicenseSource.substring(LCP_SIGNATURE.length)),
    );

    const signature = productsLicense.substring(0, SIGN_LENGTH);
    const productsPayload = productsLicense.substring(SIGN_LENGTH);

    if (!verifyHash(RSA_PUBLIC_KEY_XML, productsPayload, signature)) {
      return VERIFICATION_ERROR;
    }

    const {
      products,
      licenseId,
      errorToken,
    } = productsFromString(
      encodeString(productsPayload, shiftDecodeText),
    );

    if (errorToken) {
      return errorToken;
    }

    const productKinds = getDevExtremeProductKinds(acceptAspNetEntitlement);

    if (versionCode !== undefined && isTrialExpired({ products }, versionCode, productKinds)) {
      return { ...TRIAL_EXPIRED_ERROR, licenseId };
    }

    const maxVersionAllowed = findLatestDevExtremeVersion(
      { products },
      acceptAspNetEntitlement,
    );

    if (!maxVersionAllowed) {
      return { ...PRODUCT_KIND_ERROR, licenseId };
    }

    return {
      kind: TokenKind.verified,
      payload: {
        licenseId,
        maxVersionAllowed,
        format: FORMAT,
      },
    };
  } catch (error) {
    return GENERAL_ERROR;
  }
}
