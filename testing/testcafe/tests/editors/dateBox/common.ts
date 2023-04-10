/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import {
  insertStylesheetRulesToPage,
  appendElementTo, setClassAttribute,
  removeClassAttribute,
} from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Guid from '../../../../../js/core/guid';
import { testScreenshot } from '../../../helpers/themeUtils';

const DATEBOX_CLASS = 'dx-datebox';
const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const stylingModes = ['outlined', 'underlined', 'filled'];
const pickerTypes = ['calendar', 'list', 'native', 'rollers'];
const labelModes = ['static', 'floating', 'hidden'];
const types = ['date', 'datetime', 'time'];

fixture.disablePageReloads.skip`DateBox render`
  .page(url(__dirname, '../../container.html'));

stylingModes.forEach((stylingMode) => {
  test(`DateBox styles, stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Datebox stylingMode=${stylingMode}.png`, { element: '#container', shouldTestInCompact: true });

    for (const state of [DROP_DOWN_EDITOR_ACTIVE_CLASS, FOCUSED_STATE_CLASS] as any[]) {
      for (const id of t.ctx.ids) {
        await setClassAttribute(Selector(`#${id}`), state);
      }

      await testScreenshot(t, takeScreenshot, `Datebox ${state.replaceAll('dx-', '').replaceAll('dropdowneditor-', '').replaceAll('state-', '')} stylingMode=${stylingMode}.png`, { element: '#container', shouldTestInCompact: true });

      for (const id of t.ctx.ids) {
        await removeClassAttribute(Selector(`#${id}`), state);
      }
    }

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    t.ctx.ids = [];

    await insertStylesheetRulesToPage(`.${DATEBOX_CLASS} { display: inline-block; margin: 5px; }`);

    for (const rtlEnabled of [true, false]) {
      for (const type of types) {
        for (const pickerType of pickerTypes) {
          for (const labelMode of labelModes) {
            const id = `${`dx${new Guid()}`}`;

            t.ctx.ids.push(id);
            await appendElementTo('#container', 'div', id, { });

            const options: any = {
              width: 220,
              label: 'label text',
              labelMode,
              stylingMode,
              showClearButton: true,
              pickerType,
              type,
              rtlEnabled,
              value: new Date(2021, 9, 17, 16, 34),
            };

            await createWidget('dxDateBox', options, `#${id}`);
          }
        }
      }
    }
  });
});
