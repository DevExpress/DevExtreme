import $ from 'jquery';
import globalConfig from 'core/config';
import keyboardMock from '../../helpers/keyboardMock.js';
import { DataSource } from 'common/data/data_source/data_source';
import { isRenderer } from 'core/utils/type';
import { deferUpdate } from 'core/utils/common';

import 'ui/tile_view';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        `<div id="widget"></div>
        <div id="widthRootStyle"></div>`;

    $('#qunit-fixture').html(markup);
    $('#widthRootStyle').css('width', '300px');
});

const TILEVIEW_CONTAINER_CLASS = 'dx-tileview-wrapper';
const TILEVIEW_ITEM_CLASS = 'dx-tile';
const TILEVIEW_ITEM_SELECTOR = '.' + TILEVIEW_ITEM_CLASS;

const SCROLLVIEW_CONTENT_CLASS = 'dx-scrollview-content';

const DEFAULT_ITEMSIZE = 100;
const DEFAULT_ITEMMARGIN = 20;
const DEFAULT_ITEMOFFSET = DEFAULT_ITEMSIZE + DEFAULT_ITEMMARGIN;


const items = [{
    text: 'item1'
}, {
    text: 'item2',
    mainRatio: 3
}, {
    text: 'item3',
    mainRatio: 2,
    crossRatio: 2
}, {
    text: 'item4',
    mainRatio: 2,
    crossRatio: 2
}, {
    text: 'item5',
    mainRatio: 2,
    crossRatio: 2
}, {
    text: 'item6',
    crossRatio: 2
}, {
    text: 'item7',
    mainRatio: 2
}, {
    text: 'item8',
    mainRatio: -3,
    crossRatio: -3
}, {
    text: 'item9',
    mainRatio: 1.9,
    crossRatio: 1.9
}, {
    text: 'item10',
    mainRatio: 2.1,
    crossRatio: 2.1
}];

const configs = {
    'horizontal': {
        main: {
            position: 'left',
            ratio: 'widthRatio'
        },
        cross: {
            position: 'top',
            ratio: 'heightRatio'
        },
        scrollByProp: 'x'
    },
    'vertical': {
        main: {
            position: 'top',
            ratio: 'heightRatio'
        },
        cross: {
            position: 'left',
            ratio: 'widthRatio'
        },
        scrollByProp: 'y'
    }
};

const prepareItems = function(items, config) {
    return $.map(items, function(item) {
        const ratios = {};
        ratios[config.main.ratio] = item.mainRatio;
        ratios[config.cross.ratio] = item.crossRatio;

        return $.extend(ratios, item);
    });
};

const getPositionCreator = function(config) {
    return function($el, axis) {
        return Math.round($el.position()[config[axis].position]);
    };
};

$.each(configs, function(direction, config) {

    QUnit.module('rendering ' + direction, {
        beforeEach: function() {
            const $container = $('<div />').appendTo('body');
            this.$element = $('<div>').appendTo($container);
        },
        afterEach: function() {
            this.$element.parent().remove();
        }
    }, () => {
        QUnit.test('non standard item ratios should be handled correctly', function(assert) {
            const element = this.$element.dxTileView({
                height: 20,
                items: prepareItems(items, config),
                itemRender: function(item) {
                    return 'Text is: ' + item.text;
                }
            });
            const $items = element.find(TILEVIEW_ITEM_SELECTOR);

            assert.ok($items.eq(7).width() === 0 && $items.eq(7).height() === 0, 'item 8 not displayed');

            assert.roughEqual($items.eq(8).outerHeight(), 220, 0.1, 'item 9');
            assert.roughEqual($items.eq(8).outerWidth(), 220, 0.1, 'item 9');
            assert.roughEqual($items.eq(9).outerHeight(), 220, 0.1, 'item 10');
            assert.roughEqual($items.eq(9).outerWidth(), 220, 0.1, 'item 10');
        });

    });
});

