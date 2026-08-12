import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import Toolbar from 'devextreme-testcafe-models/toolbar/toolbar';
import url from '../../../helpers/getPageUrl';
import { testScreenshot } from '../../../helpers/themeUtils';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';

fixture.disablePageReloads`Toolbar_keyboard_navigation`
  .page(url(__dirname, '../../container.html'));

const itemHasFocus = (item: Selector): Selector => item.filter(
  (node) => node === document.activeElement
    || node.contains(document.activeElement as Node | null),
);

const toolbarWidgets = [
  {
    widget: 'dxButton',
    options: { text: 'Button' },
  },
  {
    widget: 'dxTextBox',
    options: { value: 'text', showClearButton: false },
  },
  {
    widget: 'dxAutocomplete',
    options: { value: 'auto', showClearButton: false },
  },
  {
    widget: 'dxCheckBox',
    options: { value: true },
  },
  {
    widget: 'dxDateBox',
    options: {
      value: new Date(2021, 9, 17),
      openOnFieldClick: false,
      showClearButton: false,
      showDropDownButton: false,
    },
  },
  {
    widget: 'dxSelectBox',
    options: {
      items: ['Item 1', 'Item 2'],
      value: 'Item 1',
      showClearButton: false,
      showDropDownButton: false,
    },
  },
  {
    widget: 'dxMenu',
    options: {
      items: [{ text: 'Menu Item 1' }, { text: 'Menu Item 2' }],
    },
  },
  {
    widget: 'dxTabs',
    options: {
      items: [{ text: 'Tab 1' }, { text: 'Tab 2' }],
    },
  },
  {
    widget: 'dxButtonGroup',
    options: {
      items: [{ text: 'Left' }, { text: 'Right' }],
    },
  },
  {
    widget: 'dxDropDownButton',
    options: {
      text: 'Drop',
      items: [{ text: 'Action 1' }, { text: 'Action 2' }],
    },
  },
] as const;

