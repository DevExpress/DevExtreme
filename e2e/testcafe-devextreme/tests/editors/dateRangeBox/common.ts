/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Guid from 'devextreme/core/guid';
import DateRangeBox from 'devextreme-testcafe-models/dateRangeBox';
import {
  insertStylesheetRulesToPage,
  appendElementTo,
  setAttribute,
  setClassAttribute,
} from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

const DATERANGEBOX_CLASS = 'dx-daterangebox';
const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const HOVER_STATE_CLASS = 'dx-state-hover';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const DISABLED_STATE_CLASS = 'dx-state-disabled';

const stylingModes = ['outlined', 'underlined', 'filled'];
const labelModes = ['static', 'floating', 'hidden', 'outside'];

fixture.disablePageReloads`DateRangeBox render`
  .page(url(__dirname, '../../container.html'));

const createDateRangeBox = async (options?: any, state?: string): Promise<string> => {
  const id = `${`dx${new Guid()}`}`;

  await appendElementTo('#container', 'div', id, { });

  const config: any = {
    width: 500,
    value: [new Date(2021, 9, 17, 16, 34), new Date(2021, 9, 18, 16, 34)],
    labelMode: 'static',
    endDateLabel: 'static',
    startDateLabel: 'qwertyQWERTYg',
    showClearButton: true,
    ...options,
  };

  await createWidget('dxDateRangeBox', config, `#${id}`);

  if (state) {
    await setClassAttribute(Selector(`#${id}`), state);
    await setClassAttribute(Selector(`#${id} .dx-start-datebox`), state);
  }

  return id;
};

test('DateRangeBox styles', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'DateRangeBox styles.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage(`.${DATERANGEBOX_CLASS} { display: inline-flex; margin: 5px; }`);

  for (const stylingMode of stylingModes) {
    for (const state of [
      DROP_DOWN_EDITOR_ACTIVE_CLASS,
      FOCUSED_STATE_CLASS,
      HOVER_STATE_CLASS,
      READONLY_STATE_CLASS,
      DISABLED_STATE_CLASS,
    ] as any[]
    ) {
      await createDateRangeBox({ stylingMode }, state);
    }
  }

  await createDateRangeBox({ rtlEnabled: true });
  await createDateRangeBox({ isValid: false });
});

test('DateRangeBox with buttons container', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'DateRangeBox with buttons container.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage('#container { display: flex; flex-wrap: wrap; gap: 4px; }');

  for (const buttons of [
    ['clear'],
    [{ name: 'custom', location: 'after', options: { icon: 'home' } }, 'clear', 'dropDown'],
    ['clear', { name: 'custom', location: 'after', options: { icon: 'home' } }, 'dropDown'],
    [{ name: 'custom', location: 'before', options: { icon: 'home' } }, 'clear', 'dropDown'],
  ]) {
    await createDateRangeBox({ buttons });
    await createDateRangeBox({ buttons, rtlEnabled: true });
  }
});

labelModes.forEach((labelMode) => {
  test('Custom placeholders and labels appearance', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dateRangeBox = new DateRangeBox(`#${t.ctx.id}`);

    await testScreenshot(t, takeScreenshot, 'Placeholder and label by default.png');

    await t
      .click(dateRangeBox.getStartDateBox().input);

    await testScreenshot(t, takeScreenshot, 'Placeholder and label on start date input focus.png');

    await t
      .click(dateRangeBox.getEndDateBox().input);

    await testScreenshot(t, takeScreenshot, 'Placeholder and label on end date input focus.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await setAttribute('#container', 'style', 'width: 800px; height: 300px; padding-top: 10px;');
    await insertStylesheetRulesToPage('* { caret-color: transparent !important; }');
    t.ctx.id = await createDateRangeBox({
      labelMode,
      width: 600,
      openOnFieldClick: false,
      startDateLabel: 'first date',
      endDateLabel: 'second date',
      startDatePlaceholder: 'enter start date',
      endDatePlaceholder: 'enter end date',
    });
    await appendElementTo('#container', 'div', t.ctx.id);
  });
});
