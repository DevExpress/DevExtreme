"use strict";

var $ = require("jquery"),
    dxChart = require("viz/chart");

/* global setupSeriesFamily */
require("../../helpers/chartMocks.js");

setupSeriesFamily();
QUnit.testStart(function() {
    var markup =
        '<p></p>\
        <div id=\'container\'></div>';

    $("#qunit-fixture").html(markup);
});

var chartContainerCounter = 1;


QUnit.module('Overlapping behavior', {
    beforeEach: function() {
        this.$container = $('<div id="chartContainer' + chartContainerCounter + '" style="width: 100%;height:300px;"></div>').appendTo('#container');
        chartContainerCounter++;

        this.createChart = function(options) {
            return new dxChart(this.$container, $.extend({
                dataSource: [{ y0: 9910629.2350, y1: 9910629.2350, x: new Date(2010, 0, 4, 0, 0, 0, 0) },
                    { y0: 11151418.5600, y1: 10668982.8550, x: new Date(2010, 0, 11, 0, 0, 0, 0) },
                    { y0: 12084703.8700, y1: 11036330.3400, x: new Date(2010, 0, 18, 0, 0, 0, 0) },
                    { y0: 12831968.8200, y1: 12014643.3150, x: new Date(2010, 0, 25, 0, 0, 0, 0) },
                    { y0: 13727919.8850, y1: 12896778.2050, x: new Date(2010, 1, 1, 0, 0, 0, 0) },
                    { y0: 14086827.4950, y1: 13568841.8850, x: new Date(2010, 1, 8, 0, 0, 0, 0) },
                    { y0: 14578864.2900, y1: 14117637.5900, x: new Date(2010, 1, 15, 0, 0, 0, 0) },
                    { y0: 15229034.2800, y1: 14629351.5350, x: new Date(2010, 1, 22, 0, 0, 0, 0) },
                    { y0: 15593637.7050, y1: 15130827.7050, x: new Date(2010, 2, 1, 0, 0, 0, 0) },
                    { y0: 16070738.3200, y1: 15624256.4900, x: new Date(2010, 2, 8, 0, 0, 0, 0) },
                    { y0: 16491139.4650, y1: 16038416.9200, x: new Date(2010, 2, 15, 0, 0, 0, 0) },
                    { y0: 17117684.0600, y1: 16555443.2050, x: new Date(2010, 2, 22, 0, 0, 0, 0) },
                    { y0: 17705119.1950, y1: 17102697.8750, x: new Date(2010, 2, 29, 0, 0, 0, 0) },
                    { y0: 17994640.0500, y1: 17562875.5700, x: new Date(2010, 3, 5, 0, 0, 0, 0) },
                    { y0: 24325652.6350, y1: 24195669.4300, x: new Date(2010, 6, 12, 0, 0, 0, 0) },
                    { y0: 24751243.4050, y1: 24461880.7000, x: new Date(2010, 6, 19, 0, 0, 0, 0) },
                    { y0: 24999952.1350, y1: 24682574.0000, x: new Date(2010, 6, 26, 0, 0, 0, 0) },
                    { y0: 25180904.2150, y1: 24965412.5000, x: new Date(2010, 7, 2, 0, 0, 0, 0) },
                    { y0: 25623297.5950, y1: 25266550.6650, x: new Date(2010, 7, 9, 0, 0, 0, 0) },
                    { y0: 25599855.5100, y1: 25491033.0250, x: new Date(2010, 7, 16, 0, 0, 0, 0) },
                    { y0: 26351815.2350, y1: 25862509.4700, x: new Date(2010, 7, 23, 0, 0, 0, 0) },
                    { y0: 26720723.8800, y1: 26231604.3600, x: new Date(2010, 7, 30, 0, 0, 0, 0) },
                    { y0: 27277892.8650, y1: 26764493.5200, x: new Date(2010, 8, 6, 0, 0, 0, 0) },
                    { y0: 27591688.6450, y1: 27208129.9950, x: new Date(2010, 8, 13, 0, 0, 0, 0) },
                    { y0: 28069800.2250, y1: 27634109.6300, x: new Date(2010, 8, 20, 0, 0, 0, 0) },
                    { y0: 27929837.3850, y1: 27856306.2700, x: new Date(2010, 8, 27, 0, 0, 0, 0) },
                    { y0: 28474228.4200, y1: 28162201.5300, x: new Date(2010, 9, 4, 0, 0, 0, 0) },
                    { y0: 28587443.8050, y1: 28317446.3100, x: new Date(2010, 9, 11, 0, 0, 0, 0) },
                    { y0: 40662981.9600, y1: 40741246.3600, x: new Date(2011, 4, 16, 0, 0, 0, 0) },
                    { y0: 39167033.1700, y1: 40101900.5900, x: new Date(2011, 4, 23, 0, 0, 0, 0) },
                    { y0: 38707271.5950, y1: 39513438.6750, x: new Date(2011, 4, 30, 0, 0, 0, 0) },
                    { y0: 39364504.0900, y1: 39087841.3950, x: new Date(2011, 5, 6, 0, 0, 0, 0) },
                    { y0: 39293214.9900, y1: 39112101.9450, x: new Date(2011, 5, 13, 0, 0, 0, 0) },
                    { y0: 38778811.9000, y1: 39140902.6450, x: new Date(2011, 5, 20, 0, 0, 0, 0) },
                    { y0: 39148314.1350, y1: 39049754.2600, x: new Date(2011, 5, 27, 0, 0, 0, 0) },
                    { y0: 39174796.4950, y1: 39004429.6200, x: new Date(2011, 6, 4, 0, 0, 0, 0) },
                    { y0: 38574673.8400, y1: 38941346.4700, x: new Date(2011, 6, 11, 0, 0, 0, 0) },
                    { y0: 38104729.9400, y1: 38620962.4600, x: new Date(2011, 6, 18, 0, 0, 0, 0) },
                    { y0: 38505506.5650, y1: 38378209.9850, x: new Date(2011, 6, 25, 0, 0, 0, 0) },
                    { y0: 44740776.9200, y1: 43562300.2850, x: new Date(2011, 11, 26, 0, 0, 0, 0) },
                    { y0: 44762590.1450, y1: 44332733.0700, x: new Date(2012, 0, 2, 0, 0, 0, 0) },
                    { y0: 45620674.7700, y1: 45008332.6650, x: new Date(2012, 0, 9, 0, 0, 0, 0) },
                    { y0: 45193175.3200, y1: 45175818.8800, x: new Date(2012, 0, 16, 0, 0, 0, 0) },
                    { y0: 46909245.6850, y1: 45911194.6350, x: new Date(2012, 0, 23, 0, 0, 0, 0) },
                    { y0: 47397454.6400, y1: 46505133.6550, x: new Date(2012, 0, 30, 0, 0, 0, 0) },
                    { y0: 51300117.0000, y1: 48530791.1950, x: new Date(2012, 1, 6, 0, 0, 0, 0) },
                    { y0: 49752970.2500, y1: 49480320.3150, x: new Date(2012, 1, 13, 0, 0, 0, 0) },
                    { y0: 48329326.6750, y1: 51004449.5100, x: new Date(2012, 5, 18, 0, 0, 0, 0) },
                    { y0: 48563137.6550, y1: 49224678.3900, x: new Date(2012, 5, 25, 0, 0, 0, 0) },
                    { y0: 51816334.9550, y1: 49569849.4600, x: new Date(2012, 6, 2, 0, 0, 0, 0) },
                    { y0: 52260384.2700, y1: 50867707.8300, x: new Date(2012, 6, 9, 0, 0, 0, 0) },
                    { y0: 52573772.6150, y1: 52221037.0600, x: new Date(2012, 6, 16, 0, 0, 0, 0) },
                    { y0: 51232705.7350, y1: 52023150.2250, x: new Date(2012, 6, 23, 0, 0, 0, 0) },
                    { y0: 52941026.4600, y1: 52236878.3450, x: new Date(2012, 6, 30, 0, 0, 0, 0) },
                    { y0: 54571918.0850, y1: 52903712.4600, x: new Date(2012, 7, 6, 0, 0, 0, 0) },
                    { y0: 57965935.1800, y1: 55156861.1750, x: new Date(2012, 7, 13, 0, 0, 0, 0) },
                    { y0: 54324508.2800, y1: 55600861.5400, x: new Date(2012, 7, 20, 0, 0, 0, 0) },
                    { y0: 56574567.2900, y1: 56290911.9350, x: new Date(2012, 7, 27, 0, 0, 0, 0) },
                    { y0: 56426785.6350, y1: 55764193.6000, x: new Date(2012, 8, 3, 0, 0, 0, 0) },
                    { y0: 53845957.7950, y1: 55614262.3100, x: new Date(2012, 8, 10, 0, 0, 0, 0) },
                    { y0: 51128600.0100, y1: 53794212.4050, x: new Date(2012, 8, 17, 0, 0, 0, 0) },
                    { y0: 49603705.8250, y1: 51504113.4300, x: new Date(2012, 8, 24, 0, 0, 0, 0) },
                    { y0: 48929092.8800, y1: 49873114.4000, x: new Date(2012, 9, 1, 0, 0, 0, 0) },
                    { y0: 50025588.5750, y1: 49513510.5300, x: new Date(2012, 9, 8, 0, 0, 0, 0) },
                    { y0: 50857174.7000, y1: 49914365.7500, x: new Date(2012, 9, 15, 0, 0, 0, 0) },
                    { y0: 50916803.6250, y1: 50614982.3000, x: new Date(2012, 9, 22, 0, 0, 0, 0) },
                    { y0: 52092573.7850, y1: 51276494.4550, x: new Date(2012, 9, 29, 0, 0, 0, 0) },
                    { y0: 53160690.0100, y1: 52070824.7150, x: new Date(2012, 10, 5, 0, 0, 0, 0) },
                    { y0: 55941802.6100, y1: 53748525.3050, x: new Date(2012, 10, 12, 0, 0, 0, 0) }]
            }, options));
        };
    },
    afterEach: function() {
        //terrible hack to remove our DOM elements which became global variables
        //http://stackoverflow.com/questions/3434278/ie-chrome-are-dom-tree-elements-global-variables-here
        this.$container.remove();
        if(QUnit.config["noglobals"]) {
            $('#container').empty();
        }
        delete this.$container;
    }
});


