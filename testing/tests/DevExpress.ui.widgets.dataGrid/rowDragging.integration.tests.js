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
});
