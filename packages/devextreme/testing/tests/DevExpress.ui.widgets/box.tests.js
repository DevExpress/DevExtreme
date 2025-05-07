import { triggerShownEvent } from 'common/core/events/visibility_change';
import $ from 'jquery';
import 'ui/box';
import 'ui/scroll_view/ui.scrollable';

import 'generic_light.css!';

const { testStart, module, test } = QUnit;

testStart(() => {
    const markup = `
        <div id="box"></div>
        <div id="boxWithScrollable">
            <div data-options="dxItem: { ratio: 1 }">
                <div id="scrollable">
                    <div id="content"></div>
                </div>
            </div>
        </div>
    `;
    $('#qunit-fixture').html(markup);
    $('#content').css({ height: '200px' });
});

const BOX_ITEM_CLASS = 'dx-box-item';
const BOX_ITEM_CONTENT_CLASS = 'dx-box-item-content';

const relativeOffset = ($element, $relativeElement) => {
    $relativeElement = $relativeElement || $element.parent();

    const elementOffset = $element.offset();
    const relativeElementOffset = $relativeElement.offset();

    return {
        top: elementOffset.top - relativeElementOffset.top,
        left: elementOffset.left - relativeElementOffset.left
    };
};

const createBox = (...parameters) => {
    if(parameters.length > 2) {
        return;
    }

    const selector = parameters.length === 1 ? '#box' : parameters[0];
    const options = parameters.length === 1 ? parameters[0] : parameters[1];
    return $(selector).dxBox(options);
};
const getBoxInstance = $element => $($element).dxBox('instance');

module('Scrollable integration', () => {
    test('Scrollable placed in dxBox stretch correctly', function(assert) {
        const $box = createBox('#boxWithScrollable', {
            height: 100,
            direction: 'col'
        });

        const $scrollable = $box.find('#scrollable').dxScrollable();

        assert.equal($scrollable.height(), 100, 'Scrollable height is correct');
    });
});

