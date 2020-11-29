/* global currentTest */

import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import tooltipModule from 'viz/core/tooltip';
const Tooltip = tooltipModule.Tooltip;
import vizUtils from 'viz/core/utils';
import rendererModule from 'viz/core/renderers/renderer';
import domAdapter from 'core/dom_adapter';

QUnit.testStart(function() {
    $('<div>')
        .attr('class', 'some-correct-class-name')
        .appendTo($('#qunit-fixture'));
});

const CANVAS = { left: 0, top: 0, width: 800, height: 600, bottom: 0, right: 0 };

function getInitialOptions() {
    return {
        enabled: true,
        shared: false,
        location: 'center',
        color: '#ffffff',
        border: {
            width: 1,
            color: '#252525',
            dashStyle: 'solid',
            opacity: 0.9,
            visible: true
        },
        opacity: 0.8,
        customizeTooltip: function() { return 1; },
        font: {
            size: 14,
            family: '\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana',
            weight: 400,
            color: '#939393',
            opacity: 0.7
        },
        arrowLength: 10,
        paddingLeftRight: 18,
        paddingTopBottom: 15,
        shadow: {
            opacity: 0.6,
            color: '#000000',
            offsetX: 5,
            offsetY: 6,
            blur: 7
        }
    };
}

rendererModule.Renderer = function(parameters) {
    const renderer = new vizMocks.Renderer(parameters);
    currentTest().renderer = renderer;
    return renderer;
};

QUnit.module('Main functionality', {
    beforeEach: function() {
        this.options = getInitialOptions();

        this._oldPatchFontOptions = vizUtils.patchFontOptions;
        this.patchFontOptions = sinon.spy(function() { return this._oldPatchFontOptions.apply(null, arguments); }.bind(this));
        vizUtils.patchFontOptions = this.patchFontOptions;
    },
    afterEach: function() {
        vizUtils.patchFontOptions = this._oldPatchFontOptions;
    }
});

QUnit.test('Create tooltip', function(assert) {
    const et = { event: 'trigger' };
    let div;

    // act
    const tooltip = new Tooltip({ eventTrigger: et, cssClass: 'tooltip-class', pathModified: 'pathModified-option' });

    // assert
    assert.equal(tooltip._eventTrigger, et, 'eventTrigger');
    assert.deepEqual(tooltip._renderer.ctorArgs, [{ pathModified: 'pathModified-option', container: tooltip._wrapper[0] }], 'renderer with rendererOptions');

    assert.ok(tooltip._wrapper, 'wrapper');
    const wrapper = tooltip._wrapper.get(0);
    assert.equal(wrapper.nodeName, 'DIV');
    assert.equal(wrapper.className, 'tooltip-class');
    assert.equal(wrapper.style.position, 'absolute');
    assert.equal(wrapper.style.overflow, 'hidden');

    assert.equal(tooltip._renderer.root.attr.callCount, 1, 'renderer root attr');
    assert.deepEqual(tooltip._renderer.root.attr.firstCall.args, [{ 'pointer-events': 'none' }]);

    // for svg text ↓
    assert.equal(tooltip._renderer.text.callCount, 1, 'text element created');
    assert.deepEqual(tooltip._renderer.text.firstCall.args, [undefined, 0, 0]);
    assert.equal(tooltip._text, tooltip._renderer.text.firstCall.returnValue);

    // for html text ↓
    assert.ok(tooltip._textGroupHtml, 'textGroupHtml');
    div = tooltip._textGroupHtml.get(0);
    assert.equal(div.nodeName, 'DIV');
    assert.equal(div.parentNode, tooltip._wrapper.get(0));
    assert.equal(div.style.position, 'absolute');
    assert.equal(div.style.width, '');
    assert.equal(div.style.padding, '0px');
    assert.equal(div.style.margin, '0px');
    assert.equal(div.style['border-width'], '0px');
    assert.equal(div.style['border-style'], 'solid');
    assert.equal(div.style['border-color'], 'transparent');

    assert.ok(tooltip._textHtml, 'textHtml');
    div = tooltip._textHtml.get(0);
    assert.equal(div.nodeName, 'DIV');
    assert.equal(div.parentNode, tooltip._textGroupHtml.get(0));
    assert.equal(div.style.position, 'relative');
    assert.equal(div.style.display, 'inline-block');
    assert.equal(div.style.padding, '0px');
    assert.equal(div.style.margin, '0px');
    assert.equal(div.style['border-width'], '0px');
    assert.equal(div.style['border-style'], 'solid');
    assert.equal(div.style['border-color'], 'transparent');
    // for html text ↑
});

QUnit.test('Set options. All options', function(assert) {
    const et = { event: 'trigger' };
    const tooltip = new Tooltip({ eventTrigger: et });

    // act
    const result = tooltip.setOptions(this.options);

    // assert
    assert.equal(tooltip, result);
    assert.deepEqual(tooltip._options, this.options, 'whole options');

    assert.equal(this.patchFontOptions.callCount, 1, 'font');
    assert.deepEqual(this.patchFontOptions.firstCall.args, [this.options.font]);
    assert.equal(tooltip._textFontStyles, this.patchFontOptions.firstCall.returnValue); // reference
    assert.notEqual(tooltip._textFontStyles.color, this.options.font.color); // additional value
    assert.equal(tooltip._textFontStyles.color, tooltip._textFontStyles.fill); // T879069
    assert.notOk(tooltip._textFontStyles.color.opacity); // T879069

    assert.equal(tooltip._customizeTooltip, this.options.customizeTooltip, 'customizeTooltip');
});

QUnit.test('Set options. Cloud border options', function(assert) {
    const et = { event: 'trigger' };
    const tooltip = new Tooltip({ eventTrigger: et });
    this.options.border.visible = false;
    // act
    const result = tooltip.setOptions(this.options);

    // assert
    assert.equal(tooltip, result);
    assert.deepEqual(tooltip._options, this.options, 'whole options');
});

QUnit.test('Set options. ZIndex', function(assert) {
    const et = { event: 'trigger' };
    const tooltip = new Tooltip({ eventTrigger: et });
    this.options.zIndex = 1000;
    // act
    sinon.spy(tooltip._wrapper, 'css');
    const result = tooltip.setOptions(this.options);

    // assert
    assert.equal(tooltip, result);
    assert.deepEqual(tooltip._options, this.options, 'whole options');
    assert.deepEqual(tooltip._wrapper.css.lastCall.args[0], { 'zIndex': 1000 }, 'zIndex');
});

QUnit.test('Set options. Container is incorrect', function(assert) {
    const et = { event: 'trigger' };
    const tooltip = new Tooltip({ eventTrigger: et });
    this.options.container = '.some-wrong-class-name';
    // act
    const result = tooltip.setOptions(this.options);

    // assert
    assert.equal(tooltip, result);
    assert.equal(tooltip._getContainer(), $('body').get(0));
});

QUnit.test('Set options. Container is correct', function(assert) {
    const et = { event: 'trigger' };
    const tooltip = new Tooltip({ eventTrigger: et });
    this.options.container = '.some-correct-class-name';
    // act
    const result = tooltip.setOptions(this.options);

    // assert
    assert.equal(tooltip, result);
    assert.equal(tooltip._getContainer(), $('.some-correct-class-name').get(0));
});

QUnit.test('Append tooltip to container on shown', function(assert) {
    $('#qunit-fixture')
        .append('<div class=\'tooltip-container\'></div>')
        .append('<div class=\'tooltip-container\'></div>');

    const et = { eventTrigger: function() {}, cssClass: 'test-tooltip' };
    const tooltip = new Tooltip(et);

    this.options.container = '.tooltip-container';
    tooltip.setOptions(this.options);

    tooltip.show({ valueText: 'text' }, {});
    // act
    $('.tooltip-container').eq(0).remove();
    tooltip.show({ valueText: 'text' }, {});

    assert.strictEqual($('.test-tooltip').parent().get(0), $('.tooltip-container').get(0));
});

QUnit.test('Tooltip should be appended in the closest element to root', function(assert) {
    $('#qunit-fixture')
        .append('<div class=\'tooltip-container far\'></div>')
        .append('<div class=\'tooltip-container\'><div id=\'root\'></div></div>');

    const et = { eventTrigger: function() { }, cssClass: 'test-tooltip', widgetRoot: $('#root').get(0) };
    const tooltip = new Tooltip(et);

    this.options.container = '.tooltip-container';

    tooltip.setOptions(this.options);

    tooltip.show({ valueText: 'text' }, {});
    // act
    const $tooltipContainer = $('.test-tooltip').parent().eq(0);
    assert.ok($tooltipContainer.hasClass('tooltip-container'));
    assert.ok(!$tooltipContainer.hasClass('far'));
});

