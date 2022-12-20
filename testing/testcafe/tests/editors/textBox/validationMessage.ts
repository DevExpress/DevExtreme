import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setAttribute, removeAttribute } from '../../navigation/helpers/domUtils';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

fixture.disablePageReloads`ValidationMessage`
  .page(url(__dirname, '../../container.html'));

test('Validation Message position should be correct after change visibility of parent container (T1095900)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(Selector(`.${TEXTEDITOR_INPUT_CLASS}`))
    .pressKey('backspace')
    .pressKey('enter')
    .pressKey('tab');

  await takeScreenshotInTheme(t, takeScreenshot, 'Textbox validation message.png');

  await setAttribute('#container', 'hidden', 'true');
  await removeAttribute('#container', 'hidden');

  await takeScreenshotInTheme(t, takeScreenshot, 'Textbox validation message.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(300, 200);

  await appendElementTo('#container', 'div', 'textbox', {});

  await createWidget('dxTextBox', {
    value: 'a',
    validationMessageMode: 'always',
  }, true, '#textbox');

  return createWidget('dxValidator', {
    validationRules: [
      {
        type: 'required',
      },
    ],
  }, true, '#textbox');
});
