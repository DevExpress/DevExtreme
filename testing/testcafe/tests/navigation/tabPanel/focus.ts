import { Selector, t } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import TabPanel from '../../../model/tabPanel';
import { appendElementTo } from '../../../helpers/domUtils';

fixture`TabPanel`
  .page(url(__dirname, '../../container.html'));

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
    .click(Selector('body'), { offsetY: 400 })
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

  return createWidget('dxTabPanel', {
    items: ['Item 1', 'Item 2'],
  }, '#tabPanel');
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
    .click(Selector('body'), { offsetY: 400 })
    .expect(tabPanel.isFocused).notOk()
    .expect(tabPanel.tabs.isFocused)
    .notOk()
    .expect(tabPanel.tabs.getItem(0).isFocused)
    .notOk()
    .expect(tabPanel.multiView.getItem(0).isFocused)
    .notOk();
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabPanel');

  return createWidget('dxTabPanel', {
    items: ['Item 1'],
  }, '#tabPanel');
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
    .click(Selector('body'), { offsetY: 400 })
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

  return createWidget('dxTabPanel', {
    items: ['Item 1', 'Item 2', 'Item 3'],
  }, '#tabPanel');
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
    .click(Selector('body'), { offsetY: 400 })
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

  return createWidget('dxTabPanel', {
    items: ['Item 1', 'Item 2'],
  }, '#tabPanel');
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
    .click(Selector('body'), { offsetY: 400 })
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
  await appendElementTo('#container', 'div', 'tabPanel');

  return createWidget('dxTabPanel', {
    items: ['Item 1'],
  }, '#tabPanel');
});
