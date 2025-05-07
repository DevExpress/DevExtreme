import 'ui/tree_list';
import { baseModuleConfig } from '../../helpers/dataGridHelper.js';
import ArrayStore from 'common/data/array_store';
import $ from 'jquery';

QUnit.testStart(function() {
    const markup = `
        <div id="treeList"></div>
    `;

    $('#qunit-fixture').html(markup);
});

QUnit.module('Selection', baseModuleConfig, () => {
    // T1117184
    [ 'full', 'reshape', 'repaint'].forEach(refreshMode => {
        QUnit.test(`Selection after editing should not result in extra requests with refreshMode: ${refreshMode}`, function(assert) {
            // arrange

            const getData = function(count) {
                let i = 1;
                const result = [];

                while(i < count * 2) {
                    result.push({ id: i, parentId: 0, field: 'a', text: 'a' + i }, { id: i + 1, parentId: i, field: 'b', text: 'b' + i });
                    i += 2;
                }

                return result;
            };
            const store = new ArrayStore({
                key: 'id',
                data: getData(100)
            });
            let loadCalls = 0;
            const treeList = $('#treeList').dxTreeList({
                dataSource: {
                    key: 'id',
                    load: function(loadOptions) {
                        const d = $.Deferred();
                        loadCalls++;
                        setTimeout(() => {
                            store.load(loadOptions).done(function() {

                                d.resolve.apply(d, arguments);
                            });
                        }, 50);
                        return d.promise();
                    },
                    update: store.update.bind(store),
                    totalCount: function(loadOptions) {
                        return store.totalCount(loadOptions);
                    }
                },
                // keyExpr: 'id',
                parentIdExpr: 'parentId',
                remoteOperations: {
                    filtering: true,
                    sorting: true,
                },
                editing: {
                    mode: 'row',
                    allowUpdating: true,
                    refreshMode
                },
                columns: [{
                    dataField: 'text',
                    sortOrder: 'asc'
                }],
            }).dxTreeList('instance');
            this.clock.tick(500);

            treeList.expandRow(1);

            this.clock.tick(300);
            // act
            treeList.editCell(1, 'text');
            treeList.cellValue(1, 'text', '123');
            treeList.saveEditData();
            this.clock.tick(10);

            treeList.saveEditData();
            this.clock.tick(10);

            const loadCallsBeforeSelection = loadCalls;


            treeList.selectRows(1);
            // assert
            assert.deepEqual(treeList.getSelectedRowKeys(), [1], 'row is selected');
            assert.equal(loadCallsBeforeSelection, loadCalls, 'extraneous request has not been made');
        });
    });
});
