import { GanttExportHelper } from '__internal/ui/gantt/ui.gantt.export_helper';
import gridCoreUtils from '__internal/grids/grid_core/m_utils';

const moduleConfig = {
    beforeEach: function() {
        this.calledColumns = [];
        this.getDisplayValueStub = sinon.stub(gridCoreUtils, 'getDisplayValue').callsFake((column, rawValue) => {
            this.calledColumns.push(column && column.dataField);
            return rawValue;
        });
    },
    afterEach: function() {
        this.getDisplayValueStub.restore();
    }
};

QUnit.module('GanttExportHelper', moduleConfig);

QUnit.test('getGridDisplayText uses only visible columns (T1307282)', function(assert) {
    const visibleColumns = [
        { dataField: 'id', dataType: 'number' },
        { dataField: 'title', dataType: 'string' }
    ];

    const hiddenColumn = {
        dataField: 'secret',
        dataType: 'string',
    };

    const treeListStub = {
        getController: function() {
            return {
                getVisibleColumns: function() {
                    return visibleColumns;
                },
                getColumns: function() {
                    return [...visibleColumns, hiddenColumn];
                }
            };
        }
    };

    const helper = new GanttExportHelper({ _treeList: treeListStub });
    const data = { id: 1, title: 'Task A', secret: 'hidden' };

    assert.strictEqual(helper._getGridDisplayText(0, data), '1', 'First visible column value returned');
    assert.strictEqual(helper._getGridDisplayText(1, data), 'Task A', 'Second visible column value returned');

    assert.strictEqual(helper._getGridDisplayText(2, data), undefined, 'Out-of-range visible column index returns undefined');

    assert.deepEqual(this.calledColumns, ['id', 'title', undefined], 'Only visible columns (and undefined for out-of-range) were queried');
    assert.notOk(this.calledColumns.includes('secret'), 'Hidden column was not accessed');
});
