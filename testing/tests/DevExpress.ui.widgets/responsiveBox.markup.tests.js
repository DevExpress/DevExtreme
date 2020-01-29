import $ from 'jquery';
import errors from 'ui/widget/ui.errors';
import registerComponent from 'core/component_registrator';
import Widget from 'ui/widget/ui.widget';
import responsiveBoxScreenMock from '../../helpers/responsiveBoxScreenMock.js';

import 'ui/box';
import 'ui/responsive_box';
import 'common.css!';

QUnit.testStart(() => {
    const markup =
        '<div id="responsiveBox"></div>\
        \
        <div id="responsiveBoxWithTemplate">\
            <div data-options="dxItem: { location: { row: 0 , col: 0 } }">test</div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const BOX_CLASS = 'dx-box';
const BOX_ITEM_CLASS = 'dx-box-item';
const RESPONSIVE_BOX_CLASS = 'dx-responsivebox';
const SCREEN_SIZE_CLASS_PREFIX = RESPONSIVE_BOX_CLASS + '-screen-';


const moduleConfig = {
    beforeEach: function() {
        responsiveBoxScreenMock.setup.call(this);
    },
    afterEach: function() {
        responsiveBoxScreenMock.teardown.call(this);
    }
};

QUnit.module('render', moduleConfig, () => {
    QUnit.test('render', function(assert) {
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            items: [{ text: 1 }, { text: 2 }]
        });

        assert.ok($responsiveBox.hasClass(RESPONSIVE_BOX_CLASS), 'necessary class attached');
        const $items = $responsiveBox.find('.' + BOX_ITEM_CLASS);
        assert.equal($items.length, 2, 'items rendered when rows and columns are not defined (using single column layout)');
    });

    QUnit.test('empty widget shouldn\'t raise exception on resize (T259132)', function(assert) {
        assert.expect(0);

        $('#responsiveBox').dxResponsiveBox({});
        this.updateScreenSize();
    });
});

