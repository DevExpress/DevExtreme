import { ClientFunction, Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { getComputedPropertyValue } from '../../helpers/domUtils';
import { clearTestPage } from '../../helpers/testPageUtils';
import { getFullThemeName, getThemeName } from '../../helpers/themeUtils';

/*
 * The mode classes are a fluent-next contract, and this is the only place that exercises them in a
 * real browser. The unit tests around `core/utils/swatch_container.ts` cannot: jsdom resolves a
 * custom property declared ON an element but does not inherit it, while the whole mechanism is a
 * scope declaring `--dx-theme-mode` and descendants reading it back through the cascade.
 *
 * Every assertion is relative - "this scope differs from that one", never a hex literal - so a
 * token bump moves the values without touching the test.
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
    /*
     * Recursive by construction: the style query asks the NEAREST enclosing scope, and the outcome
     * of an inverted block is itself a named mode, so the inner one flips back. The depth-3 case
     * pins that it is the nearest scope being read and not the bundle - inside a dark block the
     * pair resolves dark -> light -> dark, not light -> dark.
     */
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
}
