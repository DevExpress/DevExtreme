/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Guid from '../../../../../js/core/guid';
import {
  appendElementTo, setClassAttribute, insertStylesheetRule, deleteStylesheetRule,
  removeClassAttribute,
} from '../../navigation/helpers/domUtils';
import { getThemePostfix } from '../../../helpers/getPostfix';

const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const stylingModes = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];
const pickerTypes = ['calendar', 'list', 'native', 'rollers'];
const labelModes = ['static', 'floating', 'hidden'];
const types = ['date', 'datetime', 'time'];

fixture`DateBox render`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  [true, false].forEach((rtlEnabled) => {
    const ids = [] as string[];
    test(`DateBox styles ${theme}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(`Datebox rtl=${rtlEnabled}${getThemePostfix(theme)}.png`, '#container'))
        .ok();

      for (const state of [DROP_DOWN_EDITOR_ACTIVE_CLASS, FOCUSED_STATE_CLASS] as any[]) {
        for (const id of ids) {
          await setClassAttribute(Selector(`#${id}`), state);
        }

        await t
          .expect(await takeScreenshot(`Datebox ${state.replaceAll('dx-', '').replaceAll('dropdowneditor-', '').replaceAll('state-', '')} rtl=${rtlEnabled}${getThemePostfix(theme)}.png`, '#container'))
          .ok();

        for (const id of ids) {
          await removeClassAttribute(Selector(`#${id}`), state);
        }
      }

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);

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

              await insertStylesheetRule('.dx-datebox { display: inline-block }', 0);
            }
          }
        }
      }
    }).after(async () => {
      await deleteStylesheetRule(0);
    });
  });
});
