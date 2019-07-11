var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    translator2DModule = require("viz/translators/translator2d"),
    rangeModule = require("viz/translators/range"),
    multiAxesSynchronizer = require("viz/chart_components/multi_axes_synchronizer"),
    chartMocks = require("../../helpers/chartMocks.js"),
    MockAxis = chartMocks.MockAxis,
    insertMockFactory = chartMocks.insertMockFactory,
    restoreMockFactory = chartMocks.restoreMockFactory;

require("viz/chart");

QUnit.testStart(function() {
    var markup =
        '<div id="chartContainer" style="width: 300px; height: 150px;"></div>';

    $("#qunit-fixture").html(markup);
});

function setupMocks() {
    insertMockFactory();
}

function checkAxesSynchronization(assert, options) {
    var axes,
        axesTickPositions = [],
        firstIndex,
        axesOptions = options.axesOptions,
        axesOptionsAfterSync = options.axesOptionsAfterSync,
        syncIndexes = options.syncIndexes,
        checkSync = options.checkSync || function() { return true; };

    var createAxes = function(axesOptions) {
        var createAxis = function(options) {
            var canvas = options.canvas || {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: 600,
                height: 400
            };
            var range = new rangeModule.Range(options.range);
            var axis = new MockAxis({ renderer: new vizMocks.Renderer() });
            var translator = new translator2DModule.Translator2D({}, canvas, { shiftZeroValue: true });
            translator.updateBusinessRange(range);
            var visibleArea = translator.getCanvasVisibleArea();
            axis.getVisibleArea.returns([visibleArea.min, visibleArea.max]);

            axis.updateOptions({
                mockRange: range,
                pane: options.pane,
                mockTranslator: translator,
                mockTickInterval: options.tickInterval,
                mockTickValues: options.tickValues,
                mockMinorTicks: options.minorTickValues,
                mockMinorTickInterval: options.minorTickInterval,
                synchronizedValue: options.synchronizedValue,
                type: options.type
            });

            return axis;
        };
        return $.map(axesOptions, function(axisOptions) {
            var axis = createAxis(axisOptions);
            $.each(axisOptions.mockFunctions, function(func, wrapper) {
                wrapper(axis[func]);
            });

            return axis;
        });
    };

    var getObjectData = function(object) {
        var propertyName,
            result = {};
        for(propertyName in object) {
            if(typeof object[propertyName] !== 'function') {
                if(typeof object[propertyName] === 'number') {
                    result[propertyName] = Number(object[propertyName].toFixed(7));
                } else {
                    result[propertyName] = object[propertyName];
                }
            }
        }
        return result;
    };

    axes = createAxes(axesOptions);

    // act
    multiAxesSynchronizer.synchronize(axes);

    // assert
    $.each(axes, function(i, axis) {
        if(axesOptionsAfterSync[i].minorTickValues) {
            assert.deepEqual(axis.getTicksValues().minorTicksValues, axesOptionsAfterSync[i].minorTickValues, 'minorTicks after synchronization for axis ' + i);
        }
        if(axesOptionsAfterSync[i].tickValues) {
            assert.deepEqual(axis.getTicksValues().majorTicksValues, axesOptionsAfterSync[i].tickValues, 'tickValues after synchronization for axis ' + i);
        }
        if(axesOptionsAfterSync[i].range) {
            assert.deepEqual(getObjectData(axis.getTranslator().getBusinessRange()), axesOptionsAfterSync[i].range, 'range after synchronization for axis ' + i);
        }
    });

    if(syncIndexes) {
        $.each(axes, function(i, axis) {
            var tickValues = axis.getTicksValues().majorTicksValues;
            if(tickValues) {
                axesTickPositions.push($.map(tickValues, function(val) {
                    return axis.getTranslator().translate(val);
                }));
            } else {
                axesTickPositions.push([]);
            }
        });

        $.each(syncIndexes, function(i) {
            var groupIndex = i;
            firstIndex = this[0];
            $.each(this, function() {
                var firstAxisTickPositions = axesTickPositions[firstIndex];
                var currentIndex = this;
                var axisTickPositions = axesTickPositions[currentIndex];
                $.each(firstAxisTickPositions, function(i) {
                    if(checkSync(i)) {
                        assert.ok($.inArray(Number(this), axisTickPositions) !== -1, firstIndex + ' and ' + currentIndex + ' axes ticks positions must be equals for ' + groupIndex + ' axis indexes group');
                    }
                });
            });
        });
        firstIndex = undefined;
        $.each(syncIndexes, function() {
            if(firstIndex === undefined) {
                firstIndex = this[0];
            } else {
                assert.notDeepEqual(axesTickPositions[this[0]], axesTickPositions[firstIndex], firstIndex + ' and ' + this[0] + ' axes ticks positions must not be equals because they in different indexes groups');
            }
        });
    }
}

var environment = { beforeEach: setupMocks, afterEach: restoreMockFactory };

QUnit.module('MultiAxis Synchronization', environment);

QUnit.test('No synchronization for 1 axis', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { axisType: 'continuous', dataType: 'numeric', min: 0, max: 10 }, tickValues: [2, 4, 6, 8] }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    dataType: 'numeric',
                    maxVisible: 10,
                    max: 10,
                    minVisible: 0,
                    min: 0
                },
                tickValues: [2, 4, 6, 8]
            }
        ]
    });
});