QUnit.test('_Auto overlapping', function(assert) {
    var chart = this.createChart({
        series: {
            title: 'Target',
            argumentField: 'x',
            valueField: 'y1',
            point: {
                visible: false
            }
        },
        legend: {
            visible: false
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            grid: {
                visible: true
            },
            label: {
                overlappingBehavior: '_auto'
            }
        }
    });

    assert.ok(chart);
});

QUnit.test('Stagger overlapping mode', function(assert) {
    var chart = this.createChart({
        series: {
            title: 'Target',
            argumentField: 'x',
            valueField: 'y1',
            point: {
                visible: false
            }
        },
        legend: {
            visible: false
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            tickInterval: { months: 2 },
            grid: {
                visible: true
            },
            label: {
                overlappingBehavior: 'stagger'
            }
        }
    });
    assert.ok(chart);
});

QUnit.test('Rotate overlapping mode', function(assert) {
    var chart = this.createChart({
        series: {
            title: 'Target',
            argumentField: 'x',
            valueField: 'y1',
            point: {
                visible: false
            }
        },
        legend: {
            visible: false
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            tickInterval: { months: 2 },
            grid: {
                visible: true
            },
            label: {
                overlappingBehavior: 'rotate'
            }
        }
    });
    assert.ok(chart);
});

