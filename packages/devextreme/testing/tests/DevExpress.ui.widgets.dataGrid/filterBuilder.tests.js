import 'ui/data_grid';

import $ from 'jquery';
import fx from 'common/core/animation/fx';
import dataGridMocks from '../../helpers/dataGridMocks.js';

const setupDataGridModules = dataGridMocks.setupDataGridModules;

QUnit.testStart(function() {
    const markup = `<div>
        <div class="dx-datagrid">
            <div id="container"></div>
        </div>
    </div>`;

    $('#qunit-fixture').html(markup);
});

QUnit.module('Common', {
    beforeEach: function() {
        this.initFilterBuilderView = function(options) {
            this.options = $.extend({
                filterBuilderPopup: {},
                columns: [{ dataField: 'field' }],
                filterBuilder: { }
            }, options);
            setupDataGridModules(this, ['columns', 'headerFilter', 'filterSync', 'filterBuilder', 'data'], {
                initViews: true
            });
            this.filterBuilderView.render($('#container'));
            this.filterBuilderView.component.isReady = function() {
                return true;
            };
        };

        this.changeOption = function(name, fullName, value) {
            this.option(fullName, value);
            this.filterBuilderView.beginUpdate();
            this.filterBuilderView.optionChanged({ name: name });
            this.filterBuilderView.endUpdate();
        };
    }
}, function() {
    QUnit.test('showFilterBuilderPopup & hideFilterBuilderPopup', function(assert) {
        // arrange
        const handlerShow = sinon.spy();
        const handlerHide = sinon.spy();

        // act
        this.initFilterBuilderView({
            filterBuilderPopup: {
                onShowing: handlerShow,
                onHiding: handlerHide
            }
        });

        // assert
        assert.equal(handlerShow.called, 0);
        assert.equal(handlerHide.called, 0);

        // act
        this.changeOption('filterBuilderPopup', 'filterBuilderPopup.visible', true);

        // assert
        assert.equal(handlerShow.called, 1);
        assert.equal(handlerHide.called, 0);

        this.changeOption('filterBuilderPopup', 'filterBuilderPopup.visible', false);

        // assert
        assert.equal(handlerShow.called, 1);
        assert.equal(handlerHide.called, 1);
    });

    QUnit.test('initFilterBuilder', function(assert) {
        // arrange
        const handlerInit = sinon.spy();

        // act
        this.initFilterBuilderView({
            filterBuilder: {
                onInitialized: handlerInit
            }
        });

        // assert
        assert.equal(handlerInit.called, 0);

        // act
        this.changeOption('filterBuilderPopup', 'filterBuilderPopup.visible', true);

        // assert
        assert.equal(handlerInit.called, 1);
    });

    QUnit.test('filter builder popup has scrollview after the second showing', function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            filterBuilderPopup: { visible: true },
        });

        this.changeOption('filterBuilderPopup', 'filterBuilderPopup.visible', false);
        this.changeOption('filterBuilderPopup', 'filterBuilderPopup.visible', true);

        // assert
        assert.ok($('.dx-popup-content .dx-scrollview-content').length);
    });

    // T637302
    QUnit.test('operation of the number datatype can be used in the string datatype if it contains in the array of filterOperations', function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            columns: [{ dataField: 'field', filterOperations: ['>'] }],
            filterValue: ['field', '>', 'a'],
            filterBuilderPopup: { visible: true },
        });

        // assert
        assert.ok($('.dx-popup-content .dx-filterbuilder-item-operation').length, 1);
    });

    QUnit.test('the \'any of\' operation should throw an exception if filterOperations does not contain it', function(assert) {
        const that = this;
        assert.throws(function() {
            that.initFilterBuilderView({
                headerFilter: { visible: true },
                filterSyncEnabled: true,
                columns: [{ dataField: 'field', dataType: 'string', filterOperations: ['>'], allowFiltering: true }],
                filterValue: ['field', 'anyof', ['a']],
                filterBuilderPopup: { visible: true },
            });
        }, function(e) {
            return /E1048/.test(e.message);
        });
    });

    QUnit.test('the \'any of\' operation is available in filterBuilderPopup if filterOperations contains it', function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            columns: [{ dataField: 'field', filterOperations: ['>', 'anyof'] }],
            filterValue: ['field', 'anyof', ['a']],
            filterBuilderPopup: { visible: true },
        });

        // assert
        assert.ok($('.dx-popup-content .dx-filterbuilder-item-operation').length, 1);
    });

    QUnit.test('the \'any of\' operation is available in filterBuilderPopup if filterOperations are not set', function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            columns: [{ dataField: 'field' }],
            filterValue: ['field', 'anyof', ['a']],
            filterBuilderPopup: { visible: true },
        });

        // assert
        assert.ok($('.dx-popup-content .dx-filterbuilder-item-operation').length, 1);
    });

    QUnit.test('the \'any of\' operation is available in filterBuilderPopup if filterOperations is instance of defaultFilterOperations', function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            columns: [{ dataField: 'field', dataType: 'string', defaultFilterOperations: ['='] }],
            filterValue: ['field', 'anyof', ['a']],
            filterBuilderPopup: { visible: true },
        });

        // assert
        assert.equal($('.dx-popup-content .dx-filterbuilder-item-operation').length, 1);
    });

    // T651579
    QUnit.test('filter value with name in identifier shows in filterBuilder', function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            columns: [{ name: 'field', allowFiltering: true }],
            filterValue: ['field', '=', 1],
            filterBuilderPopup: { visible: true },
        });

        // assert
        assert.equal($('.dx-popup-content .dx-filterbuilder-item-operation').length, 1);
    });

    // T640912
    QUnit.test('the customOperation is available in built-in filterBuilder using dataTypes array', function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            columns: [{ dataField: 'field' }],
            filterValue: ['field', 'weekends'],
            filterBuilderPopup: { visible: true },
            filterBuilder: {
                customOperations: [{
                    name: 'weekends',
                    caption: 'Weekends',
                    dataTypes: ['string'],
                    hasValue: false
                }]
            }
        });

        // assert
        assert.ok($('.dx-popup-content .dx-filterbuilder-item-operation').text(), 'Weekends');
    });

    // T639390
    QUnit.test('init filterbuilder in datagrid with banded columns', function(assert) {
        // arrange, act
        this.initFilterBuilderView({
            columns: [{
                caption: 'Banded column',
                columns: [{
                    caption: 'Banded column item',
                    dataField: 'field',
                    filterOperations: ['=']
                }]
            }, {
                caption: 'Banded column 2',
                columns: [{
                    caption: 'Inner banded column',
                    columns: [{
                        caption: 'Banded column item 2',
                        dataField: 'field2',
                        filterOperations: ['=']
                    }]
                }]
            }],
            filterValue: [['field', '=', 'a'], 'and', ['field2', '=', 'b']],
            filterBuilderPopup: { visible: true },
        });

        // assert
        assert.ok($('.dx-popup-content .dx-filterbuilder-item-operation').length, 1);
    });

    // T646561
    QUnit.test('the field mustn\'t be in filterBuilder if allowFiltering = false', function(assert) {
        let filterBuilderFields;
        this.initFilterBuilderView({
            columns: [
                { dataField: 'field' },
                { dataField: 'hiddenField', allowFiltering: false }
            ],
            filterBuilder: {
                onInitialized: (e) => {
                    filterBuilderFields = e.component.option('fields');
                }
            },
            filterBuilderPopup: { visible: true },
        });


        assert.deepEqual(filterBuilderFields.length, 1);
        assert.deepEqual(filterBuilderFields[0].dataField, 'field');
    });

    // T642913
    QUnit.test('the field mustn\'t be in filterBuilder if this does not contain dataField', function(assert) {
        let filterBuilderFields;
        this.initFilterBuilderView({
            columns: [
                { caption: 'field text' },
                { dataField: 'field' }
            ],
            filterBuilder: {
                onInitialized: (e) => {
                    filterBuilderFields = e.component.option('fields');
                }
            },
            filterBuilderPopup: { visible: true },
        });


        assert.deepEqual(filterBuilderFields.length, 1);
        assert.deepEqual(filterBuilderFields[0].dataField, 'field');
    });

    // T653737
    QUnit.test('Filter builder doesn\'t throw errors when boolean data type columns are used', function(assert) {
        const handlerInit = sinon.spy();
        this.initFilterBuilderView({
            columns: [
                { dataField: 'field', dataType: 'boolean', filterOperations: [] }
            ],
            filterBuilder: {
                onInitialized: handlerInit
            },
            filterBuilderPopup: { visible: true },
            filterValue: ['field', '=', true]
        });

        assert.equal(handlerInit.called, 1);
    });
});