// T803622
QUnit.test('Container has offset', function(assert) {
    $('#qunit-fixture')
        .append('<div class="tooltipContainer" style="position: absolute; left: 20px; top:20px; width: 500px; height:100%;"></div>');

    const tooltip = new Tooltip({ eventTrigger: function() {} });

    this.options.container = '.tooltipContainer';
    tooltip.update(this.options);

    // act
    tooltip.show({ description: 'some-text' }, { x: 100, y: 200 });

    // assert
    assert.equal(tooltip._wrapper.get(0).style.left, '10042px', 'wrapper is moved to invisible area');
    assert.equal(tooltip._wrapper.get(0).style.top, '10121px', 'wrapper is moved to invisible area');
});

QUnit.test('Body has vertical scroll', function(assert) {
    const container = $('<div style="height: 4000px"></div>').appendTo(domAdapter.getDocument().body);

    try {
        const tooltip = new Tooltip({ eventTrigger: function() { } });
        tooltip.update(this.options);
        // act
        tooltip.show({ description: 'some-text' }, { x: 100, y: 2000 });
        // assert
        assert.equal(tooltip._wrapper.get(0).style.left, '62px', 'wrapper is moved to invisible area');
        assert.equal(tooltip._wrapper.get(0).style.top, '1941px', 'wrapper is moved to invisible area');
    } finally {
        container.remove();
    }
});

QUnit.test('Body has horizontal scroll', function(assert) {
    const container = $('<div style="width: 4000px; height: 600px;"></div>').appendTo(domAdapter.getDocument().body);
    const documentElement = domAdapter.getDocument().documentElement;
    const body = $('body').get(0);
    const bodyScrollLeft = body.scrollLeft;
    const documentScrollLeft = documentElement.scrollLeft;
    body.scrollLeft = documentElement.scrollLeft = 3000;

    try {
        const tooltip = new Tooltip({ eventTrigger: function() { } });
        tooltip.update(this.options);
        // act
        tooltip.show({ description: 'some-text' }, { x: 3100, y: 100 });
        // assert
        assert.equal(tooltip._wrapper.get(0).style.left, '3062px');
        assert.equal(tooltip._wrapper.get(0).style.top, '41px');
    } finally {
        body.scrollLeft = bodyScrollLeft;
        documentElement.scrollLeft = documentScrollLeft;
        container.remove();
    }
});

QUnit.test('Set options. customizeTooltip', function(assert) {
    const et = { event: 'trigger' };
    const tooltip = new Tooltip({ eventTrigger: et });
    this.options.customizeTooltip = {};
    // act
    const result = tooltip.setOptions(this.options);

    // assert
    assert.equal(tooltip, result);
    assert.deepEqual(tooltip._options, this.options, 'whole options');
});

QUnit.test('Set options. Two times', function(assert) {
    const et = { event: 'trigger' };
    const options2 = {
        enabled: false,
        shared: true,
        location: 'left',
        border: {
            width: 2,
            color: 'color1',
            dashStyle: 'dashStyle',
            opacity: 0.9,
            visible: true
        },
        color: 'color2',
        opacity: 0.8,
        customizeTooltip: {},
        format: 'format10',
        argumentFormat: 'format20',
        precision: 10,
        argumentPrecision: 20,
        percentPrecision: 30,
        font: {
            size: 120,
            family: 'Some font',
            weight: 40,
            color: 'color3',
            opacity: 0.7
        },
        arrowLength: 100,
        paddingLeftRight: 180,
        paddingTopBottom: 150,
        shadow: {
            opacity: 0.6,
            color: 'color4',
            offsetX: 13,
            offsetY: 40,
            blur: 20
        }
    };
    const tooltip = new Tooltip({ eventTrigger: et });

    tooltip.setOptions(this.options);

    // act
    const result = tooltip.setOptions(options2);

    // assert
    assert.equal(tooltip, result);
    assert.deepEqual(tooltip._options, options2, 'whole options');

    assert.equal(this.patchFontOptions.callCount, 2, 'font');
    assert.deepEqual(this.patchFontOptions.lastCall.args, [options2.font]);
    assert.deepEqual(tooltip._textFontStyles, this.patchFontOptions.lastCall.returnValue);
});

QUnit.test('Set renderer options', function(assert) {
    const options = { tag: 'options' };
    const tooltip = new Tooltip({});

    tooltip.setRendererOptions(options);

    assert.deepEqual(this.renderer.setOptions.lastCall.args, [options], 'renderer options');
    assert.strictEqual(tooltip._wrapper.children().first().css('direction'), 'ltr', 'direction');
});

QUnit.test('Set renderer options / rtl enabled', function(assert) {
    const options = { tag: 'options', rtl: 1 };
    const tooltip = new Tooltip({});

    tooltip.setRendererOptions(options);

    assert.deepEqual(this.renderer.setOptions.lastCall.args, [options], 'renderer options');
    assert.strictEqual(tooltip._wrapper.children().first().css('direction'), 'rtl', 'direction');
});

QUnit.test('Update', function(assert) {
    const et = { event: 'trigger' };
    const tooltip = new Tooltip({ eventTrigger: et });

    tooltip._wrapper.appendTo = sinon.spy();
    tooltip._wrapper.detach = sinon.spy();
    tooltip._textGroupHtml.css = sinon.spy();

    const result = tooltip.update(this.options);

    // assert
    assert.equal(tooltip, result);

    assert.equal(tooltip._wrapper.appendTo.callCount, 0, 'wrapper is not added to dom');
    assert.equal(tooltip._wrapper.get(0).style.left, '-9999px', 'wrapper is moved to invisible area');
    assert.equal(tooltip._wrapper.detach.callCount, 1, 'wrapper detached');

    // for svg text ↓
    assert.equal(tooltip._text.css.callCount, 1, 'text styles');
    assert.deepEqual(tooltip._text.css.firstCall.args[0], tooltip._textFontStyles);
    // for svg text ↑

    // for html text ↓
    assert.equal(tooltip._textGroupHtml.css.callCount, 1, 'textGroupHtml styles');
    assert.deepEqual(tooltip._textGroupHtml.css.firstCall.args[0], {
        color: 'rgba(147,147,147,0.7)',
        fill: 'rgba(147,147,147,0.7)',
        fontFamily: '\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana',
        fontSize: 14,
        fontWeight: 400,
        opacity: null
    });
    // for html text ↑
});

QUnit.test('Disposing', function(assert) {
    const et = { event: 'trigger' };
    const tooltip = new Tooltip({ eventTrigger: et, widgetRoot: $('#qunit-fixture') });
    tooltip._wrapper.remove && (tooltip._wrapper.remove = sinon.spy());

    // act
    tooltip.dispose();

    // assert
    assert.equal(tooltip._renderer.dispose.callCount, 1);
    assert.equal(tooltip._wrapper.remove.callCount, 1);
    assert.equal(tooltip._options, null);
    assert.equal(tooltip._widgetRoot, null);
});

QUnit.test('formatValue. Default format', function(assert) {
    const tooltip = new Tooltip({ eventTrigger: {} });
    tooltip.setOptions($.extend(this.options,
        { format: '' }));

    assert.equal(tooltip.formatValue('test'), 'test');
});

QUnit.test('formatValue. Custom format', function(assert) {
    const tooltip = new Tooltip({ eventTrigger: {} });
    tooltip.setOptions($.extend(this.options,
        { format: { type: 'currency', precision: 3, percentPrecision: 4 }, argumentFormat: { type: 'percent', precision: 1 } }));

    assert.equal(tooltip.formatValue(30), '$30.000');
    assert.equal(tooltip.formatValue(0.1, 'argument'), '10.0%');
    assert.equal(tooltip.formatValue(0.4, 'percent'), '40.0000%');
});

QUnit.test('formatValue. Custom format without precision', function(assert) {
    const tooltip = new Tooltip({ eventTrigger: {} });
    tooltip.setOptions($.extend(this.options,
        { format: 'currency', argumentFormat: '' }));

    assert.equal(tooltip.formatValue(30), '$30');
    assert.equal(tooltip.formatValue(0.1, 'argument'), 0.1);
    assert.equal(tooltip.formatValue(0.4, 'percent'), '40%');
});

QUnit.test('formatValue. Null argumentFormat', function(assert) {
    const tooltip = new Tooltip({ eventTrigger: {} });
    tooltip.setOptions($.extend(this.options,
        { argumentFormat: null }));

    assert.equal(tooltip.formatValue(12, 'argument'), 12);
});

QUnit.test('formatValue. Null valueFormat', function(assert) {
    const tooltip = new Tooltip({ eventTrigger: {} });
    tooltip.setOptions($.extend(this.options,
        { format: null }));

    assert.equal(tooltip.formatValue(12, 'value'), 12);
});

QUnit.test('getLocation', function(assert) {
    this.testCase = function(option, expected) {
        const tooltip = new Tooltip({ eventTrigger: {} });
        tooltip.setOptions($.extend(this.options, { location: option }));

        assert.equal(tooltip.getLocation(), expected);
    };

    this.testCase('edge', 'edge');
    this.testCase('CenTer', 'center');
    this.testCase(null, 'null');
    this.testCase(5, '5');
});

