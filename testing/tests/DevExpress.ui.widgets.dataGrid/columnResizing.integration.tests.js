QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(gridMarkup);
});

import $ from 'jquery';
import commonUtils from 'core/utils/common';
import { baseModuleConfig } from '../../helpers/dataGridHelper.js';


QUnit.module('Column Resizing', baseModuleConfig, () => {
    QUnit.test('Resize columns', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 470,
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
            commonColumnSettings: {
                allowResizing: true
            },
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}],
            columns: [{ dataField: 'firstName', width: 100 }, { dataField: 'lastName', width: 100 }, { dataField: 'room', width: 100 }, { dataField: 'birthDay', width: 100 }]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 1 };
        resizeController._setupResizingInfo(-9830);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9780,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        const headersCols = $('.dx-datagrid-headers' + ' col');
        const rowsCols = $('.dx-datagrid-rowsview col');
        assert.equal($(headersCols[1]).css('width'), '150px', 'width of two column - headers view');
        assert.equal($(headersCols[2]).css('width'), '50px', 'width of three column - headers view');
        assert.equal($(rowsCols[1]).css('width'), '150px', 'width of two column - rows view');
        assert.equal($(rowsCols[2]).css('width'), '50px', 'width of three column - rows view');
    });

    // T804582
    QUnit.test('Cursor should switch style when it was moved to columns separator if grid has only one row and big header panel', function(assert) {
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{}],
            allowColumnResizing: true,
            columnChooser: {
                enabled: true
            },
            columns: ['field1', 'field2']
        });
        const headerPanel = dataGrid.find('.dx-datagrid-header-panel');
        const columnsSeparator = dataGrid.find('.dx-datagrid-columns-separator');

        headerPanel.outerHeight('70px', true);

        columnsSeparator.trigger($.Event('dxpointermove', {
            data: {
                _isResizing: false,
            },
            pageY: columnsSeparator.offset().top + headerPanel.outerHeight() + 1,
            pageX: columnsSeparator.offset().left + dataGrid.width() / 2
        }));

        assert.equal(columnsSeparator.css('cursor'), 'col-resize', 'cursor style');
    });

    // T846832
    QUnit.test('Columns should not shake during resizing', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            dataSource: [{}],
            loadingTimeout: undefined,
            columns: ['CompanyName', 'City', 'State', 'Phone', 'Fax'],
            showBorders: true,
            allowColumnResizing: true
        });
        const instance = dataGrid.dxDataGrid('instance');
        const widths = [];
        const offset = $('#dataGrid').offset();

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 1 };

        resizeController._startResizing({
            event: {
                data: resizeController,
                type: 'touchstart',
                pageX: offset.left + 200,
                pageY: offset.top + 15,
                preventDefault: function() { },
                stopPropagation: function() { }
            }
        });

        resizeController._moveSeparator({
            event: {
                data: resizeController,
                pageX: offset.left + 50,
                preventDefault: commonUtils.noop
            }
        });

        resizeController._endResizing({
            event: {
                data: resizeController
            }
        });

        // assert
        let $cells = $('#dataGrid').find('td');

        assert.roughEqual($cells.eq(0).width(), 34, 1.01, 'first column width');
        assert.roughEqual($cells.eq(1).width(), 333, 1.01, 'second column width');

        for(let i = 0; i < 5; i++) {
            widths.push($('#dataGrid').find('td').eq(i).width());
        }

        // act
        resizeController._startResizing({
            event: {
                data: resizeController,
                type: 'touchstart',
                pageX: offset.left + 50,
                pageY: offset.top + 15,
                preventDefault: function() { },
                stopPropagation: function() { }
            }
        });

        resizeController._moveSeparator({
            event: {
                type: 'dxpointermove',
                data: resizeController,
                pageX: offset.left + 51,
                preventDefault: commonUtils.noop
            }
        });

        resizeController._endResizing({
            event: {
                data: resizeController
            }
        });

        // assert
        $cells = $('#dataGrid').find('td');

        assert.equal($cells.eq(0).width(), widths[0] + 1, 'first column width');
        assert.equal($cells.eq(1).width(), widths[1] - 1, 'second column width');

        for(let i = 2; i < 5; i++) {
            assert.equal($cells.eq(i).width(), widths[i], 'width was not affected');
        }
    });

    // T527538
    QUnit.test('Grid\'s height should be updated during column resizing if column headers height is changed', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').dxDataGrid({
            height: 300,
            wordWrapEnabled: true,
            allowColumnResizing: true,
            loadingTimeout: undefined,
            dataSource: [{}],
            columns: [{ dataField: 'firstName', width: 100 }, { dataField: 'lastName', width: 100 }]
        });
        const instance = $dataGrid.dxDataGrid('instance');

        const columnHeadersViewHeight = instance.getView('columnHeadersView').getHeight();

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };
        resizeController._setupResizingInfo(-9900);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9970,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.ok(instance.getView('columnHeadersView').getHeight() > columnHeadersViewHeight, 'column headers height is changed');
        assert.equal($dataGrid.children().height(), 300, 'widget\'s height is not changed');
        assert.equal(instance.columnOption(0, 'width'), 30, 'column 0 width');
        assert.equal(instance.columnOption(1, 'width'), 170, 'column 1 width');
    });

    // T356865
    QUnit.test('Resize grid after column resizing', function(assert) {
        $('#container').width(200);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['firstName', 'lastName']
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        resizeController._setupResizingInfo(-9900);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9880,
                preventDefault: commonUtils.noop
            }
        });

        $('#container').width(400);
        instance.updateDimensions();

        // assert
        assert.strictEqual(instance.$element().width(), 400);
        assert.strictEqual(instance.columnOption(0, 'width'), '60.000%');
        assert.strictEqual(instance.columnOption(1, 'width'), '40.000%');

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 2);
            assert.strictEqual(headersCols[0].style.width, '60%');
            assert.strictEqual(headersCols[1].style.width, '40%');
        }
    });

    QUnit.test('Resize grid after column resizing when adaptColumnWidthByRatio false', function(assert) {
        $('#container').width(200);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            adaptColumnWidthByRatio: false,
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['firstName', 'lastName']
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        resizeController._setupResizingInfo(-9900);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9880,
                preventDefault: commonUtils.noop
            }
        });

        $('#container').width(400);
        instance.updateDimensions();

        // assert
        assert.strictEqual(instance.$element().width(), 200);
        assert.strictEqual(instance.columnOption(0, 'width'), 120);
        assert.strictEqual(instance.columnOption(1, 'width'), 80);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 2);
            assert.strictEqual(headersCols[0].style.width, '120px');
            assert.strictEqual(headersCols[1].style.width, 'auto');
        }

    });

    QUnit.test('Resize grid after column resizing to left when columnResizingMode is widget', function(assert) {
        $('#container').width(300);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['firstName', 'lastName', 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({ // T881314
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition - 20,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.strictEqual(instance.$element().children().width(), 280);
        assert.strictEqual(instance.columnOption(0, 'width'), 80);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);
        assert.strictEqual(instance.columnOption(2, 'width'), 100);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 3);
            assert.strictEqual(headersCols[0].style.width, '80px');
            assert.strictEqual(headersCols[1].style.width, '100px');
            assert.strictEqual(headersCols[2].style.width, 'auto');
        }
    });

    // T649906
    QUnit.test('Last column width should be reseted during column resizing to left when columnResizingMode is widget', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['id', 'firstName', 'lastName', { dataField: 'age', allowResizing: false }]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition - 20,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.strictEqual(instance.columnOption(0, 'width'), 80);
        assert.strictEqual(instance.columnOption(0, 'visibleWidth'), 80);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);
        assert.strictEqual(instance.columnOption(1, 'visibleWidth'), 100);
        assert.strictEqual(instance.columnOption(2, 'width'), 100);
        assert.strictEqual(instance.columnOption(2, 'visibleWidth'), 'auto');
        assert.strictEqual(instance.columnOption(3, 'width'), 100);
        assert.strictEqual(instance.columnOption(3, 'visibleWidth'), 100);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 4);
            assert.strictEqual(headersCols[0].style.width, '80px');
            assert.strictEqual(headersCols[1].style.width, '100px');
            assert.strictEqual(headersCols[2].style.width, 'auto');
            assert.strictEqual(headersCols[3].style.width, '100px');
        }
    });

    // T649906
    QUnit.test('Last column width should not be reseted during column resizing to right when columnResizingMode is widget', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 400,
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['id', 'firstName', 'lastName', { dataField: 'age', allowResizing: false }]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition + 20,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.strictEqual(instance.columnOption(0, 'width'), 120);
        assert.strictEqual(instance.columnOption(0, 'visibleWidth'), undefined);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);
        assert.strictEqual(instance.columnOption(1, 'visibleWidth'), undefined);
        assert.strictEqual(instance.columnOption(2, 'width'), 100);
        assert.strictEqual(instance.columnOption(2, 'visibleWidth'), undefined);
        assert.strictEqual(instance.columnOption(3, 'width'), 100);
        assert.strictEqual(instance.columnOption(3, 'visibleWidth'), undefined);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 4);
            assert.strictEqual(headersCols[0].style.width, '120px');
            assert.strictEqual(headersCols[1].style.width, '100px');
            assert.strictEqual(headersCols[2].style.width, '100px');
            assert.strictEqual(headersCols[3].style.width, '100px');
        }
    });

    QUnit.test('Resize grid after column resizing to left when columnResizingMode is widget and minWidth is assigned', function(assert) {
        $('#container').width(300);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: [{ dataField: 'firstName', minWidth: 50 }, 'lastName', 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition - 50,
                preventDefault: commonUtils.noop
            }
        });
        resizeController._moveSeparator({ // T881314
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition - 60,
                preventDefault: commonUtils.noop
            }
        });


        // assert
        assert.strictEqual(instance.$element().children().width(), 250);
        assert.strictEqual(instance.columnOption(0, 'width'), 50);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);
        assert.strictEqual(instance.columnOption(2, 'width'), 100);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 3);
            assert.strictEqual(headersCols[0].style.width, '50px');
            assert.strictEqual(headersCols[1].style.width, '100px');
            assert.strictEqual(headersCols[2].style.width, 'auto');
        }
    });

    QUnit.test('Resize grid after column resizing to left when columnResizingMode is nextColumn and minWidth is assigned', function(assert) {
        $('#container').width(200);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: 'nextColumn',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['firstName', { dataField: 'lastName', minWidth: 50 }]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition + 50,
                preventDefault: commonUtils.noop
            }
        });
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition + 60,
                preventDefault: commonUtils.noop
            }
        });

        instance.updateDimensions();

        // assert
        assert.strictEqual(instance.$element().children().width(), 200);
        assert.strictEqual(instance.columnOption(0, 'width'), '75.000%');
        assert.strictEqual(instance.columnOption(1, 'width'), '25.000%');

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 2);
            assert.strictEqual(headersCols[0].style.width, '75%');
            assert.strictEqual(headersCols[1].style.width, '25%');
        }
    });

    // T670844
    QUnit.test('Resize column if all columns have percent widths and columnResizingMode is nextColumn', function(assert) {
        $('#container').width(200);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: 'nextColumn',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: [
                { dataField: 'field1', width: '50%' },
                { dataField: 'field2', width: '50%' },
                { dataField: 'field3', width: '50%' },
                { dataField: 'field4', width: '50%' }
            ]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition + 25,
                preventDefault: commonUtils.noop
            }
        });

        instance.updateDimensions();

        // assert
        assert.strictEqual(instance.$element().children().width(), 200);
        assert.strictEqual(instance.columnOption(0, 'width'), '75.000%');
        assert.strictEqual(instance.columnOption(1, 'width'), '25.000%');

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 4);
            assert.strictEqual(headersCols[0].style.width, '75%');
            assert.strictEqual(headersCols[1].style.width, '25%');
        }
    });

    QUnit.test('Resize grid after column resizing to left when columnResizingMode is widget and grid\'s width is 100%', function(assert) {
        $('#container').width(300);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: '100%',
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['firstName', 'lastName', 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({ // T881314
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition - 20,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.strictEqual(instance.$element().children().width(), 300);
        assert.strictEqual(instance.columnOption(0, 'width'), 80);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);
        assert.strictEqual(instance.columnOption(2, 'width'), 100);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 3);
            assert.strictEqual(headersCols[0].style.width, '80px');
            assert.strictEqual(headersCols[1].style.width, '100px');
            assert.strictEqual(headersCols[2].style.width, 'auto');
        }
    });

    QUnit.test('Resize grid after column resizing to right when columnResizingMode is widget', function(assert) {
        $('#container').width(300);
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnResizingMode: 'widget',
            allowColumnResizing: true,
            dataSource: [{}],
            columns: ['firstName', 'lastName', 'age']
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };

        const startPosition = -9900;
        resizeController._setupResizingInfo(startPosition);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: startPosition + 120,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        assert.strictEqual(instance.$element().children().width(), 300);
        assert.strictEqual(instance.columnOption(0, 'width'), 220);
        assert.strictEqual(instance.columnOption(1, 'width'), 100);
        assert.strictEqual(instance.columnOption(2, 'width'), 100);

        const colGroups = $('.dx-datagrid colgroup');
        assert.strictEqual(colGroups.length, 2);

        for(let i = 0; i < colGroups.length; i++) {
            const headersCols = colGroups.eq(i).find('col');

            assert.strictEqual(headersCols.length, 3);
            assert.strictEqual(headersCols[0].style.width, '220px');
            assert.strictEqual(headersCols[1].style.width, '100px');
            assert.strictEqual(headersCols[2].style.width, '100px');
        }
    });

    QUnit.test('Resize command column', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            width: 470,
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
            commonColumnSettings: {
                allowResizing: true
            },
            loadingTimeout: undefined,
            dataSource: [{}, {}, {}, {}],
            columns: [{ type: 'selection' }, { dataField: 'firstName', width: 100 }, { dataField: 'lastName', width: 100 }, { dataField: 'room', width: 100 }, { dataField: 'birthDay', width: 100 }]
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        const resizeController = instance.getController('columnsResizer');
        resizeController._isResizing = true;
        resizeController._targetPoint = { columnIndex: 0 };
        resizeController._setupResizingInfo(-9930);
        resizeController._moveSeparator({
            event: {
                data: resizeController,
                type: 'mousemove',
                pageX: -9850,
                preventDefault: commonUtils.noop
            }
        });

        // assert
        const headersCols = $('.dx-datagrid-headers' + ' col');
        assert.equal($(headersCols[0]).css('width'), '150px', 'width of the first column - headers view');
        assert.equal($(headersCols[1]).css('width'), '20px', 'width of the second column - headers view');
    });

    QUnit.test('resize column event when columnAutoWidth enabled', function(assert) {
        // arrange, act
        const resizedWidths = [];
        const $dataGrid = $('#dataGrid').dxDataGrid({
            width: 1000,
            loadingTimeout: undefined,
            columnAutoWidth: true,
            dataSource: [{}],
            columns: [
                { dataField: 'field1' },
                {
                    dataField: 'field2', resized: function(width) {
                        resizedWidths.push(width);
                    }
                },
                { dataField: 'field3' },
                { dataField: 'field4' }
            ]
        });
        const dataGrid = $dataGrid.dxDataGrid('instance');


        // assert
        assert.equal(resizedWidths.length, 1);
        assert.ok(Math.abs(resizedWidths[0] - 250) <= 1, 'width applied');

        // act
        dataGrid.resize();

        // assert
        assert.equal(resizedWidths.length, 3);
        assert.strictEqual(resizedWidths[1], undefined, 'column width reset for bestFit calculation');
        assert.ok(Math.abs(resizedWidths[2] - 250) <= 1, 'width applied');
    });

    // T181974, T152353
    QUnit.test('Reset last non-command column width when width 100% in style', function(assert) {
        // arrange
        const $dataGrid = $('#dataGrid').css('width', '100%').dxDataGrid({
            dataSource: [{ field1: '1', field2: '2', field3: '3', field4: '4', field5: '5' }],
            groupPanel: {
                visible: true
            },
            columns: [
                {
                    dataField: 'field1',
                    width: 50
                },
                {
                    dataField: 'field2',
                    width: 100
                }
            ],
            editing: {
                mode: 'row',
                allowUpdating: true
            },
            allowColumnReordering: true,
            allowColumnResizing: true
        });

        // act
        this.clock.tick();
        const $cols = $dataGrid.find('colgroup').first().find('col');

        // assert
        assert.equal($cols.length, 3);
        assert.equal($cols.get(0).style.width, '50px', 'first column width is not reset');
        assert.equal($cols.get(1).style.width, 'auto', 'second column width is reset - this is last non-command column');
        assert.notStrictEqual($cols.get(2).style.width, 'auto', 'command column width is not reset');
        assert.equal($dataGrid.width(), $dataGrid.parent().width());
    });

    QUnit.module('RTL mode', () => {
        QUnit.test('The separator position should be correct when a parent grid container in RTL mode', function(assert) {
            // arrange
            const $testElement = $('#dataGrid');

            $testElement.parent().attr('dir', 'rtl').css({ width: '1000px', height: '500px' });

            const instance = $testElement.dxDataGrid({
                commonColumnSettings: {
                    allowResizing: true
                },
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
            resizeController._setupResizingInfo(-9125);
            resizeController._moveSeparator({
                event: {
                    data: resizeController,
                    type: 'mousemove',
                    pageX: -9225,
                    preventDefault: commonUtils.noop
                }
            });

            // assert
            assert.deepEqual($(resizeController._columnsSeparatorView.element()).offset(), { left: -9225, top: -10000 }, 'separator position');
        });
    });
});
