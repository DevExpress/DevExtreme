import $ from 'jquery';
import dxChart from 'viz/chart';

const moduleSetup = {
    createChart(options) {
        const onOptionChanged = sinon.spy();
        const chart = new dxChart($('<div style="width: 100px;height:100px;"></div>').prependTo('#qunit-fixture'),
            $.extend({
                dataSource: [],
                commonAxisSettings: {
                    endOnTick: false,
                    grid: { visible: false },
                    tick: { visible: false },
                    label: { visible: false }
                },
                commonSeriesSettings: {
                    point: { visible: false }
                },
                legend: { visible: false },
                series: [{ }],
                onOptionChanged
            }, options));
        return [chart, onOptionChanged];
    }
};

QUnit.module('Visual range on updates. Argument axis. Auto mode', moduleSetup);

QUnit.test('No data -> set visualRange - take given range', function(assert) {
    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        argumentAxis: { visualRange: [2, 4] }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: undefined, endValue: undefined }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: undefined, endValue: undefined }, 'Case 1');
    assert.equal(chart.getArgumentAxis().getTranslator().getBusinessRange().isEmpty(), false, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: undefined, endValue: undefined }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: { visualRange: { startValue: 2, endValue: 4 } }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: undefined, endValue: undefined }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: undefined, endValue: undefined }, 'Case 2');
    assert.equal(chart.getArgumentAxis().getTranslator().getBusinessRange().isEmpty(), false, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: undefined, endValue: undefined }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({});
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [2, 4] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: undefined, endValue: undefined }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: undefined, endValue: undefined }, 'Case 3');
    assert.equal(chart.getArgumentAxis().getTranslator().getBusinessRange().isEmpty(), false, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: undefined, endValue: undefined }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({});
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [2, 4]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: undefined, endValue: undefined }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: undefined, endValue: undefined }, 'Case 4');
    assert.equal(chart.getArgumentAxis().getTranslator().getBusinessRange().isEmpty(), false, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: undefined, endValue: undefined }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({});
    onOptionChanged.reset();

    chart.getArgumentAxis().visualRange([2, 4]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: undefined, endValue: undefined }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: undefined, endValue: undefined }, 'Case 5');
    assert.equal(chart.getArgumentAxis().getTranslator().getBusinessRange().isEmpty(), false, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: undefined, endValue: undefined }, 'Case 5');
});

