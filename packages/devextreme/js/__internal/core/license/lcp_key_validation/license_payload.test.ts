/**
 * Payload-level license tests — analogous to dxvcs LicenseTestHelperTests.
 *
 * These tests exercise ProductInfo / LicenseInfo directly
 * (no full LCP key encoding / signature verification involved)
 * so we can validate product-kind bit-flag logic in isolation.
 */
/* eslint-disable spellcheck/spell-checker, no-bitwise */

import { describe, expect, it } from '@jest/globals';
import { version as currentVersion } from '@js/core/version';

import { parseVersion } from '../../../utils/version';
import { findLatestDevExtremeVersion, isLicenseValid } from './license_info';
import { createProductInfo, isProduct } from './product_info';
import { ProductKind } from './types';

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/** Build a numeric version id that matches the current DevExtreme build (e.g. 251). */
function currentVersionId(): number {
  const { major, minor } = parseVersion(currentVersion);
  return parseInt(`${major}${minor}`, 10);
}

/** Shortcut: create a LicenseInfo with a single ProductInfo entry. */
function makeLicense(products: bigint, version?: number) {
  const v = version ?? currentVersionId();
  return { products: [createProductInfo(v, products)] };
}

// ---------------------------------------------------------------------------
// ProductInfo.isProduct
// ---------------------------------------------------------------------------

