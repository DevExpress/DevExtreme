QUnit.testStart(function() {
    const markup =
'<!--qunit-fixture-->\
    <div id="container">\
        <div id="treeList">\
        </div>\
    </div>\
';

    $('#qunit-fixture').html(markup);
});

import 'generic_light.css!';
import '__internal/grids/tree_list/m_widget';
import $ from 'jquery';
import fx from 'common/core/animation/fx';
import { setupTreeListModules } from '../../helpers/treeListMocks.js';
import ArrayStore from 'common/data/array_store';

fx.off = true;

const setupModule = function() {
    const that = this;

    that.options = {
        dataSource: {
            store: {
                type: 'array',
                data: [
                    { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
                    { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }
                ],
                key: 'id'
            }
        },
        columns: [
            { dataField: 'field1', allowEditing: true },
            { dataField: 'field2', allowEditing: true },
            { dataField: 'field3', allowEditing: true }
        ],
        keyExpr: 'id',
        parentIdExpr: 'parentId',
        expandedRowKeys: [],
        editing: {
            mode: 'row',
            allowUpdating: true
        }
    };

    that.setupTreeList = function() {
        setupTreeListModules(that, ['data', 'columns', 'rows', 'selection', 'headerPanel', 'masterDetail', 'editing', 'editingRowBased', 'editingFormBased', 'editingCellBased', 'editorFactory', 'validating', 'errorHandling', 'search'], {
            initViews: true
        });
    };

    this.addRowViaChanges = (parentId, options = {}) => {
        this.expandRow(parentId);
        this.option('editing.changes', [{
            data: { parentId },
            type: 'insert',
            ...options
        }]);
    };

    this.addRowViaMethodOrChanges = (addRowWay, parentId) => {
        (addRowWay === 'changes' ? this.addRowViaChanges : this.addRow)(parentId);
    };

    this.clock = sinon.useFakeTimers();
};

const teardownModule = function() {
    this.dispose();
    this.clock.restore();
};

QUnit.module('Editing', { beforeEach: setupModule, afterEach: teardownModule }, () => {

    QUnit.test('Edit row', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.editRow(0);

        // assert
        const $rowElement = $testElement.find('tbody > tr').first();
        assert.ok($rowElement.hasClass('dx-edit-row'), 'edit row');
        assert.equal($rowElement.find('.dx-texteditor').length, 3, 'count editor');
        assert.ok(!$rowElement.children().first().find('.dx-treelist-icon-container').length, 'hasn\'t expand icon');
    });

    QUnit.test('Edit cell when edit mode is \'batch\'', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch'
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.editCell(0, 0);

        // assert
        const $rowElement = $testElement.find('tbody > tr').first();
        const $cellElement = $rowElement.children().first();
        assert.equal($rowElement.find('.dx-texteditor').length, 1, 'count editor');
        assert.ok($cellElement.hasClass('dx-editor-cell'), 'edit cell');
        assert.ok(!$cellElement.find('.dx-treelist-icon-container').length, 'hasn\'t expand icon');
        assert.ok(!$cellElement.find('.dx-datagrid-text-content').length, 'hasn\'t \'dx-datagrid-text-content\' container');
    });

    QUnit.test('Edit cell when edit mode is \'cell\'', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'cell'
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.editCell(0, 0);

        // assert
        const $rowElement = $testElement.find('tbody > tr').first();
        const $cellElement = $testElement.find('tbody > tr').first().children().first();
        assert.equal($rowElement.find('.dx-texteditor').length, 1, 'count editor');
        assert.ok($cellElement.hasClass('dx-editor-cell'), 'edit cell');
        assert.ok(!$cellElement.find('.dx-treelist-icon-container').length, 'hasn\'t expand icon');
    });

    QUnit.test('Edit form', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'form'
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.editRow(0);

        // assert
        const $rowElement = $testElement.find('tbody > tr').first();
        assert.ok($rowElement.hasClass('dx-treelist-edit-form'), 'edit form');
        assert.equal($rowElement.find('.dx-texteditor').length, 3, 'count editor');
        assert.ok(!$rowElement.find('.dx-treelist-icon-container').length, 'hasn\'t expand icon');
    });

    QUnit.test('Edit popup', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'popup'
        };

        this.setupTreeList();
        this.editingController.component.$element = function() {
            return $('#treeList');
        };

        this.rowsView.render($testElement);

        // act
        this.editRow(0);

        // assert
        const $editPopup = $testElement.find('.dx-treelist-edit-popup');
        const editPopup = $editPopup.dxPopup('instance');
        const $editPopupContent = editPopup.$content();

        assert.equal($editPopup.length, 1, 'edit popup was rendered');
        assert.ok(editPopup.option('visible'), 'Edit popup is visible');
        assert.equal($editPopupContent.find('.dx-texteditor').length, 3, 'editors was rendered');
        assert.ok(!$editPopupContent.find('.dx-treelist-icon-container').length, 'hasn\'t expand icon');
    });

    QUnit.module('Add row', () => {
        QUnit.test('Add row', function(assert) {
            // arrange
            let $rowElements;
            const $testElement = $('#treeList');

            this.setupTreeList();
            this.rowsView.render($testElement);

            // act
            this.addRow();

            // assert
            $rowElements = $testElement.find('tbody > .dx-data-row');
            assert.equal($rowElements.length, 2, 'count data row');
            assert.ok($rowElements.first().hasClass('dx-row-inserted'), 'insert row');

            // act
            $testElement.find('tbody > tr').first().find('input').first().val(666);
            $testElement.find('tbody > tr').first().find('input').first().trigger('change');
            this.saveEditData();

            // assert
            $rowElements = $testElement.find('tbody > .dx-data-row:not(.dx-row-inserted)');
            assert.equal($rowElements.length, 2, 'count data row');

            const items = this.dataController.items();
            assert.equal(items.length, 2, 'count item');
            assert.equal(items[1].rowType, 'data', 'rowType of second item');
            assert.deepEqual(items[1].values, ['666', undefined, undefined, null], 'values of second item');
            assert.equal(items[1].node.children.length, 0, 'count children of second item');
            assert.equal(items[1].level, 0, 'level of second item');
            assert.notOk(items[1].node.parent.key, 'second item hasn\'t parentKey');
        });

        QUnit.test('Edit batch - add links should be rendered in rows when allowAdding is true', function(assert) {
            // arrange, act
            const $testElement = $('#treeList');

            this.options.editing = {
                mode: 'batch',
                allowAdding: true,
                texts: {
                    addRowToNode: 'Add'
                }
            };

            this.setupTreeList();
            this.rowsView.render($testElement);

            // assert
            const $addLinks = $testElement.find('.dx-command-edit .dx-link-add');
            assert.equal($addLinks.length, 1, 'link add is rendered');
            assert.equal($addLinks.text(), 'Add', 'Add link text');
        });

        QUnit.test('Add row to child should call addRow method with parentId', function(assert) {
            // arrange
            const $testElement = $('#treeList');

            this.options.editing.allowAdding = true;
            this.options.editing.texts = { addRowToNode: 'Add' };

            this.setupTreeList();
            this.rowsView.render($testElement);

            this.editingController.addRow = sinon.spy();

            // act
            $testElement.find('.dx-command-edit .dx-link-add').trigger('click');
            this.clock.tick(10);

            // assert
            assert.ok(this.editingController.addRow.calledOnce, 'addRow is called');
            assert.deepEqual(this.editingController.addRow.args[0], [1], 'addRow arg is row key');
        });

        QUnit.test('AddRow method should expand row and add item after parent', function(assert) {
            // arrange
            const $testElement = $('#treeList');

            this.options.editing.allowAdding = true;
            this.options.editing.texts = { addRowToNode: 'Add' };

            this.setupTreeList();
            this.rowsView.render($testElement);

            // act
            this.addRow(1);
            this.clock.tick(10);

            // assert
            const rows = this.getVisibleRows();

            assert.strictEqual(rows.length, 3, 'three rows are rendered');
            assert.strictEqual(rows[0].key, 1, 'row 0');
            assert.strictEqual(rows[0].isExpanded, true, 'row 0 is expanded');
            assert.deepEqual(rows[1].isNewRow, true, 'row 1 is inserted');
            assert.deepEqual(rows[1].data, { parentId: 1 }, 'row 1 data should contains parentId');
            assert.strictEqual(rows[2].key, 2, 'row 2 key');
            assert.strictEqual(rows[2].node.parent.key, 1, 'row 2 node parent');
        });

        QUnit.test('AddRow method should return Deferred with collapsed parent', function(assert) {
            // arrange
            this.options.editing.allowAdding = true;

            this.setupTreeList();
            this.rowsView.render($('#treeList'));
            this.clock.tick(10);

            // assert
            assert.equal(this.getVisibleRows().length, 1, 'one visible row');

            // act
            let doneExecuteCount = 0;
            this.addRow(1).done(() => {
                doneExecuteCount++;
            });
            this.clock.tick(10);

            assert.equal(doneExecuteCount, 1, 'done was executed');
            assert.equal(this.getVisibleRows().length, 3, 'parent was expanded and one more row was added');
        });

        QUnit.test('Sequential adding of a row after adding the previous using Deferred (T844118)', function(assert) {
            // arrange
            const initNewRowCalls = [];

            this.options.editing.allowAdding = true;
            this.options.onInitNewRow = (e) => {
                initNewRowCalls.push(e.data.parentId);
            };

            this.setupTreeList();
            this.rowsView.render($('#treeList'));
            this.clock.tick(10);

            // assert
            assert.equal(this.getVisibleRows().length, 1, '1 visible row');

            // act
            const addRowAfterDeferredResolve = (parentIds, index) => {
                const parentId = parentIds[index];

                if(parentId !== undefined) {
                    return this.addRow(parentId).done(() => addRowAfterDeferredResolve(parentIds, index + 1));
                }

                // assert
                assert.deepEqual(parentIds.slice(0, 1), initNewRowCalls, 'for every added row sequentially calls onInitNewRow');

                return $.Deferred().resolve();
            };

            addRowAfterDeferredResolve([1, 2], 0);

            this.clock.tick(10);
        });

        QUnit.test('AddRow method returns Deferred with using promise in onInitNewRow (T844118)', function(assert) {
            // arrange
            const deferred = $.Deferred();
            this.options.editing.allowAdding = true;
            this.options.onInitNewRow = (e) => {
                e.promise = deferred;
            };

            this.setupTreeList();
            this.rowsView.render($('#treeList'));
            this.clock.tick(10);

            // act
            let isAddRowDone = false;
            this.addRow(1).done(() => isAddRowDone = true);
            this.clock.tick(10);

            // assert
            assert.notOk(isAddRowDone, 'done method has not executed yet');
            deferred.resolve();
            this.clock.tick(10);
            assert.ok(isAddRowDone, 'done method has executed');
        });

        // T553905
        QUnit.test('Add item in node without children (Angular)', function(assert) {
            // arrange
            const $testElement = $('#treeList');

            this.options.editing.allowAdding = true;
            this.options.expandedRowKeys = [1];
            this.options.loadingTimeout = 30;

            this.setupTreeList();
            this.rowsView.render($testElement);

            // act
            this.addRow(2);
            this.dataController.optionChanged({ name: 'expandedRowKeys', value: [1, 2], previousValue: [1, 2] }); // simulate the call from ngDoCheck hook
            this.clock.tick(100);

            // assert
            const rows = this.getVisibleRows();
            assert.strictEqual(rows.length, 3, 'count row');
            assert.strictEqual(rows[0].key, 1, 'key of the first row');
            assert.strictEqual(rows[0].isExpanded, true, 'first row is expanded');
            assert.strictEqual(rows[1].key, 2, 'key of the second row');
            assert.strictEqual(rows[1].node.parent.key, 1, 'parent key of the second row');
            assert.deepEqual(rows[2].isNewRow, true, 'third row is inserted');
            assert.deepEqual(rows[2].data, { parentId: 2 }, 'third row data should contain parentId');
        });

        QUnit.test('AddRow method witout parameters should add item at begin', function(assert) {
            // arrange
            const $testElement = $('#treeList');

            this.options.rootValue = 0;
            this.options.editing.allowAdding = true;
            this.options.editing.texts = { addRowToNode: 'Add' };

            this.setupTreeList();
            this.rowsView.render($testElement);

            // act
            this.addRow();
            this.clock.tick(10);

            // assert
            const rows = this.getVisibleRows();

            assert.strictEqual(rows.length, 2, 'rows count');
            assert.deepEqual(rows[0].isNewRow, true, 'row 0 is inserted');
            assert.deepEqual(rows[0].data, { parentId: 0 }, 'row 0 data should contains parentId');
            assert.strictEqual(rows[1].key, 1, 'row 1');
            assert.strictEqual(rows[1].isExpanded, false, 'row 1 is not expanded');
        });

        QUnit.test('AddRow method witout parameters should add item at begin if rootValue is defined', function(assert) {
            // arrange
            const $testElement = $('#treeList');

            this.options.rootValue = 0;
            this.options.dataSource.store.data[0].parentId = 0;
            this.options.editing.allowAdding = true;
            this.options.editing.texts = { addRowToNode: 'Add' };

            this.setupTreeList();
            this.rowsView.render($testElement);

            // act
            this.addRow();
            this.clock.tick(10);

            // assert
            const rows = this.getVisibleRows();

            assert.strictEqual(rows.length, 2, 'rows count');
            assert.deepEqual(rows[0].isNewRow, true, 'row 0 is inserted');
            assert.deepEqual(rows[0].data, { parentId: 0 }, 'row 0 data should contains parentId');
            assert.strictEqual(rows[1].key, 1, 'row 1');
            assert.strictEqual(rows[1].isExpanded, false, 'row 1 is not expanded');
        });

        ['method', 'changes'].forEach(addRowWay => {
            QUnit.test(`Inserted row should not be reset after collapsing when editing mode is row (adding via ${addRowWay})`, function(assert) {
            // arrange
                const $testElement = $('#treeList');

                this.options.editing.allowAdding = true;

                this.setupTreeList();
                this.rowsView.render($testElement);

                // act
                this.addRowViaMethodOrChanges(addRowWay, 1);
                this.clock.tick(10);

                this.collapseRow(1);

                // assert
                let rows = this.getVisibleRows();
                assert.strictEqual(rows.length, 1, 'one row is rendered');
                assert.strictEqual(rows[0].key, 1, 'row 0 key');
                assert.notOk(rows[0].isNewRow, 'row 0 is not inserted');
                assert.equal(this.option('editing.changes').length, 1, 'changes are not reset');

                // act
                this.expandRow(1);

                // assert
                rows = this.getVisibleRows();
                assert.strictEqual(rows.length, 3, 'three rows are rendered');
                assert.strictEqual(rows[0].key, 1, 'row 0 key');
                assert.ok(rows[1].isNewRow, 'row 1 is inserted');
                assert.equal(this.option('editing.changes').length, 1, 'changes are not reset');
            });

            QUnit.test(`Inserted child row should change it's rowIndex when sorting is applied (adding via ${addRowWay})`, function(assert) {
            // arrange
                const $testElement = $('#treeList');

                this.options.dataSource.store.data[1].parentId = undefined;
                this.options.editing.allowAdding = true;

                this.setupTreeList();
                this.rowsView.render($testElement);

                // act
                this.addRowViaMethodOrChanges(addRowWay, 1);
                this.clock.tick(10);

                this.columnOption('field2', 'sortOrder', 'desc');

                // assert
                let rows = this.getVisibleRows();
                assert.strictEqual(rows.length, 3, 'three rows are rendered');
                assert.strictEqual(rows[0].key, 2, 'first row key');
                assert.strictEqual(rows[1].key, 1, 'second row key');
                assert.ok(rows[1].isExpanded, 'second row is expanded');
                assert.ok(rows[2].isNewRow, 'third row is new row');

                // act
                this.columnOption('field2', 'sortOrder', 'asc');

                // assert
                rows = this.getVisibleRows();
                assert.strictEqual(rows.length, 3, 'three rows are rendered');
                assert.strictEqual(rows[0].key, 1, 'first row key');
                assert.ok(rows[0].isExpanded, 'first row is expanded');
                assert.ok(rows[1].isNewRow, 'second row is new row');
                assert.strictEqual(rows[2].key, 2, 'third row key');
            });

            QUnit.test(`Inserted child row should not disappear when filter is applied and reset (adding via ${addRowWay})`, function(assert) {
            // arrange
                const $testElement = $('#treeList');

                this.options.dataSource.store.data[1].parentId = undefined;
                this.options.editing.allowAdding = true;

                this.setupTreeList();
                this.rowsView.render($testElement);

                // act
                this.addRowViaMethodOrChanges(addRowWay, 1);
                this.clock.tick(10);

                this.filter([]);

                // assert
                let rows = this.getVisibleRows();
                assert.strictEqual(rows.length, 0, 'rows are not rendered');

                // act
                this.filter(null);

                // assert
                rows = this.getVisibleRows();
                assert.strictEqual(rows.length, 3, 'three rows are rendered');
                assert.strictEqual(rows[0].key, 1, 'first row key');
                assert.ok(rows[0].isExpanded, 'first row is expanded');
                assert.ok(rows[1].isNewRow, 'second row is new row');
                assert.strictEqual(rows[2].key, 2, 'third row key');
            });
        });

        QUnit.test('Add row to the end via changes with index = -1', function(assert) {
            // arrange
            const $testElement = $('#treeList');

            this.options.dataSource.store.data[1].parentId = undefined;
            this.options.editing.allowAdding = true;

            this.setupTreeList();
            this.rowsView.render($testElement);

            // act
            this.addRowViaChanges(undefined, { insertAfterKey: 2 });
            this.clock.tick(10);

            // assert
            const rows = this.getVisibleRows();
            assert.strictEqual(rows.length, 3, 'three rows are rendered');
            assert.strictEqual(rows[0].key, 1, 'first row key');
            assert.strictEqual(rows[1].key, 2, 'second row key');
            assert.ok(rows[2].isNewRow, 'third row is new row');
        });

        // T1021047
        QUnit.test('The addRow method should work correctly when parentId is set at the onInitNewRow event', function(assert) {
            // arrange
            this.options.editing.allowAdding = true;
            this.options.onInitNewRow = (e) => {
                e.data.parentId = 1;
            };

            this.setupTreeList();
            this.rowsView.render($('#treeList'));
            this.clock.tick(10);

            // act
            this.addRow();
            this.clock.tick(10);

            // assert
            const items = this.getVisibleRows();
            assert.strictEqual(items.length, 3, 'three rows are rendered');
            assert.strictEqual(items[0].key, 1, 'first row key');
            assert.ok(items[1].isNewRow, 'second row is new row');
            assert.strictEqual(items[2].key, 2, 'third row key');
        });
    });

    QUnit.test('Edit cell on row click', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch',
            allowUpdating: true
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        $testElement.find('tbody td').first().trigger('dxclick');

        // assert
        assert.ok($testElement.find('tbody td').first().hasClass('dx-editor-cell'), 'edit cell');
    });

    QUnit.test('Editing with validation - save edit data', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch'
        };
        this.options.columns[0].validationRules = [{ type: 'required' }];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.cellValue(0, 0, '666');
        this.saveEditData();

        // assert
        const items = this.getDataSource().items();
        const $cellElement = $testElement.find('tbody > .dx-data-row').first().children().first();
        assert.notOk($cellElement.hasClass('dx-treelist-invalid'), 'first cell value isn\'t valid');
        assert.equal(items[0].data.field1, '666');
    });

    QUnit.test('Editing with validation - not save edit data when there are invalid', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch'
        };
        this.options.columns[0].validationRules = [{ type: 'required' }];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.cellValue(0, 0, '');
        this.saveEditData();

        // assert
        const items = this.getDataSource().items();
        const $cellElement = $testElement.find('tbody > .dx-data-row').first().children().first();
        assert.ok($cellElement.hasClass('dx-treelist-invalid'), 'first cell value isn\'t valid');
        assert.equal(items[0].data.field1, 'test1');
    });

    QUnit.test('Editing with validation - show error row on save edit data', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch'
        };
        this.options.onRowValidating = function(options) {
            options.errorText = 'Test';
        };
        this.options.columns[0].validationRules = [{ type: 'required' }];
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.cellValue(0, 0, '');
        this.saveEditData();

        // assert
        const $rowElements = $testElement.find('tbody > tr');
        assert.equal($rowElements.length, 3, 'count row (data row + error row + freespace row)');
        assert.ok($rowElements.eq(0).hasClass('dx-data-row'), 'data row');
        assert.ok($rowElements.eq(1).hasClass('dx-error-row'), 'error row');
        assert.ok($rowElements.eq(2).hasClass('dx-freespace-row'), 'freespace row');
    });

    QUnit.test('Save edit data - exception when key is not specified in a store', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch'
        };
        this.options.dataSource = {
            store: {
                type: 'array',
                data: [
                    { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
                    { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }
                ]
            }
        };
        this.setupTreeList();
        this.rowsView.render($testElement);
        this.cellValue(0, 0, 666);

        // act, assert
        try {
            this.saveEditData();
            assert.ok(false, 'exception should be rised');
        } catch(e) {
            assert.ok(e.message.indexOf('E1045') >= 0, 'name of error');
        }
    });

    QUnit.test('Delete data - exception when key is not specified in a store', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch'
        };
        this.options.dataSource = {
            store: {
                type: 'array',
                data: [
                    { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
                    { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }
                ]
            }
        };
        this.setupTreeList();
        this.rowsView.render($testElement);
        this.deleteRow(0);

        // act, assert
        try {
            this.saveEditData();
            assert.ok(false, 'exception should be rised');
        } catch(e) {
            assert.ok(e.message.indexOf('E1045') >= 0, 'name of error');
        }
    });

    QUnit.test('Insert data - no exception when key is not specified in a store', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.rootValue = 0;
        this.options.editing = {
            mode: 'batch'
        };
        this.options.dataSource = {
            store: {
                type: 'array',
                data: [
                    { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
                    { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) }
                ]
            }
        };
        this.setupTreeList();
        this.rowsView.render($testElement);
        this.addRow();

        // act
        this.saveEditData();

        // assert
        assert.ok(true, 'not exception');
    });

    QUnit.test('Edit cell when edit mode is \'batch\' and multiple selection is enabled', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch'
        };
        this.options.selection = {
            mode: 'multiple',
            showCheckBoxesMode: 'always'
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.editCell(0, 0);

        // assert
        const $cellElement = $testElement.find('tbody > tr').first().children().first();
        assert.ok(!$cellElement.find('.dx-select-checkbox').length, 'hasn\'t checkbox');
    });

    // T514550
    QUnit.test('Edit batch - inserted row should not have add link', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch',
            allowAdding: true
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.addRow();

        // assert
        const $commandEditCellElement = $testElement.find('tbody > .dx-row-inserted').first().find('.dx-command-edit');
        assert.equal($commandEditCellElement.length, 1, 'has command edit cell');
        assert.equal($commandEditCellElement.find('.dx-link-add').length, 0, 'link add isn\'t rendered');
    });

    QUnit.test('Edit batch - removed row should not have add link', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch',
            allowAdding: true
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.deleteRow(0);

        // assert
        const $commandEditCellElement = $testElement.find('tbody > .dx-row-removed').first().find('.dx-command-edit');
        assert.equal($commandEditCellElement.length, 1, 'has command edit cell');
        assert.equal($commandEditCellElement.find('.dx-link-add').length, 0, 'link add isn\'t rendered');
    });

    QUnit.test('Edit row with useIcons is true', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.editing = {
            mode: 'row',
            allowAdding: true,
            useIcons: true,
            texts: {
                addRowToNode: 'Add'
            }
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // assert
        const $editCellElement = $testElement.find('tbody > tr').first().children().last();
        assert.ok($editCellElement.hasClass('dx-command-edit-with-icons'), 'the edit cell has icons');
        assert.strictEqual($editCellElement.find('.dx-link').length, 1, 'icon count');
        assert.ok($editCellElement.find('.dx-link').hasClass('dx-icon-add'), 'icon add');
        assert.strictEqual($editCellElement.find('.dx-icon-add').attr('title'), 'Add', 'title of the icon add');
        assert.strictEqual($editCellElement.find('.dx-icon-add').text(), '', 'text of the icon add');
    });

    // T633865
    QUnit.test('Add row when \'keyExpr\' and \'parentIdExpr\' options are specified as functions', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.rootValue = 0;
        this.options.dataSource = this.options.dataSource.store.data;
        this.options.keyExpr = function(data) { return data['id']; };
        this.options.parentIdExpr = function(data, value) {
            if(arguments.length === 1) {
                return data['parentId'];
            }
            data['parentId'] = value;
        };
        this.options.editing = {
            mode: 'cell',
            allowAdding: true
        };
        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.addRow();

        // assert
        const $rowElements = $testElement.find('tbody > .dx-data-row');
        assert.equal($rowElements.length, 2, 'count data row');
        assert.ok($rowElements.first().hasClass('dx-row-inserted'), 'insert row');
        assert.strictEqual(this.getVisibleRows()[0].data.parentId, 0, 'parentId of an inserted row');
    });

    QUnit.test('TreeList should show error message on adding row if dataSource is not specified (T711831)', function(assert) {
        // arrange
        let errorCode;
        let widgetName;

        this.options.dataSource = undefined;
        this.setupTreeList();

        this.rowsView.render($('#treeList'));
        this.getController('data').fireError = function() {
            errorCode = arguments[0];
            widgetName = arguments[1];
        };

        // act
        const deferred = this.addRow();

        // assert
        assert.equal(errorCode, 'E1052', 'error code');
        assert.equal(widgetName, 'dxTreeList', 'widget name');
        assert.equal(deferred.state(), 'rejected', 'deferred is rejected');
    });

    QUnit.test('Set add button for a specific row', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.expandedRowKeys = [1];
        this.options.editing = {
            mode: 'row',
            allowAdding: function(options) {
                return options.row.rowIndex % 2 === 0;
            }
        };
        this.setupTreeList();

        // act
        this.rowsView.render($testElement);

        // assert
        const $rowElements = $testElement.find('.dx-treelist-rowsview tbody > .dx-data-row');
        assert.strictEqual($rowElements.length, 2, 'row count');
        assert.strictEqual($rowElements.eq(0).find('.dx-link-add').length, 1, 'first row has the add link');
        assert.strictEqual($rowElements.eq(1).find('.dx-link-add').length, 0, 'second row hasn\'t the add link');
    });

    // T690119
    QUnit.test('Edit cell - The editable cell should be closed after click on expand button', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'cell',
            allowUpdating: true
        };
        this.options.loadingTimeout = 0;
        this.options.dataSource = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 2, field1: 'test3', field2: 3, field3: new Date(2003, 2, 3) }
        ];
        this.setupTreeList();
        this.clock.tick(10);
        this.rowsView.render($testElement);

        this.editCell(0, 0);
        this.clock.tick(10);

        // assert
        assert.strictEqual($(this.getCellElement(0, 0)).find('.dx-texteditor').length, 1, 'has editor');

        // act
        $(this.getCellElement(1, 0)).find('.dx-treelist-collapsed').trigger('dxpointerdown');
        $(this.getCellElement(1, 0)).find('.dx-treelist-collapsed').trigger('dxclick');
        this.clock.tick(10);

        // assert
        assert.strictEqual($(this.getCellElement(0, 0)).find('.dx-texteditor').length, 0, 'hasn\'t editor');
    });

    // T697344
    QUnit.test('Removing a selected row should not throw an exception', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.editing = {
            mode: 'row',
            allowDeleting: true
        };
        this.options.selection = { mode: 'multiple' };
        this.options.selectedRowKeys = [1];

        this.setupTreeList();
        this.rowsView.render($testElement);

        try {
        // act
            this.deleteRow(0);

            // assert
            assert.strictEqual(this.getVisibleRows().length, 0);
        } catch(e) {
            assert.ok(false, 'exception');
        }
    });

    QUnit.test('Selection should be updated correctly after deleting a nested node', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.editing = {
            mode: 'row',
            allowDeleting: true
        };
        this.options.selection = { mode: 'multiple', recursive: true };
        this.options.selectedRowKeys = [2];
        this.options.expandedRowKeys = [1];
        this.options.dataSource.store.data = [
            { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
            { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
            { id: 3, parentId: 2, field1: 'test3', field2: 3, field3: new Date(2003, 2, 3) },
            { id: 4, parentId: 1, field1: 'test4', field2: 4, field3: new Date(2004, 3, 4) }
        ];

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.deleteRow(1);

        // assert
        assert.strictEqual(this.isRowSelected(1), false, 'first node is not selected');
    });

    QUnit.test('Batch mode - Editing should not work when double-clicking on the select checkbox (startEditAction is dblClick)', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch',
            allowUpdating: true,
            startEditAction: 'dblClick'
        };
        this.options.selection = {
            mode: 'multiple',
            showCheckBoxesMode: 'always'
        };

        this.setupTreeList();
        this.rowsView.render($testElement);
        sinon.spy(this.editingController, 'editCell');

        // act
        $(this.getCellElement(0, 0)).find('.dx-select-checkbox').trigger('dxdblclick');

        // assert
        assert.strictEqual(this.editingController.editCell.callCount, 0, 'count call editCell');
        assert.notOk($(this.getCellElement(0, 0)).hasClass('dx-editor-cell'), 'cell isn\'t editable');
    });

    // T1023019
    QUnit.test('Batch mode - The checkbox should not be rendered for a new row', function(assert) {
        // arrange
        const $testElement = $('#treeList');

        this.options.editing = {
            mode: 'batch',
            allowUpdating: true
        };
        this.options.selection = {
            mode: 'multiple',
            showCheckBoxesMode: 'always'
        };

        this.setupTreeList();
        this.rowsView.render($testElement);

        // act
        this.addRow();
        this.clock.tick(10);

        // assert
        let $newRowElement = $testElement.find('tbody > .dx-data-row').first();
        assert.ok($newRowElement.hasClass('dx-row-inserted'), 'insert row');

        // act
        $newRowElement.find('td').eq(1).trigger('dxclick');
        this.clock.tick(10);

        // assert
        $newRowElement = $testElement.find('tbody > .dx-data-row').first();
        const $inputElement = $newRowElement.find('td').eq(1).find('.dx-texteditor-input');
        assert.strictEqual($inputElement.length, 1, 'second cell has input');
        assert.ok($inputElement.is(':focus'), 'second cell is focused');

        const $selectCheckbox = $newRowElement.find('td').first().find('.dx-select-checkbox');
        assert.strictEqual($selectCheckbox.length, 0, 'first cell has not checkbox');
    });

    [false, true].forEach(function(remoteOperations) {
    // T836724
        QUnit.test('The added nodes should be displayed when there is a filter and remoteOperations is ' + remoteOperations, function(assert) {
            // arrange
            let $rowElements;

            const $testElement = $('#treeList');

            const store = new ArrayStore({
                data: [
                    { id: 1, field1: 'test1', field2: 1, field3: new Date(2001, 0, 1) },
                    { id: 2, parentId: 1, field1: 'test2', field2: 2, field3: new Date(2002, 1, 2) },
                    { id: 3, field1: 'test3', field2: 3, field3: new Date(2001, 0, 3) },
                ],
                key: 'id'
            });

            this.options.expandedRowKeys = [1];
            this.options.remoteOperations = remoteOperations;
            this.options.filterMode = 'fullBranch';
            this.options.searchPanel = {
                visible: true,
                text: 'test1'
            },
            this.options.editing = {
                mode: 'cell',
                allowAdding: true
            };
            this.options.dataSource = {
                load: (loadOptions) => store.load(loadOptions),
                insert: (values) => store.insert(values)
            };
            this.setupTreeList();
            this.rowsView.render($testElement);

            // assert
            $rowElements = $testElement.find('tbody > .dx-data-row');
            assert.strictEqual($rowElements.length, 2, 'row count');

            // act
            this.addRow(1);
            this.saveEditData();

            // assert
            $rowElements = $testElement.find('tbody > .dx-data-row');
            assert.strictEqual($rowElements.length, 3, 'row count');

            // act
            this.addRow(1);
            this.saveEditData();

            // assert
            $rowElements = $testElement.find('tbody > .dx-data-row');
            assert.strictEqual($rowElements.length, 4, 'row count');
        });
    });
});