QUnit.test('No data -> set visualRange -> set data - keep visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        argumentAxis: { visualRange: [2, 4] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: { visualRange: { startValue: 2, endValue: 4 } }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({});
    chart.option({ argumentAxis: { visualRange: [2, 4] } });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({});
    chart.option('argumentAxis.visualRange', [2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({});
    chart.getArgumentAxis().visualRange([2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 5');
});

QUnit.test('No data -> set visualRange < wholeRange -> set data - keep visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        argumentAxis: { visualRange: [2, 4], wholeRange: [0, 10] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: { visualRange: { startValue: 2, endValue: 4 }, wholeRange: { startValue: 0, endValue: 10 } }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({});
    chart.option({ argumentAxis: { visualRange: [2, 4], wholeRange: [0, 10] } });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({});
    chart.option('argumentAxis.wholeRange', [0, 10]);
    chart.option('argumentAxis.visualRange', [2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({});
    chart.option('argumentAxis.wholeRange', [0, 10]);
    chart.getArgumentAxis().visualRange([2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 5');
});

QUnit.test('No data -> set visualRange = wholeRange -> set data > wholeRange - take whole range', function(assert) {
    const dataSource = [
        { arg: 0, val: 0 },
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 },
        { arg: 6, val: 60 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        argumentAxis: { visualRange: [1, 5], wholeRange: [1, 5] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: { visualRange: { startValue: 1, endValue: 5 }, wholeRange: { startValue: 1, endValue: 5 } }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({});
    chart.option({ argumentAxis: { visualRange: [1, 5], wholeRange: [1, 5] } });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({});
    chart.option('argumentAxis.wholeRange', [1, 5]);
    chart.option('argumentAxis.visualRange', [1, 5]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({});
    chart.option('argumentAxis.wholeRange', [1, 5]);
    chart.getArgumentAxis().visualRange([1, 5]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 5');
});

QUnit.test('No data -> set visualRange = wholeRange -> set data < wholeRange - take data range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        argumentAxis: { visualRange: [0, 6], wholeRange: [0, 6] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [0, 6], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 0, endValue: 6 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [0, 6], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: { visualRange: { startValue: 0, endValue: 6 }, wholeRange: { startValue: 0, endValue: 6 } }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 0, endValue: 6 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 0, endValue: 6 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 0, endValue: 6 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({});
    chart.option({ argumentAxis: { visualRange: [0, 6], wholeRange: [0, 6] } });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [0, 6], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 0, endValue: 6 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [0, 6], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({});
    chart.option('argumentAxis.wholeRange', [0, 6]);
    chart.option('argumentAxis.visualRange', [0, 6]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [0, 6], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 0, endValue: 6 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [0, 6], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({});
    chart.option('argumentAxis.wholeRange', [0, 6]);
    chart.getArgumentAxis().visualRange([0, 6]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 0, endValue: 6 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 0, endValue: 6 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 0, endValue: 6 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 5');
});

QUnit.test('Data -> set visualRange in the middle of data - take given range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 20, endValue: 40 }, 'Case 1');

    // Case 2
    onOptionChanged.reset();
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: { startValue: 2, endValue: 4 } }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 20, endValue: 40 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [2, 4] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [2, 4]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 20, endValue: 40 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    onOptionChanged.reset();

    chart.getArgumentAxis().visualRange([2, 4]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 20, endValue: 40 }, 'Case 5');
});

QUnit.test('Data -> set visualRange at the end of data - take given range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [4, 5] }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 5], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 50 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 50 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [4, 5], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 40, endValue: 50 }, 'Case 1');

    // Case 2
    onOptionChanged.reset();
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: { startValue: 4, endValue: 5 } }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 4, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 50 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 50 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 4, endValue: 5 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 40, endValue: 50 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [4, 5] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 50 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 50 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 40, endValue: 50 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [4, 5]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 5], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 50 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 50 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [4, 5], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 40, endValue: 50 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    onOptionChanged.reset();

    chart.getArgumentAxis().visualRange([4, 5]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 4, endValue: 5 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 50 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 50 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 4, endValue: 5 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 40, endValue: 50 }, 'Case 5');
});

QUnit.test('Data -> set visualRange < data range -> update data - keep visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 },
        { arg: 6, val: 60 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: { startValue: 2, endValue: 4 } }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });

    chart.option({ argumentAxis: { visualRange: [2, 4] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    chart.option('argumentAxis.visualRange', [2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    chart.getArgumentAxis().visualRange([2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 5');
});

QUnit.test('Data -> set visualRange = data range -> update data - take new data range', function(assert) {
    const dataSource = [
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 }
    ];
    const newDataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: { startValue: 2, endValue: 4 } }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    chart.option({ argumentAxis: { visualRange: [2, 4] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    chart.option('argumentAxis.visualRange', [2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    chart.getArgumentAxis().visualRange([2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 5');
});

// T753244
QUnit.test('No data -> set Data(one point)', function(assert) {
    const dataSource = [ ];
    const newDataSource = [
        { arg: 5, val: 50 }
    ];

    const [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: { length: 2 } }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), {
        startValue: 3,
        endValue: 5
    });
});

QUnit.module('Visual range on updates. Argument axis. Auto mode. Discrete', moduleSetup);

QUnit.test('No data -> set visualRange - take given range', function(assert) {

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRange: [2, 4]
        }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: undefined, endValue: undefined }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [] }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: undefined, endValue: undefined }, 'Case 1');
    assert.equal(chart.getArgumentAxis().getTranslator().getBusinessRange().isEmpty(), false, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: undefined, endValue: undefined }, 'Case 1');

    // Case 2
    onOptionChanged.reset();
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRange: { startValue: 2, endValue: 4 }
        }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4, categories: [] }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: undefined, endValue: undefined }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [] }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: undefined, endValue: undefined }, 'Case 2');
    assert.equal(chart.getArgumentAxis().getTranslator().getBusinessRange().isEmpty(), false, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 2, endValue: 4, categories: [] }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: undefined, endValue: undefined }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [2, 4] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: undefined, endValue: undefined }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [] }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: undefined, endValue: undefined }, 'Case 3');
    assert.equal(chart.getArgumentAxis().getTranslator().getBusinessRange().isEmpty(), false, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: undefined, endValue: undefined }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [2, 4]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: undefined, endValue: undefined }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [] }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: undefined, endValue: undefined }, 'Case 4');
    assert.equal(chart.getArgumentAxis().getTranslator().getBusinessRange().isEmpty(), false, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: undefined, endValue: undefined }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    onOptionChanged.reset();

    chart.getArgumentAxis().visualRange([2, 4]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4, categories: [] }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: undefined, endValue: undefined }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [] }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: undefined, endValue: undefined }, 'Case 5');
    assert.equal(chart.getArgumentAxis().getTranslator().getBusinessRange().isEmpty(), false, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 2, endValue: 4, categories: [] }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: undefined, endValue: undefined }, 'Case 5');
});

QUnit.test('No data -> set visualRange -> set data - keep visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRange: [2, 4]
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRange: { startValue: 2, endValue: 4 }
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });

    chart.option({ argumentAxis: { visualRange: [2, 4] } });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });

    chart.option('argumentAxis.visualRange', [2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    chart.getArgumentAxis().visualRange([2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 5');
});

QUnit.test('Data -> set visualRange in the middle of data - take given range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRange: [2, 4]
        }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 20, endValue: 40 }, 'Case 1');

    // Case 2
    onOptionChanged.reset();
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRange: { startValue: 2, endValue: 4 }
        }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 20, endValue: 40 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [2, 4] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [2, 4]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 20, endValue: 40 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    onOptionChanged.reset();

    chart.getArgumentAxis().visualRange([2, 4]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 20, endValue: 40 }, 'Case 5');
});

