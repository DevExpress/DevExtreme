import $ from 'jquery';
import 'viz/range_selector/range_selector';
import { DataSource } from 'common/data/data_source/data_source';

QUnit.testStart(function() {
    const markup =
        '<div id="container"></div>';

    $('#qunit-fixture').html(markup);

    $('#container').css({
        width: '300px',
        height: '150px'
    });
});

QUnit.module('Render', function(hook) {
    hook.beforeEach(function() {
        this.rangeSelector = $('#container').dxRangeSelector({
            scale: {
                startValue: 1,
                endValue: 11
            }
        }).dxRangeSelector('instance');
    });

    QUnit.test('Check scale sharp', function(assert) {
        const lastTickIndex = this.rangeSelector._axis._axis._majorTicks.length - 1;
        assert.equal(this.rangeSelector._axis._axis._axisElement._settings.sharp, 'v');
        assert.equal(this.rangeSelector._axis._axis._axisElement._settings.sharpDirection, 1);
        assert.equal(this.rangeSelector._axis._axis._majorTicks[lastTickIndex].mark._settings.sharp, 'h');
        assert.equal(this.rangeSelector._axis._axis._majorTicks[lastTickIndex].mark._settings.sharpDirection, 1);
    });
});

QUnit.module('Value', function(hook) {
    hook.beforeEach(function() {
        this.rangeSelector = $('#container').dxRangeSelector({
            scale: {
                startValue: 1,
                endValue: 11
            }
        }).dxRangeSelector('instance');
    });

    QUnit.test('value option on widget starting', function(assert) {
        assert.deepEqual(this.rangeSelector.getValue(), [1, 11]);
    });

    QUnit.test('setValue', function(assert) {
        this.rangeSelector.setValue([5, 7]);
        assert.deepEqual(this.rangeSelector.getValue(), [5, 7]);
    });

    QUnit.test('Range when value is changed', function(assert) {
        this.rangeSelector.option('value', [3, 7]);

        assert.deepEqual(this.rangeSelector.getValue(), [3, 7]);
    });

    QUnit.test('Reset selected range', function(assert) {
        this.rangeSelector.option('value', [3, 5]);
        this.rangeSelector.setValue([]);
        assert.deepEqual(this.rangeSelector.getValue(), [1, 11]);
    });

    QUnit.test('Reset selected range. incidentOccurred is not called', function(assert) {
        const incidentOccurred = sinon.spy();
        this.rangeSelector.option({ onIncidentOccurred: incidentOccurred });
        this.rangeSelector.setValue([]);

        assert.equal(incidentOccurred.callCount, 0);
    });

    QUnit.test('Set value with event', function(assert) {
        const valueChanged = sinon.spy();
        this.rangeSelector.on('valueChanged', valueChanged);

        this.rangeSelector.setValue([1, 2], { isEvent: true });

        assert.deepEqual(valueChanged.lastCall.args[0].event, { isEvent: true });
    });

    QUnit.test('range when value and scale are changed', function(assert) {
        this.rangeSelector.option('value', [3, 7]);
        this.rangeSelector.option('scale', { startValue: 1, endValue: 11 });

        assert.deepEqual(this.rangeSelector.getValue(), [3, 7]);
    });

    QUnit.test('range after resize', function(assert) {
        this.rangeSelector.option('value', [3, 5]);
        this.rangeSelector.option('size', { width: 100, height: 300 });
        assert.deepEqual(this.rangeSelector.getValue(), [3, 5]);
    });

    QUnit.test('range on setValue and update scale, value option', function(assert) {
        this.rangeSelector.option({ value: [2, 3] });
        this.rangeSelector.setValue([4, 8]);
        this.rangeSelector.option({ scale: { startValue: 1, endValue: 10 } });

        assert.deepEqual(this.rangeSelector.getValue(), [4, 8]);
    });

    QUnit.test('refresh range after update data source', function(assert) {
        this.rangeSelector.option({ dataSource: [{ arg: 0 }, { arg: 30 }], scale: { startValue: null, endValue: null } });
        const value = this.rangeSelector.getValue();

        assert.roughEqual(value[0], 0, 1E-8);
        assert.roughEqual(value[1], 30, 1E-8);
    });

    QUnit.test('set range with dataSource', function(assert) {
        this.rangeSelector.option({
            dataSource: [{ arg: 0 }, { arg: 30 }],
            value: [5, 10]
        });
        assert.deepEqual(this.rangeSelector.getValue(), [5, 10]);
    });

    QUnit.test('set one of the value', function(assert) {
        this.rangeSelector.option({
            value: [undefined, 10]
        });
        assert.deepEqual(this.rangeSelector.getValue(), [1, 10]);
    });

    QUnit.test('parse custom value option, invalid value', function(assert) {
        const spy = sinon.spy();
        this.rangeSelector.option({
            scale: {
                valueType: 'numeric',
            },
            value: ['a', 'b'],
            onIncidentOccurred: spy
        });

        assert.deepEqual(this.rangeSelector.getValue(), [1, 11]);
        assert.equal(spy.callCount, 1);
        assert.deepEqual(spy.getCall(0).args[0].target.id, 'E2203');
        assert.deepEqual(spy.getCall(0).args[0].target.text, 'The range you are trying to set is invalid');
    });

    QUnit.test('rangeSelector should not raise an error when axis type is changed after dataSource load (T1136921)', function(assert) {
        const onIncidentOccurred = sinon.spy();
        const done = assert.async();
        const dataSource = new DataSource({
            load() {
                const d = new $.Deferred();

                setTimeout(() => {
                    d.resolve([{ arg: '2013-10-19', val: 1 }, { arg: '2016-10-19', val: 1 }]);

                    assert.strictEqual(onIncidentOccurred.callCount, 0, 'no errors with async dataSource');
                    done();
                }, 10);

                return d.promise();
            }
        });

        this.rangeSelector.option({
            dataSource,
            onIncidentOccurred,
            chart: {
                series: {},
            },
            scale: {
                valueType: 'datetime',
            },
            value: ['2015-10-19', '2014-10-19']
        });
    });

    QUnit.test('parse custom value option, with dataSource, valid value', function(assert) {
        const spy = sinon.spy();
        this.rangeSelector.option({
            dataSource: this.dataSource,
            scale: {
                valueType: 'numeric',
            },
            value: ['2', '5'],
            chart: {
                series: [
                    { argumentField: 'x', valueField: 'y1' },
                    { argumentField: 'x', valueField: 'y2' }
                ]
            },
            onIncidentOccurred: spy
        });

        assert.deepEqual(this.rangeSelector.getValue(), [2, 5]);
        assert.ok(!spy.called);
    });

    QUnit.test('parse custom value option, with dataSource, invalid value', function(assert) {
        const spy = sinon.spy();
        this.rangeSelector.option({
            dataSource: this.dataSource,
            scale: {
                valueType: 'numeric',
            },
            value: ['a', 'b'],
            chart: {
                series: [
                    { argumentField: 'x', valueField: 'y1' },
                    { argumentField: 'x', valueField: 'y2' }
                ]
            },
            onIncidentOccurred: spy
        });

        assert.deepEqual(this.rangeSelector.getValue(), [1, 11]);
        assert.equal(spy.callCount, 1);
        assert.deepEqual(spy.getCall(0).args[0].target.id, 'E2203');
        assert.deepEqual(spy.getCall(0).args[0].target.text, 'The range you are trying to set is invalid');
    });

    QUnit.test('Warnings rising on using setValue method', function(assert) {
        const spy = sinon.spy();
        this.rangeSelector.option({
            onIncidentOccurred: spy
        });

        this.rangeSelector.setValue([1, 12]);

        assert.strictEqual(spy.getCall(0).args[0].target.id, 'E2203');
    });

    QUnit.test('Set value using visualRange object', function(assert) {
        this.rangeSelector.setValue({ startValue: 5, endValue: 7 });
        assert.deepEqual(this.rangeSelector.getValue(), [5, 7]);
        assert.deepEqual(this.rangeSelector.option('value'), [5, 7]);
    });

    QUnit.test('Set value via option using visualRange object', function(assert) {
        this.rangeSelector.option('value', { startValue: 5, endValue: 7 });
        assert.deepEqual(this.rangeSelector.getValue(), [5, 7]);
        assert.deepEqual(this.rangeSelector.option('value'), { startValue: 5, endValue: 7 });
    });

    QUnit.test('Change value when options is set by object', function(assert) {
        this.rangeSelector.option('value', { startValue: 5, endValue: 7 });
        this.rangeSelector.setValue([8, 9]);
        assert.deepEqual(this.rangeSelector.getValue(), [8, 9]);
        assert.deepEqual(this.rangeSelector.option('value'), { startValue: 8, endValue: 9 });
    });

    QUnit.test('Set value using visualRange only length field in visualRange object', function(assert) {
        this.rangeSelector.setValue({ length: 2 });
        assert.deepEqual(this.rangeSelector.getValue(), [9, 11]);
    });

    QUnit.test('Set value using visualRange object with start and length', function(assert) {
        this.rangeSelector.setValue({ startValue: 5, length: 2 });
        assert.deepEqual(this.rangeSelector.getValue(), [5, 7]);
    });

    QUnit.test('Set value using visualRange object with end and length', function(assert) {
        this.rangeSelector.setValue({ endValue: 5, length: 2 });
        assert.deepEqual(this.rangeSelector.getValue(), [3, 5]);
    });

    QUnit.test('Set value using visualRange object with start and length. datetime', function(assert) {
        this.rangeSelector.option({
            scale: {
                startValue: new Date(2018, 0, 1),
                endValue: new Date(2024, 0, 1)
            },
            value: { length: { years: 2 } }
        });
        assert.deepEqual(this.rangeSelector.getValue(), [new Date(2022, 0, 1), new Date(2024, 0, 1)]);
    });

    QUnit.test('Set value using visualRange only length field in visualRange object. logarithmic', function(assert) {
        this.rangeSelector.option({
            value: { length: 2 },
            scale: {
                type: 'logarithmic',
                startValue: 100,
                endValue: 100000
            }
        });
        assert.deepEqual(this.rangeSelector.getValue(), [1000, 100000]);
    });

    QUnit.test('Set value using visualRange only length field in visualRange object. discrete', function(assert) {
        this.rangeSelector.option({
            value: { length: 2 },
            scale: {
                type: 'discrete',
                categories: ['a', 'b', 'c', 'd']
            }
        });
        assert.deepEqual(this.rangeSelector.getValue(), ['c', 'd']);
    });

    QUnit.test('Value can\'t go out from scale', function(assert) {
        this.rangeSelector.option({
            scale:
            {
                startValue: 1,
                endValue: 5
            },
            dataSource: [
                { arg: 1, val: 1 },
                { arg: 8, val: 8 }
            ]
        });
        assert.deepEqual(this.rangeSelector.getValue(), [1, 5]);
    });
});

