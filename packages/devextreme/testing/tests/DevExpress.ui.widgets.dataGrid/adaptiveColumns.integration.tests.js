import $ from 'jquery';
import typeUtils from 'core/utils/type';
import browser from 'core/utils/browser';
import { DataSource } from 'common/data/data_source/data_source';
import config from 'core/config';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';

const dataGridWrapper = new DataGridWrapper('#dataGrid');

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

QUnit.module('Adaptive columns', baseModuleConfig, () => {
    QUnit.test('Form item of adaptive detail row is rendered with the jquery template', function(assert) {
        // arrange
        $('#container').width(200);

        const data = [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }];
        const $dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            columnHidingEnabled: true,
            dataSource: data,
            columns: ['firstName', { dataField: 'lastName', cellTemplate: $('#scriptTestTemplate1') }]
        });
        const instance = $dataGrid.dxDataGrid('instance');

        // act
        instance.expandAdaptiveDetailRow(data[0]);

        // assert
        assert.equal($dataGrid.find('.dx-adaptive-detail-row .dx-form').length, 1, 'adaptive detail form is opened');
        assert.equal($dataGrid.find('.dx-form #template1').text(), 'Template1', 'the jquery template is rendered correctly');

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
            loadingTimeout: null,
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

    [false, true].forEach((usingCssStringInWidth) => {
        QUnit.test(`Columns hiding - columnHidingEnabled is true (usingCssStringInWidth: ${usingCssStringInWidth})`, function(assert) {
            // arrange
            const columnWidth = usingCssStringInWidth ? '100px' : 100;

            $('#container').width(250);

            const dataGrid = $('#dataGrid').dxDataGrid({
                loadingTimeout: null,
                columnHidingEnabled: true,
                dataSource: [{ value1: '1', value2: '2', value3: '3' }],
                columns: [{ dataField: 'value1', minWidth: 100 }, { dataField: 'value2', width: columnWidth }, { dataField: 'value3', width: columnWidth }]
            });
            const instance = dataGrid.dxDataGrid('instance');
            const adaptiveColumnsController = instance.getController('adaptiveColumns');
            let $visibleColumns;

            this.clock.tick(10);
            $visibleColumns = $(instance.$element().find('.dx-header-row td:not(.dx-datagrid-hidden-column)'));

            // act
            assert.equal($visibleColumns.length, 3, 'only 3 column is visible');
            assert.ok(!dataGridWrapper.headers.isColumnHidden(0), 'first column is shown');
            assert.ok(!dataGridWrapper.headers.isColumnHidden(1), 'second column is shown');
            assert.ok(dataGridWrapper.headers.isColumnHidden(2), 'third column is hidden');
            assert.ok(!dataGridWrapper.headers.isColumnHidden(3), 'adaptive column is shown');
            assert.equal($visibleColumns.eq(0).text(), 'Value 1', 'it is 1st column');
            assert.equal(adaptiveColumnsController.getHiddenColumns()[0].dataField, 'value3', '\'3rd\' column is hidden');

            $('#container').width(450);
            instance.updateDimensions();
            this.clock.tick(10);

            $visibleColumns = $(instance.$element().find('.dx-header-row td:not(.dx-datagrid-hidden-column)'));

            // assert
            assert.equal($visibleColumns.length, 4, '2 columns are visible');
            assert.ok(!dataGridWrapper.headers.isColumnHidden(0), 'first column is shown');
            assert.ok(!dataGridWrapper.headers.isColumnHidden(1), 'second column is shown');
            assert.ok(!dataGridWrapper.headers.isColumnHidden(2), 'third column is shown');
            assert.ok(dataGridWrapper.headers.isColumnHidden(3), 'adaptive column is hidden');
            assert.equal($visibleColumns.eq(0).text(), 'Value 1', 'First is \'value1\' column');
            assert.equal($visibleColumns.eq(1).text(), 'Value 2', 'Second is \'value2\' column');
            assert.equal($visibleColumns.eq(2).text(), 'Value 3', 'Second is \'value3\' column');
            assert.equal(adaptiveColumnsController.getHiddenColumns().length, 0, 'There is no hidden columns');
            assert.equal(adaptiveColumnsController.getHidingColumnsQueue().length, 3, 'There is 3 columns in hiding queue');
        });
    });

    QUnit.test('Columns hiding - hidingPriority', function(assert) {
        // arrange
        $('#container').width(200);

        const dataGrid = $('#dataGrid').dxDataGrid({
            loadingTimeout: null,
            dataSource: [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy' }],
            columns: [{ dataField: 'firstName', hidingPriority: 0 }, { dataField: 'lastName', hidingPriority: 1 }]
        });
        const instance = dataGrid.dxDataGrid('instance');
        const adaptiveColumnsController = instance.getController('adaptiveColumns');
        let $visibleColumns;

        this.clock.tick(10);
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
        if(browser.chrome) {
            assert.equal(parseInt($hiddenColumn.css('border-right-width')), 0, 'no right border');
            assert.equal(parseInt($hiddenColumn.css('border-left-width')), 0, 'no left border');
        }

        $('#container').width(450);
        instance.updateDimensions();
        this.clock.tick(10);
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
            loadingTimeout: null,
            dataSource: [{ firstName: 'Blablablablablablablablablabla', lastName: 'Psy van Dyk', age: 40, country: 'India' }],
            columns: [{ dataField: 'firstName', hidingPriority: 0 }, { dataField: 'lastName', hidingPriority: 1 }, 'age', 'country']
        });
        const instance = dataGrid.dxDataGrid('instance');
        const adaptiveColumnsController = instance.getController('adaptiveColumns');
        let $visibleColumns;

        this.clock.tick(10);

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

        this.clock.tick(10);

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
            loadingTimeout: null,
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
            loadingTimeout: null,
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
        this.clock.tick(10);
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
            loadingTimeout: null,
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
        this.clock.tick(10);
        dataGrid.find('.dx-field-item-content').trigger('dxclick');

        // assert
        assert.equal(column.dataField, 'lastName', 'dataField of column');
        assert.equal(columnIndex, 1, 'index of column');
    });

    // T1107108
    QUnit.test('Adaptive detail row should preserve item order in a banded layout', function(assert) {
        // arrange
        const items = [
            { id: '1', value1: '1', value2: '2', value3: '3', value4: '4', value5: '5' },
        ];
        const dataGrid = $('#dataGrid').dxDataGrid({
            dataSource: items,
            columns: [
                {
                    caption: 'Band 1', columns: [
                        { dataField: 'id' }
                    ]
                }, {
                    caption: 'Band 2', columns: [
                        { dataField: 'value1', hidingPriority: 5 },
                        { dataField: 'value2', hidingPriority: 4 }
                    ]
                },
                {
                    caption: 'Band 3', columns: [
                        { dataField: 'value3', hidingPriority: 3 },
                        { dataField: 'value4', hidingPriority: 2 },
                        { dataField: 'value5', hidingPriority: 1 }
                    ]
                }
            ],
            width: 200,
            columnAutoWidth: true,
            columnHidingEnabled: true,
            masterDetail: null
        });
        // act
        const instance = dataGrid.dxDataGrid('instance');

        instance.expandAdaptiveDetailRow(items[0]);
        this.clock.tick(10);

        // assert
        const detailRowItems = $(instance.element()).find('.dx-adaptive-item-text')
            .map(function() { return this.innerHTML; })
            .toArray()
            .join('');
        // assert
        assert.equal(detailRowItems, '2345');
    });


    // T1112866
    QUnit.test('Adaptive detail column should not be navigable while hidden', function(assert) {
        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            columnHidingEnabled: true,
            dataSource: [
                { id: 1, field1: 'string', field2: 'string', field3: 'string', field4: 'string', field5: 'string' },
                { id: 2, field1: 'string', field2: 'string', field3: 'string', field4: 'string', field5: 'string' }
            ],
        }).dxDataGrid('instance');

        const fireKeyDown = (target, key, shift = false) => {
            const e = $.Event('keydown');
            e.key = key;
            e.shiftKey = shift;
            target.trigger(e);
        };
        this.clock.tick(10);
        let $lastDataCell = $(dataGrid.getCellElement(0, 5));
        const $commandCell = $(dataGrid.getCellElement(0, 6));
        const $firstNextRow = $(dataGrid.getCellElement(1, 0));

        // act
        dataGrid.focus($lastDataCell);
        fireKeyDown($lastDataCell, 'Tab');
        this.clock.tick(10);

        // assert
        // tab
        assert.ok($commandCell.hasClass('dx-command-adaptive-hidden'), 'command cell has appropriate class');
        assert.notOk($commandCell.hasClass('dx-focused', 'command cell should not be focused'));

        // act
        dataGrid.focus($firstNextRow);
        fireKeyDown($firstNextRow, 'Tab', true);
        this.clock.tick(10);

        // assert
        // shift tab
        assert.ok($lastDataCell.hasClass('dx-focused', 'last cell in row should be focused'));
        assert.notOk($commandCell.hasClass('dx-focused', 'command cell should not be focused'));

        // act
        dataGrid.focus($lastDataCell);
        fireKeyDown($lastDataCell, 'ArrowRight');
        this.clock.tick(10);

        // assert
        // right arrow
        assert.notOk($commandCell.hasClass('dx-focused', 'command cell should not be focused'));

        // act
        dataGrid.option('width', 400);
        $lastDataCell = $(dataGrid.getCellElement(0, 4));
        dataGrid.focus($lastDataCell);
        fireKeyDown($lastDataCell, 'Tab');
        this.clock.tick(10);

        // assert
        // tab to visible
        assert.notOk($commandCell.hasClass('dx-command-adaptive-hidden'), 'command cell is visible');
        assert.ok($commandCell.hasClass('dx-focused'), 'command cell is focused');

        // act
        dataGrid.option('width', 600);
        this.clock.tick(10);

        // assert
        assert.ok($commandCell.hasClass('dx-command-adaptive-hidden'), 'command cell is hidden after subsequent width increase');
    });

    // T1112866
    QUnit.test('Hidden command cell accessibility attributes', function(assert) {

        // arrange
        const dataGrid = $('#dataGrid').dxDataGrid({
            columnHidingEnabled: true,
            dataSource: [
                { id: 1, field1: 'string', field2: 'string', field3: 'string', field4: 'string', field5: 'string' }
            ],
        }).dxDataGrid('instance');
        this.clock.tick(10);
        const $commandCell = $(dataGrid.getCellElement(0, 6));
        // assert
        assert.ok($commandCell.hasClass('dx-command-adaptive-hidden'), 'command cell is hidden');
        assert.ok($commandCell.attr('aria-hidden'), 'command cell has hidden aria attribute');
        assert.equal($commandCell.attr('tabindex'), -1, 'command cell has negative tab index');

        // act
        dataGrid.option('width', 400);
        this.clock.tick(10);

        // assert
        assert.notOk($commandCell.hasClass('dx-command-adaptive-hidden'), 'command cell is not hidden');
        assert.notOk($commandCell.attr('aria-hidden'), 'command cell doesn\'t have hidden aria attribute');
        assert.notEqual($commandCell.attr('tabindex'), -1, 'command cell doesn\'t have negative tab index');
    });
});