QUnit.module('layouting', moduleConfig, () => {
    QUnit.test('grid without items', function(assert) {
        const rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }];
        const cols = [{ ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 100 }];
        const height = 600;
        const width = 600;

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: rows,
            cols: cols,
            width: width,
            height: height
        });

        const $rowBox = $responsiveBox.find('.' + BOX_CLASS).eq(0);

        assert.equal($rowBox.dxBox('option', 'direction'), 'col', 'rowBox wraps inner content');

        const $columnBoxes = $rowBox.find('.' + BOX_CLASS);
        const columnBoxFirst = $columnBoxes.eq(0).dxBox('instance');
        const columnBoxSecond = $columnBoxes.eq(1).dxBox('instance');

        assert.equal($columnBoxes.length, 2, 'two row boxes');
        assert.equal(columnBoxFirst.option('direction'), 'row');
        assert.equal(columnBoxSecond.option('direction'), 'row');

        assert.equal(columnBoxFirst.option('items').length, 2);
        assert.equal(columnBoxSecond.option('items').length, 2);
    });

    QUnit.test('grid with items', function(assert) {
        const rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }];
        const cols = [{ ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 100 }];
        const height = 600;
        const width = 600;

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: rows,
            cols: cols,
            items: [
                { location: { row: 0, col: 0 }, text: 'item11' },
                { location: { row: 1, col: 1 }, text: 'item22' },
                { location: { row: 1, col: 0 }, text: 'item21' },
                { location: { row: 0, col: 1 }, text: 'item12' }
            ],
            width: width,
            height: height
        });

        const $boxes = $responsiveBox.find('.' + BOX_CLASS);

        const $rootBox = $boxes.eq(0);
        assert.equal($rootBox.text(), 'item11item12item21item22', 'items rendered correctly');
    });

    QUnit.test('grid with factors', function(assert) {
        // screen:   xs      sm           md          lg
        //  width: <768    768-<992    992-<1200    >1200

        this.updateScreenSize(500);

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}, { screen: 'sm md lg' }, { screen: 'md lg' }, { screen: 'lg' }],
            cols: [{}, { screen: 'sm md lg' }, { screen: 'md lg' }, { screen: 'lg' }],
            items: [
                { location: { row: 0, col: 0, screen: 'lg' }, text: 'item(0,0)-lg' },
                { location: { row: 0, col: 0, screen: 'md' }, text: 'item(0,0)-md' },
                { location: { row: 0, col: 0, screen: 'sm' }, text: 'item(0,0)-sm' },
                { location: { row: 0, col: 0, screen: 'xs' }, text: 'item(0,0)-xs' },
                { location: { row: 0, col: 1 }, text: ' item(0,1)' },
                { location: { row: 0, col: 2 }, text: ' item(0,2)' },
                { location: { row: 0, col: 3 }, text: ' item(0,3)' },

                { location: { row: 1, col: 0 }, text: ' item(1,0)' },
                { location: { row: 1, col: 1 }, text: ' item(1,1)' },
                { location: { row: 1, col: 2 }, text: ' item(1,2)' },
                { location: { row: 1, col: 3 }, text: ' item(1,3)' },

                { location: { row: 2, col: 0 }, text: ' item(2,0)' },
                { location: { row: 2, col: 1 }, text: ' item(2,1)' },
                { location: { row: 2, col: 2 }, text: ' item(2,2)' },
                { location: { row: 2, col: 3 }, text: ' item(2,3)' },

                { location: { row: 3, col: 0 }, text: ' item(3,0)' },
                { location: { row: 3, col: 1 }, text: ' item(3,1)' },
                { location: { row: 3, col: 2 }, text: ' item(3,2)' },
                { location: { row: 3, col: 3 }, text: ' item(3,3)' }
            ]
        });

        const xsExpectedText = 'item(0,0)-xs';
        const smallExpectedText = 'item(0,0)-sm item(0,1) item(1,0) item(1,1)';
        const mediumExpectedText = 'item(0,0)-md item(0,1) item(0,2) item(1,0) item(1,1) item(1,2) item(2,0) item(2,1) item(2,2)';
        const lgExpectedText = 'item(0,0)-lg item(0,1) item(0,2) item(0,3) item(1,0) item(1,1) item(1,2) item(1,3) item(2,0) item(2,1) item(2,2) item(2,3) item(3,0) item(3,1) item(3,2) item(3,3)';

        // xs screen
        assert.equal($responsiveBox.text(), xsExpectedText);

        // sm screen
        this.updateScreenSize(800);

        assert.equal($responsiveBox.text(), smallExpectedText);

        // md screen
        this.updateScreenSize(1000);

        assert.equal($responsiveBox.text(), mediumExpectedText);

        // lg screen
        this.updateScreenSize(1500);

        assert.equal($responsiveBox.text(), lgExpectedText);
    });

    QUnit.test('colspan', function(assert) {
        const cols = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
        const size = 900;

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: cols,
            width: size,
            items: [{ location: { row: 0, col: 0, colspan: 2 } }, { location: { row: 0, col: 2 } }]
        });

        const $rowBox = $responsiveBox.find('.' + BOX_CLASS).eq(1);
        const $boxItems = $rowBox.find('.' + BOX_ITEM_CLASS);

        assert.equal($boxItems.length, 2, 'two items were rendered');
    });

    QUnit.test('rowspan', function(assert) {
        const rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
        const size = 900;

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: rows,
            cols: [{}],
            height: size,
            items: [{ location: { row: 0, col: 0, rowspan: 2 } }, { location: { row: 2, col: 0 } }]
        });

        const $boxItems = $responsiveBox.find('.' + BOX_ITEM_CLASS);

        assert.equal($boxItems.length, 2, 'two items were rendered');
    });

    QUnit.test('repaint should not detach items', function(assert) {
        assert.expect(0);

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [{ location: { row: 0, col: 0 }, text: 'test' }]
        });

        let $childrenResponsiveBox;

        try {
            const $dxItem = $responsiveBox.find('.' + BOX_ITEM_CLASS).first().children();
            $childrenResponsiveBox = $('<div>').dxResponsiveBox({
                onDisposing: () => {
                    assert.ok(false, 'widget disposed');
                }
            }).appendTo($dxItem);

            $responsiveBox.dxResponsiveBox('repaint');
        } finally {
            $childrenResponsiveBox.dxResponsiveBox('option', 'onDisposing', null);
        }
    });

    QUnit.test('recalculation on size changing', function(assert) {
        // screen:   xs      sm           md          lg
        //  width: <768    768-<992    992-<1200    >1200
        const $responsiveBox = $('#responsiveBox');

        this.setScreenSize(500);

        $responsiveBox.dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [
                { location: { screen: 'sm', row: 0, col: 0 }, text: 'sm' },
                { location: { screen: 'xs', row: 0, col: 0 }, text: 'xs' },
                { location: { screen: 'md', row: 0, col: 0 }, text: 'md' }
            ]
        });
        const responsiveBox = $responsiveBox.dxResponsiveBox('instance');

        this.setScreenSize(1000);
        responsiveBox.repaint();
        assert.equal($.trim($responsiveBox.text()), 'md', 'md item apply');
    });

    QUnit.test('singleColumnScreen render items in one column', function(assert) {
        this.updateScreenSize(500);

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}, {}],
            cols: [{}, {}],
            singleColumnScreen: 'xs',
            items: [
                { location: { row: 0, col: 0, rowspan: 2 }, text: '1' },
                { location: { row: 1, col: 1, colspan: 2 }, text: '4' },
                { location: { row: 0, col: 1, screen: 'sm md lg' }, text: '2' },
                { location: { row: 1, col: 0, screen: 'xs sm' }, text: '3' }
            ]
        });

        const responsiveBox = $responsiveBox.dxResponsiveBox('instance');

        const checkLayoutByScreen = $.proxy(function(screenWidth, expectedText) {
            this.updateScreenSize(screenWidth);

            const $box = $responsiveBox.find('.' + BOX_CLASS);
            assert.equal($box.length, 1, 'one box rendered');

            const $items = $box.find('.' + BOX_ITEM_CLASS);
            assert.equal($items.length, expectedText.length, $items.length + ' items rendered');

            assert.equal($.trim($responsiveBox.text()), expectedText, 'rendered only needed items');
        }, this);

        // screen:   xs      sm           md          lg
        //  width: <768    768-<992    992-<1200    >1200
        checkLayoutByScreen(500, '134');

        responsiveBox.option('singleColumnScreen', 'xs sm');

        checkLayoutByScreen(800, '1234');
    });

    QUnit.test('too complex layout', function(assert) {
        assert.throws(() => {
            const size = 900;

            $('#responsiveBox').dxResponsiveBox({
                rows: [
                    { ratio: 1 },
                    { ratio: 1 },
                    { ratio: 1 },
                    { ratio: 1 }
                ],
                cols: [
                    { ratio: 1 },
                    { ratio: 1 },
                    { ratio: 1 },
                    { ratio: 1 }
                ],
                items: [
                    { location: { row: 0, col: 0, colspan: 3 }, html: '<div class=\'div_0_0\'/>' },
                    { location: { row: 1, col: 0, rowspan: 3 }, html: '<div class=\'div_1_0\'/>' },
                    { location: { row: 1, col: 1, rowspan: 2, colspan: 2 }, html: '<div class=\'div_1_1\'/>' },
                    { location: { row: 0, col: 3, rowspan: 3 }, html: '<div class=\'div_0_3\'/>' },
                    { location: { row: 3, col: 1, colspan: 3 }, html: '<div class=\'div_3_1\'/>' }
                ],
                width: size,
                height: size
            });
        },
        errors.Error('E1025'),
        'raised error E1025');
    });

    QUnit.test('dxUpdate trigger async after render and dimension changed', function(assert) {
        const clock = sinon.useFakeTimers();
        try {
            // screen:   xs      sm           md          lg
            //  width: <768    768-<992    992-<1200    >1200
            this.updateScreenSize(900);
            const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
                width: 'auto',
                height: 'auto',
                rows: [{ ratio: 1, baseSize: 'auto' }],
                cols: [{ ratio: 1, baseSize: 'auto' }],
                items: [{ location: { row: 0, col: 0 } }]
            });

            let $box = $responsiveBox.find('.dx-box').eq(0);
            let dxUpdateEventCounter = 0;
            $($box).on('dxupdate', () => {
                dxUpdateEventCounter++;
            });

            assert.equal(dxUpdateEventCounter, 0, 'dxupdate was not fired sync after render');

            clock.tick();
            assert.equal(dxUpdateEventCounter, 1, 'dxupdate was fired async after render');

            dxUpdateEventCounter = 0;
            this.updateScreenSize(1000);
            $box = $responsiveBox.find('.dx-box').eq(0);
            $($box).on('dxupdate', () => {
                dxUpdateEventCounter++;
            });

            assert.equal(dxUpdateEventCounter, 0, 'dxupdate was not fired sync after dimensionChanged');

            clock.tick();
            assert.equal(dxUpdateEventCounter, 1, 'dxupdate was fired async after dimensionChanged');

        } finally {
            clock.restore();
        }
    });

    QUnit.test('Box should has a class appropriate a screen resolution', function(assert) {
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            width: 'auto',
            height: 'auto'
        });

        this.updateScreenSize(600);
        assert.ok($responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'xs'));
        assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'sm'));
        assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'md'));
        assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'lg'));

        this.updateScreenSize(800);
        assert.ok($responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'sm'));
        assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'xs'));
        assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'md'));
        assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'lg'));

        this.updateScreenSize(1000);
        assert.ok($responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'md'));
        assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'xs'));
        assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'sm'));
        assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'lg'));

        this.updateScreenSize(1300);
        assert.ok($responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'lg'));
        assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'xs'));
        assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'sm'));
        assert.ok(!$responsiveBox.hasClass(SCREEN_SIZE_CLASS_PREFIX + 'md'));
    });

    QUnit.test('Set the shrink option of row to box', function(assert) {
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            _layoutStrategy: 'flex',
            rows: [{
                ratio: 1,
                shrink: 0
            }, {
                ratio: 1
            }],
            cols: [{ ratio: 1 }],
            items: [
                { location: { row: 0, col: 0 } },
                { location: { row: 1, col: 0 } }
            ]
        });

        const $items = $responsiveBox.find('.' + BOX_ITEM_CLASS);
        assert.equal($items.eq(0).css('flex-shrink'), 0, 'flex-shrink style for first row');
        assert.equal($items.eq(1).css('flex-shrink'), 1, 'flex-shrink style for second row');
    });

    QUnit.test('Set the shrink option of column to box', function(assert) {
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            _layoutStrategy: 'flex',
            rows: [{ ratio: 1 }],
            cols: [{ ratio: 1 }, { ratio: 1, shrink: 0 }],
            items: [
                { location: { row: 0, col: 0 } },
                { location: { row: 0, col: 1 } }
            ]
        });

        const $items = $responsiveBox.find('.' + BOX_ITEM_CLASS);
        assert.equal($items.eq(1).css('flex-shrink'), 1, 'flex-shrink style for first column');
        assert.equal($items.eq(2).css('flex-shrink'), 0, 'flex-shrink style for second column');
    });

    QUnit.test('Set the shrink option of row to box when the singleColumnMode is applied', function(assert) {
        this.updateScreenSize(500);

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            _layoutStrategy: 'flex',
            rows: [{
                shrink: 0, screen: 'xs'
            }, {
                screen: 'xs'
            }, {}],
            cols: [{}, {}],
            singleColumnScreen: 'xs',
            items: [
                { location: { row: 0, col: 0 } },
                { location: { row: 1, col: 0 } },
                { location: { row: 0, col: 0 } }
            ]
        });

        const $items = $responsiveBox.find(`.${BOX_ITEM_CLASS}`);
        assert.equal($items.eq(0).css('flex-shrink'), 0, 'flex-shrink is applied for first row');
        assert.equal($items.eq(1).css('flex-shrink'), 1, 'flex-shrink is applied for second row');
        assert.equal($items.eq(2).css('flex-shrink'), 1, 'flex-shrink is applied for third row');
    });
});


