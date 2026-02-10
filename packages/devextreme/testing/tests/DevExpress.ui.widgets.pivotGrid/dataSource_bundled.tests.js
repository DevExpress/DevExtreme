import $ from 'jquery';
import ArrayStore from 'common/data/array_store';
import { CustomStore } from 'common/data/custom_store';
import inflector from '__internal/core/utils/m_inflector';
import { PivotGridDataSource } from '__internal/grids/pivot_grid/data_source/m_data_source';
import summaryDisplayModesModule from '__internal/grids/pivot_grid/summary_display_modes/m_summary_display_modes';
import xmlaStoreModule, { XmlaStore } from '__internal/grids/pivot_grid/xmla_store/m_xmla_store';
import { LocalStore } from '__internal/grids/pivot_grid/local_store/m_local_store';
import { RemoteStore } from '__internal/grids/pivot_grid/remote_store/m_remote_store';
import pivotGridUtils, { setFieldProperty } from '__internal/grids/pivot_grid/m_widget_utils';

import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import '../../content/orders.js';
import PivotGridTestSettings from '../../helpers/pivotGridTestSettings.js';

function createDataSource(options) {
    const dataSource = new PivotGridDataSource(options);
    dataSource.load();
    return dataSource;
}

function prepareFields(fields) {
    $.each(fields, function(index, field) {
        delete field.index;
        delete field._initProperties;
    });
    return fields;
}

function prepareLoadArgs(args) {
    const data = args[0];

    prepareFields(data.columns);
    prepareFields(data.rows);
    prepareFields(data.filters);
    prepareFields(data.values);

    return args;
}

function prepareLoadedData(data) {
    pivotGridUtils.foreachTree(data, function(items) {
        delete items[0].text;
    });
    return data;
}

const defaultEnvironment = {
    beforeEach: function() {
        this.testStore = sinon.createStubInstance(XmlaStore);

        this.defaultFields = [
            { dataField: 'Country', area: 'column' },
            { dataField: 'City', area: 'column' },
            { dataField: 'Year', area: 'row' }
        ];

        this.storeData = {
            columns: [{
                index: 1,
                value: 'USA',
                children: [{
                    index: 2,
                    value: 'Boise'
                }, {
                    index: 3,
                    value: 'Elgin'
                }, {
                    index: 4,
                    value: 'Butte'
                }]
            }, {
                index: 5,
                value: 'Canada'
            }, {
                index: 6,
                value: 'Brazil',
                children: [{
                    index: 7,
                    value: 'Campinas'
                }, {
                    index: 8,
                    value: 'Sao Paulo'
                }]
            }],
            rows: [
                {
                    index: 1,
                    value: 1991
                },
                {
                    index: 2,
                    value: 1991
                },
                {
                    index: 3,
                    value: 1985
                }
            ],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };
        executeAsyncMock.setup();

    },

    afterEach: function() {
        executeAsyncMock.teardown();
    }
};

