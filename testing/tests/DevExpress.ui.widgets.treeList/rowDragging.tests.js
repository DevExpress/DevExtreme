QUnit.testStart(function() {
    var markup =
        `<style>
            .qunit-fixture-static {
                position: static !important;
                left: 0 !important;
                top: 0 !important;
            }
        </style>
        <div class="dx-widget dx-treelist">
            <div class="dx-gridbase-container">
                <div id="container"></div>
            </div>
        </div>`;

    $("#qunit-fixture").html(markup);
});

import "common.css!";
import "generic_light.css!";

import "ui/data_grid/ui.data_grid";
import "ui/tree_list/ui.tree_list";

import $ from "jquery";
import pointerMock from "../../helpers/pointerMock.js";
import { setupTreeListModules } from '../../helpers/treeListMocks.js';

var generateData = function(rowCount) {
    let i,
        result = [];

    for(i = 1; i <= rowCount; i = i + 2) {
        result.push({ id: i, parentId: 0, field1: "test" + i, field2: "test" + (i + 1), field3: "test" + (i + 2) });
        result.push({ id: i + 1, parentId: i, field1: "test" + i, field2: "test" + (i + 1), field3: "test" + (i + 2) });
    }

    return result;
};

function createRowsView() {
    var mockTreeList = {
        options: this.options,
        isReady: function() {
            return true;
        },
        $element: function() {
            return $(".dx-treelist");
        },
        element: function() {
            return this.$element();
        }
    };

    setupTreeListModules(mockTreeList, ["data", "columns", "rows", "rowDragging" ], {
        initViews: true
    });

    if(this.treeList) {
        QUnit.assert.ok(false, 'treeList is already created');
    }

    this.treeList = mockTreeList;
    return mockTreeList.rowsView;
}

var moduleConfig = {
    beforeEach: function() {
        $("#qunit-fixture").addClass("qunit-fixture-visible");
        this.options = {
            dataSource: generateData(10),
            autoExpandAll: true,
            keyExpr: "id",
            parentIdExpr: "parentId",
            rootValue: 0,
            columns: ["field1", "field2", "field3"],
            rowDragging: {
                allowReordering: true,
                allowDropInsideItem: true
            }
        };

        this.createRowsView = createRowsView;
    },
    afterEach: function() {
        $("#qunit-fixture").removeClass("qunit-fixture-visible");
        this.treeList && this.treeList.dispose();
    }
};

QUnit.module("Drag and Drop nodes", moduleConfig);

QUnit.test("Drag and drop node", function(assert) {
    // arrange
    let $draggableElement,
        $placeholderElement,
        onDragEndSpy = sinon.spy(),
        $testElement = $("#container");

    this.options.rowDragging.onDragEnd = onDragEndSpy;

    let rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    let pointer = pointerMock(rowsView.getRowElement(0)).start().down().move(0, 70);

    // assert
    $draggableElement = $("body").children(".dx-sortable-dragging");
    $placeholderElement = $("body").children(".dx-sortable-placeholder");
    assert.strictEqual($draggableElement.length, 1, "there is dragging element");
    assert.strictEqual($placeholderElement.length, 1, "placeholder");
    assert.notOk($placeholderElement.hasClass("dx-sortable-placeholder-inside"), "placeholder for dropping inward");
    assert.ok($draggableElement.hasClass("dx-treelist"), "dragging element is treelist");
    assert.strictEqual($draggableElement.find(".dx-data-row").length, 1, "row count in dragging element");

    // act
    pointer.up();

    // assert
    assert.strictEqual(onDragEndSpy.callCount, 1, "onDragEnd event is called");
    assert.notOk(onDragEndSpy.getCall(0).args[0].dropInsideItem, "onDragEnd args - dropInsideItem");
});

QUnit.test("Drag and drop a node into another node", function(assert) {
    // arrange
    let $placeholderElement,
        onDragEndSpy = sinon.spy(),
        $testElement = $("#container");

    this.options.rowDragging.onDragEnd = onDragEndSpy;

    let rowsView = this.createRowsView();
    rowsView.render($testElement);

    // act
    let pointer = pointerMock(rowsView.getRowElement(0)).start().down().move(0, 50);

    // assert
    $placeholderElement = $("body").children(".dx-sortable-placeholder");
    assert.strictEqual($placeholderElement.length, 1, "placeholder");
    assert.ok($placeholderElement.hasClass("dx-sortable-placeholder-inside"), "placeholder for dropping inward");

    // act
    pointer.up();

    // assert
    assert.strictEqual(onDragEndSpy.callCount, 1, "onDragEnd event is called");
    assert.ok(onDragEndSpy.getCall(0).args[0].dropInsideItem, "onDragEnd args - dropInsideItem");
});
