import $ from 'jquery';
import devices from '__internal/core/m_devices';
import registerComponent from 'core/component_registrator';
import Widget from 'ui/widget/ui.widget';
import ResponsiveBox from 'ui/responsive_box';
import responsiveBoxScreenMock from '../../helpers/responsiveBoxScreenMock.js';
import dxButton from 'ui/button';
import 'ui/box';
import eventsEngine from 'common/core/events/core/events_engine';
import domAdapter from '__internal/core/m_dom_adapter';

import 'generic_light.css!';

QUnit.testStart(function() {
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

const moduleConfig = {
    beforeEach: function() {
        responsiveBoxScreenMock.setup.call(this);
    },
    afterEach: function() {
        responsiveBoxScreenMock.teardown.call(this);
    }
};

QUnit.module('layouting', moduleConfig, () => {
    QUnit.test('check size of grid without items', function(assert) {
        const rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }];
        const cols = [{ ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 100 }];
        const height = 600;
        const width = 600;
        const heightWithoutBaseSize = height - rows[0].baseSize - rows[1].baseSize;
        const widthWithoutBaseSize = width - cols[0].baseSize - cols[1].baseSize;
        const heightRatioUnit = heightWithoutBaseSize / (rows[0].ratio + rows[1].ratio);
        const widthRatioUnit = widthWithoutBaseSize / (cols[0].ratio + cols[1].ratio);

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: rows,
            cols: cols,
            width: width,
            height: height
        });

        const $rowBox = $responsiveBox.find('.' + BOX_CLASS).eq(0);
        const $columnBoxes = $rowBox.find('.' + BOX_CLASS);

        const $firstRow = $columnBoxes.eq(0).find('.' + BOX_ITEM_CLASS);
        assert.equal($firstRow.eq(0).width(), cols[0].baseSize + widthRatioUnit * cols[0].ratio, 'empty item 11 width');
        assert.equal($firstRow.eq(0).height(), rows[0].baseSize + heightRatioUnit * rows[0].ratio, 'empty item 11 height');

        assert.equal($firstRow.eq(1).width(), cols[1].baseSize + widthRatioUnit * cols[1].ratio, 'empty item 12 width');
        assert.equal($firstRow.eq(1).height(), rows[0].baseSize + heightRatioUnit * rows[0].ratio, 'empty item 12 height');

        const $secondRow = $columnBoxes.eq(1).find('.' + BOX_ITEM_CLASS);
        assert.equal($secondRow.eq(0).width(), cols[0].baseSize + widthRatioUnit * cols[0].ratio, 'empty item 21 width');
        assert.equal($secondRow.eq(0).height(), rows[1].baseSize + heightRatioUnit * rows[1].ratio, 'empty item 21 height');

        assert.equal($secondRow.eq(1).width(), cols[1].baseSize + widthRatioUnit * cols[1].ratio, 'empty item 22 width');
        assert.equal($secondRow.eq(1).height(), rows[1].baseSize + heightRatioUnit * rows[1].ratio, 'empty item 22 height');
    });

    QUnit.test('check size of grid with items', function(assert) {
        const rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }];
        const cols = [{ ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 100 }];
        const height = 600;
        const width = 600;
        const heightWithoutBaseSize = height - rows[0].baseSize - rows[1].baseSize;
        const widthWithoutBaseSize = width - cols[0].baseSize - cols[1].baseSize;
        const heightRatioUnit = heightWithoutBaseSize / (rows[0].ratio + rows[1].ratio);
        const widthRatioUnit = widthWithoutBaseSize / (cols[0].ratio + cols[1].ratio);

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

        const $firstRow = $boxes.eq(1).find('.' + BOX_ITEM_CLASS);
        assert.equal($firstRow.eq(0).width(), cols[0].baseSize + widthRatioUnit * cols[0].ratio, 'item11 width');
        assert.equal($firstRow.eq(0).height(), rows[0].baseSize + heightRatioUnit * rows[0].ratio, 'item11 height');

        assert.equal($firstRow.eq(1).width(), cols[1].baseSize + widthRatioUnit * cols[1].ratio, 'item12 width');
        assert.equal($firstRow.eq(1).height(), rows[0].baseSize + heightRatioUnit * rows[0].ratio, 'item12 height');

        const $secondRow = $boxes.eq(2).find('.' + BOX_ITEM_CLASS);
        assert.equal($secondRow.eq(0).width(), cols[0].baseSize + widthRatioUnit * cols[0].ratio, 'item21 width');
        assert.equal($secondRow.eq(0).height(), rows[1].baseSize + heightRatioUnit * rows[1].ratio, 'item21 height');

        assert.equal($secondRow.eq(1).width(), cols[1].baseSize + widthRatioUnit * cols[1].ratio, 'item22 width');
        assert.equal($secondRow.eq(1).height(), rows[1].baseSize + heightRatioUnit * rows[1].ratio, 'item22 height');
    });

    QUnit.test('root box and it\'s items should have correct height (T566515)', function(assert) {
        const rows = [{}, {}];
        const cols = [{ ratio: 1 }, { ratio: 1 }];

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: rows,
            cols: cols,
            items: [
                { location: { row: 0, col: 0 }, text: 'item11' },
                { location: { row: 1, col: 1 }, text: 'item22' },
                { location: { row: 1, col: 0 }, text: 'item21' },
                { location: { row: 0, col: 1 }, text: 'item12' }
            ],
            height: 'auto'
        });

        const $boxes = $responsiveBox.find('.' + BOX_CLASS);

        const $rootBox = $boxes.eq(0);
        assert.notEqual($rootBox.height(), 0, 'Height of the rootBox is OK');

        const $rootItems = $rootBox.find('.' + BOX_ITEM_CLASS);

        assert.roughEqual($rootItems.eq(0).height(), 19, 2.1, 'Height of the root item is OK');
        assert.roughEqual($rootItems.eq(1).height(), 19, 2.1, 'Height of the root item is OK');
    });

    QUnit.test('check width of colspan', function(assert) {
        const cols = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
        const size = 900;

        const sizeWithoutBaseSize = size - cols[0].baseSize - cols[1].baseSize - cols[2].baseSize;
        const ratioUnit = sizeWithoutBaseSize / (cols[0].ratio + cols[1].ratio + cols[2].ratio);

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: cols,
            width: size,
            items: [{ location: { row: 0, col: 0, colspan: 2 } }, { location: { row: 0, col: 2 } }]
        });

        const $rowBox = $responsiveBox.find('.' + BOX_CLASS).eq(1);
        const $boxItems = $rowBox.find('.' + BOX_ITEM_CLASS);

        const firstColumnSize = cols[0].baseSize + cols[0].ratio * ratioUnit;
        const secondColumnSize = cols[1].baseSize + cols[1].ratio * ratioUnit;
        const thirdColumnSize = cols[2].baseSize + cols[2].ratio * ratioUnit;

        assert.equal($boxItems.eq(0).width(), firstColumnSize + secondColumnSize, 'first item size');
        assert.equal($boxItems.eq(1).width(), thirdColumnSize, 'second item size');
    });

    QUnit.test('check height of rowspan', function(assert) {
        const rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
        const size = 900;

        const sizeWithoutBaseSize = size - rows[0].baseSize - rows[1].baseSize - rows[2].baseSize;
        const ratioUnit = sizeWithoutBaseSize / (rows[0].ratio + rows[1].ratio + rows[2].ratio);

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: rows,
            cols: [{}],
            height: size,
            items: [{ location: { row: 0, col: 0, rowspan: 2 } }, { location: { row: 2, col: 0 } }]
        });

        const $boxItems = $responsiveBox.find('.' + BOX_ITEM_CLASS);

        const firstRowSize = rows[0].baseSize + rows[0].ratio * ratioUnit;
        const secondRowSize = rows[1].baseSize + rows[1].ratio * ratioUnit;
        const thirdRowSize = rows[2].baseSize + rows[2].ratio * ratioUnit;

        assert.equal($boxItems.eq(0).height(), firstRowSize + secondRowSize, 'first item size');
        assert.equal($boxItems.eq(1).height(), thirdRowSize, 'second item size');
    });


    QUnit.test('rowspan and colspan', function(assert) {
        const rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
        const cols = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
        const size = 900;

        const sizeWithoutBaseSize = size - rows[0].baseSize - rows[1].baseSize - rows[2].baseSize;
        const ratioUnit = sizeWithoutBaseSize / (rows[0].ratio + rows[1].ratio + rows[2].ratio);

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: rows,
            cols: cols,
            items: [
                { location: { row: 0, col: 0, rowspan: 2 } },
                { location: { row: 0, col: 1, colspan: 2 } }
            ],
            width: size,
            height: size
        });

        const $rowBox = $responsiveBox.find('.' + BOX_CLASS).eq(1);

        assert.equal($rowBox.height(), rows[0].baseSize + rows[1].baseSize + ratioUnit * rows[0].ratio + ratioUnit * rows[1].ratio, 'rowspan height');

        const $colBox = $rowBox.find('.' + BOX_CLASS).eq(0);

        assert.equal($colBox.width(), cols[1].baseSize + cols[2].baseSize + ratioUnit * cols[1].ratio + ratioUnit * cols[2].ratio, 'colspan width');

        assert.equal($rowBox.height(), $colBox.height(), 'inner boxes are equal');
    });

    QUnit.test('rowspan and colspan simultaneously', function(assert) {
        const rows = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
        const cols = [{ ratio: 1, baseSize: 100 }, { ratio: 2, baseSize: 200 }, { ratio: 1, baseSize: 200 }];
        const size = 900;

        const sizeWithoutBaseSize = size - rows[0].baseSize - rows[1].baseSize - rows[2].baseSize;
        const ratioUnit = sizeWithoutBaseSize / (rows[0].ratio + rows[1].ratio + rows[2].ratio);

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: rows,
            cols: cols,
            items: [{
                location: { col: 0, row: 0, colspan: 2, rowspan: 2 }
            }],
            width: size,
            height: size
        });

        const $rowBox = $responsiveBox.find('.' + BOX_CLASS).eq(1);
        const $firstItem = $rowBox.find('.' + BOX_ITEM_CLASS).eq(0);

        const firstItemWidth = rows[0].baseSize + rows[1].baseSize + ratioUnit * rows[0].ratio + ratioUnit * rows[1].ratio;
        const firstItemHeight = cols[0].baseSize + cols[1].baseSize + ratioUnit * cols[0].ratio + ratioUnit * cols[1].ratio;

        assert.equal($firstItem.width(), firstItemWidth, 'item width');
        assert.equal($firstItem.height(), firstItemHeight, 'item height');
    });

    QUnit.test('overlapping rowspan and colspan', function(assert) {
        const size = 100;
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}, {}, {}],
            cols: [{}, {}, {}, {}],
            items: [
                { location: { col: 0, row: 0, rowspan: 3 } },
                { location: { col: 1, row: 1, rowspan: 2 } },
                { location: { col: 1, row: 0, colspan: 2 } },
                { location: { col: 2, row: 1, colspan: 2 } }
            ],
            width: 4 * size,
            height: 3 * size
        });

        const $rowBox = $responsiveBox.find('.' + BOX_CLASS).eq(1);

        assert.roughEqual($rowBox.height(), 3 * size, 0.1, 'first row box height');

        const $colBox = $rowBox.find('.' + BOX_CLASS).eq(1);

        assert.roughEqual($colBox.width(), 3 * size, 0.1, 'second col box width');
    });

    QUnit.test('minSize and maxSize', function(assert) {
        const size = 100;
        const minSize = 80;
        const maxSize = 5;

        const device = devices.real();
        const version = device.version;
        const isAndroid = device.android;

        if(isAndroid && (version[0] < 4 || (version[0] === 4 && version[1] === 0))) {
            assert.ok(true, 'old android min/max height problem');
            return;
        }

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{ baseSize: 0, minSize: minSize, ratio: 1 }, { maxSize: maxSize, ratio: 1 }, { ratio: 1 }],
            cols: [{ baseSize: 0, minSize: minSize, ratio: 1 }, { maxSize: maxSize, ratio: 1 }, { ratio: 1 }],
            items: [
                { location: { row: 0, col: 0 }, html: '<div class=\'first\'></div>' },
                { location: { row: 1, col: 1 }, html: '<div class=\'second\'></div>' }
            ],
            width: size,
            height: size
        });

        const $first = $responsiveBox.find('.first').parent();
        const $second = $responsiveBox.find('.second').parent();

        assert.equal($first.width(), minSize, 'width is min-width');
        assert.equal($first.height(), minSize, 'height is min-height');

        assert.equal($second.width(), maxSize, 'width is max-width');
        assert.equal($second.height(), maxSize, 'height is max-height');
    });

    QUnit.test('singleColumnScreen render items with baseSize: auto', function(assert) {
        this.updateScreenSize(500);

        const $responsiveBox = $('#responsiveBox').css('height', 'auto').dxResponsiveBox({
            rows: [{}, {}],
            cols: [{}],
            singleColumnScreen: 'xs',
            items: [
                { location: { row: 0, col: 0 }, text: '1' },
                { location: { row: 0, col: 1 }, text: '2' }
            ]
        });

        assert.notEqual($responsiveBox.height(), 0, 'item has height: auto');
    });

    QUnit.test('width and height rendered correctly when dxResponsiveBox has one row and column', function(assert) {
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            width: 'auto',
            height: 'auto',
            rows: [{ ratio: 1, baseSize: 'auto' }],
            cols: [{ ratio: 1, baseSize: 'auto' }],
            items: [{ location: { row: 0, col: 0 }, template: $('<div>').css('height', '100px') }]
        });

        assert.equal($responsiveBox.height(), 100, 'height calculated correctly');

        const $item = $responsiveBox.find('.dx-box-item');

        assert.equal($item.width(), $responsiveBox.width(), 'item width calculated correctly');
    });
});