QUnit.test('isEnabled', function(assert) {
    this.testCase = function(option, expected) {
        const tooltip = new Tooltip({ eventTrigger: {} });
        tooltip.setOptions($.extend(this.options, { enabled: option }));

        assert.equal(tooltip.isEnabled(), expected);
    };

    this.testCase(true, true);
    this.testCase(false, false);
    this.testCase(null, false);
    this.testCase(5, true);
});

QUnit.test('isShared', function(assert) {
    this.testCase = function(option, expected) {
        const tooltip = new Tooltip({ eventTrigger: {} });
        tooltip.setOptions($.extend(this.options, { shared: option }));

        assert.equal(tooltip.isShared(), expected);
    };

    this.testCase(true, true);
    this.testCase(false, false);
    this.testCase(null, false);
    this.testCase(5, true);
});

QUnit.module('Manipulation', {
    beforeEach: function() {
        let tooltip;
        const getComputedStyle = window.getComputedStyle;

        this.options = getInitialOptions();
        this.eventTrigger = sinon.spy();
        this.tooltip = tooltip = new Tooltip({
            eventTrigger: this.eventTrigger,
            widget: {
                _getTemplate(callback) {
                    return {
                        render(arg) {
                            callback(arg.model, arg.container, arg.onRendered);
                        }
                    };
                }
            }
        });
        tooltip.update(this.options);

        this.resetTooltipMocks = function() {
            tooltip._text.stub('css').reset();
            tooltip._renderer.stub('resize').reset();
        };

        if(tooltip._textGroup && tooltip._textGroup.stub('getBBox')) {
            tooltip._textGroup.getBBox = sinon.spy(function() { return { x: -10, y: -5, width: 20, height: 7 }; });
        }

        if(getComputedStyle) {
            this.getComputedStyle = sinon.stub(window, 'getComputedStyle', function(elem) {
                if(elem === tooltip._textHtml.get(0)) {
                    return { width: '83.13px', height: '23.45px', getPropertyValue: () => {} };
                }
                return getComputedStyle.apply(window, arguments);
            });
        }
    },
    afterEach: function() {
        this.getComputedStyle && this.getComputedStyle.restore();
        this.tooltip.dispose();
    }
});

QUnit.test('Tug plaque content for shadow (T891490)', function(assert) {
    this.tooltip.update(this.options);

    this.tooltip.show({ valueText: 'some-text' }, { x: 100, y: 200, offset: 300 });

    assert.equal(this.tooltip.plaque._root.append.callCount, 2, 'Plaque tugged after render');
});

QUnit.test('Show preparations. W/o customize, empty text', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const result = this.tooltip.show({ valueText: '' }, {});

    assert.strictEqual(result, false);
    assert.equal(this.eventTrigger.callCount, 0, 'event is not triggered');

    assert.deepEqual(this.tooltip._state, {
        a: 'b'
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, 'wrapper is not added to dom');
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test('Show preparations. W/o customize, w/ text', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: 'some-text' };
    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, 'eventData');

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', 'eventData'], 'event is triggered');

    assert.deepEqual(this.tooltip._state, {
        color: '#ffffff',
        borderColor: '#252525',
        textColor: 'rgba(147,147,147,0.7)',
        eventData: 'eventData',
        formatObject: formatObject,
        text: 'some-text',
        templateCallback: undefined
    }, 'state');

    const cloudSettings = this.renderer.path.lastCall.returnValue._stored_settings;
    delete cloudSettings.d;
    delete cloudSettings.points;

    assert.deepEqual(cloudSettings, {
        fill: '#ffffff',
        stroke: '#252525',
        'stroke-width': 1,
        'stroke-opacity': 0.9,
        dashStyle: 'solid',
        type: 'area',
        opacity: 0.8,
        'pointer-events': 'none'
    });

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, 'wrapper is added to dom');
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$('body').get(0)]);
});

QUnit.test('Tooltip with corener radius', function(assert) {
    this.options.customizeTooltip = null;
    this.options.cornerRadius = 10;
    this.tooltip.update(this.options);
    this.tooltip._state = { a: 'b' };

    this.tooltip.show({ valueText: 'some-text' }, { x: 100, y: 200, offset: 300 });
    const cloudSettings = this.renderer.path.lastCall.returnValue._stored_settings;

    assert.ok(cloudSettings.d.indexOf('a 10 10 0 0 1 10 -10') >= 0, 'Cloud is rendered with arcs');
});

QUnit.test('Show preparations. W/o customize, w/ text from \'description\' filed', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { description: 'some-text' };

    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, 'eventData');

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', 'eventData'], 'event is triggered');

    assert.deepEqual(this.tooltip._state, {
        color: '#ffffff',
        borderColor: '#252525',
        eventData: 'eventData',
        textColor: 'rgba(147,147,147,0.7)',
        text: 'some-text',
        formatObject: formatObject,
        templateCallback: undefined
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, 'wrapper is added to dom');
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$('body').get(0)]);
});

QUnit.test('Show preparations. W/ customize empty text, empty text', function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { text: '', color: 'cColor1', borderColor: 'cColor2', fontColor: 'cColor3', someAnotherProperty: 'some-value' }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: '' };

    const result = this.tooltip.show(formatObject, {});

    assert.strictEqual(result, false);
    assert.equal(this.eventTrigger.callCount, 0, 'event is not triggered');

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        a: 'b'
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, 'wrapper is not added to dom');
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test('Show preparations. W/ customize undefined text, empty text', function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { text: undefined, color: 'cColor1', borderColor: 'cColor2', fontColor: 'cColor3', someAnotherProperty: 'some-value' }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: '' };

    const result = this.tooltip.show(formatObject, {});

    assert.strictEqual(result, false);
    assert.equal(this.eventTrigger.callCount, 0, 'event is not triggered');

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        a: 'b'
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, 'wrapper is not added to dom');
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test('Show preparations. W/ customize w/o text, empty text', function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { color: 'cColor1', borderColor: 'cColor2', fontColor: 'cColor3', someAnotherProperty: 'some-value' }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: '' };

    const result = this.tooltip.show(formatObject, {});

    assert.strictEqual(result, false);
    assert.equal(this.eventTrigger.callCount, 0, 'event is not triggered');

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        a: 'b'
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, 'wrapper is not added to dom');
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test('Show preparations. W/ customize w/o text, w/ text', function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { color: 'cColor1', borderColor: 'cColor2', fontColor: 'cColor3', someAnotherProperty: 'some-value' }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: 'some-text' };

    const result = this.tooltip.show(formatObject, { x: 10, y: 20 }, 'eventData');

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', 'eventData'], 'event is triggered');

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        color: 'cColor1',
        borderColor: 'cColor2',
        textColor: 'cColor3',
        text: 'some-text',
        eventData: 'eventData',
        formatObject: formatObject,
        templateCallback: undefined
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, 'wrapper is not added to dom');
});

QUnit.test('Show preparations. customizeTooltip is not function - use custom format', function(assert) {
    this.options.customizeTooltip = {};
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: 'some-text' };

    const result = this.tooltip.show(formatObject, { x: 10, y: 20 });

    assert.strictEqual(result, true);
    assert.deepEqual(this.tooltip._state.text, 'some-text');
});

QUnit.test('Show preparations. W/ customize w/ text, empty text', function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { text: 'some-customized-text', color: 'cColor1', borderColor: 'cColor2', fontColor: 'cColor3', someAnotherProperty: 'some-value' }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: '' };

    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, 'eventData');

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', 'eventData'], 'event is triggered');

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        color: 'cColor1',
        borderColor: 'cColor2',
        textColor: 'cColor3',
        eventData: 'eventData',
        text: 'some-customized-text',
        formatObject,
        templateCallback: undefined
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, 'wrapper is added to dom');
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$('body').get(0)]);
});

QUnit.test('Show preparations. W/ customize w/ text, w/ text', function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { text: 'some-customized-text', color: 'cColor1', borderColor: 'cColor2', fontColor: 'cColor3', someAnotherProperty: 'some-value' }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: 'some-text' };

    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, 'eventData');

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', 'eventData'], 'event is triggered');

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        color: 'cColor1',
        borderColor: 'cColor2',
        textColor: 'cColor3',
        eventData: 'eventData',
        text: 'some-customized-text',
        formatObject,
        templateCallback: undefined
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, 'wrapper is added to dom');
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$('body').get(0)]);
});

QUnit.test('Show preparations. W/ customize empty html', function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { html: '', color: 'cColor1', borderColor: 'cColor2', fontColor: 'cColor3', someAnotherProperty: 'some-value' }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: '' };

    const result = this.tooltip.show(formatObject, {});

    assert.strictEqual(result, false);
    assert.strictEqual(this.eventTrigger.callCount, 0, 'event is not triggered');

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        a: 'b'
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, 'wrapper is not added to dom');
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test('Show preparations. W/ customize empty html, w/text', function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { html: '', color: 'cColor1', borderColor: 'cColor2', fontColor: 'cColor3', someAnotherProperty: 'some-value' }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: '10' };

    const result = this.tooltip.show(formatObject, {});

    assert.strictEqual(result, false);
    assert.strictEqual(this.eventTrigger.callCount, 0, 'event is not triggered');

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        a: 'b'
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, 'wrapper is not added to dom');
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test('Show preparations. W/ customize undefined html', function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { html: undefined, color: 'cColor1', borderColor: 'cColor2', fontColor: 'cColor3', someAnotherProperty: 'some-value' }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: '' };

    const result = this.tooltip.show(formatObject, {});

    assert.strictEqual(result, false);
    assert.strictEqual(this.eventTrigger.callCount, 0, 'event is not triggered');

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        a: 'b'
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, 'wrapper is not added to dom');
    assert.equal(this.tooltip.move.callCount, 0);
});

