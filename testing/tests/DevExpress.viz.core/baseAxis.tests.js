import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import { noop } from 'core/utils/common';
import tickGeneratorModule from 'viz/axes/tick_generator';
import { Axis as originalAxis } from 'viz/axes/base_axis';
import translator2DModule from 'viz/translators/translator2d';
import { Range } from 'viz/translators/range';
import xyMethods from 'viz/axes/xy_axes';
import { isFunction, isDeferred } from 'core/utils/type';

const StubTranslator = vizMocks.stubClass(translator2DModule.Translator2D, {
    updateBusinessRange: function(range) {
        this.getBusinessRange.returns(range);
    }
});

const environment = {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();

        const that = this;
        this.tickGeneratorSpy = sinon.spy(function() {
            return {
                ticks: that.generatedTicks || [],
                minorTicks: that.generatedMinorTicks || [],
                tickInterval: that.generatedTickInterval
            };
        });
        this.tickGenerator = sinon.stub(tickGeneratorModule, 'tickGenerator', function() {
            return that.tickGeneratorSpy;
        });

        this.translator = new StubTranslator();
        this.translator.stub('getBusinessRange').returns(new Range());

        this.canvas = {
            top: 200,
            bottom: 200,
            left: 200,
            right: 200,
            width: 400,
            height: 400
        };
    },
    afterEach: function() {
        this.tickGenerator.restore();
    },
    updateOptions: function(options) {
        const defaultOptions = {
            isHorizontal: true,
            label: {
                visible: true,
            }
        };
        this.axis.updateOptions($.extend(true, defaultOptions, options));
        this.axis._options._customVisualRange = options ? options.visualRange : undefined;
        this.axis.setBusinessRange({});
    }
};

function Axis(settings) {
    originalAxis.call(this, settings);
}
Axis.prototype = $.extend({}, originalAxis.prototype, {
    _setType: noop,

    _setVisualRange: xyMethods.linear._setVisualRange,
    _getStick: sinon.stub().returns(true),
    _getSpiderCategoryOption: sinon.stub().returns(false),

    _getTranslatedValue: sinon.stub().returns({ x: 'x', y: 'y' }),

    _boundaryTicksVisibility: { min: true, max: true },

    _updateAxisElementPosition: function() {}
});

QUnit.module('Creation', environment);

QUnit.test('Create axis', function(assert) {
    const renderer = this.renderer;
    const stripsGroup = renderer.g();
    const labelAxesGroup = renderer.g();
    const constantLinesGroup = { above: this.renderer.g(), under: this.renderer.g() };
    const axesContainerGroup = renderer.g();
    const gridGroup = renderer.g();

    renderer.g.reset();

    const axis = new Axis({
        renderer: renderer,
        stripsGroup: stripsGroup,
        labelAxesGroup: labelAxesGroup,
        constantLinesGroup: constantLinesGroup,
        axesContainerGroup: axesContainerGroup,
        gridGroup: gridGroup,
        axisType: 'xyAxes',
        drawingType: 'linear',
        axisClass: 'testType',
        widgetClass: 'testWidget',
        getTemplate() {}
    });

    assert.ok(axis, 'Axis was created');
    assert.equal(renderer.g.callCount, 13, 'groups were created');

    assert.equal(renderer.g.getCall(0).returnValue._stored_settings['class'], 'testWidget-testType-axis', 'Group for axis was created');
    assert.equal(renderer.g.getCall(1).returnValue._stored_settings['class'], 'testWidget-testType-strips', 'Group for axis strips was created');
    assert.equal(renderer.g.getCall(2).returnValue._stored_settings['class'], 'testWidget-testType-grid', 'Group for axis grid was created');
    assert.equal(renderer.g.getCall(3).returnValue._stored_settings['class'], 'testWidget-testType-elements', 'Group for axis elements was created');
    assert.equal(renderer.g.getCall(4).returnValue._stored_settings['class'], 'testWidget-testType-line', 'Group for axis line was created');
    assert.equal(renderer.g.getCall(5).returnValue._stored_settings['class'], 'testWidget-testType-title', 'Group for axis title was created');
    assert.equal(renderer.g.getCall(6).returnValue._stored_settings['class'], 'testWidget-testType-constant-lines', 'Group for axis constant lines was created');
    assert.equal(renderer.g.getCall(7).returnValue._stored_settings['class'], 'testWidget-testType-constant-lines', 'Group for axis constant lines was created');
    assert.equal(renderer.g.getCall(8).returnValue._stored_settings['class'], 'testWidget-testType-constant-lines', 'Group for axis constant lines was created');
    assert.equal(renderer.g.getCall(9).returnValue._stored_settings['class'], 'testWidget-testType-constant-lines', 'Group for axis constant lines was created');
    assert.equal(renderer.g.getCall(10).returnValue._stored_settings['class'], 'testWidget-testType-constant-lines', 'Group for axis constant lines was created');
    assert.equal(renderer.g.getCall(11).returnValue._stored_settings['class'], 'testWidget-testType-constant-lines', 'Group for axis constant lines was created');
    assert.equal(renderer.g.getCall(12).returnValue._stored_settings['class'], 'testWidget-testType-axis-labels', 'Group for axis labels was created');
});

QUnit.test('Create axis when axis class is undefined', function(assert) {
    const renderer = this.renderer;
    const stripsGroup = renderer.g();
    const labelAxesGroup = renderer.g();
    const constantLinesGroup = { above: this.renderer.g(), under: this.renderer.g() };
    const axesContainerGroup = renderer.g();
    const gridGroup = renderer.g();

    renderer.g.reset();

    new Axis({
        renderer: renderer,
        stripsGroup: stripsGroup,
        labelAxesGroup: labelAxesGroup,
        constantLinesGroup: constantLinesGroup,
        axesContainerGroup: axesContainerGroup,
        gridGroup: gridGroup,
        axisType: 'xyAxes',
        drawingType: 'linear',
        widgetClass: 'testWidget',
        getTemplate() {}
    });

    assert.equal(renderer.g.getCall(4).returnValue._stored_settings['class'], 'testWidget-line', 'Group for axis was created');
});

QUnit.test('Update options', function(assert) {
    const axis = new Axis({
        renderer: this.renderer,
        getTemplate() {}
    });

    axis.updateOptions({
        name: 'testAxis',
        pane: 'testPane',
        label: {}
    });

    assert.equal(axis.name, 'testAxis', 'Axis has correct name');
    assert.equal(axis.pane, 'testPane', 'Axis has correct pane');
});

QUnit.module('API', {
    beforeEach: function() {
        const that = this;

        sinon.stub(translator2DModule, 'Translator2D', function() {
            return that.translator;
        });
        environment.beforeEach.call(this);

        const renderer = that.renderer;
        const stripsGroup = renderer.g();
        const labelAxesGroup = renderer.g();
        const constantLinesGroup = { above: this.renderer.g(), under: this.renderer.g() };
        const axesContainerGroup = renderer.g();
        const gridGroup = renderer.g();

        renderer.g.reset();

        this.axis = new Axis({
            renderer: renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup,
            getTemplate() {}
        });
        this.translator.stub('from').withArgs(100).returns(20);
        this.translator.stub('from').withArgs(120).returns('Second');
    },
    afterEach: function() {
        translator2DModule.Translator2D.restore();
        environment.afterEach.apply(this, arguments);
    },
    updateOptions: environment.updateOptions
});

QUnit.test('Get full ticks - concat and sort major, minor and boundary ticks', function(assert) {
    this.updateOptions({
        showCustomBoundaryTicks: true,
        tick: {
            visible: true
        },
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ min: 0, max: 4 });
    this.generatedTicks = [1, 2, 3];
    this.generatedMinorTicks = [1.5, 2.5];
    this.axis.createTicks(this.canvas);

    const fullTicks = this.axis.getFullTicks();

    assert.deepEqual(fullTicks, [0, 1, 1.5, 2, 2.5, 3, 4]);
});

QUnit.test('Get full ticks for discrete axis - return categories', function(assert) {
    this.updateOptions({
        type: 'discrete',
        showCustomBoundaryTicks: true,
        tick: {
            visible: true
        },
        minorTick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ categories: ['a', 'b', 'c'] });
    this.generatedTicks = ['a', 'b', 'c'];
    this.axis.createTicks(this.canvas);

    const fullTicks = this.axis.getFullTicks();

    assert.deepEqual(fullTicks, ['a', 'b', 'c']);
});

QUnit.test('Get options', function(assert) {
    this.updateOptions({
        testOption: 'test'
    });

    assert.deepEqual(this.axis.getOptions(), {
        testOption: 'test',
        isHorizontal: true,
        hoverMode: 'none',
        label: {
            minSpacing: 5,
            visible: true,
            position: 'bottom',
            alignment: 'center'
        },
        position: 'bottom',
        grid: {},
        minorGrid: {},
        tick: {},
        minorTick: {},
        title: {},
        marker: {},
        _customVisualRange: undefined
    }, 'Options should be correct');
});

QUnit.test('Get options - axis type and data types are in lower case', function(assert) {
    this.updateOptions({
        type: 'TYPE_TYPE',
        argumentType: 'ARGUMENT_TYPE',
        valueType: 'VALUE_TYPE'
    });

    assert.deepEqual(this.axis.getOptions(), {
        type: 'type_type',
        argumentType: 'argument_type',
        valueType: 'value_type',
        isHorizontal: true,
        hoverMode: 'none',
        label: {
            minSpacing: 5,
            visible: true,
            position: 'bottom',
            alignment: 'center'
        },
        position: 'bottom',
        grid: {},
        minorGrid: {},
        tick: {},
        minorTick: {},
        title: {},
        marker: {},
        _customVisualRange: undefined
    }, 'Options should be correct');
});

QUnit.test('Get options after resetTypes - axis type and data types are in lower case', function(assert) {
    this.updateOptions({
        type: 'TYPE_TYPE',
        argumentType: 'ARGUMENT_TYPE',
        valueType: 'VALUE_TYPE'
    });

    this.axis.setTypes('NEW_TYPE', 'NEW_ARGUMENT_TYPE', 'argumentType');
    this.axis.setTypes('NEW_TYPE', 'NEW_VALUE_TYPE', 'valueType');
    this.axis.resetTypes('argumentType');
    this.axis.resetTypes('valueType');

    assert.deepEqual(this.axis.getOptions(), {
        type: 'type_type',
        argumentType: 'argument_type',
        valueType: 'value_type',
        isHorizontal: true,
        hoverMode: 'none',
        label: {
            minSpacing: 5,
            visible: true,
            position: 'bottom',
            alignment: 'center'
        },
        position: 'bottom',
        grid: {},
        minorGrid: {},
        tick: {},
        minorTick: {},
        title: {},
        marker: {},
        _customVisualRange: undefined
    }, 'Options should be correct');
});

QUnit.test('Validate label position option: left to bottom (by default)', function(assert) {
    this.updateOptions({
        label: {
            position: 'left'
        }
    });

    assert.strictEqual(this.axis.getOptions().label.position, 'bottom', 'Label position option should be correct');
});

QUnit.test('Validate label position option: right to bottom (by default)', function(assert) {
    this.updateOptions({
        label: {
            position: 'right'
        }
    });

    assert.strictEqual(this.axis.getOptions().label.position, 'bottom', 'Label position option should be correct');
});

QUnit.test('Validate label position option: left to top', function(assert) {
    this.updateOptions({
        position: 'top',
        label: {
            position: 'left'
        }
    });

    assert.strictEqual(this.axis.getOptions().label.position, 'top', 'Label position option should be correct');
});

QUnit.test('Validate label position option: right to top', function(assert) {
    this.updateOptions({
        position: 'top',
        label: {
            position: 'right'
        }
    });

    assert.strictEqual(this.axis.getOptions().label.position, 'top', 'Label position option should be correct');
});

QUnit.test('Validate label position option: top to left (by default)', function(assert) {
    this.updateOptions({
        isHorizontal: false,
        label: {
            position: 'top'
        }
    });

    assert.strictEqual(this.axis.getOptions().label.position, 'left', 'Label position option should be correct');
});

QUnit.test('Validate label position option: bottom to left (by default)', function(assert) {
    this.updateOptions({
        isHorizontal: false,
        label: {
            position: 'bottom'
        }
    });

    assert.strictEqual(this.axis.getOptions().label.position, 'left', 'Label position option should be correct');
});

QUnit.test('Validate label position option: top to right', function(assert) {
    this.updateOptions({
        isHorizontal: false,
        position: 'right',
        label: {
            position: 'top'
        }
    });

    assert.strictEqual(this.axis.getOptions().label.position, 'right', 'Label position option should be correct');
});

QUnit.test('Validate label position option: bottom to right', function(assert) {
    this.updateOptions({
        isHorizontal: false,
        position: 'right',
        label: {
            position: 'bottom'
        }
    });

    assert.strictEqual(this.axis.getOptions().label.position, 'right', 'Label position option should be correct');
});

QUnit.test('Check tickInterval with new canvas', function(assert) {
    this.updateOptions({});
    this.axis.setBusinessRange({});
    this.generatedTickInterval = 2;
    this.axis.createTicks(this.canvas);
    const translator = translator2DModule.Translator2D.lastCall.returnValue;
    const canvas = {
        top: 200,
        bottom: 200,
        left: 200,
        right: 200,
        width: 400,
        height: 400
    };

    assert.ok(!this.axis.estimateTickInterval(canvas), 'tickInterval is not change');
    assert.equal(translator.updateCanvas.lastCall.args[0], canvas, 'translator is updated');

    this.generatedTickInterval = 3;
    const newCanvas = {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100,
        width: 400,
        height: 400
    };
    assert.ok(this.axis.estimateTickInterval(newCanvas), 'tickInterval is change');
    assert.equal(translator.updateCanvas.lastCall.args[0], newCanvas, 'translator is updated');
});

QUnit.test('GetMarginOptions when they are not set', function(assert) {
    this.updateOptions({});

    assert.deepEqual(this.axis.getMarginOptions(), {});
});

QUnit.test('GetMarginOptions after setting', function(assert) {
    this.updateOptions({});

    const marginOptions = { checkInterval: true };
    this.axis.setMarginOptions(marginOptions);

    assert.equal(this.axis.getMarginOptions(), marginOptions);
});

QUnit.test('Set pane', function(assert) {
    this.updateOptions();
    this.axis.setPane('testPane');

    assert.equal(this.axis.pane, 'testPane', 'Pane should be correct');
});

QUnit.test('Set types', function(assert) {
    this.updateOptions();
    this.axis.setTypes('someAxisType', 'someType', 'valueType');

    assert.equal(this.axis.getOptions().type, 'someAxisType');
    assert.equal(this.axis.getOptions().valueType, 'someType');
});

QUnit.test('Update translator on setTypes pass old business range and canvas', function(assert) {
    this.updateOptions();

    const translator = translator2DModule.Translator2D.lastCall.returnValue;
    this.axis.updateCanvas(this.canvas);
    // act
    this.axis.setTypes('someAxisType', 'someType', 'valueType');

    assert.strictEqual(translator.update.lastCall.args[0], translator.getBusinessRange());
    assert.deepEqual(translator.update.lastCall.args[1], this.canvas);
});