QUnit.test('Data -> set visualRange at the end of data - take given range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRange: [4, 5]
        }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 5], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 50 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5, categories: [4, 5] }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 50 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [4, 5], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 40, endValue: 50 }, 'Case 1');

    // Case 2
    onOptionChanged.reset();
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRange: { startValue: 4, endValue: 5 }
        }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 4, endValue: 5, categories: [4, 5] }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 50 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5, categories: [4, 5] }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 50 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 4, endValue: 5, categories: [4, 5] }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 40, endValue: 50 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [4, 5] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 50 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5, categories: [4, 5] }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 50 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 40, endValue: 50 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [4, 5]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 5], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 50 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5, categories: [4, 5] }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 50 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [4, 5], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 40, endValue: 50 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    onOptionChanged.reset();

    chart.getArgumentAxis().visualRange([4, 5]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 4, endValue: 5, categories: [4, 5] }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 50 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5, categories: [4, 5] }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 50 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 4, endValue: 5, categories: [4, 5] }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 40, endValue: 50 }, 'Case 5');
});

QUnit.test('Data -> set visualRange < data range -> update data - keep visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 },
        { arg: 6, val: 60 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRange: [2, 4]
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRange: { startValue: 2, endValue: 4 }
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });

    chart.option({ argumentAxis: { visualRange: [2, 4] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    chart.option('argumentAxis.visualRange', [2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    chart.getArgumentAxis().visualRange([2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 5');
});

QUnit.test('Data -> set visualRange = data range -> update data - take new data range', function(assert) {
    const dataSource = [
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 }
    ];
    const newDataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRange: [2, 4]
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRange: { startValue: 2, endValue: 4 }
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    chart.option({ argumentAxis: { visualRange: [2, 4] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    chart.option('argumentAxis.visualRange', [2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric'
        }
    });
    chart.getArgumentAxis().visualRange([2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 5');
});

QUnit.module('Visual range on updates. Argument axis. Manual mode', moduleSetup);

QUnit.test('No data, keep mode -> set visualRange = wholeRange -> set data < wholeRange - keep visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            visualRangeUpdateMode: 'keep',
            visualRange: [0, 6],
            wholeRange: [0, 6]
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [0, 6], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 0, endValue: 6 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [0, 6], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            visualRangeUpdateMode: 'keep',
            visualRange: { startValue: 0, endValue: 6 },
            wholeRange: { startValue: 0, endValue: 6 }
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 0, endValue: 6 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 0, endValue: 6 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 0, endValue: 6 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            visualRangeUpdateMode: 'keep'
        }
    });
    chart.option({ argumentAxis: { visualRange: [0, 6], wholeRange: [0, 6] } });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [0, 6], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 0, endValue: 6 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [0, 6], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            visualRangeUpdateMode: 'keep'
        }
    });
    chart.option('argumentAxis.wholeRange', [0, 6]);
    chart.option('argumentAxis.visualRange', [0, 6]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [0, 6], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 0, endValue: 6 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [0, 6], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            visualRangeUpdateMode: 'keep'
        }
    });
    chart.option('argumentAxis.wholeRange', [0, 6]);
    chart.getArgumentAxis().visualRange([0, 6]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 0, endValue: 6 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 0, endValue: 6 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 0, endValue: 6 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 5');
});

QUnit.test('No data, reset mode -> set visualRange < wholeRange -> set data - reset visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            visualRangeUpdateMode: 'reset',
            visualRange: [2, 4],
            wholeRange: [0, 10]
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            visualRangeUpdateMode: 'reset',
            visualRange: { startValue: 2, endValue: 4 },
            wholeRange: { startValue: 0, endValue: 10 }
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            visualRangeUpdateMode: 'reset'
        }
    });
    chart.option({ argumentAxis: { visualRange: [2, 4], wholeRange: [0, 10] } });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            visualRangeUpdateMode: 'reset'
        }
    });
    chart.option('argumentAxis.wholeRange', [0, 10]);
    chart.option('argumentAxis.visualRange', [2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            visualRangeUpdateMode: 'reset'
        }
    });
    chart.option('argumentAxis.wholeRange', [0, 10]);
    chart.getArgumentAxis().visualRange([2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 5');
});

QUnit.test('Data, shift mode -> set visualRange < data range -> update data - shift visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 },
        { arg: 6, val: 60 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            visualRangeUpdateMode: 'shift',
            visualRange: [2, 4]
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 60 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 60 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 40, endValue: 60 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            visualRangeUpdateMode: 'shift',
            visualRange: { startValue: 2, endValue: 4 }
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 4, endValue: 6 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 60 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 60 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 4, endValue: 6 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 40, endValue: 60 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            visualRangeUpdateMode: 'shift'
        }
    });

    chart.option({ argumentAxis: { visualRange: [2, 4] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 60 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 60 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 40, endValue: 60 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            visualRangeUpdateMode: 'shift'
        }
    });
    chart.option('argumentAxis.visualRange', [2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 60 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 60 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 40, endValue: 60 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            visualRangeUpdateMode: 'shift'
        }
    });
    chart.getArgumentAxis().visualRange([2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 4, endValue: 6 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 60 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 60 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 4, endValue: 6 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 40, endValue: 60 }, 'Case 5');
});

