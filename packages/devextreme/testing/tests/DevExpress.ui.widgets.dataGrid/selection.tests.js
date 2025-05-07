import 'ui/data_grid';
import 'common/data/odata/store';

import $ from 'jquery';
import { setupDataGridModules, generateItems } from '../../helpers/dataGridMocks.js';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';
import { CustomStore } from 'common/data/custom_store';
import DataGridWrapper from '../../helpers/wrappers/dataGridWrappers.js';
import clickEvent from 'common/core/events/click';
import errors from 'ui/widget/ui.errors';

const dataGridWrapper = new DataGridWrapper('#container');

const createDataSource = function(data, storeOptions, dataSourceOptions) {
    const arrayStore = new ArrayStore(storeOptions ? $.extend(true, { data: data }, storeOptions) : data);
    const dataSource = new DataSource($.extend(true, { store: arrayStore, requireTotalCount: true, _preferSync: true }, dataSourceOptions));
    return dataSource;
};

const setupModule = function() {
    setupDataGridModules(this, ['data', 'columns', 'selection', 'stateStoring', 'grouping', 'filterRow', 'search']);

    this.applyOptions = function(options) {
        $.extend(this.options, options);
        this.columnsController.init();
        this.selectionController.init();
    };

    this.clock = sinon.useFakeTimers();
};

const teardownModule = function() {
    this.dispose();
    this.clock.restore();
};

const setupSelectionModule = function() {
    setupModule.apply(this);

    this.applyOptions({ columns: ['name', 'age'] });

    this.array = [
        { name: 'Alex', age: 15 },
        { name: 'Dan', age: 16 },
        { name: 'Vadim', age: 17 },
        { name: 'Dmitry', age: 18 },
        { name: 'Sergey', age: 18 },
        { name: 'Kate', age: 20 },
        { name: 'Dan', age: 21 }
    ];

    this.dataSource = createDataSource(this.array);
    this.dataController.setDataSource(this.dataSource);
    this.dataSource.load();
};

const teardownSelectionModule = function() {
    teardownModule.apply(this);
};