QUnit.test('No synchronization for 2 axis in different panes', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { pane: 'pane1', range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [2, 4, 6, 8] },
            { pane: 'pane2', range: { min: 15, max: 60, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60] }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [2, 4, 6, 8]
            }, {
                range: {
                    axisType: 'continuous',
                    min: 15,
                    minVisible: 15,
                    max: 60,
                    maxVisible: 60
                },
                tickValues: [20, 30, 40, 50, 60]
            }
        ],
        syncIndexes: [[0], [1]]
    });
});

QUnit.test('No synchronization if all axes with no data (stubData)', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { axisType: 'continuous' }, tickValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], tickInterval: 1 },
            { range: { axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous'
                },
                tickValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            {
                range: {
                    axisType: 'continuous'
                },
                tickValues: [20, 30, 40, 50, 60]
            }
        ],
        syncIndexes: [[0], [1]]
    });
});

QUnit.test('No synchronization for 2 axis if no tickValues (for categories)', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { pane: 'pane1', range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2 },
            { pane: 'pane2', range: { min: 15, max: 60, axisType: 'continuous' }, tickValues: null, tickInterval: 0 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [2, 4, 6, 8]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 15,
                    minVisible: 15,
                    max: 60,
                    maxVisible: 60
                },
                tickValues: undefined
            }
        ],
        syncIndexes: [[0], [1]]
    });
});

QUnit.test('No synchronization for non-number tickValues', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2 },
            { range: { min: new Date(2012, 1, 1), max: new Date(2012, 1, 3), axisType: 'continuous' }, tickValues: [new Date(2012, 1, 1), new Date(2012, 1, 2), new Date(2012, 1, 3)] }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [2, 4, 6, 8]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: new Date(2012, 1, 1),
                    minVisible: new Date(2012, 1, 1),
                    max: new Date(2012, 1, 3),
                    maxVisible: new Date(2012, 1, 3)
                },
                tickValues: [new Date(2012, 1, 1), new Date(2012, 1, 2), new Date(2012, 1, 3)]
            }
        ],
        syncIndexes: [[0], [1]]
    });
});

// T684665
QUnit.test("No syncronize axis if viewport have field 'action' with value 'zoom'", function(assert) {
    var mockFunctions = {
        getViewport: function(instance) { instance.returns({ action: "zoom" }); }
    };
    checkAxesSynchronization(assert, {
        axesOptions: [
            {
                range: { min: 0, max: 10, axisType: 'continuous' },
                tickValues: [2, 4, 6, 8],
                tickInterval: 2,
                mockFunctions: mockFunctions
            },
            {
                range: { min: 15, max: 60, axisType: 'continuous' },
                tickValues: [20, 30, 40, 50, 60],
                tickInterval: 0,
                mockFunctions: mockFunctions
            }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [2, 4, 6, 8]

            },
            {
                range: {
                    axisType: 'continuous',
                    min: 15,
                    minVisible: 15,
                    max: 60,
                    maxVisible: 60
                },
                tickValues: [20, 30, 40, 50, 60]
            }
        ]
    });
});

QUnit.test('Synchronization for 2 synchronized axis', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2, minorTickValues: [1, 2] },
            { range: { min: 10, max: 60, axisType: 'continuous' }, tickValues: [20, 30, 40, 50], tickInterval: 10, minorTickValues: [3, 4] }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [2, 4, 6, 8],
                minorTickValues: [1, 2]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 10,
                    minVisible: 10,
                    max: 60,
                    maxVisible: 60
                },
                tickValues: [20, 30, 40, 50],
                minorTickValues: [3, 4]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis if tickValues count = 1', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2 },
            { range: { min: 20, max: 60, axisType: 'continuous' }, tickValues: [20], tickInterval: 0 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 12,
                    maxVisible: 12
                },
                tickValues: [2, 4, 6, 8]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 12,
                    minVisible: 12,
                    max: 60,
                    maxVisible: 60
                },
                tickValues: [20]
            }
        ],
        syncIndexes: [[0], [1]]
    });
});

// T153054 + T424487
QUnit.test('Synchronization for 2 axis if tickValues count = 1(min==max). tickValues greater than axis range', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 1000, max: 1010, axisType: 'continuous' }, tickValues: [1002, 1004, 1006, 1008], tickInterval: 2 },
            { range: { min: 20, max: 20, axisType: 'continuous' }, tickValues: [20], tickInterval: 0 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 1000,
                    minVisible: 1000,
                    max: 1012,
                    maxVisible: 1012
                },
                tickValues: [1002, 1004, 1006, 1008]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 40,
                    maxVisible: 40
                },
                tickValues: [20]
            }
        ],
        syncIndexes: [[1, 0]]
    });
});

// T153054
QUnit.test('Synchronization for 2 axis if tickValues count = 1(min==max)', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2 },
            { range: { min: 20, max: 20, axisType: 'continuous' }, tickValues: [20], tickInterval: 0 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 12,
                    maxVisible: 12
                },
                tickValues: [2, 4, 6, 8]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 40,
                    maxVisible: 40
                },
                tickValues: [20]
            }
        ],
        syncIndexes: [[1, 0]]
    });
});