const setupOverflowMenuFixture = async (): Promise<void> => {
  await appendElementTo('#container', 'div', 'toolbar');
  await appendElementTo('#container', 'div', 'externalAfter');

  await createWidget('dxToolbar', {
    items: [
      { widget: 'dxButton', locateInMenu: 'never', options: { text: 'Visible' } },
      { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu A' } },
      { widget: 'dxButton', locateInMenu: 'always', options: { text: 'Menu B' } },
    ],
  }, '#toolbar');

  await createWidget('dxButton', { text: 'External After' }, '#externalAfter');
};

test('Tab inside overflow menu closes popup and moves focus past the toolbar', async (t) => {
  const externalAfter = Selector('#externalAfter');
  const toolbar = new Toolbar('#toolbar');
  const menu = toolbar.getOverflowMenu();

  await t.click(menu.element);
  await t.expect(menu.option('opened')).eql(true);

  await t.pressKey('tab');

  await t.expect(menu.option('opened')).eql(false);
  await t.expect(externalAfter.focused).ok();
}).before(setupOverflowMenuFixture);

test('Outside click closes overflow menu without stealing focus to overflow button', async (t) => {
  const externalAfter = Selector('#externalAfter');
  const toolbar = new Toolbar('#toolbar');
  const menu = toolbar.getOverflowMenu();

  await t.click(menu.element);
  await t.expect(menu.option('opened')).eql(true);

  await t.click(externalAfter);

  await t.expect(menu.option('opened')).eql(false);
  await t.expect(externalAfter.focused).ok();
  await t.expect(menu.isFocused).notOk();
}).before(setupOverflowMenuFixture);

toolbarWidgets.forEach(({ widget, options }) => {
  test(`${widget}: Tab leaves and Shift+Tab returns focus`, async (t) => {
    const externalBefore = Selector('#externalBefore');
    const externalAfter = Selector('#externalAfter');
    const toolbar = new Toolbar('#toolbar');

    await t.click(externalBefore);
    await t
      .expect(externalBefore.focused)
      .ok('external before button should be focused');

    await t.pressKey('tab');
    await t
      .expect(itemHasFocus(toolbar.getItem(0)).exists)
      .ok('first toolbar item should be focused after Tab');

    await t.pressKey('right');
    await t
      .expect(itemHasFocus(toolbar.getItem(1)).exists)
      .ok(`${widget} should be focused after arrow right`);

    await t.pressKey('tab');
    await t
      .expect(externalAfter.focused)
      .ok('external after button should be focused after Tab');

    await t.pressKey('shift+tab');
    await t
      .expect(itemHasFocus(toolbar.getItem(1)).exists)
      .ok(`${widget} should be focused after Shift+Tab`);
  }).before(async () => {
    await appendElementTo('#container', 'div', 'externalBefore');
    await appendElementTo('#container', 'div', 'toolbar');
    await appendElementTo('#container', 'div', 'externalAfter');

    await createWidget('dxButton', {
      text: 'External Before',
    }, '#externalBefore');

    await createWidget('dxToolbar', {
      items: [
        {
          location: 'before',
          widget: 'dxButton',
          options: { text: 'Prev', focusStateEnabled: true },
        },
        {
          location: 'before',
          widget,
          options: { ...options, focusStateEnabled: true },
        },
        {
          location: 'before',
          widget: 'dxButton',
          options: { text: 'Next', focusStateEnabled: true },
        },
      ],
    }, '#toolbar');

    await createWidget('dxButton', {
      text: 'External After',
    }, '#externalAfter');
  });
});

test('Arrow / Home / End skip disabled items and the focus border lands on the right item', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const externalBefore = Selector('#externalBefore');
  const toolbar = new Toolbar('#toolbar');

  await t.click(externalBefore);
  await t.pressKey('tab');
  await t.expect(itemHasFocus(toolbar.getItem(0)).exists)
    .ok('Tab -> item[0] (first enabled)');

  await t.pressKey('right right');
  await t.expect(itemHasFocus(toolbar.getItem(4)).exists)
    .ok('ArrowRight x2 -> item[4] (5th item, disabled items skipped)');

  await t.pressKey('home');
  await t.expect(itemHasFocus(toolbar.getItem(0)).exists)
    .ok('Home -> item[0] (1st item)');

  await t.pressKey('end');
  await t.expect(itemHasFocus(toolbar.getItem(5)).exists)
    .ok('End -> item[5] (6th item, trailing disabled items skipped)');

  await testScreenshot(
    t,
    takeScreenshot,
    'Toolbar focus border on item after Arrow-Home-End navigation with disabled items.png',
    { element: '#container' },
  );

  await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'externalBefore');
  await appendElementTo('#container', 'div', 'toolbar');

  await createWidget('dxButton', { text: 'External Before' }, '#externalBefore');

  const labels = ['E1', 'E2', 'D1', 'D2', 'E3', 'E4', 'D3', 'D4'];
  const disabledIndexes = new Set([2, 3, 6, 7]);

  await createWidget('dxToolbar', {
    items: labels.map((text, index) => ({
      location: 'before',
      widget: 'dxButton',
      options: {
        text,
        focusStateEnabled: true,
        disabled: disabledIndexes.has(index),
      },
    })),
  }, '#toolbar');
});

test('RTL: focus border appears on keyboard navigation but not on mouse click; ArrowLeft moves to the logical next item', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const externalBefore = Selector('#externalBefore');
  const toolbar = new Toolbar('#toolbar');

  await t.click(externalBefore);
  await t.pressKey('tab');
  await t.expect(itemHasFocus(toolbar.getItem(0)).exists)
    .ok('Tab -> item[0] (first item in logical order)');

  await t.pressKey('left').wait(1000);
  await t.expect(itemHasFocus(toolbar.getItem(1)).exists)
    .ok('ArrowLeft in RTL moves focus to the logical-next item[1]');

  await testScreenshot(
    t,
    takeScreenshot,
    'Toolbar RTL focus border visible after keyboard navigation.png',
    { element: '#container' },
  );

  await t.click(toolbar.getItem(2));
  await t.expect(itemHasFocus(toolbar.getItem(2)).exists)
    .ok('mouse click -> item[2] becomes the focused item');

  await testScreenshot(
    t,
    takeScreenshot,
    'Toolbar RTL no focus border after mouse click.png',
    { element: '#container' },
  );

  await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'externalBefore');
  await appendElementTo('#container', 'div', 'toolbar');

  await setAttribute('#container', 'dir', 'rtl');

  await createWidget('dxButton', { text: 'External Before' }, '#externalBefore');

  await createWidget('dxToolbar', {
    rtlEnabled: true,
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
});
