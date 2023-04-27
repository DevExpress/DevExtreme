/* global currentTest, createTestContainer */

import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import tooltipModule from 'viz/core/tooltip';
import rendererModule from 'viz/core/renderers/renderer';
import baseThemeManagerModule from 'viz/core/base_theme_manager';
import { isFunction } from 'core/utils/type';
const TOOLTIP_TABLE_BORDER_SPACING = 0;
const TOOLTIP_TABLE_KEY_VALUE_SPACE = 15;

import 'viz/bullet';

$('<div>')
    .attr('id', 'container')
    .css({ width: 250, height: 20 })
    .appendTo('#qunit-fixture');

const StubThemeManager = vizMocks.stubClass(baseThemeManagerModule.BaseThemeManager);
const StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip, { isEnabled: function() { return true; }, formatValue: function(value, format) { return value + ':' + format; } });

tooltipModule.DEBUG_set_tooltip(function(parameters) {
    return new StubTooltip(parameters);
});
rendererModule.Renderer = function() {
    return currentTest().renderer;
};

baseThemeManagerModule.BaseThemeManager = function() {
    return currentTest().themeManager;
};

StubThemeManager.prototype.setTheme = function() {
    vizMocks.forceThemeOptions(this);
};

function getBulletTooltip(bullet) {
    return bullet._tooltip;
}

function showBulletTooltip(bullet) {
    bullet._showTooltip();
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
        this.$container = $(createTestContainer('#container'));
    },
    afterEach: function() {
        this.$container.remove();
    },
    createBullet(options) {
        return this.$container.dxBullet($.extend(true, {
            tooltip: {
                enabled: true
            }
        }, options)).dxBullet('instance');
    }
};

QUnit.module('Bullet tooltip', environment);

QUnit.test('Tooltip constructor should accept valid params when tooltip is enabled', function(assert) {
    const bullet = this.createBullet({
        value: 10,
        maxScaleValue: 20,
        tooltip: {
            font: {
                size: 12
            }
        }
    });
    showBulletTooltip(bullet);
    const tooltip = getBulletTooltip(bullet);

    const arg = tooltip.ctorArgs;
    assert.strictEqual(arg.length, 1);
    assert.deepEqual(arg[0].cssClass, 'dxb-tooltip', 'parameter - cssClass');
    assert.strictEqual(arg[0].eventTrigger, bullet._eventTrigger, 'parameter - event trigger');
});

QUnit.test('Update method shoul accept valid params when tooltip enabled', function(assert) {
    const bullet = this.createBullet({
        value: 10,
        maxScaleValue: 20,
        tooltip: {
            font: {
                size: 12
            }
        }
    });
    showBulletTooltip(bullet);
    const tooltip = getBulletTooltip(bullet);

    assert.equal(tooltip.update.callCount, 1, 'update is called');
    assert.strictEqual(tooltip.update.lastCall.args[0].enabled, true);
    assert.strictEqual(tooltip.update.lastCall.args[0].font.size, 12);
    assert.strictEqual(isFunction(tooltip.update.lastCall.args[0].contentTemplate), true);
});

QUnit.test('Tooltip constructor should accept valid parems when tooltip enabled and no data', function(assert) {
    const bullet = this.createBullet({
        tooltip: {
            font: {
                size: 12
            }
        }
    });
    showBulletTooltip(bullet);
    const tooltip = getBulletTooltip(bullet);

    const arg = tooltip.ctorArgs;
    assert.strictEqual(arg.length, 1);
    assert.deepEqual(arg[0].cssClass, 'dxb-tooltip', 'parameter - cssClass');
    assert.strictEqual(arg[0].eventTrigger, bullet._eventTrigger, 'parameter - event trigger');
});

QUnit.test('Update method should accept valid params when tooltip is enabled and no data', function(assert) {
    const bullet = this.createBullet({
        tooltip: {
            font: {
                size: 12
            }
        }
    });
    showBulletTooltip(bullet);
    const tooltip = getBulletTooltip(bullet);

    assert.equal(tooltip.update.callCount, 1, 'update is called');
    assert.strictEqual(tooltip.update.lastCall.args[0].enabled, false);
    assert.strictEqual(tooltip.update.lastCall.args[0].font.size, 12);
    assert.strictEqual(isFunction(tooltip.update.lastCall.args[0].contentTemplate), true);
});

QUnit.test('Disabled tooltip', function(assert) {
    const bullet = this.createBullet({
        value: 10,
        maxScaleValue: 20,
        tooltip: {
            enabled: false
        }
    });

    showBulletTooltip(bullet);
    const tooltip = getBulletTooltip(bullet);

    assert.equal(tooltip.update.callCount, 1, 'update is called');
    assert.equal(tooltip.update.lastCall.args[0].enabled, false);
});

QUnit.test('dxBullet get TooltipFormatObject', function(assert) {
    this.renderer.bBoxTemplate = { x: 10, width: 200 };
    const bullet = this.createBullet({
        value: 10, target: 20, endScaleValue: 30
    });
    showBulletTooltip(bullet);
    const tooltip = getBulletTooltip(bullet);

    assert.deepEqual(tooltip.show.lastCall.args, [{
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

QUnit.test('Default template should be used when customizeTooltip is not specified', function(assert) {
    const data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12];
    const templateArg = { valueText: ['Cell11', 'Cell12', 'Cell21', 'Cell22'] };
    const $templateContainer = $('<div>');
    const bullet = this.createBullet({
        dataSource: data,
        tooltip: {
            font: { size: 12 }
        }
    });

    showBulletTooltip(bullet);
    const tooltip = getBulletTooltip(bullet);

    const contentTemplate = tooltip.update.lastCall.args[0].contentTemplate;
    contentTemplate(templateArg, $templateContainer);
    const $table = $templateContainer.find('table');

    checkTemplateTable(assert, $table, templateArg, {
        textAlign: 'right',
        lineHeight: '14px'
    });
});


QUnit.test('Default tooltip template should have valid text align when rtl enabled', function(assert) {
    const data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12];
    const templateArg = { valueText: ['Cell11', 'Cell12', 'Cell21', 'Cell22'] };
    const $templateContainer = $('<div>');
    const bullet = this.createBullet({
        dataSource: data,
        tooltip: {
            font: { size: 12 }
        },
        rtlEnabled: true
    });

    showBulletTooltip(bullet);
    const tooltip = getBulletTooltip(bullet);

    const contentTemplate = tooltip.update.lastCall.args[0].contentTemplate;
    contentTemplate(templateArg, $templateContainer);
    const $table = $templateContainer.find('table');

    checkTemplateTable(assert, $table, templateArg, {
        textAlign: 'left',
        lineHeight: '14px'
    });
});

QUnit.test('Method "show" should accept valud info', function(assert) {
    const data = [4, 8, 6, 9, 5, 7, 8, 6, 8, 1, 2, 6, 23, 2, 8, 9, 4, 5, 6, -1, 12];

    const bullet = this.createBullet({
        dataSource: data,
        type: 'winloss'
    });
    showBulletTooltip(bullet);
    const tooltip = getBulletTooltip(bullet);

    assert.deepEqual(tooltip.show.lastCall.args, [{
        'originalValue': 0,
        'originalTarget': 0,
        'value': '0:undefined',
        'target': '0:undefined',
        'valueText': ['Actual Value:', '0:undefined', 'Target Value:', '0:undefined']
    }, { 'x': 14, 'y': 20 }, {}]);
});