QUnit.test('set undefined types', function(assert) {
    this.updateOptions();
    this.axis.setTypes('someAxisType', 'someType', 'valueType');
    this.axis.setTypes(undefined, undefined, 'valueType');

    assert.equal(this.axis.getOptions().type, 'someAxisType');
    assert.equal(this.axis.getOptions().valueType, 'someType');
});

QUnit.test('applyClipRects', function(assert) {
    this.renderer.g.reset();
    const renderer = this.renderer;
    const axis = new Axis({
        renderer: renderer,
        getTemplate() {}
    });

    axis.applyClipRects('clipRectForElements', 'clipRectForCanvas');

    assert.equal(renderer.g.getCall(1).returnValue.attr.lastCall.args[0]['clip-path'], 'clipRectForElements', 'axis strip group');
    assert.equal(renderer.g.getCall(0).returnValue.attr.lastCall.args[0]['clip-path'], 'clipRectForCanvas', 'axis group');
});

QUnit.test('Disposing', function(assert) {
    const renderer = this.renderer;

    this.updateOptions();

    this.axis.dispose();

    assert.ok(renderer.g.getCall(0).returnValue.dispose.called, 'axis group was cleared');
    assert.ok(renderer.g.getCall(1).returnValue.dispose.called, 'strips group was cleared');
    assert.ok(renderer.g.getCall(3).returnValue.dispose.called, 'elements group was cleared');
});

QUnit.test('beforeCleanGroups with templates for labels', function(assert) {
    const renderer = this.renderer;

    this.updateOptions({
        label: {
            template: ()=>{}
        }
    });

    this.axis.beforeCleanGroups();

    assert.strictEqual(renderer.g.getCall(3).returnValue.linkRemove.callCount, 1);
});

QUnit.test('afterCleanGroups with templates for labels', function(assert) {
    const renderer = this.renderer;

    this.updateOptions({
        label: {
            template: ()=>{}
        }
    });

    renderer.g.getCall(3).returnValue.linkAppend.reset();
    this.axis.afterCleanGroups();

    assert.strictEqual(renderer.g.getCall(3).returnValue.linkAppend.callCount, 1);
});


QUnit.test('beforeCleanGroups without templates for labels', function(assert) {
    const renderer = this.renderer;

    this.updateOptions();

    this.axis.beforeCleanGroups();

    assert.strictEqual(renderer.g.getCall(3).returnValue.stub('linkRemove').callCount, 0);
});

QUnit.test('afterCleanGroups without templates for labels', function(assert) {
    const renderer = this.renderer;

    this.updateOptions();

    renderer.g.getCall(3).returnValue.linkAppend.reset();
    this.axis.afterCleanGroups();

    assert.strictEqual(renderer.g.getCall(3).returnValue.linkAppend.callCount, 0);
});

QUnit.test('calculateInterval - returns absolute difference of two numbers', function(assert) {
    this.updateOptions();

    assert.equal(this.axis.calculateInterval(0.13, 10045), 10044.87);
    assert.equal(this.axis.calculateInterval(10045, 0.13), 10044.87);
});

QUnit.test('Logarithmic axis. calculateInterval - returns difference of logarithms', function(assert) {
    this.updateOptions({
        type: 'logarithmic',
        logarithmBase: 2
    });

    assert.equal(this.axis.calculateInterval(32, 0.25), 7);
});

QUnit.test('Logarithmic axis. calculateInterval - returns difference of logarithms. with allow negatives', function(assert) {
    this.updateOptions({
        type: 'logarithmic',
        allowNegatives: true,
        logarithmBase: 2
    });

    this.axis.setBusinessRange({
        linearThreshold: -4
    });

    assert.equal(this.axis.calculateInterval(32, 0.25), 7);
});

QUnit.test('Get visual range center. Logaritmic', function(assert) {
    this.updateOptions({
        type: 'logarithmic',
        allowNegatives: false,
        logarithmBase: 10
    });

    const range = new Range({
        min: 10,
        max: 1000,
        minVisible: 10,
        maxVisible: 1000
    });

    this.axis.setBusinessRange(range);
    this.translator.getBusinessRange.returns(range);

    assert.equal(this.axis.getVisualRangeCenter(range), 100);
});

QUnit.test('Get visual range center. Logarithmic with negative values', function(assert) {
    this.updateOptions({
        type: 'logarithmic',
        allowNegatives: true,
        logarithmBase: 10
    });

    const range = new Range({
        min: -100,
        max: 100,
        minVisible: -100,
        maxVisible: 100,
        linearThreshold: -3,
        allowNegatives: true
    });

    this.axis.setBusinessRange(range);
    this.translator.getBusinessRange.returns(range);

    assert.equal(this.axis.getVisualRangeCenter(range), 0);
});


QUnit.test('getCategoriesSorter returns categoriesSortingMethod option value', function(assert) {
    this.updateOptions({
        categoriesSortingMethod: 'sorting method'
    });

    const sort = this.axis.getCategoriesSorter();

    assert.equal(sort, 'sorting method');
});

// T714928
QUnit.test('categoriesSortingMethod returns \'categories\' option when \'categoriesSortingMethod\' option is not set', function(assert) {
    this.updateOptions({
        categories: ['1', '2']
    });

    const sort = this.axis.getCategoriesSorter();

    assert.deepEqual(sort, ['1', '2']);
});

// T857880
QUnit.test('getCanvasRange', function(assert) {
    const translator = translator2DModule.Translator2D.lastCall.returnValue;

    translator.stub('translate').onCall(0).returns('translateResult_1');
    translator.stub('translate').onCall(1).returns('translateResult_2');
    translator.stub('from').onCall(0).returns('startValue');
    translator.stub('from').onCall(1).returns('endValue');

    const canvasRange = this.axis.getCanvasRange();

    assert.strictEqual(translator.translate.callCount, 2);
    assert.strictEqual(translator.translate.getCall(0).args[0], 'canvas_position_start');
    assert.strictEqual(translator.translate.getCall(1).args[0], 'canvas_position_end');

    assert.strictEqual(translator.from.callCount, 2);
    assert.strictEqual(translator.from.getCall(0).args[0], 'translateResult_1');
    assert.strictEqual(translator.from.getCall(1).args[0], 'translateResult_2');

    assert.deepEqual(canvasRange, { startValue: 'startValue', endValue: 'endValue' });
});

QUnit.test('getTemplatesGroups, labels without templates', function(assert) {
    this.updateOptions();
    this.axis.setBusinessRange({ min: 0, max: 4 });
    this.generatedTicks = [1, 2, 3];
    this.generatedMinorTicks = [1.5, 2.5];
    this.axis.createTicks(this.canvas);

    assert.deepEqual(this.axis.getTemplatesGroups(), []);
});

QUnit.module('Labels template', {
    beforeEach: function() {
        environment.beforeEach.call(this);

        const renderer = this.renderer;
        const stripsGroup = renderer.g();
        const labelAxesGroup = renderer.g();
        const constantLinesGroup = { above: this.renderer.g(), under: this.renderer.g() };
        const axesContainerGroup = renderer.g();
        const gridGroup = renderer.g();

        renderer.g.reset();
        this.templateRender = sinon.spy();
        this.getTemplate = sinon.spy(() => {
            return {
                render: this.templateRender
            };
        });
        this.axis = new Axis({
            renderer: renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup,
            getTemplate: this.getTemplate
        });

        this.generatedTicks = [1, 2, 3];
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test('getTemplate called on labels drawing', function(assert) {
    this.updateOptions({
        label: {
            template: function() {}
        }
    });
    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 100
    });
    this.axis.createTicks(this.canvas);

    // act
    this.axis.draw();

    // assert
    assert.strictEqual(this.getTemplate.callCount, 1);
});

QUnit.test('arguments passing to render', function(assert) {
    this.updateOptions({
        label: {
            font: {
                prop: true
            },
            template: sinon.spy()
        }
    });
    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 100
    });
    this.axis.createTicks(this.canvas);

    // act
    this.renderer.g.reset();
    this.axis.draw();

    // assert
    assert.strictEqual(this.templateRender.callCount, 3);
    const ticks = this.axis.getFullTicks();

    this.templateRender.getCalls().forEach((currentCall, i) => {
        const callArg = currentCall.args[0];
        assert.strictEqual(callArg.model.valueText, ticks[i].toString(), 'text');
        assert.strictEqual(callArg.model.value, ticks[i], 'value');
        assert.deepEqual(callArg.model.labelFontStyle, { 'font-prop': true }, 'labelFontStyle');
        assert.deepEqual(callArg.model.labelStyle, { align: 'center', 'class': undefined, 'opacity': undefined }, 'labelStyle');
        assert.strictEqual(callArg.container, this.renderer.g.getCall(i).returnValue.element, 'container');
        assert.strictEqual(isFunction(callArg.onRendered), true, 'onRendered');
    });
});

QUnit.test('Get rendered state after init axis', function(assert) {
    assert.strictEqual(this.axis.isRendered(), undefined);
});

QUnit.test('Get rendered state after set', function(assert) {
    this.axis.setRenderedState(true);

    assert.strictEqual(this.axis.isRendered(), true);
});

QUnit.test('getTemplatesDef after drawing', function(assert) {
    this.updateOptions({
        label: { template: sinon.spy() }
    });
    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 100
    });
    this.axis.createTicks(this.canvas);

    // act
    this.axis.draw();

    const def = this.axis.getTemplatesDef();

    assert.strictEqual(isDeferred(def), true);
    assert.strictEqual(def.state(), 'pending');
});

QUnit.test('getTemplatesDef. State after template draw', function(assert) {
    const done = assert.async();
    this.updateOptions({
        label: { template: sinon.spy() }
    });
    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 100
    });
    this.axis.createTicks(this.canvas);

    // act
    this.axis.draw();

    const def = this.axis.getTemplatesDef();

    def.done(function() {
        assert.ok(true, 'deferred resolved');
        done();
    });

    this.templateRender.getCalls().forEach(currentCall => {
        currentCall.args[0].onRendered();
    });
});

QUnit.test('templatesDef after dispose axis', function(assert) {
    this.updateOptions({
        label: { template: sinon.spy() }
    });
    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 100
    });
    this.axis.createTicks(this.canvas);

    // act
    this.axis.draw();

    const def = this.axis.getTemplatesDef();
    this.axis.dispose();

    assert.strictEqual(def.state(), 'rejected');
});

QUnit.test('templatesDef on redrawing', function(assert) {
    this.updateOptions({
        label: { template: sinon.spy() }
    });
    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 100
    });
    this.axis.createTicks(this.canvas);

    // act
    this.axis.draw();

    const def = this.axis.getTemplatesDef();
    this.axis.draw();

    assert.strictEqual(def.state(), 'rejected');
});

QUnit.test('getTemplatesGroups', function(assert) {
    this.updateOptions({
        label: { template: sinon.spy() }
    });
    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 100
    });
    this.axis.createTicks(this.canvas);

    // act
    this.axis.draw();

    const groups = this.axis.getTemplatesGroups();

    assert.equal(groups.length, 3);

    groups.forEach(g => {
        assert.equal(g.typeOfNode, 'group');
    });
});

QUnit.module('Labels Settings', {
    beforeEach: function() {
        environment.beforeEach.call(this);

        const renderer = this.renderer;
        const stripsGroup = renderer.g();
        const labelAxesGroup = renderer.g();
        const constantLinesGroup = { above: this.renderer.g(), under: this.renderer.g() };
        const axesContainerGroup = renderer.g();
        const gridGroup = renderer.g();

        renderer.g.reset();

        this.axis = new Axis({
            renderer: renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup,
            getTemplate() {}
        });

        this.generatedTicks = [1, 2, 3];
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test('default labelSpacing', function(assert) {
    this.updateOptions();

    assert.equal(this.axis.getOptions().label.minSpacing, 5);
});

QUnit.test('custom label min spacing', function(assert) {
    this.updateOptions({
        label: {
            minSpacing: 0
        }
    });

    assert.equal(this.axis.getOptions().label.minSpacing, 0);
});

QUnit.test('Min and max for customizeText', function(assert) {
    this.updateOptions({
        label: {
            customizeText: function() {
                return 'min:' + this.min + ' max:' + this.max;
            },
            visible: true
        }
    });
    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 100
    });

    this.axis.draw(this.canvas);

    assert.strictEqual(this.renderer.text.getCall(0).args[0], 'min:0 max:100', 'Text is correct');
});

QUnit.test('Customize color', function(assert) {
    this.updateOptions({
        label: {
            customizeColor: function() {
                return this.value > 1 ? 'red' : 'blue';
            },
            visible: true
        }
    });

    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 100
    });
    this.axis.draw(this.canvas);

    assert.equal(this.renderer.text.getCall(0).returnValue.css.getCall(0).args[0].fill, 'blue', 'first color');
    assert.equal(this.renderer.text.getCall(1).returnValue.css.getCall(0).args[0].fill, 'red', 'second color');
    assert.equal(this.renderer.text.getCall(2).returnValue.css.getCall(0).args[0].fill, 'red', 'third color');
});

