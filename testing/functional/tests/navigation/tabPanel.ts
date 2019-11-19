import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/testHelper';
import { Selector } from 'testcafe';
import TabPanel from '../../model/tabPanel';
import { appendElementTo, insertElementBefore } from './helpers/domUtils';

fixture `TabPanel`
    .page(url(__dirname, '../container.html'));

// T821726
test(`[{0: selected}, {1}] -> click to tabs[1] -> click to external button`, async t => {
    const tabPanel = new TabPanel('#container');
    
    await appendElementTo("body", "button", { id: "focusoutButton", width: 150, height: 50, backgroundColor: 'steelblue' });

    await t
        .click(tabPanel.tabs.getItem(1).element)
        .expect(tabPanel.isFocused).ok()
        .expect(tabPanel.tabs.isFocused).ok()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.tabs.getItem(1).isFocused).ok()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(1).isFocused).ok()

    await t
        .click(Selector("#focusoutButton"))
        .expect(tabPanel.isFocused).notOk()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.tabs.getItem(1).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(1).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()

}).before(async t => {
    return createWidget("dxTabPanel", {
        items: ["Item 1", "Item 2"]
    });
});

test(`[{0: selected}] -> click to multiView -> click to external button`, async t => {
    const tabPanel = new TabPanel('#container');
    
    await appendElementTo("body", "button", { id: "focusoutButton", width: 150, height: 50, backgroundColor: 'steelblue' });

    await t
        .click(tabPanel.multiview.getItem(0).element)
        .expect(tabPanel.isFocused).ok()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(0).isFocused).ok()
        .expect(tabPanel.multiview.getItem(0).isFocused).ok()

    await t
        .click(Selector("#focusoutButton"))
        .expect(tabPanel.isFocused).notOk()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()

}).before(async t => {
    return createWidget("dxTabPanel", {
        items: ["Item 1"]
    });
});

test(`[{0: selected}, {1}, {2}] -> click to tabs[1] -> navigate to tabs[2] -> click to external button`, async t => {
    const tabPanel = new TabPanel('#container');
    
    await appendElementTo("body", "button", { id: "focusoutButton", width: 150, height: 50, backgroundColor: 'steelblue' });

    await t
        .click(tabPanel.tabs.getItem(1).element)
        .expect(tabPanel.isFocused).ok()
        .expect(tabPanel.tabs.isFocused).ok()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.tabs.getItem(1).isFocused).ok()
        .expect(tabPanel.tabs.getItem(2).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(1).isFocused).ok()
        .expect(tabPanel.multiview.getItem(2).isFocused).notOk()

    await t
        .pressKey("right")
        .expect(tabPanel.isFocused).ok()
        .expect(tabPanel.tabs.isFocused).ok()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.tabs.getItem(1).isFocused).notOk()
        .expect(tabPanel.tabs.getItem(2).isFocused).ok()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(1).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(2).isFocused).ok()

    await t
        .click(Selector("#focusoutButton"))
        .expect(tabPanel.isFocused).notOk()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.tabs.getItem(1).isFocused).notOk()
        .expect(tabPanel.tabs.getItem(2).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(1).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(2).isFocused).notOk()
       
        

}).before(async t => {
    return createWidget("dxTabPanel", {
        items: ["Item 1", "Item 2", "Item 3"]
    });
});

test(`[{0: selected}, {1}] -> click to multiview -> navigate to tabs[1] -> click to external button`, async t => {
    const tabPanel = new TabPanel('#container');
    
    await appendElementTo("body", "button", { id: "focusoutButton", width: 150, height: 50, backgroundColor: 'steelblue' });

    await t
        .click(tabPanel.multiview.getItem(0).element)
        .expect(tabPanel.isFocused).ok()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(0).isFocused).ok()
        .expect(tabPanel.tabs.getItem(1).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(0).isFocused).ok()
        .expect(tabPanel.multiview.getItem(1).isFocused).notOk()
    
    await t
        .pressKey("right")
        .expect(tabPanel.isFocused).ok()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.tabs.getItem(1).isFocused).ok()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(1).isFocused).ok()

    await t
        .click(Selector("#focusoutButton"))
        .expect(tabPanel.isFocused).notOk()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.tabs.getItem(1).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(1).isFocused).notOk()

}).before(async t => {
    return createWidget("dxTabPanel", {
        items: ["Item 1", "Item 2"]
    });
});

test(`[{0: selected}] -> click to multiview -> press "tab" -> press "tab"`, async t => {
    const tabPanel = new TabPanel('#container');

    await t
        .click(tabPanel.multiview.getItem(0).element)
        .expect(tabPanel.isFocused).ok()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(0).isFocused).ok()
        .expect(tabPanel.multiview.getItem(0).isFocused).ok()
        
    await t
        .pressKey("tab")
        .expect(tabPanel.isFocused).ok()
        .expect(tabPanel.tabs.isFocused).ok()
        .expect(tabPanel.tabs.getItem(0).isFocused).ok()
        .expect(tabPanel.multiview.getItem(0).isFocused).ok()

    await t
        .pressKey("tab")
        .expect(tabPanel.isFocused).notOk()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()

}).before(async t => {
    return createWidget("dxTabPanel", {
        items: ["Item 1"]
    });
});

test(`[{0: selected}] -> focusin by press "tab" -> press "tab"`, async t => {
    const tabPanel = new TabPanel('#container');

    await t
        .click(Selector("#firstButton"))
        .pressKey("tab")
        .expect(tabPanel.isFocused).ok()
        .expect(tabPanel.tabs.isFocused).ok()
        .expect(tabPanel.tabs.getItem(0).isFocused).ok()
        .expect(tabPanel.multiview.getItem(0).isFocused).ok()

    await t
        .pressKey("tab")
        .expect(tabPanel.isFocused).notOk()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()

}).before(async t => {
    await insertElementBefore("body", "#container", "button", { id: "firstButton", width: 150, height: 50, backgroundColor: 'steelblue' });

    return createWidget("dxTabPanel", {
        items: ["Item 1"]
    });
});

fixture `Knockout T827626`
    .page(url(__dirname, './pages/T827626.html'));

test(`TabPanel should not switch the active tab after content click the if it contains another TabPanel`, async t => {
    const tabPanel = new TabPanel('#tabPanel');

    await appendElementTo("body", "button", { id: "focusoutButton", width: 150, height: 50, backgroundColor: 'steelblue' });

    await t
        .click(tabPanel.tabs.getItem(1).element)
        .expect(tabPanel.isFocused).ok()
        .expect(tabPanel.tabs.isFocused).ok()
        .expect(tabPanel.tabs.getItem(1).isFocused).ok()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(3).isFocused).ok()

    await t
        .click(tabPanel.multiview.getItem(3).element)
        .expect(tabPanel.isFocused).ok()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(1).isFocused).notOk()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(3).isFocused).ok()

    await t
        .click(Selector("#focusoutButton"))
        .expect(tabPanel.isFocused).notOk()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(0).isFocused).notOk()
        .expect(tabPanel.tabs.getItem(1).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(0).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(3).isFocused).notOk()
});





