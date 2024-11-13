import $ from 'jquery';
import { RemoteStore } from '__internal/grids/pivot_grid/remote_store/m_remote_store';
import { forEachGroup } from '__internal/grids/pivot_grid/remote_store/m_remote_store_utils';
import { sort } from '__internal/grids/pivot_grid/data_source/m_data_source_utils';
import pivotGridUtils from '__internal/grids/pivot_grid/m_widget_utils';
import ArrayStore from 'common/data/array_store';
import DataSource from 'common/data/data_source';

import '../../content/orders.js';

function getCustomArrayStore(data) {
    const arrayStore = new ArrayStore(data);

    function getSummary(summaryOptions) {
        const summary = summaryOptions.selector ? summaryOptions.summaryType + '(' + summaryOptions.selector + ')' : summaryOptions.summaryType;
        return summary;
    }

    const dataSource = new DataSource({
        key: 'OrderID',
        load: function(loadOptions) {
            const d = $.Deferred();

            if(loadOptions.group) {
                $.each(loadOptions.group, function(_, group) {
                    const selector = group.selector;
                    const interval = group.groupInterval;
                    const intervalField = selector + (typeof interval === 'string' ? interval.substr(0, 1).toUpperCase() + interval.substr(1) : '');

                    group.selector = intervalField;
                });
            }
            const skip = loadOptions.skip;
            const take = loadOptions.take;
            arrayStore.load($.extend({}, loadOptions, { skip: null, take: null })).done(function(data) {
                const path = [];
                const totalSummary = {
                    summary: null
                };

                let filterExpr = '';
                if(loadOptions.filter) {
                    filterExpr = '(' + loadOptions.filter + ')';
                }

                if(loadOptions.totalSummary) {
                    totalSummary.summary = [];

                    for(let i = 0; i < loadOptions.totalSummary.length; i++) {
                        totalSummary.summary.push('GT:' + getSummary(loadOptions.totalSummary[i]) + filterExpr);
                    }
                }

                forEachGroup(data, function(item, level) {
                    path[level] = item.key;
                    for(let i = 0; i < (loadOptions.groupSummary && loadOptions.groupSummary.length || 0); i++) {
                        if(item.items) {
                            item.summary = item.summary || [];

                            item.summary.push(path.slice(0, level + 1).join('-') + ':' + getSummary(loadOptions.groupSummary[i]) + filterExpr);
                        }
                    }
                });

                if(loadOptions.requireGroupCount && loadOptions.group) {
                    totalSummary.groupCount = data.length;
                }

                if(skip) {
                    data = data.slice(skip);
                }

                if(take) {
                    data = data.slice(0, take);
                }

                d.resolve(data, totalSummary);
            });

            return d;
        }
    });

    return dataSource.store();

}

function getRowTotal(data, row) {
    return getValue(data, row);
}

function getColumnTotal(data, column) {
    return getValue(data, undefined, column);
}

function getValue(data, rowItem, columnItem, measureIndex) {
    const columnIndex = columnItem ? columnItem.index : data.grandTotalColumnIndex;
    const rowIndex = rowItem ? rowItem.index : data.grandTotalRowIndex;

    return data.values[rowIndex][columnIndex][measureIndex || 0];
}

const moduleConfig = {
    beforeEach: function() {
        this.externalStore = getCustomArrayStore(window.orders);
        this.store = new RemoteStore(this.externalStore);

        this.load = function(options) {
            const d = this.store.load(options);

            d.done(function(data) {
                if(!options.rowTake && !options.columnTake) {
                    sort(options, data);
                }
            });

            return d;
        };
    }
};