QUnit.test('Ignore overlapping mode', function(assert) {
    var chart = this.createChart({
        series: {
            title: 'Target',
            argumentField: 'x',
            valueField: 'y1',
            point: {
                visible: false
            }
        },
        legend: {
            visible: false
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            tickInterval: { months: 2 },
            grid: {
                visible: true
            },
            label: {
                overlappingBehavior: 'ignore'
            }
        }
    });
    assert.ok(chart);
});

QUnit.test('Rotate overlapping with custom rotation angle', function(assert) {
    var chart = this.createChart({
        series: {
            title: 'Target',
            argumentField: 'x',
            valueField: 'y1',
            point: {
                visible: false
            }
        },
        legend: {
            visible: false
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            tickInterval: { months: 2 },
            grid: {
                visible: true
            },
            label: {
                overlappingBehavior: {
                    mode: 'rotate',
                    rotationAngle: 45
                }
            }
        }
    });
    assert.ok(chart);
});

QUnit.test('MultiAxes chart.Rotate overlapping with label rotate angle', function(assert) {
    var chart = this.createChart({
        series: [{
            axis: 'axis1',
            type: 'Area',
            name: 'Sales',
            valueField: 'y0'
        }, {
            axis: 'axis2',
            name: 'Target',
            valueField: 'y1'
        }],
        commonSeriesSettings: {
            argumentField: 'x',
            point: {
                visible: true
            }
        },
        legend: {
            visible: false
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            tickInterval: { months: 2 },
            grid: {
                visible: true
            },
            label: {
                format: 'longDate',
                alignment: 'center',
                overlappingBehavior: {
                    mode: 'rotate',
                    rotationAngle: -15
                }
            }
        },
        valueAxis: [{ name: 'axis1' }, { name: 'axis2' }]
    });
    assert.ok(chart);
});