QUnit.module('Validate', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        const renderer = this.renderer;
        const stripsGroup = renderer.g();
        const labelAxesGroup = renderer.g();
        const constantLinesGroup = { above: this.renderer.g(), under: this.renderer.g() };
        const axesContainerGroup = renderer.g();
        const gridGroup = renderer.g();

        renderer.g.reset();

        this.incidentOccurred = sinon.stub();
        this.axis = new Axis({
            renderer: renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup,
            incidentOccurred: this.incidentOccurred,
            isArgumentAxis: true,
            getTemplate() {}
        });
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test('Validate, argumentType - string', function(assert) {
    this.updateOptions({ argumentType: 'string' });

    this.axis.validate();

    assert.ok(this.axis.parser);
    assert.equal(this.axis.getOptions().dataType, 'string');
    assert.deepEqual(this.axis.parser(30), '30');
});

QUnit.test('Validate, argumentType - numeric', function(assert) {
    this.updateOptions({ argumentType: 'numeric' });

    this.axis.validate();

    assert.ok(this.axis.parser);
    assert.equal(this.axis.getOptions().dataType, 'numeric');
    assert.deepEqual(this.axis.parser('30'), 30);
});

QUnit.test('Validate, argumentType - datetime', function(assert) {
    this.updateOptions({ argumentType: 'datetime' });

    this.axis.validate();

    assert.ok(this.axis.parser);
    assert.equal(this.axis.getOptions().dataType, 'datetime');
    assert.deepEqual(this.axis.parser(30), new Date(30));
});

QUnit.test('Validate, wholeRange is wrong', function(assert) {
    this.updateOptions({ argumentType: 'datetime', wholeRange: ['w', 'a'] });

    this.axis.validate();

    assert.deepEqual(this.axis.getOptions().wholeRange, [undefined, undefined]);
});

QUnit.test('Validate wholeRange, option is set', function(assert) {
    this.updateOptions({ argumentType: 'datetime', wholeRange: [10, 20] });

    this.axis.validate();

    assert.deepEqual(this.axis.getOptions().wholeRange, [new Date(10), new Date(20)]);
});

QUnit.test('Validate, visualRange is wrong', function(assert) {
    this.updateOptions({ argumentType: 'datetime', visualRange: ['w', 'a'] });

    this.axis.validate();

    assert.deepEqual(this.axis.getOptions().visualRange, [undefined, undefined]);
});

QUnit.test('Validate visualRange, option is set', function(assert) {
    this.updateOptions({ argumentType: 'datetime', visualRange: [10, 20] });

    this.axis.validate();

    assert.deepEqual(this.axis.getOptions().visualRange, [new Date(10), new Date(20)]);
});

QUnit.module('Zoom', {
    beforeEach: function() {
        const that = this;
        sinon.stub(translator2DModule, 'Translator2D', function() {
            return that.translator;
        });

        environment.beforeEach.call(this);
        const renderer = this.renderer;
        const stripsGroup = renderer.g();
        const labelAxesGroup = renderer.g();
        const constantLinesGroup = { above: this.renderer.g(), under: this.renderer.g() };
        const axesContainerGroup = renderer.g();
        const gridGroup = renderer.g();

        this.eventTrigger = sinon.spy();

        this.axisOptions = {
            renderer: renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            eventTrigger: this.eventTrigger,
            gridGroup: gridGroup
        };

        renderer.g.reset();

        this.axis = this.createAxis({});

        this.generatedTicks = [0, 1, 2];
    },
    createAxis(options) {
        const axis = new Axis($.extend({ getTemplate() {} }, this.axisOptions, options));
        axis.parser = function(value) {
            return value;
        };
        return axis;
    },
    afterEach: function() {
        translator2DModule.Translator2D.restore();
        environment.afterEach.call(this);
    },
    updateOptions: environment.updateOptions
});

QUnit.test('getViewport return object with field \'action\' if need', function(assert) {
    this.updateOptions();

    this.axis.handleZooming({ startValue: 1, endValue: 2 }, undefined, undefined, 'zoom');

    assert.deepEqual(this.axis.getViewport(), { startValue: 1, endValue: 2, action: 'zoom' });
});

QUnit.test('hold min/max for single point series', function(assert) {
    this.updateOptions({
        tick: {
            visible: true
        }
    });
    this.axis.setBusinessRange({ min: 4, max: 4 });
    this.generatedTicks = [3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6, 4.8];
    this.axis.createTicks(this.canvas);
    const businessRange = this.axis.getTranslator().getBusinessRange();

    assert.equal(businessRange.min, 4, 'min');
    assert.equal(businessRange.max, 4, 'max');
});

QUnit.test('Get visual range after setBusinessRange. Discrete', function(assert) {
    this.updateOptions({ type: 'discrete' });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: ['A', 'B', 'C', 'D', 'E', 'F']
    });

    assert.deepEqual(this.axis.visualRange(), {
        startValue: 'A',
        endValue: 'F',
        categories: ['A', 'B', 'C', 'D', 'E', 'F']
    });
});

QUnit.test('Trigger zoom events', function(assert) {
    this.updateOptions({
        type: 'continuous'
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 50
    });

    this.axis.visualRange(10, 20);

    assert.equal(this.eventTrigger.callCount, 1);
    assert.equal(this.eventTrigger.firstCall.args[0], 'zoomStart');
    assert.equal(this.eventTrigger.firstCall.args[1].axis, this.axis);
    assert.deepEqual(this.eventTrigger.firstCall.args[1].range, {
        startValue: 0,
        endValue: 50
    });
    assert.strictEqual(this.eventTrigger.firstCall.args[1].cancel, false);

    assert.deepEqual(this.axis._storedZoomEndParams, {
        prevent: false,
        action: undefined,
        event: undefined,
        startRange: {
            startValue: 0,
            endValue: 50
        },
        type: 'continuous'
    });
});

QUnit.test('Can cancel zooming on zoom start', function(assert) {
    this.eventTrigger = sinon.spy(function(_, e) {
        e.cancel = true;
    });

    this.axis = this.createAxis({
        eventTrigger: this.eventTrigger
    });

    this.updateOptions();

    this.axis.setBusinessRange({
        min: 0,
        max: 50
    });

    this.axis.visualRange(10, 20);

    assert.equal(this.eventTrigger.callCount, 1);
    assert.equal(this.eventTrigger.firstCall.args[0], 'zoomStart');
    assert.deepEqual(this.axis.visualRange(), {
        startValue: 0,
        endValue: 50
    });
});

QUnit.test('Can cancel zooming on zoom end', function(assert) {
    this.eventTrigger = sinon.spy(function(event, e) {
        if(event === 'zoomEnd') {
            e.cancel = true;
        }
    });

    this.axis = this.createAxis({
        eventTrigger: this.eventTrigger
    });

    this.updateOptions();

    this.axis.setBusinessRange({
        min: 0,
        max: 50
    });
    this.axis._translator.canvasLength = 800;

    sinon.spy(this.axis, '_visualRange');

    this.axis.visualRange(10, 20);
    this.axis.handleZoomEnd();

    assert.equal(this.eventTrigger.callCount, 2);
    assert.equal(this.eventTrigger.secondCall.args[0], 'zoomEnd');
    assert.deepEqual(this.axis.visualRange(), {
        startValue: 0,
        endValue: 50
    });
    assert.ok(this.axis._visualRange.called);
});

QUnit.test('Can prevent zoomStart', function(assert) {
    this.updateOptions({ type: 'continuous' });

    this.axis.setBusinessRange({
        min: 0,
        max: 50
    });

    this.axis.visualRange([10, 20], { start: true });

    assert.equal(this.eventTrigger.callCount, 0);
    assert.deepEqual(this.axis._storedZoomEndParams, {
        prevent: false,
        action: undefined,
        event: undefined,
        startRange: {
            startValue: 0,
            endValue: 50
        },
        type: 'continuous'
    });
});

QUnit.test('Can prevent zoomEnd', function(assert) {
    this.updateOptions({ type: 'continuous' });

    this.axis.setBusinessRange({
        min: 0,
        max: 50
    });

    this.axis.visualRange([10, 20], { end: true });

    assert.equal(this.eventTrigger.callCount, 1);
    assert.equal(this.eventTrigger.firstCall.args[0], 'zoomStart');
    assert.deepEqual(this.axis._storedZoomEndParams, {
        prevent: true,
        action: undefined,
        event: undefined,
        startRange: {
            startValue: 0,
            endValue: 50
        },
        type: 'continuous'
    });
});

QUnit.test('Set visual range using array', function(assert) {
    this.updateOptions();

    this.axis.visualRange([10, 20]);

    assert.equal(this.axis.visualRange().startValue, 10, 'visualRange[0] should be correct');
    assert.equal(this.axis.visualRange().endValue, 20, 'visualRange[1] should be correct');
});


QUnit.test('Set visual range using object', function(assert) {
    this.updateOptions();

    this.axis.setBusinessRange({
        min: 0,
        max: 100
    });

    this.axis.visualRange({ startValue: 10, endValue: 20 });

    assert.equal(this.axis.visualRange().startValue, 10, 'visualRange[0] should be correct');
    assert.equal(this.axis.visualRange().endValue, 20, 'visualRange[1] should be correct');
});

QUnit.test('visualRange option is defined', function(assert) {
    this.updateOptions({
        visualRange: [0, 50]
    });

    this.axis.visualRange(10, 20);

    assert.equal(this.axis.visualRange().startValue, 10, 'visualRange[0] should be correct');
    assert.equal(this.axis.visualRange().endValue, 20, 'visualRange[1] should be correct');
});

QUnit.test('visualRange option is defined. Set start edge', function(assert) {
    this.updateOptions({
        visualRange: [0, 50]
    });
    this.axis.validate();

    this.axis.visualRange({ startValue: 10 }, { allowPartialUpdate: true });

    assert.equal(this.axis.visualRange().startValue, 10, 'visualRange[0] should be correct');
    assert.equal(this.axis.visualRange().endValue, 50, 'visualRange[1] should be correct');
});

QUnit.test('visualRange option is defined. Set end edge', function(assert) {
    this.updateOptions({
        visualRange: [0, 50]
    });
    this.axis.validate();

    this.axis.visualRange({ endValue: 40 }, { allowPartialUpdate: true });

    assert.equal(this.axis.visualRange().startValue, 0, 'visualRange[0] should be correct');
    assert.equal(this.axis.visualRange().endValue, 40, 'visualRange[1] should be correct');
});

QUnit.test('min and max for discrete axis', function(assert) {
    this.updateOptions({
        type: 'discrete',
        min: 'minValue',
        max: 'maxValue'
    });

    this.axis.visualRange('minZoomValue', 'maxZoomValue');

    const result = this.axis.visualRange();
    assert.strictEqual(result.startValue, 'minZoomValue', 'min range value should be correct');
    assert.strictEqual(result.endValue, 'maxZoomValue', 'max range value should be correct');
});

QUnit.test('visual range for discrete axis', function(assert) {
    this.updateOptions({
        type: 'discrete',
        visualRange: ['minValue', 'maxValue']
    });

    this.axis.visualRange('minZoomValue', 'maxZoomValue');

    const result = this.axis.visualRange();
    assert.strictEqual(result.startValue, 'minZoomValue', 'min range value should be correct');
    assert.strictEqual(result.endValue, 'maxZoomValue', 'max range value should be correct');
});

QUnit.test('min and max out of the specified area', function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    this.axis.visualRange(15, 60);

    const result = this.axis.visualRange();
    assert.equal(result.startValue, 15, 'min range value should be correct');
    assert.equal(result.endValue, 60, 'max range value should be correct');
});

QUnit.test('visualRange out of the specified area', function(assert) {
    this.updateOptions({
        visualRange: [20, 50]
    });

    this.axis.visualRange(15, 60);

    const result = this.axis.visualRange();
    assert.equal(result.startValue, 15, 'min range value should be correct');
    assert.equal(result.endValue, 60, 'max range value should be correct');
});

QUnit.test('min and max out of the specified area to left', function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    this.axis.visualRange(5, 10);

    const result = this.axis.visualRange();
    assert.equal(result.startValue, 5, 'min range value should be correct');
    assert.equal(result.endValue, 10, 'max range value should be correct');
});

QUnit.test('visualRange out of the specified area to left', function(assert) {
    this.updateOptions({
        visualRange: [20, 50]
    });

    this.axis.visualRange(5, 10);

    const result = this.axis.visualRange();
    assert.equal(result.startValue, 5, 'min range value should be correct');
    assert.equal(result.endValue, 10, 'max range value should be correct');
});

QUnit.test('min and max out of the specified area to right', function(assert) {
    this.updateOptions({
        min: 20,
        max: 50
    });

    this.axis.visualRange(60, 80);

    const result = this.axis.visualRange();
    assert.equal(result.startValue, 60, 'min range value should be correct');
    assert.equal(result.endValue, 80, 'max range value should be correct');
});

QUnit.test('visualRange out of the specified area to right', function(assert) {
    this.updateOptions({
        visualRange: [20, 50]
    });

    this.axis.visualRange(60, 80);

    const result = this.axis.visualRange();
    assert.equal(result.startValue, 60, 'min range value should be correct');
    assert.equal(result.endValue, 80, 'max range value should be correct');
});

QUnit.test('zooming. inverted min and max - correct order', function(assert) {
    this.updateOptions();

    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 10
    });

    this.axis.visualRange(8, 5);

    const result = this.axis.visualRange();
    assert.equal(result.startValue, 5, 'min range value should be correct');
    assert.equal(result.endValue, 8, 'max range value should be correct');
});

QUnit.test('zooming. inverted min and max. discrete - do not correct order', function(assert) {
    this.updateOptions({
        type: 'discrete'
    });

    this.axis.setBusinessRange({
        addRange: sinon.stub(),
        min: 0,
        max: 10
    });

    this.axis.visualRange(8, 5);

    const result = this.axis.visualRange();
    assert.equal(result.startValue, 8, 'min range value should be correct');
    assert.equal(result.endValue, 5, 'max range value should be correct');
});

QUnit.module('VisualRange', {
    beforeEach: function() {
        environment.beforeEach.call(this);

        const renderer = this.renderer;
        const stripsGroup = renderer.g();
        const labelAxesGroup = renderer.g();
        const constantLinesGroup = { above: this.renderer.g(), under: this.renderer.g() };
        const axesContainerGroup = renderer.g();
        const gridGroup = renderer.g();

        renderer.g.reset();
        this.incidentOccurred = sinon.stub();
        this.axis = new Axis({
            renderer: this.renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            gridGroup: gridGroup,
            incidentOccurred: this.incidentOccurred,
            eventTrigger: () => { },
            getTemplate() {}
        });

        this.axis.parser = function(value) {
            return value;
        };

        this.updateOptions({});
    },
    afterEach: environment.afterEach,
    updateOptions: environment.updateOptions
});

QUnit.test('Get viewport. min/max undefined, there is no zooming', function(assert) {
    assert.deepEqual(this.axis.getViewport(), {});
});

QUnit.test('Get viewport. visualRange is null initialized, there is no zooming', function(assert) {
    this.updateOptions({
        visualRange: [null, null]
    });
    this.axis.validate();

    assert.deepEqual(this.axis.getViewport(), {
        startValue: null,
        endValue: null
    });
});

QUnit.test('Get visualRange. visualRange undefined, there is no zooming and option', function(assert) {
    assert.deepEqual(this.axis.visualRange(), {
        startValue: undefined,
        endValue: undefined
    });
});

QUnit.test('Get viewport after zooming', function(assert) {
    this.axis.visualRange(10, 20);
    assert.deepEqual(this.axis.getViewport(), { startValue: 10, endValue: 20 });
});

QUnit.test('Get visualRange after zooming', function(assert) {
    this.axis.visualRange(10, 20);
    assert.deepEqual(this.axis.visualRange(), { startValue: 10, endValue: 20 });
});

QUnit.test('Get viewport. visualRange is defined', function(assert) {
    this.updateOptions({
        visualRange: [5, 10]
    });
    this.axis.validate();

    assert.deepEqual(this.axis.getViewport(), { startValue: 5, endValue: 10 });
});

QUnit.test('Get visualRange. visualRange is defined', function(assert) {
    this.updateOptions({
        visualRange: [5, 10]
    });
    this.axis.validate();

    assert.deepEqual(this.axis.visualRange(), { startValue: 5, endValue: 10 });
});