QUnit.test('Show preparations. W/ customize w/ html', function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { html: 'some-customized-html', color: 'cColor1', borderColor: 'cColor2', fontColor: 'cColor3', someAnotherProperty: 'some-value' }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: '' };

    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, 'eventData');

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', 'eventData'], 'event is triggered');

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        color: 'cColor1',
        borderColor: 'cColor2',
        textColor: 'cColor3',
        eventData: 'eventData',
        html: 'some-customized-html',
        formatObject,
        templateCallback: undefined
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, 'wrapper is added to dom');
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$('body').get(0)]);
});

QUnit.test('Show preparations. W/ customize w/ html/text', function(assert) {
    this.options.customizeTooltip = sinon.spy(function() { return { text: 'some-customized-text', html: 'some-customized-html', color: 'cColor1', borderColor: 'cColor2', fontColor: 'cColor3', someAnotherProperty: 'some-value' }; });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: '' };

    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, 'eventData');

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', 'eventData'], 'event is triggered');

    assert.equal(this.options.customizeTooltip.callCount, 1);
    assert.equal(this.options.customizeTooltip.firstCall.thisValue, formatObject);
    assert.equal(this.options.customizeTooltip.firstCall.args[0], formatObject);
    assert.deepEqual(this.tooltip._state, {
        color: 'cColor1',
        borderColor: 'cColor2',
        textColor: 'cColor3',
        text: 'some-customized-text',
        eventData: 'eventData',
        html: 'some-customized-html',
        formatObject,
        templateCallback: undefined
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, 'wrapper is added to dom');
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$('body').get(0)]);
});

QUnit.test('Show preparations. Certain container', function(assert) {
    this.options.customizeTooltip = null;
    this.options.container = '.some-correct-class-name';
    this.tooltip._getCanvas = function() { return CANVAS; };
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: 'some-text' };
    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, 'eventData');

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', 'eventData'], 'event is triggered');

    assert.deepEqual(this.tooltip._state, {
        color: '#ffffff',
        borderColor: '#252525',
        textColor: 'rgba(147,147,147,0.7)',
        text: 'some-text',
        eventData: 'eventData',
        formatObject,
        templateCallback: undefined
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 1, 'wrapper is added to dom');
    assert.deepEqual(this.tooltip._wrapper.appendTo.firstCall.args, [$('.some-correct-class-name').get(0)]);
});

QUnit.test('Show preparations. Certain container, tooltip out of canvas', function(assert) {
    this.options.customizeTooltip = null;
    this.options.container = '.some-correct-class-name';
    this.tooltip.update(this.options);

    const formatObject = { valueText: 'some-text' };
    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, 'eventData');

    assert.strictEqual(result, false, 'tooltip is not drawn');
    assert.ok(!this.eventTrigger.called, 'event is not triggered');
});

QUnit.test('Show. W/o params', function(assert) {
    this.options.customizeTooltip = null;
    this.options.cssClass = 'tooltip_class';
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._textGroupHtml.css = sinon.spy();
    this.tooltip._textGroupHtml.width = sinon.spy(function() { return 85; });
    this.tooltip._textGroupHtml.height = sinon.spy(function() { return 43; });
    this.tooltip._textHtml.empty = sinon.spy();
    const eventData = { tag: 'event-data' };

    const formatObject = { valueText: 'some-text' };
    // act
    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, eventData);

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', eventData], 'event is triggered');

    assert.deepEqual(this.tooltip._state, {
        color: '#ffffff',
        borderColor: '#252525',
        textColor: 'rgba(147,147,147,0.7)',
        text: 'some-text',
        eventData,
        formatObject,
        templateCallback: undefined
    }, 'state');

    const cloud = this.renderer.path.lastCall.returnValue;
    assert.equal(cloud._stored_settings.fill, '#ffffff');
    assert.equal(cloud._stored_settings.stroke, '#252525');

    assert.equal(this.tooltip._text.css.callCount, 1, 'text styles');
    assert.deepEqual(this.tooltip._text.css.firstCall.args, [{ fill: 'rgba(147,147,147,0.7)' }]);

    assert.equal(this.tooltip._text.attr.callCount, 1, 'text attrs');
    assert.deepEqual(this.tooltip._text.attr.firstCall.args, [{ text: 'some-text', 'class': 'tooltip_class', 'pointer-events': 'none' }]);

    assert.equal(this.tooltip._textGroupHtml.css.callCount, 0, 'textGroupHtml styles');
    assert.equal(this.tooltip._textGroupHtml.width.callCount, 0, 'textGroupHtml width');

    assert.equal(this.tooltip._textHtml.empty.callCount, 1, 'textHtml empty');
});

QUnit.test('Show. W/o params. Html', function(assert) {
    const eventData = { tag: 'event-data' };
    this.tooltip._getCanvas = function() { return CANVAS; };
    this.options.customizeTooltip = function() { return { html: 'some-html' }; };
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._textGroupHtml.css = sinon.spy();
    this.tooltip._textGroupHtml.width = sinon.spy();
    this.tooltip._textGroupHtml.height = sinon.spy();
    this.tooltip._textHtml.html = sinon.spy();
    this.tooltip._textHtml.empty = sinon.spy();

    const textHtmlElement = this.tooltip._textHtml.get(0);
    if(!this.getComputedStyle) {
        textHtmlElement.getBoundingClientRect = sinon.spy(function() { return { right: 103.13, left: 20, bottom: 33.45, top: 10 }; });
    }

    const formatObject = { valueText: 'some-text' };
    // act
    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, eventData);

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', eventData], 'event is triggered');

    assert.deepEqual(this.tooltip._state, {
        color: '#ffffff',
        borderColor: '#252525',
        textColor: 'rgba(147,147,147,0.7)',
        eventData,
        html: 'some-html',
        formatObject,
        templateCallback: undefined
    }, 'state');

    const cloud = this.renderer.path.lastCall.returnValue;
    assert.equal(cloud._stored_settings.fill, '#ffffff');
    assert.equal(cloud._stored_settings.stroke, '#252525');

    assert.equal(this.tooltip._textGroupHtml.css.callCount, 3, 'textGroupHtml styles');
    assert.deepEqual(this.tooltip._textGroupHtml.css.firstCall.args, [{ color: 'rgba(147,147,147,0.7)', width: 3000, 'pointerEvents': 'none', }]);

    assert.ok(this.tooltip._textHtml.html.calledOnce, 'textHtml html');
    assert.deepEqual(this.tooltip._textHtml.html.firstCall.args, ['some-html'], 'textHtml html');

    assert.ok(this.tooltip._textHtml.empty.calledOnce, 'textHtml empty');

    assert.equal(this.tooltip._text.css.callCount, 0, 'text styles');
    assert.equal(this.tooltip._text.attr.callCount, 1, 'text attrs');
    assert.deepEqual(this.tooltip._text.attr.firstCall.args, [{ text: '' }]);

    if(this.getComputedStyle) {
        assert.ok(this.tooltip._wrapper.appendTo.lastCall.calledBefore(this.getComputedStyle.withArgs(textHtmlElement).lastCall));
    } else {
        assert.ok(this.tooltip._wrapper.appendTo.lastCall.calledBefore(textHtmlElement.getBoundingClientRect.firstCall));
    }
});

