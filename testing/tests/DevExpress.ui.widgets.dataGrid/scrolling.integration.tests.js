QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid">
            </div>
        </div>
    `;
    const markup = `
        <style>
            .fixed-height {
                height: 400px;
            }
            .qunit-fixture-auto-height {
                position: static !important;
                height: auto !important;
            }
            .dx-scrollable-native-ios .dx-scrollable-content {
                padding: 0 !important;
            }
        </style>

        <!--qunit-fixture-->

        ${gridMarkup}
    `;

    $('#qunit-fixture').html(markup);
    // $(gridMarkup).appendTo('body');
});

import $ from 'jquery';
import commonUtils from 'core/utils/common';
import devices from 'core/devices';
import browser from 'core/utils/browser';
import pointerEvents from 'events/pointer';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';

const dataGridWrapper = new DataGridWrapper('#dataGrid');

if('chrome' in window && devices.real().deviceType !== 'desktop') {
    // Chrome DevTools device emulation
    // Erase differences in user agent stylesheet
    $('head').append($('<style>').text('input[type=date] { padding: 1px 0; }'));
}

QUnit.module('Scrolling', baseModuleConfig, () => {
    QUnit.test('Correct start scroll position when RTL', function(assert) {
        createDataGrid({
            width: 100,
            rtlEnabled: true,
            columns: [{ dataField: 'field1', width: 100 }, { dataField: 'field2', width: 100 }],
            dataSource: {
                store: [{ field1: '1', field2: '2' }]
            }
        });

        this.clock.tick();

        const scrollLeft = $('.dx-scrollable').dxScrollable('instance').scrollLeft();

        assert.equal(scrollLeft, 100);
    });

    // T388508
    QUnit.test('Correct start scroll position when RTL and detached container of the datagrid', function(assert) {
        // arrange, act
        const $dataGrid = $('<div/>').dxDataGrid({
            width: 100,
            rtlEnabled: true,
            columns: [{ dataField: 'field1', width: 100 }, { dataField: 'field2', width: 100 }],
            dataSource: {
                store: [{ field1: '1', field2: '2' }]
            }
        });

        this.clock.tick();

        $('#container').append($dataGrid);
        $dataGrid.dxDataGrid('instance').updateDimensions();
        const scrollLeft = $('.dx-scrollable').dxScrollable('instance').scrollLeft();

        // assert
        assert.equal(scrollLeft, 100);
    });

    // T475354
    QUnit.test('Correct start scroll position when RTL and columnAutoWidth option is enabled', function(assert) {
        // arrange, act
        createDataGrid({
            width: 100,
            rtlEnabled: true,
            columnAutoWidth: true,
            columns: [{ dataField: 'field1', width: 100 }, { dataField: 'field2', width: 100 }],
            dataSource: {
                store: [{ field1: '1', field2: '2' }]
            }
        });
        this.clock.tick();

        // assert
        assert.equal($('.dx-scrollable').dxScrollable('instance').scrollLeft(), 100);
    });

    // T388508
    QUnit.test('Scroll position after grouping when RTL', function(assert) {
        // arrange
        const done = assert.async();
        const dataGrid = createDataGrid({
            width: 200,
            rtlEnabled: true,
            columns: [{ dataField: 'field1', width: 100 }, { dataField: 'field2', width: 100 }, { dataField: 'field3', width: 100 }, { dataField: 'field4', width: 100 }, { dataField: 'field5', width: 100 }],
            dataSource: [{ field1: '1', field2: '2', field3: '3', field4: '4' }]
        });
        const getRightScrollOffset = function(scrollable) {
            return scrollable.scrollWidth() - scrollable.clientWidth() - scrollable.scrollLeft();
        };

        this.clock.tick();
        const scrollable = $('.dx-scrollable').dxScrollable('instance');

        // assert
        assert.equal(scrollable.scrollLeft(), 300, 'scroll position');

        this.clock.restore();
        scrollable.scrollTo({ x: 100 });
        const scrollRight = getRightScrollOffset(scrollable);

        setTimeout(function() {
            // act
            dataGrid.columnOption('field1', 'groupIndex', 0);

            setTimeout(function() {
                // assert

                const scrollRightAfterGrouping = getRightScrollOffset(scrollable);
                assert.ok($(dataGrid.$element()).find('.dx-datagrid-rowsview').find('tbody > tr').first().hasClass('dx-group-row'));
                assert.equal(scrollRightAfterGrouping, scrollRight, 'scroll position after grouping');
                done();
            });
        });
    });

    QUnit.test('Scroller state', function(assert) {
        const dataGrid = createDataGrid({ width: 120, height: 230 });
        assert.ok(dataGrid);
        assert.ok(!dataGrid.isScrollbarVisible());
        assert.ok(!dataGrid.getTopVisibleRowData());
    });

    // T532629
    QUnit.test('Vertical scrollbar spacing should not be added when widget does not have height', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            columnAutoWidth: true,
            scrolling: {
                useNative: true
            },
            columns: ['column']
        });

        // act
        this.clock.tick();

        // assert
        assert.equal($(dataGrid.$element()).find('.dx-datagrid-headers').css('paddingRight'), '0px');
    });

    QUnit.test('rowsview should be syncronized while headersView scrolling (T844512)', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{}],
            loadingTimeout: undefined,
            scrolling: {
                useNative: false
            },
            width: 150,
            columnWidth: 100,
            columns: ['column1', 'column2', 'column3']
        });

        const $headerScrollContainer = $(dataGrid.$element().find('.dx-datagrid-headers .dx-datagrid-scroll-container'));

        // act
        $headerScrollContainer.scrollLeft(50);
        $headerScrollContainer.trigger('scroll');

        $headerScrollContainer.scrollLeft(60);
        $headerScrollContainer.trigger('scroll');

        // assert
        assert.equal($headerScrollContainer.scrollLeft(), 60, 'headersView scrollleft');
        assert.equal(dataGrid.getScrollable().scrollLeft(), 60, 'rowsview scrollleft');
    });

    QUnit.test('headersView should be syncronized while rowsview scrolling (T844512)', function(assert) {
        const dataGrid = createDataGrid({
            dataSource: [{}],
            loadingTimeout: undefined,
            scrolling: {
                useNative: false
            },
            width: 150,
            columnWidth: 100,
            columns: ['column1', 'column2', 'column3']
        });

        const $headerScrollContainer = $(dataGrid.$element().find('.dx-datagrid-headers .dx-datagrid-scroll-container'));
        const $scrollContainer = $(dataGrid.$element().find('.dx-datagrid-rowsview .dx-scrollable-container'));

        // act
        $scrollContainer.scrollLeft(50);
        $scrollContainer.trigger('scroll');

        $scrollContainer.scrollLeft(60);
        $scrollContainer.trigger('scroll');

        // assert
        assert.equal($headerScrollContainer.scrollLeft(), 60, 'headersView scrollleft');
        assert.equal($scrollContainer.scrollLeft(), 60, 'rowsview scrollleft');
    });

    // T608687
    QUnit.test('Horizontal scrollbar should not be shown if container height is not integer', function(assert) {
        // act
        const dataGrid = createDataGrid({
            width: 300.8,
            dataSource: [{}],
            loadingTimeout: undefined,
            columnAutoWidth: true,
            scrolling: {
                useNative: true
            },
            columns: ['column1', 'column2', 'column3']
        });

        // assert
        assert.strictEqual(dataGrid.getScrollbarWidth(true), 0);
    });

    // T703649
    QUnit.test('Fixed and main table should have same scroll top if showScrollbar is always', function(assert) {
        // act
        const dataGrid = createDataGrid({
            height: 200,
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            loadingTimeout: undefined,
            scrolling: {
                useNative: false,
                showScrollbar: 'always'
            },
            columns: [{ dataField: 'column1', fixed: true }, 'column2']
        });

        const scrollable = dataGrid.getScrollable();

        scrollable.scrollTo({ y: 10000 });

        // assert
        assert.ok(scrollable.scrollTop() > 0, 'content is scrolled');
        assert.strictEqual(scrollable.scrollTop(), $(scrollable.element()).children('.dx-datagrid-content-fixed').scrollTop(), 'scroll top are same for main and fixed table');
    });

    // T745930
    QUnit.test('Native scrollbars should not be visible if columns are not hidden by hidingPriority', function(assert) {
        // arrange, act
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 1100,
            loadingTimeout: undefined,
            dataSource: [{
                OrderNumber: 35703,
                Employee: 'Harv Mudd'
            }],
            columnAutoWidth: true,
            scrolling: { useNative: true },
            columns: [{
                dataField: 'OrderNumber',
                hidingPriority: 0,
                width: 130
            },
            'Employee']
        }).dxDataGrid('instance');

        assert.strictEqual(dataGrid.getView('rowsView').getScrollbarWidth(true), 0, 'Horizontal scrollbar is hidden');
        assert.strictEqual(dataGrid.getView('rowsView').getScrollbarWidth(false), 0, 'Vertical scrollbar is hidden');
    });

    QUnit.test('Horizontal scrollbar is not displayed when columns width has float value', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
            dataSource: [],
            columns: [
                { dataField: 'firstName' },
                { dataField: 'lastName' },
                { dataField: 'room' },
                { dataField: 'birthDay' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // assert
        assert.strictEqual(dataGrid.getView('rowsView').getScrollbarWidth(true), 0);
    });

    QUnit.test('The navigateToRow method should not affect horizontal scrolling', function(assert) {
        // arrange
        const data = [
            { team: 'internal', name: 'Alex', age: 30 },
            { team: 'internal', name: 'Bob', age: 29 },
            { team: 'internal0', name: 'Ben', age: 24 },
            { team: 'internal0', name: 'Dan', age: 23 },
            { team: 'public', name: 'Alice', age: 19 },
            { team: 'public', name: 'Zeb', age: 18 }
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 80,
            width: 200,
            dataSource: data,
            keyExpr: 'name',
            paging: { pageSize: 2 },
            pager: { visible: false },
            columnResizingMode: 'widget',
            columns: [
                { dataField: 'team', width: 150 },
                { dataField: 'name', width: 150 },
                { dataField: 'age', width: 150 },
            ]
        }).dxDataGrid('instance');

        // act
        dataGrid.navigateToRow('Zeb');
        this.clock.tick();

        const rowsView = dataGrid.getView('rowsView');

        // assert
        assert.equal(dataGrid.pageIndex(), 2, 'Page index');
        assert.ok(dataGridWrapper.rowsView.isRowVisible(1, 1), 'Navigation row is visible');
        assert.equal(rowsView.getScrollable().scrollLeft(), 0, 'Scroll left');
    });

    // T662900
    QUnit.test('scroll position should not be changed after partial update via repaintRows', function(assert) {
        // arrange
        const array = [];

        for(let i = 1; i <= 10; i++) {
            array.push({ id: i });
        }


        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            dataSource: array,
            keyExpr: 'id',
            loadingTimeout: undefined
        }).dxDataGrid('instance');


        // act
        $(dataGrid.getCellElement(0, 0)).trigger(pointerEvents.up);
        dataGrid.getScrollable().scrollTo({ y: 200 });
        dataGrid.repaintRows(0);
        this.clock.tick();

        // assert
        assert.equal(dataGrid.getScrollable().scrollTop(), 200, 'scrollTop is not reseted');
    });

    // T412035
    QUnit.test('scrollTop position must be kept after updateDimensions when scrolling is native', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            loadingTimeout: undefined,
            scrolling: {
                useNative: true
            },
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');


        const scrollable = $dataGrid.find('.dx-scrollable').dxScrollable('instance');


        // act
        scrollable.scrollTo({ x: 0, y: 50 });
        dataGrid.updateDimensions();

        assert.equal(scrollable.scrollTop(), 50, 'scrollTop');
    });

    // T758955
    QUnit.test('native scrollBars layout should be correct after width change if fixed columns exist and columnAutoWidth is true', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test is not actual for mobile devices');
            return;
        }
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{
                'CompanyName': 'Super Mart of the West',
                'Phone': '(800) 555-2797',
                'Address': '702 SW 8th Street',
                'Fax': '(800) 555-2171'
            }],
            columnAutoWidth: true,
            loadingTimeout: undefined,
            height: 300,
            width: 1000,
            scrolling: {
                useNative: true,
            },
            columns: [{
                dataField: 'CompanyName',
            }, {
                dataField: 'Phone',
            }, {
                dataField: 'Address',
            }, {
                dataField: 'Fax',
                fixed: true,
                fixedPosition: 'right',
                width: 50
            }]
        }).dxDataGrid('instance');

        // act
        dataGrid.option('width', 400);

        // assert
        if(browser.msie && parseInt(browser.version) > 11) {
            assert.notEqual($('#dataGrid').find('.dx-datagrid-content-fixed').eq(1).css('margin-right'), '0px', 'margin-right is not zero');
            assert.ok(dataGrid.getView('rowsView').getScrollbarWidth() > 0, 'vertical scrollBar exists');
        } else {
            assert.equal($('#dataGrid').find('.dx-datagrid-content-fixed').eq(1).css('margin-right'), '0px', 'margin-right is zero');
            assert.strictEqual(dataGrid.getView('rowsView').getScrollbarWidth(), 0, 'vertical scrollBar not exists');
        }
        assert.notEqual($('#dataGrid').find('.dx-datagrid-content-fixed').eq(1).css('margin-bottom'), '0px', 'margin-bottom is not zero');
    });

    // T533852
    QUnit.test('last column should have correct width if all columns have width and native vertcal scrollbar is shown', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'This test is not actual for mobile devices');
            return;
        }
        // arrange

        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 100,
            scrolling: {
                useNative: true
            },
            dataSource: [{}, {}, {}, {}, {}, {}, {}],
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 },
                { dataField: 'field4', width: 50 }
            ]
        });

        // act
        this.clock.tick(0);

        // assert
        assert.ok($dataGrid.width() > 200, 'grid\'s width is more then column widths sum');
        assert.equal($dataGrid.find('.dx-row').first().find('td').last().outerWidth(), 50, 'last column have correct width');
    });

    QUnit.test('Horizontal scroll position of headers view is changed_T251448', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            dataSource: [{
                firstName: 'Test Name',
                lastName: 'Test Last Name',
                room: 101,
                birthDay: '10/12/2004'
            }],
            columns: [
                { dataField: 'firstName', width: 200 },
                { dataField: 'lastName', width: 200 },
                { dataField: 'room', width: 200 },
                { dataField: 'birthDay', width: 200 }
            ],
            summary: {
                totalItems: [
                    {
                        column: 'firstName',
                        summaryType: 'count'
                    },
                    {
                        column: 'room',
                        summaryType: 'max'
                    }
                ]
            }
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        this.clock.tick();

        const $headersView = $dataGrid.find('.dx-datagrid-headers' + ' .dx-datagrid-scroll-container').first();
        $headersView.scrollLeft(400);
        $($headersView).trigger('scroll');
        const $footerView = $dataGrid.find('.dx-datagrid-total-footer .dx-datagrid-scroll-container').first();

        // assert
        assert.equal(dataGrid._views.rowsView.getScrollable().scrollLeft(), 400, 'scroll left of rows view');
        assert.equal($footerView.scrollLeft(), 400, 'scroll left of footer view');
    });

    QUnit.test('Horizontal scroll position of footer view is changed_T251448', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            dataSource: [{
                firstName: 'Test Name',
                lastName: 'Test Last Name',
                room: 101,
                birthDay: '10/12/2004'
            }],
            columns: [
                { dataField: 'firstName', width: 200 },
                { dataField: 'lastName', width: 200 },
                { dataField: 'room', width: 200 },
                { dataField: 'birthDay', width: 200 }
            ],
            summary: {
                totalItems: [
                    {
                        column: 'firstName',
                        summaryType: 'count'
                    },
                    {
                        column: 'room',
                        summaryType: 'max'
                    }
                ]
            }
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        this.clock.tick();

        const $footerView = $dataGrid.find('.dx-datagrid-total-footer .dx-datagrid-scroll-container').first();
        $footerView.scrollLeft(300);
        $($footerView).trigger('scroll');
        const $headersView = $dataGrid.find('.dx-datagrid-headers' + ' .dx-datagrid-scroll-container').first();

        // assert
        assert.equal(dataGrid._views.rowsView.getScrollable().scrollLeft(), 300, 'scroll left of rows view');
        assert.equal($headersView.scrollLeft(), 300, 'scroll left of headers view');
    });

    QUnit.test('Keep horizontal scroller position after refresh with native scrolling', function(assert) {
        const done = assert.async();

        const dataGrid = createDataGrid({
            width: 150,
            columnAutoWidth: true,
            dataSource: [
                { id: 1, firstName: 'Ann', lastName: 'Jones', gender: 'female', age: 34, telephone: 123561, city: 'London', country: 'UK', occupy: 'Manager' },
                { id: 2, firstName: 'George', lastName: 'Flinstone', gender: 'male', age: 40, telephone: 161, city: 'Phoenix', country: 'USA', occupy: 'Boss' },
                { id: 3, firstName: 'Steve', lastName: 'Blacksmith', gender: 'male', age: 24, telephone: 1141, city: 'Deli', country: 'India', occupy: 'Reporter' },
                { id: 4, firstName: 'John', lastName: 'Dow', gender: 'male', age: 61, telephone: 123, city: 'Bali', country: 'Spain', occupy: 'None' },
                { id: 5, firstName: 'Jenny', lastName: 'Campbell', gender: 'female', age: 22, telephone: 121, city: 'Moscow', country: 'Russia', occupy: 'Accounting' }
            ],
            scrolling: { useNative: true },
            headerFilter: {
                visible: true
            }
        });

        this.clock.tick();
        this.clock.restore();

        const scrollableInstance = dataGrid.getView('rowsView').getScrollable();
        scrollableInstance.scrollTo({ x: 150 });
        function scrollHandler() {
            scrollableInstance.off('scroll', scrollHandler);
            // act
            dataGrid.refresh().done(function() {
                // assert
                assert.equal(scrollableInstance.scrollLeft(), 150, 'Grid save its horizontal scroll position after refresh');
                done();
            });
        }

        scrollableInstance.on('scroll', scrollHandler);
    });

    // T473860, T468902
    QUnit.test('Keep horizontal scroller position after refresh when all columns have widths', function(assert) {
        this.clock.restore();
        const done = assert.async();

        const dataGrid = createDataGrid({
            width: 200,
            loadingTimeout: undefined,
            dataSource: [
                { field1: 'Test Test' }
            ],
            columnAutoWidth: true,
            columns: [
                { dataField: 'field1', width: 100 },
                { dataField: 'field1', width: 100 },
                { dataField: 'field1', width: 100 },
                { dataField: 'field1', width: 100 }
            ]
        });

        const scrollableInstance = dataGrid.getView('rowsView').getScrollable();
        scrollableInstance.scrollTo({ x: 150 });

        function scrollHandler() {
            scrollableInstance.off('scroll', scrollHandler);
            setTimeout(function() {
                dataGrid.refresh().done(function() {
                    assert.equal(scrollableInstance.scrollLeft(), 150, 'Grid save its horizontal scroll position after refresh');
                    done();
                });
            });
        }

        scrollableInstance.on('scroll', scrollHandler);
    });

    // T345699
    QUnit.test('Keep horizontal scroller position after grouping column with native scrolling', function(assert) {
        // arrange
        this.clock.restore();
        const done = assert.async();

        const dataGrid = createDataGrid({
            width: 150,
            columnAutoWidth: true,
            dataSource: [
                { id: 1, firstName: 'Ann', lastName: 'Jones', gender: 'female', age: 34, telephone: 123561, city: 'London', country: 'UK', occupy: 'Manager' },
                { id: 2, firstName: 'George', lastName: 'Flinstone', gender: 'male', age: 40, telephone: 161, city: 'Phoenix', country: 'USA', occupy: 'Boss' },
                { id: 3, firstName: 'Steve', lastName: 'Blacksmith', gender: 'male', age: 24, telephone: 1141, city: 'Deli', country: 'India', occupy: 'Reporter' },
                { id: 4, firstName: 'John', lastName: 'Dow', gender: 'male', age: 61, telephone: 123, city: 'Bali', country: 'Spain', occupy: 'None' },
                { id: 5, firstName: 'Jenny', lastName: 'Campbell', gender: 'female', age: 22, telephone: 121, city: 'Moscow', country: 'Russia', occupy: 'Accounting' }
            ],
            loadingTimeout: undefined,
            scrolling: {
                useNative: true
            },
            headerFilter: {
                visible: true
            }
        });
        const scrollableInstance = dataGrid.getView('rowsView').getScrollable();

        scrollableInstance.on('scroll', function() {
            setTimeout(function() {
                // act
                dataGrid.columnOption('city', 'groupIndex', 0);
                setTimeout(function() {
                    // assert
                    assert.equal(scrollableInstance.scrollLeft(), 400, 'Grid save its horizontal scroll position after refresh');
                    done();
                });
            });
        });

        scrollableInstance.scrollTo({ x: 400 });
    });

    // T362355
    QUnit.test('Keep vertical browser scroll position after refresh with freespace row', function(assert) {
        $('#qunit-fixture').css('overflowY', 'auto').height(50);

        const items = [];
        for(let i = 0; i < 21; i++) {
            items.push({});
        }

        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columns: ['test'],
            dataSource: items
        });
        dataGrid.pageIndex(1);


        $('#qunit-fixture').scrollTop(500);

        // assert
        assert.equal($('#qunit-fixture').scrollTop(), 500, 'scroll top');

        // act
        dataGrid.refresh();

        // assert
        assert.equal($('#qunit-fixture').scrollTop(), 500, 'scroll top');
    });

    // T728069
    QUnit.test('Horizontal scroll should not exist if fixed column with custom buttons exists', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            width: 600,
            dataSource: [{}],
            loadingTimeout: undefined,
            columnAutoWidth: true,
            columns: ['field1', 'field2', {
                type: 'buttons',
                fixed: true,
                buttons: [
                    { icon: 'repeat' },
                    { icon: 'repeat' },
                    { icon: 'repeat' },
                    { icon: 'repeat' },
                    { icon: 'repeat' },
                    { icon: 'repeat' }
                ]
            }]
        });

        // assert
        const scrollable = dataGrid.getScrollable();
        assert.roughEqual($(scrollable.content()).width(), $(scrollable._container()).width(), 1.01, 'no scroll');
    });

    QUnit.test('Scrollable should have the correct padding when the grid inside the ScrollView', function(assert) {
        // arrange, act
        $('#container').dxScrollView({
            showScrollbar: 'always'
        });
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1 }],
            columnAutoWidth: true,
            scrolling: {
                showScrollbar: 'always'
            }
        });
        this.clock.tick(30);

        // assert
        const $scrollableContent = $(dataGrid.getScrollable().content());
        assert.strictEqual($scrollableContent.css('paddingRight'), '0px', 'paddingRight');
        assert.strictEqual($scrollableContent.css('paddingLeft'), '0px', 'paddingLeft');
    });

    QUnit.test('Scrollable should have the correct padding when the grid inside the ScrollView in RTL', function(assert) {
        // arrange, act
        $('#container').dxScrollView({
            showScrollbar: 'always'
        });
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1 }],
            columnAutoWidth: true,
            rtlEnabled: true,
            scrolling: {
                showScrollbar: 'always'
            }
        });
        this.clock.tick(30);

        // assert
        const $scrollableContent = $(dataGrid.getScrollable().content());
        assert.strictEqual($scrollableContent.css('paddingRight'), '0px', 'paddingRight');
        assert.strictEqual($scrollableContent.css('paddingLeft'), '0px', 'paddingLeft');
    });

    QUnit.test('Content height differs from the scrollable container height by the height of horizontal scroll (T865137)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'not actual for not desktop devices');
            return;
        }

        const dataGrid = createDataGrid({
            height: 200,
            width: 200,
            dataSource: [{ id: 1, name: 'Sam', age: 26 }],
            columnWidth: 100,
            keyExpr: 'id',
            scrolling: {
                showScrollbar: 'always'
            }
        });
        this.clock.tick();

        const scrollable = dataGrid.getScrollable();
        const content = dataGrid.$element().find('.dx-datagrid-rowsview .dx-datagrid-content')[0];
        const scrollbarWidth = dataGrid.getView('rowsView').getScrollbarWidth(true);

        assert.equal(scrollable.$element().height() - content.clientHeight, scrollbarWidth, 'Content height is correct');
    });

    // T628787
    QUnit.test('rtlEnabled change after scroll', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: [{}, {}, {}, {}],
            columns: ['test'],
            height: 50,
            loadingTimeout: undefined,
            scrolling: {
                useNative: false
            }
        });

        dataGrid.getScrollable().scrollTo(10);

        // act
        dataGrid.option('rtlEnabled', true);

        // assert
        assert.ok($(dataGrid.$element()).hasClass('dx-rtl'), 'dx-rtl class added');
    });

    // T307737
    QUnit.test('scroll position after refresh with native scrolling', function(assert) {
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 100,
            scrolling: {
                useNative: true
            },
            columnAutoWidth: true,
            dataSource: [{ field1: 'test test test', field2: 'test test test', field3: 'test test test', field4: 'test test test' }]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        this.clock.tick();

        const $scrollableContainer = $dataGrid.find('.dx-scrollable-container');

        $scrollableContainer.scrollLeft(100);
        $($scrollableContainer).trigger('scroll');

        // act
        dataGrid.updateDimensions();

        // assert
        assert.equal($scrollableContainer.scrollLeft(), 100);
    });

    QUnit.test('scrollLeft for columnHeadersView should be equal scrollLeft for rowsView (T307737, T861910)', function(assert) {
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 100,
            scrolling: {
                useNative: false
            },
            columnAutoWidth: true,
            dataSource: [{ field1: 'test test test', field2: 'test test test', field3: 'test test test', field4: 'test test test' }]
        });

        this.clock.tick();

        const scrollable = $dataGrid.find('.dx-scrollable').dxScrollable('instance');

        // act
        scrollable.scrollTo(100.7);

        // assert
        assert.equal(scrollable.scrollLeft(), 100.7);
        assert.equal(scrollable._container().scrollLeft(), 100);

        const $headersScrollable = $dataGrid.find('.dx-datagrid-headers' + ' .dx-datagrid-scroll-container').first();
        assert.equal($headersScrollable.scrollLeft(), 100);
    });

    // T372552
    QUnit.test('scroll must be updated after change column visibility', function(assert) {
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 100,
            scrolling: {
                useNative: false
            },
            columnAutoWidth: true,
            columns: [{
                dataField: 'field1',
                width: 100
            }, {
                dataField: 'field2',
                width: 100
            }, {
                dataField: 'field3',
                visible: false,
                width: 50
            }, {
                dataField: 'field4',
                width: 100
            }],
            dataSource: [{}]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        this.clock.tick();

        const scrollable = $dataGrid.find('.dx-scrollable').dxScrollable('instance');

        // act
        scrollable.scrollTo(200);
        dataGrid.columnOption('field3', 'visible', true);
        this.clock.tick();

        // assert
        assert.equal(scrollable.scrollLeft(), 200);

        const $headersScrollable = $dataGrid.find('.dx-datagrid-headers' + ' .dx-datagrid-scroll-container').first();
        assert.equal($headersScrollable.scrollLeft(), 200);
    });

    QUnit.test('Scroll positioned correct with fixed columns', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            columnFixing: {
                enabled: true
            },
            columns: [{ dataField: 'field1', width: 200 }, { dataField: 'field2', width: 200 }, { dataField: 'field3', width: 200 }, { dataField: 'fixedField', width: '200px', fixed: true, fixedPosition: 'right' }],
            dataSource: {
                store: [
                    { field1: 1, field2: 2, field3: 3, fixedField: 4 },
                    { field1: 4, field2: 5, field3: 3, fixedField: 6 }
                ]
            },
            width: 400
        });

        // act

        dataGrid.focus($(dataGrid.getCellElement(0, 2)));
        this.clock.tick();

        // assert
        assert.equal(dataGrid.getView('rowsView').getScrollable().scrollLeft(), 400, 'Correct offset');
    });

    // T648744
    QUnit.test('Scrollbar should not be shown if column hiding is enabled and all columns are visible', function(assert) {
        // arrange, act
        if(browser.webkit) {
            $('#container').css('zoom', 1.25);
        }

        const dataGrid = createDataGrid({
            width: '700.1px',
            dataSource: [{}],
            loadingTimeout: undefined,
            columnAutoWidth: true,
            columnHidingEnabled: true,
            columns: [{
                cellTemplate: function($container) { $($container).css('width', '129.6px'); }
            }, {
                cellTemplate: function($container) { $($container).css('width', '96.8px'); }
            }, {
                cellTemplate: function($container) { $($container).css('width', '104px'); }
            }, {
                cellTemplate: function($container) { $($container).css('width', '111.2px'); }
            }]
        });

        // assert
        const scrollable = dataGrid.getScrollable();
        assert.equal(scrollable.$content().width(), scrollable._container().width(), 'no scrollbar');
    });

    QUnit.test('The scroll position should be updated after resizing column', function(assert) {
        // arrange
        const $testElement = $('#dataGrid');

        $testElement.parent().attr('dir', 'rtl').css({ width: '1000px', height: '500px' });

        const instance = $testElement.dxDataGrid({
            commonColumnSettings: {
                allowResizing: true
            },
            width: 500,
            rtlEnabled: true,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
                { caption: 'Column 1', width: '125px' },
                { caption: 'Column 2', width: '125px' },
                { caption: 'Column 3', width: '125px' },
                { caption: 'Column 4', width: '125px' }
            ]
        }).dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };
        resizeController._startResizing({
            event: {
                data: resizeController,
                type: 'touchstart',
                pageX: -9125,
                pageY: -10000,
                preventDefault: function() { },
                stopPropagation: function() { }
            }
        });
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9225,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.strictEqual(instance.getScrollable().scrollLeft(), 100, 'scroll left position');
    });

    // T235091
    QUnit.test('pageSize state is applied when scrolling mode is not virtual', function(assert) {
        const dataGrid = createDataGrid({
            columns: ['field1', 'field2'],
            dataSource: [],
            loadingTimeout: undefined,
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        pageSize: 10
                    };
                }
            }
        });

        // act
        this.clock.tick();

        // assert
        assert.equal(dataGrid.pageSize(), 10, 'pageSize from stateStoring is applied');
    });
});