const dataMarginsEnvironment = {
    beforeEach: function() {
        sinon.spy(translator2DModule, 'Translator2D');

        environment.beforeEach.call(this);

        this.canvas = {
            top: 200,
            bottom: 200,
            left: 200,
            right: 200,
            width: 700,
            height: 400
        };
    },
    afterEach: function() {
        translator2DModule.Translator2D.restore();
        environment.afterEach.call(this);
    },
    createAxis: function(isArgumentAxis, options) {
        const renderer = this.renderer;
        const axis = new Axis({
            renderer: renderer,
            stripsGroup: renderer.g(),
            labelAxesGroup: renderer.g(),
            constantLinesGroup: { above: this.renderer.g(), under: this.renderer.g() },
            axesContainerGroup: renderer.g(),
            gridGroup: renderer.g(),
            isArgumentAxis: isArgumentAxis,
            eventTrigger: () => { },
            getTemplate() {}
        });

        axis.updateOptions($.extend(true, {
            type: 'continuous',
            dataType: 'numeric',
            isHorizontal: true,
            label: {
                visible: true
            }
        }, options));
        axis.parser = v => v;
        return axis;
    },
    testMargins: function(assert, data) {
        const axis = this.createAxis(data.isArgumentAxis, data.options);

        this.generatedTicks = data.ticks;
        axis.setBusinessRange(data.range);
        axis.setMarginOptions(data.marginOptions || {});

        const translator = translator2DModule.Translator2D.lastCall.returnValue;

        sinon.spy(translator, 'updateBusinessRange');

        if(data.zoom) {
            axis.handleZooming(data.zoom, undefined, undefined, 'zoom');
        }

        axis.draw(this.canvas);

        const range = {
            interval: translator.updateBusinessRange.lastCall.args[0].interval,
            minVisible: translator.from(this.canvas.left),
            maxVisible: translator.from(this.canvas.width - this.canvas.right),
            categories: translator.updateBusinessRange.lastCall.args[0].categories
        };
        const expectedRange = data.expectedRange;

        if(expectedRange) {
            if('categories' in expectedRange) {
                assert.deepEqual(range.categories, expectedRange.categories, 'categorties');
            } else {
                'minVisible' in expectedRange && assert.roughEqual(translator.to(expectedRange.minVisible, -1), this.canvas.left, 1.01, 'minVisible value');
                'maxVisible' in expectedRange && assert.roughEqual(translator.to(expectedRange.maxVisible, +1), this.canvas.width - this.canvas.right, 1.01, 'maxVisible value');
            }

            'interval' in expectedRange && assert.equal(range.interval, expectedRange.interval, 'interval');
        }

        const expectedVisibleArea = data.expectedVisibleArea;

        if(expectedVisibleArea) {
            assert.equal(Math.round(translator.getCanvasVisibleArea().min), Math.round(expectedVisibleArea.min));
            assert.equal(Math.round(translator.getCanvasVisibleArea().max), Math.round(expectedVisibleArea.max));
        }
    }
};

QUnit.module('Data margins calculations', dataMarginsEnvironment);

QUnit.test('minValueMargin - apply margins to the min', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.2,
            endOnTick: false
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            minVisible: 80,
            maxVisible: 200
        }
    });
});

// T603177
QUnit.test('Margins for one point (dateTime)', function(assert) {
    const date = new Date('2018/05/02');

    this.testMargins(assert, {
        isArgumentAxis: true,
        marginOptions: {
            checkInterval: true
        },
        options: {
            dataType: 'datetime',
            valueMarginsEnabled: true
        },
        ticks: [date],
        range: {
            min: date,
            max: date
        },
        expectedRange: {
            interval: 0
        },
        expectedVisibleArea: { min: 200, max: 500 }
    });
});

// T829705
QUnit.test('Margins for one aggregated point (dateTime)', function(assert) {
    const date = new Date('2018/05/02');
    this.testMargins(assert, {
        isArgumentAxis: true,
        marginOptions: {
            checkInterval: true
        },
        options: {
            dataType: 'datetime',
            valueMarginsEnabled: true
        },
        ticks: [date],
        range: {
            interval: 1 * 24 * 60 * 60 * 1000, // aggregation emalation
            min: date,
            max: date
        },
        expectedRange: {
            interval: 0
        },
        expectedVisibleArea: { min: 200, max: 500 }
    });
});

QUnit.test('maxValueMargin - apply margins to the max', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            min: 100,
            max: 220,
            minVisible: 100,
            maxVisible: 220
        }
    });
});

QUnit.test('minValueMargin and maxValueMargin - apply margins to the both sides', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 1000,
            max: 2000
        },
        ticks: [1100, 1800],
        expectedRange: {
            minVisible: 900,
            maxVisible: 2200
        },
        expectedVisibleArea: {
            min: this.canvas.left + 300 / (1 + 0.1 + 0.2) * 0.1,
            max: this.canvas.width - this.canvas.right - 300 / (1 + 0.1 + 0.2) * 0.2
        }
    });
});

QUnit.test('minValueMargin and maxValueMargin - apply margins to the both sides. inverted axis', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2,
            inverted: true
        },
        range: {
            min: 1000,
            max: 2000
        },
        ticks: [1100, 1800],
        expectedVisibleArea: {
            min: this.canvas.left + 300 / (1 + 0.1 + 0.2) * 0.2,
            max: this.canvas.width - this.canvas.right - 300 / (1 + 0.1 + 0.2) * 0.1
        },
        isArgumentAxis: true
    });
});

QUnit.test('marginOptions.size - apply margins by size', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 100
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            minVisible: 75,
            maxVisible: 225
        }
    });
});

QUnit.test('marginOptions.size. Margin size greater than canvas length - apply max possible margin value', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 1000
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedVisibleArea: {
            min: 275,
            max: 350
        }
    });
});

QUnit.test('marginOptions.checkInterval, range interval less than spacing factor - apply margins by range interval', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 100,
            max: 220,
            interval: 10
        },
        ticks: [100, 220],
        expectedRange: {
            minVisible: 95,
            maxVisible: 225,
            interval: 10
        },
        isArgumentAxis: true
    });
});

QUnit.test('marginOptions.checkInterval, range interval more than spacing factor - apply margins by spacing factor', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 100,
            max: 220,
            interval: 30
        },
        ticks: [100, 220],
        expectedRange: {
            minVisible: 85,
            maxVisible: 235,
            interval: 30
        },
        isArgumentAxis: true
    });
});

QUnit.test('marginOptions.checkInterval, no range interval (one point in series) - apply margins by tickInterval', function(assert) {
    this.generatedTickInterval = 20;
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 100,
            max: 220
        },
        ticks: [100, 220],
        expectedRange: {
            minVisible: 90,
            maxVisible: 230,
            interval: 20
        },
        isArgumentAxis: true
    });
});

QUnit.test('margins calculation. Range interval with tickInterval', function(assert) {
    this.generatedTickInterval = 10;
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 100,
            max: 220,
            interval: 20
        },
        ticks: [100, 220],
        expectedRange: {
            min: 95,
            max: 225,
            minVisible: 95,
            maxVisible: 225,
            interval: 10
        },
        isArgumentAxis: true
    });
});

QUnit.test('margins calculation. Range interval with tickInterval + tickInterval estimation', function(assert) {
    const getTickGeneratorReturns = function(tickInterval) {
        return {
            ticks: [],
            minorTicks: [],
            tickInterval: tickInterval || 10
        };
    };

    this.tickGeneratorSpy = sinon.stub();
    this.tickGeneratorSpy.returns(getTickGeneratorReturns());
    this.tickGeneratorSpy.onCall(1).returns(getTickGeneratorReturns(10));

    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 100,
            max: 220,
            interval: 20
        },
        ticks: [100, 220],
        expectedRange: {
            minVisible: 95,
            maxVisible: 225,
            interval: 10
        },
        isArgumentAxis: true
    });
});

QUnit.test('margins calculation. Range interval with tickInterval + tickInterval estimation + aggregationInterval', function(assert) {
    const getTickGeneratorReturns = (tickInterval) => {
        return {
            ticks: [],
            minorTicks: [],
            tickInterval: tickInterval || 10
        };
    };

    this.tickGeneratorSpy = sinon.stub();
    this.tickGeneratorSpy.onCall(0).returns(getTickGeneratorReturns({ days: 2 }));
    this.tickGeneratorSpy.returns(getTickGeneratorReturns('month'));

    const axis = this.createAxis(true, {
        valueMarginsEnabled: true,
        dataType: 'datetime'
    });

    axis.setBusinessRange({
        min: new Date(2018, 2, 27),
        max: new Date(2018, 3, 27)
    });
    axis.updateCanvas(this.canvas);
    axis.getAggregationInfo(undefined, {});

    axis.setMarginOptions({
        checkInterval: true
    });

    axis.draw(this.canvas);

    assert.equal(axis.getTranslator().getBusinessRange().interval, 2 * 1000 * 3600 * 24, 'interval');
});

QUnit.test('T746896. Pass correct range to tick generator after syncroniztion', function(assert) {
    const axis = this.createAxis(true, {
        valueMarginsEnabled: false
    });

    axis.setBusinessRange({
        min: 100,
        max: 200
    });
    axis.updateCanvas(this.canvas);

    axis.setMarginOptions({
        size: 10
    });

    axis.draw(this.canvas);

    axis.getTranslator().updateBusinessRange({
        min: 50,
        max: 250
    });

    this.tickGeneratorSpy.reset();

    axis.createTicks(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[0].min, 100);
    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[0].max, 200);
});

QUnit.test('Pass correct range to tick generator. Discrete axis', function(assert) {
    const axis = this.createAxis(true, {
        valueMarginsEnabled: true,
        type: 'discrete'
    });

    axis.setBusinessRange({
        categories: ['1', '2', '3']
    });
    axis.updateCanvas(this.canvas);

    axis.setMarginOptions({
        size: 40
    });

    axis.draw(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[0].min, undefined);
    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[0].max, undefined);
});

QUnit.test('margins calculation. Work week calculation: interval > work week', function(assert) {
    const getTickGeneratorReturns = (tickInterval) => {
        return {
            ticks: [],
            minorTicks: [],
            tickInterval: tickInterval || 10
        };
    };

    this.tickGeneratorSpy = sinon.stub();
    this.tickGeneratorSpy.returns(getTickGeneratorReturns({ weeks: 1 }));

    const axis = this.createAxis(true, {
        valueMarginsEnabled: true,
        dataType: 'datetime',
        workdaysOnly: true,
        workWeek: [1, 2, 3, 4, 5]
    });

    axis.setBusinessRange({
        min: new Date(2018, 2, 27),
        max: new Date(2018, 3, 27)
    });
    axis.updateCanvas(this.canvas);

    axis.setMarginOptions({
        checkInterval: true
    });

    axis.draw(this.canvas);

    assert.equal(axis.getTranslator().getBusinessRange().interval, 5 * 1000 * 3600 * 24, 'interval');
});

QUnit.test('margins calculation. Work week calculation: work week === interval ', function(assert) {
    const getTickGeneratorReturns = (tickInterval) => {
        return {
            ticks: [],
            minorTicks: [],
            tickInterval: tickInterval || 10
        };
    };

    this.tickGeneratorSpy = sinon.stub();
    this.tickGeneratorSpy.returns(getTickGeneratorReturns({ days: 4 }));

    const axis = this.createAxis(true, {
        valueMarginsEnabled: true,
        dataType: 'datetime',
        workdaysOnly: true,
        workWeek: [1, 2, 3, 4]
    });

    axis.setBusinessRange({
        min: new Date(2018, 2, 27),
        max: new Date(2018, 3, 27)
    });
    axis.updateCanvas(this.canvas);

    axis.setMarginOptions({
        checkInterval: true
    });

    axis.draw(this.canvas);

    assert.equal(axis.getTranslator().getBusinessRange().interval, 4 * 1000 * 3600 * 24, 'interval');
});

QUnit.test('margins calculation. Work week calculation: interval < day ', function(assert) {
    const getTickGeneratorReturns = (tickInterval) => {
        return {
            ticks: [],
            minorTicks: [],
            tickInterval: tickInterval || 10
        };
    };

    this.tickGeneratorSpy = sinon.stub();
    this.tickGeneratorSpy.returns(getTickGeneratorReturns({ hours: 4 }));

    const axis = this.createAxis(true, {
        valueMarginsEnabled: true,
        dataType: 'datetime',
        workdaysOnly: true,
        workWeek: [1, 2, 3, 4]
    });

    axis.setBusinessRange({
        min: new Date(2018, 2, 27),
        max: new Date(2018, 3, 27)
    });
    axis.updateCanvas(this.canvas);

    axis.setMarginOptions({
        checkInterval: true
    });

    axis.draw(this.canvas);

    assert.equal(axis.getTranslator().getBusinessRange().interval, 4 * 1000 * 3600, 'interval');
});

QUnit.test('margins calculation. Work week calculation: weekend >= interval ', function(assert) {
    const getTickGeneratorReturns = (tickInterval) => {
        return {
            ticks: [],
            minorTicks: [],
            tickInterval: tickInterval || 10
        };
    };

    this.tickGeneratorSpy = sinon.stub();
    this.tickGeneratorSpy.returns(getTickGeneratorReturns({ days: 2 }));

    const axis = this.createAxis(true, {
        valueMarginsEnabled: true,
        dataType: 'datetime',
        workdaysOnly: true,
        workWeek: [1, 2, 3, 4, 5]
    });

    axis.setBusinessRange({
        min: new Date(2018, 2, 27),
        max: new Date(2018, 3, 27)
    });
    axis.updateCanvas(this.canvas);

    axis.setMarginOptions({
        checkInterval: true
    });

    axis.draw(this.canvas);

    assert.equal(axis.getTranslator().getBusinessRange().interval, 1 * 1000 * 3600 * 24, 'interval');
});

QUnit.test('marginOptions.checkInterval on valueAxis - ignore interval', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            minVisible: 100,
            min: 98,
            max: 220,
            interval: 10
        },
        ticks: [100, 220],
        expectedRange: {
            minVisible: 100,
            maxVisible: 220,
            interval: 10
        },
        isArgumentAxis: false
    });
});

QUnit.test('marginOptions.checkInterval on valueAxis. Add margin for showing min point (T862823)', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedVisibleArea: {
            min: 205,
            max: 500
        },
        isArgumentAxis: false
    });
});

QUnit.test('marginOptions.checkInterval on valueAxis. Empty chart (T862823)', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: undefined,
            max: undefined,
            minVisible: undefined,
            maxVisible: undefined
        },
        expectedVisibleArea: {
            min: 200,
            max: 500
        },
        isArgumentAxis: false
    });
});

QUnit.test('marginOptions.checkInterval on valueAxis. All points are negative - add margin for showing max point (T862823)', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: -200,
            max: -100
        },
        ticks: [-200, -100],
        expectedVisibleArea: {
            min: 200,
            max: 495
        },
        isArgumentAxis: false
    });
});

QUnit.test('marginOptions.checkInterval and marginOptions.size, size more than interval - apply margins by size', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true,
            size: 100
        },
        range: {
            min: 100,
            max: 200,
            interval: 10
        },
        ticks: [100, 200],
        expectedRange: {
            minVisible: 75,
            maxVisible: 225,
            interval: 10
        },
        isArgumentAxis: true
    });
});

QUnit.test('marginOptions.checkInterval and marginOptions.size, size less than interval - apply margins by interval', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true,
            size: 40
        },
        range: {
            min: 100,
            max: 220,
            interval: 30
        },
        ticks: [100, 220],
        expectedRange: {
            minVisible: 85,
            maxVisible: 235,
            interval: 30
        },
        isArgumentAxis: true
    });
});

