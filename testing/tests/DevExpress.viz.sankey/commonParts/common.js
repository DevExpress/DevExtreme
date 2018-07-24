"use strict";

var $ = require("jquery"),
    vizMocks = require("../../../helpers/vizMocks.js"),
    rendererModule = require("viz/core/renderers/renderer"),
    find = function(array, predicate) {
        return array.filter(predicate)[0];
    };

require("viz/sankey/sankey");
require("viz/themes");

var layoutBuilder = require("viz/sankey/layout"),
    spiesLayoutBuilder = {
        computeLayout: sinon.spy(layoutBuilder, 'computeLayout'),
        _computeNodes: sinon.spy(layoutBuilder, '_computeNodes')
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

        this.linksGroupIndex = 0;
        this.nodesGroupIndex = 1;
        this.labelsGroupIndex = 2;

        sinon.stub(rendererModule, "Renderer", function() {
            return that.renderer;
        });
    },

    afterEach: function() {
        rendererModule.Renderer.restore();
    },

    linksGroup: function() {
        return this.renderer.g.getCall(this.linksGroupIndex).returnValue;
    },

    links: function() {
        return this.linksGroup().children;
    },

    link: function(index) {
        return this.links()[index].append.returnValues[0].children;
    },

    nodesGroup: function() {
        return this.renderer.g.getCall(this.nodesGroupIndex).returnValue;
    },

    nodes: function() {
        return this.nodesGroup().children;
    },

    node: function(index) {
        return this.nodes[index];
    },

    labelsGroup: function() {
        return this.renderer.g.getCall(this.labelsGroupIndex).returnValue;
    },

    labels: function() {
        return this.labelsGroup().children;
    },

    label: function(index) {
        return this.labels[index];
    }
};

var testData = {
    countriesData: [
        ['Brazil', 'Portugal', 5],
        ['Brazil', 'France', 1],
        ['Brazil', 'Spain', 1],
        ['Brazil', 'England', 1],
        ['Canada', 'Portugal', 1],
        ['Canada', 'France', 5],
        ['Canada', 'England', 1],
        ['Mexico', 'Portugal', 1],
        ['Mexico', 'France', 1],
        ['Mexico', 'Spain', 5],
        ['Mexico', 'England', 1],
        ['USA', 'Portugal', 1],
        ['USA', 'France', 1],
        ['USA', 'Spain', 1],
        ['USA', 'England', 5],
        ['Portugal', 'Angola', 2],
        ['Portugal', 'Senegal', 1],
        ['Portugal', 'Morocco', 1],
        ['Portugal', 'South Africa', 3],
        ['France', 'Angola', 1],
        ['France', 'Senegal', 3],
        ['France', 'Mali', 3],
        ['France', 'Morocco', 3],
        ['France', 'South Africa', 1],
        ['Spain', 'Senegal', 1],
        ['Spain', 'Morocco', 3],
        ['Spain', 'South Africa', 1],
        ['England', 'Angola', 1],
        ['England', 'Senegal', 1],
        ['England', 'Morocco', 2],
        ['England', 'South Africa', 7],
        ['South Africa', 'China', 5],
        ['South Africa', 'India', 1],
        ['South Africa', 'Japan', 3],
        ['Angola', 'China', 5],
        ['Angola', 'India', 1],
        ['Angola', 'Japan', 3],
        ['Senegal', 'China', 5],
        ['Senegal', 'India', 1],
        ['Senegal', 'Japan', 3],
        ['Mali', 'China', 5],
        ['Mali', 'India', 1],
        ['Mali', 'Japan', 3],
        ['Morocco', 'China', 5],
        ['Morocco', 'India', 1],
        ['Morocco', 'Japan', 3]
    ],
    simpleData: [
        ['A', 'Y', 1], ['B', 'Y', 2], ['B', 'M', 4], ['C', 'M', 1], ['M', 'Y', 5]
    ]
};
module.exports.createSankey = createSankey;
module.exports.testData = testData;
module.exports.environment = environment;
module.exports.layoutBuilder = layoutBuilder;
module.exports.spiesLayoutBuilder = spiesLayoutBuilder;
module.exports.find = find;
