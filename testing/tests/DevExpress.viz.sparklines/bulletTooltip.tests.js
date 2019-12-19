/* global currentTest, createTestContainer */

var $ = require('jquery'),
    vizMocks = require('../../helpers/vizMocks.js'),
    tooltipModule = require('viz/core/tooltip'),
    rendererModule = require('viz/core/renderers/renderer'),
    baseThemeManagerModule = require('viz/core/base_theme_manager');

require('viz/bullet');

$('<div>')
    .attr('id', 'container')
    .css({ width: 250, height: 20 })
    .appendTo('#qunit-fixture');

var StubThemeManager = vizMocks.stubClass(baseThemeManagerModule.BaseThemeManager);
var StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip, { isEnabled: function() { return true; }, formatValue: function(value, format) { return value + ':' + format; } });

tooltipModule.Tooltip = function(parameters) {
    return new StubTooltip(parameters);
};
rendererModule.Renderer = function() {
    return currentTest().renderer;
};

baseThemeManagerModule.BaseThemeManager = function() {
    return currentTest().themeManager;
};

StubThemeManager.prototype.setTheme = function() {
    vizMocks.forceThemeOptions(this);
};

var environment = {
    beforeEach: function() {
        this.themeManager = new StubThemeManager();
        this.themeManager.stub('theme').returns({
            showTarget: true,
            showZeroLevel: true,
            tooltip: {
                enabled: true,
                font: {}
            }
        }).withArgs('tooltip').returns({
            enabled: true,
            font: {}
        });
        this.renderer = new vizMocks.Renderer();
        this.$container = createTestContainer('#container');
        this.createBullet = function(options) {
            return this.$container.dxBullet($.extend(true, {
                tooltip: {
                    enabled: true
                }
            }, options)).dxBullet('instance');
        };
    },
    afterEach: function() {
        this.$container.remove();
    }
};

QUnit.module('Tooltip creating', environment);

QUnit.test('Enabled tooltip', function(assert) {
    var bullet = this.createBullet({
        value: 10,
        maxScaleValue: 20,
        tooltip: {
            font: {
                size: 12
            },
            enabled: true
        }
    });
    bullet._showTooltipCallback();

    var arg = bullet._tooltip.ctorArgs;
    assert.strictEqual(arg.length, 1);
    assert.deepEqual(arg[0].cssClass, 'dxb-tooltip', 'parameter - cssClass');
    assert.strictEqual(arg[0].eventTrigger, bullet._eventTrigger, 'parameter - event trigger');

    assert.equal(bullet._tooltip.update.callCount, 1, 'update is called');
    assert.ok($.isFunction(bullet._tooltip.update.lastCall.args[0].customizeTooltip));
    bullet._tooltip.update.lastCall.args[0].customizeTooltip = {};
    assert.deepEqual(bullet._tooltip.update.lastCall.args[0], {
        enabled: true,
        font: {
            size: 12
        },
        customizeTooltip: {}
    });
});

QUnit.test('Enabled tooltip. Empty data', function(assert) {
    var bullet = this.createBullet({
        tooltip: {
            font: {
                size: 12
            },
            enabled: true
        }
    });
    bullet._showTooltipCallback();

    var arg = bullet._tooltip.ctorArgs;
    assert.strictEqual(arg.length, 1);
    assert.deepEqual(arg[0].cssClass, 'dxb-tooltip', 'parameter - cssClass');
    assert.strictEqual(arg[0].eventTrigger, bullet._eventTrigger, 'parameter - event trigger');

    assert.equal(bullet._tooltip.update.callCount, 1, 'update is called');
    assert.ok($.isFunction(bullet._tooltip.update.lastCall.args[0].customizeTooltip));
    bullet._tooltip.update.lastCall.args[0].customizeTooltip = {};
    assert.deepEqual(bullet._tooltip.update.lastCall.args[0], {
        enabled: false,
        font: {
            size: 12
        },
        customizeTooltip: {}
    });
});

QUnit.test('Disabled tooltip', function(assert) {
    var bullet = this.createBullet({
        value: 10,
        maxScaleValue: 20,
        tooltip: {
            enabled: false
        }
    });

    bullet._showTooltipCallback();

    assert.equal(bullet._tooltip.update.callCount, 1, 'update is called');
    assert.equal(bullet._tooltip.update.lastCall.args[0].enabled, false);
});

QUnit.test('dxBullet get TooltipFormatObject', function(assert) {
    this.renderer.bBoxTemplate = { x: 10, width: 200 };
    var bullet = this.createBullet({
        value: 10, target: 20, endScaleValue: 30,
        tooltip: {
            enabled: true
        }
    });
    bullet._showTooltipCallback();

    assert.deepEqual(bullet._tooltip.show.lastCall.args, [{
        originalTarget: 20,
        originalValue: 10,
        target: '20:undefined',
        value: '10:undefined',
        valueText: ['Actual Value:', '10:undefined', 'Target Value:', '20:undefined'],
    }, {
        x: (200 / 2) + 10 + 3,
        y: 30 / 2 + 5
    }, {}]);
});

QUnit.test('Default Tooltip text', function(assert) {
    var data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12],

        bullet = this.createBullet({
            dataSource: data,
            tooltip: {
                font: { size: 12 },
                enabled: true
            }
        });

    bullet._showTooltipCallback();
    bullet._tooltip.formatValue = function(value, format) { return value; };

    var ctResult = bullet._tooltip.update.lastCall.args[0].customizeTooltip(bullet._getTooltipData());
    assert.deepEqual(ctResult, {
        html: '<table style=\'border-spacing:0px; line-height: 14px\'><tr><td>Actual Value:</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>0</td></tr><tr><td>Target Value:</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>0</td></tr></table>'
    });
});

QUnit.test('Default Tooltip text. Rtl', function(assert) {
    var data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12],

        bullet = this.createBullet({
            dataSource: data,
            tooltip: {
                font: { size: 12 },
                enabled: true
            },
            rtlEnabled: true
        });

    bullet._showTooltipCallback();
    bullet._tooltip.formatValue = function(value, format) { return value; };

    var ctResult = bullet._tooltip.update.lastCall.args[0].customizeTooltip(bullet._getTooltipData());
    assert.deepEqual(ctResult, {
        html: '<table style=\'border-spacing:0px; line-height: 14px\'><tr><td>Actual Value:</td><td style=\'width: 15px\'></td><td style=\'text-align: left\'>0</td></tr><tr><td>Target Value:</td><td style=\'width: 15px\'></td><td style=\'text-align: left\'>0</td></tr></table>'
    });
});
