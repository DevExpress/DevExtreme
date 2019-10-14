import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/testHelper';
import { Selector } from 'testcafe';
import TabPanel from '../../model/tabPanel';
import { appendElementTo } from './helpers/domUtils';

fixture `TabPanel`
    .page(url(__dirname, '../container.html'));

// T821726
test(`Check focused class on focusout after click on tab item -> focusout`, async t => {
    const tabPanel = new TabPanel('#container');
    
    await appendElementTo("body", "button", { id: "focusoutButton", width: 150, height: 50, backgroundColor: 'steelblue' });

    await t
        .click(tabPanel.tabs.getItem(1).element)
        .expect(tabPanel.isFocused).ok()
        .expect(tabPanel.tabs.isFocused).ok()
        .expect(tabPanel.tabs.getItem(1).isFocused).ok()
        .expect(tabPanel.multiview.getItem(1).isFocused).ok()

    await t
        .click(Selector("#focusoutButton"))
        .expect(tabPanel.isFocused).notOk()
        .expect(tabPanel.tabs.isFocused).notOk()
        .expect(tabPanel.tabs.getItem(1).isFocused).notOk()
        .expect(tabPanel.multiview.getItem(1).isFocused).notOk()

}).before(async t => {
    return createWidget("dxTabPanel", {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]
    });
});

test(`Check focused class on focusout after click on tab item -> focusout`, async t => {
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
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]
    });
});