QUnit.module('rendering', {
    beforeEach: function() {
        const $container = $('<div>').appendTo('body');
        this.$element = $('<div>').appendTo($container);
    },
    afterEach: function() {
        this.$element.parent().remove();
    }
}, () => {
    QUnit.test('Item collection changing should repaint widget (T686243)', function(assert) {
        const tileView = this.$element.dxTileView({
            items: prepareItems(items, configs.horizontal)
        }).dxTileView('instance');
        const getFirstItemElementHeight = () => tileView.$element().find(TILEVIEW_ITEM_SELECTOR).get(0).offsetHeight;

        assert.strictEqual(getFirstItemElementHeight(), DEFAULT_ITEMSIZE);
        tileView.option('items[0].heightRatio', 2);
        assert.strictEqual(getFirstItemElementHeight(), DEFAULT_ITEMSIZE * 2 + DEFAULT_ITEMMARGIN);
    });

    QUnit.test('template should be rendered correctly', function(assert) {
        const element = this.$element.dxTileView({
            items: prepareItems(items, configs.horizontal),
            itemTemplate: function(item) {
                return 'Text is: ' + item.text;
            }
        });
        const $items = element.find(TILEVIEW_ITEM_SELECTOR);

        assert.equal($items.eq(0).text(), 'Text is: item1');
    });

    QUnit.test('tiles should not be collapsed if widget rendered in disabled state (T184853)', function(assert) {
        this.$element.dxTileView({
            items: prepareItems(items, configs.horizontal),
            disabled: true
        });

        const $tiles = this.$element.find('.dx-tile');
        const firstTileOffset = $tiles.eq(0).offset();
        let tilesImposed = false;

        for(let i = 1, n = $tiles.length; i < n; i++) {
            const offset = $tiles.eq(i).offset();

            if(offset.left === firstTileOffset.left && offset.top === firstTileOffset.top) {
                tilesImposed = true;
                break;
            }
        }

        assert.ok(!tilesImposed, 'tiles are not imposed');
    });

    QUnit.test('rendering horizontal in RTL mode', function(assert) {
        const config = configs.horizontal;
        const getPosition = getPositionCreator(config);

        const element = this.$element.dxTileView({
            height: 200,
            direction: 'horizontal',
            items: prepareItems(items, config),
            rtlEnabled: true
        });
        const $items = element.find(TILEVIEW_ITEM_SELECTOR);
        const width = element.find('.' + TILEVIEW_CONTAINER_CLASS).width();

        assert.equal(getPosition($items.eq(0), 'main'), width - DEFAULT_ITEMOFFSET, 'item 1');
        assert.equal(getPosition($items.eq(0), 'cross'), DEFAULT_ITEMMARGIN, 'item 1');

        assert.equal(getPosition($items.eq(1), 'main'), width - DEFAULT_ITEMOFFSET * 3, 'item 2');
        assert.equal(getPosition($items.eq(1), 'cross'), DEFAULT_ITEMMARGIN + DEFAULT_ITEMOFFSET, 'item 2');

        assert.equal(getPosition($items.eq(2), 'main'), width - DEFAULT_ITEMOFFSET * 5, 'item 3');
        assert.equal(getPosition($items.eq(2), 'cross'), DEFAULT_ITEMMARGIN, 'item 3');

        assert.equal(getPosition($items.eq(3), 'main'), width - DEFAULT_ITEMOFFSET * 7, 'item 4');
        assert.equal(getPosition($items.eq(3), 'cross'), DEFAULT_ITEMMARGIN, 'item 4');

        assert.equal(getPosition($items.eq(4), 'main'), width - DEFAULT_ITEMOFFSET * 9, 'item 5');
        assert.equal(getPosition($items.eq(4), 'cross'), DEFAULT_ITEMMARGIN, 'item 5');

        assert.equal(getPosition($items.eq(5), 'main'), width - DEFAULT_ITEMOFFSET * 10, 'item 6');
        assert.equal(getPosition($items.eq(5), 'cross'), DEFAULT_ITEMMARGIN, 'item 6');

        assert.equal(getPosition($items.eq(6), 'main'), width - DEFAULT_ITEMOFFSET * 3, 'item 7');
        assert.equal(getPosition($items.eq(6), 'cross'), DEFAULT_ITEMMARGIN, 'item 7');
    });

    QUnit.test('rendering vertical in RTL mode', function(assert) {
        const config = configs.vertical;
        const getPosition = getPositionCreator(config);

        const element = this.$element.dxTileView({
            width: 200,
            direction: 'vertical',
            items: prepareItems(items, config),
            rtlEnabled: true
        });
        const $items = element.find(TILEVIEW_ITEM_SELECTOR);
        const width = element.find('.' + TILEVIEW_CONTAINER_CLASS).width();

        assert.equal(getPosition($items.eq(0), 'main'), DEFAULT_ITEMMARGIN, 'item 1');
        assert.equal(getPosition($items.eq(0), 'cross'), width - DEFAULT_ITEMOFFSET, 'item 1');

        assert.equal(getPosition($items.eq(1), 'main'), DEFAULT_ITEMMARGIN, 'item 2');
        assert.equal(getPosition($items.eq(1), 'cross'), width - DEFAULT_ITEMOFFSET * 2, 'item 2');

        assert.equal(getPosition($items.eq(2), 'main'), DEFAULT_ITEMMARGIN + DEFAULT_ITEMOFFSET * 3, 'item 3');
        assert.equal(getPosition($items.eq(2), 'cross'), width - DEFAULT_ITEMOFFSET * 2, 'item 3');

        assert.equal(getPosition($items.eq(3), 'main'), DEFAULT_ITEMMARGIN + DEFAULT_ITEMOFFSET * 5, 'item 4');
        assert.equal(getPosition($items.eq(3), 'cross'), width - DEFAULT_ITEMOFFSET * 2, 'item 4');

        assert.equal(getPosition($items.eq(4), 'main'), DEFAULT_ITEMMARGIN + DEFAULT_ITEMOFFSET * 7, 'item 5');
        assert.equal(getPosition($items.eq(4), 'cross'), width - DEFAULT_ITEMOFFSET * 2, 'item 5');

        assert.equal(getPosition($items.eq(5), 'main'), DEFAULT_ITEMMARGIN + DEFAULT_ITEMOFFSET * 9, 'item 6');
        assert.equal(getPosition($items.eq(5), 'cross'), width - DEFAULT_ITEMOFFSET * 2, 'item 6');

        assert.equal(getPosition($items.eq(6), 'main'), DEFAULT_ITEMMARGIN + DEFAULT_ITEMOFFSET, 'item 7');
        assert.equal(getPosition($items.eq(6), 'cross'), width - DEFAULT_ITEMOFFSET, 'item 7');
    });

    QUnit.test('Tiles should have the correct dimensions after rendered as a part of react template', function(assert) {
        deferUpdate(() => {
            this.$element.dxTileView({
                items: [
                    { text: 'test 1' }
                ]
            });
        });

        const $tile = this.$element.find(`.${TILEVIEW_ITEM_CLASS}`);

        assert.strictEqual($tile.outerHeight(), DEFAULT_ITEMSIZE, 'Tile height updated correctly');
        assert.strictEqual($tile.outerWidth(), DEFAULT_ITEMSIZE, 'Tile width updated correctly');
    });

    QUnit.testInActiveWindow('aria-activedescendant should not be set for the component after tile focus (T1217255)', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            this.$element.dxTileView({
                items: [{ text: 'test 1' }],
                focusStateEnabled: true,
            });

            const $firstItem = this.$element.find(TILEVIEW_ITEM_SELECTOR).eq(0);

            $firstItem.trigger('dxpointerdown');

            clock.tick(10);

            assert.strictEqual($firstItem.hasClass('dx-state-focused'), true);
            assert.strictEqual(this.$element.attr('aria-activedescendant'), undefined);
        } finally {
            clock.restore();
        }
    });
});


