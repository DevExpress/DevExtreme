/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { isMaterial, takeScreenshotInTheme } from '../../../helpers/themeUtils';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
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

const TEXTBOX_CLASS = 'dx-textbox';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const INVALID_STATE_CLASS = 'dx-invalid';

test('Label max-width changed with container size', async (t) => {
  const textBox = new TextBox('#container');

  await t
    .expect(textBox.element.find('.dx-label').getStyleProperty('max-width'))
    .eql(isMaterial() ? '68px' : '82px');

  await setAttribute(`#${await textBox.element.getAttribute('id')}`, 'style', 'width: 400px');

  await t
    .expect(textBox.element.find('.dx-label').getStyleProperty('max-width'))
    .eql(isMaterial() ? '368px' : '382px');
}).before(async () => createWidget('dxTextBox', {
  width: 100,
  label: 'long label text long label text long label text long label text long label text',
}));

[true, false].forEach((rtlEnabled) => {
  let ids = [] as string[];

  test(`Textbox render, rtl=${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await insertStylesheetRule(`.${TEXTBOX_CLASS} { display: inline-block; width: 60px; margin: 5px; }`, 0);

    await takeScreenshotInTheme(t, takeScreenshot, `Textbox render with limited width rtl=${rtlEnabled}.png`, '#container');

    await deleteStylesheetRule(0);
    await insertStylesheetRule(`.${TEXTBOX_CLASS} { display: inline-block; width: 220px; margin: 5px; }`, 0);

    await takeScreenshotInTheme(t, takeScreenshot, `Textbox render rtl=${rtlEnabled}.png`, '#container');

    for (const state of [HOVER_STATE_CLASS, FOCUSED_STATE_CLASS, INVALID_STATE_CLASS, `${INVALID_STATE_CLASS} ${FOCUSED_STATE_CLASS}`] as any[]) {
      for (const id of ids) {
        await setClassAttribute(Selector(`#${id}`), state);
      }

      await takeScreenshotInTheme(t, takeScreenshot, `Textbox render rtl=${rtlEnabled}-${state.replaceAll('dx-', '').replaceAll('state-', '')}.png`, '#container');

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

    for (const stylingMode of stylingModes) {
      for (const labelMode of labelModes) {
        for (const placeholder of ['Placeholder', '']) {
          for (const text of ['Text value', '']) {
            for (const label of ['Label Text', '']) {
              const id = `${`dx${new Guid()}`}`;

              ids.push(id);
              await appendElementTo('#container', 'div', id, { });
              await createWidget('dxTextBox', {
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
  });
});
