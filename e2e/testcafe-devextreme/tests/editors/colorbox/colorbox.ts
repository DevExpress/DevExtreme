import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import ColorBox from 'devextreme-testcafe-models/colorbox';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';
import { clearTestPage } from '../../../helpers/clearPage';

fixture.disablePageReloads`Colorbox`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

test('Colorbox should display full placeholder', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Colorbox with placeholder.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'colorBox');
  await setStyleAttribute(Selector('#container'), 'box-sizing: border-box; width: 300px; height: 100px; padding: 8px;');

  return createWidget('dxColorBox', {
    width: '100%',
    placeholder: 'I am a very long placeholder',
  }, '#colorBox');
});

['#00ffff', 'rgb(0,255,255)', 'rgba(0,255,255,1)', 'aqua'].forEach((inputText) => {
  ['enter', 'tab'].forEach((key) => {
    test(`input value=${inputText} should be formatted to rgba after apply on ${key} key press`, async (t) => {
      const colorBox = new ColorBox('#container');
      const expectedValue = 'rgba(0, 255, 255, 1)';

      await t
        .click(colorBox.input);

      await t
        .typeText(colorBox.input, inputText)
        .pressKey(key)
        .expect(colorBox.option('text'))
        .eql(expectedValue)
        .expect(colorBox.option('value'))
        .eql(expectedValue);
    }).before(async () => createWidget('dxColorBox', {
      editAlphaChannel: true,
    }, '#container'));
  });
});