QUnit.module('Visual range on updates. Argument axis. Manual mode. Discrete', moduleSetup);

QUnit.test('No data, keep mode -> set visualRange -> set data - keep visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'keep',
            visualRange: [2, 4]
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'keep',
            visualRange: { startValue: 2, endValue: 4 }
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'keep'
        }
    });

    chart.option({ argumentAxis: { visualRange: [2, 4] } });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'keep'
        }
    });

    chart.option('argumentAxis.visualRange', [2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'keep'
        }
    });
    chart.getArgumentAxis().visualRange([2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4, categories: [2, 3, 4] }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 5');
});

QUnit.test('No data, reset mode -> set visualRange < wholeRange -> set data - reset visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'reset',
            visualRange: [2, 4],
            wholeRange: [0, 10]
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'reset',
            visualRange: { startValue: 2, endValue: 4 },
            wholeRange: { startValue: 0, endValue: 10 }
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'reset'
        }
    });
    chart.option({ argumentAxis: { visualRange: [2, 4], wholeRange: [0, 10] } });
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'reset'
        }
    });
    chart.option('argumentAxis.wholeRange', [0, 10]);
    chart.option('argumentAxis.visualRange', [2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'reset'
        }
    });
    chart.option('argumentAxis.wholeRange', [0, 10]);
    chart.getArgumentAxis().visualRange([2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 5');
});

QUnit.test('Data, shift mode -> set visualRange < data range -> update data - shift visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 },
        { arg: 6, val: 60 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'shift',
            visualRange: [2, 4]
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 60 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6, categories: [4, 5, 6] }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 60 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 40, endValue: 60 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'shift',
            visualRange: { startValue: 2, endValue: 4 }
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 4, endValue: 6, categories: [4, 5, 6] }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 60 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6, categories: [4, 5, 6] }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 60 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 4, endValue: 6, categories: [4, 5, 6] }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 40, endValue: 60 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'shift'
        }
    });

    chart.option({ argumentAxis: { visualRange: [2, 4] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 60 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6, categories: [4, 5, 6] }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 60 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 40, endValue: 60 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'shift'
        }
    });
    chart.option('argumentAxis.visualRange', [2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 60 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6, categories: [4, 5, 6] }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 60 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 40, endValue: 60 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: {
            type: 'discrete',
            argumentType: 'numeric',
            visualRangeUpdateMode: 'shift'
        }
    });
    chart.getArgumentAxis().visualRange([2, 4]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 4, endValue: 6, categories: [4, 5, 6] }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 40, endValue: 60 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6, categories: [4, 5, 6] }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 40, endValue: 60 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 4, endValue: 6, categories: [4, 5, 6] }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 40, endValue: 60 }, 'Case 5');
});

QUnit.module('Visual range on updates. Value axis', moduleSetup);

QUnit.test('Without visualRange, adjustOnZoom true -> set argument visualRange - show adjusted value range for every argument range case', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 20, endValue: 40 }, 'Case 1');

    // Case 2
    onOptionChanged.reset();
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: { startValue: 2, endValue: 4 } }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 20, endValue: 40 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [2, 4] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [2, 4]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 20, endValue: 40 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    onOptionChanged.reset();

    chart.getArgumentAxis().visualRange([2, 4]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 20, endValue: 40 }, 'Case 5');
});

QUnit.test('Without visualRange, argument visualRange, adjustOnZoom true -> change argument visualRange - show adjusted value range for every argument range case', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [3, 5] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [3, 5], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 30, endValue: 50 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 3, endValue: 5 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 30, endValue: 50 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [3, 5], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 30, endValue: 50 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [3, 5]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [3, 5], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 30, endValue: 50 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 3, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 30, endValue: 50 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [3, 5], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 30, endValue: 50 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    onOptionChanged.reset();

    chart.getArgumentAxis().visualRange([3, 5]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [3, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 30, endValue: 50 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 3, endValue: 5 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 30, endValue: 50 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [3, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 30, endValue: 50 }, 'Case 3');
});

QUnit.test('Without visualRange, argument visualRange, adjustOnZoom false -> change argument visualRange - show full value range for every argument range case', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [3, 5] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [3, 5], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 3, endValue: 5 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [3, 5], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 50 }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [3, 5]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [3, 5], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 3, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [3, 5], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 10, endValue: 50 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    onOptionChanged.reset();

    chart.getArgumentAxis().visualRange([3, 5]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [3, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 3, endValue: 5 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [3, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 10, endValue: 50 }, 'Case 3');
});

