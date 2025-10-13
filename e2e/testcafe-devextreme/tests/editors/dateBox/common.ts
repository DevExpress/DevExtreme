/* eslint-disable no-restricted-syntax */
import type { DatePickerType, DateType, Properties } from 'devextreme/ui/date_box.d';
import { EditorStyle } from 'devextreme/common';
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

const stylingModes: EditorStyle[] = ['outlined', 'underlined', 'filled'];
const pickerTypes: DatePickerType[] = ['calendar', 'list', 'native', 'rollers'];
const types: DateType[] = ['date', 'datetime', 'time'];

fixture.disablePageReloads`DateBox render`
  .page(url(__dirname, '../../container.html'));

const createDateBox = async (options?: Properties, state?: string): Promise<string> => {
  const id = `${`dx${new Guid()}`}`;

  await appendElementTo('#container', 'div', id, {});
  await createWidget('dxDateBox', {
    width: 220,
    label: 'label text',
    showClearButton: true,
    value: new Date(2021, 9, 17, 16, 34),
    ...options,
  }, `#${id}`);

  if (state) {
    await setClassAttribute(Selector(`#${id}`), state);
  }

  return id;
};

test('DateBox styles', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Datebox.png');

  for (const state of [DROP_DOWN_EDITOR_ACTIVE_CLASS, FOCUSED_STATE_CLASS] as any[]) {
    for (const id of t.ctx.ids) {
      await setClassAttribute(Selector(`#${id}`), state);
    }

    await testScreenshot(t, takeScreenshot, `Datebox ${state.replaceAll('dx-', '').replaceAll('dropdowneditor-', '').replaceAll('state-', '')}.png`);

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

  for (const stylingMode of stylingModes) {
    for (const type of types) {
      const options = {
        stylingMode,
        type,
      };
      for (const pickerType of pickerTypes) {
        const id = await createDateBox({ ...options, pickerType });

        t.ctx.ids.push(id);
      }

      const id = await createDateBox({ ...options, rtlEnabled: true });
      t.ctx.ids.push(id);
    }
  }
});