// T153054
QUnit.test('Synchronization for 2 axis if tickValues count = 1(min==max) (in both axis)', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 20, max: 20, axisType: 'continuous' }, tickValues: [20], tickInterval: 2 },
            { range: { min: 20, max: 20, axisType: 'continuous' }, tickValues: [20], tickInterval: 0 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 20,
                    minVisible: 20,
                    max: 20,
                    maxVisible: 20
                },
                tickValues: [20]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 20,
                    minVisible: 20,
                    max: 20,
                    maxVisible: 20
                },
                tickValues: [20]
            }
        ],
        syncIndexes: [[1, 0]]
    });
});
// T153054
QUnit.test('Synchronization for 2 axis if tickValues count = 1 (min==max) (negative values)', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: -10, max: 0, axisType: 'continuous' }, tickValues: [-8, -6, -4, -2], tickInterval: 2 },
            { range: { min: -20, max: -20, axisType: 'continuous' }, tickValues: [-20], tickInterval: 0 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: -10,
                    minVisible: -10,
                    max: 2,
                    maxVisible: 2
                },
                tickValues: [-8, -6, -4, -2]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: -40,
                    minVisible: -40,
                    max: 0,
                    maxVisible: 0
                },
                tickValues: [-20]
            }
        ],
        syncIndexes: [[1, 0]]
    });
});
// T153054
QUnit.test('Synchronization for 2 axis if tickValues count = 1 (min==max) (logarithmic axis)', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 9, max: 10000, axisType: 'logarithmic', base: 10 }, tickValues: [10, 100, 1000, 10000], tickInterval: 1, type: 'logarithmic' },
            { range: { min: 10, max: 10, axisType: 'logarithmic', base: 10 }, tickValues: [10], tickInterval: 0, type: 'logarithmic' }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'logarithmic',
                    base: 10,
                    min: 9,
                    minVisible: 9,
                    max: 10000,
                    maxVisible: 10000
                },
                tickValues: [10, 100, 1000, 10000]
            },
            {
                range: {
                    axisType: 'logarithmic',
                    base: 10,
                    min: 1,
                    minVisible: 1,
                    max: 30.81885,
                    maxVisible: 30.81885
                },
                tickValues: [10]
            }
        ],
        syncIndexes: [[1, 0]]
    });
});

QUnit.test('Synchronization for 2 axis if tickValues count = 1, value = 0', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 0, axisType: 'continuous' }, tickValues: [0], tickInterval: 0 },
            { range: { min: 0, max: 5800, axisType: 'continuous' }, tickValues: [0, 1000, 2000], tickInterval: 1000 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 0,
                    maxVisible: 0
                },
                tickValues: [0]
            }, {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 5800,
                    maxVisible: 5800
                },
                tickValues: [0, 1000, 2000]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis if tickValues count = 1, value = 0,synchronizedValue = 0', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { synchronizedValue: 0, range: { min: 0, max: 0, axisType: 'continuous' }, tickValues: [0], tickInterval: 1 },
            { synchronizedValue: 0, range: { min: 0, max: 5800, axisType: 'continuous' }, tickValues: [0, 1000, 2000], tickInterval: 1000 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: -1,
                    minVisible: -1,
                    max: 5.8,
                    maxVisible: 5.8
                },
                tickValues: [-1, 0, 1, 2, 3, 4, 5]
            }, {
                range: {
                    axisType: 'continuous',
                    min: -1000,
                    minVisible: -1000,
                    max: 5800,
                    maxVisible: 5800
                },
                tickValues: [-1000, 0, 1000, 2000, 3000, 4000, 5000]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis if tickValues count = 1, synchronizedValue = 0, and ticks are big', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { synchronizedValue: 0, range: { min: 0, max: 95, axisType: 'continuous' }, tickValues: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90], tickInterval: 10 },
            { synchronizedValue: 0, range: { min: 2000, max: 2000, axisType: 'continuous' }, tickValues: [2000], tickInterval: 1 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 95,
                    maxVisible: 95
                },
                tickValues: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 19000,
                    maxVisible: 19000
                },
                tickValues: [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis last tick > max', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 2, max: 6, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2 },
            { range: { min: 20, max: 50, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 2,
                    minVisible: 2,
                    max: 8,
                    maxVisible: 8
                },
                tickValues: [2, 4, 6, 8]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 20,
                    minVisible: 20,
                    max: 50,
                    maxVisible: 50
                },
                tickValues: [20, 30, 40, 50]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis without paddings and with different tickValues count', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 2, max: 6, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2 },
            { range: { min: 20, max: 60, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 2,
                    minVisible: 2,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [2, 4, 6, 8, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 20,
                    minVisible: 20,
                    max: 60,
                    maxVisible: 60
                },
                tickValues: [20, 30, 40, 50, 60]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

// B231235
QUnit.test('Synchronization for 2 axis without paddings and with different tickValues count. First axis inverted', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 2, max: 12, invert: true, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2 },
            { range: { min: 20, max: 70, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60, 70], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 12,
                    maxVisible: 12,
                    invert: true
                },
                tickValues: [0, 2, 4, 6, 8, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 10,
                    minVisible: 10,
                    max: 70,
                    maxVisible: 70
                },
                tickValues: [20, 30, 40, 50, 60, 70]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

// B231235
QUnit.test('Synchronization for 2 axis without paddings and with different tickValues count. Second axis inverted', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 20, max: 80, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60, 70], tickInterval: 10 },
            { range: { min: 2, max: 12, invert: true, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 10,
                    minVisible: 10,
                    max: 80,
                    maxVisible: 80
                },
                tickValues: [20, 30, 40, 50, 60, 70]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: -2,
                    minVisible: -2,
                    max: 12,
                    maxVisible: 12,
                    invert: true
                },
                tickValues: [0, 2, 4, 6, 8, 10]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

// B231235
QUnit.test('Synchronization for 2 axis without paddings and with different tickValues count. One axis inverted. No adding ticks after zero', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 20, max: 70, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60, 70], tickInterval: 10 },
            { range: { min: 0, max: 12, invert: true, axisType: 'continuous' }, tickValues: [0, 2, 4, 6, 8], tickInterval: 2 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 10,
                    minVisible: 10,
                    max: 70,
                    maxVisible: 70
                },
                tickValues: [20, 30, 40, 50, 60, 70]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 12,
                    maxVisible: 12,
                    invert: true
                },
                tickValues: [0, 2, 4, 6, 8, 10]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis with paddings', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2 },
            { range: { min: 0, max: 60, axisType: 'continuous' }, tickValues: [20, 30, 40, 50], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: -2,
                    minVisible: -2,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [2, 4, 6, 8]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 60,
                    maxVisible: 60
                },
                tickValues: [20, 30, 40, 50]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