['reshape', 'repaint'].forEach(function(refreshMode) {
    QUnit.module('Refresh mode ' + refreshMode, {
        beforeEach: function() {
            const that = this;

            that.loadingCount = 0;

            that.options = {
                dataSource: {
                    store: {
                        type: 'array',
                        onLoading: function() {
                            that.loadingCount++;
                        },
                        data: [
                            { id: 1, field1: 'test1', hasItems: true },
                            { id: 2, parentId: 1, field1: 'test2', hasItems: false }
                        ],
                        key: 'id'
                    }
                },
                remoteOperations: { filtering: true },
                columns: [
                    { dataField: 'id', allowEditing: true },
                    { dataField: 'field1', allowEditing: true }
                ],
                keyExpr: 'id',
                parentIdExpr: 'parentId',
                hasItemsExpr: 'hasItems',
                expandedRowKeys: [],
                editing: {
                    refreshMode: refreshMode,
                    mode: 'row'
                }
            };

            that.setupTreeList = function() {
                setupTreeListModules(that, ['data', 'columns', 'rows', 'editing', 'editingCellBased', 'editorFactory', 'search'], {
                    initViews: true
                });
            };
            this.clock = sinon.useFakeTimers();
        }, afterEach: teardownModule }, () => {

        QUnit.test('Insert row to leaf', function(assert) {
            // arrange
            this.setupTreeList();
            this.expandRow(1);
            this.loadingCount = 0;

            // act
            this.addRow(2);
            this.clock.tick(10);
            this.cellValue(2, 'field1', 'added');
            this.saveEditData();

            // assert
            const rows = this.getVisibleRows();
            assert.equal(this.loadingCount, 0, 'loading count is not changed');
            assert.equal(rows.length, 3, 'row count');
            assert.ok(rows[1].node.hasChildren, 'row 1 node hasChildren');
            assert.ok(rows[1].data.hasItems, 'row 1 hasItems is updated');
            assert.equal(rows[2].data.field1, 'added', 'row 2 data is updated');
            assert.equal(rows[2].node.parent, rows[1].node, 'row 2 node parent');
        });

        QUnit.test('Insert row to root', function(assert) {
            // arrange
            this.setupTreeList();
            this.expandRow(1);
            this.loadingCount = 0;

            // act
            this.addRow();
            this.clock.tick(10);
            this.cellValue(0, 'field1', 'added');
            this.saveEditData();

            // assert
            const rows = this.getVisibleRows();
            const insertIndex = refreshMode === 'reshape' ? 2 : 0;
            assert.equal(this.loadingCount, 0, 'loading count is not changed');
            assert.equal(rows.length, 3, 'row count');
            assert.equal(rows[insertIndex].data.field1, 'added', 'row 2 data is updated');
            assert.equal(rows[insertIndex].node.parent, this.getRootNode(), 'row 2 node parent');
        });

        QUnit.test('Remove leaf node', function(assert) {
            // arrange
            this.setupTreeList();
            this.expandRow(1);
            this.loadingCount = 0;

            // act
            this.deleteRow(1);
            this.clock.tick(10);
            this.saveEditData();

            // assert
            const rows = this.getVisibleRows();
            assert.strictEqual(this.loadingCount, 0, 'loading count is not changed');
            assert.strictEqual(rows.length, 1, 'row count');
            assert.strictEqual(rows[0].node.hasChildren, false, 'row 0 node hasChildren');
            assert.strictEqual(rows[0].data.hasItems, false, 'row 0 hasItems');
        });

        QUnit.test('Remove node with children', function(assert) {
            // arrange
            this.setupTreeList();
            this.expandRow(1);
            this.getDataSource().store().insert({ id: 3, field1: 'test3', hasItems: false });
            this.refresh();
            this.loadingCount = 0;

            // act
            this.deleteRow(0);
            this.clock.tick(10);
            this.saveEditData();

            // assert
            const rows = this.getVisibleRows();
            assert.strictEqual(this.loadingCount, 0, 'loading count is not changed');
            assert.strictEqual(rows.length, 1, 'row count');
            assert.strictEqual(rows[0].key, 3, 'row 2 id');
            assert.strictEqual(rows[0].node.hasChildren, false, 'row 0 node hasChildren');
            assert.strictEqual(rows[0].data.hasItems, false, 'row 0 hasItems');
        });

        QUnit.test('Update node', function(assert) {
            // arrange
            this.setupTreeList();
            this.expandRow(1);
            this.loadingCount = 0;

            // act
            this.cellValue(1, 'field1', 'updated');
            this.saveEditData();

            // assert
            const rows = this.getVisibleRows();
            assert.strictEqual(this.loadingCount, 0, 'loading count is not changed');
            assert.strictEqual(rows.length, 2, 'row count');
            assert.strictEqual(rows[1].data.field1, 'updated', 'row 0 data is updated');
            assert.deepEqual(rows[1].values, [2, 'updated'], 'row 0 values are updated');
        });

        QUnit.test('Push insert with index 0', function(assert) {
            // arrange
            this.setupTreeList();
            this.expandRow(1);
            this.loadingCount = 0;

            // act
            this.getDataSource().store().push([{ type: 'insert', data: { id: 3, parentId: 1, field1: 'test3', hasItems: false }, index: 0 }]);
            this.clock.tick(10);

            // assert
            const rows = this.getVisibleRows();
            assert.strictEqual(this.loadingCount, 0, 'loading count is not changed');
            assert.strictEqual(rows.length, 3, 'row count');
            assert.strictEqual(rows[0].node.children.length, 2, 'row 0 children count');
            assert.strictEqual(rows[1].data.field1, 'test3', 'row 2 data is updated');
            assert.strictEqual(rows[1].node.parent, rows[0].node, 'row 2 node parent');
        });

        QUnit.test('Push insert with index -1', function(assert) {
            // arrange
            this.setupTreeList();
            this.expandRow(1);
            this.loadingCount = 0;

            // act
            this.getDataSource().store().push([{ type: 'insert', data: { id: 3, parentId: 1, field1: 'test3', hasItems: false }, index: -1 }]);
            this.clock.tick(10);

            // assert
            const rows = this.getVisibleRows();
            assert.strictEqual(this.loadingCount, 0, 'loading count is not changed');
            assert.strictEqual(rows.length, 3, 'row count');
            assert.strictEqual(rows[0].node.children.length, 2, 'row 0 children count');
            assert.strictEqual(rows[2].data.field1, 'test3', 'row 2 data is updated');
            assert.strictEqual(rows[2].node.parent, rows[0].node, 'row 2 node parent');
        });

        QUnit.test('Push insert with index more then children count', function(assert) {
            // arrange
            this.setupTreeList();
            this.expandRow(1);
            this.loadingCount = 0;

            // act
            this.getDataSource().store().push([{ type: 'insert', data: { id: 3, parentId: 1, field1: 'test3', hasItems: false }, index: 10 }]);
            this.clock.tick(10);

            // assert
            const rows = this.getVisibleRows();
            assert.strictEqual(this.loadingCount, 0, 'loading count is not changed');
            assert.strictEqual(rows.length, 3, 'row count');
            assert.strictEqual(rows[0].node.children.length, 2, 'row 0 children count');
            assert.strictEqual(rows[2].data.field1, 'test3', 'row 2 data is updated');
            assert.strictEqual(rows[2].node.parent, rows[0].node, 'row 2 node parent');
        });

        QUnit.test('Push insert to recently inserted node', function(assert) {
            // arrange
            this.options.dataSource.store.data = [
                { id: 1, field1: 'test1', },
            ];
            this.setupTreeList();

            // act
            this.getDataSource().store().push([{ type: 'insert', data: { id: 2, field1: 'test2' }, index: 2 }]);
            this.clock.tick(10);
            this.getDataSource().store().push([{ type: 'insert', data: { id: 3, field1: 'test3', parentId: 2 }, index: 3 }]);
            this.clock.tick(10);

            // assert
            let rows = this.getVisibleRows();
            assert.strictEqual(rows.length, 2);
            assert.strictEqual(rows[1].node.children.length, 1);
            assert.ok(rows[1].node.hasChildren);

            // act
            this.expandRow(1);
            this.clock.tick(10);

            // assert
            rows = this.getVisibleRows();
            assert.strictEqual(rows.length, 2);
        });

        QUnit.test('Push insert without index', function(assert) {
            // arrange
            this.options.dataSource.store.data = [
                { id: 1, field1: 'test1', },
            ];
            this.setupTreeList();

            // act
            this.getDataSource().store().push([{ type: 'insert', data: { id: 2, field1: 'test2', parentId: 1 } }]);
            this.clock.tick(10);
            // assert
            let rows = this.getVisibleRows();
            assert.strictEqual(rows.length, 1);
            assert.strictEqual(rows[0].node.children.length, 1);
            assert.ok(rows[0].node.hasChildren);

            // act
            this.expandRow(1);
            this.clock.tick(10);

            // assert
            rows = this.getVisibleRows();
            assert.strictEqual(rows.length, 2);

            // act
            this.getDataSource().store().push([{ type: 'insert', data: { id: 3, field1: 'test3', parentId: 1 } }]);
            this.clock.tick(10);

            rows = this.getVisibleRows();
            assert.strictEqual(rows.length, 3);


        });

        // T836724
        QUnit.test('The added nodes should be displayed when there is a filter', function(assert) {
            // arrange
            let $rowElements;

            const $testElement = $('#treeList');

            this.options.expandedRowKeys = [1];
            this.options.filterMode = 'fullBranch';
            this.options.searchPanel = {
                visible: true,
                text: 'test1'
            },
            this.options.editing = {
                refreshMode: refreshMode,
                mode: 'cell',
                allowAdding: true
            };
            this.options.dataSource.store.data = [
                { id: 1, field1: 'test1' },
                { id: 2, parentId: 1, field1: 'test2' },
                { id: 3, field1: 'test3' },
            ];
            this.setupTreeList();
            this.rowsView.render($testElement);

            // assert
            $rowElements = $testElement.find('tbody > .dx-data-row');
            assert.strictEqual($rowElements.length, 2, 'row count');

            // act
            this.addRow(1);
            this.saveEditData();

            // assert
            $rowElements = $testElement.find('tbody > .dx-data-row');
            assert.strictEqual($rowElements.length, 3, 'row count');

            // act
            this.addRow(1);
            this.saveEditData();

            // assert
            $rowElements = $testElement.find('tbody > .dx-data-row');
            assert.strictEqual($rowElements.length, 4, 'row count');
        });
    });
});
