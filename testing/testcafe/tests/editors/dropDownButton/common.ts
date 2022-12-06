/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import DropDownButton from '../../../model/dropDownButton';
import createWidget from '../../../helpers/createWidget';
import {
  appendElementTo, setClassAttribute, insertStylesheetRule, deleteStylesheetRule,
  removeClassAttribute,
} from '../../navigation/helpers/domUtils';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import Guid from '../../../../../js/core/guid';

const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const stylingModes = ['text', 'outlined', 'contained'];

fixture.disablePageReloads`Drop Down Button`
  .page(url(__dirname, '../../container.html'));

test('Item collection should be updated after direct option changing (T817436)', async (t) => {
  const dropDownButton1 = new DropDownButton('#container');
  const dropDownButton2 = new DropDownButton('#otherContainer');

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
  await createWidget('dxDropDownButton', {
    dataSource: [{ text: 'text1' }, { text: 'text2' }],
    displayExpr: 'text',
  }, false, '#otherContainer');

  return createWidget('dxDropDownButton', {
    items: [{ text: 'text1' }, { text: 'text2' }],
    displayExpr: 'text',
  });
});

let ids = [] as string[];

test('DropDownButton renders correctly', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await insertStylesheetRule(`.${DROP_DOWN_BUTTON_CLASS} { display: inline-block; width: 200px; margin: 5px; }`, 0);

  await takeScreenshotInTheme(t, takeScreenshot, 'DropDownButton render.png', '#container');

  for (const state of [HOVER_STATE_CLASS, FOCUSED_STATE_CLASS] as any[]) {
    for (const id of ids) {
      await setClassAttribute(Selector(`#${id} .dx-button:first-child`), state);
    }

    await takeScreenshotInTheme(t, takeScreenshot, `DropDownButton render ${state.replaceAll('dx-state-', '')}.png`, '#container');

    for (const id of ids) {
      await removeClassAttribute(Selector(`#${id} .dx-button:first-child`), state);
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
    for (const splitButton of [true, false]) {
      for (const rtlEnabled of [true, false]) {
        for (const showArrowIcon of [true, false]) {
          const id = `${`dx${new Guid()}`}`;

          ids.push(id);
          await appendElementTo('#container', 'div', id, { });
          await createWidget('dxDropDownButton', {
            rtlEnabled,
            items: [{ text: 'text1' }, { text: 'text2' }],
            displayExpr: 'text',
            text: 'Button',
            stylingMode,
            showArrowIcon,
            splitButton,
          }, false, `#${id}`);
        }
      }
    }
  }
});
