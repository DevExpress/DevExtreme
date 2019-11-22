import $ from "jquery";
const initTree = (options) => $("#treeView").dxTreeView(options);

import "common.css!";

QUnit.test("Rrl mode Text-align (T822293)", function(assert) {
    getTestData().forEach((testData => {
        const $treeView = initTree({
                rtlEnabled: testData.rtlEnabled,
                items: [ { id: "Item1", text: "Item1", items: [{ id: "Item1_1", text: "Item1_1" }] }, { id: "Item2", text: "Item_2" }]
            }), items = $treeView.find('.dx-treeview-item');

        items.each((index, item) => {
            assert.equal($(item).css('text-align'), testData.expectedTextAlign);
        });
    }));
});

QUnit.test("Rrl mode Text-align with bootstrap (T822293)", function(assert) {
    getTestData().forEach((testData => {
        const body = $('body');
        body.css('text-align', 'left'); // T822293

        const $treeView = initTree({
                rtlEnabled: testData.rtlEnabled,
                items: [ { id: "Item1", text: "Item1", items: [{ id: "Item1_1", text: "Item1_1" }] }, { id: "Item2", text: "Item_2" }]
            }), items = $treeView.find('.dx-treeview-item');


        items.each((index, item) => {
            assert.equal($(item).css('text-align'), testData.expectedTextAlign);
        });

        body.css('text-align', 'initial');
    }));
});

function getTestData() {
    return [{ rtlEnabled: false, expectedTextAlign: 'left' }, { rtlEnabled: true, expectedTextAlign: 'right' }];
}