QUnit.test('Data -> set visualRange - take given range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        valueAxis: { visualRange: [10, 30] }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 1, endValue: 5 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [10, 30], 'Case 1');

    // Case 2
    onOptionChanged.reset();
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        valueAxis: { visualRange: { startValue: 10, endValue: 30 } }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 30 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 10, endValue: 30 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    onOptionChanged.reset();

    chart.option({ valueAxis: { visualRange: [10, 30] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'valueAxis', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { visualRange: [10, 30] }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    onOptionChanged.reset();

    chart.option('valueAxis.visualRange', [10, 30]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [10, 30], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5 }, 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    onOptionChanged.reset();

    chart.getValueAxis().visualRange([10, 30]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 30 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 10, endValue: 30 }, 'Case 5');
});

QUnit.test('Data -> set value visualRange -> set argument VisualRange - keep value range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [4, 5] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 5], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 5], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    chart.option({ valueAxis: { visualRange: [10, 30] } });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [4, 5] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 5], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 5], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    chart.option({ valueAxis: { visualRange: [10, 30] } });
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [4, 5]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [4, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [10, 30], 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource
    });
    chart.option('valueAxis.visualRange', [10, 30]);
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [4, 5]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 5], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 5 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [4, 5], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [10, 30], 'Case 4');
});

QUnit.module('Visual range on updates. Value axis without visualRange. Auto mode', moduleSetup);

QUnit.test('AdjustOnZoom true - show adjusted value range for every argument range case', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 100 },
        { arg: 2, val: 200 },
        { arg: 3, val: 300 },
        { arg: 4, val: 400 },
        { arg: 5, val: 500 }
    ];

    // Case 1 (arguemnt keep)
    let [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 200, endValue: 400 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 200, endValue: 400 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 200, endValue: 400 }, 'Case 1');

    // Case 2 (argument shift)
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [3, 5] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [3, 5], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 300, endValue: 500 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 3, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 300, endValue: 500 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [3, 5], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 300, endValue: 500 }, 'Case 2');

    // Case 3 (argument reset)
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [1, 5] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 100, endValue: 500 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 500 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 100, endValue: 500 }, 'Case 3');
});

QUnit.test('AdjustOnZoom false - show full value range for every argument range case', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 100 },
        { arg: 2, val: 200 },
        { arg: 3, val: 300 },
        { arg: 4, val: 400 },
        { arg: 5, val: 500 }
    ];

    // Case 1 (arguemnt keep)
    let [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 100, endValue: 500 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 500 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 100, endValue: 500 }, 'Case 1');

    // Case 2 (argument shift)
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [3, 5] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [3, 5], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 100, endValue: 500 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 3, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 500 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [3, 5], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 100, endValue: 500 }, 'Case 2');

    // Case 3 (argument reset)
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [1, 5] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 100, endValue: 500 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 500 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 100, endValue: 500 }, 'Case 3');
});

QUnit.module('Visual range on updates. Value axis with visualRange. Auto mode', moduleSetup);

QUnit.test('Data -> set visualRange -> update data, argument keep mode - keep visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 100 },
        { arg: 2, val: 200 },
        { arg: 3, val: 300 },
        { arg: 4, val: 400 },
        { arg: 5, val: 500 },
        { arg: 6, val: 600 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: { startValue: 10, endValue: 30 } }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 30 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 30 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    chart.option({ valueAxis: { visualRange: [10, 30] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    chart.option('valueAxis.visualRange', [10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    chart.getValueAxis().visualRange([10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 30 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 30 }, 'Case 5');
});

QUnit.test('Data -> set visualRange -> update data, argument reset mode - show full value range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 100 },
        { arg: 2, val: 200 },
        { arg: 3, val: 300 },
        { arg: 4, val: 400 },
        { arg: 5, val: 500 },
        { arg: 6, val: 600 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [1, 5] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [100, 600], 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [100, 600], 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [1, 5] },
        valueAxis: { visualRange: { startValue: 10, endValue: 30 } }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 100, endValue: 600 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 100, endValue: 600 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [1, 5] }
    });
    chart.option({ valueAxis: { visualRange: [10, 30] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [100, 600], 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [100, 600], 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [1, 5] }
    });
    chart.option('valueAxis.visualRange', [10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [100, 600], 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [100, 600], 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [1, 5] }
    });
    chart.getValueAxis().visualRange([10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 100, endValue: 600 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 100, endValue: 600 }, 'Case 5');
});

QUnit.test('Data -> set visualRange -> update data, argument shift mode, adjustOnZoom false - show full value range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 100 },
        { arg: 2, val: 200 },
        { arg: 3, val: 300 },
        { arg: 4, val: 400 },
        { arg: 5, val: 500 },
        { arg: 6, val: 600 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [3, 5] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [100, 600], 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [100, 600], 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [3, 5] },
        valueAxis: { visualRange: { startValue: 10, endValue: 30 } }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 100, endValue: 600 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 100, endValue: 600 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [3, 5] }
    });
    chart.option({ valueAxis: { visualRange: [10, 30] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [100, 600], 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [100, 600], 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [3, 5] }
    });
    chart.option('valueAxis.visualRange', [10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [100, 600], 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [100, 600], 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [3, 5] }
    });
    chart.getValueAxis().visualRange([10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 100, endValue: 600 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 100, endValue: 600 }, 'Case 5');
});