QUnit.module('T465345, onOptionChanged', function(hook) {
    hook.beforeEach(function() {
        this.optionChanged = sinon.spy();
        this.rangeSelector = $('#container').dxRangeSelector({
            onOptionChanged: this.optionChanged,
            scale: {
                startValue: 1,
                endValue: 11
            }
        }).dxRangeSelector('instance');
    });

    QUnit.test('Triggered when \'value\' changed', function(assert) {
        this.rangeSelector.option('value', [5, 8]);

        assert.ok(this.optionChanged.called);
    });

    QUnit.test('Triggered when \'setValue\' method was called', function(assert) {
        this.rangeSelector.setValue([5, 8]);

        assert.ok(this.optionChanged.called);
    });
});

QUnit.module('T413379, \'value\' option', function(hook) {
    hook.beforeEach(function() {
        this.incidentOccurred = sinon.spy();
        this.rangeSelector = $('#container').dxRangeSelector({
            chart: {
                series: [{
                    argumentField: 'arg',
                    valueField: 'val'
                }]
            },
            dataSource: [{
                arg: 1,
                val: 1462
            }, {
                arg: 15,
                val: 1565
            }],
            scale: {
                endValue: 15,
                startValue: 1
            },
            value: [4, 5],
            onIncidentOccurred: this.incidentOccurred
        }).dxRangeSelector('instance');
    });

    QUnit.test('Reset value twice times without updating of the dataSource', function(assert) {
        this.rangeSelector.option({ value: [null, null], chart: { series: null } });
        this.rangeSelector.option({ value: [null, null], chart: { series: null } });

        assert.equal(this.incidentOccurred.callCount, 0);
    });

    QUnit.test('Reset value and dataSource', function(assert) {
        this.rangeSelector.option({ dataSource: null, value: [null, null], chart: { series: null } });
        this.rangeSelector.option({ dataSource: null, value: [null, null], chart: { series: null } });

        assert.equal(this.incidentOccurred.callCount, 0);
    });
});

