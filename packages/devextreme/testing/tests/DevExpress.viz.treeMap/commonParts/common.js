import $ from 'jquery';
import {
    Renderer,
    Title,
    Tooltip,
    LoadingIndicator
} from '../../../helpers/vizMocks.js';
import rendererModule from 'viz/core/renderers/renderer';
import titleModule from 'viz/core/title';
import tooltipModule from 'viz/core/tooltip';
import loadingIndicatorModule from 'viz/core/loading_indicator';
// Load TreeMap module
import 'viz/tree_map/tree_map.base';

titleModule.DEBUG_set_title(Title);
tooltipModule.DEBUG_set_tooltip(Tooltip);
loadingIndicatorModule.DEBUG_set_LoadingIndicator(LoadingIndicator);

$('#qunit-fixture').append('<div id="test-container"></div>');
$('#test-container').css({ width: '600px', height: '400px' });

/** Create a mocked renderer for TreeMap tests */
export function createRenderer() {
    const renderer = new Renderer();
    rendererModule.Renderer = function() { return renderer; };
    return renderer;
};

/** Instantiate a TreeMap widget in the test container */
export function createWidget(options) {
    const $container = $('#test-container');
    return $container.dxTreeMap(options).dxTreeMap('instance');
}

/** Stub function returning a fixed value */
export function returnValue(value) {
    return function() { return value; };
}

/** Common test environment for TreeMap tests */
export const environment = {
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
        const count = this.tileCount();
        for(let i = 0; i < count; i++) {
            this.tile(i).attr.resetHistory();
        }
    }
};

// Assert that rendered tile matches expected bounds
QUnit.assert.checkTile = function(actual, expected, message) {
    const check = actual.x === expected[0]
        && actual.x + actual.width === expected[2]
        && actual.y === expected[1]
        && actual.y + actual.height === expected[3];
    this.pushResult({
        result: check,
        actual: [actual.x, actual.y, actual.x + actual.width, actual.y + actual.height],
        expected: !check && expected,
        message: message
    });
};
