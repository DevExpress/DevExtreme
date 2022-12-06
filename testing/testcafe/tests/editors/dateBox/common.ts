/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Guid from '../../../../../js/core/guid';
import {
  appendElementTo, setClassAttribute, insertStylesheetRule, deleteStylesheetRule,
  removeClassAttribute,
} from '../../navigation/helpers/domUtils';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';

const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const stylingModes = ['outlined', 'underlined', 'filled'];
const pickerTypes = ['calendar', 'list', 'native', 'rollers'];
const labelModes = ['static', 'floating', 'hidden'];
const types = ['date', 'datetime', 'time'];

fixture.disablePageReloads`DateBox render`
  .page(url(__dirname, '../../container.html'));

[true, false].forEach((rtlEnabled) => {
  const ids = [] as string[];
  test('DateBox styles', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await takeScreenshotInTheme(t, takeScreenshot, `Datebox rtl=${rtlEnabled}.png`, '#container', true);

    for (const state of [DROP_DOWN_EDITOR_ACTIVE_CLASS, FOCUSED_STATE_CLASS] as any[]) {
      for (const id of ids) {
        await setClassAttribute(Selector(`#${id}`), state);
      }

      await takeScreenshotInTheme(t, takeScreenshot, `Datebox ${state.replaceAll('dx-', '').replaceAll('dropdowneditor-', '').replaceAll('state-', '')} rtl=${rtlEnabled}.png`, undefined, true);

      for (const id of ids) {
        await removeClassAttribute(Selector(`#${id}`), state);
      }
    }

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await restoreBrowserSize(t);
    await insertStylesheetRule('.dx-datebox { display: inline-block }', 0);

    for (const stylingMode of stylingModes) {
      for (const type of types) {
        for (const pickerType of pickerTypes) {
          for (const labelMode of labelModes) {
            const id = `${`dx${new Guid()}`}`;

            ids.push(id);
            await appendElementTo('#container', 'div', id, { });

            const options: any = {
              width: 160,
              label: 'label text',
              labelMode,
              stylingMode,
              showClearButton: true,
              pickerType,
              type,
              rtlEnabled,
              value: new Date(2021, 9, 17, 16, 34),
            };

            await createWidget('dxDateBox', options, false, `#${id}`);
          }
        }
      }
    }
  }).after(async () => {
    await deleteStylesheetRule(0);
  });
});