QUnit.module('dxPivotGrid dataSource with Store', {
    beforeEach: function() {
        const that = this;
        defaultEnvironment.beforeEach.apply(that, arguments);
        sinon.stub(inflector, 'titleize');
        inflector.titleize.returns('');

    },
    afterEach: function() {
        inflector.titleize.restore && inflector.titleize.restore();
        defaultEnvironment.afterEach.apply(this, arguments);
    }
}, () => {

    QUnit.test('Create XmlaStore', function(assert) {
        sinon.spy(xmlaStoreModule, 'XmlaStore');

        const dataSource = createDataSource({
            store: {
                type: 'xmla',
                url: ''
            }
        });
        assert.ok(dataSource.store() instanceof XmlaStore);
        assert.ok(xmlaStoreModule.XmlaStore.calledOnce);
        assert.ok(xmlaStoreModule.XmlaStore.calledWithNew);
        assert.deepEqual(xmlaStoreModule.XmlaStore.lastCall.args, [{
            type: 'xmla',
            url: ''
        }]);

        xmlaStoreModule.XmlaStore.restore();
    });

    QUnit.test('Create XmlaStore with paginate', function(assert) {

        sinon.spy(xmlaStoreModule, 'XmlaStore');

        const dataSource = createDataSource({
            paginate: true,
            store: {
                type: 'xmla',
                url: ''
            }
        });
        assert.ok(dataSource.store() instanceof XmlaStore);
        assert.ok(dataSource.paginate());

        xmlaStoreModule.XmlaStore.restore();
    });

    QUnit.test('Create XmlaStore by Instance', function(assert) {

        sinon.spy(xmlaStoreModule, 'XmlaStore');

        const dataSource = createDataSource({
            store: new xmlaStoreModule.XmlaStore({
                type: 'xmla',
                url: ''
            })
        });
        assert.ok(dataSource.store() instanceof xmlaStoreModule.XmlaStore);
        assert.ok(xmlaStoreModule.XmlaStore.calledOnce);
        assert.ok(xmlaStoreModule.XmlaStore.calledWithNew);
        assert.deepEqual(xmlaStoreModule.XmlaStore.lastCall.args, [{
            type: 'xmla',
            url: ''
        }]);

        xmlaStoreModule.XmlaStore.restore();
    });

    QUnit.test('Create LocalStore when store with type', function(assert) {
        const dataSource = createDataSource({
            store: { type: 'array', data: [] }
        });

        assert.ok(dataSource.store() instanceof LocalStore);
    });

    QUnit.test('Create RemoteStore when store with type', function(assert) {
        const dataSource = createDataSource({
            remoteOperations: true,
            store: { type: 'array', data: [] }
        });

        assert.ok(dataSource.store() instanceof RemoteStore);
    });

    QUnit.test('Create store with class instance', function(assert) {
        const dataSource = createDataSource({
            store: this.testStore
        });

        assert.equal(dataSource.store(), this.testStore);
        assert.ok(this.testStore.load.called);
    });

    QUnit.test('Create store with ArrayStore instance', function(assert) {
        const arrayStore = new ArrayStore([]);
        const dataSource = createDataSource({
            store: arrayStore
        });

        assert.ok(dataSource.store() instanceof LocalStore);
        assert.ok(dataSource.store()._dataSource.store() instanceof ArrayStore);
    });

    QUnit.test('Create store with ArrayStore instance and remote operations', function(assert) {
        const arrayStore = new ArrayStore([]);
        const dataSource = createDataSource({
            remoteOperations: true,
            store: arrayStore
        });

        assert.ok(dataSource.store() instanceof RemoteStore);
        assert.ok(dataSource.store()._dataSource.store() instanceof ArrayStore);
    });

    QUnit.test('Create store with load function', function(assert) {
        const dataSource = createDataSource({
            load: function() {
                return [];
            }
        });

        assert.ok(dataSource.store() instanceof LocalStore);
        assert.ok(dataSource.store()._dataSource.store() instanceof CustomStore);
    });

    QUnit.test('Create store with load function and remote operations', function(assert) {
        const dataSource = createDataSource({
            remoteOperations: true,
            load: function() {
                return [];
            }
        });

        assert.notOk(dataSource.paginate(), 'no paginate');
        assert.ok(dataSource.store() instanceof RemoteStore);
        assert.ok(dataSource.store()._dataSource.store() instanceof CustomStore);
    });

    QUnit.test('Create store with load function and paginate', function(assert) {
        const dataSource = createDataSource({
            paginate: true,
            load: function() {
                return [];
            }
        });

        assert.notOk(dataSource.paginate(), 'no paginate');
        assert.ok(dataSource.store() instanceof RemoteStore, 'PivotGrid store type is remote');
        assert.ok(dataSource.store()._dataSource.store() instanceof CustomStore, 'inner store type is custom');
    });

    QUnit.test('Create LocalStore with onChanged event', function(assert) {
        let onChangedCallCount = 0;
        const dataSource = createDataSource({
            store: { type: 'array', data: [] },
            onChanged: function() {
                assert.equal(arguments.length, 0, 'no changed arguments');
                onChangedCallCount++;
            }
        });

        assert.ok(dataSource.store() instanceof LocalStore);
        assert.equal(onChangedCallCount, 1, 'changed call count');
    });

    // T306927
    QUnit.test('Create simple store by data', function(assert) {
        executeAsyncMock.teardown();

        const dataSource = createDataSource({
            fields: [
                { area: 'column' },
                { area: 'data', caption: 'Sum', format: 'fixedPoint' }
            ],
            columns: [{ value: 'B' }, { value: 'A' }]
        });

        assert.ok(!dataSource.store(), 'no store instance');
        assert.ok(!dataSource.isLoading(), 'no async loading');

        assert.deepEqual(dataSource.getData().fields.length, 2);
        assert.deepEqual(dataSource.getData().rows.length, 0);
        assert.deepEqual(dataSource.getData().values.length, 0);
        assert.deepEqual(dataSource.getData().columns.length, 2);
        // T317225
        assert.deepEqual(dataSource.getData().columns[0].value, 'B');
        assert.deepEqual(dataSource.getData().columns[1].value, 'A');

        assert.deepEqual(dataSource.getAreaFields('column').length, 1);
        assert.deepEqual(dataSource.getAreaFields('row').length, 0);
        assert.deepEqual(dataSource.getAreaFields('data').length, 1);
    });

    QUnit.test('onChanged event reset data to default loaded data', function(assert) {
    // act
        let onChangedCallCount = 0;
        const dataSource = createDataSource({
            fields: [
                { dataField: 'test', area: 'data', summaryType: 'sum' }
            ],
            store: { type: 'array', data: [{ test: 5 }] },
            onChanged: function() {
                const data = this.getData();

                assert.equal(data.values[0][0][0], 5, 'loaded test value');

                data.values[0][0][0] = data.values[0][0][0] + 1;
                onChangedCallCount++;
            }
        });

        // assert
        assert.equal(dataSource.getData().values[0][0][0], 6, 'test value after changed handler');
        assert.equal(onChangedCallCount, 1, 'changed call count');

        // act
        dataSource.load();

        // assert
        assert.equal(dataSource.getData().values[0][0][0], 6, 'test value after changed handler');
        assert.equal(onChangedCallCount, 2, 'changed call count');
    });

    QUnit.test('Create LocalStore with filter', function(assert) {
        const dataSource = createDataSource({
            fields: [{ dataField: 'value', area: 'row' }],
            filter: ['value', '>', 1],
            store: { type: 'array', data: [{ value: 1 }, { value: 2 }] }
        });

        assert.ok(dataSource.store() instanceof LocalStore);
        assert.equal(dataSource.getData().rows.length, 1, 'row count');
        assert.equal(dataSource.getData().rows[0].value, 2, 'row value');
    });

    QUnit.test('CreateDrillDown dataSource', function(assert) {
        const dataSource = createDataSource({
            fields: [{ dataField: 'value', area: 'row' }],
            store: this.testStore
        });
        const drillDownParams = {
            columnPath: [],
            rowPath: []
        };

        const drillDownDataSource = dataSource.createDrillDownDataSource(drillDownParams);

        prepareFields(dataSource.fields());

        assert.ok(this.testStore.createDrillDownDataSource.calledOnce);
        assert.deepEqual(this.testStore.createDrillDownDataSource.lastCall.args[0], {
            columns: [],
            filters: [],
            rows: [
                {
                    area: 'row',
                    areaIndex: 0,
                    caption: '',
                    dataField: 'value'
                }
            ],
            values: []
        });
        assert.strictEqual(this.testStore.createDrillDownDataSource.lastCall.args[1], drillDownParams);
        assert.deepEqual(this.testStore.createDrillDownDataSource.lastCall.returnValue, drillDownDataSource);
    });

    QUnit.test('getAreaFields', function(assert) {
        const fields = [
            { dataField: '[Color]', area: 'row', areaIndex: 2 },
            { dataField: '[Product].[Subcategory]', groupName: '[Product]', area: 'column', groupIndex: 1 },
            { dataField: '[Date]', groupName: '[Date]', area: 'row', areaIndex: 0 },
            { dataField: '[Date].[Year]', groupName: '[Date]', area: 'row', areaIndex: 0, groupIndex: 0 },
            { dataField: '[Product].[Category]', groupName: '[Product]', groupIndex: 0 },
            { dataField: '[Product]', groupName: '[Product]', area: 'column', areaIndex: 1 },
            { dataField: '[Customer Count]', groupName: '[Customer Count]', area: 'data' },
            { dataField: '[Customer Count]', groupName: '[Customer Count]', groupIndex: 0, groupInterval: 100 },
            { dataField: '[Customer Count]', groupName: '[Customer Count]', groupIndex: 1, groupInterval: 10 }
        ];

        const dataSource = createDataSource({
            fields: fields,
            store: this.testStore
        });

        // assert
        assert.deepEqual(dataSource.getAreaFields('column'), [fields[4], fields[1]], 'column area fields');
        assert.deepEqual(dataSource.getAreaFields('column', true), [fields[5]], 'column area group fields');
        assert.deepEqual(dataSource.getAreaFields('row'), [fields[3], fields[0]], 'row area fields');
        assert.deepEqual(dataSource.getAreaFields('row', true), [fields[2], fields[0]], 'row area group fields');
        assert.deepEqual(dataSource.getAreaFields('data'), [fields[6]], 'row area fields');
        assert.deepEqual(dataSource.getAreaFields('data', true), [fields[6]], 'row area group fields');
        assert.deepEqual(dataSource.getAreaFields('filter'), [], 'filter area fields');
    });

    // T317225
    QUnit.test('getAreaFields for many data fields', function(assert) {
        const fields = [
            { area: 'data', caption: '1' },
            { area: 'data', caption: '2' },
            { area: 'data', caption: '3' },
            { area: 'data', caption: '4' },
            { area: 'data', caption: '5' },
            { area: 'data', caption: '6' },
            { area: 'data', caption: '7' },
            { area: 'data', caption: '8' },
            { area: 'data', caption: '9' },
            { area: 'data', caption: '10' },
            { area: 'data', caption: '11' },
            { area: 'data', caption: '12' }
        ];

        const dataSource = createDataSource({
            fields: fields,
            store: this.testStore
        });


        // assert
        const dataFields = dataSource.getAreaFields('data');
        assert.equal(dataFields.length, 12, 'data fields count');

        $.each(dataFields, function(index, dataField) {
            const caption = (index + 1).toString();
            assert.equal(dataField.caption, caption, 'field ' + caption + ' caption');
        });
    });

    QUnit.test('Load Field Values', function(assert) {
        this.testStore.load.returns($.Deferred().reject());
        // act
        const customizeFunction = function(arg) {
            return 'customized' + arg.value;
        };
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'filter', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0, customizeText: customizeFunction },
                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }
            ],
            store: this.testStore

        });
        const loadResult = {
            columns: [{ value: 2001 }, { value: 2002 }, { value: 2003 }],
            rows: [],
            values: [[6, 1, 2, 3]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        this.testStore.load.returns($.Deferred().resolve(loadResult));


        let fieldValues;

        dataSource.getFieldValues(1).done(function(data) {
            fieldValues = data;
        });

        // assert
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            values: [dataSource.field(2)],
            columns: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    areaIndex: 0,
                    area: 'row',
                    expanded: true,
                    filterValues: null,
                    sortBySummaryField: null,
                    sortOrder: 'asc',
                    caption: '',
                    customizeText: customizeFunction
                }
            ],
            rows: [],
            filters: [],
            skipValues: true
        }], 'load args');

        assert.deepEqual(fieldValues, loadResult.columns);
        assert.strictEqual(fieldValues[0].text, 'customized2001');
        assert.strictEqual(fieldValues[1].text, 'customized2002');
        assert.strictEqual(fieldValues[2].text, 'customized2003');
    });

    QUnit.test('Load Field Values with paginate', function(assert) {
        this.testStore.load.returns($.Deferred().reject());
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'filter' }
            ],
            store: this.testStore

        });
        const loadResult = {
            columns: [{}, { value: 'cat2' }, { value: 'cat3' }, {}, {}],
            rows: [],
            values: [],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        this.testStore.load.returns($.Deferred().resolve(loadResult));


        let fieldValues;

        dataSource.getFieldValues(0, false, { skip: 1, take: 2, searchValue: 'cat' }).done(function(data) {
            fieldValues = data;
        });

        // assert
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            columnSkip: 1,
            columnTake: 2,
            values: [],
            columns: [
                {
                    dataField: '[Product].[Category]',
                    area: 'filter',
                    areaIndex: 0,
                    expanded: true,
                    filterValues: null,
                    sortBySummaryField: null,
                    sortOrder: 'asc',
                    caption: '',
                    searchValue: 'cat'
                }
            ],
            rows: [],
            filters: [],
            skipValues: true
        }], 'load args');

        assert.deepEqual(fieldValues, loadResult.columns);
        assert.strictEqual(fieldValues.length, 2);
        assert.strictEqual(fieldValues[0].text, 'cat2');
        assert.strictEqual(fieldValues[1].text, 'cat3');
    });

    QUnit.test('Load Field Values with showRelevantValues', function(assert) {
        this.testStore.load.returns($.Deferred().reject());
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Ship Date].[Calendar Year]', area: 'column', areaIndex: 0, filterValues: [2001] },
                { dataField: '[Product].[Category]', area: 'filter', areaIndex: 0, filterValues: ['Bikes'] },
                { dataField: '[Product].[Subcategory]', area: 'row', areaIndex: 0, filterValues: ['Bike 1'] }
            ],
            store: this.testStore

        });
        const loadResult = {
            columns: [{ value: 'Bike 1' }, { value: 'Bike 2' }],
            rows: [],
            values: [],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        this.testStore.load.returns($.Deferred().resolve(loadResult));


        let fieldValues;
        const showRelevantValues = true;

        dataSource.getFieldValues(2, showRelevantValues).done(function(data) {
            fieldValues = data;
        });

        // assert
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            values: [],
            columns: [
                {
                    dataField: '[Product].[Subcategory]',
                    area: 'row',
                    areaIndex: 0,
                    expanded: true,
                    filterValues: null,
                    sortBySummaryField: null,
                    sortOrder: 'asc',
                    caption: ''
                }
            ],
            rows: [],
            filters: [
                {
                    area: 'column',
                    areaIndex: 0,
                    caption: '',
                    dataField: '[Ship Date].[Calendar Year]',
                    filterValues: [
                        2001
                    ]
                },
                {
                    area: 'filter',
                    areaIndex: 0,
                    caption: '',
                    dataField: '[Product].[Category]',
                    filterValues: ['Bikes']
                }
            ],
            skipValues: true
        }], 'load args');

        assert.deepEqual(fieldValues, loadResult.columns);
        assert.strictEqual(fieldValues.length, 2);
        assert.strictEqual(fieldValues[0].text, 'Bike 1');
        assert.strictEqual(fieldValues[1].text, 'Bike 2');
    });

    QUnit.test('Reload data', function(assert) {
        const testStore = this.testStore;
        this.testStore.load.returns($.Deferred().reject());
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }
            ],
            store: this.testStore

        });
        const loadResult = {
            columns: [{ value: 2001 }, { value: 2002 }, { value: 2003 }],
            rows: [],
            values: [[6, 1, 2, 3]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        this.testStore.load.returns($.Deferred().resolve(loadResult));

        dataSource.reload().done(function(data) {
            assert.deepEqual(data, loadResult);

            assert.deepEqual(prepareLoadArgs(testStore.load.lastCall.args), [{
                columnExpandedPaths: [],
                columns: [
                    {
                        area: 'column',
                        areaIndex: 0,
                        caption: '',
                        dataField: '[Product].[Category]'
                    }
                ],
                filters: [],
                reload: true,
                rowExpandedPaths: [],
                rows: [
                    {
                        area: 'row',
                        areaIndex: 0,
                        caption: '',
                        dataField: '[Ship Date].[Calendar Year]'
                    }
                ],
                values: [
                    {
                        area: 'data',
                        areaIndex: 0,
                        caption: 'Count',
                        dataField: '[Measures].[Customer Count]'
                    }
                ]
            }]);
        });
    });

    QUnit.test('Filter', function(assert) {
    // act
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }
            ],
            store: this.testStore

        });

        this.testStore.filter.returns('storeFilterResult');
        // act

        const result = dataSource.filter('a', '>', 10);

        assert.ok(this.testStore.filter.calledOnce);
        assert.deepEqual(this.testStore.filter.lastCall.args, ['a', '>', 10]);
        assert.strictEqual(result, 'storeFilterResult');
    });

    QUnit.test('Load Field Values for group', function(assert) {
        this.testStore.load.returns($.Deferred().reject());
        // act
        const customize1 = function(arg) {
            return 'customized1_' + arg.value;
        };
        const customize2 = function(arg) {
            return 'customized2_' + arg.value;
        };
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar]', groupName: '[Ship Date].[Calendar]', area: 'row', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar].[Year]', groupName: '[Ship Date].[Calendar]', groupIndex: 0, customizeText: customize1 },
                { dataField: '[Ship Date].[Calendar].[Month]', groupName: '[Ship Date].[Calendar]', groupIndex: 1, customizeText: customize2 },
                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }
            ],
            store: this.testStore

        });
        const loadResult = {
            columns: [{ value: 2001, children: [{ value: 1 }, { value: 2 }] }, { value: 2002, children: [{ value: 1 }, { value: 2 }] }, { value: 2003, children: [{ value: 1 }, { value: 2 }] }],
            rows: [],
            values: [[6, 1, 2, 3]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        this.testStore.load.returns($.Deferred().resolve(loadResult));

        let fieldValues;

        dataSource.getFieldValues(1).done(function(data) {
            fieldValues = data;
        });

        // assert
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            values: [dataSource.field(4)],
            columns: [
                {
                    dataField: '[Ship Date].[Calendar].[Year]',
                    areaIndex: 0,
                    area: 'row',
                    expanded: true,
                    filterValues: null,
                    sortBySummaryField: null,
                    sortOrder: 'asc',
                    groupName: '[Ship Date].[Calendar]',
                    groupIndex: 0,
                    caption: '',
                    customizeText: customize1
                },
                {
                    dataField: '[Ship Date].[Calendar].[Month]',
                    areaIndex: 0,
                    area: 'row',
                    expanded: true,
                    filterValues: null,
                    sortBySummaryField: null,
                    sortOrder: 'asc',
                    groupName: '[Ship Date].[Calendar]',
                    groupIndex: 1,
                    caption: '',
                    customizeText: customize2
                }
            ],
            skipValues: true,
            rows: [],
            filters: []
        }], 'load args');

        assert.deepEqual(fieldValues, loadResult.columns);
        assert.strictEqual(fieldValues[0].text, 'customized1_2001');
        assert.strictEqual(fieldValues[0].children[0].text, 'customized2_1');
        assert.strictEqual(fieldValues[0].children[1].text, 'customized2_2');
        assert.strictEqual(fieldValues[1].text, 'customized1_2002');
        assert.strictEqual(fieldValues[1].children[0].text, 'customized2_1');
    });

    QUnit.test('Fields visibility', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar Month]', area: 'row', areaIndex: 0, visible: false },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0, visible: true },

                { dataField: 'Product', groupName: 'Product', area: 'row' },

                { dataField: 'Product.Color', groupName: 'Product', groupIndex: 0, visible: true },
                { dataField: 'Product.Width', groupName: 'Product', groupIndex: 1 },
                { dataField: 'Product.Height', groupName: 'Product', groupIndex: 2, visible: false },

                { dataField: 'Calendar', groupName: 'Calendar', area: 'row', visible: false },

                { dataField: 'Calendar.Year', groupName: 'Calendar', groupIndex: 0, visible: true },
                { dataField: 'Calendar.Quarter', groupName: 'Calendar', groupIndex: 1, visible: true },
                { dataField: 'Calendar.Month', groupName: 'Calendar', groupIndex: 2, visible: false },

                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 },

                { dataField: 'Field1', caption: 'Field1', area: 'data', visible: false },

                { dataField: 'FilterField1', area: 'filter', visible: false },
                { dataField: 'FilterField2', area: 'filter', visible: true }
            ],
            store: this.testStore

        });

        // assert
        assert.deepEqual(prepareFields(this.testStore.load.lastCall.args[0].columns), [{
            area: 'column',
            areaIndex: 0,
            dataField: '[Product].[Category]',
            caption: ''
        }], 'column');

        assert.deepEqual(prepareFields(this.testStore.load.lastCall.args[0].rows), [{
            area: 'row',
            areaIndex: 0,
            dataField: '[Ship Date].[Calendar Year]',
            visible: true,
            caption: ''
        },
        { dataField: 'Product.Color', groupName: 'Product', groupIndex: 0, visible: true, areaIndex: 1, area: 'row', caption: '' },
        { dataField: 'Product.Width', groupName: 'Product', groupIndex: 1, areaIndex: 1, area: 'row', caption: '' }

        ], 'rows');

        assert.deepEqual(prepareFields(this.testStore.load.lastCall.args[0].values), [
            { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 },
            { dataField: 'Field1', caption: 'Field1', area: 'data', visible: false, areaIndex: 1 }
        ], 'data');

        assert.deepEqual(prepareFields(this.testStore.load.lastCall.args[0].filters), [
            { caption: '', dataField: 'FilterField1', area: 'filter', visible: false },
            { caption: '', dataField: 'FilterField2', area: 'filter', visible: true, areaIndex: 0 }
        ], 'filter fields in store loadOptions');

        assert.strictEqual(dataSource.getAreaFields('filter').length, 2);

        assert.strictEqual(dataSource.getAreaFields('row', true).length, 2);
        assert.strictEqual(dataSource.getAreaFields('column', true).length, 1);

        assert.strictEqual(dataSource.getAreaFields('data', true).length, 2);
        assert.strictEqual(dataSource.fields().length, 15);

    });

    QUnit.test('Load store', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', allMember: '[All Products]', area: 'column', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar Year]', allMember: '[All Periods]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 },
                { dataField: 'FilterField', area: 'filter', areaIndex: 0 }
            ],
            store: this.testStore

        });
        const loadResult = {
            columns: [{
                value: 'column1'
            }],
            rows: [
                {
                    value: 'rowValue'
                }
            ],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        def.resolve(loadResult);


        // assert
        assert.deepEqual(dataSource.getData(), loadResult);
        assert.ok(this.testStore.load.calledOnce, 'load count');
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [
                {
                    caption: 'Count',
                    dataField: '[Measures].[Customer Count]',
                    area: 'data',
                    areaIndex: 0
                }
            ],
            columns: [
                {
                    allMember: '[All Products]',
                    dataField: '[Product].[Category]',
                    areaIndex: 0,
                    area: 'column',
                    caption: ''
                }
            ],
            rows: [
                {
                    allMember: '[All Periods]',
                    dataField: '[Ship Date].[Calendar Year]',
                    area: 'row',
                    areaIndex: 0,
                    caption: ''
                }
            ],
            filters: [
                { dataField: 'FilterField', area: 'filter', areaIndex: 0, caption: '' }
            ]
        }], 'load args');
    });

    QUnit.test('Handle error on loading', function(assert) {
        const def = $.Deferred();
        const errorHandler = sinon.stub();

        this.testStore.load.returns(def);
        // act
        createDataSource({
            fields: [],
            store: this.testStore,

            onLoadError: errorHandler,

        });

        def.reject({ message: 'my error' });
        // assert

        assert.ok(errorHandler.calledOnce);
        assert.strictEqual(errorHandler.lastCall.args[0].message, 'my error');
    });

    QUnit.test('retrieve Fields', function(assert) {
        const retrieveFieldsDef = $.Deferred();

        this.testStore.getFields.returns(retrieveFieldsDef);
        // act
        const userFields = [
            { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
            { dataField: '[Product].[Subcategory]', area: 'column', areaIndex: 1 },
            { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
            { dataField: '[Measures].[Customer Count]', area: 'data', areaIndex: 0 },
            { dataField: 'date', area: 'row' },
            { dataField: 'date', area: 'column', groupInterval: 'year' },
            { dataField: 'Measure', summaryType: 'sum' },
            { dataField: 'Measure' }
        ];

        const dataSource = createDataSource({
            fields: userFields,
            store: this.testStore,
            retrieveFields: true
        });

        retrieveFieldsDef.resolve([
            { dataField: '[Product].[Category]', allMember: '[All Products]' },
            { dataField: '[Ship Date].[Calendar Year]', allMember: '[All Periods]' },
            { dataField: '[Ship Date].[Calendar Month]', allMember: '[All Periods]' },
            { dataField: '[Measures].[Customer Count]', caption: 'Count' },

            { dataField: 'date', caption: 'date' },
            { dataField: 'date', groupInterval: 'year', caption: 'date.year' },

            { dataField: 'date', groupInterval: 'month', caption: 'date.month' },
            { dataField: 'Measure', summaryType: 'avg' }
        ]);

        // assert
        assert.ok(this.testStore.load.calledOnce, 'load count');
        assert.strictEqual(dataSource.fields().length, 10);

        $.each(dataSource.fields(), function(index, field) {
            assert.strictEqual(field.index, index, 'field index is correct');
        });

        assert.deepEqual(prepareFields(dataSource.fields()), [
            { dataField: '[Product].[Category]', area: 'column', areaIndex: 0, allMember: '[All Products]', caption: '' },
            { dataField: '[Product].[Subcategory]', area: 'column', areaIndex: 1, caption: '' },
            { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0, allMember: '[All Periods]', caption: '' },
            { dataField: '[Measures].[Customer Count]', area: 'data', areaIndex: 0, caption: 'Count' },

            { area: 'row', areaIndex: 1, caption: 'date', dataField: 'date' },
            { area: 'column', areaIndex: 2, caption: 'date.year', dataField: 'date', groupInterval: 'year' },
            { dataField: 'Measure', summaryType: 'sum', caption: ' (Sum)' },
            { dataField: 'Measure', summaryType: 'avg', caption: ' (Avg)' },
            { dataField: '[Ship Date].[Calendar Month]', allMember: '[All Periods]', caption: '' },

            { dataField: 'date', groupInterval: 'month', caption: 'date.month' }
        ]);
    });

    QUnit.test('retrieve Fields. Pass dataType to getFields method', function(assert) {
        this.testStore.getFields.returns($.Deferred());

        const userFields = [
            { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
            { dataField: '[Product].[Subcategory]', area: 'column', areaIndex: 1 },
            { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
            { dataField: '[Measures].[Customer Count]', area: 'data', areaIndex: 0 },
            { dataField: 'date', area: 'row' },
            { dataField: 'date', area: 'column', groupInterval: 'year', dataType: 'date' },
            { dataField: 'Measure', summaryType: 'sum' },
            { dataField: 'Measure', dataType: 'number' }
        ];

        // act
        createDataSource({
            fields: userFields,
            store: this.testStore,
            retrieveFields: true
        });

        // assert
        assert.ok(this.testStore.getFields.calledOnce);
        assert.deepEqual(this.testStore.getFields.lastCall.args, [userFields]);
    });

    QUnit.test('retrieve Fields by default', function(assert) {
        const retrieveFieldsDef = $.Deferred();

        this.testStore.getFields.returns(retrieveFieldsDef);
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Product].[Subcategory]', area: 'column', areaIndex: 1 },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', area: 'data', areaIndex: 0 },
                { dataField: 'date', area: 'row' },
                { dataField: 'date', area: 'column', groupInterval: 'year' },
                { dataField: 'Measure', summaryType: 'sum', caption: '' },
                { dataField: 'Measure' }
            ],
            store: this.testStore
        });

        retrieveFieldsDef.resolve([
            { dataField: '[Product].[Category]', allMember: '[All Products]', caption: '' },
            { dataField: '[Ship Date].[Calendar Year]', allMember: '[All Periods]', caption: '' },
            { dataField: '[Ship Date].[Calendar Month]', allMember: '[All Periods]', caption: '' },
            { dataField: '[Measures].[Customer Count]', caption: 'Count' },

            { dataField: 'date', caption: 'date' },
            { dataField: 'date', groupInterval: 'year', caption: 'date.year' },

            { dataField: 'date', groupInterval: 'month', caption: 'date.month' },
            { dataField: 'Measure', summaryType: 'avg', caption: '' }
        ]);

        // assert
        assert.ok(this.testStore.load.calledOnce, 'load count');
        assert.deepEqual(prepareFields(dataSource.fields()), [
            { dataField: '[Product].[Category]', area: 'column', areaIndex: 0, allMember: '[All Products]', caption: '' },
            { dataField: '[Product].[Subcategory]', area: 'column', areaIndex: 1, caption: '' },
            { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0, allMember: '[All Periods]', caption: '' },
            { dataField: '[Measures].[Customer Count]', area: 'data', areaIndex: 0, caption: 'Count' },

            { area: 'row', areaIndex: 1, caption: 'date', dataField: 'date' },
            { area: 'column', areaIndex: 2, caption: 'date.year', dataField: 'date', groupInterval: 'year' },
            { dataField: 'Measure', summaryType: 'sum', caption: '' },
            { dataField: 'Measure', summaryType: 'avg', caption: '' },
            { dataField: '[Ship Date].[Calendar Month]', allMember: '[All Periods]', caption: '' },

            { dataField: 'date', groupInterval: 'month', caption: 'date.month' }
        ]);
    });

    QUnit.test('Retrieve fields. Create custom Group', function(assert) {
        this.testStore.getFields.returns($.Deferred().resolve([
            { dataField: 'Field1' },
            { dataField: 'Field2' },
            { dataField: 'Field3' }
        ]));
        // act
        const dataSource = createDataSource({
            fields: [
                { groupName: 'Group1' },
                { dataField: 'Field1', groupName: 'Group1', groupIndex: 0 },
                { dataField: 'Field2', groupName: 'Group1', groupIndex: 1 }
            ],
            store: this.testStore,
            retrieveFields: true
        });
        // assert

        assert.strictEqual(dataSource.fields().length, 4);
        assert.deepEqual(prepareFields(dataSource.fields()), [
            {
                groupName: 'Group1', caption: '', levels: [
                    { dataField: 'Field1', groupName: 'Group1', groupIndex: 0, caption: '' },
                    { dataField: 'Field2', groupName: 'Group1', groupIndex: 1, caption: '' }
                ]
            },
            { dataField: 'Field1', groupName: 'Group1', groupIndex: 0, caption: '' },
            { dataField: 'Field2', groupName: 'Group1', groupIndex: 1, caption: '' },
            { dataField: 'Field3', caption: '' }
        ]);
    });

    QUnit.test('Retrieve fields. Create custom Group with dataField', function(assert) {
        this.testStore.getFields.returns($.Deferred().resolve([
            { dataField: 'Field1' },
            { dataField: 'Field2' }
        ]));
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: 'Field1', groupName: 'Group1', dataType: 'date' },
                { groupName: 'Group1', groupIndex: 0, groupInterval: 'interval1' },
                { groupName: 'Group1', groupIndex: 1, groupInterval: 'interval2' },
                { dataField: 'Field3', groupName: 'Group1', groupIndex: 2, dataType: 'number' }
            ],
            store: this.testStore,
            retrieveFields: true
        });
        // assert

        assert.strictEqual(dataSource.fields().length, 5);
        assert.deepEqual(prepareFields(dataSource.fields()), [
            { dataField: 'Field1', groupName: 'Group1', caption: '', dataType: 'date', levels: [
                { dataField: 'Field1', groupName: 'Group1', groupIndex: 0, caption: '', groupInterval: 'interval1', dataType: 'date' },
                { dataField: 'Field1', groupName: 'Group1', groupIndex: 1, caption: '', groupInterval: 'interval2', dataType: 'date' },
                { dataField: 'Field3', caption: '', groupName: 'Group1', groupIndex: 2, dataType: 'number' }
            ]
            },
            { dataField: 'Field1', groupName: 'Group1', groupIndex: 0, caption: '', groupInterval: 'interval1', dataType: 'date' },
            { dataField: 'Field1', groupName: 'Group1', groupIndex: 1, caption: '', groupInterval: 'interval2', dataType: 'date' },
            { dataField: 'Field3', caption: '', groupName: 'Group1', groupIndex: 2, dataType: 'number' },
            { dataField: 'Field2', caption: '' }
        ]);
    });

    QUnit.test('Retrieve fields. Create custom Group. Use one field in some groups', function(assert) {
        this.testStore.getFields.returns($.Deferred().resolve([
            { dataField: 'Field1', dataType: 'number' },
            { dataField: 'Field2' },
            { dataField: 'Field3' }
        ]));
        // act
        const dataSource = createDataSource({
            fields: [
                { groupName: 'Group1' },
                { dataField: 'Field1', groupName: 'Group1', groupIndex: 0 },
                { dataField: 'Field2', groupName: 'Group1', groupIndex: 1 },

                { groupName: 'Group2' },
                { dataField: 'Field3', groupName: 'Group2', groupIndex: 0 },
                { dataField: 'Field1', groupName: 'Group2', groupIndex: 1 }
            ],
            store: this.testStore,
            retrieveFields: true
        });
        // assert

        assert.strictEqual(dataSource.fields().length, 6);
        assert.deepEqual(prepareFields(dataSource.fields()), [
            {
                groupName: 'Group1', caption: '', levels: [
                    { dataField: 'Field1', groupName: 'Group1', groupIndex: 0, caption: '', dataType: 'number' },
                    { dataField: 'Field2', groupName: 'Group1', groupIndex: 1, caption: '' }
                ]
            },
            { dataField: 'Field1', groupName: 'Group1', groupIndex: 0, caption: '', dataType: 'number' },
            { dataField: 'Field2', groupName: 'Group1', groupIndex: 1, caption: '' },

            { groupName: 'Group2', caption: '', levels: [
                { dataField: 'Field3', groupName: 'Group2', groupIndex: 0, caption: '' },
                { dataField: 'Field1', groupName: 'Group2', groupIndex: 1, caption: '', dataType: 'number' }
            ]
            },
            { dataField: 'Field3', groupName: 'Group2', groupIndex: 0, caption: '' },
            { dataField: 'Field1', groupName: 'Group2', groupIndex: 1, caption: '', dataType: 'number' }
        ]);
    });

    QUnit.test('Retrieve fields. Create custom Group. Get field from other store group', function(assert) {
        this.testStore.getFields.returns($.Deferred().resolve([
            { dataField: 'StoreGroup', groupName: 'StoreGroup' },
            { dataField: 'Field1', groupName: 'StoreGroup', groupIndex: 0 },
            { dataField: 'Field2', groupName: 'StoreGroup', groupIndex: 1 },
            { dataField: 'Field3', groupName: 'StoreGroup', groupIndex: 2 }
        ]));
        // act
        const dataSource = createDataSource({
            fields: [
                { groupName: 'UserGroup' },
                { dataField: 'Field2', groupName: 'UserGroup', groupIndex: 0 },
                { dataField: 'Field3', groupName: 'UserGroup', groupIndex: 1 }
            ],
            store: this.testStore,
            retrieveFields: true
        });
        // assert

        assert.strictEqual(dataSource.fields().length, 5);
        assert.deepEqual(prepareFields(dataSource.fields()), [
            {
                groupName: 'UserGroup', caption: '', levels: [
                    { dataField: 'Field2', groupName: 'UserGroup', groupIndex: 0, caption: '' },
                    { dataField: 'Field3', groupName: 'UserGroup', groupIndex: 1, caption: '' }
                ]
            },
            { dataField: 'Field2', groupName: 'UserGroup', groupIndex: 0, caption: '' },
            { dataField: 'Field3', groupName: 'UserGroup', groupIndex: 1, caption: '' },

            {
                dataField: 'StoreGroup', groupName: 'StoreGroup', caption: '', levels: [
                    { dataField: 'Field1', groupName: 'StoreGroup', groupIndex: 0, caption: '' }
                ]
            },
            { dataField: 'Field1', groupName: 'StoreGroup', groupIndex: 0, caption: '' }
        ]);
    });

    QUnit.test('Retrieve fields. Customize store group', function(assert) {
        this.testStore.getFields.returns($.Deferred().resolve([
            { dataField: 'StoreGroup', groupName: 'StoreGroup' },
            { dataField: 'Field1', groupName: 'StoreGroup', groupIndex: 0 },
            { dataField: 'Field2', groupName: 'StoreGroup', groupIndex: 1 },
            { dataField: 'Field3', groupName: 'StoreGroup', groupIndex: 2 }
        ]));
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: 'StoreGroup', groupName: 'StoreGroup', userProperty: 'value' },
                { dataField: 'Field2', groupName: 'StoreGroup', groupIndex: 0 },
                { dataField: 'Field3', groupName: 'StoreGroup', groupIndex: 1 },
                { dataField: 'Field1', groupName: 'StoreGroup', groupIndex: 2, visible: false }
            ],
            store: this.testStore,
            retrieveFields: true
        });
        // assert

        assert.strictEqual(dataSource.fields().length, 4);
        assert.deepEqual(prepareFields(dataSource.fields()), [
            {
                dataField: 'StoreGroup', groupName: 'StoreGroup', userProperty: 'value', caption: '', levels: [
                    { dataField: 'Field2', groupName: 'StoreGroup', caption: '', groupIndex: 0 },
                    { dataField: 'Field3', groupName: 'StoreGroup', caption: '', groupIndex: 1 }
                ]
            },
            { dataField: 'Field2', groupName: 'StoreGroup', caption: '', groupIndex: 0 },
            { dataField: 'Field3', groupName: 'StoreGroup', caption: '', groupIndex: 1 },
            { dataField: 'Field1', groupName: 'StoreGroup', caption: '', groupIndex: 2, visible: false }
        ]);
    });

    QUnit.test('Retrieve fields. Add field without group when group exists', function(assert) {
        this.testStore.getFields.returns($.Deferred().resolve([
            { dataField: 'OrderDate', groupName: 'OrderDate' },
            { dataField: 'OrderDate', groupName: 'OrderDate', groupInterval: 'year', groupIndex: 0 }
        ]));
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: 'OrderDate', dataType: 'date' },
                { dataField: 'OrderDate', groupInterval: 'year' },
                { dataField: 'OrderDate', groupInterval: 'month' }
            ],
            store: this.testStore,
            retrieveFields: true
        });
        // assert
        assert.strictEqual(dataSource.fields().length, 4);
        const fields = prepareFields(dataSource.fields());

        assert.deepEqual(fields[0], {
            dataField: 'OrderDate', groupName: 'OrderDate', dataType: 'date', caption: '',
            levels: [
                { dataField: 'OrderDate', groupName: 'OrderDate', groupInterval: 'year', groupIndex: 0, caption: '', dataType: 'date' }
            ]
        });

        assert.deepEqual(fields[1], { dataField: 'OrderDate', groupInterval: 'year', caption: '', dataType: 'date' });

        assert.deepEqual(fields[2], { dataField: 'OrderDate', groupInterval: 'month', caption: '', dataType: 'date' });

        assert.deepEqual(fields[3], { dataField: 'OrderDate', groupName: 'OrderDate', groupInterval: 'year', groupIndex: 0, caption: '', dataType: 'date' });
    });

    QUnit.test('Retrieve fields. Hide store default group', function(assert) {
        this.testStore.getFields.returns($.Deferred().resolve([
            { dataField: 'OrderDate', groupName: 'OrderDate' },
            { dataField: 'OrderDate', groupName: 'OrderDate', groupInterval: 'year', groupIndex: 0 },

            { dataField: 'ShipDate', groupName: 'ShipDate' },
            { dataField: 'ShipDate', groupName: 'ShipDate', groupInterval: 'month', groupIndex: 0 }
        ]));
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: 'OrderDate', visible: false },
                { dataField: 'OrderDate', groupInterval: 'month' },

                { groupName: 'ShipDate', visible: false }
            ],
            store: this.testStore,
            retrieveFields: true
        });
        // assert

        assert.strictEqual(dataSource.fields().length, 5);
        const fields = prepareFields(dataSource.fields());
        assert.deepEqual(fields[0], {
            dataField: 'OrderDate', groupName: 'OrderDate', caption: '', visible: false,
            levels: [
                { dataField: 'OrderDate', groupName: 'OrderDate', groupInterval: 'year', groupIndex: 0, caption: '', visible: false }
            ]
        });

        assert.deepEqual(fields[1], { dataField: 'OrderDate', groupInterval: 'month', caption: '' });

        assert.deepEqual(fields[2], {
            dataField: 'ShipDate', groupName: 'ShipDate', caption: '', visible: false,
            levels: [
                { dataField: 'ShipDate', groupName: 'ShipDate', groupInterval: 'month', groupIndex: 0, visible: false, caption: '' }
            ]
        });
        assert.deepEqual(fields[3], { dataField: 'OrderDate', groupName: 'OrderDate', groupInterval: 'year', groupIndex: 0, caption: '', visible: false });

        assert.deepEqual(fields[4], { dataField: 'ShipDate', groupName: 'ShipDate', groupInterval: 'month', groupIndex: 0, visible: false, caption: '' });
    });

    QUnit.test('Retrieve fields is false - merge fields but no add fields from store', function(assert) {
        this.testStore.load.returns($.Deferred().resolve(this.storeData));
        this.testStore.getFields.returns($.Deferred().resolve([
            { dataField: '[Product].[Category]', allMember: '[All Products]' },
            { dataField: '[Product].[Subcategory]' },

            { dataField: '[Ship Date].[Calendar Year]', allMember: '[All Periods]' },
            { dataField: '[Ship Date].[Calendar Month]', allMember: '[All Periods]' },
            { dataField: '[Measures].[Customer Count]', caption: 'Count' },
            { dataField: 'date', caption: 'date' },
            { dataField: 'date', groupInterval: 'year', caption: 'date.year' },

            { dataField: 'date', groupInterval: 'month', caption: 'date.month' }
        ]));
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },

                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', area: 'data', areaIndex: 0 },

                { dataField: 'date', area: 'row' },
                { dataField: 'date', area: 'column', groupInterval: 'year' }
            ],
            store: this.testStore,
            retrieveFields: false
        });

        // assert
        assert.ok(this.testStore.load.calledOnce, 'load count');
        assert.deepEqual(prepareFields(dataSource.fields()), [
            { dataField: '[Product].[Category]', area: 'column', areaIndex: 0, allMember: '[All Products]', caption: '' },

            { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0, allMember: '[All Periods]', caption: '' },
            { dataField: '[Measures].[Customer Count]', area: 'data', areaIndex: 0, caption: 'Count' },

            { dataField: 'date', area: 'row', areaIndex: 1, caption: 'date' },
            { dataField: 'date', area: 'column', groupInterval: 'year', caption: 'date.year', areaIndex: 1 }
        ], 'dataSource Fields');
    });

    QUnit.test('T447446. Date field without group interval. Retrieve fields is disabled', function(assert) {
        this.testStore.getFields.returns($.Deferred().resolve([
            { dataField: 'OrderDate', dataType: 'date', groupName: 'OrderDate' },
            { dataField: 'OrderDate', dataType: 'date', groupName: 'OrderDate', groupInterval: 'year', groupIndex: 0 },
        ]));
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: 'OrderDate', dataType: 'date' }
            ],
            store: this.testStore,
            retrieveFields: false
        });

        // assert
        const fields = prepareFields(dataSource.fields());
        assert.strictEqual(fields.length, 1, 'fields count');
        assert.deepEqual(fields[0], {
            caption: '',
            dataField: 'OrderDate',
            dataType: 'date'
        }, 'field');

    });

    QUnit.test('retrieve Fields. Fail on load store fields', function(assert) {
        const def = $.Deferred();
        const retrieveFieldsDef = $.Deferred();

        this.testStore.load.returns(def);
        this.testStore.getFields.returns(retrieveFieldsDef);
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Product].[Subcategory]', area: 'column', areaIndex: 1 },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', area: 'data', areaIndex: 0 },
                { dataField: 'date', area: 'row' },
                { dataField: 'date', area: 'column', groupInterval: 'year' }
            ],
            store: this.testStore,
            retrieveFields: true
        });
        const loadResult = {
            columns: [],
            rows: [],
            values: []
        };

        def.resolve(loadResult);
        retrieveFieldsDef.reject();

        // assert
        assert.deepEqual(dataSource.getData(), loadResult);
        assert.equal(this.testStore.load.callCount, 0, 'load count');
    });

    QUnit.test('Retrieve Fields. Create data field with summaryType', function(assert) {
        const retrieveFieldsDef = $.Deferred().resolve([
            {
                dataField: 'Date',
                dataType: 'date',
                groupInterval: undefined,
                groupName: 'Date'
            },
            {
                dataField: 'Date',
                dataType: 'date',
                groupInterval: 'year',
                groupName: 'Date',
                groupIndex: 0
            },
            {
                dataField: 'Date',
                dataType: 'date',
                groupInterval: 'month',
                groupName: 'Date',
                groupIndex: 1
            }
        ]);

        this.testStore.getFields.returns(retrieveFieldsDef);
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: 'Date', area: 'data', summaryType: 'min' },
                { dataField: 'Date', area: 'column' }
            ],
            store: this.testStore
        });

        // assert
        assert.ok(this.testStore.load.calledOnce, 'load count');

        assert.deepEqual(prepareFields(this.testStore.load.lastCall.args[0].columns), [
            {

                area: 'column',
                areaIndex: 0,
                caption: '',
                dataField: 'Date',
                dataType: 'date',
                groupInterval: 'year',
                groupName: 'Date',
                groupIndex: 0
            },
            {
                area: 'column',
                dataField: 'Date',
                dataType: 'date',
                areaIndex: 0,
                caption: '',
                groupInterval: 'month',
                groupName: 'Date',
                groupIndex: 1
            }
        ], 'column fields');
        assert.deepEqual(prepareFields(this.testStore.load.lastCall.args[0].rows), [], 'row fields');
        assert.deepEqual(prepareFields(this.testStore.load.lastCall.args[0].values), [
            {
                'area': 'data',
                'areaIndex': 0,
                'caption': ' (Min)',
                'dataField': 'Date',
                'dataType': 'date',
                'groupName': 'Date',
                'levels': [
                    {
                        'area': 'column',
                        'areaIndex': 0,
                        'caption': '',
                        'dataField': 'Date',
                        'dataType': 'date',
                        'groupIndex': 0,
                        'groupInterval': 'year',
                        'groupName': 'Date'
                    },
                    {
                        'area': 'column',
                        'areaIndex': 0,
                        'caption': '',
                        'dataField': 'Date',
                        'dataType': 'date',
                        'groupIndex': 1,
                        'groupInterval': 'month',
                        'groupName': 'Date'
                    }
                ],
                'summaryType': 'min'
            }
        ], 'value fields');

        assert.deepEqual(prepareFields(dataSource.fields()), [
            {
                'area': 'data',
                'areaIndex': 0,
                'caption': ' (Min)',
                'dataField': 'Date',
                'dataType': 'date',
                'groupName': 'Date',
                'levels': [
                    {
                        'area': 'column',
                        'areaIndex': 0,
                        'caption': '',
                        'dataField': 'Date',
                        'dataType': 'date',
                        'groupIndex': 0,
                        'groupInterval': 'year',
                        'groupName': 'Date'
                    },
                    {
                        'area': 'column',
                        'areaIndex': 0,
                        'caption': '',
                        'dataField': 'Date',
                        'dataType': 'date',
                        'groupIndex': 1,
                        'groupInterval': 'month',
                        'groupName': 'Date'
                    }
                ],
                'summaryType': 'min'
            },
            {
                'area': 'column',
                'areaIndex': 0,
                'caption': '',
                'dataField': 'Date',
                'dataType': 'date',
                'groupName': 'Date',
                'levels': [
                    {
                        'area': 'column',
                        'areaIndex': 0,
                        'caption': '',
                        'dataField': 'Date',
                        'dataType': 'date',
                        'groupIndex': 0,
                        'groupInterval': 'year',
                        'groupName': 'Date'
                    },
                    {
                        'area': 'column',
                        'areaIndex': 0,
                        'caption': '',
                        'dataField': 'Date',
                        'dataType': 'date',
                        'groupIndex': 1,
                        'groupInterval': 'month',
                        'groupName': 'Date'
                    }
                ]
            },
            {
                'area': 'column',
                'areaIndex': 0,
                'caption': '',
                'dataField': 'Date',
                'dataType': 'date',
                'groupIndex': 0,
                'groupInterval': 'year',
                'groupName': 'Date'
            },
            {
                'area': 'column',
                'areaIndex': 0,
                'caption': '',
                'dataField': 'Date',
                'dataType': 'date',
                'groupIndex': 1,
                'groupInterval': 'month',
                'groupName': 'Date'
            }
        ]);
    });

    QUnit.test('Fields order', function(assert) {
        const def = $.Deferred();
        this.testStore.load.returns(def);
        // act
        const dataSource = createDataSource({
            fields: [
                { dataField: 'ColumnField2', area: 'column', areaIndex: 2 },
                { dataField: 'RowField1', area: 'row', areaIndex: 1 },
                { dataField: 'ColumnField0', area: 'column', areaIndex: 0 },
                { dataField: 'RowField0', area: 'row', areaIndex: 0 },
                { dataField: 'CellField1', area: 'data', areaIndex: -1 },
                { dataField: 'ColumnField01', area: 'column', areaIndex: 0 },
                { dataField: 'UnknownArea', area: 'page', areaIndex: 0 },
                { dataField: 'CellUndefinedIndex', area: 'data' },
                { dataField: 'FilterField2', area: 'filter', areaIndex: 4 },
                { dataField: 'FilterField1', area: 'filter', areaIndex: 0 }
            ],
            store: this.testStore
        });
        const loadResult = {
            columns: [{
                value: 'column1'
            }],
            rows: [
                {
                    value: 'rowValue'
                }
            ],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        def.resolve(loadResult);
        // assert
        assert.deepEqual(dataSource.getData(), loadResult);
        assert.ok(this.testStore.load.calledOnce, 'load count');
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [
                { dataField: 'CellField1', area: 'data', areaIndex: 0, caption: '' },
                { dataField: 'CellUndefinedIndex', area: 'data', areaIndex: 1, caption: '' }
            ],
            columns: [
                { dataField: 'ColumnField0', area: 'column', areaIndex: 0, caption: '' },
                { dataField: 'ColumnField01', area: 'column', areaIndex: 1, caption: '' },
                { dataField: 'ColumnField2', area: 'column', areaIndex: 2, caption: '' }
            ],
            rows: [
                { dataField: 'RowField0', area: 'row', areaIndex: 0, caption: '' },
                { dataField: 'RowField1', area: 'row', areaIndex: 1, caption: '' }
            ],
            filters: [
                { dataField: 'FilterField1', area: 'filter', areaIndex: 0, caption: '' },
                { dataField: 'FilterField2', area: 'filter', areaIndex: 1, caption: '' }
            ]
        }], 'load args');
    });

    QUnit.test('Expand columns && rows', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const descriptions = {
            columns: [{ dataField: 'Category', area: 'column', areaIndex: 0 }, { dataField: 'SubCategory', expanded: true, area: 'column', areaIndex: 1 }, { dataField: 'Color', area: 'column', areaIndex: 2 }],
            rows: [{ dataField: 'Year', area: 'row', areaIndex: 0 }, { dataField: 'Month', area: 'row', areaIndex: 1 }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }]
        };
        const dataSource = createDataSource({
            fields: descriptions.rows.concat(descriptions.values.concat(descriptions.columns)),
            store: this.testStore
        });

        def.resolve({
            columns: [{
                value: 'Cat1',
                index: 1,
                children: [
                    {
                        value: 'subCat1',
                        index: 2,
                        children: [
                            {
                                value: 'Red',
                                index: 3
                            }
                        ]
                    },
                    {
                        value: 'subCat2',
                        index: 4,
                        children: [
                            {
                                value: 'Black',
                                index: 5
                            }
                        ]

                    }
                ]
            }, {
                value: 'Cat2',
                index: 6
            }],
            rows: [{
                value: '2005',
                index: 1
            }, {
                value: '2006',
                index: 2
            }],
            values: [[[1], [2], [3], [4], [5]],
                [[6], [7], [8], [9], [10]],
                [[11], [12], [13], [14], [15]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        });

        this.testStore.load.returns($.Deferred().resolve({
            columns: [{
                value: 'Cat1',
                index: 1,
                children: [
                    {
                        value: 'subCat1',
                        index: 2
                    },
                    {
                        value: 'subCat2',
                        index: 3
                    }
                ]
            }, {
                value: 'Cat2',
                index: 4
            }],
            rows: [{
                value: 'January',
                index: 1
            }, {
                value: 'February',
                index: 2
            }],
            values: [[[16], [17], [18], [19], [20]],
                [[21], [22], [23], [24], [25]],
                [[26], [27], [28], [29], [30]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        }));
        // act
        dataSource.expandHeaderItem('row', ['2006']);
        // assert
        assert.equal(this.testStore.load.callCount, 2);

        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            expanded: true,
            area: 'row',
            headerName: 'rows',
            needExpandData: true,
            columnExpandedPaths: [['Cat1']],
            rowExpandedPaths: [],
            path: [
                '2006'
            ],
            values: descriptions.values,
            columns: descriptions.columns,
            rows: descriptions.rows,
            filters: []
        }]);
    });

    QUnit.test('Expand rows && columns', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const descriptions = {
            columns: [{ dataField: 'Category', area: 'column', areaIndex: 0 }, { dataField: 'SubCategory', area: 'column', areaIndex: 1 }],
            rows: [{ dataField: 'Year', area: 'row', areaIndex: 0 }, { dataField: 'Month', area: 'row', areaIndex: 1 }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }]
        };
        const dataSource = createDataSource({
            fields: descriptions.rows.concat(descriptions.values.concat(descriptions.columns)),
            store: this.testStore
        });

        def.resolve({
            rows: [{
                value: 'Cat1',
                index: 1,
                children: [
                    {
                        value: 'subCat1',
                        index: 2
                    },
                    {
                        value: 'subCat2',
                        index: 3
                    }
                ]
            }, {
                value: 'Cat2',
                index: 4
            }],
            columns: [{
                value: '2005',
                index: 1
            }, {
                value: '2006',
                index: 2
            }],
            values: [[[1], [2], [3], [4], [5]],
                [[6], [7], [8], [9], [10]],
                [[11], [12], [13], [14], [15]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        });

        this.testStore.load.returns($.Deferred().resolve({
            rows: [{
                value: 'Cat1',
                index: 1,
                children: [
                    {
                        value: 'subCat1',
                        index: 2
                    },
                    {
                        value: 'subCat2',
                        index: 3

                    }
                ]
            }, {
                value: 'Cat2',
                index: 4
            }],
            columns: [{
                value: 'January',
                index: 1
            }, {
                value: 'February',
                index: 2
            }],
            values: [[[16], [17], [18], [19], [20]],
                [[21], [22], [23], [24], [25]],
                [[26], [27], [28], [29], [30]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        }));
        // act
        dataSource.expandHeaderItem('column', ['2006']);
        // assert
        assert.equal(this.testStore.load.callCount, 2);

        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            expanded: true,
            area: 'column',
            headerName: 'columns',
            needExpandData: true,
            rowExpandedPaths: [['Cat1']],
            columnExpandedPaths: [],
            path: [
                '2006'
            ],
            values: descriptions.values,
            columns: descriptions.columns,
            rows: descriptions.rows,
            filters: []
        }]);
    });

    QUnit.test('Deep expand rows && columns', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const descriptions = {
            columns: [{ dataField: 'Category', area: 'column', areaIndex: 0 }, { dataField: 'SubCategory', area: 'column', areaIndex: 1 }],
            rows: [{ dataField: 'Year', area: 'row', areaIndex: 0 }, { dataField: 'Month', area: 'row', areaIndex: 1 }, { dataField: 'Day', area: 'row', areaIndex: 1 }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }]
        };
        const dataSource = createDataSource({
            fields: descriptions.rows.concat(descriptions.values.concat(descriptions.columns)),
            store: this.testStore
        });
        const data = {
            columns: [{
                value: 'Cat1',
                index: 1
            }, {
                value: 'Cat2',
                index: 2
            }],
            rows: [{
                value: '2005',
                index: 1,
                children: [{
                    value: 'January',
                    index: 2,
                    children: [
                        {
                            value: '1',
                            index: 3
                        },
                        {
                            value: '2',
                            index: 4
                        }]
                }]
            }, {
                value: '2006',
                index: 5
            }, {
                value: '2007',
                index: 5,
                children: [
                    {
                        value: 'January',
                        index: 6
                    }
                ]
            }],
            values: [[[1], [2], [3], [4], [5]],
                [[6], [7], [8], [9], [10]],
                [[11], [12], [13], [14], [15]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        def.resolve($.extend(true, {}, data));

        this.testStore.load.returns($.Deferred().resolve({ value: 'new Item', index: 14 }));

        // act
        dataSource.expandHeaderItem('column', ['Cat1']);
        // assert
        assert.equal(this.testStore.load.callCount, 2);

        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            expanded: true,
            area: 'column',
            headerName: 'columns',
            needExpandData: true,
            rowExpandedPaths: [['2005'], ['2005', 'January'], ['2007']],
            columnExpandedPaths: [],
            path: [
                'Cat1'
            ],
            values: descriptions.values,
            columns: descriptions.columns,
            rows: descriptions.rows,
            filters: []
        }]);
    });

    QUnit.test('Change field by index', function(assert) {
        this.testStore.load.returns($.Deferred().reject());

        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', allMember: '[All Products]', area: 'column', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar Year]', allMember: '[All Periods]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }
            ],
            store: this.testStore
        });

        // act
        dataSource.field(0, { area: 'row', areaIndex: 1 });
        dataSource.load();

        // assert
        prepareFields(dataSource.fields());
        assert.ok(this.testStore.load.calledTwice, 'load count');
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [
                {
                    caption: 'Count',
                    dataField: '[Measures].[Customer Count]',
                    area: 'data',
                    areaIndex: 0
                }
            ],
            columns: [

            ],
            rows: [
                {
                    allMember: '[All Periods]',
                    dataField: '[Ship Date].[Calendar Year]',
                    area: 'row',
                    areaIndex: 0,
                    caption: ''
                },
                {
                    allMember: '[All Products]',
                    dataField: '[Product].[Category]',
                    areaIndex: 1,
                    area: 'row',
                    caption: ''
                }
            ],
            filters: []
        }], 'load args');
    });

    QUnit.test('Change field by dataField', function(assert) {
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }
            ],
            store: this.testStore
        });

        // act
        dataSource.field('[Product].[Category]', { area: 'row', areaIndex: 1 });

        // assert
        assert.deepEqual(prepareFields(dataSource.fields())[0], {
            caption: '',
            dataField: '[Product].[Category]',
            area: 'row',
            areaIndex: 1
        });
    });

    QUnit.test('fieldChanged event', function(assert) {
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }
            ],
            store: this.testStore
        });

        const fieldChangedStub = sinon.stub();

        dataSource.on('fieldChanged', fieldChangedStub);

        // act
        dataSource.field('[Product].[Category]', { area: 'row', areaIndex: 1 });

        // assert
        assert.strictEqual(fieldChangedStub.callCount, 1, 'fieldChanged is called once');
        assert.strictEqual(fieldChangedStub.lastCall.args[0], dataSource.field('[Product].[Category]'), 'fieldChanged args');
    });

    QUnit.test('Change field by caption', function(assert) {
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 },
                { dataField: '[Measures].[Internet Sales Amount]', caption: 'Count', area: 'data', areaIndex: 1 }
            ],
            store: this.testStore
        });

        // act
        dataSource.field('Count', { area: 'data', areaIndex: 2 });

        // assert
        assert.deepEqual(prepareFields(dataSource.fields())[2], {
            caption: 'Count',
            dataField: '[Measures].[Customer Count]',
            area: 'data',
            areaIndex: 1
        });
    });

    QUnit.test('Change field non exist field', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', allMember: '[All Products]', area: 'column', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar Year]', allMember: '[All Periods]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }
            ],
            store: this.testStore
        });
        const loadResult = {
            columns: [{
                value: 'column1'
            }],
            rows: [
                {
                    value: 'rowValue'
                }
            ],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        def.resolve(loadResult);

        // act
        dataSource.field(10, { area: 'row', areaIndex: 1 });
        dataSource.load();

        // assert
        assert.deepEqual(dataSource.getData(), loadResult);
        assert.ok(this.testStore.load.calledTwice, 'load twice');
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [
                {
                    caption: 'Count',
                    dataField: '[Measures].[Customer Count]',
                    area: 'data',
                    areaIndex: 0
                }
            ],
            columns: [{
                allMember: '[All Products]',
                dataField: '[Product].[Category]',
                areaIndex: 0,
                area: 'column',
                caption: ''
            }],
            rows: [
                {
                    allMember: '[All Periods]',
                    dataField: '[Ship Date].[Calendar Year]',
                    area: 'row',
                    areaIndex: 0,
                    caption: ''
                }
            ],
            filters: []
        }], 'load args');
    });

    QUnit.test('Change field after expand', function(assert) {
        this.testStore.load.returns($.Deferred().resolve({
            rows: [{
                value: 'Cat1',
                index: 1,
                children: [
                    {
                        value: 'subCat1',
                        index: 2
                    },
                    {
                        value: 'subCat2',
                        index: 3
                    }
                ]
            }, {
                value: 'Cat2',
                index: 4
            }],
            columns: [{
                value: '2005',
                index: 1
            }, {
                value: '2006',
                index: 2
            }],
            values: [[[1], [2], [3], [4], [5]],
                [[6], [7], [8], [9], [10]],
                [[11], [12], [13], [14], [15]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        }));

        const dataSource = createDataSource({
            fields: [
                { dataField: 'Year', area: 'row', areaIndex: 0 },
                { dataField: 'Month', area: 'row', areaIndex: 1 },

                { dataField: 'Category', area: 'column', areaIndex: 0 },
                { dataField: 'SubCategory', area: 'column', areaIndex: 1 },

                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }
            ],

            store: this.testStore
        });


        this.testStore.load.returns($.Deferred().resolve({
            rows: [{
                value: 'Cat1',
                index: 1,
                children: [
                    {
                        value: 'subCat1',
                        index: 2
                    },
                    {
                        value: 'subCat2',
                        index: 3

                    }
                ]
            }, {
                value: 'Cat2',
                index: 4
            }],
            columns: [{
                value: 'January',
                index: 1
            }, {
                value: 'February',
                index: 2
            }],
            values: [[[16], [17], [18], [19], [20]],
                [[21], [22], [23], [24], [25]],
                [[26], [27], [28], [29], [30]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        }));

        dataSource.expandHeaderItem('column', ['2006']);
        // act
        dataSource.field(0, { area: 'row', areaIndex: 1 });
        dataSource.load();

        // assert
        assert.equal(this.testStore.load.callCount, 3);
        prepareFields(dataSource.fields());
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            values: [
                {
                    area: 'data',
                    areaIndex: 0,
                    caption: 'Count',
                    dataField: '[Measures].[Customer Count]'
                }
            ],
            columns: [
                {
                    area: 'column',
                    areaIndex: 0,
                    dataField: 'Category',
                    caption: ''
                },
                {
                    area: 'column',
                    areaIndex: 1,
                    dataField: 'SubCategory',
                    caption: ''
                }
            ],
            columnExpandedPaths: [['2006']],
            rowExpandedPaths: [['Cat1']],
            rows: [
                {
                    area: 'row',
                    areaIndex: 0,
                    dataField: 'Year',
                    caption: ''
                },
                {
                    area: 'row',
                    areaIndex: 1,
                    dataField: 'Month',
                    caption: ''
                }
            ],
            filters: []
        }], 'load args');
    });

    // T1169225
    QUnit.test('Changed field should not contain circular \'_initProperties\' property', function(assert) {
        // arrange
        this.testStore.load.returns($.Deferred().reject());

        const dataSource = createDataSource({
            fields: [
                { dataField: 'field1', area: 'row', areaIndex: 0, visible: false },
            ],
            store: this.testStore
        });

        // act
        let field = dataSource.field(0);

        field.visible = true;

        dataSource.field(0, field);

        // assert
        field = dataSource.field(0);

        const hasCircularInitProperties = Object.prototype.hasOwnProperty.call(field._initProperties, '_initProperties');

        assert.ok(!hasCircularInitProperties, 'field contains circular _initProperties');
    });

    QUnit.test('Reset calculated field\'s properties on changed', function(assert) {
        this.testStore.load.returns($.Deferred().reject());

        const dataSource = createDataSource({
            fields: [{ dataField: 'Field1', selector: 'selector', format: 'date', customizeText: 'customizeText', notCalculatedProperty: 'value' }],
            store: this.testStore
        });
        const field = dataSource.field(0);

        setFieldProperty(field, 'format', 'percent');
        setFieldProperty(field, 'customizeText', function() { });
        setFieldProperty(field, 'selector', function() { });
        setFieldProperty(field, 'notCalculatedProperty', 'new Value');

        setFieldProperty(field, 'allowSorting', true);
        setFieldProperty(field, 'allowFiltering', true);
        setFieldProperty(field, 'allowExpandAll', true);
        setFieldProperty(field, 'allowSortingBySummary', true);
        // act

        dataSource.field(0, { prop: 'myProp' });

        // assert
        prepareFields(dataSource.fields());

        assert.deepEqual(field, {
            allowExpandAll: true,
            allowFiltering: true,
            allowSorting: true,
            allowSortingBySummary: true,
            caption: '',
            customizeText: 'customizeText',
            dataField: 'Field1',
            format: 'date',
            notCalculatedProperty: 'new Value',
            prop: 'myProp',
            selector: 'selector'
        });

    });

    QUnit.test('Reset calculated field\'s properties on fields changed', function(assert) {
        this.testStore.load.returns($.Deferred().reject());

        const dataSource = createDataSource({
            fields: [{ dataField: 'Field1', selector: 'selector', format: 'date', customizeText: 'customizeText', notCalculatedProperty: 'value' }],
            store: this.testStore
        });
        const field = dataSource.field(0);

        setFieldProperty(field, 'format', 'percent');
        setFieldProperty(field, 'customizeText', function() { });
        setFieldProperty(field, 'selector', function() { });
        setFieldProperty(field, 'notCalculatedProperty', 'new Value');

        setFieldProperty(field, 'allowSorting', true);
        setFieldProperty(field, 'allowFiltering', true);
        setFieldProperty(field, 'allowExpandAll', true);
        setFieldProperty(field, 'allowSortingBySummary', true);
        // act

        dataSource.fields(dataSource.fields());

        // assert
        prepareFields(dataSource.fields());

        assert.deepEqual(field, {
            allowExpandAll: undefined,
            allowFiltering: undefined,
            allowSorting: undefined,
            allowSortingBySummary: undefined,
            caption: '',
            customizeText: 'customizeText',
            dataField: 'Field1',
            format: 'date',
            notCalculatedProperty: 'new Value',
            selector: 'selector'
        });
    });

    QUnit.test('Remove fields when expanded items exist', function(assert) {
        this.testStore.load.returns($.Deferred().resolve({
            columns: [{
                value: 'Cat1',
                index: 1,
                children: [
                    {
                        value: 'subCat1'
                    },
                    {
                        value: 'subCat2'

                    }
                ]
            }, {
                value: 'Cat2'
            }],
            rows: [
                {
                    index: 0,
                    value: '2003',
                    children: [{
                        value: 'January'
                    }, {
                        value: 'February'
                    }]
                }],
            values: [[[16], [17], [18], [19], [20]],
                [[21], [22], [23], [24], [25]],
                [[26], [27], [28], [29], [30]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        }));

        const dataSource = createDataSource({
            fields: [
                { dataField: 'Category', area: 'column', areaIndex: 0 },
                { dataField: 'SubCategory', area: 'column', areaIndex: 1 },

                { dataField: 'Year', area: 'row', areaIndex: 0 },
                { dataField: 'Month', area: 'row', areaIndex: 1 },

                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }
            ],
            store: this.testStore
        });
        this.testStore.load.returns($.Deferred().reject());
        // act
        const changedFields = [
            dataSource.field(0, { area: undefined, areaIndex: 1 }),
            dataSource.field(1, { area: undefined, areaIndex: 1 })
        ];
        dataSource.load();

        // assert
        prepareFields(dataSource.fields());
        assert.deepEqual(this.testStore.load.lastCall.args[0].rowExpandedPaths, [['2003']], 'Expanded rows paths');
        assert.deepEqual(this.testStore.load.lastCall.args[0].columnExpandedPaths, [], 'Expanded columns paths');
        assert.deepEqual(changedFields, [{
            area: undefined,
            areaIndex: 1,
            dataField: 'Category',
            caption: ''
        }, {
            area: undefined,
            areaIndex: 1,
            dataField: 'SubCategory',
            caption: ''
        }
        ], 'changed Fields');
    });

    QUnit.test('Remove field when expanded items exist', function(assert) {
        this.testStore.load.returns($.Deferred().resolve({
            columns: [{
                value: 'Cat1',
                index: 1,
                children: [
                    {
                        value: 'subCat1',
                        index: 2,
                        children: [{
                            index: 8,
                            value: 'Green'
                        }]
                    }, {
                        value: 'subCat2',
                        index: 3
                    }]
            }, {
                value: 'Cat2',
                index: 4
            }],
            rows: [{
                index: 0,
                value: '2003',
                children: [{
                    value: 'January',
                    index: 1
                }, {
                    value: 'February',
                    index: 2
                }]
            }],
            values: [[[16], [17], [18], [19], [20]],
                [[21], [22], [23], [24], [25]],
                [[26], [27], [28], [29], [30]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        }));

        const dataSource = createDataSource({
            fields: [
                { dataField: 'Category', area: 'column', areaIndex: 0 },
                { dataField: 'SubCategory', area: 'column', areaIndex: 1 },
                { dataField: 'Color', area: 'column', areaIndex: 2 },

                { dataField: 'Year', area: 'row', areaIndex: 0 },
                { dataField: 'Month', area: 'row', areaIndex: 1 },

                { dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }
            ],
            store: this.testStore
        });
        this.testStore.load.returns($.Deferred().reject());
        // act
        const changedFields = [
            dataSource.field(1, { area: undefined, areaIndex: 1 })
        ];
        dataSource.load();

        // assert
        prepareFields(dataSource.fields());
        assert.deepEqual(this.testStore.load.lastCall.args[0].rowExpandedPaths, [['2003']], 'Expanded rows paths');
        assert.deepEqual(this.testStore.load.lastCall.args[0].columnExpandedPaths, [['Cat1']], 'Expanded columns paths');
        assert.deepEqual(changedFields, [{
            area: undefined,
            areaIndex: 1,
            dataField: 'SubCategory',
            caption: '',
        }], 'changed Fields');
    });

    // T496854
    QUnit.test('Reorder field when expanded items exist', function(assert) {
        this.testStore.load.returns($.Deferred().resolve({
            columns: [],
            rows: [{
                index: 1,
                value: 1,
                children: [{
                    value: 2,
                    index: 2,
                    children: [{
                        value: 3,
                        index: 3
                    }]
                }]
            }],
            values: [],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        }));

        const dataSource = createDataSource({
            fields: [
                { dataField: 'Field1', area: 'row', areaIndex: 0 },
                { dataField: 'Field2', area: 'row', areaIndex: 1 },
                { dataField: 'Field3', area: 'row', areaIndex: 2 },
            ],
            store: this.testStore
        });
        this.testStore.load.returns($.Deferred().reject());

        // act
        dataSource.field(2, { area: 'row', areaIndex: 1 });
        dataSource.load();

        // assert
        assert.deepEqual(this.testStore.load.lastCall.args[0].rowExpandedPaths, [[1]], 'Expanded rows paths');
    });

    QUnit.test('Change field when fields not loaded', function(assert) {
        const def = $.Deferred();
        const retrieveFieldsDef = $.Deferred();

        this.testStore.load.returns(def);
        this.testStore.getFields.returns(retrieveFieldsDef);

        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Product].[Subcategory]', area: 'column', areaIndex: 1 },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', area: 'data', areaIndex: 0 },
                { dataField: 'date', area: 'row', areaIndex: 1 },
                { dataField: 'date', area: 'column', groupInterval: 'year', areaIndex: 2 }
            ],
            store: this.testStore,
            retrieveFields: true
        });
        const loadResult = {
            columns: [{
                value: 'column1'
            }],
            rows: [
                {
                    value: 'rowValue'
                }
            ],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        def.resolve(loadResult);

        // act
        dataSource.field(0, { area: 'row' });
        dataSource.load();

        retrieveFieldsDef.resolve([
            { dataField: '[Product].[Category]', allMember: '[All Products]' },
            { dataField: '[Ship Date].[Calendar Year]', allMember: '[All Periods]' },
            { dataField: '[Ship Date].[Calendar Month]', allMember: '[All Periods]' },
            { dataField: '[Measures].[Customer Count]', caption: 'Count' },
            { dataField: 'date', caption: 'date' },
            { dataField: 'date', groupInterval: 'year', caption: 'date.year' },

            { dataField: 'date', groupInterval: 'month', caption: 'date.month' }
        ]);

        // assert
        prepareFields(dataSource.fields());
        assert.deepEqual(dataSource.getData(), loadResult);
        assert.strictEqual(this.testStore.load.callCount, 2, 'load callCount');
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [
                {
                    caption: 'Count',
                    dataField: '[Measures].[Customer Count]',
                    area: 'data',
                    areaIndex: 0
                }
            ],
            columns: [
                {
                    dataField: '[Product].[Subcategory]',
                    area: 'column',
                    areaIndex: 0,
                    caption: ''
                },
                {
                    dataField: 'date',
                    area: 'column',
                    groupInterval: 'year',
                    caption: 'date.year',
                    areaIndex: 1
                }
            ],
            rows: [
                {
                    allMember: '[All Products]',
                    dataField: '[Product].[Category]',
                    areaIndex: 0,
                    area: 'row',
                    caption: ''
                },
                {
                    allMember: '[All Periods]',
                    dataField: '[Ship Date].[Calendar Year]',
                    area: 'row',
                    areaIndex: 1,
                    caption: ''
                },
                {
                    dataField: 'date',
                    area: 'row',
                    caption: 'date',
                    areaIndex: 2
                }
            ],
            filters: []
        }], 'load args');
    });

    QUnit.test('Change areaIndex to begin', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Product].[Subcategory]', area: 'column', areaIndex: 1 },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', area: 'data', areaIndex: 0 }
            ],
            store: this.testStore
        });
        // act
        dataSource.field(1, { areaIndex: 0 });
        dataSource.load();

        // assert
        prepareFields(dataSource.fields());
        assert.ok(this.testStore.load.calledTwice, 'load twice');
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [
                {
                    dataField: '[Measures].[Customer Count]',
                    area: 'data',
                    areaIndex: 0,
                    caption: ''
                }
            ],
            columns: [
                {
                    dataField: '[Product].[Subcategory]',
                    areaIndex: 0,
                    area: 'column',
                    caption: ''
                },
                {
                    dataField: '[Product].[Category]',
                    area: 'column',
                    areaIndex: 1,
                    caption: ''
                }
            ],
            rows: [
                {
                    dataField: '[Ship Date].[Calendar Year]',
                    area: 'row',
                    areaIndex: 0,
                    caption: ''
                }
            ],
            filters: []
        }], 'load args');
    });

    QUnit.test('Change areaIndex to begin when group', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { area: 'column', areaIndex: 0, groupName: 'Group1' },
                { groupName: 'Group1', groupIndex: 1, dataField: 'Field1' },
                { groupName: 'Group1', groupIndex: 2, dataField: 'Field2' },
                { dataField: '[Product].[Subcategory]', area: 'column', areaIndex: 1 }
            ],
            store: this.testStore
        });
        // act

        dataSource.field('[Product].[Subcategory]', { areaIndex: 0 });
        dataSource.load();

        // assert
        prepareFields(dataSource.fields());

        assert.ok(this.testStore.load.calledTwice, 'load twice');
        assert.deepEqual(prepareFields(this.testStore.load.lastCall.args[0].columns), [
            {
                area: 'column',
                areaIndex: 0,
                caption: '',
                dataField: '[Product].[Subcategory]'
            },
            {
                area: 'column',
                areaIndex: 1,
                caption: '',
                dataField: 'Field1',
                groupIndex: 1,
                groupName: 'Group1'
            },
            {
                area: 'column',
                areaIndex: 1,
                caption: '',
                dataField: 'Field2',
                groupIndex: 2,
                groupName: 'Group1'
            }
        ], 'load args');

        const columnFields = dataSource.getAreaFields('column', true);
        assert.strictEqual(columnFields.length, 2);
        assert.strictEqual(columnFields[0].dataField, '[Product].[Subcategory]');
        assert.strictEqual(columnFields[1].dataField, undefined);
        assert.strictEqual(columnFields[1].groupName, 'Group1');
    });

    QUnit.test('Change areaIndex to end', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Product].[Subcategory]', area: 'column', areaIndex: 1 },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0 },
                { dataField: '[Measures].[Customer Count]', area: 'data', areaIndex: 0 }
            ],
            store: this.testStore
        });
        const loadResult = {
            columns: [],
            rows: [],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        def.resolve(loadResult);

        // act

        dataSource.field(0, { areaIndex: 2 });
        dataSource.load();

        // assert
        prepareFields(dataSource.fields());
        assert.deepEqual(dataSource.getData(), loadResult);
        assert.ok(this.testStore.load.calledTwice, 'load twice');
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args)[0].columns, [
            {
                dataField: '[Product].[Subcategory]',
                areaIndex: 0,
                area: 'column',
                caption: ''
            },
            {
                dataField: '[Product].[Category]',
                area: 'column',
                areaIndex: 1,
                caption: ''
            }
        ], 'load args');
    });

    QUnit.test('Load with group field', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: '[Color]', area: 'row', areaIndex: 2 },
                { dataField: '[Product].[Subcategory]', groupName: '[Product]', area: 'column', groupIndex: 1 },
                { dataField: '[Date]', area: 'row', areaIndex: 0 },
                { dataField: '[Product].[Category]', groupName: '[Product]', area: 'filter', groupIndex: 0 },
                { dataField: '[Product]', groupName: '[Product]', area: 'row', areaIndex: 1 }
            ],
            store: this.testStore
        });
        const loadResult = {
            columns: [],
            rows: [],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        def.resolve(loadResult);

        // assert
        assert.deepEqual(dataSource.getData(), loadResult);
        assert.ok(this.testStore.load.calledOnce, 'load once');
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [],
            columns: [],
            rows: [
                { dataField: '[Date]', area: 'row', areaIndex: 0, caption: '' },
                { dataField: '[Product].[Category]', groupName: '[Product]', groupIndex: 0, areaIndex: 1, area: 'row', caption: '' },
                { dataField: '[Product].[Subcategory]', groupName: '[Product]', groupIndex: 1, areaIndex: 1, area: 'row', caption: '' },
                { dataField: '[Color]', area: 'row', areaIndex: 2, caption: '' }
            ],
            filters: []
        }], 'load args');
    });

    // T531359
    QUnit.test('Sort group fields', function(assert) {
        this.testStore.load.returns($.Deferred());

        const fields = [
            {
                caption: 'Date Problem',
                displayFolder: 'Project',
                dataField: 'projectCust_datumproblem',
                groupName: 'projectCust_datumproblem',
                dataType: 'date',
                area: 'column'
            },
            {
                groupName: 'projectCust_datumproblem',
                groupInterval: 'year',
                groupIndex: 0,
                caption: 'datumProblem Jahr',
                area: 'column'
            },
            {
                groupName: 'projectCust_datumproblem',
                groupInterval: 'quarter',
                groupIndex: 1,
                caption: 'datumProblem Quartal',
                area: 'column'
            },
            {
                groupName: 'projectCust_datumproblem',
                groupInterval: 'month',
                groupIndex: 2,
                caption: 'datumProblem Monat',
                area: 'column'
            },
            {
                caption: 'Allocation Date',
                displayFolder: 'Project',
                dataField: 'allocationDate',
                groupName: 'allocationDate',
                dataType: 'date',
                area: 'column'
            },
            {
                groupName: 'allocationDate',
                groupInterval: 'year',
                groupIndex: 0,
                caption: 'Allocation Jahr',
                area: 'column'
            },
            {
                groupName: 'allocationDate',
                groupInterval: 'quarter',
                groupIndex: 1,
                caption: 'Allocation Quartal',
                area: 'column'
            },
            {
                groupName: 'allocationDate',
                groupInterval: 'month',
                groupIndex: 2,
                caption: 'Allocation Monat',
                area: 'column'
            },
            {
                caption: 'Project Finish',
                displayFolder: 'Project',
                dataField: 'projectFinishDate',
                groupName: 'projectFinishDate',
                dataType: 'date',
                area: 'column'
            },
            {
                groupName: 'projectFinishDate',
                groupInterval: 'year',
                groupIndex: 0,
                caption: 'Project Finish Jahr',
                area: 'column'
            },
            {
                groupName: 'projectFinishDate',
                groupInterval: 'quarter',
                groupIndex: 1,
                caption: 'Project Finish Quartal',
                area: 'column'
            },
            {
                groupName: 'projectFinishDate',
                groupInterval: 'month',
                groupIndex: 2,
                caption: 'Project Finish Monat',
                area: 'column'
            },
            {
                caption: 'Project Start',
                displayFolder: 'Project',
                dataField: 'projectStartDate',
                groupName: 'projectStartDate',
                dataType: 'date',
                area: 'column'
            },
            {
                groupName: 'projectStartDate',
                groupInterval: 'year',
                groupIndex: 0,
                caption: 'Project Start Jahr',
                area: 'column'
            },
            {
                groupName: 'projectStartDate',
                groupInterval: 'quarter',
                groupIndex: 1,
                caption: 'Project Start Quartal',
                area: 'column'
            },
            {
                groupName: 'projectStartDate',
                groupInterval: 'month',
                groupIndex: 2,
                caption: 'Project Start Monat',
                area: 'column'
            }
        ];

        createDataSource({
            fields: fields,
            store: this.testStore
        });

        // assert
        assert.ok(this.testStore.load.calledOnce, 'load once');
        assert.deepEqual(this.testStore.load.lastCall.args[0].columns, [
            fields[1],
            fields[2],
            fields[3],

            fields[5],
            fields[6],
            fields[7],

            fields[9],
            fields[10],
            fields[11],

            fields[13],
            fields[14],
            fields[15]
        ], 'columns order');
    });

    QUnit.test('Load with group field. Pass sorting params', function(assert) {
    // act
        createDataSource({
            fields: [
                { dataField: '[Color]', area: 'row', areaIndex: 2 },
                { dataField: '[Product].[Subcategory]', groupName: '[Product]', area: 'column', groupIndex: 1, sortOrder: 'asc', sortBySummaryField: '[Measures]', sortBy: 'caption', sortBySummaryPath: ['Bikes'] },
                { dataField: '[Date]', area: 'row', areaIndex: 0 },
                { dataField: '[Product].[Category]', groupName: '[Product]', area: 'filter', groupIndex: 0 },
                { dataField: '[Product]', groupName: '[Product]', area: 'row', areaIndex: 1, sortOrder: 'desc', sortBySummaryField: '[Measures].[Customer Count]', sortBy: 'value', sortBySummaryPath: ['Bikes', 'Road Bikes'] }
            ],
            store: this.testStore
        });

        // assert
        assert.ok(this.testStore.load.calledOnce, 'load once');
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [],
            columns: [],
            rows: [
                { dataField: '[Date]', area: 'row', areaIndex: 0, caption: '' },
                { dataField: '[Product].[Category]', groupName: '[Product]', groupIndex: 0, areaIndex: 1, area: 'row', sortOrder: 'desc', sortBySummaryField: '[Measures].[Customer Count]', sortBy: 'value', sortBySummaryPath: ['Bikes', 'Road Bikes'], caption: '' },
                { dataField: '[Product].[Subcategory]', groupName: '[Product]', groupIndex: 1, areaIndex: 1, area: 'row', sortOrder: 'asc', sortBySummaryField: '[Measures]', sortBy: 'caption', sortBySummaryPath: ['Bikes'], caption: '' },
                { dataField: '[Color]', area: 'row', areaIndex: 2, caption: '' }
            ],
            filters: []
        }], 'load args');
    });

    QUnit.test('Load with group field. Pass expanded and showTotals params', function(assert) {
    // act
        createDataSource({
            fields: [
                { dataField: '[Product]', groupName: '[Product]', expanded: true, area: 'row', showTotals: false, showGrandTotals: true },
                { dataField: '[Product].[Category]', groupName: '[Product]', groupIndex: 0, showTotals: true, showGrandTotals: true },
                { dataField: '[Product].[Subcategory]', groupName: '[Product]', groupIndex: 1, expanded: false },
                { dataField: '[Product].[Color]', groupName: '[Product]', groupIndex: 2, expanded: true, showTotals: false, showGrandTotals: false }
            ],
            store: this.testStore
        });

        // assert
        assert.ok(this.testStore.load.calledOnce, 'load once');
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [],
            columns: [],
            rows: [
                { dataField: '[Product].[Category]', groupName: '[Product]', groupIndex: 0, expanded: true, area: 'row', areaIndex: 0, caption: '', showGrandTotals: true, showTotals: true },
                { dataField: '[Product].[Subcategory]', groupName: '[Product]', groupIndex: 1, expanded: false, area: 'row', areaIndex: 0, caption: '', showGrandTotals: true, showTotals: false },
                { dataField: '[Product].[Color]', groupName: '[Product]', groupIndex: 2, expanded: true, area: 'row', areaIndex: 0, caption: '', showGrandTotals: false, showTotals: false }
            ],
            filters: []
        }], 'load args');
    });

    QUnit.test('Load with group field. change group field', function(assert) {
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Color]', area: 'row', areaIndex: 2 },
                { dataField: '[Product].[Subcategory]', groupName: '[Product]', area: 'column', groupIndex: 1, sortOrder: 'asc', sortBySummaryField: '[Measures]', sortBy: 'caption', sortBySummaryPath: ['Bikes'] },
                { dataField: '[Date]', area: 'row', areaIndex: 0 },
                { dataField: '[Product].[Category]', groupName: '[Product]', area: 'filter', groupIndex: 0 },
                { dataField: '[Product]', groupName: '[Product]', area: 'row', areaIndex: 1, sortOrder: 'desc', sortBySummaryField: '[Measures].[Customer Count]', sortBy: 'value', sortBySummaryPath: ['Bikes', 'Road Bikes'] }
            ],
            store: this.testStore
        });

        dataSource.field('[Product]', { sortOrder: 'desc', sortBySummaryPath: ['NewPath'] });

        // assert
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [],
            columns: [],
            rows: [
                { dataField: '[Date]', area: 'row', areaIndex: 0, caption: '' },
                { dataField: '[Product].[Category]', groupName: '[Product]', groupIndex: 0, areaIndex: 1, area: 'row', sortOrder: 'desc', sortBySummaryField: '[Measures].[Customer Count]', sortBy: 'value', sortBySummaryPath: ['Bikes', 'Road Bikes'], caption: '' },
                { dataField: '[Product].[Subcategory]', groupName: '[Product]', groupIndex: 1, areaIndex: 1, area: 'row', sortOrder: 'desc', sortBySummaryField: '[Measures]', sortBy: 'caption', sortBySummaryPath: ['Bikes'], caption: '' },
                { dataField: '[Color]', area: 'row', areaIndex: 2, caption: '' }
            ],
            filters: []
        }], 'load args');
    });

    QUnit.test('Load several groups on single axis', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product]', area: 'row', groupName: '[Product]' },
                { dataField: '[Calendar]', area: 'row', groupName: '[Calendar]', dataType: 'date' },

                { dataField: '[Category]', groupName: '[Product]', groupIndex: 0 },
                { dataField: '[Subcategory]', groupName: '[Product]', groupIndex: 1 },

                { dataField: '[Year]', groupName: '[Calendar]', groupIndex: 0 },
                { dataField: '[Month]', groupName: '[Calendar]', groupIndex: 1 }
            ],
            store: this.testStore
        });
        const loadResult = {
            columns: [],
            rows: [],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        def.resolve(loadResult);

        // assert
        assert.deepEqual(dataSource.getData(), loadResult);
        assert.ok(this.testStore.load.calledOnce, 'load once');
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [],
            columns: [],
            rows: [
                { dataField: '[Category]', groupName: '[Product]', groupIndex: 0, area: 'row', areaIndex: 0, caption: '' },
                { dataField: '[Subcategory]', groupName: '[Product]', groupIndex: 1, area: 'row', areaIndex: 0, caption: '' },

                { dataField: '[Year]', groupName: '[Calendar]', groupIndex: 0, area: 'row', areaIndex: 1, caption: '', dataType: 'date' },
                { dataField: '[Month]', groupName: '[Calendar]', groupIndex: 1, area: 'row', areaIndex: 1, caption: '', dataType: 'date' }
            ],
            filters: []
        }], 'load args');
    });

    QUnit.test('Change group item', function(assert) {
        const dataSource = createDataSource({
            fields: [
                { dataField: '[Product]', area: 'row', groupName: '[Product]', areaIndex: 0 },
                { dataField: '[Calendar]', area: 'column', groupName: '[Calendar]', areaIndex: 0 },

                { dataField: '[Category]', groupName: '[Product]', groupIndex: 0 },
                { dataField: '[Subcategory]', groupName: '[Product]', groupIndex: 1 },

                { dataField: '[Year]', groupName: '[Calendar]', groupIndex: 0 },
                { dataField: '[Month]', groupName: '[Calendar]', groupIndex: 1 }
            ],
            store: this.testStore
        });
        // act
        dataSource.field('[Month]', { sortBy: 'value' });
        dataSource.load();
        // assert

        prepareFields(dataSource.fields());

        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [],
            columns: [
                { dataField: '[Year]', groupName: '[Calendar]', groupIndex: 0, area: 'column', areaIndex: 0, caption: '' },
                { dataField: '[Month]', groupName: '[Calendar]', groupIndex: 1, area: 'column', areaIndex: 0, caption: '', sortBy: 'value' }
            ],
            rows: [
                { dataField: '[Category]', groupName: '[Product]', groupIndex: 0, area: 'row', areaIndex: 0, caption: '' },
                { dataField: '[Subcategory]', groupName: '[Product]', groupIndex: 1, area: 'row', areaIndex: 0, caption: '' }
            ],
            filters: []
        }], 'load args');
    });

    QUnit.test('Load with group fields with filterValues', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: '[Color]', area: 'row', areaIndex: 2 },
                { dataField: '[Product].[Subcategory]', groupName: '[Product]', area: 'column', groupIndex: 1, filterValues: ['Cat1 SubCat2', 'Cat1 SubCat3'] },
                { dataField: '[Date]', area: 'row', areaIndex: 0 },
                { dataField: '[Product].[Category]', groupName: '[Product]', area: 'filter', groupIndex: 0, filterValues: ['Cat2'] },
                { dataField: '[Product]', groupName: '[Product]', area: 'row', areaIndex: 1, filterValues: ['Cat1 SubCat1'] }
            ],
            store: this.testStore
        });
        const loadResult = {
            columns: [],
            rows: [],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        def.resolve(loadResult);

        // assert
        assert.deepEqual(dataSource.getData(), loadResult);
        assert.ok(this.testStore.load.calledOnce, 'load once');
        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args), [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [],
            columns: [],
            rows: [
                { dataField: '[Date]', area: 'row', areaIndex: 0, caption: '' },
                { dataField: '[Product].[Category]', groupName: '[Product]', groupIndex: 0, areaIndex: 1, area: 'row', filterValues: ['Cat2'], caption: '' },
                { dataField: '[Product].[Subcategory]', groupName: '[Product]', groupIndex: 1, areaIndex: 1, area: 'row', filterValues: ['Cat1 SubCat2', 'Cat1 SubCat3'], caption: '' },
                { dataField: '[Color]', area: 'row', areaIndex: 2, caption: '' }
            ],
            filters: [
                {
                    dataField: '[Product]', groupName: '[Product]', area: 'row', areaIndex: 1, filterValues: ['Cat1 SubCat1'],
                    levels: [
                        { dataField: '[Product].[Category]', groupName: '[Product]', groupIndex: 0, areaIndex: 1, area: 'row', filterValues: ['Cat2'], caption: '' },
                        { dataField: '[Product].[Subcategory]', groupName: '[Product]', groupIndex: 1, areaIndex: 1, area: 'row', filterValues: ['Cat1 SubCat2', 'Cat1 SubCat3'], caption: '' }
                    ],
                    caption: ''
                }
            ]
        }], 'load args');

        assert.strictEqual(dataSource.getAreaFields('filter', true).length, 0);
    });

    QUnit.test('Load with group fields with filterValues and filter area', function(assert) {
        const def = $.Deferred();
        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: '[Color]', area: 'row', areaIndex: 2 },
                { dataField: '[Product].[Subcategory]', groupName: '[Product]', area: 'column', groupIndex: 1, filterValues: ['Cat1 SubCat2', 'Cat1 SubCat3'] },
                { dataField: '[Date]', area: 'row', areaIndex: 0 },
                { dataField: '[Product].[Category]', groupName: '[Product]', area: 'filter', groupIndex: 0, filterValues: ['Cat2'] },
                { dataField: '[Product]', groupName: '[Product]', area: 'filter', areaIndex: 1, filterValues: ['Cat1 SubCat1'] }
            ],
            store: this.testStore
        });
        const loadResult = {
            columns: [],
            rows: [],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        def.resolve(loadResult);

        // assert
        assert.deepEqual(dataSource.getData(), loadResult);
        assert.ok(this.testStore.load.calledOnce, 'load once');

        prepareFields(dataSource.fields());

        assert.deepEqual(this.testStore.load.lastCall.args, [{
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            values: [],
            columns: [],
            rows: [
                { dataField: '[Date]', area: 'row', areaIndex: 0, caption: '' },
                { dataField: '[Color]', area: 'row', areaIndex: 1, caption: '' }
            ],
            filters: [
                {
                    dataField: '[Product]', groupName: '[Product]', area: 'filter', areaIndex: 0, filterValues: ['Cat1 SubCat1'],
                    levels: [
                        { dataField: '[Product].[Category]', groupName: '[Product]', area: 'filter', groupIndex: 0, filterValues: ['Cat2'], areaIndex: 0, caption: '' },
                        { dataField: '[Product].[Subcategory]', groupName: '[Product]', area: 'filter', groupIndex: 1, filterValues: ['Cat1 SubCat2', 'Cat1 SubCat3'], areaIndex: 0, caption: '' }
                    ],
                    caption: ''
                }
            ]
        }], 'load args');
    });

    QUnit.test('Collapse level', function(assert) {
        assert.expect(10);

        this.testStore.load.returns($.Deferred().resolve(this.storeData));

        const expandedField = { dataField: 'ShipCountry', area: 'column', expanded: true };
        const dataSource = createDataSource({
            fields: [
                expandedField,
                { dataField: 'ShipCity', area: 'column' },
                { dataField: 'ShipVia', area: 'row' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        dataSource.on('changed', assertFunction);

        // act
        dataSource.collapseAll(0);
        // assert
        assert.equal(this.testStore.load.callCount, 1);

        function assertFunction() {
            const data = this.getData();
            assert.strictEqual(data.columns[0].value, 'Brazil');
            assert.ok(!data.columns[0].children);
            assert.deepEqual(prepareLoadedData(data.columns[0].collapsedChildren), [{
                index: 7,
                value: 'Campinas'
            }, {
                index: 8,
                value: 'Sao Paulo'
            }]);

            assert.strictEqual(data.columns[1].value, 'Canada');
            assert.ok(!data.columns[1].children);
            assert.ok(!data.columns[1].collapsedChildren);

            assert.strictEqual(data.columns[2].value, 'USA');
            assert.ok(!data.columns[2].children);
            assert.deepEqual(prepareLoadedData(data.columns[2].collapsedChildren), [
                {
                    index: 2,
                    value: 'Boise'
                },
                {
                    index: 4,
                    value: 'Butte'
                },
                {
                    index: 3,
                    value: 'Elgin'
                }
            ]);
        }
    });

    QUnit.test('Collapse group', function(assert) {
        assert.expect(9);

        this.testStore.load.returns($.Deferred().resolve(this.storeData));

        const dataSource = createDataSource({
            fields: [
                { group: 'group', area: 'column', expanded: true },
                { dataField: 'ShipCity', area: 'column', group: 'group', groupIndex: 0 },
                { dataField: 'ShipVia', area: 'row' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        dataSource.on('changed', assertFunction);

        // act
        dataSource.collapseAll(0);
        // assert
        function assertFunction() {
            const data = this.getData();
            assert.strictEqual(data.columns[0].value, 'Brazil');
            assert.ok(!data.columns[0].children);
            assert.deepEqual(prepareLoadedData(data.columns[0].collapsedChildren), [{
                index: 7,
                value: 'Campinas'
            }, {
                index: 8,
                value: 'Sao Paulo'
            }]);

            assert.strictEqual(data.columns[1].value, 'Canada');
            assert.ok(!data.columns[1].children);
            assert.ok(!data.columns[1].collapsedChildren);

            assert.strictEqual(data.columns[2].value, 'USA');
            assert.ok(!data.columns[2].children);
            assert.deepEqual(prepareLoadedData(data.columns[2].collapsedChildren), [
                {
                    index: 2,
                    value: 'Boise'
                },
                {
                    index: 4,
                    value: 'Butte'
                },
                {
                    index: 3,
                    value: 'Elgin'
                }
            ]);
        }
    });

    QUnit.test('Collapse level by field id', function(assert) {
        assert.expect(10);

        this.testStore.load.returns($.Deferred().resolve(this.storeData));

        const expandedField = { dataField: 'ShipCountry', area: 'column', expanded: true };
        const dataSource = createDataSource({
            fields: [
                expandedField,
                { dataField: 'ShipCity', area: 'column' },
                { dataField: 'ShipVia', area: 'row' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        dataSource.on('changed', assertFunction);

        // act
        dataSource.collapseAll('ShipCountry');
        // assert
        assert.equal(this.testStore.load.callCount, 1);

        function assertFunction() {
            const data = this.getData();
            assert.strictEqual(data.columns[0].value, 'Brazil');
            assert.ok(!data.columns[0].children);
            assert.deepEqual(prepareLoadedData(data.columns[0].collapsedChildren), [{
                index: 7,
                value: 'Campinas'
            }, {
                index: 8,
                value: 'Sao Paulo'
            }]);

            assert.strictEqual(data.columns[1].value, 'Canada');
            assert.ok(!data.columns[1].children);
            assert.ok(!data.columns[1].collapsedChildren);

            assert.strictEqual(data.columns[2].value, 'USA');
            assert.ok(!data.columns[2].children);
            assert.deepEqual(prepareLoadedData(data.columns[2].collapsedChildren), [
                {
                    index: 2,
                    value: 'Boise'
                },
                {
                    index: 4,
                    value: 'Butte'
                },
                {
                    index: 3,
                    value: 'Elgin'
                }
            ]);
        }
    });

    QUnit.test('Collapse level when group', function(assert) {
        assert.expect(9);

        this.storeData.columns[0].children[0].children = [{
            value: 'Val1',
        }, {
            value: 'Val2'
        }];

        this.testStore.load.returns($.Deferred().resolve(this.storeData));

        const expandedField = { groupName: 'group', groupIndex: 1, expanded: true };
        const dataSource = createDataSource({
            fields: [
                { dataField: 'Field', groupName: 'group', area: 'column' },
                { groupName: 'group', expanded: true, groupIndex: 0 },
                expandedField,
                { groupName: 'group', groupIndex: 2 },
                { dataField: 'ShipCity', area: 'column' },
                { dataField: 'ShipVia', area: 'row' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        dataSource.on('changed', assertFunction);

        // act
        dataSource.collapseAll(2);
        // assert
        assert.equal(this.testStore.load.callCount, 1);

        function assertFunction() {
            const data = this.getData();
            assert.strictEqual(data.columns[0].value, 'Brazil');
            assert.ok(data.columns[2].children[0]);
            assert.ok(!data.columns[2].children[0].children);

            assert.deepEqual(prepareLoadedData(data.columns[2].children[0].collapsedChildren), [{
                value: 'Val1',
            }, {
                value: 'Val2'
            }]);

            assert.strictEqual(data.columns[1].value, 'Canada');
            assert.ok(!data.columns[1].children);
            assert.ok(!data.columns[1].collapsedChildren);

            assert.strictEqual(data.columns[2].value, 'USA');
        }
    });

    QUnit.test('Collapse level when fieldIndex incorrect', function(assert) {
        this.testStore.load.returns($.Deferred().resolve(this.storeData));

        const expandedField = { dataField: 'ShipCountry', area: 'column', expanded: true };
        const dataSource = createDataSource({
            fields: [
                expandedField,
                { dataField: 'ShipCity', area: 'column' },
                { dataField: 'ShipVia', area: 'row' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });
        const dataSourceChanged = sinon.stub();

        dataSource.on('changed', dataSourceChanged);

        // act
        dataSource.collapseAll(21);
        // assert
        assert.equal(this.testStore.load.callCount, 1);
        assert.ok(!dataSourceChanged.called);
    });

    QUnit.test('Collapse level when there are not expanded items', function(assert) {
        this.storeData.columns[0].children = null;
        this.storeData.columns[2].children = null;

        this.testStore.load.returns($.Deferred().resolve(this.storeData));

        const expandedField = { dataField: 'ShipCountry', area: 'column', expanded: true };
        const dataSource = createDataSource({
            fields: [
                expandedField,
                { dataField: 'ShipVia', area: 'row' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });
        const dataSourceChanged = sinon.stub();

        dataSource.on('changed', dataSourceChanged);

        // act

        dataSource.collapseAll(0);
        // assert
        assert.equal(this.testStore.load.callCount, 1);
        assert.ok(!dataSourceChanged.called);
    });

    QUnit.test('Expand level', function(assert) {
        this.testStore.load.returns($.Deferred().resolve(this.storeData));

        const expandedField = { dataField: 'ShipCountry', area: 'column', expanded: false };
        const dataSource = createDataSource({
            fields: [
                expandedField,
                { dataField: 'ShipCity', area: 'column' },
                { dataField: 'ShipVia', area: 'row' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        // act
        dataSource.expandAll(0);
        // assert
        assert.equal(this.testStore.load.callCount, 2);

        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args)[0].columns, [{
            area: 'column',
            areaIndex: 0,
            dataField: 'ShipCountry',
            expanded: true,
            caption: ''
        },
        {
            area: 'column',
            areaIndex: 1,
            dataField: 'ShipCity',
            caption: ''
        }]);

    });

    QUnit.test('Expand group', function(assert) {
        this.testStore.load.returns($.Deferred());

        const dataSource = createDataSource({
            fields: [
                { groupName: 'group', area: 'column' },
                { dataField: 'ShipCity', groupName: 'group', groupIndex: 0 },
                { dataField: 'ShipVia', groupName: 'group', groupIndex: 1 },
                { dataField: 'NotGroup', area: 'column', expanded: false }
            ],
            store: this.testStore
        });

        // act
        dataSource.expandAll(0);
        // assert
        const expandedValues = this.testStore.load.lastCall.args[0].columns.map(f => f.expanded);
        assert.deepEqual(expandedValues, [true, true, false]);
    });

    QUnit.test('Expand level by fieldId', function(assert) {
        this.testStore.load.returns($.Deferred().resolve(this.storeData));

        const expandedField = { dataField: 'ShipCountry', area: 'column', expanded: false };
        const dataSource = createDataSource({
            fields: [
                expandedField,
                { dataField: 'ShipCity', area: 'column' },
                { dataField: 'ShipVia', area: 'row' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        // act
        dataSource.expandAll('ShipCountry');
        // assert
        assert.equal(this.testStore.load.callCount, 2);

        assert.deepEqual(prepareLoadArgs(this.testStore.load.lastCall.args)[0].columns, [{
            area: 'column',
            areaIndex: 0,
            dataField: 'ShipCountry',
            expanded: true,
            caption: ''
        },
        {
            area: 'column',
            areaIndex: 1,
            dataField: 'ShipCity',
            caption: ''
        }]);

    });

    QUnit.test('expand level when fieldIndex incorrect', function(assert) {
        this.testStore.load.returns($.Deferred().resolve(this.storeData));

        const expandedField = { dataField: 'ShipCountry', area: 'column', expanded: true };
        const dataSource = createDataSource({
            fields: [
                expandedField,
                { dataField: 'ShipCity', area: 'column' },
                { dataField: 'ShipVia', area: 'row' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });
        const dataSourceChanged = sinon.stub();

        dataSource.on('changed', dataSourceChanged);

        // act
        dataSource.collapseAll(21);
        // assert
        assert.equal(this.testStore.load.callCount, 1);
        assert.ok(!dataSourceChanged.called);
    });

    QUnit.test('Fields Caption generation', function(assert) {
    // act
        inflector.titleize.restore();
        const dataSource = createDataSource({
            fields: [
                { dataField: 'Field1', caption: 'userCaption', summaryType: 'sum', groupName: 'Group1' },
                { dataField: 'Field2', caption: '' },
                { dataField: 'fieldName_caption' },
                {},
                { summaryType: 'avg' },
                { dataField: 'Field3', summaryType: 'avg' },
                { dataField: 'date', groupInterval: 'year' },
                { dataField: 'number', groupInterval: 10 },
                { dataField: 'date', groupInterval: 'month', summaryType: 'count' },
                { dataField: 'Field4', summaryType: 'custom' },
                { dataField: 'Field5' },
                { dataField: 'Field6', groupName: 'Group2' },
                { groupName: 'Group3' }
            ],
            store: this.testStore
        });
        const fields = dataSource.fields();
        // assert

        assert.strictEqual(fields[0].caption, 'userCaption');
        assert.strictEqual(fields[1].caption, '');
        assert.strictEqual(fields[2].caption, 'Field Name Caption');
        assert.strictEqual(fields[3].caption, '');
        assert.strictEqual(fields[4].caption, 'Avg');
        assert.strictEqual(fields[5].caption, 'Field3 (Avg)');
        assert.strictEqual(fields[6].caption, 'Date Year');
        assert.strictEqual(fields[7].caption, 'Number');
        assert.strictEqual(fields[8].caption, 'Date Month (Count)');
        assert.strictEqual(fields[9].caption, 'Field4');
        assert.strictEqual(fields[10].caption, 'Field5');
        assert.strictEqual(fields[11].caption, 'Field6');
        assert.strictEqual(fields[12].caption, 'Group3');
    });

    QUnit.test('Fields Caption generation. Change field option', function(assert) {
    // act
        inflector.titleize.restore();
        const dataSource = createDataSource({
            fields: [
                { dataField: 'Field1', caption: 'userCaption', summaryType: 'sum', groupName: 'Group1' },
                { dataField: 'Field2', caption: '' },
                { dataField: 'fieldName_caption' },
                {},
                { summaryType: 'avg' },
                { dataField: 'Field3', summaryType: 'avg' },
                { dataField: 'date', groupInterval: 'year' },
                { dataField: 'number', groupInterval: 10 },
                { dataField: 'date', groupInterval: 'month', summaryType: 'count' },
                { dataField: 'Field4', summaryType: 'custom' },
                { dataField: 'Field5' },
                { dataField: 'Field6', groupName: 'Group2' },
                { groupName: 'Group3' }
            ],
            store: this.testStore
        });

        // acts
        dataSource.field(1, { summaryType: 'max' });
        dataSource.field(2, { summaryType: 'max' });
        dataSource.field(5, { area: 'row', summaryType: 'max' });

        dataSource.field(6, { groupInterval: 'month' });

        dataSource.field(11, { groupName: 'Group3' });
        dataSource.field(12, { groupName: 'Group2' });

        dataSource.field(10, { caption: 'new custom caption', summaryType: 'sum' });

        // assert
        const fields = dataSource.fields();
        assert.strictEqual(fields[0].caption, 'userCaption');
        assert.strictEqual(fields[1].caption, '');
        assert.strictEqual(fields[2].caption, 'Field Name Caption (Max)');
        assert.strictEqual(fields[3].caption, '');
        assert.strictEqual(fields[4].caption, 'Avg');
        assert.strictEqual(fields[5].caption, 'Field3 (Max)');
        assert.strictEqual(fields[6].caption, 'Date Month');
        assert.strictEqual(fields[7].caption, 'Number');
        assert.strictEqual(fields[8].caption, 'Date Month (Count)');
        assert.strictEqual(fields[9].caption, 'Field4');
        assert.strictEqual(fields[10].caption, 'new custom caption');
        assert.strictEqual(fields[11].caption, 'Field6');
        assert.strictEqual(fields[12].caption, 'Group2');
    });

    QUnit.test('T411764. Change generated caption on fields prepared', function(assert) {
        inflector.titleize.restore();
        const dataSource = createDataSource({
            fields: [
                { dataField: 'Field1', area: 'row' }
            ],
            onFieldsPrepared: function(fields) {
                for(let i = 0; i < fields.length; i++) {
                    fields[i].caption = fields[i].caption.toUpperCase();
                }
            },
            store: this.testStore
        });
        // act
        dataSource.field(0, { area: 'column' });


        assert.strictEqual(dataSource.field(0).caption, 'FIELD1');
    });

    QUnit.test('Change fields at runtime', function(assert) {
        this.testStore.getFields.returns($.Deferred().resolve([
            { dataField: 'Field1', dataType: 'number' },
            { dataField: 'Field2' }
        ]));
        const dataSource = createDataSource({
            fields: [
                { dataField: 'Field1', caption: 'Field1Caption', dataType: 'string' },
                { dataField: 'Field2', caption: 'Filed2Caption', dataType: 'string' }
            ],
            store: this.testStore
        });
        const fieldsPrepared = sinon.stub();
        dataSource.on('fieldsPrepared', fieldsPrepared);
        // Act
        dataSource.fields([
            { dataField: 'Field1' },
            { dataField: 'Field2', caption: 'newCaption' },
            { dataField: 'Field3' }
        ]);
        // Assert
        assert.deepEqual(prepareFields(dataSource.fields()), [
            { dataField: 'Field1', dataType: 'number', caption: '' },
            { dataField: 'Field2', caption: 'newCaption' },
            { dataField: 'Field3', caption: '' }
        ]);
        assert.ok(fieldsPrepared.calledOnce);
        assert.deepEqual(fieldsPrepared.lastCall.args[0], dataSource.fields());
    });

    QUnit.test('Set fields at runtime', function(assert) {
        this.testStore.getFields.returns($.Deferred().resolve([
            { dataField: 'Field1', dataType: 'number' },
            { dataField: 'Field2' }
        ]));

        const dataSource = createDataSource({
            store: this.testStore
        });
        // Act
        dataSource.fields([
            { dataField: 'Field1', caption: 'Field1CustomCaption' },
            { groupName: 'Group', caption: 'Group' },
            { dataField: 'Field3', caption: 'First Group Item', groupName: 'Group', groupIndex: 0 },
            { dataField: 'Field2', caption: 'Second Group Item', groupName: 'Group', groupIndex: 1 }
        ]);
        // Assert
        assert.deepEqual(prepareFields(dataSource.fields()), [
            { dataField: 'Field1', dataType: 'number', caption: 'Field1CustomCaption' },
            {
                groupName: 'Group', caption: 'Group', levels: [
                    { dataField: 'Field3', caption: 'First Group Item', groupName: 'Group', groupIndex: 0 },
                    { dataField: 'Field2', caption: 'Second Group Item', groupName: 'Group', groupIndex: 1 }

                ]
            },
            { dataField: 'Field3', caption: 'First Group Item', groupName: 'Group', groupIndex: 0 },
            { dataField: 'Field2', caption: 'Second Group Item', groupName: 'Group', groupIndex: 1 }
        ]);
    });

    QUnit.test('Change fields at runtime when store fields not yet loaded', function(assert) {
        const deferred = $.Deferred();
        this.testStore.getFields.returns(deferred);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'Field1', caption: 'Field1Caption', dataType: 'string' },
                { dataField: 'Field2', caption: 'Filed2Caption', dataType: 'string' }
            ],
            store: this.testStore
        });
        const fieldsPrepared = sinon.stub();

        dataSource.on('fieldsPrepared', fieldsPrepared);
        // Act
        dataSource.fields([
            { dataField: 'Field1' },
            { dataField: 'Field2', caption: 'newCaption' },
            { dataField: 'Field3' }
        ]);

        deferred.resolve([
            { dataField: 'Field1', dataType: 'number' },
            { dataField: 'Field2' }
        ]);
        // Assert
        assert.deepEqual(prepareFields(dataSource.fields()), [
            { dataField: 'Field1', dataType: 'number', caption: '' },
            { dataField: 'Field2', caption: 'newCaption' },
            { dataField: 'Field3', caption: '' }
        ]);
        assert.ok(fieldsPrepared.calledTwice);
        assert.deepEqual(fieldsPrepared.lastCall.args[0], dataSource.fields());
    });

    QUnit.test('isLoading() in dataSource changed event', function(assert) {
        assert.expect(1);

        const d = $.Deferred();
        this.testStore.load.returns(d);

        const dataSource = createDataSource({
            fields: this.defaultFields,
            store: this.testStore
        });

        dataSource.on('changed', assertFunction);

        // act
        d.resolve(this.storeData);
        // assert
        function assertFunction() {
            assert.ok(!this.isLoading());
        }
    });

    QUnit.test('isLoading() in dataSource changed event when expand header item', function(assert) {
        assert.expect(1);

        this.testStore.load.returns($.Deferred().resolve(this.storeData));
        const d = $.Deferred();
        const dataSource = createDataSource({
            fields: this.defaultFields,
            store: this.testStore
        });

        this.testStore.load.returns(d);
        dataSource.on('changed', assertFunction);

        // act
        dataSource.expandHeaderItem('column', ['Canada']);
        this.storeData.columns = this.storeData.columns[1].children;
        d.resolve(this.storeData);
        // assert
        function assertFunction() {
            assert.ok(!this.isLoading());
        }
    });

    QUnit.test('data on load done when async loading', function(assert) {
        assert.expect(8);

        this.testStore.load.returns($.Deferred().reject());
        const d = $.Deferred();
        const dataSource = createDataSource({
            fields: this.defaultFields,
            store: this.testStore
        });

        this.testStore.load.returns(d);
        dataSource.on('changed', assertFunction);
        // act
        dataSource.load().done(assertFunction);
        d.resolve(this.storeData);
        // assert
        function assertFunction() {
            assert.ok(!dataSource.isLoading());
            const data = dataSource.getData();
            assert.strictEqual(data.columns[0].value, 'Brazil');
            assert.strictEqual(data.columns[1].value, 'Canada');
            assert.strictEqual(data.columns[2].value, 'USA');
        }

    });

    QUnit.test('data on load done when sync loading', function(assert) {
        assert.expect(4);

        this.testStore.load.returns($.Deferred().reject());
        const dataSource = createDataSource({
            fields: this.defaultFields,
            store: this.testStore
        });

        this.testStore.load.returns($.Deferred().resolve(this.storeData));
        // act
        dataSource.load().done(assertFunction);

        // assert
        function assertFunction(data) {
            assert.ok(!dataSource.isLoading());
            assert.strictEqual(data.columns[0].value, 'Brazil');
            assert.strictEqual(data.columns[1].value, 'Canada');
            assert.strictEqual(data.columns[2].value, 'USA');
        }

    });

    QUnit.test('headers formatting', function(assert) {
        this.testStore.load.returns($.Deferred().resolve(this.storeData));


        const customizeText = sinon.spy(function() {
            return 'custom Text';
        });
        const dataSource = createDataSource({
            fields: [
                { dataField: 'Field1', area: 'column' },
                { dataField: 'Field2', area: 'column', customizeText: customizeText },
                { dataField: 'Field3', area: 'row', format: { type: 'currency', precision: 2 } }
            ],
            store: this.testStore
        });

        // assert
        const rows = dataSource.getData().rows;

        assert.strictEqual(rows.length, 3);
        assert.strictEqual(rows[0].text, '$1,985.00');
        assert.strictEqual(rows[1].text, '$1,991.00');
        assert.strictEqual(rows[2].text, '$1,991.00');

        const columns = dataSource.getData().columns;
        assert.strictEqual(columns[0].text, 'Brazil');

        assert.strictEqual(columns[0].children[0].text, 'custom Text');

        assert.strictEqual(customizeText.callCount, 5);
        assert.deepEqual(customizeText.firstCall.args[0], {
            value: 'Boise',
            valueText: 'Boise'
        });
    });

    QUnit.test('header formatting when expanding', function(assert) {
        this.testStore.load.returns($.Deferred().resolve(this.storeData));
        const customizeText = sinon.spy(function() {
            return 'custom Text';
        });
        const d = $.Deferred();
        const dataSource = createDataSource({
            fields: [
                { dataField: 'Field1', area: 'column' },
                { dataField: 'Field2', area: 'column', customizeText: customizeText },
                { dataField: 'Field3', area: 'row', format: { type: 'currency', precision: 2 } }
            ],
            store: this.testStore
        });

        this.testStore.load.returns(d);

        // act
        dataSource.expandHeaderItem('column', ['Canada']);
        this.storeData.columns = [{ value: 'Vancouver' }];
        d.resolve(this.storeData);
        // assert
        const rows = dataSource.getData().rows;

        assert.strictEqual(rows.length, 3);
        assert.strictEqual(rows[0].text, '$1,985.00');
        assert.strictEqual(rows[1].text, '$1,991.00');
        assert.strictEqual(rows[2].text, '$1,991.00');

        const columns = dataSource.getData().columns;
        assert.strictEqual(columns[0].text, 'Brazil');
        assert.strictEqual(columns[1].text, 'Canada');

        assert.strictEqual(columns[0].children[0].text, 'custom Text');
        assert.strictEqual(columns[1].children[0].text, 'custom Text');

        assert.strictEqual(customizeText.callCount, 6);
        assert.deepEqual(customizeText.firstCall.args[0], {
            value: 'Boise',
            valueText: 'Boise'
        });
    });

    if(window.INTRANET) {

        QUnit.test('XMLA store integration', function(assert) {
            const done = assert.async();
            const dataSource = createDataSource({
                descriptions: {
                    columns: [{ dataField: '[Product].[Category]', allMember: '[All Products]' }],
                    rows: [{ dataField: '[Ship Date].[Calendar Year]', allMember: '[All Periods]' }],
                    values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
                },
                store: {
                    type: 'xmla',
                    url: PivotGridTestSettings.XMLA_STORE_URL,
                    catalog: 'Adventure Works DW Standard Edition',
                    cube: 'Adventure Works'
                }
            });

            dataSource.on('changed', function() {

                assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [
                    { key: '[Product].[Category].&[4]', value: 'Accessories', index: 1 },
                    { key: '[Product].[Category].&[1]', value: 'Bikes', index: 2 },
                    { key: '[Product].[Category].&[3]', value: 'Clothing', index: 3 }
                ]);
                assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
                    { key: '[Ship Date].[Calendar Year].&[2001]', value: 2001, index: 1 },
                    { key: '[Ship Date].[Calendar Year].&[2002]', value: 2002, index: 2 },
                    { key: '[Ship Date].[Calendar Year].&[2003]', value: 2003, index: 3 },
                    { key: '[Ship Date].[Calendar Year].&[2004]', value: 2004, index: 4 }
                ]);
                assert.strictEqual(dataSource.getData().grandTotalColumnIndex, 0);
                assert.strictEqual(dataSource.getData().grandTotalRowIndex, 0);
                assert.deepEqual(dataSource.getData().values, [
                    [[18484], [15114], [9132], [6852]],
                    [[962], [null], [962], [null]],
                    [[2665], [null], [2665], [null]],
                    [[9002], [6470], [4756], [2717]],
                    [[11753], [9745], [5646], [4340]]
                ]);
                done();
            });
        });

        QUnit.test('XMLA store. Sorting data', function(assert) {
            const done = assert.async();
            const dataSource = createDataSource({
                descriptions: {
                    columns: [{ dataField: '[Product].[Category]' }],
                    rows: [{ dataField: '[Ship Date].[Month Of Year]' }],
                    values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count' }]
                },
                store: {
                    type: 'xmla',
                    url: PivotGridTestSettings.XMLA_STORE_URL,
                    catalog: 'Adventure Works DW Standard Edition',
                    cube: 'Adventure Works'
                }
            });

            dataSource.on('changed', function() {
                assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [
                    { key: '[Product].[Category].&[4]', value: 'Accessories', index: 1 },
                    { key: '[Product].[Category].&[1]', value: 'Bikes', index: 2 },
                    { key: '[Product].[Category].&[3]', value: 'Clothing', index: 3 }
                ]);

                assert.deepEqual(dataSource.getData().rows.length, 12, 'month count');
                assert.deepEqual(dataSource.getData().rows[0], {
                    index: 1,
                    key: '[Ship Date].[Month of Year].&[1]',
                    text: 'January',
                    value: 1
                }, 'month 1');
                assert.deepEqual(dataSource.getData().rows[11], {
                    index: 12,
                    key: '[Ship Date].[Month of Year].&[12]',
                    text: 'December',
                    value: 12
                }, 'month 12');

                assert.strictEqual(dataSource.getData().grandTotalColumnIndex, 0);
                assert.strictEqual(dataSource.getData().grandTotalRowIndex, 0);
                assert.deepEqual(dataSource.getData().values[0], [[18484], [15114], [9132], [6852]]);
                assert.deepEqual(dataSource.getData().values[1], [[2224], [1485], [1220], [649]]);
                done();
            });
        });
    }


    QUnit.test('Do not perform summary calculation if dataSource is empty', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                {
                    dataField: 'ShipCountry', area: 'column', sortOrder: 'desc', sortingMethod: function(a, b) {
                        return b.index - a.index;
                    }
                },
                { dataField: 'ShipVia', area: 'row' },
                { summaryType: 'count', area: 'data', calculateSummaryValue: function() { } }
            ],
            store: this.testStore
        });

        def.resolve({
            rows: [{ value: '1', index: 1 }],
            columns: [{ value: '1', index: 1 }],
            values: [],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        });

        assert.ok(dataSource.isEmpty());
    });

    QUnit.test('Do not perform running total calculation if dataSource is empty', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                {
                    dataField: 'ShipCountry', area: 'column', sortOrder: 'desc', sortingMethod: function(a, b) {
                        return b.index - a.index;
                    }
                },
                { dataField: 'ShipVia', area: 'row' },
                { summaryType: 'count', area: 'data', runningTotal: 'row' }
            ],
            store: this.testStore
        });

        def.resolve({
            rows: [{ value: '1', index: 1 }],
            columns: [{ value: '1', index: 1 }],
            values: [],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        });

        assert.ok(dataSource.isEmpty());
    });

    // T1141142
    QUnit.test('fields with same dataField should not pollute each other', function(assert) {
        // arrange
        const dataSource = createDataSource({
            fields: [
                { dataField: 'a', area: 'data', summaryType: 'sum', dataType: 'string' },
                { dataField: 'a', area: 'row', summaryType: 'avg', dataType: 'number' },
            ],
            store: []
        });

        // assert
        const [firstField, secondField] = dataSource.fields();

        assert.strictEqual(firstField.area, 'data');
        assert.strictEqual(firstField.summaryType, 'sum');
        assert.strictEqual(firstField.dataType, 'string');

        assert.strictEqual(secondField.area, 'row');
        assert.strictEqual(secondField.summaryType, 'avg');
        assert.strictEqual(secondField.dataType, 'number');
    });
});

QUnit.module('Sorting', defaultEnvironment, () => {

    QUnit.test('Sort data', function(assert) {
        const def = $.Deferred();
        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', sortOrder: 'asc', area: 'column' },
                { dataField: 'ShipCity', sortOrder: 'desc', area: 'column' },

                { dataField: 'ShipVia', area: 'row', sortOrder: 'asc' },

                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        def.resolve(this.storeData);

        assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [{
            index: 6,
            value: 'Brazil',
            children: [{
                index: 8,
                value: 'Sao Paulo'
            }, {
                index: 7,
                value: 'Campinas'
            }]
        }, {
            index: 5,
            value: 'Canada'
        }, {
            index: 1,
            value: 'USA',
            children: [{
                index: 3,
                value: 'Elgin'
            }, {
                index: 4,
                value: 'Butte'
            },
            {
                index: 2,
                value: 'Boise'
            }]
        }], 'column');

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }
        ]);
    });

    QUnit.test('Local sorting should not work if paginate', function(assert) {
        const def = $.Deferred();
        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            paginate: true,
            fields: [
                { dataField: 'ShipVia', area: 'row', sortOrder: 'asc' },

                { dataField: 'ShipCountry', area: 'column' },
                { dataField: 'ShipCity', area: 'column' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        def.resolve(this.storeData);

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
            {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }, {
                index: 3,
                value: 1985
            }
        ]);
    });

    QUnit.test('Data order by default', function(assert) {
        const def = $.Deferred();
        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', area: 'column', sortOrder: 'wrongOrder' },

                { dataField: 'ShipVia', area: 'row' },

                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });


        this.storeData.columns = this.storeData.columns[0].children;

        def.resolve(this.storeData);

        assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [{
            index: 2,
            value: 'Boise'
        }, {
            index: 4,
            value: 'Butte'
        }, {
            index: 3,
            value: 'Elgin'
        }], 'column');

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);
    });

    QUnit.test('Data order with sortingMethod', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const sortingMethod = sinon.spy(function(a, b) {
            return b.index - a.index;
        });
        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', area: 'column', sortBy: 'value', sortOrder: 'asc', sortingMethod: sortingMethod },

                { dataField: 'ShipVia', area: 'row' },

                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        this.storeData.columns = this.storeData.columns[0].children;
        def.resolve(this.storeData);

        assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [
            {
                index: 4,
                value: 'Butte'
            },
            {
                index: 3,
                value: 'Elgin'
            },
            {
                index: 2,
                value: 'Boise'
            }
        ], 'column');

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);

        assert.ok(sortingMethod.called);
        assert.strictEqual(sortingMethod.lastCall.thisValue, dataSource.field('ShipCountry'), 'field is context');// T490852
    });

    QUnit.test('Data order with sortBy: none', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', area: 'column', sortBy: 'none' },
                { dataField: 'ShipVia', area: 'row', sortBy: 'none' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        this.storeData.columns = this.storeData.columns[0].children;
        def.resolve(this.storeData);

        assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [
            { index: 2, value: 'Boise' },
            { index: 3, value: 'Elgin' },
            { index: 4, value: 'Butte' }
        ], 'column');

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
            { index: 1, value: 1991 },
            { index: 2, value: 1991 },
            { index: 3, value: 1985 }
        ], 'rows');
    });

    QUnit.test('Data order with sortBy: none and desc sort order', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', area: 'column', sortBy: 'none', sortOrder: 'desc' },
                { dataField: 'ShipVia', area: 'row', sortBy: 'none', sortOrder: 'desc' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        this.storeData.columns = this.storeData.columns[0].children;
        def.resolve(this.storeData);

        assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [
            { index: 4, value: 'Butte' },
            { index: 3, value: 'Elgin' },
            { index: 2, value: 'Boise' }
        ], 'column');

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
            { index: 3, value: 1985 },
            { index: 2, value: 1991 },
            { index: 1, value: 1991 }
        ], 'rows');
    });

    QUnit.test('Data order with sortingMethod. Desc', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const sortingMethod = sinon.spy(function(a, b) {
            return b.index - a.index;
        });
        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', area: 'column', sortBy: 'value', sortOrder: 'desc', sortingMethod: sortingMethod },

                { dataField: 'ShipVia', area: 'row' },

                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        this.storeData.columns = this.storeData.columns[0].children;
        def.resolve(this.storeData);

        assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [
            {
                index: 2,
                value: 'Boise'
            },
            {
                index: 3,
                value: 'Elgin'
            },
            {
                index: 4,
                value: 'Butte'
            }
        ], 'column');

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);

        assert.ok(sortingMethod.called);
    });

    QUnit.test('Sort data by displayText', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', area: 'column', sortBy: 'displayText', sortOrder: 'desc' },

                { dataField: 'ShipVia', area: 'row' },

                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        this.storeData.columns = this.storeData.columns[0].children;

        this.storeData.columns = $.map(this.storeData.columns, function(item) {
            item.text = item.value;
            item.value = item.index;
            return item;
        });

        def.resolve(this.storeData);

        assert.deepEqual(dataSource.getData().columns, [
            {
                index: 3,
                text: 'Elgin',
                value: 3
            },
            {
                index: 4,
                text: 'Butte',
                value: 4
            },
            {
                index: 2,
                text: 'Boise',
                value: 2
            }
        ], 'column');
    });

    QUnit.test('Sort data after expand item', function(assert) {
        const def = $.Deferred();
        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', sortOrder: 'asc', area: 'column' },
                { dataField: 'ShipCity', sortOrder: 'desc', area: 'column' },

                { dataField: 'ShipVia', area: 'row', sort: 'desc' },

                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });
        const loadResult = {
            columns: [{
                index: 1,
                value: 'USA'
            }, {
                index: 5,
                value: 'Canada'
            }, {
                index: 6,
                value: 'Brazil',
                children: [{
                    index: 7,
                    value: 'Campinas'
                }, {
                    index: 8,
                    value: 'Sao Paulo'
                }]
            }],
            rows: [{
                index: 1,
                value: 1991
            },
            {
                index: 2,
                value: 1991
            },
            {
                index: 3,
                value: 1985
            }],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        def.resolve(loadResult);

        this.testStore.load.returns($.Deferred().resolve({
            columns: [{
                index: 2,
                value: 'Boise'
            }, {
                index: 3,
                value: 'Elgin'
            }, {
                index: 4,
                value: 'Butte'
            }],
            rows: [{
                index: 1,
                value: 1991
            },
            {
                index: 2,
                value: 1991
            },
            {
                index: 3,
                value: 1985
            }],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: undefined
        }));

        dataSource.expandHeaderItem('column', ['USA']);

        assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [{
            index: 6,
            value: 'Brazil',
            children: [{
                index: 8,
                value: 'Sao Paulo'
            }, {
                index: 7,
                value: 'Campinas'
            }]
        }, {
            index: 5,
            value: 'Canada'
        }, {
            index: 1,
            value: 'USA',
            children: [{
                index: 12,
                value: 'Elgin'
            }, {
                index: 13,
                value: 'Butte'
            },
            {
                index: 11,
                value: 'Boise'
            }]
        }], 'column');

        assert.deepEqual(prepareLoadedData(loadResult.rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);
    });

    QUnit.test('Sort by summary with path', function(assert) {
        this.testStore.load.returns($.Deferred().resolve({
            rows: [{
                index: 1,
                value: 'A'
            },
            {
                index: 2,
                value: 'B'
            },
            {
                index: 3,
                value: 'C'
            }],
            columns: [{
                index: 1,
                value: 1
            },
            {
                index: 2,
                value: 2
            },
            {
                index: 3,
                value: 3
            }],
            grandTotalRowIndex: 0,
            grandTotalColumnIndex: 0,
            values: [
                //   GT    1    2    3
                [[0], [0], [0], [0]], // GT
                [[0], [0], [0], [0]], // A
                [[0], [null], [0], [0]], // B
                [[0], [-1], [0], [0]] // C
            ]
        }));

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCity', sortOrder: 'asc', sortBySummaryField: 'Count', area: 'row', sortBySummaryPath: [1] },
                { dataField: 'ShipVia', area: 'column' },
                { dataField: 'Count', caption: 'Count', area: 'data' }
            ],
            store: this.testStore
        });

        const data = dataSource.getData();

        assert.strictEqual(data.rows.length, 3);
        assert.strictEqual(data.rows[0].value, 'B');
        assert.strictEqual(data.rows[1].value, 'C');
        assert.strictEqual(data.rows[2].value, 'A');
    });

    QUnit.test('Sorting with null values', function(assert) {
        const def = $.Deferred();
        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipVia', area: 'row', sortOrder: 'asc' },
                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });

        const storeData = {
            columns: [],
            rows: [
                { value: null, index: 1 },
                { value: '[1]', index: 2 },
                { value: '[2]', index: 3 },
                { value: '[3]', index: 4 },
                { value: '[4]', index: 5 },
                { value: '[5]', index: 6 },
                { value: 'Value', index: 7 },
                { value: '[11]', index: 8 },
                { value: '[11]', index: 9 },
                { value: '[21]', index: 10 },
                { value: '[22]', index: 11 },
                { value: '[23]', index: 12 }
            ],
            values: [[1]],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        };

        def.resolve(storeData);

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows)[0].value, null, 'sorted correctly');
    });


});

