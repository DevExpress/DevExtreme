/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from 'testing/testcafe/helpers/restoreBrowserSize';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import TextBox from '../../../model/textBox';
import {
  setAttribute, appendElementTo, insertStylesheetRule, deleteStylesheetRule,
} from '../../navigation/helpers/domUtils';
import Guid from '../../../../../js/core/guid';

fixture`TextBox_Label`
  .page(url(__dirname, '../../container.html'));

const labelModes = ['floating', 'static', 'hidden'];
const stylingModes = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'material.blue.light'];

test('Label max-width changed with container size', async (t) => {
  const textBox = new TextBox('#container');

  await t
    .expect(textBox.element.find('.dx-label').getStyleProperty('max-width')).eql('82px');

  await setAttribute(`#${await textBox.element.getAttribute('id')}`, 'style', 'width: 400px');

  await t
    .expect(textBox.element.find('.dx-label').getStyleProperty('max-width')).eql('382px');
}).before(async () => createWidget('dxTextBox', {
  width: 100,
  label: 'long label text long label text long label text long label text long label text',
}));

themes.forEach((theme) => {
  [true, false].forEach((rtlEnabled) => {
    test(`Textbox render,rtl=${rtlEnabled}-theme=${theme}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(`textbox-render-theme=${theme.replace(/\./g, '-')}.png`, '#container'))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());

      await deleteStylesheetRule(0);
    }).before(async (t) => {
      await restoreBrowserSize(t);
      await changeTheme(theme);

      for (const stylingMode of stylingModes) {
        for (const labelMode of labelModes) {
          for (const placeholder of ['Placeholder', '']) {
            for (const text of ['Text value', '']) {
              for (const label of ['Label Text', '']) {
                const id = `${new Guid()}`;

                await appendElementTo('#container', 'div', id, { });
                await createWidget('dxTextBox', {
                  width: 120,
                  label,
                  text,
                  placeholder,
                  labelMode,
                  stylingMode,
                  rtlEnabled,
                }, false, `#${id}`);
              }
            }
          }
        }
      }

      await insertStylesheetRule('.dx-textbox { display: inline-block }', 0);
    });
  });

  stylingModes.forEach((stylingMode) => {
    labelModes.forEach((labelMode) => {
      test(`Label for dxTextBox labelMode=${labelMode} stylingMode=${stylingMode} ${theme}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await t.click('#otherContainer');

        await t
          .expect(await takeScreenshot(`label-dxTextBox-labelMode=${labelMode}-stylingMode=${stylingMode},theme=${theme.replace(/\./g, '-')}.png`, '#container'))
          .ok()
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async (t) => {
        await t.resizeWindow(300, 400);
        await changeTheme(theme);

        await createWidget('dxTextBox', {
          width: 100,
          label: 'Label text',
          text: '',
          placeholder: 'Placeholder',
          labelMode,
          stylingMode,
        });

        return createWidget('dxTextBox', {
          label: `this label is ${'very '.repeat(10)}long`,
          text: `this content is ${'very '.repeat(10)}long`,
          items: ['item1', 'item2'],
          labelMode,
          stylingMode,
        }, false, '#otherContainer');
      });
    });
  });
});