QUnit.module('onValueChanged event', function(assert) {
    QUnit.test('Not triggered on widget creation', function(assert) {
        let called = false;
        $('#container').dxRangeSelector({
            scale: { startValue: 1, endValue: 9 },
            value: { startValue: 2, endValue: 3 },
            onValueChanged: function() {
                called = true;
            }
        });

        assert.strictEqual(called, false);
    });

    QUnit.test('Triggered on widget update after widget has been created with empty data', function(assert) {
        const valueChanged = sinon.spy();
        $('#container').dxRangeSelector({
            onValueChanged: valueChanged
        });

        $('#container').dxRangeSelector({
            scale: { startValue: 1, endValue: 2 }
        });

        assert.strictEqual(valueChanged.callCount, 1);
    });


    QUnit.test('Triggered only once on axis\' date marker click', function(assert) {
        const valueChanged = sinon.spy();
        $('#container').width(600).dxRangeSelector({
            scale: {
                startValue: new Date(2011, 1, 1),
                endValue: new Date(2011, 6, 1)
            },
            onValueChanged: valueChanged
        });

        $('#container .dxrs-range-selector-elements path:nth-last-child(3)').trigger('dxpointerdown', { eventArgs: true });

        assert.strictEqual(valueChanged.callCount, 1);
        assert.strictEqual(valueChanged.lastCall.args[0].event.type, 'dxpointerdown');
    });

    QUnit.test('Triggered with value and previousValue', function(assert) {
        const valueChanged = sinon.spy();
        $('#container').width(600).dxRangeSelector({
            scale: {
                startValue: 1,
                endValue: 11
            },
            onValueChanged: valueChanged
        });

        $('#container').dxRangeSelector({
            value: [4, 5]
        });

        assert.deepEqual(valueChanged.lastCall.args[0].value, [4, 5], 'value');
        assert.deepEqual(valueChanged.lastCall.args[0].previousValue, [1, 11], 'previousValue');
        assert.strictEqual(valueChanged.lastCall.args[0].event, undefined);
    });

    QUnit.test('onValueChanged not raised on start when dataSource and value are used ', function(assert) {
        const eventHandler = sinon.stub();

        $('#container').dxRangeSelector({
            dataSource: [{ arg: 0 }, { arg: 30 }],
            value: [3, 10],
            onValueChanged: eventHandler,
            onOptionChanged: eventHandler
        });

        assert.strictEqual(eventHandler.callCount, 0);
    });

    // T717643
    QUnit.test('Do not rise valueChanged handler on change scale range', function(assert) {
        // arrange
        const eventHandler = sinon.stub();
        const rangeSelector = $('#container').dxRangeSelector({
            scale: {
                startValue: 0,
                endValue: 40000000
            },
            onValueChanged: eventHandler
        }).dxRangeSelector('instance');


        rangeSelector.option('scale.endValue', 25000);
        eventHandler.reset();

        // act
        rangeSelector.option('scale.endValue', 40000000);

        // assert
        assert.strictEqual(eventHandler.callCount, 0);
    });
});

