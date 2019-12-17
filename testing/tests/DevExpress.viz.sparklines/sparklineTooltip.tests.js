/* global currentTest, createTestContainer */

var $ = require('jquery'),
    vizMocks = require('../../helpers/vizMocks.js'),
    tooltipModule = require('viz/core/tooltip'),
    baseThemeManagerModule = require('viz/core/base_theme_manager'),
    rendererModule = require('viz/core/renderers/renderer');

require('viz/sparkline');

$('<div>')
    .attr('id', 'container')
    .css({ width: 250, height: 10 })
    .appendTo('#qunit-fixture');

var StubThemeManager = vizMocks.stubClass(baseThemeManagerModule.BaseThemeManager);
var StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip, { isEnabled: function() { return true; }, formatValue: function(value, format) { return value + ':' + format; } });

StubThemeManager.prototype.setTheme = function() {
    vizMocks.forceThemeOptions(this);
};

tooltipModule.Tooltip = function(parameters) {
    return new StubTooltip(parameters);
};
rendererModule.Renderer = function() {
    return new vizMocks.Renderer();
};

baseThemeManagerModule.BaseThemeManager = function() {
    return currentTest().themeManager;
};

var environment = {
    beforeEach: function() {
        this.themeManager = new StubThemeManager();
        this.themeManager.stub('theme').returns({
            type: 'line',
            argumentField: 'arg',
            valueField: 'val',
            winlossThreshold: 0,
            tooltip: {
                enabled: true,
                font: {}
            }
        }).withArgs('tooltip').returns({
            enabled: true,
            font: {}
        });

        this.$container = createTestContainer('#container');
        this.createSparkline = function(options) {
            return this.$container.dxSparkline($.extend(true, {
                tooltip: {
                    enabled: true
                }
            }, options)).dxSparkline('instance');
        };
    },
    afterEach: function() {
        this.$container.remove();
    }
};

QUnit.module('Tooltip creating', environment);

QUnit.test('Enabled tooltip', function(assert) {
    var sparkline = this.createSparkline({
        dataSource: [1, 2, 3, 4, 5, 6, 7],
        tooltip: {
            font: {
                size: 12
            },
            enabled: true
        }
    });
    sparkline._showTooltipCallback();

    var arg = sparkline._tooltip.ctorArgs;
    assert.strictEqual(arg.length, 1);
    assert.deepEqual(arg[0].cssClass, 'dxsl-tooltip', 'parameter - cssClass');
    assert.strictEqual(arg[0].eventTrigger, sparkline._eventTrigger, 'parameter - event trigger');

    assert.equal(sparkline._tooltip.update.callCount, 1, 'update is called');
    assert.ok($.isFunction(sparkline._tooltip.update.lastCall.args[0].customizeTooltip));
    sparkline._tooltip.update.lastCall.args[0].customizeTooltip = {};
    assert.deepEqual(sparkline._tooltip.update.lastCall.args[0], {
        enabled: true,
        font: {
            size: 12
        },
        customizeTooltip: {}
    });
});

QUnit.test('Enabled tooltip. Empty data', function(assert) {
    var sparkline = this.createSparkline({
        tooltip: {
            font: {
                size: 12
            },
            enabled: true
        }
    });
    sparkline._showTooltipCallback();

    var arg = sparkline._tooltip.ctorArgs;
    assert.strictEqual(arg.length, 1);
    assert.deepEqual(arg[0].cssClass, 'dxsl-tooltip', 'parameter - cssClass');
    assert.strictEqual(arg[0].eventTrigger, sparkline._eventTrigger, 'parameter - event trigger');

    assert.equal(sparkline._tooltip.update.callCount, 1, 'update is called');
    assert.ok($.isFunction(sparkline._tooltip.update.lastCall.args[0].customizeTooltip));
    sparkline._tooltip.update.lastCall.args[0].customizeTooltip = {};
    assert.deepEqual(sparkline._tooltip.update.lastCall.args[0], {
        enabled: false,
        font: {
            size: 12
        },
        customizeTooltip: {}
    });
});

QUnit.test('Disabled tooltip', function(assert) {
    var sparkline = this.createSparkline({
        dataSource: [1, 2, 3, 4, 5, 6, 7],
        tooltip: {
            enabled: false
        }
    });

    sparkline._showTooltipCallback();

    assert.equal(sparkline._tooltip.update.callCount, 1, 'update is called');
    assert.equal(sparkline._tooltip.update.lastCall.args[0].enabled, false);
});