QUnit.module('Loading root data', moduleConfig, () => {

    QUnit.test('Fail on loading', function(assert) {
        const store = new RemoteStore({
            load: function() {
                return $.Deferred().reject('Error Message');
            }
        });

        store.load({
            columns: [],
            rows: [],
            values: []
        }).done(function() {
            assert.ok(false, 'done should not be fired');
        }).fail(function(e) {
            assert.strictEqual(e.message, 'Error Message', 'error should be passed to fail');
        });
    });

    QUnit.test('Loading data with empty dimensions', function(assert) {
        const externalStore = this.externalStore;
        const loadSpy = sinon.spy(function() {
            return externalStore.load.apply(externalStore, arguments);
        });
        const store = new RemoteStore({
            load: loadSpy
        });

        store.load({
            columns: [],
            rows: [],
            values: []
        }).done(function(data) {
            assert.equal(data.rows.length, 0, 'rows should not be loaded');
            assert.equal(data.columns.length, 0, 'columns should not be loaded');
            assert.equal(data.rows.length, 0, 'rows should not be loaded');
            assert.deepEqual(data.values, [], 'values is an empty 1-dimensional array');
            assert.deepEqual(loadSpy.lastCall.args[0], {
                group: undefined,
                groupSummary: [],
                take: 1,
                totalSummary: []
            }, 'load config');
        });
    });

    QUnit.test('Loading field with null values', function(assert) {
        this.load({
            columns: [],
            rows: [{ dataField: 'ShipRegion' }],
            values: [{ summaryType: 'sum', dataField: 'Freight' }]
        }).done(function(data) {
            assert.equal(data.rows.length, 20, 'row count is correct');
            assert.ok(!data.rows[0].children, 'row item should not have children');
        });
    });

    QUnit.test('Loading data without columns', function(assert) {
        this.load({
            columns: [],
            rows: [{ dataField: 'ShipCity' }, { dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.ok(!data.rows[0].children, 'row children was not loaded');
            assert.equal(data.columns.length, 0, 'columns should not be loaded');
            assert.equal(data.rows.length, 70, 'row count is correct');
            assert.equal(data.rows[0].value, 'Aachen', 'First row has correct name');
            assert.equal(data.rows[2].value, 'Anchorage', 'Second row has correct name');
        });
    });

    QUnit.test('Loading data without columns if rowSkip and rowTake are defined', function(assert) {
        this.load({
            columns: [],
            rows: [{ dataField: 'ShipCity' }, { dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }],
            rowSkip: 10,
            rowTake: 10
        }).done(function(data) {
            assert.ok(!data.rows[0].children, 'row children was not loaded');
            assert.equal(data.columns.length, 0, 'columns should not be loaded');
            assert.equal(data.rows.length, 70, 'row count is correct');
            assert.equal(data.rows[9].value, undefined, 'row 9 value');
            assert.equal(data.rows[10].value, 'Bracke', 'row 10 value');
            assert.equal(data.rows[19].value, 'Cork', 'row 19 value');
            assert.equal(data.rows[20].value, undefined, 'row 20 value');
        });
    });

    QUnit.test('Loading data without columns if rowSkip and rowTake and sortOrder in field are defined', function(assert) {
        this.load({
            columns: [],
            rows: [{ dataField: 'ShipCity', sortOrder: 'desc' }, { dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }],
            rowSkip: 10,
            rowTake: 10
        }).done(function(data) {
            assert.ok(!data.rows[0].children, 'row children was not loaded');
            assert.equal(data.columns.length, 0, 'columns should not be loaded');
            assert.equal(data.rows.length, 70, 'row count is correct');
            assert.equal(data.rows[9].value, undefined, 'row 9 value');
            assert.equal(data.rows[10].value, 'Sevilla', 'row 10 value');
            assert.equal(data.rows[19].value, 'Reggio Emilia', 'row 19 value');
            assert.equal(data.rows[20].value, undefined, 'row 20 value');
        });
    });

    QUnit.test('Loading data without rows', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCity' }, { dataField: 'ShipVia' }],
            rows: [],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.ok(!data.columns[0].children, 'column children was not loaded');
            assert.equal(data.columns.length, 70, 'column count is correct');
            assert.equal(data.columns[0].value, 'Aachen', 'First column has correct name');
            assert.equal(data.columns[2].value, 'Anchorage', 'Second column has correct name');
        });
    });

    QUnit.test('Loading data without rows if columnSkip and columnTake are defined', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCity' }, { dataField: 'ShipVia' }],
            rows: [],
            values: [{ summaryType: 'count' }],
            columnSkip: 10,
            columnTake: 10
        }).done(function(data) {
            assert.ok(!data.columns[0].children, 'column children was not loaded');
            assert.equal(data.columns.length, 70, 'column count is correct');
            assert.equal(data.columns[9].value, undefined, 'column 9 value');
            assert.equal(data.columns[10].value, 'Bracke', 'column 10 value');
            assert.equal(data.columns[19].value, 'Cork', 'column 19 value');
            assert.equal(data.columns[20].value, undefined, 'column 20 value');
        });
    });

    QUnit.test('Loading values only', function(assert) {
        this.load({
            columns: [],
            rows: [],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 0, 'columns should not be loaded');
            assert.equal(data.rows.length, 0, 'rows should not be loaded');
            assert.equal(data.values.length, 1, 'values should have correct length');
        });
    });

    QUnit.test('Loading data with columns and rows', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipCity' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 21, 'columns count is correct');
            assert.equal(data.columns[0].value, 'Argentina', 'first column is correct');
            assert.equal(data.columns[20].value, 'Venezuela', 'last column is correct');

            assert.equal(data.rows.length, 70, 'rows count is correct');
            assert.equal(data.rows[0].value, 'Aachen', 'first row is correct');
            assert.equal(data.rows[69].value, 'Warszawa', 'last row is correct');

            assert.strictEqual(data.values.length, 71, 'values has data for 70 rows and grand total row');
            assert.strictEqual(data.values[0].length, 22, 'cell count in grand total row is correct');
            assert.strictEqual(data.values[1].length, 10, 'cell count in first row is correct');

            assert.strictEqual(data.values[0][0].length, 1, 'measures count in the grand total cell');
            assert.strictEqual(data.values[1][9].length, 1, 'measures count in the random cell');
        });
    });

    QUnit.test('Loading data with columns and rows if rowTake and columnTake are defined', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipCity' }],
            values: [{ summaryType: 'count' }],
            rowSkip: 0,
            rowTake: 10,
            columnSkip: 0,
            columnTake: 10
        }).done(function(data) {
            assert.equal(data.columns.length, 21, 'columns count is correct');
            assert.equal(data.columns[0].value, 'Argentina', 'first column is correct');
            assert.equal(data.columns[20].value, 'Venezuela', 'last column is correct and loaded');

            assert.equal(data.rows.length, 70, 'rows count is correct');
            assert.equal(data.rows[0].value, 'Aachen', 'first row is correct');
            assert.equal(data.rows[69].value, undefined, 'last row is not loaded');

            assert.strictEqual(data.values.length, 11, 'values has data for 10 loaded rows and grand total row');
            assert.strictEqual(data.values[0].length, 22, 'cell count in grand total row is correct');
            assert.strictEqual(data.values[1].length, 10, 'cell count in first row is correct');

            assert.strictEqual(data.values[0][0].length, 1, 'measures count in the grand total cell');
            assert.strictEqual(data.values[1][9].length, 1, 'measures count in the random cell');
        });
    });

    QUnit.test('Do not parse string data if data type is not set', function(assert) {
        this.load({
            columns: [{ dataField: 'Freight' }],
            rows: [],
            values: []
        }).done(function(data) {
            assert.strictEqual(data.columns[0].value, '0.0200');
        });
    });

    ['columns', 'rows'].forEach(headerName => {
        QUnit.test(`Parse string data if data type is set. Number type for ${headerName}`, function(assert) {
            this.load({
                columns: [],
                rows: [],
                values: [],
                [headerName]: [{ dataField: 'Freight', dataType: 'number' }]
            }).done(function(data) {
                assert.strictEqual(data[headerName][0].value, 0.02);
            });
        });

        QUnit.test(`Parse string data if data type is set. Date type for ${headerName}`, function(assert) {
            this.load({
                columns: [],
                rows: [],
                values: [],
                [headerName]: [{ dataField: 'OrderDate', dataType: 'date' }]
            }).done(function(data) {
                assert.deepEqual(data[headerName][0].value, new Date('1996/07/04'));
            });
        });

        QUnit.test(`Do not parse string data if next field dataType is number for ${headerName} (T853201)`, function(assert) {
            this.store = new RemoteStore({
                load: function() {
                    return $.Deferred().resolve([{
                        'key': 'Expenses',
                        'items': [{
                            'key': 'FY 2018 Actual',
                            'items': [{ 'key': 1, 'items': null, 'count': 1 }],
                            'count': null,
                        }, {
                            'key': 'FY 2018 Budget',
                            'items': [{ 'key': 1, 'items': null, 'count': 1 }],
                            'count': null,
                        }],
                        'count': null
                    }]);
                }
            });

            this.load({
                columns: [],
                rows: [],
                values: [],
                [headerName]: [{
                    dataField: 'AccountType',
                    dataType: 'string',
                    expanded: true
                }, {
                    dataField: 'DataSet',
                    dataType: 'string',
                    expanded: true
                }, {
                    dataField: 'Period',
                    dataType: 'number',
                }]
            }).done(function(data) {
                const headerItems = data[headerName];
                assert.strictEqual(headerItems[0].value, 'Expenses');
                assert.strictEqual(headerItems[0].children[0].value, 'FY 2018 Actual');
                assert.strictEqual(headerItems[0].children[0].children[0].value, 1);
                assert.strictEqual(headerItems[0].children[1].value, 'FY 2018 Budget');
                assert.strictEqual(headerItems[0].children[1].children[0].value, 1);
            });
        });
    });

    QUnit.test('Key method should return key field name', function(assert) {
        assert.strictEqual(this.store.key(), 'OrderID');
    });
});

QUnit.module('Summary calculation', moduleConfig, () => {

    QUnit.test('Grand total values should have correct coordinates', function(assert) {
        this.load({
            columns: [],
            rows: [],
            values: []
        }).done(function(data) {
            assert.deepEqual([data.grandTotalColumnIndex, data.grandTotalRowIndex], [0, 0], 'grand total value has right coordinates');
        });
    });

    QUnit.test('Grand total value should be calculated using summaryType from option', function(assert) {
        this.load({
            columns: [],
            rows: [{ dataField: 'ShipVia' }, { dataField: 'ShipCity' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(getValue(data), 'GT:count', 'grand total summary has been inserted correctly');
        });
    });

    // T830242
    QUnit.test('Grand total value should be calculated using summaryType when there is expanded item', function(assert) {
        this.load({
            columns: [],
            rows: [{ dataField: 'ShipVia' }, { dataField: 'ShipCity' }],
            values: [{ summaryType: 'count' }],
            rowExpandedPaths: [[1]]
        }).done(function(data) {
            assert.strictEqual(getValue(data), 'GT:count', 'grand total summary has been inserted correctly');
        });
    });

    QUnit.test('Default summary type', function(assert) {
        this.load({
            columns: [],
            rows: [],
            values: [{}]
        }).done(function(data) {
            assert.strictEqual(getValue(data), 'GT:count', 'grand total summary has been inserted correctly');
        });
    });

    QUnit.test('Total value for rows should be correct', function(assert) {
        this.load({
            columns: [],
            rows: [{ dataField: 'ShipCity' }, { dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(getRowTotal(data, data.rows[0]), 'Aachen:count', 'total for the first row is correct');
            assert.strictEqual(getRowTotal(data, data.rows[1]), 'Albuquerque:count', 'total for the second row is correct');
        });
    });

    QUnit.test('Total value for columns should be correct', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCity' }, { dataField: 'ShipVia' }],
            rows: [],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(getColumnTotal(data, data.columns[0]), 'Aachen:count', 'total for the first row is correct');
            assert.strictEqual(getColumnTotal(data, data.columns[1]), 'Albuquerque:count', 'total for the second row is correct');
        });
    });

    QUnit.test('Total value for children row should be correct', function(assert) {
        this.load({
            columns: [],
            rows: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipCity' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(getRowTotal(data, data.rows[20].children[0]), 'Venezuela-Barquisimeto:count', 'summary value for Barquisimeto is correct');
        });
    });

    QUnit.test('Total value for children column should be correct', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipCity' }],
            rows: [],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(getColumnTotal(data, data.columns[20].children[0]), 'Venezuela-Barquisimeto:count', 'summary value for Barquisimeto is correct');
        });
    });

    QUnit.test('Summary for two-field column and row should be correct', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipCity' }],
            rows: [{ dataField: 'ShipVia', expanded: true }, { dataField: 'ShipName' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[1], data.columns[1]), '2-Austria:count', 'summary value for 2nd ship method is correct');
            assert.strictEqual(getValue(data, data.rows[1].children[10], data.columns[0]), '2-Cactus Comidas para llevar-Argentina:count', 'summary value for 2nd ship method is correct');
        });
    });

    QUnit.test('Summary for several data fields', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }, { summaryType: 'sum', dataField: 'Freight' }]
        }).done(function(data) {

            assert.strictEqual(getValue(data), 'GT:count', 'Grand total value is correct');
            assert.strictEqual(getValue(data, undefined, undefined, 1), 'GT:sum(Freight)', 'First part of grand total value is correct');

            assert.strictEqual(getValue(data, data.rows[0], data.columns[0]), '1-Argentina:count', 'ShipVia 1 - Argentina');

            assert.strictEqual(getRowTotal(data, data.rows[0]), '1:count', 'Total for row 1 group where ShipVia is 1 is correct');
            assert.strictEqual(getRowTotal(data, data.rows[1]), '2:count', 'Total for row 2 group where ShipVia is 2 is correct');

            assert.strictEqual(getColumnTotal(data, data.columns[0]), 'Argentina:count', 'Grand total for Argentina is correct');
        });
    });


    QUnit.test('Empty string key', function(assert) {
        const dataSource = [
            { field1: '' },
            { field1: '2' }
        ];

        new RemoteStore({
            store: getCustomArrayStore(dataSource),
        }).load({
            rows: [{ dataField: 'field1' }],
            columns: [],
            values: [{}]
        }).done(function(data) {
            assert.strictEqual(data.rows.length, 2, 'rows count');

            assert.strictEqual(data.rows[0].value, '', 'first row value');
            assert.ok(!data.rows[0].children, 'first row has not children');
            assert.strictEqual(data.rows[1].value, '2', 'second row value');
        });
    });

    QUnit.test('null key with two levels grouping', function(assert) {
        const dataSource = [
            { field1: null, field2: '11' },
            { field1: '2', field2: '22' }
        ];

        new RemoteStore({
            store: getCustomArrayStore(dataSource),
        }).load({
            rows: [{ dataField: 'field1', expanded: true }, { dataField: 'field2' }],
            columns: [],
            values: [{}]
        }).done(function(data) {
            assert.strictEqual(data.rows.length, 2, 'rows count');

            assert.strictEqual(data.rows[0].value, null, 'first row value');
            assert.ok(data.rows[0].children, 'first row has not children');
            assert.strictEqual(data.rows[1].value, '2', 'second row value');
        });
    });


});