QUnit.module('Real dataGrid', {
    beforeEach: function() {
        this.initDataGrid = function(options) {
            this.dataGrid = $('#container').dxDataGrid($.extend({
                dataSource: [{}]
            }, options)).dxDataGrid('instance');
            return this.dataGrid;
        };

        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.dataGrid.dispose();
        this.clock.restore();
        fx.off = false;
    }
}, function() {
    // T646013
    QUnit.test('the \'any of\' doesn\'t throw exception when popup is hiding (without jQuery)', function(assert) {
        // arrange, act
        this.initDataGrid({
            columns: [{ dataField: 'field', dataType: 'string', defaultFilterOperations: ['anyof'] }],
            filterValue: ['field', 'anyof', ['text']],
            filterBuilderPopup: { visible: true },
        });

        $('.dx-popup-content .dx-filterbuilder-item-value-text').trigger('dxclick');
        this.clock.tick(10);
        $('.dx-header-filter-menu.dx-popup').dxPopup('instance').hide();

        // assert
        assert.equal($('.dx-popup-content .dx-filterbuilder-item-value-text').text(), 'text');
    });

    // T657917
    QUnit.test('The value for the \'Is any of\' operation is changed when filterBuilderPopup has hideOnOutsideClick=true', function(assert) {
        this.initDataGrid({
            columns: [{ dataField: 'field', dataType: 'string', defaultFilterOperations: ['anyof'] }],
            filterBuilderPopup: {
                visible: true,
                hideOnOutsideClick: true
            },
            filterValue: ['field', 'anyof', ['text']],
        });
        $('.dx-popup-content .dx-filterbuilder-item-value-text').trigger('dxclick');
        this.clock.tick(10);
        $('.dx-header-filter-menu.dx-popup').dxPopup('instance').hide();

        // assert
        assert.equal(this.dataGrid.option('filterBuilderPopup.visible'), true);
    });

    // T663205
    QUnit.test('the \'any of\' doesn\'t throw exception when column is lookup', function(assert) {
        // arrange, act
        this.initDataGrid({
            dataSource: [{ field: 1 }, { field: 2 }],
            loadingTimeout: null,
            columns: [{ dataField: 'field',
                lookup: {
                    dataSource: [{ id: 1, text: 'Text 1' }, { id: 2, text: 'Text 2' }],
                    valueExpr: 'id',
                    displayExpr: 'text'
                }
            }],
            filterValue: ['field', 'anyof', [1, 2]]
        });

        // act
        this.dataGrid.option('filterBuilderPopup.visible', true);
        $('.dx-popup-content .dx-filterbuilder-item-value-text').trigger('dxclick');

        // assert
        const $valueText = $('.dx-popup-content .dx-filterbuilder-item-value-text');
        assert.equal($valueText.text(), 'Text 1|Text 2');
        assert.equal($valueText.children().length, 3, 'three children items');
    });

    // T687835
    QUnit.test('the \'any of\' doesn\'t throw exception when customizeColumns is used and column.dataType is defined', function(assert) {
        // arrange, act
        this.initDataGrid({
            dataSource: [{ field: 1 }, { field: 2 }, { field: 3 }],
            customizeColumns: function(columns) {
            },
            columns: [{
                dataField: 'field',
                dataType: 'number'
            }],
            filterValue: ['field', 'anyof', [1, 2]],
            loadingTimeout: null
        });

        // act
        this.dataGrid.option('filterBuilderPopup.visible', true);

        // assert
        assert.equal($('.dx-popup-content .dx-filterbuilder').length, 1);
    });

    // T707084
    QUnit.test('The one negative condition is specified inside another', function(assert) {
        // arrange, act
        this.initDataGrid({
            dataSource: [{ field: 1 }, { field: 2 }, { field: 3 }],
            customizeColumns: function(columns) {
            },
            columns: [{
                dataField: 'field',
                dataType: 'number'
            }],
            filterPanel: { visible: true },
            filterValue: ['!', ['!', ['field', '=', 1]]],
            loadingTimeout: null
        });

        // act
        this.dataGrid.option('filterBuilderPopup.visible', true);

        // assert
        assert.equal($('.dx-popup-content .dx-filterbuilder').length, 1);
    });
});