QUnit.module('template rendering', moduleConfig, () => {
    QUnit.test('widget inside item is not disposed', function(assert) {
        // screen:   xs      sm           md          lg
        //  width: <768    768-<992    992-<1200    >1200

        this.updateScreenSize(1000);

        registerComponent('dxWidget', Widget.inherit({}));

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [
                {
                    location: { row: 0, col: 0, screen: 'md' }, template: function() {
                        return $('<div>').dxWidget();
                    }
                }
            ]
        });

        let $widget = $responsiveBox.find('.dx-item .dx-widget');
        const initialWidget = $widget.dxWidget('instance');

        this.updateScreenSize(700);
        this.updateScreenSize(1000);

        $widget = $responsiveBox.find('.dx-item .dx-widget');
        assert.equal($widget.dxWidget('instance'), initialWidget, 'widget was rendered correctly');
    });

    QUnit.test('items have no unsafe modifications after dispose', function(assert) {
        this.updateScreenSize(1000);

        const items = [
            {
                location: { row: 0, col: 0, screen: 'md' }, template: 'template'
            }
        ];

        const result = [
            {
            // only safe modifications
                baseSize: 'auto',
                ratio: 1,
                //
                location: {
                    row: 0,
                    col: 0,
                    screen: 'md'
                },
                template: 'template'
            }
        ];

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: items
        });

        assert.ok(items[0].node, 'node exists on rendering (unsafe)');

        $responsiveBox.dxResponsiveBox('instance').dispose();

        assert.deepEqual(items, result, 'items have no unsafe modifications after dispose');
    });
});

