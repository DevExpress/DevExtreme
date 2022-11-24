import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { setAttribute } from '../../navigation/helpers/domUtils';
import TagBox from '../../../model/tagBox';
import { getThemePostfix } from '../../../helpers/getPostfix';

const stylingModes = ['outlined', 'underlined', 'filled'];
const labelModes = ['static', 'floating', 'hidden'];
const themes = ['generic.light', 'material.blue.light'];

fixture`TagBox_Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  stylingModes.forEach((stylingMode) => {
    test(`Label for dxTagBox ${theme} stylingMode=${stylingMode}`, async (t) => {
      await t.click('#otherContainer');

      await t
        .expect(await compareScreenshot(t, `TagBox label with stylingMode=${stylingMode}${getThemePostfix(theme)}.png`))
        .ok();
    }).before(async (t) => {
      await t.resizeWindow(300, 800);
      await changeTheme(theme);

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
      test(`Label shouldn't be cutted for dxTagBox ${theme} in stylingMode=${stylingMode}, labelMode=${labelMode} (T1104913)`, async (t) => {
        const tagBox = new TagBox('#container');

        await t.click(tagBox.element);

        const screenshotName = `TagBox label with stylingMode=${stylingMode},labelMode=${labelMode}${getThemePostfix(theme)}.png`;

        await t
          .expect(await compareScreenshot(t, screenshotName))
          .ok();

        await t.click(tagBox.element);
        await t.click(tagBox.element);

        await t
          .expect(await compareScreenshot(t, screenshotName))
          .ok();
      }).before(async (t) => {
        await t.resizeWindow(300, 400);
        await changeTheme(theme);

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
});