QUnit.test('marginOptions.size and marginOptions.percentStick, min != 1, max = 1 - do not calculate max margin', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 100,
            percentStick: true
        },
        range: {
            min: 0.4,
            max: 1
        },
        ticks: [0.4, 1],
        expectedRange: {
            minVisible: 0.28,
            maxVisible: 1
        },
        isArgumentAxis: false
    });
});

QUnit.test('marginOptions.percentStick, min != 1, max = 1 - calculate custom margin', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            maxValueMargin: 0.1
        },
        marginOptions: {
            size: 100,
            percentStick: true
        },
        range: {
            min: 0.4,
            max: 1
        },
        ticks: [0.4, 1],
        expectedRange: {
            minVisible: 0.268,
            maxVisible: 1.06
        },
        isArgumentAxis: false
    });
});

QUnit.test('marginOptions.size and marginOptions.percentStick, min = -1 - do not calculate min margin', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 100,
            percentStick: true
        },
        range: {
            min: -1,
            max: -0.4
        },
        ticks: [-1, -0.4],
        expectedRange: {
            minVisible: -1,
            maxVisible: -0.28
        },
        isArgumentAxis: false
    });
});

QUnit.test('marginOptions.percentStick, min = -1 - calculate calculate custom min margin', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1
        },
        marginOptions: {
            size: 100,
            percentStick: true
        },
        range: {
            min: -1,
            max: -0.4
        },
        ticks: [-1, -0.4],
        expectedRange: {
            minVisible: -1.06,
            maxVisible: -0.268
        },
        isArgumentAxis: false
    });
});

QUnit.test('Argument axis, marginOptions.percentStick - option does not take effect, margin is calculated', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 100,
            percentStick: true
        },
        range: {
            min: 0.4,
            max: 1
        },
        ticks: [0.4, 1],
        expectedRange: {
            minVisible: 0.25,
            maxVisible: 1.15
        },
        isArgumentAxis: true
    });
});

QUnit.test('Has minValueMargin and marginOptions - apply minValueMargin and calculate max margin', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1
        },
        marginOptions: {
            size: 100
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            minVisible: 90,
            maxVisible: 222
        },
        expectedVisibleArea: {
            min: 223,
            max: 450
        }
    });
});

QUnit.test('minValueMargin NaN and marginOptions - treat NaN as 0, calculate max margin', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: NaN
        },
        marginOptions: {
            size: 100
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            minVisible: 100,
            maxVisible: 220
        },
        expectedVisibleArea: {
            min: this.canvas.left,
            max: this.canvas.width - this.canvas.right - 50
        }
    });
});

QUnit.test('Has maxValueMargin and marginOptions - apply maxValueMargin and calculate min margin', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            maxValueMargin: 0.1
        },
        marginOptions: {
            size: 100
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            minVisible: 78,
            maxVisible: 210
        },
        expectedVisibleArea: { min: 250, max: 477 }
    });
});

QUnit.test('valueMarginsEnabled false - do not apply margins', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: false,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        marginOptions: {
            checkInterval: true,
            size: 100
        },
        range: {
            min: 100,
            max: 200,
            interval: 30
        },
        ticks: [100, 200],
        expectedRange: {
            minVisible: 100,
            maxVisible: 200
        },
        isArgumentAxis: true
    });
});

QUnit.test('valueMarginsEnabled false - calculate correct interval', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: false
        },
        marginOptions: {
            checkInterval: true,
            size: 40
        },
        range: {
            min: 100,
            max: 220,
            interval: 30
        },
        ticks: [100, 220],
        expectedRange: {
            min: 100,
            max: 220,
            minVisible: 100,
            maxVisible: 220,
            interval: 30
        },
        isArgumentAxis: true
    });
});

QUnit.test('Logarithmic axis. valueMarginsEnabled false - calculate correct interval', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: false,
            type: 'logarithmic',
            logarithmBase: 10,
            axisDivisionFactor: 120
        },
        marginOptions: {
            checkInterval: true,
            size: 40
        },
        range: {
            min: 100,
            max: 10000000,
            interval: 7
        },
        ticks: [100, 1000],
        expectedRange: {
            min: 100,
            max: 10000000,
            minVisible: 100,
            maxVisible: 10000000,
            interval: 7
        },
        isArgumentAxis: true
    });
});

QUnit.test('Calculate ticks on range with margins', function(assert) {
    const axis = this.createAxis(true, {
        valueMarginsEnabled: true,
        minValueMargin: 0.1,
        maxValueMargin: 0.2
    });

    axis.setBusinessRange({
        min: 100,
        max: 200
    });

    axis.draw(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[0], {
        categories: undefined,
        isSpacedMargin: false,
        max: 220,
        min: 90
    });
});

QUnit.test('Axis pass margin options for calculate ticks', function(assert) {
    const axis = this.createAxis(true, {
        valueMarginsEnabled: true
    });

    axis.setMarginOptions({
        size: 100
    });

    axis.setBusinessRange({
        min: 100,
        max: 200
    });

    axis.draw(this.canvas);

    assert.deepEqual(this.tickGeneratorSpy.lastCall.args[0], {
        categories: undefined,
        isSpacedMargin: true,
        max: 225,
        min: 75
    });
});

QUnit.test('Margins and endOnTick = true - extend range with margins to boundary ticks', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2,
            endOnTick: true // emulation, see returned ticks below
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [80, 240],
        expectedRange: {
            minVisible: 80,
            maxVisible: 240
        }
    });
});

QUnit.test('Margins and endOnTick = true - extend range with margins to boundary ticks if value margins are disabled', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: false,
            endOnTick: true // emulation, see returned ticks below
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [80, 240],
        expectedRange: {
            minVisible: 80,
            maxVisible: 240
        }
    });
});

QUnit.test('Apply only margins. if ticks go out of range but not behind margin', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.2,
            maxValueMargin: 0.2,
            endOnTick: true // emulation, see returned ticks below
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [90, 210],
        expectedRange: {
            minVisible: 80,
            maxVisible: 220
        }
    });
});

QUnit.test('Apply endOnTick if tick margin greater then margin', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.2,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [80, 222],
        expectedRange: {
            minVisible: 80,
            maxVisible: 222
        }
    });
});

QUnit.test('Do not cut margin if it greater than tick margin', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 10
        },
        range: {
            min: -40,
            max: 55
        },
        ticks: [-40, 60],
        expectedRange: {
            minVisible: -42,
            maxVisible: 60
        }
    });
});

QUnit.test('T170398. Correct zero level on value axis, min and max less than zero - margins can not go below zero', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.2,
            maxValueMargin: 0.1
        },
        range: {
            min: 10,
            max: 110
        },
        ticks: [10, 110],
        expectedRange: {
            min: 0,
            max: 120,
            minVisible: 0,
            maxVisible: 120
        }
    });
});

QUnit.test('Correct zero level on value axis, min and max greater than zero - margins can not go below zero', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 30
        },
        range: {
            min: 0,
            max: 100
        },
        ticks: [10, 90],
        expectedRange: {
            minVisible: 0,
            maxVisible: 106
        }
    });
});

// T905213
QUnit.test('Chech zero value. Datetime axis', function(assert) {
    this.testMargins(assert, {
        options: {
            dataType: 'datetime',
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.1
        },
        range: {
            min: new Date(4),
            max: new Date(130),
            dataType: 'datetime'
        },
        expectedRange: {
            minVisible: -8,
            maxVisible: 143
        }
    });
});

QUnit.test('Correct zero level on value axis, min and max less than zero - margins can not go below zero', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 30
        },
        range: {
            min: -100,
            max: 0
        },
        ticks: [-90, -10],
        expectedRange: {
            minVisible: -106,
            maxVisible: 0
        }
    });
});

QUnit.test('T170398. Correct zero level on value axis, min and max more than zero - margins can not go above zero', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: -110,
            max: -10
        },
        ticks: [-110, -10],
        expectedRange: {
            min: -120,
            max: 0,
            minVisible: -120,
            maxVisible: 0
        }
    });
});

QUnit.test('T170398. Do not correct zero level on argument axis', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.2,
            maxValueMargin: 0.1
        },
        range: {
            min: 10,
            max: 110
        },
        ticks: [10, 110],
        expectedRange: {
            min: -10,
            max: 120,
            minVisible: -10,
            maxVisible: 120
        },
        isArgumentAxis: true
    });
});

QUnit.test('Correct zero level with endOnTick', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            endOnTick: true
        },
        range: {
            min: 0,
            max: 51
        },
        marginOptions: {
            size: 30
        },
        ticks: [-10, 60],
        expectedRange: {
            minVisible: 0,
            maxVisible: 60
        },
        isArgumentAxis: false
    });
});

QUnit.test('Correct zero level with endOnTick, all data in negative area', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            endOnTick: true
        },
        range: {
            min: -51,
            max: 0
        },
        marginOptions: {
            size: 30
        },
        ticks: [-60, 10],
        expectedRange: {
            minVisible: -60,
            maxVisible: 0
        },
        isArgumentAxis: false
    });
});

QUnit.test('Do not calculate any margin for discrete axis', function(assert) {
    this.testMargins(assert, {
        options: {
            type: 'discrete',
            dataType: 'string',
            valueMarginsEnabled: true,
            minValueMargin: 0.2,
            maxValueMargin: 0.1
        },
        range: {
            categories: ['a', 'b', 'c', 'd', 'e']
        },
        ticks: ['a', 'b', 'c', 'd', 'e'],
        expectedRange: {
            categories: ['a', 'b', 'c', 'd', 'e']
        }
    });
});

QUnit.test('Do not calculate any margin for semidiscrete axis', function(assert) {
    this.testMargins(assert, {
        options: {
            type: 'semidiscrete',
            dataType: 'numeric',
            valueMarginsEnabled: true
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 0,
            max: 2,
            interval: 1
        },
        ticks: [0, 1, 2],
        expectedVisibleArea: { min: 200, max: 500 },
        isArgumentAxis: true
    });
});

QUnit.test('Logarithmic axis. Correctly adjust boundary values', function(assert) {
    this.testMargins(assert, {
        options: {
            type: 'logarithmic',
            logarithmBase: 2,
            valueMarginsEnabled: true
        },
        range: {
            min: 1,
            max: 10,
            axisType: 'logarithmic',
            base: 2,
            interval: 0.1
        },
        ticks: [1, 2, 4, 8],
        expectedRange: {
            min: 1,
            max: 10,
            minVisible: 1,
            maxVisible: 10
        },
        isArgumentAxis: true
    });
});

QUnit.test('Logarithmic axis. minValueMargin and maxValueMargin - correctly apply margins', function(assert) {
    this.testMargins(assert, {
        options: {
            type: 'logarithmic',
            logarithmBase: 10,
            valueMarginsEnabled: true,
            minValueMargin: 0.25,
            maxValueMargin: 0.5
        },
        range: {
            min: 10,
            max: 100000,
            axisType: 'logarithmic',
            base: 10
        },
        ticks: [10, 1000, 100000],
        expectedRange: {
            min: 1,
            max: 10000000,
            minVisible: 1,
            maxVisible: 10000000
        }
    });
});

QUnit.test('Logarithmic axis. marginOptions.checkInterval - correctly apply margins', function(assert) {
    this.testMargins(assert, {
        options: {
            type: 'logarithmic',
            logarithmBase: 10,
            valueMarginsEnabled: true,
            axisDivisionFactor: 150
        },
        marginOptions: {
            checkInterval: true
        },
        range: {
            min: 10,
            max: 100000,
            interval: 4,
            axisType: 'logarithmic',
            base: 10
        },
        ticks: [10, 1000, 100000],
        expectedRange: {
            minVisible: 0.1,
            maxVisible: 10000000,
            interval: 4
        },
        isArgumentAxis: true
    });
});

QUnit.test('Logarithmic axis. marginOptions.size - correctly apply margins', function(assert) {
    this.testMargins(assert, {
        options: {
            type: 'logarithmic',
            logarithmBase: 10,
            valueMarginsEnabled: true
        },
        marginOptions: {
            size: 100
        },
        range: {
            min: 10,
            max: 100000,
            axisType: 'logarithmic',
            base: 10
        },
        ticks: [10, 1000, 100000],
        expectedRange: {
            min: 1,
            max: 1000000,
            minVisible: 1,
            maxVisible: 1000000
        },
        isArgumentAxis: true
    });
});

QUnit.test('DateTime axis - calculate margins and provide correct data type', function(assert) {
    this.testMargins(assert, {
        options: {
            dataType: 'datetime',
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.1
        },
        range: {
            min: new Date(1000000),
            max: new Date(2000000),
            dataType: 'datetime'
        },
        ticks: [new Date(1000000), new Date(2000000)],
        expectedRange: {
            minVisible: new Date(900000),
            maxVisible: new Date(2100000)
        }
    });
});

QUnit.test('minValueMargin and maxValueMargin not defined - do not apply margins', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: NaN,
            maxValueMargin: undefined
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [100, 200],
        expectedRange: {
            min: 100,
            max: 200,
            minVisible: 100,
            maxVisible: 200
        }
    });
});

QUnit.test('updateSize - margins and interval are recalculated', function(assert) {
    const axis = this.createAxis(true, {
        valueMarginsEnabled: true
    });

    this.generatedTicks = [100, 200];
    axis.setBusinessRange({
        min: 90,
        max: 210,
        interval: 30
    });
    axis.setMarginOptions({
        checkInterval: true,
        size: 100
    });

    axis.draw(this.canvas);

    axis.updateSize({
        top: 200,
        bottom: 200,
        left: 200,
        right: 200,
        width: 900,
        height: 400
    });

    const translator = translator2DModule.Translator2D.lastCall.returnValue;

    const range = translator.getBusinessRange();

    assert.equal(range.min, 90);
    assert.equal(range.max, 210);
    assert.equal(range.minVisible, 90);
    assert.equal(range.maxVisible, 210);
    assert.equal(range.interval, 30);

    assert.deepEqual(translator.getCanvasVisibleArea(), { min: 250, max: 650 });
});

QUnit.test('updateSize, synchronized axis - do not recalculate margins/interval', function(assert) {
    const axis = this.createAxis(true, {
        valueMarginsEnabled: true
    });

    this.generatedTicks = [100, 200];
    axis.setBusinessRange({
        min: 90,
        max: 210,
        interval: 30
    });
    axis.setMarginOptions({
        checkInterval: true,
        size: 100
    });

    // act
    // emulate synchronizer
    axis.createTicks(this.canvas);
    axis.setTicks({});
    axis.draw();

    const translator = translator2DModule.Translator2D.lastCall.returnValue;
    sinon.spy(translator, 'updateBusinessRange');

    axis.updateSize({
        top: 200,
        bottom: 200,
        left: 200,
        right: 200,
        width: 900,
        height: 400
    });

    // assert
    assert.equal(translator.updateBusinessRange.callCount, 0);
    assert.deepEqual(translator.getCanvasVisibleArea(), { min: 200, max: 700 });
});