QUnit.test('Data -> set visualRange -> update data, argument shift mode, adjustOnZoom true - show adjusted value range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 100 },
        { arg: 2, val: 200 },
        { arg: 3, val: 300 },
        { arg: 4, val: 400 },
        { arg: 5, val: 500 },
        { arg: 6, val: 600 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [3, 5] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [400, 600], 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 400, endValue: 600 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [400, 600], 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [3, 5] },
        valueAxis: { visualRange: { startValue: 10, endValue: 30 } }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 400, endValue: 600 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 400, endValue: 600 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 400, endValue: 600 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [3, 5] }
    });
    chart.option({ valueAxis: { visualRange: [10, 30] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [400, 600], 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 400, endValue: 600 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [400, 600], 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [3, 5] }
    });
    chart.option('valueAxis.visualRange', [10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [400, 600], 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 400, endValue: 600 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [400, 600], 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [3, 5] }
    });
    chart.getValueAxis().visualRange([10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [4, 6], 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 400, endValue: 600 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 400, endValue: 600 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [4, 6], 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 400, endValue: 600 }, 'Case 5');
});

QUnit.module('Visual range on updates. Value axis with visualRange. Manual modes', moduleSetup);

QUnit.test('Data -> set visualRange -> update data, argument reset mode, value keep mode - keep visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 100 },
        { arg: 2, val: 200 },
        { arg: 3, val: 300 },
        { arg: 4, val: 400 },
        { arg: 5, val: 500 },
        { arg: 6, val: 600 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [1, 5] },
        valueAxis: {
            visualRangeUpdateMode: 'keep',
            visualRange: [10, 30]
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [1, 5] },
        valueAxis: {
            visualRangeUpdateMode: 'keep',
            visualRange: { startValue: 10, endValue: 30 }
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 30 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 30 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [1, 5] },
        valueAxis: {
            visualRangeUpdateMode: 'keep'
        }
    });
    chart.option({ valueAxis: { visualRange: [10, 30] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [1, 5] },
        valueAxis: {
            visualRangeUpdateMode: 'keep'
        }
    });
    chart.option('valueAxis.visualRange', [10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [1, 5] },
        valueAxis: {
            visualRangeUpdateMode: 'keep'
        }
    });
    chart.getValueAxis().visualRange([10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 30 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 30 }, 'Case 5');
});

QUnit.test('Data -> set visualRange -> update data, argument keep mode, value reset mode, adjustOnZoom false - show full value range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 100 },
        { arg: 2, val: 200 },
        { arg: 3, val: 300 },
        { arg: 4, val: 400 },
        { arg: 5, val: 500 },
        { arg: 6, val: 600 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: {
            visualRangeUpdateMode: 'reset',
            visualRange: [10, 30]
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [100, 600], 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [100, 600], 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: {
            visualRangeUpdateMode: 'reset',
            visualRange: { startValue: 10, endValue: 30 }
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 100, endValue: 600 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 100, endValue: 600 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: {
            visualRangeUpdateMode: 'reset'
        }
    });
    chart.option({ valueAxis: { visualRange: [10, 30] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [100, 600], 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [100, 600], 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: {
            visualRangeUpdateMode: 'reset'
        }
    });
    chart.option('valueAxis.visualRange', [10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [100, 600], 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [100, 600], 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: false,
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: {
            visualRangeUpdateMode: 'reset'
        }
    });
    chart.getValueAxis().visualRange([10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 100, endValue: 600 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 100, endValue: 600 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 100, endValue: 600 }, 'Case 5');
});

QUnit.test('Data -> set visualRange -> update data, argument keep mode, value reset mode, adjustOnZoom true - show adjusted value range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 100 },
        { arg: 2, val: 200 },
        { arg: 3, val: 300 },
        { arg: 4, val: 400 },
        { arg: 5, val: 500 },
        { arg: 6, val: 600 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: {
            visualRangeUpdateMode: 'reset',
            visualRange: [10, 30]
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [200, 400], 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 200, endValue: 400 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [200, 400], 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: {
            visualRangeUpdateMode: 'reset',
            visualRange: { startValue: 10, endValue: 30 }
        }
    });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 200, endValue: 400 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 200, endValue: 400 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 200, endValue: 400 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: {
            visualRangeUpdateMode: 'reset'
        }
    });
    chart.option({ valueAxis: { visualRange: [10, 30] } });
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [200, 400], 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 200, endValue: 400 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [200, 400], 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: {
            visualRangeUpdateMode: 'reset'
        }
    });
    chart.option('valueAxis.visualRange', [10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [200, 400], 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 200, endValue: 400 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [200, 400], 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: {
            visualRangeUpdateMode: 'reset'
        }
    });
    chart.getValueAxis().visualRange([10, 30]);
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 200, endValue: 400 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 200, endValue: 400 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 200, endValue: 400 }, 'Case 5');
});

QUnit.module('Visual range updates. Misc', moduleSetup);