module('layouting', () => {
    test('direction column', function(assert) {
        const size = 100;
        const $box = createBox({
            direction: 'col',
            items: [{ ratio: 1 }, { ratio: 1 }],
            width: size,
            height: size
        });

        const $items = $box.find('.' + BOX_ITEM_CLASS);

        const $firstItem = $items.eq(0);
        const firstItemLayout = $.extend(relativeOffset($firstItem), {
            width: $firstItem.width(),
            height: $firstItem.height()
        });

        const firstItemExpectedLayout = {
            top: 0,
            left: 0,
            width: size,
            height: size / 2
        };

        assert.deepEqual(firstItemLayout, firstItemExpectedLayout, 'first item positioned correctly');


        const $secondItem = $items.eq(1);
        const secondItemLayout = $.extend(relativeOffset($secondItem), {
            width: $secondItem.width(),
            height: $secondItem.height()
        });

        const secondItemExpectedLayout = {
            top: size / 2,
            left: 0,
            width: size,
            height: size / 2
        };

        assert.deepEqual(secondItemLayout, secondItemExpectedLayout, 'second item positioned correctly');
    });

    test('direction row', function(assert) {
        const size = 100;
        const $box = createBox({
            direction: 'row',
            items: [{ ratio: 1 }, { ratio: 1 }],
            width: size,
            height: size
        });

        const $items = $box.find('.' + BOX_ITEM_CLASS);

        const $firstItem = $items.eq(0);
        const firstItemLayout = $.extend(relativeOffset($firstItem), {
            width: $firstItem.width(),
            height: $firstItem.height()
        });

        const firstItemExpectedLayout = {
            top: 0,
            left: 0,
            width: size / 2,
            height: size
        };

        assert.deepEqual(firstItemLayout, firstItemExpectedLayout, 'first item positioned correctly');

        const $secondItem = $items.eq(1);
        const secondItemLayout = $.extend(relativeOffset($secondItem), {
            width: $secondItem.width(),
            height: $secondItem.height()
        });

        const secondItemExpectedLayout = {
            top: 0,
            left: size / 2,
            width: size / 2,
            height: size
        };

        assert.deepEqual(secondItemLayout, secondItemExpectedLayout, 'second item positioned correctly');

        const $firstItemContent = $firstItem.find('.' + BOX_ITEM_CONTENT_CLASS);
        $firstItemContent.append($('<div>').width(0.75 * size));

        assert.equal($firstItemContent.width(), size / 2, 'item content width is less or equal to item width');
    });

    test('align for column direction', function(assert) {
        const baseSize = 40;
        const boxSize = baseSize * 5;
        const $box = createBox({
            direction: 'col',
            align: 'start',
            items: [{ baseSize: baseSize }, { baseSize: baseSize }],
            height: boxSize
        });

        const $boxItems = $box.find('.' + BOX_ITEM_CLASS);

        const $firstItem = $boxItems.eq(0);
        assert.equal(relativeOffset($firstItem).top, 0, 'first item positioned correctly for align: start');

        const $secondItem = $boxItems.eq(1);
        assert.equal(relativeOffset($secondItem).top, baseSize, 'second item positioned correctly for align: start');

        const box = getBoxInstance($box);
        box.option('align', 'end');

        assert.equal(relativeOffset($firstItem).top, boxSize - 2 * baseSize, 'first item positioned correctly for align: end');
        assert.equal(relativeOffset($secondItem).top, boxSize - baseSize, 'second item positioned correctly for align: end');

        box.option('align', 'space-between');

        assert.equal(relativeOffset($firstItem).top, 0, 'first item positioned correctly for align: space-between');
        assert.equal(relativeOffset($secondItem).top, boxSize - baseSize, 'second item positioned correctly for align: space-between');

        box.option('align', 'center');

        assert.equal(relativeOffset($firstItem).top, (boxSize - 2 * baseSize) / 2, 'first item positioned correctly for align: center');
        assert.equal(relativeOffset($secondItem).top, (boxSize - 2 * baseSize) / 2 + baseSize, 'second item positioned correctly for align: center');

        box.option('align', 'space-around');

        assert.equal(relativeOffset($firstItem).top, (boxSize / 2 - baseSize) / 2, 'first item positioned correctly for align: space-around');
        assert.equal(relativeOffset($secondItem).top, (boxSize / 2) + (boxSize / 2 - baseSize) / 2, 'second item positioned correctly for align: space-around');
    });

    test('align for row direction', function(assert) {
        const baseSize = 40;
        const boxSize = baseSize * 5;
        const $box = createBox({
            direction: 'row',
            align: 'start',
            items: [{ baseSize: baseSize }, { baseSize: baseSize }],
            width: boxSize
        });

        const $boxItems = $box.find('.' + BOX_ITEM_CLASS);

        const $firstItem = $boxItems.eq(0);
        assert.equal(relativeOffset($firstItem).left, 0, 'first item positioned correctly for align: start');

        const $secondItem = $boxItems.eq(1);
        assert.equal(relativeOffset($secondItem).left, baseSize, 'second item positioned correctly for align: start');

        const box = getBoxInstance($box);

        box.option('align', 'end');
        assert.equal(relativeOffset($firstItem).left, boxSize - 2 * baseSize, 'first item positioned correctly for align: end');
        assert.equal(relativeOffset($secondItem).left, boxSize - baseSize, 'second item positioned correctly for align: end');

        box.option('align', 'space-between');
        assert.equal(relativeOffset($firstItem).left, 0, 'first item positioned correctly for align: space-between');
        assert.equal(relativeOffset($secondItem).left, boxSize - baseSize, 'second item positioned correctly for align: space-between');

        box.option('align', 'center');
        assert.equal(relativeOffset($firstItem).left, (boxSize - 2 * baseSize) / 2, 'first item positioned correctly for align: center');
        assert.equal(relativeOffset($secondItem).left, (boxSize - 2 * baseSize) / 2 + baseSize, 'second item positioned correctly for align: center');

        box.option('align', 'space-around');
        assert.equal(relativeOffset($firstItem).left, (boxSize / 2 - baseSize) / 2, 'first item positioned correctly for align: space-around');
        assert.equal(relativeOffset($secondItem).left, (boxSize / 2) + (boxSize / 2 - baseSize) / 2, 'second item positioned correctly for align: space-around');
    });

    test('crossAlign for column direction', function(assert) {
        const size = 50;
        const boxSize = 2 * size;
        const $box = createBox({
            direction: 'col',
            crossAlign: 'start',
            items: [{ template: $('<div>').css({ width: `${size}px` }) }],
            width: boxSize
        });
        const box = getBoxInstance($box);

        const $item = $box.find('.' + BOX_ITEM_CLASS).eq(0);
        assert.equal(relativeOffset($item).left, 0, 'item positioned for crossAlign: start');
        assert.equal($item.width(), size, 'item is stretched over content');


        box.option('crossAlign', 'end');
        assert.equal(relativeOffset($item).left, boxSize - size, 'item positioned for crossAlign: end');
        assert.equal($item.width(), size, 'item is stretched over content');

        box.option('crossAlign', 'center');
        assert.equal(relativeOffset($item).left, (boxSize - size) / 2, 'item positioned for crossAlign: center');
        assert.equal($item.width(), size, 'item is stretched over content');

        box.option('crossAlign', 'stretch');
        assert.equal(relativeOffset($item).left, 0, 'item positioned for crossAlign: stretch');
        assert.equal($item.width(), boxSize, 'element is stretched over container');
    });

    test('crossAlign for row direction', function(assert) {
        const size = 50;
        const boxSize = 2 * size;
        const $box = createBox({
            direction: 'row',
            crossAlign: 'start',
            items: [{ template: $('<div>').css({ height: `${size}px` }) }],
            height: boxSize
        });
        const box = getBoxInstance($box);

        const $item = $box.find('.' + BOX_ITEM_CLASS).eq(0);
        assert.equal(relativeOffset($item).top, 0, 'item positioned for crossAlign: start');
        assert.equal($item.height(), size, 'item is stretched over content');


        box.option('crossAlign', 'end');
        assert.equal(relativeOffset($item).top, boxSize - size, 'item positioned for crossAlign: end');
        assert.equal($item.height(), size, 'item is stretched over content');

        box.option('crossAlign', 'center');
        assert.equal(relativeOffset($item).top, (boxSize - size) / 2, 'item positioned for crossAlign: center');
        assert.equal($item.height(), size, 'item is stretched over content');

        box.option('crossAlign', 'stretch');
        assert.equal(relativeOffset($item).top, 0, 'item positioned for crossAlign: stretch');
        assert.equal($item.height(), boxSize, 'element is stretched over container');
    });

    test('percent baseSize', function(assert) {
        const firstItemDimension = { baseSize: '60%' };
        const secondItemDimension = { baseSize: '40%' };

        const boxSize = 300;
        const $box = createBox({
            direction: 'row',
            items: [firstItemDimension, secondItemDimension],
            width: boxSize
        });

        const $items = $box.find('.' + BOX_ITEM_CLASS);
        const $firstItem = $items.eq(0);
        const $secondItem = $items.eq(1);

        assert.equal($firstItem.width(), 0.6 * boxSize, 'first item has correct size');
        assert.equal($secondItem.width(), 0.4 * boxSize, 'second item has correct size');
    });

    test('items with auto baseSize should have size of content', function(assert) {
        const firstItemDimension = { ratio: 0, baseSize: 'auto' };
        const secondItemDimension = { ratio: 0, baseSize: 'auto' };

        const boxSize = 300;
        const $box = createBox({
            direction: 'row',
            items: [firstItemDimension, secondItemDimension],
            width: boxSize,
            onItemRendered: args => {
                const $content = $('<div>').width(50);
                $(args.itemElement).children().append($content);
            }
        });

        const $items = $box.find('.' + BOX_ITEM_CLASS);
        const $firstItem = $items.eq(0);
        const $secondItem = $items.eq(1);

        assert.equal($firstItem.width(), 50, 'first item has correct size');
        assert.equal($secondItem.width(), 50, 'second item has correct size');
    });

    test('items should have baseSize 0 by default', function(assert) {
        const firstItemDimension = { ratio: 1 };
        const secondItemDimension = { ratio: 1 };
        const boxSize = 300;
        let itemWidth = 50;

        const $box = createBox({
            direction: 'row',
            items: [firstItemDimension, secondItemDimension],
            width: boxSize,
            onItemRendered: args => {
                const $content = $('<div>').width(itemWidth);
                $(args.itemElement).children().append($content);
                itemWidth += 50;
            }
        });

        const $items = $box.find('.' + BOX_ITEM_CLASS);
        const $firstItem = $items.eq(0);
        const $secondItem = $items.eq(1);

        assert.equal($firstItem.width(), $secondItem.width(), 'items has same width');
    });

    test('baseSize and ratio option', function(assert) {
        const firstItemDimension = { ratio: 1, baseSize: 100 };
        const secondItemDimension = { ratio: 3, baseSize: 20 };
        const boxSize = 300;
        const $box = createBox({
            direction: 'row',
            items: [firstItemDimension, secondItemDimension],
            width: boxSize
        });

        const $items = $box.find('.' + BOX_ITEM_CLASS);
        const $firstItem = $items.eq(0);
        const $secondItem = $items.eq(1);

        const freeSpace = boxSize - firstItemDimension.baseSize - secondItemDimension.baseSize;
        const partsCount = firstItemDimension.ratio + secondItemDimension.ratio;
        const partSpace = freeSpace / partsCount;

        assert.equal($firstItem.width(), firstItemDimension.baseSize + firstItemDimension.ratio * partSpace, 'first item has correct size');
        assert.equal($secondItem.width(), secondItemDimension.baseSize + secondItemDimension.ratio * partSpace, 'second item has correct size');
    });

    test('default shrink option', function(assert) {
        const firstItemDimension = { ratio: 1, baseSize: 160 };
        const secondItemDimension = { ratio: 3, baseSize: 40 };
        const thirdItemDimension = { ratio: 3 };
        const boxSize = 100;
        const $box = createBox({
            direction: 'row',
            items: [firstItemDimension, secondItemDimension, thirdItemDimension],
            width: boxSize
        });

        const $items = $box.find('.' + BOX_ITEM_CLASS);
        const $firstItem = $items.eq(0);
        const $secondItem = $items.eq(1);
        const $thirdItem = $items.eq(2);

        const totalBaseSize = firstItemDimension.baseSize + secondItemDimension.baseSize;
        const firstItemWidth = boxSize * firstItemDimension.baseSize / totalBaseSize;
        const secondItemWidth = boxSize * secondItemDimension.baseSize / totalBaseSize;

        assert.equal($firstItem.width(), firstItemWidth, 'first item has correct size');
        assert.equal($secondItem.width(), secondItemWidth, 'second item has correct size');
        assert.equal($thirdItem.width(), 0, 'third item has correct size');
    });

    test('minSize & maxSize', function(assert) {
        const boxSize = 100;
        const minSize = 80;
        const maxSize = 5;

        const $box = createBox({
            items: [
                { baseSize: 0, ratio: 1, minSize: minSize },
                { ratio: 1, maxSize: maxSize },
                { ratio: 1 }
            ],
            direction: 'row',
            width: boxSize,
            height: boxSize
        });

        let $firstItem = $box.find('.' + BOX_ITEM_CLASS).eq(0);
        let $secondItem = $box.find('.' + BOX_ITEM_CLASS).eq(1);

        assert.equal($firstItem.width(), minSize, 'first item width is min-width');
        assert.equal($secondItem.width(), maxSize, 'second item width is max-width');

        $box.dxBox('option', 'direction', 'col');
        $firstItem = $box.find('.' + BOX_ITEM_CLASS).eq(0);
        $secondItem = $box.find('.' + BOX_ITEM_CLASS).eq(1);
        const $thirdItem = $box.find('.' + BOX_ITEM_CLASS).eq(2);

        assert.equal($firstItem.height(), minSize, 'first item height is min-height');
        assert.equal($secondItem.height(), maxSize, 'second item height is max-height');
        assert.equal($thirdItem.css('minHeight'), '0px', 'min-height is 0 by default');
    });

    test('rendering after visibility changing', function(assert) {
        const $box = createBox({
            direction: 'row',
            items: [{ ratio: 1, baseSize: 0 }, { ratio: 1, baseSize: 0 }],
            visible: false,
        });

        $box.parent().width(100);

        $box.dxBox('option', 'visible', true);

        const $items = $box.find('.' + BOX_ITEM_CLASS);
        const $firstItem = $items.eq(0);
        const $secondItem = $items.eq(1);

        assert.equal($firstItem.width(), $box.width() / 2, 'first item has correct size');
        assert.equal($secondItem.width(), $box.width() / 2, 'second item has correct size');
    });

    test('shrink', function(assert) {
        const boxSize = 100;
        const itemBaseSize = 100;
        const shrinkRatio1 = 1;
        const shrinkRatio2 = 3;

        const $box = $('#box').height(boxSize).dxBox({
            direction: 'col',
            items: [{ baseSize: boxSize, shrink: shrinkRatio1 }, { baseSize: boxSize, shrink: shrinkRatio2 }]
        });

        const $items = $box.find('.' + BOX_ITEM_CLASS);

        assert.equal($items.eq(0).height(), itemBaseSize - (itemBaseSize * 2 - boxSize) / (shrinkRatio1 + shrinkRatio2) * shrinkRatio1);
        assert.equal($items.eq(1).height(), itemBaseSize - (itemBaseSize * 2 - boxSize) / (shrinkRatio1 + shrinkRatio2) * shrinkRatio2);
    });

    test('shrink may be set to 0', function(assert) {
        const boxSize = 100;
        const firstItemSize = 75;
        const secondItemSize = 100;
        const firstItemShrink = 0;
        const secondItemShrink = 1;

        const $box = $('#box').height(boxSize).dxBox({
            direction: 'col',
            items: [{ baseSize: firstItemSize, shrink: firstItemShrink }, { baseSize: secondItemSize, shrink: secondItemShrink }]
        });

        const $items = $box.find('.' + BOX_ITEM_CLASS);

        assert.equal($items.eq(0).height(), firstItemSize - (firstItemSize + secondItemSize - boxSize) / (firstItemShrink + secondItemShrink) * firstItemShrink);
        assert.equal($items.eq(1).height(), secondItemSize - (firstItemSize + secondItemSize - boxSize) / (firstItemShrink + secondItemShrink) * secondItemShrink);
    });

    test('total baseSize should be used when size is zero', function(assert) {
        const baseSize1 = 100;
        const baseSize2 = 200;

        const $box = createBox({
            direction: 'col',
            items: [{ baseSize: baseSize1, ratio: 2 }, { baseSize: baseSize2, ratio: 1 }],
            height: 'auto'
        });

        assert.equal($box.height(), baseSize1 + baseSize2, 'box height calculated based on total baseSize');
    });

    test('baseSize in % in invisible area', function(assert) {
        const $box = $('#box').hide().dxBox({
            height: 100,
            direction: 'col',
            items: [{ baseSize: '50%', ratio: 0 }, { baseSize: '50%', ratio: 0 }]
        });
        const $items = $box.find('.' + BOX_ITEM_CLASS);
        const round = Math.round;
        $box.show();
        triggerShownEvent($box);

        assert.equal(round($items.eq(0).outerHeight()), round($box.outerHeight() * 0.5), 'first item has correct width');
        assert.equal(round($items.eq(0).outerHeight()), round($box.outerHeight() * 0.5), 'second item has correct width');
    });

    test('items size should be changed inside fieldset', function(assert) {
        const $box = $('#box');
        const $wrapper = $box.wrap('<fieldset>').parent();
        $wrapper.width(400);

        $box.dxBox({
            direction: 'row',
            items: [{ baseSize: 0, ratio: 1 }, { baseSize: 0, ratio: 1 }]
        });

        $wrapper.width(200);

        const $items = $box.find('.' + BOX_ITEM_CLASS);

        assert.equal($items.eq(0).outerWidth(), 100, 'items rendered correctly');
    });
});