QUnit.test('createTicks after synchronization (zoom chart) - recalculate margins/interval. T616166', function(assert) {
    const axis = this.createAxis(true, {
        valueMarginsEnabled: true
    });

    this.generatedTicks = [100, 200];
    axis.setBusinessRange({
        min: 90,
        max: 210,
        interval: 30
    });
    axis.setMarginOptions({
        checkInterval: true,
        size: 100
    });

    // act
    // emulate synchronizer
    axis.createTicks(this.canvas);
    axis.setTicks({});
    axis.draw();

    this.translator.stub('updateBusinessRange').reset();

    axis.createTicks({
        top: 200,
        bottom: 200,
        left: 200,
        right: 200,
        width: 900,
        height: 400
    });

    // assert
    const range = translator2DModule.Translator2D.lastCall.returnValue.getBusinessRange();
    assert.equal(range.min, 90);
    assert.equal(range.minVisible, 90);
    assert.equal(range.max, 210);
    assert.equal(range.maxVisible, 210);
    assert.equal(range.interval, 30);

    assert.deepEqual(translator2DModule.Translator2D.lastCall.returnValue.getCanvasVisibleArea(), { min: 200, max: 700 });
});

QUnit.test('Boundary ticks calculated without margins', function(assert) {
    const axis = this.createAxis(true, {
        valueMarginsEnabled: true,
        showCustomBoundaryTicks: true
    });

    axis.setBusinessRange({
        min: 100,
        max: 200
    });
    axis.setMarginOptions({
        size: 100
    });

    axis.draw(this.canvas);

    assert.deepEqual(axis.getFullTicks(), [100, 200]);
});

QUnit.test('Pass paddings in translator via canvas', function(assert) {
    const axis = this.createAxis(true, {
        valueMarginsEnabled: true,
        showCustomBoundaryTicks: true
    });

    const translator = translator2DModule.Translator2D.lastCall.returnValue;
    sinon.spy(translator, 'updateCanvas');

    axis.setBusinessRange({
        min: 100,
        max: 200
    });
    axis.setMarginOptions({
        size: 100
    });

    axis.draw(this.canvas);

    assert.deepEqual(translator.updateCanvas.lastCall.args[0], $.extend({}, this.canvas, {
        startPadding: 50,
        endPadding: 50
    }));
});

QUnit.test('Margins and skipViewportExtending = true - do not extend range with margins to boundary ticks', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2,
            skipViewportExtending: true,
            endOnTick: true // emulation, see returned ticks below
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [80, 240],
        expectedRange: {
            min: 90,
            max: 220,
            minVisible: 90,
            maxVisible: 220
        }
    });
});

QUnit.test('Do not apply tick margin if endOnTick false', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2,
            endOnTick: false
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [80, 240],
        expectedRange: {
            minVisible: 90,
            maxVisible: 220
        }
    });
});

QUnit.test('Apply correct margins on redraw without canvas', function(assert) {
    this.generatedTicks = [80, 220];
    const axis = this.createAxis(true, {
        valueMarginsEnabled: true
    });

    axis.setBusinessRange({
        min: 100,
        max: 200
    });
    axis.updateCanvas(this.canvas);

    axis.draw(this.canvas);

    axis.draw();

    assert.equal(axis.getTranslator().getCanvasVisibleArea().max.toFixed(2), '457.14');
    assert.equal(axis.getTranslator().getCanvasVisibleArea().min.toFixed(2), '242.86');
});

QUnit.module('Data margins calculations after zooming', dataMarginsEnvironment);

QUnit.test('Argument axis - Apply margins on zoomed range', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [130, 170],
        zoom: [120, 180],
        expectedRange: {
            minVisible: 114,
            maxVisible: 192
        },
        isArgumentAxis: true
    });
});

QUnit.test('max zoom is not defined - apply margins when only min is defined in visual range ', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [130, 170],
        zoom: [120, undefined],
        expectedRange: {
            minVisible: 112,
            maxVisible: 216
        },
        isArgumentAxis: true
    });
});

QUnit.test('min zoom is not defined - apply margins when only max is defined in visual range', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200
        },
        ticks: [130, 170],
        zoom: [undefined, 180],
        expectedRange: {
            minVisible: 92,
            maxVisible: 196
        },
        isArgumentAxis: true
    });
});

QUnit.test('Argument axis - calculate correct interval by zoom data', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200,
            interval: 10
        },
        ticks: [150, 160],
        zoom: [150, 180],
        expectedRange: {
            minVisible: 147,
            maxVisible: 186,
            interval: 10
        },
        isArgumentAxis: true
    });
});

QUnit.test('Argument axis, endOnTick = true - do not extend range to boundary ticks if zoom action', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.2
        },
        range: {
            min: 100,
            max: 200,
            interval: 10
        },
        ticks: [150, 160],
        zoom: {
            startValue: 150,
            endValue: 180
        },
        expectedRange: {
            minVisible: 147,
            maxVisible: 186,
            interval: 10
        },
        isArgumentAxis: true
    });
});


QUnit.test('Do not correct zero level if min < 0', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.3,
            maxValueMargin: 0.1
        },
        range: {
            min: -100,
            max: 200
        },
        zoom: {
            startValue: 20,
            endValue: 120
        },
        expectedRange: {
            minVisible: -10,
            maxVisible: 130
        }
    });
});

QUnit.test('Do not correct zero level if max > 0', function(assert) {
    this.testMargins(assert, {
        options: {
            valueMarginsEnabled: true,
            minValueMargin: 0.1,
            maxValueMargin: 0.3
        },
        range: {
            min: -200,
            max: 200
        },
        zoom: {
            startValue: -120,
            endValue: -20
        },
        expectedRange: {
            minVisible: -130,
            maxVisible: 10
        }
    });
});

QUnit.module('Set business range', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        sinon.spy(translator2DModule, 'Translator2D');

        this.axis = new Axis({
            renderer: this.renderer,
            axisType: 'xyAxes',
            drawingType: 'linear',
            isArgumentAxis: true,
            eventTrigger: () => { },
            getTemplate() {}
        });

        this.updateOptions({});
        this.translator = translator2DModule.Translator2D.lastCall.returnValue;
        sinon.stub(this.translator, 'updateBusinessRange');
    },
    afterEach: function() {
        environment.afterEach.call(this);
        translator2DModule.Translator2D.restore();
    },
    updateOptions: environment.updateOptions
});

QUnit.test('Range from options', function(assert) {
    this.updateOptions({ visualRange: [0, 15] });
    this.axis.validate();

    this.axis.setBusinessRange({});

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 15);
    assert.equal(businessRange.minVisible, 0);
    assert.equal(businessRange.maxVisible, 15);
});

QUnit.test('Set range without minVisible and maxVisible', function(assert) {
    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 10);
    assert.equal(businessRange.minVisible, 0);
    assert.equal(businessRange.maxVisible, 10);
});

QUnit.test('Set range with minVisible and maxVisible', function(assert) {
    this.axis.setBusinessRange({
        min: 0,
        max: 10,
        minVisible: 2,
        maxVisible: 5
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 10);
    assert.equal(businessRange.minVisible, 2);
    assert.equal(businessRange.maxVisible, 5);
});

QUnit.test('Merge viewport and visualRange (visualRange is full)', function(assert) {
    this.updateOptions({ min: -100, max: 100, visualRange: [-40, 60] });
    this.axis.validate();

    this.axis.setBusinessRange({
        minVisible: 2,
        maxVisible: 5
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.minVisible, -40);
    assert.equal(businessRange.maxVisible, 60);
});

QUnit.test('Merge viewport and visualRange (visualRange has no min)', function(assert) {
    this.updateOptions({ min: -100, max: 100, visualRange: [null, 60] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 2,
        max: 5
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.minVisible, 2);
    assert.equal(businessRange.maxVisible, 60);
});

QUnit.test('Merge viewport and visualRange (visualRange has no max)', function(assert) {
    this.updateOptions({ min: -100, max: 100, visualRange: [-40, null] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 0,
        max: 300
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.minVisible, -40);
    assert.equal(businessRange.maxVisible, 300);
});

QUnit.test('Merge viewport and visualRange (visualRange is empty) - min/max are inored because visual range is set', function(assert) {
    this.updateOptions({ min: -100, max: 100, visualRange: [null, null] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 2,
        max: 5
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.minVisible, 2);
    assert.equal(businessRange.maxVisible, 5);
});

QUnit.test('Set wholeRange and visualRange', function(assert) {
    this.updateOptions({ wholeRange: [-100, 100], visualRange: [-40, 60] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 0,
        max: 10,
        minVisible: 2,
        maxVisible: 5
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, -100);
    assert.equal(businessRange.max, 100);
    assert.equal(businessRange.minVisible, -40);
    assert.equal(businessRange.maxVisible, 60);
});

QUnit.test('Set visualRange and visualRangeLength (numeric, visualRange[1] === null)', function(assert) {
    this.updateOptions({ visualRange: { startValue: 10, length: 10 } });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 0,
        max: 100
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.minVisible, 10);
    assert.equal(businessRange.maxVisible, 20);
});

QUnit.test('Set visualRange and visualRangeLength (numeric, visualRange[0] === null)', function(assert) {
    this.updateOptions({ visualRange: { endValue: 40, length: 10 } });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 0,
        max: 100
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.minVisible, 30);
    assert.equal(businessRange.maxVisible, 40);
});

QUnit.test('Set visualRange and visualRangeLength (numeric) - length should be ignored', function(assert) {
    this.updateOptions({ visualRange: { startValue: 10, endValue: 40, length: 10 } });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 0,
        max: 100
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.minVisible, 10);
    assert.equal(businessRange.maxVisible, 40);
});

QUnit.test('Set visualRange, visualRangeLength and wholeRange (numeric)', function(assert) {
    this.updateOptions({ visualRange: [10, null], wholeRange: [null, 30], visualRangeLength: 40 });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 0,
        max: 100
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.minVisible, 10);
    assert.equal(businessRange.maxVisible, 30);
});

QUnit.test('Set visualRangeLength (numeric)', function(assert) {
    this.updateOptions({ visualRange: { length: 10 } });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 0,
        max: 100
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.minVisible, 90);
    assert.equal(businessRange.maxVisible, 100);
});

QUnit.test('Set visualRangeLength (numeric) out of bounds', function(assert) {
    this.updateOptions({ wholeRange: [50, undefined], visualRange: { startValue: 0, length: 10 } });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 20,
        max: 100
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.minVisible, 50);
    assert.equal(businessRange.maxVisible, 60);
});

QUnit.test('Set visualRange and visualRangeLength (datetime, visualRange.endValue === null)', function(assert) {
    this.updateOptions({
        argumentType: 'datetime',
        visualRange: { startValue: new Date(2010, 0, 1), endValue: null, length: { years: 7 } }
    });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: new Date(2000, 0, 1),
        max: new Date(2020, 0, 1),
        minVisible: new Date(2005, 0, 1),
        maxVisible: new Date(2015, 0, 1)
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.minVisible, new Date(2010, 0, 1));
    assert.deepEqual(businessRange.maxVisible, new Date(2016, 11, 30));
});

QUnit.test('Set visualRange and visualRangeLength (datetime, visualRange.startValue === null)', function(assert) {
    this.updateOptions({
        argumentType: 'datetime',
        visualRange: {
            startValue: null, endValue: new Date(2010, 0, 1), length: { years: 7 }
        }
    });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: new Date(2000, 0, 1),
        max: new Date(2020, 0, 1),
        minVisible: new Date(2005, 0, 1),
        maxVisible: new Date(2015, 0, 1)
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.minVisible, new Date(2003, 0, 3));
    assert.deepEqual(businessRange.maxVisible, new Date(2010, 0, 1));
});

QUnit.test('Set visualRange and visualRangeLength (datetime)', function(assert) {
    this.updateOptions({ argumentType: 'datetime', visualRange: [new Date(2001, 0, 1), new Date(2010, 0, 1)], visualRangeLength: { years: 7 } });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: new Date(2000, 0, 1),
        max: new Date(2020, 0, 1),
        minVisible: new Date(2005, 0, 1),
        maxVisible: new Date(2015, 0, 1)
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.minVisible, new Date(2001, 0, 1));
    assert.deepEqual(businessRange.maxVisible, new Date(2010, 0, 1));
});

QUnit.test('Set visualRange, visualRangeLength and wholeRange (datetime)', function(assert) {
    this.updateOptions({ argumentType: 'datetime', visualRange: [new Date(2001, 0, 1), null], wholeRange: [null, new Date(2010, 0, 1)], visualRangeLength: { years: 11 } });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: new Date(2000, 0, 1),
        max: new Date(2020, 0, 1),
        minVisible: new Date(2005, 0, 1),
        maxVisible: new Date(2015, 0, 1)
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.minVisible, new Date(2001, 0, 1));
    assert.deepEqual(businessRange.maxVisible, new Date(2010, 0, 1));
});

QUnit.test('Set visualRangeLength (datetime)', function(assert) {
    this.updateOptions({
        argumentType: 'datetime',
        visualRange: { length: 1000 * 60 * 60 * 24 }
    });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: new Date(2020, 0, 1),
        max: new Date(2020, 0, 5)
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.minVisible, new Date(2020, 0, 4));
    assert.deepEqual(businessRange.maxVisible, new Date(2020, 0, 5));
});

QUnit.test('Set visualRangeLength (logarithmic)', function(assert) {
    this.updateOptions({ logarithmBase: 10, type: 'logarithmic', visualRange: { length: 2 } });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 1,
        max: 1000,
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.roughEqual(businessRange.minVisible, 10, 0.1);
    assert.equal(businessRange.maxVisible, 1000);
});

QUnit.test('Set visualRangeLength. Discrete', function(assert) {
    this.updateOptions({
        type: 'discrete',
        visualRange: { length: 2 }
    });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: [1, 2, 3, 4]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.minVisible, 3);
    assert.deepEqual(businessRange.maxVisible, 4);
});

QUnit.test('Set visualRangeLength. Discrete. visual range min is defened', function(assert) {
    this.updateOptions({
        type: 'discrete',
        visualRange: { startValue: new Date(2), length: 2 }
    });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: [new Date(1), new Date(2), new Date(3), new Date(4)]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.minVisible, new Date(2));
    assert.deepEqual(businessRange.maxVisible, new Date(3));
});

QUnit.test('Set visualRangeLength. Discrete. visual range max is defened. Datetime', function(assert) {
    this.updateOptions({
        type: 'discrete',
        visualRange: { endValue: new Date(3), length: 2 }
    });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: [new Date(1), new Date(2), new Date(3), new Date(4)]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.minVisible, new Date(2));
    assert.deepEqual(businessRange.maxVisible, new Date(3));
});

QUnit.test('Set visualRangeLength. Discrete. visual range max is defened. visual range length is great number', function(assert) {
    this.updateOptions({
        type: 'discrete',
        visualRange: { endValue: 3, length: 10 }
    });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: [1, 2, 3, 4]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.minVisible, undefined);
    assert.deepEqual(businessRange.maxVisible, 3);
});

