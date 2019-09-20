QUnit.testStart(function() {
    var markup =
    '<!--qunit-fixture-->\
        <div id="container">\
            <div id="treeList">\
            </div>\
        </div>\
    ';

    $("#qunit-fixture").html(markup);
});

import 'common.css!';
import 'generic_light.css!';
import 'ui/tree_list/ui.tree_list';
import $ from 'jquery';
import { setupTreeListModules } from '../../helpers/treeListMocks.js';

QUnit.module("State Storing", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.setupDataGridModules = function(options) {
            setupTreeListModules(this, ["data", "columns", "stateStoring", "filterRow", "search", "selection"], {
                initDefaultOptions: true,
                initViews: true,
                options: $.extend({
                    dataSource: [
                        { id: 1, parentId: 0, name: "Name 1", age: 17 },
                        { id: 2, parentId: 1, name: "Name 2", age: 18 },
                        { id: 3, parentId: 2, name: "Name 3", age: 19 },
                        { id: 4, parentId: 2, name: "Name 4", age: 20 },
                        { id: 5, parentId: 2, name: "Name 5", age: 14 },
                        { id: 6, parentId: 0, name: "test", age: 13 }
                    ],
                    columns: [{ dataField: "name", dataType: "string" }, { dataField: "age", dataType: "number" }],
                    keyExpr: "id",
                    parentIdExpr: "parentId",
                    loadingTimeout: undefined,
                    scrolling: {
                        mode: "virtual"
                    }
                }, options)
            });
            this.clock.tick();
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("Apply state storing", function(assert) {
    // arrange
    var rows;

    // act
    this.setupDataGridModules({
        filterRow: { visible: true },
        stateStoring: {
            enabled: true,
            type: "custom",
            customLoad: function() {
                return {
                    columns: [
                        { dataField: "name" },
                        { dataField: "age", filterValue: 14, selectedFilterOperation: ">" }
                    ],
                    expandedRowKeys: [1, 2],
                    selectedRowKeys: [3],
                    searchPanel: {
                        text: "Name"
                    }
                };
            }
        }
    });

    rows = this.getVisibleRows();
    assert.strictEqual(rows.length, 4, "row count");
    assert.strictEqual(rows[0].key, 1, "key of the first row");
    assert.strictEqual(rows[1].key, 2, "key of the second row");
    assert.strictEqual(rows[2].key, 3, "key of the third row");
    assert.ok(rows[2].isSelected, "third row is selected");
    assert.strictEqual(rows[3].key, 4, "key of the fourth row");
});

QUnit.test("Save user state", function(assert) {
    // arrange
    var state = {};

    // act
    this.setupDataGridModules({
        expandedRowKeys: [1],
        stateStoring: {
            enabled: true,
            type: "custom",
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
            { dataField: "name", dataType: "string", visible: true, visibleIndex: 0 },
            { dataField: "age", dataType: "number", visible: true, visibleIndex: 1 }
        ],
        filterPanel: {},
        filterValue: null,
        expandedRowKeys: [1],
        pageIndex: 0,
        pageSize: 20,
        searchText: ""
    }, "state");
});

QUnit.test("The expandRowKeys state should not persist when autoExpandAll is enabled", function(assert) {
    // arrange
    var state = {};

    // act
    this.setupDataGridModules({
        autoExpandAll: true,
        stateStoring: {
            enabled: true,
            type: "custom",
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
    assert.notOk(Object.prototype.hasOwnProperty.call(state, "expandedRowKeys"), "state doesn't have expandedRowKeys");
});
