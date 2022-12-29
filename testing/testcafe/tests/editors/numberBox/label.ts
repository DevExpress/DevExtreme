import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { screenshotTestFn } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import {
  appendElementTo,
} from '../../navigation/helpers/domUtils';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

const stylingModes = ['outlined', 'underlined', 'filled'];

fixture.disablePageReloads`NumberBox_Label`
  .page(url(__dirname, '../../container.html'));

stylingModes.forEach((stylingMode) => {
  safeSizeTest(`Label for dxNumberBox stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await screenshotTestFn(t, takeScreenshot, `NumberBox label with stylingMode=${stylingMode}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [300, 400]).before(async () => {
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