QUnit.module('Begin/end update functionality', function() {
    // T372059, T369460
    QUnit.test('Update is began during processing option change and ended some time after it', function(assert) {
        const widget = $('#container').dxRangeSelector().dxRangeSelector('instance');
        widget.option('onDrawn', function() {
            widget.option('onDrawn', null); // Only event after "dataSource" update is required for test scenario.
            widget.beginUpdate();
        });
        widget.option('dataSource', [{ arg: 10, val: 1 }, { arg: 20, val: 2 }]);

        widget.option('value', [11, 12]);
        widget.endUpdate();

        assert.deepEqual(widget.getValue(), [11, 12]);
    });

    // "drawn" itself is not the point - the idea is that if during processing a change some option (whose corresponding change precedes the change
    // being processed) is changed then only that preceding change should be processed during next step.
    QUnit.test('Option changes are processed once when a preceding option is changed during processing succeeding option change', function(assert) {
        const widget = $('#container').dxRangeSelector().dxRangeSelector('instance');
        let count = 0;
        widget.on('drawn', function() {
            widget.option('theme', 'generic.dark');
            ++count;
        });

        widget.option('scale', { startValue: 0, endValue: 10 });

        assert.strictEqual(count, 2, 'one because of \'scale\' and one because of \'theme\'');
    });
});

