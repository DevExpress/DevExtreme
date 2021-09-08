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
import 'ui/tree_list/ui.tree_list';
import $ from 'jquery';
import { setupTreeListModules } from '../../helpers/treeListMocks.js';

QUnit.module('State Storing', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.setupDataGridModules = function(options) {
            setupTreeListModules(this, ['data', 'columns', 'stateStoring', 'filterRow', 'search', 'selection'], {
                initDefaultOptions: true,
                initViews: true,
                options: $.extend({
                    dataSource: [
                        { id: 1, parentId: 0, name: 'Name 1', age: 17 },
                        { id: 2, parentId: 1, name: 'Name 2', age: 18 },
                        { id: 3, parentId: 2, name: 'Name 3', age: 19 },
                        { id: 4, parentId: 2, name: 'Name 4', age: 20 },
                        { id: 5, parentId: 2, name: 'Name 5', age: 14 },
                        { id: 6, parentId: 0, name: 'test', age: 13 }
                    ],
                    columns: [{ dataField: 'name', dataType: 'string' }, { dataField: 'age', dataType: 'number' }],
                    keyExpr: 'id',
                    parentIdExpr: 'parentId',
                    loadingTimeout: undefined,
                    scrolling: {
                        mode: 'virtual'
                    }
                }, options)
            });
            this.clock.tick();
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    QUnit.test('Apply state storing', function(assert) {
    // arrange

        // act
        this.setupDataGridModules({
            filterRow: { visible: true },
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        columns: [
                            { dataField: 'name' },
                            { dataField: 'age', filterValue: 14, selectedFilterOperation: '>' }
                        ],
                        expandedRowKeys: [1, 2],
                        selectedRowKeys: [3],
                        searchPanel: {
                            text: 'Name'
                        }
                    };
                }
            }
        });

        const rows = this.getVisibleRows();
        assert.strictEqual(rows.length, 4, 'row count');
        assert.strictEqual(rows[0].key, 1, 'key of the first row');
        assert.strictEqual(rows[1].key, 2, 'key of the second row');
        assert.strictEqual(rows[2].key, 3, 'key of the third row');
        assert.ok(rows[2].isSelected, 'third row is selected');
        assert.strictEqual(rows[3].key, 4, 'key of the fourth row');
    });

    QUnit.test('Save user state', function(assert) {
    // arrange
        let state = {};

        // act
        this.setupDataGridModules({
            expandedRowKeys: [1],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return state;
                },
                customSave: function(arg) {
                    state = arg;
                },
                savingTimeout: 0
            }
        });

        // assert
        assert.deepEqual(state, {
            columns: [
                { dataField: 'name', name: 'name', dataType: 'string', visible: true, visibleIndex: 0 },
                { dataField: 'age', name: 'age', dataType: 'number', visible: true, visibleIndex: 1 }
            ],
            filterPanel: {},
            filterValue: null,
            expandedRowKeys: [1],
            pageIndex: 0,
            pageSize: 20,
            searchText: ''
        }, 'state');
    });

    QUnit.test('The expandRowKeys state should not persist when autoExpandAll is enabled', function(assert) {
    // arrange
        let state = {};

        // act
        this.setupDataGridModules({
            autoExpandAll: true,
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return state;
                },
                customSave: function(arg) {
                    state = arg;
                },
                savingTimeout: 0
            }
        });

        // assert
        assert.notOk(Object.prototype.hasOwnProperty.call(state, 'expandedRowKeys'), 'state doesn\'t have expandedRowKeys');
    });

    // T811724, T824333
    QUnit.test('customSave should be fired after expand', function(assert) {
    // arrange
        let state = {
            columns: [
                { visibleIndex: 0, dataField: 'name', name: 'name', dataType: 'string', visible: true },
                { visibleIndex: 1, dataField: 'age', name: 'age', dataType: 'number', visible: true }
            ],
            filterPanel: {},
            filterValue: null,
            expandedRowKeys: [1],
            pageIndex: 0,
            pageSize: 20,
            searchText: ''
        };
        let customSaveCallCount = 0;

        // act
        this.setupDataGridModules({
            expandedRowKeys: [],
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return state;
                },
                customSave: function(arg) {
                    customSaveCallCount++;
                    state = arg;
                },
                savingTimeout: 0
            }
        });

        this.clock.tick();
        assert.strictEqual(customSaveCallCount, 0, 'customSave is not called');

        // act
        this.expandRow(2);
        this.clock.tick();

        // assert
        assert.strictEqual(customSaveCallCount, 1, 'customSave is called once after expandRow');
        assert.deepEqual(state.expandedRowKeys, [1, 2], 'expandedRowKeys in state is correct');
    });

    // T851561
    QUnit.test('The expandedRowKeys should be updated in the state storing when expanding/collapsing nodes', function(assert) {
    // arrange
        let state = {};

        this.setupDataGridModules({
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return state;
                },
                customSave: function(arg) {
                    state = arg;
                },
                savingTimeout: 0
            }
        });

        // act
        this.expandRow(1);
        this.clock.tick();

        // assert
        let expandedRowKeys = this.option('expandedRowKeys');
        assert.deepEqual(expandedRowKeys, [1], 'expandedRowKeys');
        assert.deepEqual(state.expandedRowKeys, [1], 'expandedRowKeys has been updated in the state storage');
        assert.notStrictEqual(state.expandedRowKeys, this.option('expandedRowKeys'), 'expandedRowKeys has a different instance in the state storage');

        // act
        this.collapseRow(1);
        this.clock.tick();

        // assert
        expandedRowKeys = this.option('expandedRowKeys');
        assert.deepEqual(expandedRowKeys, [], 'expandedRowKeys');
        assert.deepEqual(state.expandedRowKeys, [], 'expandedRowKeys has been updated in the state storage');
        assert.notStrictEqual(state.expandedRowKeys, this.option('expandedRowKeys'), 'expandedRowKeys has a different instance in the state storage');
    });
});