QUnit.test('visualRange can go out from series data range', function(assert) {
    this.updateOptions({ visualRange: [-200, 150] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.minVisible, -200);
    assert.equal(businessRange.maxVisible, 150);
});

QUnit.test('visualRange can\'t go out from whole range (numeric)', function(assert) {
    this.updateOptions({ wholeRange: [-100, 100], visualRange: [-200, 150] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 0,
        max: 10,
        minVisible: 2,
        maxVisible: 5
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, -100);
    assert.equal(businessRange.max, 100);
    assert.equal(businessRange.minVisible, -100);
    assert.equal(businessRange.maxVisible, 100);
});

QUnit.test('visualRange can\'t go out from whole range (visualRange.endValue < wholeRange.startValue)', function(assert) {
    this.updateOptions({ wholeRange: [-100, 100], visualRange: [-200, -150] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, -100);
    assert.equal(businessRange.max, 100);
    assert.equal(businessRange.minVisible, -100);
    assert.equal(businessRange.maxVisible, 10);
});

QUnit.test('visualRange can\'t go out from whole range (visualRange.endValue < wholeRange.startValue and businessRange.max > wholeRange.endValue)', function(assert) {
    this.updateOptions({ wholeRange: [-100, 100], visualRange: [-200, -150] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 0,
        max: 150
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, -100);
    assert.equal(businessRange.max, 100);
    assert.equal(businessRange.minVisible, -100);
    assert.equal(businessRange.maxVisible, 100);
});

QUnit.test('visualRange can\'t go out from whole range (visualRange.startValue > wholeRange.endValue and wholeRange.startValue === null)', function(assert) {
    this.updateOptions({ wholeRange: [null, 100], visualRange: [150, 200] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: 10,
        max: 50
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 10);
    assert.equal(businessRange.max, 100);
    assert.equal(businessRange.minVisible, 10);
    assert.equal(businessRange.maxVisible, 100);
});

QUnit.test('visualRange can\'t go out from whole range (datetime)', function(assert) {
    this.updateOptions({ argumentType: 'datetime', wholeRange: [new Date(2008, 0, 1), null], visualRange: [new Date(2007, 0, 1), new Date(2019, 0, 1)] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: new Date(2000, 0, 1),
        max: new Date(2020, 0, 1),
        minVisible: new Date(2002, 0, 1),
        maxVisible: new Date(2018, 0, 1)
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.min, new Date(2008, 0, 1));
    assert.deepEqual(businessRange.max, new Date(2020, 0, 1));
    assert.deepEqual(businessRange.minVisible, new Date(2008, 0, 1));
    assert.deepEqual(businessRange.maxVisible, new Date(2019, 0, 1));
});

QUnit.test('visualRange can\'t go out from whole range (discrete)', function(assert) {
    this.updateOptions({ type: 'discrete', wholeRange: ['H', 'C'], visualRange: ['B', null] });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, ['C', 'D', 'E', 'F', 'G', 'H']);
});

QUnit.test('Whole range length greater then data range', function(assert) {
    this.updateOptions({ wholeRange: [-100, 100] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: -10,
        max: 10
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, -100);
    assert.equal(businessRange.max, 100);
    assert.equal(businessRange.minVisible, -10);
    assert.equal(businessRange.maxVisible, 10);
});

QUnit.test('Set inverted whole range', function(assert) {
    this.updateOptions({ wholeRange: [100, -100] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: -200,
        max: 200
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, -100);
    assert.equal(businessRange.max, 100);
    assert.equal(businessRange.minVisible, -100);
    assert.equal(businessRange.maxVisible, 100);
});

QUnit.test('Set inverted visual range', function(assert) {
    this.updateOptions({ visualRange: [100, -100] });
    this.axis.validate();

    this.axis.setBusinessRange({
        minVisible: -200,
        maxVisible: 200
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, -200);
    assert.equal(businessRange.max, 200);
    assert.equal(businessRange.minVisible, -100);
    assert.equal(businessRange.maxVisible, 100);
});

QUnit.test('Add categories to range', function(assert) {
    this.updateOptions({ type: 'discrete', categories: ['A', 'B', 'C'] });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: ['A', 'B']
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, ['A', 'B', 'C']);
});

// T474125
QUnit.test('Sort datetime categories', function(assert) {
    this.updateOptions({ type: 'discrete', argumentType: 'datetime' });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: [new Date(2017, 6, 2), new Date(2017, 2, 2), new Date(2017, 1, 2), new Date(2017, 8, 2)]
    }, [new Date(2017, 1, 2), new Date(2017, 2, 2), new Date(2017, 6, 2), new Date(2017, 8, 2)]);

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, [new Date(2017, 1, 2), new Date(2017, 2, 2), new Date(2017, 6, 2), new Date(2017, 8, 2)]);
});

// T810801
QUnit.test('Argument axis categories sorting. Categories option - sort validated categories', function(assert) {
    this.updateOptions({ type: 'discrete', valueType: 'numeric' });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: [2, 3, 0, 5, 1]
    }, false, undefined, [1, 2, 3, 4]);

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, [1, 2, 3, 4, 0, 5]);
});

// T822702
QUnit.test('Argument axis categories sorting. Categories option - sort validated categories. DateTime', function(assert) {
    const categoriesFromDataSource = [
        new Date(2016, 9, 4),
        new Date(2016, 9, 5),
        new Date(2016, 9, 6),
        new Date(2016, 9, 7),
        new Date(2016, 9, 3)
    ];
    const rightCategoriesOrder = [
        new Date(2016, 9, 3),
        new Date(2016, 9, 4),
        new Date(2016, 9, 5),
        new Date(2016, 9, 6),
        new Date(2016, 9, 7)
    ];

    this.updateOptions({ type: 'discrete', valueType: 'datetime' });
    this.axis.validate();

    this.axis.setBusinessRange({ categories: categoriesFromDataSource }, false, undefined, rightCategoriesOrder);

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, rightCategoriesOrder);
});

QUnit.test('Set logarithm base for logarithmic axis', function(assert) {
    this.updateOptions({ type: 'logarithmic', logarithmBase: 2 });
    this.axis.validate();
    this.axis.setBusinessRange({});

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.base, 2);
    assert.equal(businessRange.axisType, 'logarithmic');
});

QUnit.test('Viewport and whole range can\'t have negative values if logarithmic axis and allowNegatives is set to false', function(assert) {
    this.updateOptions({ min: -10, max: -100, wholeRange: [-10, -100], type: 'logarithmic', allowNegatives: false });
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 10,
        max: 1000
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 10);
    assert.equal(businessRange.max, 1000);
    assert.equal(businessRange.minVisible, 10);
    assert.equal(businessRange.maxVisible, 1000);
    assert.equal(businessRange.axisType, 'logarithmic');
});

QUnit.test('Viewport and whole range can have negative values if logarithmic axis and allowNegatives is set to true', function(assert) {
    this.updateOptions({ visualRange: [-10, -100], wholeRange: [-10, -100], type: 'logarithmic', allowNegatives: true });
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 10,
        max: 1000
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, -100);
    assert.equal(businessRange.max, -10);
    assert.equal(businessRange.minVisible, -100);
    assert.equal(businessRange.maxVisible, -10);
    assert.equal(businessRange.axisType, 'logarithmic');
});

QUnit.test('Viewport and whole range can have negative values if logarithmic axis and allowNegatives is not set', function(assert) {
    this.updateOptions({ visualRange: [-10, -100], wholeRange: [-10, -100], type: 'logarithmic' });
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 10,
        max: 1000
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, -100);
    assert.equal(businessRange.max, -10);
    assert.equal(businessRange.minVisible, -100);
    assert.equal(businessRange.maxVisible, -10);
    assert.equal(businessRange.axisType, 'logarithmic');
    assert.equal(businessRange.allowNegatives, true);
});

QUnit.test('One values of whole range can have null value', function(assert) {
    this.updateOptions({ wholeRange: [null, -10] });
    this.axis.validate();

    this.axis.setBusinessRange({
        min: -100,
        max: 1000
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, -100);
    assert.equal(businessRange.max, -10);
    assert.equal(businessRange.minVisible, -100);
    assert.equal(businessRange.maxVisible, -10);
});

QUnit.test('Set inverted', function(assert) {
    this.updateOptions({ inverted: true });
    this.axis.validate();
    this.axis.setBusinessRange({});

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.strictEqual(businessRange.invert, true);
});

QUnit.test('Set min > max', function(assert) {
    this.updateOptions({ visualRange: [10, 0] });
    this.axis.validate();
    this.axis.setBusinessRange({});

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 10);
    assert.equal(businessRange.minVisible, 0);
    assert.equal(businessRange.maxVisible, 10);
});

QUnit.test('Set min/max for discrete axis', function(assert) {
    this.updateOptions({ type: 'discrete', visualRange: ['D', 'E'], synchronizedValue: 0 });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: ['A', 'B', 'C', 'D', 'E', 'F']
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, ['A', 'B', 'C', 'D', 'E', 'F']);
    assert.equal(businessRange.minVisible, 'D');
    assert.equal(businessRange.maxVisible, 'E');
});

QUnit.test('Do not set wholeRange out of categories', function(assert) {
    this.updateOptions({ type: 'discrete', wholeRange: ['L', 'Y'], visualRange: ['B', 'E'] });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: ['A', 'B', 'C', 'D', 'E', 'F']
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.minVisible, 'B');
    assert.equal(businessRange.maxVisible, 'E');
});

QUnit.test('Create ticks with empty range. Range is still empty', function(assert) {
    this.updateOptions({
        argumentType: 'datetime',
        valueMarginsEnabled: true,
        minValueMargin: 0.01,
        maxValueMargin: 0.01
    });
    this.axis.validate();

    this.axis.setBusinessRange({ });

    this.axis.createTicks(this.canvas);

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.isEmpty(), true);
});


QUnit.test('Pass linearThreshold to translator range', function(assert) {
    this.updateOptions({
        type: 'logarithmic'
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        linearThreshold: 1
    });
    assert.deepEqual(this.translator.updateBusinessRange.lastCall.args[0].linearThreshold, 1);
});

QUnit.test('Get minLog value from options', function(assert) {
    this.updateOptions({
        type: 'logarithmic',
        linearThreshold: 2
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        linearThreshold: 1
    });
    assert.deepEqual(this.translator.updateBusinessRange.lastCall.args[0].linearThreshold, 2);
});

QUnit.test('take linearThreshold on addRange', function(assert) {
    this.updateOptions({
        type: 'logarithmic'
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        linearThreshold: 1
    });

    const resultRange = this.translator.updateBusinessRange.lastCall.args[0].addRange({ linearThreshold: -2 });
    assert.deepEqual(resultRange.linearThreshold, -2);
});

QUnit.test('Logarithmic axis. Pass allowNegatives options to range. false value', function(assert) {
    this.updateOptions({
        allowNegatives: false,
        type: 'logarithmic'
    });

    this.axis.validate();
    this.axis.setBusinessRange({});

    assert.ok(!this.translator.updateBusinessRange.lastCall.args[0].allowNegatives);
});

QUnit.test('Logarithmic axis. Pass allowNegatives options to range. true value', function(assert) {
    this.updateOptions({
        allowNegatives: true,
        type: 'logarithmic'
    });

    this.axis.validate();
    this.axis.setBusinessRange({});

    assert.ok(this.translator.updateBusinessRange.lastCall.args[0].allowNegatives);
});

QUnit.test('Logarithmic axis. allowNegatives if option is not set and min<=0', function(assert) {
    this.updateOptions({
        type: 'logarithmic'
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        min: 0,
        max: 100
    });

    assert.ok(this.translator.updateBusinessRange.lastCall.args[0].allowNegatives);
});

QUnit.test('Logarithmic axis. Do not allowNegatives if option is not set and min > 0', function(assert) {
    this.updateOptions({
        type: 'logarithmic'
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        min: 1,
        max: 100
    });

    assert.ok(!this.translator.updateBusinessRange.lastCall.args[0].allowNegatives);
});

QUnit.module('Set business range. Value axis', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        sinon.spy(translator2DModule, 'Translator2D');

        this.axis = new Axis({
            renderer: this.renderer,
            axisType: 'xyAxes',
            drawingType: 'linear',
            isArgumentAxis: false,
            eventTrigger: () => { },
            getTemplate() {}
        });

        this.updateOptions({});
        this.translator = translator2DModule.Translator2D.lastCall.returnValue;
        sinon.stub(this.translator, 'updateBusinessRange');
    },
    afterEach: function() {
        environment.afterEach.call(this);
        translator2DModule.Translator2D.restore();
    },
    updateOptions: environment.updateOptions
});

QUnit.test('Value axis categories sorting. Numeric - sort by default in ascending order', function(assert) {
    this.updateOptions({ type: 'discrete', valueType: 'numeric' });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: [2, 4, 3, 1]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, [1, 2, 3, 4]);
});

QUnit.test('Value axis categories sorting. Datetime - sort by default in ascending order', function(assert) {
    this.updateOptions({ type: 'discrete', valueType: 'datetime' });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: [new Date(2018, 1, 2), new Date(2018, 1, 4), new Date(2018, 1, 3), new Date(2018, 1, 1)]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, [new Date(2018, 1, 1), new Date(2018, 1, 2), new Date(2018, 1, 3), new Date(2018, 1, 4)]);
});

QUnit.test('Value axis categories sorting. String - do not sort by default', function(assert) {
    this.updateOptions({ type: 'discrete', valueType: 'string' });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: ['2', '4', '3', '1']
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, ['2', '4', '3', '1']);
});

QUnit.test('Value axis categories sorting. Categories option - sort by option', function(assert) {
    this.updateOptions({ type: 'discrete', valueType: 'numeric', categories: [4, 3, 2, 1, 0] });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: [2, 3, 5, 1]
    }, undefined, [1, 2, 3, 4, 0]);

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, [4, 3, 2, 1, 0, 5]);
});

QUnit.test('Value axis categories sorting. categoriesSortingMethod = false, numeric - do not sort', function(assert) {
    this.updateOptions({
        type: 'discrete',
        valueType: 'numeric',
        categoriesSortingMethod: false
    });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: [2, 4, 3, 1]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, [2, 4, 3, 1]);
});

QUnit.test('Value axis categories sorting. categoriesSortingMethod = true, string - do not sort', function(assert) {
    this.updateOptions({ type: 'discrete', valueType: 'string', categoriesSortingMethod: true });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: ['2', '4', '3', '1']
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, ['2', '4', '3', '1']);
});

QUnit.test('Value axis categories sorting. categoriesSortingMethod = callback, string - sort using callback', function(assert) {
    this.updateOptions({
        type: 'discrete',
        valueType: 'string',
        categoriesSortingMethod: function(a, b) { return +b - +a; }
    });
    this.axis.validate();

    this.axis.setBusinessRange({
        categories: ['2', '4', '3', '1']
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.deepEqual(businessRange.categories, ['4', '3', '2', '1']);
});

QUnit.test('Add synchronized value', function(assert) {
    this.updateOptions({ synchronizedValue: 0 });
    this.axis.validate();
    this.axis.setBusinessRange({});

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 0);
});

QUnit.test('Correct zero level if showZero is true', function(assert) {
    this.updateOptions({ showZero: true });
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];
    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 120);
});