QUnit.test('Data -> update data and visualRange, argument reset mode - take given range and keep argument range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource = [
        { arg: 1, val: 100 },
        { arg: 2, val: 200 },
        { arg: 3, val: 300 },
        { arg: 4, val: 400 },
        { arg: 5, val: 500 },
        { arg: 6, val: 600 }
    ];

    // Case 1
    const [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [1, 5] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option({
        dataSource: newDataSource,
        valueAxis: { visualRange: [20, 40] }
    });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5]);
    assert.deepEqual(chart.option('valueAxis.visualRange'), [20, 40]);
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 });
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 });
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'argumentAxis.visualRange');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [1, 5]);
    assert.deepEqual(onOptionChanged.getCall(3).args[0].fullName, 'valueAxis.visualRange');
    assert.deepEqual(onOptionChanged.getCall(3).args[0].value, [20, 40]);
});

QUnit.test('Data -> set visualRange -> update data, argument keep mode -> reset -> update data - show full value range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource1 = [
        { arg: 1, val: 100 },
        { arg: 2, val: 200 },
        { arg: 3, val: 300 },
        { arg: 4, val: 400 },
        { arg: 5, val: 500 }
    ];
    const newDataSource2 = [
        { arg: 1, val: 1000 },
        { arg: 2, val: 2000 },
        { arg: 3, val: 3000 },
        { arg: 4, val: 4000 },
        { arg: 5, val: 5000 },
        { arg: 6, val: 6000 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    chart.option({ dataSource: newDataSource1 });
    chart.resetVisualRange();
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource2 });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [1000, 6000], 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 1000, endValue: 6000 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [1000, 6000], 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: { startValue: 10, endValue: 30 } }
    });
    chart.option({ dataSource: newDataSource1 });
    chart.resetVisualRange();
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource2 });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 1000, endValue: 6000 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 1000, endValue: 6000 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 1000, endValue: 6000 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    chart.option({ valueAxis: { visualRange: [10, 30] } });
    chart.option({ dataSource: newDataSource1 });
    chart.resetVisualRange();
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource2 });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [1000, 6000], 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 1000, endValue: 6000 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [1000, 6000], 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    chart.option('valueAxis.visualRange', [10, 30]);
    chart.option({ dataSource: newDataSource1 });
    chart.resetVisualRange();
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource2 });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [1000, 6000], 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 1000, endValue: 6000 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [1000, 6000], 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] }
    });
    chart.getValueAxis().visualRange([10, 30]);
    chart.option({ dataSource: newDataSource1 });
    chart.resetVisualRange();
    onOptionChanged.reset();

    chart.option({ dataSource: newDataSource2 });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 6], 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 1000, endValue: 6000 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 6 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 1000, endValue: 6000 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 6], 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 1000, endValue: 6000 }, 'Case 5');
});

QUnit.test('Data -> update data -> scroll argument, adjustOnZoom true - show adjusted value range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];
    const newDataSource1 = [
        { arg: 1, val: 100 },
        { arg: 2, val: 200 },
        { arg: 3, val: 300 },
        { arg: 4, val: 400 },
        { arg: 5, val: 500 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [3, 5] }
    });
    chart.option({ dataSource: newDataSource1 });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [2, 4] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 200, endValue: 400 }, 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 200, endValue: 400 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, { visualRange: [2, 4] }, 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [3, 5] }
    });
    chart.option({ dataSource: newDataSource1 });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: { startValue: 2, endValue: 4 } } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 200, endValue: 400 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 200, endValue: 400 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 200, endValue: 400 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [3, 5] }
    });
    chart.option({ dataSource: newDataSource1 });
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [2, 4]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 200, endValue: 400 }, 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 200, endValue: 400 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 200, endValue: 400 }, 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        adjustOnZoom: true,
        dataSource,
        argumentAxis: { visualRange: [3, 5] }
    });
    chart.option({ dataSource: newDataSource1 });
    onOptionChanged.reset();

    chart.getArgumentAxis().visualRange([2, 4]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 200, endValue: 400 }, 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 200, endValue: 400 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 200, endValue: 400 }, 'Case 4');
});

QUnit.test('Argument Axis. Reset visualRange with null option', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [null, null] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: { startValue: 10, endValue: 30 } }
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: [null, null] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 30 }, 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 30 }, 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', [null, null]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [1, 5], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.getArgumentAxis().visualRange([null, null]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [1, 5], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [10, 30], 'Case 4');


    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: { startValue: null, endValue: null } } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 5');

    // Case 6
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: { startValue: 10, endValue: 30 } }
    });
    onOptionChanged.reset();

    chart.option({ argumentAxis: { visualRange: { startValue: null, endValue: null } } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 6');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 30 }, 'Case 6');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 6');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 6');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 6');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5 }, 'Case 6');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 6');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 10, endValue: 30 }, 'Case 6');

    // Case 7
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option('argumentAxis.visualRange', { startValue: null, endValue: null });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), { startValue: 1, endValue: 5 }, 'Case 7');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 7');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 7');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 7');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 7');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, { startValue: 1, endValue: 5 }, 'Case 7');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 7');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [10, 30], 'Case 7');

    // Case 8
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.getArgumentAxis().visualRange({ startValue: null, endValue: null });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [1, 5], 'Case 8');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [10, 30], 'Case 8');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 1, endValue: 5 }, 'Case 8');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 30 }, 'Case 8');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 8');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [1, 5], 'Case 8');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 8');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [10, 30], 'Case 8');
});