QUnit.module('Lazy loading', moduleConfig, () => {

    QUnit.test('Children should not be loaded when all fields are collapsed', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }],
            rows: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }],
            values: []
        }).done(function(data) {
            assert.ok(!data.columns[0].children, 'column children was not loaded');
            assert.ok(!data.rows[0].children, 'row children was not loaded');
        });
    });

    QUnit.test('Children should be loaded if column is expanded', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipCity' }],
            rows: [],
            values: []
        }).done(function(data) {
            assert.equal(data.columns[20].children.length, 4, 'column children was loaded');
            assert.equal(data.columns[20].children[0].value, 'Barquisimeto', 'first child was loaded');
            assert.equal(data.columns[20].children[1].value, 'Caracas', 'second child was loaded');
        });
    });

    QUnit.test('Children should be loaded if row is expanded', function(assert) {
        this.load({
            columns: [],
            rows: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipCity' }],
            values: []
        }).done(function(data) {
            assert.equal(data.rows[20].children.length, 4, 'column children was loaded');
            assert.equal(data.rows[20].children[0].value, 'Barquisimeto', 'first child was loaded');
            assert.equal(data.rows[20].children[1].value, 'Caracas', 'second child was loaded');
        });
    });

    QUnit.test('OnLoaded event should fire once if any column is expanded', function(assert) {
        const onLoaded = sinon.stub();
        this.externalStore.on('loaded', onLoaded);

        this.load({
            columns: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipCity' }],
            rows: [],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(onLoaded.callCount, 1, 'onLoaded should not fire when children load');
        });
    });

    QUnit.test('OnLoaded event should fire 1 time if any row is expanded', function(assert) {
        const onLoaded = sinon.stub();
        this.externalStore.on('loaded', onLoaded);

        this.load({
            columns: [],
            rows: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipCity' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(onLoaded.callCount, 1, 'onLoaded should not fire when children load');
        });
    });

    QUnit.test('OnLoaded event should fire 3 times when one row is expanded', function(assert) {
        const onLoaded = sinon.stub();
        this.externalStore.on('loaded', onLoaded);

        this.load({
            columns: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }],
            rows: [{ dataField: 'CustomerID', expanded: true }, { dataField: 'OrderDate' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(onLoaded.callCount, 3, 'onLoaded should not fire when children load');
        });
    });

    QUnit.test('OnLoaded event should fire 5 times when one row and one column are expanded', function(assert) {
        const onLoaded = sinon.stub();
        this.externalStore.on('loaded', onLoaded);

        this.load({
            columns: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipCity' }],
            rows: [{ dataField: 'CustomerID', expanded: true }, { dataField: 'OrderDate' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(onLoaded.callCount, 5, 'onLoaded should not fire when children load');
        });
    });

    QUnit.test('Columns and rows with string dataField. Several fields on each dimensions. first level is not expanded', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }],
            rows: [{ dataField: 'ShipVia' }, { dataField: 'ShipName' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 21, 'column count is correct');
            assert.ok(!data.columns[0].children, 'column children should not be loaded');
            assert.equal(data.columns[0].value, 'Argentina', 'first column name is correct');
            assert.equal(data.columns[20].value, 'Venezuela', 'last column name is correct');

            assert.equal(data.rows.length, 3, 'row count is correct');
            assert.ok(!data.rows[0].children, 'row children should not be loaded');
            assert.equal(data.rows[0].value, 1, 'first row name is correct');
            assert.equal(data.rows[2].value, 3, 'last row name is correct');

            assert.strictEqual(data.values.length, 4, 'values array should contains all rows and grand total row');
            assert.strictEqual(data.values[0].length, 22, 'cell count in grand total row should contains all columns and grand total column');
            assert.strictEqual(data.values[1].length, 22, 'cell count in the first row is correct');

            assert.strictEqual(data.values[0][0].length, 1, 'measures count in the grand total cell');
            assert.strictEqual(data.values[1][1].length, 1, 'measures count in a cell');
        });
    });


});

QUnit.module('Discover', () => {

    QUnit.test('Take only 20 first items for discover', function(assert) {
        sinon.spy(pivotGridUtils, 'discoverObjectFields');

        const dataSource = [];

        for(let i = 0; i < 20; i++) {
            dataSource.push({ field1: i });
        }

        dataSource.push({ field2: 'undiscoveredField' });

        new RemoteStore(getCustomArrayStore(dataSource)).getFields().done(function(data) {

            assert.deepEqual(data, [
                {
                    'dataField': 'field1',
                    'dataType': 'number',
                    'groupInterval': undefined,
                    'groupName': undefined,
                    'displayFolder': ''
                }]);
            assert.strictEqual(pivotGridUtils.discoverObjectFields.lastCall.args[0].length, 20);
            pivotGridUtils.discoverObjectFields.restore();
        });

    });

    QUnit.test('getFields', function(assert) {
        const dataSource = [
            { 'OrderID': 10248, Customer: { name: null }, 'EmployeeID': undefined, 'OrderDate': null, 'Freight': '32.3800', 'ShipName': 'Vins et alcools Chevalier', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10249, Customer: {}, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10249, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10250, Customer: { name: 'Name' }, 'EmployeeID': 4, 'OrderDate': new Date('1996/07/08'), 'Freight': '65.8300', 'ShipName': 'Hanari Carnes', 'ShipRegion': 'RJ', 'ShipPostalCode': null }];

        new RemoteStore(getCustomArrayStore(dataSource)).getFields().done(function(data) {

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

    QUnit.test('getFields. Generate levels for user dataType', function(assert) {
        const dataSource = [
            { OrderDate: '1996/07/05' },
            { OrderDate: '1999/07/05' }
        ];

        new RemoteStore(getCustomArrayStore(dataSource)).getFields([{
            dataField: 'OrderDate',
            dataType: 'date'
        }]).done(function(data) {

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


});

QUnit.module('Data grouping', () => {

    QUnit.test('Store should group data in fields by group intervals', function(assert) {
        const dataSource = [
            { OrderDate: '1996/07/05', OrderDateYear: 1996 },
            { OrderDate: '1999/07/06', OrderDateYear: 1999 },
            { OrderDate: '1996/07/07', OrderDateYear: 1996 },
            { OrderDate: '1999/07/08', OrderDateYear: 1999 }
        ];

        const store = new RemoteStore(getCustomArrayStore(dataSource));

        store.load({
            columns: [{ dataField: 'OrderDate', groupInterval: 'Year', dataType: 'date' }],
            rows: [],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 2, 'columns was grouped by year');
            assert.equal(data.columns[0].value, 1996, 'First group is correct');
            assert.equal(data.columns[1].value, 1999, 'Last group is correct');
        });

    });

    QUnit.test('Date intervals formatting', function(assert) {
        const store = new RemoteStore(getCustomArrayStore([]));

        const fields = [
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'quarter' },
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'month' },
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'dayOfWeek' },
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'day' },
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'day', customizeText: function() { return 'myValue'; } }
        ];

        store.load({
            columns: fields,
            rows: [],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[0]), 'Q1', 'quarter 1');
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[1]), 'January', 'month 1');
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[2]), 'Monday', 'dayOfWeek 1');
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[3]), '1', 'day 1');
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[4]), 'myValue', 'default formatter should not be set');
        });

    });

    QUnit.test('Set default formatter for group fields with groupInterval', function(assert) {
        const store = new RemoteStore(getCustomArrayStore([]));
        const fields = [
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'quarter' },
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'month' },
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'dayOfWeek' },
            { dataField: 'OrderDate', dataType: 'date', groupInterval: 'day' }
        ];

        store.load({
            columns: fields,
            rows: [],
            values: [{ summaryType: 'count' }],
            filters: [
                {
                    dataField: 'OrderDate', groupName: 'OrderDate', filterValues: [[1996], [1997, 1]], filterType: 'include',
                    levels: fields
                }
            ]
        }).done(function(data) {
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[0]), 'Q1', 'quarter 1');
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[1]), 'January', 'month 1');
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[2]), 'Monday', 'dayOfWeek 1');
            assert.strictEqual(pivotGridUtils.formatValue(1, fields[3]), '1', 'day 1');
        });

    });


});