QUnit.test('Tooltip when datasource is empty', function(assert) {
    var sparkline = this.createSparkline({
        dataSource: [],
        tooltip: {
            enabled: false
        }
    });

    sparkline._showTooltipCallback();

    assert.equal(sparkline._tooltip.update.callCount, 1, 'update is called');
    assert.equal(sparkline._tooltip.update.lastCall.args[0].enabled, false);
});

QUnit.test('customizeTooltip does not return html or text', function(assert) {
    var data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12],
        customizeTooltipArg = { valueText: ['Cell11', 'Cell12', 'Cell21', 'Cell22'] },
        customizeTooltip = function() { return { color: 'red' }; },
        sparkline = this.createSparkline({
            dataSource: data,
            tooltip: {
                enabled: true,
                font: {
                    size: 12
                },
                customizeTooltip: customizeTooltip
            }
        });

    sparkline._showTooltipCallback();

    var ct = sparkline._tooltip.update.lastCall.args[0].customizeTooltip;

    assert.deepEqual(ct.call(customizeTooltipArg, customizeTooltipArg), {
        color: 'red',
        html: '<table style=\'border-spacing:0px; line-height: 14px\'><tr><td>Cell11</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>Cell12</td></tr><tr><td>Cell21</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>Cell22</td></tr></table>'
    });
});

QUnit.test('customizeTooltip return html', function(assert) {
    var data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12],
        customizeTooltipArg = { valueText: ['Cell11', 'Cell12', 'Cell21', 'Cell22'] },
        customizeTooltip = function() { return { color: 'red', html: 'html text' }; },
        sparkline = this.createSparkline({
            dataSource: data,
            tooltip: {
                enabled: true,
                font: {
                    size: 12
                },
                customizeTooltip: customizeTooltip
            }
        });

    sparkline._showTooltipCallback();

    var ct = sparkline._tooltip.update.lastCall.args[0].customizeTooltip;

    assert.deepEqual(ct.call(customizeTooltipArg, customizeTooltipArg), {
        color: 'red',
        html: 'html text'
    });
});

QUnit.test('customizeTooltip return text', function(assert) {
    var data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12],
        customizeTooltipArg = { valueText: ['Cell11', 'Cell12', 'Cell21', 'Cell22'] },
        customizeTooltip = function() { return { color: 'red', text: 'text text' }; },
        sparkline = this.createSparkline({
            dataSource: data,
            tooltip: {
                enabled: true,
                font: {
                    size: 12
                },
                customizeTooltip: customizeTooltip
            }
        });

    sparkline._showTooltipCallback();

    var ct = sparkline._tooltip.update.lastCall.args[0].customizeTooltip;

    assert.deepEqual(ct.call(customizeTooltipArg, customizeTooltipArg), {
        color: 'red',
        text: 'text text'
    });
});

QUnit.test('customizeTooltip is not function', function(assert) {
    var data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12],
        customizeTooltipArg = { valueText: ['Cell11', 'Cell12', 'Cell21', 'Cell22'] },
        customizeTooltip = {},
        sparkline = this.createSparkline({
            dataSource: data,
            tooltip: {
                enabled: true,
                font: {
                    size: 12
                },
                customizeTooltip: customizeTooltip
            }
        });

    sparkline._showTooltipCallback();

    var ct = sparkline._tooltip.update.lastCall.args[0].customizeTooltip;

    assert.deepEqual(ct.call(customizeTooltipArg, customizeTooltipArg), {
        html: '<table style=\'border-spacing:0px; line-height: 14px\'><tr><td>Cell11</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>Cell12</td></tr><tr><td>Cell21</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>Cell22</td></tr></table>'
    });
});

QUnit.test('Default customizeTooltip callback. Custom linespacing', function(assert) {
    var customizeTooltipArg = { valueText: ['Cell11', 'Cell12', 'Cell21', 'Cell22'] },
        sparkline = this.createSparkline({
            dataSource: [1, 2, 3, 4, 5, 6, 7],
            tooltip: {
                enabled: true,
                font: { size: 15, lineSpacing: 3 }
            }
        });

    sparkline._showTooltipCallback();

    var ct = sparkline._tooltip.update.lastCall.args[0].customizeTooltip;

    assert.deepEqual(ct.call(customizeTooltipArg, customizeTooltipArg), {
        html: '<table style=\'border-spacing:0px; line-height: 18px\'><tr><td>Cell11</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>Cell12</td></tr><tr><td>Cell21</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>Cell22</td></tr></table>'
    });
});

