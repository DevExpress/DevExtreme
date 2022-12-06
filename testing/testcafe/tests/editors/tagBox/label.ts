import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { setAttribute } from '../../navigation/helpers/domUtils';
import TagBox from '../../../model/tagBox';

const stylingModes = ['outlined', 'underlined', 'filled'];
const labelModes = ['static', 'floating', 'hidden'];

fixture.disablePageReloads`TagBox_Label`
  .page(url(__dirname, '../../container.html'));

stylingModes.forEach((stylingMode) => {
  test(`Label for dxTagBox stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    await t.click('#otherContainer');

    await takeScreenshotInTheme(t, takeScreenshot, `TagBox label with stylingMode=${stylingMode}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 800);

    const componentOption = {
      label: 'label text',
      items: [...Array(10)].map((_, i) => `item${i}`),
      value: [...Array(5)].map((_, i) => `item${i}`),
      stylingMode,
    };

    await createWidget('dxTagBox', {
      ...componentOption,
      multiline: false,
    });

    return createWidget('dxTagBox', {
      ...componentOption,
      multiline: true,
    }, true, '#otherContainer');
  });

  labelModes.forEach((labelMode) => {
    test(`Label shouldn't be cutted for dxTagBox in stylingMode=${stylingMode}, labelMode=${labelMode} (T1104913)`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const tagBox = new TagBox('#container');

      await t.click(tagBox.element);

      const screenshotName = `TagBox label with stylingMode=${stylingMode},labelMode=${labelMode}.png`;

      await takeScreenshotInTheme(t, takeScreenshot, screenshotName);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());

      await t.click(tagBox.element);
      await t.click(tagBox.element);

      await takeScreenshotInTheme(t, takeScreenshot, screenshotName);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async (t) => {
      await t.resizeWindow(300, 400);

      await setAttribute('#container', 'style', 'top: 250px');

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
      }, true);
    });
  });
});
