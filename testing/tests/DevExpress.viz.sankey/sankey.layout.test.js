"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    common = require("./commonParts/common.js"),
    environment = common.environment,
    createSankey = common.createSankey,
    titleModule = require("viz/core/title"),
    exportModule = require("viz/core/export"),
    dxSankey = require("viz/sankey/sankey");

dxSankey.addPlugin(titleModule.plugin);
dxSankey.addPlugin(exportModule.plugin);

function stubTitle() {
    var that = this;
    that.title = new vizMocks.Title();
    that.title.stub("measure").returns([200, 50]);
    sinon.stub(titleModule, "Title", function() {
        return that.title;
    });
}

function stubExport() {
    var that = this;
    that.export = new vizMocks.ExportMenu();
    that.export.stub("measure").returns([50, 50]);
    sinon.stub(exportModule, "ExportMenu", function() {
        return that.export;
    });
}

function restore() {
    titleModule.Title.restore();
    exportModule.ExportMenu.restore();
}

QUnit.module("Layout Sankey element", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        $("#test-container").css({
            width: 1000,
            height: 600
        });

        stubTitle.call(this);
        stubExport.call(this);

        this.title.stub("layoutOptions").returns({
            horizontalAlignment: "center",
            verticalAlignment: "top"
        });

    },
    afterEach: function() {
        environment.afterEach.call(this);
        restore();
    }
}));

QUnit.test("Tilte with legend and labels", function(assert) {
    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        title: "Title"
    });

    assert.deepEqual(this.title.move.lastCall.args[0], [400, 0, 600, 50], "title rect");
});

QUnit.test("Title with export button", function(assert) {
    this.export.stub("layoutOptions").returns({ horizontalAlignment: "right", verticalAlignment: "top", weak: true });

    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]]
    });

    assert.deepEqual(this.title.move.lastCall.args[0], [400, 0, 600, 50], "title rect");
    assert.deepEqual(this.export.move.lastCall.args[0], [950, 0, 1000, 50], "export rect");
});

QUnit.test("Do not shift title to negative are if container width too small", function(assert) {
    this.export.stub("layoutOptions").returns({ horizontalAlignment: "right", verticalAlignment: "top", weak: true });
    this.title.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top"
    });

    createSankey({
        dataSource: [['A', 'Z', 1], ['B', 'Z', 1]],
        size: {
            width: 150
        }
    });
    assert.deepEqual(this.title.move.lastCall.args[0], [0, 0, 100, 50], "title rect");
    assert.deepEqual(this.export.move.lastCall.args[0], [100, 0, 150, 50], "export rect");
});

QUnit.module("Adaptive Layout", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        $("#test-container").css({
            width: 800,
            height: 600
        });

        stubTitle.call(this);
        stubExport.call(this);

        this.title.stub("measure").returns([150, 120]);
        this.export.stub("measure").returns([100, 150]);
    },

    afterEach: function() {
        environment.afterEach.call(this);
        restore();
    }
}));

QUnit.test("hide title", function(assert) {
    this.title.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top"
    });
    createSankey({
        adaptiveLayout: {
            height: 500
        },
        dataSource: [['A', 'Z', 1]],
    });

    assert.deepEqual(this.nodes()[0].attr.firstCall.args[0], { _name: 'A', width: 15, height: 600, x: 0, y: 0 });
    assert.deepEqual(this.nodes()[1].attr.firstCall.args[0], { _name: 'Z', width: 15, height: 600, x: 785, y: 0 });
    assert.ok(this.title.freeSpace.called);
});


QUnit.test("hide export menu", function(assert) {
    this.export.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top"
    });

    createSankey({
        adaptiveLayout: {
            height: 500
        },
        dataSource: [['A', 'Z', 1]],
    });
    assert.deepEqual(this.nodes()[0].attr.firstCall.args[0], { _name: 'A', width: 15, height: 600, x: 0, y: 0 });
    assert.deepEqual(this.nodes()[1].attr.firstCall.args[0], { _name: 'Z', width: 15, height: 600, x: 785, y: 0 });
    assert.ok(this.export.freeSpace.called);
});

QUnit.test("hide pair elements: title and export", function(assert) {
    this.title.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top"
    });
    this.export.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top",
        weak: true
    });

    createSankey({
        adaptiveLayout: {
            height: 500
        },
        dataSource: [['A', 'Z', 1]],
    });

    assert.deepEqual(this.nodes()[0].attr.firstCall.args[0], { _name: 'A', width: 15, height: 600, x: 0, y: 0 });
    assert.deepEqual(this.nodes()[1].attr.firstCall.args[0], { _name: 'Z', width: 15, height: 600, x: 785, y: 0 });
    assert.ok(this.export.freeSpace.called);
    assert.ok(this.title.freeSpace.called);
});