describe('ProductInfo.isProduct – product-kind bit flags', () => {
  it.each([
    { name: 'DXperienceASP', kind: ProductKind.DXperienceASP },
    { name: 'DXperienceWPF', kind: ProductKind.DXperienceWPF },
    { name: 'DXperienceWin', kind: ProductKind.DXperienceWin },
    { name: 'Blazor', kind: ProductKind.Blazor },
    { name: 'XAF', kind: ProductKind.XAF },
    { name: 'DevExtremeHtmlJs', kind: ProductKind.DevExtremeHtmlJs },
    { name: 'Dashboard', kind: ProductKind.Dashboard },
    { name: 'Docs', kind: ProductKind.Docs },
    { name: 'DocsBasic', kind: ProductKind.DocsBasic },
    { name: 'XtraReports', kind: ProductKind.XtraReports },
  ])('single flag $name is detected', ({ kind }) => {
    const pi = createProductInfo(currentVersionId(), kind);
    expect(isProduct(pi, kind)).toBe(true);
  });

  it('does not match a flag that was NOT set', () => {
    const pi = createProductInfo(currentVersionId(), ProductKind.Blazor);
    expect(isProduct(pi, ProductKind.Docs)).toBe(false);
    expect(isProduct(pi, ProductKind.DXperienceWin)).toBe(false);
  });

  it('DXperienceUni includes every individual product', () => {
    const pi = createProductInfo(currentVersionId(), ProductKind.DXperienceUni);

    expect(isProduct(pi, ProductKind.DXperienceWin)).toBe(true);
    expect(isProduct(pi, ProductKind.DXperienceASP)).toBe(true);
    expect(isProduct(pi, ProductKind.DXperienceWPF)).toBe(true);
    expect(isProduct(pi, ProductKind.Blazor)).toBe(true);
    expect(isProduct(pi, ProductKind.XAF)).toBe(true);
    expect(isProduct(pi, ProductKind.Dashboard)).toBe(true);
    expect(isProduct(pi, ProductKind.Docs)).toBe(true);
    expect(isProduct(pi, ProductKind.DevExtremeHtmlJs)).toBe(true);
    expect(isProduct(pi, ProductKind.XtraReports)).toBe(true);
  });

  it('DXperienceEnt includes its constituent products but not XAF/Dashboard/Docs', () => {
    const pi = createProductInfo(currentVersionId(), ProductKind.DXperienceEnt);

    expect(isProduct(pi, ProductKind.DXperienceWin)).toBe(true);
    expect(isProduct(pi, ProductKind.DXperienceASP)).toBe(true);
    expect(isProduct(pi, ProductKind.DXperienceWPF)).toBe(true);
    expect(isProduct(pi, ProductKind.Blazor)).toBe(true);
    expect(isProduct(pi, ProductKind.DevExtremeHtmlJs)).toBe(true);
    expect(isProduct(pi, ProductKind.XtraReports)).toBe(true);

    // Not included in DXperienceEnt
    expect(isProduct(pi, ProductKind.XAF)).toBe(false);
    expect(isProduct(pi, ProductKind.Dashboard)).toBe(false);
    // Note: Docs IS included in DXperienceUni but NOT in DXperienceEnt
    expect(isProduct(pi, ProductKind.Docs)).toBe(false);
  });

  it('isProduct returns true when ANY of multiple flags matches', () => {
    const pi = createProductInfo(currentVersionId(), ProductKind.Docs);
    expect(isProduct(pi, ProductKind.Docs, ProductKind.DocsBasic)).toBe(true);
    expect(isProduct(pi, ProductKind.DocsBasic, ProductKind.Docs)).toBe(true);
    expect(isProduct(pi, ProductKind.Blazor, ProductKind.Docs)).toBe(true);
  });

  it('isProduct returns false when NONE of multiple flags matches', () => {
    const pi = createProductInfo(currentVersionId(), ProductKind.Blazor);
    expect(isProduct(pi, ProductKind.Docs, ProductKind.DocsBasic)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// LicenseInfo – validity & findLatestDevExtremeVersion
// ---------------------------------------------------------------------------

describe('LicenseInfo – payload-level behaviour (analogous to dxvcs LicenseTestHelperTests)', () => {
  const versionId = currentVersionId();

  // -- trial / no-product license ------------------------------------------

  it('trial license (products = 0n) is valid but has no DevExtreme product', () => {
    const trial = makeLicense(ProductKind.Default);
    expect(isLicenseValid(trial)).toBe(true);
    expect(findLatestDevExtremeVersion(trial)).toBeUndefined();
  });

  it('empty LicenseInfo is invalid', () => {
    const empty = { products: [] };
    expect(isLicenseValid(empty)).toBe(false);
    expect(findLatestDevExtremeVersion(empty)).toBeUndefined();
  });

  it('no-arg LicenseInfo is invalid', () => {
    const noLicense = { products: [] };
    expect(isLicenseValid(noLicense)).toBe(false);
    expect(findLatestDevExtremeVersion(noLicense)).toBeUndefined();
  });

  // -- licensed with DevExtremeHtmlJs --------------------------------------

  it.each([
    { name: 'DevExtremeHtmlJs', kind: ProductKind.DevExtremeHtmlJs },
    { name: 'DXperienceEnt', kind: ProductKind.DXperienceEnt },
    { name: 'DXperienceUni', kind: ProductKind.DXperienceUni },
  ])('license with $name grants DevExtreme access at current version', ({ kind }) => {
    const lic = makeLicense(kind);
    expect(isLicenseValid(lic)).toBe(true);
    expect(findLatestDevExtremeVersion(lic)).toBe(versionId);
  });

  // -- licensed WITHOUT DevExtremeHtmlJs flag ------------------------------

  it.each([
    { name: 'DXperienceWin', kind: ProductKind.DXperienceWin },
    { name: 'Blazor', kind: ProductKind.Blazor },
    { name: 'XAF', kind: ProductKind.XAF },
    { name: 'Docs', kind: ProductKind.Docs },
    { name: 'Dashboard', kind: ProductKind.Dashboard },
    { name: 'XtraReports', kind: ProductKind.XtraReports },
  ])('license with only $name does NOT grant DevExtreme access', ({ kind }) => {
    const lic = makeLicense(kind);
    expect(isLicenseValid(lic)).toBe(true);
    expect(findLatestDevExtremeVersion(lic)).toBeUndefined();
  });

  // -- version matching ----------------------------------------------------

  it('findLatestDevExtremeVersion returns the highest matching version', () => {
    const lic = {
      products: [
        createProductInfo(240, ProductKind.DevExtremeHtmlJs),
        createProductInfo(250, ProductKind.DevExtremeHtmlJs),
      ],
    };
    expect(findLatestDevExtremeVersion(lic)).toBe(250);
  });

  it('products on older version do not appear at newer version', () => {
    const oldVersion = versionId - 10;
    const lic = makeLicense(ProductKind.DevExtremeHtmlJs, oldVersion);
    expect(isLicenseValid(lic)).toBe(true);
    expect(findLatestDevExtremeVersion(lic)).toBe(oldVersion);
  });

  // -- combining product kinds --------------------------------------------

  it('combined flags DXperienceASP | DevExtremeHtmlJs grant DevExtreme', () => {
    const combined = ProductKind.DXperienceASP | ProductKind.DevExtremeHtmlJs;
    const lic = makeLicense(combined);
    const pi = lic.products[0];

    expect(isProduct(pi, ProductKind.DXperienceASP)).toBe(true);
    expect(isProduct(pi, ProductKind.DevExtremeHtmlJs)).toBe(true);
    expect(findLatestDevExtremeVersion(lic)).toBe(versionId);
  });

  it('individual non-DevExtreme kind does NOT grant DevExtreme even when combined with other non-DevExtreme', () => {
    const combined = ProductKind.DXperienceWin | ProductKind.Docs;
    const lic = makeLicense(combined);

    expect(isProduct(lic.products[0], ProductKind.DXperienceWin)).toBe(true);
    expect(isProduct(lic.products[0], ProductKind.Docs)).toBe(true);
    expect(findLatestDevExtremeVersion(lic)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Smoke tests – mirrors dxvcs LicenseTestHelperTests.Smoke per product kind
// ---------------------------------------------------------------------------

describe('Smoke tests per ProductKind (dxvcs-style)', () => {
  it.each([
    { name: 'DXperienceASP', kind: ProductKind.DXperienceASP },
    { name: 'DXperienceWPF', kind: ProductKind.DXperienceWPF },
    { name: 'DXperienceWin', kind: ProductKind.DXperienceWin },
    { name: 'Blazor', kind: ProductKind.Blazor },
    { name: 'XAF', kind: ProductKind.XAF },
  ])('$name – trial / licensed / universal / no-license states', ({ kind }) => {
    // 1. Trial (products = Default = 0n  -->  no product flags)
    const trial = makeLicense(ProductKind.Default);
    expect(isLicenseValid(trial)).toBe(true);
    expect(isProduct(trial.products[0], kind)).toBe(false);

    // 2. Licensed with DXperienceUni  -->  every kind is included
    const uniLic = makeLicense(ProductKind.DXperienceUni);
    expect(isProduct(uniLic.products[0], kind)).toBe(true);
    // DevExtremeHtmlJs should also be present in Uni
    expect(isProduct(uniLic.products[0], ProductKind.DevExtremeHtmlJs)).toBe(true);

    // 3. Licensed with specific kind  -->  only that kind
    const specificLic = makeLicense(kind);
    expect(isProduct(specificLic.products[0], kind)).toBe(true);

    // Docs should NOT be present when only 'kind' is specified
    // (unless kind itself is Docs or encompasses Docs)
    if ((kind & ProductKind.Docs) !== ProductKind.Docs) {
      expect(isProduct(specificLic.products[0], ProductKind.Docs)).toBe(false);
    }

    // 4. No license
    const noLicense = { products: [] };
    expect(isLicenseValid(noLicense)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// DocsBasic vs Docs (analogous to dxvcs LicenseInfoTests.HasLicenseTests)
// ---------------------------------------------------------------------------

describe('HasLicense-style tests (DocsBasic vs Docs)', () => {
  it('DocsBasic flag set → isProduct(DocsBasic) true, isProduct(Docs) false', () => {
    const pi = createProductInfo(currentVersionId(), ProductKind.DocsBasic);
    expect(isProduct(pi, ProductKind.DocsBasic)).toBe(true);
    expect(isProduct(pi, ProductKind.Docs)).toBe(false);
  });

  it('Docs flag set → isProduct(Docs) true, isProduct(DocsBasic) false', () => {
    const pi = createProductInfo(currentVersionId(), ProductKind.Docs);
    expect(isProduct(pi, ProductKind.Docs)).toBe(true);
    expect(isProduct(pi, ProductKind.DocsBasic)).toBe(false);
  });

  it('isProduct with multiple alternatives works like HasLicense(version, kind1, kind2)', () => {
    const pi = createProductInfo(currentVersionId(), ProductKind.DocsBasic);
    expect(isProduct(pi, ProductKind.Docs, ProductKind.DocsBasic)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Multi-version license (analogous to dxvcs LicenseInfoTests.FindBestLicense)
// ---------------------------------------------------------------------------

describe('Multi-version license scenarios', () => {
  const versionId = currentVersionId();

  it('finds the latest DevExtreme version from multiple product entries', () => {
    const lic = {
      products: [
        createProductInfo(versionId - 1, ProductKind.DevExtremeHtmlJs),
        createProductInfo(versionId, ProductKind.DevExtremeHtmlJs),
      ],
    };
    expect(findLatestDevExtremeVersion(lic)).toBe(versionId);
  });

  it('returns older version when newer does not include DevExtreme', () => {
    const lic = {
      products: [
        createProductInfo(versionId, ProductKind.DXperienceWin), // no DevExtreme
        createProductInfo(versionId - 1, ProductKind.DevExtremeHtmlJs),
      ],
    };
    expect(findLatestDevExtremeVersion(lic)).toBe(versionId - 1);
  });

  it('returns undefined when no entry has DevExtremeHtmlJs', () => {
    const lic = {
      products: [
        createProductInfo(versionId, ProductKind.DXperienceWin),
        createProductInfo(versionId - 1, ProductKind.Blazor),
      ],
    };
    expect(findLatestDevExtremeVersion(lic)).toBeUndefined();
  });
});
