import { addShadowDomStyles } from 'core/utils/shadow_dom.js';

QUnit.testStart(function() {
    const markup =
'<!--qunit-fixture-->\
    <div id="container">\
        <div id="treeList">\
        </div>\
    </div>\
';

    $('#qunit-fixture').html(markup);

    addShadowDomStyles($('#qunit-fixture'));
});

import 'generic_light.css!';
import '__internal/grids/tree_list/m_widget';
import $ from 'jquery';
import fx from 'common/core/animation/fx';
import ArrayStore from 'common/data/array_store';
import { setupTreeListModules } from '../../helpers/treeListMocks.js';

fx.off = true;

const setupModule = function() {
    const that = this;

    that.options = {
        dataSource: [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }
        ],
        columns: [
            { dataField: 'field1' },
            { dataField: 'field2' },
            { dataField: 'field3' }
        ],
        expandedRowKeys: [],
        keyExpr: 'id',
        parentIdExpr: 'parentId'
    };

    that.setupTreeList = function(modules = []) {
        setupTreeListModules(that, ['data', 'columns', 'rows', 'selection', 'editorFactory', 'columnHeaders', 'filterRow', 'sorting', 'search', 'focus'].concat(modules), {
            initViews: true
        });
    };
};

const teardownModule = function() {
    this.dispose();
};