QUnit.test('Stagger overlapping with custom staggering spacing', function(assert) {
    var chart = this.createChart({
        series: [{
            argumentField: 'x',
            valueField: 'y1',
            point: {
                visible: false
            },
            title: 'Target'
        }],
        legend: {
            visible: false
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            tickInterval: { months: 2 },
            label: {
                overlappingBehavior: {
                    mode: 'stagger',
                    staggeringSpacing: 50
                },
                format: 'longDate'
            }
        }
    });
    assert.ok(chart);
});

QUnit.test('Auto overlapping mode with date time type', function(assert) {
    //arrange, act
    var chart = this.createChart({
        argumentAxis: {
            valueMarginsEnabled: false,
            tickInterval: { months: 2 },
            label: {
                font: {
                    size: 18,
                    weight: 900
                },
                overlappingBehavior: {
                    rotationAngle: 78,
                    mode: 'auto'
                }
            }
        },
        series: {
            title: 'Target',
            argumentField: 'x',
            valueField: 'y1',
            point: {
                visible: false
            }
        }
    });

    //assert
    assert.ok(chart);
});

QUnit.test('Auto overlapping mode with numeric type', function(assert) {
    //arrange, act
    var chart = this.createChart({
        argumentAxis: {
            valueMarginsEnabled: false,
            tickInterval: 3000000,
            label: {
                overlappingBehavior: {
                    mode: 'auto'
                }
            }
        },
        series: {
            title: 'Target',
            argumentField: 'y0',
            valueField: 'y1',
            point: {
                visible: false
            }
        }
    });

    //assert
    assert.ok(chart);
});

QUnit.test('_Auto overlapping', function(assert) {
    //arrange, act
    var chart = this.createChart({
            commonAxisSettings: {
                label: {}
            },
            argumentAxis: {
                label: {
                    overlappingBehavior: '_auto'
                }
            },
            valueAxis: [{}, {}],
            series: {
                argumentField: 'x',
                valueField: 'y0'
            }
        }),
        overlappingBehavior;

    //assert
    assert.equal(chart._argumentAxes.length, 1, 'horizontalAxes length');
    overlappingBehavior = chart._argumentAxes[0]._tickManager._options.overlappingBehavior;
    assert.equal(overlappingBehavior.rotationAngle, null, '_auto overlappingBehavior rotationAngle');
    assert.equal(overlappingBehavior.staggeringSpacing, 5, '_auto overlappingBehavior staggeringSpacing');
});

