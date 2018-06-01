"use strict";

var $ = require("jquery"),
    vizMocks = require("../../../helpers/vizMocks.js"),
    rendererModule = require("viz/core/renderers/renderer");

var dxSankey = require("viz/sankey/sankey");
require("viz/themes");

dxSankey.addPlugin(require("viz/core/tooltip").plugin);

let layoutBuilder = require("viz/sankey/layout"),
    spiesLayoutBuilder = {
        computeLayout: sinon.spy(layoutBuilder, 'computeLayout')
    };

$("#qunit-fixture").append('<div id="test-container"></div>');

function createSankey(options) {
    var defaultOptions = {
        // TODO: default options
    };
    return $("#test-container").dxSankey($.extend({}, defaultOptions, options)).dxSankey("instance");
}

var environment = {
    beforeEach: function() {
        var that = this;
        this.renderer = new vizMocks.Renderer();

        this.itemGroupNumber = 0;

        sinon.stub(rendererModule, "Renderer", function() {
            return that.renderer;
        });
    },

    afterEach: function() {
        rendererModule.Renderer.restore();
    },

    itemsGroup: function() {
        return this.renderer.g.getCall(this.itemGroupNumber).returnValue;
    },

    items: function() {
        return this.itemsGroup().children;
    },

    item: function(index) {
        return this.items[index];
    }
};
// TODO: do we need module.exports.testData?
var testData = {
    valid: [
        ['A', 'Z', 1]
    ],
    valid2layers: [
        ['A', 'K', 6],
        ['A', 'L', 2],
        ['A', 'M', 2],
        ['A', 'N', 4]
    ],
    valid3layers: [
        ['A', 'M', 6],
        ['A', 'N', 2],
        ['B', 'M', 2],
        ['B', 'N', 4],
        ['M', 'X', 2],
        ['M', 'Y', 1],
        ['N', 'X', 2],
        ['N', 'Y', 1]
    ],
    valid4layers: [
        ['A', 'K', 6],
        ['K', 'L', 2],
        ['L', 'M', 2],
        ['M', 'Z', 4]
    ]
};
module.exports.createSankey = createSankey;
module.exports.testData = testData;
module.exports.environment = environment;
module.exports.layoutBuilder = layoutBuilder;
module.exports.spiesLayoutBuilder = spiesLayoutBuilder;
