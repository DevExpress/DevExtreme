/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import DropDownButton from '../../../model/dropDownButton';
import createWidget from '../../../helpers/createWidget';
import {
  appendElementTo, setClassAttribute,
  removeClassAttribute,
  insertStylesheetRulesToPage,
} from '../../../helpers/domUtils';
import Guid from '../../../../../js/core/guid';

const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const stylingModes = ['text', 'outlined', 'contained'];

fixture.disablePageReloads`Drop Down Button`
  .page(url(__dirname, '../../container.html'));

test('Item collection should be updated after direct option changing (T817436)', async (t) => {
  const dropDownButton1 = new DropDownButton('#dropDownButton1');
  const dropDownButton2 = new DropDownButton('#dropDownButton2');

  await t.click(dropDownButton1.element);
  const list1 = await dropDownButton1.getList();
  await t.click(dropDownButton2.element);
  const list2 = await dropDownButton2.getList();

  await t
    .expect(list1.getItem().isDisabled).notOk()
    .expect(list2.getItem().isDisabled).notOk();

  await dropDownButton1.option('items[0].disabled', true);
  await dropDownButton2.option('dataSource[0].disabled', true);

  await t
    .click(dropDownButton1.element)
    .expect(list1.getItem().isDisabled)
    .ok()
    .click(dropDownButton2.element)
    .expect(list2.getItem().isDisabled)
    .ok();
}).before(async () => {
  await appendElementTo('#container', 'div', 'dropDownButton1', { });
  await appendElementTo('#container', 'div', 'dropDownButton2', { });

  await createWidget('dxDropDownButton', {
    items: [{ text: 'text1' }, { text: 'text2' }],
    displayExpr: 'text',
  }, '#dropDownButton1');

  await createWidget('dxDropDownButton', {
    dataSource: [{ text: 'text1' }, { text: 'text2' }],
    displayExpr: 'text',
  }, '#dropDownButton2');
});

test('DropDownButton renders correctly', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await insertStylesheetRulesToPage(`.${DROP_DOWN_BUTTON_CLASS} { display: inline-block; width: 200px; margin: 5px; }`);

  await testScreenshot(t, takeScreenshot, 'DropDownButton render.png', { element: '#container' });

  for (const state of [HOVER_STATE_CLASS, FOCUSED_STATE_CLASS] as any[]) {
    for (const id of t.ctx.ids) {
      await setClassAttribute(Selector(`#${id} .dx-button:first-child`), state);
    }

    await testScreenshot(t, takeScreenshot, `DropDownButton render ${state.replaceAll('dx-state-', '')}.png`, { element: '#container' });

    for (const id of t.ctx.ids) {
      await removeClassAttribute(Selector(`#${id} .dx-button:first-child`), state);
    }
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  t.ctx.ids = [];

  for (const stylingMode of stylingModes) {
    for (const splitButton of [true, false]) {
      for (const rtlEnabled of [true, false]) {
        for (const showArrowIcon of [true, false]) {
          const id = `${`dx${new Guid()}`}`;

          t.ctx.ids.push(id);
          await appendElementTo('#container', 'div', id, { });
          await createWidget('dxDropDownButton', {
            rtlEnabled,
            items: [{ text: 'text1' }, { text: 'text2' }],
            displayExpr: 'text',
            text: 'Button',
            stylingMode,
            showArrowIcon,
            splitButton,
          }, `#${id}`);
        }
      }
    }
  }
});
