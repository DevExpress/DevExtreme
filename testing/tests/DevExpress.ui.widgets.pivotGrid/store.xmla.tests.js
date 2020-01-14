define(function(require) {
    if('callPhantom' in window) return;

    if(!window.INTRANET) {
        QUnit.skip('[non-intranet environment]');
        return;
    }

    const browser = require('core/utils/browser');

    if(browser.msie && parseInt(browser.version) >= 17) return;

    const $ = require('jquery');
    const DATA_SOURCE_URL = 'http://teamdashboard.corp.devexpress.com/MSOLAP2008/msmdpump.dll';
    const pivotGridUtils = require('ui/pivot_grid/ui.pivot_grid.utils');
    const pivotGridDataSource = require('ui/pivot_grid/data_source');
    const XmlaStore = require('ui/pivot_grid/xmla_store');

    const CATEGORIES_DATA = [
        { key: '[Product].[Category].&[4]', value: 'Accessories', text: 'Accessories', index: 1 },
        { key: '[Product].[Category].&[1]', value: 'Bikes', text: 'Bikes', index: 2 },
        { key: '[Product].[Category].&[3]', value: 'Clothing', text: 'Clothing', index: 3 }
    ];

    const CATEGORIES_HIERARCHY_DATA = [
        { key: '[Product].[Product Categories].[Category].&[4]', value: 'Accessories', text: 'Accessories', index: 1 },
        { key: '[Product].[Product Categories].[Category].&[1]', value: 'Bikes', text: 'Bikes', index: 2 },
        { key: '[Product].[Product Categories].[Category].&[3]', value: 'Clothing', text: 'Clothing', index: 3 }
    ];

    const CATEGORIES_DATA_WITH_COMPONENTS = CATEGORIES_DATA.concat({
        index: 4,
        text: 'Components',
        value: 'Components',
        key: '[Product].[Category].&[2]'
    });

    const BIKES_SUBCATEGORY_DATA = [{
        index: 1,
        key: '[Product].[Product Categories].[Subcategory].&[1]',
        text: 'Mountain Bikes',
        value: 'Mountain Bikes'
    },
    {
        index: 2,
        key: '[Product].[Product Categories].[Subcategory].&[2]',
        text: 'Road Bikes',
        value: 'Road Bikes'
    },
    {
        index: 3,
        key: '[Product].[Product Categories].[Subcategory].&[3]',
        text: 'Touring Bikes',
        value: 'Touring Bikes'
    }];

    const CALENDAR_YEAR_DATA = [{
        index: 1,
        text: 'CY 2001',
        value: 2001,
        key: '[Ship Date].[Calendar Year].&[2001]'
    }, {
        index: 2,
        text: 'CY 2002',
        value: 2002,
        key: '[Ship Date].[Calendar Year].&[2002]'
    }, {
        index: 3,
        text: 'CY 2003',
        value: 2003,
        key: '[Ship Date].[Calendar Year].&[2003]'
    }, {
        index: 4,
        text: 'CY 2004',
        value: 2004,
        key: '[Ship Date].[Calendar Year].&[2004]'
    }];

    const CALENDAR_HIERARCHY_YEAR_DATA = [{
        index: 1,
        text: 'CY 2001',
        value: 2001,
        key: '[Ship Date].[Calendar].[Calendar Year].&[2001]'
    }, {
        index: 2,
        text: 'CY 2002',
        value: 2002,
        key: '[Ship Date].[Calendar].[Calendar Year].&[2002]'
    }, {
        index: 3,
        text: 'CY 2003',
        value: 2003,
        key: '[Ship Date].[Calendar].[Calendar Year].&[2003]'
    }, {
        index: 4,
        text: 'CY 2004',
        value: 2004,
        key: '[Ship Date].[Calendar].[Calendar Year].&[2004]'
    }];

    function findItems(data, field, value) {
        const result = [];
        $.each(data, function(_, item) {
            if(item[field] === value) {
                result.push(item);
            }
        });

        return result;
    }

    function getColumnByIndex(data, index) {
        return $.map(data, function(items) {
            return items[index];
        });
    }

    function getFailCallBack(assert) {
        return function(e, textStatus) {
            e = e || {};
            assert.ok(false, e.statusText);
            assert.ok(false, e.stack);
        };
    }

    function getValue(data, rowItem, columnItem, measureIndex) {
        const columnIndex = columnItem ? columnItem.index : data.grandTotalColumnIndex;
        const rowIndex = rowItem ? rowItem.index : data.grandTotalRowIndex;

        return data.values[rowIndex][columnIndex][measureIndex || 0];
    }

    function removeIndexesAndValue(data) {
        pivotGridUtils.foreachTree(data, function(items) {
            delete items[0].index;
            delete items[0].value;
            delete items[0].key;
        });
        return data;
    }
    const testEnvironment = {
        beforeEach: function() {
            this.store = new XmlaStore(this.dataSource);

            this.load = function(options) {
                return this.store.load(options).done(function(data) {
                    pivotGridDataSource.sort(options, data);
                });
            };

        },
        dataSource: {
            url: DATA_SOURCE_URL,
            catalog: 'Adventure Works DW Standard Edition',
            cube: 'Adventure Works'
        }
    };

    QUnit.module('Adventure Works', testEnvironment);

    QUnit.test('XMLA store have filter, key methods', function(assert) {
        assert.strictEqual(this.store.filter(), undefined);
        assert.strictEqual(this.store.key(), undefined);
    });

    QUnit.test('incorrect dataSource', function(assert) {
        const done = assert.async();
        new XmlaStore({
            url: '',
            catalog: 'Adventure Works DW Standard Edition',
            cube: 'Adventure Works'
        }).load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).fail(function(error) {
            assert.ok(error.statusText.indexOf('E4023') > -1);
            done();
        });
    });

    QUnit.test('not defined data in description', function(assert) {
        const done = assert.async();
        this.store.load({}).done(function(data) {
            assert.ok(data);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.ok(!data.rows.length);
            assert.ok(!data.columns.length);
            assert.deepEqual(data.values, [[[80450596.9823]]]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Adventure Works', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);
            assert.deepEqual(data.rows, CALENDAR_YEAR_DATA);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[18484], [15114], [9132], [6852]],
                [[962], [null], [962], [null]],
                [[2665], [null], [2665], [null]],
                [[9002], [6470], [4756], [2717]],
                [[11753], [9745], [5646], [4340]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Adventure Works. Expand item', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }, { dataField: '[Ship Date].[Month Of Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: [CALENDAR_YEAR_DATA[2].key]
        }).done(function(data) {

            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.strictEqual(data.rows.length, 12);

            assert.strictEqual(data.rows[0].text, 'January');

            assert.strictEqual(data.rows[6].text, 'July');
            assert.strictEqual(data.rows[7].text, 'August');

            assert.strictEqual(data.rows[11].text, 'December');
            assert.deepEqual(data.rows[11].value, 12);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(getValue(data, data.rows[6]), 462, 'GT - 2003 July');

            assert.strictEqual(getValue(data, data.rows[7]), 1262, 'GT - 2003 August');

            assert.strictEqual(getValue(data, data.rows[7], data.columns[1]), 492), 'Bikes - 2003 August';

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Adventure Works. Expand column & row', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }, { dataField: '[Ship Date].[Month Of Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'columns',
            rowExpandedPaths: [[CALENDAR_YEAR_DATA[2].key]],
            path: [CATEGORIES_DATA[1].key]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 3);
            assert.strictEqual(data.columns[0].text, 'Mountain Bikes');
            assert.strictEqual(data.columns[1].text, 'Road Bikes');
            assert.strictEqual(data.columns[2].text, 'Touring Bikes');

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, 'CY 2001');
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, 'CY 2003');
            assert.strictEqual(data.rows[2].index, 3, 'expanded row');
            assert.ok(data.rows[2].children, 'expanded row should has children');
            assert.strictEqual(data.rows[2].children.length, 12);
            assert.strictEqual(data.rows[2].children[0].text, 'January');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0, 'GT row index');

            assert.strictEqual(getValue(data, data.rows[2], data.columns[0]), 1896, 'Mounain Bikes - 2003');

            assert.strictEqual(getValue(data, data.rows[2].children[0], data.columns[0]), 98, 'Mounain Bikes - 2003 January');

            assert.strictEqual(getValue(data, data.rows[2].children[0], data.columns[2]), null, 'Touring Bikes - 2003 January');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Load with expand column & row', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }, { dataField: '[Ship Date].[Month Of Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],

            rowExpandedPaths: [[CALENDAR_YEAR_DATA[2].key]],
            columnExpandedPaths: [[CATEGORIES_DATA[1].key]]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 3);
            assert.strictEqual(data.columns[0].text, 'Accessories');
            assert.ok(!data.columns[0].children, 'Accessories doesn\'t have children');

            assert.strictEqual(data.columns[1].text, 'Bikes');
            assert.strictEqual(data.columns[1].children[0].text, 'Mountain Bikes');
            assert.strictEqual(data.columns[1].children[1].text, 'Road Bikes');
            assert.strictEqual(data.columns[1].children[2].text, 'Touring Bikes');

            assert.strictEqual(data.columns[2].text, 'Clothing');
            assert.ok(!data.columns[2].children, 'Clothing doesn\'t have children');

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, 'CY 2001');
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, 'CY 2003');
            assert.strictEqual(data.rows[2].index, 3, 'expanded row: CY 2003 index ');
            assert.ok(data.rows[2].children, 'expanded row should has children');
            assert.strictEqual(data.rows[2].children.length, 12);
            assert.strictEqual(data.rows[2].children[0].text, 'January');

            assert.strictEqual(data.rows[2].children[7].text, 'August');

            assert.strictEqual(data.grandTotalColumnIndex, 0);

            assert.strictEqual(data.grandTotalRowIndex, 0, 'GT row index');

            assert.strictEqual(getValue(data), 18484, 'Grand Total');

            assert.strictEqual(getValue(data, data.rows[2], data.columns[1].children[0]), 1896, 'Mounain Bikes - 2003');

            assert.strictEqual(getValue(data, data.rows[2].children[0], data.columns[1].children[0]), 98, 'Mounain Bikes - 2003 January');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Adventure Works. Expand second level child', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }, { dataField: '[Ship Date].[Month Of Year]' }, { dataField: '[Ship Date].[Day Of Month]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: [CALENDAR_YEAR_DATA[2].key, '[Ship Date].[Month Of Year].&[8]']
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.strictEqual(data.rows.length, 31);

            assert.deepEqual(data.rows[0].value, 1);
            assert.strictEqual(data.rows[0].text, '1');
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, '3');
            assert.strictEqual(data.rows[3].text, '4');

            assert.ok(!data.rows[2].children, 'expanded row should has children');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(getValue(data, data.rows[0]), 15, 'GT - August1');

            assert.strictEqual(getValue(data, data.rows[0], data.columns[1]), 15, 'Bikes - August1');
            assert.strictEqual(getValue(data, data.rows[3], data.columns[2]), 5, 'Clothing - August4');

            assert.strictEqual(getValue(data, data.rows[3]), 16, 'GT - August4');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Adventure Works. Expand child when opposite axis expanded on several levels', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }, { dataField: '[Ship Date].[Month Of Year]' }, { dataField: '[Ship Date].[Day Of Month]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'columns',
            rowExpandedPaths: [[CALENDAR_YEAR_DATA[2].key], [CALENDAR_YEAR_DATA[2].key, '[Ship Date].[Month Of Year].&[8]']],
            path: [CATEGORIES_DATA[1].key]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 3);
            assert.strictEqual(data.columns[0].text, 'Mountain Bikes');
            assert.strictEqual(data.columns[1].text, 'Road Bikes');
            assert.strictEqual(data.columns[2].text, 'Touring Bikes');

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, 'CY 2001');
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, 'CY 2003');
            assert.equal(data.rows[2].children.length, 12, 'expanded year\'s children');

            assert.equal(data.rows[2].children[7].text, 'August', 'expanded month value');
            assert.ok(data.rows[2].children[7].children, 'children exist');
            assert.equal(data.rows[2].children[7].children.length, 31, 'expanded month\'s childern');
            assert.equal(data.rows[2].children[7].children[3].value, '4', 'August 4 value');

            assert.strictEqual(data.rows[2].text, 'CY 2003', 'expanded row value');
            assert.ok(data.rows[2].children, 'expanded row should has children');
            assert.strictEqual(data.rows[2].children.length, 12, 'expanded row children');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(getValue(data, data.rows[2].children[7], data.columns[0]), 184, 'GT - Mountain Bikes - August');
            assert.strictEqual(getValue(data, data.rows[2].children[7].children[3], data.columns[0]), 5, 'Mountain Bikes - August4');
            assert.strictEqual(getValue(data, data.rows[2].children[7].children[3], data.columns[1]), 9, 'Road Bikes - August4');
            assert.strictEqual(getValue(data, data.rows[2].children[7].children[3], data.columns[2]), 2, 'Touring Bikes - August4');

            done();
        }).fail(function() {
            assert.ok(false, 'failed');
            done();
        });
    });

    QUnit.test('Load expanded axis', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]', expanded: true }, { dataField: '[Product].[Subcategory]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(data.columns[0].children);
            assert.strictEqual(data.columns[0].children.length, 8);

            assert.ok(data.columns[1].children);
            assert.strictEqual(data.columns[1].children.length, 3);

            assert.ok(data.columns[2].children);
            assert.strictEqual(data.columns[2].children.length, 6);

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 18484, 'GT');
            done();
        }).fail(function() {
            assert.ok(false, 'failed');
            done();
        });
    });

    QUnit.test('Load with expanded hidden level item', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]', expanded: true }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);
            assert.ok(!data.columns[1].children);
            assert.ok(!data.columns[2].children);
            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 18484, 'GT');
            done();
        }).fail(function() {
            assert.ok(false, 'failed');
            done();
        });
    });

    QUnit.test('Expanded all items', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]', expanded: true }, {
                dataField: '[Product].[Subcategory]',
                expanded: true
            }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]', expanded: true }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(data.columns[0].children);
            assert.strictEqual(data.columns[0].children.length, 8);

            assert.ok(data.columns[1].children);
            assert.strictEqual(data.columns[1].children.length, 3);

            assert.ok(data.columns[2].children);
            assert.strictEqual(data.columns[2].children.length, 6);

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 18484, 'GT');
            done();
        }).fail(function() {
            assert.ok(false, 'failed');
            done();
        });
    });

    QUnit.test('Loaded with two level expanded items', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]', expanded: true },
                { dataField: '[Ship Date].[Calendar Quarter of Year]', expanded: true },
                { dataField: '[Ship Date].[Month of Year]' },
                { dataField: '[Ship Date].[Day Name]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);

            assert.strictEqual(data.rows.length, 4);

            $.each(data.rows, function(i, row) {
                assert.ok(row.children, 'row[' + i + '] -should has children');

                $.each(row.children, function(j, row) {
                    assert.ok(row.children, 'row[' + i + '][' + j + '] -should has children');
                });
            });

            assert.strictEqual(data.rows[0].text, 'CY 2001');
            assert.strictEqual(data.rows[0].children.length, 2);
            assert.strictEqual(data.rows[0].children[0].text, 'CY Q3');
            assert.strictEqual(data.rows[0].children[1].text, 'CY Q4');
            assert.strictEqual(data.rows[1].text, 'CY 2002');

            assert.strictEqual(data.rows[3].children[2].text, 'CY Q3');

            assert.strictEqual(getValue(data, data.rows[2].children[0]), 792, '2003 CY Q1 -> Total');
            assert.strictEqual(getValue(data, data.rows[1].children[1]), 627, '2002 CY Q2 -> Total');
            assert.strictEqual(getValue(data, data.rows[3].children[1]), 5973, '2004 CY Q2 -> Total');

            assert.strictEqual(getValue(data), 18484, 'GT');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Expand item with expanded children', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]' },
                { dataField: '[Ship Date].[Calendar Quarter of Year]', expanded: true },
                { dataField: '[Ship Date].[Month of Year]' },
                { dataField: '[Ship Date].[Day Name]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: [CALENDAR_YEAR_DATA[2].key]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);

            assert.strictEqual(data.rows.length, 4);

            $.each(data.rows, function(i, row) {
                assert.ok(row.children, 'row[' + i + '] -should has children');
            });

            assert.strictEqual(data.rows[0].text, 'CY Q1');
            assert.deepEqual(data.rows[0].value, 'CY Q1');
            assert.strictEqual(data.rows[0].children.length, 3);
            assert.strictEqual(data.rows[0].children[0].text, 'January');
            assert.strictEqual(data.rows[0].children[2].text, 'March');
            assert.strictEqual(data.rows[1].text, 'CY Q2');

            assert.strictEqual(data.rows[data.rows.length - 1].text, 'CY Q4');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(getValue(data, data.rows[0]), 792, 'CY Q1 Total');
            assert.strictEqual(getValue(data, data.rows[1]), 938, 'CY Q2 Total');
            assert.strictEqual(getValue(data, data.rows[data.rows.length - 1]), 4968, 'CY Q4 Total');

            assert.strictEqual(getValue(data, data.rows[0].children[2]), 271, 'CY Q1->March Total');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('defined only cells', function(assert) {
        const done = assert.async();
        this.store.load({
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.ok(data);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.rows, []);
            assert.deepEqual(data.columns, []);
            assert.deepEqual(data.values, [
                [[18484]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('defined columns and cells', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            values: [{ dataField: '[Measures].[Internet Sales Amount]', caption: 'Count' }]
        }).done(function(data) {
            assert.ok(data);

            assert.deepEqual(data.columns, CATEGORIES_DATA, 'columns');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.deepEqual(data.values, [
                [[29358677.2207], [700759.96], [28318144.6507], [339772.61]]
            ], 'cells');

            assert.ok(!data.rows.length, 'rows');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('defined cells and rows', function(assert) {
        const done = assert.async();
        this.store.load({
            rows: [{ dataField: '[Product].[Category]' }],
            values: [{ dataField: '[Measures].[Internet Sales Amount]', caption: 'Count' }]
        }).done(function(data) {
            assert.ok(data);

            assert.deepEqual(data.rows, CATEGORIES_DATA, 'rows');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.deepEqual(data.values, [
                [[29358677.2207]],
                [[700759.96]],
                [[28318144.6507]],
                [[339772.61]]
            ], 'cells');

            assert.ok(!data.columns.length, 'rows');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('defined columns and rows', function(assert) {
        const done = assert.async();
        this.store.load({
            rows: [{ dataField: '[Product].[Category]' }],
            columns: [{ dataField: '[Ship Date].[Calendar Year]' }]
        }).done(function(data) {
            assert.deepEqual(data.rows, CATEGORIES_DATA_WITH_COMPONENTS, 'rows');

            assert.deepEqual(data.columns, CALENDAR_YEAR_DATA, 'columns');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.deepEqual(data.values, [
                [[80450596.9823], [8065435.3053], [24144429.654], [32202669.4252], [16038062.5978]],
                [[571297.9278], [20235.3646], [92735.3534], [296532.8766], [161794.3332]],
                [[66302381.557], [7395348.6266], [19956014.6741], [25551775.0727], [13399243.1836]],
                [[1777840.8391], [34376.3353], [485587.1546], [871864.1866], [386013.1626]],
                [[11799076.6584], [615474.9788], [3610092.4719], [5482497.2893], [2091011.9184]]
            ], 'cells');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('defined columns only', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Ship Date].[Calendar Year]' }]
        }).done(function(data) {
            assert.ok(data);

            assert.deepEqual(data.rows, [], 'rows');

            assert.deepEqual(data.columns, CALENDAR_YEAR_DATA, 'columns');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.deepEqual(data.values, [
                [[80450596.9823], [8065435.3053], [24144429.654], [32202669.4252], [16038062.5978]]
            ], 'cells');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('defined rows only', function(assert) {
        const done = assert.async();
        this.store.load({
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }]
        }).done(function(data) {
            assert.ok(data);

            assert.deepEqual(data.rows, CALENDAR_YEAR_DATA);

            assert.deepEqual(data.columns, [], 'columns');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.deepEqual(data.values, [
                [[80450596.9823]],
                [[8065435.3053]],
                [[24144429.654]],
                [[32202669.4252]],
                [[16038062.5978]]
            ], 'cells');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Load with two measures', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [
                { dataField: '[Measures].[Customer Count]', caption: 'Count' },
                { dataField: '[Measures].[Order Count]', caption: 'Count' }
            ]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA_WITH_COMPONENTS);
            assert.deepEqual(data.rows, CALENDAR_YEAR_DATA);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[18484, 31455], [15114, 19523], [9132, 18358], [6852, 9871], [null, 2646]],
                [[962, 1328], [null, 135], [962, 1307], [null, 242], [null, 205]],
                [[2665, 3680], [null, 356], [2665, 3515], [null, 644], [null, 702]],
                [[9002, 12027], [6470, 7701], [4756, 6772], [2717, 3816], [null, 1138]],
                [[11753, 14420], [9745, 11331], [5646, 6764], [4340, 5169], [null, 601]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('T321308: dxPivotGrid with XMLA store - uncaught exception occurs when all field cells are empty', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Internet Sales Order Details].[Carrier Tracking Number]' }],
            rows: [],
            values: [
                { dataField: '[Measures].[Customer Count]', caption: 'Count' }
            ]
        }).done(function(data) {
            assert.ok(data);
            assert.ok(data.values.length);
            assert.strictEqual(getValue(data), 18484);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('T566739. Get All field values without load values', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [],
            values: [
                { dataField: '[Measures].[Internet Order Count]', caption: 'Data1' },
                { dataField: '[Measures].[Growth in Customer Base]', caption: 'Data2' },
                { dataField: '[Measures].[Customer Count]', caption: 'Data3' }
            ],
            skipValues: true
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA_WITH_COMPONENTS);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('T677334. Correct parse result with empty member value', function(assert) {
        const send = pivotGridUtils.sendRequest;
        sinon.stub(pivotGridUtils, 'sendRequest', function() {
            const deferred = $.Deferred();
            send.apply(this, arguments)
                .then(function() {
                    arguments[0] = arguments[0].replace(/<MEMBER_VALUE xsi:type="xsd:short">2001<\/MEMBER_VALUE>/g, '<MEMBER_VALUE/>');
                    deferred.resolve.apply(deferred, arguments);
                })
                .fail(deferred.reject);

            return deferred.promise();
        });

        const done = assert.async();

        this.store
            .load({
                columns: [],
                rows: [{ dataField: '[Ship Date].[Calendar Year]' }, { dataField: '[Ship Date].[Month Of Year]' }],
                values: [{ dataField: '[Measures].[Customer Count]' }],
                rowExpandedPaths: [[CALENDAR_YEAR_DATA[0].key]]
            })
            .done(function(data) {
                assert.strictEqual(data.rows.length, 4);
                assert.strictEqual(data.rows[0].value, '');
                assert.strictEqual(getValue(data, data.rows[0], data.columns[0]), 962);
            })
            .fail(getFailCallBack(assert))
            .always(function() {
                pivotGridUtils.sendRequest.restore();
                done();
            });
    });

    QUnit.module('Hierarchies', testEnvironment);

    function getGrandTotalIndexForExpanding(store) {
        if(store instanceof XmlaStore) {
            return undefined;
        } else {
            return 0;
        }
    }

    QUnit.test('Load from hierachy', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [{
                dataField: '[Ship Date].[Calendar].[Calendar Year]',
                hierarchyName: '[Ship Date].[Calendar]'
            }, { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_HIERARCHY_DATA);
            assert.deepEqual(data.rows, CALENDAR_HIERARCHY_YEAR_DATA);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[18484], [15114], [9132], [6852]],
                [[962], [null], [962], [null]],
                [[2665], [null], [2665], [null]],
                [[9002], [6470], [4756], [2717]],
                [[11753], [9745], [5646], [4340]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy. Expand item', function(assert) {
        const done = assert.async();
        const expectedTotalIndex = getGrandTotalIndexForExpanding(this.store);
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: [CALENDAR_HIERARCHY_YEAR_DATA[2].key]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_HIERARCHY_DATA);

            assert.strictEqual(data.rows.length, 12);

            assert.strictEqual(data.rows[0].text, 'January 2003');
            assert.deepEqual(data.rows[0].value, '2003-01-01 00:00:00');

            assert.deepEqual(data.rows[11].value, '2003-12-01 00:00:00');
            assert.strictEqual(data.rows[11].text, 'December 2003');

            assert.strictEqual(data.grandTotalColumnIndex, 0, 'grandTotalColumnIndex');
            assert.strictEqual(data.grandTotalRowIndex, expectedTotalIndex, 'grandTotalRowIndex');
            assert.strictEqual(getValue(data, data.rows[6]), 462, 'GT - 2003 July');
            assert.strictEqual(getValue(data, data.rows[7]), 1262, 'GT - 2003 August');
            assert.strictEqual(getValue(data, data.rows[7], data.columns[1]), 492, 'Bikes - 2003 August');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy. Expand column & row', function(assert) {
        const done = assert.async();
        const expectedTotalIndex = getGrandTotalIndexForExpanding(this.store);
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            },
            {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }
            ],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],

            headerName: 'columns',
            rowExpandedPaths: [[CALENDAR_HIERARCHY_YEAR_DATA[2].key]],
            path: [CATEGORIES_HIERARCHY_DATA[1].key]
        }).done(function(data) {
            assert.deepEqual(data.columns, BIKES_SUBCATEGORY_DATA);
            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, 'CY 2001');
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, 'CY 2003');
            assert.ok(data.rows[2].children, 'expanded row should has children');
            assert.strictEqual(data.rows[2].children.length, 12);
            assert.strictEqual(data.rows[2].children[0].text, 'January 2003');
            assert.deepEqual(data.rows[2].children[0].value, '2003-01-01 00:00:00');

            assert.strictEqual(data.grandTotalColumnIndex, expectedTotalIndex, 'GT column index');
            assert.strictEqual(data.grandTotalRowIndex, 0, 'GT row index');

            assert.strictEqual(getValue(data, data.rows[2], data.columns[0]), 1896, 'Mounain Bikes - 2003');
            assert.strictEqual(getValue(data, data.rows[2].children[0], data.columns[0]), 98, 'Mounain Bikes - 2003 January');
            assert.strictEqual(getValue(data, data.rows[2].children[5], data.columns[2]), null, 'Touring Bikes - 2003 June');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy. Expand second level child', function(assert) {
        const done = assert.async();
        const expectedTotalIndex = getGrandTotalIndexForExpanding(this.store);
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }, {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Date]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            rowExpandedPaths: [['&[2003]']],
            headerName: 'rows',
            path: ['[Ship Date].[Calendar].[Calendar Year].&[2003]', '[Ship Date].[Calendar].[Month].&[2003]&[8]']
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_HIERARCHY_DATA);
            assert.strictEqual(data.rows.length, 31);

            assert.strictEqual(data.rows[0].text, 'August 1, 2003');
            assert.deepEqual(data.rows[0].value, '2003-08-01T00:00:00');
            assert.strictEqual(data.rows[0].index, 1, 'August 1, 2003 index');
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, 'August 3, 2003');
            assert.strictEqual(data.rows[2].index, 3, 'expanded row index');

            assert.strictEqual(data.rows[3].text, 'August 4, 2003');
            assert.strictEqual(data.rows[3].index, 4, 'August 4, 2003 index');

            assert.ok(!data.rows[2].children, 'expanded row should has children');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, expectedTotalIndex);

            assert.strictEqual(data.values[1][0][0], 15, 'GT - August1');
            assert.strictEqual(data.values[1][1][0], 12, 'Bikes - August1');
            assert.strictEqual(data.values[4][3][0], 5, 'Clothing - August4');

            assert.strictEqual(data.values[4][0][0], 16, 'GT - August4');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy. Expand child when opposite axis expanded on several levels', function(assert) {
        const done = assert.async();
        const expectedTotalIndex = getGrandTotalIndexForExpanding(this.store);
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }, {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Ship Date].[Calendar].[Date]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'columns',
            rowExpandedPaths: [
                [CALENDAR_HIERARCHY_YEAR_DATA[2].key],
                [CALENDAR_HIERARCHY_YEAR_DATA[2].key, '[Ship Date].[Calendar].[Month].&[2003]&[8]']
            ],
            path: [CATEGORIES_HIERARCHY_DATA[1].key]
        }).done(function(data) {
            assert.deepEqual(data.columns, BIKES_SUBCATEGORY_DATA);
            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, 'CY 2001');
            assert.ok(!data.rows[0].children);

            assert.strictEqual(data.rows[2].text, 'CY 2003');

            assert.equal(data.rows[2].children.length, 12, 'expanded year\'s children');

            assert.equal(data.rows[2].children[7].text, 'August 2003', 'expanded month value');
            assert.ok(data.rows[2].children[7].children, 'children exist');
            assert.equal(data.rows[2].children[7].children.length, 31, 'expanded month\'s childern');
            assert.equal(data.rows[2].children[7].children[3].text, 'August 4, 2003', 'August 4 value');

            assert.strictEqual(data.rows[2].text, 'CY 2003', 'expanded row value');
            assert.ok(data.rows[2].children, 'expanded row should has children');
            assert.strictEqual(data.rows[2].children.length, 12, 'expanded row children');

            assert.strictEqual(data.grandTotalColumnIndex, expectedTotalIndex);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(getValue(data, data.rows[2].children[7], BIKES_SUBCATEGORY_DATA[0]), 184, 'Mountain Bikes - August');
            assert.strictEqual(getValue(data, data.rows[2].children[7].children[3], BIKES_SUBCATEGORY_DATA[0]), 5, 'Mountain Bikes - August4');
            assert.strictEqual(getValue(data, data.rows[2].children[7].children[3], BIKES_SUBCATEGORY_DATA[1]), 9, 'Road Bikes - August4');
            assert.strictEqual(getValue(data, data.rows[2].children[7].children[3], BIKES_SUBCATEGORY_DATA[2]), 2, 'Touring Bikes - August4');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy Load expanded axis', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]'
                }
            ],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(data.columns[0].children);
            assert.strictEqual(data.columns[0].children.length, 8);

            assert.ok(data.columns[1].children);
            assert.strictEqual(data.columns[1].children.length, 3);

            assert.ok(data.columns[2].children);
            assert.strictEqual(data.columns[2].children.length, 6);

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 18484, 'GT');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy. Load with expanded hidden level item', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]'
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true
                }
            ],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);
            assert.ok(!data.columns[1].children);
            assert.ok(!data.columns[2].children);
            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 18484, 'GT');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy. Expanded all items', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true
                }
            ],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(data.columns[0].children);
            assert.strictEqual(data.columns[0].children.length, 8);

            assert.ok(data.columns[1].children);
            assert.strictEqual(data.columns[1].children.length, 3);

            assert.ok(data.columns[2].children);
            assert.strictEqual(data.columns[2].children.length, 6);

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.values[0][0][0], 18484, 'GT');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierachy. Loaded with two level expanded items', function(assert) {
        assert.expect(30);

        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }, {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Quarter]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);

            assert.strictEqual(data.rows.length, 4);

            $.each(data.rows, function(i, row) {
                assert.ok(row.children, 'row[' + i + '] -should has children');

                $.each(row.children, function(j, row) {
                    assert.ok(row.children, 'row[' + i + '][' + j + '] -should has children');
                });
            });

            assert.strictEqual(data.rows[0].text, 'CY 2001');
            assert.strictEqual(data.rows[0].children.length, 2);
            assert.strictEqual(data.rows[0].children[0].text, 'Q3 CY 2001');
            assert.strictEqual(data.rows[0].children[1].text, 'Q4 CY 2001');
            assert.deepEqual(data.rows[0].children[1].value, 'Q4 CY 2001');
            assert.strictEqual(data.rows[1].text, 'CY 2002');

            assert.strictEqual(data.rows[3].children[2].text, 'Q3 CY 2004');

            assert.strictEqual(getValue(data, data.rows[2].children[0]), 792, '2003 CY Q1 -> Total');
            assert.strictEqual(getValue(data, data.rows[1].children[1]), 627, '2002 CY Q2 -> Total');
            assert.strictEqual(getValue(data, data.rows[3].children[1]), 5973, '2004 CY Q2 -> Total');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy. Expand item with expanded children', function(assert) {
        const done = assert.async();
        const expectedTotalIndex = getGrandTotalIndexForExpanding(this.store);
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }, {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Semester]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                { dataField: '[Ship Date].[Calendar].[Calendar Quarter]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: [CALENDAR_HIERARCHY_YEAR_DATA[2].key]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);

            assert.strictEqual(data.rows.length, 2);

            $.each(data.rows, function(i, row) {
                assert.ok(row.children, 'row[' + i + '] -should has children');
            });

            assert.strictEqual(data.rows[0].text, 'H1 CY 2003');
            assert.strictEqual(data.rows[0].children.length, 2);
            assert.strictEqual(data.rows[0].children[0].text, 'Q1 CY 2003');
            assert.strictEqual(data.rows[0].children[1].text, 'Q2 CY 2003');
            assert.strictEqual(data.rows[1].text, 'H2 CY 2003');

            assert.strictEqual(data.rows[data.rows.length - 1].text, 'H2 CY 2003');
            assert.strictEqual(data.rows[data.rows.length - 1].index, 2);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, expectedTotalIndex);
            assert.strictEqual(getValue(data, data.rows[0]), 1730, 'H1 CY 2003 Total');
            assert.strictEqual(getValue(data, data.rows[0].children[1]), 938, 'Q2 CY 2003 Total');
            assert.strictEqual(getValue(data, data.rows[1]), 7839, 'H2 CY 2003 Total');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy. Expand item with two expanded children', function(assert) {
        assert.expect(22);

        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }, {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Semester]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Quarter]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: [CALENDAR_HIERARCHY_YEAR_DATA[2].key]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.ok(!data.columns[0].children);

            assert.strictEqual(data.rows.length, 2);

            $.each(data.rows, function(i, row) {
                assert.ok(row.children, 'row[' + i + '] -should has children');
                $.each(row.children, function(j, row) {
                    assert.ok(row.children, 'row[' + i + '][' + j + '] -should has children');
                });
            });

            assert.strictEqual(data.rows[0].index, 1);
            assert.strictEqual(data.rows[0].text, 'H1 CY 2003');
            assert.strictEqual(data.rows[0].children.length, 2);
            assert.strictEqual(data.rows[0].children[0].index, 3);
            assert.strictEqual(data.rows[0].children[0].text, 'Q1 CY 2003');
            assert.strictEqual(data.rows[0].children[0].children.length, 3);
            assert.strictEqual(data.rows[0].children[0].children[0].index, 7);
            assert.strictEqual(data.rows[0].children[0].children[0].text, 'January 2003');
            assert.strictEqual(data.rows[0].children[0].children[1].text, 'February 2003');
            assert.strictEqual(data.rows[0].children[1].index, 4);
            assert.strictEqual(data.rows[0].children[1].text, 'Q2 CY 2003');
            assert.strictEqual(data.rows[1].index, 2);
            assert.strictEqual(data.rows[1].text, 'H2 CY 2003');
        }).fail(function(e) {
            e = e || {};
            assert.ok(false, e.statusText);
        })
            .always(done);
    });

    QUnit.test('Hierarchy & not hierarchy. Expand item', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Product].[Category]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'columns',
            path: ['&[2003]']
        }).done(function(data) {
            assert.deepEqual(data.rows, []);
            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(getValue(data, undefined, data.columns[0]), 6470, 'GT - Accessories');
            assert.strictEqual(getValue(data, undefined, data.columns[1]), 4756, 'GT - Bikes');
            assert.strictEqual(getValue(data, undefined, data.columns[2]), 2717, 'GT - Clothing');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Not hierarchy & hierarchy. Expand item', function(assert) {
        const done = assert.async();
        const expectedTotalIndex = getGrandTotalIndexForExpanding(this.store);
        this.store.load({
            columns: [
                { dataField: '[Product].[Category]' },
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'columns',
            path: ['&[1]']
        }).done(function(data) {
            const calendarYearData = expectedTotalIndex === undefined ? $.map(CALENDAR_HIERARCHY_YEAR_DATA, function(item) {
                return $.extend({}, item, { index: item.index - 1 });
            }) : CALENDAR_HIERARCHY_YEAR_DATA;

            assert.deepEqual(data.rows, []);
            assert.deepEqual(data.columns, calendarYearData);

            assert.strictEqual(data.grandTotalColumnIndex, expectedTotalIndex);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(getValue(data, undefined, data.columns[0]), 962, 'GT - CY 2001');
            assert.strictEqual(getValue(data, undefined, data.columns[1]), 2665, 'GT - CY 2002');
            assert.strictEqual(getValue(data, undefined, data.columns[2]), 4756, 'GT - CY 2003');
            assert.strictEqual(getValue(data, undefined, data.columns[3]), 5646, 'GT - CY 2004');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Not hierarchy & hierarchy. expanded not hierarchy level', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                { dataField: '[Ship Date].[Calendar Year]', expanded: true },
                { dataField: '[Ship Date].[Calendar].[Month]', hierarchyName: '[Ship Date].[Calendar]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]' }]
        })
            .done(function(data) {
                assert.strictEqual(data.columns.length, 4);

                assert.strictEqual(data.columns[0].text, 'CY 2001');
                assert.deepEqual(removeIndexesAndValue(data.columns[0].children), [
                    {
                        text: 'July 2001'
                    },
                    {
                        text: 'August 2001'
                    },
                    {
                        text: 'September 2001'
                    },
                    {
                        text: 'October 2001'
                    },
                    {
                        text: 'November 2001'
                    },
                    {
                        text: 'December 2001'
                    }
                ]);

            }).fail(getFailCallBack(assert)).always(done);
    });

    QUnit.test('Hierarchy & not hierarchy. Load expanded axis', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                { dataField: '[Product].[Category]' }
            ],

            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {

            assert.strictEqual(getValue(data), 18484, 'GT');

            assert.strictEqual(getValue(data, undefined, data.columns[0].children[0]), 962, 'GT Bikes 2001');
            assert.strictEqual(getValue(data, undefined, data.columns[0].children[0]), 962, 'GT -  CY 2001 Total');
            assert.strictEqual(getValue(data, undefined, data.columns[2]), 9002, 'GT -  CY 2003 Total');

            assert.strictEqual(data.columns.length, 4);

            assert.deepEqual(removeIndexesAndValue(data.columns), [{
                children: [
                    {
                        text: 'Bikes'
                    }
                ],
                text: 'CY 2001'
            },
            {
                children: [
                    {
                        text: 'Bikes'
                    }
                ],
                text: 'CY 2002'
            },
            {
                children: [
                    {
                        text: 'Accessories'
                    },
                    {
                        text: 'Bikes'
                    },
                    {
                        text: 'Clothing'
                    }
                ],
                text: 'CY 2003'
            },
            {
                children: [
                    {
                        text: 'Accessories'
                    },
                    {
                        text: 'Bikes'
                    },
                    {
                        text: 'Clothing'
                    }
                ],
                text: 'CY 2004'
            }]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy & not hierarchy. Load expanded axis. With filter', function(assert) {
        const done = assert.async();
        this.load({
            columns: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value',
                    groupIndex: 0
                },
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value',
                    groupIndex: 0
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'value',
                    groupIndex: 1
                }
            ],
            filters: [
                {
                    dataField: '[Product].[Product Categories]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'desc',
                    sortBy: 'value',
                    area: 'column',
                    filterValues: ['Clothing'],
                    filterType: 'include'
                },
                {
                    dataField: '[Ship Date].[Calendar]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'value',
                    area: 'column',
                    filterValues: ['CY 2003'],
                    filterType: 'include'
                }
            ],

            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {

            assert.strictEqual(data.columns[0].text, 'Clothing');
            assert.strictEqual(data.columns[0].index, 1);
            assert.strictEqual(data.columns[0].children[0].text, 'CY 2003');

            assert.strictEqual(data.columns[0].children[0].children[0].text, 'December 2003');

            assert.strictEqual(data.grandTotalColumnIndex, 0);

            assert.equal(getValue(data, undefined, data.columns[0]), 2717);
            assert.equal(getValue(data, undefined, data.columns[0].children[0]), 2717);
            assert.equal(getValue(data, undefined, data.columns[0].children[0].children[0]), 655);
            assert.equal(getValue(data, undefined, data.columns[0].children[0].children[5]), 122);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy & not hierarchy. Load expanded axis with expanded not hirarchy children', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                { dataField: '[Product].[Category]', expanded: true },
                { dataField: '[Product].[Subcategory]' }
            ],

            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 4);
            assert.strictEqual(data.columns[2].text, 'CY 2003');
            assert.strictEqual(data.columns[2].children.length, 3);
            assert.strictEqual(data.columns[2].children[1].children.length, 3);
            assert.strictEqual(data.columns[2].children[1].children[1].text, 'Road Bikes');
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(getValue(data), 18484, 'GT');
            assert.strictEqual(getValue(data, undefined, data.columns[0].children[0]), 962, 'GT Bikes 2001');
            assert.strictEqual(getValue(data, undefined, data.columns[0]), 962, 'GT -  CY 2001 Total');
            assert.strictEqual(getValue(data, undefined, data.columns[2].children[1].children[1]), 2513, 'CY 2003 Road Bikes Total');

            assert.strictEqual(getValue(data, undefined, data.columns[2]), 9002, 'GT -  CY 2003 Total');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy & not hierarchy. Expand hierarchy item with expanded not hirarchy children', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Product].[Category]', expanded: true },
                { dataField: '[Product].[Subcategory]' }
            ],

            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'columns',
            path: ['&[2003]']
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 3);
            assert.strictEqual(data.columns[1].children.length, 3);
            assert.strictEqual(data.columns[1].children[1].text, 'Road Bikes');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(getValue(data, undefined, data.columns[0]), 6470, 'GT - Asscessories');
            assert.strictEqual(getValue(data, undefined, data.columns[1].children[1]), 2513, 'GT - Bikes - Road Bikes');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy & not hierarchy. Expand column & row.', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Product].[Color]' }
            ],
            rows: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],

            headerName: 'rows',
            columnExpandedPaths: [['[Ship Date].[Calendar].[Calendar Year].&[2002]'], ['[Ship Date].[Calendar].[Calendar Year].&[2003]']],
            path: [CATEGORIES_DATA[1].key]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[0], data.columns[1].children[2]), 278, 'Mountain Bikes - CY2002->Silver');
            assert.strictEqual(getValue(data, data.rows[2], data.columns[2].children[4]), 295, 'Touring Bikes - CY2003->Yellow');
            assert.strictEqual(getValue(data, data.rows[2], data.columns[2].children[2]), null, 'Touring Bikes - CY2003->Yellow');
            assert.strictEqual(getValue(data, data.rows[2], data.columns[3]), 1394, 'Touring Bikes - CY2004');

            assert.deepEqual(removeIndexesAndValue(data.columns), [{
                text: 'CY 2001'
            }, {
                text: 'CY 2002',
                children: [{
                    text: 'Black'
                }, {
                    text: 'Red'
                }, {
                    text: 'Silver'
                }, {
                    text: 'Yellow'
                }]
            }, {
                children: [{
                    text: 'Black'
                }, {
                    text: 'Blue'
                }, {
                    text: 'Red'
                }, {
                    text: 'Silver'
                }, {
                    text: 'Yellow'
                }],
                text: 'CY 2003'
            },
            {
                text: 'CY 2004'
            }
            ]);

            assert.deepEqual(removeIndexesAndValue(data.rows), [{
                text: 'Mountain Bikes'
            }, {
                text: 'Road Bikes'
            }, {
                text: 'Touring Bikes'
            }]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0, 'GT row index');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy & not hierarchy. Expand row & column.', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                { dataField: '[Product].[Color]' }
            ],
            rows: [{ dataField: '[Product].[Category]' }, { dataField: '[Product].[Subcategory]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],

            headerName: 'columns',
            rowExpandedPaths: [[CATEGORIES_DATA[1].key]],
            path: [CALENDAR_HIERARCHY_YEAR_DATA[2].key]
        }).done(function(data) {

            assert.strictEqual(getValue(data, data.rows[1].children[1], data.columns[0]), 1291, 'Road Bikes - Black');
            assert.strictEqual(getValue(data, data.rows[1].children[2], data.columns[7]), 295, 'Touring Bikes - Yellow');
            assert.strictEqual(getValue(data, data.rows[0], data.columns[5]), 286, 'Accesories - Silver');

            assert.deepEqual(removeIndexesAndValue(data.columns), [{
                text: 'Black'
            }, {
                text: 'Blue'
            }, {
                text: 'Multi'
            }, {
                text: 'NA'
            }, {
                text: 'Red'
            }, {
                text: 'Silver'
            }, {
                text: 'White'
            }, {
                text: 'Yellow'
            }]);

            assert.deepEqual(removeIndexesAndValue(data.rows), [
                {
                    text: 'Accessories'
                }, {
                    children: [{
                        text: 'Mountain Bikes'
                    }, {
                        text: 'Road Bikes'
                    }, {
                        text: 'Touring Bikes'
                    }],
                    text: 'Bikes'
                }, {
                    text: 'Clothing'
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0, 'GT row index');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy & not hierarchy. expanded hierarchy level', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                { dataField: '[Product].[Category]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 38);
            assert.strictEqual(data.columns[4].text, 'November 2001');
            assert.deepEqual(removeIndexesAndValue(data.columns[4].children), [{
                text: 'Bikes'
            }]);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy & hierarchy. expanded hierarchy level', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]'
                }
            ],

            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 4);
            assert.deepEqual(removeIndexesAndValue(data.columns)[3], {
                children: [{
                    children: [{
                        text: 'Bike Racks'
                    }, {
                        text: 'Bike Stands'
                    }, {
                        text: 'Bottles and Cages'
                    }, {
                        text: 'Cleaners'
                    }, {
                        text: 'Fenders'
                    }, {
                        text: 'Helmets'
                    }, {
                        text: 'Hydration Packs'
                    }, {
                        text: 'Tires and Tubes'
                    }],
                    text: 'Accessories'
                }, {
                    children: [{
                        text: 'Mountain Bikes'
                    }, {
                        text: 'Road Bikes'
                    }, {
                        text: 'Touring Bikes'
                    }],
                    text: 'Bikes'
                }, {
                    children: [{
                        text: 'Caps'
                    }, {
                        text: 'Gloves'
                    }, {
                        text: 'Jerseys'
                    }, {
                        text: 'Shorts'
                    }, {
                        text: 'Socks'
                    }, {
                        text: 'Vests'
                    }],
                    text: 'Clothing'
                }],
                text: 'CY 2004'
            });

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Hierarchy & hierarchy. Expand item with expanded next hierarchy level', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [
                { dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' },
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]'
                }
            ],
            headerName: 'columns',
            path: [CALENDAR_HIERARCHY_YEAR_DATA[3].key],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 3);
            assert.deepEqual(removeIndexesAndValue(data.columns), [{
                children: [{
                    text: 'Bike Racks'
                }, {
                    text: 'Bike Stands'
                }, {
                    text: 'Bottles and Cages'
                }, {
                    text: 'Cleaners'
                }, {
                    text: 'Fenders'
                }, {
                    text: 'Helmets'
                }, {
                    text: 'Hydration Packs'
                }, {
                    text: 'Tires and Tubes'
                }],
                text: 'Accessories'
            }, {
                children: [{
                    text: 'Mountain Bikes'
                }, {
                    text: 'Road Bikes'
                }, {
                    text: 'Touring Bikes'
                }],
                text: 'Bikes'
            }, {
                children: [{
                    text: 'Caps'
                }, {
                    text: 'Gloves'
                }, {
                    text: 'Jerseys'
                }, {
                    text: 'Shorts'
                }, {
                    text: 'Socks'
                }, {
                    text: 'Vests'
                }],
                text: 'Clothing'
            }]);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.module('Discover', testEnvironment);

    QUnit.test('Discover. Incorrect dataSource url', function(assert) {
        const done = assert.async();
        new XmlaStore({
            url: '',
            catalog: 'Adventure Works DW Standard Edition',
            cube: 'Adventure Works'
        }).getFields().fail(function() {
            assert.ok(true);
            done();
        });
    });

    QUnit.test('Discover. Incorrect dataSource cube', function(assert) {
        const done = assert.async();
        new XmlaStore($.extend({}, this.dataSource, {
            cube: 'cube'
        })).getFields()
            .done(function(data) {
                assert.ok(!data.length);
            }).fail(getFailCallBack(assert)).always(done);
    });

    QUnit.test('Discover. Incorrect dataSource catalog', function(assert) {
        const done = assert.async();
        new XmlaStore($.extend({}, this.dataSource, {
            catalog: 'catalog'
        })).getFields()
            .done(function(data) {
                assert.equal(data.length, 0);
            }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Discover', function(assert) {
        const done = assert.async();

        this.store.getFields().done(function(data) {
            assert.ok(data);
            assert.equal(data.length, 302);

            assert.deepEqual(findItems(data, 'dataField', '[Measures].[Internet Sales Amount]'), [{
                caption: 'Internet Sales Amount',
                displayFolder: 'Internet Sales',
                dataField: '[Measures].[Internet Sales Amount]',
                dimension: 'Measures',
                groupIndex: undefined,
                hierarchyName: undefined,
                groupName: undefined,
                isMeasure: true,
                isDefault: false
            }], 'Measure item');

            assert.strictEqual(findItems(data, 'isMeasure', true).length, 47, 'Measures count');

            assert.deepEqual(findItems(data, 'dataField', '[Customer].[Yearly Income]'), [{
                dataField: '[Customer].[Yearly Income]',
                caption: 'Yearly Income',
                displayFolder: 'Demographic',
                dimension: 'Customer',
                hierarchyName: undefined,
                groupName: undefined,
                groupIndex: undefined,
                isMeasure: false,
                isDefault: false
            }], 'not Hierarchy');

            assert.deepEqual(findItems(data, 'dataField', '[Date].[Calendar].[Calendar Year]'), [{
                caption: 'Calendar Year',
                dataField: '[Date].[Calendar].[Calendar Year]',
                dimension: 'Date',
                groupIndex: 0,
                hierarchyName: '[Date].[Calendar]',
                groupName: '[Date].[Calendar]',
                displayFolder: '',
                isMeasure: false,
                isDefault: false
            }], 'hierarchy level');

            assert.deepEqual(findItems(data, 'hierarchyName', '[Date].[Calendar]'), [
                {
                    caption: 'Date.Calendar',
                    dataField: '[Date].[Calendar]',
                    dimension: 'Date',
                    groupIndex: undefined,
                    hierarchyName: '[Date].[Calendar]',
                    groupName: '[Date].[Calendar]',
                    displayFolder: 'Calendar',
                    isMeasure: false,
                    isDefault: false
                },
                {
                    caption: 'Calendar Year',
                    dataField: '[Date].[Calendar].[Calendar Year]',
                    dimension: 'Date',
                    groupIndex: 0,
                    hierarchyName: '[Date].[Calendar]',
                    groupName: '[Date].[Calendar]',
                    displayFolder: '',
                    isMeasure: false,
                    isDefault: false
                },
                {
                    caption: 'Calendar Semester',
                    dataField: '[Date].[Calendar].[Calendar Semester]',
                    dimension: 'Date',
                    groupIndex: 1,
                    hierarchyName: '[Date].[Calendar]',
                    groupName: '[Date].[Calendar]',
                    displayFolder: '',
                    isMeasure: false,
                    isDefault: false
                },
                {
                    caption: 'Calendar Quarter',
                    dataField: '[Date].[Calendar].[Calendar Quarter]',
                    dimension: 'Date',
                    groupIndex: 2,
                    hierarchyName: '[Date].[Calendar]',
                    groupName: '[Date].[Calendar]',
                    displayFolder: '',
                    isMeasure: false,
                    isDefault: false
                },
                {
                    caption: 'Month',
                    dataField: '[Date].[Calendar].[Month]',
                    dimension: 'Date',
                    groupIndex: 3,
                    hierarchyName: '[Date].[Calendar]',
                    groupName: '[Date].[Calendar]',
                    displayFolder: '',
                    isMeasure: false,
                    isDefault: false
                },
                {
                    caption: 'Date',
                    dataField: '[Date].[Calendar].[Date]',
                    dimension: 'Date',
                    groupIndex: 4,
                    hierarchyName: '[Date].[Calendar]',
                    groupName: '[Date].[Calendar]',
                    displayFolder: '',
                    isMeasure: false,
                    isDefault: false
                }
            ], 'Hierarchy item, with levels');

            assert.deepEqual(findItems(data, 'dataField', '[Customer].[Customer Geography]')[0].isDefault, true, 'default hierarchy');
            assert.deepEqual(findItems(data, 'isDefault', true).length, 16, 'Default fields count');

            assert.strictEqual(findItems(data, 'groupIndex', -1).length, 0, 'all level not exists');

            assert.strictEqual(findItems(data, 'dataField', '[Measures]').length, 0, 'Measure Hieararchy doesn\'t exist');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.module('Filtering', testEnvironment);

    QUnit.test('FilterValues in row and column fields. Include filter', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Product].[Category]',
                filterValues: ['Bikes', 'Accessories'],
                filterType: 'include'
            }],
            rows: [{
                dataField: '[Ship Date].[Calendar Year]',
                filterValues: ['CY 2002', 'CY 2003'],
                filterType: 'include'
            }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.columns), [
                { text: 'Accessories' },
                { text: 'Bikes' }
            ]);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: 'CY 2002' },
                { text: 'CY 2003' }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[10054], [6470], [6246]],
                [[2665], [null], [2665]],
                [[8564], [6470], [4756]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('FilterValues in row and column fields. Exclude Filter', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Product].[Category]',
                filterValues: ['Bikes', 'Accessories'],
                filterType: 'exclude'
            }],
            rows: [{
                dataField: '[Ship Date].[Calendar Year]',
                filterValues: ['CY 2002', 'CY 2003'],
                filterType: 'exclude'
            }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.columns), [
                { text: 'Clothing' }
            ]);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: 'CY 2004' }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[4340], [4340]],
                [[4340], [4340]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('FilterValues in columns field', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Product].[Category]',
                filterValues: ['Bikes', 'Accessories'],
                filterType: 'include'
            }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.columns), [
                { text: 'Accessories' },
                { text: 'Bikes' }
            ]);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: 'CY 2001' },
                { text: 'CY 2002' },
                { text: 'CY 2003' },
                { text: 'CY 2004' }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [[[17719], [15114], [9132]],
                [[962], [null], [962]],
                [[2665], [null], [2665]],
                [[8564], [6470], [4756]],
                [[11182], [9745], [5646]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('FilterValues in rows field', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    filterValues: ['CY 2001', 'CY 2002'],
                    filterType: 'exclude'
                },
                {
                    dataField: '[Ship Date].[Month Of Year]',
                    filterValues: ['January', 'February'],
                    filterType: 'include'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.columns), [
                { text: 'Accessories' },
                { text: 'Bikes' },
                { text: 'Clothing' }
            ]);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: 'CY 2003' },
                { text: 'CY 2004' }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[3908], [2918], [2005], [1272]],
                [[521], [null], [521], [null]],
                [[3538], [2918], [1635], [1272]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Filter field. Include type', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [{
                dataField: '[Ship Date].[Month Of Year]',
                filterValues: ['January', 'February'],
                filterType: 'include'
            }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: 'CY 2002' },
                { text: 'CY 2003' },
                { text: 'CY 2004' }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[4201], [2918], [2298], [1272]],
                [[361], [null], [361], [null]],
                [[521], [null], [521], [null]],
                [[3538], [2918], [1635], [1272]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Filter field. Exclude type', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [{
                dataField: '[Ship Date].[Month Of Year]',
                filterValues: ['January', 'February'],
                filterType: 'exclude'
            }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);
            assert.deepEqual(data.rows, CALENDAR_YEAR_DATA);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[16439], [12860], [8375], [5741]],
                [[962], [null], [962], [null]],
                [[2304], [null], [2304], [null]],
                [[8695], [6470], [4449], [2717]],
                [[8790], [7220], [4192], [3164]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Filter field. Include and exclude filters', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [{ dataField: '[Ship Date].[Calendar Year]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [
                {
                    dataField: '[Ship Date].[Month Of Year]',
                    filterValues: ['January', 'February'],
                    filterType: 'include'
                },
                {
                    dataField: '[Customer].[Country]',
                    filterValues: ['Australia', 'United Kingdom', 'United States'],
                    filterType: 'exclude'
                }
            ]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: 'CY 2002' },
                { text: 'CY 2003' },
                { text: 'CY 2004' }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[1231], [901], [608], [398]],
                [[92], [null], [92], [null]],
                [[121], [null], [121], [null]],
                [[1057], [901], [434], [398]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Ignore filterValues for hierarchyLevel field', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]',
                filterValues: ['Bikes'],
                groupIndex: 1
            }],
            rows: [{ dataField: '[Ship Date].[Calendar].[Calendar Year]', hierarchyName: '[Ship Date].[Calendar]' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_HIERARCHY_DATA);
            assert.deepEqual(data.rows, CALENDAR_HIERARCHY_YEAR_DATA);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[18484], [15114], [9132], [6852]],
                [[962], [null], [962], [null]],
                [[2665], [null], [2665], [null]],
                [[9002], [6470], [4756], [2717]],
                [[11753], [9745], [5646], [4340]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Filter hierarchyLevel field. Include type', function(assert) {
        const done = assert.async();
        this.store.load({
            'columns': [
                { 'dimension': 'Ship Date', 'dataField': '[Ship Date].[Calendar Year]' }
            ],
            'values': [
                { 'dimension': 'Measures', 'dataField': '[Measures].[Customer Count]' }
            ],

            'filters': [{
                'dataField': '[Ship Date].[Calendar]',
                'hierarchyName': '[Ship Date].[Calendar]',
                'groupName': '[Ship Date].[Calendar]',
                'filterValues': [
                    'H2 CY 2002',
                    ['CY 2003'],
                    ['CY 2004', 'H1 CY 2004'],
                    ['CY 2004', 'H2 CY 2004', 'Q3 CY 2004', 'August 2004'],
                    []
                ]
            }]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.columns), [
                { text: 'CY 2002' },
                { text: 'CY 2003' },
                { text: 'CY 2004' }
            ]);
            assert.deepEqual(data.rows, []);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [[[17498], [1468], [9002], [10834]]]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Filter hierarchyLevel field. Exclude type', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [
                {
                    dataField: '[Product].[Product Categories]',
                    hierarchyName: '[Product].[Product Categories]',
                    filterValues: ['Clothing', 'Mountain Bikes'],
                    filterType: 'exclude'
                }
            ]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.columns), [
                { text: 'Accessories' },
                { text: 'Bikes' }
            ]);
            assert.deepEqual(data.rows, []);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.deepEqual(data.values, [
                [[17366], [15114], [7990]]
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('FilterValues using full key value in row and column fields. Include filter', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [],
            rows: [{
                dataField: '[Ship Date].[Calendar Year]',
                filterValues: [CALENDAR_YEAR_DATA[1].key, CALENDAR_YEAR_DATA[2].key],
                filterType: 'include'
            }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: 'CY 2002' },
                { text: 'CY 2003' }
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.module('Sorting', testEnvironment);

    QUnit.test('Sorting by value', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Product].[Category]', sortOrder: 'desc', sortBy: 'value' }],
            rows: [{ dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBy: 'value' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'value' }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA.slice().reverse());
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                {
                    text: 'December'
                },
                {
                    text: 'November'
                },
                {
                    text: 'October'
                },
                {
                    text: 'September'
                },
                {
                    text: 'August'
                },
                {
                    text: 'July'
                },
                {
                    text: 'June'
                },
                {
                    text: 'May'
                },
                {
                    text: 'April'
                },
                {
                    text: 'March'
                },
                {
                    text: 'February'
                },
                {
                    text: 'January'
                }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting by display text', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Product].[Category]', sortOrder: 'desc', sortBy: 'displayText' }],
            rows: [{ dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBy: 'displayText' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc' }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA.slice().reverse());
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                {
                    text: 'September'
                },
                {
                    text: 'October'
                },
                {
                    text: 'November'
                },
                {
                    text: 'May'
                },
                {
                    text: 'March'
                },
                {
                    text: 'June'
                },
                {
                    text: 'July'
                },
                {
                    text: 'January'
                },
                {
                    text: 'February'
                },
                {
                    text: 'December'
                },
                {
                    text: 'August'
                },
                {
                    text: 'April'
                }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting by display text. Default sorting when sortOrder is undefined', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Ship Date].[Month of Year]', sortBy: 'displayText' }]
        }).done(function(data) {
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.columns[0].text, 'April');
            assert.strictEqual(data.columns[1].text, 'August');
            assert.strictEqual(data.columns[11].text, 'September');

        }).fail(function(e) {
            e = e || {};
            assert.ok(false, e.statusText);
        })
            .always(done);
    });

    QUnit.test('Sorting by none', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Product].[Category]', sortOrder: 'asc', sortBy: 'none' }],
            rows: [{ dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBy: 'none' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'none' }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);
            assert.deepEqual(removeIndexesAndValue(data.rows), [
                {
                    text: 'December'
                },
                {
                    text: 'November'
                },
                {
                    text: 'October'
                },
                {
                    text: 'September'
                },
                {
                    text: 'August'
                },
                {
                    text: 'July'
                },
                {
                    text: 'June'
                },
                {
                    text: 'May'
                },
                {
                    text: 'April'
                },
                {
                    text: 'March'
                },
                {
                    text: 'February'
                },
                {
                    text: 'January'
                }
            ]);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting by none two dimension on axis and expanded item', function(assert) {
        const done = assert.async();
        this.load({
            columns: [
                {
                    dataField: '[Product].[Category]',
                    'caption': 'Category',
                    'displayFolder': '',
                    'isMeasure': false,
                    'area': 'row',
                    'index': 131,
                    'sortOrder': 'asc',
                    'areaIndex': 0
                },
                {
                    dataField: '[Product].[Subcategory]',
                    'caption': 'Subcategory',
                    'displayFolder': '',
                    'isMeasure': false,
                    'area': 'row',
                    'index': 156,
                    'sortOrder': 'desc',
                    'areaIndex': 1
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'none' }],
            columnExpandedPaths: [['&[1]']]
        }).done(function(data) {
            assert.deepEqual(data.columns[0].text, 'Accessories');

            assert.deepEqual(data.columns[1].text, 'Bikes');
            assert.deepEqual(removeIndexesAndValue(data.columns[1].children), [
                {
                    text: 'Touring Bikes'
                },
                {
                    text: 'Road Bikes'
                },
                {
                    text: 'Mountain Bikes'
                }
            ]);
            assert.deepEqual(data.columns[2].text, 'Clothing');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting group by none', function(assert) {
        const done = assert.async();
        this.load({
            rows: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'none'
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'none'
                }
            ],
            columns: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true,
                    sortOrder: 'asc',
                    sortBy: 'none'
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'asc',
                    sortBy: 'none'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'none' }]
        }).done(function(data) {
            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, 'CY 2004');
            assert.strictEqual(data.rows[1].text, 'CY 2003');

            assert.strictEqual(data.rows[1].children[0].text, 'December 2003');
            assert.strictEqual(data.rows[1].children[11].text, 'January 2003');

            assert.strictEqual(data.columns.length, 3);

            assert.strictEqual(data.columns[0].text, 'Accessories');
            assert.strictEqual(data.columns[1].text, 'Bikes');

            assert.strictEqual(data.columns[2].children[0].text, 'Caps');
            assert.strictEqual(data.columns[2].children[1].text, 'Gloves');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting by Summary field', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]', expanded: true },
                {
                    dataField: '[Ship Date].[Month of Year]',
                    sortOrder: 'desc',
                    sortBySummaryField: '[Measures].[Customer Count]'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[2].children[5]), 462, 'GT - 2003 July');
            assert.strictEqual(getValue(data, data.rows[2].children[4]), 1262, 'GT - 2003 August');
            assert.strictEqual(getValue(data, data.rows[2].children[4], data.columns[1]), 492), 'Bikes - 2003 August';

            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, 'CY 2001');
            assert.deepEqual(data.rows[1].text, 'CY 2002');
            assert.deepEqual(data.rows[2].text, 'CY 2003');
            assert.deepEqual(data.rows[3].text, 'CY 2004');

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: 'December'
                },
                {
                    text: 'October'
                },
                {
                    text: 'November'
                },
                {
                    text: 'September'
                },
                {
                    text: 'August'
                },
                {
                    text: 'July'
                },
                {
                    text: 'May'
                },
                {
                    text: 'June'
                },
                {
                    text: 'April'
                },
                {
                    text: 'March'
                },
                {
                    text: 'January'
                },
                {
                    text: 'February'
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting by Summary field when expanded items', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]' },
                {
                    dataField: '[Ship Date].[Month of Year]',
                    sortOrder: 'desc',
                    sortBySummaryField: '[Measures].[Customer Count]'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            rowExpandedPaths: [['&[2003]'], ['&[2002]']]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, 'CY 2001');
            assert.deepEqual(data.rows[1].text, 'CY 2002');
            assert.deepEqual(data.rows[2].text, 'CY 2003');
            assert.deepEqual(data.rows[3].text, 'CY 2004');

            assert.deepEqual(removeIndexesAndValue(data.rows[1].children), [
                {
                    text: 'December'
                },
                {
                    text: 'August'
                },
                {
                    text: 'July'
                },
                {
                    text: 'May'
                },
                {
                    text: 'October'
                },
                {
                    text: 'September'
                },
                {
                    text: 'March'
                },
                {
                    text: 'June'
                },
                {
                    text: 'January'
                },
                {
                    text: 'April'
                },
                {
                    text: 'November'
                },
                {
                    text: 'February'
                }
            ]);

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: 'December'
                },
                {
                    text: 'October'
                },
                {
                    text: 'November'
                },
                {
                    text: 'September'
                },
                {
                    text: 'August'
                },
                {
                    text: 'July'
                },
                {
                    text: 'May'
                },
                {
                    text: 'June'
                },
                {
                    text: 'April'
                },
                {
                    text: 'March'
                },
                {
                    text: 'January'
                },
                {
                    text: 'February'
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting by Summary field when expanded items with expanded', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]', filterValues: ['CY 2002', 'CY 2003'] },
                {
                    dataField: '[Ship Date].[Month of Year]',
                    sortOrder: 'desc',
                    sortBySummaryField: '[Measures].[Customer Count]',
                    expanded: true
                },

                { dataField: '[Ship Date].[Day of Month]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            rowExpandedPaths: [['&[2002]']]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.deepEqual(data.rows.length, 2);

            assert.deepEqual(data.rows[0].text, 'CY 2002');
            assert.deepEqual(data.rows[1].text, 'CY 2003');

            assert.strictEqual(data.rows[0].children[0].text, 'December');
            assert.strictEqual(data.rows[0].children[1].text, 'August');
            assert.strictEqual(data.rows[0].children[11].text, 'February');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting by Summary field by caption', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]', expanded: true },
                { dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBySummaryField: 'Count' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[2].children[5]), 462, 'GT - 2003 July');
            assert.strictEqual(getValue(data, data.rows[2].children[4]), 1262, 'GT - 2003 August');
            assert.strictEqual(getValue(data, data.rows[2].children[4], data.columns[1]), 492), 'Bikes - 2003 August';

            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, 'CY 2001');
            assert.deepEqual(data.rows[1].text, 'CY 2002');
            assert.deepEqual(data.rows[2].text, 'CY 2003');
            assert.deepEqual(data.rows[3].text, 'CY 2004');

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: 'December'
                },
                {
                    text: 'October'
                },
                {
                    text: 'November'
                },
                {
                    text: 'September'
                },
                {
                    text: 'August'
                },
                {
                    text: 'July'
                },
                {
                    text: 'May'
                },
                {
                    text: 'June'
                },
                {
                    text: 'April'
                },
                {
                    text: 'March'
                },
                {
                    text: 'January'
                },
                {
                    text: 'February'
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(function(e) {
            e = e || {};
            assert.ok(false, e.statusText);
        })
            .always(done);
    });

    QUnit.test('Sorting group by Summary field', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBySummaryField: '[Measures].[Customer Count]'
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBySummaryField: '[Measures].[Customer Count]'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, 'CY 2004');
            assert.deepEqual(data.rows[1].text, 'CY 2003');
            assert.deepEqual(data.rows[2].text, 'CY 2002');
            assert.deepEqual(data.rows[3].text, 'CY 2001');

            assert.deepEqual(removeIndexesAndValue(data.rows[1].children), [
                {
                    text: 'December 2003'
                },
                {
                    text: 'October 2003'
                },
                {
                    text: 'November 2003'
                },
                {
                    text: 'September 2003'
                },
                {
                    text: 'August 2003'
                },
                {
                    text: 'July 2003'
                },
                {
                    text: 'May 2003'
                },
                {
                    text: 'June 2003'
                },
                {
                    text: 'April 2003'
                },
                {
                    text: 'March 2003'
                },
                {
                    text: 'January 2003'
                },
                {
                    text: 'February 2003'
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting by Summary field in first field on axis', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    expanded: true,
                    sortBySummaryField: '[Measures].[Customer Count]'
                },
                { dataField: '[Ship Date].[Month of Year]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'value' }]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[2].children[6]), 462, 'GT - 2003 July');
            assert.strictEqual(getValue(data, data.rows[2].children[7]), 1262, 'GT - 2003 August');
            assert.strictEqual(getValue(data, data.rows[2].children[7], data.columns[1]), 492), 'Bikes - 2003 August';

            assert.deepEqual(data.columns, CATEGORIES_DATA);

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, 'CY 2001');
            assert.deepEqual(data.rows[1].text, 'CY 2002');
            assert.deepEqual(data.rows[2].text, 'CY 2003');
            assert.deepEqual(data.rows[3].text, 'CY 2004');

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: 'January'
                },
                {
                    text: 'February'
                },
                {
                    text: 'March'
                },
                {
                    text: 'April'
                },
                {
                    text: 'May'
                },
                {
                    text: 'June'
                },
                {
                    text: 'July'
                },
                {
                    text: 'August'
                },
                {
                    text: 'September'
                },
                {
                    text: 'October'
                },
                {
                    text: 'November'
                },
                {
                    text: 'December'
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting by Summary field in first field on axis with path', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{
                dataField: '[Product].[Category]',
                expanded: true,
                filterValues: ['Bikes']
            }, { dataField: '[Product].[Subcategory]' }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    expanded: true,
                    sortOrder: 'asc',
                    sortBySummaryField: '[Measures].[Customer Count]',
                    sortBySummaryPath: ['Bikes', 'Road Bikes']
                },
                { dataField: '[Ship Date].[Month of Year]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'value' }]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[3].children[6]), 462, 'GT - 2003 July');
            assert.strictEqual(getValue(data, data.rows[3].children[7]), 492, 'GT - 2003 August');
            assert.strictEqual(getValue(data, data.rows[3].children[7], data.columns[0]), 492), 'Bikes - 2003 August';

            assert.deepEqual(data.columns[0].children[1].text, 'Road Bikes');

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, 'CY 2001');
            assert.deepEqual(data.rows[1].text, 'CY 2002');
            assert.deepEqual(data.rows[2].text, 'CY 2004');
            assert.deepEqual(data.rows[3].text, 'CY 2003');

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: 'January'
                },
                {
                    text: 'February'
                },
                {
                    text: 'March'
                },
                {
                    text: 'April'
                },
                {
                    text: 'May'
                },
                {
                    text: 'June'
                },
                {
                    text: 'July'
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting columns by row', function(assert) {
        const done = assert.async();
        this.load({
            rows: [
                { dataField: '[Product].[Category]', expanded: true, filterValues: ['Bikes'] },
                { dataField: '[Product].[Subcategory]' }
            ],
            columns: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    expanded: true,
                    sortOrder: 'asc',
                    sortBySummaryField: '[Measures].[Customer Count]',
                    sortBySummaryPath: ['Bikes', 'Road Bikes']
                },
                { dataField: '[Ship Date].[Month of Year]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]' }]
        }).done(function(data) {

            assert.deepEqual(data.rows[0].children[1].text, 'Road Bikes');

            assert.deepEqual(data.columns.length, 4);

            assert.deepEqual(data.columns[0].text, 'CY 2001');
            assert.deepEqual(data.columns[1].text, 'CY 2002');
            assert.deepEqual(data.columns[2].text, 'CY 2004');
            assert.deepEqual(data.columns[3].text, 'CY 2003');

            assert.deepEqual(removeIndexesAndValue(data.columns[2].children), [
                {
                    text: 'January'
                },
                {
                    text: 'February'
                },
                {
                    text: 'March'
                },
                {
                    text: 'April'
                },
                {
                    text: 'May'
                },
                {
                    text: 'June'
                },
                {
                    text: 'July'
                }
            ]);

            assert.strictEqual(data.grandTotalRowIndex, 0);
            assert.strictEqual(data.grandTotalColumnIndex, 0);
        }).fail(function(e) {
            e = e || {};
            assert.ok(false, e.statusText);
        })
            .always(done);
    });

    QUnit.test('Sorting by Summary field in with path with length greater then columns count', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Product].[Category]', filterValues: ['Bikes'] }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBySummaryField: '[Measures].[Customer Count]',
                    sortBySummaryPath: ['Bikes', 'Road Bikes']
                },
                { dataField: '[Ship Date].[Month of Year]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'value' }]
        }).done(function(data) {
            assert.strictEqual(getValue(data, data.rows[1].children[6]), 462, 'GT - 2003 July');
            assert.strictEqual(getValue(data, data.rows[1].children[7]), 492, 'GT - 2003 August');
            assert.strictEqual(getValue(data, data.rows[1].children[7], data.columns[0]), 492), 'Bikes - 2003 August';

            assert.deepEqual(data.columns[0].text, 'Bikes');

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, 'CY 2004');
            assert.deepEqual(data.rows[1].text, 'CY 2003');
            assert.deepEqual(data.rows[2].text, 'CY 2002');
            assert.deepEqual(data.rows[3].text, 'CY 2001');

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: 'January'
                },
                {
                    text: 'February'
                },
                {
                    text: 'March'
                },
                {
                    text: 'April'
                },
                {
                    text: 'May'
                },
                {
                    text: 'June'
                },
                {
                    text: 'July'
                },
                {
                    text: 'August'
                },
                {
                    text: 'September'
                },
                {
                    text: 'October'
                },
                {
                    text: 'November'
                },
                {
                    text: 'December'
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting by Summary two dimension on axis', function(assert) {
        const done = assert.async();
        this.load({
            'rows': [
                {
                    'dimension': '[Product]',
                    'dataField': '[Product].[Category]',
                    'caption': 'Category',
                    'displayFolder': '',
                    'isMeasure': false,
                    'area': 'row',
                    'index': 0,
                    'allowSorting': true,
                    'allowFiltering': true,
                    'allowExpandAll': true,
                    'sortBySummaryField': '[Measures].[Customer Count]',
                    'sortBySummaryPath': ['CY 2004'],
                    'sortOrder': 'desc',
                    'areaIndex': 0
                },
                {
                    'dimension': '[Product]',
                    'dataField': '[Product].[Subcategory]',
                    'caption': 'Subcategory',
                    'displayFolder': '',
                    'isMeasure': false,
                    'area': 'row',
                    'index': 1,
                    'allowSorting': true,
                    'allowFiltering': true,
                    'allowExpandAll': true,
                    'sortBySummaryField': '[Measures].[Customer Count]',
                    'sortBySummaryPath': ['CY 2004'],
                    'sortOrder': 'desc',
                    'areaIndex': 1
                }
            ],
            'columns': [
                {
                    'dimension': '[Ship Date]',
                    'dataField': '[Ship Date].[Calendar Year]',
                    'caption': 'Ship Date.Calendar Year',
                    'displayFolder': 'Calendar',
                    'isMeasure': false,
                    'area': 'column',
                    'index': 2,
                    'allowSorting': true,
                    'allowFiltering': true,
                    'allowExpandAll': true,
                    'expanded': false,
                    'areaIndex': 0
                },
                {
                    'dimension': '[Ship Date]',
                    'dataField': '[Ship Date].[Month of Year]',
                    'caption': 'Ship Date.Month of Year',
                    'displayFolder': '',
                    'isMeasure': false,
                    'area': 'column',
                    'index': 3,
                    'allowSorting': true,
                    'allowFiltering': true,
                    'allowExpandAll': true,
                    'areaIndex': 1
                }],

            'values': [{
                'dimension': '[Measures]',
                'dataField': '[Measures].[Customer Count]',
                'caption': 'Customer Count',
                'displayFolder': 'Internet Customers',
                'isMeasure': true,
                'area': 'data',
                'index': 4,
                'allowSorting': true,
                'allowFiltering': true,
                'allowExpandAll': true,
                'areaIndex': 0
            }],
            'rowExpandedPaths': [['&[3]']]
        }).done(function(data) {
            assert.strictEqual(data.columns[3].text, 'CY 2004');
            assert.strictEqual(data.columns[3].index, 4);

            assert.strictEqual(data.rows[0].text, 'Accessories');
            assert.strictEqual(data.rows[0].index, 1);

            assert.strictEqual(data.rows[1].text, 'Bikes');
            assert.strictEqual(data.rows[1].index, 2);

            assert.strictEqual(data.rows[2].text, 'Clothing');
            assert.strictEqual(data.rows[2].index, 3);

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [{
                text: 'Jerseys'
            },
            {
                text: 'Caps'
            },
            {
                text: 'Gloves'
            },
            {
                text: 'Shorts'
            },
            {
                text: 'Vests'
            },
            {
                text: 'Socks'
            }]);

            const column = getColumnByIndex(data.values, 4);

            assert.strictEqual(column[1], 9745, 'Accessories - CY 2004');
            assert.strictEqual(column[2], 5646, 'Bikes - CY 2004');
            assert.strictEqual(column[3], 4340, 'Clothing - CY 2004');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting by Summary field when hierarchy in column', function(assert) {
        const done = assert.async();
        this.load({

            columns: [{
                dataField: '[Product].[Product Categories].[Category]',
                hierarchyName: '[Product].[Product Categories]',
                expanded: true,
                filterValues: ['Bikes']
            }, {
                dataField: '[Product].[Product Categories].[Subcategory]',
                hierarchyName: '[Product].[Product Categories]'
            }],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    expanded: true,
                    sortOrder: 'asc',
                    sortBySummaryField: '[Measures].[Customer Count]',
                    sortBySummaryPath: ['Bikes', 'Road Bikes']
                },
                { dataField: '[Ship Date].[Month of Year]' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', sortOrder: 'desc', sortBy: 'value' }]
        }).done(function(data) {

            assert.strictEqual(getValue(data, data.rows[3].children[6]), 462, 'GT - 2003 July');
            assert.strictEqual(getValue(data, data.rows[3].children[7]), 492, 'GT - 2003 August');
            assert.strictEqual(getValue(data, data.rows[3].children[7], data.columns[0]), 492), 'Bikes - 2003 August';

            assert.deepEqual(data.columns[0].children[1].text, 'Road Bikes');

            assert.deepEqual(data.rows.length, 4);

            assert.deepEqual(data.rows[0].text, 'CY 2001');
            assert.deepEqual(data.rows[1].text, 'CY 2002');
            assert.deepEqual(data.rows[2].text, 'CY 2004');
            assert.deepEqual(data.rows[3].text, 'CY 2003');

            assert.deepEqual(removeIndexesAndValue(data.rows[2].children), [
                {
                    text: 'January'
                },
                {
                    text: 'February'
                },
                {
                    text: 'March'
                },
                {
                    text: 'April'
                },
                {
                    text: 'May'
                },
                {
                    text: 'June'
                },
                {
                    text: 'July'
                }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sort fields with several expanded levels when expanded item', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Product].[Category]', sortOrder: 'desc', sortBy: 'value' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]' },
                {
                    dataField: '[Ship Date].[Calendar Quarter of Year]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                { dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBy: 'value' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            headerName: 'rows',
            path: ['&[2003]']
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.strictEqual(data.columns[0].text, 'Clothing');
            assert.strictEqual(data.columns[1].text, 'Bikes');
            assert.strictEqual(data.columns[2].text, 'Accessories');

            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, 'CY Q4');

            assert.strictEqual(data.rows[0].children.length, 3);
            assert.strictEqual(data.rows[0].children[0].text, 'December');
            assert.strictEqual(data.rows[0].children[2].text, 'October');

            assert.strictEqual(data.rows[0].text, 'CY Q4');
            assert.strictEqual(data.rows[2].text, 'CY Q2');
            assert.strictEqual(data.rows[3].text, 'CY Q1');

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            assert.strictEqual(getValue(data, data.rows[3]), 792, 'CY Q1 Total');
            assert.strictEqual(getValue(data, data.rows[2]), 938, 'CY Q2 Total');
            assert.strictEqual(getValue(data, data.rows[0]), 4968, 'CY Q4 Total');
            assert.strictEqual(getValue(data, data.rows[3].children[0]), 271, 'CY Q1->March Total');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sort fields with several expanded levels', function(assert) {
        const done = assert.async();
        this.load({
            columns: [{ dataField: '[Product].[Category]' }],
            rows: [
                { dataField: '[Ship Date].[Calendar Year]', expanded: true },
                {
                    dataField: '[Ship Date].[Calendar Quarter of Year]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                { dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBy: 'value' }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(data.rows.length, 4);

            assert.strictEqual(data.rows[0].text, 'CY 2001');

            assert.strictEqual(data.rows[0].children.length, 2);

            assert.strictEqual(data.rows[0].children[0].text, 'CY Q4');
            assert.strictEqual(data.rows[0].children[1].text, 'CY Q3');

            assert.strictEqual(data.rows[0].children[0].children.length, 3);

            assert.strictEqual(data.rows[0].children[0].children[0].text, 'December');
            assert.strictEqual(data.rows[0].children[0].children[2].text, 'October');

            assert.strictEqual(data.rows[3].text, 'CY 2004');
            assert.strictEqual(data.grandTotalRowIndex, 0);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sort group when expanded item', function(assert) {
        const done = assert.async();
        const expectedTotalIndex = getGrandTotalIndexForExpanding(this.store);
        this.load({
            columns: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            path: [CALENDAR_HIERARCHY_YEAR_DATA[3].key],
            headerName: 'rows',
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.equal(data.columns.length, 3);
            assert.strictEqual(data.columns[0].text, 'Clothing');
            assert.strictEqual(data.columns[1].text, 'Bikes');
            assert.strictEqual(data.columns[2].text, 'Accessories');

            assert.deepEqual(removeIndexesAndValue(data.rows), [
                { text: 'August 2004' },
                { text: 'July 2004' },
                { text: 'June 2004' },
                { text: 'May 2004' },
                { text: 'April 2004' },
                { text: 'March 2004' },
                { text: 'February 2004' },
                { text: 'January 2004' }
            ]);

            assert.strictEqual(data.grandTotalColumnIndex, 0);
            assert.strictEqual(data.grandTotalRowIndex, expectedTotalIndex);

            // assert.deepEqual(getColumnByIndex(data.values, 0), [11753, 1414, 1414, 209, 1229, 10682, 5973, 2119, 2142, 1909, 5271, 1870, 1795, 1834]);

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sort when several groups on axis. Expand item', function(assert) {
        const done = assert.async();
        this.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            headerName: 'columns',
            path: ['&[2004]'],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 3);

            assert.strictEqual(data.columns[0].text, 'Clothing');
            assert.strictEqual(data.columns[0].children[0].text, 'Vests');
            assert.strictEqual(data.columns[0].children[4].text, 'Gloves');
            assert.strictEqual(data.columns[2].text, 'Accessories');
            assert.strictEqual(data.columns[2].children[0].text, 'Tires and Tubes');
            assert.strictEqual(data.columns[2].children[1].text, 'Hydration Packs');
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sort when several expanded groups on axis', function(assert) {
        const done = assert.async();
        this.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [
                {
                    dataField: '[Ship Date].[Calendar]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    filterValues: ['CY 2003', 'CY 2002'],
                    filterType: 'include'
                }
            ]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 2);

            assert.strictEqual(data.columns[0].text, 'CY 2003');
            assert.strictEqual(data.columns[0].children[0].text, 'December 2003');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sort last group on axis', function(assert) {
        const done = assert.async();
        this.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true
                },

                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [
                {
                    dataField: '[Ship Date].[Calendar]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    filterValues: ['CY 2003', 'CY 2002'],
                    filterType: 'include'
                }
            ]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 2);

            assert.strictEqual(data.columns[0].text, 'CY 2002');
            assert.strictEqual(data.columns[0].children[0].text, 'January 2002');
            assert.strictEqual(data.columns[0].children[1].children[0].text, 'Bikes');
            assert.strictEqual(data.columns[0].children[1].children[0].children[0].text, 'Road Bikes');

            assert.strictEqual(data.columns[1].text, 'CY 2003');

            assert.strictEqual(data.columns[1].children.length, 12);
            assert.strictEqual(data.columns[1].children[0].text, 'January 2003');
            assert.strictEqual(data.columns[1].children[11].text, 'December 2003');

            assert.strictEqual(data.columns[1].children[11].children[0].text, 'Clothing');
            assert.strictEqual(data.columns[1].children[11].children[0].children[0].text, 'Vests');
            assert.strictEqual(data.columns[1].children[11].children[0].children[1].text, 'Socks');
            assert.strictEqual(data.columns[1].children[11].children[1].text, 'Bikes');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Sorting group in two dimension', function(assert) {
        const done = assert.async();
        this.load({
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Calendar Year]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            rows: [
                {
                    dataField: '[Product].[Product Categories].[Category]',
                    hierarchyName: '[Product].[Product Categories]',
                    expanded: true,
                    sortOrder: 'desc',
                    sortBy: 'value'
                },
                {
                    dataField: '[Product].[Product Categories].[Subcategory]',
                    hierarchyName: '[Product].[Product Categories]',
                    sortOrder: 'desc',
                    sortBy: 'value'
                }
            ],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }],
            filters: [
                {
                    dataField: '[Ship Date].[Calendar]',
                    hierarchyName: '[Ship Date].[Calendar]',
                    filterValues: ['CY 2003', 'CY 2002'],
                    filterType: 'include'
                },
                {
                    dataField: '[Product].[Product Categories]',
                    hierarchyName: '[Product].[Product Categories]',
                    filterValues: ['Bikes', 'Clothing'],
                    filterType: 'include'
                }
            ]
        }).done(function(data) {
            assert.strictEqual(data.columns.length, 2);

            assert.strictEqual(data.columns[0].text, 'CY 2003');
            assert.strictEqual(data.columns[1].text, 'CY 2002');

            assert.strictEqual(data.columns[0].children[0].text, 'December 2003');
            assert.strictEqual(data.columns[0].children[11].text, 'January 2003');

            assert.strictEqual(data.rows.length, 2);

            assert.strictEqual(data.rows[0].text, 'Clothing');
            assert.strictEqual(data.rows[1].text, 'Bikes');

            assert.strictEqual(data.rows[0].children[0].value, 'Vests');
            assert.strictEqual(data.rows[0].children[1].value, 'Socks');

        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.module('XMLA Store with another cubes');

    QUnit.test('T248791. Dimension with zero level members', function(assert) {
        const done = assert.async();
        const store = new XmlaStore({
            url: DATA_SOURCE_URL,
            catalog: 'Q380421',
            cube: 'CubeMobile'
        });

        store.load({
            columns: [
                { dataField: '[Агрегация по дате].[Агрегация по дате]', area: 'column' }
            ],
            values: [{ dataField: '[Measures].[Опер_Колво]' }]
        }).done(function(data) {
            assert.deepEqual(data.rows, []);
            assert.strictEqual(data.columns.length, 3);

            assert.strictEqual(data.grandTotalRowIndex, 0);
            if(data.grandTotalColumnIndex === undefined) {
                assert.deepEqual(data.values, [[[1836], [1836], [1836]]]);
            } else {
                assert.deepEqual(data.values, [[undefined, [1836], [1836], [1836]]]);
            }


        }).always(done);

    });

    QUnit.test('T248791. Dimension with zero level members. Expand All level', function(assert) {
        const done = assert.async();
        const store = new XmlaStore({
            url: DATA_SOURCE_URL,
            catalog: 'Q380421',
            cube: 'CubeMobile'
        });
        store.load({
            columns: [
                { dataField: '[Агрегация по дате].[Агрегация по дате]', area: 'column', expanded: true },
                { dataField: '[Дата].[Год]' }
            ],
            values: [{ dataField: '[Measures].[Опер_Колво]' }]
        }).done(function(data) {
            assert.deepEqual(data.rows, []);
            assert.strictEqual(data.columns.length, 3);
            assert.ok(data.columns[0].children);
            assert.strictEqual(data.grandTotalRowIndex, 0);

            if(data.grandTotalColumnIndex === undefined) {
                assert.deepEqual(data.values, [[[1836], [1836], [1836], [1503], [333], [1503], [333], [1503], [333]]]);
            } else {
                assert.deepEqual(data.values, [[undefined, [1836], [1503], [333], [1836], [1503], [333], [1836], [1503], [333]]]);
            }

        }).always(done);
    });

    QUnit.module('Subset', testEnvironment);

    function getHeaderItemValue(headerItem) {
        return headerItem.value;
    }

    QUnit.test('Skip and take rows', function(assert) {
        const done = assert.async();
        this.store.load({
            rows: [{
                dataField: '[Product].[Subcategory]',
                filterValues: [
                    'Bike Racks',
                    'Bottles and Cages',
                    'Caps',
                    'Cleaners'
                ]
            }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            rowSkip: 2,
            rowTake: 2
        }).done(function(data) {
            assert.deepEqual(data.rows.map(getHeaderItemValue), [undefined, undefined, 'Caps', 'Cleaners']);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Skip and take rows if expand', function(assert) {
        const done = assert.async();
        this.store.load({
            path: ['&[2001]'],
            area: 'column',
            headerName: 'columns',
            rows: [{
                dataField: '[Customer].[Customer]',
            }],
            columns: [{
                dataField: '[Ship Date].[Calendar Year]'
            }, {
                dataField: '[Ship Date].[Month of Year]'
            }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            rowSkip: 0,
            rowTake: 2
        }).done(function(data) {
            assert.strictEqual(data.rows.length, 18484);
            assert.strictEqual(data.rows[0].value, 'Aaron A. Allen');
            assert.strictEqual(data.rows[1].value, 'Aaron A. Hayes');
            assert.strictEqual(data.rows[2].value, undefined);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Skip and take rows if expand and if oppositePath', function(assert) {
        const done = assert.async();
        this.store.load({
            area: 'column',
            headerName: 'columns',
            path: ['&[2003]'],
            oppositePath: ['&[4]'], // Accessories
            rows: [{
                dataField: '[Product].[Category]',
            }, {
                dataField: '[Customer].[Customer]',
            }],
            columns: [{
                dataField: '[Ship Date].[Calendar Year]'
            }, {
                dataField: '[Ship Date].[Month of Year]'
            }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            rowSkip: 0,
            rowTake: 3
        }).done(function(data) {
            assert.strictEqual(data.rows.length, 18484);
            assert.strictEqual(data.rows[0].value, 'Aaron A. Allen');
            assert.strictEqual(data.rows[1].value, 'Aaron A. Hayes');
            assert.strictEqual(data.rows[2].value, 'Aaron A. Zhang');
            assert.strictEqual(data.rows[3].value, undefined);

            assert.strictEqual(getValue(data, data.rows[0]), null), 'Aaron A. Allen 2003';
            assert.strictEqual(getValue(data, data.rows[1]), null), 'Aaron A. Hayes 2003';
            assert.strictEqual(getValue(data, data.rows[2]), 1), 'Aaron A. Zhang 2003';
            assert.strictEqual(getValue(data, data.rows[2], data.columns[10]), 1), 'Aaron A. Zhang 2003 October';
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Skip and take columns', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Ship Date].[Calendar Year]'
            }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            columnSkip: 2,
            columnTake: 2
        }).done(function(data) {
            assert.deepEqual(data.columns.map(getHeaderItemValue), [undefined, undefined, 2003, 2004]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('take columns', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Ship Date].[Calendar Year]'
            }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            columnSkip: 0,
            columnTake: 2
        }).done(function(data) {
            assert.deepEqual(data.columns.map(getHeaderItemValue), [2001, 2002, undefined, undefined]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Skip and take columns with searchValue', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Product].[Product]', searchValue: 'Men\'s'
            }],
            columnSkip: 2,
            columnTake: 2
        }).done(function(data) {
            assert.deepEqual(data.columns.map(getHeaderItemValue), [
                undefined, undefined,
                'Men\'s Sports Shorts, L', 'Men\'s Sports Shorts, M',
                undefined, undefined,
                undefined, undefined,
                undefined, undefined,
                undefined, undefined
            ]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Skip and take columns with wrong searchValue', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Product].[Product]', searchValue: 'wrong'
            }],
            columnSkip: 2,
            columnTake: 2
        }).done(function(data) {
            assert.deepEqual(data.columns.map(getHeaderItemValue), []);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Skip and take rows and columns', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [{
                dataField: '[Product].[Subcategory]',
                filterValues: [
                    'Bike Racks',
                    'Bike Stands',
                    'Bottles and Cages',
                    'Caps',
                    'Cleaners'
                ]
            }],
            rows: [{ dataField: '[Product].[Category]' }],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            columnSkip: 2,
            columnTake: 2,
            rowSkip: 1,
            rowTake: 1
        }).done(function(data) {
            assert.deepEqual(data.columns.map(getHeaderItemValue), [undefined, undefined, 'Bottles and Cages', 'Caps', undefined]);
            assert.deepEqual(data.rows.map(getHeaderItemValue), [undefined, 'Clothing']);
        }).fail(getFailCallBack(assert))
            .always(done);
    });


    QUnit.test('Skip and take rows and columns with empty dimensions', function(assert) {
        const done = assert.async();
        this.store.load({
            columns: [],
            rows: [],
            values: [{ dataField: '[Measures].[Customer Count]' }],
            columnSkip: 2,
            columnTake: 2,
            rowSkip: 1,
            rowTake: 1
        }).done(function(data) {
            assert.deepEqual(data.columns.map(getHeaderItemValue), []);
            assert.deepEqual(data.rows.map(getHeaderItemValue), []);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Skip and take rows with sortOrder desc', function(assert) {
        const done = assert.async();
        this.store.load({
            rows: [{
                dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc'
            }],
            values: [],
            rowSkip: 2,
            rowTake: 2
        }).done(function(data) {
            assert.deepEqual(data.rows.map(getHeaderItemValue), [undefined, undefined, 10, 9, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });

    QUnit.test('Skip and take rows with sortOrder desc amd sortBy displayText', function(assert) {
        const done = assert.async();
        this.store.load({
            rows: [{
                dataField: '[Ship Date].[Month of Year]', sortOrder: 'desc', sortBy: 'displayText'
            }],
            values: [],
            rowSkip: 2,
            rowTake: 2
        }).done(function(data) {
            assert.deepEqual(data.rows.map(getHeaderItemValue), [undefined, undefined, 11, 5, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]);
        }).fail(getFailCallBack(assert))
            .always(done);
    });
});
