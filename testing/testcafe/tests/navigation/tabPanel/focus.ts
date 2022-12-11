import { Selector, t } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import TabPanel from '../../../model/tabPanel';
import { appendElementTo } from '../helpers/domUtils';

fixture.disablePageReloads`TabPanel`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

// T821726
test('[{0: selected}, {1}] -> click to tabs[1] -> click to external button', async () => {
  const tabPanel = new TabPanel('#tabPanel');

  await t
    .click(tabPanel.tabs.getItem(1).element)
    .expect(tabPanel.isFocused).ok()
    .expect(tabPanel.tabs.isFocused)
    .ok()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(1).isFocused)
    .ok()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(1).isFocused)
    .ok();

  await t
    .click(Selector('#focusoutButton'))
    .expect(tabPanel.isFocused).notOk()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(1).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(1).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk();
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabPanel');
  await appendElementTo('#container', 'button', 'focusoutButton', {
    width: '150px', height: '50px', backgroundColor: 'steelblue',
  });

  await t.debug();
  return createWidget('dxTabPanel', {
    items: ['Item 1', 'Item 2'],
  }, true, '#tabPanel');
});

test('[{0: selected}] -> click to multiView -> click to external button', async () => {
  const tabPanel = new TabPanel('#tabPanel');

  await t
    .click(tabPanel.multiView.getItem(0).element)
    .expect(tabPanel.isFocused).ok()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .ok()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .ok();

  await t
    .click(Selector('#focusoutButton'))
    .expect(tabPanel.isFocused).notOk()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk();
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabPanel');
  await appendElementTo('#container', 'button', 'focusoutButton', {
    width: '150px', height: '50px', backgroundColor: 'steelblue',
  });

  return createWidget('dxTabPanel', {
    items: ['Item 1'],
  }, true, '#tabPanel');
});

test('[{0: selected}, {1}, {2}] -> click to tabs[1] -> navigate to tabs[2] -> click to external button', async () => {
  const tabPanel = new TabPanel('#tabPanel');

  await t
    .click(tabPanel.tabs.getItem(1).element)
    .expect(tabPanel.isFocused).ok()
    .expect(tabPanel.tabs.isFocused)
    .ok()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(1).isFocused)
    .ok()
    .expect(tabPanel.tabs.getItem(2).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(1).isFocused)
    .ok()
    .expect(tabPanel.multiView.getItem(2).isFocused)
    .notOk();

  await t
    .pressKey('right')
    .expect(tabPanel.isFocused).ok()
    .expect(tabPanel.tabs.isFocused)
    .ok()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(1).isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(2).isFocused)
    .ok()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(1).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(2).isFocused)
    .ok();

  await t
    .click(Selector('#focusoutButton'))
    .expect(tabPanel.isFocused).notOk()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(1).isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(2).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(1).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(2).isFocused)
    .notOk();
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabPanel');
  await appendElementTo('#container', 'button', 'focusoutButton', {
    width: '150px', height: '50px', backgroundColor: 'steelblue',
  });

  return createWidget('dxTabPanel', {
    items: ['Item 1', 'Item 2', 'Item 3'],
  }, true, '#tabPanel');
});

test('[{0: selected}, {1}] -> click to multiView -> navigate to tabs[1] -> click to external button', async () => {
  const tabPanel = new TabPanel('#tabPanel');

  await t
    .click(tabPanel.multiView.getItem(0).element)
    .expect(tabPanel.isFocused).ok()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .ok()
    .expect(tabPanel.tabs.getItem(1).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .ok()
    .expect(tabPanel.multiView.getItem(1).isFocused)
    .notOk();

  await t
    .pressKey('right')
    .expect(tabPanel.isFocused).ok()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(1).isFocused)
    .ok()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(1).isFocused)
    .ok();

  await t
    .click(Selector('#focusoutButton'))
    .expect(tabPanel.isFocused).notOk()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(1).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(1).isFocused)
    .notOk();
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabPanel');
  await appendElementTo('#container', 'button', 'focusoutButton', {
    width: '150px', height: '50px', backgroundColor: 'steelblue',
  });

  return createWidget('dxTabPanel', {
    items: ['Item 1', 'Item 2'],
  }, true, '#tabPanel');
});

test('[{0: selected}] -> click to multiView -> press "tab" -> press "tab"', async () => {
  const tabPanel = new TabPanel('#container');

  await t
    .click(tabPanel.multiView.getItem(0).element)
    .expect(tabPanel.isFocused).ok()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .ok()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .ok();

  await t
    .pressKey('tab')
    .expect(tabPanel.isFocused).ok()
    .expect(tabPanel.tabs.isFocused)
    .ok()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .ok()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk();

  await t
    .pressKey('tab')
    .expect(tabPanel.isFocused).notOk()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk();
}).before(async () => createWidget('dxTabPanel', {
  items: ['Item 1'],
}));

test('[{0: selected}] -> focusin by press "tab" -> press "tab"', async () => {
  const tabPanel = new TabPanel('#tabPanel');

  await t
    .click(Selector('#firstButton'))
    .pressKey('tab')
    .expect(tabPanel.isFocused).ok()
    .expect(tabPanel.tabs.isFocused)
    .ok()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .ok()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .ok();

  await t
    .pressKey('tab')
    .expect(tabPanel.isFocused).notOk()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk();
}).before(async () => {
  await appendElementTo('#container', 'button', 'firstButton', {
    width: '150px', height: '50px', backgroundColor: 'steelblue',
  });
  await appendElementTo('#container', 'div', 'tabPanel');

  return createWidget('dxTabPanel', {
    items: ['Item 1'],
  }, true, '#tabPanel');
});

fixture`Knockout T827626`
  .page(url(__dirname, '../pages/t827626.html'));

test.skip('TabPanel should not switch the active tab after content click the if it contains another TabPanel', async () => {
  const tabPanel = new TabPanel('#tabPanel');

  await appendElementTo('body', 'button', 'focusoutButton', {
    width: '150px', height: '50px', backgroundColor: 'steelblue',
  });

  await t
    .click(tabPanel.tabs.getItem(1).element)
    .expect(tabPanel.isFocused).ok()
    .expect(tabPanel.tabs.isFocused)
    .ok()
    .expect(tabPanel.tabs.getItem(1).isFocused)
    .ok()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(3).isFocused)
    .ok();

  await t
    .click(tabPanel.multiView.getItem(3).element)
    .expect(tabPanel.isFocused).ok()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(1).isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(3).isFocused)
    .ok();

  await t
    .click(Selector('#focusoutButton'))
    .expect(tabPanel.isFocused).notOk()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(1).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(3).isFocused)
    .notOk();
});
