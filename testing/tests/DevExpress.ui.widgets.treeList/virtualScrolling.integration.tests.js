import { addShadowDomStyles } from 'core/utils/shadow_dom';
import 'ui/tree_list';
import { baseModuleConfig } from '../../helpers/dataGridHelper.js';
import $ from 'jquery';
import { TreeListWrapper } from '../../helpers/wrappers/dataGridWrappers.js';
import { generateNestedData } from '../../helpers/treeListMocks.js';

const treeListWrapper = new TreeListWrapper('#treeList');


QUnit.testStart(function() {
    const markup = `
        <div id="treeList"></div>
    `;

    $('#qunit-fixture').html(markup);
    addShadowDomStyles($('#qunit-fixture'));
});


QUnit.module('Virtual Scrolling', baseModuleConfig, () => {
    // T1097528
    [true, false].forEach(legacyMode => {
        QUnit.test('Last row should not disappear after adding new row when refreshMode is repaint', function(assert) {
        // arrange
            const treeList = $('#treeList').dxTreeList({
                dataSource: [{ id: 1 }, { id: 2 }],
                keyExpr: 'id',
                height: 100,
                scrolling: {
                    virtual: true,
                    legacyMode
                },
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

    QUnit.test('It should be possible to scroll to the last row when columnAutoWidth: true (T1121483)', function(assert) {
        // arrange
        const data = generateNestedData(20, 1);

        data[9].field2 = 'TestTEST TestTEST TestTEST TestTEST TestTEST TestTEST TestTEST TestTEST TestTEST TestTEST Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test  Test Test Test Test Test Test Test Test ';


        const treeList = $('#treeList').dxTreeList({
            dataSource: data,
            height: 500,
            autoExpandAll: true,
            wordWrapEnabled: true,
            columns: [{
                dataField: 'field1',
                width: 120,
            }, {
                dataField: 'field2',
                width: 300
            }],
            scrolling: {
                useNative: false
            },
        }).dxTreeList('instance');

        this.clock.tick(300);
        let visibleRows = treeList.getVisibleRows();
        const scrollable = treeList.getScrollable();

        // assert
        assert.equal(visibleRows.length, 16, 'rows are rendered initially');
        assert.equal(visibleRows[0].key, 1, 'initial first visible row');
        assert.equal(visibleRows[visibleRows.length - 1].key, 16, 'initial last visible row');

        // act
        scrollable.scrollTo({ top: 3000 });
        $(scrollable.container()).trigger('scroll');
        this.clock.tick(300);
        visibleRows = treeList.getVisibleRows();


        // assert
        assert.equal(visibleRows.length, 12, 'rows are rendered at the bottom');
        assert.equal(visibleRows[0].key, 9, 'first visible row at the bottom');
        assert.equal(visibleRows[visibleRows.length - 1].key, 20, 'last visible row at the bottom');
        assert.ok(treeListWrapper.rowsView.isRowVisible(11), 'last row visible');

        // act
        scrollable.scrollTo({ top: 3000 });
        $(scrollable.container()).trigger('scroll');
        this.clock.tick(300);
        visibleRows = treeList.getVisibleRows();

        // assert
        assert.equal(visibleRows.length, 12, 'rows are rendered at the bottom second time');
        assert.equal(visibleRows[0].key, 9, 'first visible row at the bottom second time');
        assert.equal(visibleRows[visibleRows.length - 1].key, 20, 'last visible row at the bottom second time');
        assert.ok(treeListWrapper.rowsView.isRowVisible(11), 'last row visible');

    });
});