QUnit.module('Mock tests', () => {

    QUnit.test('Mock should group values correctly', function(assert) {
        const dataSource = [
            { OrderDate: '1996/07/05', OrderDateYear: 1996 },
            { OrderDate: '1999/07/06', OrderDateYear: 1999 },
            { OrderDate: '1996/07/07', OrderDateYear: 1996 },
            { OrderDate: '1999/07/08', OrderDateYear: 1999 }
        ];

        const store = getCustomArrayStore(dataSource);

        store.load({
            group: [{ selector: 'OrderDate', groupInterval: 'Year' }]
        }).done(function(data) {
            assert.equal(data.length, 2, 'data was grouped');
            assert.equal(data[0].key, 1996, 'first group is correct');
            assert.equal(data[1].key, 1999, 'last group is correct');
        });

    });


});

QUnit.module('Data filtering', moduleConfig, () => {

    QUnit.test('Columns with filter values', function(assert) {
    // arrange, act
        this.load({
            columns: [{ dataField: 'ShipCountry', filterValues: ['Argentina', 'Germany'] }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
        // assert
            assert.ok(data, 'has data');
            assert.equal(data.columns.length, 2, 'count column');
            assert.equal(data.columns[0].value, 'Argentina', 'value of the first column');
            assert.equal(data.columns[1].value, 'Germany', 'value of the second column');
        });
    });

    QUnit.test('Rows with filter values', function(assert) {
    // arrange, act
        this.load({
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipVia', filterValues: [1, 3] }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
        // assert
            assert.ok(data);
            assert.equal(data.rows.length, 2, 'count column');
            assert.equal(data.rows[0].value, 1, 'value of the first row');
            assert.equal(data.rows[1].value, 3, 'value of the second row');
        });
    });

    QUnit.test('Columns and rows with filter values', function(assert) {
    // arrange, act
        this.load({
            rows: [
                { dataField: 'ShipCountry', filterValues: ['USA', 'Canada'] }
            ],
            columns: [
                { dataField: 'ShipVia', filterValues: ['1', '3'] }
            ],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
        // assert
            assert.equal(data.rows.length, 2);
            assert.equal(data.rows[0].value, 'Canada');
            assert.equal(data.rows[1].value, 'USA');
            assert.equal(data.columns.length, 2);
            assert.equal(data.columns[0].value, '1');
            assert.equal(data.columns[1].value, '3');
        });
    });

    QUnit.test('Columns and rows with filter values. Exclude Type', function(assert) {
    // arrange, act
        this.load({
            rows: [
                { dataField: 'ShipCountry', filterValues: ['USA', 'Canada'], filterType: 'exclude' }
            ],
            columns: [
                { dataField: 'ShipVia', filterValues: ['1', '3'], filterType: 'exclude' }
            ],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
        // assert
            assert.equal(data.rows.length, 19, 'count row');
            assert.equal(data.columns.length, 1, 'count column');
        });
    });

    QUnit.test('Rows with filter values when expanded is false', function(assert) {
    // arrange, act
        this.load({
            rows: [
                { dataField: 'ShipCountry' },
                { dataField: 'ShipName', filterValues: ['Alfreds Futterkiste', 'Ana Trujillo Emparedados y helados'] }
            ],
            columns: [
            ],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
        // assert
            assert.equal(data.rows.length, 2, 'count column');
            assert.equal(data.rows[0].value, 'Germany', 'value of the first row');
            assert.equal(data.rows[1].value, 'Mexico', 'value of the second row');
            assert.equal(data.columns.length, 0, 'count column');
        });
    });

    QUnit.test('Columns with filter values when expanded is false', function(assert) {
    // arrange, act
        this.load({
            columns: [
                { dataField: 'ShipCountry' },
                { dataField: 'ShipName', filterValues: ['Alfreds Futterkiste', 'Ana Trujillo Emparedados y helados'] }
            ],
            rows: [
            ],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
        // assert
            assert.equal(data.columns.length, 2, 'count column');
            assert.equal(data.columns[0].value, 'Germany', 'value of the first column');
            assert.equal(data.columns[1].value, 'Mexico', 'value of the second column');
            assert.equal(data.rows.length, 0, 'count row');
        });
    });

    QUnit.test('Columns and rows with filter values. Exclude and include types', function(assert) {
    // arrange, act
        this.load({
            rows: [
                { dataField: 'ShipCountry', filterValues: ['USA', 'Canada'], filterType: 'exclude', expanded: true },
                { dataField: 'ShipVia', filterValues: ['1', '3'] }
            ],
            columns: [
                { dataField: 'EmployeeID', filterValues: ['5', '7', '8', '9'], filterType: 'exclude' }
            ],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
        // assert
            assert.equal(data.rows.length, 18, 'count row');
            assert.equal(data.rows[0].value, 'Argentina', 'value of first row');
            assert.equal(data.rows[17].value, 'Venezuela', 'value of last row');
            assert.equal(data.rows[0].children.length, 2, 'first row children count');
            assert.equal(data.rows[0].children[0].value, 1, 'first children value');
            assert.equal(data.rows[0].children[1].value, 3, 'second children value');
            assert.equal(data.columns.length, 5, 'count column');
        });
    });

    QUnit.test('There are filter values in all dimensions', function(assert) {
    // arrange, act
        this.load({
            rows: [
                { dataField: 'ShipCountry', filterValues: ['USA', 'Canada'], filterType: 'include', expanded: true },
                { dataField: 'ShipCity' }
            ],
            columns: [
                { dataField: 'EmployeeID', filterValues: ['5', '7', '8', '9'], filterType: 'exclude' }
            ],

            filters: [{ dataField: 'ShipCity', filterValues: ['Boise', 'Seattle', 'Vancouver'] }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
        // assert
            assert.equal(data.rows.length, 2, 'count row');
            assert.equal(data.rows[0].value, 'Canada', 'value of first row');
            assert.equal(data.rows[1].value, 'USA', 'value of last row');
            assert.equal(data.rows[0].children.length, 1, 'first row children count');
            assert.equal(data.rows[1].children.length, 2, 'second row children count');
            assert.equal(data.rows[0].children[0].value, 'Vancouver', 'first children value');
            assert.equal(data.rows[1].children[1].value, 'Seattle', 'second children value');
            assert.equal(data.columns.length, 5, 'count column');
        });
    });

    QUnit.test('Filter group field. Include Type', function(assert) {
    // arrange, act
        this.load({
            rows: [
                { dataField: 'ShipVia', expanded: true },
                { dataField: 'ShipCountry', expanded: true },
                { dataField: 'ShipCity' }
            ],
            columns: [],
            values: [{ summaryType: 'count' }],
            filters: [
                {
                    groupName: 'Ship', filterValues: [[1], [2, 'Argentina']],
                    levels: [
                        { dataField: 'ShipVia', groupName: 'Ship', groupIndex: 0 },
                        { dataField: 'ShipCountry', groupName: 'Ship', groupIndex: 1 },
                        { dataField: 'ShipCity', groupName: 'Ship', groupIndex: 2 }
                    ]
                }
            ]
        }).done(function(data) {
        // assert
            assert.deepEqual(data.rows.length, 2, 'count row');
            assert.deepEqual(data.rows[0].children.length, 21, 'count child of the first row');
            assert.deepEqual(data.rows[1].children.length, 1, 'count child of the second row');
            assert.deepEqual(data.rows[1].children[0].value, 'Argentina', 'value of the first child of the second row');
        });
    });

    QUnit.test('Filter by number - include', function(assert) {
        const store = new RemoteStore(getCustomArrayStore([
            { Freight: 0, ShipCountry: 'Russia' },
            { Freight: 25, ShipCountry: 'Russia' },
            { Freight: 100, ShipCountry: 'Russia' },
            { Freight: 120, ShipCountry: 'USA' },
            { Freight: 199, ShipCountry: 'Russia' },
            { Freight: 200, ShipCountry: 'Russia' },
            { Freight: 240, ShipCountry: 'Argentina' }
        ]));

        store.load({
            columns: [{ dataField: 'Freight', groupInterval: 100, dataType: 'numeric', filterValues: [0, 100] }],
            rows: [{ dataField: 'ShipCountry' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.ok(data, 'has data');
            assert.equal(data.columns.length, 5, 'count column');

            assert.equal(data.columns[0].value, 0, 'fields in 1 interval');
            assert.equal(data.columns[1].value, 25, 'fields in 1 interval');
            assert.equal(data.columns[2].value, 100, 'fields in 2 interval');
            assert.equal(data.columns[3].value, 120, 'fields in 2 interval');
            assert.equal(data.columns[4].value, 199, 'fields in 2 interval');
        });
    });

    QUnit.test('Filter by number - exclude', function(assert) {
        const store = new RemoteStore(getCustomArrayStore([
            { Freight: 0, ShipCountry: 'Russia' },
            { Freight: 25, ShipCountry: 'Russia' },
            { Freight: 100, ShipCountry: 'Russia' },
            { Freight: 120, ShipCountry: 'USA' },
            { Freight: 199, ShipCountry: 'Russia' },
            { Freight: 200, ShipCountry: 'Russia' },
            { Freight: 240, ShipCountry: 'Argentina' }
        ]));

        store.load({
            columns: [{ dataField: 'Freight', groupInterval: 100, dataType: 'numeric', filterType: 'exclude', filterValues: [0, 200] }],
            rows: [{ dataField: 'ShipCountry' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.ok(data, 'has data');
            assert.equal(data.columns.length, 3, 'count column');

            assert.equal(data.columns[0].value, 100, 'fields in 1 interval');
            assert.equal(data.columns[1].value, 120, 'fields in 1 interval');
            assert.equal(data.columns[2].value, 199, 'fields in 2 interval');
        });
    });

    QUnit.test('Prefilter', function(assert) {
        const dataSource = [
            { 'OrderID': 10248, Customer: { name: null }, 'EmployeeID': undefined, 'OrderDate': null, 'Freight': '32.3800', 'ShipName': 'Vins et alcools Chevalier', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10249, Customer: {}, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10250, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10251, Customer: { name: 'Name' }, 'EmployeeID': 4, 'OrderDate': new Date('1996/07/08'), 'Freight': '65.8300', 'ShipName': 'Hanari Carnes', 'ShipRegion': 'RJ', 'ShipPostalCode': null }
        ];

        const store = new RemoteStore(getCustomArrayStore(dataSource));

        store.filter('OrderID', '>', 10249);
        const filterExpr = store.filter();

        store.load({
            rows: [{ dataField: 'OrderID' }],
            columns: [],
            values: [{}]
        }).done(function(data) {
            assert.strictEqual(data.rows.length, 2, 'rows count');

            assert.strictEqual(data.rows[0].value, 10250, 'first row value');
            assert.strictEqual(data.rows[1].value, 10251, 'second row value');
        });

        assert.deepEqual(filterExpr, ['OrderID', '>', 10249]);
    });

    QUnit.test('Prefilter as option', function(assert) {
        const dataSource = [
            { 'OrderID': 10248, Customer: { name: null }, 'EmployeeID': undefined, 'OrderDate': null, 'Freight': '32.3800', 'ShipName': 'Vins et alcools Chevalier', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10249, Customer: {}, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10250, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10251, Customer: { name: 'Name' }, 'EmployeeID': 4, 'OrderDate': new Date('1996/07/08'), 'Freight': '65.8300', 'ShipName': 'Hanari Carnes', 'ShipRegion': 'RJ', 'ShipPostalCode': null }
        ];

        const store = new RemoteStore({
            store: getCustomArrayStore(dataSource),
            filter: ['OrderID', '>', 10249]
        });

        const filterExpr = store.filter();

        store.load({
            rows: [{ dataField: 'OrderID', filterValues: [10250, 10251, 10249] }],
            columns: [],
            values: [{}]
        }).done(function(data) {
            assert.strictEqual(data.rows.length, 2, 'rows count');

            assert.strictEqual(data.rows[0].value, 10250, 'first row value');
            assert.strictEqual(data.rows[1].value, 10251, 'second row value');
        });

        assert.deepEqual(filterExpr, ['OrderID', '>', 10249]);
    });

    QUnit.test('Prefilter with filter filed', function(assert) {
        const dataSource = [
            { 'OrderID': 10248, Customer: { name: null }, 'EmployeeID': undefined, 'OrderDate': null, 'Freight': '32.3800', 'ShipName': 'Vins et alcools Chevalier', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10249, Customer: {}, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10250, 'EmployeeID': 6, 'OrderDate': new Date('1996/07/05'), 'Freight': '11.6100', 'ShipName': 'Toms Spezialitaten', 'ShipRegion': null, 'ShipPostalCode': null },
            { 'OrderID': 10251, Customer: { name: 'Name' }, 'EmployeeID': 4, 'OrderDate': new Date('1996/07/08'), 'Freight': '65.8300', 'ShipName': 'Hanari Carnes', 'ShipRegion': 'RJ', 'ShipPostalCode': null }
        ];

        const store = new RemoteStore(getCustomArrayStore(dataSource));

        store.filter([['OrderID', '>', 10249], 'and', ['OrderID', '<=', 10251]]);
        const filterExpr = store.filter();

        store.load({
            rows: [{ dataField: 'OrderID', filterValues: [10251] }],
            columns: [],
            values: [{}]
        }).done(function(data) {
            assert.strictEqual(data.rows.length, 1, 'row count');
            assert.strictEqual(data.rows[0].value, 10251, 'row value');
        });

        assert.deepEqual(filterExpr, [['OrderID', '>', 10249], 'and', ['OrderID', '<=', 10251]]);
    });

    QUnit.test('Filter date with incorrect groupInterval', function(assert) {
        const store = new RemoteStore({
            load: function(loadOptions) {
                assert.deepEqual(loadOptions.filter, [['OrderDate', '=', 1996]]);
                return $.Deferred();
            }
        });

        store.load({
            columns: [{ dataField: 'OrderDate', groupInterval: 10, dataType: 'date', filterValues: [1996] }],
            rows: [{ dataField: 'ShipCountry' }],
            values: [{ summaryType: 'count' }],
        });
    });

    QUnit.test('Filter by Year', function(assert) {
        const store = new RemoteStore({
            load: function(loadOptions) {
                assert.deepEqual(loadOptions.filter, [['OrderDate.Year', '=', 1996]]);
                return $.Deferred();
            }
        });

        store.load({
            columns: [{ dataField: 'OrderDate', groupInterval: 'year', dataType: 'date', filterValues: [1996] }],
            rows: [{ dataField: 'ShipCountry' }],
            values: [{ summaryType: 'count' }],
        });
    });

    QUnit.test('Filter by Month', function(assert) {
        const store = new RemoteStore({
            load: function(loadOptions) {
                assert.deepEqual(loadOptions.filter, [['OrderDate.Month', '=', 0], 'or', ['OrderDate.Month', '=', 1]]);
                return $.Deferred();
            }
        });

        store.load({
            columns: [{ dataField: 'OrderDate', groupInterval: 'month', dataType: 'date', filterValues: [0, 1] }],
            rows: [{ dataField: 'ShipCountry' }],
            values: [{ summaryType: 'count' }],
        });
    });

    QUnit.test('Filter by dayOfWeek', function(assert) {
        const store = new RemoteStore({
            load: function(loadOptions) {
                assert.deepEqual(loadOptions.filter, [['OrderDate.DayOfWeek', '=', 0], 'or', ['OrderDate.DayOfWeek', '=', 1]]);
                return $.Deferred();
            }
        });

        store.load({
            columns: [{ dataField: 'OrderDate', groupInterval: 'dayOfWeek', dataType: 'date', filterValues: [0, 1] }],
            rows: [{ dataField: 'ShipCountry' }],
            values: [{ summaryType: 'count' }],
        });
    });

    QUnit.test('Search', function(assert) {
        const store = new RemoteStore({
            load: function(loadOptions) {
                assert.deepEqual(loadOptions.filter, ['ShipCountry', 'contains', 'ru']);
                return $.Deferred();
            }
        });

        store.load({
            columns: [],
            rows: [{ dataField: 'ShipCountry', searchValue: 'ru' }],
            values: [{ summaryType: 'count' }],
        });
    });

    QUnit.test('Include filter by Quarter', function(assert) {
        const store = new RemoteStore({
            load: function(loadOptions) {
                assert.deepEqual(loadOptions.filter,
                    [
                        [['OrderDate.Month', '>=', 1], 'and', ['OrderDate.Month', '<', 4]],
                        'or',
                        [['OrderDate.Month', '>=', 4], 'and', ['OrderDate.Month', '<', 7]],
                        'or',
                        [['OrderDate.Month', '>=', 7], 'and', ['OrderDate.Month', '<', 10]],
                        'or',
                        [['OrderDate.Month', '>=', 10], 'and', ['OrderDate.Month', '<', 13]]

                    ]);
                return $.Deferred();
            }
        });

        store.load({
            columns: [
                { dataField: 'OrderDate', groupInterval: 'quarter', dataType: 'date', filterValues: [1, 2, 3, 4] }
            ],
            rows: [],
            values: [{ summaryType: 'count' }],
        });
    });

    QUnit.test('Exclude filter by Quarter', function(assert) {
        const store = new RemoteStore({
            load: function(loadOptions) {
                assert.deepEqual(loadOptions.filter,
                    [
                        [['OrderDate.Month', '<', 1], 'or', ['OrderDate.Month', '>=', 4]],
                        'and',
                        [['OrderDate.Month', '<', 4], 'or', ['OrderDate.Month', '>=', 7]],
                        'and',
                        [['OrderDate.Month', '<', 7], 'or', ['OrderDate.Month', '>=', 10]],
                        'and',
                        [['OrderDate.Month', '<', 10], 'or', ['OrderDate.Month', '>=', 13]]

                    ]);
                return $.Deferred();
            }
        });

        store.load({
            columns: [
                { dataField: 'OrderDate', groupInterval: 'quarter', dataType: 'date', filterValues: [1, 2, 3, 4], filterType: 'exclude' }
            ],
            rows: [],
            values: [{ summaryType: 'count' }],
        });
    });

    QUnit.test('Filter by number without groupInterval', function(assert) {
        const store = new RemoteStore({
            load: function(loadOptions) {
                assert.deepEqual(loadOptions.filter,
                    [
                        ['Freight', '=', 0],
                        'or',
                        ['Freight', '=', 200]
                    ]);
                return $.Deferred();
            }
        });

        store.load({
            columns: [{ dataField: 'Freight', dataType: 'numeric', filterValues: [0, 200] }],
            rows: [],
            values: [{ summaryType: 'count' }]
        });
    });

    QUnit.test('Filter by number with groupInterval', function(assert) {
        const store = new RemoteStore({
            load: function(loadOptions) {
                assert.deepEqual(loadOptions.filter,
                    [
                        [['Freight', '>=', 0], 'and', ['Freight', '<', 100]],
                        'or',
                        [['Freight', '>=', 200], 'and', ['Freight', '<', 300]]
                    ]);
                return $.Deferred();
            }
        });

        store.load({
            columns: [{ dataField: 'Freight', groupInterval: 100, dataType: 'numeric', filterValues: [0, 200] }],
            rows: [],
            values: [{ summaryType: 'count' }]
        });
    });

    // T836053
    QUnit.test('Error should not be thrown during filtering if there are more filter values ​​than fields', function(assert) {
        let filter;
        const store = new RemoteStore({
            load: function(loadOptions) {
                filter = loadOptions.filter;

                return $.Deferred();
            }
        });
        const fields = [
            { dataField: 'OrderDate', groupInterval: 'year', dataType: 'date' },
            { dataField: 'OrderDate', groupInterval: 'month', dataType: 'date' }
        ];
        const filterValues = [[1996, 1], [1996, 2], [1997, 4]];

        // assert
        assert.ok(filterValues.length > fields.length, 'more filter values ​​than fields');

        // act
        store.load({
            columns: fields,
            rows: [{ dataField: 'ShipCountry' }],
            values: [{ summaryType: 'count' }],
            filters: [{
                dataField: 'OrderDate', groupName: 'OrderDate', dataType: 'date',
                levels: fields,
                filterValues
            }]
        });

        // assert
        assert.deepEqual(filter,
            [
                [['OrderDate.Year', '=', 1996], 'and', ['OrderDate.Month', '=', 1]],
                'or',
                [['OrderDate.Year', '=', 1996], 'and', ['OrderDate.Month', '=', 2]],
                'or',
                [['OrderDate.Year', '=', 1997], 'and', ['OrderDate.Month', '=', 4]],
            ], 'filter is correct');
    });


});

QUnit.module('Expanding items', moduleConfig, () => {

    QUnit.test('Expand column', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }],
            headerName: 'columns',
            path: ['Spain']
        }).done(function(data) {
            assert.equal(data.columns.length, 3, 'columns count');
            assert.ok(!data.columns[0].children, 'columns have no children');
            assert.equal(data.columns[0].value, 'Barcelona');
            assert.equal(data.columns[1].value, 'Madrid');
            assert.equal(data.columns[2].value, 'Sevilla');
            assert.equal(data.rows.length, 3, 'rows count');
            assert.equal(data.rows[0].value, 1, 'first row value is correct');
            // T830242, T724389
            assert.deepEqual(data.values[0], [
                ['GT:count(ShipCountry,=,Spain)'],
                ['Barcelona:count(ShipCountry,=,Spain)'],
                ['Madrid:count(ShipCountry,=,Spain)'],
                ['Sevilla:count(ShipCountry,=,Spain)']
            ], 'total values');
        });
    });

    QUnit.test('Loading column with expanded item in column', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }],
            columnExpandedPaths: [['Argentina'], ['Austria']]
        }).done(function(data) {
            assert.equal(data.columns.length, 21, 'columns count');

            assert.equal(data.columns[0].value, 'Argentina', 'first column value');
            assert.ok(data.columns[0].children, 'first columns should have children');

            assert.equal(data.columns[1].value, 'Austria', 'second column value');
            assert.ok(data.columns[1].children, 'second column should not have children');

            assert.ok(!data.columns[2].children, 'third column should not have children');
            assert.ok(!data.columns[20].children, 'last column should not have children');

            assert.equal(data.rows.length, 3, 'rows count');
            assert.equal(data.rows[0].value, 1, 'first row value is correct');
        });
    });

    ['rowExpandedPaths', 'columnExpandedPaths'].forEach(expandedPathOptionName => {
        QUnit.test(`${expandedPathOptionName}. One expanded date field. Redundant filter value (T758282)`, function(assert) {
            const dataSource = { date: new Date(2010, 1, 1), anotherField: 'field' };

            let actualFilter = [];
            const store = new RemoteStore({
                store: getCustomArrayStore(dataSource),
                load: function(e) {
                    if(e.filter) {
                        actualFilter = e.filter;
                    }
                }
            });

            const loadOptions = {
                rows: [{ dataField: expandedPathOptionName === 'rowExpandedPaths' ? 'date' : 'anotherField' }],
                columns: [{ dataField: expandedPathOptionName === 'columnExpandedPaths' ? 'date' : 'anotherField' }]
            };
            loadOptions[expandedPathOptionName] = [[2010], [2010, 1]];
            store.load(loadOptions).done(function() {
                assert.deepEqual(actualFilter, [['date', '=', 2010]], 'rows count');
            });
        });

        QUnit.test(`${expandedPathOptionName}. Two expanded date fields. Redundant filter value (T758282)`, function(assert) {
            const dataSource = { date1: new Date(2010, 1, 1), date2: new Date(2010, 1, 1), anotherField: 'field' };

            let actualFilter = [];
            const store = new RemoteStore({
                store: getCustomArrayStore(dataSource),
                load: function(e) {
                    if(e.filter) {
                        actualFilter = e.filter;
                    }
                }
            });

            const loadOptions = {
                rows: [
                    { dataField: expandedPathOptionName === 'rowExpandedPaths' ? 'date1' : 'anotherField' },
                    { dataField: expandedPathOptionName === 'rowExpandedPaths' ? 'date2' : 'anotherField' }
                ],
                columns: [
                    { dataField: expandedPathOptionName === 'columnExpandedPaths' ? 'date1' : 'anotherField' },
                    { dataField: expandedPathOptionName === 'columnExpandedPaths' ? 'date2' : 'anotherField' }
                ]
            };
            loadOptions[expandedPathOptionName] = [[2010], [2010, 2010, 1]];
            store.load(loadOptions).done(function() {
                assert.deepEqual(actualFilter, [[['date1', '=', 2010]], 'and', [['date2', '=', 2010]]], 'rows count');
            });
        });
    });

    QUnit.test('Load initially expanded child after parent expand when rows have no data fields', function(assert) {
        this.load({
            columns: [
                { dataField: 'ShipCountry' },
                { dataField: 'ShipCity', expanded: true },
                { dataField: 'ShipVia' }
            ],
            headerName: 'columns',
            path: ['Spain'],
            rows: [],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3, 'columns count');
            assert.equal(data.columns[0].value, 'Barcelona', 'first column value');
            assert.equal(data.columns[0].children.length, 3, 'Ship City level should be expanded');
            assert.equal(data.columns[2].children.length, 3, 'Ship City level should be expanded');
        });
    });

    QUnit.test('Load initially expanded child after parent expand when rows have data fields', function(assert) {
        this.load({
            columns: [
                { dataField: 'ShipCountry' },
                { dataField: 'ShipVia', expanded: true },
                { dataField: 'ShipCity' }
            ],
            columnExpandedPaths: [['Argentina']],
            rows: [{ dataField: 'CustomerID' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 21, 'columns count');
            assert.equal(data.columns[0].value, 'Argentina', 'first column value');
            assert.equal(data.columns[0].children.length, 3, 'Ship City level should be expanded');

            assert.equal(data.columns[0].children.length, 3, 'first item should be expanded');
            assert.equal(data.columns[0].children[0].children.length, 1, 'Second level should be expanded');

            assert.ok(!data.columns[1].children, 'second column should not be expanded');
            assert.ok(!data.columns[20].children, 'last column should not be expanded');

        });
    });

    QUnit.test('Expanded column after expanded item. when no row fields', function(assert) {
        this.load({
            columns: [
                { dataField: 'ShipCountry' },
                { dataField: 'ShipVia', expanded: true },
                { dataField: 'ShipCity' }
            ],
            columnExpandedPaths: [['Argentina']],
            rows: [],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 21, 'columns count');
            assert.equal(data.columns[0].value, 'Argentina', 'first column value');
            assert.equal(data.columns[0].children.length, 3, 'Ship City level should be expanded');

            assert.equal(data.columns[0].children.length, 3, 'first item should be expanded');
            assert.equal(data.columns[0].children[0].children.length, 1, 'Second level should be expanded');

            assert.ok(!data.columns[1].children, 'second column should not be expanded');
            assert.ok(!data.columns[20].children, 'last column should not be expanded');

        });
    });

    QUnit.test('Expand row', function(assert) {
        const loadSpy = sinon.spy(this.externalStore, 'load');
        this.load({
            rows: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }],
            columns: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }],
            headerName: 'rows',
            path: ['Spain']
        }).done(function(data) {
            assert.equal(data.rows.length, 3, 'columns count');
            assert.ok(!data.rows[0].children, 'columns have no children');
            assert.equal(data.rows[0].value, 'Barcelona');
            assert.equal(data.rows[1].value, 'Madrid');
            assert.equal(data.rows[2].value, 'Sevilla');

            assert.equal(data.columns.length, 3, 'rows count');
            assert.equal(data.columns[0].value, 1, 'first column value is correct');
            assert.equal(loadSpy.callCount, 1);
        });
    });

    QUnit.test('Load initially expanded child after parent expand when columns have data fields', function(assert) {
        this.load({
            rows: [
                { dataField: 'ShipCountry' },
                { dataField: 'ShipVia', expanded: true },
                { dataField: 'ShipCity' }
            ],
            rowExpandedPaths: [['Argentina']],
            columns: [{ dataField: 'CustomerID' }],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.rows.length, 21, 'rows count');
            assert.equal(data.rows[0].value, 'Argentina', 'first row value');
            assert.equal(data.rows[0].children.length, 3, 'first item should be expanded');

            assert.equal(data.rows[0].children[0].children.length, 1, 'Second level should be expanded');

            assert.ok(!data.rows[1].children, 'second row should not be expanded');
            assert.ok(!data.rows[20].children, 'last row should not be expanded');

        });
    });

    QUnit.test('Expanded row after expanded item. when no column fields', function(assert) {
        this.load({
            rows: [
                { dataField: 'ShipCountry' },
                { dataField: 'ShipVia', expanded: true },
                { dataField: 'ShipCity' }
            ],
            rowExpandedPaths: [['Argentina']],
            columns: [],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(data.rows.length, 21, 'rows count');
            assert.equal(data.rows[0].value, 'Argentina', 'first row value');
            assert.equal(data.rows[0].children.length, 3, 'first item should be expanded');

            assert.equal(data.rows[0].children[0].children.length, 1, 'Second level should be expanded');

            assert.ok(!data.rows[1].children, 'second row should not be expanded');
            assert.ok(!data.rows[20].children, 'last row should not be expanded');

        });
    });

    QUnit.test('Total should be correct when load initially expanded child on two level', function(assert) {
        this.load({
            rows: [
                { dataField: 'ShipCountry' },
                { dataField: 'ShipRegion' },
                { dataField: 'ShipCity' }
            ],
            rowExpandedPaths: [['USA', 'AK']],
            columns: [],
            values: [{ summaryType: 'count' }]
        }).done(function(data) {
            assert.equal(getRowTotal(data, data.rows[19]), 'USA:count');
            assert.equal(getRowTotal(data, data.rows[19].children[0]), 'USA-AK:count(ShipCountry,=,USA)');
            assert.equal(getRowTotal(data, data.rows[19].children[0].children[0]), 'USA-AK-Anchorage:count(ShipCountry,=,USA,and,ShipRegion,=,AK)');

        });
    });

    QUnit.test('Expand row on several levels', function(assert) {
        this.load({
            rows: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }, { dataField: 'ShipName' }],
            values: [{ summaryType: 'count' }],
            headerName: 'rows',
            columns: [],
            path: ['Spain', 'Madrid']
        }).done(function(data) {
            assert.equal(data.rows.length, 2, 'rows count');
            assert.equal(data.rows[0].value, 'Bolido Comidas preparadas', 'fist row value');
            assert.equal(data.rows[1].value, 'Romero y tomillo', 'second row value');

            assert.equal(data.columns.length, 0, 'columns count');
        });
    });

    QUnit.test('Expand column item when row has expanded item', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }],
            rows: [{ dataField: 'ShipVia' }, { dataField: 'CustomerID' }],
            values: [{ summaryType: 'count' }],
            headerName: 'columns',
            rowExpandedPaths: [[1]],
            path: ['Spain']
        }).done(function(data) {
            assert.equal(data.columns.length, 3, 'rows count');
            assert.equal(data.columns[0].value, 'Barcelona');
            assert.equal(data.columns[2].value, 'Sevilla');

            assert.equal(data.rows.length, 3, 'columns count');

            assert.equal(data.rows[0].value, 1, 'first column value');
            assert.ok(data.rows[0].children, 'ShipVia 1 has children');
            assert.equal(data.rows[0].children.length, 4, 'first column should be expanded and have 4 children');
            assert.equal(data.rows[0].children[0].value, 'BOLID', 'ShipVia 1 first children value');

            assert.ok(!data.rows[1].children, 'second column should be not expanded');
            assert.ok(!data.rows[2].children, 'third column should be not expanded');
        });
    });

    QUnit.test('Expand column Item when there is another expanded item', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry' }, { dataField: 'ShipCity' }],
            rows: [{ dataField: 'ShipVia' }, { dataField: 'CustomerID' }],
            values: [{ summaryType: 'count' }],
            headerName: 'columns',
            columnExpandedPaths: [['Germany']],
            path: ['Spain']
        }).done(function(data) {
            assert.equal(data.columns.length, 3, 'rows count');
            assert.equal(data.columns[0].value, 'Barcelona');
            assert.equal(data.columns[2].value, 'Sevilla');
        });
    });

    QUnit.test('Expand first level when other item is expanded without rows', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipCity' }, { dataField: 'ShipVia' }],
            rows: [],
            values: [{ summaryType: 'count' }],
            columnExpandedPaths: [['Germany', 'Berlin']]
        }).done(function(data) {
            assert.ok(data.columns[0].children, 'columns should have children');
            assert.equal(data.columns[0].value, 'Argentina');

            assert.ok(data.columns[8].children, '8-th column should have children');
            assert.strictEqual(data.columns[8].value, 'Germany', '8-th column value');

            assert.ok(data.columns[8].children[1].children, 'Berlin item should have children');

            assert.strictEqual(getValue(data, undefined, data.columns[8].children[1].children[0]), 'Germany-Berlin-1:count(ShipCountry,=,Germany,and,ShipCity,=,Berlin)', 'value of expanded item');
        });
    });

    QUnit.test('Expand first level when other item is expanded without rows. Second level items are same in each parent item', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipVia' }, { dataField: 'ShipCity' }],
            rows: [],
            values: [{ summaryType: 'count' }],
            columnExpandedPaths: [['Germany', 1]]
        }).done(function(data) {
            assert.ok(!data.columns[0].children[0].children, 'Argentina-1 should be collapsed');
            assert.ok(!data.columns[0].children[1].children, 'Argentina-2 should be collapsed');

            assert.ok(data.columns[8].children[0].children, 'Germany-1 should be expanded');
            assert.ok(!data.columns[8].children[1].children, 'Germany-2 should be collapsed');
        });
    });

    QUnit.test('Expand first level when other item is expanded in columns', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipCity' }, { dataField: 'ShipVia' }],
            rows: [{ dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }],
            columnExpandedPaths: [['Germany', 'Berlin']]
        }).done(function(data) {
            assert.ok(data.columns[0].children, 'columns should have children');
            assert.equal(data.columns[0].value, 'Argentina');
            assert.strictEqual(data.rows.length, 3);

            assert.ok(data.columns[8].children, '8-th column should have children');
            assert.strictEqual(data.columns[8].value, 'Germany', '8-th column value');

            assert.ok(data.columns[8].children[1].children, 'Berlin item should have children');

            assert.strictEqual(getValue(data, undefined, data.columns[8].children[1].children[0]), 'Germany-Berlin-1:count(ShipCountry,=,Germany,and,ShipCity,=,Berlin)', 'value of expanded item');
            assert.strictEqual(getValue(data, data.rows[0], data.columns[0].children[0]), '1-Argentina-Buenos Aires:count', 'value of expanded item');
        });
    });

    QUnit.test('Expand first level when other item is expanded in rows without columns', function(assert) {
        this.load({
            columns: [],
            rows: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipCity' }, { dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }],
            rowExpandedPaths: [['Germany', 'Berlin']]
        }).done(function(data) {
            assert.ok(data.rows[0].children, 'rows should have children');
            assert.equal(data.rows[0].value, 'Argentina');

            assert.ok(data.rows[8].children, '8-th row should have children');
            assert.strictEqual(data.rows[8].value, 'Germany', '8-th row value');

            assert.ok(data.rows[8].children[1].children, 'Berlin item should have children');

            assert.strictEqual(getValue(data, data.rows[8].children[1].children[0]), 'Germany-Berlin-1:count(ShipCountry,=,Germany,and,ShipCity,=,Berlin)', 'value of expanded item');
        });
    });

    QUnit.test('Expand first level when other item is expanded in rows', function(assert) {
        this.load({
            columns: [{ dataField: 'ShipVia' }],
            rows: [{ dataField: 'ShipCountry', expanded: true }, { dataField: 'ShipCity' }, { dataField: 'ShipVia' }],
            values: [{ summaryType: 'count' }],
            rowExpandedPaths: [['Germany', 'Berlin']]
        }).done(function(data) {
            assert.ok(data.rows[0].children, 'rows should have children');
            assert.equal(data.rows[0].value, 'Argentina');
            assert.strictEqual(data.columns.length, 3);

            assert.ok(data.rows[8].children, '8-th row should have children');
            assert.strictEqual(data.rows[8].value, 'Germany', '8-th row value');

            assert.ok(data.rows[8].children[1].children, 'Berlin item should have children');

            assert.strictEqual(getValue(data, data.rows[8].children[1].children[0]), 'Germany-Berlin-1:count(ShipCountry,=,Germany,and,ShipCity,=,Berlin)', 'value of expanded item');
            assert.strictEqual(getValue(data, data.rows[0].children[0], data.rows[0]), 'Argentina-Buenos Aires-1:count', 'value of expanded item');
        });
    });


});

