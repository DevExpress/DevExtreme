/* global currentTest, createTestContainer */

import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import tooltipModule from 'viz/core/tooltip';
import baseThemeManagerModule from 'viz/core/base_theme_manager';
import rendererModule from 'viz/core/renderers/renderer';
import { isFunction } from 'core/utils/type';
const TOOLTIP_TABLE_BORDER_SPACING = 0;
const TOOLTIP_TABLE_KEY_VALUE_SPACE = 15;

import 'viz/sparkline';

$('<div>')
    .attr('id', 'container')
    .css({ width: 250, height: 10 })
    .appendTo('#qunit-fixture');

const StubThemeManager = vizMocks.stubClass(baseThemeManagerModule.BaseThemeManager);
const StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip, {
    isEnabled: function() { return true; },
    formatValue: function(value, format) { return value + ':' + format; }
});

StubThemeManager.prototype.setTheme = function() {
    vizMocks.forceThemeOptions(this);
};

tooltipModule.DEBUG_set_tooltip(function(parameters) {
    return new StubTooltip(parameters);
});
rendererModule.Renderer = function() {
    return new vizMocks.Renderer();
};

baseThemeManagerModule.BaseThemeManager = function() {
    return currentTest().themeManager;
};

function getSparklineTooltip(sparkline) {
    return sparkline._tooltip;
}

function showSparklineTooltip(sparkline) {
    sparkline._showTooltip();
}

function checkTemplateTable(assert, $table, templateArg, elementsSettings) {
    assert.strictEqual($table.css('borderSpacing'), `${TOOLTIP_TABLE_BORDER_SPACING}px`);
    assert.strictEqual($table.css('lineHeight'), elementsSettings.lineHeight);
    const $tr = $table.find('tr');

    assert.strictEqual($tr.length, templateArg.valueText.length / 2);

    for(let i = 0; i < $tr.length; i += 2) {
        const $currentTr = $($tr[i]);
        const $td = $currentTr.find('td');

        assert.strictEqual($td.length, 3);

        assert.strictEqual($($td.get(0)).text(), templateArg.valueText[i]);

        assert.strictEqual($($td.get(1)).css('width'), `${TOOLTIP_TABLE_KEY_VALUE_SPACE}px`);

        assert.strictEqual($($td.get(2)).css('textAlign'), elementsSettings.textAlign);
        assert.strictEqual($($td.get(2)).text(), templateArg.valueText[i + 1]);
    }
}

const environment = {
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

        this.$container = $(createTestContainer('#container'));
    },
    afterEach: function() {
        this.$container.remove();
    },
    createSparkline(options) {
        return this.$container.dxSparkline($.extend(true, {
            tooltip: {
                enabled: true
            }
        }, options)).dxSparkline('instance');
    }
};

QUnit.module('Sparkline tooltip', environment);

QUnit.test('Tooltip constructor should accept valid params when tooltip is enabled', function(assert) {
    const sparkline = this.createSparkline({
        dataSource: [1, 2, 3, 4, 5, 6, 7],
        tooltip: {
            font: {
                size: 12
            }
        }
    });
    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    const arg = tooltip.ctorArgs;
    assert.strictEqual(arg.length, 1);
    assert.deepEqual(arg[0].cssClass, 'dxsl-tooltip', 'parameter - cssClass');
    assert.strictEqual(arg[0].eventTrigger, sparkline._eventTrigger, 'parameter - event trigger');
});

QUnit.test('Update method should accept valid params when tooltip is enabled', function(assert) {
    const sparkline = this.createSparkline({
        dataSource: [1, 2, 3, 4, 5, 6, 7],
        tooltip: {
            font: {
                size: 12
            }
        }
    });
    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    assert.equal(tooltip.update.callCount, 1, 'update is called');
    assert.strictEqual(tooltip.update.lastCall.args[0].enabled, true);
    assert.strictEqual(tooltip.update.lastCall.args[0].font.size, 12);
    assert.strictEqual(isFunction(tooltip.update.lastCall.args[0].contentTemplate), true);
});

QUnit.test('Tooltip constructor should accept valid params when tooltip is enabled and no dataSource', function(assert) {
    const sparkline = this.createSparkline({
        tooltip: {
            font: {
                size: 12
            }
        }
    });
    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    const arg = tooltip.ctorArgs;
    assert.strictEqual(arg.length, 1);
    assert.deepEqual(arg[0].cssClass, 'dxsl-tooltip', 'parameter - cssClass');
    assert.strictEqual(arg[0].eventTrigger, sparkline._eventTrigger, 'parameter - event trigger');
});

QUnit.test('Update method should accept valid params when tooltip is enabled and no dataSource', function(assert) {
    const sparkline = this.createSparkline({
        tooltip: {
            font: {
                size: 12
            }
        }
    });
    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    assert.equal(tooltip.update.callCount, 1, 'update is called');
    assert.strictEqual(tooltip.update.lastCall.args[0].enabled, false);
    assert.strictEqual(tooltip.update.lastCall.args[0].font.size, 12);
    assert.strictEqual(isFunction(tooltip.update.lastCall.args[0].contentTemplate), true);
});

