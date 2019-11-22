import $ from "jquery";
const initList = (options) => $("#list").dxList(options);

import "common.css!";
QUnit.module('List');

[{ rtlEnabled: false, expectedTextAlign: 'start' }, { rtlEnabled: true, expectedTextAlign: 'right' }].forEach((testData) => {
    QUnit.test("Rtl mode -> text-align (T822293)", function(assert) {
        const $list = initList({
                rtlEnabled: testData.rtlEnabled,
                items: [ 1, 2 ]
            }),
            items = $list.find('.dx-list-item');

        items.each((index, item) => {
            assert.equal($(item).css('text-align'), testData.expectedTextAlign);
        });
    });

    QUnit.test("Rtl mode -> text-align with bootstrap (T822293)", function(assert) {
        const body = $('body');
        const initialTextAlign = body.css('text-align');

        body.css('text-align', 'start');
        const $list = initList({
                rtlEnabled: testData.rtlEnabled,
                items: [ 1, 2 ]
            }),
            items = $list.find('.dx-list-item');

        items.each((index, item) => {
            assert.equal($(item).css('text-align'), testData.expectedTextAlign);
        });

        body.css('text-align', initialTextAlign);
    });
});

