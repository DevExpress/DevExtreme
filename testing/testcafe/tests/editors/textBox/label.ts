/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import { getThemePostfix } from '../../../helpers/getPostfix';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import TextBox from '../../../model/textBox';
import {
  setAttribute, appendElementTo, insertStylesheetRule, deleteStylesheetRule, setClassAttribute,
  removeClassAttribute,
} from '../../navigation/helpers/domUtils';
import Guid from '../../../../../js/core/guid';

fixture`TextBox_Label`
  .page(url(__dirname, '../../container.html'));

const labelModes = ['floating', 'static', 'hidden'];
const stylingModes = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'material.blue.light'];

const HOVER_STATE_CLASS = 'dx-state-hover';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const INVALID_STATE_CLASS = 'dx-invalid';

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
    let ids = [] as string[];

    test(`Textbox render,rtl=${rtlEnabled}-theme=${theme}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(`textbox render,rtl=${rtlEnabled}${getThemePostfix(theme)}.png`))
        .ok();

      await deleteStylesheetRule(0);
      await insertStylesheetRule('.dx-textbox { display: inline-block, width: 200 }', 0);

      await t
        .expect(await takeScreenshot(`textbox render with limited width,rtl=${rtlEnabled}${getThemePostfix(theme)}.png`))
        .ok();

      for (const state of [HOVER_STATE_CLASS, FOCUSED_STATE_CLASS, INVALID_STATE_CLASS, `${INVALID_STATE_CLASS} ${FOCUSED_STATE_CLASS}`] as any[]) {
        for (const id of ids) {
          await setClassAttribute(Selector(`#${id}`), state);
        }

        await t
          .expect(await takeScreenshot(`textbox render,rtl=${rtlEnabled}${state.replaceAll('dx-', '')}${getThemePostfix(theme)}.png`))
          .ok();

        for (const id of ids) {
          await removeClassAttribute(Selector(`#${id}`), state);
        }
      }

      await deleteStylesheetRule(0);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async (t) => {
      ids = [];
      await restoreBrowserSize(t);
      await changeTheme(theme);

      for (const stylingMode of stylingModes) {
        for (const labelMode of labelModes) {
          for (const placeholder of ['Placeholder', '']) {
            for (const text of ['Text value', '']) {
              for (const label of ['Label Text', '']) {
                const id = `${`dx${new Guid()}`}`;

                ids.push(id);
                await appendElementTo('#container', 'div', id, { });
                await createWidget('dxTextBox', {
                  width: 100,
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

      await insertStylesheetRule('.dx-textbox { display: inline-block, width: 80 }', 0);
    });
  });
});