QUnit.test('Custom overlapping as string', function(assert) {
    //arrange, act
    var chart = this.createChart({
            commonAxisSettings: {
                label: {
                    overlappingBehavior: 'stagger'
                }
            },
            argumentAxis: {
            },
            valueAxis: [{}, {}],
            series: {
                argumentField: 'x',
                valueField: 'y0'
            }
        }),
        overlappingBehavior;
    //assert
    assert.equal(chart._argumentAxes.length, 1, 'horizontalAxes length');
    overlappingBehavior = chart._argumentAxes[0]._tickManager._options.overlappingBehavior;
    assert.equal(overlappingBehavior.mode, 'stagger', 'overlappingBehavior mode');
    assert.equal(overlappingBehavior.rotationAngle, 0, 'overlappingBehavior rotationAngle');
    assert.equal(overlappingBehavior.staggeringSpacing, 5, 'overlappingBehavior staggeringSpacing');
});

QUnit.test('Custom overlapping as object', function(assert) {
    //arrange, act
    var chart = this.createChart({
            commonAxisSettings: {
                label: {
                    overlappingBehavior: {
                        mode: 'rotate',
                        rotationAngle: 64,
                        staggeringSpacing: 17
                    }
                }
            },
            argumentAxis: {},
            valueAxis: [{}, {}],
            series: {
                argumentField: 'x',
                valueField: 'y0'
            }
        }),
        overlappingBehavior;
    //assert
    assert.equal(chart._argumentAxes.length, 1, 'horizontalAxes length');
    overlappingBehavior = chart._argumentAxes[0]._tickManager._options.overlappingBehavior;
    assert.equal(overlappingBehavior.mode, 'rotate', 'overlappingBehavior mode');
    assert.equal(overlappingBehavior.rotationAngle, 64, 'overlappingBehavior rotationAngle');
    assert.equal(overlappingBehavior.staggeringSpacing, 17, 'overlappingBehavior staggeringSpacing');
});

QUnit.test('Overlapping mode for several axis', function(assert) {
    //arrange, act
    var chart = this.createChart({
            commonAxisSettings: {},
            rotated: true,
            valueAxis: [{
                label: {
                    overlappingBehavior: {
                        mode: 'stagger',
                        rotationAngle: 89,
                        staggeringSpacing: 32
                    }
                }
            }, {
                label: {
                    overlappingBehavior: {
                        mode: 'rotate',
                        rotationAngle: 31,
                        staggeringSpacing: 13
                    }
                }
            }],
            argumentAxis: [{}, {}],
            series: {
                argumentField: 'x',
                valueField: 'y0'
            }
        }),
        horizontalAxes;
    //assert

    assert.equal(chart._valueAxes.length, 2, 'horizontalAxes length');
    horizontalAxes = chart._valueAxes;
    assert.equal(horizontalAxes[0]._tickManager._options.overlappingBehavior.mode, 'stagger', 'overlappingBehavior mode for axis 1');
    assert.equal(horizontalAxes[0]._tickManager._options.overlappingBehavior.rotationAngle, 0, 'overlappingBehavior rotationAngle for axis 1');
    assert.equal(horizontalAxes[0]._tickManager._options.overlappingBehavior.staggeringSpacing, 32, 'overlappingBehavior staggeringSpacing for axis 1');
    assert.equal(horizontalAxes[1]._tickManager._options.overlappingBehavior.mode, 'rotate', 'overlappingBehavior mode for axis 2');
    assert.equal(horizontalAxes[1]._tickManager._options.overlappingBehavior.rotationAngle, 31, 'overlappingBehavior rotationAngle for axis 2');
    assert.equal(horizontalAxes[1]._tickManager._options.overlappingBehavior.staggeringSpacing, 13, 'overlappingBehavior staggeringSpacing for axis 2');
});
