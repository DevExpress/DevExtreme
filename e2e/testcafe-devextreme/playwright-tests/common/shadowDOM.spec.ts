import { test, expect } from '@playwright/test';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Shadow DOM - Adopted DX css styles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const dxWidgetHostStyles = '.dx-widget-shadow { font-size: 20px; }';
  const dxWidgetShadowStyles = '.dx-widget-shadow { font-size: 40px; }';

  const setupShadowDomTest = (copyStylesToShadowDom) => ClientFunction((copyStyles) => {
    if (!copyStyles) {
      (window as any).DevExpress.config({ copyStylesToShadowDom: copyStyles });
    }

    const container = document.createElement('div');
    container.id = 'shadow-host';
    document.body.appendChild(container);

    const hostStyleElement = document.createElement('style');
    hostStyleElement.innerHTML = dxWidgetHostStyles;
    document.head.appendChild(hostStyleElement);

    const shadowRoot = container.attachShadow({ mode: 'open' });

    const shadowStyleElement = shadowRoot.ownerDocument.createElement('style');
    shadowStyleElement.innerHTML = dxWidgetShadowStyles;
    shadowRoot.appendChild(shadowStyleElement);

    const shadowContainerElement = document.createElement('div');
    shadowContainerElement.id = 'shadow-container';
    shadowRoot.appendChild(shadowContainerElement);

    (window as any).testShadowRoot = shadowRoot;

      new (window as any).DevExpress.ui.dxButton(shadowContainerElement, {
      text: 'Test button',
    });
  }, {
    dependencies: {
      dxWidgetHostStyles,
      dxWidgetShadowStyles,
    },
  })(copyStylesToShadowDom);

  const getAdoptedStyleSheets = async () => page.evaluate(() => {
    const shadowRoot = (window as any).testShadowRoot;
    const { adoptedStyleSheets } = shadowRoot;

    const results: { [key: string]: string[] | null } = {
      firstSheetRules: null,
      secondSheetRules: null,
    };

    if (adoptedStyleSheets.length > 1) {
      results.firstSheetRules = Array
        .from(adoptedStyleSheets[0].cssRules).map((rule) => (rule as CSSRule).cssText);

      results.secondSheetRules = Array
        .from(adoptedStyleSheets[1].cssRules).map((rule) => (rule as CSSRule).cssText);
    }

    return results;
  });

  test('Copies DX css styles from the host to the shadow root when rendering a DX widget', async ({ page }) => {
    await setupShadowDomTest(true);

    const { firstSheetRules, secondSheetRules } = await getAdoptedStyleSheets();

    const hasHostStyle = firstSheetRules?.some((rule) => rule === dxWidgetHostStyles);
    await expect(hasHostStyle).ok('First adopted stylesheet contains host styles');

    const hasShadowStyle = secondSheetRules?.some((rule) => rule === dxWidgetShadowStyles);
    await expect(hasShadowStyle).ok('Second adopted stylesheet contains shadow styles');

    });

  test('Does not copy DX css styles when copyStylesToShadowDom is disabled', async ({ page }) => {
    await setupShadowDomTest(false);

    const { firstSheetRules, secondSheetRules } = await getAdoptedStyleSheets();
    await expect(firstSheetRules === null && secondSheetRules === null)
      .ok('No adopted stylesheets should be created when copyStylesToShadowDom is disabled');

    });
});
