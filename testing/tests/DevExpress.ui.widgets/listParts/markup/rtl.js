import $ from "jquery";
const initList = (options) => $("#list").dxList(options);

import "common.css!";

QUnit.module('List');
QUnit.test("Rrl mode Text-align (T822293)", function(assert) {
    [{ rtlEnabled: false, expectedTextAlign: 'start' }, { rtlEnabled: true, expectedTextAlign: 'right' }].forEach((testData => {
        const $list = initList({
                rtlEnabled: testData.rtlEnabled,
                items: [ 1, 2 ]
            }), items = $list.find('.dx-list-item');

        items.each((index, item) => {
            assert.equal($(item).css('text-align'), testData.expectedTextAlign);
        });
    }));
});

QUnit.test("Rrl mode Text-align with bootstrap (T822293)", function(assert) {
    [{ rtlEnabled: false, expectedTextAlign: 'left' }, { rtlEnabled: true, expectedTextAlign: 'right' }].forEach((testData => {
        const body = $('body');
        body.css('text-align', 'left'); // T822293

        const $list = initList({
                rtlEnabled: testData.rtlEnabled,
                items: [ 1, 2 ]
            }), items = $list.find('.dx-list-item');


        items.each((index, item) => {
            assert.equal($(item).css('text-align'), testData.expectedTextAlign);
        });

        body.css('text-align', 'initial');
    }));
});
