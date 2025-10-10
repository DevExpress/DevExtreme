/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Guid from 'devextreme/core/guid';
import {
  insertStylesheetRulesToPage,
  appendElementTo, setClassAttribute,
  removeClassAttribute,
} from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

const DATEBOX_CLASS = 'dx-datebox';
const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const pickerTypes = ['calendar', 'list', 'native', 'rollers'];
const types = ['date', 'datetime', 'time'];

fixture.disablePageReloads`DateBox render`
  .page(url(__dirname, '../../container.html'));

test(`DateBox styles`, async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, `Datebox.png`, { shouldTestInCompact: true });

  for (const state of [DROP_DOWN_EDITOR_ACTIVE_CLASS, FOCUSED_STATE_CLASS] as any[]) {
    for (const id of t.ctx.ids) {
      await setClassAttribute(Selector(`#${id}`), state);
    }

    await testScreenshot(t, takeScreenshot, `Datebox ${state.replaceAll('dx-', '').replaceAll('dropdowneditor-', '').replaceAll('state-', '')}.png`, { shouldTestInCompact: true });

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

  for (const type of types) {
    for (const pickerType of pickerTypes) {
      const id = `${`dx${new Guid()}`}`;

      t.ctx.ids.push(id);
      await appendElementTo('#container', 'div', id, { });

      const options: any = {
        width: 220,
        label: 'label text',
        showClearButton: true,
        pickerType,
        type,
        value: new Date(2021, 9, 17, 16, 34),
      };

      await createWidget('dxDateBox', options, `#${id}`);
    }
  }
});
