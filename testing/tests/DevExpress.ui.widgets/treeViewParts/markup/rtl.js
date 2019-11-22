import $ from "jquery";
import TreeViewTestWrapper from "../../../../helpers/TreeViewTestHelper.js";

import "common.css!";
QUnit.module('TreeView rtl', {
    beforeEach: () => {
        this.items = [ { id: "Item1", text: "Item1", items: [{ id: "Item1_1", text: "Item1_1" }] }, { id: "Item2", text: "Item_2" }];
    } }, () => {
    [{ rtlEnabled: false, expectedTextAlign: 'left' }, { rtlEnabled: true, expectedTextAlign: 'right' }].forEach((testData) => {
        QUnit.test("Rtl mode -> text-align", assert => {
            const $treeWrapper = new TreeViewTestWrapper({
                rtlEnabled: testData.rtlEnabled,
                items: this.items
            });

            $treeWrapper.getNodes().each((_, item) => {
                assert.equal($(item).css('text-align'), testData.expectedTextAlign, `text-align is ${testData.expectedTextAlign}`);
            });
        });

        QUnit.test("Rtl mode -> text-align with bootstrap", assert => {
            const body = $('body');
            const initialTextAlign = body.css('text-align');

            body.css('text-align', 'left');
            const $treeWrapper = new TreeViewTestWrapper({
                rtlEnabled: testData.rtlEnabled,
                items: this.items
            });

            $treeWrapper.getNodes().each((_, item) => {
                assert.equal($(item).css('text-align'), testData.expectedTextAlign, `text-align is ${testData.expectedTextAlign}`);
            });

            body.css('text-align', initialTextAlign);
        });
    });
});