QUnit.test('Value axis ignores visual range on update option', function(assert) {
    this.updateOptions({
        visualRangeUpdateMode: 'reset'
    });
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    this.axis.visualRange(115, 118);
    this.axis.createTicks(this.canvas);

    this.axis.setBusinessRange({
        min: 0,
        max: 300
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 300);
    assert.equal(businessRange.minVisible, 115);
    assert.equal(businessRange.maxVisible, 118);
});

QUnit.module('Visual range on update. Argument axis', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        sinon.spy(translator2DModule, 'Translator2D');

        this.axis = new Axis({
            renderer: this.renderer,
            axisType: 'xyAxes',
            drawingType: 'linear',
            isArgumentAxis: true,
            eventTrigger: () => { },
            getTemplate() {}
        });

        this.canvas = {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            width: 100,
            height: 100
        };

        this.axis.updateCanvas(this.canvas);

        this.updateOptions({});
        this.translator = translator2DModule.Translator2D.lastCall.returnValue;
        sinon.spy(this.translator, 'updateBusinessRange');
    },
    afterEach: function() {
        environment.afterEach.call(this);
        translator2DModule.Translator2D.restore();
    },
    updateOptions: environment.updateOptions
});

QUnit.test('Reset', function(assert) {
    this.updateOptions({ visualRangeUpdateMode: 'reset' });
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    this.axis.setBusinessRange({
        min: -100,
        max: 100
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.equal(businessRange.min, -100);
    assert.equal(businessRange.max, 100);
    assert.equal(businessRange.minVisible, -100);
    assert.equal(businessRange.maxVisible, 100);
});

QUnit.test('Keep', function(assert) {
    this.updateOptions({ visualRangeUpdateMode: 'keep', visualRange: [10, 40] });
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    this.axis.setBusinessRange({
        min: 200,
        max: 300
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.equal(businessRange.minVisible, 10);
    assert.equal(businessRange.maxVisible, 40);
});

QUnit.test('Shift', function(assert) {
    this.updateOptions({ visualRangeUpdateMode: 'shift', visualRange: { length: 10 } });
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 200
    });

    this.axis.setBusinessRange({
        min: 200,
        max: 300
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.equal(businessRange.min, 200);
    assert.equal(businessRange.max, 300);
    assert.equal(businessRange.minVisible, 290);
    assert.equal(businessRange.maxVisible, 300);
});

QUnit.test('Shift. Datetime axis', function(assert) {
    this.updateOptions({
        visualRangeUpdateMode: 'shift',
        visualRange: {
            length: {
                minutes: 15
            }
        },
        argumentType: 'datetime'
    });
    this.axis.validate();
    this.axis.setBusinessRange({
        min: new Date(2018, 7, 15, 10, 0),
        max: new Date(2018, 7, 15, 10, 45)
    });

    this.axis.setBusinessRange({
        min: new Date(2018, 7, 15, 10, 0),
        max: new Date(2018, 7, 15, 12, 0)
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.deepEqual(businessRange.min, new Date(2018, 7, 15, 10, 0));
    assert.deepEqual(businessRange.max, new Date(2018, 7, 15, 12, 0));
    assert.deepEqual(businessRange.minVisible, new Date(2018, 7, 15, 11, 45));
    assert.deepEqual(businessRange.maxVisible, new Date(2018, 7, 15, 12, 0));
});

QUnit.test('Shift. logarithmic axis', function(assert) {
    this.updateOptions({
        visualRangeUpdateMode: 'shift',
        visualRange: { length: 2 },
        logarithmBase: 10,
        type: 'logarithmic'
    });
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 1,
        max: 1000
    });

    this.axis.setBusinessRange({
        min: 1,
        max: 100000
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.deepEqual(businessRange.min, 1);
    assert.deepEqual(businessRange.max, 100000);
    assert.deepEqual(businessRange.minVisible, 1000);
    assert.deepEqual(businessRange.maxVisible, 100000);
});

QUnit.test('Shift. Discrete', function(assert) {
    this.updateOptions({
        type: 'discrete',
        visualRangeUpdateMode: 'shift'
    });
    this.axis.validate();
    this.axis.setBusinessRange({
        categories: ['a', 'b', 'c', 'd']
    });

    this.axis.visualRange('b', 'c');
    this.axis.createTicks(this.canvas);

    this.axis.setBusinessRange({
        categories: [1, 2, 3, 4, 5]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.deepEqual(businessRange.categories, [1, 2, 3, 4, 5]);
    assert.equal(businessRange.minVisible, 4);
    assert.equal(businessRange.maxVisible, 5);
});

QUnit.test('Shift. Discrete datetime', function(assert) {
    this.updateOptions({
        type: 'discrete',
        visualRangeUpdateMode: 'shift'
    });
    this.axis.validate();
    this.axis.setBusinessRange({
        categories: [new Date(0), new Date(1), new Date(2), new Date(3)]
    });

    this.axis.visualRange(new Date(1), new Date(2));
    this.axis.createTicks(this.canvas);

    this.axis.setBusinessRange({
        categories: [1, 2, 3, 4, 5]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.deepEqual(businessRange.categories, [1, 2, 3, 4, 5]);
    assert.equal(businessRange.minVisible, 4);
    assert.equal(businessRange.maxVisible, 5);
});

QUnit.test('Auto mode. visualRange is equal wholeRange - reset', function(assert) {
    this.updateOptions({});
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    this.axis.setBusinessRange({
        min: -100,
        max: 100
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.equal(businessRange.min, -100);
    assert.equal(businessRange.max, 100);
    assert.equal(businessRange.minVisible, -100);
    assert.equal(businessRange.maxVisible, 100);
});

QUnit.test('Auto mode. visualRange is not equal wholeRange - keep', function(assert) {
    this.updateOptions({
        visualRangeUpdateMode: 'auto'
    });
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    this.axis.visualRange(115, 118);
    this.axis.createTicks(this.canvas);

    this.axis.setBusinessRange({
        min: 0,
        max: 300
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 300);
    assert.equal(businessRange.minVisible, 115);
    assert.equal(businessRange.maxVisible, 118);
});

QUnit.test('Auto. visualRange shows the end of data - shift', function(assert) {
    this.updateOptions({
        visualRange: [115, 120]
    });
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 300
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.equal(businessRange.min, 0);
    assert.equal(businessRange.max, 300);
    assert.equal(businessRange.minVisible, 295);
    assert.equal(businessRange.maxVisible, 300);
});

QUnit.test('Auto. Discrete axis - keep if old categories are part of new categories', function(assert) {
    this.updateOptions({
        type: 'discrete'
    });
    this.axis.validate();
    this.axis.setBusinessRange({
        categories: [1, 2, 3, 4]
    });

    this.axis.visualRange(2, 3);
    this.axis.createTicks(this.canvas);

    this.axis.setBusinessRange({
        categories: [1, 2, 3, 4, 5]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.deepEqual(businessRange.categories, [1, 2, 3, 4, 5]);
    assert.equal(businessRange.minVisible, 2);
    assert.equal(businessRange.maxVisible, 3);
});

QUnit.test('Auto. Discrete axis - reset if old categories are not part of new categories', function(assert) {
    this.updateOptions({
        type: 'discrete'
    });
    this.axis.validate();
    this.axis.setBusinessRange({
        categories: [1, 2, 3, 4]
    });

    this.axis.visualRange(2, 3);
    this.axis.createTicks(this.canvas);

    this.axis.setBusinessRange({
        categories: [1, 2, 4, 5]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.deepEqual(businessRange.categories, [1, 2, 4, 5]);
    assert.equal(businessRange.minVisible, undefined);
    assert.equal(businessRange.maxVisible, undefined);
});

QUnit.test('Auto. Discrete axis - keep if categories aren\'t changed', function(assert) {
    this.updateOptions({
        type: 'discrete'
    });
    this.axis.validate();
    this.axis.setBusinessRange({
        categories: [new Date(1), new Date(2), new Date(3), new Date(4)]
    });

    this.axis.visualRange(new Date(2), new Date(3));
    this.axis.createTicks(this.canvas);

    this.axis.setBusinessRange({
        categories: [new Date(1), new Date(2), new Date(3), new Date(4)]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.deepEqual(businessRange.categories, [new Date(1), new Date(2), new Date(3), new Date(4)]);
    assert.deepEqual(businessRange.minVisible, new Date(2));
    assert.deepEqual(businessRange.maxVisible, new Date(3));
});

QUnit.test('Auto. Discrete axis - reset if categories aren\'t changed and visualRange consist of all categories', function(assert) {
    this.updateOptions({
        type: 'discrete'
    });
    this.axis.validate();
    this.axis.setBusinessRange({
        categories: [new Date(1), new Date(2), new Date(3), new Date(4)]
    });

    this.axis.createTicks(this.canvas);

    this.axis.setBusinessRange({
        categories: [new Date(1), new Date(2), new Date(3), new Date(4)]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.deepEqual(businessRange.categories, [new Date(1), new Date(2), new Date(3), new Date(4)]);
    assert.equal(this.axis._lastVisualRangeUpdateMode, 'reset');
});

QUnit.test('Auto. Discrete axis - reset if visualRange consist of all old categories', function(assert) {
    this.updateOptions({
        type: 'discrete'
    });
    this.axis.validate();
    this.axis.setBusinessRange({
        categories: [new Date(1), new Date(2), new Date(3), new Date(4)]
    });

    this.axis.visualRange(new Date(1), new Date(4));
    this.axis.createTicks(this.canvas);

    this.axis.setBusinessRange({
        categories: [new Date(1), new Date(2), new Date(3), new Date(4), new Date(5)]
    });

    const businessRange = this.translator.updateBusinessRange.lastCall.args[0];

    assert.deepEqual(businessRange.categories, [new Date(1), new Date(2), new Date(3), new Date(4), new Date(5)]);
    assert.deepEqual(businessRange.minVisible, undefined);
    assert.deepEqual(businessRange.maxVisible, undefined);
    assert.equal(this.axis._lastVisualRangeUpdateMode, 'reset');
});

QUnit.module('Get scroll bounds', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        sinon.spy(translator2DModule, 'Translator2D');

        this.axis = new Axis({
            renderer: this.renderer,
            axisType: 'xyAxes',
            drawingType: 'linear',
            isArgumentAxis: true,
            eventTrigger: () => { },
            getTemplate() {}
        });

        this.updateOptions({});
        this.translator = translator2DModule.Translator2D.lastCall.returnValue;
    },
    afterEach: function() {
        environment.afterEach.call(this);
        translator2DModule.Translator2D.restore();
    },
    updateOptions: environment.updateOptions
});

QUnit.test('whole range is not set - get from data', function(assert) {
    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    assert.deepEqual(this.axis.getZoomBounds(), { startValue: 100, endValue: 120 });
});

QUnit.test('whole range is set - get from option', function(assert) {
    this.updateOptions({
        wholeRange: [10, 50]
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    assert.deepEqual(this.axis.getZoomBounds(), { startValue: 10, endValue: 50 });
});


QUnit.test('whole range values are set to null - get from option', function(assert) {
    this.updateOptions({
        wholeRange: [null, null]
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    assert.deepEqual(this.axis.getZoomBounds(), { startValue: undefined, endValue: undefined });
});

QUnit.test('getZoomBounds when initRange is set, and wholeRange is not set', function(assert) {
    this.translator.getBusinessRange = sinon.stub();
    this.translator.getBusinessRange.returns({ min: 5, max: 7 });

    this.axis.setInitRange();

    assert.deepEqual(this.axis.getZoomBounds(), { startValue: 5, endValue: 7 });
});

QUnit.test('getZoomBounds when initRange is set, and wholeRange is set', function(assert) {
    this.updateOptions({
        wholeRange: { startValue: 1, endValue: 2 }
    });
    this.translator.getBusinessRange = sinon.stub();
    this.translator.getBusinessRange.returns({ min: 5, max: 7 });

    this.axis.validate();
    this.axis.setInitRange();

    assert.deepEqual(this.axis.getZoomBounds(), { startValue: 1, endValue: 2 });
});

QUnit.module('dataVisualRangeIsReduced method', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        sinon.spy(translator2DModule, 'Translator2D');

        this.axis = new Axis({
            renderer: this.renderer,
            axisType: 'xyAxes',
            drawingType: 'linear',
            isArgumentAxis: true,
            eventTrigger: () => { },
            getTemplate() {}
        });

        this.updateOptions({});
        this.axis.updateCanvas({
            left: 0,
            right: 0,
            width: 100
        });
        this.translator = translator2DModule.Translator2D.lastCall.returnValue;
    },
    afterEach: function() {
        environment.afterEach.call(this);
        translator2DModule.Translator2D.restore();
    },
    updateOptions: environment.updateOptions
});

QUnit.test('No visualRange, wholeRange - false', function(assert) {
    this.updateOptions({
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    assert.deepEqual(this.axis.dataVisualRangeIsReduced(), false);
});

QUnit.test('visualRange is equal to dataRange - false', function(assert) {
    this.updateOptions({
        visualRange: [100, 120]
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    assert.deepEqual(this.axis.dataVisualRangeIsReduced(), false);
});

QUnit.test('visualRange is less then dataRange - true', function(assert) {
    this.updateOptions({
        visualRange: [101, 119]
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    assert.deepEqual(this.axis.dataVisualRangeIsReduced(), true);
});

QUnit.test('startValue in data range - true', function(assert) {
    this.updateOptions({
        visualRange: [101, 120]
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    assert.deepEqual(this.axis.dataVisualRangeIsReduced(), true);
});

QUnit.test('wholeRange less then data range - true', function(assert) {
    this.updateOptions({
        wholeRange: [100, 119]
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        min: 100,
        max: 120
    });

    assert.deepEqual(this.axis.dataVisualRangeIsReduced(), true);
});

QUnit.test('discrete data, visualRange and whole range are not set - false', function(assert) {
    this.updateOptions({
        type: 'discrete'
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        categories: ['a', 'b', 'c']
    });

    assert.deepEqual(this.axis.dataVisualRangeIsReduced(), false);
});

QUnit.test('discrete data, visualRange is set - true', function(assert) {
    this.updateOptions({
        type: 'discrete',
        visualRange: ['a', 'b']
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        categories: ['a', 'b', 'c']
    });

    assert.deepEqual(this.axis.dataVisualRangeIsReduced(), true);
});

QUnit.test('discrete data, visualRange includes only last point - true', function(assert) {
    this.updateOptions({
        type: 'discrete',
        visualRange: ['c', 'c']
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        categories: ['a', 'b', 'c']
    });

    assert.deepEqual(this.axis.dataVisualRangeIsReduced(), true);
});

QUnit.test('discrete data, one point - false', function(assert) {
    this.updateOptions({
        type: 'discrete'
    });

    this.axis.validate();
    this.axis.setBusinessRange({
        categories: ['a']
    });

    assert.deepEqual(this.axis.dataVisualRangeIsReduced(), false);
});