// B231181
QUnit.test('Synchronization for 2 axis with different tickValues count. Rounding generated values', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 2, max: 3.0, axisType: 'continuous' }, tickValues: [2, 2.3, 2.6, 2.9], tickInterval: 0.3 },
            { range: { min: 20, max: 60, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 2,
                    minVisible: 2,
                    max: 3.2,
                    maxVisible: 3.2
                },
                tickValues: [2, 2.3, 2.6, 2.9, 3.2 /* 3.199999 without round */]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 20,
                    minVisible: 20,
                    max: 60,
                    maxVisible: 60
                },
                tickValues: [20, 30, 40, 50, 60]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

// B231181
QUnit.test('Synchronization for 2 axis with different tickValues with 2 miltiplier', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 2, max: 6, axisType: 'continuous' }, tickValues: [2, 4, 6], tickInterval: 2 },
            { range: { min: 20, max: 50, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 2,
                    minVisible: 2,
                    max: 6,
                    maxVisible: 6
                },
                tickValues: [2, 4, 6]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 20,
                    minVisible: 20,
                    max: 60,
                    maxVisible: 60
                },
                tickValues: [20, 30, 40, 50, 60]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

// B231181
QUnit.test('Synchronization for 2 axis with different tickValues with 3 miltiplier', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 2, max: 6, axisType: 'continuous' }, tickValues: [2, 4], tickInterval: 2 },
            { range: { min: 20, max: 60, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 2,
                    minVisible: 2,
                    max: 6,
                    maxVisible: 6
                },
                tickValues: [2, 4]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 20,
                    minVisible: 20,
                    max: 80,
                    maxVisible: 80
                },
                tickValues: [20, 30, 40, 50, 60]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis and with different tickValues. Adding ticks to start ', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 2, max: 6, axisType: 'continuous' }, tickValues: [4, 6, 8, 10], tickInterval: 2 },
            { range: { min: 20, max: 70, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60, 70], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 2,
                    minVisible: 2,
                    max: 12,
                    maxVisible: 12
                },
                tickValues: [2, 4, 6, 8, 10, 12]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 20,
                    minVisible: 20,
                    max: 70,
                    maxVisible: 70
                },
                tickValues: [20, 30, 40, 50, 60, 70]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis and with different tickValues. Not adding ticks to start after zero', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 6, axisType: 'continuous' }, tickValues: [0, 2, 4, 6], tickInterval: 2 },
            { range: { min: 20, max: 70, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60, 70], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [0, 2, 4, 6, 8, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 20,
                    minVisible: 20,
                    max: 70,
                    maxVisible: 70
                },
                tickValues: [20, 30, 40, 50, 60, 70]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis with paddings and with different tickValues count', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 12, axisType: 'continuous' }, tickValues: [2, 4, 6, 8, 10], tickInterval: 2 },
            { range: { min: 0, max: 60, axisType: 'continuous' }, tickValues: [20, 30, 40, 50], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: -2,
                    minVisible: -2,
                    max: 12,
                    maxVisible: 12
                },
                tickValues: [2, 4, 6, 8, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 70,
                    maxVisible: 70
                },
                tickValues: [20, 30, 40, 50, 60]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});


