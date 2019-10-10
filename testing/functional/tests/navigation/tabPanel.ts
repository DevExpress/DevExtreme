import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/testHelper';
import { Selector } from 'testcafe';
import TabPanel from '../../model/tabPanel';
import { appendElementTo } from './helpers/domUtils';

fixture `TabPanel`
    .page(url(__dirname, '../container.html'));

// T821726
test(`Tabs lose focus class on focusout, click on multiview -> focusout`, async t => {
    const tabPanel = new TabPanel('#container');
    
    await appendElementTo("body", "button", { id: "mouseLeaveButton", width: 150, height: 50, backgroundColor: 'steelblue' });

    await t
        .click(tabPanel.tabs.getItem(1).element)
        .expect(tabPanel.tabs.getItem(1).isFocused).ok()

    await t.click(Selector("#mouseLeaveButton"))
}).before(async t => {
    return createWidget("dxTabPanel", {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]
    });
});
