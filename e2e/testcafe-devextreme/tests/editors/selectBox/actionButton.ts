import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import SelectBox from 'devextreme-testcafe-models/selectBox';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';
import { appendElementTo } from '../../../helpers/domUtils';

fixture.disablePageReloads`SelectBox`
  .page(url(__dirname, '../../container.html'));

const purePressKey = async (t, key): Promise<void> => {
  await t
    .pressKey(key)
    .wait(500);
};

test('Click on action button should correctly work with SelectBox containing the field template (T811890)', async (t) => {
  const selectBox = new SelectBox('#container');
  const { getInstance } = selectBox;

  await ClientFunction(
    () => {
      (getInstance() as any).option('buttons', [{
        name: 'test',
        options: {
          icon: 'home',
          onClick: () => {
            (getInstance() as any).option('value', 'item2');
            (getInstance() as any).focus(); // NOTE: need because of editor input rerendering
          },
        },
      }]);
    },
    { dependencies: { getInstance } },
  )();

  await t.click(selectBox.element);
  await purePressKey(t, 'alt+up');
  await t
    .expect(selectBox.isFocused).ok()
    .expect(await selectBox.isOpened())
    .notOk();

  const actionButton = selectBox.getButton(0);
  await t
    .click(actionButton.element)
    .expect(selectBox.isFocused).ok()
    .expect(selectBox.value)
    .eql('item2');
}).before(async () => createWidget('dxSelectBox', {
  items: ['item1', 'item2'],
  fieldTemplate: (value) => ($('<div>') as any).dxTextBox({ value }),
}));

test('Click on action button after typing should correctly work with SelectBox containing the field template (T811890)', async (t) => {
  const selectBox = new SelectBox('#container');
  const { getInstance } = selectBox;

  await ClientFunction(
    () => {
      (getInstance() as any).option('buttons', [{
        name: 'test',
        options: {
          icon: 'home',
          onClick: () => {
            (getInstance() as any).option('value', 'item2');
            (getInstance() as any).focus(); // NOTE: need because of editor input rerendering
          },
        },
      }]);
    },
    { dependencies: { getInstance } },
  )();

  await t.click(selectBox.element);
  await purePressKey(t, 'alt+up');
  await t
    .expect(selectBox.isFocused).ok()
    .expect(await selectBox.isOpened())
    .notOk();

  const actionButton = selectBox.getButton(0);

  await t
    .typeText(selectBox.input, 'tt');
  await t
    .click(actionButton.element)
    .expect(selectBox.isFocused).ok()
    .expect(selectBox.value)
    .eql('item2');
}).before(async () => createWidget('dxSelectBox', {
  items: ['item1', 'item2'],
  fieldTemplate: (value) => ($('<div>') as any).dxTextBox({ value }),
}));

test('editor can be focused out after click on action button', async (t) => {
  const selectBox = new SelectBox('#container');
  const { getInstance } = selectBox;

  await ClientFunction(
    () => {
      (getInstance() as any).option('buttons', [{
        name: 'test',
        options: {
          icon: 'home',
          onClick: () => {
            (getInstance() as any).option('value', 'item2');
          },
        },
      }]);
    },
    { dependencies: { getInstance } },
  )();

  await t.click(selectBox.element);
  await t
    .expect(selectBox.isFocused).ok();

  const actionButton = selectBox.getButton(0);
  await t
    .click(actionButton.element)
    .expect(selectBox.isFocused).ok();

  await purePressKey(t, 'tab');
  await t
    .expect(selectBox.isFocused).notOk();
}).before(async () => createWidget('dxSelectBox', {
  items: ['item1', 'item2'],
}));

test('selectbox should not be opened after click on disabled action button (T1117453)', async (t) => {
  const selectBox = new SelectBox('#container');
  const { getInstance } = selectBox;

  await ClientFunction(
    () => {
      (getInstance() as any).option('buttons', [{
        name: 'test',
        options: {
          icon: 'home',
          type: 'default',
          disabled: true,
          onClick: () => {
            (getInstance() as any).option('value', 'item2');
          },
        },
      }]);
    },
    { dependencies: { getInstance } },
  )();

  const actionButton = selectBox.getButton(0);
  await t
    .click(actionButton.element)
    .expect(selectBox.isFocused)
    .notOk()
    .expect(await selectBox.isOpened())
    .notOk()
    .expect(selectBox.value)
    .eql('item1');
}).before(async () => createWidget('dxSelectBox', {
  items: ['item1', 'item2'],
  value: 'item1',
}));

test('SelectBox: positioning content in the custom dropdown button', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'SelectBox Customize DropDown Button.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'selectBox');

  return createWidget('dxSelectBox', {
    items: ['item1', 'item2'],
    value: 'item1',
    dropDownButtonTemplate() {
      return '<span style="line-height: 1">X</span>';
    },
  }, '#container');
});
