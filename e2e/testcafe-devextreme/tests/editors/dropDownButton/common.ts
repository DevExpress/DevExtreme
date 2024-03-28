/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import DropDownButton from '../../../model/dropDownButton';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo,
  insertStylesheetRulesToPage,
} from '../../../helpers/domUtils';
import Guid from 'devextreme/core/guid';

const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const BUTTON_GROUP_CLASS = 'dx-buttongroup';

const stylingModes = ['text', 'outlined', 'contained'];
const types = ['normal', 'default', 'danger', 'success'];

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

[undefined, 120].forEach((width) => {
  types.forEach((type) => {
    if (width && type !== 'normal') {
      return;
    }

    test('DropDownButton renders correctly', async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await insertStylesheetRulesToPage(`.${DROP_DOWN_BUTTON_CLASS}.dx-widget { display: inline-flex; vertical-align: middle; margin: 2px; } .${BUTTON_GROUP_CLASS} { vertical-align: middle; }`);

      await testScreenshot(t, takeScreenshot, `DropDownButton render${width ? ' with fixed width' : ''}${type !== 'normal' ? `, type=${type}` : ''}.png`, {
        shouldTestInCompact: true,
      });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async (t) => {
      t.ctx.ids = [];

      for (const rtlEnabled of [false, true]) {
        for (const stylingMode of stylingModes) {
          await appendElementTo('#container', 'div', `${stylingMode}-${rtlEnabled}`, { fontSize: '10px' });
          await ClientFunction(() => {
            $(`#${stylingMode}-${rtlEnabled}`).text(`StylingMode: ${stylingMode}, rtlEnabled: ${rtlEnabled}`);
          }, {
            dependencies: {
              stylingMode, rtlEnabled,
            },
          })();

          for (const splitButton of [true, false]) {
            for (const showArrowIcon of [true, false]) {
              for (const icon of ['image', '']) {
                for (const text of ['', 'Text']) {
                  const id = `${`dx${new Guid()}`}`;

                  t.ctx.ids.push(id);
                  await appendElementTo('#container', 'div', id, { });
                  await createWidget('dxDropDownButton', {
                    width,
                    rtlEnabled,
                    items: [{ text: 'text1' }, { text: 'text2' }],
                    displayExpr: 'text',
                    type,
                    text,
                    icon,
                    stylingMode,
                    showArrowIcon,
                    splitButton,
                  }, `#${id}`);
                }
              }
            }
          }
        }
      }
    });
  });
});

[false, true].forEach((splitButton) => {
  test('Button template', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Button template, splitButton=${splitButton}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxDropDownButton', {
    splitButton,
    width: 200,
    template: () => $('<div>Custom text<i class="dx-icon-user"></i></div>'),
  }));
});
