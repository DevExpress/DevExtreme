QUnit.testStart(function() {
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

        <div id='container'>
            <div id="dataGrid"></div>
            <div id="dataGridWithStyle" style="width: 500px;"></div>
        </div>
    `;

    $('#qunit-fixture').html(markup);
});

import $ from 'jquery';
import resizeCallbacks from 'core/utils/resize_callbacks';
import browser from 'core/utils/browser';
import { getWindow } from 'core/utils/window';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';

QUnit.module('Initialization', baseModuleConfig, () => {
    QUnit.test('Size options', function(assert) {
        const dataGrid = createDataGrid({ width: 120, height: 230 });
        assert.ok(dataGrid);
        assert.equal($('#dataGrid').width(), 120);
        assert.equal($('#dataGrid').height(), 230);
    });

    // T615174
    QUnit.test('Last cell width != auto if sum of cells width == container width', function(assert) {
        $('#container').width(150);
        // arrange, act
        const dataGridContainer = $('#dataGrid');
        const dataGrid = dataGridContainer.css('float', 'left').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: 'firstName', width: 100 }, { dataField: 'lastName', width: 100 }]
        });
        const instance = dataGrid.dxDataGrid('instance');


        // assert
        assert.strictEqual(instance.columnOption(0, 'width'), 100);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);

        const cols = $('.dx-datagrid colgroup').eq(0).find('col');
        assert.strictEqual(dataGridContainer.width(), 200);
        assert.strictEqual(cols[0].style.width, '100px');
        assert.strictEqual(cols[1].style.width, '100px');
    });

    // T688721, T694661
    QUnit.test('column width as string should works correctly', function(assert) {
        // act
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            dataSource: [{}],
            columnAutoWidth: true,
            columns: [{
                caption: 'FirstName',
                width: '200',
                fixed: true
            }, 'LastName']
        }).dxDataGrid('instance');

        // assert
        assert.strictEqual($(dataGrid.getCellElement(0, 1))[0].getBoundingClientRect().width, 800, 'second column width is correct');
        assert.strictEqual(dataGrid.columnOption(0, 'visibleWidth'), 200, 'visibleWidth for first column is number');
    });


    // T659247
    QUnit.test('Column widths for header cells should be correctly if columnAutoWidth is enabled and banded columns are used', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            columnAutoWidth: true,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{
                dataField: 'ID',
                width: 60
            }, {
                dataField: 'prop1',
                ownerBand: 4,
                width: 70,
            }, {
                dataField: 'prop2',
                ownerBand: 4,
                width: 80
            }, {
                dataField: 'prop3',
                ownerBand: 4,
                width: 90
            }, {
                caption: 'Band',
                isBand: true
            }],
        });


        const getHeaderCellWidth = function(rowIndex, columnIndex) {
            return $dataGrid.find('.dx-header-row').eq(rowIndex).children().get(columnIndex).style.width;
        };

        // assert
        assert.strictEqual(getHeaderCellWidth(0, 0), '60px');
        assert.strictEqual(getHeaderCellWidth(0, 1), '', 'band column has no width');
        assert.strictEqual(getHeaderCellWidth(1, 0), '70px');
        assert.strictEqual(getHeaderCellWidth(1, 1), '80px');
        assert.strictEqual(getHeaderCellWidth(1, 2), '', 'last column has no width');
    });

    QUnit.test('Initialize grid with any columns when columnMinWidth option is assigned', function(assert) {
        $('#container').width(200);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnMinWidth: 100,
            dataSource: [{}],
            columns: ['firstName', 'lastName', 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');
        let $cols;

        // act
        assert.strictEqual(instance.$element().children().width(), 200);
        assert.ok(instance.getScrollable(), 'scrollable is created');

        const $colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual($colGroups.length, 2);

        for(let i = 0; i < $colGroups.length; i++) {
            $cols = $colGroups.eq(i).find('col');

            assert.strictEqual($cols.length, 3);
            assert.strictEqual($cols[0].style.width, '100px');
            assert.strictEqual($cols[1].style.width, '100px');
            assert.strictEqual($cols[2].style.width, '100px');
        }
    });

    QUnit.test('width should not be applied if minWidth greater than width', function(assert) {
        $('#container').width(200);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnMinWidth: 100,
            dataSource: [{}],
            columns: [{ dataField: 'firstName', width: 80 }, { dataField: 'lastName', width: 120 }, 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');
        let $cols;

        // act
        assert.strictEqual(instance.$element().children().width(), 200);
        assert.ok(instance.getScrollable(), 'scrollable is created');

        const $colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual($colGroups.length, 2);

        for(let i = 0; i < $colGroups.length; i++) {
            $cols = $colGroups.eq(i).find('col');

            assert.strictEqual($cols.length, 3);
            assert.strictEqual($cols[0].style.width, '100px', 'width is not applied because width < minWidth');
            assert.strictEqual($cols[1].style.width, '120px', 'width is applied because width > minWidth');
            assert.strictEqual($cols[2].style.width, '100px');
        }
    });

    // T720298
    QUnit.test('percent width should not be applied if minWidth greater than width', function(assert) {
        $('#container').width(200);
        // arrange
        $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: 'first', width: '10%', minWidth: 50 }, 'second']
        });

        // act
        const $cols = $('#dataGrid colgroup').eq(0).children('col');
        assert.strictEqual($cols.length, 2);
        assert.strictEqual($cols[0].style.width, '50px', 'min-width is applied');
        assert.strictEqual($cols[1].style.width, 'auto');
    });

    // T516187
    QUnit.test('width should be auto if minWidth is assigned to another column', function(assert) {
        $('#container').width(200);
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: 'firstName', minWidth: 80 }, 'lastName', 'age']
        });

        // act
        const $cols = $dataGrid.find('colgroup').eq(0).find('col');

        assert.strictEqual($cols.length, 3);
        assert.strictEqual($cols[0].style.width, '80px', 'width is applied because width < minWidth');
        assert.strictEqual($cols[1].style.width, 'auto', 'width is auto');
        assert.strictEqual($cols[2].style.width, 'auto', 'width is auto');
    });

    QUnit.test('Apply minWidth when columns have \'auto\' width but the last column hasn\'t width', function(assert) {
        // arrange
        $('#container').width(200);

        $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{
                firstName: 'First Name',
                lastName: 'Last Name',
                description: 'The DataGrid is a widget that represents data from a local or remote source in the form of a grid.'
            }],
            columns: [
                {
                    dataField: 'firstName',
                    width: 'auto'
                }, {
                    dataField: 'lastName',
                    width: 'auto'
                }, {
                    dataField: 'description',
                    minWidth: 20
                }
            ]
        });

        const $colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual($colGroups.length, 2);

        for(let i = 0; i < $colGroups.length; i++) {
            const $cols = $colGroups.eq(i).find('col');

            assert.strictEqual($cols.length, 3);
            assert.strictEqual($cols[2].style.width, '20px', 'minWidth is applied');
        }
    });


    // T113644
    QUnit.test('resize on change window size', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });


        // act
        $dataGrid.width(400);
        resizeCallbacks.fire();

        // assert
        assert.equal($dataGrid.find('.dx-datagrid-table').width(), 400);
    });

    QUnit.test('resize on change width', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        dataGrid.option('width', 400);


        // assert
        assert.equal($dataGrid.find('.dx-datagrid-table').width(), 400);
    });

    QUnit.test('resize on change height from fixed to auto', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 400,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        dataGrid.option('height', 'auto');


        // assert
        assert.equal($dataGrid.find('.dx-datagrid-rowsview').get(0).style.height, '');
    });

    QUnit.test('resize on change height from auto to fixed', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // act
        dataGrid.option('height', 400);


        // assert
        assert.equal(Math.round($dataGrid.find('.dx-datagrid').height()), 400);
    });

    QUnit.test('height 100% when this style apply as auto', function(assert) {
        $('#qunit-fixture').addClass('qunit-fixture-auto-height');
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: '100%'
        });

        // assert
        assert.ok($dataGrid.find('.dx-datagrid-rowsview').height(), 'rowsView has height');
        $('#qunit-fixture').removeClass('qunit-fixture-auto-height');
    });

    // T189228
    QUnit.test('height from extern styles when rendering to detached container', function(assert) {
        // arrange
        const $dataGrid = $('<div />').addClass('fixed-height').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });

        // act
        $dataGrid.appendTo('#dataGrid');

        // assert
        assert.equal($dataGrid.children('.dx-datagrid').length, 1, 'dataGrid container has gridview');

        // act
        $($dataGrid).trigger('dxshown');

        // assert
        assert.equal(Math.round($dataGrid.find('.dx-datagrid').height()), 400);
    });

    // T347043
    QUnit.test('height from extern styles when rendering to invisible container', function(assert) {
        // arrange
        // act
        $('#dataGrid').css({
            height: 400,
            position: 'relative'
        });
        $('#dataGrid').hide();
        const $dataGrid = $('<div />').css({
            top: 0,
            bottom: 0,
            position: 'absolute'
        }).appendTo('#dataGrid').dxDataGrid({
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });

        // act
        $('#dataGrid').show();
        $($dataGrid).trigger('dxshown');

        // assert
        assert.equal($dataGrid.find('.dx-datagrid').height(), 400);
    });

    // T380698
    QUnit.test('height from style after updateDimensions when rendering to container with zero content height', function(assert) {
        // arrange
        // act
        const dataGrid = $('#dataGrid').css({
            border: '1px solid black',
            height: 2
        }).dxDataGrid({
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        }).dxDataGrid('instance');

        // act
        $('#dataGrid').css('height', 300);
        dataGrid.updateDimensions();

        // assert
        assert.equal($('#dataGrid').find('.dx-datagrid').height(), 298);
    });


    QUnit.test('height from extern styles', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').addClass('fixed-height').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });

        // assert
        assert.equal(Math.round($dataGrid.find('.dx-datagrid').height()), 400);
    });

    QUnit.test('expand column width when summary with alignByColumn exists', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [{ field1: 1, field2: 2, field3: 3, field4: 4 }],
            loadingTimeout: undefined,
            columnAutoWidth: true,
            columns: [
                { dataField: 'field1', groupIndex: 0 },
                { dataField: 'field2', groupIndex: 1 },
                { dataField: 'field3' },
                { dataField: 'field4' },
            ],
            summary: {
                groupItems: [{
                    column: 'field4',
                    displayFormat: 'Test Test Test {0}',
                    alignByColumn: true
                }]
            }
        });

        // assert
        assert.roughEqual($dataGrid.find('.dx-row').first().find('td').first().outerWidth(), 30, 1, 'expand column width');
    });

    // T362517, T734767
    QUnit.test('max-height from styles', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').css('maxHeight', 400).dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // assert
        assert.equal(Math.round($dataGrid.find('.dx-datagrid').height()), 400, 'height is equal max-height');
        assert.ok(dataGrid.getScrollable().$content().height() > dataGrid.getScrollable()._container().height(), 'scroll is exists');

        // act
        dataGrid.searchByText('test');

        // assert
        assert.equal(dataGrid.totalCount(), 0, 'no items');
        assert.ok($dataGrid.find('.dx-datagrid').height() < 400, 'height is less then max-height');
    });

    // T849902
    QUnit.test('max-height as float number from styles', function(assert) {
        // arrange, act
        const dataGrid = $('#dataGrid').css('maxHeight', '100.2px').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            columns: ['field1']
        }).dxDataGrid('instance');

        // assert
        const scrollable = dataGrid.getScrollable();
        assert.ok(scrollable, 'scrollable is created');
        assert.ok(scrollable.$content().height() > scrollable._container().height(), 'scroll is exists');
    });

    // T820186
    QUnit.test('width 100% should be applied if container width is zero on render', function(assert) {
        // arrange
        $('#dataGrid').parent().width(0);
        $('#dataGrid').dxDataGrid({
            width: '100%',
            dataSource: [],
            columns: [
                { dataField: 'field1', width: 100 },
                { dataField: 'field2', width: 100 }
            ]
        });

        // act
        $('#dataGrid').parent().width(300);
        this.clock.tick();

        // assert
        assert.equal($('#dataGrid').width(), 300, 'width 100% is applied');
    });

    QUnit.test('height from style after updateDimensions when rendering to container without height', function(assert) {
        // arrange
        // act
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        }).dxDataGrid('instance');

        // act
        $('#dataGrid').css('height', 300);
        dataGrid.updateDimensions();

        // assert
        assert.equal($('#dataGrid').find('.dx-datagrid').height(), 300);
    });

    // T391169
    // T429504
    QUnit.test('min-height from styles when showBorders true', function(assert) {


        const $dataGrid = $('#dataGrid').css('min-height', 200).dxDataGrid({
            showBorders: true,
            dataSource: [{}],
            pager: {
                visible: true
            },
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        this.clock.tick();

        const firstRenderHeight = $dataGrid.height();

        // act
        dataGrid.updateDimensions();

        // assert
        assert.roughEqual($dataGrid.height(), firstRenderHeight, 1.01, 'height is not changed');
        assert.roughEqual($dataGrid.height(), 200, 1.01, 'height is equal min-height');
    });

    // T450683
    QUnit.test('rowsview height should not be reseted during updateDimension when min-height/max-height are not specified', function(assert) {
        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            showBorders: true,
            loadingTimeout: undefined,
            dataSource: [{}],
            pager: {
                visible: true
            },
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');
        const rowsView = dataGrid.getView('rowsView');

        sinon.spy(rowsView, 'height');

        // act
        dataGrid.updateDimensions();

        // assert
        const heightCalls = rowsView.height.getCalls().filter(function(call) { return call.args.length > 0; });
        assert.equal(heightCalls.length, 1, 'rowsview height is assigned once');
    });

    // T108204
    QUnit.test('resize on change visibility', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').hide().dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });


        // act
        $dataGrid.show();
        $($dataGrid).trigger('dxshown');

        // assert
        assert.equal($dataGrid.find('.dx-datagrid-nodata').length, 1, 'nodata text is shown');
    });

    QUnit.test('Height of Data grid is not changed when allowResizing is false and allowReordering is true', function(assert) {
        // arrange, act
        const testElement = $('#dataGrid').height(600);
        const $dataGrid = testElement.dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            dataSource: [],
            columns: [
                { dataField: 'field1', allowReordering: true },
                { dataField: 'field2', allowReordering: true },
                { dataField: 'field3', allowReordering: true },
                { dataField: 'field4' }
            ]
        });

        // assert
        assert.equal(Math.round($dataGrid.find('.dx-datagrid-rowsview').parent().height()), 600, 'height of datagrid');
    });

    // T144297
    QUnit.test('columns width when all columns have width and dataGrid width auto', function(assert) {
        // arrange, act
        $('#container').width(300);

        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}, {}, {}, {}],
            searchPanel: {
                visible: true
            },
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 },
                { dataField: 'field4', width: 50 }
            ]
        });

        // assert
        assert.equal($dataGrid.width(), 200);
        assert.equal($dataGrid.find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 50);

        // act
        $('#container').width(100);

        // assert
        assert.equal($dataGrid.width(), 100);
    });

    // T618230
    QUnit.test('last column with disabled allowResizing should not change width if all columns have width less grid\'s width', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 },
                { dataField: 'field4', width: 50, allowResizing: false }
            ]
        });

        // assert
        assert.equal($dataGrid.find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 50, 'last column have correct width');
        assert.equal($dataGrid.find('.dx-row').first().find('td').last().prev()[0].getBoundingClientRect().width, 250, 'previuos last column have correct width');
    });

    // T387828
    QUnit.test('columns width when all columns have width and dataGrid with fixed width', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 300,
            loadingTimeout: undefined,
            dataSource: [{ field1: '1', field2: '2', field3: '3', field4: '4' }]
        });
        const dataGridInstance = $dataGrid.dxDataGrid('instance');

        // act
        dataGridInstance.option('columns', [
            { dataField: 'field1', width: 50 },
            { dataField: 'field2', width: 50 },
            { dataField: 'field3', width: 50 },
            { dataField: 'field4', width: 50 }
        ]);

        // assert
        assert.equal($dataGrid.width(), 300);
        assert.equal($dataGrid.find('.dx-row').first().find('td').last().outerWidth(), 150);
    });

    // T332448
    QUnit.test('columns width when all columns have width and dataGrid width auto and showBorders enabled', function(assert) {
        // arrange, act
        $('#container').width(300);

        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            showBorders: true,
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}, {}, {}, {}],
            searchPanel: {
                visible: true
            },
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 },
                { dataField: 'field4', width: 50 }
            ]
        });

        // assert
        assert.equal($dataGrid.width(), 202);
        assert.equal($dataGrid.find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 50);
    });

    // T154611
    QUnit.test('max-width style property must be work for grid', function(assert) {
        // arrange, act
        $('#dataGrid').css('max-width', 200);
        $('#container').width(300);

        const $dataGrid = $('#dataGrid').dxDataGrid({
            columns: [
                { dataField: 'field1' },
                { dataField: 'field2' },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });

        // assert
        assert.equal($dataGrid.width(), 200);
        assert.equal($dataGrid.find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 50);

        // act
        $('#container').width(100);

        // assert
        assert.equal($dataGrid.width(), 100);
        assert.equal($dataGrid.find('.dx-row').first().find('td')[0].getBoundingClientRect().width, 25);
    });

    // T144297
    QUnit.test('columns width when all columns have width, one column width in percent format and dataGrid width is auto', function(assert) {
        // arrange, act
        $('#container').width(400);

        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}, {}, {}, {}],
            searchPanel: {
                visible: true
            },
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: '25%' },
                { dataField: 'field3', width: 50 },
                { dataField: 'field4', width: 50 }
            ]
        });

        // assert
        assert.equal($dataGrid.width(), 400);
        assert.equal($dataGrid.find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 200);

        // act
        $('#container').width(200);

        // assert
        assert.equal($dataGrid.width(), 200);
        assert.equal($dataGrid.find('.dx-row').first().find('td').last()[0].getBoundingClientRect().width, 50);
    });

    // T958665
    QUnit.test('The column width with specified minWidth should be correct after resizing when it is given in percent', function(assert) {
        // arrange, act
        $('#container').width(400);

        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 200,
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}, {}, {}, {}],
            searchPanel: {
                visible: true
            },
            columns: [
                { dataField: 'field1', width: '40%', minWidth: 50 },
                { dataField: 'field2', width: '60%' },
                { dataField: 'field3', width: 50 },
                { dataField: 'field4', width: 50 }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // assert
        assert.equal($dataGrid.width(), 400);
        assert.equal($dataGrid.find('.dx-row').first().find('td').first()[0].getBoundingClientRect().width, 120);

        // act
        $('#container').width(350);
        dataGrid.updateDimensions();

        // assert
        assert.equal($dataGrid.width(), 350);
        assert.equal($dataGrid.find('.dx-row').first().find('td').first()[0].getBoundingClientRect().width, 100);

        // act
        $('#container').width(200);
        dataGrid.updateDimensions();

        // assert
        assert.equal($dataGrid.width(), 200);
        assert.equal($dataGrid.find('.dx-row').first().find('td').first()[0].getBoundingClientRect().width, 50);
    });

    // T983067
    QUnit.test('Column width should be correct after resizing if it is specified and other columns have percent width', function(assert) {
        // arrange, act
        $('#container').width(400);

        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [
                { dataField: 'field1', width: '15%' },
                { dataField: 'field2', width: '30%' },
                { dataField: 'field3', width: '50%' },
                { dataField: 'field4', width: 125 }
            ],
            showBorders: true
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        // assert
        assert.equal($(dataGrid.getCellElement(0, 3)).outerWidth(), 125, 'last column width');
    });

    // T983067
    QUnit.test('Column width should be correct after resizing if it is specified and other columns have percent width (zoom 150%)', function(assert) {
        // arrange, act
        $('#container').css('zoom', 1.5);
        $('#container').width(603.333);

        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: [{}],
            columns: [
                { dataField: 'field1', width: '15%' },
                { dataField: 'field2', width: '30%' },
                { dataField: 'field3', width: '50%' },
                { dataField: 'field4', width: 125 }
            ],
            showBorders: true
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        dataGrid.updateDimensions();

        // assert
        assert.roughEqual($(dataGrid.getCellElement(0, 3)).outerWidth(), 125, 0.51, 'last column width');
    });

    QUnit.test('cell content with auto width should not be wrapper to second line on zoom (T998665)', function(assert) {
        if($.fn.jquery.split('.')[0] === '2') {
            assert.ok(true, 'test is not actual for jquery 2');
            return;
        }
        // arrange, act
        const dataGrid = $('#dataGrid').dxDataGrid({
            height: 70,
            loadingTimeout: null,
            dataSource: [{
                'Zipcode': 90013,
                Employee: 'You have not been granted permission to edit the following fields on this item: Risk Owner'
            }, {
                'Zipcode': 90014,
                Employee: 'You have not been granted permission to edit the following fields on this item: Risk Owner'
            }],
            showBorders: true,
            wordWrapEnabled: true,
            scrolling: {
                useNative: true
            },
            columns: [{
                dataField: 'Zipcode',
                width: 'auto'
            }, {
                dataField: 'Employee',
                width: 'auto'
            }]
        }).dxDataGrid('instance');

        // act
        $('#container').css('zoom', 0.9);
        dataGrid.updateDimensions(true);

        // assert
        assert.ok($(dataGrid.getCellElement(0, 1)).height() < 35, 'cell content is not wrapperd');
    });

    QUnit.test('dimensions should be updated on browser zoom (T998665)', function(assert) {
        if(browser.msie) {
            assert.ok(true, 'It is not possible to modify devicePixelRatio in IE 11');
            return;
        }
        const window = getWindow();
        const originalDevicePixelRatio = window.devicePixelRatio;

        window.devicePixelRatio = 1;

        // arrange, act
        const dataGrid = $('#dataGrid').dxDataGrid({
        }).dxDataGrid('instance');
        sinon.spy(dataGrid.getController('resizing'), '_updateDimensionsCore');

        window.devicePixelRatio = 1.5;
        resizeCallbacks.fire();

        // assert
        assert.ok(dataGrid.getController('resizing')._updateDimensionsCore.calledOnce, '_updateDimensionsCore is called');

        window.devicePixelRatio = originalDevicePixelRatio;
    });

    // T344125
    QUnit.test('column width does not changed after changing grid\'s width when columnAutoWidth enabled', function(assert) {
        // arrange, act
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 100,
            loadingTimeout: undefined,
            wordWrapEnabled: true,
            columnAutoWidth: true,
            dataSource: [{ field1: '', field2: 'Big big big big big big big big big big big text' }],
            columns: [
                { dataField: 'field1', caption: 'Big_big_big_big_big_big_big_big_big_big_big caption' },
                { dataField: 'field2', caption: '' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');

        const widths = $dataGrid.find('.dx-data-row > td').map(function() { return Math.floor($(this).width()); }).get().join(',');

        // act
        dataGrid.option('width', 200);
        dataGrid.updateDimensions();

        // assert
        const newWidths = $dataGrid.find('.dx-data-row > td').map(function() { return Math.floor($(this).width()); }).get().join(',');

        assert.equal(widths, newWidths, 'widths are not changed');
    });

    QUnit.test('Correct calculate height of the grid when wordWrapEnabled is true (T443257)', function(assert) {
        // arrange, act
        const $dataGridElement = $('#dataGrid').dxDataGrid({
            height: 300,
            loadingTimeout: undefined,
            wordWrapEnabled: true,
            columnAutoWidth: true,
            dataSource: [{ field1: '', field2: 'Big big big big big big big text' }],
            columns: [
                { dataField: 'field1', caption: 'Big big big big big big big big big big big caption', width: 300 },
                { dataField: 'field2', caption: '' }
            ]
        });

        // assert
        assert.equal(Math.round($dataGridElement.children('.dx-datagrid').outerHeight()), 300, 'correct height of the grid');
    });


    QUnit.test('Check sum of views height in grid', function(assert) {
        // arrange
        function generateDataSource(count) {
            const result = [];

            for(let i = 0; i < count; ++i) {
                result.push({ firstName: 'test name' + i, lastName: 'tst' + i, room: 100 + i, cash: 101 + i * 10 });
            }

            return result;
        }

        const $container = $('#dataGrid').dxDataGrid({
            width: 470,
            height: 400,
            dataSource: generateDataSource(20),
            columnAutoWidth: true, // T406965
            filterRow: {
                visible: true // T406965
            },
            pager: {
                visible: true
            },
            searchPanel: {
                visible: true
            },
            loadingTimeout: null,
            summary: {
                totalItems: [
                    { column: 'firstName', summaryType: 'count' },
                    { column: 'cash', summaryType: 'sum' }
                ]
            },
            columns: [{ dataField: 'firstName' }, { dataField: 'lastName' }, { dataField: 'room' }, { dataField: 'cash' }]
        });
        const $dataGrid = $container.find('.dx-datagrid');

        // act
        const resultHeight = $container.outerHeight() - $dataGrid.outerHeight();

        // assert
        assert.ok(resultHeight >= 0 && resultHeight <= 2, 'result height');
    });

    QUnit.test('command column widths calculated from styles', function(assert) {
        // arrange
        // act
        const $dataGrid = $('#dataGridWithStyle').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: {
                store: [{ field1: '1', field2: '2', field3: '3', field4: '4', field5: '5' }]
            },
            selection: { mode: 'multiple' },
            editing: { allowUpdating: true },
            columns: ['field1', 'field2', { dataField: 'field3', groupIndex: 0 }]
        });

        // assert
        const cols = $dataGrid.find('colgroup').first().children();

        assert.ok(Math.abs(70 - cols.eq(0).width()) <= 1, 'select column width');
        assert.ok(Math.abs(30 - cols.eq(1).width()) <= 1, 'grouped column width');
        assert.ok(Math.abs(100 - cols.eq(cols.length - 1).width()) <= 1, 'edit column width');
    });
});

QUnit.module('API Methods', baseModuleConfig, () => {

    // T590907
    QUnit.test('Change column width via option method', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: 'column1', width: 100 }, { dataField: 'column2', width: 100 }]
        }).dxDataGrid('instance');

        // act
        dataGrid.option('columns[0].width', 1);

        // assert
        assert.strictEqual(dataGrid.$element().width(), 101);
        assert.strictEqual(dataGrid.columnOption(0, 'visibleWidth'), 1);
        assert.strictEqual(dataGrid.columnOption(1, 'visibleWidth'), 'auto');
    });

    QUnit.test('Change column width via columnOption method (T628065)', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: 'column1', width: 100 }, { dataField: 'column2', width: 100 }]
        }).dxDataGrid('instance');

        // act
        dataGrid.beginUpdate();
        dataGrid.columnOption(0, 'width', 1);
        dataGrid.endUpdate();

        // assert
        assert.strictEqual(dataGrid.$element().width(), 101);
        assert.strictEqual(dataGrid.columnOption(0, 'visibleWidth'), 1);
        assert.strictEqual(dataGrid.columnOption(1, 'visibleWidth'), 'auto');
    });

    // T172125
    QUnit.test('resize when all columns have width', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 }
            ],
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2, field3: 3 }]
        });

        // assert
        assert.equal($(dataGrid.$element()).width(), 150, 'total width');

        // act
        dataGrid.resize();

        // assert
        assert.equal($(dataGrid.$element()).width(), 150, 'total width after resize');
    });

    // T335767
    QUnit.test('skip columns synchronization on window resize when grid size is not changed', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 }
            ],
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2, field3: 3 }]
        });

        sinon.spy(dataGrid.getController('resizing'), '_synchronizeColumns');

        // act
        dataGrid._dimensionChanged();

        // assert
        assert.equal(dataGrid.getController('resizing')._synchronizeColumns.callCount, 0, 'synchronizeColumns is not called');


        // act
        $(dataGrid.$element()).height(500);
        dataGrid._dimensionChanged();

        // assert
        assert.equal(dataGrid.getController('resizing')._synchronizeColumns.callCount, 1, 'synchronizeColumns is called');
    });

    // T372519
    QUnit.test('rowsView height is not changed on window resize when grid container is not visible', function(assert) {
        // arrange, act

        const dataGrid = createDataGrid({
            height: 500,
            columns: [
                { dataField: 'field1', width: 50 },
                { dataField: 'field2', width: 50 },
                { dataField: 'field3', width: 50 }
            ],
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2, field3: 3 }]
        });

        const rowsViewHeight = $('#dataGrid .dx-datagrid-rowsview').height();

        sinon.spy(dataGrid.getController('resizing'), '_synchronizeColumns');

        // act
        $('#qunit-fixture').hide();
        dataGrid._dimensionChanged();
        $('#qunit-fixture').show();

        // assert
        assert.equal(dataGrid.getController('resizing')._synchronizeColumns.callCount, 0, 'synchronizeColumns is not called');
        assert.equal($('#dataGrid .dx-datagrid-rowsview').height(), rowsViewHeight, 'rowsView height is not changed');
    });


    // T494138
    QUnit.test('Change expand column width in onInitialized', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            loadingTimeout: undefined,
            onInitialized: function(e) {
                e.component.columnOption('command:expand', 'width', 15);
            },
            masterDetail: {
                enabled: true
            },
            dataSource: [{ id: 1111 }]
        });

        // assert
        const $commandColumnCells = $($(dataGrid.$element()).find('.dx-command-expand'));
        assert.equal($commandColumnCells.eq(0).width(), 15, 'expand command column width');
    });


    // T829029
    QUnit.test('Change columnWidth via option method', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ field1: 1, field2: 2, field3: 3 }],
            columnWidth: 50,
            loadingTimeout: undefined
        });

        // act
        dataGrid.option('columnWidth', 200);

        // assert
        const columns = dataGrid.getVisibleColumns();
        assert.strictEqual(columns[0].width, 200, 'width of the first column');
        assert.strictEqual(columns[1].width, 200, 'width of the second column');
        assert.strictEqual(columns[2].width, 200, 'width of the third column');
    });
});

QUnit.module('columnWidth auto option', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        $('#dataGrid').css('width', 350);
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    QUnit.test('Check table params without columnWidth auto', function(assert) {
        $('#dataGrid').dxDataGrid({
            width: 350,
            loadingTimeout: undefined,
            dataSource: [
                { firstField: 'Alex_', lastField: 'Ziborov_', room: 903 },
                { firstField: 'Alex_', lastField: 'Ziborov_', room: 903 }
            ],
            columns: [{
                dataField: 'firstField', cellTemplate: function(container, options) {
                    $(container).append($('<div>'));
                }
            }, {
                dataField: 'lastField', cellTemplate: function(container, options) {
                    $(container).append($('<div>', { css: { width: 150 } }));
                }
            }],
            columnWidth: undefined
        });

        const cells = $('#dataGrid').find('.dx-datagrid-headers').find('td');

        assert.strictEqual(cells[0].getBoundingClientRect().width, 175, 'valid cell width');
        assert.strictEqual(cells[1].getBoundingClientRect().width, 175, 'valid cell width');
    });

    QUnit.test('Check table params with columnWidth auto', function(assert) {
        const dataSource = {
            store: [{ firstField: 'Alex_', lastField: 'Ziborov_', room: 903 },
                { firstField: 'Alex_', lastField: 'Ziborov_', room: 903 }]
        };

        $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: [{
                dataField: 'firstField', cellTemplate: function(container, options) {
                    $(container).append($('<div>'));
                }
            }, {
                dataField: 'lastField', cellTemplate: function(container, options) {
                    $(container).append($('<div>', { css: { width: 200 } }));
                }
            }],
            columnAutoWidth: true
        });

        const firstColumnWidth = $($('#dataGrid').find('.dx-datagrid-headers').find('td')[0]).width();
        const secondColumnWidth = $($('#dataGrid').find('.dx-datagrid-headers').find('td')[1]).width();

        assert.ok(secondColumnWidth > 2 * firstColumnWidth, 'second column width more then first');
    });

    QUnit.test('Check table params with set width', function(assert) {
        const dataSource = {
            store: [{ firstField: 'Alex_', lastField: 'Ziborov_', room: 903 },
                { firstField: 'Alex_', lastField: 'Ziborov_', room: 903 }]
        };

        $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: dataSource,
            columns: [{
                dataField: 'firstField', width: '120px', cellTemplate: function(container, options) {
                    $(container).append($('<div>'));
                }
            }, {
                dataField: 'lastField', cellTemplate: function(container, options) {
                    $(container).append($('<div>', { css: { width: 200 } }));
                }
            }],
            columnAutoWidth: true
        });

        assert.strictEqual($('#dataGrid').find('.dx-datagrid-headers').find('td')[0].getBoundingClientRect().width, 120, 'valid cell width');
        assert.strictEqual($('#dataGrid').find('.dx-datagrid-headers').find('td')[1].getBoundingClientRect().width, 230, 'valid cell width');
    });

    // T113233
    QUnit.test('Check cell width paddings', function(assert) {
        $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            sorting: {
                mode: 'none'
            },
            columns: [{
                dataField: 'field1', width: 400
            }, {
                dataField: 'emptyField', cellTemplate: function() { }, headerCellTemplate: function() { }
            }],
            columnAutoWidth: true
        });
        const $cells = $('#dataGrid').find('.dx-datagrid-headers').find('td');
        assert.strictEqual($cells[0].getBoundingClientRect().width, 400, 'valid cell width');

        const emptyCellWidth = $cells.eq(1).outerWidth();
        assert.ok(emptyCellWidth >= 7 && emptyCellWidth < 20, 'empty cell width with paddings');
    });

    // T198380
    QUnit.test('columnAutoWidth when table with one row in safari', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ field1: 'small', field2: 'bigbigbigbigbigbigbigbigbigbig' }],
            columnAutoWidth: true
        }).dxDataGrid('instance');

        const visibleWidth1 = dataGrid.columnOption('field1', 'visibleWidth');
        const visibleWidth2 = dataGrid.columnOption('field2', 'visibleWidth');

        assert.ok(visibleWidth1, 'first width defined');
        assert.ok(visibleWidth2, 'second width defined');
        assert.ok(visibleWidth2 > 2 * visibleWidth1, 'second column width more then first');
    });

    QUnit.test('column with width auto should have minimum size by content (T654427)', function(assert) {
        const CONTENT_WIDTH = 50;
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2 }],
            columnAutoWidth: true,
            columns: [{
                dataField: 'field1'
            }, {
                dataField: 'field2'
            }, {
                width: 'auto',
                cellTemplate: function(container) {
                    $(container).css('padding', 0);
                    $('<div>').css('width', CONTENT_WIDTH).appendTo(container);
                }
            }]
        }).dxDataGrid('instance');

        assert.roughEqual($(dataGrid.getCellElement(0, 2)).width(), CONTENT_WIDTH, 1.01, 'last column width by content');
    });

    // T709106
    QUnit.test('column widths if all columns have width auto and columnAutoWidth is true', function(assert) {
        // act
        const dataGrid = $('#dataGrid').css('width', '').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            columnAutoWidth: true,
            columns: [{
                dataField: 'a',
                width: 'auto'
            }, {
                dataField: 'a',
                width: 'auto'
            }]
        }).dxDataGrid('instance');

        // assert
        assert.roughEqual($(dataGrid.getCellElement(0, 0)).outerWidth(), $(dataGrid.getCellElement(0, 1)).outerWidth(), 1.01, 'first and second column widths are equals');
    });

    QUnit.test('column with width auto should have minimum size by content if columnAutoWidth is disabled (T672282)', function(assert) {
        const CONTENT_WIDTH = 50;
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            dataSource: [{ field1: 1, field2: 2 }],
            columns: [{
                dataField: 'field1'
            }, {
                dataField: 'field2'
            }, {
                width: 'auto',
                cellTemplate: function(container) {
                    $(container).css('padding', 0);
                    $('<div>').css('width', CONTENT_WIDTH).appendTo(container);
                }
            }]
        }).dxDataGrid('instance');


        assert.roughEqual($(dataGrid.getCellElement(0, 2)).width(), CONTENT_WIDTH, 1.01, 'last column width by content');
    });

    QUnit.test('column with width 0 should be applied', function(assert) {
        if(browser.safari || (browser.msie && parseInt(browser.version) <= 11)) {
            assert.ok(true, 'IE 11 and Safari works wrong with width 0');
            return;
        }
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 200,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{
                dataField: 'field1'
            }, {
                dataField: 'field2'
            }, {
                dataField: 'field3',
                width: 0
            }]
        }).dxDataGrid('instance');


        assert.strictEqual($(dataGrid.getCellElement(0, 0)).get(0).offsetWidth, 100, 'first column width');
        assert.strictEqual($(dataGrid.getCellElement(0, 2)).get(0).offsetWidth, 0, 'last column width');
    });

    QUnit.test('column with width 0 should be ignored if all column widths are defined', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 200,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{
                dataField: 'field1',
                width: 50
            }, {
                dataField: 'field2',
                width: 50
            }, {
                dataField: 'field3',
                width: 0
            }]
        }).dxDataGrid('instance');


        assert.strictEqual($(dataGrid.getCellElement(0, 0)).get(0).offsetWidth, 50, 'first column width');
        assert.strictEqual($(dataGrid.getCellElement(0, 2)).get(0).offsetWidth, 100, 'last column width');
    });
});