QUnit.test('Disabled tooltip', function(assert) {
    const sparkline = this.createSparkline({
        dataSource: [1, 2, 3, 4, 5, 6, 7],
        tooltip: {
            enabled: false
        }
    });
    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    assert.equal(tooltip.update.callCount, 1, 'update is called');
    assert.equal(tooltip.update.lastCall.args[0].enabled, false);
});

QUnit.test('Tooltip when datasource is empty', function(assert) {
    const sparkline = this.createSparkline({
        dataSource: [],
        tooltip: {
            enabled: false
        }
    });

    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    assert.equal(tooltip.update.callCount, 1, 'update is called');
    assert.equal(tooltip.update.lastCall.args[0].enabled, false);
});

QUnit.test('customizeTooltip return html', function(assert) {
    const data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12];
    const customizeTooltipArg = { valueText: ['Cell11', 'Cell12', 'Cell21', 'Cell22'] };
    const customizeTooltip = function() { return { color: 'red', html: 'html text' }; };
    const sparkline = this.createSparkline({
        dataSource: data,
        tooltip: {
            font: {
                size: 12
            },
            customizeTooltip: customizeTooltip
        }
    });

    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    const ct = tooltip.update.lastCall.args[0].customizeTooltip;

    assert.deepEqual(ct.call(customizeTooltipArg, customizeTooltipArg), {
        color: 'red',
        html: 'html text'
    });
});

QUnit.test('customizeTooltip return text', function(assert) {
    const data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12];
    const customizeTooltipArg = { valueText: ['Cell11', 'Cell12', 'Cell21', 'Cell22'] };
    const customizeTooltip = function() { return { color: 'red', text: 'text text' }; };
    const sparkline = this.createSparkline({
        dataSource: data,
        tooltip: {
            font: {
                size: 12
            },
            customizeTooltip
        }
    });

    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    const ct = tooltip.update.lastCall.args[0].customizeTooltip;

    assert.deepEqual(ct.call(customizeTooltipArg, customizeTooltipArg), {
        color: 'red',
        text: 'text text'
    });
});

QUnit.test('Default template should be used when customizeTooltip is not defined', function(assert) {
    const data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12];
    const templateArg = { valueText: ['Cell11', 'Cell12', 'Cell21', 'Cell22'] };
    const $templateContainer = $('<div>');
    const sparkline = this.createSparkline({
        dataSource: data,
        tooltip: {
            font: {
                size: 12
            }
        }
    });

    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    const contentTemplate = tooltip.update.lastCall.args[0].contentTemplate;
    contentTemplate(templateArg, $templateContainer);

    const $table = $templateContainer.find('table');

    checkTemplateTable(assert, $table, templateArg, {
        textAlign: 'right',
        lineHeight: '14px'
    });

});

QUnit.test('Default customizeTooltip callback. Custom linespacing', function(assert) {
    const templateArg = { valueText: ['Cell11', 'Cell12', 'Cell21', 'Cell22'] };
    const $templateContainer = $('<div>');
    const sparkline = this.createSparkline({
        dataSource: [1, 2, 3, 4, 5, 6, 7],
        tooltip: {
            font: { size: 15, lineSpacing: 3 }
        }
    });

    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    const contentTemplate = tooltip.update.lastCall.args[0].contentTemplate;
    contentTemplate(templateArg, $templateContainer);

    const $table = $templateContainer.find('table');

    checkTemplateTable(assert, $table, templateArg, {
        textAlign: 'right',
        lineHeight: '18px'
    });
});

QUnit.test('dxSparkline get TooltipFormatObject', function(assert) {
    const data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12];

    const sparkline = this.createSparkline({
        dataSource: data
    });
    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    assert.deepEqual(tooltip.show.lastCall.args, [{
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
    const sparkline = this.createSparkline({
        dataSource: [0, 0, 0]
    });

    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    assert.strictEqual(tooltip.show.lastCall.args[0].originalMinValue, 0);
    assert.strictEqual(tooltip.show.lastCall.args[0].originalMaxValue, 0);
});

QUnit.test('Default tooltip template should have valid text align when rtl is enabled', function(assert) {
    const templateArg = { valueText: ['Cell11', 'Cell12', 'Cell21', 'Cell22'] };
    const $templateContainer = $('<div>');
    const sparkline = this.createSparkline({
        dataSource: [1, 2, 3, 4, 5, 6, 7],
        tooltip: {
            font: { size: 12 }
        },
        rtlEnabled: true
    });

    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);

    const contentTemplate = tooltip.update.lastCall.args[0].contentTemplate;
    contentTemplate(templateArg, $templateContainer);

    const $table = $templateContainer.find('table');

    checkTemplateTable(assert, $table, templateArg, {
        textAlign: 'left',
        lineHeight: '14px'
    });
});

QUnit.test('Winloss sparkline get TooltipFormatObject', function(assert) {
    const data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12];

    const sparkline = this.createSparkline({
        dataSource: data,
        type: 'winloss'
    });
    showSparklineTooltip(sparkline);
    const tooltip = getSparklineTooltip(sparkline);


    assert.deepEqual(tooltip.show.lastCall.args, [{
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
