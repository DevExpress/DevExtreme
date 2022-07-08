import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { changeTheme } from '../../../helpers/changeTheme';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo } from '../../navigation/helpers/domUtils';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

fixture`ValidationMessage`
  .page(url(__dirname, '../../container.html'));

test('Validation Message position should be correct after change visibility of parent container (T1095900)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(Selector(`.${TEXTEDITOR_INPUT_CLASS}`))
    .pressKey('backspace')
    .pressKey('enter')
    .pressKey('tab');

  await t
    .expect(await takeScreenshot('Textbox_validation_message.png'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());

  await ClientFunction(() => {
    (document.querySelector('#container') as HTMLElement).setAttribute('hidden', 'true');
  })();

  await ClientFunction(() => {
    document.querySelector('#container')?.removeAttribute('hidden');
  })();

  await t
    .expect(await takeScreenshot('Textbox_validation_message.png'))
    .ok()
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
}).after(async (t) => {
  await restoreBrowserSize(t);
});

fixture`ValidationMessagePosition`
  .page(url(__dirname, './pages/validation.html'));

const setPosition = ClientFunction(
  (position) => (window as any).createEditorsInTheme(position),
);

const positions = ['top', 'right', 'bottom', 'left'];
const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];
themes.forEach((theme) => {
  positions.forEach((position) => {
    test(`Editors ValidationMessage position is correct (${position}, ${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      await changeTheme(theme);
      await setPosition(position);

      await t
        .expect(await takeScreenshot(`editor-validation-position-${position}-${theme}.png`, '#container'))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    });
  });
});
