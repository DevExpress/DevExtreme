var $ = require('jquery');

require('ui/tile_view');
require('common.css!');

QUnit.testStart(function() {
    var markup =
        '<div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>';

    $('#qunit-fixture').html(markup);
});

var TILEVIEW_CLASS = 'dx-tileview',
    TILEVIEW_ITEM_CLASS = 'dx-tile',
    TILEVIEW_ITEM_SELECTOR = '.' + TILEVIEW_ITEM_CLASS,

    DEFAULT_ITEMSIZE = 100,
    DEFAULT_ITEMMARGIN = 20,
    DEFAULT_ITEMOFFSET = DEFAULT_ITEMSIZE + DEFAULT_ITEMMARGIN;


var items = [{
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

var configs = {
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

var prepareItems = function(items, config) {
    return $.map(items, function(item) {
        var ratios = {};
        ratios[config.main.ratio] = item.mainRatio;
        ratios[config.cross.ratio] = item.crossRatio;

        return $.extend(ratios, item);
    });
};

var getPositionCreator = function(config) {
    return function($el, axis) {
        return Math.round($el.get(0)['offset' + config[axis].position.charAt(0).toUpperCase() + config[axis].position.slice(1)]);
    };
};

QUnit.module('rendering', {
    beforeEach: function() {
        this.element = $('<div></div>').appendTo('body');
    },
    afterEach: function() {
        this.element.remove();
    }
}, () => {
    QUnit.test('template should be rendered correctly', function(assert) {
        var element = this.element.dxTileView({
            items: prepareItems(items, configs.horizontal),
            itemTemplate: function(item) {
                return 'Text is: ' + item.text;
            }
        });
        var $items = element.find(TILEVIEW_ITEM_SELECTOR);

        assert.equal($items.eq(0).text(), 'Text is: item1');
    });


    $.each(configs, function(direction, config) {

        var getPosition = getPositionCreator(config);

        QUnit.module('rendering ' + direction, {
            beforeEach: function() {
                this.element = $('<div></div>').appendTo('body');
            },
            afterEach: function() {
                this.element.remove();
            }
        }, () => {
            QUnit.test('items positions should be correct', function(assert) {
                var element = this.element.dxTileView({
                    direction: direction,
                    height: 200,
                    width: 200,
                    items: prepareItems(items, config)
                });

                assert.ok(element.hasClass(TILEVIEW_CLASS));

                var $items = element.find(TILEVIEW_ITEM_SELECTOR);
                assert.equal($items.length, 10);
                assert.ok($items.eq(0).hasClass(TILEVIEW_ITEM_CLASS));

                assert.equal(getPosition($items.eq(0), 'main'), DEFAULT_ITEMMARGIN, 'item 1');
                assert.equal(getPosition($items.eq(0), 'cross'), DEFAULT_ITEMMARGIN, 'item 1');

                assert.equal(getPosition($items.eq(1), 'main'), DEFAULT_ITEMMARGIN, 'item 2');
                assert.equal(getPosition($items.eq(1), 'cross'), DEFAULT_ITEMMARGIN + DEFAULT_ITEMOFFSET, 'item 2');

                assert.equal(getPosition($items.eq(2), 'main'), DEFAULT_ITEMMARGIN + DEFAULT_ITEMOFFSET * 3, 'item 3');
                assert.equal(getPosition($items.eq(2), 'cross'), DEFAULT_ITEMMARGIN, 'item 3');

                assert.equal(getPosition($items.eq(3), 'main'), DEFAULT_ITEMMARGIN + DEFAULT_ITEMOFFSET * 5, 'item 4');
                assert.equal(getPosition($items.eq(3), 'cross'), DEFAULT_ITEMMARGIN, 'item 4');

                assert.equal(getPosition($items.eq(4), 'main'), DEFAULT_ITEMMARGIN + DEFAULT_ITEMOFFSET * 7, 'item 5');
                assert.equal(getPosition($items.eq(4), 'cross'), DEFAULT_ITEMMARGIN, 'item 5');

                assert.equal(getPosition($items.eq(5), 'main'), DEFAULT_ITEMMARGIN + DEFAULT_ITEMOFFSET * 9, 'item 6');
                assert.equal(getPosition($items.eq(5), 'cross'), DEFAULT_ITEMMARGIN, 'item 6');

                assert.equal(getPosition($items.eq(6), 'main'), DEFAULT_ITEMMARGIN + DEFAULT_ITEMOFFSET, 'item 7');
                assert.equal(getPosition($items.eq(6), 'cross'), DEFAULT_ITEMMARGIN, 'item 7');
            });
        });
    });
});

