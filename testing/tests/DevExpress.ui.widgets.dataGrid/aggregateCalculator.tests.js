import $ from 'jquery';
import AggregateCalculator from 'ui/data_grid/aggregate_calculator';

var customAggregator = {
    seed: 6,
    step: function(accumulator, value) {
        return accumulator - value;
    },
    finalize: function(result) {
        return result + 42;
    }
};

var customAggregatorForSecondGroup = {
    seed: function(groupIndex) {
        return groupIndex === 1 ? 6 : undefined;
    },
    step: function(accumulator, value) {
        return accumulator !== undefined ? accumulator - value : undefined;
    },
    finalize: function(result) {
        return result !== undefined ? result + 42 : undefined;
    }
};

var customAggregatorWithGlobalResult;
var customAggregatorWithGlobal = {
    seed: function() {
        customAggregatorWithGlobalResult = 6;
    },
    step: function(_, value) {
        customAggregatorWithGlobalResult -= value;
    },
    finalize: function(result) {
        return customAggregatorWithGlobalResult + 42;
    }
};

function createHierarchicalData() {
    return $.extend(true, [], [
        {
            key: '1',
            items: [
                {
                    key: '1.1',
                    items: [4, 6]
                },
                {
                    key: '1.2',
                    items: [5, 4]
                }
            ]
        },
        {
            key: '2',
            items: [
                {
                    key: '2.1',
                    items: [2, 3]
                }
            ]
        }
    ]);
}

QUnit.test('total aggregates for plain list', function(assert) {
    var calculator = new AggregateCalculator({
        data: [1, 2, 3],
        totalAggregates: [
            { aggregator: 'count' },
            { aggregator: 'sum', selector: 'this' },
            { aggregator: 'max', selector: 'this' },
            { aggregator: 'min', selector: 'this' },
            { aggregator: 'avg', selector: 'this' },
            { aggregator: customAggregator, selector: 'this' }
        ]
    });

    calculator.calculate();

    assert.deepEqual(calculator.totalAggregates(), [3, 6, 3, 1, 2, 42]);
});

QUnit.test('total aggregates for grouped list', function(assert) {
    var calculator = new AggregateCalculator({
        totalAggregates: [
            { aggregator: 'count' },
            { aggregator: 'avg', selector: 'this' }
        ],
        data: createHierarchicalData(),
        groupLevel: 2
    });

    calculator.calculate();

    assert.deepEqual(calculator.totalAggregates(), [6, 4]);
});

QUnit.test('group aggregates', function(assert) {
    var data = createHierarchicalData();
    var calculator = new AggregateCalculator({
        data: data,
        groupAggregates: [
            { aggregator: 'count' },
            { aggregator: 'sum', selector: 'this' },
            { aggregator: 'max', selector: 'this' },
            { aggregator: 'min', selector: 'this' },
            { aggregator: 'avg', selector: 'this' },
            { aggregator: customAggregator, selector: 'this' },
            { aggregator: customAggregatorForSecondGroup, selector: 'this' }
        ],
        groupLevel: 2
    });

    calculator.calculate();

    assert.deepEqual(data[0].aggregates, [4, 19, 6, 4, 4.75, 29, undefined]);
    assert.deepEqual(data[0].items[0].aggregates, [2, 10, 6, 4, 5, 38, 38]);
    assert.deepEqual(data[0].items[1].aggregates, [2, 9, 5, 4, 4.5, 39, 39]);

    assert.deepEqual(data[1].aggregates, [2, 5, 3, 2, 2.5, 43, undefined]);
    assert.deepEqual(data[1].items[0].aggregates, [2, 5, 3, 2, 2.5, 43, 43]);
});

QUnit.test('selectors', function(assert) {
    var data = [
        {
            items: [
                { value: 1 },
                { value: 3 }
            ]
        }
    ];
    var calculator = new AggregateCalculator({
        data: data,
        totalAggregates: [{ aggregator: 'sum', selector: 'value' }],
        groupAggregates: [{ aggregator: 'avg', selector: function(item) { return item.value; } }],
        groupLevel: 1
    });

    calculator.calculate();

    assert.deepEqual(calculator.totalAggregates(), [4]);
    assert.deepEqual(data[0].aggregates, [2]);
});

QUnit.test('empty total aggregates', function(assert) {
    var calculator = new AggregateCalculator({
        data: [],
        totalAggregates: []
    });

    calculator.calculate();

    assert.deepEqual(calculator.totalAggregates(), []);
});

QUnit.test('exception in case of incorrect aggregator name', function(assert) {
    assert.throws(
        function() {
            new AggregateCalculator({ data: [1], totalAggregates: [{ aggregator: 'Avg' }] }).calculate();
        },
        function(e) {
            return /E4001/.test(e.message);
        },
        'Exception messages should be readable'
    );
});

