import { Selector } from 'testcafe';
import type { Properties, NumberBoxPredefinedButton } from 'devextreme/ui/number_box.d';
import type { EditorStyle, TextEditorButton } from 'devextreme/common';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Guid from 'devextreme/core/guid';
import { isMaterial, testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, removeStylesheetRulesFromPage, insertStylesheetRulesToPage,
  setStyleAttribute,
} from '../../../helpers/domUtils';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';

const NUMBERBOX_CLASS = 'dx-numberbox';

const stylingModes: EditorStyle[] = ['outlined', 'underlined', 'filled'];
const buttonsList: (TextEditorButton | NumberBoxPredefinedButton)[][] = [
  ['clear'],
  [{ name: 'custom', location: 'after', options: { icon: 'home' } }, 'clear', 'spins'],
  ['clear', { name: 'custom', location: 'after', options: { icon: 'home' } }, 'spins'],
  ['clear', 'spins', { name: 'custom', location: 'after', options: { icon: 'home' } }],
  [{ name: 'custom', location: 'before', options: { icon: 'home' } }, 'clear', 'spins'],
];

fixture.disablePageReloads`NumberBox_Label`
  .page(url(__dirname, '../../container.html'));

const createNumberBox = async (options?: Properties): Promise<string> => {
  const id = `${`dx${new Guid()}`}`;

  await appendElementTo('#container', 'div', id, {});
  await createWidget('dxNumberBox', {
    value: Math.PI,
    showClearButton: true,
    showSpinButtons: true,
    ...options,
  }, `#${id}`);

  return id;
};
test('Label for dxNumberBox', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'NumberBox label.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await setStyleAttribute(Selector('#container'), 'box-sizing: border-box; width: 300px; height: 400px; padding: 8px;');
  if (isMaterial()) {
    await insertStylesheetRulesToPage('#container .dx-widget, #container .dx-widget input { font-family: sans-serif; }');
  }
  await t.resizeWindow(300, 400);

  // eslint-disable-next-line no-restricted-syntax
  for (const stylingMode of stylingModes) {
    const options = {
      label: 'label text',
      stylingMode,
    };
    await createNumberBox({
      ...options,
      // @ts-expect-error string instead of number
      value: 'text',
    });
    await createNumberBox({
      ...options,
      value: 123,
    });
  }
}).after(async (t) => {
  await restoreBrowserSize(t);
});

test('NumberBox with buttons container', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await insertStylesheetRulesToPage(`#container { display: flex; flex-wrap: wrap; } .${NUMBERBOX_CLASS} { width: 220px; margin: 2px; }`);

  await testScreenshot(t, takeScreenshot, 'NumberBox render with buttons container.png');

  await removeStylesheetRulesFromPage();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const stylingMode of stylingModes) {
    // eslint-disable-next-line no-restricted-syntax
    for (const buttons of buttonsList) {
      await createNumberBox({ stylingMode, buttons });
    }

    await createNumberBox({ stylingMode, rtlEnabled: true });
    await createNumberBox({ stylingMode, isValid: false });
  }
});
