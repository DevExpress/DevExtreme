import $ from 'jquery';
import fx from 'common/core/animation/fx';
import { animation, _translator } from '__internal/ui/multi_view/m_multi_view.animation';
import 'ui/multi_view';

import 'generic_light.css!';

QUnit.module('Integration tests', {
    beforeEach: function(assert) {
        fx.off = true;
        const that = this;
        this.originalAnimationMoveTo = animation.moveTo;
        animation.moveTo = function($element, position) {
            assert.notEqual(position, 'NaN%', `${position} is not a %, _animation.moveTo`);
            that.originalAnimationMoveTo.apply(null, arguments);
        };

        this.originalTranslatorMove = _translator.move;
        _translator.move = function($element, position) {
            assert.notEqual(position, 'NaN%', `${position} is not a %, _animation.moveTo`);
            that.originalTranslatorMove.apply(null, arguments);
        };

        this.$multiView = $('<div id="myView"></div>').appendTo('#qunit');
    },
    afterEach: function() {
        this.$multiView.remove();
        _translator.move = this.originalTranslatorMove;
        animation.moveTo = this.originalAnimationMoveTo;
        fx.off = false;
    }
},
function() {
    function getElementId(text) {
        return `_${text}`;
    }

    function checkContainsElements(assert, $element, idList) {
        idList.forEach((id) => { assert.equal($element.find('#' + getElementId(id)).length, 1, `contains '${id}', checkContainsElements`); });
    }

    function checkNotContainsElements(assert, $element, idList) {
        idList.forEach((id) => { assert.equal($element.find('#' + getElementId(id)).length, 0, `doesn't contain '${id}', checkNotContainsElements`); });
    }

    function checkItemRect(assert, $multiView, itemText, expectedRect) {
        const $element = $multiView.find('#' + getElementId(itemText));
        assert.equal($element.length, 1, `'#${itemText}' was found, checkItemBoundingClientRect('${itemText}')`);

        const rect = $element[0].getBoundingClientRect();
        assert.ok(Math.abs(expectedRect.left - rect.left) < 10, `expected left: ${expectedRect.left}, left: ${rect.left}, checkItemBoundingClientRect('${itemText}')`);
        assert.ok(Math.abs(expectedRect.width - rect.width) < 10, `expected width: ${expectedRect.width}, width: ${rect.width}, checkItemBoundingClientRect('${itemText}')`);
    }

    [false, true].forEach(deferRendering => {
        [false, true].forEach(rtlEnabled => {
            [undefined, 100].forEach(height => {

                const context = `, rtlEnabled:${rtlEnabled}, height:${height}`;

                function createMultiView(options) {
                    options.deferRendering = deferRendering;
                    options.rtlEnabled = rtlEnabled;
                    options.height = height;
                    options.width = 200;
                    options.animationEnabled = false;
                    options.itemTemplate = (itemData) => `<div id='${getElementId(itemData)}'>${itemData}</div>`;

                    return $('#myView').dxMultiView(options);
                }

                QUnit.test('[{0,selected}, 1]' + context, function(assert) {
                    const $multiView = createMultiView({
                        items: [0, 1],
                        selectedIndex: 0
                    });

                    checkContainsElements(assert, $multiView, [0]);
                    if(deferRendering) {
                        checkNotContainsElements(assert, $multiView, [1]);
                    } else {
                        checkContainsElements(assert, $multiView, [1]);
                    }
                    checkItemRect(assert, $multiView, 0, { left: 0, width: 200 });
                });

                QUnit.test('[{0,selected}, 1] -> [options(selectedIndex,1)]' + context, function(assert) {
                    const $multiView = createMultiView({
                        items: [0, 1],
                        selectedIndex: 0
                    });
                    const instance = $multiView.dxMultiView('instance');

                    instance.option('selectedIndex', 1);

                    checkContainsElements(assert, $multiView, [0, 1]);
                    checkItemRect(assert, $multiView, 1, { left: 0, width: 200 });
                });

                QUnit.test('[{0,selected}, 1, 2]' + context, function(assert) {
                    const $multiView = createMultiView({
                        items: [0, 1, 2],
                        selectedIndex: 0
                    });

                    checkContainsElements(assert, $multiView, [0]);
                    if(deferRendering) {
                        checkNotContainsElements(assert, $multiView, [1, 2]);
                    } else {
                        checkContainsElements(assert, $multiView, [1, 2]);
                    }
                    checkItemRect(assert, $multiView, 0, { left: 0, width: 200 });
                });

                QUnit.test('[{0,selected}, 1, 2] -> [options(selectedIndex,1)] -> [options(selectedIndex,2)]' + context, function(assert) {
                    const $multiView = createMultiView({
                        items: [0, 1, 2],
                        selectedIndex: 0
                    });
                    const instance = $multiView.dxMultiView('instance');

                    instance.option('selectedIndex', 1);

                    checkContainsElements(assert, $multiView, [0, 1]);
                    if(deferRendering) {
                        checkNotContainsElements(assert, $multiView, [2]);
                    } else {
                        checkContainsElements(assert, $multiView, [2]);
                    }
                    checkItemRect(assert, $multiView, 1, { left: 0, width: 200 });

                    instance.option('selectedIndex', 2);

                    checkContainsElements(assert, $multiView, [0, 1, 2]);
                    checkItemRect(assert, $multiView, 2, { left: 0, width: 200 });
                });

                QUnit.test('[0, {1,selected}, 2]' + context, function(assert) {
                    const $multiView = createMultiView({
                        items: [0, 1, 2],
                        selectedIndex: 1
                    });

                    checkContainsElements(assert, $multiView, [1]);
                    if(deferRendering) {
                        checkNotContainsElements(assert, $multiView, [0, 2]);
                    } else {
                        checkContainsElements(assert, $multiView, [0, 2]);
                    }
                    checkItemRect(assert, $multiView, 1, { left: 0, width: 200 });
                });

                QUnit.test('[0, {1,selected}, 2] -> [options(selectedIndex, 0)]' + context, function(assert) {
                    const $multiView = createMultiView({
                        items: [0, 1, 2],
                        selectedIndex: 1
                    });
                    const instance = $multiView.dxMultiView('instance');
                    instance.option('selectedIndex', 0);

                    checkContainsElements(assert, $multiView, [0, 1]);
                    if(deferRendering) {
                        checkNotContainsElements(assert, $multiView, [2]);
                    } else {
                        checkContainsElements(assert, $multiView, [2]);
                    }
                    checkItemRect(assert, $multiView, 0, { left: 0, width: 200 });
                });

                QUnit.test('[0, {1,selected}, 2] -> [options(selectedIndex, 2)]' + context, function(assert) {
                    const $multiView = createMultiView({
                        items: [0, 1, 2],
                        selectedIndex: 1
                    });
                    const instance = $multiView.dxMultiView('instance');
                    instance.option('selectedIndex', 2);

                    checkContainsElements(assert, $multiView, [1, 2]);
                    if(deferRendering) {
                        checkNotContainsElements(assert, $multiView, [0]);
                    } else {
                        checkContainsElements(assert, $multiView, [0]);
                    }
                    checkItemRect(assert, $multiView, 2, { left: 0, width: 200 });
                });
            });
        });
    });
});
