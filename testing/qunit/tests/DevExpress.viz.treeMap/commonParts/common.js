const vizMocks = require('../../../helpers/vizMocks.js');

const rendererModule = require('viz/core/renderers/renderer');
const titleModule = require('viz/core/title');
const tooltipModule = require('viz/core/tooltip');
const loadingIndicatorModule = require('viz/core/loading_indicator');

const $ = require('jquery');

titleModule.Title = vizMocks.Title;
tooltipModule.Tooltip = vizMocks.Tooltip;
loadingIndicatorModule.LoadingIndicator = vizMocks.LoadingIndicator;

require('viz/tree_map/tree_map.base');

$('#qunit-fixture').append('<div id="test-container" style="width: 600px; height: 400px;"></div>');

const createRenderer = exports.createRenderer = function() {
    const renderer = new vizMocks.Renderer();
    rendererModule.Renderer = function() { return renderer; };
    return renderer;
};

exports.createWidget = function(options) {
    exports.$container = $('#test-container');
    return exports.$container.dxTreeMap(options).dxTreeMap('instance');
};

exports.returnValue = function(value) {
    return function() { return value; };
};

exports.environment = {
    beforeEach: function() {
        this.renderer = createRenderer();
    },

    tile: function(index) {
        return this.renderer.simpleRect.returnValues[index];
    },

    tileCount: function() {
        return this.renderer.simpleRect.callCount;
    },

    resetTilesAttr: function() {
        let i;
        const ii = this.tileCount();

        for(i = 0; i < ii; ++i) {
            this.tile(i).attr.reset();
        }
    }
};

QUnit.assert.checkTile = function(actual, expected, message) {
    const check = actual.x === expected[0] && actual.x + actual.width === expected[2]
        && actual.y === expected[1] && actual.y + actual.height === expected[3];
    this.pushResult({
        result: check,
        actual: [actual.x, actual.y, actual.x + actual.width, actual.y + actual.height],
        expected: !check && expected,
        message: message
    });
};