QUnit.module('Misc');

QUnit.test('Range selector with aggregation', function(assert) {
    const rangeSelector = $('#container').dxRangeSelector({
        dataSource: [{
            arg: 0.5,
            val: 1
        }, {
            arg: 2.5,
            val: 2
        }],

        chart: {
            series: [{
                aggregation: {
                    enabled: true
                }
            }]
        }
    }).dxRangeSelector('instance');

    assert.deepEqual(rangeSelector.getValue(), [0, 4]);
});

QUnit.test('Range selector with aggregation when dataSource is set after widget creation', function(assert) {
    const rangeSelector = $('#container').dxRangeSelector({
        dataSource: [],
        chart: {
            series: [{
                aggregation: {
                    enabled: true
                }
            }]
        },
        scale: {
            aggregationInterval: 10
        }
    }).dxRangeSelector('instance');

    // act
    rangeSelector.option({
        dataSource: [
            { arg: 53, val: 1 },
            { arg: 63, val: 1 },
            { arg: 73, val: 1 },
            { arg: 83, val: 1 },
            { arg: 93, val: 1 }
        ]
    });

    assert.deepEqual(rangeSelector.getValue(), [50, 100]);
});

QUnit.test('Range selector with stacked series', function(assert) {
    const rangeSelector = $('#container').dxRangeSelector({
        dataSource: [{
            arg: 0.5,
            val1: 1,
            val2: 2
        }, {
            arg: 2.5,
            val1: 2,
            val2: 1
        }],

        chart: {
            series: [{
                type: 'stackedbar',
                valueField: 'val1'
            }, {
                type: 'stackedbar',
                valueField: 'val2'
            }]
        }
    }).dxRangeSelector('instance');

    assert.deepEqual(rangeSelector.getValue(), [0.5, 2.5]);
});

