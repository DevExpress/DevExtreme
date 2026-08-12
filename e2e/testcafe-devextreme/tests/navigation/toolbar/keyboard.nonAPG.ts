import { ClientFunction, Selector } from 'testcafe';
import Toolbar from 'devextreme-testcafe-models/toolbar/toolbar';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';

fixture.disablePageReloads`Toolbar_keyboard_navigation_nonAPG`
  .page(url(__dirname, '../../container.html'));

const itemHasFocus = (item: Selector): Selector => item.filter(
  (node) => node === document.activeElement
    || node.contains(document.activeElement as Node | null),
);

const setupThreeButtonsFixture = async (): Promise<void> => {
  await appendElementTo('#container', 'div', 'externalBefore');
  await appendElementTo('#container', 'div', 'toolbar');
  await appendElementTo('#container', 'div', 'externalAfter');

  await createWidget('dxButton', { text: 'External Before' }, '#externalBefore');

  await createWidget('dxToolbar', {
    allowKeyboardNavigation: false,
    items: [
      {
        location: 'before',
        widget: 'dxButton',
        options: { text: 'A', focusStateEnabled: true },
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: { text: 'B', focusStateEnabled: true },
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: { text: 'C', focusStateEnabled: true },
      },
    ],
  }, '#toolbar');

  await createWidget('dxButton', { text: 'External After' }, '#externalAfter');
};

test('Tab walks through every toolbar item; Shift+Tab walks back', async (t) => {
  const externalBefore = Selector('#externalBefore');
  const externalAfter = Selector('#externalAfter');
  const toolbar = new Toolbar('#toolbar');

  await t.click(externalBefore);
  await t.expect(externalBefore.focused).ok('external before is focused');

  await t.pressKey('tab');
  await t.expect(itemHasFocus(toolbar.getItem(0)).exists)
    .ok('Tab #1 -> item[0]');

  await t.pressKey('tab');
  await t.expect(itemHasFocus(toolbar.getItem(1)).exists)
    .ok('Tab #2 -> item[1]');

  await t.pressKey('tab');
  await t.expect(itemHasFocus(toolbar.getItem(2)).exists)
    .ok('Tab #3 -> item[2]');

  await t.pressKey('tab');
  await t.expect(externalAfter.focused)
    .ok('Tab #4 -> external after');

  await t.pressKey('shift+tab');
  await t.expect(itemHasFocus(toolbar.getItem(2)).exists)
    .ok('Shift+Tab #1 -> item[2]');

  await t.pressKey('shift+tab');
  await t.expect(itemHasFocus(toolbar.getItem(1)).exists)
    .ok('Shift+Tab #2 -> item[1]');

  await t.pressKey('shift+tab');
  await t.expect(itemHasFocus(toolbar.getItem(0)).exists)
    .ok('Shift+Tab #3 -> item[0]');

  await t.pressKey('shift+tab');
  await t.expect(externalBefore.focused)
    .ok('Shift+Tab #4 -> external before');
}).before(setupThreeButtonsFixture);

test('Arrow keys do not move focus across toolbar items', async (t) => {
  const externalBefore = Selector('#externalBefore');
  const toolbar = new Toolbar('#toolbar');

  await t.click(externalBefore);
  await t.pressKey('tab');
  await t.expect(itemHasFocus(toolbar.getItem(0)).exists)
    .ok('item[0] focused');

  const keys = ['right', 'left', 'home', 'end', 'down', 'up'];
  await keys.reduce(async (prev, key) => {
    await prev;
    await t.pressKey(key);
    await t.expect(itemHasFocus(toolbar.getItem(0)).exists)
      .ok(`focus stays on item[0] after "${key}"`);
    await t.expect(itemHasFocus(toolbar.getItem(1)).exists)
      .notOk(`focus does not jump to item[1] on "${key}"`);
  }, Promise.resolve());
}).before(setupThreeButtonsFixture);

const getTabsSelectedIndex = ClientFunction(
  () => ($('#toolbar .dx-tabs') as unknown as {
    dxTabs: (m: string, n: string) => number;
  }).dxTabs('option', 'selectedIndex'),
);

test('Arrow keys are forwarded to the focused widget (dxTabs changes selectedIndex)', async (t) => {
  const externalBefore = Selector('#externalBefore');
  const toolbar = new Toolbar('#toolbar');

  await t.click(externalBefore);
  await t.pressKey('tab tab');
  await t.expect(itemHasFocus(toolbar.getItem(1)).exists)
    .ok('focus is inside dxTabs item');

  await t.expect(getTabsSelectedIndex()).eql(0, 'initial selectedIndex is 0');

  await t.pressKey('right');
  await t.expect(getTabsSelectedIndex()).eql(
    1,
    'ArrowRight reaches dxTabs and advances selectedIndex',
  );
  await t.expect(itemHasFocus(toolbar.getItem(1)).exists)
    .ok('focus stays inside dxTabs, did not jump to item[2]');

  await t.pressKey('left');
  await t.expect(getTabsSelectedIndex()).eql(
    0,
    'ArrowLeft reaches dxTabs and decreases selectedIndex',
  );
  await t.expect(itemHasFocus(toolbar.getItem(1)).exists)
    .ok('focus still inside dxTabs');
}).before(async () => {
  await appendElementTo('#container', 'div', 'externalBefore');
  await appendElementTo('#container', 'div', 'toolbar');

  await createWidget('dxButton', { text: 'External Before' }, '#externalBefore');

  await createWidget('dxToolbar', {
    allowKeyboardNavigation: false,
    items: [
      {
        location: 'before',
        widget: 'dxButton',
        options: { text: 'Prev', focusStateEnabled: true },
      },
      {
        location: 'before',
        widget: 'dxTabs',
        options: {
          items: [{ text: 'Home' }, { text: 'Insert' }, { text: 'Layout' }],
          selectedIndex: 0,
          width: 'auto',
          focusStateEnabled: true,
        },
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: { text: 'Next', focusStateEnabled: true },
      },
    ],
  }, '#toolbar');
});