QUnit.module('behavior', () => {
    QUnit.test('update does not rerender items', function(assert) {
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [{ location: { col: 0, row: 0 }, html: '<div class=\'test\'>' }]
        });

        const $div = $responsiveBox.find('.test');
        $responsiveBox.dxResponsiveBox('repaint');

        assert.equal($responsiveBox.find('.test').get(0), $div.get(0), 'item was not rerendered');
    });
});

QUnit.module('templates', () => {
    QUnit.test('custom item templates', function(assert) {
        const $responsiveBox = $('#responsiveBoxWithTemplate').dxResponsiveBox({
            rows: [{}],
            cols: [{}]
        });
        assert.equal($.trim($responsiveBox.text()), 'test', 'item template rendered');
    });

    QUnit.test('custom item renderer', function(assert) {
        let templateContext;
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            itemTemplate: function() {
                templateContext = this.NAME;
                return $('<div>test</div>');
            },
            items: [{ location: { row: 0, col: 0 } }]
        });

        assert.equal(templateContext, 'dxResponsiveBox', 'Correct context');
        assert.equal($.trim($responsiveBox.text()), 'test', 'item rendered');
    });
});

QUnit.module('template rendering', moduleConfig, () => {
    QUnit.test('template rendered when it set after creation', function(assert) {
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [{
                location: { row: 0, col: 0, text: 'before rendering' }
            }]
        });

        $responsiveBox.dxResponsiveBox('option', 'itemTemplate', () => {
            return $('<div>').text('after rendering');
        });

        assert.equal($.trim($responsiveBox.text()), 'after rendering', 'item template was rendered');
    });

    QUnit.test('widget rendered correctly after rows option was changed', function(assert) {
        // screen:   xs      sm           md          lg
        //  width: <768    768-<992    992-<1200    >1200

        this.updateScreenSize(1000);

        registerComponent('dxWidget', Widget.inherit({}));

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [
                {
                    location: { row: 0, col: 0, screen: 'md' }, template: () => {
                        return $('<div>').dxWidget();
                    }
                }
            ]
        });

        $responsiveBox.dxResponsiveBox('option', 'rows', [{}]);
        assert.ok($responsiveBox.find('.dx-item .dx-widget').dxWidget('instance'), 'widget is created');
    });
});

