import '../../content/orders.js';
import 'common/data/odata/store';

import $ from 'jquery';
import { noop } from 'core/utils/common';
import { LocalStore } from 'ui/pivot_grid/local_store';
import { sort } from 'ui/pivot_grid/data_source.utils';
import pivotGridUtils from 'ui/pivot_grid/ui.pivot_grid.utils';
import config from 'core/config';
import formatHelper from 'format_helper';
import ajaxMock from '../../helpers/ajaxMock.js';

const moduleConfig = {
    beforeEach: function() {
        this.store = new LocalStore(window.orders);
        this.load = function(options) {
            return this.store.load(options).done(function(data) {
                sort(options, data);
            });
        };
    }
};

QUnit.testDone(function() {
    ajaxMock.clear();
});

QUnit.module('Local Store Initialization', () => {

    QUnit.test('Array', function(assert) {
        this.store = new LocalStore(window.orders);

        this.store.load({
            columns: [{ dataField: 'ShipCountry' }],
            values: [{ summaryType: 'count' }]
        }).done(function(result) {
            assert.equal(result.columns.length, 21);
        });
    });

    QUnit.test('Custom Store', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const store = new LocalStore({
            load: function() {
                return d;
            },
            key: 10
        });

        store.load({
            columns: [{ dataField: 'ShipCountry' }],
            values: [{ summaryType: 'count' }]
        }).done(function(result) {
            assert.equal(result.columns.length, 21);
            assert.strictEqual(store.key(), 10);
        }).always(done);

        d.resolve(window.orders);

    });

    QUnit.test('OData Store', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        ajaxMock.setup({
            url: '/mock-odata',
            responseText: { 'd': [{ 'group': 'a' }, { 'group': 'a' }, { 'group': 'b' }, { 'group': 'c' }, { 'group': 'c' }] }
        });

        this.store = new LocalStore({
            store: {
                type: 'odata',
                url: '/mock-odata'
            }
        });

        this.store.load({
            columns: [{ dataField: 'group' }],
            values: [{ summaryType: 'count' }]
        }).done(function(result) {
            assert.equal(result.columns.length, 3);
            assert.equal(result.columns[0].value, 'a');
            assert.equal(result.columns[1].value, 'b');
            assert.equal(result.columns[2].value, 'c');
        }).always(done);

        d.resolve(window.orders);
    });

    QUnit.test('Filter', function(assert) {
        this.store = new LocalStore({
            store: {
                type: 'array',
                data: window.orders
            },
            filter: ['ShipCountry', '=', 'USA']
        });

        this.store.load({
            columns: [{ dataField: 'ShipCountry' }],
            values: [{ summaryType: 'count' }]
        }).done(function(result) {
            assert.equal(result.columns.length, 1);
        });
    });

    QUnit.test('Filter by date', function(assert) {
        this.store = new LocalStore({
            store: {
                type: 'array',
                data: window.orders,
            },
            filter: ['OrderDate', '=', new Date('1996/07/09')]
        });

        this.store.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date' }],
            values: [{ summaryType: 'count' }]
        }).done(function(result) {
            assert.equal(result.columns.length, 1);
        });
    });

    QUnit.test('Filter by date set as second parameter', function(assert) {
        this.store = new LocalStore({
            store: {
                type: 'array',
                data: window.orders,
            },
            filter: ['OrderDate', new Date('1996/07/09')]
        });

        this.store.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date' }],
            values: [{ summaryType: 'count' }]
        }).done(function(result) {
            assert.equal(result.columns.length, 1);
        });
    });

    QUnit.test('Filter by date set as string', function(assert) {
        this.store = new LocalStore({
            store: {
                type: 'array',
                data: window.orders,
            },
            filter: ['OrderDate', '=', '1996/07/09']
        });

        this.store.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date' }],
            values: [{ summaryType: 'count' }]
        }).done(function(result) {
            assert.equal(result.columns.length, 1);
        });
    });

    QUnit.test('Fail on load', function(assert) {
        assert.expect(1);

        const store = new LocalStore({
            load: function() {
                return $.Deferred().reject();
            }
        });

        store.load({
            rows: [],
            columns: []
        }).fail(function() {
            assert.ok(true);
        }).done(function() {
            assert.ok(false);
        });
    });
});