QUnit.test('Show. W/o params. Template', function(assert) {
    const eventData = { tag: 'event-data' };
    this.tooltip._getCanvas = function() { return CANVAS; };

    this.options.contentTemplate = sinon.spy(function(_, container, onRendered) {
        $(container).text('custom html');
        onRendered();
    });

    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._textGroupHtml.css = sinon.spy();
    sinon.spy(this.tooltip._textHtml, 'html');
    this.tooltip._textHtml.empty = sinon.spy();

    const textHtmlElement = this.tooltip._textHtml.get(0);
    if(!this.getComputedStyle) {
        textHtmlElement.getBoundingClientRect = sinon.spy(function() { return { right: 103.13, left: 20, bottom: 33.45, top: 10 }; });
    }

    const formatObject = { valueText: 'some-text' };
    const callback = sinon.stub();
    // act
    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, eventData, undefined, callback);

    assert.strictEqual(result, undefined);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', eventData], 'event is triggered');

    assert.deepEqual(this.tooltip._state, {
        color: '#ffffff',
        borderColor: '#252525',
        textColor: 'rgba(147,147,147,0.7)',
        eventData,
        html: 'custom html',
        text: 'some-text',
        formatObject,
        templateCallback: callback
    }, 'state');

    const cloud = this.renderer.path.lastCall.returnValue;
    assert.equal(cloud._stored_settings.fill, '#ffffff');
    assert.equal(cloud._stored_settings.stroke, '#252525');
    assert.equal(cloud._stored_settings['pointer-events'], 'none');

    assert.equal(this.tooltip._textGroupHtml.css.callCount, 3, 'textGroupHtml styles');
    assert.deepEqual(this.tooltip._textGroupHtml.css.firstCall.args, [{ color: 'rgba(147,147,147,0.7)', width: 3000, 'pointerEvents': 'none', }]);

    assert.ok(this.tooltip._textHtml.html.calledOnce, 'textHtml html');
    assert.deepEqual(this.tooltip._textHtml.html(), 'custom html', 'textHtml html');

    assert.ok(this.tooltip._textHtml.empty.calledOnce, 'textHtml empty');

    assert.equal(this.tooltip._text.css.callCount, 0, 'text styles');
    assert.equal(this.tooltip._text.stub('attr').callCount, 0, 'text attrs');

    if(this.getComputedStyle) {
        assert.ok(this.tooltip._wrapper.appendTo.lastCall.calledBefore(this.getComputedStyle.withArgs(textHtmlElement).lastCall));
    } else {
        assert.ok(this.tooltip._wrapper.appendTo.lastCall.calledBefore(textHtmlElement.getBoundingClientRect.firstCall));
    }

    assert.equal(this.options.contentTemplate.callCount, 1);
    assert.equal(this.options.contentTemplate.lastCall.args[0], formatObject);
    assert.equal(callback.callCount, 1);
    assert.equal(callback.getCall(0).args[0], true);
});

QUnit.test('Do not show tooltip if html is not set in contentTemplate', function(assert) {
    const eventData = { tag: 'event-data' };
    this.tooltip._getCanvas = function() { return CANVAS; };

    this.options.contentTemplate = (_, container, onRendered) => { onRendered(); };

    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._textGroupHtml.css = sinon.spy();
    this.tooltip._textGroupHtml.width = sinon.spy();
    this.tooltip._textGroupHtml.height = sinon.spy();
    sinon.spy(this.tooltip._textHtml, 'html');

    const textHtmlElement = this.tooltip._textHtml.get(0);
    if(this.getComputedStyle) {
        this.getComputedStyle.restore();
    }
    if(!this.getComputedStyle) {
        textHtmlElement.getBoundingClientRect = sinon.spy(function() { return { right: 103.13, left: 20, bottom: 33.45, top: 10 }; });
    }

    const formatObject = { valueText: 'some-text' };
    const callback = sinon.stub();
    // act
    this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, eventData, undefined, callback);

    assert.ok(this.renderer.g.getCall(0).returnValue.remove.called);
    assert.ok(!this.eventTrigger.called, 'event is not triggered');

    assert.equal(callback.callCount, 1);
    assert.equal(callback.getCall(0).args[0], false);
});

QUnit.test('Do not show tooltip if html is set in contentTemplate as empty div', function(assert) {
    const eventData = { tag: 'event-data' };
    this.tooltip._getCanvas = function() { return CANVAS; };

    this.options.contentTemplate = (_, container, onRendered) => {
        $(container).html('<div></div>');
        onRendered();
    };

    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._textGroupHtml.css = sinon.spy();
    this.tooltip._textGroupHtml.width = sinon.spy();
    this.tooltip._textGroupHtml.height = sinon.spy();
    sinon.spy(this.tooltip._textHtml, 'html');

    const textHtmlElement = this.tooltip._textHtml.get(0);
    if(this.getComputedStyle) {
        this.getComputedStyle.restore();
    }
    if(!this.getComputedStyle) {
        textHtmlElement.getBoundingClientRect = sinon.spy(function() { return { right: 103.13, left: 20, bottom: 33.45, top: 10 }; });
    }

    const formatObject = { valueText: 'some-text' };
    const callback = sinon.stub();
    // act
    this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, eventData, undefined, callback);

    assert.ok(this.renderer.g.getCall(0).returnValue.remove.called);
    assert.ok(!this.eventTrigger.called, 'event is not triggered');
    assert.equal(callback.callCount, 1);
    assert.equal(callback.getCall(0).args[0], false);
});

QUnit.test('Simple text, tooltip is interactive', function(assert) {
    this.options.interactive = true;
    this.tooltip.update(this.options);
    this.tooltip.show({ valueText: 'some-text' }, { x: 100, y: 200, offset: 300 });

    assert.equal(this.tooltip._text.attr.firstCall.args[0]['pointer-events'], 'auto', 'text is clickable');

    const cloudSettings = this.renderer.path.lastCall.returnValue._stored_settings;
    assert.equal(cloudSettings['pointer-events'], 'auto', 'cloud is clickable');

    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        '-moz-user-select': 'auto',
        '-ms-user-select': 'auto',
        '-webkit-user-select': 'auto'
    }, 'text can be selected');
});

QUnit.test('Html text, tooltip is interactive', function(assert) {
    this.options.interactive = true;
    this.options.customizeTooltip = function() { return { html: 'some-html' }; };
    this.tooltip.update(this.options);
    this.tooltip._textGroupHtml.css = sinon.spy();
    this.tooltip.show({ valueText: 'some-text' }, { x: 100, y: 200, offset: 300 });

    assert.equal(this.tooltip._textGroupHtml.css.callCount, 3, 'textGroupHtml styles');
    assert.deepEqual(this.tooltip._textGroupHtml.css.firstCall.args, [{
        color: 'rgba(147,147,147,0.7)',
        width: 3000,
        'pointerEvents': 'auto'
    }], 'text is clickable');

    const cloudSettings = this.renderer.path.lastCall.returnValue._stored_settings;
    assert.equal(cloudSettings['pointer-events'], 'auto', 'cloud is clickable');

    assert.deepEqual(this.renderer.root.css.lastCall.args[0], {
        '-moz-user-select': 'auto',
        '-ms-user-select': 'auto',
        '-webkit-user-select': 'auto'
    }, 'text can be selected');
});

QUnit.test('check cursor on tooltip, interactive', function(assert) {
    this.options.interactive = true;
    const tooltip = this.tooltip;
    tooltip.update(this.options);
    tooltip.plaque.getBBox = sinon.stub().returns({ x: 4, y: 5, width: 20, height: 10 });

    assert.ok(tooltip.isCursorOnTooltip(10, 7));
    assert.ok(!tooltip.isCursorOnTooltip(10, 20));
    assert.ok(!tooltip.isCursorOnTooltip(30, 7));
});

QUnit.test('check cursor on tooltip, is not interactive', function(assert) {
    this.options.interactive = false;
    const tooltip = this.tooltip;
    tooltip.update(this.options);
    tooltip.plaque.getBBox = sinon.stub().returns({ x: 4, y: 5, width: 20, height: 10 });

    assert.ok(!tooltip.isCursorOnTooltip(10, 7));
    assert.ok(!tooltip.isCursorOnTooltip(10, 20));
    assert.ok(!tooltip.isCursorOnTooltip(30, 7));
});

QUnit.test('Call template if empty text', function(assert) {
    const eventData = { tag: 'event-data' };
    this.tooltip._getCanvas = function() { return CANVAS; };

    this.options.contentTemplate = sinon.spy(function(_, container, onRendered) {
        $(container).text('custom html');
        onRendered();
    });

    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._textGroupHtml.css = sinon.spy();
    this.tooltip._textGroupHtml.width = sinon.spy();
    this.tooltip._textGroupHtml.height = sinon.spy();
    sinon.spy(this.tooltip._textHtml, 'html');

    const textHtmlElement = this.tooltip._textHtml.get(0);
    if(!this.getComputedStyle) {
        textHtmlElement.getBoundingClientRect = sinon.spy(function() { return { right: 103.13, left: 20, bottom: 33.45, top: 10 }; });
    }

    const formatObject = { valueText: '' };
    const callback = sinon.stub();
    // act
    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, eventData, undefined, callback);

    assert.strictEqual(result, undefined);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', eventData], 'event is triggered');

    assert.equal(this.options.contentTemplate.callCount, 1);
    assert.equal(this.options.contentTemplate.lastCall.args[0], formatObject);
    assert.equal(callback.callCount, 1);
    assert.equal(callback.getCall(0).args[0], true);
});

