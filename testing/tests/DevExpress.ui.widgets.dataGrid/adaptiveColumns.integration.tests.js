QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid"></div>
        </div>
    `;

    const markup = `
        ${gridMarkup}
        <script id="scriptTestTemplate1" type="text/html">
            <span id="template1">Template1</span>
        </script>
    `;


    $('#qunit-fixture').html(markup);
});

import $ from 'jquery';
import typeUtils from 'core/utils/type';
import browser from 'core/utils/browser';
import { DataSource } from 'data/data_source/data_source';
import config from 'core/config';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';

const dataGridWrapper = new DataGridWrapper('#dataGrid');

QUnit.module('Adaptive columns', baseModuleConfig, () => {
    QUnit.test('Form item of adaptive detail row is rendered with the underscore template', function(assert) {
        // arrange
        $('#container').width(200);

        const data = [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }];
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: data,
            columns: ['firstName', { dataField: 'lastName', cellTemplate: $('#scriptTestTemplate1') }]
        });
        const instance = $dataGrid.dxDataGrid('instance');

        // act
        instance.expandAdaptiveDetailRow(data[0]);

        // assert
        assert.equal($dataGrid.find('.dx-adaptive-detail-row .dx-form').length, 1, 'adaptive detail form is opened');
        assert.equal($dataGrid.find('.dx-form #template1').text(), 'Template1', 'the underscore template is rendered correctly');

        instance.collapseAdaptiveDetailRow(data[0]);
    });

    QUnit.test('push changes for adaptive row', function(assert) {
        // arrange
        const dataSource = new DataSource({
            pushAggregationTimeout: 0,
            store: {
                type: 'array',
                key: 'id',
                data: [
                    { id: 1, field1: 'test1' },
                    { id: 2, field1: 'test2' },
                    { id: 3, field1: 'test3' },
                    { id: 4, field1: 'test4' }
                ]
            }
        });
        const dataGrid = createDataGrid({
            width: 100,
            columnWidth: 100,
            columnHidingEnabled: true,
            repaintChangesOnly: true,
            loadingTimeout: undefined,
            keyExpr: 'id',
            dataSource: dataSource
        });


        dataGrid.expandAdaptiveDetailRow(2);

        const $cell = $(dataGrid.getCellElement(2, 1));

        // act
        dataGrid.getDataSource().store().push([{ type: 'update', key: 2, data: { field1: 'test updated' } }]);

        // assert
        assert.strictEqual($cell.text(), 'test updated', 'field1 text is updated');
    });

    QUnit.test('Columns hiding - columnHidingEnabled is true', function(assert) {
        // arrange
        $('#container').width(200);

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }],
            columns: ['firstName', 'lastName']
        });
        const instance = dataGrid.dxDataGrid('instance');
        const adaptiveColumnsController = instance.getController('adaptiveColumns');
        let $visibleColumns;

        this.clock.tick();
        $visibleColumns = $(instance.$element().find('.dx-header-row td'));

        // act
        assert.equal($visibleColumns.length, 3, 'only 1 column is visible');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(0), 'first column is shown');
        assert.ok(dataGridWrapper.headers.isColumnHidden(1), 'second column is hidden');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(2), 'adaptive column is shown');
        assert.equal($visibleColumns.eq(0).text(), 'First Name', 'it is \'firstName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, 'lastName', '\'lastName\' column is hidden');

        $('#container').width(450);
        instance.updateDimensions();
        this.clock.tick();

        $visibleColumns = $(instance.$element().find('.dx-header-row td'));

        // assert
        assert.equal($visibleColumns.length, 3, '2 columns are visible');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(0), 'first column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(1), 'second column is shown');
        assert.ok(dataGridWrapper.headers.isColumnHidden(2), 'adaptive column is hidden');
        assert.equal($visibleColumns.eq(0).text(), 'First Name', 'First is \'firstName\' column');
        assert.equal($visibleColumns.eq(1).text(), 'Last Name', 'Second is \'lastName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, 'There is no hidden columns');
        assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, 'There is 2 columns in hiding queue');
    });

    QUnit.test('Columns hiding - hidingPriority', function(assert) {
        // arrange
        $('#container').width(200);

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }],
            columns: [{ dataField: 'firstName', hidingPriority: 0 }, { dataField: 'lastName', hidingPriority: 1 }]
        });
        const instance = dataGrid.dxDataGrid('instance');
        const adaptiveColumnsController = instance.getController('adaptiveColumns');
        let $visibleColumns;

        this.clock.tick();
        $visibleColumns = $(instance.$element().find('.dx-header-row td'));
        const $hiddenColumn = $('.dx-datagrid-hidden-column').eq(0);

        // act
        assert.ok(dataGridWrapper.headers.isColumnHidden(0), 'first column is hidden');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(1), 'second column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(2), 'adaptive column is shown');
        assert.equal($visibleColumns.length, 3, 'only 1 column is visible');
        assert.equal($visibleColumns.eq(1).text(), 'Last Name', 'it is \'lastName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, 'firstName', '\'firstName\' column is hidden');
        // T824145
        if(browser.msie || browser.chrome) {
            assert.equal(parseInt($hiddenColumn.css('border-right-width')), 0, 'no right border');
            assert.equal(parseInt($hiddenColumn.css('border-left-width')), 0, 'no left border');
        }

        $('#container').width(450);
        instance.updateDimensions();
        this.clock.tick();
        $visibleColumns = $(instance.$element().find('.dx-header-row td'));

        // assert
        assert.ok(!dataGridWrapper.headers.isColumnHidden(0), 'first column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(1), 'second column is shown');
        assert.ok(dataGridWrapper.headers.isColumnHidden(2), 'adaptive column is hidden');
        assert.equal($visibleColumns.length, 3, '2 columns are visible');
        assert.equal($visibleColumns.eq(0).text(), 'First Name', 'First is \'firstName\' column');
        assert.equal($visibleColumns.eq(1).text(), 'Last Name', 'Second is \'lastName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, 'There is no hidden columns');
        assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, 'There is 2 columns in hiding queue');
    });

    QUnit.test('Columns hiding - column without priority must stay (hidingPriority)', function(assert) {
        // arrange
        $('#container').width(80);
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            dataSource: [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy van Dyk', age: 40, country: 'India' }],
            columns: [{ dataField: 'firstName', hidingPriority: 0 }, { dataField: 'lastName', hidingPriority: 1 }, 'age', 'country']
        });
        const instance = dataGrid.dxDataGrid('instance');
        const adaptiveColumnsController = instance.getController('adaptiveColumns');
        let $visibleColumns;

        this.clock.tick();

        $visibleColumns = $(instance.$element().find('.dx-header-row td'));

        // act
        assert.ok(dataGridWrapper.headers.isColumnHidden(0), 'first column is hidden');
        assert.ok(dataGridWrapper.headers.isColumnHidden(1), 'second column is hidden');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(2), 'third column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(3), 'fourth column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(4), 'adaptive column is shown');
        assert.equal($visibleColumns.length, 5, 'only 2 columns are visible');
        assert.equal($visibleColumns.eq(2).text(), 'Age', 'First is \'age\' column');
        assert.equal($visibleColumns.eq(3).text(), 'Country', 'Second is \'country\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, 'firstName', '\'firstName\' column is hidden');
        assert.equal(adaptiveColumnsController.getHiddenColumns()[1].dataField, 'lastName', '\'lastName\' column is hidden');
        assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, 'There is no columns in hiding queue');

        $('#container').width(900);
        instance.updateDimensions();

        this.clock.tick();

        $visibleColumns = $(instance.$element().find('.dx-header-row td'));

        // assert
        assert.ok(!dataGridWrapper.headers.isColumnHidden(0), 'first column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(1), 'second column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(2), 'third column is shown');
        assert.ok(!dataGridWrapper.headers.isColumnHidden(3), 'fourth column is shown');
        assert.ok(dataGridWrapper.headers.isColumnHidden(4), 'adaptive column is hidden');
        assert.equal($visibleColumns.length, 5, '4 columns are visible');
        assert.equal($visibleColumns.eq(0).text(), 'First Name', 'First is \'firstName\' column');
        assert.equal($visibleColumns.eq(1).text(), 'Last Name', 'Second is \'lastName\' column');
        assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, 'There is no hidden columns');
        assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 2, 'There is 2 columns in hiding queue');
    });

    // T726366
    QUnit.test('Column hiding should works correctly if all columns have width', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            width: 300,
            columnWidth: 100,
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: [{}],
            columns: ['field1', 'field2', 'field3', 'field4']
        });

        // assert
        const visibleWidths = dataGrid.getVisibleColumns().map(column => column.visibleWidth);

        assert.deepEqual(visibleWidths.length, 5, 'column count');
        assert.deepEqual(visibleWidths[0], 100, 'column 1 has full width');
        assert.deepEqual(visibleWidths[1], 'auto', 'column 2 has auto width');
        assert.deepEqual(visibleWidths[2], 'adaptiveHidden', 'column 3 is hidden');
        assert.deepEqual(visibleWidths[3], 'adaptiveHidden', 'column 4 is hidden');
    });

    QUnit.test('Get correct column and column index in the onCellHoverChanged event when event is occurred for form\'s item', function(assert) {
        // arrange
        $('#container').width(200);

        const dataSource = [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }];
        const eventArgs = [];
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: dataSource,
            columns: ['firstName', 'lastName'],
            onCellHoverChanged: function(e) {
                assert.equal(typeUtils.isRenderer(e.cellElement), !!config().useJQuery, 'cellElement is correct');
                eventArgs.push({
                    column: e.column,
                    columnIndex: e.columnIndex
                });
            }
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        instance.expandAdaptiveDetailRow(dataSource[0]);
        this.clock.tick();
        dataGrid.find('.dx-field-item-content').first().trigger('mouseover');
        dataGrid.find('.dx-field-item-content').first().trigger('mouseout');

        // assert
        assert.equal(eventArgs.length, 2, 'count of eventArgs');
        assert.equal(eventArgs[0].column.dataField, 'lastName', 'dataField of column (mouseover)');
        assert.equal(eventArgs[0].columnIndex, 1, 'index of column (mouseover)');
        assert.equal(eventArgs[1].column.dataField, 'lastName', 'dataField of column (mouseover)');
        assert.equal(eventArgs[1].columnIndex, 1, 'index of column (mouseover)');
    });

    QUnit.test('Get correct column and column index in the onCellClick event when event is occurred for form\'s item', function(assert) {
        // arrange
        $('#container').width(200);

        const dataSource = [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }];
        let column;
        let columnIndex;
        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: undefined,
            columnHidingEnabled: true,
            dataSource: dataSource,
            columns: ['firstName', 'lastName'],
            onCellClick: function(e) {
                assert.equal(typeUtils.isRenderer(e.cellElement), !!config().useJQuery, 'cellElement is correct');
                column = e.column;
                columnIndex = e.columnIndex;
            }
        });
        const instance = dataGrid.dxDataGrid('instance');

        // act
        instance.expandAdaptiveDetailRow(dataSource[0]);
        this.clock.tick();
        dataGrid.find('.dx-field-item-content').trigger('dxclick');

        // assert
        assert.equal(column.dataField, 'lastName', 'dataField of column');
        assert.equal(columnIndex, 1, 'index of column');
    });

    if(browser.msie && parseInt(browser.version) <= 11) {
        QUnit.test('Update the scrollable for IE browsers when the adaptive column is hidden', function(assert) {
            // arrange


            const dataGrid = createDataGrid({
                dataSource: [{
                    'ID': 4,
                    'OrderNumber': 35711,
                    'OrderDate': '2014/01/12'
                }],
                columnAutoWidth: true,
                columnHidingEnabled: true,
                columns: ['ID', 'OrderNumber', 'OrderDate']
            });

            this.clock.tick();

            // act
            const scrollable = dataGrid.$element().find('.dx-scrollable').data('dxScrollable');
            sinon.spy(scrollable, 'update');
            dataGrid.updateDimensions();
            this.clock.tick();

            // assert
            const $lastDataCell = dataGrid.$element().find('.dx-last-data-cell');
            assert.equal($lastDataCell.text(), '2014/01/12', 'text of last data cell');
            assert.equal(scrollable.update.callCount, 2);


        });
    }
});