QUnit.module('Selection', { beforeEach: setupModule, afterEach: teardownModule }, () => {

    QUnit.test('Select row', function(assert) {
    // arrange
        const data = { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) };
        const $testElement = $('#treeList');

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        const key = this.keyOf(data);
        this.selectRows(key);

        // assert
        assert.deepEqual(this.getSelectedRowKeys(), [1]);
        assert.deepEqual(this.option('selectedRowKeys'), [1]);
        assert.ok(this.dataController.items()[0].isSelected);
    });

    QUnit.test('Select row when store hasn\'t key', function(assert) {
        // arrange
        const data = this.options.dataSource;
        const $testElement = $('#treeList');

        this.options.dataSource = {
            load: function() {
                return $.Deferred().resolve(data);
            }
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectRows(1);

        // assert
        assert.deepEqual(this.getSelectedRowKeys(), [1], 'selected row keys');
        assert.ok($testElement.find('.dx-data-row').first().hasClass('dx-selection'), 'first row is selected');
    });

    QUnit.test('Select all rows', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectAll();

        // assert
        assert.deepEqual(this.getController('selection').isSelectAll(), true, 'select all state');
        assert.deepEqual(this.getSelectedRowKeys(), [1], 'only visible rows are selected');
        assert.deepEqual(this.option('selectedRowKeys'), [1], 'only visible rows are selected');

        // act
        this.expandRow(1);

        // assert
        assert.deepEqual(this.getController('selection').isSelectAll(), undefined, 'select all state is changed after expand');
    });

    QUnit.test('Deselect all rows', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.selectedRowKeys = [1, 2];

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.deselectAll();

        // assert
        assert.deepEqual(this.getController('selection').isSelectAll(), false, 'select all state');
        assert.deepEqual(this.getSelectedRowKeys(), [2], 'visible rows are deselected');
        assert.deepEqual(this.option('selectedRowKeys'), [2], 'visible rows are deselected');
    });

    QUnit.test('Select all rows if autoExpandAll is true', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.autoExpandAll = true;

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectAll();

        // assert
        assert.deepEqual(this.getSelectedRowKeys(), [1, 2], 'all visible rows are selected');
        assert.deepEqual(this.option('selectedRowKeys'), [1, 2], 'all visible rows are selected');
    });

    QUnit.test('Select all rows if filter is applied', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource.push({ id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) });

        this.options.expandNodesOnFiltering = true;
        this.options.columns[0].filterValue = 'test2';

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectAll();

        // assert
        assert.deepEqual(this.getController('selection').isSelectAll(), true, 'select all state');
        assert.deepEqual(this.getSelectedRowKeys(), [1, 2], 'all visible rows are selected');
        assert.deepEqual(this.option('selectedRowKeys'), [1, 2], 'all visible rows are selected');
    });

    // T861403
    [true, false].forEach(recursive => {
        QUnit.test(`Select all rows if filter is applied, filterMode is matchOnly and recursive=${recursive}`, function(assert) {
        // arrange
            const $testElement = $('#treeList');
            const selectedRowKeys = recursive ? [1, 2] : [2];

            this.options.filterMode = 'matchOnly';
            this.options.columns[0].filterValue = 'test2';
            this.options.selection = {
                recursive,
                mode: 'multiple'
            };

            this.setupTreeList();
            this.rowsView.render($testElement);

            // act
            this.selectAll();

            // assert
            assert.deepEqual(this.getController('selection').isSelectAll(), true, 'select all state');
            assert.deepEqual(this.getSelectedRowKeys(), selectedRowKeys, 'all visible rows are selected');
            assert.deepEqual(this.option('selectedRowKeys'), selectedRowKeys, 'all visible rows are selected');

            // act
            this.option('filterValue', undefined);

            // assert
            assert.deepEqual(this.getController('selection').isSelectAll(), true, 'select all state');
            assert.deepEqual(this.getSelectedRowKeys(), selectedRowKeys, 'all visible rows are selected');
            assert.deepEqual(this.option('selectedRowKeys'), selectedRowKeys, 'all visible rows are selected');
        });

        QUnit.test(`Select and deselect all rows if filter is applied, filterMode is matchOnly and recursive=${recursive}`, function(assert) {
        // arrange
            const $testElement = $('#treeList');
            const selectedRowKeys = recursive ? [1, 2] : [2];

            this.options.filterMode = 'matchOnly';
            this.options.columns[0].filterValue = 'test2';
            this.options.selection = {
                recursive,
                mode: 'multiple'
            };

            this.setupTreeList();
            this.rowsView.render($testElement);

            // act
            this.selectAll();

            // assert
            assert.deepEqual(this.getController('selection').isSelectAll(), true, 'select all state');
            assert.deepEqual(this.getSelectedRowKeys(), selectedRowKeys, 'all visible rows are selected');
            assert.deepEqual(this.option('selectedRowKeys'), selectedRowKeys, 'all visible rows are selected');

            // act
            this.deselectAll();

            // assert
            assert.deepEqual(this.getController('selection').isSelectAll(), false, 'select all state');
            assert.deepEqual(this.getSelectedRowKeys(), [], 'all visible rows are selected');
            assert.deepEqual(this.option('selectedRowKeys'), [], 'all visible rows are selected');

            // act
            this.option('filterValue', undefined);

            // assert
            assert.deepEqual(this.getController('selection').isSelectAll(), false, 'select all state');
            assert.deepEqual(this.getSelectedRowKeys(), [], 'all visible rows are selected');
            assert.deepEqual(this.option('selectedRowKeys'), [], 'all visible rows are selected');
        });
    });

    QUnit.test('getSelectedRowKeys with non-recursive selection', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, parentId: 4, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) }
        ];
        this.options.expandedRowKeys = [1, 4];
        this.options.selectedRowKeys = [1, 2, 4];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act, assert
        assert.deepEqual(this.getSelectedRowKeys(), [1, 2, 4], 'actual selection');
        assert.deepEqual(this.getSelectedRowKeys('excludeRecursive'), [1], 'only top');
        assert.deepEqual(this.getSelectedRowKeys('all'), [1, 2, 4], 'actual selection');
        assert.deepEqual(this.getSelectedRowKeys('leavesOnly'), [2], 'only leaves selected');
    });

    QUnit.test('Checkboxes should be rendered in right place', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always' };

        this.setupTreeList();
        this.rowsView.render($testElement);

        const $gridCell = $testElement.find('.dx-treelist-cell-expandable').eq(0);

        // assert
        assert.equal($gridCell.find('.dx-select-checkbox').length, 1, 'Select checkbox was rendered in right place');
        assert.ok($gridCell.find('.dx-select-checkbox').parent().hasClass('dx-treelist-icon-container'), 'Checkbox inside icon container');
    });

    // T972125
    QUnit.test('The Select All checkbox should have correct position when first defined column has no dataField and showColumnLines is false', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.showColumnHeaders = true;
        this.options.showColumnLines = false;
        this.options.columns = [ { caption: 'Test' } ];
        this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true };

        this.setupTreeList();
        this.columnHeadersView.render($testElement);

        const $headerCell = $testElement.find('.dx-treelist-select-all').eq(0);
        const $headerTextContent = $headerCell.children('.dx-treelist-text-content');
        const $selectAll = $headerCell.children('.dx-select-checkbox');

        // assert
        assert.strictEqual($headerCell.length, 1, 'the header with select all checkbox is rendered');
        assert.strictEqual($headerTextContent.length, 1, 'the header text content is rendered');
        assert.strictEqual($selectAll.length, 1, 'the Select All checkbox is rendered');
        assert.roughEqual($selectAll.offset().top, $headerTextContent.offset().top, 1.1, 'the Select All checkbox position is roughly equal to the header text content position');
        assert.strictEqual($headerTextContent.css('display'), 'inline-block', 'the display style of the header text content');
    });

    QUnit.test('Checkboxes should not be rendered if selection is not multiple', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.selection = { mode: 'single', showCheckBoxesMode: 'always' };

        this.setupTreeList();
        this.rowsView.render($testElement);

        const $gridCell = $testElement.find('.dx-treelist-cell-expandable').eq(0);

        // assert
        assert.equal($gridCell.find('.dx-select-checkbox').length, 0, 'Select checkbox was not rendered');
    });

    QUnit.test('Click on select checkbox should work correctly', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always' };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        const $selectCheckbox = $testElement.find('.dx-treelist-cell-expandable').eq(0).find('.dx-select-checkbox').eq(0);
        $selectCheckbox.trigger('dxclick');

        // assert
        assert.equal($selectCheckbox.dxCheckBox('instance').option('value'), true, 'Select checkbox value is OK');
        assert.deepEqual(this.option('selectedRowKeys'), [1], 'Right row is selected');
        assert.ok(this.dataController.items()[0].isSelected, 'Right row is selected');
    });

    // T917248
    QUnit.test('Click on select checkbox container should not select row', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always' };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        const $selectCheckbox = $testElement.find('.dx-treelist-cell-expandable').eq(0).find('.dx-select-checkbox').eq(0);
        $selectCheckbox.parent().trigger('dxclick');

        // assert
        assert.equal($selectCheckbox.dxCheckBox('instance').option('value'), false, 'Select checkbox value');
        assert.notOk(this.option('selectedRowKeys'), 'row is not selected');
        assert.notOk(this.dataController.items()[0].isSelected, 'row is not selected');
    });

    QUnit.test('Click on selectAll checkbox should work correctly', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.showColumnHeaders = true;
        this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true };
        this.setupTreeList();
        this.columnHeadersView.render($testElement);
        this.rowsView.render($testElement);

        // act
        const $checkbox = $('.dx-header-row').find('.dx-checkbox');
        $checkbox.trigger('dxclick');

        // assert
        assert.equal($checkbox.dxCheckBox('instance').option('value'), true, 'SelectAll checkbox value is OK');
        assert.deepEqual(this.option('selectedRowKeys'), [1], 'Right rows are selected');
    });

    QUnit.test('Click on selectAll checkbox should work correctly when sorting is enabled', function(assert) {
    // arrange
        const $testElement = $('#treeList');
        const clock = sinon.useFakeTimers();

        this.options.showColumnHeaders = true;
        this.options.sorting = {
            mode: 'single'
        };
        this.options.columns[0].allowSorting = true;
        this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true };
        this.setupTreeList();
        this.columnHeadersView.render($testElement);
        this.rowsView.render($testElement);

        // act
        const $checkbox = $('.dx-header-row').find('.dx-checkbox');
        $checkbox.trigger('dxclick');
        clock.tick(10);

        // assert
        assert.equal($checkbox.dxCheckBox('instance').option('value'), true, 'SelectAll checkbox value is OK');
        assert.equal($testElement.find('tbody > tr > td').first().find('.dx-sort-up, .dx-sort-down').length, 0, 'sort not applied');
        clock.restore();
    });

    QUnit.test('Click on selectAll checkbox should check row checkboxes', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.showColumnHeaders = true;
        this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true };
        this.setupTreeList();
        this.columnHeadersView.render($testElement);
        this.rowsView.render($testElement);

        // act
        const $checkbox = $('.dx-header-row').find('.dx-checkbox');
        $checkbox.trigger('dxclick');

        // assert
        const $selectCheckbox = $testElement.find('.dx-treelist-cell-expandable').eq(0).find('.dx-select-checkbox').eq(0);
        assert.equal($selectCheckbox.dxCheckBox('instance').option('value'), true, 'Select checkbox value is OK');
    });

    QUnit.test('Reordering column, selection', function(assert) {
    // arrange
        const $testElement = $('#treeList');
        this.options.allowColumnReordering = true;
        this.options.showColumnHeaders = true;
        this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true };
        this.setupTreeList();
        this.columnHeadersView.render($testElement);
        this.rowsView.render($testElement);

        // act
        const $checkbox = $('.dx-header-row').find('.dx-checkbox');
        $checkbox.trigger('dxclick');
        this.columnsController.moveColumn(0, 3);

        // assert
        const $selectCheckbox = $testElement.find('.dx-treelist-cell-expandable').eq(0).find('.dx-select-checkbox').eq(0);
        assert.equal($selectCheckbox.dxCheckBox('instance').option('value'), true, 'Select checkbox value is OK');
    });

    QUnit.test('Checking state selectAll checkbox - deselect row after select All', function(assert) {
    // arrange
        let $selectAllCheckBox;
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 2, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 2, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, parentId: 2, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) },
            { id: 6, parentId: 1, field1: 'test6', field2: 6, field3: new Date(2002, 1, 6) },
            { id: 7, parentId: 6, field1: 'test7', field2: 7, field3: new Date(2002, 1, 7) },
            { id: 8, parentId: 6, field1: 'test8', field2: 8, field3: new Date(2002, 1, 8) },
            { id: 9, parentId: 6, field1: 'test9', field2: 9, field3: new Date(2002, 1, 9) },
        ];
        this.options.expandedRowKeys = [1];
        this.options.showColumnHeaders = true;
        this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true };
        this.setupTreeList();
        this.columnHeadersView.render($testElement);
        this.rowsView.render($testElement);
        this.selectAll();

        // assert
        $selectAllCheckBox = $testElement.find('.dx-header-row').children().first().find('.dx-select-checkbox');
        assert.ok($selectAllCheckBox.hasClass('dx-checkbox-checked'), 'selectAll checkbox is checked');

        // act
        this.deselectRows(2);

        // assert
        $selectAllCheckBox = $testElement.find('.dx-header-row').children().first().find('.dx-select-checkbox');
        assert.ok($selectAllCheckBox.hasClass('dx-checkbox-indeterminate'), 'selectAll checkbox is indeterminate');
    });

    QUnit.test('Checking state selectAll checkbox - select all when there is filter', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 2, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 2, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, parentId: 2, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) },
            { id: 6, parentId: 1, field1: 'test6', field2: 6, field3: new Date(2002, 1, 6) },
            { id: 7, parentId: 6, field1: 'test7', field2: 7, field3: new Date(2002, 1, 7) },
            { id: 8, parentId: 6, field1: 'test8', field2: 8, field3: new Date(2002, 1, 8) },
            { id: 9, parentId: 6, field1: 'test9', field2: 9, field3: new Date(2002, 1, 9) },
        ];
        this.options.showColumnHeaders = true;
        this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true };
        this.options.columns[0].filterValue = 'test5';
        this.setupTreeList();
        this.columnHeadersView.render($testElement);
        this.rowsView.render($testElement);

        // act
        this.selectAll();

        // assert
        const $selectAllCheckBox = $testElement.find('.dx-header-row').children().first().find('.dx-select-checkbox');
        assert.ok($selectAllCheckBox.hasClass('dx-checkbox-checked'), 'selectAll checkbox is checked');
    });

    QUnit.test('Not select row when click by expanding icon', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        $testElement.find('tbody > tr').first().find('.dx-treelist-collapsed').trigger('dxclick');

        // assert
        assert.equal(this.option('selectedRowKeys'), undefined, 'checking the \'selectedRowKeys\' option - should be empty');
        assert.notOk(this.dataController.items()[0].isSelected, 'row isn\'t selected');
    });

    QUnit.testInActiveWindow('Focused border is not displayed around expandable cell when row is selected', function(assert) {
    // arrange
        const clock = sinon.useFakeTimers();
        const $testElement = $('#treeList');

        this.element = function() {
            return $testElement;
        };

        this.options.selection = { mode: 'multiple', showCheckBoxesMode: 'always' };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        const $expandableCell = $testElement.find('.dx-treelist-cell-expandable').first();
        const $selectCheckbox = $expandableCell.find('.dx-select-checkbox').first();

        $selectCheckbox.focus();
        clock.tick(10);

        // assert
        assert.ok(!$expandableCell.hasClass('dx-focused'));
        clock.restore();
    });

    // T742205
    QUnit.test('The load method should not be called on an attempt to select loaded nodes when they are collapsed', function(assert) {
    // arrange
        const $testElement = $('#treeList');
        const store = new ArrayStore([
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }
        ]);
        const load = sinon.spy((loadOptions) => {
            return store.load(loadOptions).promise();
        });

        this.options.cacheEnabled = true;
        this.options.expandedRowKeys = [1];
        this.options.remoteOperations = { filtering: true };
        this.options.dataSource = {
            load: load
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // assert
        assert.strictEqual(this.getVisibleRows().length, 2, 'row count');

        this.collapseRow(1);

        // assert
        assert.strictEqual(this.getVisibleRows().length, 1, 'row count');

        // act
        load.resetHistory();
        this.selectRows([2]);

        // assert
        assert.strictEqual(load.callCount, 0, 'load isn\'t called');
    });

    // T742205, T751539
    QUnit.test('selection for nested node should work', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.cacheEnabled = true;
        this.options.expandedRowKeys = [1];
        this.options.dataSource = [
            { id: 1, field1: 'test1' },
            { id: 2, field1: 'test2' },
            { id: 3, parentId: 1, field1: 'test3' }
        ];

        this.setupTreeList();
        this.rowsView.render($testElement);

        // assert
        this.selectionController.changeItemSelection(1);

        // assert
        assert.deepEqual(this.getSelectedRowKeys(), [3], 'selected row keys');
        assert.strictEqual(this.getVisibleRows()[1].isSelected, true, 'row 1 is selected');
    });

    // T858312
    QUnit.test('The getSelectedRowsData method should work correctly when calling navigateToRow in the onNodesInitialized event', function(assert) {
    // arrange
        const $testElement = $('#treeList');
        const clock = sinon.useFakeTimers();

        this.options.loadingTimeout = 30;
        this.options.autoNavigateToFocusedRow = true;
        this.options.onNodesInitialized = (e) => {
            this.navigateToRow(2);
        };

        this.setupTreeList();
        clock.tick(60);
        this.rowsView.render($testElement);

        // assert
        assert.ok(this.getNodeByKey(1), 'node with key "1" exists');
        assert.ok(this.getNodeByKey(2), 'node with key "2" exists');

        // act
        this.selectRows(2);

        // assert
        assert.deepEqual(this.getSelectedRowKeys(), [2], 'getSelectedRowKeys');
        assert.deepEqual(this.option('selectedRowKeys'), [2], 'selectedRowKeys');
        assert.deepEqual(this.getSelectedRowsData(), [{ id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }], 'getSelectedRowsData');

        clock.restore();
    });

    // T978760
    QUnit.test('focusedItemIndex should be reset to -1 after select all nodes', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        /* eslint-disable indent */
        const array = [
            { id: 1, field1: 'test1', field2: 1 },
                { id: 2, parentId: 1, field1: 'test2', field2: 2 },
            { id: 3, field1: 'test3', field2: 3 },
                { id: 4, parentId: 3, field1: 'test4', field2: 4 }
        ];
        /* eslint-enable indent */

        this.options.autoExpandAll = true;
        this.options.dataSource = array;
        this.options.selection = { mode: 'multiple' };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectionController.changeItemSelection(0, { shift: true });
        this.selectionController.changeItemSelection(2, { shift: true });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 3, 2], 'selected row keys');
        assert.equal(this.selectionController._selection._focusedItemIndex, 2, '_focusedItemIndex corrected');

        // act
        this.selectionController.selectAll();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 3, 2, 4], 'selected row keys');
        assert.equal(this.selectionController._selection._focusedItemIndex, -1, '_focusedItemIndex corrected');
    });

    // T978760
    QUnit.test('focusedItemIndex should be reset to -1 after deselect all nodes', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        /* eslint-disable indent */
        const array = [
            { id: 1, field1: 'test1', field2: 1 },
                { id: 2, parentId: 1, field1: 'test2', field2: 2 },
            { id: 3, field1: 'test3', field2: 3 },
                { id: 4, parentId: 3, field1: 'test4', field2: 4 }
        ];
        /* eslint-enable indent */

        this.options.autoExpandAll = true;
        this.options.dataSource = array;
        this.options.selection = { mode: 'multiple' };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectionController.changeItemSelection(0, { shift: true });
        this.selectionController.changeItemSelection(3, { shift: true });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 4, 3, 2], 'selected row keys');
        assert.equal(this.selectionController._selection._focusedItemIndex, 3, '_focusedItemIndex corrected');

        // act
        this.selectionController.deselectAll();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [], 'selected row keys');
        assert.equal(this.selectionController._selection._focusedItemIndex, -1, '_focusedItemIndex corrected');
    });

    // T1127554
    QUnit.test('The selection should not work on pressing space when there is no data', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [];
        this.options.selectedRowKeys = [];
        this.options.selection = {
            mode: 'single'
        };
        this.options.keyboardNavigation = {
            enabled: true
        };

        this.setupTreeList(['keyboardNavigation']);
        this.rowsView.render($testElement);

        // act
        const $rowsView = $(this.rowsView.element());
        $rowsView.trigger($.Event('keydown', { key: ' ' }));

        // assert
        assert.deepEqual(this.getSelectedRowKeys(), []);
        assert.deepEqual(this.option('selectedRowKeys'), []);
    });
});

