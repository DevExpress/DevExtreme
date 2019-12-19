var $ = require('jquery'),
    common = require('./commonParts/common.js'),
    createFunnel = common.createFunnel,
    environment = common.environment,
    stubAlgorithm = common.stubAlgorithm,
    legendModule = require('viz/components/legend'),
    Legend = legendModule.Legend,
    stubLegend = require('../../helpers/vizMocks.js').stubClass(Legend);

var dxFunnel = require('viz/funnel/funnel');
dxFunnel.addPlugin(legendModule.plugin);

QUnit.module('Legend', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.itemGroupNumber = 1;
        sinon.stub(legendModule, 'Legend', function() {
            var stub = new stubLegend();
            stub.stub('coordsIn').returns(true);
            stub.stub('getItemByCoord').withArgs(2, 3).returns({ id: 4 });
            stub.stub('measure').returns([100, 100]);
            stub.stub('layoutOptions').returns({
                horizontalAlignment: 'right',
                verticalAlignment: 'top',
                side: 'horizontal'
            });
            return stub;
        });
    },
    afterEach: function() {
        environment.afterEach.call(this);
        legendModule.Legend.restore();
    }
}));

QUnit.test('Creation', function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 5, argument: 'One', color: 'orange' }],
            legend: { visible: true }
        }),
        legendCtorArgs = legendModule.Legend.lastCall.args[0],
        legendData = funnel._getLegendData()[0],
        formatObject = legendCtorArgs.getFormatObject(legendData),
        legendGroup = this.renderer.g.getCall(0).returnValue;

    assert.equal(legendGroup.attr.lastCall.args[0].class, 'dxf-legend');
    assert.equal(legendCtorArgs.renderer, this.renderer);
    assert.equal(legendCtorArgs.group, legendGroup);
    assert.equal(legendCtorArgs.textField, 'text');
    assert.equal(formatObject.item.data.argument, 'One');
    assert.equal(formatObject.item.data.value, 5);
    assert.equal(formatObject.item.id, 0);
    assert.equal(formatObject.item.color, 'orange');
    assert.equal(formatObject.item.percent, 1);
});

QUnit.test('Update', function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 5, argument: 'One' }, { value: 10, argument: 'Two' }],
            legend: { visible: true }
        }),
        items = funnel.getAllItems(),
        lastCallUpdate = legendModule.Legend.getCall(0).returnValue.update.lastCall.args[0];

    for(var i = 0; i < items.length; i++) {
        assert.equal(lastCallUpdate[i].text, items[i].data.argument);
        assert.equal(lastCallUpdate[i].item.data.argument, items[i].data.argument);
        assert.deepEqual(lastCallUpdate[i].states, {
            normal: {
                fill: items[i].states.normal.fill,
                hatching: undefined
            },
            hover: {
                fill: items[i].states.hover.fill,
                hatching: items[i].states.hover.hatching
            },
            selection: {
                fill: items[i].states.selection.fill,
                hatching: items[i].states.selection.hatching
            }
        });
        assert.equal(lastCallUpdate[i].id, items[i].id);
        assert.equal(lastCallUpdate[i].visible, true);
    }
});

QUnit.test('Legend options', function(assert) {
    createFunnel({
        dataSource: [{ value: 5, argument: 'One' }, { value: 10, argument: 'Two' }],
        legend: { visible: true, horizontalAlignment: 'center', verticalAlignment: 'bottom' }
    });
    var legend = legendModule.Legend.getCall(0).returnValue;

    assert.equal(legend.update.lastCall.args[1].horizontalAlignment, 'center');
    assert.equal(legend.update.lastCall.args[1].verticalAlignment, 'bottom');
});

QUnit.test('Hover legend', function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 5, argument: 'One' }, { value: 10, argument: 'Two' }],
            legend: { visible: true }
        }),
        items = funnel.getAllItems(),
        legend = legendModule.Legend.getCall(0).returnValue;

    items[1].hover(true);

    assert.equal(legend.applyHover.lastCall.args[0], 1);
});

QUnit.test('Selection legend', function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 5, argument: 'One' }, { value: 10, argument: 'Two' }],
            legend: { visible: true }
        }),
        items = funnel.getAllItems(),
        legend = legendModule.Legend.getCall(0).returnValue;

    items[1].select(true);

    assert.equal(legend.applySelected.lastCall.args[0], 1);
});

QUnit.test('Hover and unhover legend', function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 5, argument: 'One' }, { value: 10, argument: 'Two' }],
            legend: { visible: true }
        }),
        items = funnel.getAllItems(),
        legend = legendModule.Legend.getCall(0).returnValue;

    items[1].hover(true);
    items[1].hover(false);

    assert.equal(legend.resetItem.lastCall.args[0], 1);
});

QUnit.test('Update items', function(assert) {
    var funnel = createFunnel({
        dataSource: [{ value: 5, argument: 'One' }, { value: 10, argument: 'Two' }],
        legend: { visible: true }
    });

    funnel.option({ dataSource: [{ value: 1, argument: 'One' }, { value: 4, argument: 'Two' }] });

    var items = funnel.getAllItems(),
        lastCallUpdate = legendModule.Legend.getCall(0).returnValue.update.lastCall.args[0];

    for(var i = 0; i < items.length; i++) {
        assert.deepEqual(lastCallUpdate[i].item.data.value, items[i].data.value);
    }
});

QUnit.test('Reserve space for legend', function(assert) {
    $('#test-container').css({
        width: 800,
        height: 600
    });

    stubAlgorithm.getFigures.returns([[0, 0, 1, 1]]);

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        legend: {
            visible: true
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 700, 600]);
});