// T1003570
QUnit.test('Remove overlapped labels. Semidiscrete scale. Right side', function(assert) {
    const container = $('#container');
    container.width(950).dxRangeSelector({
        scale: {
            startValue: new Date('1995-01-01T21:00:00.000Z'),
            endValue: new Date('1995-12-31T21:00:00.000Z'),
            type: 'semidiscrete',
            marker: {
                visible: false
            },
            label: {
                customizeText(e) {
                    return e.valueText.split(' ')[0];
                },
                format: 'month'
            },
            minorTick: {
                visible: false
            },
            minRange: 'day'
        }
    }).dxRangeSelector('instance');

    const drawnLabels = container.find('.dxrs-range-selector-elements text');

    assert.strictEqual(drawnLabels.length, 12);
    assert.strictEqual($(drawnLabels[drawnLabels.length - 1]).text(), 'December');
});

// T1003570
QUnit.test('Remove overlapped labels. Semidiscrete scale. Left side', function(assert) {
    const container = $('#container');
    container.width(950).dxRangeSelector({
        scale: {
            startValue: new Date('1994-12-31T11:00:00.000Z'),
            endValue: new Date('1995-12-31T21:00:00.000Z'),
            type: 'semidiscrete',
            marker: {
                visible: false
            },
            label: {
                customizeText(e) {
                    return e.valueText.split(' ')[0];
                },
                format: 'month'
            },
            minorTick: {
                visible: false
            },
            minRange: 'day'
        }
    }).dxRangeSelector('instance');

    const drawnLabels = container.find('.dxrs-range-selector-elements text');

    assert.strictEqual(drawnLabels.length, 12);
    assert.strictEqual($(drawnLabels[0]).text(), 'January');
});

QUnit.module('selectedRangeUpdateMode', {
    createRangeSelector: function(options) {
        return $('#container').dxRangeSelector(options).dxRangeSelector('instance');
    }
});

QUnit.test('Auto mode. Reset behavior', function(assert) {
    const dataSource = [{ arg: 1, val: 1 }, { arg: 10, val: 10 }];
    const rangeSelector = this.createRangeSelector({
        selectedRangeUpdateMode: 'auto',
        dataSource: dataSource,
        chart: { series: [{}] }
    });

    dataSource.push({ arg: 11, val: 11 });

    rangeSelector.option('dataSource', dataSource);

    assert.deepEqual(rangeSelector.getValue(), [1, 11]);
});

QUnit.test('Auto mode. Shift behavior', function(assert) {
    const dataSource = [{ arg: 1, val: 1 }, { arg: 10, val: 10 }];
    const rangeSelector = this.createRangeSelector({
        selectedRangeUpdateMode: 'auto',
        dataSource: dataSource,
        chart: { series: [{}] }
    });

    rangeSelector.setValue([5, 10]);
    dataSource.push({ arg: 11, val: 11 });

    rangeSelector.option('dataSource', dataSource);

    assert.deepEqual(rangeSelector.getValue(), [6, 11]);
});

QUnit.test('Auto mode. Keep behavior', function(assert) {
    const dataSource = [{ arg: 1, val: 1 }, { arg: 10, val: 10 }];
    const rangeSelector = this.createRangeSelector({
        selectedRangeUpdateMode: 'auto',
        dataSource: dataSource,
        chart: { series: [{}] }
    });

    rangeSelector.setValue([5, 7]);
    dataSource.push({ arg: 11, val: 11 });

    rangeSelector.option('dataSource', dataSource);

    assert.deepEqual(rangeSelector.getValue(), [5, 7]);
});

QUnit.test('Reset mode', function(assert) {
    const dataSource = [{ arg: 1, val: 1 }, { arg: 10, val: 10 }];
    const rangeSelector = this.createRangeSelector({
        selectedRangeUpdateMode: 'reset',
        dataSource: dataSource,
        chart: { series: [{}] }
    });

    dataSource.push({ arg: 11, val: 11 });

    rangeSelector.option('dataSource', dataSource);

    assert.deepEqual(rangeSelector.getValue(), [1, 11]);
});

