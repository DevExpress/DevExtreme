import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import DropDownButton from '../../../model/dropDownButton';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../navigation/helpers/domUtils';
import asyncForEach from '../../../helpers/asyncForEach';

fixture`Drop Down Button`
  .page(url(__dirname, '../../container.html'));

const themes = ['generic.light', 'material.blue.light'];

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

themes.forEach((theme) => {
  [false, true].forEach((rtlEnabled) => {
    test(`DropDownButton renders correctly (${rtlEnabled ? 'rtl' : 'ltr'}), theme: ${theme}`, async (t) => {
      await asyncForEach([1, 2, 3, 4], async (index) => {
        await t.hover(Selector(`#drop-down-button${index} .dx-button:first-child`));

        await t.expect(await compareScreenshot(t, `DropDownButton${index}-rtlEnabled=${rtlEnabled},theme=${theme.replace(/\./g, '-')}.png`, '#container')).ok();
      });
    }).before(async (t) => {
      await changeTheme('generic.light');
      await t.resizeWindow(500, 200);
      await setAttribute('#container', 'style', 'width: 500px;');

      const baseConfig = {
        items: [{ text: 'text1' }, { text: 'text2' }],
        displayExpr: 'text',
        text: 'Button',
        rtlEnabled,
      };

      await appendElementTo('#container', 'div', 'drop-down-button1', {});
      await createWidget('dxDropDownButton', { ...baseConfig }, false, '#drop-down-button1');

      await appendElementTo('#container', 'div', 'drop-down-button2', {});
      await createWidget('dxDropDownButton', { splitButton: true, ...baseConfig }, false, '#drop-down-button2');

      await appendElementTo('#container', 'div', 'drop-down-button3', {});
      await createWidget('dxDropDownButton', { stylingMode: 'text', ...baseConfig }, false, '#drop-down-button3');

      await appendElementTo('#container', 'div', 'drop-down-button4', {});
      await createWidget('dxDropDownButton', {
        stylingMode: 'text',
        splitButton: true,
        ...baseConfig,
      }, false, '#drop-down-button4');
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });
});
