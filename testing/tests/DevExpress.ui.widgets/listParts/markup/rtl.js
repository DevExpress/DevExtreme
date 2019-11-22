import $ from "jquery";

import "common.css!";
QUnit.module('List rtl', () => {
    [{ rtlEnabled: false, expectedTextAlign: 'start' }, { rtlEnabled: true, expectedTextAlign: 'right' }].forEach((testData) => {
        QUnit.test("Rtl mode -> text-align", assert => {
            const $list = $("#list").dxList({
                rtlEnabled: testData.rtlEnabled,
                items: [ 1, 2 ]
            });

            $list.find('.dx-list-item').each((_, item) => {
                assert.equal($(item).css('text-align'), testData.expectedTextAlign, `text-align is ${testData.expectedTextAlign}`);
            });
        });

        QUnit.test("Rtl mode -> text-align with bootstrap", assert => {
            const body = $('body');
            const initialTextAlign = body.css('text-align');

            body.css('text-align', 'start');
            const $list = $("#list").dxList({
                rtlEnabled: testData.rtlEnabled,
                items: [ 1, 2 ]
            });

            $list.find('.dx-list-item').each((_, item) => {
                assert.equal($(item).css('text-align'), testData.expectedTextAlign, `text-align is ${testData.expectedTextAlign}`);
            });

            body.css('text-align', initialTextAlign);
        });
    });
});