QUnit.test('Synchronization for 3 axis with paddings and with different tickValues count', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 2, max: 10, axisType: 'continuous' }, tickValues: [2, 4, 6, 8, 10], tickInterval: 2 },
            { range: { min: 0, max: 60, axisType: 'continuous' }, tickValues: [20, 30, 40, 50], tickInterval: 10 },
            { range: { min: 1000, max: 1600, axisType: 'continuous' }, tickValues: [1150, 1200, 1250, 1300, 1350, 1400], tickInterval: 50 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: -4,
                    minVisible: -4,
                    max: 20,
                    maxVisible: 20
                },
                tickValues: [2, 4, 6, 8, 10, 12]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: -20,
                    minVisible: -20,
                    max: 100,
                    maxVisible: 100
                },
                tickValues: [10, 20, 30, 40, 50, 60]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 1000,
                    minVisible: 1000,
                    max: 1600,
                    maxVisible: 1600
                },
                tickValues: [1150, 1200, 1250, 1300, 1350, 1400]
            }
        ],
        syncIndexes: [[0, 1, 2]]
    });
});

QUnit.test('Synchronization for 3 axis with different tickValues count. B254389', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { synchronizedValue: 0, range: { min: 0, max: 0.007, axisType: 'continuous' }, tickValues: [0, 0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008, 0.009], tickInterval: 0.001 },
            { synchronizedValue: 0, range: { min: 0, max: 3.13, axisType: 'continuous' }, tickValues: [0, 1, 2, 3], tickInterval: 1 },
            { synchronizedValue: 0, range: { min: 0, max: 1006, axisType: 'continuous' }, tickValues: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], tickInterval: 100 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 0.01006,
                    maxVisible: 0.01006
                },
                tickValues: [0, 0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008, 0.009, 0.01]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10.06,
                    maxVisible: 10.06
                },
                tickValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 1006,
                    maxVisible: 1006
                },
                tickValues: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
            }
        ],
        syncIndexes: [[0, 1, 2]]
    });
});

// B231325
QUnit.test('Synchronization for 3 axis when first with no data (stubData)', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { axisType: 'continuous' }, tickValues: [0, 2, 4, 6, 8, 10], tickInterval: 2 },
            { range: { min: 2, max: 6, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2 },
            { range: { min: 20, max: 50, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous'
                },
                tickValues: [0, 2, 4, 6, 8, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 2,
                    minVisible: 2,
                    max: 8,
                    maxVisible: 8
                },
                tickValues: [2, 4, 6, 8]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 20,
                    minVisible: 20,
                    max: 50,
                    maxVisible: 50
                },
                tickValues: [20, 30, 40, 50]
            }
        ],
        syncIndexes: [[ 1, 2]]
    });
});

QUnit.test('Synchronization for 4 axis in 2 panes', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { pane: 'pane1', range: { min: 2, max: 10, axisType: 'continuous' }, tickValues: [2, 4, 6, 8, 10], tickInterval: 2 },
            { pane: 'pane1', range: { min: 0, max: 60, axisType: 'continuous' }, tickValues: [20, 30, 40, 50], tickInterval: 10 },
            { pane: 'pane2', range: { min: 1000, max: 1600, axisType: 'continuous' }, tickValues: [1150, 1200, 1250, 1300, 1350, 1400], tickInterval: 50 },
            { pane: 'pane2', range: { min: 1, max: 6, axisType: 'continuous' }, tickValues: [1, 2, 3, 4, 5], tickInterval: 1 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: -2,
                    minVisible: -2,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [2, 4, 6, 8, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 60,
                    maxVisible: 60
                },
                tickValues: [20, 30, 40, 50, 60]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 1000,
                    minVisible: 1000,
                    max: 1600,
                    maxVisible: 1600
                },
                tickValues: [1150, 1200, 1250, 1300, 1350, 1400]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: -2,
                    minVisible: -2,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [1, 2, 3, 4, 5, 6]
            }
        ],
        syncIndexes: [[0, 1], [2, 3]]
    });
});