QUnit.module('Array Local Store', moduleConfig, () => {

    QUnit.test('Async loading when more 10000 items', function(assert) {
        const items = [];


        for(let i = 0; i < 20000; i++) {
            items.push({ name: 'test' + i });
        }

        this.store = new LocalStore({
            store: items,
            onProgressChanged: function(progress) {
                progresses.push(Math.floor(progress * 100));
            }
        });

        const clock = sinon.useFakeTimers();

        let doneCalled;
        const progresses = [];
        this.store.load({
            rows: [{
                selector: function(data) {
                    if(data.name === 'test5000') {
                        clock.tick(500);
                    }
                    return data.name;
                }
            }],
            values: [{ summaryType: 'count' }]
        }).done(function(result) {
            doneCalled = true;
            // assert
            assert.equal(result.columns.length, 0);
            assert.equal(result.rows.length, 20000);
            assert.equal(result.values.length, 20001);
        });

        // assert
        assert.notOk(doneCalled, 'load is not completed');

        // act
        clock.tick(10);

        // assert
        assert.ok(doneCalled, 'load is completed');
        assert.deepEqual(progresses, [50, 100], 'progress values');

        clock.restore();
    });

    QUnit.test('Columns and rows with string dataField', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 21, 'columns count');
            assert.equal(data.columns[0].value, 'Argentina');
            assert.equal(data.columns[0].index, 21, 'Argentina index');
            assert.equal(data.columns[20].value, 'Venezuela');

            assert.equal(data.rows.length, 3, 'rows count');
            assert.equal(data.rows[0].value, 1);
            assert.equal(data.rows[0].index, 2, 'ShipVia 1 index');
            assert.equal(data.rows[1].value, 2);
            assert.equal(data.rows[2].value, 3);

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 4, 'cells row count');
            assert.strictEqual(data.values[0].length, 22, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');
            assert.strictEqual(data.values[0][0][0], 830, 'GT - GT');

            assert.strictEqual(data.values[2][21][0], 5, 'ShipVia 1 - Argentina');
            assert.strictEqual(data.values[2][0][0], 249, 'ShipVia 1 - GT');
            assert.strictEqual(data.values[0][21][0], 16, 'GT - Argentina');
        });
    });

    QUnit.test('Group interval year & month', function(assert) {
        this.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'year' }],
            rows: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'month' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3, 'columns count');
            assert.equal(data.columns[0].value, 1996);
            assert.equal(data.columns[0].index, 1, '1996 index');
            assert.equal(data.columns[1].value, 1997);
            assert.equal(data.columns[2].value, 1998);

            assert.equal(data.rows.length, 12, 'rows count');
            assert.equal(data.rows[0].value, 1, 'january value');
            assert.equal(data.rows[0].index, 7, 'january index');
            assert.equal(data.rows[11].value, 12, 'december value');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 13, 'cells row count');
            assert.strictEqual(data.values[0].length, 4, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');

            assert.strictEqual(data.values[0][0][0], 830, 'GT - GT');
            assert.strictEqual(data.values[0][1][0], 152, '1996 - GT');
            assert.strictEqual(data.values[7][0][0], 88, 'GT - January');
            assert.strictEqual(data.values[7][1], undefined, '1996 - January');
        });
    });

    QUnit.test('Group interval year & month with filter', function(assert) {
        this.store = new LocalStore({
            store: {
                type: 'array',
                data: window.orders,
            },
            filter: ['OrderDate', '=', new Date('1996/07/09')]
        });

        this.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'year', expanded: true },
                { dataField: 'OrderDate', dataType: 'date', groupInterval: 'month' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 1, 'columns count');
            assert.equal(data.columns[0].value, 1996);
        });
    });

    QUnit.test('Group interval quarter & dayOfWeek', function(assert) {
        this.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'quarter' }],
            rows: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'dayOfWeek' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 4, 'columns count');
            assert.equal(data.columns[0].value, 1);
            assert.equal(data.columns[0].index, 3, 'Q1 index');
            assert.equal(data.columns[1].value, 2);
            assert.equal(data.columns[2].value, 3);
            assert.equal(data.columns[3].value, 4);

            assert.equal(data.rows.length, 5, 'rows count');
            assert.equal(data.rows[0].value, 1, 'monday value');
            assert.equal(data.rows[0].index, 3, 'monday index');
            assert.equal(data.rows[4].value, 5, 'friday value');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 6, 'cells row count');
            assert.strictEqual(data.values[0].length, 5, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');

            assert.strictEqual(data.values[0][0][0], 830, 'GT - GT');
            assert.strictEqual(data.values[0][3][0], 274, 'GT - monday');
            assert.strictEqual(data.values[3][0][0], 165, 'Q1 - GT');
            assert.strictEqual(data.values[3][3][0], 55, 'Q1 - monday');
        });
    });

    QUnit.test('Group interval day', function(assert) {
        this.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'day' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 31, 'columns count');
            assert.equal(data.columns[0].value, 1);
            assert.equal(data.columns[0].index, 21, 'day 1 index');
            assert.equal(data.columns[30].value, 31);

            assert.equal(data.rows.length, 0, 'rows count');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 1, 'cells row count');
            assert.strictEqual(data.values[0].length, 32, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');

            assert.strictEqual(data.values[0][0][0], 830, 'GT - GT');
            assert.strictEqual(data.values[0][21][0], 26, 'GT - day 1');
        });
    });

    QUnit.test('Wrong groupInterval', function(assert) {
        this.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'wrong' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 480, 'columns count');
            assert.deepEqual(data.columns[0].value, new Date(1996, 6, 4));

            assert.equal(data.rows.length, 0, 'rows count');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 1, 'cells row count');
            assert.strictEqual(data.values[0].length, 481, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');

            assert.strictEqual(data.values[0][0][0], 830, 'GT - GT');
            assert.strictEqual(data.values[0][1][0], 1, 'GT - first date');
        });
    });

    QUnit.test('Numeric intervals. Wrong groupInterval', function(assert) {
        this.load({
            columns: [{ dataField: 'Freight', dataType: 'number', groupInterval: 'wrong' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 799, 'columns count');
            assert.strictEqual(data.columns[0].value, 0.02);

            assert.equal(data.rows.length, 0, 'rows count');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 1, 'cells row count');
            assert.strictEqual(data.values[0].length, 800, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');

            assert.strictEqual(data.values[0][0][0], 830, 'GT - GT');
            assert.strictEqual(data.values[0][1][0], 1, 'GT - first data');
        });
    });

    QUnit.test('Numeric intervals. interval is 0', function(assert) {
        this.load({
            columns: [{ dataField: 'Freight', dataType: 'number', groupInterval: 0 }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 799, 'columns count');
            assert.strictEqual(data.columns[0].value, 0.02);

            assert.equal(data.rows.length, 0, 'rows count');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 1, 'cells row count');
            assert.strictEqual(data.values[0].length, 800, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');

            assert.strictEqual(data.values[0][0][0], 830, 'GT - GT');
            assert.strictEqual(data.values[0][1][0], 1, 'GT - first data');
        });
    });

    QUnit.test('Numeric intervals. interval is < 1', function(assert) {
        this.load({
            columns: [{ dataField: 'Freight', dataType: 'number', groupInterval: 0.01 }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 794, 'columns count');
            assert.strictEqual(data.columns[0].value, 0.02);
            assert.strictEqual(data.columns[1].value, 0.12);

            assert.equal(data.rows.length, 0, 'rows count');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 1, 'cells row count');
            assert.strictEqual(data.values[0].length, 795, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');

            assert.strictEqual(data.values[0][0][0], 830, 'GT - GT');
            assert.strictEqual(data.values[0][1][0], 1, 'GT - first data');
        });
    });

    QUnit.test('Numeric intervals. Numeric interval', function(assert) {
        this.load({
            columns: [{ dataField: 'Freight', dataType: 'number', groupInterval: 100 }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 10, 'columns count');
            assert.strictEqual(data.columns[0].value, 0, '[0-100)');
            assert.strictEqual(data.columns[1].value, 100, '[100-1000)');

            assert.equal(data.rows.length, 0, 'rows count');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 1, 'cells row count');
            assert.strictEqual(data.values[0].length, 11, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');

            assert.strictEqual(data.values[0][0][0], 830, 'GT - GT');
            assert.strictEqual(data.values[0][1][0], 643, 'GT - first data');
        });
    });

    QUnit.test('Numeric intervals. Custom customizeText callback', function(assert) {
        const customizeFunc = function() { };
        const field = { dataField: 'Freight', dataType: 'number', groupInterval: 100, customizeText: customizeFunc };
        this.load({
            columns: [field],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(field.customizeText, customizeFunc);
        });
    });

    QUnit.test('Numeric intervals. Without custom customizeText callback', function(assert) {
        const field = { dataField: 'Freight', dataType: 'number', groupInterval: 100 };
        this.load({
            columns: [field],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(field.customizeText({
                value: 0,
                valueText: '0'
            }), '0 - 100');
        });
    });

    QUnit.test('Numeric intervals. With format and without custom customizeText callback', function(assert) {
        const field = { dataField: 'Freight', dataType: 'number', groupInterval: 100, format: { type: 'currency', precision: 2 } };
        this.load({
            columns: [field],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            sinon.stub(formatHelper, 'format');
            formatHelper.format.returns('$100');


            assert.strictEqual(field.customizeText({
                value: 0,
                valueText: '$0'
            }), '$0 - $100');

            assert.deepEqual(formatHelper.format.lastCall.args, [100, { type: 'currency', precision: 2 }]);

            assert.strictEqual(field.customizeText({
                value: 0,
                valueText: ''
            }), '', 'first value not formatting');
            assert.deepEqual(formatHelper.format.lastCall.args, [100, { type: 'currency', precision: 2 }]);

            formatHelper.format.returns('');

            assert.strictEqual(field.customizeText({
                value: 0,
                valueText: '$0'
            }), '', 'second value not formatting');

            formatHelper.format.restore();
        });
    });

    QUnit.test('Date intervals formatting', function(assert) {
        const fields = [
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'quarter' },
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'month' },
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'dayOfWeek' },
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'day' },
        ];
        this.load({
            columns: fields,
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[0]), 'Q1', 'quarter 1');
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[1]), 'January', 'month 1');
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[2]), 'Monday', 'dayOfWeek 1');
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[3]), '1', 'day 1');
        });
    });


    QUnit.test('Summary types', function(assert) {
        this.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'year' }],
            values: [{ summaryType: 'count' }, { dataField: 'Freight', dataType: 'number', summaryType: 'sum' }, { dataField: 'Freight', dataType: 'number', summaryType: 'avg' }, { dataField: 'Freight', dataType: 'number', summaryType: 'min' }, { dataField: 'Freight', dataType: 'number', summaryType: 'max' }, { dataField: 'Freight', dataType: 'number', summaryType: 'wrong' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3, 'columns count');
            assert.equal(data.columns[0].value, 1996);
            assert.equal(data.columns[0].index, 1, '1996 index');
            assert.equal(data.columns[1].value, 1997);
            assert.equal(data.columns[2].value, 1998);

            assert.equal(data.rows.length, 0, 'rows count');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 1, 'cells row count');
            assert.strictEqual(data.values[0].length, 4, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 6, 'measures count');

            const arrayToFixed = function(array, precision) {
                for(let i = 0; i < array.length; i++) {
                    array[i] = Number(array[i].toFixed(precision));
                }
                return array;
            };

            assert.deepEqual(arrayToFixed(data.values[0][0], 2), [830, 64942.69, 78.24, 0.02, 1007.64, 830], 'GT - measures');
            assert.deepEqual(arrayToFixed(data.values[0][1], 2), [152, 10279.87, 67.63, 0.12, 890.78, 152], '1996 - measures');
        });
    });

    QUnit.test('groupField in the values', function(assert) {
        this.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'year' }],
            values: [{
                dataField: 'Freight', dataType: 'number', summaryType: 'sum', groupName: 'MyGroup', levels: [
                    { dataField: 'Freight', groupInterval: 100, groupIndex: 0 },
                    { dataField: 'Freight', groupInterval: 10, groupIndex: 1 }
                ]
            }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3, 'columns count');
            assert.equal(data.columns[0].value, 1996);
            assert.equal(data.columns[0].index, 1, '1996 index');
            assert.equal(data.columns[1].value, 1997);
            assert.equal(data.columns[2].value, 1998);

            assert.equal(data.rows.length, 0, 'rows count');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 1, 'cells row count');
            assert.strictEqual(data.values[0].length, 4, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');

            const arrayToFixed = function(array, precision) {
                for(let i = 0; i < array.length; i++) {
                    array[i] = Number(array[i].toFixed(precision));
                }
                return array;
            };

            assert.deepEqual(arrayToFixed(data.values[0][0], 2), [64942.69], 'GT - summary');
            assert.deepEqual(arrayToFixed(data.values[0][1], 2), [10279.87], '1996 - summary');
        });
    });

    QUnit.test('Custom summary aggregation', function(assert) {
        const calculateCustomSummaryProcess = {
            start: [],
            calculate: [],
            finalize: []
        };
        const calculateCustomSummary = function(options) {
            calculateCustomSummaryProcess[options.summaryProcess].push(options);
            options.totalValue = options.totalValue || 0;
            options.totalValue++;
        };
        const field = {
            dataField: 'Freight',
            summaryType: 'custom',
            calculateCustomSummary: calculateCustomSummary
        };

        this.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'year' }],
            values: [{
                summaryType: 'custom',
                calculateCustomSummary: function(options) {
                    options.totalValue = 1;
                }
            },
            field,
            {
                dataField: 'Freight',
                dataType: 'number',
                summaryType: 'custom',
                calculateCustomSummary: noop
            },
            {
                dataField: 'Freight',
                dataType: 'number',
                summaryType: 'custom'
            }
            ]
        }).done(function(data) {
            assert.equal(data.columns.length, 3, 'columns count');
            assert.equal(data.columns[0].value, 1996);
            assert.equal(data.columns[0].index, 1, '1996 index');
            assert.equal(data.columns[1].value, 1997);
            assert.equal(data.columns[2].value, 1998);

            assert.equal(data.rows.length, 0, 'rows count');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 1, 'cells row count');
            assert.strictEqual(data.values[0].length, 4, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 4, 'measures count');

            assert.deepEqual(data.values[0][0], [1, 832, undefined, undefined], 'GT - measures');
            assert.deepEqual(data.values[0][1], [1, 154, undefined, undefined], '1996 - measures');

            assert.strictEqual(calculateCustomSummaryProcess.start.length, 4);
            assert.strictEqual(calculateCustomSummaryProcess.calculate.length, 1660);
            assert.strictEqual(calculateCustomSummaryProcess.finalize.length, 4);
        });
    });

    QUnit.test('Custom summary aggregation calculation', function(assert) {
        this.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'year' }],
            values: [
                { dataField: 'Freight', dataType: 'number', summaryType: 'avg', format: 'fixedPoint', precision: 2, area: 'data', name: 'etalon' },
                {
                    dataField: 'Freight', dataType: 'number', summaryType: 'custom',
                    calculateCustomSummary: function(options) {
                        if(options.summaryProcess === 'start') {
                        // Initializing "totalValue" here
                            options.totalValue = [0, 0];
                        }
                        if(options.summaryProcess === 'calculate') {
                        // Modifying "totalValue" here
                            options.totalValue[0] = options.totalValue[0] + options.value;
                            options.totalValue[1] = options.totalValue[1] + 1;
                        }
                        if(options.summaryProcess === 'finalize') {
                        // Assigning the final value to "totalValue" here
                            options.totalValue = options.totalValue[0] / options.totalValue[1];
                        }
                    }, format: 'fixedPoint', precision: 2, area: 'data', name: 'Custom Field 1'
                },
                {
                    dataField: 'Freight', dataType: 'number', summaryType: 'custom',
                    calculateCustomSummary: function(options) {
                        if(options.summaryProcess === 'start') {
                        // Initializing "totalValue" here
                            options.totalValue = 0;
                            options.count = 0;
                        }
                        if(options.summaryProcess === 'calculate') {
                        // Modifying "totalValue" here
                            options.totalValue += options.value;
                            options.count++;
                        }
                        if(options.summaryProcess === 'finalize') {
                        // Assigning the final value to "totalValue" here
                            options.totalValue /= options.count;
                        }
                    }, caption: 'Custom Avg Freight', format: 'fixedPoint', precision: 2, area: 'data', name: 'Custom Field 2'
                },
                {
                    dataField: 'Freight', dataType: 'number', summaryType: 'custom',
                    calculateCustomSummary: function(options) {
                        if(options.summaryProcess === 'start') {
                        // Initializing "totalValue" here
                            options.totalValue = [0, 0];
                        }
                        if(options.summaryProcess === 'calculate') {
                        // Modifying "totalValue" here
                            options.totalValue = [options.totalValue[0] + options.value, options.totalValue[1] + 1 ];

                        }
                        if(options.summaryProcess === 'finalize') {
                        // Assigning the final value to "totalValue" here
                            options.totalValue = options.totalValue[0] / options.totalValue[1];
                        }
                    }, caption: 'Custom Avg Freight', format: 'fixedPoint', precision: 2, area: 'data', name: 'Custom Field 3'
                }
            ]
        }).done(function(data) {
            $.each(data.values[0], function(_, valueCells) {
                assert.strictEqual(valueCells.length, 4);
                assert.strictEqual(valueCells[1], valueCells[0], 'custom Field 1');
                assert.strictEqual(valueCells[2], valueCells[0], 'custom Field 2');
                assert.strictEqual(valueCells[3], valueCells[0], 'custom Field 3');
            });

        });
    });

    QUnit.test('Local store with empty array', function(assert) {
        const store = new LocalStore([]);

        store.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'year' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [
                { summaryType: 'count' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'sum' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'avg' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'min' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'max' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'wrong' },
                {
                    dataField: 'Freight', dataType: 'number', summaryType: 'custom',
                    calculateCustomSummary: function(options) {
                        if(options.summaryProcess === 'start') {
                        // Initializing "totalValue" here
                            options.totalValue = [0, 0];
                        }
                        if(options.summaryProcess === 'calculate') {
                        // Modifying "totalValue" here
                            options.totalValue[0] = options.totalValue[0] + options.value;
                            options.totalValue[1] = options.totalValue[1] + 1;
                        }
                        if(options.summaryProcess === 'finalize') {
                        // Assigning the final value to "totalValue" here
                            options.totalValue = options.totalValue[0] / options.totalValue[1];
                        }
                    }, format: 'fixedPoint', precision: 2, area: 'data', name: 'Custom Field 1'
                }
            ]
        }).done(function(data) {
            assert.equal(data.columns.length, 0, 'columns count');
            assert.equal(data.rows.length, 0, 'rows count');
            assert.deepEqual(data.values, []);
        });
    });

    QUnit.test('Calculate count with expanded header when header values are undefined', function(assert) {
        const store = new LocalStore([{}]);

        store.load({
            columns: [],
            rows: [
                { dataField: 'ShipCity', expanded: true },
                { dataField: 'ShipName' }
            ],
            values: [
                { summaryType: 'count' }
            ]
        }).done(function(data) {
            assert.equal(data.columns.length, 0, 'columns count');
            assert.equal(data.rows.length, 1, 'rows count');
            assert.deepEqual(data.values, [[[1]], [[1]], [[1]]]);
        });
    });

    QUnit.test('Expand column', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }],
            headerName: 'columns',
            path: ['Spain']
        }).done(function(data) {
            assert.equal(data.columns.length, 3, 'columns count');
            assert.equal(data.columns[0].value, 'Barcelona');
            assert.equal(data.columns[0].index, 3, 'Barcelona index');
            assert.equal(data.columns[1].value, 'Madrid');
            assert.equal(data.columns[2].value, 'Sevilla');

            assert.equal(data.rows.length, 3, 'rows count');
            assert.equal(data.rows[0].value, 1);
            assert.equal(data.rows[0].index, 1, 'ShipVia 1 index');
            assert.equal(data.rows[1].value, 2);
            assert.equal(data.rows[2].value, 3);

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 4, 'cells row count');
            assert.strictEqual(data.values[0].length, 4, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');
            assert.strictEqual(data.values[0][0][0], 23, 'GT - GT');

            assert.strictEqual(data.values[1][3][0], 2, 'ShipVia 1 - Barcelona');
            assert.strictEqual(data.values[1][0][0], 9, 'ShipVia 1 - GT');
            assert.strictEqual(data.values[0][3][0], 5, 'GT - Barcelona');
        });
    });

    QUnit.test('Expand  date field', function(assert) {
        this.load({
            path: [new Date('1996/07/04')],
            rows: [
                {
                    dataType: 'date',
                    selector: function(data) {
                        const d = new Date(data.OrderDate);
                        return d;
                    }
                },
                { dataField: 'ShipCountry' }
            ],
            columns: [],
            values: [{ summaryType: 'count' }],
            headerName: 'rows'
        }).done(function(data) {
            assert.equal(data.columns.length, 0, 'columns count');
            assert.equal(data.rows.length, 1);

            assert.equal(data.rows[0].value, 'France');
        });
    });

    QUnit.test('Expand undefined value', function(assert) {
        this.load({
            path: [undefined],
            rows: [
                {
                    dataField: 'missedField'
                },
                { dataField: 'ShipCountry' }
            ],
            columns: [],
            values: [{ summaryType: 'count' }],
            headerName: 'rows'
        }).done(function(data) {
            assert.equal(data.columns.length, 0, 'columns count');
            assert.equal(data.rows.length, 21);
        });
    });

    QUnit.test('Expanded column', function(assert) {
        this.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'year', expanded: true }, { dataField: 'OrderDate', dataType: 'date', groupInterval: 'month', expanded: true }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3, 'columns count');
            assert.equal(data.columns[0].value, 1996);
            assert.equal(data.columns[0].index, 1, '1996 index');
            assert.equal(data.columns[0].children.length, 6, '1996 months count');
            assert.equal(data.columns[1].value, 1997);
            assert.equal(data.columns[1].index, 8, '1997 index');
            assert.equal(data.columns[1].children.length, 12, '1997 months count');
            assert.equal(data.columns[1].children[0].value, 1, '1997 January value');
            assert.equal(data.columns[1].children[0].index, 9, '1997 January index');
            assert.equal(data.columns[2].value, 1998);
            assert.equal(data.columns[2].index, 21, '1998 index');
            assert.equal(data.columns[2].children.length, 5, '1998 months count');

            assert.equal(data.rows.length, 3, 'rows count');
            assert.equal(data.rows[0].value, 1);
            assert.equal(data.rows[0].index, 2, 'ShipVia 1 index');
            assert.equal(data.rows[1].value, 2);
            assert.equal(data.rows[2].value, 3);

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 4, 'cells row count');
            assert.strictEqual(data.values[0].length, 27, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');
            assert.strictEqual(data.values[0][0][0], 830, 'GT - GT');

            assert.strictEqual(data.values[0][8][0], 408, 'GT - 1997');
            assert.strictEqual(data.values[2][8][0], 133, 'ShipVia 1 - 1997');
            assert.strictEqual(data.values[2][9][0], 14, 'ShipVia 1 - 1997 January');
            assert.strictEqual(data.values[2][21][0], 78, 'ShipVia 1 - 1998');
        });
    });

    QUnit.test('Expanded column after expanding', function(assert) {
        this.load({
            columns: [
                { dataField: 'OrderDate', dataType: 'date', groupInterval: 'year' },
                { dataField: 'OrderDate', dataType: 'date', groupInterval: 'quarter', expanded: true },
                { dataField: 'OrderDate', dataType: 'date', groupInterval: 'month' }
            ],
            headerName: 'columns',
            path: [1997],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 4, 'columns count');
            assert.equal(data.columns[0].value, 1);
            assert.equal(data.columns[0].index, 1, 'Q1 index');
            assert.equal(data.columns[0].children.length, 3, 'Q1 months count');
            assert.equal(data.columns[0].children[0].index, 2, 'Q1 January index');
            assert.equal(data.columns[1].value, 2);
            assert.equal(data.columns[1].index, 5, 'Q2 index');
            assert.equal(data.columns[1].children.length, 3, 'Q2 months count');
            assert.equal(data.columns[2].value, 3);
            assert.equal(data.columns[2].index, 9, 'Q4 index');
            assert.equal(data.columns[2].children.length, 3, 'Q4 months count');

            assert.equal(data.rows.length, 3, 'rows count');
            assert.equal(data.rows[0].value, 1);
            assert.equal(data.rows[0].index, 2, 'ShipVia 1 index');
            assert.equal(data.rows[1].value, 2);
            assert.equal(data.rows[2].value, 3);

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 4, 'cells row count');
            assert.strictEqual(data.values[0].length, 17, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');

            assert.strictEqual(data.values[0][0][0], 408, 'GT - 1997');
            assert.strictEqual(data.values[2][0][0], 133, 'ShipVia 1 - 1997');
            assert.strictEqual(data.values[2][1][0], 26, 'ShipVia 1 - 1997 Q1');
            assert.strictEqual(data.values[2][2][0], 14, 'ShipVia 1 - 1997 Q1 January');
        });
    });

    QUnit.test('Expand row', function(assert) {
        this.load({
            rows: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }],
            columns: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }],
            headerName: 'rows',
            path: ['Spain']
        }).done(function(data) {
            assert.equal(data.rows.length, 3, 'rows count');
            assert.equal(data.rows[0].value, 'Barcelona');
            assert.equal(data.rows[0].index, 3, 'Barcelona index');
            assert.equal(data.rows[1].value, 'Madrid');
            assert.equal(data.rows[2].value, 'Sevilla');

            assert.equal(data.columns.length, 3, 'columns count');
            assert.equal(data.columns[0].value, 1);
            assert.equal(data.columns[0].index, 1, 'ShipVia 1 index');
            assert.equal(data.columns[1].value, 2);
            assert.equal(data.columns[2].value, 3);

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 4, 'cells row count');
            assert.strictEqual(data.values[0].length, 4, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');
            assert.strictEqual(data.values[0][0][0], 23, 'GT - GT');

            assert.strictEqual(data.values[3][1][0], 2, 'ShipVia 1 - Barcelona');
            assert.strictEqual(data.values[0][1][0], 9, 'ShipVia 1 - GT');
            assert.strictEqual(data.values[3][0][0], 5, 'GT - Barcelona');
        });
    });

    QUnit.test('Expanded row', function(assert) {
        this.load({
            rows: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'year', expanded: true }, { dataField: 'OrderDate', dataType: 'date', groupInterval: 'month', expanded: true }],
            columns: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.rows.length, 3, 'rows count');
            assert.equal(data.rows[0].value, 1996);
            assert.equal(data.rows[0].index, 1, '1996 index');
            assert.equal(data.rows[0].children.length, 6, '1996 months count');
            assert.equal(data.rows[1].value, 1997);
            assert.equal(data.rows[1].index, 8, '1997 index');
            assert.equal(data.rows[1].children.length, 12, '1997 months count');
            assert.equal(data.rows[1].children[0].value, 1, '1997 January value');
            assert.equal(data.rows[1].children[0].index, 9, '1997 January index');
            assert.equal(data.rows[2].value, 1998);
            assert.equal(data.rows[2].index, 21, '1998 index');
            assert.equal(data.rows[2].children.length, 5, '1998 months count');

            assert.equal(data.columns.length, 3, 'columns count');
            assert.equal(data.columns[0].value, 1);
            assert.equal(data.columns[0].index, 2, 'ShipVia 1 index');
            assert.equal(data.columns[1].value, 2);
            assert.equal(data.columns[2].value, 3);

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 27, 'cells row count');
            assert.strictEqual(data.values[0].length, 4, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');
            assert.strictEqual(data.values[0][0][0], 830, 'GT - GT');

            assert.strictEqual(data.values[8][0][0], 408, 'GT - 1997');
            assert.strictEqual(data.values[8][2][0], 133, 'ShipVia 1 - 1997');
            assert.strictEqual(data.values[9][2][0], 14, 'ShipVia 1 - 1997 January');
            assert.strictEqual(data.values[21][2][0], 78, 'ShipVia 1 - 1998');
        });
    });

    QUnit.test('Expand row on several levels', function(assert) {
        this.load({
            rows: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }, { dataField: 'ShipName' }],
            values: [{ summaryType: 'count' }],
            headerName: 'rows',
            path: ['Spain', 'Madrid']
        }).done(function(data) {
            assert.equal(data.rows.length, 2, 'rows count');
            assert.equal(data.rows[0].value, 'Bolido Comidas preparadas');
            assert.equal(data.rows[0].index, 2, 'Bolido Comidas preparadas index');
            assert.equal(data.rows[1].value, 'Romero y tomillo');

            assert.equal(data.columns.length, 0, 'columns count');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 3, 'cells row count');
            assert.strictEqual(data.values[0].length, 1, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');
            assert.strictEqual(data.values[0][0][0], 8, 'GT - GT');

            assert.strictEqual(data.values[1][0][0], 5, 'Bolido - GT');
            assert.strictEqual(data.values[2][0][0], 3, 'Romero - GT');
        });
    });


    QUnit.test('Expand column & row', function(assert) {
        this.load({
            rows: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }],
            columns: [{ dataField: 'ShipVia' }, { dataField: 'CustomerID' }],
            values: [{ summaryType: 'count' }],
            headerName: 'rows',
            columnExpandedPaths: [[1]],
            path: ['Spain']
        }).done(function(data) {
            assert.equal(data.rows.length, 3, 'rows count');
            assert.equal(data.rows[0].value, 'Barcelona');
            assert.equal(data.rows[0].index, 3, 'Barcelona index');
            assert.equal(data.rows[1].value, 'Madrid');
            assert.equal(data.rows[2].value, 'Sevilla');

            assert.equal(data.columns.length, 3, 'columns count');
            assert.equal(data.columns[0].value, 1);
            assert.equal(data.columns[0].index, 1, 'ShipVia 1 index');
            assert.ok(data.columns[0].children, 'ShipVia 1 has children');
            assert.equal(data.columns[0].children.length, 4, 'ShipVia 1 children count');
            assert.equal(data.columns[0].children[0].value, 'BOLID', 'ShipVia 1 first children value');

            assert.ok(!data.columns[1].children, 'second column should be not expanded');
            assert.ok(!data.columns[2].children, 'third column should be not expanded');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 4, 'cells row count');
            assert.strictEqual(data.values[0].length, 8, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');
            assert.strictEqual(data.values[0][0][0], 23, 'GT - GT');

            assert.strictEqual(data.values[3][1][0], 2, 'ShipVia 1 - Barcelona');
            assert.strictEqual(data.values[0][1][0], 9, 'ShipVia 1 - GT');
            assert.strictEqual(data.values[3][0][0], 5, 'GT - Barcelona');
        });
    });

    QUnit.test('Expand row on several levels & column', function(assert) {
        this.load({
            rows: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }, { dataField: 'ShipName' }],
            columns: [{ dataField: 'OrderDate', groupInterval: 'year', dataType: 'date' }, { dataField: 'OrderDate', groupInterval: 'quarter', dataType: 'date' }],
            values: [{ summaryType: 'count' }],
            headerName: 'columns',
            rowExpandedPaths: [['Spain'], ['Spain', 'Madrid']],
            path: [1996]
        }).done(function(data) {
            assert.equal(data.rows.length, 20, 'rows count');
            assert.equal(data.rows[0].value, 'Austria');
            assert.equal(data.rows[14].value, 'Spain');
            assert.equal(data.rows[14].index, 13, 'Spain index');
            assert.ok(data.rows[14].children, 'Spain has children');
            assert.equal(data.rows[14].children.length, 3, 'Spain children count');
            assert.equal(data.rows[14].children[1].value, 'Madrid', 'Spain Madrid value');
            assert.equal(data.rows[14].children[1].index, 14, 'Spain Madrid index');
            assert.ok(data.rows[14].children[1].children, 'Spain - Madrid has children');
            assert.equal(data.rows[14].children[1].children.length, 2, 'Spain - Madrid children count');
            assert.equal(data.rows[14].children[1].children[0].value, 'Bolido Comidas preparadas', 'Spain - Madrid first children value');
            assert.equal(data.rows[14].children[1].children[0].index, 19, 'Spain - Madrid first children index');
            assert.equal(data.rows[19].value, 'Venezuela');

            assert.equal(data.columns.length, 2, 'columns count');
            assert.equal(data.columns[0].value, 3, 'Q3');
            assert.equal(data.columns[0].index, 1, 'Q3 index');
            assert.ok(!data.columns[0].children, 'ShipVia 1 has children');
            assert.equal(data.columns[1].value, 4, 'Q4');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'grandTotalRowIndex');
            assert.strictEqual(data.values.length, 26, 'cells row count');
            assert.strictEqual(data.values[0].length, 3, 'cell count in row');
            assert.strictEqual(data.values[0][0].length, 1, 'measures count');
            assert.strictEqual(data.values[0][0][0], 152, 'GT - 1996');

            assert.strictEqual(data.values[13][0][0], 6, 'Spain - 1996');
            assert.strictEqual(data.values[14][0][0], 4, 'Spain Madrid - 1996');
            assert.strictEqual(data.values[14][1][0], 3, 'Spain Madrid - 1996 Q3');
            assert.strictEqual(data.values[19][0][0], 1, 'Spain Madrid Bolido - 1996');
            assert.strictEqual(data.values[19][1], undefined, 'Spain Madrid Bolido - 1996 Q3');
            assert.strictEqual(data.values[19][2][0], 1, 'Spain Madrid Bolido - 1996 Q4');
        });
    });

    QUnit.test('Load with undefined value in the expanded path', function(assert) {
        new LocalStore([
            { a: undefined, b: 1 },
            { a: undefined, b: 2 },
            { a: '1', b: 2 }
        ]).load({
            rows: [
                { dataField: 'a' },
                { dataField: 'b' }
            ],
            columns: [],
            values: [],
            rowExpandedPaths: [[undefined]]
        }).done(function(data) {
            assert.strictEqual(data.rows.length, 2);
            assert.strictEqual(data.rows[0].children.length, 2);
        });
    });

    QUnit.test('getFields', function(assert) {
        const dataSource = [
            { 'OrderID': 10248, Customer: { name: null }, 'EmployeeID': undefined, 'OrderDate': null, 'Freight': '32.3800', 'ShipName': 'Vins et alcools Chevalier', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10249, Customer: {}, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10249, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10250, Customer: { name: 'Name' }, 'EmployeeID': 4, 'OrderDate': new Date('1996/07/08'), 'Freight': '65.8300', 'ShipName': 'Hanari Carnes', 'ShipRegion': 'RJ', 'ShipPostalCode': null }];

        new LocalStore(dataSource).getFields().done(function(data) {
            assert.ok(data);

            assert.deepEqual(data, [
                {
                    'dataField': 'OrderID',
                    'dataType': 'number',
                    'groupInterval': undefined,
                    'groupName': undefined,
                    'displayFolder': ''
                },
                {
                    'dataField': 'Customer.name',
                    'dataType': 'string',
                    'groupInterval': undefined,
                    'groupName': undefined,
                    'displayFolder': 'Customer'
                },
                {
                    'dataField': 'EmployeeID',
                    'dataType': 'number',
                    'groupInterval': undefined,
                    'groupName': undefined,
                    'displayFolder': ''
                },
                {
                    'dataField': 'OrderDate',
                    'dataType': 'date',
                    'groupInterval': undefined,
                    'groupName': 'OrderDate',
                    'displayFolder': ''
                },
                {
                    'dataField': 'OrderDate',
                    'dataType': 'date',
                    'groupIndex': 0,
                    'groupInterval': 'year',
                    'groupName': 'OrderDate',
                    'displayFolder': ''
                },
                {
                    'dataField': 'OrderDate',
                    'dataType': 'date',
                    'groupIndex': 1,
                    'groupInterval': 'quarter',
                    'groupName': 'OrderDate',
                    'displayFolder': ''
                },
                {
                    'dataField': 'OrderDate',
                    'dataType': 'date',
                    'groupIndex': 2,
                    'groupInterval': 'month',
                    'groupName': 'OrderDate',
                    'displayFolder': ''
                },
                {
                    'dataField': 'Freight',
                    'dataType': 'string',
                    'groupInterval': undefined,
                    'groupName': undefined,
                    'displayFolder': ''
                },
                {
                    'dataField': 'ShipName',
                    'dataType': 'string',
                    'groupInterval': undefined,
                    'groupName': undefined,
                    'displayFolder': ''
                },
                {
                    'dataField': 'ShipRegion',
                    'dataType': 'string',
                    'groupInterval': undefined,
                    'groupName': undefined,
                    'displayFolder': ''
                },
                {
                    'dataField': 'ShipPostalCode',
                    'dataType': undefined,
                    'groupInterval': undefined,
                    'groupName': undefined,
                    'displayFolder': ''
                }

            ]);
        });
    });

    // T872720
    QUnit.test('getFields if length field exists', function(assert) {
        const dataSource = [
            { id: 1, length: '1.65' }
        ];

        new LocalStore(dataSource).getFields().done(function(data) {
            assert.ok(data);

            assert.deepEqual(data, [
                {
                    'dataField': 'id',
                    'dataType': 'number',
                    'groupInterval': undefined,
                    'groupName': undefined,
                    'displayFolder': ''
                },
                {
                    'dataField': 'length',
                    'dataType': 'string',
                    'groupInterval': undefined,
                    'groupName': undefined,
                    'displayFolder': ''
                }
            ]);
        });
    });

    // T666145
    QUnit.test('getFields should skip fields with \'__\' prefix', function(assert) {
        const dataSource = [{
            '__metadata': {
                'id': 1,
                'uri': 'uri',
                'type': 'Product'
            },
            'OrderID': 1
        }];

        new LocalStore(dataSource).getFields().done(function(fields) {
            assert.deepEqual(fields, [
                {
                    'dataField': 'OrderID',
                    'dataType': 'number',
                    'groupInterval': undefined,
                    'groupName': undefined,
                    'displayFolder': ''
                }
            ]);
        });
    });

    QUnit.test('getFields doesn\'t modify fields', function(assert) {
        const dataSource = [{ OrderDate: '1996/12/12' }];
        const field = {
            dataField: 'OrderDate',
            dataType: 'date'
        };

        new LocalStore(dataSource).getFields(field).done(function() {
            assert.deepEqual(field, {
                dataField: 'OrderDate',
                dataType: 'date'
            });
        });
    });

    QUnit.test('getFields. Generate levels for user dataType', function(assert) {
        const dataSource = [
            { OrderDate: '1996/07/05' },
            { OrderDate: '1999/07/05' }
        ];

        new LocalStore(dataSource).getFields([{
            dataField: 'OrderDate',
            dataType: 'date'
        }]).done(function(data) {
            assert.ok(data);

            assert.deepEqual(data, [
                {
                    'dataField': 'OrderDate',
                    'dataType': 'date',
                    'groupInterval': undefined,
                    'groupName': 'OrderDate',
                    'displayFolder': ''
                },
                {
                    'dataField': 'OrderDate',
                    'dataType': 'date',
                    'groupIndex': 0,
                    'groupInterval': 'year',
                    'groupName': 'OrderDate',
                    'displayFolder': ''
                },
                {
                    'dataField': 'OrderDate',
                    'dataType': 'date',
                    'groupIndex': 1,
                    'groupInterval': 'quarter',
                    'groupName': 'OrderDate',
                    'displayFolder': ''
                },
                {
                    'dataField': 'OrderDate',
                    'dataType': 'date',
                    'groupIndex': 2,
                    'groupInterval': 'month',
                    'groupName': 'OrderDate',
                    'displayFolder': ''
                }
            ]);
        });
    });

    QUnit.test('Filter in rows and columns', function(assert) {
        this.load({
            rows: [
                { dataField: 'ShipCountry', filterValues: ['USA', 'Canada'], filterType: 'incorrectType' },
                { dataField: 'ShipCity', filterValues: ['Boise', 'Lander', 'Montreal'], filterType: 'exclude' }
            ],
            columns: [
                { dataField: 'OrderDate', groupInterval: 'year', dataType: 'date', filterValues: [1996, 1998], filterType: 'exclude' },
                { dataField: 'OrderDate', groupInterval: 'quarter', dataType: 'date', filterValues: [1], filterType: 'include' }
            ],
            values: [{ summaryType: 'count' }]

        }).done(function(data) {
            assert.deepEqual(data.rows, [{
                index: 2,
                value: 'Canada'
            }, {
                index: 1,
                value: 'USA'

            }]);

            assert.deepEqual(data.columns, [{
                index: 1,
                value: 1997
            }]),

            assert.deepEqual(data.values, [
                [[10], [10]],
                [[7], [7]],
                [[3], [3]]
            ]);

        });
    });

    QUnit.test('Filter fields', function(assert) {
        this.load({
            rows: [
                { dataField: 'ShipCountry', filterValues: ['USA', 'Canada'], filterType: 'include' }
            ],
            columns: [
                { dataField: 'OrderDate', groupInterval: 'year', dataType: 'date', filterValues: [1996, 1998], filterType: 'exclude' }
            ],
            values: [{ summaryType: 'count' }],
            filters: [
                { dataField: 'ShipCity', filterValues: ['Boise', 'Lander', 'Montreal'], filterType: 'exclude' },
                { dataField: 'OrderDate', groupInterval: 'quarter', dataType: 'date', filterValues: [1], filterType: 'include' },
                { dataField: 'ShipAddress', filterType: 'include' }
            ]
        }).done(function(data) {
            assert.deepEqual(data.rows, [{
                index: 2,
                value: 'Canada'
            }, {
                index: 1,
                value: 'USA'

            }]);

            assert.deepEqual(data.columns, [{
                index: 1,
                value: 1997
            }]),

            assert.deepEqual(data.values, [
                [[10], [10]],
                [[7], [7]],
                [[3], [3]]
            ]);

        });
    });

    QUnit.test('Filter group field. Include Type', function(assert) {
        this.load({
            rows: [
                { dataField: 'ShipCountry', filterValues: ['USA', 'Canada'], filterType: 'include' }
            ],
            columns: [
                { dataField: 'OrderDate', groupInterval: 'year', dataType: 'date', groupName: 'OrderDate', groupIndex: 0 },
                { dataField: 'OrderDate', groupInterval: 'quarter', dataType: 'date', groupName: 'OrderDate', groupIndex: 1 },
                { dataField: 'OrderDate', groupInterval: 'month', dataType: 'date', groupName: 'OrderDate', groupIndex: 2 }
            ],
            values: [{ summaryType: 'count' }],
            filters: [
                {
                    dataField: 'OrderDate', groupName: 'OrderDate', filterValues: [[1996], [1997, 1]], filterType: 'include',
                    levels: [
                        { dataField: 'OrderDate', groupInterval: 'year', dataType: 'date', groupName: 'OrderDate', groupIndex: 0 },
                        { dataField: 'OrderDate', groupInterval: 'quarter', dataType: 'date', groupName: 'OrderDate', groupIndex: 1 },
                        { dataField: 'OrderDate', groupInterval: 'month', dataType: 'date', groupName: 'OrderDate', groupIndex: 2 }
                    ]
                }
            ]
        }).done(function(data) {
            assert.deepEqual(data.rows, [{
                index: 2,
                value: 'Canada'
            }, {
                index: 1,
                value: 'USA'
            }]);

            assert.deepEqual(data.columns, [{
                index: 1,
                value: 1996
            }, {
                index: 2,
                value: 1997
            }]),

            assert.deepEqual(data.values, [
                [[42], [27], [15]],
                [[33], [23], [10]],
                [[9], [4], [5]]
            ]);

        });
    });

    QUnit.test('Filter group field. Exclude Type', function(assert) {
        this.load({
            rows: [
                { dataField: 'ShipCountry', filterValues: ['USA', 'Canada'], filterType: 'include' }
            ],
            columns: [
                { dataField: 'OrderDate', groupInterval: 'year', dataType: 'date', groupName: 'OrderDate', groupIndex: 0 },
                { dataField: 'OrderDate', groupInterval: 'quarter', dataType: 'date', groupName: 'OrderDate', groupIndex: 1 },
                { dataField: 'OrderDate', groupInterval: 'month', dataType: 'date', groupName: 'OrderDate', groupIndex: 2 }
            ],
            values: [{ summaryType: 'count' }],
            filters: [
                {
                    dataField: 'OrderDate', groupName: 'OrderDate', filterValues: [[1996], [1997, 1], [1997, 3, 8], [1998, undefined, 2]], filterType: 'exclude',
                    levels: [
                        { dataField: 'OrderDate', groupInterval: 'year', dataType: 'date', groupName: 'OrderDate', groupIndex: 0 },
                        { dataField: 'OrderDate', groupInterval: 'quarter', dataType: 'date', groupName: 'OrderDate', groupIndex: 1 },
                        { dataField: 'OrderDate', groupInterval: 'month', dataType: 'date', groupName: 'OrderDate', groupIndex: 2 }
                    ]
                }
            ]
        }).done(function(data) {
            assert.deepEqual(data.rows, [{
                index: 1,
                value: 'Canada'
            }, {
                index: 2,
                value: 'USA'
            }]);

            assert.deepEqual(data.columns, [{
                index: 1,
                value: 1997
            }, {
                index: 2,
                value: 1998
            }]);

            assert.deepEqual(data.values, [
                [[105], [57], [48]],
                [[18], [9], [9]],
                [[87], [48], [39]]
            ]);
        });
    });

    QUnit.test('Filter dates without group interval', function(assert) {
        const dataSource = window.orders.slice();
        dataSource[10] = { OrderDate: null };

        new LocalStore(dataSource).load({
            rows: [],
            columns: [
                {
                    dataField: 'OrderDate', dataType: 'date', filterValues: [
                        new Date(window.orders[0].OrderDate),
                        null
                    ], filterType: 'include' }
            ],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 2);
            assert.equal(data.columns[0].value.valueOf(), new Date(window.orders[0].OrderDate).valueOf());
            assert.equal(data.columns[1].value, null);
        });
    });

    QUnit.test('complex dataField', function(assert) {
        const dataSource = [
            { Customer: { name: null }, 'Freight': '32.3800' },
            { Customer: {}, 'Freight': '11.6100' },
            { Customer: { name: 'Name1', Surname: 'Surname2' }, 'Freight': '11.6100' },
            { Customer: { name: 'Name1' }, 'Freight': '65.8300' },
            { Customer: { name: 'Name2' }, 'Freight': '65.8300' }
        ];

        new LocalStore(dataSource).load({
            columns: [
                { dataField: 'Customer.name' }
            ],
            values: [{ dataField: 'Freight', summaryType: 'sum', dataType: 'number' }]

        }).done(function(data) {
            assert.ok(data);
            assert.deepEqual(data.columns, [
                {
                    index: 1,
                    value: null
                }, {
                    index: 2,
                    value: undefined
                }, {
                    index: 3,
                    value: 'Name1'
                }, {
                    index: 4,
                    value: 'Name2'
                }
            ]);
            assert.deepEqual(data.values, [[[187.26], [32.38], [11.61], [77.44], [65.83]]]);
        });

    });

    QUnit.test('Date dataField with ISO8601 format without forceIsoDateParsing', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = false;

        try {
            const dataSource = [
                { 'Date': '2015-08-05T13:30:15' }
            ];

            new LocalStore(dataSource).load({
                columns: [
                    { dataField: 'Date', dataType: 'date' }
                ],
                values: [{}]
            }).done(function(data) {
                assert.ok(data);
                assert.deepEqual(data.columns, [
                    {
                        index: 1,
                        value: new Date('2015-08-05T13:30:15')
                    }
                ]);
            });
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test('Date dataField with ISO8601 format with forceIsoDateParsing', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;

        try {
            const dataSource = [
                { 'Date': '2015-08-05T13:30:15' }
            ];

            new LocalStore(dataSource).load({
                columns: [
                    { dataField: 'Date', dataType: 'date' }
                ],
                values: [{}]
            }).done(function(data) {
                assert.ok(data);
                assert.deepEqual(data.columns, [
                    {
                        index: 1,
                        value: new Date(2015, 7, 5, 13, 30, 15)
                    }
                ]);
            });
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test('reload data', function(assert) {
        const dataSource = [
            { 'OrderID': 10248, Customer: { name: null }, 'EmployeeID': undefined, 'OrderDate': null, 'Freight': '32.3800', 'ShipName': 'Vins et alcools Chevalier', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10249, Customer: {}, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10249, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10250, Customer: { name: 'Name' }, 'EmployeeID': 4, 'OrderDate': new Date('1996/07/08'), 'Freight': '65.8300', 'ShipName': 'Hanari Carnes', 'ShipRegion': 'RJ', 'ShipPostalCode': null }
        ];

        let localStore = new LocalStore(dataSource);

        localStore.load({
            values: [{ dataField: 'OrderID' }]
        }).done(function(data) {
            assert.strictEqual(data.values[0][0][0], 4);
        });

        // act
        dataSource.splice(0, 2);

        localStore = localStore.load({
            values: [{ dataField: 'OrderID' }],
            reload: true
        }).done(function(data) {
        // assert
            assert.strictEqual(data.values[0][0][0], 2);
        });
    });

    QUnit.test('filter data', function(assert) {
        const dataSource = [
            { 'OrderID': 10248, Customer: { name: null }, 'EmployeeID': undefined, 'OrderDate': null, 'Freight': '32.3800', 'ShipName': 'Vins et alcools Chevalier', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10249, Customer: {}, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10250, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10251, Customer: { name: 'Name' }, 'EmployeeID': 4, 'OrderDate': new Date('1996/07/08'), 'Freight': '65.8300', 'ShipName': 'Hanari Carnes', 'ShipRegion': 'RJ', 'ShipPostalCode': null }
        ];

        const localStore = new LocalStore(dataSource);

        localStore.load({
            values: [{ dataField: 'OrderID' }]
        });

        // act
        localStore.filter('OrderID', '>', 10249);
        const filterExpr = localStore.filter();

        localStore.load({
            values: [{ dataField: 'OrderID' }],
        }).done(function(data) {
        // assert
            assert.strictEqual(data.values[0][0][0], 4, 'data should be filtered on reload only if not CustomStore is used');
        });

        localStore.load({
            values: [{ dataField: 'OrderID' }],
            reload: true
        }).done(function(data) {
        // assert
            assert.strictEqual(data.values[0][0][0], 2);
        }).fail(function() {
            assert.ok(false);
        });

        assert.deepEqual(filterExpr, ['OrderID', '>', 10249]);
    });


    QUnit.test('T717466. Header item contains . symbol in value', function(assert) {
        this.store = new LocalStore({
            store: {
                type: 'array',
                data: [
                    { 'a1': 0, 'a2': 333, 'v': 0 },
                    { 'a1': 0.333, 'a2': 1765, 'v': 0 },
                ]
            }
        });

        this.store.load({
            rows: [
                { 'dataField': 'a1', 'expanded': true },
                { 'dataField': 'a2' }
            ],
            values: [{
                'dataField': 'v', 'summaryType': 'sum'
            }]
        }).done(function(result) {
            assert.equal(result.rows.length, 2);
            assert.equal(result.rows[0].children.length, 1);
            assert.equal(result.rows[0].children[0].value, 333);
        });
    });


});

QUnit.module('DrillDown', {
    beforeEach: function() {
        moduleConfig.beforeEach.apply(this, arguments);
        const store = this.store;

        store.load({
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        });

        this.getDrillDownData = function(loadOptions) {
            const dataSource = store.createDrillDownDataSource.apply(store, arguments);
            dataSource.paginate(false);

            return dataSource.load();
        };
    }
}, () => {

    QUnit.test('with empty loadOptions and empty params', function(assert) {
        this.getDrillDownData({}, {}).done(function(data) {
            assert.strictEqual(data.length, 830, 'should return all items');
        });
    });

    QUnit.test('DrillDown with empty paths', function(assert) {
        this.getDrillDownData({
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        }, { columnPath: [], rowPath: [] }).done(function(data) {
            assert.strictEqual(data.length, 830, 'should return all items');
        });
    });

    QUnit.test('drill down by column path', function(assert) {
        this.getDrillDownData({
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        }, { columnPath: ['Argentina'], rowPath: [] }).done(function(data) {
            assert.strictEqual(data.length, 16, 'should return 16 items');
        });
    });

    QUnit.test('drill down by row path', function(assert) {
        this.getDrillDownData({
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        }, { columnPath: [], rowPath: [1] }).done(function(data) {
            assert.strictEqual(data.length, 249, 'should return 249 items');
        });
    });


    QUnit.test('drill down by row and column path', function(assert) {
        this.getDrillDownData({
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        }, { columnPath: ['Argentina'], rowPath: [1] }).done(function(data) {
            assert.strictEqual(data.length, 5, 'should return 5 items');
        });
    });

    QUnit.test('set custom columns', function(assert) {
        this.getDrillDownData({}, { customColumns: ['CustomerID', 'ShipAddress'] }).done(function(data) {
            assert.strictEqual(data.length, 830, 'should return all items');
            assert.deepEqual(data[0], {
                'CustomerID': 'VINET',
                'ShipAddress': '59 rue de l\'Abbaye'
            }, 'first item');
        });
    });

    QUnit.test('DrillDown by path with maxRowCount', function(assert) {
        const store = this.store;
        const loadOptions = {
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        };
        this.load(loadOptions);

        assert.strictEqual(store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [], maxRowCount: 0 }).length, 830, 'GrandTotal with maxRowCount is 0');
        assert.strictEqual(store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [], maxRowCount: 100 }).length, 100, 'GrandTotal');
        assert.strictEqual(store.getDrillDownItems(loadOptions, { columnPath: ['Argentina'], rowPath: [1], maxRowCount: 100 }).length, 5, 'ShipVia 1 - Argentina');
    });

    QUnit.test('DrillDown by path with customColumns', function(assert) {
        const store = this.store;
        const loadOptions = {
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        };

        this.load(loadOptions);

        const drillDownItems = store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [], customColumns: ['CustomerID', 'ShipAddress'] });

        assert.strictEqual(drillDownItems.length, 830, 'GrandTotal with maxRowCount is 0');
        assert.deepEqual(drillDownItems[0], {
            'CustomerID': 'VINET',
            'ShipAddress': '59 rue de l\'Abbaye'
        });
    });

    QUnit.test('DrillDown with filters', function(assert) {
        const store = this.store;
        const loadOptions = {
            columns: [{ dataField: 'ShipCountry', filterValues: ['Argentina', 'Brazil', 'Canada', 'USA'] }],
            rows: [{ dataField: 'ShipVia', filterValues: [1, 3] }],
            filters: [{ dataField: 'OrderDate', dataType: 'date', groupInterval: 'year', filterValues: [1996, 1997] }],
            values: [{ summaryType: 'count' }]
        };

        this.load(loadOptions).done(function(data) {
            assert.strictEqual(data.values[0][0][0], 91, 'GT');
        });

        assert.strictEqual(store.getDrillDownItems(loadOptions, { columnPath: [], rowPath: [] }).length, 91, 'GT');
        assert.strictEqual(store.getDrillDownItems(loadOptions, { columnPath: ['Argentina'], rowPath: [1] }).length, 2, 'ShipVia 1 - Argentina');
    });

    QUnit.test('DrillDown by path when groups', function(assert) {
        const store = this.store;
        const loadOptions = {
            columns: [
                { groupName: 'Date', groupIndex: 0, dataField: 'OrderDate', expanded: true, groupInterval: 'year', dataType: 'date', area: 'column' },
                { groupName: 'Date', groupIndex: 1, dataField: 'OrderDate', groupInterval: 'quarter', dataType: 'date', area: 'column' },
                { groupName: 'Date', groupIndex: 2, dataField: 'OrderDate', groupInterval: 'month', dataType: 'date', area: 'column' }
            ],
            rows: [{ dataField: 'ShipCountry' }],
            values: [{ summaryType: 'count' }]
        };

        this.load(loadOptions);


        const drillItems = store.getDrillDownItems(loadOptions, { columnPath: [1997, 2, 6], rowPath: ['Brazil'], customColumns: ['OrderID'] });

        assert.strictEqual(drillItems.length, 2);
        assert.deepEqual(drillItems, [{ OrderID: 10563 }, { OrderID: 10581 }]);
    });


});