QUnit.module('collision', moduleConfig, () => {
    QUnit.test('item located at the same cell of another item', function(assert) {
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}, {}],
            cols: [{}, {}],
            items: [
                { location: { row: 0, col: 0 }, text: '0' },
                { location: { row: 0, col: 0 }, text: '1' },
                { location: { row: 1, col: 1 }, text: '2' },
                { location: { row: 1, col: 1 }, text: '3' }
            ]
        });

        assert.equal($.trim($responsiveBox.text()), '02', 'the former item rendered');
    });

    QUnit.test('item located at spanning cell', function(assert) {
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}, {}],
            items: [
                { location: { row: 0, col: 0, colspan: 2 }, text: '0' },
                { location: { row: 0, col: 1 }, text: '1' }
            ]
        });

        assert.equal($.trim($responsiveBox.text()), '0', 'the former item rendered');
    });

    QUnit.test('item spanning located at spanning of another item', function(assert) {
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}, {}],
            cols: [{}, {}],
            items: [
                { location: { row: 0, col: 1, rowspan: 2 }, text: '0' },
                { location: { row: 1, col: 0, colspan: 2 }, text: '1' }
            ]
        });

        assert.equal($.trim($responsiveBox.text()), '0', 'the former item rendered');
    });

    QUnit.test('item spanning out of bounds', function(assert) {
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}, {}],
            cols: [{}],
            items: [
                { location: { row: 0, col: 0, colspan: 2 }, text: '0' },
                { location: { row: 1, col: 0, rowspan: 2 }, text: '1' }
            ]
        });

        assert.equal($.trim($responsiveBox.text()), '01', 'the former item rendered');
    });
});