QUnit.test('Synchronization for 2 axis with synchronizedValue', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [0, 2, 4, 6, 8], synchronizedValue: 0, tickInterval: 2 },
            { range: { min: -160, max: -10, axisType: 'continuous' }, tickValues: [-150, -110, -70, -30], synchronizedValue: 0, tickInterval: 40 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: -8,
                    minVisible: -8,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [-8, -6, -4, -2, 0, 2, 4, 6, 8, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: -160,
                    minVisible: -160,
                    max: 200,
                    maxVisible: 200
                },
                tickValues: [-160, -120, -80, -40, 0, 40, 80, 120, 160, 200]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis with synchronizedValue and main inverted axis', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 10, invert: true, axisType: 'continuous' }, tickValues: [0, 2, 4, 6, 8], synchronizedValue: 0, tickInterval: 2 },
            { range: { min: -160, max: -10, axisType: 'continuous' }, tickValues: [-150, -110, -70, -30], synchronizedValue: 0, tickInterval: 40 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10,
                    invert: true
                },
                tickValues: [0, 2, 4, 6, 8, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: -200,
                    minVisible: -200,
                    max: 0,
                    maxVisible: 0
                },
                tickValues: [-200, -160, -120, -80, -40, 0]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis with synchronizedValue and second inverted axis', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [0, 2, 4, 6, 8], synchronizedValue: 0, tickInterval: 2 },
            { range: { min: -160, max: -10, invert: true, axisType: 'continuous' }, tickValues: [-150, -110, -70, -30], synchronizedValue: 0, tickInterval: 40 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [0, 2, 4, 6, 8, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: -200,
                    minVisible: -200,
                    max: 0,
                    maxVisible: 0,
                    invert: true
                },
                tickValues: [-200, -160, -120, -80, -40, 0]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis with synchronizedValue for one axis only', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [0, 2, 4, 6, 8], synchronizedValue: 2, tickInterval: 2 },
            { range: { min: -160, max: -10, axisType: 'continuous' }, tickValues: [-150, -110, -70, -30], tickInterval: 40 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [0, 2, 4, 6, 8, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: -190,
                    minVisible: -190,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [-190, -150, -110, -70, -30, 10]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis. One axis with zooming', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 100, minVisible: 5, maxVisible: 10, axisType: 'continuous' }, tickValues: [5, 6, 7, 8, 9, 10], tickInterval: 1 },
            { range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [0, 2, 4, 6, 8, 10], tickInterval: 2 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 5,
                    max: 100,
                    maxVisible: 10
                },
                tickValues: [5, 6, 7, 8, 9, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [0, 2, 4, 6, 8, 10]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 2 axis. Axes after argument zooming', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            {
                range: { min: 0, max: 100, minVisible: 5, maxVisible: 10, axisType: 'continuous' }, tickValues: [5, 6, 7, 8, 9, 10], tickInterval: 1
            },
            {
                range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [0, 2, 4, 6, 8, 10], tickInterval: 2
            }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 5,
                    max: 100,
                    maxVisible: 10
                },
                tickValues: [5, 6, 7, 8, 9, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [0, 2, 4, 6, 8, 10]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('No synchronization for 2 axis. Single axis has discrete type', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            {
                range: { min: 5, max: 11, axisType: 'continuous' }, tickValues: [5, 6, 7, 8, 9, 10, 11], tickInterval: 1
            },
            {
                range: { min: 0, max: 10, axisType: 'discrete' }, tickValues: ['0', '2', '4', '6', '8', '10'],
                type: 'discrete'
            }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 5,
                    minVisible: 5,
                    max: 11,
                    maxVisible: 11
                },
                tickValues: [5, 6, 7, 8, 9, 10, 11]
            },
            {
                range: {
                    axisType: 'discrete',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: ['0', '2', '4', '6', '8', '10']
            }
        ],
        syncIndexes: [[0], [1]]
    });
});

QUnit.test('No synchronization for 2 axis. Both axis has discrete type', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            {
                range: { min: '5', max: '11', axisType: 'discrete', categories: ['5', '6', '7', '8', '9', '10', '11'] }, tickValues: ['5', '6', '7', '8', '9', '10', '11'],
                type: 'discrete'
            },
            {
                range: { min: '0', max: '10', axisType: 'discrete', categories: ['0', '2', '4', '6', '8', '10'] }, tickValues: ['0', '2', '4', '6', '8', '10'],
                type: 'discrete'
            }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'discrete',
                    min: '5',
                    minVisible: '5',
                    max: '11',
                    maxVisible: '11',
                    categories: ['5', '6', '7', '8', '9', '10', '11']
                },
                tickValues: ['5', '6', '7', '8', '9', '10', '11']

            },
            {
                range: {
                    axisType: 'discrete',
                    min: '0',
                    minVisible: '0',
                    max: '10',
                    maxVisible: '10',
                    categories: ['0', '2', '4', '6', '8', '10']
                },
                tickValues: ['0', '2', '4', '6', '8', '10']
            }
        ],
        syncIndexes: [[0], [1]]
    });
});

QUnit.test('Synchronization for 2 axis with zoom by value', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: -47.9, max: 76.9, minVisible: -40.2, maxVisible: 74.6, axisType: 'continuous' }, tickValues: [-40, -20, 0, 20, 40, 60], tickInterval: 20 },
            { range: { min: 0, max: 185.5, minVisible: 10, maxVisible: 185.5, axisType: 'continuous' }, tickValues: [20, 40, 60, 80, 100, 120, 140, 160, 180], tickInterval: 20 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: -70,
                    minVisible: -70,
                    max: 105.5,
                    maxVisible: 105.5
                },
                tickValues: [-60, -40, -20, 0, 20, 40, 60, 80, 100]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 10,
                    max: 185.5,
                    maxVisible: 185.5
                },
                tickValues: [20, 40, 60, 80, 100, 120, 140, 160, 180]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 3 axis with different small ticks. T570230. #1 adjust range with paddings', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { synchronizedValue: 0, range: { min: -0.000002, max: 5e-7, axisType: 'continuous' }, tickValues: [-0.000002, -0.0000015, -0.000001, -5e-7, 0, 5e-7], tickInterval: 5e-7 },
            { synchronizedValue: 0, range: { min: 0, max: 1, axisType: 'continuous' }, tickValues: [0, 0.2, 0.4, 0.6, 0.8, 1], tickInterval: 0.2 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: -0.000002,
                    minVisible: -0.000002,
                    max: 0.0000025,
                    maxVisible: 0.0000025
                },
                tickValues: [-0.000002, -1.5e-6, -1e-6, -5e-7, 0, 5e-7, 1e-6, 1.5e-6, 0.000002, 0.0000025]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: -0.8,
                    minVisible: -0.8,
                    max: 1,
                    maxVisible: 1
                },
                tickValues: [-0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization for 3 axis with different small ticks. T570230. #2 adjust ticks', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { synchronizedValue: 0, range: { min: 0, max: 10, axisType: 'continuous' }, tickValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], tickInterval: 1 },
            { synchronizedValue: 0, range: { min: 0, max: 0.01, axisType: 'continuous' }, tickValues: [0, 0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008, 0.009, 0.01], tickInterval: 0.001 },
            { synchronizedValue: 0, range: { min: 0, max: 0.16, axisType: 'continuous' }, tickValues: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16], tickInterval: 0.02 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 0.01,
                    maxVisible: 0.01
                },
                tickValues: [0, 0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008, 0.009, 0.01]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 0.2,
                    maxVisible: 0.2
                },
                tickValues: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2]
            }
        ],
        syncIndexes: [[0, 1, 2]]
    });
});