QUnit.module('events', moduleConfig, () => {
    QUnit.test('onLayoutChanged', function(assert) {
    // screen:   xs      sm           md          lg
    //  width: <768    768-<992    992-<1200    >1200

        this.updateScreenSize(500);
        const onLayoutChangedSpy = sinon.stub();
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [
                { location: { row: 0, col: 0 }, text: 'item(0,0)' }
            ],
            onLayoutChanged: onLayoutChangedSpy
        });

        assert.equal(onLayoutChangedSpy.called, false, 'onLayoutChanged not triggered on start');

        // sm screen
        this.updateScreenSize(800);

        assert.ok(onLayoutChangedSpy.calledOnce, 'onLayoutChanged was triggered');

        // md screen
        this.updateScreenSize(1000);

        assert.ok(onLayoutChangedSpy.calledTwice, 'onLayoutChanged was triggered twice');

        this.updateScreenSize(1001);

        assert.ok(onLayoutChangedSpy.calledTwice, 'onLayoutChanged was not triggered when screen was not changed');

        $responsiveBox.dxResponsiveBox('repaint');
        assert.ok(onLayoutChangedSpy.calledThrice, 'onLayoutChanged was triggered after repaint');
    });

    QUnit.test('onItemClick', function(assert) {
        const responsiveBox = new ResponsiveBox($('#responsiveBox'), {
            items: [{ text: 1 }, { text: 2 }]
        });
        responsiveBox.on('itemClick', function() {
            assert.ok(true, 'clicked');
        });

        $(responsiveBox.itemElements()).eq(0).trigger('dxclick');
    });
});