module('layouting in RTL', () => {
    test('align for row direction', function(assert) {
        const baseSize = 40;
        const boxSize = baseSize * 5;
        const $box = createBox({
            direction: 'row',
            align: 'start',
            items: [{ baseSize: baseSize }, { baseSize: baseSize }],
            width: boxSize,
            rtlEnabled: true,
        });

        const $boxItems = $box.find('.' + BOX_ITEM_CLASS);

        const $firstItem = $boxItems.eq(0);
        assert.equal(relativeOffset($firstItem).left, boxSize - baseSize, 'first item positioned correctly for align: start');

        const $secondItem = $boxItems.eq(1);
        assert.equal(relativeOffset($secondItem).left, boxSize - 2 * baseSize, 'second item positioned correctly for align: start');

        const box = getBoxInstance($box);
        box.option('align', 'end');

        assert.equal(relativeOffset($firstItem).left, baseSize, 'first item positioned correctly for align: end');
        assert.equal(relativeOffset($secondItem).left, 0, 'second item positioned correctly for align: end');

        box.option('align', 'center');

        assert.equal(relativeOffset($firstItem).left, (boxSize - 2 * baseSize) / 2 + baseSize, 'first item positioned correctly for align: center');
        assert.equal(relativeOffset($secondItem).left, (boxSize - 2 * baseSize) / 2, 'second item positioned correctly for align: center');

        box.option('align', 'space-between');

        assert.equal(relativeOffset($firstItem).left, boxSize - baseSize, 'first item positioned correctly for align: space-between');
        assert.equal(relativeOffset($secondItem).left, 0, 'second item positioned correctly for align: space-between');

        box.option('align', 'space-around');
        assert.equal(relativeOffset($firstItem).left, (boxSize / 2) + (boxSize / 2 - baseSize) / 2, 'first item positioned correctly for align: space-around');
        assert.equal(relativeOffset($secondItem).left, (boxSize / 2 - baseSize) / 2, 'second item positioned correctly for align: space-around');
    });

    test('crossAlign for column direction', function(assert) {
        const size = 50;
        const boxSize = 2 * size;
        const $box = createBox({
            direction: 'col',
            crossAlign: 'start',
            items: [{ template: $('<div>').css({ width: `${size}px` }) }],
            width: boxSize,
            rtlEnabled: true,
        });
        const box = getBoxInstance($box);

        const $item = $box.find('.' + BOX_ITEM_CLASS).eq(0);
        assert.equal(relativeOffset($item).left, size, 'item positioned for crossAlign: start');
        assert.equal($item.width(), size, 'item is stretched over content');

        box.option('crossAlign', 'end');
        assert.equal(relativeOffset($item).left, 0, 'item positioned for crossAlign: end');
        assert.equal($item.width(), size, 'item is stretched over content');

        box.option('crossAlign', 'center');
        assert.equal(relativeOffset($item).left, (boxSize - size) / 2, 'item positioned for crossAlign: center');
        assert.equal($item.width(), size, 'item is stretched over content');

        box.option('crossAlign', 'stretch');
        assert.equal(relativeOffset($item).left, 0, 'item positioned for crossAlign: stretch');
        assert.equal($item.width(), boxSize, 'element is stretched over container');
    });
});