QUnit.test('Show. W/o params. Do not call template if skipTemplate in formatObject', function(assert) {
    this.options.customizeTooltip = null;
    this.options.cssClass = 'tooltip_class';
    this.options.contentTemplate = sinon.spy();
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._textGroupHtml.css = sinon.spy();
    this.tooltip._textGroupHtml.width = sinon.spy(function() { return 85; });
    this.tooltip._textGroupHtml.height = sinon.spy(function() { return 43; });
    this.tooltip._textHtml.empty = sinon.spy();
    const eventData = { tag: 'event-data' };

    const formatObject = { valueText: 'some-text', skipTemplate: true };
    // act
    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, eventData);

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', eventData], 'event is triggered');

    assert.deepEqual(this.tooltip._state, {
        color: '#ffffff',
        borderColor: '#252525',
        textColor: 'rgba(147,147,147,0.7)',
        eventData,
        text: 'some-text',
        formatObject,
        templateCallback: undefined
    }, 'state');

    const cloud = this.renderer.path.lastCall.returnValue;
    assert.equal(cloud._stored_settings.fill, '#ffffff');
    assert.equal(cloud._stored_settings.stroke, '#252525');

    assert.equal(this.tooltip._text.css.callCount, 1, 'text styles');
    assert.deepEqual(this.tooltip._text.css.firstCall.args, [{ fill: 'rgba(147,147,147,0.7)' }]);

    assert.equal(this.tooltip._text.attr.callCount, 1, 'text attrs');
    assert.deepEqual(this.tooltip._text.attr.firstCall.args, [{ text: 'some-text', 'class': 'tooltip_class', 'pointer-events': 'none' }]);

    assert.equal(this.tooltip._textGroupHtml.css.callCount, 0, 'textGroupHtml styles');
    assert.equal(this.tooltip._textGroupHtml.width.callCount, 0, 'textGroupHtml width');

    assert.equal(this.tooltip._textHtml.empty.callCount, 1, 'textHtml empty');

    assert.equal(this.options.contentTemplate.callCount, 0);
});

QUnit.test('Show. W/o params. Html. T298249', function(assert) {
    const eventData = { tag: 'event-data' };
    this.tooltip._getCanvas = function() { return CANVAS; };
    this.options.customizeTooltip = function() { return { html: 'some-html' }; };
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._textGroupHtml.css = sinon.spy();
    this.tooltip._textGroupHtml.width = sinon.spy();
    this.tooltip._textGroupHtml.height = sinon.spy();
    this.tooltip._textHtml.html = sinon.spy();

    const textHtmlElement = this.tooltip._textHtml.get(0);
    if(!this.getComputedStyle) {
        textHtmlElement.getBoundingClientRect = sinon.spy(function() { return { right: 123.13, left: 20, bottom: 33.45, top: 20, width: 83.13, height: 23.45 }; });
    }

    const formatObject = { valueText: 'some-text' };
    // act
    this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, eventData);

    if(this.getComputedStyle) {
        assert.ok(this.tooltip._wrapper.appendTo.lastCall.calledBefore(this.getComputedStyle.withArgs(textHtmlElement).lastCall));
    } else {
        assert.ok(this.tooltip._wrapper.appendTo.lastCall.calledBefore(textHtmlElement.getBoundingClientRect.firstCall));
    }
});

QUnit.test('Show preparations. Use external customizeText', function(assert) {
    this.options.customizeTooltip = sinon.spy(function() {
        return {
            text: 'some-customized-text'
        };
    });
    this.tooltip.update(this.options);
    this.tooltip.move = sinon.spy(function() { return this; });
    this.tooltip._state = { a: 'b' };

    const formatObject = { valueText: '' };
    const result = this.tooltip.show(formatObject, { x: 100, y: 200, offset: 300 }, null, function() {
        return {
            text: 'custom text from external customizeText'
        };
    });

    assert.strictEqual(result, true);
    assert.equal(this.options.customizeTooltip.callCount, 0);
    assert.deepEqual(this.tooltip._state.text, 'custom text from external customizeText');
});

QUnit.test('Show. W/ params', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip.move = sinon.spy(function() { return this; });

    const formatObject = { valueText: 'some-text' };
    // act
    const result = this.tooltip.show(formatObject, { x: 10, y: 20, offset: 30 }, 'eventData');

    assert.strictEqual(result, true);
    assert.deepEqual(this.tooltip._state, {
        color: '#ffffff',
        borderColor: '#252525',
        textColor: 'rgba(147,147,147,0.7)',
        eventData: 'eventData',
        text: 'some-text',
        formatObject,
        templateCallback: undefined
    }, 'state');
});

QUnit.test('\'tooltipHidden\' is triggered on show if tooltip is already shown', function(assert) {
    const eventData1 = { tag: 'data-1' };
    const eventData2 = { tag: 'data-2' };
    this.tooltip.update(this.options);
    this.tooltip.show({ valueText: 'text-1' }, { x: 10, y: 20 }, eventData1);

    this.tooltip.show({ valueText: 'text-2' }, { x: 10, y: 20 }, eventData2);

    assert.strictEqual(this.eventTrigger.callCount, 3, 'event count');
    assert.deepEqual(this.eventTrigger.getCall(0).args, ['tooltipShown', eventData1], 'call 1');
    assert.deepEqual(this.eventTrigger.getCall(1).args, ['tooltipHidden', eventData1], 'call 2');
    assert.deepEqual(this.eventTrigger.getCall(2).args, ['tooltipShown', eventData2], 'call 3');
});

QUnit.test('\'tooltipHidden\' is not triggered on hide if tooltip has not been shown', function(assert) {
    this.tooltip.update(this.options);

    this.tooltip.hide();

    assert.strictEqual(this.eventTrigger.lastCall, null);
});

QUnit.test('\'tooltipHidden\' is not triggered on hide if tooltip is already hidden', function(assert) {
    this.tooltip.update(this.options);
    this.tooltip.show({ valueText: 'text' }, {}, {});
    this.tooltip.hide();
    this.eventTrigger.reset();

    this.tooltip.hide();

    assert.strictEqual(this.eventTrigger.lastCall, null);
});

QUnit.test('Hide.', function(assert) {
    const eventObject = { 'some-event-object': 'some-event-value' };
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options).show({ valueText: 'some-text' }, { x: 10, y: 20 }, eventObject);
    this.tooltip.move(100, 200, 30);
    this.eventTrigger.reset();

    this.resetTooltipMocks();
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._wrapper.detach = sinon.spy();
    this.tooltip._textHtml.empty = sinon.spy();

    // act
    this.tooltip.hide();

    // assert
    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, 'wrapper is not added to dom');
    assert.equal(this.tooltip._wrapper.get(0).style.left, '-9999px', 'wrapper is moved to invisible area');
    assert.equal(this.tooltip._wrapper.detach.callCount, 1, 'wrapper detached');
    assert.equal(this.eventTrigger.callCount, 1);
    assert.deepEqual(this.eventTrigger.firstCall.args, ['tooltipHidden', eventObject]);
    assert.ok(this.tooltip._textHtml.empty.calledOnce, 'textHtml empty');
});

// T244003
QUnit.test('Show then show on invisible target then move', function(assert) {
    this.tooltip.update(this.options).show({ valueText: 'text' }, {}, {});

    this.tooltip.show({}, {});
    this.tooltip.move(100, 200, 10);

    assert.ok(true, 'no errors');
});

// Funcionality for blazor charts
QUnit.test('forceEvents. rise tooltipShown event, but tooltip not shown', function(assert) {
    this.options.forceEvents = true;
    this.options.enabled = false;
    this.tooltip.update(this.options);
    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._state = { a: 'b' };

    const result = this.tooltip.show({ valueText: 'some-text' }, { x: 100, y: 200, offset: 50 }, {});

    assert.strictEqual(result, true);
    assert.deepEqual(this.eventTrigger.lastCall.args, ['tooltipShown', { x: 100, y: 150 }], 'event is triggered');

    assert.deepEqual(this.tooltip._state, {
        a: 'b'
    }, 'state');

    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, 'wrapper is not added to dom');
});

// Funcionality for blazor charts
QUnit.test('forceEvents. rise tooltipHidden event', function(assert) {
    const eventObject = { 'some-event-object': 'some-event-value' };
    this.options.forceEvents = true;
    this.tooltip.update(this.options).show({ valueText: 'some-text' }, {}, eventObject);
    this.eventTrigger.reset();

    this.tooltip._wrapper.appendTo = sinon.spy();
    this.tooltip._wrapper.detach = sinon.spy();
    // act
    this.tooltip.hide();

    // assert
    assert.equal(this.tooltip._wrapper.appendTo.callCount, 0, 'wrapper is not added to dom');
    assert.equal(this.tooltip._wrapper.get(0).style.left, '-9999px', 'wrapper is moved to invisible area');
    assert.equal(this.tooltip._wrapper.detach.callCount, 1, 'wrapper detached');
    assert.equal(this.eventTrigger.callCount, 1);
    assert.deepEqual(this.eventTrigger.firstCall.args, ['tooltipHidden', eventObject]);
});

function getCloudPoints() {
    const cloud = this.renderer.path.lastCall.returnValue;
    const path = cloud._stored_settings.d.replace(/a 0 0 0 0 1 0 0/g, '');

    const regExp = /(?:(-?\d+),(-?\d+))/g;
    let m;
    const coords = [];

    do {
        m = regExp.exec(path);
        if(m) {
            coords.push(Number(m[1]), Number(m[2]));
        }
    } while(m);
    return coords;
}

