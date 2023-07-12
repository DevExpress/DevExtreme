import 'ui/tree_list';
import { baseModuleConfig } from '../../helpers/dataGridHelper.js';
import $ from 'jquery';
import { TreeListWrapper } from '../../helpers/wrappers/dataGridWrappers.js';

QUnit.testStart(function() {
    const treeMarkup = `
        <div id='container'>
            <div id="treeList"></div>
        </div>
    `;

    $('#qunit-fixture').html(treeMarkup);
});

const treeListWrapper = new TreeListWrapper('#treeList');

QUnit.module('Fixed columns', baseModuleConfig, () => {
    QUnit.test('The "Select All" cell should not have the "dx-col-fixed" class (T1120812)', function(assert) {
        // arrange
        const headersWrapper = treeListWrapper.headers;

        $('#treeList').dxTreeList({
            loadingTimeout: null,
            dataSource: {
                store: [
                    { id: 1, value: 'value 1' },
                    { id: 2, value: 'value 2' }
                ]
            },
            columns: ['id', {
                dataField: 'value',
                fixed: true
            }],
            columnFixing: {
                enabled: true
            },
            selection: {
                mode: 'multiple'
            }
        });

        const selectAllCell = headersWrapper.getHeaderItem(0, 0);

        // assert
        assert.ok(selectAllCell.hasClass('dx-treelist-select-all'), 'cell contains the Select All checkbox');
        assert.notOk(selectAllCell.hasClass('dx-col-fixed'), 'not dx-col-fixed');
    });
});