QUnit.module('Custom Store local filtering', () => {

    QUnit.test('Data should be filtered locally if custom store is used', function(assert) {
        const filterOptions = ['OrderID', '>', 11000];
        const store = new LocalStore({
            load: function(loadOptions) {
                assert.deepEqual(loadOptions.filter, filterOptions, 'filter options should are passed if custom store is used');
                return $.Deferred().resolve(window.orders);
            },

            filter: filterOptions
        });

        store.load({ rows: [], columns: [], values: [{ summaryType: 'column' }] }).done(function(data) {
            assert.strictEqual(data.values[0][0][0], 77, 'Store loaded data without filtering');
        });
    });

    QUnit.test('Data should be filtered by date locally if custom store is used', function(assert) {
        const filterOptions = ['OrderDate', '=', new Date('1996/07/09')];
        const store = new LocalStore({
            load: function(loadOptions) {
                assert.deepEqual(loadOptions.filter, filterOptions, 'filter options should are passed if custom store is used');
                return $.Deferred().resolve(window.orders);
            },

            filter: filterOptions
        });

        store.load({
            columns: [{ dataField: 'OrderDate', dataType: 'date' }],
            values: [{ summaryType: 'count' }]
        }).done(function(result) {
            assert.equal(result.columns.length, 1);
        });
    });

    QUnit.test('Data should be filtered locally if store was loaded twice', function(assert) {
        const loadOptions = { rows: [], columns: [], values: [{ summaryType: 'column' }] };
        const store = new LocalStore({
            load: function() {
                return $.Deferred().resolve(window.orders);
            },

            filter: ['OrderID', '>', 11000]
        });

        store.load(loadOptions);

        store.load(loadOptions).done(function(data) {
            assert.strictEqual(data.values[0][0][0], 77, 'Store loaded data without filtering');
        });
    });

    QUnit.test('Data should return all items if filter is not defined', function(assert) {
        const store = new LocalStore({
            load: function() {
                return $.Deferred().resolve(window.orders);
            }
        });

        store.load({ rows: [], columns: [], values: [{ summaryType: 'column' }] }).done(function(data) {
            assert.strictEqual(data.values[0][0][0], 830, 'Store loaded data without filtering');
        });
    });


});