QUnit.module('Movements', {
    beforeEach: function() {
        const that = this;
        let tooltip;
        const getComputedStyle = window.getComputedStyle;

        that._initialBodyMargin = $(document.body).css('margin');
        $(document.body).css({ margin: 0 });

        that.options = getInitialOptions();
        that.eventTrigger = sinon.spy();
        that.tooltip = tooltip = new Tooltip({ eventTrigger: that.eventTrigger, cssClass: 'test-title-class' });
        tooltip.update(that.options);

        that.resetTooltipMocks = function() {
            tooltip._text.stub('css').reset();
            tooltip._renderer.stub('resize').reset();
        };

        this.renderer.bBoxTemplate = { x: -12, y: -5, width: 24, height: 10 };

        that.canvas = CANVAS;
        tooltip._getCanvas = function() { return that.canvas; };
        if(getComputedStyle) {
            this.getComputedStyle = sinon.stub(window, 'getComputedStyle', function(elem) {
                if(elem === tooltip._textHtml.get(0)) {
                    return { width: '60px', height: '40px' };
                }
                return getComputedStyle.apply(window, arguments);
            });
        }
    },
    afterEach: function() {
        this.getComputedStyle && this.getComputedStyle.restore();
        $('body').css({
            margin: this._initialBodyMargin
        });
        $('body').get(0).scrollTop = 0;
        this.tooltip.dispose();
    },

    getContentGroup() {
        return this.renderer.g.getCall(2).returnValue;
    },

    getCloudPoints: getCloudPoints
});

QUnit.test('Left-top corner of page', function(assert) {
    this.options.customizeTooltip = null;
    this.options.textAlignment = 'center';
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 30, y: 80, offset: 30 });

    // assert
    const wrapper = $('.test-title-class');

    const contentGroup = this.getContentGroup();
    assert.equal(contentGroup.move.callCount, 1, 'textGroup move call count');
    assert.deepEqual(contentGroup.move.firstCall.args, [40, 140], 'move args');

    assert.deepEqual(this.getCloudPoints(), [20, 110, 60, 110, 60, 120, 70, 130, 60, 140, 60, 170, 20, 170]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);
    assert.equal(this.tooltip._text.append.lastCall.args[0], contentGroup);
    assert.deepEqual(contentGroup.attr.lastCall.args[0], { 'align': 'center' });

    assert.equal(wrapper.css('left'), '0px');
    assert.equal(wrapper.css('top'), '101px');

    assert.deepEqual(this.renderer.g.getCall(0).returnValue.move.lastCall.args, [0, -101]);
    assert.ok(!this.renderer.g.getCall(0).returnValue._stored_settings.class);
});

QUnit.test('Center-top side of page', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 80, offset: 30 });

    // assert
    const wrapper = $('.test-title-class');
    assert.deepEqual(this.getContentGroup().move.firstCall.args, [400, 140], 'move args');
    assert.deepEqual(this.getCloudPoints(), [380, 110, 420, 110, 420, 130, 430, 140, 420, 150, 420, 170, 380, 170]);

    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css('left'), '360px'); // x - bBox.width / 2 - lm
    assert.equal(wrapper.css('top'), '101px'); // y + offset - tm

    assert.deepEqual(this.renderer.g.getCall(0).returnValue.move.lastCall.args, [-360, -101]);
});

QUnit.test('Center-top side of page, Html', function(assert) {
    this.options.customizeTooltip = function() { return { html: 'some-html' }; };
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip._textGroupHtml.css = sinon.spy();
    if(!this.getComputedStyle) {
        this.tooltip._textHtml.get(0).getBoundingClientRect = sinon.spy(function() { return { right: 60, left: 0, bottom: 40, top: 0 }; });
    }

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 80, offset: 30 });

    // assert
    assert.equal(this.tooltip._textGroupHtml.css.callCount, 3, 'textGroup move');
    assert.deepEqual(this.tooltip._textGroupHtml.css.getCall(1).args, [{ left: 370, top: 135 }]);
    assert.deepEqual(this.tooltip._textGroupHtml.css.getCall(2).args, [{ width: 126 }]);

    assert.equal(this.getContentGroup().stub('move').callCount, 0);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 2 * 18 + 10 + 20, 40 + 2 * 15 + 9 + 21 + this.options.arrowLength]);
});

QUnit.test('Right-top corner of page', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 770, y: 80, offset: 30 });

    // assert
    const wrapper = $('.test-title-class');
    assert.deepEqual(this.getContentGroup().move.firstCall.args, [750, 140], 'move args');
    assert.deepEqual(this.getCloudPoints(), [730, 110, 770, 110, 770, 150, 780, 160, 770, 170, 770, 170, 730, 170]);

    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css('left'), '710px');
    assert.equal(wrapper.css('top'), '101px');
});

QUnit.test('Left-center side of page', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 30, y: 300, offset: 30 });

    // assert
    const wrapper = $('.test-title-class');
    assert.deepEqual(this.getContentGroup().move.firstCall.args, [40, 240], 'move args');
    assert.deepEqual(this.getCloudPoints(), [20, 210, 60, 210, 60, 240, 70, 250, 60, 260, 60, 270, 20, 270]);

    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css('left'), '0px');
    assert.equal(wrapper.css('top'), '211px');
});

QUnit.test('Center of page', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 300, offset: 30 });

    // assert
    const wrapper = $('.test-title-class');
    assert.deepEqual(this.getContentGroup().move.firstCall.args, [400, 240], 'move args');
    assert.deepEqual(this.getCloudPoints(), [380, 210, 420, 210, 420, 230, 430, 240, 420, 250, 420, 270, 380, 270]);
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css('left'), '360px'); // x - bBox.width / 2 - lm
    assert.equal(wrapper.css('top'), '211px'); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test('Center-center side of page, Html', function(assert) {
    this.options.customizeTooltip = function() { return { html: 'some-html' }; };
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.tooltip._textGroupHtml.css = sinon.spy();
    sinon.spy(this.tooltip._textHtml, 'css');
    if(!this.getComputedStyle) {
        this.tooltip._textHtml.get(0).getBoundingClientRect = sinon.spy(function() { return { right: 60, left: 0, bottom: 40, top: 0 }; });
    }

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 300, offset: 30 });

    // assert
    assert.equal(this.tooltip._textGroupHtml.css.callCount, 3, 'textGroup move');
    assert.deepEqual(this.tooltip._textGroupHtml.css.getCall(1).args, [{ left: 370, top: 205 }]);
    assert.deepEqual(this.tooltip._textGroupHtml.css.getCall(2).args, [{ width: 126 }]);

    assert.equal(this.getContentGroup().stub('move').callCount, 0);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 2 * 18 + 10 + 20, 40 + 2 * 15 + 9 + 21 + this.options.arrowLength]);
    assert.deepEqual(this.tooltip._textHtml.css.lastCall.args[0], {
        left: -342,
        top: -181
    });
});

QUnit.test('Right-center side of page', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 770, y: 300, offset: 30 });

    // assert
    const wrapper = $('.test-title-class');
    assert.deepEqual(this.getContentGroup().move.firstCall.args, [750, 240], 'move args');
    assert.deepEqual(this.getCloudPoints(), [730, 210, 770, 210, 770, 210, 780, 220, 770, 230, 770, 270, 730, 270]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css('left'), '710px'); // x - bBox.width - lm
    assert.equal(wrapper.css('top'), '211px'); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test('Left-bottom corner of page', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 30, y: 600, offset: 30 });

    // assert
    const wrapper = $('.test-title-class');
    assert.deepEqual(this.getContentGroup().move.firstCall.args, [40, 540], 'move args');
    assert.deepEqual(this.getCloudPoints(), [20, 510, 60, 510, 60, 540, 70, 550, 60, 560, 60, 570, 20, 570]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css('left'), '0px');
    assert.equal(wrapper.css('top'), '511px');
});

QUnit.test('Center-bootom side of page', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 600, offset: 30 });

    // assert
    const wrapper = $('.test-title-class');
    assert.deepEqual(this.getContentGroup().move.firstCall.args, [400, 540], 'move args');
    assert.deepEqual(this.getCloudPoints(), [380, 510, 420, 510, 420, 530, 430, 540, 420, 550, 420, 570, 380, 570]);

    assert.equal(wrapper.css('left'), '360px'); // x - bBox.width / 2 - lm
    assert.equal(wrapper.css('top'), '511px'); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test('RB corner of page', function(assert) {

    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 770, y: 600, offset: 30 });

    // assert
    const wrapper = $('.test-title-class');
    assert.deepEqual(this.getContentGroup().move.firstCall.args, [750, 540], 'move args');
    assert.deepEqual(this.getCloudPoints(), [730, 510, 770, 510, 770, 510, 780, 520, 770, 530, 770, 570, 730, 570]);
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css('left'), '710px'); // x - bBox.width - lm
    assert.equal(wrapper.css('top'), '511px'); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test('Orientation is not changed', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 300, offset: 30 });
    this.resetTooltipMocks();
    this.tooltip._textGroupHtml.css = sinon.spy();

    // act
    this.tooltip.move(500, 400, 10);

    // assert
    const wrapper = $('.test-title-class');
    assert.equal(this.tooltip._textGroupHtml.css.callCount, 0, 'textGroupHtml move');
    assert.equal(this.renderer.path.callCount, 1);
    assert.deepEqual(this.getCloudPoints(), [480, 330, 520, 330, 520, 350, 530, 360, 520, 370, 520, 390, 480, 390]);
    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');

    assert.equal(wrapper.css('left'), '460px'); // x - bBox.width / 2 - lm
    assert.equal(wrapper.css('top'), '331px'); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test('Orientation is changed', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 300 });
    this.resetTooltipMocks();
    this.tooltip._textGroupHtml.css = sinon.spy();

    // act
    this.tooltip.move(800, 300, 30);

    // assert
    const wrapper = $('.test-title-class');
    assert.deepEqual(this.getContentGroup().move.lastCall.args, [750, 240], 'move args');
    assert.deepEqual(this.getCloudPoints(), [730, 210, 760, 210, 780, 190, 770, 220, 770, 270, 730, 270]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(wrapper.css('left'), '710px'); // x - bBox.width - lm
    assert.equal(wrapper.css('top'), '211px'); // y - (bBox.height + arrowLength) - offset - tm
});

