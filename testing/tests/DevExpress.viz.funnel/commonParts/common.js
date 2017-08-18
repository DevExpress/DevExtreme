"use strict";

var $ = require("jquery"),
    vizMocks = require("../../../helpers/vizMocks.js"),
    rendererModule = require("viz/core/renderers/renderer"),
    legendModule = require("viz/components/legend"),
    titleModule = require("viz/core/title"),
    exportModule = require("viz/core/export"),
    tiling = require("viz/funnel/tiling");

require("viz/themes");

var stubAlgorithm = { normalizeValues: sinon.stub(), getFigures: sinon.stub() };
tiling.addAlgorithm("stub", stubAlgorithm);

var dxFunnel = require("viz/funnel/funnel");
dxFunnel.addPlugin(legendModule.plugin);
dxFunnel.addPlugin(titleModule.plugin);
dxFunnel.addPlugin(exportModule.plugin);

$("#qunit-fixture").append('<div id="test-container"></div>');

function createFunnel(options) {
    var defaultOptions = {
        legend: {
            visible: false
        },
        valueField: "value",
        argumentField: "argument"
    };
    return $("#test-container").dxFunnel($.extend({}, defaultOptions, options)).dxFunnel("instance");
}

var environment = {
    beforeEach: function() {
        var that = this;
        this.renderer = new vizMocks.Renderer();

        stubAlgorithm.normalizeValues.reset();
        stubAlgorithm.getFigures.reset();
        stubAlgorithm.normalizeValues.returns([]);
        stubAlgorithm.getFigures.returns([]);

        this.itemGroupNumber = 1;

        sinon.stub(rendererModule, "Renderer", function() {
            return that.renderer;
        });

        this.stubLegend();
        this.stubTitle();
        this.stubExport();
    },

    afterEach: function() {
        rendererModule.Renderer.restore();
        legendModule.Legend.restore();
        titleModule.Title.restore();
        exportModule.ExportMenu.restore();
    },

    itemsGroup: function() {
        return this.renderer.g.getCall(this.itemGroupNumber).returnValue;
    },

    items: function() {
        return this.itemsGroup().children;
    },

    item: function(index) {
        return this.items[index];
    },

    stubLegend: function() {
        var that = this;
        that.legend = new vizMocks.Legend();
        that.legend.stub("coordsIn").returns(true);
        that.legend.stub("getItemByCoord").withArgs(2, 3).returns({ id: 4 });
        that.legend.stub("measure").returns([100, 100]);

        sinon.stub(legendModule, "Legend", function() {
            return that.legend;
        });
    },

    stubTitle: function() {
        var that = this;
        that.title = new vizMocks.Title();
        that.title.stub("measure").returns([150, 120]);
        sinon.stub(titleModule, "Title", function() {
            return that.title;
        });
    },

    stubExport: function() {
        var that = this;
        that.export = new vizMocks.ExportMenu();
        that.export.stub("measure").returns([100, 150]);
        sinon.stub(exportModule, "ExportMenu", function() {
            return that.export;
        });
    }
};

function checkNumbersWithError(actual, expected, error) {
    return actual === expected || (actual < expected + error && actual > expected - error);
}

QUnit.assert.checkItem = function(actual, expected, error, message) {
    var check = true, i;
    if(!error) {
        error = 0.1;
    }
    for(i = 0; i < actual.length; i++) {
        check = checkNumbersWithError(actual[i], expected[i], error) && check;
    }
    this.pushResult({
        result: check,
        actual: actual,
        expected: !check && expected,
        message: message
    });
};

module.exports.createFunnel = createFunnel;
module.exports.stubAlgorithm = stubAlgorithm;
module.exports.environment = environment;
