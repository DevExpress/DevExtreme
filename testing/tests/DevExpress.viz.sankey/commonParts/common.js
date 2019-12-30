const $ = require('jquery');
const vizMocks = require('../../../helpers/vizMocks.js');
const rendererModule = require('viz/core/renderers/renderer');
const find = function(array, predicate) {
    return array.filter(predicate)[0];
};

require('viz/sankey/sankey');
require('viz/themes');

const layoutBuilder = require('viz/sankey/layout');
const spiesLayoutBuilder = {
    computeLayout: sinon.spy(layoutBuilder, 'computeLayout'),
    _computeNodes: sinon.spy(layoutBuilder, '_computeNodes')
};

$('#qunit-fixture').append('<div id="test-container"></div>');

function createSankey(options) {
    const defaultOptions = {
        node: {
            width: 15
        }
    };
    return $('#test-container').dxSankey($.extend({}, defaultOptions, options)).dxSankey('instance');
}

const environment = {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();

        this.linksGroupIndex = 0;
        this.nodesGroupIndex = 1;
        this.labelsGroupIndex = 2;

        sinon.stub(rendererModule, 'Renderer', function() {
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
        return this.labels()[index].children[0];
    }
};

const testData = {
    countriesData: [
        { source: 'Brazil', target: 'Portugal', weight: 5 },
        { source: 'Brazil', target: 'France', weight: 1 },
        { source: 'Brazil', target: 'Spain', weight: 1 },
        { source: 'Brazil', target: 'England', weight: 1 },
        { source: 'Canada', target: 'Portugal', weight: 1 },
        { source: 'Canada', target: 'France', weight: 5 },
        { source: 'Canada', target: 'England', weight: 1 },
        { source: 'Mexico', target: 'Portugal', weight: 1 },
        { source: 'Mexico', target: 'France', weight: 1 },
        { source: 'Mexico', target: 'Spain', weight: 5 },
        { source: 'Mexico', target: 'England', weight: 1 },
        { source: 'USA', target: 'Portugal', weight: 1 },
        { source: 'USA', target: 'France', weight: 1 },
        { source: 'USA', target: 'Spain', weight: 1 },
        { source: 'USA', target: 'England', weight: 5 },
        { source: 'Portugal', target: 'Angola', weight: 2 },
        { source: 'Portugal', target: 'Senegal', weight: 1 },
        { source: 'Portugal', target: 'Morocco', weight: 1 },
        { source: 'Portugal', target: 'South Africa', weight: 3 },
        { source: 'France', target: 'Angola', weight: 1 },
        { source: 'France', target: 'Senegal', weight: 3 },
        { source: 'France', target: 'Mali', weight: 3 },
        { source: 'France', target: 'Morocco', weight: 3 },
        { source: 'France', target: 'South Africa', weight: 1 },
        { source: 'Spain', target: 'Senegal', weight: 1 },
        { source: 'Spain', target: 'Morocco', weight: 3 },
        { source: 'Spain', target: 'South Africa', weight: 1 },
        { source: 'England', target: 'Angola', weight: 1 },
        { source: 'England', target: 'Senegal', weight: 1 },
        { source: 'England', target: 'Morocco', weight: 2 },
        { source: 'England', target: 'South Africa', weight: 7 },
        { source: 'South Africa', target: 'China', weight: 5 },
        { source: 'South Africa', target: 'India', weight: 1 },
        { source: 'South Africa', target: 'Japan', weight: 3 },
        { source: 'Angola', target: 'China', weight: 5 },
        { source: 'Angola', target: 'India', weight: 1 },
        { source: 'Angola', target: 'Japan', weight: 3 },
        { source: 'Senegal', target: 'China', weight: 5 },
        { source: 'Senegal', target: 'India', weight: 1 },
        { source: 'Senegal', target: 'Japan', weight: 3 },
        { source: 'Mali', target: 'China', weight: 5 },
        { source: 'Mali', target: 'India', weight: 1 },
        { source: 'Mali', target: 'Japan', weight: 3 },
        { source: 'Morocco', target: 'China', weight: 5 },
        { source: 'Morocco', target: 'India', weight: 1 },
        { source: 'Morocco', target: 'Japan', weight: 3 }
    ],
    simpleData: [
        { source: 'A', target: 'Y', weight: 1 },
        { source: 'B', target: 'Y', weight: 2 },
        { source: 'B', target: 'M', weight: 4 },
        { source: 'C', target: 'M', weight: 1 },
        { source: 'M', target: 'Y', weight: 5 }
    ]
};
module.exports.createSankey = createSankey;
module.exports.testData = testData;
module.exports.environment = environment;
module.exports.layoutBuilder = layoutBuilder;
module.exports.spiesLayoutBuilder = spiesLayoutBuilder;
module.exports.find = find;