QUnit.test('Orientation is changed. Html', function(assert) {
    this.options.customizeTooltip = function() { return { html: 'some-html' }; };
    this.tooltip.update(this.options);

    if(!this.getComputedStyle) {
        this.tooltip._textHtml.get(0).getBoundingClientRect = sinon.spy(function() { return { right: 60, left: 0, bottom: 40, top: 0 }; });
    }

    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 300 });
    this.resetTooltipMocks();
    this.tooltip._textGroupHtml.css = sinon.spy();

    // act
    this.tooltip.move(800, 300, 30);

    // assert
    assert.deepEqual(this.tooltip._textGroupHtml.css.getCall(0).args, [{ left: 702, top: 205 }]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 2 * 18 + 10 + 20, 40 + 2 * 15 + 9 + 21 + this.options.arrowLength]);
});

QUnit.test('Do not re-render html markup on tooltip move', function(assert) {
    this.options.customizeTooltip = function() { return { html: '<div id=\'my-div\'></div>' }; };
    this.tooltip.update(this.options);

    if(!this.getComputedStyle) {
        this.tooltip._textHtml.get(0).getBoundingClientRect = sinon.spy(function() { return { right: 60, left: 0, bottom: 40, top: 0 }; });
    }

    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 300 });
    this.resetTooltipMocks();
    this.tooltip._textGroupHtml.css = sinon.spy();

    $('#my-div').html('markup');

    // act
    this.tooltip.move(800, 300, 30);

    // assert
    assert.equal($('#my-div').html(), 'markup');
});

QUnit.test('Show after move w/o orientation changing', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 300 });
    this.bBoxTemplate = { x: -22, y: -15, width: 44, height: 20 };
    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: 'some-long-text' }, { x: 500, y: 400, offset: 30 });

    // assert
    const wrapper = $('.test-title-class');
    assert.deepEqual(this.getContentGroup().move.lastCall.args, [400, 270], 'move args');
    assert.deepEqual(this.getCloudPoints(), [480, 310, 520, 310, 520, 330, 530, 340, 520, 350, 520, 370, 480, 370]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.lastCall.args, [90, 80]);

    assert.equal(wrapper.css('left'), '460px'); // x - bBox.width / 2 - lm
    assert.equal(wrapper.css('top'), '311px'); // y - (bBox.height + arrowLength) - offset - tm
});

// T277991, T447623
QUnit.test('Position when page\'s body has relative position and margins and page is scrolled. T277991, T447623', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.tooltip.show({ valueText: 'some-text' }, { x: 500, y: 400, offset: 30 });
    this.renderer.bBoxTemplate = { x: -22, y: -15, width: 44, height: 20 };
    this.resetTooltipMocks();

    $('body').css({
        position: 'relative',
        marginLeft: 110,
        marginTop: 120,
        marginRight: 130,
        marginBottom: 140
    });
    $('body').height(4000).get(0).scrollTop = 200;

    // act
    this.tooltip.move(500, 400, 30);

    // assert
    const wrapper = $('.test-title-class');
    assert.strictEqual(wrapper.css('left'), '340px');
    assert.strictEqual(wrapper.css('top'), '181px');
});

QUnit.test('Floor plaque coordinates', function(assert) {
    this.options.customizeTooltip = null;
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 5, height: 7 };
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 100, y: 300, offset: 30 });

    // assert
    assert.deepEqual(this.renderer.g.getCall(0).returnValue.move.lastCall.args, [-69, -214]);
});

QUnit.test('Remove old plaque on update options', function(assert) {
    this.tooltip.update(this.options);
    this.tooltip.show({ valueText: 'some-text' }, { x: 30, y: 80, offset: 30 });
    // act
    this.tooltip.setOptions(this.options);

    // assert
    assert.ok(this.renderer.g.getCall(0).returnValue.remove.called);
    assert.ok(this.renderer.shadowFilter.lastCall.returnValue.remove.called);
});

QUnit.module('Movements. Out of visible borders', {
    beforeEach: function() {
        const that = this;
        let tooltip;

        that._initialBodyMargin = $(document.body).css('margin');
        $(document.body).css({ margin: 0 });

        that.options = getInitialOptions();
        that.eventTrigger = sinon.spy();
        that.tooltip = tooltip = new Tooltip({ eventTrigger: that.eventTrigger });
        tooltip.update(that.options);

        that.resetTooltipMocks = function() {
            tooltip._text.stub('css').reset();
            tooltip._renderer.stub('resize').reset();
        };

        that.canvas = { left: 10, top: 20, width: 800, height: 600, right: 0, bottom: 0 };
        tooltip._getCanvas = function() { return that.canvas; };
    },
    afterEach: function() {
        $(document.body).css({ margin: this._initialBodyMargin });
        this.tooltip.dispose();
    },

    getCloudPoints: getCloudPoints
});

QUnit.test('Out of bounds vertically. Left side of page', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.renderer.bBoxTemplate = { x: -12, y: -485, width: 24, height: 970 };

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 40, y: 300, offset: 30 });

    // assert
    assert.deepEqual(this.getCloudPoints(), [20, 20, 80, 20, 80, 1020, 20, 1020]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 1030]);

    assert.equal(this.tooltip._wrapper.css('left'), '10px'); // x - lm
    assert.equal(this.tooltip._wrapper.css('top'), '11px'); // canvas.top - tm
});

QUnit.test('Out of bounds vertically. Center of page', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.renderer.bBoxTemplate = { x: -12, y: -485, width: 24, height: 970 };

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 300, offset: 30 });

    // assert
    assert.deepEqual(this.getCloudPoints(), [370, 20, 430, 20, 430, 1020, 370, 1020]);


    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 1030]);

    assert.equal(this.tooltip._wrapper.css('left'), '360px'); // x - bBox.width / 2 - lm
    assert.equal(this.tooltip._wrapper.css('top'), '11px'); // canvas.top - tm
});

QUnit.test('Out of bounds vertically. Right side of page', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.renderer.bBoxTemplate = { x: -12, y: -485, width: 24, height: 970 };
    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 770, y: 300, offset: 30 });

    // assert
    assert.deepEqual(this.getCloudPoints(), [720, 20, 780, 20, 780, 1020, 720, 1020]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [60 + 10 + 20, 1030]);

    assert.equal(this.tooltip._wrapper.css('left'), '710px'); // x - bBox.width - lm
    assert.equal(this.tooltip._wrapper.css('top'), '11px'); // canvas.top - tm
});

QUnit.test('Out of bounds horizontally. Top side of page', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.renderer.bBoxTemplate = { x: -482, y: -5, width: 964, height: 10 };

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 80, offset: 30 });

    // assert
    assert.deepEqual(this.getCloudPoints(), [385, -360, 425, -360, 425, 125, 435, 135, 425, 145, 425, 640, 385, 640]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [1030, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(this.tooltip._wrapper.css('left'), '-105px'); // canvas.left - lm
    assert.equal(this.tooltip._wrapper.css('top'), '101px'); // y + offset - tm
});

QUnit.test('Out of bounds horizontally. Center of page', function(assert) {
    this.options.customizeTooltip = null;
    this.tooltip.update(this.options);

    this.resetTooltipMocks();

    this.renderer.bBoxTemplate = { x: -482, y: -5, width: 964, height: 10 };

    // act
    this.tooltip.show({ valueText: 'some-text' }, { x: 400, y: 300, offset: 30 });

    // assert
    assert.deepEqual(this.getCloudPoints(), [385, -260, 425, -260, 425, 235, 435, 245, 425, 255, 425, 740, 385, 740]);

    assert.equal(this.tooltip._renderer.resize.callCount, 1, 'renderer resize');
    assert.deepEqual(this.tooltip._renderer.resize.firstCall.args, [1030, 40 + 9 + 21 + this.options.arrowLength]);

    assert.equal(this.tooltip._wrapper.css('left'), '-105px'); // canvas.left - lm
    assert.equal(this.tooltip._wrapper.css('top'), '211px'); // y - (bBox.height + arrowLength) - offset - tm
});
