import 'ui/data_grid/ui.data_grid';

import $ from 'jquery';
import { DataSource } from 'data/data_source/data_source';
import CustomStore from 'data/custom_store';
import { setupDataGridModules } from '../../helpers/dataGridMocks.js';
import ArrayStore from 'data/array_store';
import errors from 'ui/widget/ui.errors';

const FILTER_PANEL_CLASS = 'dx-datagrid-filter-panel';
const FILTER_PANEL_TEXT_CLASS = FILTER_PANEL_CLASS + '-text';
const FILTER_PANEL_CLEAR_FILTER_CLASS = FILTER_PANEL_CLASS + '-clear-filter';
const FILTER_PANEL_CHECKBOX_CLASS = FILTER_PANEL_CLASS + '-checkbox';

QUnit.testStart(function() {
    const markup =
    '<div>\
        <div class="dx-datagrid">\
            <div id="container"></div>\
        </div>\
    </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Filter Panel', {
    beforeEach: function() {
        this.initFilterPanelView = function(options) {
            this.options = $.extend({
                filterPanel: {
                    visible: true
                },
                filterValue: ['field', '=', '1'],
                filterBuilder: {
                    groupOperationDescriptions: { and: 'And', notAnd: 'Not And', or: 'Or' },
                    filterOperationDescriptions: {
                        equal: 'Equals',
                        isBlank: 'Is Blank',
                        isNotBlank: 'Is Not Blank',
                        between: 'Is between'
                    }
                },
                dataSource: [],
                columns: [{ dataField: 'field', caption: 'Field' }]
            }, options);
            setupDataGridModules(this, ['stateStoring', 'columns', 'filterRow', 'data', 'headerFilter', 'filterSync', 'filterBuilder', 'filterPanel'], {
                initViews: true
            });
            this.filterPanelView.render($('#container'));
            this.filterPanelView.component.isReady = function() {
                return true;
            };
        };

        this.changeOption = function(name, fullName, value) {
            this.option(fullName, value);
            this.filterPanelView.beginUpdate();
            this.filterPanelView.optionChanged({ name: name });
            this.filterPanelView.endUpdate();
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, function() {
    QUnit.test('visible', function(assert) {
        // arrange, act
        this.initFilterPanelView({
            filterPanel: {
                visible: false
            }
        });

        // assert
        assert.notOk(this.filterPanelView.element().hasClass(FILTER_PANEL_CLASS));

        // act
        this.changeOption('filterPanel', 'filterPanel.visible', true);

        // assert
        assert.ok(this.filterPanelView.element().hasClass(FILTER_PANEL_CLASS));
    });

    QUnit.test('filterEnabled', function(assert) {
        // arrange, act
        this.initFilterPanelView({
            filterPanel: {
                visible: true,
                filterEnabled: true
            }
        });

        // assert
        assert.deepEqual(this.getCombinedFilter(true), ['field', '=', '1'], 'check filterValue');

        // act
        this.changeOption('filterPanel', 'filterPanel.filterEnabled', false);

        // assert
        assert.deepEqual(this.getCombinedFilter(true), undefined, 'check filterValue');
    });

    QUnit.test('createFilter', function(assert) {
        // arrange, act
        this.initFilterPanelView({
            filterPanel: {
                visible: true,
                texts: {
                    createFilter: 'test'
                }
            },
            filterValue: null
        });

        // assert
        assert.equal(this.filterPanelView.element().find('.' + FILTER_PANEL_TEXT_CLASS).text(), 'test', 'check createFilter');
    });

    QUnit.test('Can customize text', function(assert) {
        // arrange
        let assertFilterValue;
        let assertFilterText;
        const filterValue = ['field', '=', '1'];

        this.initFilterPanelView({
            filterPanel: {
                visible: true,
                customizeText: function(e) {
                    assertFilterValue = e.filterValue;
                    assertFilterText = e.text + '_test';
                    return assertFilterText;
                }
            },
            filterValue: filterValue
        });

        // assert
        assert.equal(this.filterPanelView.element().find('.' + FILTER_PANEL_TEXT_CLASS).text(), assertFilterText, 'check customizeText');
        assert.equal(assertFilterValue, filterValue, 'check filter value in customizeText function');
    });

    QUnit.test('Filter text', function(assert) {
        // arrange
        this.initFilterPanelView();

        // assert
        assert.equal(this.filterPanelView.element().find('.' + FILTER_PANEL_TEXT_CLASS).text(), '[Field] Equals \'1\'', 'check filter text');
    });

    // T651579
    QUnit.test('filter value with name in identifier shows in panel', function(assert) {
        // arrange
        this.initFilterPanelView({
            columns: [{ name: 'field', caption: 'Field', allowFiltering: true }]
        });

        // assert
        assert.equal(this.filterPanelView.element().find('.' + FILTER_PANEL_TEXT_CLASS).text(), '[Field] Equals \'1\'', 'check filter text');
    });

    QUnit.test('filter value with column witout caption contains empty string', function(assert) {
        // arrange
        this.initFilterPanelView({
            columns: [{ name: 'field', allowFiltering: true }]
        });

        // assert
        assert.equal(this.filterPanelView.element().find('.' + FILTER_PANEL_TEXT_CLASS).text(), '[] Equals \'1\'', 'check filter text');
    });

    QUnit.test('can customize hints', function(assert) {
        // arrange, act
        this.initFilterPanelView({
            filterPanel: {
                visible: true,
                texts: {
                    filterEnabledHint: 'test0'
                }
            }
        });

        // assert
        assert.equal(this.filterPanelView.element().find('.' + FILTER_PANEL_CHECKBOX_CLASS).attr('title'), 'test0', 'check hint for applyFilter');
    });

    QUnit.test('clearFilter', function(assert) {
        // arrange, act
        this.initFilterPanelView({
            filterPanel: {
                visible: true,
                texts: {
                    clearFilter: 'test0'
                }
            }
        });

        // assert
        assert.equal(this.filterPanelView.element().find('.' + FILTER_PANEL_CLEAR_FILTER_CLASS).text(), 'test0', 'check clearFilter');
    });

    QUnit.test('from condition', function(assert) {
        // arrange
        const filter = ['field', '=', '1'];
        this.initFilterPanelView({
            filterValue: filter
        });

        // act
        assert.expect(1);
        this.filterPanelView.getFilterText(filter, []).done(function(result) {
            assert.deepEqual(result, '[Field] Equals \'1\'');
        });
    });

    QUnit.test('from custom operation', function(assert) {
        // arrange
        const filter = ['field', 'anyof', [1, 2]];
        this.initFilterPanelView({
            filterValue: filter
        });

        // act
        assert.expect(1);
        this.filterPanelView.getFilterText(filter, [{ name: 'anyof', caption: 'Any of' }]).done(function(result) {
            assert.equal(result, '[Field] Any of(\'1\', \'2\')');
        });
    });

    // T876959
    QUnit.test('not load all items from headerFilte.dataSource for anyof operation', function(assert) {
        // arrange
        const filter = ['field', 'anyof', [1, 2]];
        const lookupDataStore = new ArrayStore({
            key: 'key',
            data: [
                { key: 1, text: 'Text 1', value: 1 },
                { key: 2, text: 'Text 2', value: 2 },
                { key: 3, text: 'Text 3', value: 3 }
            ]
        });
        this.initFilterPanelView({
            filterValue: filter,
            headerFilter: {
                texts: {}
            },
            columns: [{
                dataField: 'field',
                headerFilter: { dataSource: lookupDataStore },
                lookup: {
                    dataSource: lookupDataStore,
                    valueExpr: 'key',
                    displayExpr: 'text'
                }
            }]
        });
        const loadingSpy = sinon.spy();
        lookupDataStore.on('loading', loadingSpy);

        // act
        assert.expect(3);
        this.filterPanelView.getFilterText(filter, this.filterSyncController.getCustomFilterOperations()).done(function(result) {
            assert.equal(result, '[Field] Is any of(\'Text 1\', \'Text 2\')');
            assert.equal(loadingSpy.callCount, 2, 'loadingSpy.callCount');
            const loadingFilters = loadingSpy.getCalls().map(i => i.args[0].filter);
            assert.deepEqual(loadingFilters, [['key', '=', 1], ['key', '=', 2]]);
        });
    });

    ['key', undefined].forEach(key => {
        QUnit.test(`W1017 warning: key = '${key}' and no calculateDisplayValue`, function(assert) {
            // arrange
            sinon.spy(errors, 'log');
            const filter = ['field', 'anyof', [1, 2]];
            const lookupDataStore = new ArrayStore({
                key,
                data: [
                    { key: 1, text: 'Text 1', value: 1 },
                    { key: 2, text: 'Text 2', value: 2 },
                    { key: 3, text: 'Text 3', value: 3 }
                ]
            });
            this.initFilterPanelView({
                filterValue: filter,
                headerFilter: {
                    texts: {}
                },
                columns: [{
                    dataField: 'field',
                    dataType: 'string',
                    headerFilter: { dataSource: lookupDataStore },
                    lookup: {
                        dataSource: lookupDataStore,
                        valueExpr: 'key',
                        displayExpr: 'text'
                    }
                }]
            });
            const loadingSpy = sinon.spy();
            lookupDataStore.on('loading', loadingSpy);

            // act
            assert.expect(2);
            this.filterPanelView.getFilterText(filter, this.filterSyncController.getCustomFilterOperations()).done(function(result) {
                assert.equal(result, '[Field] Is any of(\'Text 1\', \'Text 2\')');
                assert.equal(errors.log.callCount, 0, 'no warnings');
            }).always(() => {
                errors.log.restore();
            });
        });

        QUnit.test(`W1017 warning: key = '${key}' and calculateDisplayValue = 'text'`, function(assert) {
            // arrange
            sinon.spy(errors, 'log');
            const filter = ['field', 'anyof', [1, 2]];
            const lookupDataStore = new ArrayStore({
                key,
                data: [
                    { key: 1, text: 'Text 1', value: 1 },
                    { key: 2, text: 'Text 2', value: 2 },
                    { key: 3, text: 'Text 3', value: 3 }
                ]
            });
            this.initFilterPanelView({
                filterValue: filter,
                headerFilter: {
                    texts: {}
                },
                columns: [{
                    dataField: 'field',
                    dataType: 'string',
                    headerFilter: { dataSource: lookupDataStore },
                    lookup: {
                        dataSource: lookupDataStore,
                        valueExpr: 'key',
                        displayExpr: 'text'
                    },
                    calculateDisplayValue: 'text'
                }]
            });
            const loadingSpy = sinon.spy();
            lookupDataStore.on('loading', loadingSpy);

            // act
            assert.expect(key ? 2 : 6);
            this.filterPanelView.getFilterText(filter, this.filterSyncController.getCustomFilterOperations()).done(function(result) {
                assert.equal(result, '[Field] Is any of(\'Text 1\', \'Text 2\')');
                if(!key) {
                    assert.equal(errors.log.callCount, 4, 'four warnings');
                    errors.log.getCalls().forEach(call => {
                        assert.equal(call.args[0], 'W1017', 'warning code');
                    });
                } else {
                    assert.equal(errors.log.callCount, 0, 'no warnings');
                }
            }).always(() => {
                errors.log.restore();
            });
        });
    });

    // T663205, T813868
    QUnit.test('from anyof build-in operation and lookup', function(assert) {
        // arrange
        const filter = ['field', 'anyof', [1, 2]];
        const lookupDataSource = [
            { key: 1, text: 'Text 1' },
            { key: 2, text: 'Text 2' }
        ];
        this.initFilterPanelView({
            filterValue: filter,
            headerFilter: {
                texts: {}
            },
            columns: [{
                dataField: 'field',
                lookup: {
                    dataSource: lookupDataSource,
                    valueExpr: 'key',
                    displayExpr: 'text'
                }
            }]
        });

        // act
        assert.expect(2);
        this.filterPanelView.getFilterText(filter, this.filterSyncController.getCustomFilterOperations()).done(function(result) {
            assert.equal(result, '[Field] Is any of(\'Text 1\', \'Text 2\')');
            assert.deepEqual(lookupDataSource[0], { key: 1, text: 'Text 1' }, 'lookup dataSource item is not changed');
        });
    });

    // T703158
    QUnit.test('skip additional load in anyof', function(assert) {
        const spy = sinon.spy();
        // arrange
        const filter = ['field', 'anyof', [1, 2]];
        this.initFilterPanelView({
            filterValue: filter,
            headerFilter: {
                texts: {}
            },
            columns: [{
                dataField: 'field',
                lookup: {
                    dataSource: {
                        store: new CustomStore({
                            load: function() {
                                spy();
                                return [
                                    { id: 1, text: 'Text 1' },
                                    { id: 2, text: 'Text 2' }
                                ];
                            }
                        })
                    },
                    valueExpr: 'id',
                    displayExpr: 'text'
                }
            }]
        });

        // act
        assert.expect(2);
        this.filterPanelView.getFilterText(filter, this.filterSyncController.getCustomFilterOperations()).done(function(result) {
            assert.equal(result, '[Field] Is any of(\'Text 1\', \'Text 2\')');
            assert.equal(spy.callCount, 1);
        });
    });

    QUnit.test('from custom operation with value = array', function(assert) {
        // arrange
        const filter = [
            ['field', 'anyof', [200]]
        ];
        this.initFilterPanelView({
            filterValue: filter,
            columns: [{ dataField: 'field', dataType: 'number' }]
        });

        // act
        assert.expect(1);
        this.filterPanelView.getFilterText(filter, [{
            name: 'anyof',
            caption: 'Any of',
            customizeText: function(fieldInfo) { return 'CustomText'; }
        }]).done(function(result) {
            // assert
            assert.equal(result, '[Field] Any of(\'CustomText\')');
        });
    });

    QUnit.test('from custom operation with async customizeText', function(assert) {
        // arrange
        const deferred = $.Deferred();
        const filter = [
            ['field', 'customOperation', [200]]
        ];
        this.initFilterPanelView({
            filterValue: filter,
            filterBuilder: {
                groupOperationDescriptions: { and: 'And' },
                customOperations: [{
                    name: 'customOperation',
                    caption: 'Custom',
                    calculateFilterExpression: function() { return null; },
                    customizeText: function(fieldInfo) {
                        return deferred.promise();
                    }
                }]
            }
        });

        // assert
        assert.equal(this.filterPanelView.element().find('.' + FILTER_PANEL_TEXT_CLASS).text(), '');
        deferred.resolve('Two hundred');
        assert.equal(this.filterPanelView.element().find('.' + FILTER_PANEL_TEXT_CLASS).text(), '[Field] Custom(\'Two hundred\')');
    });

    QUnit.test('custom operation target = \'filterPanel\'', function(assert) {
        // arrange
        const filter = ['field', 'customOperation', 2];
        this.initFilterPanelView();

        // act
        assert.expect(2);
        this.filterPanelView.getFilterText(filter, [{
            name: 'customOperation',
            caption: 'Custom',
            calculateFilterExpression: function() { return null; },
            customizeText: function(fieldInfo) {
                assert.equal(fieldInfo.target, 'filterPanel');
                return 'two';
            }
        }]).done(function(result) {
            assert.equal(result, '[Field] Custom \'two\'');
        });
    });

    QUnit.test('from between', function(assert) {
        const filter = ['field', 'between', [1, 2]];
        this.initFilterPanelView({
            filterValue: filter
        });

        assert.expect(1);
        this.filterPanelView.getFilterText(filter, []).done(function(result) {
            assert.equal(result, '[Field] Is between(\'1\', \'2\')');
        });
    });

    QUnit.test('from between with dates', function(assert) {
        const filter = ['field', 'between', [new Date(2012, 10, 12), new Date(2013, 2, 23)]];
        this.initFilterPanelView({
            columns: [{ dataField: 'field', dataType: 'date', format: 'MM/dd/yyyy' }],
            filterValue: filter
        });

        assert.expect(1);
        this.filterPanelView.getFilterText(filter, []).done(function(result) {
            assert.equal(result, '[Field] Is between(\'11/12/2012\', \'03/23/2013\')');
        });
    });

    QUnit.test('from isBlank / isNotBlank', function(assert) {
        const filter = [['field', '=', null], 'and', ['field', '<>', null]];

        this.initFilterPanelView({
            filterValue: filter
        });

        assert.expect(1);
        this.filterPanelView.getFilterText(filter, []).done(function(result) {
            assert.equal(result, '[Field] Is Blank And [Field] Is Not Blank');
        });
    });

    QUnit.test('from group', function(assert) {
        const filter = [['field', '=', '1'], 'and', ['field', '=', '2']];
        this.initFilterPanelView({
            filterValue: filter
        });

        assert.expect(1);
        this.filterPanelView.getFilterText(filter, []).done(function(result) {
            assert.equal(result, '[Field] Equals \'1\' And [Field] Equals \'2\'');
        });
    });

    QUnit.test('from group with inner group', function(assert) {
        const filter = [['field', '=', '1'], 'and', ['field', '=', '2'], 'and', [['field', '=', '3'], 'or', ['field', '=', '4']]];
        this.initFilterPanelView({
            filterValue: filter
        });

        assert.expect(1);
        this.filterPanelView.getFilterText(filter, []).done(function(result) {
            assert.equal(result, '[Field] Equals \'1\' And [Field] Equals \'2\' And ([Field] Equals \'3\' Or [Field] Equals \'4\')');
        });
    });

    QUnit.test('from group with inner group with Not', function(assert) {
        const filter = ['!', [['field', '=', '1'], 'and', ['field', '=', '2']]];

        this.initFilterPanelView({
            filterValue: filter
        });

        assert.expect(1);
        this.filterPanelView.getFilterText(filter, []).done(function(result) {
            assert.deepEqual(result, 'Not ([Field] Equals \'1\' And [Field] Equals \'2\')');
        });
    });

    QUnit.test('filterBuilder customOperation', function(assert) {
        // arrange
        const filter = ['dateField', 'testOperation'];
        const customFilter = ['dateField', '=', '10/10/2010'];
        let customExpressionCounter = 0;

        // act, assert
        this.initFilterPanelView({
            filterValue: filter,
            filterBuilder: {
                customOperations: [{
                    name: 'testOperation',
                    caption: 'TestOperation',
                    dataTypes: ['date'],
                    icon: 'check',
                    hasValue: false,
                    calculateFilterExpression: function(operation, obj) {
                        ++customExpressionCounter;

                        // assert
                        assert.equal(obj.caption, 'Date');
                        return customFilter;
                    }
                }]
            },
            columns: [
                { dataField: 'field', caption: 'Field' },
                { dataField: 'dateField', caption: 'Date', dataType: 'date' },
            ]
        });

        // assert
        assert.equal(this.filterPanelView.element().find('.' + FILTER_PANEL_TEXT_CLASS).text(), '[Date] TestOperation', 'filterPanel text');
        assert.ok(customExpressionCounter > 0, 'calculateFilterExpression was called');
    });

    QUnit.test('load filterEnabled from state storing', function(assert) {
        // act, assert
        this.initFilterPanelView({
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {
                        filterPanel: {
                            filterEnabled: false
                        }
                    };
                },
                customSave: function() {
                }
            }
        });

        this.clock.tick();

        // assert
        assert.notOk(this.option('filterPanel.filterEnabled'));
    });

    QUnit.test('Update state when applying filterPanel.filterEnabled', function(assert) {
        const customSaveSpy = sinon.spy();

        this.initFilterPanelView({
            stateStoring: {
                enabled: true,
                type: 'custom',
                customLoad: function() {
                    return {};
                },
                customSave: customSaveSpy,
                savingTimeout: 0
            }
        });

        this.clock.tick();
        this.option('filterPanel.filterEnabled', false);
        this.dataController.changed.fire();
        this.clock.tick();

        assert.notOk(customSaveSpy.lastCall.args[0].filterPanel.filterEnabled);
    });

    // T636976
    QUnit.test('Will not throw \'Cannot set property paginate of undefined\' if dataSource is not set', function(assert) {
        this.initFilterPanelView({
            filterPanel: {
                visible: true
            },
            dataSource: null,
            filterValue: ['SaleAmount', 'anyof', [['SaleAmount', '<', 3000]]],
            columns: [{
                dataField: 'SaleAmount',
                dataType: 'number',
                format: 'currency',
                headerFilter: {
                    dataSource: [{
                        text: 'Less than $3000',
                        value: ['SaleAmount', '<', 3000]
                    }]
                }
            }]
        });

        // assert
        assert.notOk(this.filterPanelView.element().hasClass(FILTER_PANEL_CLASS));

        // act
        this.dataController.setDataSource(new DataSource([]));
        this.dataController.dataSourceChanged.fire();

        // assert
        assert.ok(this.filterPanelView.element().hasClass(FILTER_PANEL_CLASS));
    });

    // T698723
    QUnit.test('Has correct value when calculateDisplayValue is defined && column has lookup', function(assert) {
        this.initFilterPanelView({
            filterPanel: {
                visible: true
            },
            filterValue: ['StateID', '=', 1],
            columns: [{
                dataField: 'StateID',
                calculateDisplayValue: 'StateName',
                lookup: {
                    dataSource: [{
                        'ID': 1,
                        'Name': 'Tuscaloosa',
                        'StateID': 1
                    }],
                    valueExpr: 'ID',
                    displayExpr: 'Name'
                }
            }]
        });

        // assert
        assert.equal(this.filterPanelView.element().find('.' + FILTER_PANEL_TEXT_CLASS).text(), '[State ID] Equals \'Tuscaloosa\'', 'filterPanel text');
    });
});
