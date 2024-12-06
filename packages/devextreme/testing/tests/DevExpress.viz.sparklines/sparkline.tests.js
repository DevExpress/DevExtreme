/* global currentTest, createTestContainer */

const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const tooltipModule = require('viz/core/tooltip');
const BaseWidget = require('__internal/viz/core/m_base_widget').default;
const rendererModule = require('viz/core/renderers/renderer');
const dataValidatorModule = require('viz/components/data_validator');
const translator2DModule = require('viz/translators/translator2d');
const seriesModule = require('viz/series/base_series');
const DataSource = require('common/data/data_source/data_source').DataSource;

require('viz/sparkline');

$('<div>')
    .attr('id', 'container')
    .css({ width: 250, height: 30 })
    .appendTo('#qunit-fixture');

QUnit.begin(function() {
    const FakeTranslator = vizMocks.stubClass({
        getCanvasVisibleArea: function() { return {}; },
        update: sinon.spy()
    });
    const StubSeries = vizMocks.Series;
    const StubTooltip = vizMocks.Tooltip;

    rendererModule.Renderer = sinon.spy(function() {
        return currentTest().renderer;
    });

    translator2DModule.Translator2D = sinon.spy(function() {
        return new FakeTranslator();
    });

    seriesModule.Series = sinon.spy(function() {
        return currentTest().series;
    });

    tooltipModule.DEBUG_set_tooltip(sinon.spy(function() {
        return currentTest().tooltip;
    }));

    QUnit.testStart(function() {
        translator2DModule.Translator2D.resetHistory();
        rendererModule.Renderer.resetHistory();
        seriesModule.Series.resetHistory();
    });

    const environment = {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();

            this.$container = $(createTestContainer('#container'));
            this.renderer = new vizMocks.Renderer();
            this.translator = new FakeTranslator();
            this.series = new StubSeries();
            this.tooltip = new StubTooltip();

            this.series.stub('getPoints').returns([{
                argument: 1,
                value: 2,
                correctCoordinates: sinon.stub()
            }]);
        },
        afterEach: function() {
            this.$container.remove();
            this.clock.restore();
        },
        createSparkline: function(options, container, rangeData) {
            container = container || this.$container;

            this.series.type = options.type;
            this.series.stub('getRangeData').returns(rangeData || { arg: {}, val: {} });
            this.series.stub('getArgumentField').returns(options.argumentField || 'arg');
            this.series.stub('getValueFields').returns([options.valueField || 'val']);
            this.series.stub('getOptions').returns({});

            return container.dxSparkline(options).dxSparkline('instance');
        },
        forceTimeout: function() {
            this.clock.tick(0);
        },
        getSeriesOptions: function() {
            return this.series.updateOptions.lastCall.args[0];
        }
    };

    function getEnvironmentWithStubValidateData() {
        return $.extend({}, environment, {
            beforeEach: function() {
                environment.beforeEach.apply(this, arguments);
                this.validateData = sinon.stub(dataValidatorModule, 'validateData').callsFake(function() {
                    return {
                        arg: [{
                            argument: 1,
                            value: 3
                        }]
                    };
                });
            },
            afterEach: function() {
                environment.afterEach.apply(this, arguments);
                this.validateData.restore();
            },
            getData: function() {
                return this.validateData.lastCall.args[0];
            }
        });
    }

    QUnit.module('Canvas', environment);

    QUnit.test('Create canvas when size option is defined', function(assert) {
        this.createSparkline({
            dataSource: [1],
            pointSize: 0,
            size: {
                width: 250,
                height: 30
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 0, bottom: 0, left: 0, right: 0 }, 'Canvas object is correct');
        assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 0, bottom: 0, left: 0, right: 0 }, 'Canvas object is correct');
        assert.equal(this.renderer.resize.callCount, 1);
        assert.deepEqual(this.renderer.resize.firstCall.args, [250, 30], 'Pass canvas width and height to renderer');
    });

    QUnit.test('Create canvas when margin option is defined', function(assert) {
        this.createSparkline({
            dataSource: [1],
            size: {
                width: 250,
                height: 30
            },
            margin: {
                top: 1,
                bottom: 2,
                left: 3,
                right: 4
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 5, bottom: 6, left: 7, right: 8 }, 'Canvas object is correct');
        assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 5, bottom: 6, left: 7, right: 8 }, 'Canvas object is correct');
        assert.equal(this.renderer.resize.callCount, 1);
        assert.deepEqual(this.renderer.resize.firstCall.args, [250, 30], 'Pass canvas width and height to renderer');
    });

    QUnit.test('Create canvas when container size is defined', function(assert) {
        this.createSparkline({
            dataSource: [1],
            pointSize: 0
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 0, bottom: 0, left: 0, right: 0 }, 'Canvas object is correct');
        assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 0, bottom: 0, left: 0, right: 0 }, 'Canvas object is correct');
        assert.equal(this.renderer.resize.callCount, 1);
        assert.deepEqual(this.renderer.resize.firstCall.args, [250, 30], 'Pass canvas width and height to renderer');
    });

    // T607927 start
    QUnit.test('Create canvas with big point size - canvas should have margins for point size', function(assert) {
        this.createSparkline({
            dataSource: [1],
            pointSize: 21,
            showFirstLast: true,
            showMinMax: true
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 13, bottom: 13, left: 13, right: 13 }, 'Canvas object is correct');
        assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 13, bottom: 13, left: 13, right: 13 }, 'Canvas object is correct');
    });

    QUnit.test('Create canvas with big point size and type is bar - canvas should not change default margins', function(assert) {
        this.createSparkline({
            dataSource: [1],
            pointSize: 22,
            type: 'bar'
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 0, bottom: 0, left: 0, right: 0 }, 'Canvas object is correct');
        assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 0, bottom: 0, left: 0, right: 0 }, 'Canvas object is correct');
    });

    QUnit.test('Create canvas with big point size and type is winloss - canvas should not change default margins', function(assert) {
        this.createSparkline({
            dataSource: [1],
            pointSize: 22,
            type: 'winloss'
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 0, bottom: 0, left: 0, right: 0 }, 'Canvas object is correct');
        assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 0, bottom: 0, left: 0, right: 0 }, 'Canvas object is correct');
    });

    QUnit.test('Create canvas with big point size, showFirstLast and showMinMax are false - canvas shouldn\'t have margins for point size', function(assert) {
        this.createSparkline({
            dataSource: [1],
            pointSize: 21,
            showFirstLast: false,
            showMinMax: false
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 0, bottom: 0, left: 0, right: 0 }, 'Canvas object is correct');
        assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 0, bottom: 0, left: 0, right: 0 }, 'Canvas object is correct');
    });

    QUnit.test('Create canvas with big point size, showFirstLast is false, showMinMax is true - canvas should have margins for point size', function(assert) {
        this.createSparkline({
            dataSource: [1],
            pointSize: 21,
            showFirstLast: false,
            showMinMax: true
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 13, bottom: 13, left: 13, right: 13 }, 'Canvas object is correct');
        assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 13, bottom: 13, left: 13, right: 13 }, 'Canvas object is correct');
    });

    QUnit.test('Create canvas with big point size, showMinMax is false, showFirstLast is true  - canvas should have margins for point size', function(assert) {
        this.createSparkline({
            dataSource: [1],
            pointSize: 21,
            showFirstLast: true,
            showMinMax: false
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 13, bottom: 13, left: 13, right: 13 }, 'Canvas object is correct');
        assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 13, bottom: 13, left: 13, right: 13 }, 'Canvas object is correct');
    });
    // T607927 end

    QUnit.test('Create canvas with big point size and update theme - canvas shouldn\'t decrease', function(assert) {
        const sparkline = this.createSparkline({
            dataSource: [1],
            pointSize: 21,
            showFirstLast: true,
            showMinMax: true
        });

        sparkline.option({ theme: 'myTheme' });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 13, bottom: 13, left: 13, right: 13 }, 'Canvas object is correct');
        assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 13, bottom: 13, left: 13, right: 13 }, 'Canvas object is correct');
    });

    // T124801
    QUnit.test('Create canvas when container size is not defined', function(assert) {
        const container = $('<div>').css('width', '100px').appendTo(this.$container);

        this.createSparkline({ dataSource: [1], pointSize: 0 }, container);

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 100, height: 30, top: 0, bottom: 0, left: 0, right: 0 }, 'Canvas object is correct');
        assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 100, height: 30, top: 0, bottom: 0, left: 0, right: 0 }, 'Canvas object is correct');
        assert.equal(this.renderer.resize.callCount, 1);
        assert.deepEqual(this.renderer.resize.firstCall.args, [100, 30], 'Pass canvas width and height to renderer');
    });

    QUnit.module('Range', environment);

    QUnit.test('Create range when datasource has one point. Line', function(assert) {
        this.createSparkline({ dataSource: ['1'] }, null, { arg: {}, val: { min: 4, max: 4 } });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 1, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, 4, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 4, 'MaxY is correct');
    });

    QUnit.test('Create range when datasource has one point. Area/bar', function(assert) {
        this.createSparkline({ type: 'area', dataSource: ['1'] }, null, { arg: {}, val: { min: 0, max: 4 } });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 1, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, 0, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 4.6, 'MaxY is correct');
    });

    QUnit.test('Create range when datasource has one point. Winloss', function(assert) {
        this.createSparkline({ type: 'winloss', dataSource: ['1'] }, null, { arg: {}, val: { min: 0, max: 1 } });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 1, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, 0, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 1.15, 'MaxY is correct');
    });

    QUnit.test('Create range when all points are positive. Line', function(assert) {
        this.createSparkline({ dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'] }, null, {
            arg: {},
            val: {
                min: 1,
                max: 9
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 23, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min.toPrecision(2), -0.20, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 10.2, 'MaxY is correct');
    });

    QUnit.test('Create range when all points are positive. Bar/area', function(assert) {
        this.createSparkline({ type: 'bar', dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'] }, null, {
            arg: {},
            val: {
                min: 0,
                max: 9
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 23, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, 0, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 10.35, 'MaxY is correct');
    });

    QUnit.test('Create range when all points are positive. Winloss', function(assert) {
        this.createSparkline({ type: 'winloss', dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'] }, null, {
            arg: {},
            val: {
                min: 0,
                max: 1
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 23, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, 0, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 1.15, 'MaxY is correct');
    });

    QUnit.test('Create range when all points are negative. Line', function(assert) {
        this.createSparkline({ dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', ] }, null, {
            arg: {},
            val: {
                min: -9,
                max: -2
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 18, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -10.05, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, -0.95, 'MaxY is correct');
    });

    QUnit.test('Create range when all points are negative. Bar/area', function(assert) {
        this.createSparkline({ type: 'bar', dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'] }, null, {
            arg: {},
            val: {
                min: -9,
                max: 0
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 18, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -10.35, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 0, 'MaxY is correct');
    });

    QUnit.test('Create range when all points are negative. Winloss', function(assert) {
        this.createSparkline({ type: 'winloss', dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'] }, null, {
            arg: {},
            val: {
                min: -1,
                max: 0
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 18, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -1.15, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 0, 'MaxY is correct');
    });

    QUnit.test('Create range when datasource is continuous. Bar', function(assert) {
        this.createSparkline({ type: 'bar', dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] }, null, {
            arg: {
                categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            },
            val: {
                min: -4,
                max: 18
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 13, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -7.3, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 21.3, 'MaxY is correct');
    });

    QUnit.test('Create range when datasource is continuous. Winloss', function(assert) {
        this.createSparkline({ type: 'winloss', dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] }, null, {
            arg: {},
            val: {
                min: -1,
                max: 1
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 13, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -1.3, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 1.3, 'MaxY is correct');
    });

    QUnit.test('Create range when there are minY and maxY options. part 1', function(assert) {
        this.createSparkline({ minValue: -5, maxValue: 5, dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] }, null, {
            arg: {},
            val: {
                min: -10,
                max: 10
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 13, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -13, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 13, 'MaxY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].minVisible, -5);
        assert.equal(valTranslator.update.lastCall.args[0].maxVisible, 5);
    });

    QUnit.test('Create range when there are minY and maxY options. part 2', function(assert) {
        this.createSparkline({ minValue: -15, maxValue: 15, dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] }, null, {
            arg: {},
            val: {
                min: -10,
                max: 10
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 13, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -13, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 13, 'MaxY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].minVisible, -15);
        assert.equal(valTranslator.update.lastCall.args[0].maxVisible, 15);
    });

    QUnit.test('Create range when there are minY and maxY null options', function(assert) {
        this.createSparkline({ minValue: null, maxValue: null, dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] }, null, {
            arg: {},
            val: {
                min: -10,
                max: 10
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 13, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -13, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 13, 'MaxY is correct');
        assert.strictEqual(valTranslator.update.lastCall.args[0].minVisible, undefined);
        assert.strictEqual(valTranslator.update.lastCall.args[0].maxVisible, undefined);
    });

    QUnit.test('Create range when there are minY and maxY incorrect options. part 1', function(assert) {
        this.createSparkline({ minValue: 'a', maxValue: 'b', dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] }, null, {
            arg: {},
            val: {
                min: -10,
                max: 10
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 13, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -13, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 13, 'MaxY is correct');
        assert.strictEqual(valTranslator.update.lastCall.args[0].minVisible, undefined);
        assert.strictEqual(valTranslator.update.lastCall.args[0].maxVisible, undefined);
    });

    QUnit.test('Create range when there are minY and maxY incorrect options. part 2', function(assert) {
        this.createSparkline({ minValue: 5, maxValue: 'b', dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] }, null, {
            arg: {},
            val: {
                min: -10,
                max: 10
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 13, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -13, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 13, 'MaxY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].minVisible, 5);
        assert.strictEqual(valTranslator.update.lastCall.args[0].maxVisible, undefined);
    });

    QUnit.test('Create range when there are minY and maxY. min > max', function(assert) {
        this.createSparkline({ minValue: 2, maxValue: -1, dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] }, null, {
            arg: {},
            val: {
                min: -10,
                max: 10
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 13, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -13, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 13, 'MaxY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].minVisible, -1);
        assert.equal(valTranslator.update.lastCall.args[0].maxVisible, 2);
    });

    QUnit.test('Create range when there are minY and maxY. min = max', function(assert) {
        this.createSparkline({ minValue: 5, maxValue: 5, dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] }, null, {
            arg: {},
            val: {
                min: -10,
                max: 10
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 13, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -13, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 13, 'MaxY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].minVisible, 5);
        assert.equal(valTranslator.update.lastCall.args[0].maxVisible, 5);
    });

    QUnit.test('Create range when there are minY and maxY options for winloss. part 1', function(assert) {
        this.createSparkline({ type: 'winloss', minValue: -0.6, maxValue: 0.2, dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] }, null, {
            arg: {},
            val: {
                min: -1,
                max: 1
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 13, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -1.3, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 1.3, 'MaxY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].minVisible, -0.6);
        assert.equal(valTranslator.update.lastCall.args[0].maxVisible, 0.2);
    });

    QUnit.test('Create range when there are minY and maxY options for winloss. part 2', function(assert) {
        this.createSparkline({ minValue: -5, maxValue: 20, type: 'winloss', dataSource: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'] }, null, {
            arg: {},
            val: {
                min: -1,
                max: 1
            }
        });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.equal(argTranslator.update.lastCall.args[0].categories.length, 13, 'Range categoriesX length is correct');
        assert.equal(valTranslator.update.lastCall.args[0].min, -1.3, 'MinY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].max, 1.3, 'MaxY is correct');
        assert.equal(valTranslator.update.lastCall.args[0].minVisible, -1);
        assert.equal(valTranslator.update.lastCall.args[0].maxVisible, 1);
    });

    QUnit.module('Prepare series options', environment);

    QUnit.test('Prepare series options when type is incorrect (unknown)', function(assert) {
        this.createSparkline({ type: 'abc' });

        const options = this.getSeriesOptions();
        assert.equal(options.type, 'line', 'Series type should be correct');
    });

    QUnit.test('Prepare series options when type is incorrect (not applicable)', function(assert) {
        this.createSparkline({ dataSource: [3], type: 'pie' });

        const options = this.getSeriesOptions();
        assert.equal(options.type, 'line', 'Series type should be correct');
    });

    QUnit.test('Prepare series options when type is incorrect (camel case)', function(assert) {
        this.createSparkline({ dataSource: [3], type: 'stepLine' });

        const options = this.getSeriesOptions();
        assert.equal(options.type, 'stepline', 'Series type should be correct');
    });

    QUnit.test('Prepare series options when type is incorrect (number)', function(assert) {
        this.createSparkline({ dataSource: [3], type: 111 });

        const options = this.getSeriesOptions();
        assert.equal(options.type, 'line', 'Series type should be correct');
    });

    QUnit.test('Prepare series options when type is incorrect (null)', function(assert) {
        this.createSparkline({ dataSource: [3], type: null });

        const options = this.getSeriesOptions();
        assert.equal(options.type, 'line', 'Series type should be correct');
    });

    QUnit.test('Prepare series options when type is incorrect (NaN)', function(assert) {
        this.createSparkline({ dataSource: [3], type: NaN });

        const options = this.getSeriesOptions();
        assert.equal(options.type, 'line', 'Series type should be correct');
    });

    QUnit.test('Prepare series options. Creation', function(assert) {
        this.createSparkline({
            dataSource: [1]
        });

        const options = this.getSeriesOptions();
        assert.ok(options, 'Series options should be created');

        assert.ok(!options.extremumPoints, 'Extremum points options should be deleted from series options');
        assert.ok(!options.size, 'Size options should be deleted from series options');
        assert.ok(!options.dataSource, 'Datasource option should be deleted from series options');
        assert.ok(!options.winloss, 'Winloss options should be deleted from series options');

        assert.ok(options.point, 'Point options should be in series options');
        assert.ok(options.border, 'Border options should be in series options');
    });

    QUnit.test('Prepare series options. Winloss', function(assert) {
        this.createSparkline({ type: 'winloss' });

        const options = this.getSeriesOptions();

        assert.ok(options, 'Series options should be created');
        assert.equal(options.type, 'bar', 'Series type should be bar');
        assert.equal(options.border.visible, false, 'Series border should not be visible');
    });

    QUnit.test('Prepare series options. Bar', function(assert) {
        this.createSparkline({ type: 'bar' });

        const options = this.getSeriesOptions();

        assert.ok(options, 'Series options should be created');
        assert.equal(options.type, 'bar', 'Series type should be bar');
        assert.equal(options.border.visible, false, 'Series border should not be visible');
    });

    QUnit.test('Prepare series options. Not winloss', function(assert) {
        this.createSparkline({ type: 'area' });

        const options = this.getSeriesOptions();
        assert.ok(options, 'Series options should be created');
        assert.equal(options.type, 'area', 'Series type should be line');
    });

    QUnit.test('Prepare series options. Check options', function(assert) {
        this.createSparkline({});

        const options = this.getSeriesOptions();

        assert.ok(options, 'Series options should be created');

        assert.equal(options.color, '#666666', 'Series color should be correct');
        assert.equal(options.width, 2, 'Series width should be correct');
        assert.equal(options.argumentField, 'arg', 'Series argument field should be correct');
        assert.equal(options.valueField, 'val', 'Series value field should be correct');
        assert.equal(options.type, 'line', 'Series type should be correct');

        assert.equal(options.point.visible, false, 'Series points should not be correct');
        assert.equal(options.point.symbol, 'circle', 'Series point symbol should be correct');
        assert.equal(options.point.size, 4, 'Series point size should be correct');

        assert.equal(options.border.color, '#666666', 'Series border color should be like series color');
        assert.equal(options.border.width, 2, 'Series border width should be like series width');
        assert.equal(options.border.visible, true, 'Series border should be visible');
    });

    QUnit.test('Get bar width when there are two points', function(assert) {
        this.series.getPoints.returns([
            { argument: 1, value: 2, correctCoordinates: sinon.spy() },
            { argument: 2, value: 3, correctCoordinates: sinon.spy() }
        ]);

        this.createSparkline({
            dataSource: [{ arg: 1, val: 1 }],
            type: 'bar'
        });

        const point = this.series.getPoints()[0];

        assert.equal(point.correctCoordinates.firstCall.args[0].width, 50, 'Bar width should not be more than 50');
    });

    QUnit.test('Get bar width when there are ten points', function(assert) {
        const points = [];
        for(let i = 0; i < 10; i++) {
            points.push({ correctCoordinates: sinon.spy() });
        }
        this.series.getPoints.returns(points);
        this.createSparkline({
            dataSource: [{ arg: 1, val: 1 }],
            type: 'bar',
            size: {
                width: 200
            },
            margin: {
                left: 20,
                right: 30
            }
        });

        const point = this.series.getPoints()[0];
        assert.equal(point.correctCoordinates.firstCall.args[0].width, 11, 'Bar width should be correct');
    });

    QUnit.test('Get bar width when there are 150 points', function(assert) {
        const points = [];
        for(let i = 0; i < 150; i++) {
            points.push({ correctCoordinates: sinon.spy() });
        }
        this.series.getPoints.returns(points);
        this.createSparkline({
            dataSource: [{ arg: 1, val: 1 }],
            type: 'bar',
            size: {
                width: 200
            },
            margin: {
                left: 20,
                right: 30
            }
        });

        const point = this.series.getPoints()[0];
        assert.equal(point.correctCoordinates.firstCall.args[0].width, 1, 'Bar width should not be less than 1');
    });

    QUnit.module('Prepare datasource', getEnvironmentWithStubValidateData());

    QUnit.test('Prepare datasource when it is array of object with continuous arguments', function(assert) {
        this.createSparkline({
            dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }]
        });

        const data = this.getData();

        assert.equal(data.length, 2, 'Data source should have two items');
        assert.equal(data[0].arg, 1, 'First data source item should be correct');
        assert.equal(data[0].val, 1, 'First data source item should be correct');
        assert.equal(data[1].arg, 2, 'Second data source item should be correct');
        assert.equal(data[1].val, 2, 'Second data source item should be correct');
    });

    QUnit.test('Prepare datasource when one data is undefined. Argument', function(assert) {
        this.createSparkline({
            valueField: 'count',
            dataSource: [{ arg: 1, count: 10 }, { arg: undefined, count: 3 }]
        });

        const data = this.getData();

        assert.equal(data.length, 1, 'Data source should have one item');
        assert.equal(data[0].arg, 1, 'First data source item should be correct');
        assert.equal(data[0].count, 10, 'First data source item should be correct');
    });

    QUnit.test('Prepare datasource when one data is undefined. Value', function(assert) {
        this.createSparkline({
            valueField: 'count',
            dataSource: [{ arg: 1, count: 10 }, { arg: undefined, count: undefined }]
        });

        const data = this.getData();
        assert.equal(data.length, 1, 'Data source should have one item');
        assert.equal(data[0].arg, 1, 'First data source item should be correct');
        assert.equal(data[0].count, 10, 'First data source item should be correct');
    });

    QUnit.test('Prepare datasource when one data is undefined. Both', function(assert) {
        this.createSparkline({
            valueField: 'count',
            dataSource: [{ arg: 1, count: 10 }, { arg: undefined, count: undefined }]
        });

        const data = this.getData();
        assert.equal(data.length, 1, 'Data source should have one item');
        assert.equal(data[0].arg, 1, 'First data source item should be correct');
        assert.equal(data[0].count, 10, 'First data source item should be correct');
    });

    QUnit.test('Prepare datasource when one data is undefined. Array of numbers', function(assert) {
        this.createSparkline({
            dataSource: [5, 4, undefined, 6]
        });

        const data = this.getData();
        assert.equal(data.length, 3, 'Data source should have one item');
        assert.equal(data[0].arg, '0', 'First data source item should be correct');
        assert.equal(data[0].val, 5, 'First data source item should be correct');
        assert.equal(data[1].arg, '1', 'Second data source item should be correct');
        assert.equal(data[1].val, 4, 'Second data source item should be correct');
        assert.equal(data[2].arg, '3', 'Third data source item should be correct');
        assert.equal(data[2].val, 6, 'Third data source item should be correct');
    });

    QUnit.test('Prepare datasource - B251275', function(assert) {
        this.createSparkline({
            valueField: 'count',
            dataSource: [{ arg: 1, count: 10 }, { arg: 2, count: 5 }, { arg1: 3, val: 4 }]
        });

        const data = this.getData();
        assert.equal(data.length, 2, 'Data source should have two items');
        assert.equal(data[0].arg, 1, 'First data source item should be correct');
        assert.equal(data[0].count, 10, 'First data source item should be correct');
        assert.equal(data[1].arg, 2, 'Second data source item should be correct');
        assert.equal(data[1].count, 5, 'Second data source item should be correct');
    });

    QUnit.test('Prepare datasource when it is array of object with discrete arguments', function(assert) {
        this.createSparkline({
            dataSource: [{ arg: '1', val: 1 }, { arg: '2', val: 2 }]
        });

        const data = this.getData();
        assert.equal(data.length, 2, 'Data source should have two items');
        assert.equal(data[0].arg, '1', 'First data source item should be correct');
        assert.equal(data[0].val, 1, 'First data source item should be correct');
        assert.equal(data[1].arg, '2', 'Second data source item should be correct');
        assert.equal(data[1].val, 2, 'Second data source item should be correct');
    });

    QUnit.test('Prepare datasource when it is array of numbers and argument and value field are not defined', function(assert) {
        this.createSparkline({
            dataSource: [1, 2]
        });

        const data = this.getData();

        assert.equal(data.length, 2, 'Data source should have two items');
        assert.equal(data[0].arg, '0', 'First data source item should be correct');
        assert.equal(data[0].val, 1, 'First data source item should be correct');
        assert.equal(data[1].arg, '1', 'Second data source item should be correct');
        assert.equal(data[1].val, 2, 'Second data source item should be correct');
    });

    QUnit.test('Prepare datasource when it is array of numbers and argument and value field are defined', function(assert) {
        this.createSparkline({
            argumentField: 'arg',
            valueField: 'count',
            dataSource: [1, 2]
        });

        const data = this.getData();

        assert.equal(data.length, 2, 'Data source should have two items');
        assert.equal(data[0].arg, '0', 'First data source item should be correct');
        assert.equal(data[0].count, 1, 'First data source item should be correct');
        assert.equal(data[1].arg, '1', 'Second data source item should be correct');
        assert.equal(data[1].count, 2, 'Second data source item should be correct');
    });

    QUnit.test('Prepare winloss datasource', function(assert) {
        this.createSparkline({
            dataSource: [10, 2, 0, -1],
            type: 'winloss'
        });

        const data = this.getData();
        assert.equal(data.length, 4, 'Data source should have two items');
        assert.equal(data[0].arg, '0', 'First data source item should be correct');
        assert.equal(data[0].val, 1, 'First data source item should be correct');
        assert.equal(data[1].arg, '1', 'Second data source item should be correct');
        assert.equal(data[1].val, 1, 'Second data source item should be correct');
        assert.equal(data[2].arg, '2', 'Third data source item should be correct');
        assert.equal(data[2].val, 0, 'Third data source item should be correct');
        assert.equal(data[3].arg, '3', 'Fourth data source item should be correct');
        assert.equal(data[3].val, -1, 'Fourth data source item should be correct');
    });

    QUnit.test('null value in dataSource', function(assert) {
        this.createSparkline({
            dataSource: [1, 2, null, 4]
        });

        const data = this.getData();
        assert.strictEqual(data.length, 4, 'size simpleDataSource');
        assert.strictEqual(data[0].val, 1);
        assert.strictEqual(data[1].val, 2);
        assert.strictEqual(data[2].val, null);
        assert.strictEqual(data[3].val, 4);
    });

    QUnit.test('null value in dataSource with ignoreEmptyPoints', function(assert) {
        this.createSparkline({
            ignoreEmptyPoints: true,
            dataSource: [1, 2, null, 4]
        });

        const data = this.getData();
        assert.strictEqual(data.length, 3, 'size simpleDataSource');
        assert.strictEqual(data[0].val, 1);
        assert.strictEqual(data[1].val, 2);
        assert.strictEqual(data[2].val, 4);
    });

    QUnit.test('pass validateData correct argumentAxisType, winloss', function(assert) {
        this.createSparkline({
            dataSource: [1],
            type: 'winloss'
        });

        assert.equal(dataValidatorModule.validateData.firstCall.args[1].argumentOptions.type, 'discrete');
    });

    QUnit.test('pass validateData correct argumentAxisType, bar', function(assert) {
        this.createSparkline({
            dataSource: [1],
            type: 'bar'
        });

        assert.equal(dataValidatorModule.validateData.firstCall.args[1].argumentOptions.type, 'discrete');
    });

    QUnit.test('pass validateData correct argumentAxisType, area', function(assert) {
        this.createSparkline({
            dataSource: [1],
            type: 'area'
        });
        assert.equal(dataValidatorModule.validateData.firstCall.args[1].argumentOptions.type, undefined);
    });

    QUnit.module('Customize points',
        $.extend({
            checkCustomizePoint: function(assert, expectedData) {
                const customizeFunction = this.getSeriesOptions().customizePoint;

                this.series.updateData.lastCall.args[0].forEach(function(dataItem, i) {
                    assert.deepEqual(customizeFunction.call({ index: i, value: dataItem.val }), expectedData[i]);
                });
            },
        }, environment
        ));

    QUnit.test('B239983. Datasource is array with string', function(assert) {
        this.createSparkline({
            dataSource: ['10', '3', '7'],
            showMinMax: true,
            minColor: 'green',
            maxColor: 'red'
        });

        this.checkCustomizePoint(assert, [{ border: { color: 'red' }, visible: true },
            { border: { color: 'green' }, visible: true },
            { border: { color: '#666666' }, visible: true }]);
    });

    QUnit.test('B239983. Datasource is array with object and string', function(assert) {
        this.createSparkline({
            dataSource: [{ arg: '0', val: '10' }, { arg: '1', val: '3' }, { arg: '2', val: '13' }],
            showMinMax: true,
            minColor: 'green',
            maxColor: 'red'
        });

        this.checkCustomizePoint(assert, [{ border: { color: '#666666' }, visible: true },
            { border: { color: 'green' }, visible: true },
            { border: { color: 'red' }, visible: true }]);
    });

    QUnit.test('Get extremum points indexes when datasource is not ordered - B239987', function(assert) {
        this.createSparkline({
            dataSource: [{ arg: 9, val: 10 }, { arg: 5, val: 1 }, { arg: 4, val: 1 }],
            showMinMax: true,
            minColor: 'green',
            maxColor: 'red'
        });

        this.checkCustomizePoint(assert, [{ border: { color: 'green' }, visible: true },
            { border: { color: 'green' }, visible: true },
            { border: { color: 'red' }, visible: true }]);
    });

    QUnit.test('Get extremum points indexes when mode is first last', function(assert) {
        this.createSparkline({
            dataSource: [1, 8, 6, 9, 5]
        });

        this.checkCustomizePoint(assert, [
            { border: { color: '#666666' }, visible: true },
            {},
            {},
            {},
            { border: { color: '#666666' }, visible: true }
        ]);
    });

    QUnit.test('Get extremum points indexes when mode is min max', function(assert) {
        this.createSparkline({
            dataSource: [1, 8, 6, 9, 5],
            showFirstLast: false,
            showMinMax: true
        });

        this.checkCustomizePoint(assert, [
            { border: { color: '#e8c267' }, visible: true },
            {},
            {},
            { border: { color: '#e55253' }, visible: true },
            {}
        ]);
    });

    QUnit.test('Get extremum points indexes when mode is extremum', function(assert) {
        this.createSparkline({
            dataSource: [1, 8, 6, 9, 5],
            showFirstLast: true,
            showMinMax: true
        });

        this.checkCustomizePoint(assert, [
            { border: { color: '#e8c267' }, visible: true },
            {},
            {},
            { border: { color: '#e55253' }, visible: true },
            { border: { color: '#666666' }, visible: true }
        ]);
    });

    QUnit.test('Get extremum points indexes when mode is none', function(assert) {
        this.createSparkline({
            dataSource: [1, 8, 6, 9, 5],
            showFirstLast: false,
            showMinMax: false
        });

        this.checkCustomizePoint(assert, [{}, {}, {}, {}, {}]);
    });

    QUnit.test('Extremum points when mode is firstLast. Default options. Line, spline, stepline, area, splinearea, steparea', function(assert) {
        this.createSparkline({
            dataSource: [4, 9, 8, 6]
        });

        this.checkCustomizePoint(assert, [
            { border: { color: '#666666' }, visible: true },
            {},
            {},
            { border: { color: '#666666' }, visible: true }
        ]);
    });

    QUnit.test('Extremum points when mode is firstLast. Custom options. Line, spline, stepline, area, splinearea, steparea', function(assert) {
        this.createSparkline({
            dataSource: [4, 9, 8, 6],
            firstLastColor: 'blue'
        });

        this.checkCustomizePoint(assert, [
            { border: { color: 'blue' }, visible: true },
            {},
            {},
            { border: { color: 'blue' }, visible: true }
        ]);
    });

    QUnit.test('Extremum points when mode is firstLast. Default options. Bar, winloss', function(assert) {
        this.createSparkline({
            dataSource: [4, 9, -8, 6],
            type: 'bar'
        });

        this.checkCustomizePoint(assert, [
            { color: '#666666' },
            { color: '#a9a9a9' },
            { color: '#d7d7d7' },
            { color: '#666666' }
        ]);
    });

    QUnit.test('Extremum points when mode is firstLast. Custom options. Bar, winloss', function(assert) {
        this.createSparkline({
            dataSource: [4, 9, -8, 6],
            type: 'bar',
            firstLastColor: 'yellow'
        });

        this.checkCustomizePoint(assert, [
            { color: 'yellow' },
            { color: '#a9a9a9' },
            { color: '#d7d7d7' },
            { color: 'yellow' }
        ]);
    });

    QUnit.test('Extremum points when mode is minMax. Line, spline, stepline, area, splinearea, steparea', function(assert) {
        this.createSparkline({
            dataSource: [4, 9, 8, 6],
            showFirstLast: false,
            showMinMax: true
        });

        this.checkCustomizePoint(assert, [
            { border: { color: '#e8c267' }, visible: true },
            { border: { color: '#e55253' }, visible: true },
            {},
            {}
        ]);
    });


    QUnit.test('Extremum points when mode is minMax. Bar, winloss', function(assert) {
        this.createSparkline({
            dataSource: [4, 9, 8, 6],
            type: 'bar',
            showFirstLast: false,
            showMinMax: true
        });

        this.checkCustomizePoint(assert, [
            { color: '#e8c267' },
            { color: '#e55253' },
            { color: '#a9a9a9' },
            { color: '#a9a9a9' }
        ]);
    });

    QUnit.test('Extremum points when mode is extremum. Line, spline, stepline, area, splinearea, steparea. FirstLast and minMax points are different', function(assert) {
        this.createSparkline({
            dataSource: [1, 5, -8, 4, 8, 6],
            showFirstLast: true,
            showMinMax: true
        });

        this.checkCustomizePoint(assert, [
            { border: { color: '#666666' }, visible: true },
            {},
            { border: { color: '#e8c267' }, visible: true },
            {},
            { border: { color: '#e55253' }, visible: true },
            { border: { color: '#666666' }, visible: true }
        ]);
    });

    QUnit.test('Extremum points when mode is extremum. Line, spline, stepline, area, splinearea, steparea. Three points, min or max point is first or last', function(assert) {
        this.createSparkline({
            dataSource: [1, 5, -8, 4, 8, 16],
            showFirstLast: true,
            showMinMax: true
        });

        this.checkCustomizePoint(assert, [
            { border: { color: '#666666' }, visible: true },
            {},
            { border: { color: '#e8c267' }, visible: true },
            {},
            {},
            { border: { color: '#e55253' }, visible: true }
        ]);
    });

    QUnit.test('Extremum points when mode is extremum. Line, spline, stepline, area, splinearea, steparea. Two points, minMax points are firstLast', function(assert) {
        this.createSparkline({
            dataSource: [1, 5, 8, 4, 8, 16],
            showFirstLast: true,
            showMinMax: true
        });

        this.checkCustomizePoint(assert, [
            { border: { color: '#e8c267' }, visible: true },
            {},
            {},
            {},
            {},
            { border: { color: '#e55253' }, visible: true }
        ]);
    });

    QUnit.test('Extremum points when mode is extremum. Line, spline, stepline, area, splinearea, steparea. Two min and max points', function(assert) {
        this.createSparkline({
            dataSource: [1, 5, -8, -8, 16, 16, 14],
            showFirstLast: true,
            showMinMax: true,
            minColor: 'red',
            maxColor: 'green'
        });

        this.checkCustomizePoint(assert, [
            { border: { color: '#666666' }, visible: true },
            {},
            { border: { color: 'red' }, visible: true },
            { border: { color: 'red' }, visible: true },
            { border: { color: 'green' }, visible: true },
            { border: { color: 'green' }, visible: true },
            { border: { color: '#666666' }, visible: true }
        ]);
    });

    QUnit.test('Extremum points when mode is extremum. Bar, winloss. FirstLast and minMax points are different', function(assert) {
        this.createSparkline({
            dataSource: [1, 5, -8, 4, 8, 6],
            type: 'bar',
            showFirstLast: true,
            showMinMax: true,
            firstLastColor: 'yellow'
        });

        this.checkCustomizePoint(assert, [
            { color: 'yellow' },
            { color: '#a9a9a9' },
            { color: '#e8c267' },
            { color: '#a9a9a9' },
            { color: '#e55253' },
            { color: 'yellow' }
        ]);
    });

    QUnit.test('Extremum points when mode is extremum. Bar, winloss. Three points, min or max point is first or last', function(assert) {
        this.createSparkline({
            dataSource: [1, 5, -8, 4, 8, 16],
            type: 'bar',
            showFirstLast: true,
            showMinMax: true,
            firstLastColor: 'yellow'
        });

        this.checkCustomizePoint(assert, [
            { color: 'yellow' },
            { color: '#a9a9a9' },
            { color: '#e8c267' },
            { color: '#a9a9a9' },
            { color: '#a9a9a9' },
            { color: '#e55253' }
        ]);
    });

    QUnit.test('Extremum points when mode is extremum. Bar, winloss. Two points, minMax points are firstLast', function(assert) {
        this.createSparkline({
            dataSource: [1, 5, 8, 4, 8, 16],
            type: 'bar',
            showFirstLast: true,
            showMinMax: true,
            firstLastColor: 'yellow'
        });

        this.checkCustomizePoint(assert, [
            { color: '#e8c267' },
            { color: '#a9a9a9' },
            { color: '#a9a9a9' },
            { color: '#a9a9a9' },
            { color: '#a9a9a9' },
            { color: '#e55253' }
        ]);
    });

    QUnit.test('Extremum points when mode is extremum. Bar. Two min and max points', function(assert) {
        this.createSparkline({
            dataSource: [1, 5, -8, -8, 16, 16, 14],
            type: 'bar',
            showFirstLast: true,
            showMinMax: true,
            firstLastColor: 'yellow'
        });

        this.checkCustomizePoint(assert, [
            { color: 'yellow' },
            { color: '#a9a9a9' },
            { color: '#e8c267' },
            { color: '#e8c267' },
            { color: '#e55253' },
            { color: '#e55253' },
            { color: 'yellow' }
        ]);
    });

    QUnit.test('Extremum points when mode is none. Line, spline, stepline, area, splinearea, steparea', function(assert) {
        this.createSparkline({
            dataSource: [1, 5, -8, -8, 16, 16, 14],
            showFirstLast: false,
            showMinMax: false
        });

        this.checkCustomizePoint(assert, [{}, {}, {}, {}, {}, {}, {}]);
    });

    QUnit.test('Extremum points when mode is none. Bar, winloss', function(assert) {
        this.createSparkline({
            dataSource: [1, 5, -8, 14],
            type: 'bar',
            showFirstLast: false,
            showMinMax: false
        });

        this.checkCustomizePoint(assert, [
            { color: '#a9a9a9' },
            { color: '#a9a9a9' },
            { color: '#d7d7d7' },
            { color: '#a9a9a9' }
        ]);
    });

    QUnit.test('Bar points. Default', function(assert) {
        this.createSparkline({
            type: 'bar',
            dataSource: [0, 3, 6, -8]
        });

        this.checkCustomizePoint(assert, [
            { color: '#666666' },
            { color: '#a9a9a9' },
            { color: '#a9a9a9' },
            { color: '#666666' }
        ]);
    });

    QUnit.test('Bar points. Custom', function(assert) {
        this.createSparkline({
            type: 'bar',
            barPositiveColor: 'yellow',
            barNegativeColor: 'blue',
            firstLastColor: 'pink',
            dataSource: [0, 3, 6, -8]
        });

        this.checkCustomizePoint(assert, [
            { color: 'pink' },
            { color: 'yellow' },
            { color: 'yellow' },
            { color: 'pink' }
        ]);
    });

    QUnit.test('Winloss points. Default', function(assert) {
        this.createSparkline({
            type: 'winloss',
            dataSource: [0, 3, 6, -8]
        });

        this.checkCustomizePoint(assert, [
            { color: '#666666' },
            { color: '#a9a9a9' },
            { color: '#a9a9a9' },
            { color: '#666666' }
        ]);
    });

    QUnit.test('Winloss points. Custom', function(assert) {
        this.createSparkline({
            type: 'winloss',
            winColor: 'yellow',
            lossColor: 'blue',
            firstLastColor: 'pink',
            winlossThreshold: 4,
            dataSource: [0, 3, 6, -8]
        });

        this.checkCustomizePoint(assert, [
            { color: 'pink' },
            { color: 'blue' },
            { color: 'yellow' },
            { color: 'pink' }
        ]);
    });

    QUnit.test('winloss sparkline lossColor should be updated after runtime change (T1218338)', function(assert) {
        const sparkline = this.createSparkline({
            type: 'winloss',
            lossColor: 'blue',
            winlossThreshold: 4,
            dataSource: [0, 3, 6]
        });

        sparkline.option({ lossColor: 'green' });

        this.checkCustomizePoint(assert, [
            { color: '#666666' },
            { color: 'green' },
            { color: '#666666' }
        ]);
    });

    QUnit.test('Several min/max in dataSource', function(assert) {
        this.createSparkline({
            dataSource: [1, 5, 5, -1, -1],
            maxColor: 'red',
            minColor: 'green',
            showMinMax: true
        });

        this.checkCustomizePoint(assert, [
            { visible: true, border: { color: '#666666' } },
            { visible: true, border: { color: 'red' } },
            { visible: true, border: { color: 'red' } },
            { visible: true, border: { color: 'green' } },
            { visible: true, border: { color: 'green' } },
        ]);
    });

    QUnit.test('DataSource contains only equal values', function(assert) {
        this.createSparkline({
            dataSource: [1, 1, 1],
            maxColor: 'red',
            minColor: 'green',
            showMinMax: true
        });

        this.checkCustomizePoint(assert, [
            { visible: true, border: { color: '#666666' } },
            {},
            { visible: true, border: { color: '#666666' } }
        ]);
    });

    QUnit.module('Creating', environment);

    QUnit.test('Tooltip is not created on widget creation', function(assert) {
        const sparkline = this.createSparkline({});

        assert.equal(tooltipModule.Tooltip.callCount, 0);
        assert.ok(!('_tooltip' in sparkline));
        assert.strictEqual(this.renderer.root.attr.callCount, 2);
        assert.deepEqual(this.renderer.root.attr.getCall(0).args, [{ 'pointer-events': 'visible' }]);
        assert.deepEqual(this.renderer.root.attr.getCall(1).args, ['pointer-events']);
    });

    QUnit.test('Create html groups', function(assert) {
        this.createSparkline({
            dataSource: [{ arg: 1, val: 1 }]
        });

        assert.deepEqual(this.renderer.g.firstCall.returnValue.attr.firstCall.args[0], { 'class': 'dxsl-series' }, 'Series group should be created');
        assert.ok(this.renderer.g.firstCall.returnValue.append.called, 'Series group should be appended');

        assert.deepEqual(this.renderer.g.secondCall.returnValue.attr.firstCall.args[0], { 'class': 'dxsl-series-labels' }, 'Series labels group should be created');
        assert.ok(!this.renderer.g.secondCall.returnValue.append.called, 'Series labels group should not be appended');
    });

    QUnit.test('Creating helpers', function(assert) {
        this.createSparkline({ dataSource: [1] });

        assert.equal(rendererModule.Renderer.firstCall.args[0].cssClass, 'dxsl dxsl-sparkline');

        assert.equal(translator2DModule.Translator2D.callCount, 2);
        assert.ok(translator2DModule.Translator2D.firstCall.args[0]);
        assert.ok(translator2DModule.Translator2D.secondCall.args[0]);
        assert.ok(translator2DModule.Translator2D.firstCall.args[1]);
        assert.ok(translator2DModule.Translator2D.secondCall.args[1]);
        assert.deepEqual(translator2DModule.Translator2D.firstCall.args[2], { isHorizontal: true, shiftZeroValue: false });
        assert.deepEqual(translator2DModule.Translator2D.secondCall.args[2], { isHorizontal: false, shiftZeroValue: true }); // T756714, T805150
    });

    QUnit.test('Pas stick = false to translator for bar', function(assert) {
        this.createSparkline({ type: 'bar', dataSource: [1] });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;

        assert.strictEqual(argTranslator.update.lastCall.args[2].stick, false);
    });

    QUnit.test('Pas stick = true to translator for non-bar', function(assert) {
        this.createSparkline({ type: 'line', dataSource: [1] });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;

        assert.strictEqual(argTranslator.update.lastCall.args[2].stick, true);
    });

    QUnit.test('Create line series with default options', function(assert) {
        this.createSparkline({
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6]
        });

        const options = this.getSeriesOptions();

        assert.ok(seriesModule.Series.called);
        assert.deepEqual(options, {
            argumentField: 'arg',
            border: {
                color: '#666666',
                visible: true,
                width: 2
            },
            color: '#666666',
            customizePoint: options.customizePoint,
            opacity: undefined,
            point: {
                border: {
                    visible: true,
                    width: 2
                },
                color: '#ffffff',
                hoverStyle: {
                    border: {}
                },
                selectionStyle: {
                    border: {}
                },
                size: 4,
                symbol: 'circle',
                visible: false
            },
            name: '',
            type: 'line',
            valueField: 'val',
            visible: true,
            widgetType: 'chart',
            width: 2
        });
    });

    QUnit.test('Create line series with custom options', function(assert) {
        this.createSparkline({
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6],
            lineColor: 'blue',
            lineWidth: 3,
            pointSize: 7
        });

        const options = this.getSeriesOptions();

        assert.ok(seriesModule.Series.called);
        assert.deepEqual(options, {
            argumentField: 'arg',
            border: {
                color: 'blue',
                visible: true,
                width: 3
            },
            color: 'blue',
            customizePoint: options.customizePoint,
            opacity: undefined,
            point: {
                border: {
                    visible: true,
                    width: 2
                },
                color: '#ffffff',
                hoverStyle: {
                    border: {}
                },
                selectionStyle: {
                    border: {}
                },
                size: 7,
                symbol: 'circle',
                visible: false
            },
            name: '',
            type: 'line',
            valueField: 'val',
            visible: true,
            widgetType: 'chart',
            width: 3
        });
    });

    QUnit.test('Create line series with circle point', function(assert) {
        this.createSparkline({
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6]
        });

        const options = this.getSeriesOptions();
        assert.ok(seriesModule.Series.called);
        assert.equal(options.point.symbol, 'circle');
    });

    QUnit.test('Create line series with square point', function(assert) {
        this.createSparkline({
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6],
            pointSymbol: 'square'
        });

        const options = this.getSeriesOptions();
        assert.ok(seriesModule.Series.called);
        assert.equal(options.point.symbol, 'square');
    });

    QUnit.test('Create line series with cross point', function(assert) {
        this.createSparkline({
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6],
            pointSymbol: 'cross'
        });

        const options = this.getSeriesOptions();
        assert.ok(seriesModule.Series.called);
        assert.equal(options.point.symbol, 'cross');
    });

    QUnit.test('Create line series with polygon point', function(assert) {
        this.createSparkline({
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6],
            pointSymbol: 'polygon'
        });

        const options = this.getSeriesOptions();
        assert.ok(seriesModule.Series.called);
        assert.equal(options.point.symbol, 'polygon');
    });

    QUnit.test('Create spline series', function(assert) {
        this.createSparkline({
            type: 'spline',
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6]
        });

        const options = this.getSeriesOptions();
        assert.ok(seriesModule.Series.called);
        assert.equal(options.type, 'spline');
    });

    QUnit.test('Create stepline series', function(assert) {
        this.createSparkline({
            type: 'stepline',
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6]
        });

        const options = this.getSeriesOptions();
        assert.ok(seriesModule.Series.called);
        assert.equal(options.type, 'stepline');
    });

    QUnit.test('Create area series with default options', function(assert) {
        this.createSparkline({
            type: 'area',
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6]
        });

        const options = this.getSeriesOptions();

        assert.ok(seriesModule.Series.called);
        assert.deepEqual(options, {
            argumentField: 'arg',
            border: {
                color: '#666666',
                visible: true,
                width: 2
            },
            color: '#666666',
            customizePoint: options.customizePoint,
            opacity: 0.2,
            point: {
                border: {
                    visible: true,
                    width: 2
                },
                color: '#ffffff',
                hoverStyle: {
                    border: {}
                },
                selectionStyle: {
                    border: {}
                },
                size: 4,
                symbol: 'circle',
                visible: false
            },
            name: '',
            type: 'area',
            valueField: 'val',
            visible: true,
            widgetType: 'chart',
            width: 2
        });
    });

    QUnit.test('Create area series with custom options', function(assert) {
        this.createSparkline({
            type: 'area',
            lineColor: 'yellow',
            lineWidth: 5,
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6]
        });

        const options = this.getSeriesOptions();

        assert.ok(seriesModule.Series.called);
        assert.deepEqual(options, {
            argumentField: 'arg',
            border: {
                color: 'yellow',
                visible: true,
                width: 5
            },
            color: 'yellow',
            customizePoint: options.customizePoint,
            opacity: 0.2,
            point: {
                border: {
                    visible: true,
                    width: 2
                },
                color: '#ffffff',
                hoverStyle: {
                    border: {}
                },
                selectionStyle: {
                    border: {}
                },
                size: 4,
                symbol: 'circle',
                visible: false
            },
            name: '',
            type: 'area',
            valueField: 'val',
            visible: true,
            widgetType: 'chart',
            width: 5
        });
    });

    QUnit.test('Create splinearea series', function(assert) {
        this.createSparkline({
            type: 'splinearea',
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6]
        });

        const options = this.getSeriesOptions();
        assert.ok(seriesModule.Series.called);
        assert.equal(options.type, 'splinearea');
    });

    QUnit.test('Create steparea series', function(assert) {
        this.createSparkline({
            type: 'steparea',
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6]
        });

        const options = this.getSeriesOptions();
        assert.ok(seriesModule.Series.called);
        assert.equal(options.type, 'steparea');
    });

    QUnit.test('Create bar series with default options', function(assert) {
        this.createSparkline({
            type: 'bar',
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6]
        });

        const options = this.getSeriesOptions();

        assert.ok(seriesModule.Series.called);
        assert.deepEqual(options, {
            argumentField: 'arg',
            border: {
                color: '#666666',
                visible: false,
                width: 2
            },
            color: '#666666',
            customizePoint: options.customizePoint,
            opacity: undefined,
            point: {
                border: {
                    visible: true,
                    width: 2
                },
                color: '#ffffff',
                hoverStyle: {
                    border: {}
                },
                selectionStyle: {
                    border: {}
                },
                size: 4,
                symbol: 'circle',
                visible: false
            },
            name: '',
            type: 'bar',
            valueField: 'val',
            visible: true,
            widgetType: 'chart',
            width: 2
        });
    });

    QUnit.test('Create winloss series', function(assert) {
        this.createSparkline({
            type: 'winloss',
            dataSource: [4, 4, 8, 7, 9, 5, 4, 6, 1, 2, 3, 0, 5, 6, 4, 8, 9, 5, 6, 1, 2, 3, 4, 5, 6, 8, 4, 6]
        });

        const options = this.getSeriesOptions();

        assert.ok(seriesModule.Series.called);
        assert.deepEqual(options, {
            argumentField: 'arg',
            border: {
                color: '#666666',
                visible: false,
                width: 2
            },
            color: '#666666',
            customizePoint: options.customizePoint,
            opacity: undefined,
            point: {
                border: {
                    visible: true,
                    width: 2
                },
                color: '#ffffff',
                hoverStyle: {
                    border: {}
                },
                selectionStyle: {
                    border: {}
                },
                size: 4,
                symbol: 'circle',
                visible: false
            },
            name: '',
            type: 'bar',
            valueField: 'val',
            visible: true,
            widgetType: 'chart',
            width: 2
        });
    });

    QUnit.test('check series dispose', function(assert) {
        this.createSparkline({
            dataSource: [1, 2, 3, 4]
        });

        this.$container.remove();
        assert.ok(this.series.dispose.calledOnce);
    });

    QUnit.test('Refresh', function(assert) {
        const options = {
            dataSource: [4, 8, 6, 9, 4],
            type: 'area',
            color: '#448ff4',
            width: 2,
            mode: 'minMax'
        };
        const sparkline = this.createSparkline(options);

        this.renderer.resize.resetHistory();

        this.$container.width(300);
        this.$container.height(40);
        sparkline.render();

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1].width, 300, 'Canvas width should have new value');
        assert.deepEqual(valTranslator.update.lastCall.args[1].height, 40, 'Canvas height should have new value');

        assert.equal(this.getSeriesOptions().type, 'area', 'Sparkline should have old type');

        assert.equal(this.renderer.resize.callCount, 1);
        assert.deepEqual(this.renderer.resize.firstCall.args, [300, 40], 'Pass changed canvas width and height to renderer');
    });

    QUnit.test('Change size of container', function(assert) {
        const sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 1, 3, 5, 6, 1, 2, 5, 4]
        });

        this.renderer.resize.resetHistory();

        sparkline.option('size', { width: 300, height: 100 });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

        assert.deepEqual(argTranslator.update.lastCall.args[1].width, 300, 'Canvas should have new width');
        assert.deepEqual(valTranslator.update.lastCall.args[1].height, 100, 'Canvas should have new height');

        assert.equal(this.renderer.resize.callCount, 1);
        assert.deepEqual(this.renderer.resize.firstCall.args, [300, 100], 'Pass changed canvas width and height to renderer');
    });

    QUnit.test('B239673 - Tooltip does not update location after resize', function(assert) {
        const sparkline = this.createSparkline({
            dataSource: [4]
        });
        sparkline._showTooltip();

        sparkline.option('size', { width: 300, height: 100 });
        assert.ok(sparkline._tooltip.hide.calledOnce, 'Tooltip should be hidden');
    });

    QUnit.test('Change datasource', function(assert) {
        const sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 1, 3, 5, 6, 1, 2, 5, 4]
        });
        sparkline.option({ dataSource: [1, 1, 1, 1] });

        const data = seriesModule.Series.lastCall.returnValue.updateData.lastCall.args[0];

        assert.equal(data[0].arg, '0', 'Data source should be correct');
        assert.equal(data[0].val, 1, 'Data source should be correct');
        assert.equal(data[1].arg, '1', 'Data source should be correct');
        assert.equal(data[1].val, 1, 'Data source should be correct');
        assert.equal(data[2].arg, '2', 'Data source should be correct');
        assert.equal(data[2].val, 1, 'Data source should be correct');
        assert.equal(data[3].arg, '3', 'Data source should be correct');
        assert.equal(data[3].val, 1, 'Data source should be correct');
        assert.equal(data.length, 4, 'Series should have new 4 points');
        assert.ok(seriesModule.Series.calledOnce);
    });

    QUnit.test('Change type', function(assert) {
        const sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 1, 3, 5, 6, 1, 2, 5, 4]
        });

        sparkline.option('type', 'bar');

        assert.equal(this.getSeriesOptions().type, 'bar');
        assert.ok(seriesModule.Series.calledOnce);
    });

    QUnit.test('Dispose series stored svg-elements when type changed (T1028256)', function(assert) {
        const sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 1, 3, 5, 6, 1, 2, 5, 4]
        });

        sparkline.option('type', 'bar');

        assert.ok(this.series.removePointElements.calledTwice);
        assert.ok(this.series.removeGraphicElements.calledTwice);
        assert.ok(this.series.removeBordersGroup.calledTwice);
    });

    QUnit.test('Change size - B239871', function(assert) {
        const sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 1, 3, 5, 6, 1, 2, 5, 4]
        });

        sparkline.option('size', { width: 200, height: 150 });

        assert.ok(this.series.draw.calledTwice, 'Redraw function was called');
    });

    QUnit.test('Change size if size = 0,0 - B239871', function(assert) {
        const sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 1, 3, 5, 6, 1, 2, 5, 4],
            size: {
                width: 0,
                height: 0
            }
        });

        sparkline.option('size', { width: 200, height: 150 });

        assert.ok(this.series.draw.calledTwice, 'Redraw function was not called');
    });

    QUnit.test('Change size if size = 10,0 - B239871', function(assert) {
        const sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 1, 3, 5, 6, 1, 2, 5, 4],
            size: {
                width: 10,
                height: 0
            }
        });

        sparkline.option('size', { width: 200, height: 150 });

        assert.ok(this.series.draw.calledTwice, 'Redraw function was not called');
    });

    QUnit.test('Change size if size = 0,10 - B239871', function(assert) {
        const sparkline = this.createSparkline({
            dataSource: [4, 8, 6, 9, 1, 3, 5, 6, 1, 2, 5, 4],
            size: {
                width: 0,
                height: 10
            }
        });

        sparkline.option('size', { width: 200, height: 150 });

        assert.ok(this.series.draw.calledTwice, 'Redraw function was not called');
    });

    QUnit.test('Resize empty sparkline', function(assert) {
        const sparkline = this.createSparkline({});

        sparkline.option('size', { width: 200 });

        const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
        assert.deepEqual(argTranslator.update.lastCall.args[1].width, 200, 'Width was corrected');
    });

    QUnit.test('Change datasource with small container. B254479', function(assert) {
        const sparkline = this.createSparkline({
            size: {
                width: 3
            }
        });

        sparkline.option('dataSource', []);

        assert.ok(true, 'dxSparkline was not broken');
    });

    // T422022
    QUnit.test('sparkline contains export methods', function(assert) {
        const sparkline = this.createSparkline({});

        assert.ok($.isFunction(sparkline.exportTo));
    });

    QUnit.module('drawn', {
        beforeEach: function() {
            environment.beforeEach.call(this);
            sinon.stub(BaseWidget.prototype, '_drawn').callsFake(sinon.spy());
        },
        afterEach: function() {
            environment.afterEach.call(this);
            BaseWidget.prototype._drawn.restore();
        },
        createSparkline: environment.createSparkline
    });

    QUnit.test('drawn is called', function(assert) {
        this.createSparkline({ dataSource: [4, 8, 6] });

        assert.strictEqual(BaseWidget.prototype._drawn.calledOnce, true);
    });

    QUnit.test('drawn is called after dataSource changing', function(assert) {
        const sparkline = this.createSparkline(0);

        sparkline.option('dataSource', [4]);

        assert.strictEqual(BaseWidget.prototype._drawn.calledTwice, true);
    });

    QUnit.test('drawn is called after resize', function(assert) {
        const sparkline = this.createSparkline({ dataSource: [3] });

        sparkline.option('size', { width: 300 });

        assert.strictEqual(BaseWidget.prototype._drawn.calledTwice, true);
    });

    QUnit.module('drawn with async data', {
        beforeEach: function() {
            environment.beforeEach.call(this);
            sinon.stub(BaseWidget.prototype, '_drawn').callsFake(sinon.spy());
            this.data = new DataSource();
            this.isLoadedStub = sinon.stub(this.data, 'isLoaded');
        },
        afterEach: function() {
            environment.afterEach.call(this);
            BaseWidget.prototype._drawn.restore();
        },
        createSparkline: environment.createSparkline
    });

    QUnit.test('drawn is called with starting with async data', function(assert) {
        this.isLoadedStub.returns(false);

        this.createSparkline({ dataSource: this.data });

        assert.ok(!BaseWidget.prototype._drawn.called);
    });

    QUnit.test('drawn is called with ending with async data', function(assert) {
        this.isLoadedStub.returns(true);

        this.createSparkline({ dataSource: this.data });

        assert.strictEqual(BaseWidget.prototype._drawn.calledOnce, true);
    });

    QUnit.module('isReady', environment);

    QUnit.test('isReady without data', function(assert) {
        const sparkline = this.createSparkline({});

        this.renderer.onEndAnimation.lastCall.args[0]();

        assert.ok(sparkline.isReady());
    });

    QUnit.test('isReady with data', function(assert) {
        const sparkline = this.createSparkline({ value: 10, dataSource: null });

        this.renderer.onEndAnimation.lastCall.args[0]();

        assert.ok(sparkline.isReady());
    });

    QUnit.test('isReady with not loaded dataSource', function(assert) {
        const data = new DataSource();
        sinon.stub(data, 'isLoaded').callsFake(function() { return false; });

        const sparkline = this.createSparkline({ dataSource: data });

        this.renderer.stub('onEndAnimation', function(callback) { callback(); });
        sparkline.render();

        assert.strictEqual(sparkline.isReady(), false);
    });

    QUnit.module('incidentOccurred', getEnvironmentWithStubValidateData());

    QUnit.test('check incidentOccurred passed to validateData', function(assert) {
        const incSpy = sinon.spy();

        this.createSparkline({
            onIncidentOccurred: incSpy
        });
        dataValidatorModule.validateData.lastCall.args[2]('E202');
        this.forceTimeout();

        assert.ok(incSpy.called);
    });

    QUnit.test('check incidentOccurred passed to the series', function(assert) {
        const incSpy = function(info) {
            assert.equal(info.target.text, 'The  series cannot be drawn because the val data field is missing');
        };
        this.createSparkline({ onIncidentOccurred: incSpy });
        assert.ok(seriesModule.Series.lastCall.args[0].incidentOccurred);

        seriesModule.Series.lastCall.args[0].incidentOccurred('W2002', ['', 'val']);
    });

    QUnit.module('dataSource integration', environment);

    QUnit.test('dataSource creation', function(assert) {
        const widget = this.createSparkline({ dataSource: [1, 2, 3] });
        const ds = widget.getDataSource();

        assert.ok(ds instanceof DataSource);
        assert.ok(ds.isLoaded());
        assert.deepEqual(ds.items(), [1, 2, 3]);
    });

    QUnit.test('data initialization after load dataSource', function(assert) {
        this.createSparkline({ dataSource: [] });

        assert.equal(seriesModule.Series.callCount, 1);
        assert.equal(seriesModule.Series.lastCall.returnValue.updateData.callCount, 1);
    });

    QUnit.test('update dataSource after option changing', function(assert) {
        const widget = this.createSparkline({});

        widget.option('dataSource', [1, 2, 3]);

        assert.deepEqual(widget.getDataSource().items(), [1, 2, 3]);
    });
});