QUnit.module('DrillDown', {
    beforeEach: function() {
        moduleConfig.beforeEach.apply(this, arguments);

        const store = this.store;

        this.getDrillDownData = function() {
            const drillDownDataSource = store.createDrillDownDataSource.apply(store, arguments);

            drillDownDataSource.paginate(false);

            return drillDownDataSource.load();
        };
    }
}, () => {

    QUnit.test('without params', function(assert) {
        this.getDrillDownData().done(function(data) {
            assert.strictEqual(data.length, 830, 'should return all items');
        });
    });

    QUnit.test('with empty loadOptions', function(assert) {
        this.getDrillDownData({}).done(function(data) {
            assert.strictEqual(data.length, 830, 'should return all items');
            assert.deepEqual(data[0], {
                'CustomerID': 'VINET',
                'EmployeeID': 5,
                'Freight': '32.3800',
                'OrderDate': '1996/07/04',
                'OrderID': 10248,
                'RequiredDate': '1996/08/01',
                'ShipAddress': '59 rue de l\'Abbaye',
                'ShipCity': 'Reims',
                'ShipCountry': 'France',
                'ShipName': 'Vins et alcools Chevalier',
                'ShipPostalCode': '51100',
                'ShipRegion': null,
                'ShipVia': 3,
                'ShippedDate': '1996/07/16'
            }, 'first item');
        });
    });

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

    QUnit.test('DrillDown with filters', function(assert) {
        this.getDrillDownData({
            columns: [{ dataField: 'ShipCountry', filterValues: ['Argentina', 'Brazil', 'Canada', 'USA'] }],
            rows: [{ dataField: 'ShipVia', filterValues: [1, 3] }],
            filters: [{ dataField: 'ShipCity', filterValues: ['Campinas', 'Tsawassen', 'Vancouver', 'Portland'] }],
            values: [{ summaryType: 'count' }]
        }, { columnPath: [], rowPath: [] }).done(function(data) {
            assert.strictEqual(data.length, 25, 'items count');
        });
    });

    QUnit.test('DrillDown with filters and slice paths', function(assert) {

        this.getDrillDownData({
            columns: [{ dataField: 'ShipCountry', filterValues: ['Argentina', 'Brazil', 'Canada', 'USA'] }],
            rows: [{ dataField: 'ShipVia', filterValues: [1, 3] }],
            values: [{ summaryType: 'count' }],
            filters: [{ dataField: 'ShipCity', filterValues: ['Campinas', 'Tsawassen', 'Vancouver', 'Portland'] }]
        }, { columnPath: ['USA'], rowPath: [1] }).done(function(data) {
            assert.strictEqual(data.length, 3, 'items count');
        });
    });

    QUnit.test('DrillDown with user filter', function(assert) {
        const drillDownDataSource = this.store.createDrillDownDataSource({
            columns: [{ dataField: 'ShipCountry' }],
            rows: [{ dataField: 'ShipVia', filterValues: [1, 3] }],
            filters: [{ dataField: 'ShipCity' }],
            values: [{ summaryType: 'count' }]
        }, { columnPath: [], rowPath: [] });

        drillDownDataSource.paginate(false);

        drillDownDataSource.filter(['OrderID', '>', 10249], 'and', ['OrderID', '<=', 10251]);

        drillDownDataSource.load().done(function(data) {
            assert.strictEqual(data.length, 1, 'items count');
        });
    });

});