QUnit.module('Sorting by summary', {
    beforeEach: function() {
        const that = this;
        this.XmlaStore = XmlaStore;
        this.testStore = sinon.createStubInstance(that.XmlaStore);
        executeAsyncMock.setup();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
    }
}, () => {

    QUnit.test('Sort by summary Field with summaryType', function(assert) {
        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', sortOrder: 'asc', sortBySummaryField: 'Freight (Sum)', area: 'row' },

                { dataField: 'ShipVia', area: 'column' },

                { summaryType: 'count', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'avg', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'sum', area: 'data' }
            ],
            store: window.orders
        });

        const data = dataSource.getData();

        assert.deepEqual(prepareLoadedData(data.rows), [
            {
                index: 19,
                value: 'Poland'
            },
            {
                index: 20,
                value: 'Norway'
            },
            {
                index: 21,
                value: 'Argentina'
            },
            {
                index: 16,
                value: 'Portugal'
            },
            {
                index: 13,
                value: 'Spain'
            },
            {
                index: 12,
                value: 'Italy'
            },
            {
                index: 11,
                value: 'Finland'
            },
            {
                index: 8,
                value: 'Mexico'
            },
            {
                index: 4,
                value: 'Belgium'
            },
            {
                index: 5,
                value: 'Switzerland'
            },
            {
                index: 18,
                value: 'Denmark'
            },
            {
                index: 17,
                value: 'Canada'
            },
            {
                index: 6,
                value: 'Venezuela'
            },
            {
                index: 15,
                value: 'Ireland'
            },
            {
                index: 14,
                value: 'UK'
            },
            {
                index: 10,
                value: 'Sweden'
            },
            {
                index: 1,
                value: 'France'
            },
            {
                index: 3,
                value: 'Brazil'
            },
            {
                index: 7,
                value: 'Austria'
            },
            {
                index: 2,
                value: 'Germany'
            },
            {
                index: 9,
                value: 'USA'
            }
        ]);
    });

    QUnit.test('Sort row by summary Field with summaryType', function(assert) {
        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', sortOrder: 'asc', sortBySummaryField: 'Freight (Sum)', area: 'column' },

                { dataField: 'ShipVia', area: 'row' },

                { summaryType: 'count', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'avg', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'sum', area: 'data' }
            ],
            store: window.orders
        });

        const data = dataSource.getData();

        assert.deepEqual(prepareLoadedData(data.columns), [
            {
                index: 19,
                value: 'Poland'
            },
            {
                index: 20,
                value: 'Norway'
            },
            {
                index: 21,
                value: 'Argentina'
            },
            {
                index: 16,
                value: 'Portugal'
            },
            {
                index: 13,
                value: 'Spain'
            },
            {
                index: 12,
                value: 'Italy'
            },
            {
                index: 11,
                value: 'Finland'
            },
            {
                index: 8,
                value: 'Mexico'
            },
            {
                index: 4,
                value: 'Belgium'
            },
            {
                index: 5,
                value: 'Switzerland'
            },
            {
                index: 18,
                value: 'Denmark'
            },
            {
                index: 17,
                value: 'Canada'
            },
            {
                index: 6,
                value: 'Venezuela'
            },
            {
                index: 15,
                value: 'Ireland'
            },
            {
                index: 14,
                value: 'UK'
            },
            {
                index: 10,
                value: 'Sweden'
            },
            {
                index: 1,
                value: 'France'
            },
            {
                index: 3,
                value: 'Brazil'
            },
            {
                index: 7,
                value: 'Austria'
            },
            {
                index: 2,
                value: 'Germany'
            },
            {
                index: 9,
                value: 'USA'
            }
        ]);
    });

    QUnit.test('Sort by summary second level', function(assert) {
        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', expanded: true, area: 'row' },
                { dataField: 'ShipCity', sortOrder: 'asc', sortBySummaryField: 'Freight (Avg)', area: 'row' },

                { dataField: 'ShipVia', area: 'column' },

                { summaryType: 'count', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'avg', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'sum', area: 'data' }
            ],
            store: window.orders
        });

        const data = dataSource.getData();

        assert.strictEqual(data.rows.length, 21);
        assert.strictEqual(data.rows[0].value, 'Argentina');

        assert.strictEqual(data.rows[14].value, 'Portugal');
        assert.strictEqual(data.rows[20].value, 'Venezuela');

        assert.deepEqual(prepareLoadedData(data.rows[19].children), [
            {
                index: 80,
                value: 'Walla Walla'
            },
            {
                index: 85,
                value: 'Kirkland'
            },
            {
                index: 50,
                value: 'Portland'
            },
            {
                index: 70,
                value: 'Elgin'
            },
            {
                index: 88,
                value: 'Butte'
            },
            {
                index: 86,
                value: 'San Francisco'
            },
            {
                index: 31,
                value: 'Lander'
            },
            {
                index: 30,
                value: 'Seattle'
            },
            {
                index: 49,
                value: 'Anchorage'
            },
            {
                index: 83,
                value: 'Eugene'
            },
            {
                index: 22,
                value: 'Albuquerque'
            },
            {
                index: 54,
                value: 'Boise'
            }
        ]);
    });

    QUnit.test('Sort by summary with path', function(assert) {
        const dataSource = createDataSource({
            fields: [

                { dataField: 'ShipCity', sortOrder: 'asc', sortBySummaryField: 'Freight (Avg)', area: 'row', sortBySummaryPath: [1] },

                { dataField: 'ShipVia', area: 'column' },

                { summaryType: 'count', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'avg', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'sum', area: 'data' },

                { dataField: 'ShipCountry', area: 'filter', filterValues: ['USA'] }
            ],
            store: window.orders
        });

        const data = dataSource.getData();

        assert.strictEqual(data.rows.length, 12);
        assert.strictEqual(data.rows[0].value, 'Kirkland');
        assert.strictEqual(data.rows[1].value, 'San Francisco');
        assert.strictEqual(data.rows[11].value, 'Boise');
    });

    QUnit.test('Sort by summary Field with empty path', function(assert) {
        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', sortOrder: 'asc', sortBySummaryField: 'Freight (Sum)', area: 'row', sortBySummaryPath: [] },

                { dataField: 'ShipVia', area: 'column' },

                { summaryType: 'count', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'avg', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'sum', area: 'data' }
            ],
            store: window.orders
        });

        const data = dataSource.getData();

        assert.deepEqual(prepareLoadedData(data.rows), [
            {
                index: 19,
                value: 'Poland'
            },
            {
                index: 20,
                value: 'Norway'
            },
            {
                index: 21,
                value: 'Argentina'
            },
            {
                index: 16,
                value: 'Portugal'
            },
            {
                index: 13,
                value: 'Spain'
            },
            {
                index: 12,
                value: 'Italy'
            },
            {
                index: 11,
                value: 'Finland'
            },
            {
                index: 8,
                value: 'Mexico'
            },
            {
                index: 4,
                value: 'Belgium'
            },
            {
                index: 5,
                value: 'Switzerland'
            },
            {
                index: 18,
                value: 'Denmark'
            },
            {
                index: 17,
                value: 'Canada'
            },
            {
                index: 6,
                value: 'Venezuela'
            },
            {
                index: 15,
                value: 'Ireland'
            },
            {
                index: 14,
                value: 'UK'
            },
            {
                index: 10,
                value: 'Sweden'
            },
            {
                index: 1,
                value: 'France'
            },
            {
                index: 3,
                value: 'Brazil'
            },
            {
                index: 7,
                value: 'Austria'
            },
            {
                index: 2,
                value: 'Germany'
            },
            {
                index: 9,
                value: 'USA'
            }
        ]);
    });

    QUnit.test('Sort by summary with wrong path', function(assert) {
        const dataSource = createDataSource({
            fields: [

                { dataField: 'ShipCity', sortOrder: 'asc', sortBySummaryField: 'Freight (Avg)', area: 'row', sortBySummaryPath: [1996, 2] },

                { dataField: 'ShipVia', area: 'column' },

                { summaryType: 'count', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'avg', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'sum', area: 'data' },

                { dataField: 'ShipCountry', area: 'filter', filterValues: ['USA'] }
            ],
            store: window.orders
        });

        const data = dataSource.getData();

        assert.strictEqual(data.rows.length, 12);
        assert.strictEqual(data.rows[0].value, 'Albuquerque');
        assert.strictEqual(data.rows[1].value, 'Anchorage');
        assert.strictEqual(data.rows[5].value, 'Eugene');

        assert.strictEqual(data.rows[11].value, 'Walla Walla');
    });

    QUnit.test('Sort by summary with path expand item', function(assert) {
        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCity', sortOrder: 'asc', sortBySummaryField: 'Freight (Avg)', area: 'row', sortBySummaryPath: [1996, 2] },

                { dataField: 'OrderDate', groupInterval: 'year', dataType: 'date', area: 'column', filterValues: [1996], filterType: 'include' },

                { dataField: 'ShipVia', area: 'column' },

                { summaryType: 'count', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'avg', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'sum', area: 'data' },

                { dataField: 'ShipCountry', area: 'filter', filterValues: ['USA'] }
            ],
            store: window.orders
        });
        // act
        dataSource.expandHeaderItem('column', [1996]);
        // assert
        const data = dataSource.getData();

        assert.strictEqual(data.rows.length, 7);
        assert.strictEqual(data.rows[0].value, 'Anchorage');
        assert.strictEqual(data.rows[1].value, 'Boise');

        assert.strictEqual(data.rows[5].value, 'Lander');

        assert.strictEqual(data.rows[6].value, 'Albuquerque');
    });

    QUnit.test('Sort by summary with path collapse item', function(assert) {
        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCity', sortOrder: 'asc', sortBySummaryField: 'Freight (Avg)', area: 'row', sortBySummaryPath: [1996, 2] },

                { dataField: 'OrderDate', groupInterval: 'year', dataType: 'date', area: 'column', expanded: true, filterValues: [1996], filterType: 'include' },

                { dataField: 'ShipVia', area: 'column' },

                { summaryType: 'count', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'avg', area: 'data' },
                { dataField: 'Freight', dataType: 'number', summaryType: 'sum', area: 'data' },

                { dataField: 'ShipCountry', area: 'filter', filterValues: ['USA'] }
            ],
            store: window.orders
        });
        // Act
        dataSource.collapseHeaderItem('column', [1996]);
        // assert
        const data = dataSource.getData();

        assert.strictEqual(data.rows.length, 7);
        assert.strictEqual(data.rows[0].value, 'Albuquerque');
        assert.strictEqual(data.rows[1].value, 'Anchorage');
        assert.strictEqual(data.rows[5].value, 'Portland');

        assert.strictEqual(data.rows[6].value, 'Seattle');

        assert.strictEqual(dataSource.field('OrderDate').expanded, false);
    });


});

