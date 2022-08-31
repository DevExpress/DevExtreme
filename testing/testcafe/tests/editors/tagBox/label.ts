import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { setAttribute } from '../../navigation/helpers/domUtils';
import TagBox from '../../../model/tagBox';

const stylingMods = ['outlined', 'underlined', 'filled'];
const labelMods = ['static', 'floating', 'hidden'];
const themes = ['generic.light', 'material.blue.light'];

fixture`TagBox_Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  stylingMods.forEach((stylingMode) => {
    test(`Label for dxTagBox ${theme} stylingMode=${stylingMode}`, async (t) => {
      await t.click('#otherContainer');

      await t
        .expect(await compareScreenshot(t, `label-tag-box-styleMode=${stylingMode},theme=${theme.replace(/\./g, '-')}.png`))
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

    labelMods.forEach((labelMode) => {
      test(`Label shouldn't be cutted for dxTagBox ${theme} in stylingMode=${stylingMode}, labelMode=${labelMode} (T1104913)`, async (t) => {
        const tagBox = new TagBox('#container');

        await t.click(tagBox.element);

        await t
          .expect(await compareScreenshot(t, `label-tag-box-styleMode=${stylingMode},labelMode=${labelMode},theme=${theme.replace(/\./g, '-')}.png`))
          .ok();

        await t.click(tagBox.element);
        await t.click(tagBox.element);

        await t
          .expect(await compareScreenshot(t, `label-tag-box-styleMode=${stylingMode},labelMode=${labelMode},theme=${theme.replace(/\./g, '-')}.png`))
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
                resolve([...Array(10)].map((_, i) => ({ text: `item${i}` })));
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
