"use strict";

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

require("common.css!");
require("generic_light.css!");
require("ui/tree_list/ui.tree_list");

var $ = require("jquery"),
    fx = require("animation/fx"),
    treeListMocks = require("../../helpers/treeListMocks.js"),
    setupTreeListModules = treeListMocks.setupTreeListModules;

fx.off = true;

var setupModule = function() {
    var that = this;

    that.options = {};
    that.columns = [
        { caption: 'Column 1', visible: true },
        { caption: 'Column 2', visible: true },
        { caption: 'Column 3', visible: true }
    ];

    that.setupTreeList = function() {
        setupTreeListModules(that, ["data", "columns", "headerPanel", "editing", "columnChooser"], {
            initViews: true,
            controllers: {
                columns: new treeListMocks.MockColumnsController(that.columns),
                data: new treeListMocks.MockDataController({ items: [] })
            }
        });
    };
};

var teardownModule = function() {
    this.dispose();
};

QUnit.module("Header panel", { beforeEach: setupModule, afterEach: teardownModule });

QUnit.test("Draw edit buttons", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.editing = {
        mode: "batch",
        allowUpdating: true,
        allowAdding: true
    };
    this.setupTreeList();

    //act
    this.headerPanel.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-treelist-addrow-button").length, 1, "cancel button");
    assert.equal($testElement.find(".dx-treelist-save-button").length, 1, "cancel button");
    assert.equal($testElement.find(".dx-treelist-cancel-button").length, 1, "cancel button");
});

QUnit.test("Draw column chooser button", function(assert) {
    //arrange
    var $testElement = $('#treeList');

    this.options.columnChooser = {
        enabled: true
    };
    this.setupTreeList();

    //act
    this.headerPanel.render($testElement);

    //assert
    assert.equal($testElement.find(".dx-treelist-column-chooser-button").length, 1, "cancel button");
});
