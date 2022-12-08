import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import {
  appendElementTo,
} from '../../navigation/helpers/domUtils';

const stylingMods = ['outlined', 'underlined', 'filled'];

fixture.disablePageReloads`NumberBox_Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

stylingMods.forEach((stylingMode) => {
  test(`Label for dxNumberBox stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await takeScreenshotInTheme(t, takeScreenshot, `NumberBox label with stylingMode=${stylingMode}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 400);

    const componentOption = {
      label: 'label text',
      stylingMode,
    };

    await appendElementTo('#container', 'div', 'numberBox1', { });
    await appendElementTo('#container', 'div', 'numberBox2', { });

    await createWidget('dxNumberBox', {
      ...componentOption,
      value: 'text',
    }, true, '#numberBox1');

    await createWidget('dxNumberBox', {
      ...componentOption,
      value: 123,
    }, true, '#numberBox2');
  });
});
