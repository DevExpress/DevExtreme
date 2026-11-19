import type { Page } from '@playwright/test';
import { expect, test } from '../../fixtures';

const dxWidgetHostStyles = '.dx-widget-shadow { font-size: 20px; }';
const dxWidgetShadowStyles = '.dx-widget-shadow { font-size: 40px; }';

const setupShadowDomTest = (page: Page, copyStylesToShadowDom: boolean): Promise<void> => page
  .evaluate(({ copyStyles, hostStyles, shadowStyles }) => {
    if (!copyStyles) {
      (window as any).DevExpress.config({ copyStylesToShadowDom: copyStyles });
    }

    const container = document.createElement('div');
    container.id = 'shadow-host';
    document.body.appendChild(container);

    const hostStyleElement = document.createElement('style');
    hostStyleElement.innerHTML = hostStyles;
    document.head.appendChild(hostStyleElement);

    const shadowRoot = container.attachShadow({ mode: 'open' });

    const shadowStyleElement = shadowRoot.ownerDocument.createElement('style');
    shadowStyleElement.innerHTML = shadowStyles;
    shadowRoot.appendChild(shadowStyleElement);

    const shadowContainerElement = document.createElement('div');
    shadowContainerElement.id = 'shadow-container';
    shadowRoot.appendChild(shadowContainerElement);

    (window as any).testShadowRoot = shadowRoot;

    // eslint-disable-next-line new-cap, no-new
    new (window as any).DevExpress.ui.dxButton(shadowContainerElement, {
      text: 'Test button',
    });
  }, {
    copyStyles: copyStylesToShadowDom,
    hostStyles: dxWidgetHostStyles,
    shadowStyles: dxWidgetShadowStyles,
  });

const getAdoptedStyleSheets = (page: Page): Promise<{
  firstSheetRules: string[] | null;
  secondSheetRules: string[] | null;
}> => page.evaluate(() => {
  const shadowRoot = (window as any).testShadowRoot;
  const { adoptedStyleSheets } = shadowRoot;

  const results: { firstSheetRules: string[] | null; secondSheetRules: string[] | null } = {
    firstSheetRules: null,
    secondSheetRules: null,
  };

  if (adoptedStyleSheets.length > 1) {
    results.firstSheetRules = Array
      .from(adoptedStyleSheets[0].cssRules as CSSRuleList).map((rule) => rule.cssText);

    results.secondSheetRules = Array
      .from(adoptedStyleSheets[1].cssRules as CSSRuleList).map((rule) => rule.cssText);
  }

  return results;
});

test.describe('Shadow DOM - Adopted DX css styles', () => {
  test('Copies DX css styles from the host to the shadow root when rendering a DX widget', async ({ page }) => {
    await setupShadowDomTest(page, true);

    await expect.poll(async () => {
      const { firstSheetRules } = await getAdoptedStyleSheets(page);

      return firstSheetRules?.some((rule) => rule === dxWidgetHostStyles);
    }, { message: 'First adopted stylesheet contains host styles' }).toBe(true);

    await expect.poll(async () => {
      const { secondSheetRules } = await getAdoptedStyleSheets(page);

      return secondSheetRules?.some((rule) => rule === dxWidgetShadowStyles);
    }, { message: 'Second adopted stylesheet contains shadow styles' }).toBe(true);
  });

  test('Does not copy DX css styles when copyStylesToShadowDom is disabled', async ({ page }) => {
    await setupShadowDomTest(page, false);

    await expect.poll(async () => {
      const { firstSheetRules, secondSheetRules } = await getAdoptedStyleSheets(page);

      return firstSheetRules === null && secondSheetRules === null;
    }, { message: 'No adopted stylesheets should be created when copyStylesToShadowDom is disabled' }).toBe(true);
  });
});
