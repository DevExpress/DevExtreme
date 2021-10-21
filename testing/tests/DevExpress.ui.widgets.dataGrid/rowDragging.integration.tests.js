QUnit.testStart(function() {
    const gridMarkup = `
        <div id='container'>
            <div id="dataGrid"></div>
        </div>
    `;

    $('#qunit-fixture').html(gridMarkup);
});

import $ from 'jquery';
import DataGrid from 'ui/data_grid/ui.data_grid';
import pointerMock from '../../helpers/pointerMock.js';
import { createDataGrid, baseModuleConfig } from '../../helpers/dataGridHelper.js';
import CustomStore from 'data/custom_store';


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

            this.clock.tick();

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
                enabled: true
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
});