QUnit.test('total aggregates for empty list', function(assert) {
    var calculator = new AggregateCalculator({
        data: [],
        totalAggregates: [
            { aggregator: 'count' },
            { aggregator: 'sum', selector: 'this' },
            { aggregator: 'max', selector: 'this' },
            { aggregator: 'min', selector: 'this' },
            { aggregator: 'avg', selector: 'this' }
        ]
    });

    calculator.calculate();

    assert.deepEqual(calculator.totalAggregates(), [0, 0, NaN, NaN, NaN]);
});

QUnit.test('group aggregates for empty list', function(assert) {
    var data = [
        { items: [] },
        { items: [] }
    ];

    var calculator = new AggregateCalculator({
        data: data,
        groupAggregates: [
            { aggregator: 'count' },
            { aggregator: 'sum', selector: 'this' },
            { aggregator: 'max', selector: 'this' },
            { aggregator: 'min', selector: 'this' },
            { aggregator: 'avg', selector: 'this' }
        ],
        groupLevel: 1
    });

    calculator.calculate();

    assert.deepEqual(data, [
        {
            aggregates: [0, 0, NaN, NaN, NaN],
            items: []
        },
        {
            aggregates: [0, 0, NaN, NaN, NaN],
            items: []
        }
    ]);
});

QUnit.test('group aggregates should not calculates if groupLevel < 1', function(assert) {
    var result;
    var calculator = new AggregateCalculator({
        groupAggregates: [
            { aggregator: 'count' }
        ]
    });


    try {
        calculator.calculate();
        result = true;
    } catch(e) {
        result = false;
    }

    assert.ok(result);
});

QUnit.test('skipEmpty', function(assert) {
    var data = [{
        items: [
            { foo: 1 },
            { foo: '' },
            { foo: NaN },
            { foo: null },
            { foo: 12345 },
            { foo: undefined }]
    }];

    var aggregator = {
        seed: [],
        step: function(accumulator, value) {
            return accumulator.concat(value);
        }
    };

    var calculator = new AggregateCalculator({
        data: data,
        groupLevel: 1,

        groupAggregates: [
            {
                selector: 'foo',
                aggregator: aggregator,
                skipEmptyValues: true
            },
            {
                selector: 'foo',
                aggregator: aggregator,
                skipEmptyValues: false
            }
        ],

        totalAggregates: [
            {
                selector: 'foo',
                aggregator: aggregator,
                skipEmptyValues: true
            },
            {
                selector: 'foo',
                aggregator: aggregator,
                skipEmptyValues: false
            }
        ]
    });

    calculator.calculate();

    assert.deepEqual(data[0].aggregates, [[1, 12345], [1, '', NaN, null, 12345, undefined]]);
    assert.deepEqual(calculator.totalAggregates(), [[1, 12345], [1, '', NaN, null, 12345, undefined]]);
});

QUnit.test('skipEmpty ignored in case of count', function(assert) {
    var data = [{
        items: [
            { foo: 1 },
            { foo: '' },
            { foo: NaN },
            { foo: null },
            { foo: 12345 },
            { foo: undefined }]
    }];

    var calculator = new AggregateCalculator({
        data: data,
        groupLevel: 1,

        groupAggregates: [
            {
                selector: 'foo',
                aggregator: 'count',
                skipEmptyValues: true
            },
            {
                selector: 'foo',
                aggregator: 'count',
                skipEmptyValues: false
            }
        ],

        totalAggregates: [
            {
                selector: 'foo',
                aggregator: 'count',
                skipEmptyValues: true
            },
            {
                selector: 'foo',
                aggregator: 'count',
                skipEmptyValues: false
            }
        ]
    });

    calculator.calculate();

    assert.deepEqual(data[0].aggregates, [6, 6]);
    assert.deepEqual(calculator.totalAggregates(), [6, 6]);
});

QUnit.test('global variables (see T353923)', function(assert) {
    var data = createHierarchicalData();
    var calculator = new AggregateCalculator({
        data: data,
        groupAggregates: [
            { aggregator: customAggregator, selector: 'this' },
            { aggregator: customAggregatorWithGlobal, selector: 'this' }
        ],
        groupLevel: 2
    });

    calculator.calculate();

    assert.deepEqual(data[0].aggregates, [29, 29]);
    assert.deepEqual(data[0].items[0].aggregates, [38, 38]);
    assert.deepEqual(data[0].items[1].aggregates, [39, 39]);

    assert.deepEqual(data[1].aggregates, [43, 43]);
    assert.deepEqual(data[1].items[0].aggregates, [43, 43]);
});