$.each(configs, function(direction, config) {
    QUnit.module('API ' + direction, {
        beforeEach: function() {
            const $container = $('<div>').appendTo('body');
            this.$element = $('<div>').appendTo($container);
        },
        afterEach: function() {
            this.$element.parent().remove();
        }
    }, () => {
        QUnit.test('getting scroll position', function(assert) {
            const $element = this.$element.dxTileView({
                items: prepareItems(items, config),
                direction: direction,
                height: 100,
                width: 100
            });
            const instance = $element.dxTileView('instance');
            const scrollView = $element.dxScrollView('instance');
            const scrollPosition = {};

            assert.equal(instance.scrollPosition(), 0, 'default scroll position');

            scrollPosition[config.scrollByProp] = 30;
            scrollView.scrollBy(scrollPosition);
            assert.equal(instance.scrollPosition(), 30, 'scrolling to forward');

            scrollPosition[config.scrollByProp] = -10;
            scrollView.scrollBy(scrollPosition);
            assert.equal(instance.scrollPosition(), 20, 'scrolling to backward');
        });
    });
});

QUnit.module('widget sizing render', () => {
    QUnit.test('default', function(assert) {
        const $element = $('#widget').dxTileView({ items: prepareItems(items, configs.horizontal) });

        assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    QUnit.test('constructor', function(assert) {
        const $element = $('#widget').dxTileView({ items: prepareItems(items, configs.horizontal), width: 400 });
        const instance = $element.dxTileView('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element.outerWidth(), 400, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        const $element = $('#widthRootStyle').dxTileView({ items: prepareItems(items, configs.horizontal) });
        const instance = $element.dxTileView('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element.outerWidth(), 300, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#widget').dxTileView({ items: prepareItems(items, configs.horizontal) });
        const instance = $element.dxTileView('instance');
        const customWidth = 400;

        instance.option('width', customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });

    QUnit.test('scrollable content has the correct width if it is larger than the widget', function(assert) {
        const customWidth = 500;
        const $element = $('#widget').dxTileView({
            items: prepareItems(items, configs.horizontal),
            height: 300,
            width: customWidth
        });

        assert.ok($element.find(`.${SCROLLVIEW_CONTENT_CLASS}`).width() > customWidth + 1);
    });

    QUnit.test('scrollable content has the correct width if it is less than the widget (T860587)', function(assert) {
        const customWidth = 1500;
        const $element = $('#widget').dxTileView({
            items: prepareItems(items, configs.horizontal),
            height: 600,
            width: customWidth,
            rtlEnabled: true
        });

        assert.roughEqual($element.find(`.${SCROLLVIEW_CONTENT_CLASS}`).width(), customWidth, 1);
    });

    QUnit.test('scrollable content height is recalculated if the element was resized and the widget has vertical direction (T934021)', function(assert) {
        const $element = $('#widget').dxTileView({
            direction: 'vertical',
            items: prepareItems(items, configs.vertical),
            height: 300,
            width: 240
        });
        const instance = $element.dxTileView('instance');
        const startContentHeight = $element.find(`.${SCROLLVIEW_CONTENT_CLASS}`).height();

        instance.option('width', 900);

        assert.ok($element.find(`.${SCROLLVIEW_CONTENT_CLASS}`).height() < startContentHeight / 2);
    });

    QUnit.test('scrollable content height is recalculated if the element was resized and the widget has horizontal direction (T934021)', function(assert) {
        const $element = $('#widget').dxTileView({
            items: prepareItems(items, configs.horizontal),
            height: 240,
            width: 300
        });
        const instance = $element.dxTileView('instance');
        const startContentWidth = $element.find(`.${SCROLLVIEW_CONTENT_CLASS}`).width();

        instance.option('height', 900);

        assert.ok($element.find(`.${SCROLLVIEW_CONTENT_CLASS}`).width() < startContentWidth / 2);
    });
});

QUnit.module('integration with dataSource', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('process indication during dataSource loading', function(assert) {
        const dataSourceLoadTime = 100;

        const dataSource = new DataSource({
            load: function() {
                const deferred = $.Deferred();

                setTimeout(function() {
                    deferred.resolve([]);
                }, dataSourceLoadTime);

                return deferred.promise();
            }
        });

        const element = $('<div>').appendTo('#qunit-fixture').dxTileView({
            dataSource: dataSource
        });

        const loadPanel = element.find('.dx-scrollview-loadpanel').eq(0).dxLoadPanel('instance');
        this.clock.tick(dataSourceLoadTime);
        assert.equal(loadPanel.option('visible'), false, 'load panel hidden');

        dataSource.load();
        assert.equal(loadPanel.option('visible'), true, 'load panel shown');

        this.clock.tick(dataSourceLoadTime);
        assert.equal(loadPanel.option('visible'), false, 'load panel hidden');
    });

    QUnit.test('timeview doesn\'t show load panel during dataSource loading when indicateLoading = false', function(assert) {
        const dataSourceLoadTime = 100;

        const dataSource = new DataSource({
            load: function() {
                const deferred = $.Deferred();

                setTimeout(function() {
                    deferred.resolve([]);
                }, dataSourceLoadTime);

                return deferred.promise();
            }
        });

        const element = $('<div>').appendTo('#qunit-fixture').dxTileView({
            dataSource: dataSource,
            indicateLoading: false
        });

        const loadPanel = element.find('.dx-scrollview-loadpanel').eq(0).dxLoadPanel('instance');
        dataSource.load();
        assert.equal(loadPanel.option('visible'), false, 'load panel hidden');
    });

    QUnit.test('setting indicateLoading to false hides load panel at once', function(assert) {
        const dataSourceLoadTime = 100;

        const dataSource = new DataSource({
            load: function() {
                const deferred = $.Deferred();

                setTimeout(function() {
                    deferred.resolve([]);
                }, dataSourceLoadTime);

                return deferred.promise();
            }
        });

        const element = $('<div>').appendTo('#qunit-fixture').dxTileView({
            dataSource: dataSource,
            indicateLoading: false
        });

        const loadPanel = element.find('.dx-scrollview-loadpanel').eq(0).dxLoadPanel('instance');
        dataSource.load();

        setTimeout(function() {
            element.dxTileView('option', 'indicateLoading', false);
        }, dataSourceLoadTime / 2);

        this.clock.tick(dataSourceLoadTime / 2);

        assert.equal(loadPanel.option('visible'), false, 'load panel hidden');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        this.$element = $('#widget').dxTileView({
            height: 500,
            items: prepareItems(items, configs.horizontal),
            focusStateEnabled: true
        }),
        this.keyboard = keyboardMock(this.$element);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('useKeyboard is must be false by default', function(assert) {
        const instance = this.$element.dxTileView().dxTileView('instance');
        const scrollView = this.$element.dxScrollView('instance');

        instance.option('useKeyboard', false);
        assert.ok(!scrollView.option('useKeyboard'), 'useKeyboard is false in scrollview');
    });

    QUnit.test('home move focus to first element', function(assert) {
        const $element = this.$element;
        const keyboard = this.keyboard;

        $element.find(TILEVIEW_ITEM_SELECTOR).eq(5).trigger('dxpointerdown');
        this.clock.tick(10);
        keyboard.keyDown('home');

        assert.ok($element.find(TILEVIEW_ITEM_SELECTOR).first().hasClass('dx-state-focused'), 'first element obtained dx-state-focused after press home');
    }),

    QUnit.test('end move focus to last element', function(assert) {
        const $element = this.$element;
        const keyboard = this.keyboard;

        $element.find(TILEVIEW_ITEM_SELECTOR).eq(5).trigger('dxpointerdown');
        this.clock.tick(10);
        keyboard.keyDown('end');

        assert.ok($element.find(TILEVIEW_ITEM_SELECTOR).last().hasClass('dx-state-focused'), 'last element obtained dx-state-focused after press end');
    });
});

$.each(configs, function(direction, config) {
    QUnit.module('keyboard navigation ' + direction, {
        beforeEach: function() {
            this.$element = $('#widget').dxTileView({
                height: 500,
                width: 500,
                direction: direction,
                items: prepareItems(items, config),
                focusStateEnabled: true
            }),
            this.keyboard = keyboardMock(this.$element);
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        QUnit.test('right arrow move focus to right element', function(assert) {
            const testConfig = ({
                'horizontal': { start: 1, end: 4 },
                'vertical': { start: 1, end: 2 }
            })[direction];

            const $element = this.$element;
            const keyboard = this.keyboard;
            const instance = $('#widget').dxTileView('instance');

            $element.find(TILEVIEW_ITEM_SELECTOR).eq(testConfig.start).trigger('dxpointerdown');
            this.clock.tick(10);
            keyboard.keyDown('right');

            assert.equal(isRenderer(instance.option('focusedElement')), !!globalConfig().useJQuery, 'focusedElement is correct');
            assert.ok($element.find(TILEVIEW_ITEM_SELECTOR).eq(testConfig.end).hasClass('dx-state-focused'), 'right element obtained dx-state-focused after press right arrow');
        });

        QUnit.test('left arrow move focus to left element', function(assert) {
            const testConfig = ({
                'horizontal': { start: 4, end: 6 },
                'vertical': { start: 3, end: 1 }
            })[direction];

            const $element = this.$element;
            const keyboard = this.keyboard;

            $element.find(TILEVIEW_ITEM_SELECTOR).eq(testConfig.start).trigger('dxpointerdown');
            this.clock.tick(10);
            keyboard.keyDown('left');

            assert.ok($element.find(TILEVIEW_ITEM_SELECTOR).eq(testConfig.end).hasClass('dx-state-focused'), 'left element obtained dx-state-focused after press left arrow');
        });

        QUnit.test('down arrow move focus to down element', function(assert) {
            const testConfig = ({
                'horizontal': { start: 4, end: 3 },
                'vertical': { start: 3, end: 5 }
            })[direction];

            const $element = this.$element;
            const keyboard = this.keyboard;

            $element.find(TILEVIEW_ITEM_SELECTOR).eq(testConfig.start).trigger('dxpointerdown');
            this.clock.tick(10);
            keyboard.keyDown('down');

            assert.ok($element.find(TILEVIEW_ITEM_SELECTOR).eq(testConfig.end).hasClass('dx-state-focused'), 'down element obtained dx-state-focused after press down arrow');
        });

        QUnit.test('pageDown move focus to down element', function(assert) {
            const testConfig = ({
                'horizontal': { start: 4, end: 3 },
                'vertical': { start: 3, end: 5 }
            })[direction];

            const $element = this.$element;
            const keyboard = this.keyboard;

            $element.find(TILEVIEW_ITEM_SELECTOR).eq(testConfig.start).trigger('dxpointerdown');
            this.clock.tick(10);
            keyboard.keyDown('pageDown');

            assert.ok($element.find(TILEVIEW_ITEM_SELECTOR).eq(testConfig.end).hasClass('dx-state-focused'), 'pageDown element obtained dx-state-focused after press pageDown arrow');
        });

        QUnit.test('up arrow move focus to up element', function(assert) {
            const testConfig = ({
                'horizontal': { start: 5, end: 4 },
                'vertical': { start: 3, end: 2 }
            })[direction];

            const $element = this.$element;
            const keyboard = this.keyboard;

            $element.find(TILEVIEW_ITEM_SELECTOR).eq(testConfig.start).trigger('dxpointerdown');
            this.clock.tick(10);
            keyboard.keyDown('up');

            assert.ok($element.find(TILEVIEW_ITEM_SELECTOR).eq(testConfig.end).hasClass('dx-state-focused'), 'up element obtained dx-state-focused after press up arrow');
        });

        QUnit.test('pageUp move focus to up element', function(assert) {
            const testConfig = ({
                'horizontal': { start: 5, end: 4 },
                'vertical': { start: 3, end: 2 }
            })[direction];

            const $element = this.$element;
            const keyboard = this.keyboard;

            $element.find(TILEVIEW_ITEM_SELECTOR).eq(testConfig.start).trigger('dxpointerdown');
            this.clock.tick(10);
            keyboard.keyDown('pageUp');

            assert.ok($element.find(TILEVIEW_ITEM_SELECTOR).eq(testConfig.end).hasClass('dx-state-focused'), 'up element obtained dx-state-focused after press pageUp');
        });

        QUnit.test('scroll to item on arrows', function(assert) {
            const testConfig = ({
                'horizontal': { forward: 'right', backward: 'left' },
                'vertical': { forward: 'down', backward: 'up' }
            })[direction];

            const $element = $('#widget').dxTileView({
                height: 300,
                width: 300,
                items: prepareItems(items, config),
                focusStateEnabled: true
            });
            const instance = $element.dxTileView('instance');
            const keyboard = keyboardMock($element);

            assert.equal(instance.scrollPosition(), 0, 'scrollPosition equal zero on init');

            $element.find(TILEVIEW_ITEM_SELECTOR).first().trigger('dxpointerdown');
            this.clock.tick(10);
            keyboard.keyDown(testConfig.forward);
            assert.equal(instance.scrollPosition(), 80, 'scrollPosition equal 80 after press forward arrow (item num 7)');

            keyboard.keyDown(testConfig.forward);
            assert.equal(instance.scrollPosition(), 320, 'scrollPosition equal 320 after press forward arrow in second time (item num 3)');

            keyboard.keyDown(testConfig.backward);
            assert.equal(instance.scrollPosition(), 120, 'scrollPosition equal 120 after press backward arrow (item num 7)');

            keyboard.keyDown(testConfig.backward);
            assert.equal(instance.scrollPosition(), 0, 'scrollPosition equal 0 after press backward arrow in second time (item num 1)');
        });
    });
});

