"use strict";

var $ = require("jquery"),
    common = require("./commonParts/common.js"),
    createFunnel = common.createFunnel,
    labelEnvironment = require("./commonParts/label.js").labelEnvironment;

var environment = $.extend({}, labelEnvironment, {
    beforeEach: function() {
        labelEnvironment.beforeEach.call(this);

        $("#test-container").css({
            width: 1000,
            height: 600
        });

        this.title.stub("layoutOptions").returns({
            horizontalAlignment: "center",
            verticalAlignment: "top"
        });
        this.title.stub("measure").returns([200, 50]);

        this.export.stub("measure").returns([50, 50]);
        this.legend.stub("measure").returns([100, 100]);
        this.legend.stub("layoutOptions").returns({
            horizontalAlignment: "right",
            verticalAlignment: "top",
            side: "horizontal"
        });
    }
});

QUnit.module("Layout Funnel element", environment);

QUnit.test("Tilte with legend and labels", function(assert) {
    createFunnel({
        dataSource: [{ value: 1 }],
        title: "Title",
        legend: {
            visible: true
        },
        label: {
            visible: true,
            position: "outside",
            horizontalAlignment: "right"
        }
    });

    assert.deepEqual(this.title.move.lastCall.args[0], [297.5, 0, 497.5, 50], "title rect");
    assert.deepEqual(this.legend.move.lastCall.args[0], [900, 50, 1000, 150], "legend rect");
});

QUnit.test("Title with export button and legend", function(assert) {
    this.export.stub("layoutOptions").returns({ horizontalAlignment: "right", verticalAlignment: "top", weak: true });

    createFunnel({
        dataSource: [{ value: 1 }],
        label: {
            visible: false
        }
    });

    assert.deepEqual(this.title.move.lastCall.args[0], [350, 0, 550, 50], "title rect");
    assert.deepEqual(this.export.move.lastCall.args[0], [850, 0, 900, 50], "export rect");
});

QUnit.test("Title, export button and labels", function(assert) {
    this.export.stub("layoutOptions").returns({ horizontalAlignment: "right", verticalAlignment: "top", weak: true });
    this.legend.stub("layoutOptions").returns(undefined);

    createFunnel({
        dataSource: [{ value: 1 }],
        label: {
            visible: true,
            position: "outside",
            horizontalAlignment: "right"
        }
    });

    assert.deepEqual(this.title.move.lastCall.args[0], [347.5, 0, 547.5, 50], "title rect");
    assert.deepEqual(this.export.move.lastCall.args[0], [950, 0, 1000, 50], "export rect");
});

QUnit.test("Title, export button, legend and labels", function(assert) {
    this.export.stub("layoutOptions").returns({ horizontalAlignment: "right", verticalAlignment: "top", weak: true });

    createFunnel({
        dataSource: [{ value: 1 }],
        label: {
            visible: true,
            position: "outside",
            horizontalAlignment: "right"
        }
    });

    assert.deepEqual(this.title.move.lastCall.args[0], [297.5, 0, 497.5, 50], "title rect");
    assert.deepEqual(this.export.move.lastCall.args[0], [850, 0, 900, 50], "export rect");
});

QUnit.test("Export button and legend", function(assert) {
    this.export.stub("layoutOptions").returns({ horizontalAlignment: "right", verticalAlignment: "top", weak: true });
    this.title.stub("layoutOptions").returns(undefined);

    createFunnel({
        dataSource: [{ value: 1 }],
        label: {
            visible: false
        }
    });

    assert.deepEqual(this.export.move.lastCall.args[0], [850, 0, 900, 50], "export rect");
});

QUnit.test("Shift title if title and export button have same position", function(assert) {
    this.export.stub("layoutOptions").returns({ horizontalAlignment: "right", verticalAlignment: "top", weak: true });
    this.title.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top"
    });
    this.legend.layoutOptions.returns(undefined);

    createFunnel({
        dataSource: [{ value: 1 }],
        label: {
            visible: false
        }
    });
    assert.deepEqual(this.title.move.lastCall.args[0], [750, 0, 950, 50], "title rect");
    assert.deepEqual(this.export.move.lastCall.args[0], [950, 0, 1000, 50], "export rect");
});

QUnit.test("Do not shift title to negative are if container width too small", function(assert) {
    this.export.stub("layoutOptions").returns({ horizontalAlignment: "right", verticalAlignment: "top", weak: true });
    this.title.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top"
    });
    this.legend.layoutOptions.returns(undefined);

    createFunnel({
        dataSource: [{ value: 1 }],
        label: {
            visible: false
        },
        size: {
            width: 150
        }
    });
    assert.deepEqual(this.title.move.lastCall.args[0], [0, 0, 100, 50], "title rect");
    assert.deepEqual(this.export.move.lastCall.args[0], [100, 0, 150, 50], "export rect");
});
