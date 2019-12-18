import $ from 'jquery';
import vizMocks from '../../../helpers/vizMocks.js';
import rendererModule from 'viz/core/renderers/renderer';
import tiling from 'viz/funnel/tiling';

import 'viz/funnel/funnel';
import 'viz/themes';

export const stubAlgorithm = { normalizeValues: sinon.stub(), getFigures: sinon.stub() };
tiling.addAlgorithm('stub', stubAlgorithm);

$('#qunit-fixture').append('<div id="test-container"></div>');

export function createFunnel(options) {
    var defaultOptions = {
        legend: {
            visible: false
        },
        valueField: 'value',
        argumentField: 'argument'
    };
    return $('#test-container').dxFunnel($.extend({}, defaultOptions, options)).dxFunnel('instance');
}

export const environment = {
    beforeEach: function() {
        var that = this;
        this.renderer = new vizMocks.Renderer();

        stubAlgorithm.normalizeValues.reset();
        stubAlgorithm.getFigures.reset();
        stubAlgorithm.normalizeValues.returns([]);
        stubAlgorithm.getFigures.returns([]);

        this.itemGroupNumber = 0;

        sinon.stub(rendererModule, 'Renderer', function() {
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