QUnit.module('Apply summary mode', {
    beforeEach: function() {
        const that = this;
        defaultEnvironment.beforeEach.apply(this, arguments);

        sinon.stub(summaryDisplayModesModule, 'applyDisplaySummaryMode').callsFake(function(descriptions, data) {
            that.applyDisplaySummaryModePassedData = $.extend(true, {}, data);
        });

        sinon.stub(summaryDisplayModesModule, 'applyRunningTotal').callsFake(function(descriptions, data) {
            that.applyRunningTotalPassedData = $.extend(true, {}, data);
        });
    },
    afterEach: function() {
        defaultEnvironment.afterEach.apply(this, arguments);
        summaryDisplayModesModule.applyDisplaySummaryMode.restore();
        summaryDisplayModesModule.applyRunningTotal.restore();
    }
}, () => {

    QUnit.test('apply Display Summary Mode when expressions were not used', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', area: 'column' },

                { dataField: 'ShipVia', area: 'row' },

                { summaryType: 'count', area: 'data' }
            ],
            store: this.testStore
        });


        this.storeData.columns = this.storeData.columns[0].children;

        def.resolve(this.storeData);

        assert.ok(!this.applyDisplaySummaryModePassedData);

        assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [{
            index: 2,
            value: 'Boise'
        }, {
            index: 4,
            value: 'Butte'
        }, {
            index: 3,
            value: 'Elgin'
        }], 'column');

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);

    });

    QUnit.test('load fields without area if it is used in calculateSummaryValue', function(assert) {
    // act
        const dataSource = createDataSource({
            fields: [
                { dataField: 'Field1', caption: 'Field1', visible: false },
                { dataField: '[Product].[Category]', area: 'column', areaIndex: 0 },
                { dataField: '[Ship Date].[Calendar Month]', area: 'row', areaIndex: 0, visible: false },
                { dataField: '[Ship Date].[Calendar Year]', area: 'row', areaIndex: 0, visible: true },

                { dataField: 'Product', groupName: 'Product', area: 'row' },

                { dataField: 'Product.Color', groupName: 'Product', groupIndex: 0, visible: true },
                { dataField: 'Product.Width', groupName: 'Product', groupIndex: 1 },
                { dataField: 'Product.Height', groupName: 'Product', groupIndex: 2, visible: false },

                { dataField: 'Calendar', groupName: 'Calendar', area: 'row', visible: false },

                { dataField: 'Calendar.Year', groupName: 'Calendar', groupIndex: 0, visible: true },
                { dataField: 'Calendar.Quarter', groupName: 'Calendar', groupIndex: 1, visible: true },
                { dataField: 'Calendar.Month', groupName: 'Calendar', groupIndex: 2, visible: false },

                {
                    dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0, calculateSummaryValue: function(e) {
                        return e.value('Field1') + e.value('Field1');
                    }
                }
            ],
            store: this.testStore
        });

        // assert
        const dataFields = prepareFields(this.testStore.load.lastCall.args[0].values);
        assert.equal(dataFields.length, 2);
        assert.equal(dataFields[0].dataField, '[Measures].[Customer Count]');
        assert.equal(dataFields[1].dataField, 'Field1');

        assert.strictEqual(dataSource.getAreaFields('data', true).length, 1);
    });


    QUnit.test('apply Display Summary Mode when expressions were used', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', area: 'column' },
                { dataField: 'ShipVia', area: 'row' },
                { summaryType: 'count', area: 'data', calculateSummaryValue: function() { } }
            ],
            store: this.testStore
        });

        this.storeData.columns = this.storeData.columns[0].children;

        def.resolve(this.storeData);

        assert.deepEqual(prepareLoadedData(this.applyDisplaySummaryModePassedData.rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);

        assert.deepEqual(prepareLoadedData(this.applyDisplaySummaryModePassedData.columns), [{
            index: 2,
            value: 'Boise'
        }, {
            index: 4,
            value: 'Butte'
        }, {
            index: 3,
            value: 'Elgin'
        }]);

        assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [{
            index: 2,
            value: 'Boise'
        }, {
            index: 4,
            value: 'Butte'
        }, {
            index: 3,
            value: 'Elgin'
        }], 'column');

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);

        assert.ok(summaryDisplayModesModule.applyDisplaySummaryMode.calledOnce);

        const descriptions = this.testStore.load.lastCall.args[0];
        delete descriptions.columnExpandedPaths;
        delete descriptions.rowExpandedPaths;
        assert.deepEqual(summaryDisplayModesModule.applyDisplaySummaryMode.lastCall.args[0], descriptions);
    });

    QUnit.test('apply Display Summary Mode when summaryDisplayType was used', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', area: 'column' },

                { dataField: 'ShipVia', area: 'row' },

                { summaryType: 'count', area: 'data', summaryDisplayMode: 'PercentOfColumn' }
            ],
            store: this.testStore
        });

        this.storeData.columns = this.storeData.columns[0].children;

        def.resolve(this.storeData);

        assert.deepEqual(prepareLoadedData(this.applyDisplaySummaryModePassedData.rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);

        assert.deepEqual(prepareLoadedData(this.applyDisplaySummaryModePassedData.columns), [{
            index: 2,
            value: 'Boise'
        }, {
            index: 4,
            value: 'Butte'
        }, {
            index: 3,
            value: 'Elgin'
        }]);

        assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [{
            index: 2,
            value: 'Boise'
        }, {
            index: 4,
            value: 'Butte'
        }, {
            index: 3,
            value: 'Elgin'
        }], 'column');

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);
    });

    QUnit.test('apply Display Summary Mode when runningTotal is used', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', area: 'column' },

                { dataField: 'ShipVia', area: 'row' },

                { summaryType: 'count', area: 'data', runningTotal: true }
            ],
            store: this.testStore
        });

        this.storeData.columns = this.storeData.columns[0].children;

        def.resolve(this.storeData);

        assert.ok(summaryDisplayModesModule.applyRunningTotal.calledOnce);

        assert.deepEqual(prepareLoadedData(this.applyRunningTotalPassedData.rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);

        assert.deepEqual(prepareLoadedData(this.applyRunningTotalPassedData.columns), [{
            index: 2,
            value: 'Boise'
        }, {
            index: 4,
            value: 'Butte'
        }, {
            index: 3,
            value: 'Elgin'
        }]);

        assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [{
            index: 2,
            value: 'Boise'
        }, {
            index: 4,
            value: 'Butte'
        }, {
            index: 3,
            value: 'Elgin'
        }], 'column');

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);
    });

    QUnit.test('apply Display Summary Mode when expressions were used and data is sorted', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                { dataField: 'ShipCountry', area: 'column', sortBy: 'displayText', sortOrder: 'desc' },

                { dataField: 'ShipVia', area: 'row' },

                { summaryType: 'count', area: 'data', calculateSummaryValue: function() { } }
            ],
            store: this.testStore
        });

        this.storeData.columns = this.storeData.columns[0].children;

        this.storeData.columns = $.map(this.storeData.columns, function(item) {
            item.text = item.value;
            item.value = item.index;
            return item;
        });

        def.resolve(this.storeData);

        assert.deepEqual(this.applyDisplaySummaryModePassedData.columns, [{
            index: 2,
            text: 'Boise',
            value: 2
        },
        {
            index: 3,
            text: 'Elgin',
            value: 3
        },
        {
            index: 4,
            text: 'Butte',
            value: 4
        }]);

        assert.deepEqual(dataSource.getData().columns, [
            {
                index: 3,
                text: 'Elgin',
                value: 3
            },
            {
                index: 4,
                text: 'Butte',
                value: 4
            },
            {
                index: 2,
                text: 'Boise',
                value: 2
            }
        ], 'column');
    });

    QUnit.test('apply Display Summary Mode when expressions were used when data sorted with sorting method', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const dataSource = createDataSource({
            fields: [
                {
                    dataField: 'ShipCountry', area: 'column', sortOrder: 'desc', sortingMethod: function(a, b) {
                        return b.index - a.index;
                    }
                },

                { dataField: 'ShipVia', area: 'row' },

                { summaryType: 'count', area: 'data', calculateSummaryValue: function() { } }
            ],
            store: this.testStore
        });

        this.storeData.columns = this.storeData.columns[0].children;

        def.resolve(this.storeData);

        assert.deepEqual(prepareLoadedData(this.applyDisplaySummaryModePassedData.rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);

        assert.deepEqual(prepareLoadedData(this.applyDisplaySummaryModePassedData.columns), [{
            index: 4,
            value: 'Butte'
        },
        {
            index: 3,
            value: 'Elgin'
        },
        {
            index: 2,
            value: 'Boise'
        }]);

        assert.deepEqual(prepareLoadedData(dataSource.getData().columns), [{
            index: 2,
            value: 'Boise'
        }, {
            index: 3,
            value: 'Elgin'
        }, {
            index: 4,
            value: 'Butte'
        }], 'column');

        assert.deepEqual(prepareLoadedData(dataSource.getData().rows), [
            {
                index: 3,
                value: 1985
            }, {
                index: 1,
                value: 1991
            }, {
                index: 2,
                value: 1991
            }]);
    });


});