QUnit.test('Shift mode', function(assert) {
    const dataSource = [{ arg: 1, val: 1 }, { arg: 10, val: 10 }];
    const rangeSelector = this.createRangeSelector({
        selectedRangeUpdateMode: 'shift',
        dataSource: dataSource,
        chart: { series: [{}] }
    });

    rangeSelector.setValue([5, 10]);
    dataSource.push({ arg: 11, val: 11 });

    rangeSelector.option('dataSource', dataSource);

    assert.deepEqual(rangeSelector.getValue(), [6, 11]);
});

QUnit.test('Keep mode', function(assert) {
    const dataSource = [{ arg: 1, val: 1 }, { arg: 10, val: 10 }];
    const rangeSelector = this.createRangeSelector({
        selectedRangeUpdateMode: 'keep',
        dataSource: dataSource,
        chart: { series: [{}] }
    });

    rangeSelector.setValue([5, 7]);
    dataSource.push({ arg: 11, val: 11 });

    rangeSelector.option('dataSource', dataSource);

    assert.deepEqual(rangeSelector.getValue(), [5, 7]);
});

QUnit.test('There is no error when date scale and bar series', function(assert) {
    const rangeSelector = this.createRangeSelector({
        scale: {
            valueType: 'datetime',
            type: 'discrete'
        },
        dataSource: [{
            arg: '2017-01-01',
            value: 4
        }],
        chart: {
            series: {
                type: 'bar'
            }
        }
    });

    assert.ok(rangeSelector);
});

// T696409
QUnit.test('RS with DX dataSource', function(assert) {
    const done = assert.async(1);
    const rangeSelector = this.createRangeSelector({
        chart: { series: [{}] },
        value: [2, 4],
        onValueChanged: function(e) {
            assert.deepEqual(rangeSelector.getValue(), [2, 4]);
            done();
        },
        dataSource: new DataSource({
            load: function() {
                return new Promise(function(r) {
                    return r([{
                        arg: 1,
                        val: 1
                    }, {
                        arg: 10,
                        val: 1
                    }]);
                });
            }
        })
    });
});

// T930471
QUnit.test('RS with async dataSource & scale settings', function(assert) {
    const done = assert.async(1);
    const rangeSelector = this.createRangeSelector({
        chart: { series: [{}] },
        value: [2, 4],
        scale: {
            startValue: 1,
            endValue: 7
        },
        dataSource: new DataSource({
            load: function() {
                return new Promise(function(r) {
                    return r([{
                        arg: 1,
                        val: 1
                    }, {
                        arg: 10,
                        val: 1
                    }]);
                });
            }
        })
    });

    rangeSelector.on('drawn', () => {
        assert.deepEqual(rangeSelector.getValue(), [2, 4]);
        done();
    });
});
// T930471
QUnit.test('RS with async dataSource. value when dadaSource changed to sync', function(assert) {
    const done = assert.async(1);
    const rangeSelector = this.createRangeSelector({
        chart: { series: [{}] },
        value: [2, 4],
        scale: {
            startValue: 1,
            endValue: 7
        },
        dataSource: new DataSource({
            load() {
                return new Promise(function(r) {
                    return r([{
                        arg: 1,
                        val: 1
                    }, {
                        arg: 10,
                        val: 1
                    }]);
                });
            }
        })
    });

    rangeSelector.on('drawn', () => {
        rangeSelector.off('drawn');
        setTimeout(() => {
            rangeSelector.option('dataSource', [{ arg: 1, val: 10 }, { arg: 2, val: 10 }]);
            assert.deepEqual(rangeSelector.getValue(), [1, 7]);
            done();
        }, 20);

    });
});

QUnit.test('Scale from dataSource. calculate linearThreshold', function(assert) {
    const rangeSelector = this.createRangeSelector({
        dataSource: [{ arg: -100, val: 1 }, { arg: -0.0001, val: 1 }, { arg: 1000, val: 1 }],
        scale: {
            type: 'logarithmic'
        }
    });

    assert.deepEqual(rangeSelector.getValue(), [-100, 1000]);
    assert.equal(rangeSelector._axis.getTranslator().getBusinessRange().linearThreshold, -4);
});
