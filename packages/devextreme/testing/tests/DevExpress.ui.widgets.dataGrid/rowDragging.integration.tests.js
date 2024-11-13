import $ from 'jquery';
import DataGrid from 'ui/data_grid';
import pointerMock from '../../helpers/pointerMock.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import { CustomStore } from 'common/data/custom_store';
import { generateItems } from '../../helpers/dataGridMocks.js';

QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(gridMarkup);
});

QUnit.module('Row dragging', baseModuleConfig, () => {

    // T831020
    QUnit.test('The draggable row should have correct markup when defaultOptions is specified', function(assert) {
    // arrange
        DataGrid.defaultOptions({
            options: {
                filterRow: {
                    visible: true
                },
                groupPanel: {
                    visible: true
                },
                filterPanel: {
                    visible: true
                }
            }
        });

        try {
            const dataGrid = createDataGrid({
                dataSource: [{ field1: 1, field2: 2, field3: 3 }],
                rowDragging: {
                    allowReordering: true
                }
            });

            this.clock.tick(10);

            // act
            pointerMock(dataGrid.getCellElement(0, 0)).start().down().move(100, 100);

            // assert
            const $draggableRow = $('body').children('.dx-sortable-dragging');
            assert.strictEqual($draggableRow.length, 1, 'has draggable row');

            const $visibleView = $draggableRow.find('.dx-gridbase-container').children(':visible');
            assert.strictEqual($visibleView.length, 1, 'markup of the draggable row is correct');
            assert.ok($visibleView.hasClass('dx-datagrid-rowsview'), 'rowsview is visible');
        } finally {
            DataGrid.defaultOptions({
                options: {
                    filterRow: {
                        visible: false
                    },
                    groupPanel: {
                        visible: false
                    },
                    filterPanel: {
                        visible: false
                    }
                }
            });
        }
    });

    QUnit.test('Row reordering should work when columnFixed is enabled', function(assert) {
        // arrange
        const tasks = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const tasksStore = new CustomStore({
            key: 'id',
            load: function(loadOptions) {
                const d = $.Deferred();
                setTimeout(() => {
                    d.resolve(tasks);
                });
                return d;
            },
            update: function(key, values) {},
            totalCount: function() {
                return tasks.length;
            }
        });

        const dataGrid = createDataGrid({
            dataSource: tasksStore,
            remoteOperations: true,
            rowDragging: {
                allowReordering: true,
                dropFeedbackMode: 'push',
                onReorder: function(e) {
                    const visibleRows = e.component.getVisibleRows();
                    const newOrderIndex = visibleRows[e.toIndex].data.OrderIndex;
                    const d = $.Deferred();

                    tasksStore.update(e.itemData.ID, { OrderIndex: newOrderIndex }).then(function() {
                        e.component.refresh().then(d.resolve, d.reject);
                    }, d.reject);

                    e.promise = d.promise();
                }
            },
            columnFixing: {
                enabled: true,
                legacyMode: true
            }
        });

        this.clock.tick(1000);

        // act
        pointerMock(dataGrid.getCellElement(0, 0)).start().down().move(0, 1).up();
        this.clock.tick(1000);
        pointerMock(dataGrid.getCellElement(1, 1)).start().down().move(0, 1).up();
        this.clock.tick(1000);

        // assert
        assert.notOk($('.dx-sortable-source-hidden').length, 'no dx-sortable-source-hidden elements after dragging');
    });

    QUnit.test('Fixed content should have correct width when editing, columnFixed and rowDragging are enabled', function(assert) {
        // arrange, act
        createDataGrid({
            dataSource: generateItems(100),
            height: 300,
            width: 400,
            rowDragging: {
                allowReordering: true,
                showDragIcons: true
            },
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            scrolling: {
                useNative: true,
            },
            editing: {
                mode: 'row',
                allowUpdating: true
            }
        });
        this.clock.tick(100);

        // assert
        const $dataGridContent = $('.dx-datagrid-rowsview .dx-datagrid-content:not(dx-datagrid-content-fixed)');
        const $fixedDataGridContent = $('.dx-datagrid-rowsview .dx-datagrid-content.dx-datagrid-content-fixed');

        assert.strictEqual($dataGridContent.width(), $fixedDataGridContent.width(), 'fixed content has correct width');
    });

    // T1083805
    QUnit.test('Fixed content should have correct height when columnFixed and rowDragging are enabled', function(assert) {
        // arrange, act
        const dataGrid = createDataGrid({
            dataSource: generateItems(100),
            height: 300,
            columnAutoWidth: true,
            width: 200,
            rowDragging: {
                allowReordering: true,
                showDragIcons: true
            },
            columnFixing: {
                enabled: true,
                legacyMode: true
            },
            scrolling: {
                useNative: true
            }
        });
        this.clock.tick(100);

        // assert
        const $rowsView = $('.dx-datagrid-rowsview');
        const $fixedDataGridContent = $('.dx-datagrid-rowsview .dx-datagrid-content.dx-datagrid-content-fixed');

        assert.strictEqual(Math.round($fixedDataGridContent.height()), Math.round($rowsView.height()) - dataGrid.getScrollbarWidth(true), 'fixed content has correct height');
    });

    QUnit.test('Focused cell should be reseted on drag start (T1050509)', function(assert) {
        // arrange
        const dataGrid = createDataGrid({
            dataSource: [{ id: 1 }, { id: 2 }],
            keyExpr: 'id',
            rowDragging: {
                allowReordering: true
            }
        });

        this.clock.tick(1000);

        // act
        pointerMock(dataGrid.getCellElement(0, 0)).start().down().move(0, 10);
        this.clock.tick(1000);

        // assert
        assert.equal(dataGrid.getController('keyboardNavigation')._getFocusedCell().length, 0, 'foccused cell is reseted');
    });
});
