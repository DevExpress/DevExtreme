import $ from "jquery";
import TreeViewTestWrapper from "../../../../helpers/TreeViewTestHelper.js";
const createWrapper = (options) => new TreeViewTestWrapper(options);

import "common.css!";
QUnit.module('TreeView', {
    beforeEach: function() {
        this.testSamples = [{ rtlEnabled: false, expectedTextAlign: 'left' }, { rtlEnabled: true, expectedTextAlign: 'right' }];
    }
});

QUnit.test("Rtl mode -> text-align (T822293)", function(assert) {
    this.testSamples.forEach((testData) => {
        const $treeWrapper = createWrapper({
                rtlEnabled: testData.rtlEnabled,
                items: [ { id: "Item1", text: "Item1", items: [{ id: "Item1_1", text: "Item1_1" }] }, { id: "Item2", text: "Item_2" }]
            }),
            items = $treeWrapper.getNodes();

        items.each((index, item) => {
            assert.equal($(item).css('text-align'), testData.expectedTextAlign);
        });
    });
});

QUnit.test("Rtl mode -> text-align with bootstrap (T822293)", function(assert) {
    const body = $('body');
    const initialTextAlign = body.css('text-align');

    this.testSamples.forEach((testData) => {
        body.css('text-align', 'left');

        const $treeWrapper = createWrapper({
                rtlEnabled: testData.rtlEnabled,
                items: [ { id: "Item1", text: "Item1", items: [{ id: "Item1_1", text: "Item1_1" }] }, { id: "Item2", text: "Item_2" }]
            }),
            items = $treeWrapper.getNodes();

        items.each((index, item) => {
            assert.equal($(item).css('text-align'), testData.expectedTextAlign);
        });

        body.css('text-align', initialTextAlign);
    });
});