QUnit.module('MultiAxis LogarithmicAxis Synchronization', environment);

QUnit.test('Synchronization two logarithmic Axis. Small values', function(assert) {
    var tickValues1 = [0.000001, 0.00001, 0.0001],
        tickValue2 = [10, 100, 1000];
    tickValues1.tickInterval = 1;
    tickValue2.tickInterval = 1;

    checkAxesSynchronization(assert, {
        axesOptions: [
            { type: 'logarithmic', range: { min: 0.000001, max: 0.0001, minVisible: 0.000001, base: 10, axisType: 'logarithmic' }, tickValues: tickValues1, tickInterval: 2 },
            { type: 'logarithmic', range: { min: 1, max: 1000, minVisible: 1, base: 10, axisType: 'logarithmic' }, tickValues: tickValue2, tickInterval: 1 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'logarithmic',
                    base: 10,
                    min: 0,
                    minVisible: 0,
                    max: 0.01,
                    maxVisible: 0.01
                },
                tickValues: [0.000001, 0.0001, 0.01]
            },
            {
                range: {
                    axisType: 'logarithmic',
                    base: 10,
                    min: 1,
                    minVisible: 1,
                    max: 1000,
                    maxVisible: 1000
                },
                tickValues: [10, 100, 1000]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization two logarithmic Axis. Equal tick count', function(assert) {
    var tickValues1 = [10e-2, 10e0, 10e2, 10e4],
        tickValue2 = [10e1, 10e2, 10e3, 10e4];
    tickValues1.tickInterval = 2;
    tickValue2.tickInterval = 1;

    checkAxesSynchronization(assert, {
        axesOptions: [
            { type: 'logarithmic', range: { min: 0.01, max: 10000, minVisible: 0.01, base: 10, axisType: 'logarithmic' }, tickValues: tickValues1, tickInterval: 2 },
            { type: 'logarithmic', range: { min: 1, max: 1000, minVisible: 1, base: 10, axisType: 'logarithmic' }, tickValues: tickValue2, tickInterval: 1 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'logarithmic',
                    base: 10,
                    min: 0.00001,
                    minVisible: 0.00001,
                    max: 10000,
                    maxVisible: 10000
                },
                tickValues: [0.1, 10, 1000]
            },
            {
                range: {
                    axisType: 'logarithmic',
                    base: 10,
                    min: 1,
                    minVisible: 1,
                    max: 31622.7766,
                    maxVisible: 31622.7766
                },
                tickValues: [100, 1000, 10000]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization logarithmic Axis with non logarithmic axis', function(assert) {
    var tickValues1 = [10e-2, 10e-1, 10e0, 10e1, 10e2, 10e3, 10e4],
        tickValue2 = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    tickValues1.tickInterval = 1;
    tickValue2.tickInterval = 10;

    checkAxesSynchronization(assert, {
        axesOptions: [
            { type: 'logarithmic', range: { min: 0.01, max: 10000, minVisible: 0.01, base: 10, axisType: 'logarithmic' }, tickValues: tickValues1, tickInterval: 1 },
            { type: 'continuous', range: { min: 0, max: 100, minVisible: 0, axisType: 'continuous' }, tickValues: tickValue2, tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'logarithmic',
                    base: 10,
                    min: 0.001,
                    minVisible: 0.001,
                    max: 10000000,
                    maxVisible: 10000000
                },
                tickValues: [0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000, 100000, 1000000, 10000000]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 100,
                    maxVisible: 100
                },
                tickValues: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization logarithmic Axis with non logarithmic axis. B250542', function(assert) {
    var tickValues1 = [10e-2, 10e-1, 10e0, 10e1, 10e2, 10e3],
        tickValue2 = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    tickValues1.tickInterval = 1;
    tickValue2.tickInterval = 10;

    checkAxesSynchronization(assert, {
        axesOptions: [
            { type: 'logarithmic', range: { min: 0.01, max: 1000, minVisible: 0.01, maxVisible: 1000, base: 10, axisType: 'logarithmic' }, tickValues: tickValues1, tickInterval: 1 },
            { type: 'continuous', range: { min: 2, max: 98, minVisible: 2, maxVisible: 98, axisType: 'continuous' }, tickValues: tickValue2, tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'logarithmic',
                    base: 10,
                    min: Number(Math.pow(10, -2.8).toFixed(7)),
                    minVisible: Number(Math.pow(10, -2.8).toFixed(7)),
                    max: Number(Math.pow(10, 6.8).toFixed(5)),
                    maxVisible: Number(Math.pow(10, 6.8).toFixed(5))
                },
                tickValues: [10e-3, 10e-2, 10e-1, 10e0, 10e1, 10e2, 10e3, 10e4, 10e5]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 2,
                    minVisible: 2,
                    max: 98,
                    maxVisible: 98
                },
                tickValues: [10, 20, 30, 40, 50, 60, 70, 80, 90]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization logarithmic Axis with non logarithmic axis. Ticks adjusting. T603397', function(assert) {
    var tickValues1 = [1000, 10000, 100000],
        tickValue2 = [0, 100, 200, 300, 400];
    tickValues1.tickInterval = 1;
    tickValue2.tickInterval = 100;

    checkAxesSynchronization(assert, {
        axesOptions: [
            { type: 'logarithmic', range: { min: 1000, max: 100000, minVisible: 1000, base: 10, axisType: 'logarithmic' }, tickValues: tickValues1, tickInterval: 1 },
            { type: 'continuous', range: { min: 0, max: 400, minVisible: 0, axisType: 'continuous' }, tickValues: tickValue2, tickInterval: 100 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'logarithmic',
                    base: 10,
                    min: 1000,
                    minVisible: 1000,
                    max: 100000,
                    maxVisible: 100000
                },
                tickValues: [1000, 10000, 100000]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 400,
                    maxVisible: 400
                },
                tickValues: [0, 100, 200, 300, 400]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Synchronization two continuous axis. B250542', function(assert) {
    var tickValues1 = [-2, -1, 0, 1, 2, 3],
        tickValue2 = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    tickValues1.tickInterval = 1;
    tickValue2.tickInterval = 10;

    checkAxesSynchronization(assert, {
        axesOptions: [
            { type: 'continuous', range: { min: -2, max: 3, minVisible: -2, maxVisible: 3, axisType: 'continuous' }, tickValues: tickValues1, tickInterval: 1 },
            { type: 'continuous', range: { min: 2, max: 98, minVisible: 2, maxVisible: 98, axisType: 'continuous' }, tickValues: tickValue2, tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: -3.8,
                    minVisible: -3.8,
                    max: 5.8,
                    maxVisible: 5.8
                },
                tickValues: [-3, -2, -1, 0, 1, 2, 3, 4, 5]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 2,
                    minVisible: 2,
                    max: 98,
                    maxVisible: 98
                },
                tickValues: [10, 20, 30, 40, 50, 60, 70, 80, 90]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test("Add minor ticks", function(assert) {
    var tickValues1 = [0, 1, 2],
        tickValue2 = [0, 1, 2, 3];

    checkAxesSynchronization(assert, {
        axesOptions: [
            { type: 'continuous', range: { min: 0, max: 2, minVisible: 0, maxVisible: 2, axisType: 'continuous' }, tickValues: tickValues1, tickInterval: 1, minorTickValues: [0.5, 1.5], minorTickInterval: 0.5 },
            { type: 'continuous', range: { min: 0, max: 3, minVisible: 0, maxVisible: 3, axisType: 'continuous' }, tickValues: tickValue2, tickInterval: 1 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 3,
                    maxVisible: 3
                },
                tickValues: [0, 1, 2, 3],
                minorTickValues: [0.5, 1.5, 2.5]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 3,
                    maxVisible: 3
                },
                tickValues: [0, 1, 2, 3]
            }
        ],
        syncIndexes: [[0, 1]]
    });
});

QUnit.test('Do not syncronize axis with scalebreaks', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 10, breaks: [{ from: 3, to: 7 }], axisType: 'continuous' }, tickValues: [0, 2, 8, 10], tickInterval: 2 },
            { range: { min: 2, max: 6, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2 },
            { range: { min: 20, max: 50, axisType: 'continuous' }, tickValues: [20, 30, 40, 50, 60], tickInterval: 10 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10,
                    breaks: [{ from: 3, to: 7 }]
                },
                tickValues: [0, 2, 8, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 2,
                    minVisible: 2,
                    max: 8,
                    maxVisible: 8
                },
                tickValues: [2, 4, 6, 8]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 20,
                    minVisible: 20,
                    max: 50,
                    maxVisible: 50
                },
                tickValues: [20, 30, 40, 50]
            }
        ],
        syncIndexes: [[1, 2]]
    });
});

QUnit.test('Syncronize axis if scale breaks array is empty', function(assert) {
    checkAxesSynchronization(assert, {
        axesOptions: [
            { range: { min: 0, max: 10, breaks: [], axisType: 'continuous' }, tickValues: [0, 2, 4, 6, 8, 10], tickInterval: 2 },
            { range: { min: 2, max: 6, axisType: 'continuous' }, tickValues: [2, 4, 6, 8], tickInterval: 2 }
        ],
        axesOptionsAfterSync: [
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10,
                    breaks: []
                },
                tickValues: [0, 2, 4, 6, 8, 10]
            },
            {
                range: {
                    axisType: 'continuous',
                    min: 0,
                    minVisible: 0,
                    max: 10,
                    maxVisible: 10
                },
                tickValues: [0, 2, 4, 6, 8, 10]
            },
        ],
        syncIndexes: [[0, 1]]
    });
});