QUnit.module('State storing', defaultEnvironment, () => {

    QUnit.test('Get current State. DataSource is not loaded', function(assert) {
        this.testStore.load.returns($.Deferred());
        this.testStore.getFields.returns($.Deferred());

        const descriptions = {
            columns: [{ dataField: 'Category', area: 'column', areaIndex: 0, sortOrder: 'desc' }, { dataField: 'SubCategory', area: 'column', areaIndex: 1, expanded: true, }],
            rows: [{ dataField: 'Year', area: 'row', areaIndex: 0, sortBySummaryPath: ['sortPath'], sortBySummaryField: '[Measures].[Customer Count]', sortOrder: 'asc' }, { dataField: 'Month', area: 'row', areaIndex: 1 }, { dataField: 'Day', area: 'row', areaIndex: 1, sortBy: 'text' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }]
        };
        const dataSource = createDataSource({
            fields: descriptions.rows.concat(descriptions.values.concat(descriptions.columns)).concat([{ dataField: 'Field1', filterValues: [1, 2, 3, 4], filterType: 'exclude' }]),
            store: this.testStore
        });

        // act
        const state = dataSource.state();

        assert.ok(state);
        assert.ok(state.fields);

        assert.deepEqual(state.rowExpandedPaths, []);
        assert.deepEqual(state.columnExpandedPaths, []);

        assert.deepEqual(state.fields.length, 7);
    });

    QUnit.test('Get current State', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const descriptions = {
            columns: [{ dataField: 'Category', area: 'column', areaIndex: 0, sortOrder: 'desc', name: 'CategoryField' }, { dataField: 'SubCategory', area: 'column', areaIndex: 1, expanded: true }],
            rows: [{ dataField: 'Year', area: 'row', areaIndex: 0, sortBySummaryPath: ['sortPath'], sortBySummaryField: '[Measures].[Customer Count]', sortOrder: 'asc' }, { dataField: 'Month', area: 'row', areaIndex: 1 }, { dataField: 'Day', area: 'row', areaIndex: 1, sortBy: 'text' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0, summaryType: 'sum', summaryDisplayMode: 'absoluteVariation' }]
        };
        const dataSource = createDataSource({
            fields: descriptions.rows.concat(descriptions.values.concat(descriptions.columns)).concat([{ dataField: 'Field1', filterValues: [1, 2, 3, 4], filterType: 'exclude' }]),
            store: this.testStore
        });

        def.resolve({
            columns: [{
                value: 'Cat1',
                index: 1
            }, {
                value: 'Cat2',
                index: 2,
                children: [{
                    index: 3,
                    value: 'SubCat1'
                }]
            }],
            rows: [{
                value: '2005',
                index: 1,
                children: [{
                    value: 'January',
                    index: 2,
                    children: [{
                        value: '1',
                        index: 3
                    },
                    {
                        value: '2',
                        index: 4
                    }]
                }]
            }, {
                value: '2006',
                index: 5
            },
            {
                value: '2007',
                index: 5,
                children: [
                    {
                        value: 'January',
                        index: 6
                    }
                ]
            }
            ],
            values: [[[1], [2], [3], [4], [5]],
                [[6], [7], [8], [9], [10]],
                [[11], [12], [13], [14], [15]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        });

        // act
        const state = dataSource.state();

        assert.ok(state);
        assert.ok(state.fields);

        assert.deepEqual(state.rowExpandedPaths, [['2005'], ['2005', 'January'], ['2007']]);
        assert.deepEqual(state.columnExpandedPaths, [['Cat2']]);


        assert.deepEqual(state.fields, [{
            'area': 'row',
            'areaIndex': 0,
            'expanded': undefined,
            name: undefined,
            'dataField': 'Year',
            'filterType': undefined,
            'filterValues': undefined,
            'sortBy': undefined,
            'sortBySummaryField': '[Measures].[Customer Count]',
            'sortBySummaryPath': [
                'sortPath'
            ],
            'sortOrder': 'asc',
            summaryType: undefined,
            summaryDisplayMode: undefined
        },
        {
            'area': 'row',
            'dataField': 'Month',
            'areaIndex': 1,
            name: undefined,
            'expanded': undefined,
            'filterType': undefined,
            'filterValues': undefined,
            'sortBy': undefined,
            'sortBySummaryField': undefined,
            'sortBySummaryPath': undefined,
            'sortOrder': undefined,
            summaryType: undefined,
            summaryDisplayMode: undefined
        },
        {
            'area': 'row',
            'areaIndex': 2,
            name: undefined,
            'expanded': undefined,
            'dataField': 'Day',
            'filterType': undefined,
            'filterValues': undefined,
            'sortBy': 'text',
            'sortBySummaryField': undefined,
            'sortBySummaryPath': undefined,
            'sortOrder': undefined,
            summaryType: undefined,
            summaryDisplayMode: undefined
        },
        {
            'area': 'data',
            'areaIndex': 0,
            'expanded': undefined,
            name: undefined,
            'dataField': '[Measures].[Customer Count]',
            'filterType': undefined,
            'filterValues': undefined,
            'sortBy': undefined,
            'sortBySummaryField': undefined,
            'sortBySummaryPath': undefined,
            'sortOrder': undefined,
            summaryType: 'sum',
            summaryDisplayMode: 'absoluteVariation'
        },
        {
            'area': 'column',
            'areaIndex': 0,
            'dataField': 'Category',
            name: 'CategoryField',
            'expanded': undefined,
            'filterType': undefined,
            'filterValues': undefined,
            'sortBy': undefined,
            'sortBySummaryField': undefined,
            'sortBySummaryPath': undefined,
            'sortOrder': 'desc',
            summaryType: undefined,
            summaryDisplayMode: undefined
        },
        {
            'area': 'column',
            'areaIndex': 1,
            'expanded': true,
            name: undefined,
            dataField: 'SubCategory',
            'filterType': undefined,
            'filterValues': undefined,
            'sortBy': undefined,
            'sortBySummaryField': undefined,
            'sortBySummaryPath': undefined,
            'sortOrder': undefined,
            summaryType: undefined,
            summaryDisplayMode: undefined
        },
        {
            'area': undefined,
            'areaIndex': undefined,
            name: undefined,
            'expanded': undefined,
            'dataField': 'Field1',
            'filterType': 'exclude',
            'filterValues': [
                1,
                2,
                3,
                4
            ],
            'sortBy': undefined,
            'sortBySummaryField': undefined,
            'sortBySummaryPath': undefined,
            'sortOrder': undefined,
            summaryType: undefined,
            summaryDisplayMode: undefined
        }]);

    });

    QUnit.test('Set State', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const descriptions = {
            columns: [{ dataField: 'Category', area: 'column', areaIndex: 0, sortOrder: 'asc' }, { dataField: 'Month', area: 'column', areaIndex: 1 }],
            rows: [{ dataField: 'Year', area: 'row', areaIndex: 0, sortOrder: 'desc' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }]
        };
        const dataSource = createDataSource({
            fields: descriptions.rows.concat(descriptions.values.concat(descriptions.columns)).concat([
                { dataField: 'Field1', filterValues: [1, 2], filterType: 'exclude' },
                { dataField: 'SubCategory' },
                { dataField: 'Day', sortBy: 'value' }
            ]),
            store: this.testStore
        });

        def.resolve({
            columns: [{
                value: 'Cat1',
                index: 1
            }, {
                value: 'Cat2',
                index: 2,
            }],
            rows: [{
                value: '2005',
                index: 1,
            }, {
                value: '2006',
                index: 5
            },
            {
                value: '2007',
                index: 5
            }],
            values: [[[1], [2], [3], [4], [5]],
                [[6], [7], [8], [9], [10]],
                [[11], [12], [13], [14], [15]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        });

        this.testStore.load.reset();

        // act
        dataSource.state({
            rowExpandedPaths: [['2005'], ['2005', 'January'], ['2007']],
            columnExpandedPaths: [['Cat2']],
            fields: [{
                'area': 'row',
                'dataField': 'Year',
                'areaIndex': 0,
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'sortBy': undefined,
                'sortBySummaryField': '[Measures].[Customer Count]',
                'sortBySummaryPath': [
                    'sortPath'
                ],
                'sortOrder': 'asc'
            },
            {
                'area': 'row',
                'areaIndex': 1,
                'dataField': '[Measures].[Customer Count]',
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': undefined
            },
            {
                'area': 'row',
                'areaIndex': 2,
                'dataField': 'Category',
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'sortBy': 'text',
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': 'asc'
            },
            {
                'area': 'data',
                'areaIndex': 0,
                'expanded': undefined,
                'dataField': 'Month',
                'filterType': undefined,
                'filterValues': undefined,
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': 'asc',
                summaryType: 'count',
                summaryDisplayMode: 'absoluteVariation'
            },
            {
                'area': 'column',
                'areaIndex': 0,
                'dataField': 'Field1',
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': 'desc'
            },
            {
                'area': 'column',
                'areaIndex': 1,
                'dataField': 'SubCategory',
                'expanded': true,
                'filterType': undefined,
                'filterValues': undefined,
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': 'asc'
            },
            {
                'area': undefined,
                'areaIndex': undefined,
                'expanded': undefined,
                'filterType': 'exclude',
                'dataField': 'Day',
                'filterValues': [
                    1,
                    2,
                    3,
                    4
                ],
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': 'asc'
            }]
        });

        // Assert
        assert.ok(this.testStore.load.calledOnce);
        assert.deepEqual(this.testStore.load.lastCall.args[0].rowExpandedPaths, [['2005'], ['2005', 'January'], ['2007']]);
        assert.deepEqual(this.testStore.load.lastCall.args[0].columnExpandedPaths, [['Cat2']]);

        $.each(dataSource.fields(), function(index, field) {
            assert.strictEqual(field.index, index);
        });

        assert.deepEqual(prepareFields(dataSource.fields()), [{
            'area': 'row',
            'areaIndex': 0,
            'caption': 'Year',
            'dataField': 'Year',
            'expanded': undefined,
            'filterType': undefined,
            'filterValues': undefined,
            'sortBy': undefined,
            'sortBySummaryField': '[Measures].[Customer Count]',
            'sortBySummaryPath': [
                'sortPath'
            ],
            'sortOrder': 'asc'
        },
        {
            'area': 'row',
            'areaIndex': 1,
            'caption': 'Count',
            'dataField': '[Measures].[Customer Count]',
            'expanded': undefined,
            'filterType': undefined,
            'filterValues': undefined,
            'sortBy': undefined,
            'sortBySummaryField': undefined,
            'sortBySummaryPath': undefined,
            'sortOrder': undefined
        },
        {
            'area': 'row',
            'areaIndex': 2,
            'caption': 'Category',
            'dataField': 'Category',
            'expanded': undefined,
            'filterType': undefined,
            'filterValues': undefined,
            'sortBy': 'text',
            'sortBySummaryField': undefined,
            'sortBySummaryPath': undefined,
            'sortOrder': 'asc'
        },
        {
            'area': 'data',
            'areaIndex': 0,
            'caption': 'Month (Count)',
            'dataField': 'Month',
            'expanded': undefined,
            'filterType': undefined,
            'filterValues': undefined,
            'sortBy': undefined,
            'sortBySummaryField': undefined,
            'sortBySummaryPath': undefined,
            'sortOrder': 'asc',
            summaryType: 'count',
            summaryDisplayMode: 'absoluteVariation'
        },
        {
            'area': 'column',
            'areaIndex': 0,
            'caption': 'Field1',
            'dataField': 'Field1',
            'expanded': undefined,
            'filterType': undefined,
            'filterValues': undefined,
            'sortBy': undefined,
            'sortBySummaryField': undefined,
            'sortBySummaryPath': undefined,
            'sortOrder': 'desc'
        },
        {
            'area': 'column',
            'areaIndex': 1,
            'caption': 'Sub Category',
            'dataField': 'SubCategory',
            'expanded': true,
            'filterType': undefined,
            'filterValues': undefined,
            'sortBy': undefined,
            'sortBySummaryField': undefined,
            'sortBySummaryPath': undefined,
            'sortOrder': 'asc'
        },
        {
            'area': undefined,
            'areaIndex': undefined,
            'caption': 'Day',
            'dataField': 'Day',
            'expanded': undefined,
            'filterType': 'exclude',
            'filterValues': [
                1,
                2,
                3,
                4
            ],
            'sortBy': undefined,
            'sortBySummaryField': undefined,
            'sortBySummaryPath': undefined,
            'sortOrder': 'asc'
        }]);

    });

    QUnit.test('T399271: dxPivotGrid - It is impossible to apply the state of a grid saved in v15.2 to a grid in v16.1', function(assert) {
        const dataSource = createDataSource({
            fields: [
                { dataField: 'Field1', summaryType: 'sum', summaryDisplayMode: 'percentOfGrandTotal', area: 'row' },
                { dataField: 'Field2', summaryType: 'sum', summaryDisplayMode: 'percentOfGrandTotal' },
                { dataField: 'Field3', summaryType: 'sum', summaryDisplayMode: 'percentOfGrandTotal' }
            ],
            store: this.testStore
        });

        // act
        dataSource.state({
            fields: [
                { dataField: 'Field1', summaryType: 'avg', summaryDisplayMode: 'percentOfRowGrandTotal' },
                { dataField: 'Field2', summaryType: undefined, summaryDisplayMode: undefined },
                { dataField: 'Field3', area: 'row' }
            ]
        });

        // Assert
        assert.deepEqual(prepareFields(dataSource.fields()), [
            {
                area: undefined,
                areaIndex: undefined,
                caption: 'Field1 (Avg)',
                dataField: 'Field1',
                expanded: undefined,
                filterType: undefined,
                filterValues: undefined,
                sortBy: undefined,
                sortBySummaryField: undefined,
                sortBySummaryPath: undefined,
                sortOrder: undefined,
                summaryDisplayMode: 'percentOfRowGrandTotal',
                summaryType: 'avg'
            },
            {
                area: undefined,
                areaIndex: undefined,
                caption: 'Field2 (Sum)',
                dataField: 'Field2',
                expanded: undefined,
                filterType: undefined,
                filterValues: undefined,
                sortBy: undefined,
                sortBySummaryField: undefined,
                sortBySummaryPath: undefined,
                sortOrder: undefined,
                summaryDisplayMode: 'percentOfGrandTotal',
                summaryType: 'sum'
            },
            {
                area: 'row',
                areaIndex: 0,
                caption: 'Field3 (Sum)',
                dataField: 'Field3',
                expanded: undefined,
                filterType: undefined,
                filterValues: undefined,
                sortBy: undefined,
                sortBySummaryField: undefined,
                sortBySummaryPath: undefined,
                sortOrder: undefined,
                summaryDisplayMode: 'percentOfGrandTotal',
                summaryType: 'sum'
            }
        ]);

    });

    QUnit.test('Set State. After new field have added. T389504', function(assert) {
        this.testStore.load.returns($.Deferred());
        const fields = [
            { dataField: 'Field1', groupName: 'Group1', area: 'column', name: 'Name1' },
            { groupName: 'Group1', groupIndex: 0 },
            { groupName: 'Group1', dataField: 'Field2', groupIndex: 1 },
            { dataField: 'Field3', area: 'row' },
            { dataField: 'Field4' },
            { dataField: 'Field5', area: 'data', summaryType: 'sum' },
            { summaryType: 'count' },
            { dataField: 'Field5', area: 'data', summaryType: 'avg' }
        ];
        const dataSource = createDataSource({
            fields: fields,
            store: this.testStore
        });

        const state = dataSource.state();
        dataSource.fields([{ dataField: 'Field6' }].concat(fields));

        // act
        this.testStore.load.reset();
        dataSource.state(state);

        // Assert
        assert.ok(this.testStore.load.calledOnce);

        $.each(dataSource.fields(), function(index, field) {
            assert.strictEqual(field.index, index);
        });

        assert.deepEqual(prepareFields(dataSource.fields()), [
            {
                caption: 'Field6',
                dataField: 'Field6'
            },
            {
                'area': 'column',
                'areaIndex': 0,
                'caption': 'Field1',
                'dataField': 'Field1',
                name: 'Name1',
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'groupName': 'Group1',
                'levels': [
                    {
                        'area': 'column',
                        'areaIndex': 0,
                        'caption': 'Field1',
                        'dataField': 'Field1',
                        'expanded': undefined,
                        'filterType': undefined,
                        'filterValues': undefined,
                        'groupIndex': 0,
                        'groupName': 'Group1',
                        'sortBy': undefined,
                        'sortBySummaryField': undefined,
                        'sortBySummaryPath': undefined,
                        'sortOrder': undefined
                    },
                    {
                        'area': 'column',
                        'areaIndex': 0,
                        'caption': 'Field2',
                        'dataField': 'Field2',
                        'expanded': undefined,
                        'filterType': undefined,
                        'filterValues': undefined,
                        'groupIndex': 1,
                        'groupName': 'Group1',
                        'sortBy': undefined,
                        'sortBySummaryField': undefined,
                        'sortBySummaryPath': undefined,
                        'sortOrder': undefined
                    }
                ],
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': undefined
            },
            {
                'area': 'column',
                'areaIndex': 0,
                'caption': 'Field1',
                'dataField': 'Field1',
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'groupIndex': 0,
                'groupName': 'Group1',
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': undefined
            },
            {
                'area': 'column',
                'areaIndex': 0,
                'caption': 'Field2',
                'dataField': 'Field2',
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'groupIndex': 1,
                'groupName': 'Group1',
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': undefined
            },
            {
                'area': 'row',
                'areaIndex': 0,
                'caption': 'Field3',
                'dataField': 'Field3',
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': undefined
            },
            {
                'area': undefined,
                'areaIndex': undefined,
                'caption': 'Field4',
                'dataField': 'Field4',
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': undefined
            },
            {
                'area': 'data',
                'areaIndex': 0,
                'caption': 'Field5 (Sum)',
                'dataField': 'Field5',
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': undefined,
                'summaryType': 'sum'
            },
            {
                'area': undefined,
                'areaIndex': undefined,
                'caption': 'Count',
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': undefined,
                'summaryType': 'count'
            },
            {
                'area': 'data',
                'areaIndex': 1,
                'caption': 'Field5 (Avg)',
                'dataField': 'Field5',
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'sortBy': undefined,
                'sortBySummaryField': undefined,
                'sortBySummaryPath': undefined,
                'sortOrder': undefined,
                'summaryType': 'avg'
            }
        ]);

    });

    QUnit.test('groupIndex should be assinged to group field with groupInterval (T892304)', function(assert) {
        this.testStore.load.returns($.Deferred());
        const dataSource = createDataSource({
            fields: [
                { groupName: 'date', dataField: 'date', area: 'column', dataType: 'date' },
                { groupName: 'date', groupInterval: 'year', groupIndex: 0 },
                { groupName: 'date', groupInterval: 'month', groupIndex: 1 },
                { groupName: 'date', groupInterval: 'day' }
            ],
            store: this.testStore
        });

        // act
        const state = dataSource.state();
        dataSource.state(state);

        // Assert
        assert.equal(this.testStore.load.callCount, 2);
        assert.equal(dataSource.fields().length, 4, 'field count');
        assert.deepEqual(dataSource.fields()[0].levels.map(l => l.groupInterval), ['year', 'month', 'day'], 'group levels');
        assert.equal(dataSource.fields()[3].groupInterval, 'day', 'last field groupInterval');
        assert.equal(dataSource.fields()[3].groupIndex, 2, 'last field groupIndex');
    });

    QUnit.test('groupIndex should be assinged to all group field with groupInterval (T892304)', function(assert) {
        this.testStore.load.returns($.Deferred());
        const dataSource = createDataSource({
            fields: [
                { groupName: 'date', dataField: 'date', area: 'column', dataType: 'date' },
                { groupName: 'date', groupInterval: 'year' },
                { groupName: 'date', groupInterval: 'month' },
                { groupName: 'date', groupInterval: 'day' }
            ],
            store: this.testStore
        });

        // act
        const state = dataSource.state();
        dataSource.state(state);

        // Assert
        assert.equal(this.testStore.load.callCount, 2);
        assert.equal(dataSource.fields().length, 4, 'field count');
        assert.deepEqual(dataSource.fields()[0].levels.map(l => l.groupInterval), ['year', 'month', 'day'], 'group levels');
        assert.deepEqual(dataSource.fields().map(l => l.groupIndex), [undefined, 0, 1, 2], 'assigned groupIndexes');
    });

    QUnit.test('Set state if field with groupInterval and without groupIndex exists (T892304)', function(assert) {
        this.testStore.load.returns($.Deferred());
        const dataSource = createDataSource({
            fields: [
                { groupName: 'date', dataField: 'date', area: 'column', dataType: 'date' },
                { groupName: 'date', groupInterval: 'year', groupIndex: 0 },
                { groupName: 'date', groupInterval: 'month', groupIndex: 1 },
                { groupName: 'date', groupInterval: 'day', visible: false }
            ],
            store: this.testStore
        });

        // act
        const state = dataSource.state();
        dataSource.state(state);

        // Assert
        assert.equal(this.testStore.load.callCount, 2);
        assert.equal(dataSource.fields().length, 4, 'field count');
        assert.deepEqual(dataSource.fields()[0].levels.map(l => l.groupInterval), ['year', 'month'], 'group levels');
        assert.equal(dataSource.fields()[3].groupInterval, 'day', 'last field groupInterval');
        assert.equal(dataSource.fields()[3].groupIndex, 2, 'last field groupIndex');
    });

    QUnit.test('Set State state fields count less fields count', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const descriptions = {
            columns: [{ dataField: 'Category', area: 'column', areaIndex: 0, sortOrder: 'asc' }, { dataField: 'Month', area: 'column', areaIndex: 1 }],
            rows: [{ dataField: 'Year', area: 'row', areaIndex: 0, sortOrder: 'desc' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }]
        };
        const dataSource = createDataSource({
            fields: descriptions.rows.concat(descriptions.values.concat(descriptions.columns)).concat([
                { dataField: 'Field1', filterValues: [1, 2], filterType: 'exclude' },
                { dataField: 'SubCategory' },
                { dataField: 'Day', sortBy: 'value' }
            ]),
            store: this.testStore
        });

        def.resolve({
            columns: [{
                value: 'Cat1',
                index: 1
            }, {
                value: 'Cat2',
                index: 2,
            }],
            rows: [{
                value: '2005',
                index: 1,
            }, {
                value: '2006',
                index: 5
            },
            {
                value: '2007',
                index: 5
            }],
            values: [[[1], [2], [3], [4], [5]],
                [[6], [7], [8], [9], [10]],
                [[11], [12], [13], [14], [15]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        });

        this.testStore.load.reset();

        // act
        dataSource.state({
            rowExpandedPaths: [['2005'], ['2005', 'January'], ['2007']],
            columnExpandedPaths: [['Cat2']],
            fields: [{
                'area': 'row',
                'areaIndex': 0,
                'expanded': undefined,
                'filterType': undefined,
                'filterValues': undefined,
                'sortBy': undefined,
                'sortBySummaryField': '[Measures].[Customer Count]',
                'sortBySummaryPath': [
                    'sortPath'
                ],
                'sortOrder': 'asc'
            }]
        });

        // Assert
        assert.ok(this.testStore.load.calledOnce);
        assert.deepEqual(this.testStore.load.lastCall.args[0].rowExpandedPaths, [['2005'], ['2005', 'January'], ['2007']]);
        assert.deepEqual(this.testStore.load.lastCall.args[0].columnExpandedPaths, [['Cat2']]);

        assert.strictEqual(dataSource.fields().length, 7);

    });

    QUnit.test('Set State without fields', function(assert) {
        const def = $.Deferred();

        this.testStore.load.returns(def);

        const descriptions = {
            columns: [{ dataField: 'Category', area: 'column', areaIndex: 0, sortOrder: 'asc' }, { dataField: 'Month', area: 'column', areaIndex: 1 }],
            rows: [{ dataField: 'Year', area: 'row', areaIndex: 0, sortOrder: 'desc' }],
            values: [{ dataField: '[Measures].[Customer Count]', caption: 'Count', area: 'data', areaIndex: 0 }]
        };
        const dataSource = createDataSource({
            fields: descriptions.rows.concat(descriptions.values.concat(descriptions.columns)).concat([
                { dataField: 'Field1', filterValues: [1, 2], filterType: 'exclude' },
                { dataField: 'SubCategory' },
                { dataField: 'Day', sortBy: 'value' }
            ]),
            store: this.testStore
        });

        def.resolve({
            columns: [{
                value: 'Cat1',
                index: 1
            }, {
                value: 'Cat2',
                index: 2,
            }],
            rows: [{
                value: '2005',
                index: 1,
            }, {
                value: '2006',
                index: 5
            },
            {
                value: '2007',
                index: 5
            }],
            values: [[[1], [2], [3], [4], [5]],
                [[6], [7], [8], [9], [10]],
                [[11], [12], [13], [14], [15]]
            ],
            grandTotalColumnIndex: 0,
            grandTotalRowIndex: 0
        });

        this.testStore.load.reset();

        // act
        dataSource.state({
            rowExpandedPaths: [['2005'], ['2005', 'January'], ['2007']],
            columnExpandedPaths: [['Cat2']]
        });

        // Assert
        assert.ok(this.testStore.load.calledOnce);
        assert.deepEqual(this.testStore.load.lastCall.args[0].rowExpandedPaths, [['2005'], ['2005', 'January'], ['2007']]);
        assert.deepEqual(this.testStore.load.lastCall.args[0].columnExpandedPaths, [['Cat2']]);

        assert.strictEqual(dataSource.fields().length, 7);

    });

    QUnit.test('set state when store fields not loaded', function(assert) {
        const retrieveFieldsDef = $.Deferred();
        const fieldsPrepared = sinon.stub();

        this.testStore.getFields.returns(retrieveFieldsDef);
        // act

        const dataSource = new PivotGridDataSource({
            fields: [],
            store: this.testStore,
            retrieveFields: true
        });

        dataSource.on('fieldsPrepared', fieldsPrepared);

        dataSource.state({
            rowExpandedPaths: [],
            columnExpandedPaths: [],
            fields: [{ area: 'row', dataField: 'Category' }, { area: 'column', dataField: 'Year' }]
        });

        assert.ok(dataSource.isLoading(), 'dataSource loads fields');
        retrieveFieldsDef.resolve([
            { dataField: 'Category' },
            { dataField: 'Year' }
        ]);


        assert.ok(fieldsPrepared.calledOnce);
        assert.strictEqual(fieldsPrepared.lastCall.args[0].length, 2);

        assert.ok(this.testStore.load.calledOnce);

        assert.deepEqual(this.testStore.load.lastCall.args[0].columns, [dataSource.field('Year')]);
        assert.deepEqual(this.testStore.load.lastCall.args[0].rows, [dataSource.field('Category')]);

        assert.ok(!dataSource.isLoading());

    });

    QUnit.test('Set default state', function(assert) {
        const dataSource = new PivotGridDataSource({
            fields: [
                { dataField: 'Field1', area: 'row' },
                { dataField: 'Field2', area: 'column', sortOrder: 'asc' }
            ],
            store: this.testStore
        });

        dataSource.field('Field1', { area: 'column', sortOrder: 'desc' });
        dataSource.field('Field2', { area: undefined });

        this.testStore.load.reset();
        // act
        dataSource.state(null);

        assert.deepEqual(prepareFields(dataSource.fields()), [{
            area: 'row',
            areaIndex: 0,
            dataField: 'Field1',
            caption: 'Field1',
            sortOrder: undefined
        },
        {
            area: 'column',
            areaIndex: 0,
            dataField: 'Field2',
            caption: 'Field2',
            sortOrder: 'asc'
        }]);

        assert.ok(this.testStore.load.calledOnce);

        const storeLoadArgs = this.testStore.load.lastCall.args[0];

        assert.deepEqual(storeLoadArgs, {
            columns: [dataSource.fields()[1]],
            rows: [dataSource.fields()[0]],
            filters: [],
            values: [],
            rowExpandedPaths: [],
            columnExpandedPaths: []
        });
    });

    QUnit.test('T388396. update auto generated caption if state is reset', function(assert) {
        const dataSource = new PivotGridDataSource({
            fields: [
                { dataField: 'Field1', area: 'data', summaryType: 'sum' },
            ],
            store: this.testStore
        });

        dataSource.field('Field1', { summaryType: 'count' });

        // act
        dataSource.state(null);

        assert.deepEqual(prepareFields(dataSource.fields()), [{
            area: 'data',
            areaIndex: 0,
            dataField: 'Field1',
            caption: 'Field1 (Sum)',
            summaryType: 'sum'
        }]);
    });

    QUnit.test('reset expanded paths', function(assert) {
        this.testStore.load.returns($.Deferred().resolve({
            rows: [{ value: '1', children: [{ value: '11' }] }],
            columns: [{ value: '2', children: [{ value: '22' }] }],
            values: []
        }));

        const dataSource = new PivotGridDataSource({
            fields: [
                { dataField: 'Field1', area: 'row' },
                { dataField: 'Field2', area: 'row' },

                { dataField: 'Field1', area: 'column' },
                { dataField: 'Field2', area: 'column' }
            ],
            store: this.testStore
        });
        dataSource.load();

        this.testStore.load.reset();

        // act
        dataSource.state(null);

        prepareFields(dataSource.fields());

        assert.ok(this.testStore.load.calledOnce);

        const storeLoadArgs = this.testStore.load.lastCall.args[0];

        assert.deepEqual(storeLoadArgs.rowExpandedPaths, []);
        assert.deepEqual(storeLoadArgs.columnExpandedPaths, []);
    });


});

QUnit.module('Stores', () => {

    QUnit.test('All stores implement correct interface', function(assert) {
        const methods = ['load', 'key', 'createDrillDownDataSource', 'getFields', 'filter'];
        $.each([XmlaStore, LocalStore, RemoteStore], function(i, Store) {
            const store = new Store({});

            $.each(methods, function(_, methodName) {
                assert.equal(typeof store[methodName], 'function', i + ' Store should implement ' + methodName);
            });
        });
    });


});