QUnit.testStart(function() {
    const markup =
        `<div>
            <div id="container" class="dx-datagrid"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

QUnit.module('Selection', { beforeEach: setupSelectionModule, afterEach: teardownSelectionModule }, () => {

    QUnit.test('Disabled selection', function(assert) {
        this.applyOptions({
            selection: { mode: 'none' }
        });

        // act
        this.selectionController.selectRows([{ name: 'Dan', age: 16 }]);

        // assert
        assert.equal(this.dataController.items().length, 7);
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);

        // act
        this.selectionController.changeItemSelection(0);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);
        assert.equal(this.selectionController.focusedItemIndex(), -1);
    });

    QUnit.test('set selectedRows for single selection. Array parameter with one object', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }]);

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);

        assert.deepEqual(this.selectionController.option('selectedRowKeys'), [{ name: 'Dan', age: 16 }]);
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[0].focused);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[1].focused);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[2].focused);
    });

    QUnit.test('check selection options for selection controller', function(assert) {

        this.applyOptions({
            selection: {
                deferred: false,
                maxFilterLengthInRequest: 10,
                mode: 'single'
            },
            selectionFilter: 'filterValue',
            selectedRowKeys: 'rowKeys',
        });

        const selectionOptions = this.selectionController._getSelectionConfig();
        assert.strictEqual(selectionOptions.maxFilterLengthInRequest, 10);
        assert.strictEqual(selectionOptions.mode, 'single');
        assert.strictEqual(selectionOptions.deferred, false);
        assert.strictEqual(selectionOptions.selectionFilter, 'filterValue');
        assert.strictEqual(selectionOptions.selectedKeys, 'rowKeys');
    });

    QUnit.test('set selectedRows. Array parameter with one object and parameter preserve is true', function(assert) {
    // arrange
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Vadim', age: 17 }]);

        // act
        this.selectionController.selectRows([{ name: 'Vadim', age: 17 }, { name: 'Dmitry', age: 18 }], true);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Vadim', age: 17 }, { name: 'Dmitry', age: 18 }]);
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
        assert.ok(!this.dataController.items()[4].isSelected);
        assert.ok(!this.dataController.items()[5].isSelected);
        assert.ok(!this.dataController.items()[6].isSelected);
    });

    QUnit.test('set selectedRows. Done callback', function(assert) {
        let finalized;

        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }]).done(function(selectedRows) {
            assert.deepEqual(selectedRows, [{ name: 'Dan', age: 16 }]);
            finalized = true;
        });

        this.clock.tick(10);

        // assert
        assert.ok(finalized);
    });

    QUnit.test('set selectedRows for single selection. Several objects in array. selectRows not depends on selection mode', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Vadim', age: 17 }]);

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Vadim', age: 17 }]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[0].focused);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[1].focused);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[2].focused);
    });

    // T453514
    QUnit.test('set selectedRows after modify keys returned by getSelectedRowKeys', function(assert) {
        let onSelectionCounter = 0;
        let selectionChangedArgs;
        this.applyOptions({
            selection: { mode: 'single' },
            onSelectionChanged: function(e) {
                selectionChangedArgs = e;
                onSelectionCounter++;
            }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Vadim', age: 17 }]);

        // act
        const keys = this.selectionController.getSelectedRowKeys();
        keys.shift();
        onSelectionCounter = 0;
        this.selectionController.selectRows(keys);

        // assert
        assert.strictEqual(onSelectionCounter, 1, 'onSelectedChanged is called');
        assert.deepEqual(selectionChangedArgs.currentSelectedRowKeys, []);
        assert.deepEqual(selectionChangedArgs.currentDeselectedRowKeys, [{ name: 'Dan', age: 16 }]);

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);
        assert.deepEqual(this.selectionController.getSelectedRowsData(), [{ name: 'Vadim', age: 17 }]);
    });

    // T443719
    QUnit.test('getSelectedRowKeys and getSelectedRowsData should returns array copy', function(assert) {
        const keys = this.selectionController.getSelectedRowKeys();

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }], true);

        // assert
        assert.deepEqual(keys, [], 'old keys are no modified');
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);
        assert.notStrictEqual(this.selectionController.getSelectedRowKeys(), this.selectionController.getSelectedRowKeys(), 'selected keys are not equals by reference');
        assert.notStrictEqual(this.selectionController.getSelectedRowsData(), this.selectionController.getSelectedRowsData(), 'selected data are not equals by reference');
    });

    QUnit.test('set selectedRows for single selection. Object parameter', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.selectRows({ name: 'Dan', age: 16 });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);

        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[1].focused);
    });

    QUnit.test('set selectedRows. Object parameter and parameter preserve is true', function(assert) {
    // arrange
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.selectRows({ name: 'Dan', age: 16 });

        // act
        this.selectionController.selectRows({ name: 'Dmitry', age: 18 }, true);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
        assert.ok(!this.dataController.items()[4].isSelected);
        assert.ok(!this.dataController.items()[5].isSelected);
        assert.ok(!this.dataController.items()[6].isSelected);
    });

    // B251864
    QUnit.test('set selectedRows for single selection. Object parameter with array field', function(assert) {
        const array = [
            { name: 'Alex', comments: [] },
            { name: 'Alex', comments: ['Comment 1'] },
            { name: 'Dan', comments: ['Comment 1', 'Comment 2'] },
            { name: 'Vadim', comments: ['Comment 1', 'Comment 2', 'Comment 3'] }
        ];

        this.dataSource = createDataSource(array);
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.selectRows({ name: 'Alex', comments: ['Comment 1'] });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Alex', comments: ['Comment 1'] }]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[3].isSelected);
    });

    QUnit.test('set selectedRows for single selection. Object parameter with object field', function(assert) {
        const array = [
            { name: 'Alex', address: { country: 'USA', city: 'New York' } },
            { name: 'Alex', address: { country: 'USA', city: 'Chicago' } },
            { name: 'Dan', address: { country: 'Russia', city: 'Moscow' } },
            { name: 'Vadim', address: { country: 'USA', city: 'Chicago' } }
        ];

        this.dataSource = createDataSource(array);
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.selectRows({ name: 'Alex', address: { country: 'USA', city: 'Chicago' } });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Alex', address: { country: 'USA', city: 'Chicago' } }]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[3].isSelected);
    });

    // T122304
    QUnit.test('set selectedRows for single selection. Object with the level of embedding > 2', function(assert) {
    // arrange
        const array = [
            { name: 'Alex', address: { country: { name: 'USA', city: { name: 'New York' } } } },
            { name: 'Alex', address: { country: { name: 'USA', city: { name: 'Chicago' } } } }
        ];

        this.dataSource = createDataSource(array);
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.applyOptions({
            selection: { mode: 'single' }
        });

        // act
        this.selectionController.selectRows({ name: 'Alex', address: { country: { name: 'USA', city: { name: 'Chicago' } } } });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Alex', address: { country: { name: 'USA', city: { name: 'Chicago' } } } }]);
        assert.notOk(this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
    });

    // T122304
    QUnit.test('set selectedRows for single selection. Recursive object', function(assert) {
    // arrange
        const item1 = { name: 'Alex', address: { country: 'USA', city: 'New York' } };
        const item2 = { name: 'Dan', address: { country: 'USA', city: 'Chicago' } };

        item1.item = item1;
        item2.item = item2;

        const array = [item1, item2];

        this.dataSource = createDataSource(array);
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.applyOptions({
            selection: { mode: 'single' }
        });

        // act
        this.selectionController.selectRows(item2);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [item2]);
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
    });

    // T119761
    QUnit.test('set selectedRows for single selection. Object with the property dataType is date', function(assert) {
    // arrange
        const array = [
            { name: 'Alex', date: new Date(2011, 2, 3) },
            { name: 'Alex', date: new Date(2012, 3, 4) }
        ];

        this.dataSource = createDataSource(array);
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.applyOptions({
            selection: { mode: 'single' }
        });

        // act
        this.selectionController.selectRows({ name: 'Alex', date: new Date(2012, 3, 4) });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Alex', date: new Date(2012, 3, 4) }], 'selected row keys');
        assert.ok(!this.dataController.items()[0].isSelected, 'item 1 not selected');
        assert.ok(this.dataController.items()[1].isSelected, 'item 2 selected');
    });

    // T112473
    QUnit.test('set selectedRows for single selection. Empty objects', function(assert) {
    // arrange
        const array = [{ name: 'Alex', address: { country: 'USA', city: 'New York' } }, {}, {}];

        this.dataSource = createDataSource(array);
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.applyOptions({
            selection: { mode: 'single' }
        });

        // act
        this.selectionController.selectRows({ name: 'Alex', address: { country: 'USA', city: 'New York' } });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Alex', address: { country: 'USA', city: 'New York' } }], 'selected row keys');
        assert.ok(this.dataController.items()[0].isSelected, 'item 1 selected');
        assert.ok(!this.dataController.items()[1].isSelected, 'item 2 not selected');
        assert.ok(!this.dataController.items()[2].isSelected, 'item 3 not selected');
    });

    // T112473
    QUnit.test('set selectedRows for single selection. Selecting empty object', function(assert) {
    // arrange
        const array = [{ name: 'Alex', address: { country: 'USA', city: 'New York' } }, {}, {}];

        this.dataSource = createDataSource(array);
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.applyOptions({
            selection: { mode: 'single' }
        });

        // act
        this.selectionController.selectRows({});

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{}, {}], 'selected row keys');
        assert.ok(!this.dataController.items()[0].isSelected, 'item 1 not selected');
        assert.ok(this.dataController.items()[1].isSelected, 'item 2 selected');
        assert.ok(this.dataController.items()[2].isSelected, 'item 3 selected');
    });

    // T112473
    QUnit.test('set selectedRows for single selection. Selecting object with a different number of properties', function(assert) {
    // arrange
        const array = [{ name: 'Alex', address: { country: 'USA', city: 'New York' } },
            { name: 'Dan', address: { country: 'USA', city: 'Chicago' } }];

        this.dataSource = createDataSource(array);
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.applyOptions({
            selection: { mode: 'single' }
        });

        // act
        this.selectionController.selectRows({ name: 'Dan' });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [], 'selected row keys');
        assert.ok(!this.dataController.items()[0].isSelected, 'item 1 not selected');
        assert.ok(!this.dataController.items()[1].isSelected, 'item 2 not selected');
    });

    QUnit.test('set selectedRows for single selection. Several call', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.selectRows({ name: 'Dan', age: 16 }); // 1
        this.selectionController.selectRows({ name: 'Dmitry', age: 18 });// 3

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dmitry', age: 18 }]);

        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
    });

    QUnit.test('set selectedRows for multiple selection. Several objects in array', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
    });

    // T135244
    QUnit.test('set selectedRows. Not Loading data then no selected rows', function(assert) {
        let loadingCount = 0;
        this.dataController.store().on('loading', function() {
            loadingCount++;
        });

        this.selectionController.selectRows([]);

        this.clock.tick(10);

        // assert
        assert.strictEqual(loadingCount, 0, 'no loadings');
        assert.strictEqual(this.selectionController.getSelectedRowKeys().length, 0, 'no selected row keys');
    });

    QUnit.test('selectRowsByIndexes for multiple selection. Array of indexes', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.selectRowsByIndexes([1, 3]); // 1, 3

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
    });

    QUnit.test('selectRowsByIndexes for multiple selection. Wrong index', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.selectRowsByIndexes([1, 3, 100]); // 1, 3

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
    });

    QUnit.test('selectRowsByIndexes for multiple selection. Indexes via arguments', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.selectRowsByIndexes(1, 3); // 1, 3

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
    });

    QUnit.skip('set selectedRows from user state', function(assert) {
    // arrange
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.stateStoringController.state({ selectedItemKeys: [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }] }); // 1, 3

        // act
        this.stateStoringController.restoreSelectedItemKeys();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
    });

    QUnit.test('Set isSelected items', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.selectRows([{ name: 'Kate', age: 20 }]);

        this.option('selectedRowKeys', [
            { name: 'Dan', age: 16 },
            { name: 'Dmitry', age: 18 }]);

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
    });

    QUnit.test('get selectedRows for multiple selection. Several objects in array', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple', storeSelectedItems: true }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3


        const selectedRows = this.selectionController.getSelectedRowsData();

        assert.deepEqual(this.selectionController.option('selectedRowKeys'), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);
        assert.deepEqual(selectedRows, [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);
    });

    QUnit.test('get selectedRows for multiple selection when dataSource has filter. Several objects in array', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                storeSelectedItems: true
            }
        });

        this.dataController.filter(['age', '>', 17]);

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3

        const selectedRows = this.selectionController.getSelectedRowsData();
        assert.deepEqual(selectedRows, [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }], 'selectRows ignore filter');
    });

    QUnit.test('get selectedRows for multiple selection. Array key', function(assert) {
        const array = [
            { prop1: 'a', prop2: 1, prop3: 1 },
            { prop1: 'a', prop2: 2, prop3: 2 },
            { prop1: 'a', prop2: 3, prop3: 3 },
            { prop1: 'b', prop2: 2, prop3: 4 },
            { prop1: 'c', prop2: 1, prop3: 5 },
            { prop1: 'c', prop2: 2, prop3: 6 }
        ];

        this.dataSource = createDataSource(array, { key: ['prop1', 'prop2'] });
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        this.applyOptions({
            selection: {
                mode: 'multiple',
                storeSelectedItems: true
            }
        });

        this.selectionController.selectRows([{ prop1: 'a', prop2: 2 }, { prop1: 'b', prop2: 2 }, { prop1: 'c' }]);

        const selectedRows = this.selectionController.getSelectedRowsData();

        assert.deepEqual(selectedRows, [{ prop1: 'a', prop2: 2, prop3: 2 }, { prop1: 'b', prop2: 2, prop3: 4 }]);
    });

    QUnit.test('selectedRows with non-unique key', function(assert) {
    // arrange
        this.applyOptions({
            selection: { mode: 'single' },
            dataSource: { store: { type: 'array', data: this.array, key: 'age' } }
        });

        this.dataController.optionChanged({ name: 'dataSource' });


        // act
        this.selectionController.selectRows([16, 18]);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [16, 18, 18]);
        assert.deepEqual(this.selectionController.getSelectedRowsData(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }, { name: 'Sergey', age: 18 }]);
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
        assert.ok(this.dataController.items()[4].isSelected);
        assert.ok(!this.dataController.items()[5].isSelected);
        assert.ok(!this.dataController.items()[6].isSelected);
    });

    // T429370
    QUnit.test('selectedRowKeys should not be changed after assign', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple'
            }
        });

        const keys = [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }];

        this.option('selectedRowKeys', keys);

        assert.deepEqual(this.selectionController.option('selectedRowKeys'), keys, 'selectedRowKeys instance is not changed');
        assert.deepEqual(this.selectionController.getSelectedRowsData(), keys, 'selectRowsData equal keys by deep equal');
        assert.notStrictEqual(this.selectionController.getSelectedRowsData(), keys, 'selectRowsData not equal keys by instance');
    });


    QUnit.test('Deselect selectedRows. Store with key', function(assert) {
    // arrange
        this.applyOptions({
            selection: { mode: 'single' },
            dataSource: { store: { type: 'array', data: this.array, key: 'age' } }
        });

        this.dataController.optionChanged({ name: 'dataSource' });


        this.selectionController.selectRows([16, 18]);

        // act
        this.selectionController.deselectRows([18]);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [16]);
        assert.deepEqual(this.selectionController.getSelectedRowsData(), [{ name: 'Dan', age: 16 }]);
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[3].isSelected);
        assert.ok(!this.dataController.items()[4].isSelected);
        assert.ok(!this.dataController.items()[5].isSelected);
        assert.ok(!this.dataController.items()[6].isSelected);
    });

    QUnit.test('Deselect all if key is defined', function(assert) {
    // arrange
        this.applyOptions({
            selection: { mode: 'single' },
            dataSource: { store: { type: 'array', data: this.array, key: 'age' } }
        });

        this.dataController.optionChanged({ name: 'dataSource' });


        this.selectionController.selectRows([16, 18]);

        // act
        this.selectionController.deselectAll();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);
        assert.deepEqual(this.selectionController.getSelectedRowsData(), []);
    });

    QUnit.test('Deselect selectedRows. Object parameter', function(assert) {
    // arrange
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);

        // act
        this.selectionController.deselectRows({ name: 'Dmitry', age: 18 });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[3].isSelected);
        assert.ok(!this.dataController.items()[4].isSelected);
        assert.ok(!this.dataController.items()[5].isSelected);
        assert.ok(!this.dataController.items()[6].isSelected);
    });

    QUnit.test('OnSelectionChange action when row deselected via API (T220378)', function(assert) {
    // arrange
        let onSelectionCounter = 0;

        this.applyOptions({
            selection: { mode: 'multiple' },
            onSelectionChanged: function() {
                onSelectionCounter++;
            }
        });

        // act
        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);

        assert.equal(onSelectionCounter, 1, 'First time onSelection fire when we select some rows');

        this.selectionController.deselectRows({ name: 'Dmitry', age: 18 });

        assert.equal(onSelectionCounter, 2, 'Second time onSelection fire when we deselect some rows');
    });

    QUnit.test('On selection changed argument contents actual parameters (T239237, selection case)', function(assert) {
    // arrange
        let onSelectionChangedArgs;
        let onSelectionChangedCounter = 0;
        const that = this;

        this.applyOptions({
            selection: { mode: 'single' },
            onSelectionChanged: function(args) {
                onSelectionChangedCounter++;
                onSelectionChangedArgs = args;
                if(args.currentSelectedRowKeys.length && onSelectionChangedCounter < 3) {
                    assert.deepEqual(
                        args,
                        {
                            currentSelectedRowKeys: [{ name: 'Dan', age: 16 }],
                            currentDeselectedRowKeys: [],
                            selectedRowKeys: [{ name: 'Dan', age: 16 }],
                            selectedRowsData: [{ name: 'Dan', age: 16 }]
                        },
                        'After select we have no currentDeselectedRowKeys'
                    );

                    that.selectionController.deselectRows([{ name: 'Dan', age: 16 }]);
                }
            }
        });

        // act
        this.selectionController.selectRows([{ name: 'Dan', age: 16 }]);

        assert.deepEqual(
            onSelectionChangedArgs,
            {
                currentSelectedRowKeys: [],
                currentDeselectedRowKeys: [{ name: 'Dan', age: 16 }],
                selectedRowKeys: [],
                selectedRowsData: []
            },
            'After deselect we have no currentSelectedRowKeys'
        );

        assert.equal(onSelectionChangedCounter, 2, 'onSelectionChanged calls two times');
    });

    QUnit.test('On selection changed argument contents actual parameters (T239237, deselection case)', function(assert) {
    // arrange
        let onSelectionChangedArgs;
        let onSelectionChangedCounter = 0;
        const that = this;

        this.applyOptions({
            selection: { mode: 'single' },
            onSelectionChanged: function(args) {
                onSelectionChangedCounter++;
                onSelectionChangedArgs = args;

                if(args.currentDeselectedRowKeys.length && onSelectionChangedCounter < 4) {
                    assert.deepEqual(
                        args,
                        {
                            currentSelectedRowKeys: [],
                            currentDeselectedRowKeys: [{ name: 'Dan', age: 16 }],
                            selectedRowKeys: [],
                            selectedRowsData: []
                        },
                        'After select we have no currentSelectedRowKeys'
                    );

                    that.selectionController.selectRows([{ name: 'Dan', age: 16 }], true);
                }
            }
        });

        // act
        that.selectionController.selectRows([{ name: 'Dan', age: 16 }]);

        this.selectionController.deselectRows([{ name: 'Dan', age: 16 }]);

        assert.deepEqual(
            onSelectionChangedArgs,
            {
                currentSelectedRowKeys: [{ name: 'Dan', age: 16 }],
                currentDeselectedRowKeys: [],
                selectedRowKeys: [{ name: 'Dan', age: 16 }],
                selectedRowsData: [{ name: 'Dan', age: 16 }]
            },
            'After deselect we have no currentDeselectedRowKeys'
        );

        assert.equal(onSelectionChangedCounter, 3, 'onSelectionChanged calls three times');
    });

    QUnit.test('onSelectionChanged should not be called when loading data and given the selectedRowKeys', function(assert) {
    // arrange
        let onSelectionChangedCounter = 0;

        this.applyOptions({
            onSelectionChanged: function() {
                onSelectionChangedCounter++;
            }
        });

        // act
        this.options.selectedRowKeys = [{ name: 'Dan', age: 16 }];
        this.dataController.init();
        this.clock.tick(10);

        // act
        assert.strictEqual(onSelectionChangedCounter, 0, 'onSelectionChanged not called');
    });

    QUnit.test('clearSelection', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3

        // act
        this.selectionController.clearSelection();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);
        assert.deepEqual(this.selectionController.option('selectedRowKeys'), []);
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[3].isSelected);
    });

    QUnit.test('Rise selectionChanged event on set selectedRows. Several objects', function(assert) {
        let selectionChangedCount = 0;
        let selectionChangedArgs;

        this.applyOptions({
            selection: { mode: 'multiple' },
            onSelectionChanged: function() {
                selectionChangedArgs = arguments;
                selectionChangedCount++;
            }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);
        assert.strictEqual(selectionChangedCount, 1);
        assert.deepEqual(selectionChangedArgs[0].selectedRowKeys, [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }], 'isSelected keys');
        assert.deepEqual(selectionChangedArgs[0].selectedRowsData, [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }], 'isSelected items');
        assert.deepEqual(selectionChangedArgs[0].currentSelectedRowKeys, [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }], 'added isSelected keys');
        assert.deepEqual(selectionChangedArgs[0].currentDeselectedRowKeys, [], 'removed isSelected keys');
    });

    // B255057
    QUnit.test('Rise selectionChanged event on set selectedRows. Several objects. Store with key', function(assert) {
        let selectionChangedCount = 0;
        let selectionChangedArgs;

        this.applyOptions({
            selection: { mode: 'multiple', storeSelectedItems: true },
            dataSource: { store: { type: 'array', data: this.array, key: 'age' } },
            onSelectionChanged: function() {
                selectionChangedArgs = arguments;
                selectionChangedCount++;
            }
        });

        this.dataController.optionChanged({ name: 'dataSource' });

        // act
        this.selectionController.selectRows([16, 20]); // 1, 5

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [16, 20]);
        assert.deepEqual(this.selectionController.getSelectedRowsData(), [{ 'age': 16, 'name': 'Dan' }, { 'age': 20, 'name': 'Kate' }]);
        assert.strictEqual(selectionChangedCount, 1);
        assert.deepEqual(selectionChangedArgs[0].selectedRowKeys, [16, 20], 'isSelected item keys');
        assert.deepEqual(selectionChangedArgs[0].currentSelectedRowKeys, [16, 20], 'added isSelected item keys');
        assert.deepEqual(selectionChangedArgs[0].currentDeselectedRowKeys, [], 'removed isSelected item keys');
    });

    QUnit.test('Rise selectionChanged event on change selectedRows. Several objects', function(assert) {
        let selectionChangedCount = 0;
        let selectionChangedArgs;

        this.applyOptions({
            selection: { mode: 'multiple' },
            onSelectionChanged: function() {
                selectionChangedArgs = arguments;
                selectionChangedCount++;
            }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3

        this.selectionController.selectRows([{ name: 'Dmitry', age: 18 }]); // 3

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dmitry', age: 18 }]);
        assert.strictEqual(selectionChangedCount, 2);
        assert.deepEqual(selectionChangedArgs[0].selectedRowKeys, [{ name: 'Dmitry', age: 18 }], 'isSelected items');
        assert.deepEqual(selectionChangedArgs[0].currentSelectedRowKeys, [], 'added isSelected items');
        assert.deepEqual(selectionChangedArgs[0].currentDeselectedRowKeys, [{ name: 'Dan', age: 16 }], 'removed isSelected items');
    });

    // B255057
    QUnit.test('Rise selectionChanged event on change selectedRows. Several objects. Store with key', function(assert) {
        let selectionChangedCount = 0;
        let selectionChangedArgs;

        this.applyOptions({
            selection: { mode: 'multiple', storeSelectedItems: true },
            dataSource: { store: { type: 'array', data: this.array, key: 'age' } },
            onSelectionChanged: function() {
                selectionChangedArgs = arguments;
                selectionChangedCount++;
            }
        });

        this.dataController.optionChanged({ name: 'dataSource' });

        // act
        this.selectionController.selectRows([16, 20]); // 1, 5
        this.selectionController.selectRows([20]); // 5

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [20]);
        assert.deepEqual(this.selectionController.getSelectedRowsData(), [{ 'age': 20, 'name': 'Kate' }]);
        assert.strictEqual(selectionChangedCount, 2);
        assert.deepEqual(selectionChangedArgs[0].selectedRowKeys, [20], 'isSelected item keys');
        assert.deepEqual(selectionChangedArgs[0].selectedRowsData, [{ 'age': 20, 'name': 'Kate' }], 'isSelected item keys');
        assert.deepEqual(selectionChangedArgs[0].currentSelectedRowKeys, [], 'added isSelected item keys');
        assert.deepEqual(selectionChangedArgs[0].currentDeselectedRowKeys, [16], 'removed isSelected item keys');
    });

    QUnit.test('proxy select and expand load parameters during selectAll operation', function(assert) {
    // arrange
        let loadOptions;

        this.applyOptions({
            selection: { mode: 'multiple' },
            dataSource: { store: { type: 'odata', url: '#' }, expand: 'testExpand', select: 'testSelect' }
        });

        this.dataController.optionChanged({ name: 'dataSource' });

        this.clock.tick(10);
        this.dataController.store().on('loading', function(options) {
            loadOptions = options;
        });

        // act
        this.selectionController.selectAll();
        this.clock.tick(10);

        // assert
        assert.strictEqual(loadOptions.expand, 'testExpand', 'dataSource expand options sent correctly');
        assert.strictEqual(loadOptions.select, 'testSelect', 'dataSource select options sent correctly');
    });

    QUnit.test('Not rise selectionChanged event on apply filter after SelectAll', function(assert) {
        let selectionChangedCount = 0;

        this.applyOptions({
            selection: { mode: 'multiple', allowSelectAll: true },
            onSelectionChanged: function() {
                selectionChangedCount++;
            }
        });

        this.selectionController.selectAll();
        assert.strictEqual(selectionChangedCount, 1);

        // act
        this.dataController.filter(['age', '>', 18]);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys().length, 7);
        assert.strictEqual(selectionChangedCount, 1, 'selection changed not raised');
    });

    QUnit.test('Not rise selectionChanged event on apply filter after set selectedRowKeys', function(assert) {
        let selectionChangedCount = 0;

        this.applyOptions({
            selection: { mode: 'multiple' },
            onSelectionChanged: function() {
                selectionChangedCount++;
            }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3
        assert.strictEqual(selectionChangedCount, 1);

        // act
        this.dataController.filter(['age', '=', 18]);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);
        assert.strictEqual(selectionChangedCount, 1, 'selection changed not raised');
    });

    QUnit.test('Rise selectionChanged event on change dataSource', function(assert) {
        let selectionChangedCount = 0;

        this.applyOptions({
            selection: { mode: 'multiple' },
            onSelectionChanged: function() {
                selectionChangedCount++;
            }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3
        assert.strictEqual(selectionChangedCount, 1);

        // act
        this.option('dataSource', [{ name: 'Dan', age: 16 }]);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);
        assert.strictEqual(selectionChangedCount, 2, 'selection changed raised');
    });

    QUnit.test('Rise selectionChanged event on refresh', function(assert) {
        let selectionChangedCount = 0;

        this.applyOptions({
            selection: { mode: 'multiple' },
            onSelectionChanged: function() {
                selectionChangedCount++;
            }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3
        assert.strictEqual(selectionChangedCount, 1);

        // act
        this.array.splice(2, 10);
        this.dataController.refresh();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);
        assert.strictEqual(selectionChangedCount, 2, 'selection changed raised');
    });

    QUnit.test('Not rise selectionChanged event on refresh with changesOnly', function(assert) {
        let selectionChangedCount = 0;

        this.applyOptions({
            selection: { mode: 'multiple' },
            onSelectionChanged: function() {
                selectionChangedCount++;
            }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3
        assert.strictEqual(selectionChangedCount, 1);

        // act
        this.array.splice(2, 10);
        this.dataController.refresh(true);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);
        assert.strictEqual(selectionChangedCount, 1, 'selection changed is not raised');
    });

    QUnit.test('Not rise selectionChanged event on apply filter when selectedRows count not changed', function(assert) {
        let selectionChangedCount = 0;

        this.applyOptions({
            selection: { mode: 'multiple' },
            onSelectionChanged: function() {
                selectionChangedCount++;
            }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3
        assert.strictEqual(selectionChangedCount, 1);

        // act
        this.dataController.filter(['age', '>', 1]);

        // assert
        assert.strictEqual(selectionChangedCount, 1);
    });

    QUnit.skip('Not rise event on second set selectedRows without changes', function(assert) {
        let selectionChangedCount = 0;

        this.applyOptions({
            selection: { mode: 'multiple' },
            onSelectionChanged: function() {
                selectionChangedCount++;
            }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3
        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);

        assert.strictEqual(selectionChangedCount, 1);
    });

    QUnit.test('changed on set selectedRows', function(assert) {
        let changedCount = 0;
        let lastArgs;

        this.applyOptions({
            selection: { mode: 'multiple' }
        });
        this.dataController.changed.add(function(args) {
            changedCount++;
            lastArgs = args;
        });

        assert.strictEqual(changedCount, 0);

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3

        assert.strictEqual(changedCount, 1);

        assert.strictEqual(lastArgs.changeType, 'updateSelection');
        assert.deepEqual(lastArgs.itemIndexes, [1, 3]);
        assert.ok(lastArgs.items);
        assert.equal(lastArgs.items.length, 7);
    });

    QUnit.test('select column row values', function(assert) {
        this.applyOptions({
            columns: ['name', 'age'],
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' }
        });

        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }]);

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);

        assert.equal(this.dataController.items()[0].values.length, 3);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[0].values[0]);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[1].values[0]);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[2].values[0]);
    });

    // T363549
    QUnit.test('select column row values than column position at the end', function(assert) {
        this.applyOptions({
            columns: ['name', 'age'],
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' }
        });

        this.columnOption('command:select', 'visibleIndex', 10);

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }]);

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);

        assert.equal(this.dataController.items()[0].values.length, 3);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.deepEqual(this.dataController.items()[0].values, ['Alex', 15, false]);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.deepEqual(this.dataController.items()[1].values, ['Dan', 16, true]);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.deepEqual(this.dataController.items()[2].values, ['Vadim', 17, false]);
    });

    QUnit.test('update selectedRows after update item in store and refresh where Paging', function(assert) {
        const array = [
            { name: 'Alex', pay: 215 },
            { name: 'Dan1', pay: 151 },
            { name: 'Dan2', pay: 152 },
            { name: 'Dan3', pay: 153 },
            { name: 'Dan4', pay: 154 },
            { name: 'Dan5', pay: 155 },
            { name: 'Dan6', pay: 156 }
        ];

        this.applyOptions({
            selection: {
                mode: 'single',
                storeSelectedItems: true
            }
        });

        this.dataSource = createDataSource(array, { key: 'name' }, {
            pageSize: 5,
            paginate: true
        });

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.selectionController.changeItemSelection(1);
        assert.deepEqual(this.selectionController.getSelectedRowsData(), [{ name: 'Dan1', pay: 151 }]);
        this.dataSource.store().update('Dan1', { pay: 999 });
        this.dataController.refresh();

        assert.deepEqual(this.selectionController.getSelectedRowsData(), [{ name: 'Dan1', pay: 999 }]);
    });

    // T203742
    QUnit.test('redundant load after refresh when the grid restores its selection', function(assert) {
        const array = [
            { name: 'Alex', pay: 215 },
            { name: 'Dan1', pay: 151 },
            { name: 'Dan2', pay: 152 },
            { name: 'Dan3', pay: 153 },
            { name: 'Dan4', pay: 154 },
            { name: 'Dan5', pay: 155 },
            { name: 'Dan6', pay: 156 }
        ];

        this.applyOptions({
            remoteOperations: { filtering: true, sorting: true, paging: true },
            selection: {
                mode: 'multiple'
            }
        });

        this.dataSource = createDataSource(array, { key: 'name' }, {
            pageSize: 5,
            paginate: true
        });


        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        let loadingCount = 0;

        this.dataSource.store().on('loading', function() {
            loadingCount++;
        });

        this.selectionController.selectRows(['Dan1', 'Dan3']);
        this.dataSource.store().update('Dan1', { pay: 999 });

        assert.equal(loadingCount, 0, 'no loading on selectRows when all items in the page');
        const oldSelectedRowsData = this.selectionController.getSelectedRowsData();

        // act
        this.dataController.refresh();

        const selectedRowsData = this.selectionController.getSelectedRowsData();
        assert.notStrictEqual(oldSelectedRowsData, selectedRowsData, 'selectedRowsData instance is changed');
        assert.deepEqual(selectedRowsData, [{ name: 'Dan1', pay: 999 }, { name: 'Dan3', pay: 153 }]);
        assert.equal(loadingCount, 1, 'one loading after refresh with selection');
    });

    // T460451
    QUnit.test('selection should not perform redundant load when loaded items contains all selected items', function(assert) {
        const that = this;
        const isSelectAllStates = [];

        const array = [
            { name: 'Alex', pay: 215 },
            { name: 'Dan1', pay: 151 },
            { name: 'Dan2', pay: 152 },
            { name: 'Dan3', pay: 153 },
            { name: 'Dan4', pay: 154 },
            { name: 'Dan5', pay: 155 },
            { name: 'Dan6', pay: 156 }
        ];

        this.applyOptions({
            dataSource: {
                store: {
                    type: 'array',
                    data: array,
                    key: 'name'
                }
            },
            loadingTimeout: 0,
            selectedRowKeys: ['Dan1', 'Dan3']
        });

        // act
        this.dataController._refreshDataSource();

        let loadingCount = 0;
        this.dataController.store().on('loading', function() {
            loadingCount++;
        });

        this.selectionController.selectionChanged.add(function() {
            isSelectAllStates.push(that.selectionController.isSelectAll());
        });

        this.clock.tick(10);

        // assert
        assert.equal(loadingCount, 1, 'one loading after init dataSource');
        assert.deepEqual(this.getSelectedRowsData(), [array[1], array[3]], 'selected rows data is correct');
        assert.deepEqual(isSelectAllStates, [undefined], 'selectAll states');
    });

    // T450615
    QUnit.test('selection should be cleared when call clearSelection after call selectRows', function(assert) {
        const array = [
            { name: 'Alex', pay: 215 },
            { name: 'Dan1', pay: 151 },
            { name: 'Dan2', pay: 152 },
            { name: 'Dan3', pay: 153 },
            { name: 'Dan4', pay: 154 },
            { name: 'Dan5', pay: 155 },
            { name: 'Dan6', pay: 156 }
        ];

        this.applyOptions({
            loadingTimeout: 0,
            dataSource: { pageSize: 2, store: { type: 'array', data: array, key: 'name' } }
        });

        this.dataController.optionChanged({ name: 'dataSource' });

        this.clock.tick(10);

        // act
        this.selectRows(['Dan1', 'Dan3']);
        this.clearSelection();

        this.clock.tick(10);

        // assert
        assert.deepEqual(this.getSelectedRowKeys(), []);
    });

    // B254503
    QUnit.test('no selection column when not has columns', function(assert) {
    // arrange
        this.applyOptions({
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'always'
            },
            columns: []
        });

        // act
        const visibleColumns = this.columnsController.getVisibleColumns();

        // assert
        assert.ok(!visibleColumns.length, 'not has columns');
    });

    QUnit.test('selectRows with big array', function(assert) {
    // arrange
        const that = this;

        that.applyOptions({
            selection: {
                maxFilterLengthInRequest: 1000
            }
        });

        that.array = [];
        for(let i = 1; i <= 10000; i++) {
            that.array.push({ id: i, text: 'text ' + i });
        }

        that.dataSource = createDataSource(that.array, { key: 'id' });
        that.dataController.setDataSource(that.dataSource);
        that.dataSource.load();

        // act
        const keys = that.array.filter(function(data) { return data.id <= 9000; }).map(function(data) { return data.id; });
        that.selectRows(keys);
        assert.equal(that.selectionController.getSelectedRowKeys().length, 9000, 'selected row keys');
    });

    // T441847
    QUnit.test('selectRows with key as array of undefined', function(assert) {
    // arrange
        const that = this;

        that.dataSource = createDataSource(that.array, { key: ['name', 'age'] });
        that.dataController.setDataSource(that.dataSource);
        that.dataSource.load();

        // act
        that.selectRows([undefined]).done(function() {
        // assert
            assert.deepEqual(that.selectionController.getSelectedRowKeys(), [], 'selected row keys');
        });
    });

    // T708122
    QUnit.test('selectAll when remote paging and local filtering', function(assert) {
        this.applyOptions({
            remoteOperations: { paging: true }
        });

        this.dataSource = createDataSource(this.array, {}, { pageSize: 5, filter: ['age', '>', 15] });
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        // act
        this.selectionController.selectAll();

        // assert
        assert.strictEqual(this.getVisibleRows().length, 5, 'visible row count');
        assert.strictEqual(this.totalCount(), 6, 'total count');
        assert.strictEqual(this.getSelectedRowKeys().length, 6, 'selected row count');
        assert.strictEqual(this.selectionController.isSelectAll(), true, 'isSelectAll');
    });

    QUnit.test('selectAll when calculateCellValue is defined for filtered column (T1021412)', function(assert) {
        this.applyOptions({
            columns: [{
                dataField: 'age',
                calculateCellValue() { return 99; },
                filterValue: 99
            }]
        });

        // act
        this.selectionController.selectAll();

        // assert
        assert.deepEqual(this.getCombinedFilter(true), ['age', '=', 99], 'filter');
        assert.strictEqual(this.getVisibleRows().length, 7, 'visible row count');
        assert.strictEqual(this.totalCount(), 7, 'total count');
        assert.strictEqual(this.getSelectedRowKeys().length, 7, 'selected row count');
        assert.strictEqual(this.selectionController.isSelectAll(), true, 'isSelectAll');
    });

    ['single', 'multiple'].forEach(selectionMode => {
        QUnit.test(`Disabled item should be selected when mode = ${selectionMode} (T1015840)`, function(assert) {
            this.applyOptions({
                selection: {
                    mode: selectionMode
                }
            });
            this.array[0].disabled = true;

            // act
            this.selectionController.changeItemSelection(0, { control: selectionMode === 'multiple' });

            // assert
            assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Alex', age: 15, disabled: true }]);
        });
    });

    QUnit.module('W1018', () => {
        [true, false].forEach(deferred => {
            ['infinite', 'virtual', 'standard'].forEach(scrollingMode => {
                ['multiple', 'single', 'none'].forEach(selectionMode => {
                    ['page', 'allPages'].forEach(selectAllMode => {
                        QUnit.test(`scrolling mode = ${scrollingMode}, deferred = ${deferred}, selection mode = ${selectionMode}, selectAllMode = ${selectAllMode}`, function(assert) {
                            // arrange
                            sinon.spy(errors, 'log');

                            this.applyOptions({
                                selection: { mode: selectionMode, deferred, selectAllMode },
                                scrolling: { mode: scrollingMode }
                            });

                            // assert
                            if(scrollingMode === 'infinite' && selectionMode === 'multiple' && !deferred && selectAllMode === 'allPages') {
                                assert.equal(errors.log.callCount, 1, 'warning was thrown');
                                assert.equal(errors.log.lastCall.args[0], 'W1018', 'warning code');
                            } else {
                                assert.equal(errors.log.callCount, 0, 'warning was not thrown');
                            }

                            errors.log.restore();
                        });
                    });
                });
            });
        });
    });
});

QUnit.module('Selection without dataSource', { beforeEach: setupModule, afterEach: teardownModule }, () => {

    QUnit.test('getters', function(assert) {
        this.applyOptions({
            selection: {
                storeSelectedItems: true
            }
        });

        assert.strictEqual(this.selectionController.isSelectionWithCheckboxes(), false);
        assert.deepEqual(this.selectionController.getSelectedRowsData(), []);
    });

    QUnit.test('change selectedRows', function(assert) {
        this.applyOptions({});
        this.selectionController.selectRows([{ id: 1 }]);
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);
    });

    QUnit.test('changeRowSelection', function(assert) {
        this.applyOptions({});
        this.selectionController.changeItemSelection(0);
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);
    });

    QUnit.test('selectAll', function(assert) {
        const selectionController = this.selectionController;
        let changeCallCount = 0;

        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true,
                storeSelectedItems: true
            }
        });

        selectionController.selectAll().done(function() {
            changeCallCount++;
        });

        this.clock.tick(10);

        // assert
        assert.equal(changeCallCount, 1);
        assert.deepEqual(selectionController.getSelectedRowsData(), []);
    });

    // T130427
    QUnit.test('loadingChanged when selectAll', function(assert) {
        const selectionController = this.selectionController;
        const loadingStates = [];

        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true,
                storeSelectedItems: true
            },
            dataSource: {
                store: [{ id: 0 }, { id: 1 }],
                asyncLoadEnabled: false
            }
        });
        this.dataController.optionChanged({ name: 'dataSource' });

        this.dataController.loadingChanged.add(function(isLoading) {
            loadingStates.push(isLoading);
        });

        selectionController.selectAll();

        this.clock.tick(10);

        // assert
        assert.strictEqual(selectionController.getSelectedRowKeys().length, 2);
        assert.deepEqual(loadingStates, [true, false]);
    });

    QUnit.test('QUnit.start/stop selectionWithCheckboxes', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });
        this.selectionController.startSelectionWithCheckboxes();
        assert.ok(this.selectionController.isSelectionWithCheckboxes());
        this.selectionController.stopSelectionWithCheckboxes();
        assert.ok(!this.selectionController.isSelectionWithCheckboxes());
    });
});

QUnit.module('Focusing', { beforeEach: setupSelectionModule, afterEach: teardownSelectionModule }, () => {

    QUnit.test('set focusedItemIndex', function(assert) {

        this.selectionController.focusedItemIndex(2);

        assert.equal(this.selectionController.focusedItemIndex(), 2);
    });
});

QUnit.module('ChangeRowSelection for single selection', { beforeEach: setupSelectionModule, afterEach: teardownSelectionModule }, () => {

    QUnit.test('changeRowSelection simple', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });
        this.selectionController.changeItemSelection(1);

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
    });

    QUnit.test('changeRowSelection. Several calls', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(2);

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
    });

    QUnit.test('changeRowSelection. Several calls on same row with control key', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);

        this.selectionController.changeItemSelection(2, { control: true });
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);

        this.selectionController.changeItemSelection(2, { control: true });
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);

        assert.ok(!this.dataController.items()[2].isSelected);
    });

    QUnit.test('changeRowSelection. Checkboxes works as control key', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' }
        });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);

        this.selectionController.changeItemSelection(2);
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);

        this.selectionController.changeItemSelection(2);
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);

        assert.ok(!this.dataController.items()[2].isSelected);
    });

    QUnit.skip('changeRowSelection. Multiple. Several calls on different rows', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);

        // act
        this.selectionController.changeItemSelection(2);
        this.selectionController.changeItemSelection(3);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }, { name: 'Dmitry', age: 18 }]);
    });

    QUnit.skip('changeRowSelection. Multiple. Several calls on same row', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);

        this.selectionController.changeItemSelection(2);
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);

        this.selectionController.changeItemSelection(2);
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);

        assert.ok(!this.dataController.items()[2].isSelected);
    });

    QUnit.test('changeRowSelection. Several calls on different rows with control key', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);

        this.selectionController.changeItemSelection(2, { control: true });
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);

        this.selectionController.changeItemSelection(1, { control: true });
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);

        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
    });

    QUnit.test('Rise events on changeRowSelection', function(assert) {
        let selectionChangedCount = 0;

        this.applyOptions({
            selection: { mode: 'single' },
            onSelectionChanged: function() {
                selectionChangedCount++;
            }
        });

        this.selectionController.changeItemSelection(5);
        this.selectionController.changeItemSelection(2);

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);

        assert.strictEqual(selectionChangedCount, 2);
    });
});

QUnit.module('ChangeRowSelection for multiple selection', { beforeEach: setupSelectionModule, afterEach: teardownSelectionModule }, () => {

    QUnit.test('changeRowSelection simple', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });
        this.selectionController.changeItemSelection(1);

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
    });

    QUnit.test('changeRowSelection. Several calls', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(2);

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);
        assert.ok(this.dataController.items()[2].isSelected);
    });

    QUnit.test('changeRowSelection. Several calls on same row with control key', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);

        this.selectionController.changeItemSelection(2, { control: true });
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);

        this.selectionController.changeItemSelection(2, { control: true });
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);

        assert.ok(!this.dataController.items()[2].isSelected);
    });

    QUnit.test('changeRowSelection. Several calls on different rows with control key', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);

        this.selectionController.changeItemSelection(2, { control: true });
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);

        this.selectionController.changeItemSelection(1, { control: true });
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }, { name: 'Dan', age: 16 }]);

        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);

        this.selectionController.changeItemSelection(2, { control: true });
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);
    });
});

const setupSelectionWithKeysModule = function() {
    setupModule.apply(this);

    this.applyOptions({ columns: ['name', 'age'] });


    this.array = [
        { id: 1, name: 'Alex', age: 15 },
        { id: 2, name: 'Dan', age: 16 },
        { id: 3, name: 'Vadim', age: 17 },
        { id: 4, name: 'Dmitry', age: 18 },
        { id: 5, name: 'Sergey', age: 18 },
        { id: 6, name: 'Kate', age: 20 },
        { id: 7, name: 'Dan', age: 21 }
    ];

    const dataSource = createDataSource(this.array, { key: 'id' });
    this.dataController.setDataSource(dataSource);
    dataSource.load();
};

const teardownSelectionWithKeysModule = function() {
    teardownModule.apply(this);
};

QUnit.module('ChangeRowSelection for multiple selection. DataSource with key', { beforeEach: setupSelectionWithKeysModule, afterEach: teardownSelectionWithKeysModule }, () => {

    QUnit.test('changeRowSelection with shift key. No changeItemSelection before', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.changeItemSelection(1, { shift: true });
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[3].isSelected);
        assert.ok(!this.dataController.items()[4].isSelected);

        this.selectionController.changeItemSelection(4, { shift: true });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [2, 5, 4, 3]);
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
        assert.ok(this.dataController.items()[4].isSelected);
    });

    QUnit.test('changeRowSelection with shift key. changeItemSelection before', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.changeItemSelection(1);

        this.selectionController.changeItemSelection(4, { shift: true });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [2, 5, 4, 3]);
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
        assert.ok(this.dataController.items()[4].isSelected);
    });

    QUnit.skip('changeRowSelection with shift key. Select All and changeRowSelection with control before', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.selectAll();
        this.selectionController.changeItemSelection(1, { control: true });

        this.selectionController.changeItemSelection(4, { shift: true });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 6, 7]);
        assert.ok(this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[3].isSelected);
        assert.ok(!this.dataController.items()[4].isSelected);
        assert.ok(this.dataController.items()[5].isSelected);
    });


    QUnit.test('changeRowSelection with shift key. Change shift selection from down to down', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.changeItemSelection(4);

        this.selectionController.changeItemSelection(1, { shift: true });
        this.selectionController.changeItemSelection(2, { shift: true });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [5, 3, 4]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
        assert.ok(this.dataController.items()[4].isSelected);
    });

    QUnit.test('changeRowSelection with shift key. Change shift selection from up to down', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.changeItemSelection(4);

        this.selectionController.changeItemSelection(5, { shift: true });
        this.selectionController.changeItemSelection(2, { shift: true });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [5, 3, 4]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
        assert.ok(this.dataController.items()[4].isSelected);
    });

    QUnit.test('changeRowSelection with shift key. Change shift selection from up to up', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.changeItemSelection(4);

        this.selectionController.changeItemSelection(5, { shift: true });
        this.selectionController.changeItemSelection(6, { shift: true });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [5, 7, 6]);

        assert.ok(!this.dataController.items()[3].isSelected);
        assert.ok(this.dataController.items()[4].isSelected);
        assert.ok(this.dataController.items()[6].isSelected);
    });

    QUnit.test('changeRowSelection with shift key. Change shift selection from up to down', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.changeItemSelection(4);

        this.selectionController.changeItemSelection(5, { shift: true });
        this.selectionController.changeItemSelection(2, { shift: true });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [5, 3, 4]);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
        assert.ok(this.dataController.items()[4].isSelected);
    });

    // T547950
    QUnit.test('changeRowSelection with shift key after filtering', function(assert) {
    // arrange
        this.applyOptions({
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'always'
            }
        });

        this.dataController.filter(['age', '<', 18]);

        // assert
        assert.strictEqual(this.dataController.items().length, 3, 'item count');

        this.selectionController.changeItemSelection(1);
        this.dataController.clearFilter('dataSource');

        // assert
        assert.strictEqual(this.dataController.items().length, 7, 'item count');

        // act
        this.selectionController.changeItemSelection(5, { shift: true });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [2, 6], 'selectedRowKeys');
    });

    QUnit.test('changeRowSelection with shift key after partial refresh', function(assert) {
    // arrange
        const that = this;
        this.applyOptions({
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'always'
            },
            onSelectionChanged: function(e) {
                that.refresh(true);
            }
        });

        // act
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(3, { shift: true });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [2, 4, 3], 'selectedRowKeys');
    });

    // T547950
    QUnit.test('focusedItemIndex should be reset to -1 after change page index', function(assert) {
    // arrange
        this.applyOptions({
            selection: {
                mode: 'multiple',
                showCheckBoxesMode: 'always'
            }
        });
        this.pageSize(3);

        this.selectionController.changeItemSelection(1);

        // assert
        assert.strictEqual(this.selectionController.focusedItemIndex(), 1, 'focusedItemIndex');

        // act
        this.pageIndex(1);

        // assert
        assert.strictEqual(this.selectionController.focusedItemIndex(), -1, 'focusedItemIndex');
    });

    QUnit.test('Rise events on changeRowSelection', function(assert) {
        let selectionChangedCount = 0;

        this.applyOptions({
            selection: { mode: 'multiple' },
            onSelectionChanged: function() {
                selectionChangedCount++;
            }
        });

        this.selectionController.changeItemSelection(5);
        this.selectionController.changeItemSelection(2, { shift: true });

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [6, 3, 4, 5]);

        assert.strictEqual(selectionChangedCount, 2);
    });
});

QUnit.module('Multiple selection. DataSource with key', { beforeEach: setupSelectionWithKeysModule, afterEach: teardownSelectionWithKeysModule }, () => {

    QUnit.test('get selectedRows', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                storeSelectedItems: true
            }
        });

        this.selectionController.selectRows([2, 4]);

        assert.deepEqual(this.selectionController.getSelectedRowsData(), [{ id: 2, name: 'Dan', age: 16 }, { id: 4, name: 'Dmitry', age: 18 }]);
    });

    QUnit.test('get selectedRows when dataSource has filter', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                storeSelectedItems: true
            }
        });

        this.dataController.filter(['id', '>', 2]);
        this.selectionController.selectRows([2, 4]);

        assert.deepEqual(this.selectionController.getSelectedRowsData(), [{ id: 2, name: 'Dan', age: 16 }, { id: 4, name: 'Dmitry', age: 18 }], 'selectRows ignore filter');
    });

    QUnit.test('selectRows when filter row defined', function(assert) {
        this.applyOptions({
            columns: [{ dataField: 'id', filterValue: 2, selectedFilterOperation: '>' }],
            selection: {
                mode: 'multiple',
                storeSelectedItems: true
            }
        });

        // act
        this.selectionController.selectRows([2, 4]);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowsData(), [{ id: 2, name: 'Dan', age: 16 }, { id: 4, name: 'Dmitry', age: 18 }]);
    });


    // T150738
    QUnit.test('set selectedRows when CustomStore used without filter implementation', function(assert) {
        const array = this.array;

        const store = new CustomStore({
            key: 'id',
            load: function() {
                return array;
            },
            totalCount: function() {
                return array.length;
            }
        });
        const dataSource = new DataSource({ store: store, requireTotalCount: true });
        dataSource.load();


        this.dataController.setDataSource(dataSource);
        this.selectionController.selectRows([2, 3]);

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [2, 3]);
        assert.deepEqual(this.selectionController.getSelectedRowsData(), [{ id: 2, name: 'Dan', age: 16 }, { id: 3, name: 'Vadim', age: 17 }]);
    });

    QUnit.test('Select all state should be correct after removing a selected row via the push API', function(assert) {
        // arrange
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true
            }
        });
        const store = this.dataController.dataSource().store();

        this.selectionController.selectRows([2]);

        // assert
        assert.deepEqual(this.option('selectedRowKeys'), [2]);
        assert.strictEqual(this.selectionController.isSelectAll(), undefined, 'select all state is indeterminate');

        // act
        store.push([{ type: 'remove', key: 2 }]);
        this.clock.tick(10);

        // assert
        assert.strictEqual(this.selectionController.isSelectAll(), false, 'nothing is selected');
        assert.deepEqual(this.option('selectedRowKeys'), [], 'selectedRowKeys is empty');
    });

    // T1171774
    QUnit.test('getSelectedRows should return updated items after \'update\' push API event', function(assert) {
        // arrange
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true
            },
        });
        const store = this.dataController.dataSource().store();

        // act
        this.selectionController.selectRows([1]);

        this.selectionController._selection.options.selectedItems = this.selectionController._selection.options.selectedItems.map(item => ({ ...item }));

        const dataBeforePush = { ...this.selectionController.getSelectedRowsData()[0] };
        const expectedDataBeforePush = { id: 1, name: 'Alex', age: 15 };

        // act
        store.push([{ type: 'update', key: 1, data: { name: 'updated name' } }]);
        this.clock.tick(10);

        // assert
        const dataAfterPush = { ...this.selectionController.getSelectedRowsData()[0] };
        const expectedDataAfterPush = { id: 1, name: 'updated name', age: 15 };

        assert.deepEqual(dataBeforePush, expectedDataBeforePush);
        assert.deepEqual(dataAfterPush, expectedDataAfterPush, 'selected row was updated');
    });

    // T1171774
    QUnit.test('getSelectedRows should return updated items after \'update\' push API event when all rows selected', function(assert) {
        // arrange
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true
            }
        });
        const store = this.dataController.dataSource().store();

        // act
        this.selectionController.selectAll();

        this.selectionController._selection.options.selectedItems = this.selectionController._selection.options.selectedItems.map(item => ({ ...item }));

        const dataBeforePush = { ...this.selectionController.getSelectedRowsData()[0] };
        const expectedDataBeforePush = { id: 1, name: 'Alex', age: 15 };

        // act
        store.push([{ type: 'update', key: 1, data: { name: 'updated name' } }]);
        this.clock.tick(10);

        // assert
        const dataAfterPush = { ...this.selectionController.getSelectedRowsData()[0] };
        const expectedDataAfterPush = { id: 1, name: 'updated name', age: 15 };

        assert.deepEqual(dataBeforePush, expectedDataBeforePush);
        assert.deepEqual(dataAfterPush, expectedDataAfterPush, 'selected row was updated');
    });

    QUnit.test('_updateSelectedOnPush should be called on Push API event', function(assert) {
        // arrange
        this.applyOptions({
            selection: {
                mode: 'multiple',
            }
        });
        const store = this.dataController.dataSource().store();

        sinon.spy(this.selectionController, '_updateSelectedOnPush');
        sinon.spy(this.selectionController, 'getSelectedRowsData');

        // act
        store.push([{ type: 'update', key: 1, data: { name: 'updated name' } }]);
        this.clock.tick(10);

        assert.strictEqual(this.selectionController._updateSelectedOnPush.callCount, 1, '_updateSelectedOnPush was called');
        assert.strictEqual(this.selectionController.getSelectedRowsData.callCount, 1, 'getSelectedRowsData was called');
    });

    QUnit.test('getSelectedRowsData should not be called on Push API event when selection.deferred=true', function(assert) {
        // arrange
        this.applyOptions({
            selection: {
                mode: 'multiple',
                deferred: true
            }
        });
        const store = this.dataController.dataSource().store();

        sinon.spy(this.selectionController, '_updateSelectedOnPush');
        sinon.spy(this.selectionController, 'getSelectedRowsData');

        // act
        store.push([{ type: 'update', key: 1, data: { name: 'updated name' } }]);
        this.clock.tick(10);


        assert.strictEqual(this.selectionController._updateSelectedOnPush.callCount, 1, '_updateSelectedOnPush was called');
        assert.strictEqual(this.selectionController.getSelectedRowsData.callCount, 0, 'getSelectedRowsData was not called');
    });
});

QUnit.module('Start/Stop selection with checkboxes', { beforeEach: setupSelectionModule, afterEach: teardownSelectionModule }, () => {

    QUnit.test('QUnit.start selection enable selectionWithCheckboxes mode', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        assert.ok(!this.selectionController.isSelectionWithCheckboxes());
        // act
        this.selectionController.startSelectionWithCheckboxes();
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(2);
        this.selectionController.changeItemSelection(3);
        this.selectionController.changeItemSelection(3);

        // assert
        assert.ok(this.selectionController.isSelectionWithCheckboxes());
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Vadim', age: 17 }]);
    });

    QUnit.test('start selection enable selectionWithCheckboxes mode when one selected row_T102396', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' }
        });

        assert.ok(!this.selectionController.isSelectionWithCheckboxes());

        // act
        this.selectionController.startSelectionWithCheckboxes();

        // assert
        assert.ok(this.selectionController.isSelectionWithCheckboxes());
    });

    QUnit.test('stop selection after QUnit.start disable selectionWithCheckboxes mode', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.startSelectionWithCheckboxes();
        // act
        this.selectionController.stopSelectionWithCheckboxes();
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(2);

        // assert
        assert.ok(!this.selectionController.isSelectionWithCheckboxes());
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);
    });

    QUnit.test('QUnit.start selection do not work for single selectionMode', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });

        // act
        this.selectionController.startSelectionWithCheckboxes();
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(2);

        // assert
        assert.ok(!this.selectionController.isSelectionWithCheckboxes());
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);
    });

    QUnit.test('QUnit.start selection do not work for multipleWithCheckBoxes selectionMode', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' }
        });

        assert.ok(this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
        // act
        this.selectionController.startSelectionWithCheckboxes();
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(2);

        // assert
        assert.ok(this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Vadim', age: 17 }]);
    });

    QUnit.test('stop selection do not work for multipleWithCheckBoxes selectionMode', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' }
        });

        assert.ok(this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
        // act
        this.selectionController.stopSelectionWithCheckboxes();
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(2);

        // assert
        assert.ok(this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Vadim', age: 17 }]);
    });

    QUnit.test('QUnit.start selection added select column to columns and rows', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        // act
        this.selectionController.startSelectionWithCheckboxes();
        this.selectionController.changeItemSelection(1);

        // assert
        assert.ok(this.selectionController.isSelectionWithCheckboxes());
        assert.deepEqual(this.dataController.items()[0].values, [false, 'Alex', 15]);
        assert.deepEqual(this.dataController.items()[1].values, [true, 'Dan', 16]);
    });

    QUnit.test('stop selection after QUnit.start remove select column to columns and rows', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.startSelectionWithCheckboxes();
        // act
        this.selectionController.stopSelectionWithCheckboxes();

        // assert
        assert.ok(!this.selectionController.isSelectionWithCheckboxes());
        assert.deepEqual(this.dataController.items()[0].values, ['Alex', 15]);
        assert.deepEqual(this.dataController.items()[1].values, ['Dan', 16]);
    });

    QUnit.test('QUnit.start selection rise columnsChanged/changed events', function(assert) {
        let columnsChangedCount = 0;
        let changedCount = 0;
        this.applyOptions({
            selection: { mode: 'multiple' }
        });
        this.columnsController.columnsChanged.add(function() {
            columnsChangedCount++;
        });
        this.dataController.changed.add(function() {
            changedCount++;
        });

        // act
        this.selectionController.startSelectionWithCheckboxes();

        // assert
        assert.ok(this.selectionController.isSelectionWithCheckboxes());
        assert.equal(columnsChangedCount, 1);
        assert.equal(changedCount, 1);
    });

    QUnit.test('stop selection after QUnit.start rise columnsChanged/changed events', function(assert) {
        let columnsChangedCount = 0;
        let changedCount = 0;
        this.applyOptions({
            selection: { mode: 'multiple' }
        });
        this.selectionController.startSelectionWithCheckboxes();

        this.columnsController.columnsChanged.add(function() {
            columnsChangedCount++;
        });
        this.dataController.changed.add(function() {
            changedCount++;
        });

        // act
        this.selectionController.stopSelectionWithCheckboxes();

        // assert
        assert.ok(!this.selectionController.isSelectionWithCheckboxes());
        assert.equal(columnsChangedCount, 1);
        assert.equal(changedCount, 1);
    });

    QUnit.test('stop selection without QUnit.start not rise columnsChanged/changed events', function(assert) {
        let columnsChangedCount = 0;
        let changedCount = 0;
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.columnsController.columnsChanged.add(function() {
            columnsChangedCount++;
        });
        this.dataController.changed.add(function() {
            changedCount++;
        });

        // act
        this.selectionController.stopSelectionWithCheckboxes();

        // assert
        assert.ok(!this.selectionController.isSelectionWithCheckboxes());
        assert.strictEqual(columnsChangedCount, 0);
        assert.strictEqual(changedCount, 0);
    });
});

QUnit.module('Selection SelectAllMode', {
    beforeEach: function() {
        setupModule.apply(this);

        this.applyOptions({
            columns: ['id', 'value'],
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' }
        });

        this.array = [
            { id: 1, value: 'value1' },
            { id: 2, value: 'value2' },
            { id: 3, value: 'value3' },
            { id: 4, value: 'value4' },
            { id: 5, value: 'value5' },
            { id: 6, value: 'value6' },
            { id: 7, value: 'value7' }
        ];

        this.dataSource = createDataSource(this.array, { key: 'id' }, { pageSize: 4 });
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
    },
    afterEach: teardownModule
}, () => {

    QUnit.test('Select All work for single selection. API method work always and not depends on selection mode', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.selectionController.selectRows(2);

        // act
        this.selectionController.selectAll();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys().length, 7);

        assert.ok(this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
    });

    QUnit.test('Select All for multiple selection', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true
            }
        });

        this.selectionController.selectRows(2);

        // act
        this.selectionController.selectAll();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [2, 1, 3, 4, 5, 6, 7]);

        assert.ok(this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
    });

    QUnit.test('Select All for multiple selection when selectAllMode is page', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true,
                selectAllMode: 'page'
            }
        });

        this.selectionController.selectRows(2);

        // act
        this.selectionController.selectAll();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [2, 1, 3, 4]);
        assert.strictEqual(this.selectionController.isSelectAll(), true, 'select all is true');
    });

    QUnit.test('Select All for multiple selection when selectAllMode is page and data is grouped', function(assert) {
        this.applyOptions({
            columns: ['id', { dataField: 'value', groupIndex: 0 }],
            grouping: {
                autoExpandAll: true
            },
            selection: {
                mode: 'multiple',
                allowSelectAll: true,
                selectAllMode: 'page'
            }
        });

        // act
        this.selectionController.selectAll();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 2]);
        assert.strictEqual(this.selectionController.isSelectAll(), true, 'select all is true');
    });

    QUnit.test('Select All and deselect for multiple selection when selectAllMode is page', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true,
                selectAllMode: 'page'
            }
        });

        // act
        this.selectionController.selectAll();
        this.selectionController.deselectRows(2);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 3, 4]);
        assert.strictEqual(this.selectionController.isSelectAll(), undefined, 'select all is undefined');
    });

    QUnit.test('Deselect All for multiple selection when selectAllMode is page', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true,
                selectAllMode: 'page'
            }
        });

        this.selectionController.selectRows([1, 2, 3, 4, 5]);

        // act
        this.selectionController.deselectAll();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [5]);
        assert.strictEqual(this.selectionController.isSelectAll(), false, 'select all is false');
    });

    // T350806
    QUnit.test('remove all items and refresh after selectAll', function(assert) {
        const that = this;

        this.applyOptions({
            selection: {
                mode: 'multiple'
            }
        });

        // act
        this.selectionController.selectAll();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 2, 3, 4, 5, 6, 7]);

        // act
        $.each(this.selectionController.getSelectedRowKeys(), function(index, key) {
            that.dataController.store().remove(key);
        });

        this.dataController.refresh();

        // assert
        assert.equal(this.array.length, 0, 'array length');
        assert.equal(this.dataController.items().length, 0, 'items count');
        assert.equal(this.dataController.totalCount(), 0, 'totalCount');
    });

    QUnit.test('Select All for multiple selection change page', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true
            }
        });

        this.selectionController.selectRows(2);

        // act
        this.selectionController.selectAll();
        this.dataController.pageIndex(1);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [2, 1, 3, 4, 5, 6, 7]);

        assert.equal(this.dataController.items()[0].data.id, 5);
        assert.ok(this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
    });

    QUnit.test('Select All for multipleWithCheckBoxes selection', function(assert) {
        this.applyOptions({
            columns: ['id', 'value'],
            selection: {
                mode: 'multiple', showCheckBoxesMode: 'always',
                allowSelectAll: true
            }
        });

        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' }
        });

        this.selectionController.selectRows(2);

        // act
        this.selectionController.selectAll();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [2, 1, 3, 4, 5, 6, 7]);

        assert.ok(this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
        assert.ok(this.selectionController.isSelectAll());
    });

    QUnit.test('Reset Select All after set selectedRows', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true
            }
        });

        this.selectionController.selectAll();

        // act
        this.selectionController.selectRows([1, 3]);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 3]);

        assert.ok(this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[3].isSelected);
    });

    QUnit.test('Reset Select All after changeRowSelection without keyboard keys', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true
            }
        });

        this.selectionController.selectAll();

        // act
        this.selectionController.changeItemSelection(0);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1]);

        assert.ok(this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[3].isSelected);
    });

    QUnit.test('Reset Select All after changeRowSelection with shift key', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true
            }
        });

        this.selectionController.selectAll();

        assert.ok(this.selectionController.isSelectAll());

        // act
        this.selectionController.changeItemSelection(0, { shift: true });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1]);

        assert.ok(this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[3].isSelected);
        assert.strictEqual(this.selectionController.isSelectAll(), undefined);
    });

    QUnit.test('changeRowSelection with control after Select All', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true
            }
        });

        this.selectionController.selectAll();

        // act
        this.selectionController.changeItemSelection(1, { control: true });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 3, 4, 5, 6, 7]);

        assert.ok(!this.selectionController.isSelectAll());
        assert.ok(this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
    });

    // B255078
    QUnit.test('Unselect item and select again after Select All', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true
            }
        });

        this.selectionController.selectAll();

        // act
        this.selectionController.changeItemSelection(1, { control: true });
        this.selectionController.changeItemSelection(1, { control: true });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 3, 4, 5, 6, 7, 2]);

        assert.ok(this.selectionController.isSelectAll());
        assert.ok(this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
    });

    QUnit.test('isSelectAll when use selectRows for select all items', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true
            }
        });

        // act
        this.selectionController.selectRows([1, 2, 3, 4, 5, 6, 7]);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 2, 3, 4, 5, 6, 7]);
        assert.ok(this.selectionController.isSelectAll());
    });

    QUnit.test('changeRowSelection when multipleWithCheckBoxes after Select All', function(assert) {
        this.applyOptions({
            columns: ['id', 'value'],
            selection: { mode: 'multiple', showCheckBoxesMode: 'always' }
        });

        this.applyOptions({
            selection: {
                mode: 'multiple', showCheckBoxesMode: 'always',
                allowSelectAll: true
            }
        });

        this.selectionController.selectAll();

        // act
        this.selectionController.changeItemSelection(1);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 3, 4, 5, 6, 7]);

        assert.ok(this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
        const selectColumn = this.columnsController.getVisibleColumns()[0];
        assert.ok(!selectColumn.isSelectAll);
        assert.equal(selectColumn.command, 'select');
    });

    QUnit.test('several changeRowSelection with control key after Select All', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                allowSelectAll: true
            }
        });

        this.selectionController.selectAll();

        // act
        this.selectionController.changeItemSelection(1, { control: true });
        this.selectionController.changeItemSelection(2, { control: true });
        this.selectionController.changeItemSelection(1, { control: true });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [1, 4, 5, 6, 7, 2]);

        assert.ok(this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(this.dataController.items()[3].isSelected);
    });

    QUnit.test('get isSelected rows after Select All', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                storeSelectedItems: true,
                allowSelectAll: true
            }
        });

        this.selectionController.selectAll();
        this.selectionController.changeItemSelection(1, { control: true });
        this.selectionController.changeItemSelection(2, { control: true });

        // act
        const selectedRows = this.selectionController.getSelectedRowsData();
        // assert
        assert.deepEqual(selectedRows, [
            { id: 1, value: 'value1' },
            { id: 4, value: 'value4' },
            { id: 5, value: 'value5' },
            { id: 6, value: 'value6' },
            { id: 7, value: 'value7' }
        ]);
    });

    QUnit.test('get isSelected rows after Select All when dataSource has filter', function(assert) {
        this.applyOptions({
            selection: {
                mode: 'multiple',
                storeSelectedItems: true,
                allowSelectAll: true
            }
        });

        this.dataController.filter(['id', '<', 6]);

        this.selectionController.selectAll();
        this.selectionController.changeItemSelection(1, { control: true });
        this.selectionController.changeItemSelection(2, { control: true });

        // act
        const selectedRows = this.selectionController.getSelectedRowsData();
        // assert
        assert.deepEqual(selectedRows, [
            { id: 1, value: 'value1' },
            { id: 4, value: 'value4' },
            { id: 5, value: 'value5' }
        ]);
    });

    // T215341
    QUnit.test('selected rows after Select All when filter row defined', function(assert) {
        this.applyOptions({
            columns: [{ dataField: 'id', selectedFilterOperation: '<', filterValue: 4 }, { dataField: 'value' }],
            selection: {
                mode: 'multiple',
                storeSelectedItems: true,
                allowSelectAll: true
            }
        });

        this.dataController.reload();

        // act
        this.selectionController.selectRows([5]);
        this.selectionController.selectAll();

        // assert
        const selectedRows = this.selectionController.getSelectedRowsData();
        assert.equal(selectedRows.length, 4, 'selected rows count');
        assert.ok(this.selectionController.isSelectAll(), 'isSelectAll');
        assert.deepEqual(selectedRows, [
            { id: 5, value: 'value5' }, // selected row is not reset after selectAll
            { id: 1, value: 'value1' },
            { id: 2, value: 'value2' },
            { id: 3, value: 'value3' }
        ]);

        // act
        this.columnOption('id', 'filterValue', undefined);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowsData().length, 4, 'selected rows count after clear filter');
        assert.strictEqual(this.selectionController.isSelectAll(), undefined, 'isSelectAll changed to indeterminate state after change filter');
    });

    QUnit.test('deselectAll when no filtering', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]); // 1, 3

        // act
        this.selectionController.deselectAll();

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [], 'no selected row keys');
        assert.strictEqual(this.selectionController.isSelectAll(), false, 'isSelectAll');
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[3].isSelected);
    });

    // T215341, T319862
    QUnit.test('selected rows after Deselect All when filter row defined', function(assert) {
        this.applyOptions({
            columns: [{ dataField: 'id', selectedFilterOperation: '<', filterValue: 4 }, { dataField: 'value' }],
            selection: {
                mode: 'multiple',
                storeSelectedItems: true,
                allowSelectAll: true
            }
        });

        // act
        this.selectRows([1, 2, 3, 4]);
        this.deselectAll();

        // assert
        const selectedRows = this.selectionController.getSelectedRowsData();
        assert.equal(selectedRows.length, 1, 'selected rows count');
        assert.deepEqual(selectedRows, [{ id: 4, value: 'value4' }]);
    });

    QUnit.test('get isSelected rows after Select All when dataSource has complex key', function(assert) {
        this.dataSource = createDataSource(this.array, { key: ['id', 'value'] }, { pageSize: 4 });
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.applyOptions({
            selection: {
                mode: 'multiple',
                storeSelectedItems: true,
                allowSelectAll: true
            }
        });

        this.selectionController.selectAll();
        this.selectionController.changeItemSelection(1, { control: true });
        this.selectionController.changeItemSelection(2, { control: true });

        // act
        const selectedRows = this.selectionController.getSelectedRowsData();
        // assert
        assert.deepEqual(selectedRows, [
            { id: 1, value: 'value1' },
            { id: 4, value: 'value4' },
            { id: 5, value: 'value5' },
            { id: 6, value: 'value6' },
            { id: 7, value: 'value7' }
        ]);
    });

    QUnit.test('get isSelected rows after Select All when dataSource has no key', function(assert) {
        this.dataSource = createDataSource(this.array, {}, { pageSize: 4 });
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();
        this.applyOptions({
            selection: {
                mode: 'multiple',
                storeSelectedItems: true,
                allowSelectAll: true
            }
        });

        this.selectionController.selectAll();
        this.selectionController.changeItemSelection(1, { control: true });
        this.selectionController.changeItemSelection(2, { control: true });

        // act
        const selectedRows = this.selectionController.getSelectedRowsData();
        // assert
        assert.deepEqual(selectedRows, [
            { id: 1, value: 'value1' },
            { id: 4, value: 'value4' },
            { id: 5, value: 'value5' },
            { id: 6, value: 'value6' },
            { id: 7, value: 'value7' }
        ]);
    });

    // T843852
    QUnit.test('SelectAll should not select all rows if filter by search is applied and filter length is larger than maxFilterLengthInRequest', function(assert) {
    // arrange
        const data = [{
            'id': '0', 'field1': '0', 'field2': '0'
        }, {
            'id': '1', 'field1': '1', 'field2': '1'
        }, {
            'id': '2', 'field1': '2', 'field2': '2'
        }];
        const onSelectionChangedSpy = sinon.spy();

        this.dataSource = createDataSource(data, { key: 'id' });
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        this.applyOptions({
            columns: ['id', 'field1', 'field3'],
            loadingTimeout: null,
            selection: {
                mode: 'multiple',
                maxFilterLengthInRequest: 1
            },
            searchPanel: { visible: true, text: '0' },
            onSelectionChanged: onSelectionChangedSpy
        });

        // act
        this.selectionController.selectAll();

        let onSelectionChangedArgs = onSelectionChangedSpy.args[0][0];

        // assert
        assert.equal(onSelectionChangedSpy.callCount, 1, 'onSelectionChanged call count');

        assert.deepEqual(onSelectionChangedArgs.currentSelectedRowKeys, ['0'], 'current selected row keys');
        assert.deepEqual(onSelectionChangedArgs.selectedRowKeys, ['0'], 'selected row keys');
        assert.equal(onSelectionChangedArgs.selectedRowsData.length, 1, 'selected rows data length');

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), ['0'], 'selected row keys');

        // act
        this.selectionController.deselectAll();

        onSelectionChangedArgs = onSelectionChangedSpy.args[1][0];

        // assert
        assert.equal(onSelectionChangedSpy.callCount, 2, 'onSelectionChanged call count');

        assert.deepEqual(onSelectionChangedArgs.currentSelectedRowKeys, [], 'current selected row keys');
        assert.deepEqual(onSelectionChangedArgs.selectedRowKeys, [], 'selected row keys');
        assert.equal(onSelectionChangedArgs.selectedRowsData.length, 0, 'selected rows data length');

        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [], 'selected row keys');
    });
});

QUnit.module('Selection when grouping', {
    beforeEach: function() {
        setupModule.apply(this);

        this.applyOptions({
            columns: ['group', 'value'],
            remoteOperations: { filtering: true, sorting: true, paging: true },
            grouping: { autoExpandAll: true }
        });

        this.array = [
            { group: 'A', value: 1 },
            { group: 'A', value: 2 },
            { group: 'B', value: 3 },
            { group: 'B', value: 4 },
            { group: 'B', value: 5 },
            { group: 'C', value: 6 },
            { group: 'C', value: 7 }
        ];

        this.dataSource = createDataSource(this.array, {}, { group: 'group', pageSize: 3, paginate: true });
    },
    afterEach: teardownModule
}, () => {

    QUnit.test('set selectedRows for single selection', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        this.selectionController.selectRows({ group: 'A', value: 2 });

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);

        assert.equal(this.dataController.items()[2].data.value, 2);
        assert.ok(this.dataController.items()[2].isSelected);
    });

    QUnit.test('changeRowSelection for group row', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        this.selectionController.changeItemSelection(0);

        assert.strictEqual(this.dataController.items()[0].groupIndex, 0);
        assert.ok(!this.dataController.items()[0].isSelected);
    });

    QUnit.test('changeRowSelection for data row', function(assert) {
        this.applyOptions({
            selection: { mode: 'single' }
        });

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        this.selectionController.changeItemSelection(1);

        assert.ok(!this.dataController.items()[0].isSelected);

        assert.equal(this.dataController.items()[1].data.value, 1);
        assert.ok(this.dataController.items()[1].isSelected);
    });

    QUnit.test('changeRowSelection for several data row', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(4, { control: true });

        assert.equal(this.dataController.items()[1].data.value, 1);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
        assert.ok(!this.dataController.items()[3].isSelected);
        assert.equal(this.dataController.items()[4].data.value, 3);
        assert.ok(this.dataController.items()[4].isSelected);
    });

    QUnit.test('changeRowSelection when continue page', function(assert) {
        this.applyOptions({
            remoteOperations: { filtering: true, sorting: true, paging: true },
            selection: { mode: 'multiple' }
        });

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        this.dataSource.reload();

        this.dataController.pageIndex(1);
        this.selectionController.changeItemSelection(1);

        assert.ok(this.dataController._dataSource.items()[0].isContinuation);
        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
    });

    QUnit.test('changeRowSelection with shift', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple' }
        });

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(4, { shift: true });

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
        assert.strictEqual(this.dataController.items()[3].groupIndex, 0);
        assert.ok(!this.dataController.items()[3].isSelected);
        assert.ok(this.dataController.items()[4].isSelected);
    });

    QUnit.test('selectAll when remoteOperations enabled', function(assert) {
        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        // act
        this.selectionController.selectAll();

        // assert
        assert.strictEqual(this.dataController.items()[1].rowType, 'data', 'second row type');
        assert.deepEqual(this.selectionController.getSelectedRowsData(), this.array, 'selected items');
        assert.strictEqual(this.selectionController.isSelectAll(), true, 'isSelectAll');

        // act
        this.selectionController.deselectRows([this.array[0]]);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowsData(), this.array.slice(1), 'selected items');
        assert.strictEqual(this.selectionController.isSelectAll(), undefined, 'isSelectAll');
    });

    QUnit.test('selectAll when remoteOperations disabled', function(assert) {
        this.applyOptions({
            remoteOperations: false,
            grouping: { autoExpandAll: false }
        });

        this.dataController.setDataSource(this.dataSource);
        this.dataSource.load();

        // act
        this.selectionController.selectAll();

        // assert
        assert.strictEqual(this.dataController.items()[1].rowType, 'group', 'second row type');
        assert.deepEqual(this.selectionController.getSelectedRowsData(), this.array, 'selected items');
        assert.strictEqual(this.selectionController.isSelectAll(), true, 'isSelectAll');

        // act
        this.selectionController.deselectRows([this.array[0]]);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowsData(), this.array.slice(1), 'selected items');
        assert.strictEqual(this.selectionController.isSelectAll(), undefined, 'isSelectAll');
    });
});

QUnit.module('Multiple selection with checkboxes on click', { beforeEach: setupSelectionModule, afterEach: teardownSelectionModule }, () => {

    QUnit.test('changeRowSelection for one row', function(assert) {
    // arrange
        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' }
        });

        // act
        this.selectionController.changeItemSelection(1);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);
        assert.ok(!this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
    });

    QUnit.test('changeRowSelection for two rows', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' }
        });

        // act
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(2);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Vadim', age: 17 }]);
        assert.ok(!this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
    });

    QUnit.test('changeRowSelection for select second item with control key', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' }
        });

        // act
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(2, { control: true });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Vadim', age: 17 }]);
        assert.ok(this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
    });

    QUnit.test('changeRowSelection for select second item with control key and unselect it without control', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' }
        });

        // act
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(2, { control: true });
        this.selectionController.changeItemSelection(2);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);
        assert.ok(this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
    });

    QUnit.test('changeRowSelection for select second item with control key and unselect all items without control', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' }
        });

        // act
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(2, { control: true });
        this.selectionController.changeItemSelection(2);
        this.selectionController.changeItemSelection(1);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), []);
        assert.ok(!this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
    });

    QUnit.test('changeRowSelection for select items with shift key', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' }
        });

        // act
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(3, { shift: true });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }, { name: 'Vadim', age: 17 }]);
        assert.ok(this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
    });

    QUnit.test('changeRowSelection for select items with shift key when isSelectionWithCheckboxes enabled', function(assert) {
        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' }
        });

        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(2, { control: true });
        // act
        this.selectionController.changeItemSelection(4, { shift: true });

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Vadim', age: 17 }, { name: 'Sergey', age: 18 }, { name: 'Dmitry', age: 18 }]);
        assert.ok(this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
    });

    // T117203
    QUnit.test('selectRows with several values', function(assert) {
        let selectionChangedCallCount = 0;
        // arrange
        this.applyOptions({
            selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' },
            onSelectionChanged: function(e) {
                selectionChangedCallCount++;
            }
        });

        // act
        this.selectionController.selectRows([{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);

        // assert
        assert.strictEqual(selectionChangedCallCount, 1, 'selectionChanged called one time');
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }, { name: 'Dmitry', age: 18 }]);
        assert.ok(this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
    });
});

QUnit.module('Selection with views', {
    beforeEach: function() {
        this.array = [
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 16 },
            { name: 'Vadim', age: 17 },
            { name: 'Dmitry', age: 18 },
            { name: 'Sergey', age: 18 },
            { name: 'Kate', age: 20 },
            { name: 'Dan', age: 21 }
        ];
        this.options = {
            showColumnHeaders: true,
            selection: { mode: 'multiple', showCheckBoxesMode: 'always', allowSelectAll: true },
            columns: ['name', 'age'],
            dataSource: {
                asyncLoadEnabled: false,
                store: this.array
            }
        };

        this.setup = function() {
            setupDataGridModules(this, ['data', 'columns', 'selection', 'columnHeaders', 'rows', 'editorFactory', 'editing', 'editingCellBased'], {
                initViews: true
            });
        };

    },
    afterEach: function() {
        this.dispose();
    }
}, () => {

    // B254109
    QUnit.test('unselect row after selectAll work incorrectly', function(assert) {
    // arrange
        const that = this;
        const testElement = $('#container').width(800);

        that.setup();

        that.columnHeadersView.render(testElement);
        that.rowsView.render(testElement);

        that.selectionController.selectAll();

        const $checkbox = $('.dx-header-row').find('.dx-checkbox');

        // assert
        assert.ok($checkbox.length);
        assert.ok($checkbox.hasClass('dx-checkbox-checked'));

        // act
        that.selectionController.changeItemSelection(1);

        // assert
        assert.equal(that.selectionController.getSelectedRowKeys().length, 6, 'length isSelected rows');
        assert.strictEqual(that.selectionController.isSelectAll(), undefined, 'isSelectAll undefined');
        assert.ok($checkbox.hasClass('dx-checkbox-indeterminate'), 'indeterminate state of checkbox');
        assert.ok(that.dataController.items()[0].isSelected);
        assert.ok(!that.dataController.items()[1].isSelected);
        assert.ok(that.dataController.items()[2].isSelected);
        assert.ok(that.dataController.items()[3].isSelected);
        assert.ok(that.dataController.items()[4].isSelected);
        assert.ok(that.dataController.items()[5].isSelected);
        assert.ok(that.dataController.items()[6].isSelected);
    });

    QUnit.test('changeRowSelection onClick Multiple mode', function(assert) {
        const testElement = $('#container').width(800);

        this.options.selection.showCheckBoxesMode = 'onClick';
        this.setup();
        this.columnHeadersView.render(testElement);
        this.rowsView.render(testElement);

        // act
        this.selectionController.changeItemSelection(1);

        // assert
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Dan', age: 16 }]);
        assert.ok(!this.selectionController.isSelectionWithCheckboxes(), 'isSelectionWithCheckboxes');
    });

    ['cell', 'batch'].forEach(editMode => {
        QUnit.test(`changeRowSelection for edited data if editing.mode: ${editMode} (T357814)`, function(assert) {
        // arrange
            const $testElement = $('#container').width(800);
            const rowsViewWrapper = dataGridWrapper.rowsView;

            this.options.selection.showCheckBoxesMode = 'onClick';
            this.options.editing = {
                mode: editMode,
                allowUpdating: true
            };
            this.setup();
            this.columnHeadersView.render($testElement);
            this.rowsView.render($testElement);
            this.cellValue(0, 1, 'Test');

            // act
            this.selectionController.changeItemSelection(0);

            // assert
            const dataCell = rowsViewWrapper.getDataRow(0).getCell(1);
            assert.equal(dataCell.getElement().text(), 'Test', 'Text of the first cell');
            assert.ok(rowsViewWrapper.getDataRow(0).isSelected(), 'First row is selected');
            assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Alex', age: 15 }], 'selected row key of the first row');

            // act
            this.saveEditData();

            // assert
            assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ name: 'Test', age: 15 }], 'selected row key of the first row after save');
        });

        QUnit.test(`changeRowSelection for editing data if editing.mode: ${editMode} (T654321)`, function(assert) {
        // arrange
            const that = this;
            const $testElement = $('#container').width(800);
            const clock = sinon.useFakeTimers();
            const rowsViewWrapper = dataGridWrapper.rowsView;

            that.options.selection.showCheckBoxesMode = 'onClick';
            that.options.editing = {
                mode: editMode,
                allowUpdating: true
            };
            that.options.onSelectionChanged = function(e) {
                assert.deepEqual(e.selectedRowKeys, [{ 'name': 'Alex', 'age': 15 }], 'selectedRowKeys contains original data');
            };
            that.setup();
            that.columnHeadersView.render($testElement);
            that.rowsView.render($testElement);

            // act
            that.editCell(0, 1);
            const editor = rowsViewWrapper.getDataRow(0).getCell(1).getEditor();
            editor.getInputElement().val('Test');

            const dataRow0 = rowsViewWrapper.getDataRow(0);
            const $selectCheckBox = dataRow0.getSelectCheckBox(0).getElement();
            $selectCheckBox.trigger(clickEvent.name);

            clock.tick(10);

            clock.restore();
        });
    });

    QUnit.test('Indeterminate state of selectAll', function(assert) {
        const testElement = $('#container');

        this.setup();
        this.columnHeadersView.render(testElement);
        this.rowsView.render(testElement);

        const $checkbox = $('.dx-header-row').find('.dx-checkbox');

        // act
        this.selectionController.changeItemSelection(1);
        assert.ok($checkbox.hasClass('dx-checkbox-indeterminate'), 'indeterminate state of checkbox');
    });


    QUnit.test('selectAll checkbox state after change filter', function(assert) {
        let $checkbox;
        const testElement = $('#container');

        this.setup();
        this.columnHeadersView.render(testElement);
        this.rowsView.render(testElement);

        // act
        this.dataController.filter(['age', '<', 17]);
        this.selectionController.selectAll();

        // assert
        $checkbox = $('.dx-header-row').find('.dx-checkbox');
        assert.strictEqual($checkbox.dxCheckBox('option', 'value'), true, 'true state of checkbox');

        // act
        this.dataController.filter(['age', '>', 17]);

        // assert
        $checkbox = $('.dx-header-row').find('.dx-checkbox');
        assert.strictEqual($checkbox.dxCheckBox('option', 'value'), false, 'false state of checkbox');

        // act
        this.dataController.clearFilter('dataSource');

        // assert
        $checkbox = $('.dx-header-row').find('.dx-checkbox');
        assert.strictEqual($checkbox.dxCheckBox('option', 'value'), undefined, 'indeterminate state of checkbox');
    });

    // T959045
    QUnit.test('selectAll checkbox should be visible after change filter if no data', function(assert) {
        let $checkbox;
        const testElement = $('#container');

        this.setup();
        this.columnHeadersView.render(testElement);
        this.rowsView.render(testElement);

        // assert
        $checkbox = $('.dx-header-row').find('.dx-checkbox');
        assert.ok($checkbox.dxCheckBox('option', 'visible'), 'checkbox is visible');

        // act
        this.filter(['age', '<', 1]);
        this.refresh();

        // assert
        $checkbox = $('.dx-header-row').find('.dx-checkbox');
        assert.notOk($checkbox.dxCheckBox('option', 'visible'), 'checkbox is not visible');
    });

    // T959045
    QUnit.test('selectAll checkbox should be visible if no data after first load', function(assert) {
        const testElement = $('#container');

        // act
        this.options.dataSource.filter = ['age', '<', 1];
        this.setup();
        this.columnHeadersView.render(testElement);
        this.rowsView.render(testElement);

        // assert
        const $checkbox = $('.dx-header-row').find('.dx-checkbox');
        assert.notOk($checkbox.dxCheckBox('option', 'visible'), 'checkbox is not visible');
    });

    QUnit.test('Uncheck selectAll button call deselectAll', function(assert) {
        const testElement = $('#container');

        this.setup();
        this.columnHeadersView.render(testElement);
        this.rowsView.render(testElement);

        // act
        this.selectionController.selectAll();

        // assert
        const $checkbox = $('.dx-header-row').find('.dx-checkbox');
        assert.strictEqual($checkbox.dxCheckBox('option', 'value'), true, 'true state of checkbox');

        // act
        this.dataController.filter(['age', '>=', 17]);
        $checkbox.trigger(clickEvent.name);

        // assert
        assert.strictEqual($checkbox.dxCheckBox('option', 'value'), false, 'false state of checkbox');
        assert.deepEqual(this.selectionController.getSelectedRowKeys(), [this.array[0], this.array[1]], 'selected items after deselectAll');
    });

    // T102394
    QUnit.test('Indeterminate state of selectAll when selectedRowKeys defined', function(assert) {
        const testElement = $('#container');

        this.options.selectedRowKeys = [this.array[1]];
        this.setup();
        this.columnHeadersView.render(testElement);
        this.rowsView.render(testElement);

        const $checkbox = $('.dx-header-row').find('.dx-checkbox');

        // assert
        assert.ok($checkbox.hasClass('dx-checkbox-indeterminate'), 'indeterminate state of checkbox');
    });


    QUnit.test('Unchecked of selectAll when rows are not isSelected', function(assert) {
        const testElement = $('#container');

        this.setup();
        this.columnHeadersView.render(testElement);
        this.rowsView.render(testElement);

        const $checkbox = $('.dx-header-row').find('.dx-checkbox');

        // act
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(1);

        assert.ok(!$checkbox.hasClass('dx-checkbox-checked'), 'Unchecked state of checkbox');
        assert.ok(!$checkbox.hasClass('dx-checkbox-indeterminate'), 'indeterminate state of checkbox');
    });

    // B255078
    QUnit.test('Checked of selectAll when all rows are isSelected', function(assert) {
        const testElement = $('#container');

        this.setup();
        this.columnHeadersView.render(testElement);
        this.rowsView.render(testElement);

        const $checkbox = $('.dx-header-row').find('.dx-checkbox');

        // act
        this.selectionController.selectAll();
        this.selectionController.changeItemSelection(1);
        this.selectionController.changeItemSelection(1);

        assert.ok($checkbox.hasClass('dx-checkbox-checked'), 'checked state of checkbox');
    });

    // T108078
    QUnit.test('updateSelection with invalid itemIndexes', function(assert) {
        const testElement = $('#container');

        this.setup();
        this.rowsView.render(testElement);

        // act
        this.dataController.updateItems({
            changeType: 'updateSelection',
            itemIndexes: [10]
        });


        // assert
        assert.equal(testElement.find('.dx-checkbox').length, 7);
        assert.equal(testElement.find('.dx-checkbox-checked').length, 0);
    });

    // T642034
    QUnit.test('selecting of row when rowTemplate contains several tr tags', function(assert) {
        const testElement = $('#container');

        this.setup();
        this.options.selection = { mode: 'single' };
        this.options.rowTemplate = function(container, options) {
            const data = options.data;
            $(container).append('<tbody class=\'dx-row\'><tr><td id=\'' + data.name + '\'>' + data.name + '</td></tr><tr><td>' + data.age + '</td></tr></tbody>');
        };
        this.rowsView.render(testElement);

        // act
        this.dataController.updateItems({
            changeType: 'updateSelection',
            itemIndexes: [1]
        });

        const ACTIVE_ID = '#Dan';
        testElement.find(ACTIVE_ID).trigger(clickEvent.name);

        // assert
        const selectedRows = testElement.find('.dx-selection');
        assert.equal(selectedRows.length, 1);
        assert.equal(selectedRows[0].tagName.toLowerCase(), 'tbody');
        assert.ok(selectedRows.has(ACTIVE_ID));
    });

    // T152315
    QUnit.test('Selection state refreshing on dataController change', function(assert) {
    // arrange
        const that = this;
        const testElement = $('#container').width(800);

        this.options.selection.showCheckBoxesMode = 'onClick';
        that.setup();
        that.columnHeadersView.render(testElement);
        that.rowsView.render(testElement);

        // act
        that.selectionController.startSelectionWithCheckboxes();
        that.selectionController.selectRows([{ name: 'Dan', age: 16 }]); // 1 rows

        // assert
        const $headerCheckBox = $('.dx-header-row .dx-checkbox');
        const isHeaderCheckBoxInIntermediateState = $headerCheckBox.length && $headerCheckBox.hasClass('dx-checkbox-indeterminate');
        assert.ok(isHeaderCheckBoxInIntermediateState, 'After one item select, checkbox in header panel has indeterminate state');

        // act
        that.editingController.deleteRow(1);
        const isHeaderCheckBoxChecked = $headerCheckBox.length && ($headerCheckBox.hasClass('dx-checkbox-checked') || $headerCheckBox.hasClass('dx-checkbox-indeterminate'));

        // assert
        assert.equal(that.rowsView.element().find('.dx-select-checkboxes-hidden').length, 1, 'checkboxes are hidden');
        assert.ok(!isHeaderCheckBoxChecked, 'CheckBox in header panel has no indeterminate or checked state');
    });

    QUnit.test('Add checkboxes hidden class to table', function(assert) {
        const testElement = $('#container');

        this.options.selection.mode = 'multiple';
        this.options.selection.showCheckBoxesMode = 'onClick';

        this.setup();

        this.rowsView.render(testElement);

        assert.ok(this.rowsView.element().find('.dx-select-checkboxes-hidden').length);
    });

    QUnit.test('Show checkboxes when selectedRowKeys are defined from options_T102396', function(assert) {
    // arrange
        $.extend(this.option, {
            selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' },
            selectedRowKeys: [16, 17],
            dataSource: { store: { type: 'array', data: [{ name: 'Dan', age: 16 }, { name: 'Vadim', age: 17 }], key: 'age' } }
        });
        this.setup();
        this.rowsView.render('#container');

        // act
        this.dataController.optionChanged({ name: 'dataSource' });

        // assert
        assert.ok(this.selectionController.isSelectionWithCheckboxes());
        assert.ok(!$('#container').find('table').hasClass('dx-select-checkboxes-hidden'));
    });


    QUnit.test('change selectAllMode to \'page\' at runtime', function(assert) {
        const testElement = $('#container');

        $.extend(this.option, {
            loadingTimeout: null,
            dataSource: this.array,
            selection: {
                mode: 'multiple',
                selectAllMode: 'allPages',
                showCheckBoxesMode: 'always'
            }
        });

        this.setup();

        this.columnHeadersView.render(testElement);

        this.rowsView.render(testElement);

        this.selectionController.selectAll();

        this.option('selection.selectAllMode', 'page');

        const $checkbox = testElement.find('.dx-checkbox');

        assert.strictEqual($checkbox.length, 8);
        $.each($checkbox, function(i) {
            assert.strictEqual($(this).dxCheckBox('option', 'value'), true, i + ' checkbox value');
        });
    });

    QUnit.test('change selectAllMode to \'allPages\' at runtime', function(assert) {
        const testElement = $('#container');

        $.extend(this.options, {
            loadingTimeout: null,
            dataSource: createDataSource(this.array, {}, {
                pageSize: 4,
                paginate: true
            }),
            selection: {
                mode: 'multiple',
                selectAllMode: 'page',
                showCheckBoxesMode: 'always'
            }
        });

        this.setup();

        this.columnHeadersView.render(testElement);

        this.rowsView.render(testElement);

        this.selectionController.selectAll();
        this.dataController.pageIndex(1);

        this.option('selection.selectAllMode', 'allPages');

        const $checkbox = testElement.find('.dx-checkbox');

        assert.strictEqual($checkbox.length, 4);
        $.each($checkbox, function(i) {
            if(i === 0) {
                assert.strictEqual($(this).dxCheckBox('option', 'value'), undefined, i + ' checkbox value');
            } else {
                assert.strictEqual($(this).dxCheckBox('option', 'value'), false, i + ' checkbox value');
            }
        });
    });

    // T550013
    QUnit.test('Click on selected selection checkbox with shift key', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            const testElement = $('#container');

            this.options.selection.showCheckBoxesMode = 'onClick';
            this.setup();
            this.columnHeadersView.render(testElement);
            this.rowsView.render(testElement);

            // act
            const $checkbox = testElement.find('.dx-data-row .dx-select-checkbox').eq(0);
            $checkbox.trigger(clickEvent.name);
            $checkbox.trigger($.Event(clickEvent.name, { shiftKey: true }));

            // assert
            assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ age: 15, name: 'Alex' }], 'one item is selected');
            assert.strictEqual($checkbox.dxCheckBox('instance').option('value'), true, 'checkbox is checked');
        } finally {
            clock.restore();
        }
    });

    // T550013
    QUnit.test('Click on selected selection checkbox with shift key to select range', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            const testElement = $('#container');

            this.options.selection.showCheckBoxesMode = 'onClick';
            this.setup();
            this.columnHeadersView.render(testElement);
            this.rowsView.render(testElement);

            // act
            const $checkboxes = testElement.find('.dx-data-row .dx-select-checkbox');
            $checkboxes.eq(1).trigger(clickEvent.name);
            $checkboxes.eq(0).trigger(clickEvent.name);
            $checkboxes.eq(1).trigger($.Event(clickEvent.name, { shiftKey: true }));

            // assert
            assert.deepEqual(this.selectionController.getSelectedRowKeys().length, 2, 'two items are selected');
            assert.strictEqual($checkboxes.eq(0).dxCheckBox('instance').option('value'), true, 'checkbox 0 is checked');
            assert.strictEqual($checkboxes.eq(1).dxCheckBox('instance').option('value'), true, 'checkbox 1 is checked');
        } finally {
            clock.restore();
        }
    });

    // T550013
    QUnit.test('Click on unselected selection checkbox with shift key', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            const testElement = $('#container');

            this.options.selection.showCheckBoxesMode = 'onClick';
            this.setup();
            this.columnHeadersView.render(testElement);
            this.rowsView.render(testElement);

            // act
            const $checkbox = testElement.find('.dx-data-row .dx-select-checkbox').eq(0);
            $checkbox.trigger(clickEvent.name);
            $checkbox.trigger(clickEvent.name);
            $checkbox.trigger($.Event(clickEvent.name, { shiftKey: true }));

            // assert
            assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ age: 15, name: 'Alex' }], 'one item is selected');
            assert.strictEqual($checkbox.dxCheckBox('instance').option('value'), true, 'checkbox is checked');
        } finally {
            clock.restore();
        }
    });

    // T550013
    QUnit.test('Click on cell with checkbox should select row', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            const testElement = $('#container');

            this.options.selection.showCheckBoxesMode = 'always';
            this.setup();
            this.columnHeadersView.render(testElement);
            this.rowsView.render(testElement);

            // act
            const $selectionCell = testElement.find('.dx-data-row .dx-command-select').eq(0);
            $selectionCell.trigger(clickEvent.name);

            // assert
            assert.deepEqual(this.selectionController.getSelectedRowKeys(), [{ age: 15, name: 'Alex' }], 'one item is selected');
            assert.strictEqual($selectionCell.find('.dx-checkbox').dxCheckBox('instance').option('value'), true, 'checkbox is checked');
        } finally {
            clock.restore();
        }
    });

    // T1093760
    QUnit.test('Check aria-selected attribute when select and deselect row', function(assert) {
        // arrange
        const $testElement = $('#container');
        const firstRowKey = { name: 'Alex', age: 15 };

        this.setup();
        this.rowsView.render($testElement);

        // assert
        let $rowElement = $(this.rowsView.getRowElement(0));
        let cellElements = $rowElement.children().toArray();
        assert.strictEqual($rowElement.attr('aria-selected'), 'false', 'first row - aria-selected = false');
        assert.strictEqual(cellElements.length, 3, 'cell count');

        cellElements.forEach((cellElement) => {
            assert.notOk(cellElement.hasAttribute('aria-selected'), 'cell has no aria-selected attribute');
        });

        // act
        this.selectionController.selectRows([firstRowKey]);

        // assert
        $rowElement = $(this.rowsView.getRowElement(0));
        cellElements = $rowElement.children().toArray();
        assert.strictEqual($rowElement.attr('aria-selected'), 'true', 'first row - aria-selected = true');
        assert.strictEqual(cellElements.length, 3, 'cell count');

        cellElements.forEach((cellElement) => {
            assert.notOk(cellElement.hasAttribute('aria-selected'), 'cell has no aria-selected attribute');
        });

        // act
        this.selectionController.deselectRows([firstRowKey]);

        // assert
        $rowElement = $(this.rowsView.getRowElement(0));
        cellElements = $rowElement.children().toArray();
        assert.strictEqual($rowElement.attr('aria-selected'), 'false', 'first row - aria-selected = false');
        assert.strictEqual(cellElements.length, 3, 'cell count');

        cellElements.forEach((cellElement) => {
            assert.notOk(cellElement.hasAttribute('aria-selected'), 'cell has no aria-selected attribute');
        });
    });

    // T1141405
    QUnit.test('The Select All state should be updated after all async templates have rendered (React)', function(assert) {
        // arrange
        const clock = sinon.useFakeTimers();

        try {
            const d = $.Deferred();
            const $testElement = $('#container');

            this.options.loadingTimeout = 30;
            this.options.renderAsync = false;
            this.options.templatesRenderAsynchronously = true;
            this.setup();
            this.columnHeadersView._templateDeferreds.add(d);
            sinon.spy(this.columnHeadersView, '_updateSelectAllValue');

            // act
            this.columnHeadersView.render($testElement);

            // assert
            assert.strictEqual(this.columnHeadersView._updateSelectAllValue.callCount, 0, 'select all state isn\'t updated');

            // act
            clock.tick(30);

            // assert
            assert.strictEqual(this.columnHeadersView._updateSelectAllValue.callCount, 0, 'select all state isn\'t updated');

            // act
            this.columnHeadersView._templateDeferreds.delete(d);
            d.resolve();

            // assert
            const $selectAllCheckbox = $('.dx-header-row .dx-command-select').find('.dx-checkbox');
            assert.strictEqual(this.columnHeadersView._updateSelectAllValue.callCount, 1, 'select all state is updated');
            assert.strictEqual($selectAllCheckbox.dxCheckBox('option', 'visible'), true, 'select all checkbox is visible');
        } finally {
            clock.restore();
        }
    });
});

QUnit.module('Deferred selection', {
    beforeEach: function() {
        this.setupDataGrid = function(options) {
            setupDataGridModules(this, ['data', 'columns', 'selection', 'stateStoring', 'grouping', 'filterRow', 'editing'], { initDefaultOptions: true, options: options });
        };

        this.data = [
            { id: 1, name: 'Alex', age: 15 },
            { id: 2, name: 'Dan', age: 16 },
            { id: 3, name: 'Vadim', age: 17 },
            { id: 4, name: 'Dmitry', age: 18 },
            { id: 5, name: 'Sergey', age: 18 },
            { id: 6, name: 'Kate', age: 20 },
            { id: 7, name: 'Dan', age: 21 }
        ];

        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        teardownModule.apply(this);
    }
}, () => {

    QUnit.test('init', function(assert) {
    // act
        this.setupDataGrid({
            dataSource: createDataSource(this.data, { key: 'id' }),
            selection: {
                mode: 'multiple',
                deferred: true
            }
        });

        this.clock.tick(10);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(!this.dataController.items()[1].isSelected);
        assert.ok(!this.dataController.items()[2].isSelected);
    });

    QUnit.test('init with selectionFilter', function(assert) {
    // act
        this.setupDataGrid({
            dataSource: createDataSource(this.data, { key: 'id' }),
            selectionFilter: [[['id', '=', 2], 'or', ['id', '=', 3]]],
            selection: {
                deferred: true
            }
        });

        this.clock.tick(10);

        assert.ok(!this.dataController.items()[0].isSelected);
        assert.ok(this.dataController.items()[1].isSelected);
        assert.ok(this.dataController.items()[2].isSelected);
    });

    // T461315
    QUnit.test('Checkboxes should not be visible when selected one row', function(assert) {
    // arrange, act
        this.setupDataGrid({
            dataSource: createDataSource(this.data, { key: 'id' }),
            selectionFilter: ['id', '=', 2],
            selection: {
                mode: 'multiple',
                deferred: true
            }
        });

        this.clock.tick(10);

        // assert
        const items = this.dataController.items();
        assert.ok(items[1].isSelected, 'second item is selected');
        assert.ok(!this.selectionController.isSelectionWithCheckboxes(), 'checkboxes isn\'t visible');
    });

    // T461315
    QUnit.test('Checkboxes should not be visible when selected one row (key as array)', function(assert) {
    // arrange, act
        this.setupDataGrid({
            dataSource: createDataSource(this.data, { key: ['id', 'name'] }),
            selectionFilter: [['id', '=', 2], 'and', ['name', '=', 'Dan']],
            selection: {
                mode: 'multiple',
                deferred: true
            }
        });

        this.clock.tick(10);

        // assert
        const items = this.dataController.items();
        assert.ok(items[1].isSelected, 'second item is selected');
        assert.ok(!this.selectionController.isSelectionWithCheckboxes(), 'checkboxes isn\'t visible');
    });

    // T461315
    QUnit.test('Checkboxes should be visible when selected several rows', function(assert) {
    // arrange, act
        this.setupDataGrid({
            dataSource: createDataSource(this.data, { key: 'id' }),
            selectionFilter: [['name', '=', 'Dan'], 'or', ['age', '=', 18]],
            selection: {
                mode: 'multiple',
                deferred: true
            }
        });

        this.clock.tick(10);

        // assert
        const items = this.dataController.items();
        assert.ok(items[1].isSelected, 'second item is selected');
        assert.ok(items[3].isSelected, 'fourth item is selected');
        assert.ok(items[4].isSelected, 'fifth item is selected');
        assert.ok(this.selectionController.isSelectionWithCheckboxes(), 'checkboxes is visible');
    });

    // T461315
    QUnit.test('Checkboxes should be visible when selected several rows (key as array)', function(assert) {
    // arrange, act
        this.setupDataGrid({
            dataSource: createDataSource(this.data, { key: ['name', 'age'] }),
            selectionFilter: [['name', '=', 'Dan'], 'and', ['age', '>=', 16]],
            selection: {
                mode: 'multiple',
                deferred: true
            }
        });

        this.clock.tick(10);

        // assert
        const items = this.dataController.items();
        assert.ok(items[1].isSelected, 'second item is selected');
        assert.ok(items[6].isSelected, 'seventh item is selected');
        assert.ok(this.selectionController.isSelectionWithCheckboxes(), 'checkboxes is visible');
    });

    // T1116383
    QUnit.test('The selectionFilter should be saved to correctly to state storage', function(assert) {
        // arrange
        const customSave = sinon.spy();

        this.setupDataGrid({
            dataSource: [
                { id: 1, value: 1 },
                { id: 2, value: 2 },
                { id: 3, value: 3 },
                { id: 4, value: 4 },
                { id: 5, value: 5 },
                { id: 6, value: 6 },
            ],
            keyExpr: 'id',
            columns: [
                { dataField: 'id', dataType: 'number' },
                { dataField: 'value', filterValue: 1, dataType: 'number' },
            ],
            selection: { mode: 'multiple', deferred: true },
            stateStoring: {
                enabled: true,
                savingTimeout: 0,
                type: 'custom',
                customSave
            }
        });

        this.clock.tick(10);

        this.selectRows([1, 3, 4, 6], true);
        this.clock.tick(10);
        this.deselectRows([3, 6]);
        this.clock.tick(10);
        this.selectRows([1, 2, 4, 5]);
        this.clock.tick(10);

        // assert
        const expectedSelectionFilter = [
            ['id', '=', 1], 'or', ['id', '=', 2], 'or', ['id', '=', 4], 'or', ['id', '=', 5]
        ];

        const savedState = customSave.args[3][0];
        assert.deepEqual(savedState.selectionFilter, expectedSelectionFilter, 'selectionFilter is correct');
    });

    QUnit.test('selectRows', function(assert) {
        const data = this.data;
        const onSelectionCalls = [];

        this.setupDataGrid({
            dataSource: createDataSource(this.data, { key: 'id' }),
            selection: {
                mode: 'multiple',
                deferred: true
            },

            onSelectionChanged: function(e) {
                onSelectionCalls.push(e);
            }
        });

        this.clock.tick(10);

        // act
        this.selectionController.selectRows([0]);
        this.selectionController.selectRows([2, 4]);

        // assert
        this.selectionController.getSelectedRowKeys().done(function(keys) {
            assert.deepEqual(keys, [2, 4]);
        });

        this.selectionController.getSelectedRowsData().done(function(rows) {
            assert.deepEqual(rows, [data[1], data[3]], 'selected rows data');
        });

        assert.strictEqual(onSelectionCalls.length, 2);
        assert.deepEqual(onSelectionCalls[0], {});
        assert.deepEqual(this.selectionController.option('selectionFilter'), [['id', '=', 2], 'or', ['id', '=', 4]]);
    });

    QUnit.test('change row selection', function(assert) {
        let changedItemIndexes = [];
        const selectionChanged = sinon.stub();

        this.setupDataGrid({
            dataSource: createDataSource(this.data, { key: 'id' }),
            selection: {
                mode: 'multiple',
                deferred: true
            }
        });

        this.clock.tick(10);

        this.selectionController.selectionChanged.add(selectionChanged);

        this.dataController.changed.add(function(e) {
            if(e.changeType === 'updateSelection') {
                changedItemIndexes = e.itemIndexes;
            }
        });
        // act
        this.selectionController.selectRows([1]);

        // assert
        assert.deepEqual(changedItemIndexes, [0]);
        assert.strictEqual(selectionChanged.callCount, 1);
        assert.deepEqual(selectionChanged.lastCall.args[0], { selectionFilter: ['id', '=', 1] });
    });

    QUnit.test('change selectionFilter', function(assert) {
        const selectionChangedStub = sinon.stub();

        this.setupDataGrid({
            dataSource: createDataSource(this.data, { key: 'id' }),
            selection: {
                mode: 'multiple',
                deferred: true
            },
            onSelectionChanged: selectionChangedStub
        });

        this.clock.tick(10);

        // act
        selectionChangedStub.reset();

        this.option('selectionFilter', ['id', '>', 5]);

        // assert
        let selectedKeys = [];

        this.selectionController.getSelectedRowKeys().done(function(keys) {
            selectedKeys = keys;
        });

        this.clock.tick(10);

        assert.deepEqual(selectedKeys, [6, 7]);
        assert.strictEqual(selectionChangedStub.callCount, 1);
    });

    QUnit.test('getSelectedRowData should not load data when selectionFilter is empty', function(assert) {
        const dataSource = createDataSource(this.data, { key: 'id' });
        // act
        this.setupDataGrid({
            dataSource: dataSource,
            selectionFilter: [],
            selection: {
                deferred: true
            }
        });

        let loadingCount = 0;
        let rowsData;

        dataSource.store().on('loading', function() {
            loadingCount++;
        });

        this.clock.tick(10);

        assert.strictEqual(loadingCount, 1, 'one loading count');

        loadingCount = 0;

        // act
        this.getSelectedRowsData().done(function(items) {
            rowsData = items;
        });

        // assert
        assert.deepEqual(rowsData, [], 'empty rows');
        assert.strictEqual(loadingCount, 0, 'no loading count');
    });

    QUnit.test('SelectAll items with remote filtering and deferred selection', function(assert) {
    // arrange, act
        this.data = [
            { id: 1, name: 'Alex', code: '13358' },
            { id: 5, name: 'Sergey', code: '6798' }
        ];
        this.setupDataGrid({
            dataSource: createDataSource(this.data, { key: 'id' }),
            remoteOperations: { filtering: true },
            columns: [{ dataField: 'code', filterValue: 50, dataType: 'number', selectedFilterOperation: '>' }],
            selection: { mode: 'selectAll', deferred: true }
        });

        this.clock.tick(10);

        let items = this.dataController.items();
        assert.equal(items.length, 2, 'filtered items');

        this.selectionController.selectAll();

        // assert
        items = this.dataController.items();
        assert.ok(items[0].isSelected, 'first item is selected');
        assert.ok(items[1].isSelected, 'second item is selected');
    });

    // T754974
    QUnit.test('The getSelectedRowsData method should return correct selected rows data after filtering and selecting/deselecting rows', function(assert) {
    // arrange
        let selectedRowsData = [];

        this.setupDataGrid({
            loadingTimeout: null,
            dataSource: createDataSource(this.data, { key: 'id', pageSize: 2 }),
            remoteOperations: { filtering: true, sorting: true, paging: true },
            columns: [
                { dataField: 'id', dataType: 'number' },
                { dataField: 'name', dataType: 'string' },
                { dataField: 'age', dataType: 'number', filterValue: '18', selectedFilterOperation: '<>' }
            ],
            selection: { mode: 'multiple', deferred: true }
        });

        this.selectAll();
        this.getSelectedRowsData().done((selectedData) => {
            selectedRowsData = selectedData;
        });
        this.clock.tick(10);

        // assert
        assert.equal(selectedRowsData.length, 5, 'selected rows data count');

        // arrange
        this.deselectRows([1]);

        // act
        this.selectAll();
        this.getSelectedRowsData().done((selectedData) => {
            selectedRowsData = selectedData;
        });
        this.clock.tick(10);

        // assert
        assert.equal(selectedRowsData.length, 5, 'selected rows data count');
    });

    // T917204
    QUnit.test('The getSelectedRowsData method should return correct selected rows data after filtering and selectAll/deselectAll', function(assert) {
        // arrange
        let selectedRowsData = [];

        this.setupDataGrid({
            loadingTimeout: null,
            dataSource: createDataSource(this.data, { key: 'id', pageSize: 2 }),
            remoteOperations: { filtering: true, sorting: true, paging: true },
            columns: [
                { dataField: 'id', dataType: 'number' },
                { dataField: 'name', dataType: 'string' },
                { dataField: 'age', dataType: 'number', filterValue: '18', selectedFilterOperation: '<>' }
            ],
            selection: { mode: 'multiple', deferred: true }
        });

        this.selectAll();
        this.getSelectedRowsData().done((selectedData) => {
            selectedRowsData = selectedData;
        });
        this.clock.tick(10);

        // assert
        assert.equal(selectedRowsData.length, 5, 'selected rows data count');

        // arrange
        this.deselectAll();
        this.getSelectedRowsData().done((selectedData) => {
            selectedRowsData = selectedData;
        });
        this.clock.tick(10);

        // assert
        assert.equal(selectedRowsData.length, 0, 'selected rows data count');
    });

    // T959045
    QUnit.test('The selectionFilter should be correctly after select all -> deselect row when there is filter', function(assert) {
        // arrange
        this.setupDataGrid({
            dataSource: [
                { id: 1, name: 'Alex' },
                { id: 5, name: 'Sergey' }
            ],
            keyExpr: 'id',
            columns: [{ dataField: 'id', filterValue: 1, dataType: 'number' }],
            selection: { mode: 'multiple', deferred: true }
        });

        this.clock.tick(10);

        const items = this.dataController.items();
        assert.equal(items.length, 1, 'filtered items');

        // act
        this.selectionController.selectAll();

        // assert
        assert.deepEqual(this.option('selectionFilter'), ['id', '=', 1], 'selectionFilter');

        // act
        this.selectionController.deselectRows(1);

        // assert
        assert.deepEqual(this.option('selectionFilter'), [], 'selectionFilter');
    });

    // T1063462
    QUnit.test('The selectionFilter should be correctly after multiple selections', function(assert) {
        // arrange
        this.setupDataGrid({
            dataSource: [
                { id: 1, value: 1 },
            ],
            keyExpr: 'id',
            columns: [
                { dataField: 'id', dataType: 'number' },
                { dataField: 'value', filterValue: 1, dataType: 'number' },
            ],
            selection: { mode: 'multiple', deferred: true }
        });

        this.clock.tick(10);

        this.selectRows([1], true);
        this.selectionController.selectAll();
        this.selectionController.deselectAll();
        this.selectRows([1], true);
        this.deselectRows([1], true);

        // assert
        assert.deepEqual(this.option('selectionFilter'), [], 'selectionFilter is empty');
    });

    QUnit.test('Selecting multiple rows with deffered selection and preserve:false should not check for filter duplication (T1147676)', function(assert) {
        const data = generateItems(100);
        this.setupDataGrid({
            dataSource: data,
            keyExpr: 'id',
            height: 400,
            selection: {
                deferred: true,
                mode: 'multiple'
            },
        });
        this.clock.tick(10);
        const spy = sinon.spy(this.selectionController._selection._selectionStrategy, '_removeSameFilter');
        this.selectRows(data.map(data => data.id).slice(2));
        this.clock.tick(100);
        assert.equal(spy.callCount, 0, 'no extra calls');
        this.selectRows([0]);
        this.clock.tick(10);
        this.selectRows([1], true);
        this.clock.tick(10);
        assert.notEqual(spy.callCount, 0, 'called for preserved selection');
        spy.restore();
    });

    QUnit.test('Deleting unselected row with refreshMode=repaint should not select all other rows (T1153564)', function(assert) {
        const data = generateItems(100);
        this.setupDataGrid({
            dataSource: data,
            keyExpr: 'id',
            height: 400,
            selection: {
                deferred: true,
                mode: 'multiple'
            },
            editing: {
                refreshMode: 'repaint',
                allowDeleting: true,
                confirmDelete: false,
            }
        });
        this.clock.tick();

        // act
        this.deleteRow(0);
        this.clock.tick();

        // assert
        assert.deepEqual(this.option('selectionFilter'), []);
    });
});

QUnit.module('Selection with virtual scrolling', {
    beforeEach: function() {
        this.setupDataGrid = function(options) {
            setupDataGridModules(this, ['data', 'columns', 'selection', 'virtualScrolling'], { initDefaultOptions: true, options: options });
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        teardownModule.apply(this);
    }
}, () => {
    // T1130614
    QUnit.test('Select rows with shift when data of complex structure', function(assert) {
        // arrange
        const data = generateItems(100).map((item) => ({
            id: item.id,
            data: {
                field1: item.field1,
                field2: item.field2
            }
        }));

        this.setupDataGrid({
            dataSource: createDataSource(data, { key: 'id' }),
            selection: {
                mode: 'multiple'
            },
            scrolling: {
                mode: 'virtual'
            },
            paging: {
                pageSize: 2
            },
            columns: ['field1', 'fiedl2']
        });

        this.clock.tick(100);

        // act
        this.selectionController.changeItemSelection(1);

        // assert
        assert.deepEqual(this.option('selectedRowKeys'), [2], 'selectedRowKeys');

        // act
        // scroll simulation
        this.dataController._repaintChangesOnly = true;
        this.pageIndex(2);
        this.clock.tick(100);
        this.dataController._repaintChangesOnly = undefined;

        // assert
        assert.deepEqual(this.option('selectedRowKeys'), [2], 'selectedRowKeys');
        assert.strictEqual(this.pageIndex(), 2, 'pageIndex');

        // act
        this.selectionController.changeItemSelection(1, { shift: true });
        this.clock.tick(100);

        // assert
        assert.deepEqual(this.option('selectedRowKeys'), [2, 6, 5, 4, 3], 'selectedRowKeys');
    });
});

