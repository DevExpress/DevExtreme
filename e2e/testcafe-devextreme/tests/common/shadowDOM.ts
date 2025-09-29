import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';

fixture.disablePageReloads`Shadow DOM - Adopted DX css styles`
  .page(url(__dirname, '../container.html'));

const dxWidgetHostStyles = '.dx-widget-shadow { font-size: 20px; }';
const dxWidgetShadowStyles = '.dx-widget-shadow { font-size: 40px; }';

const setupShadowDOMTest = (copyStylesToShadowDom) => ClientFunction((copyStyles) => {
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

  // eslint-disable-next-line new-cap, no-new
  new (window as any).DevExpress.ui.dxButton(shadowContainerElement, {
    text: 'Test button',
  });
}, {
  dependencies: {
    dxWidgetHostStyles,
    dxWidgetShadowStyles,
  },
})(copyStylesToShadowDom);

const getAdoptedStyleSheets = ClientFunction(() => {
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

test('Copies DX css styles from the host to the shadow root when rendering a DX widget', async (t) => {
  await setupShadowDOMTest(true);

  const { firstSheetRules, secondSheetRules } = await getAdoptedStyleSheets();

  const hasHostStyle = firstSheetRules?.some((rule) => rule === dxWidgetHostStyles);
  await t.expect(hasHostStyle).ok('First adopted stylesheet contains host styles');

  const hasShadowStyle = secondSheetRules?.some((rule) => rule === dxWidgetShadowStyles);
  await t.expect(hasShadowStyle).ok('Second adopted stylesheet contains shadow styles');
});

test('Does not copy DX css styles when copyStylesToShadowDom is disabled', async (t) => {
  await setupShadowDOMTest(false);

  const { firstSheetRules, secondSheetRules } = await getAdoptedStyleSheets();
  await t.expect(firstSheetRules === null && secondSheetRules === null)
    .ok('No adopted stylesheets should be created when copyStylesToShadowDom is disabled');
});