QUnit.module('Recursive selection', {
    beforeEach: function() {
        setupModule.call(this);
        this.options.selection = {
            mode: 'multiple',
            recursive: true
        };
    },
    afterEach: teardownModule
}, () => {

    QUnit.test('Selecting row', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.expandedRowKeys = [1];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectRows(1);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(this.option('selectedRowKeys'), [1], 'selected row keys');
        assert.ok(items[0].isSelected, 'first item is selected');
        assert.ok(items[1].isSelected, 'second item is selected');
    });

    QUnit.test('Deselecting row', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
        ];

        this.options.expandedRowKeys = [1];
        this.options.selectedRowKeys = [1];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.deselectRows(2);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(this.option('selectedRowKeys'), [3, 4], 'selected row keys');
        assert.strictEqual(items[0].isSelected, undefined, 'selection state of the first item is indeterminate');
        assert.notOk(items[1].isSelected, 'second item isn\'t selected');
        assert.ok(items[2].isSelected, 'first item is selected');
        assert.ok(items[3].isSelected, 'second item is selected');
    });

    QUnit.test('Selecting a row when several of his children are selected', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
        ];
        this.options.expandedRowKeys = [1];
        this.options.selectedRowKeys = [3, 4];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectRows(1);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(this.option('selectedRowKeys'), [1], 'selected row keys');
        assert.ok(items[0].isSelected, 'first item is selected');
        assert.ok(items[1].isSelected, 'second item is selected');
        assert.ok(items[2].isSelected, 'third item is selected');
        assert.ok(items[3].isSelected, 'fourth item is selected');
    });

    QUnit.test('Deselecting the row when all children are selected', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) }
        ];
        this.options.expandedRowKeys = [1];
        this.options.selectedRowKeys = [2, 3];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.deselectRows(1);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(this.option('selectedRowKeys'), [], 'selected row keys');
        assert.notOk(items[0].isSelected, 'first item isn\'t selected');
        assert.notOk(items[1].isSelected, 'second item isn\'t selected');
        assert.notOk(items[2].isSelected, 'third item isn\'t selected');
    });

    QUnit.test('Select All', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, field1: 'test5', field2: 5, field3: new Date(2001, 0, 5) }
        ];
        this.options.expandedRowKeys = [1];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectAll();

        // assert
        const items = this.dataController.items();
        assert.deepEqual(this.option('selectedRowKeys'), [1, 5], 'selected row keys');
        assert.ok(items[0].isSelected, 'first item is selected');
        assert.ok(items[1].isSelected, 'second item is selected');
        assert.ok(items[2].isSelected, 'third item is selected');
        assert.ok(items[3].isSelected, 'fourth item is selected');
        assert.ok(items[4].isSelected, 'fifth item is selected');
    });

    QUnit.test('Select All when several rows are selected', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, field1: 'test5', field2: 5, field3: new Date(2001, 0, 5) }
        ];
        this.options.expandedRowKeys = [1];
        this.options.selectedRowKeys = [2, 3];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectAll();

        // assert
        const items = this.dataController.items();
        assert.deepEqual(this.option('selectedRowKeys'), [1, 5], 'selected row keys');
        assert.ok(items[0].isSelected, 'first item is selected');
        assert.ok(items[1].isSelected, 'second item is selected');
        assert.ok(items[2].isSelected, 'third item is selected');
        assert.ok(items[3].isSelected, 'fourth item is selected');
        assert.ok(items[4].isSelected, 'fifth item is selected');
    });

    QUnit.test('Deselect All', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
        ];
        this.options.expandedRowKeys = [1];
        this.options.selectedRowKeys = [2, 3, 4];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.deselectAll();

        // assert
        const items = this.dataController.items();
        assert.deepEqual(this.option('selectedRowKeys'), [], 'selected row keys');
        assert.notOk(items[0].isSelected, 'first item isn\'t selected');
        assert.notOk(items[1].isSelected, 'second item isn\'t selected');
        assert.notOk(items[2].isSelected, 'third item isn\'t selected');
        assert.notOk(items[3].isSelected, 'fourth item isn\'t selected');
    });

    QUnit.test('Selecting row with preserve = false', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.expandedRowKeys = [1];
        this.options.dataSource = [
            { id: 1, field1: 'test1' },
            { id: 2, parentId: 1, field1: 'test2' },
            { id: 3, parentId: 1, field1: 'test3' }
        ],
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectRows(2);
        this.selectRows(3, false);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(this.option('selectedRowKeys'), [3], 'selected row keys');
        assert.notOk(items[0].isSelected, 'first item is not selected');
        assert.notOk(items[1].isSelected, 'second item is not selected');
        assert.ok(items[2].isSelected, 'third item is selected');
    });

    QUnit.test('Checking arguments of the \'onSelectionChanged\' event when select row', function(assert) {
    // arrange
        const selectionChangedArgs = [];
        const $testElement = $('#treeList');
        const items = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
        ];

        this.options.dataSource = items;
        this.options.expandedRowKeys = [1];
        this.options.selectedRowKeys = [2];
        this.options.onSelectionChanged = function(e) {
            selectionChangedArgs.push(e);
        };
        this.setupTreeList();
        this.rowsView.render($testElement);

        assert.deepEqual(this.option('selectedRowKeys'), [2], 'selected row keys');

        // act
        this.selectRows(1);

        // assert
        assert.strictEqual(selectionChangedArgs.length, 1, 'count call \'onSelectionChanged\' event');
        assert.deepEqual(selectionChangedArgs[0].selectedRowKeys, [1], 'selected row keys');
        assert.deepEqual(selectionChangedArgs[0].selectedRowsData, [items[0]], 'selected rows data');
        assert.deepEqual(selectionChangedArgs[0].currentSelectedRowKeys, [1], 'current selected row keys');
        assert.deepEqual(selectionChangedArgs[0].currentDeselectedRowKeys, [], 'current deselected row keys');
    });

    QUnit.test('Checking arguments of the \'onSelectionChanged\' event when deselect row', function(assert) {
    // arrange
        const selectionChangedArgs = [];
        const $testElement = $('#treeList');
        const items = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
        ];

        this.options.dataSource = items;
        this.options.expandedRowKeys = [1];
        this.options.selectedRowKeys = [1];
        this.options.onSelectionChanged = function(e) {
            selectionChangedArgs.push(e);
        };
        this.setupTreeList();
        this.rowsView.render($testElement);

        assert.deepEqual(this.option('selectedRowKeys'), [1], 'selected row keys');

        // act
        this.deselectRows(2);

        // assert
        assert.strictEqual(selectionChangedArgs.length, 1, 'count call \'onSelectionChanged\' event');
        assert.deepEqual(selectionChangedArgs[0].selectedRowKeys, [3, 4], 'selected row keys');
        assert.deepEqual(selectionChangedArgs[0].selectedRowsData, [items[2], items[3]], 'selected rows data');
        assert.deepEqual(selectionChangedArgs[0].currentSelectedRowKeys, [], 'current selected row keys');
        assert.deepEqual(selectionChangedArgs[0].currentDeselectedRowKeys, [2], 'current deselected row keys');
    });

    QUnit.test('Checking arguments of the \'onSelectionChanged\' event when select/deselect all rows', function(assert) {
    // arrange
        const selectionChangedArgs = [];
        const $testElement = $('#treeList');
        const items = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
        ];

        this.options.dataSource = items;
        this.options.expandedRowKeys = [1];
        this.options.onSelectionChanged = function(e) {
            selectionChangedArgs.push(e);
        };
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectAll();

        // assert
        assert.strictEqual(selectionChangedArgs.length, 1, 'count call \'onSelectionChanged\' event');
        assert.deepEqual(selectionChangedArgs[0].selectedRowKeys, [1], 'selected row keys');
        assert.deepEqual(selectionChangedArgs[0].selectedRowsData, [items[0]], 'selected rows data');
        assert.deepEqual(selectionChangedArgs[0].currentSelectedRowKeys, [1], 'current selected row keys');
        assert.deepEqual(selectionChangedArgs[0].currentDeselectedRowKeys, [], 'current deselected row keys');

        // act
        this.deselectAll();

        // assert
        assert.strictEqual(selectionChangedArgs.length, 2, 'count call \'onSelectionChanged\' event');
        assert.deepEqual(selectionChangedArgs[1].selectedRowKeys, [], 'selected row keys');
        assert.deepEqual(selectionChangedArgs[1].selectedRowsData, [], 'selected rows data');
        assert.deepEqual(selectionChangedArgs[1].currentSelectedRowKeys, [], 'current selected row keys');
        assert.deepEqual(selectionChangedArgs[1].currentDeselectedRowKeys, [1], 'current deselected row keys');
    });

    QUnit.test('getSelectedRowKeys with default parameter', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, parentId: 4, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) }
        ];
        this.options.expandedRowKeys = [1];
        this.options.selectedRowKeys = [2, 4];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act, assert
        assert.deepEqual(this.getSelectedRowKeys(), [2, 4], 'actual selection'); // deprecated in 18.1
    });

    QUnit.test('getSelectedRowKeys with \'leavesOnly\' parameter', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, parentId: 4, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) }
        ];
        this.options.expandedRowKeys = [1];
        this.options.selectedRowKeys = [2, 4];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act, assert
        assert.deepEqual(this.getSelectedRowKeys('leavesOnly'), [2, 5], 'only leaves selected');
    });

    QUnit.test('getSelectedRowKeys with \'all\' parameter', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, parentId: 4, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) }
        ];
        this.options.expandedRowKeys = [1, 4];
        this.options.selectedRowKeys = [2, 3, 4];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act, assert
        assert.deepEqual(this.getSelectedRowKeys('all'), [1, 2, 3, 4, 5], 'all selected items');
    });

    ['withAncestors', 'matchOnly', 'fullBranch'].forEach((filterMode) => {
        // T968435
        QUnit.test(`getSelectedRowKeys with 'all' parameter and filterMode is '${filterMode}' when filtered nodes are at different levels`, function(assert) {
            // arrange
            const $testElement = $('#treeList');

            /* eslint-disable indent */
            this.options.dataSource = [
                { id: 1, field1: 'field1', field2: 1, field3: new Date(2001, 0, 1) },
                    { id: 2, parentId: 1, field1: 'field2', field2: 2, field3: new Date(2002, 1, 2) },
                        { id: 3, parentId: 2, field1: 'test1', field2: 3, field3: new Date(2002, 1, 3) },
                        { id: 4, parentId: 2, field1: 'test2', field2: 4, field3: new Date(2002, 1, 4) },
                    { id: 5, parentId: 1, field1: 'field2', field2: 5, field3: new Date(2002, 1, 5) },
                { id: 6, field1: 'field3', field2: 6, field3: new Date(2002, 1, 6) },
                { id: 7, field1: 'test3', field2: 7, field3: new Date(2002, 1, 7) }
            ];
            /* eslint-enable indent */
            this.options.searchPanel = { text: 'test' };
            this.options.expandNodesOnFiltering = true;
            this.options.filterMode = filterMode;

            this.setupTreeList();
            this.rowsView.render($testElement);

            // act
            this.selectAll();

            // assert
            assert.deepEqual(this.getSelectedRowKeys('all'), [1, 2, 3, 4, 5, 6, 7], 'all selected items');
        });

        // T968433
        QUnit.test(`getSelectedRowKeys with 'all' parameter and filterMode is '${filterMode}' when filtered nodes are at the same level`, function(assert) {
            // arrange
            const $testElement = $('#treeList');

            /* eslint-disable indent */
            this.options.dataSource = [
                { id: 1, field1: 'field1', field2: 1, field3: new Date(2001, 0, 1) },
                    { id: 2, parentId: 1, field1: 'field2', field2: 2, field3: new Date(2002, 1, 2) },
                        { id: 3, parentId: 2, field1: 'field3', field2: 3, field3: new Date(2002, 1, 3) },
                            { id: 4, parentId: 3, field1: 'test1', field2: 4, field3: new Date(2002, 1, 4) },
                            { id: 5, parentId: 3, field1: 'test2', field2: 5, field3: new Date(2002, 1, 5) },
                    { id: 6, parentId: 1, field1: 'field4', field2: 6, field3: new Date(2002, 1, 6) },
                        { id: 7, parentId: 6, field1: 'field5', field2: 7, field3: new Date(2002, 1, 7) },
                    { id: 8, parentId: 1, field1: 'field6', field2: 8, field3: new Date(2002, 1, 8) },
                        { id: 9, parentId: 8, field1: 'field7', field2: 9, field3: new Date(2002, 1, 9) }
            ];
            /* eslint-enable indent */
            this.options.searchPanel = { text: 'test' };
            this.options.expandNodesOnFiltering = true;
            this.options.filterMode = filterMode;

            this.setupTreeList();
            this.rowsView.render($testElement);

            // act
            this.selectAll();

            // assert
            assert.deepEqual(this.getSelectedRowKeys('all'), [1, 2, 3, 4, 5, 6, 7, 8, 9], 'all selected items');
        });
    });

    QUnit.test('getSelectedRowKeys with \'excludeRecursive\' parameter', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, parentId: 4, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) },
            { id: 6, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 7, parentId: 6, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
        ];
        this.options.expandedRowKeys = [1, 4];
        this.options.selectedRowKeys = [2, 5, 7];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act, assert
        assert.deepEqual(this.getSelectedRowKeys('excludeRecursive'), [2, 4, 6], 'all selected items');
    });

    QUnit.test('getSelectedRowsData with mode parameter calls getSelectedRowKeys', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) }
        ];
        this.options.expandedRowKeys = [1];
        this.options.selectedRowKeys = [3];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectionController.getSelectedRowKeys = sinon.spy();
        this.getSelectedRowsData('all');

        // assert
        assert.equal(this.selectionController.getSelectedRowKeys.callCount, 1, 'getSelectedRowKeys is called');
        assert.equal(this.selectionController.getSelectedRowKeys.args[0], 'all', 'getSelectedRowKeys is called with a mode parameter');
    });


    QUnit.test('getSelectedRowsData with mode parameter when key has no data', function(assert) {
    // arrange, act
        const clock = sinon.useFakeTimers();
        const $testElement = $('#treeList');
        const data = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) }
        ];

        this.options.dataSource = {
            load: function() {
                const d = $.Deferred();

                setTimeout(function() {
                    d.resolve(data);
                }, 100);

                return d.promise();
            }
        };
        this.options.expandedRowKeys = [1];
        this.options.selectedRowKeys = [1];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // assert
        assert.deepEqual(this.getSelectedRowsData('leavesOnly'), [], 'empty data');

        // act
        clock.tick(100);

        // assert
        assert.equal(this.getSelectedRowsData('leavesOnly').length, 2, '2 nodes are returned');
        assert.deepEqual(this.getSelectedRowsData('leavesOnly')[0], data[1], 'first child');
        assert.deepEqual(this.getSelectedRowsData('leavesOnly')[1], data[2], 'second child');

        clock.restore();
    });


    QUnit.test('Selection state of rows should be updated on loadDescendants', function(assert) {
    // arrange
        const clock = sinon.useFakeTimers();
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
        ];
        this.options.remoteOperations = true;
        this.options.loadingTimeout = 0;
        this.options.selectedRowKeys = [1];
        this.setupTreeList();
        clock.tick(10);

        this.rowsView.render($testElement);

        // assert
        assert.deepEqual(this.getSelectedRowKeys('leavesOnly'), [], 'leaves');

        // act
        this.loadDescendants();
        clock.tick(10);

        // assert
        assert.deepEqual(this.getSelectedRowKeys('leavesOnly'), [2, 3, 4], 'leaves');
        clock.restore();
    });

    QUnit.test('Checkbox of the parent node should be in an indeterminate state when deselecting child node', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, parentId: 4, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) }
        ];
        this.options.expandedRowKeys = [1];
        this.options.selectedRowKeys = [1];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.deselectRows(2);

        // assert
        const items = this.dataController.items();
        assert.strictEqual(items[0].isSelected, undefined, 'selection state of the first item is indeterminate');
        assert.ok($testElement.find('.dx-checkbox').first().hasClass('dx-checkbox-indeterminate'), 'Checkbox of the first row in an indeterminate state');
    });

    QUnit.test('Update selection after expanding node when \'remoteOperations\' is true', function(assert) {
    // arrange
        let items;
        const $testElement = $('#treeList');

        this.options.remoteOperations = true;
        this.options.selectedRowKeys = [1];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // assert
        items = this.dataController.items();
        assert.strictEqual(items.length, 1, 'count item');
        assert.ok(items[0].isSelected, 'first item is selected');

        // act
        this.expandRow(1);

        // assert
        items = this.dataController.items();
        assert.deepEqual(this.option('selectedRowKeys'), [1], 'selected row keys');
        assert.strictEqual(items.length, 2, 'count item');
        assert.ok(items[0].isSelected, 'first item is selected');
        assert.ok(items[1].isSelected, 'second item is selected');
    });

    QUnit.test('Changing recursive option at runtime - Deselecting row when all rows are selected', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.selection.recursive = false;
        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2001, 0, 2) },
            { id: 3, parentId: 2, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 2, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
        ];
        this.options.expandedRowKeys = [1, 2];
        this.setupTreeList();
        this.rowsView.render($testElement);

        this.selectAll();

        // act
        this.options.selection.recursive = true;
        this.selectionController.optionChanged({ name: 'selection' });
        this.deselectRows(3);

        // assert
        assert.deepEqual(this.option('selectedRowKeys'), [4], 'selectedRowKeys');
    });

    QUnit.test('Deselecting child node when all nodes are selected', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 3, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, parentId: 3, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) },
            { id: 6, parentId: 3, field1: 'test6', field2: 6, field3: new Date(2002, 1, 6) }
        ];

        this.options.expandedRowKeys = [3];
        this.options.selectedRowKeys = [1, 2, 3];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.deselectRows(4);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(this.option('selectedRowKeys'), [1, 2, 5, 6], 'selected row keys');
        assert.ok(items[0].isSelected, 'first item is selected');
        assert.ok(items[1].isSelected, 'second item is selected');
        assert.notOk(items[2].isSelected, 'third item isn\'t selected');
        assert.notOk(items[3].isSelected, 'fourth item isn\'t selected');
        assert.ok(items[4].isSelected, 'fifth item is selected');
        assert.ok(items[5].isSelected, 'sixth item is selected');
    });

    // T550090
    QUnit.test('Select all when end nodes are selected', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2002, 1, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 2, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 3, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) }
        ];

        this.options.selectedRowKeys = [2, 3, 4];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectAll();

        // assert
        assert.deepEqual(this.option('selectedRowKeys'), [2, 3, 4, 5], 'selected row keys');
    });

    // T550090
    QUnit.test('Deselect all after deselecting  -> selecting a nested node', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2002, 1, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 2, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 3, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) }
        ];

        this.options.selectedRowKeys = [1, 5];
        this.setupTreeList();
        this.rowsView.render($testElement);

        this.deselectRows(2);
        this.selectRows(2);

        // act
        this.deselectAll();

        // assert
        assert.deepEqual(this.option('selectedRowKeys'), [], 'selected row keys');
    });

    // T557278
    QUnit.test('SelectRows - onSelectionChanged event should be fired before resolving the Deferred object', function(assert) {
    // arrange
        const $testElement = $('#treeList');
        const done = assert.async();
        let onSelectionChangedFired;

        this.options.dataSource = {
            load: function() {
                const d = $.Deferred();

                setTimeout(function() {
                    d.resolve([
                        { id: 1, field1: 'test1', field2: 1, field3: new Date(2002, 1, 1) },
                        { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
                        { id: 3, parentId: 2, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
                        { id: 4, parentId: 3, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
                        { id: 5, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) }
                    ]);
                }, 30);

                return d.promise();
            }
        };
        this.options.selectedRowKeys = [2, 3];
        this.options.onSelectionChanged = function() {
            onSelectionChangedFired = true;
        };
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectRows(1, true).done(function() {
            assert.ok(onSelectionChangedFired, 'onSelectionChanged event fired');
            done();
        });
    });

    QUnit.test('Selecting a node and its child node', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2002, 1, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) }
        ];
        this.options.expandedRowKeys = [1];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectRows([1, 2]);

        // assert
        const items = this.dataController.items();
        assert.deepEqual(this.option('selectedRowKeys'), [1, 2], 'selected row keys');
        assert.ok(items[0].isSelected, 'first item is selected');
        assert.ok(items[1].isSelected, 'second item is selected');
        assert.ok(items[2].isSelected, 'third item is selected');
    });

    // T560463
    QUnit.test('Select all after filtering data', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 1, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, field1: 'test5', field2: 5, field3: new Date(2001, 0, 5) }
        ];
        this.options.searchPanel = {
            text: 'test2'
        };
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectAll();

        // assert
        assert.deepEqual(this.option('selectedRowKeys'), [1, 4, 5], 'selected row keys');
    });

    // T558153
    QUnit.test('Selection state should be updated correctly after options are changed', function(assert) {
    // arrange
        const $testElement = $('#treeList');
        const clock = sinon.useFakeTimers();

        try {
            this.options.loadingTimeout = 30;
            this.setupTreeList();
            this.rowsView.render($testElement);

            this.options.selectedRowKeys = [2, 4];
            this.options.dataSource = [
                { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
                { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
                { id: 3, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
                { id: 4, parentId: 3, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) }
            ];

            // act
            this.selectionController.optionChanged({ name: 'selectedRowKeys', value: this.options.selectedRowKeys });
            this.dataController.optionChanged({ name: 'dataSource' });
            clock.tick(30);

            // assert
            const items = this.dataController.items();
            assert.strictEqual(items.length, 2, 'count row');
            assert.ok(items[0].isSelected, 'first row is selected');
            assert.ok(items[1].isSelected, 'second row is selected');
        } finally {
            clock.restore();
        }
    });

    QUnit.test('Check selectedRowKeys after deselecting nested node', function(assert) {
    // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2002, 1, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 2, field1: 'test3', field2: 3, field3: new Date(2002, 1, 3) },
            { id: 4, parentId: 3, field1: 'test4', field2: 4, field3: new Date(2002, 1, 4) },
            { id: 5, parentId: 2, field1: 'test5', field2: 5, field3: new Date(2002, 1, 5) },
            { id: 6, parentId: 1, field1: 'test6', field2: 6, field3: new Date(2002, 1, 6) }
        ];

        this.options.selectedRowKeys = [2];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.deselectRows(4);

        // assert
        assert.deepEqual(this.option('selectedRowKeys'), [5], 'selected row keys');
    });

    QUnit.test('focusedItemIndex should be reset to -1 after change page index (T742193)', function(assert) {
    // arrange
        const $testElement = $('#treeList');
        const array = [
            { id: 1, field1: 'test1', field2: 1 },
            { id: 2, field1: 'test2', field2: 2 },
            { id: 3, field1: 'test3', field2: 3 },
            { id: 4, field1: 'test4', field2: 4 }
        ];

        this.options.dataSource = {
            store: {
                type: 'array',
                data: array,
                key: 'id'
            },
            pageSize: 2,
            paginate: true
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectionController.changeItemSelection(1, { shift: true });
        // assert
        assert.deepEqual(this.selectionController.getSelectedRowsData(), [{ id: 2, field1: 'test2', field2: 2 }]);
        assert.equal(this.selectionController._selection._focusedItemIndex, 1, '_focusedItemIndex corrected');

        // act
        this.dataController.pageIndex(1);
        // assert
        assert.equal(this.selectionController._selection._focusedItemIndex, -1, '_focusedItemIndex corrected');
    });

    QUnit.test('Selecting row with key = 0', function(assert) {
        // arrange
        const $testElement = $('#treeList');
        const selectionChangedArgs = [];

        this.options.rootValue = -1;
        this.options.columns = ['id', 'text'];
        this.options.selectedRowKeys = [1];
        this.options.dataSource = [
            { id: 0, parentId: -1, text: 'text a' },
            { id: 1, parentId: 0, text: 'text ab1' },
            { id: 2, parentId: 0, text: 'text ab2' },
            { id: 3, parentId: -1, text: 'text b' }
        ];
        this.options.onSelectionChanged = (e) => {
            selectionChangedArgs.push(e);
        };
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectRows(0, true);

        // assert
        const items = this.dataController.items();
        assert.equal(selectionChangedArgs.length, 1, 'selectionChanged is called once');
        assert.deepEqual(selectionChangedArgs[0].selectedRowKeys, [0], 'selectedItemsKeys');
        assert.deepEqual(selectionChangedArgs[0].currentSelectedRowKeys, [0], 'currentSelectedRowKeys');
        assert.deepEqual(this.option('selectedRowKeys'), [0], 'selected row keys');
        assert.ok(items[0].isSelected, 'first item is selected');
    });

    // T1085491
    QUnit.test('The aria-selected attribute of the parent node should be in an indeterminate state after select child node -> collapse parent node', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.dataSource = [
            { id: 1, field1: 'test1' },
            { id: 2, parentId: 1, field1: 'test2' },
            { id: 3, parentId: 1, field1: 'test3' },
        ];
        this.options.expandedRowKeys = [1];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.selectRows([3]);

        // assert
        let items = this.dataController.items();
        assert.strictEqual(items[0].isSelected, undefined, 'selection state of the first item is indeterminate');
        assert.strictEqual($(this.rowsView.getRowElement(0)).attr('aria-selected'), 'undefined', 'aria-selected attr with \'undefined\' value');

        // act
        this.collapseRow(1);

        // assert
        items = this.dataController.items();
        assert.strictEqual(items[0].isSelected, undefined, 'selection state of the first item is indeterminate');
        assert.strictEqual($(this.rowsView.getRowElement(0)).attr('aria-selected'), 'undefined', 'aria-selected attr with \'undefined\' value');
    });

    // T1196887
    QUnit.test('No exceptions on deselect -> select row when cacheEnabled = false', function(assert) {
        // arrange
        const $testElement = $('#treeList');
        const clock = sinon.useFakeTimers();

        this.options.itemsExpr = 'items';
        this.options.loadingTimeout = 30;
        this.options.cacheEnabled = false;
        this.options.dataStructure = 'tree';
        this.options.dataSource = new Array(100)
            .fill(null)
            .map((_, i) => {
                return {
                    id: i + 1,
                    text: `test${i}`,
                    items: [{ id: i + 101, text: `test${i + 101}` }]
                };
            });
        this.options.selectedRowKeys = new Array(100).fill(null).map((_, index) => index + 1);
        this.setupTreeList();
        clock.tick(100);
        this.rowsView.render($testElement);

        // assert
        assert.ok(this.selectionController.isSelectAll(), 'select all state');

        try {
            // act
            this.selectionController.changeItemSelection(0, {});
            clock.tick(100);
            this.selectionController.changeItemSelection(0, {});
            clock.tick(100);

            // assert
            assert.ok(this.selectionController.isSelectAll(), 'select all state');
        } catch(e) {
            assert.ok(false, 'exception');
        } finally {
            clock.restore();
        }
    });
});