QUnit.test('dxSparkline get TooltipFormatObject', function(assert) {
    var data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12],

        sparkline = this.createSparkline({
            dataSource: data,
            tooltip: {
                enabled: true
            }
        });
    sparkline._showTooltipCallback();

    assert.deepEqual(sparkline._tooltip.show.lastCall.args, [{
        firstValue: '4:undefined',
        lastValue: '12:undefined',
        maxValue: '23:undefined',
        minValue: '-1:undefined',
        originalFirstValue: 4,
        originalLastValue: 12,
        originalMaxValue: 23,
        originalMinValue: -1,
        valueText: ['Start:', '4:undefined', 'End:', '12:undefined', 'Min:', '-1:undefined', 'Max:', '23:undefined']
    }, {
        x: 250 / 2 + 3,
        y: 30 / 2 + 5
    }, {}]);
});

// T714171
QUnit.test('sparkline tooltip format object. min/max values when all values are equal', function(assert) {
    var sparkline = this.createSparkline({
        dataSource: [0, 0, 0],
        tooltip: {
            enabled: true
        }
    });

    sparkline._showTooltipCallback();

    assert.strictEqual(sparkline._tooltip.show.lastCall.args[0].originalMinValue, 0);
    assert.strictEqual(sparkline._tooltip.show.lastCall.args[0].originalMaxValue, 0);
});

QUnit.test('Default Tooltip text', function(assert) {
    var data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12],

        sparkline = this.createSparkline({
            dataSource: data,
            tooltip: {
                font: { size: 12 },
                enabled: true
            }
        });
    sparkline._showTooltipCallback();
    sparkline._tooltip.formatValue = function(value, format) { return value; };

    var ctResult = sparkline._tooltip.update.lastCall.args[0].customizeTooltip(sparkline._getTooltipData());
    assert.deepEqual(ctResult, {
        html: '<table style=\'border-spacing:0px; line-height: 14px\'>' +
            '<tr><td>Start:</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>4</td></tr>' +
            '<tr><td>End:</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>12</td></tr>' +
            '<tr><td>Min:</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>-1</td></tr>' +
            '<tr><td>Max:</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>23</td></tr>' +
            '</table>'
    });
});

QUnit.test('Default Tooltip text. Rtl', function(assert) {
    var data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12],

        sparkline = this.createSparkline({
            dataSource: data,
            tooltip: {
                font: { size: 12 },
                enabled: true
            },
            rtlEnabled: true
        });
    sparkline._showTooltipCallback();
    sparkline._tooltip.formatValue = function(value, format) { return value; };

    var ctResult = sparkline._tooltip.update.lastCall.args[0].customizeTooltip(sparkline._getTooltipData());
    assert.deepEqual(ctResult, {
        html: '<table style=\'border-spacing:0px; line-height: 14px\'>' +
            '<tr><td>Start:</td><td style=\'width: 15px\'></td><td style=\'text-align: left\'>4</td></tr>' +
            '<tr><td>End:</td><td style=\'width: 15px\'></td><td style=\'text-align: left\'>12</td></tr>' +
            '<tr><td>Min:</td><td style=\'width: 15px\'></td><td style=\'text-align: left\'>-1</td></tr>' +
            '<tr><td>Max:</td><td style=\'width: 15px\'></td><td style=\'text-align: left\'>23</td></tr>' +
            '</table>'
    });
});

QUnit.test('Winloss sparkline get TooltipFormatObject', function(assert) {
    var data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12],

        sparkline = this.createSparkline({
            dataSource: data,
            type: 'winloss',
            tooltip: {
                enabled: true
            }
        });
    sparkline._showTooltipCallback();


    assert.deepEqual(sparkline._tooltip.show.lastCall.args, [{
        firstValue: '4:undefined',
        lastValue: '12:undefined',
        maxValue: '23:undefined',
        minValue: '-1:undefined',
        originalFirstValue: 4,
        originalLastValue: 12,
        originalMaxValue: 23,
        originalMinValue: -1,
        originalThresholdValue: 0,
        thresholdValue: '0:undefined',
        valueText: ['Start:', '4:undefined', 'End:', '12:undefined', 'Min:', '-1:undefined', 'Max:', '23:undefined']
    }, {
        x: 250 / 2 + 3,
        y: 30 / 2 + 5
    }, {}]);
});