QUnit.test('Value Axis. Reset visualRange with null option', function(assert) {
    const dataSource = [
        { arg: 1, val: 10 },
        { arg: 2, val: 20 },
        { arg: 3, val: 30 },
        { arg: 4, val: 40 },
        { arg: 5, val: 50 }
    ];

    // Case 1
    let [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option({ valueAxis: { visualRange: [null, null] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 1');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [20, 40], 'Case 1');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 1');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [20, 40], 'Case 1');

    // Case 2
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: { startValue: 10, endValue: 30 } }
    });
    onOptionChanged.reset();

    chart.option({ valueAxis: { visualRange: [null, null] } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 2');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [20, 40], 'Case 2');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 2');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [20, 40], 'Case 2');

    // Case 3
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option('valueAxis.visualRange', [null, null]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 3');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [20, 40], 'Case 3');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 3');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 3');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, [20, 40], 'Case 3');

    // Case 4
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.getValueAxis().visualRange([null, null]);

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 4');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [20, 40], 'Case 4');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 4');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 4');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [20, 40], 'Case 4');

    // Case 5
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option({ valueAxis: { visualRange: { startValue: null, endValue: null } } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 5');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 5');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 5');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 5');

    // Case 6
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: { startValue: 10, endValue: 30 } }
    });
    onOptionChanged.reset();

    chart.option({ valueAxis: { visualRange: { startValue: null, endValue: null } } });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 6');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 6');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 6');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 6');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 6');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 6');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 6');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 6');

    // Case 7
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.option('valueAxis.visualRange', { startValue: null, endValue: null });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 7');
    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 20, endValue: 40 }, 'Case 7');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 7');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 7');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'argumentAxis.visualRange', 'Case 7');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [2, 4], 'Case 7');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].fullName, 'valueAxis.visualRange', 'Case 7');
    assert.deepEqual(onOptionChanged.getCall(2).args[0].value, { startValue: 20, endValue: 40 }, 'Case 7');

    // Case 8
    [chart, onOptionChanged] = this.createChart({
        dataSource,
        argumentAxis: { visualRange: [2, 4] },
        valueAxis: { visualRange: [10, 30] }
    });
    onOptionChanged.reset();

    chart.getValueAxis().visualRange({ startValue: null, endValue: null });

    assert.deepEqual(chart.option('argumentAxis.visualRange'), [2, 4], 'Case 8');
    assert.deepEqual(chart.option('valueAxis.visualRange'), [20, 40], 'Case 8');
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 4 }, 'Case 8');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 20, endValue: 40 }, 'Case 8');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].fullName, 'argumentAxis.visualRange', 'Case 8');
    assert.deepEqual(onOptionChanged.getCall(0).args[0].value, [2, 4], 'Case 8');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].fullName, 'valueAxis.visualRange', 'Case 8');
    assert.deepEqual(onOptionChanged.getCall(1).args[0].value, [20, 40], 'Case 8');
});

QUnit.test('Value Axis without visualRange. Hide and show series - update visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10, val1: 110 },
        { arg: 2, val: 20, val1: 120 },
        { arg: 3, val: 30, val1: 130 },
        { arg: 4, val: 40, val1: 140 },
        { arg: 5, val: 50, val1: 150 }
    ];

    const [chart] = this.createChart({
        dataSource
    });
    chart.option({ series: [{}, { valueField: 'val1' }] });

    // Case 1
    chart.getAllSeries()[1].hide();

    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 50 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 50 }, 'Case 1');

    // Case 2
    chart.getAllSeries()[1].show();

    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: 10, endValue: 150 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 10, endValue: 150 }, 'Case 2');
});

QUnit.test('Value Axis with visualRange. Hide and show series - do not update visual range', function(assert) {
    const dataSource = [
        { arg: 1, val: 10, val1: 110 },
        { arg: 2, val: 20, val1: 120 },
        { arg: 3, val: 30, val1: 130 },
        { arg: 4, val: 40, val1: 140 },
        { arg: 5, val: 50, val1: 150 }
    ];

    const [chart] = this.createChart({
        dataSource
    });
    chart.option({ series: [{}, { valueField: 'val1' }] });
    chart.getValueAxis().visualRange([-10, 3000]);

    // Case 1
    chart.getAllSeries()[1].hide();

    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: -10, endValue: 3000 }, 'Case 1');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: -10, endValue: 3000 }, 'Case 1');

    // Case 2
    chart.getAllSeries()[1].show();

    assert.deepEqual(chart.option('valueAxis.visualRange'), { startValue: -10, endValue: 3000 }, 'Case 2');
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: -10, endValue: 3000 }, 'Case 2');
});
