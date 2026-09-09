import { ClientFunction, Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { getComputedPropertyValue } from '../../helpers/domUtils';
import { clearTestPage } from '../../helpers/testPageUtils';
import { getFullThemeName, getThemeName } from '../../helpers/themeUtils';

/*
 * The only place the mode classes are exercised in a real browser: jsdom does not inherit a custom
 * property, and inheritance is the whole mechanism. Every assertion is relative - "this scope
 * differs from that one", never a hex literal - so a token bump does not touch the test.
 */
if (getThemeName() === 'fluent-next') {
  fixture`Theme modes`
    .page(url(__dirname, '../container.html'))
    .afterEach(async (t) => { await clearTestPage(t); });

  const buildMode = getFullThemeName().includes('.dark') ? 'dark' : 'light';
  const oppositeMode = buildMode === 'dark' ? 'light' : 'dark';

  // Roles the mode decides, one per family, plus the two system-tier names that used to freeze.
  const MODE_DEPENDENT = ['--dxds-color-bg', '--dxds-color-content'];
  const SYSTEM_TIER = ['--dx-global-content', '--dx-surface-overlay', '--dx-focus-rect-outline'];

  const render = ClientFunction((markup: string) => {
    const container = document.querySelector('#container');

    if (container) container.innerHTML = markup;
  });

  const valueAt = async (selector: string, property: string): Promise<string> => (
    await getComputedPropertyValue(selector, property)
  ).trim();

  const reportedMode = ClientFunction((selector: string) => (window as any).DevExpress.ui.themes
    .mode(document.querySelector(selector)));

  const setScopeMode = ClientFunction((selector: string, mode: string, tell: boolean) => {
    const scope = document.querySelector(selector) as HTMLElement;

    scope.classList.remove('dx-theme-mode-light', 'dx-theme-mode-dark');
    scope.classList.add(`dx-theme-mode-${mode}`);

    if (tell) {
      (window as any).DevExpress.ui.themes.refreshMode();
    }
  });

  test('a named mode class re-resolves the roles under it', async (t) => {
    await render(`
      <div id="plain"></div>
      <div class="dx-theme-mode-light"><div id="light"></div></div>
      <div class="dx-theme-mode-dark"><div id="dark"></div></div>
    `);

    await t.expect(await valueAt('#plain', '--dx-theme-mode')).eql(buildMode);
    await t.expect(await valueAt('#light', '--dx-theme-mode')).eql('light');
    await t.expect(await valueAt('#dark', '--dx-theme-mode')).eql('dark');

    for (const role of MODE_DEPENDENT) {
      const [light, dark, plain] = [
        await valueAt('#light', role),
        await valueAt('#dark', role),
        await valueAt('#plain', role),
      ];

      await t.expect(light)
        .notEql(dark, `${role} must differ between the two named modes`);
      await t.expect(plain)
        .eql(buildMode === 'dark' ? dark : light, `${role} without a class is the bundle's mode`);
    }
  });

  test('inverted flips against the nearest named scope', async (t) => {
    await render(`
      <div class="dx-theme-mode-inverted"><div id="bare"></div></div>
      <div class="dx-theme-mode-dark"><div class="dx-theme-mode-inverted"><div id="in-dark"></div></div></div>
      <div class="dx-theme-mode-light"><div class="dx-theme-mode-inverted"><div id="in-light"></div></div></div>
      <div class="dx-theme-mode-inverted">
        <div class="dx-theme-mode-inverted"><div id="nested"></div></div>
      </div>
      <div class="dx-theme-mode-dark">
        <div class="dx-theme-mode-inverted">
          <div class="dx-theme-mode-inverted"><div id="nested-in-dark"></div></div>
        </div>
      </div>
    `);

    await t.expect(await valueAt('#bare', '--dx-theme-mode'))
      .eql(oppositeMode, 'with no named scope above it, inverted opposes the bundle');
    await t.expect(await valueAt('#in-dark', '--dx-theme-mode')).eql('light');
    await t.expect(await valueAt('#in-light', '--dx-theme-mode')).eql('dark');
    // The depth-3 case pins that the NEAREST scope is what is read, not the bundle: inside a dark
    // block the pair resolves dark -> light -> dark, not light -> dark.
    await t.expect(await valueAt('#nested', '--dx-theme-mode'))
      .eql(buildMode, 'inverted inside inverted flips back');
    await t.expect(await valueAt('#nested-in-dark', '--dx-theme-mode'))
      .eql('dark', 'the pair resolves against the dark scope around it');
  });

  test('the system tier follows the mode instead of freezing at the bundle', async (t) => {
    await render(`<div class="dx-theme-mode-${oppositeMode}"><div id="probe"></div></div>`);

    for (const name of SYSTEM_TIER) {
      // These are declared on the document root; a custom property resolves where it is declared,
      // so without the mode classes on that same rule the value would stay the bundle's.
      await t.expect(await valueAt('#probe', name))
        .notEql(await valueAt('html', name), `${name} must re-resolve inside a mode scope`);
    }
  });

  test('themes.mode answers for the element, not for the loaded file', async (t) => {
    await render(`
      <div id="plain"></div>
      <div class="dx-theme-mode-${oppositeMode}"><div id="scoped"></div></div>
      <div class="dx-theme-mode-${oppositeMode}"><div class="dx-theme-mode-inverted"><div id="back"></div></div></div>
    `);

    // The element inherits the property from a scope above it, so only the cascade knows - which
    // is why this case lives here and not next to themes.ts.
    await t.expect(await reportedMode('#plain')).eql(buildMode, 'no scope above it - the loaded theme answers');
    await t.expect(await reportedMode('#scoped')).eql(oppositeMode, 'the mode is inherited from the scope, not declared here');
    await t.expect(await reportedMode('#back')).eql(buildMode, 'and inverted inside it flips back');

    // The public answer and the property the theme publishes must not drift apart.
    for (const id of ['#plain', '#scoped', '#back']) {
      await t.expect(await reportedMode(id)).eql(await valueAt(id, '--dx-theme-mode'));
    }
  });

  test('an overlay is painted in the mode of the element that owns it', async (t) => {
    await render(`<div class="dx-theme-mode-${oppositeMode}"><div id="owner"></div></div>`);

    await createWidget('dxPopup', {
      visible: true, width: 100, height: 100, animation: null,
    }, '#owner');

    const wrapper = Selector('.dx-popup-wrapper');

    await t.expect(wrapper.exists).ok();
    await t.expect(await valueAt('.dx-popup-wrapper', '--dx-theme-mode')).eql(oppositeMode);
    await t.expect(await valueAt('.dx-popup-wrapper', '--dxds-color-bg'))
      .eql(await valueAt('#owner', '--dxds-color-bg'), 'the overlay resolves the same roles as its owner');
  });

  test('an open overlay follows its scope once the application says the mode changed', async (t) => {
    /*
     * The scope has to be LOCAL: a page-level switch reaches the container through the cascade on
     * its own, so that version of this case passes with the subscription removed.
     */
    await render(`<div id="scope" class="dx-theme-mode-${oppositeMode}"><div id="owner"></div></div>`);

    await createWidget('dxPopup', {
      visible: true, width: 100, height: 100, animation: null,
    }, '#owner');

    const painted = async (): Promise<string> => valueAt('.dx-popup-wrapper', '--dxds-color-bg');
    const asOpened = await painted();

    await t.expect(asOpened).eql(await valueAt('#owner', '--dxds-color-bg'), 'opens in the mode of its scope');

    await setScopeMode('#scope', buildMode, true);

    await t.expect(await valueAt('#owner', '--dx-theme-mode')).eql(buildMode, 'the scope did switch');
    await t.expect(await painted()).notEql(asOpened, 'the open overlay repainted');
    await t.expect(await painted())
      .eql(await valueAt('#owner', '--dxds-color-bg'), 'and matches its owner again');
  });

  test('an open overlay keeps its mode until the application says so', async (t) => {
    await render(`<div id="scope" class="dx-theme-mode-${oppositeMode}"><div id="owner"></div></div>`);

    await createWidget('dxPopup', {
      visible: true, width: 100, height: 100, animation: null,
    }, '#owner');

    const asOpened = await valueAt('.dx-popup-wrapper', '--dxds-color-bg');

    // A class moved by the application is invisible to us; this pins that we do not pretend
    // otherwise - the overlay waits to be told.
    await setScopeMode('#scope', buildMode, false);

    await t.expect(await valueAt('.dx-popup-wrapper', '--dxds-color-bg'))
      .eql(asOpened, 'still painted in the mode it was opened in');
  });
}
