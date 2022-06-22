import 'ui/tree_list';
import { baseModuleConfig } from '../../helpers/dataGridHelper.js';
import $ from 'jquery';

QUnit.testStart(function() {
    const markup = `
        <div id="treeList"></div>
    `;

    $('#qunit-fixture').html(markup);
});

QUnit.module('Virtual Scrolling', baseModuleConfig, () => {
    // T1097528
    QUnit.test('Last row should not disappear after adding new row when refreshMode is repaint', function(assert) {
        // arrange
        const treeList = $('#treeList').dxTreeList({
            dataSource: [{ id: 1 }, { id: 2 }],
            keyExpr: 'id',
            height: 100,
            editing: {
                refreshMode: 'repaint'
            },
        }).dxTreeList('instance');

        this.clock.tick(500);

        // assert
        assert.strictEqual(treeList.getVisibleRows().length, 2, 'visible rows count');

        // act
        treeList.addRow();
        treeList.saveEditData();

        // assert
        assert.strictEqual(treeList.getVisibleRows().length, 3, 'visible rows count');
    });
});