QUnit.module('option', moduleConfig, () => {
    QUnit.test('currentScreenFactor', function(assert) {
        // screen:   xs      sm           md          lg
        //  width: <768    768-<992    992-<1200    >1200

        this.updateScreenSize(500);
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [
                { location: { row: 0, col: 0 }, text: 'item(0,0)' }
            ]
        });

        const responsiveBox = $responsiveBox.dxResponsiveBox('instance');

        assert.equal(responsiveBox.option('currentScreenFactor'), 'xs', 'currentScreenFactor update on start');

        this.updateScreenSize(800);

        assert.equal(responsiveBox.option('currentScreenFactor'), 'sm', 'currentScreenFactor update after restart');
    });

    QUnit.test('Changing visibility should update height', function(assert) {
        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            visible: false,
            height: 400,
            rows: [
                { ratio: 1 },
                { ratio: 1 }
            ],
            cols: [{}],
            items: [{ location: { row: 0, col: 0 }, template: function() { return $('<div>').prop('id', 'cellTest'); } }]
        });
        const responsiveBox = $responsiveBox.dxResponsiveBox('instance');

        responsiveBox.option('visible', true);

        const $firstItem = $('#cellTest').closest('.dx-item');

        assert.equal($firstItem.height(), 200, 'height calculate correctly');
    });

    QUnit.test('onOptionChanged should not be fired after click on item', function(assert) {
        const onOptionChangedStub = sinon.stub();

        const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [
                { location: { row: 0, col: 0 }, text: 'item(0,0)' }
            ],
            onOptionChanged: onOptionChangedStub
        });
        const initCallCount = onOptionChangedStub.callCount;

        $($responsiveBox.find('.dx-item')).trigger('dxclick');

        assert.equal(onOptionChangedStub.callCount, initCallCount, 'onOptionChanged wasn\'t fired');
    });

    QUnit.test('responsive box should work correctly after item option changing', function(assert) {
        const responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [{ location: { col: 0, row: 0 }, html: '<div class=\'test\'>' }]
        }).dxResponsiveBox('instance');

        responsiveBox.option('items[0].visible', false);
        assert.ok($('#responsiveBox').find('.dx-item').eq(0).hasClass('dx-state-invisible'), 'responsive box works correctly');
    });

    QUnit.test('responsive box should render layout correctly after item option changing', function(assert) {
        const responsiveBox = $('#responsiveBox').dxResponsiveBox({
            rows: [{}],
            cols: [{}],
            items: [{ location: { col: 0, row: 0 }, html: '<div class=\'test\'>' }]
        }).dxResponsiveBox('instance');

        responsiveBox.option('items[0].visible', false);
        responsiveBox.option('items[0].visible', true);

        assert.equal($('#responsiveBox').find('.dx-item').eq(0).get(0).style.display, 'flex', 'Layout is correct');
        assert.equal($('#responsiveBox').find('.dx-item').eq(0).get(0).style.flex, '1 1 auto', 'Layout is correct');
    });

    [
        box => {
            box.option('items[0].visible', false);
            box.option('items[0].visible', true);
        }, box => {
            box.option('items[0].disabled', true);
            box.option('items[0].disabled', false);
        }
    ].forEach(optionRefreshAction => {
        QUnit.test(`nested component is recreated after item option ${optionRefreshAction.toString()} changed  (T940715)`, function(assert) {
            registerComponent('dxWidget', Widget.inherit({}));

            let isDisposed = false;
            const $responsiveBox = $('#responsiveBox').dxResponsiveBox({
                items: [ { ratio: 1 } ],
                itemTemplate: function(data, index, element) {
                    const $button = domAdapter.getDocument().createElement('div');
                    new dxButton($button, {
                        onDisposing: function() {
                            isDisposed = true;
                        }
                    });
                    $(element).append($button);
                },
            });

            const getButton = () => $responsiveBox.find('.dx-button').dxButton('instance');
            const initialWidget = getButton();

            const responsiveBox = $responsiveBox.dxResponsiveBox('instance');
            optionRefreshAction(responsiveBox);

            assert.equal(isDisposed, true, 'disposed is called for old instance');
            assert.notEqual(initialWidget, getButton(), 'widget is new instance');
            assert.equal(responsiveBox._assistantRoots, undefined, 'there is no roots cache');
        });

        QUnit.test(`nested component in template should work after item option  ${optionRefreshAction.toString()} changed (T940715)`, function(assert) {
            let expected = false;
            const responsiveBox = $('#responsiveBox').dxResponsiveBox({
                items: [ { ratio: 1 } ],
                itemTemplate: function(data, index, element) {
                    const $button = domAdapter.getDocument().createElement('div');
                    new dxButton($button, {
                        onClick: function() {
                            expected = true;
                        }
                    });
                    $(element).append($button);
                },
            }).dxResponsiveBox('instance');

            optionRefreshAction(responsiveBox);
            eventsEngine.trigger(responsiveBox.$element().find('.dx-button'), 'dxclick');

            assert.equal(expected, true, 'onClick event is processed');
        });
    });

});

