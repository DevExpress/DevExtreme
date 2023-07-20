import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import {
  appendElementTo,
  setStyleAttribute,
} from '../../../helpers/domUtils';
import TagBox from '../../../model/tagBox';

const stylingModes = ['outlined', 'underlined', 'filled'];
const labelModes = ['static', 'floating', 'hidden'];

fixture.disablePageReloads`TagBox_Label`
  .page(url(__dirname, '../../container.html'));

stylingModes.forEach((stylingMode) => {
  safeSizeTest(`Label for dxTagBox stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click('#tagBox2');

    await testScreenshot(t, takeScreenshot, `TagBox label with stylingMode=${stylingMode}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [300, 800]).before(async () => {
    const componentOptions = {
      label: 'label text',
      items: [...Array(10)].map((_, i) => `item${i}`),
      value: [...Array(5)].map((_, i) => `item${i}`),
      stylingMode,
    };

    await appendElementTo('#container', 'div', 'tagBox1', { });
    await appendElementTo('#container', 'div', 'tagBox2', { });

    await createWidget('dxTagBox', {
      ...componentOptions,
      multiline: false,
    }, '#tagBox1');

    await createWidget('dxTagBox', {
      ...componentOptions,
      multiline: true,
    }, '#tagBox2');
  });

  labelModes.forEach((labelMode) => {
    safeSizeTest(`Label shouldn't be cutted for dxTagBox in stylingMode=${stylingMode}, labelMode=${labelMode} (T1104913)`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const tagBox = new TagBox('#container');

      await t.click(tagBox.element);

      const screenshotName = `TagBox label with stylingMode=${stylingMode},labelMode=${labelMode}.png`;

      await testScreenshot(t, takeScreenshot, screenshotName);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());

      await t.click(tagBox.element);
      await t.click(tagBox.element);

      await testScreenshot(t, takeScreenshot, screenshotName);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [300, 400]).before(async () => {
      await setStyleAttribute(Selector('#container'), 'top: 250px;');

      return createWidget('dxTagBox', {
        width: 200,
        label: 'Label text',
        labelMode,
        stylingMode,
        dataSource: {
          load() {
            return new Promise((resolve) => {
              resolve([
                { text: 'item_1' },
                { text: 'item_2' },
                { text: 'item_3' },
                { text: 'item_4' },
              ]);
            });
          },
          paginate: true,
          pageSize: 20,
        },
      });
    });
  });
});
