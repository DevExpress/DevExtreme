import 'generic_light.css!';

import 'ui/data_grid';
import gridCoreUtils from '__internal/grids/grid_core/m_utils';

import $ from 'jquery';
import ArrayStore from 'common/data/array_store';
import { noop } from 'core/utils/common';
import ODataStore from 'common/data/odata/store';
import devices from '__internal/core/m_devices';
import { DataSource } from 'common/data/data_source/data_source';
import { invertFilterExpression } from '__internal/grids/grid_core/header_filter/m_header_filter';
import dragEvents from 'common/core/events/drag';
import { setupDataGridModules, MockDataController, MockColumnsController } from '../../helpers/dataGridMocks.js';
import viewPortUtils from 'core/utils/view_port';
import fx from 'common/core/animation/fx';
import messageLocalization from 'common/core/localization/message';
import dateSerialization from 'core/utils/date_serialization';
import { ListSearchBoxWrapper } from '../../helpers/wrappers/searchBoxWrappers.js';

const TREEVIEW_ITEM_CLASS = 'dx-treeview-item';

function getListOrTreeView() {
    const $popupContent = this.headerFilterView.getPopupContainer().$content();
    const list = $popupContent.find('.dx-list');
    const treeView = $popupContent.find('.dx-treeview');

    return list.length ? list.dxList('instance') : treeView.dxTreeView('instance');
}

QUnit.testStart(function() {
    const markup =
        `<div>
            <div id="container"  class="dx-datagrid"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

QUnit.module('Header Filter dataController', {
    beforeEach: function() {
        this.setupDataGrid = function(options) {
            this.options = options;
            setupDataGridModules(this, ['columns', 'data', 'headerFilter'], {
                initViews: false
            });
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        this.dispose && this.dispose();
    }
}, () => {

    QUnit.test('filterValues with one value', function(assert) {
        const that = this;

        // act
        that.setupDataGrid({
            columns: [{ dataField: 'Test', filterValues: [1] }],
            remoteOperations: true,
            dataSource: []
        });

        // assert
        assert.deepEqual(that.getCombinedFilter(), ['Test', '=', 1], 'combined filter');
    });

    QUnit.test('filterValues with several values', function(assert) {
        const that = this;

        // act
        that.setupDataGrid({
            columns: [{ dataField: 'Test', filterValues: [1, 2] }],
            remoteOperations: true,
            dataSource: []
        });

        // assert
        assert.deepEqual(that.getCombinedFilter(), [['Test', '=', 1], 'or', ['Test', '=', 2]], 'combined filter');
    });

    QUnit.test('filterValues with several values with filterType \'exclude\'', function(assert) {
        const that = this;

        // act
        that.setupDataGrid({
            columns: [{ dataField: 'Test', filterValues: [1, 2], filterType: 'exclude' }],
            remoteOperations: true,
            dataSource: []
        });

        // assert
        assert.deepEqual(that.getCombinedFilter(), ['!', [['Test', '=', 1], 'or', ['Test', '=', 2]]], 'combined filter');
    });

    QUnit.test('filterValues with one filter expression', function(assert) {
        const that = this;

        // act
        that.setupDataGrid({
            columns: [{ dataField: 'Test', filterValues: [['Test', '>', 5]] }],
            remoteOperations: true,
            dataSource: []
        });

        // assert
        assert.deepEqual(that.getCombinedFilter(), ['Test', '>', 5], 'combined filter');
    });

    QUnit.test('filterValues with several filter expressions', function(assert) {
        const that = this;

        // act
        that.setupDataGrid({
            columns: [{ dataField: 'Test', filterValues: [['Test', '>', 5], ['Test', '<', 2]] }],
            remoteOperations: true,
            dataSource: []
        });

        // assert
        assert.deepEqual(that.getCombinedFilter(), [['Test', '>', 5], 'or', ['Test', '<', 2]], 'combined filter');
    });

    // T345461
    QUnit.test('filterValues with one filter expressions and with filterType \'exclude\'', function(assert) {
        const that = this;

        // act
        that.setupDataGrid({
            columns: [{ dataField: 'Test', filterValues: [[['Test', '>', 2], 'and', ['Test', '<', 5]]], filterType: 'exclude' }],
            remoteOperations: true,
            dataSource: []
        });

        // assert
        assert.deepEqual(that.getCombinedFilter(), ['!', [['Test', '>', 2], 'and', ['Test', '<', 5]]], 'combined filter');
    });

    // T345461
    QUnit.test('invertFilterExpression', function(assert) {
        assert.deepEqual(invertFilterExpression(['Test', '=', 1]), ['!', ['Test', '=', 1]], 'invert = operation');
    });

    // T585671
    QUnit.test('Header filter with custom dataSource - postProcess should not be ignored', function(assert) {
        // arrange
        let items;

        this.setupDataGrid({
            dataSource: [],
            columns: [{ dataField: 'Test', headerFilter: {
                dataSource: {
                    store: [
                        { field: 1 }
                    ],
                    postProcess: function(items) {
                        return items.map(function(item) {
                            return {
                                text: 'test' + item.field,
                                value: item.field
                            };
                        });
                    }
                }
            } }]
        });

        // act
        const dataSource = new DataSource(this.headerFilterController.getDataSource(this.getVisibleColumns()[0]));
        dataSource.load().done(function(data) {
            items = data;
        });
        this.clock.tick(10);

        // assert
        assert.deepEqual(items, [{ text: 'test1', value: 1 }]);
    });

    // T585671
    QUnit.test('Header filter with dataSource as function - postProcess should not be ignored (for a lookup column)', function(assert) {
        // arrange
        let items;

        this.setupDataGrid({
            dataSource: [],
            headerFilter: {
                texts: {
                    emptyValue: 'blank'
                }
            },
            columns: [{ dataField: 'Test', lookup: {
                dataSource: [{ field: 1 }],
                valueExpr: 'field',
                displayExpr: 'field'
            }, headerFilter: {
                dataSource: function(options) {
                    options.dataSource.postProcess = function(items) {
                        return items.forEach(function(item) {
                            if(item.value) {
                                item.text = 'test' + item.text;
                            }
                        });
                    };
                }
            } }]
        });

        // act
        const dataSource = new DataSource(this.headerFilterController.getDataSource(this.getVisibleColumns()[0]));
        dataSource.load().done(function(data) {
            items = data;
        });
        this.clock.tick(10);

        // assert
        assert.deepEqual(items, [{ text: 'blank', value: null }, { field: 1, text: 'test1', value: 1 }]);
    });

    // T612786
    QUnit.test('Header filter with custom dataSource if column with lookup', function(assert) {
        // arrange
        let items;

        this.setupDataGrid({
            dataSource: [],
            headerFilter: {
                texts: {
                    emptyValue: 'blank'
                }
            },
            columns: [{ dataField: 'Test',
                lookup: {
                    dataSource: [{ field: 1 }],
                    valueExpr: 'field',
                    displayExpr: 'field'
                },
                headerFilter: {
                    dataSource: [{
                        text: 'test1',
                        value: 1
                    }, {
                        text: 'test2',
                        value: 2
                    }]
                }
            }]
        });

        // act
        const dataSource = new DataSource(this.headerFilterController.getDataSource(this.getVisibleColumns()[0]));
        dataSource.load().done(function(data) {
            items = data;
        });
        this.clock.tick(10);

        // assert
        assert.deepEqual(items, [{ text: 'test1', value: 1 }, { text: 'test2', value: 2 }]);
    });

    // T891627
    QUnit.test('Filter should be correct when first column with caption = "!" and second column with filterType = "exclude"', function(assert) {
        // arrange, act
        this.setupDataGrid({
            columns: [{ dataField: 'field1', caption: '!' }, { dataField: 'field2', filterType: 'exclude', filterValues: ['test'] }],
            dataSource: []
        });

        // assert
        assert.deepEqual(this.getCombinedFilter(), ['!', [this.columnOption('field2').selector, '=', 'test']], 'combined filter');
    });
});

QUnit.module('Header Filter', {
    beforeEach: function() {
        this.items = [];
        this.columns = [{
            dataField: 'Test1',
            allowHeaderFiltering: true,
            calculateCellValue: function(data) {
                return data.Test1;
            }
        }, {
            dataField: 'Test2',
            allowHeaderFiltering: true,
            calculateCellValue: function(data) {
                return data.Test2;
            }
        }];
        this.options = {
            headerFilter: {
                allowSelectAll: true,
                visible: true,
                width: 250,
                height: 300,
                search: {
                    enabled: false,
                    timeout: 500,
                    mode: 'contains',
                    editorOptions: {},
                },
                texts: {
                    ok: 'Ok',
                    cancel: 'Cancel',
                    emptyValue: '(Blanks)'
                }
            },
            showColumnHeaders: true
        };

        this.setupDataGrid = function() {
            setupDataGridModules(this, ['columns', 'data', 'columnHeaders', 'headerFilter', 'headerPanel', 'grouping'], {
                initViews: true,
                controllers: {
                    columns: new MockColumnsController(this.columns),
                    data: new MockDataController({ items: this.items })
                }
            });
        };

        this.generateItems = function(count, duplicateCount) {

            duplicateCount = duplicateCount || 1;

            this.items = [];
            for(let i = 1; i <= count; i++) {
                for(let j = 0; j < duplicateCount; j++) {
                    this.items.push({ Test1: 'test' + (i < 10 ? '0' : '') + i });
                }
            }
        };

        this.getListOrTreeView = getListOrTreeView.bind(this);

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        this.headerFilterController && this.headerFilterController.hideHeaderFilterMenu();
        this.dispose && this.dispose();
    }
}, () => {

    QUnit.test('Draw header filter indicator', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.setupDataGrid();

        // act
        that.columnHeadersView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter').length, 2, 'has header filter indicators');
    });

    // T1109631
    QUnit.test('header filter indicator should have role, label, haspopup attributes', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        const columnsCaptions = ['col 1', 'col 2'];
        this.columns = [
            { dataField: 'Test1', allowFiltering: true, caption: columnsCaptions[0] },
            { dataField: 'Test2', allowFiltering: true, caption: columnsCaptions[1] }
        ];
        that.setupDataGrid();

        // act
        that.columnHeadersView.render(testElement);

        // assert
        const filterIndicator = testElement.find('.dx-header-filter');

        assert.expect(6);

        filterIndicator.each((ind, element) => {
            const ariaLabelValue = messageLocalization.format('dxDataGrid-headerFilterIndicatorLabel', columnsCaptions[ind]);

            assert.strictEqual(element.getAttribute('role'), 'button', `filter indicator ${ind} has role attr`);
            assert.strictEqual(element.getAttribute('aria-haspopup'), 'dialog', `filter indicator ${ind} has aria-haspopup attr`);
            assert.strictEqual(element.getAttribute('aria-label'), ariaLabelValue, `filter indicator ${ind} has aria-label attr`);
        });

    });

    QUnit.test('Draw header filter indicator with allowFiltering true', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        this.columns = [{
            dataField: 'Test1', allowFiltering: true, calculateCellValue: function(data) {
                return data.Test1;
            }
        }, {
            dataField: 'Test2', allowFiltering: true, calculateCellValue: function(data) {
                return data.Test2;
            }
        }];
        that.setupDataGrid();

        // act
        that.columnHeadersView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter').length, 2, 'has header filter indicators');
    });

    QUnit.test('Draw header filter indicator with allowFiltering false and allowHeaderFiltering true', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        this.columns = [{
            dataField: 'Test1', allowFiltering: false, allowHeaderFiltering: true, calculateCellValue: function(data) {
                return data.Test1;
            }
        }, {
            dataField: 'Test2', allowFiltering: false, allowHeaderFiltering: true, calculateCellValue: function(data) {
                return data.Test2;
            }
        }];
        that.setupDataGrid();

        // act
        that.columnHeadersView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter').length, 2, 'has header filter indicators');
    });

    QUnit.test('Not draw header filter indicator with allowFiltering true and allowHeaderFiltering false', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        this.columns = [{
            dataField: 'Test1', allowFiltering: true, allowHeaderFiltering: false, calculateCellValue: function(data) {
                return data.Test1;
            }
        }, {
            dataField: 'Test2', allowFiltering: true, allowHeaderFiltering: false, calculateCellValue: function(data) {
                return data.Test2;
            }
        }];
        that.setupDataGrid();

        // act
        that.columnHeadersView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter').length, 0, 'not has header filter indicators');
    });

    QUnit.test('Show header filter', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.equal($('body').children('.dx-header-filter-menu').length, 1, 'has wrapper header filter menu');
        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.ok($popupContent.find('.dx-empty-message').length, 'no data');
        // T756320
        assert.strictEqual(that.headerFilterView.getPopupContainer().option('hideOnParentScroll'), false, 'hideOnParentScroll should be false');
    });

    // T1109671
    QUnit.test('Header filter popup should have aria-label and role attributes', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const popupContainer = that.headerFilterView.getPopupContainer();
        const $popupContent = popupContainer.$content().parent();

        assert.strictEqual($popupContent.attr('aria-label'), messageLocalization.format('dxDataGrid-headerFilterLabel'), 'has aria-label attribute');
        assert.strictEqual($popupContent.attr('role'), 'dialog', 'has role="dialog" attribute');
    });

    // T435785
    QUnit.test('Show header filter when no dataSource', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.setupDataGrid();

        that.dataController.dataSource = noop;


        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.equal($('body').children('.dx-header-filter-menu').length, 1, 'has wrapper header filter menu');
        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.ok($popupContent.find('.dx-empty-message').length, 'no data');
    });

    // T321243
    QUnit.test('Show header filter animation in ios', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        devices._currentDevice = { platform: 'ios' };


        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const popup = that.headerFilterView.getPopupContainer().option('animation');

        assert.equal(popup.show.type, 'pop', 'animation show type');

        devices._currentDevice = null;
    });

    [
        { showColumnLines: false, alignment: 'left', position: 'left' },
        { showColumnLines: false, alignment: 'center', position: 'left' },
        { showColumnLines: false, alignment: 'right', position: 'right' },
        { showColumnLines: true, alignment: 'left', position: 'right' },
        { showColumnLines: true, alignment: 'center', position: 'right' },
        { showColumnLines: true, alignment: 'right', position: 'left' },
    ].forEach(({ showColumnLines, alignment, position }) => {
        QUnit.test(`Header filter position (column.alignment=${alignment}, showColumnLines=${showColumnLines}) (T1033810)`, function(assert) {
            // arrange
            const that = this;
            const testElement = $('#container');

            that.options.showColumnLines = showColumnLines;
            that.columns[0].alignment = alignment;
            that.setupDataGrid();
            that.columnHeadersView.render(testElement);
            that.headerFilterView.render(testElement);

            // act
            that.headerFilterController.showHeaderFilterMenu(0);


            // assert
            assert.strictEqual(that.headerFilterView.getPopupContainer().option('position.my'), `${position} top`, 'my position');
            assert.strictEqual(that.headerFilterView.getPopupContainer().option('position.at'), `${position} bottom`, 'at position');
        });
    });

    QUnit.test('Show header filter when column with dataType date', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].dataType = 'date';
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.equal($('body').children('.dx-header-filter-menu').length, 1, 'has wrapper header filter menu');
        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-treeview').length, 'has list in header filter menu');
        assert.ok($popupContent.find('.dx-empty-message').length, 'no data');
    });

    // T413416
    QUnit.test('Show header filter when column with encodeHtml is false', function(assert) {
        // arrange
        const that = this;
        const $testElement = $('#container');

        that.items = [{ Test1: '<b>test1</b>', Test2: 'test2' }, { Test1: 'test3', Test2: 'test4' }];
        that.columns[0].encodeHtml = false;
        that.setupDataGrid();
        that.columnHeadersView.render($testElement);
        that.headerFilterView.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        assert.equal($('body').children('.dx-header-filter-menu').length, 1, 'has wrapper header filter menu');
        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        const $listItemElements = $popupContent.find('.dx-list-item-content');
        assert.equal($listItemElements.length, 2, 'count list item');
        assert.strictEqual($listItemElements.first().html(), '<b>test1</b>', 'html of the first list item');
        assert.strictEqual($listItemElements.first().text(), 'test1', 'text of the first list item');
        assert.strictEqual($listItemElements.last().html(), 'test3', 'html of the second list item');
    });

    // T413416
    QUnit.test('Show header filter when column with encodeHtml is true', function(assert) {
        // arrange
        const that = this;
        const $testElement = $('#container');

        that.items = [{ Test1: '<b>test1</b>', Test2: 'test2' }, { Test1: 'test3', Test2: 'test4' }];
        that.columns[0].encodeHtml = true;
        that.setupDataGrid();
        that.columnHeadersView.render($testElement);
        that.headerFilterView.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        assert.equal($('body').children('.dx-header-filter-menu').length, 1, 'has wrapper header filter menu');
        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        const $listItemElements = $popupContent.find('.dx-list-item-content');
        assert.equal($listItemElements.length, 2, 'count list item');
        assert.notStrictEqual($listItemElements.first().html(), '<b>test1</b>', 'html of the first list item');
        assert.strictEqual($listItemElements.first().text(), '<b>test1</b>', 'text of the first list item');
        assert.strictEqual($listItemElements.last().html(), 'test3', 'html of the second list item');
    });

    QUnit.test('Hide header filter', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.equal($('body').children('.dx-header-filter-menu').length, 1, 'has wrapper header filter menu');
        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.ok($popupContent.find('.dx-empty-message').length, 'no data');

        // act
        that.headerFilterController.hideHeaderFilterMenu();
        that.clock.tick(500);


        // assert
        assert.ok(!$('body').children('.dx-header-filter-menu').length, 'not has wrapper header filter menu');
        assert.ok(!$popupContent.is(':visible'), 'not visible popup');
    });

    QUnit.test('Header filter with items', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.items = [{ Test1: 'test1', Test2: 'test2' }, { Test1: 'test3', Test2: 'test4' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-select-all').length, 1, 'has list select all');
        assert.equal($popupContent.find('.dx-checkbox').length, 3, 'count checkboxes');
        assert.equal($popupContent.find('.dx-list-item').length, 2, 'count list items');
        assert.strictEqual($popupContent.find('.dx-list-item').first().text(), 'test1', 'text first item');
        assert.strictEqual($popupContent.find('.dx-list-item').last().text(), 'test3', 'text second item');
    });

    // T269664, T271835
    QUnit.test('Header filter with items where many duplicate values', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.generateItems(30, 5);
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-select-all').length, 1, 'has list select all');
        assert.equal($popupContent.find('.dx-checkbox').length, 21, 'count checkboxes');
        assert.equal($popupContent.find('.dx-list-item').length, 20, 'count list items');
        assert.strictEqual($popupContent.find('.dx-list-item').first().text(), 'test01', 'text first item');
        assert.strictEqual($popupContent.find('.dx-list-item').last().text(), 'test20', 'text second item');
    });

    QUnit.test('Header filter with items when column with dataType date', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].dataType = 'date';
        that.items = [{ Test1: new Date(1986, 0, 1), Test2: 'test2' }, { Test1: new Date(1986, 0, 4), Test2: 'test4' }, { Test1: null, Test2: 'test6' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.find('.dx-treeview').length, 'has treeview in header filter menu');
        assert.equal($popupContent.find('.dx-treeview-select-all-item').length, 1, 'has treeview select all');
        assert.equal($popupContent.find('.dx-checkbox').length, 3, 'count checkboxes');
        assert.equal($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).length, 2, 'count treeview item');
        assert.strictEqual($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).eq(0).text(), '(Blanks)', 'empty text treeview item');
        assert.strictEqual($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).eq(1).text(), '1986', 'text treeview item');

        // act
        $($popupContent.find('.dx-treeview-toggle-item-visibility')).trigger('dxclick'); // expanded first item

        // assert
        assert.equal($popupContent.find('.dx-treeview-node-container-opened').length, 1, 'treeview node container opened');
        assert.equal($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).length, 3, 'has treeview items');
        assert.strictEqual($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).last().text(), 'January', 'text the nested treeview item');

        // act
        $($popupContent.find('.dx-treeview-toggle-item-visibility').last()).trigger('dxclick'); // expanded nested item

        // assert
        assert.equal($popupContent.find('.dx-treeview-node-container-opened').length, 2, 'treeview node container opened');
        assert.equal($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).length, 5, 'has treeview items');
        assert.strictEqual($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).eq(3).text(), '1', 'text the nested treeview item');
        assert.strictEqual($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).eq(4).text(), '4', 'text the nested treeview item');
    });

    // T274290
    QUnit.test('Header filter with items when column lookup with simple types', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].lookup = { dataSource: ['test1', 'test2', 'test3'] };
        that.columns[0].filterValues = ['test3'];
        that.items = [{ Test1: 1, Test2: 'test2' }, { Test1: 2, Test2: 'test4' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-select-all').length, 1, 'has list select all');
        assert.equal($popupContent.find('.dx-checkbox').length, 5, 'count checkboxes');
        assert.equal($popupContent.find('.dx-list-item').length, 4, 'count list items');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(0).text(), '(Blanks)', 'text item 0');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(1).text(), 'test1', 'text item 1');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(2).text(), 'test2', 'text item 2');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(3).text(), 'test3', 'text item 3');
        assert.ok(!$popupContent.find('.dx-list-item').eq(2).hasClass('dx-list-item-selected'), 'text item 2 is not selected');
        assert.ok($popupContent.find('.dx-list-item').eq(3).hasClass('dx-list-item-selected'), 'text item 3 is selected');
    });

    // T274290
    QUnit.test('Header filter with items when column lookup with object types', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].lookup = { valueExpr: 'id', displayExpr: 'value', dataSource: [{ id: 1, value: 'test1' }, { id: 2, value: 'test2' }, { id: 3, value: 'test3' }] };
        that.columns[0].filterValues = [3];
        that.items = [{ Test1: 1, Test2: 'test2' }, { Test1: 2, Test2: 'test4' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-select-all').length, 1, 'has list select all');
        assert.equal($popupContent.find('.dx-checkbox').length, 5, 'count checkboxes');
        assert.equal($popupContent.find('.dx-list-item').length, 4, 'count list items');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(0).text(), '(Blanks)', 'text item 0');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(1).text(), 'test1', 'text item 1');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(2).text(), 'test2', 'text item 2');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(3).text(), 'test3', 'text item 3');
        assert.ok(!$popupContent.find('.dx-list-item').eq(2).hasClass('dx-list-item-selected'), 'text item 2 is not selected');
        assert.ok($popupContent.find('.dx-list-item').eq(3).hasClass('dx-list-item-selected'), 'text item 3 is selected');
    });

    // T427652
    QUnit.test('Header filter with items when lookup dataSource as function', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].lookup = {
            dataSource: function() {
                return ['test1', 'test2', 'test3'];
            }
        };
        that.items = [{ Test1: 1, Test2: 'test2' }, { Test1: 2, Test2: 'test4' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-select-all').length, 1, 'has list select all');
        assert.equal($popupContent.find('.dx-checkbox').length, 5, 'count checkboxes');
        assert.equal($popupContent.find('.dx-list-item').length, 4, 'count list items');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(0).text(), '(Blanks)', 'text item 0');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(1).text(), 'test1', 'text item 1');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(2).text(), 'test2', 'text item 2');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(3).text(), 'test3', 'text item 3');
    });

    QUnit.test('Header filter with items when column with dataType date and filterValues', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].dataType = 'date';
        that.columns[0].filterValues = ['1986/1/4'];
        that.items = [{ Test1: new Date(1986, 0, 1), Test2: 'test2' }, { Test1: new Date(1986, 0, 4), Test2: 'test4' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.find('.dx-treeview').length, 'has treeview in header filter menu');
        assert.equal($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).length, 1, 'count treeview item');
        assert.strictEqual($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).text(), '1986', 'text treeview item');

        // act
        $($popupContent.find('.dx-treeview-toggle-item-visibility')).trigger('dxclick'); // expanded first item

        // assert
        assert.equal($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).length, 2, 'count treeview items');

        // act
        $($popupContent.find('.dx-treeview-toggle-item-visibility').last()).trigger('dxclick'); // expanded nested item

        // assert
        assert.equal($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).length, 4, 'count treeview items');
        assert.ok($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).last().children('.dx-checkbox').hasClass('dx-checkbox-checked'), 'checked checkbox in last item');
        assert.equal($popupContent.find('.dx-checkbox-checked').length, 1, 'count checked checkboxes');
    });

    QUnit.test('Save state when selecting', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.items = [{ Test1: 'test1', Test2: 'test2' }, { Test1: 'test3', Test2: 'test4' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-item').length, 2, 'count list items');

        // act
        $popupContent.children().dxList('instance').selectItem(1); // select second item

        // assert
        assert.ok($popupContent.find('.dx-list-item').last().hasClass('dx-list-item-selected'), 'selected second item');

        // act
        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // OK button
        that.clock.tick(500);


        // assert
        assert.ok(!$popupContent.is(':visible'), 'not visible popup');

        assert.equal(that.columnsController.updateOptions[0].columnIndex, 0, 'column index');
        assert.deepEqual(that.columnsController.updateOptions[0].optionName, {
            filterValues: ['test3'],
            filterType: undefined
        }, 'column options');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.equal($popupContent.find('.dx-list-item').length, 2, 'count list items');
        assert.ok($popupContent.find('.dx-list-item').last().hasClass('dx-list-item-selected'), 'selected second item');
    });

    QUnit.test('Update selecting for first page when filterValues for second page is defined', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.generateItems(30);
        that.columns[0].filterValues = ['test25'];
        that.columns[0].filterType = 'exclude';

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-item').length, 20, 'count list items');

        // act
        $($popupContent.find('.dx-list-item .dx-checkbox').eq(0)).trigger('dxclick');

        // assert
        assert.ok(!$popupContent.find('.dx-list-item').eq(0).hasClass('dx-list-item-selected'), 'first item is unselected');
        assert.ok($popupContent.find('.dx-list-item').eq(1).hasClass('dx-list-item-selected'), 'second item is selected');

        // act
        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // OK button
        that.clock.tick(500);


        // assert
        assert.ok(!$popupContent.is(':visible'), 'not visible popup');

        assert.equal(that.columnsController.updateOptions[0].columnIndex, 0, 'column index');
        assert.deepEqual(that.columnsController.updateOptions[0].optionName, {
            filterValues: ['test25', 'test01'],
            filterType: 'exclude'
        }, 'column options');
    });

    QUnit.test('Restore selecting state for second page when all items on first page selected', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.generateItems(30);
        that.columns[0].filterValues = ['test25'];
        that.columns[0].filterType = 'exclude';

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-item').length, 20, 'items count');
        assert.equal($popupContent.find('.dx-list-item-selected').length, 20, 'selected items count');
        assert.strictEqual($popupContent.find('.dx-list-select-all-checkbox').dxCheckBox('option', 'value'), undefined, 'select all checkbox value in intermediate state');

        // act
        $popupContent.find('.dx-scrollview').dxScrollView('option', 'onReachBottom')();

        // assert
        assert.equal($popupContent.find('.dx-list-item').length, 30, 'count list items after load second page');
        assert.equal($popupContent.find('.dx-list-item-selected').length, 29, 'selected items count');
        assert.strictEqual($popupContent.find('.dx-list-select-all-checkbox').dxCheckBox('option', 'value'), undefined, 'select all checkbox value in intermediate state');
    });

    QUnit.test('Restore selecting state for second page when not all items on first page selected', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.generateItems(30);

        that.columns[0].filterValues = ['test05', 'test25'];
        that.columns[0].filterType = 'exclude';

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-item').length, 20, 'items count');
        assert.equal($popupContent.find('.dx-list-item-selected').length, 19, 'selected items count');
        assert.strictEqual($popupContent.find('.dx-list-select-all-checkbox').dxCheckBox('option', 'value'), undefined, 'select all checkbox value in intermediate state');

        // act
        $popupContent.find('.dx-scrollview').dxScrollView('option', 'onReachBottom')();

        // assert
        assert.equal($popupContent.find('.dx-list-item').length, 30, 'count list items after load second page');
        assert.equal($popupContent.find('.dx-list-item-selected').length, 28, 'selected items count');
        assert.strictEqual($popupContent.find('.dx-list-select-all-checkbox').dxCheckBox('option', 'value'), undefined, 'select all checkbox value in intermediate state');
    });

    QUnit.test('Restore selecting state for second page when no selected items on first page', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.generateItems(30);

        that.columns[0].filterValues = ['test25'];
        that.columns[0].filterType = 'include';

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-item').length, 20, 'items count');
        assert.equal($popupContent.find('.dx-list-item-selected').length, 0, 'selected items count');
        assert.strictEqual($popupContent.find('.dx-list-select-all-checkbox').dxCheckBox('option', 'value'), undefined, 'select all checkbox value in intermediate state');

        // act
        $popupContent.find('.dx-scrollview').dxScrollView('option', 'onReachBottom')();

        // assert
        assert.equal($popupContent.find('.dx-list-item').length, 30, 'count list items after load second page');
        assert.equal($popupContent.find('.dx-list-item-selected').length, 1, 'selected items count');
        assert.strictEqual($popupContent.find('.dx-list-select-all-checkbox').dxCheckBox('option', 'value'), undefined, 'select all checkbox value in intermediate state');
    });

    QUnit.test('Second page selection after select all', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.generateItems(30);

        that.columns[0].filterValues = ['test25'];

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-item').length, 20, 'items count');
        assert.equal($popupContent.find('.dx-list-item-selected').length, 0, 'selected items count');
        assert.strictEqual($popupContent.find('.dx-list-select-all-checkbox').dxCheckBox('option', 'value'), undefined, 'select all checkbox value is unchecked');

        // act
        $($popupContent.find('.dx-list-select-all-checkbox')).trigger('dxclick');
        $popupContent.find('.dx-scrollview').dxScrollView('option', 'onReachBottom')();

        // assert
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-item').length, 30, 'items count');
        assert.equal($popupContent.find('.dx-list-item-selected').length, 30, 'selected items count');
        assert.strictEqual($popupContent.find('.dx-list-select-all-checkbox').dxCheckBox('option', 'value'), true, 'select all checkbox value is checked');
        assert.deepEqual(that.columns[0].filterValues, ['test25'], 'original filterValues is not changed');
    });

    QUnit.test('Second page selection after unselect all', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.generateItems(30);

        that.columns[0].filterValues = ['test25'];

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-item').length, 20, 'items count');
        assert.equal($popupContent.find('.dx-list-item-selected').length, 0, 'selected items count');
        assert.strictEqual($popupContent.find('.dx-list-select-all-checkbox').dxCheckBox('option', 'value'), undefined, 'select all checkbox value is unchecked');

        // act
        $($popupContent.find('.dx-list-select-all-checkbox')).trigger('dxclick');
        $($popupContent.find('.dx-list-select-all-checkbox')).trigger('dxclick');
        $popupContent.find('.dx-scrollview').dxScrollView('option', 'onReachBottom')();

        // assert
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-item').length, 30, 'items count');
        assert.equal($popupContent.find('.dx-list-item-selected').length, 0, 'selected items count');
        assert.strictEqual($popupContent.find('.dx-list-select-all-checkbox').dxCheckBox('option', 'value'), false, 'select all checkbox value is checked');
        assert.deepEqual(that.columns[0].filterValues, ['test25'], 'original filterValues is not changed');
    });

    QUnit.test('Save state when selecting for column with dataType date', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].dataType = 'date';
        that.items = [{ Test1: new Date(1986, 0, 1), Test2: 'test2' }, { Test1: new Date(1986, 3, 4), Test2: 'test4' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.find('.dx-treeview').length, 'has treeview in header filter menu');
        assert.equal($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).length, 1, 'count treeview item');
        assert.strictEqual($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).text(), '1986', 'text treeview item');

        // act
        $($popupContent.find('.dx-treeview-toggle-item-visibility')).trigger('dxclick'); // expanded first item

        // assert
        assert.equal($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).length, 3, 'count treeview items');

        // act
        $($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).last().children('.dx-checkbox')).trigger('dxclick'); // select second item

        // assert
        assert.ok($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).last().children('.dx-checkbox').hasClass('dx-checkbox-checked'), 'selected last item');

        // act
        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // OK button
        that.clock.tick(500);


        // assert
        assert.ok(!$popupContent.is(':visible'), 'not visible popup');

        assert.equal(that.columnsController.updateOptions[0].columnIndex, 0, 'column index');
        assert.deepEqual(that.columnsController.updateOptions[0].optionName, {
            filterValues: ['1986/4'],
            filterType: undefined
        }, 'option name');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.equal($popupContent.find('.dx-checkbox-indeterminate').length, 2, 'count an indeterminate checkboxes');

        // act
        $($popupContent.find('.dx-treeview-toggle-item-visibility')).trigger('dxclick'); // expanded first item

        // assert
        assert.equal($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).length, 3, 'count treeview items');
        assert.ok($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).last().children('.dx-checkbox').hasClass('dx-checkbox-checked'), 'checked checkbox in last item');
        assert.equal($popupContent.find('.dx-checkbox-checked').length, 1, 'count checked checkboxes');
    });

    QUnit.test('Save state when selecting for column with dataType date. filterType is \'exclude\'', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].dataType = 'date';
        that.columns[0].filterType = 'exclude';
        that.items = [{ Test1: new Date(1986, 0, 1), Test2: 'test2' }, { Test1: new Date(1986, 3, 4), Test2: 'test4' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);
        that.clock.tick(500);

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.find('.dx-treeview').length, 'has treeview in header filter menu');
        assert.equal($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).length, 1, 'count treeview item');
        assert.strictEqual($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).text(), '1986', 'text treeview item');

        // act
        $($popupContent.find('.dx-treeview-toggle-item-visibility')).trigger('dxclick'); // expanded first item
        that.clock.tick(500);
        // assert
        assert.equal($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).length, 3, 'count treeview items');

        // act
        $($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).last().children('.dx-checkbox')).trigger('dxclick'); // uncheck second item
        that.clock.tick(500);
        // assert
        assert.ok(!$popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).last().children('.dx-checkbox').hasClass('dx-checkbox-checked'), 'unchecked last item');

        // act
        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // OK button
        that.clock.tick(500);

        // assert
        assert.deepEqual(that.columnsController.updateOptions[0].optionName, {
            filterValues: ['1986/1'],
            filterType: 'include'
        }, 'option name');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // OK button
        that.clock.tick(500);
        assert.deepEqual(that.columnsController.updateOptions[1].optionName, {
            filterValues: ['1986/1'],
            filterType: 'include'
        }, 'option name');
    });

    QUnit.test('Update when select all items', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.items = [{ Test1: 'test1', Test2: 'test2' }, { Test1: 'test3', Test2: 'test4' }];
        that.columns[0].filterValues = ['test1'];
        that.columns[0].filterType = 'exclude';
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-item').length, 2, 'count list items');

        // act
        $($popupContent.find('.dx-list-select-all-checkbox')).trigger('dxclick');
        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // OK button
        that.clock.tick(500);

        // assert
        assert.ok(!$popupContent.is(':visible'), 'not visible popup');

        assert.equal(that.columnsController.updateOptions[0].columnIndex, 0, 'column index');
        assert.deepEqual(that.columnsController.updateOptions[0].optionName, {
            filterValues: null, // T500956
            filterType: 'exclude'
        }, 'column options');
    });

    // T881628
    QUnit.test('Update when select all items with dataType date', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].dataType = 'date';
        that.items = [{ Test1: new Date(1986, 0, 1), Test2: 'test2' }, { Test1: new Date(1986, 3, 4), Test2: 'test4' }, { Test1: new Date(1987, 3, 4), Test2: 'test4' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        $($popupContent.find('.dx-treeview-select-all-item')).trigger('dxclick');
        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // OK button
        that.clock.tick(500);

        // assert
        assert.ok(!$popupContent.is(':visible'), 'not visible popup');

        assert.equal(that.columnsController.updateOptions[0].columnIndex, 0, 'column index');
        assert.deepEqual(that.columnsController.updateOptions[0].optionName, {
            filterValues: undefined,
            filterType: 'exclude'
        }, 'column options');
    });

    QUnit.test('Update when selected all items and column with filterValues', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].filterValues = ['test3'];
        that.items = [{ Test1: 'test1', Test2: 'test2' }, { Test1: 'test3', Test2: 'test4' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-item').length, 2, 'count list items');

        // act
        $($popupContent.find('.dx-checkbox').eq(0)).trigger('dxclick');

        // assert
        assert.ok($popupContent.find('.dx-checkbox').eq(0).hasClass('dx-checkbox-checked'), 'select all items');

        // act
        $($popupContent.find('.dx-checkbox').eq(2)).trigger('dxclick'); // uncheck test3
        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // OK button
        that.clock.tick(500);

        // assert
        assert.ok(!$popupContent.is(':visible'), 'not visible popup');
        assert.equal(that.columnsController.updateOptions[0].columnIndex, 0, 'column index');
        assert.deepEqual(that.columnsController.updateOptions[0].optionName, {
            filterValues: ['test3'],
            filterType: 'exclude'
        }, 'option name');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        $(that.headerFilterView.getPopupContainer().$content().parent().find('.dx-button').eq(0)).trigger('dxclick'); // OK button

        // assert
        assert.equal(that.columnsController.updateOptions[0].columnIndex, 0, 'column index');
        assert.deepEqual(that.columnsController.updateOptions[0].optionName, {
            filterValues: ['test3'],
            filterType: 'exclude'
        }, 'option name');

    });

    // T248184
    QUnit.test('Indicator state when there is filterValues in column', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].filterValues = ['test3'];
        that.setupDataGrid();

        // act
        that.columnHeadersView.render(testElement);

        // assert
        const $headerFilter = that.columnHeadersView.element().find('td').first().find('.dx-header-filter');
        assert.equal($headerFilter.length, 1, 'have header filter');
        assert.ok(!$headerFilter.hasClass('dx-header-filter-empty'), 'has no class dx-header-filter-empty');
    });

    // T248184
    QUnit.test('Indicator state when there is no filterValues in column', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.setupDataGrid();

        // act
        that.columnHeadersView.render(testElement);

        // assert
        const $headerFilter = that.columnHeadersView.element().find('td').first().find('.dx-header-filter');
        assert.equal($headerFilter.length, 1, 'have header filter');
        assert.ok($headerFilter.hasClass('dx-header-filter-empty'), 'has no class dx-header-filter-empty');
    });

    // T248184
    QUnit.test('Indicator state when there is filterValues in the grouped column', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].groupIndex = 0;
        that.columns[0].filterValues = ['test3'];
        that.options.groupPanel = {
            visible: true
        };
        that.setupDataGrid();

        // act
        that.headerPanel.render(testElement);

        // assert
        const $headerFilter = that.headerPanel.element().find('.dx-group-panel-item').first().find('.dx-header-filter');
        assert.equal($headerFilter.length, 1, 'have header filter');
        assert.ok(!$headerFilter.hasClass('dx-header-filter-empty'), 'has no class dx-header-filter-empty');
        assert.strictEqual($headerFilter.css('color'), $headerFilter.parent().css('color'), 'color of the header should be as parent color');
    });

    QUnit.test('Header filter popup should be shown on header filter icon click in groupPanel', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.items = [{ Test1: 'test1', Test2: 'test2' }, { Test1: 'test3', Test2: 'test4' }];
        that.columns[0].groupIndex = 0;
        that.columns[0].filterValues = ['test3'];
        that.options.groupPanel = {
            visible: true
        };
        that.setupDataGrid();

        that.headerPanel.render(testElement);
        that.headerFilterView.render(testElement);

        const $headerFilter = that.headerPanel.element().find('.dx-group-panel-item').first().find('.dx-header-filter');

        // act
        $($headerFilter).trigger('dxclick');

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.equal($popupContent.find('.dx-list-item').length, 2, 'list items count');
        assert.equal($popupContent.find('.dx-list-item-selected').length, 1, 'one selected list item');
    });

    // T472271
    QUnit.test('Header filter indicator should be shown for grouped column with showWhenGrouped', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].groupIndex = 0;
        that.columns[0].showWhenGrouped = true;
        that.columns[0].filterValues = ['test3'];
        that.setupDataGrid();

        // act
        that.columnHeadersView.render(testElement);

        // assert
        const $headerFilter = that.columnHeadersView.element().find('td').first().find('.dx-header-filter');
        assert.equal($headerFilter.length, 1, 'header filter is shown');
        assert.ok(!$headerFilter.hasClass('dx-header-filter-empty'), 'has no class dx-header-filter-empty');
    });

    // T472271
    QUnit.test('Header filter popup should be shown on header filter icon click for column with showWhenGrouped', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.items = [{ Test1: 'test1', Test2: 'test2' }, { Test1: 'test3', Test2: 'test4' }];
        that.columns[0].groupIndex = 0;
        that.columns[0].showWhenGrouped = true;
        that.columns[0].filterValues = ['test3'];
        that.setupDataGrid();

        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        const $headerFilter = that.columnHeadersView.element().find('td').first().find('.dx-header-filter');
        // act
        $($headerFilter).trigger('dxclick');

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.equal($popupContent.find('.dx-list-item').length, 2, 'list items count');
        assert.equal($popupContent.find('.dx-list-item-selected').length, 1, 'one selected list item');
    });

    // T248184
    QUnit.test('Indicator state when there is no filterValues in the grouped column', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].groupIndex = 0;
        that.options.groupPanel = {
            visible: true
        };
        that.setupDataGrid();

        // act
        that.headerPanel.render(testElement);

        // assert
        const $headerFilter = that.headerPanel.element().find('.dx-group-panel-item').first().find('.dx-header-filter');
        assert.equal($headerFilter.length, 1, 'have header filter');
        assert.ok($headerFilter.hasClass('dx-header-filter-empty'), 'has no class dx-header-filter-empty');
        assert.notStrictEqual($headerFilter.css('color'), $headerFilter.parent().css('color'), 'color of the header filter should hava alpha');
    });

    // T260241
    QUnit.test('Show header filter with set a custom width and height by column', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].headerFilter = {
            width: 400,
            height: 500
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContainer = that.headerFilterView.getPopupContainer().$overlayContent();

        assert.equal($('body').children('.dx-header-filter-menu').length, 1, 'has wrapper header filter menu');
        assert.ok($popupContainer.is(':visible'), 'visible popup');
        assert.equal($popupContainer[0].offsetWidth, 400, 'width popup');
        assert.equal($popupContainer[0].offsetHeight, 500, 'height popup');
    });

    // T260241
    QUnit.test('Save size of the header filter after resize', function(assert) {
        // arrange
        const that = this;
        let $popupContainer;
        const testElement = $('#container');

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);
        that.clock.tick(500);

        // assert
        $popupContainer = that.headerFilterView.getPopupContainer().$overlayContent();

        assert.equal($('body').children('.dx-header-filter-menu').length, 1, 'has wrapper header filter menu');
        assert.ok($popupContainer.is(':visible'), 'visible popup');
        assert.equal($popupContainer[0].offsetWidth, 250, 'width popup');
        assert.equal($popupContainer[0].offsetHeight, 300, 'height popup');

        // act
        that.headerFilterView.getPopupContainer().option({ width: 400, height: 500 });
        $($popupContainer.find('.dx-resizable-handle-corner-bottom-right')).trigger(dragEvents.end);
        that.headerFilterController.hideHeaderFilterMenu();
        that.clock.tick(500);

        // assert
        assert.ok(!$('body').children('.dx-header-filter-menu').length, 'not has wrapper header filter menu');
        assert.ok(!$popupContainer.is(':visible'), 'not visible popup');
        assert.deepEqual(that.columnsController.updateOptions[1].optionValue, { width: 400, height: 500 }, 'header filter by column');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        $popupContainer = that.headerFilterView.getPopupContainer().$overlayContent();

        assert.equal($('body').children('.dx-header-filter-menu').length, 1, 'has wrapper header filter menu');
        assert.ok($popupContainer.is(':visible'), 'visible popup');
        assert.equal($popupContainer[0].offsetWidth, 400, 'width popup');
        assert.equal($popupContainer[0].offsetHeight, 500, 'height popup');
    });

    QUnit.test('Invalidate instead of render for headerFilter options', function(assert) {
        // arrange
        let renderCounter = 0;
        const testElement = $('#container');

        this.setupDataGrid();
        this.columnHeadersView.render(testElement);
        this.columnHeadersView.renderCompleted.add(function() {
            renderCounter++;
        });

        // act
        this.columnHeadersView.component.isReady = function() {
            return true;
        };
        this.columnHeadersView.beginUpdate();
        this.columnHeadersView.optionChanged({ name: 'headerFilter' });
        this.columnHeadersView.optionChanged({ name: 'headerFilter' });
        this.columnHeadersView.optionChanged({ name: 'headerFilter' });
        this.columnHeadersView.endUpdate();

        // assert
        assert.equal(renderCounter, 1, 'count of rendering');
    });

    // T490356
    QUnit.test('Checking filterValues of the column after deselect item of a loaded page when there is selected item of an unloaded page', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.generateItems(30);
        this.columns[0].filterValues = ['test01', 'test30'];
        this.setupDataGrid();
        this.columnHeadersView.render($testElement);
        this.headerFilterView.render($testElement);

        this.headerFilterController.showHeaderFilterMenu(0);

        const $popupContent = this.headerFilterView.getPopupContainer().$content();
        $($popupContent.find('.dx-list-item').first()).trigger('dxclick'); // deselect first item

        // assert
        assert.ok($popupContent.find('.dx-list-select-all-checkbox').hasClass('dx-checkbox-indeterminate'), 'checkbox in an indeterminate state');

        // act
        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // apply filter
        this.clock.tick(500);

        // assert
        assert.deepEqual(this.columns[0].filterValues, ['test30'], 'filterValues');
    });

    QUnit.test('Show header filter with search bar', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.headerFilter.search.enabled = true;
        that.options.headerFilter.search.timeout = 300;

        // act
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);
        that.headerFilterController.showHeaderFilterMenu(0);
        const list = that.getListOrTreeView();

        // assert
        assert.ok(list.option('searchEnabled'), 'list with search bar');
        assert.ok($.isFunction(list.option('searchExpr')), 'expr is correct');
        assert.equal(list.option('searchTimeout'), 300, 'search timeout is assigned');
        assert.equal(list.option('searchMode'), 'contains', 'search mode is default');
    });

    QUnit.test('Test aria-label in search-box input (T829760)', function(assert) {
        // arrange
        const searchBoxWrapper = new ListSearchBoxWrapper('.dx-header-filter-menu');
        const testElement = $('#container');

        this.options.headerFilter.search.enabled = true;

        // act
        this.setupDataGrid();
        this.columnHeadersView.render(testElement);
        this.headerFilterView.render(testElement);
        this.headerFilterController.showHeaderFilterMenu(0);

        assert.strictEqual(searchBoxWrapper.getEditorInput().attr('aria-label'), messageLocalization.format('Search'), 'Search box input aria-label attribute');
    });

    QUnit.test('Show header filter with search bar with search.mode equals', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.headerFilter.search.enabled = true;
        that.options.headerFilter.search.timeout = 300;
        that.columns[0].headerFilter = { search: { mode: 'equals' } };

        // act
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);
        that.headerFilterController.showHeaderFilterMenu(0);
        const list = that.getListOrTreeView();

        // assert
        assert.ok(list.option('searchEnabled'), 'list with search bar');
        assert.ok($.isFunction(list.option('searchExpr')), 'expr is correct');
        assert.equal(list.option('searchTimeout'), 300, 'search timeout is assigned');
        assert.equal(list.option('searchMode'), 'equals', 'search mode is assigned');
    });

    QUnit.test('Show header filter when column with dataType date with search bar', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.headerFilter.search.enabled = true;
        that.options.headerFilter.search.timeout = 300;
        that.columns[0].dataType = 'date';

        // act
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);
        that.headerFilterController.showHeaderFilterMenu(0);
        const treeView = that.getListOrTreeView();

        // assert
        assert.ok(treeView.option('searchEnabled'), 'treeView with search bar');
        assert.equal(treeView.option('searchTimeout'), 300, 'search timeout is assigned');
        assert.equal(treeView.option('searchMode'), 'contains', 'search mode is default');
    });

    QUnit.test('HeaderFilter should be without search bar when column search.enabled is disabled', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.headerFilter.search.enabled = true;
        that.columns[0].headerFilter = {
            search: {
                enabled: false
            }
        };

        // act
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);
        that.headerFilterController.showHeaderFilterMenu(0);
        const list = that.getListOrTreeView();

        // assert
        assert.notOk(list.option('searchEnabled'), 'list without search bar');
    });

    [true, false, undefined].forEach(function(hideSelectAllOnSearch) {
        QUnit.test(`Check select all state after search if hideSelectAllOnSearch is ${hideSelectAllOnSearch}`, function(assert) {
            // arrange
            const that = this;
            const testElement = $('#container');

            that.options.headerFilter.search.enabled = true;
            that.options.headerFilter.hideSelectAllOnSearch = hideSelectAllOnSearch;

            that.items = [{ Test1: 'test1', Test2: 'test2' }, { Test1: 'test3', Test2: 'test4' }];
            that.setupDataGrid();
            that.columnHeadersView.render(testElement);
            that.headerFilterView.render(testElement);
            that.headerFilterController.showHeaderFilterMenu(0);

            const list = that.getListOrTreeView();
            const $popupContent = that.headerFilterView.getPopupContainer().$content();

            // assert
            assert.ok(list.$element().find('.dx-list-select-all-checkbox').is(':visible'), 'selectAll is visible');

            // act
            list.option('searchValue', '3');

            if(hideSelectAllOnSearch !== false) {
                // assert
                assert.notOk(list.$element().find('.dx-list-select-all-checkbox').is(':visible'), 'selectAll is hidden visible');
            } else {
                // assert
                assert.ok(list.$element().find('.dx-list-select-all-checkbox').is(':visible'), 'selectAll is visible');

                // act
                const $selectAll = list.$element().find('.dx-list-select-all-checkbox');
                $($selectAll).trigger('dxclick');
                $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // apply filter

                const selectAll = $selectAll.dxCheckBox('instance');
                const column = that.columnsController.getVisibleColumns()[0];

                // assert
                assert.equal(selectAll.option('value'), true, 'select all has correct state');
                assert.deepEqual(column.filterValues, ['test3'], 'filterValue is correct');
                assert.notEqual(column.filterType, 'exclude', 'filterType is correct');
            }
        });

        QUnit.test(`Check select all state after search if column dataType is date if hideSelectAllOnSearch is ${hideSelectAllOnSearch}`, function(assert) {
            // arrange
            const that = this;
            const testElement = $('#container');

            that.options.headerFilter.search.enabled = true;
            that.options.headerFilter.hideSelectAllOnSearch = hideSelectAllOnSearch;
            that.columns[0].dataType = 'date';
            that.items = [{ Test1: new Date(1986, 0, 1), Test2: 'test2' }, { Test1: new Date(1986, 0, 4), Test2: 'test4' }, { Test1: null, Test2: 'test6' }];

            that.setupDataGrid();
            that.columnHeadersView.render(testElement);
            that.headerFilterView.render(testElement);
            that.headerFilterController.showHeaderFilterMenu(0);

            const treeView = that.getListOrTreeView();
            const $popupContent = that.headerFilterView.getPopupContainer().$content();

            // assert
            assert.ok(treeView.$element().find('.dx-treeview-select-all-item').is(':visible'), 'select all is visible');

            // act
            treeView.option('searchValue', '4');

            if(hideSelectAllOnSearch !== false) {
                // assert
                assert.notOk(treeView.$element().find('.dx-treeview-select-all-item').is(':visible'), 'select all is not visible');
            } else {
                // assert
                assert.ok(treeView.$element().find('.dx-treeview-select-all-item').is(':visible'), 'select all is visible');

                // act
                const $selectAll = treeView.$element().find('.dx-treeview-select-all-item');
                $($selectAll).trigger('dxclick');
                $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // apply filter

                const selectAll = $selectAll.dxCheckBox('instance');
                const column = that.columnsController.getVisibleColumns()[0];

                // assert
                assert.equal(selectAll.option('value'), undefined, 'select all has correct state'); // should be true after treeview fix
                assert.deepEqual(column.filterValues, ['1986/1/4'], 'filterValue is correct');
                assert.notEqual(column.filterType, 'exclude', 'filterType is correct');
            }
        });
    });

    QUnit.test('Check select all state after search and select if column dataType is date and search is by month', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.headerFilter.search.enabled = true;
        that.columns[0].dataType = 'date';
        that.items = [{ Test1: new Date(1986, 2, 1), Test2: 'test2' }, { Test1: new Date(1986, 3, 1), Test2: 'test4' }];

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);
        that.headerFilterController.showHeaderFilterMenu(0);

        const treeView = that.getListOrTreeView();
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        // act
        treeView.option('searchValue', 'March');

        $(treeView.$element()).find(`.${TREEVIEW_ITEM_CLASS}`).eq(0).children('.dx-checkbox').trigger('dxclick');

        // assert
        assert.notOk(treeView.$element().find('.dx-treeview-select-all-item').is(':visible'), 'selectAll is not visible');

        // act
        treeView.option('searchValue', '');
        const $selectAll = treeView.$element().find('.dx-treeview-select-all-item');
        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // apply filter
        const column = that.columnsController.getVisibleColumns()[0];

        // assert
        assert.ok(treeView.$element().find('.dx-treeview-select-all-item').is(':visible'), 'selectAll is visible');
        assert.equal($selectAll.dxCheckBox('instance').option('value'), undefined, 'select all has correct state'); // should be true after treeview fix
        assert.deepEqual(column.filterValues, ['1986/3'], 'filterValue is correct');
        assert.notEqual(column.filterType, 'exclude', 'filterType is correct');
    });

    // T850548
    QUnit.test('Filtering by year should be applied after select all -> deselect all', function(assert) {
        // arrange
        const that = this;
        const $testElement = $('#container');

        that.columns[0].dataType = 'date';
        that.options.headerFilter.search.enabled = true;
        that.items = [{ Test1: new Date(1986, 2, 1), Test2: 'test2' }, { Test1: new Date(1987, 3, 1), Test2: 'test4' }];

        that.setupDataGrid();
        that.columnHeadersView.render($testElement);
        that.headerFilterView.render($testElement);
        that.headerFilterController.showHeaderFilterMenu(0);

        const treeView = that.getListOrTreeView();
        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $selectAll = treeView.$element().find('.dx-treeview-select-all-item');

        $($selectAll).trigger('dxclick'); // select all
        $($selectAll).trigger('dxclick'); // deselect all
        treeView.option('searchValue', '1987'); // search by year

        // assert
        const $itemElements = $($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`));
        assert.strictEqual($itemElements.length, 1, 'item count');

        // act
        $itemElements.first().children('.dx-checkbox').trigger('dxclick'); // select first item
        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // apply filter

        // assert
        const column = that.columnsController.getVisibleColumns()[0];
        assert.deepEqual(column.filterValues, [1987], 'filterValues is correct');
        assert.notEqual(column.filterType, 'include', 'filterType is correct');
    });

    QUnit.test('Filtering by month should be applied when there is a selected day in the month', function(assert) {
        // arrange
        const that = this;
        const $testElement = $('#container');

        that.columns[0].dataType = 'date';
        that.columns[0].filterValues = ['1986/4/1'];
        that.options.headerFilter.search.enabled = true;
        that.items = [{ Test1: new Date(1986, 3, 1), Test2: 'test2' }, { Test1: new Date(1986, 3, 2), Test2: 'test4' }];

        that.setupDataGrid();
        that.columnHeadersView.render($testElement);
        that.headerFilterView.render($testElement);
        that.headerFilterController.showHeaderFilterMenu(0);

        const treeView = that.getListOrTreeView();
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        treeView.option('searchValue', 'April'); // search by month

        // assert
        const $itemElements = $($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`));
        assert.strictEqual($itemElements.length, 2, 'item count');

        // act
        $itemElements.eq(1).children('.dx-checkbox').trigger('dxclick'); // select second item
        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // apply filter

        // assert
        const column = that.columnsController.getVisibleColumns()[0];
        assert.deepEqual(column.filterValues, ['1986/4'], 'filterValues is correct');
        assert.notEqual(column.filterType, 'include', 'filterType is correct');
    });

    QUnit.test('Check search in column lookup with simple types', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].lookup = {
            dataSource: ['test1', 'test2', 'test3']
        };
        that.items = [{ Test1: 1, Test2: 'test2' }, { Test1: 2, Test2: 'test4' }];

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);
        that.headerFilterController.showHeaderFilterMenu(0);

        const list = that.getListOrTreeView();

        // assert
        assert.equal(list.option('selectionMode'), 'all', 'selectAll item is visible');

        // act
        list.option('searchValue', 't2');
        const listItems = list.$element().find('.dx-list-item');

        // assert
        assert.equal(list.option('searchExpr'), 'this', 'searchExpr is correct');
        assert.equal(list.option('selectionMode'), 'multiple', 'selectAll item is hidden');
        assert.equal(listItems.length, 1, 'list item\'s count');
        assert.equal(listItems.text(), 'test2', 'correct item\'s text');
    });

    QUnit.test('Check filtering in column lookup with object types', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.columns[0].lookup = {
            valueExpr: 'value',
            displayExpr: 'text',
            dataSource: [
                { value: 1, text: 'test1' },
                { value: 2, text: 'test2' },
                { value: 3, text: 'test3' }
            ] };
        that.items = [{ Test1: 1, Test2: 'test2' }, { Test1: 2, Test2: 'test4' }];

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);
        that.headerFilterController.showHeaderFilterMenu(0);

        const list = that.getListOrTreeView();

        // act
        list.option('searchValue', 't2');
        const listItems = list.$element().find('.dx-list-item');

        // assert
        assert.equal(list.option('searchExpr'), 'text', 'searchExpr is correct');
        assert.equal(listItems.length, 1, 'list item\'s count');
        assert.equal(listItems.text(), 'test2', 'correct item\'s text');
    });

    QUnit.test('Search when custom dataSource to headerFilter is specified', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.headerFilter.search.enabled = true;
        that.columns[0].headerFilter = {
            dataSource: [{ text: 'Test1', value: 1 }, { text: 'Test2', value: 2 }]
        };

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);
        that.headerFilterController.showHeaderFilterMenu(0);

        const list = that.getListOrTreeView();

        // act
        list.option('searchValue', 't2');

        // assert
        const listItems = list.$element().find('.dx-list-item');
        assert.strictEqual(listItems.length, 1, 'list item\'s count');
        assert.strictEqual(listItems.text(), 'Test2', 'correct item\'s text');
    });

    QUnit.test('Search by custom column', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.headerFilter.search.enabled = true;
        that.columns[0] = {
            selector: function(data) {
                return data.Test2;
            },
            calculateCellValue: function(data) {
                return data.Test2;
            }
        };

        that.items = [{ Test1: 1, Test2: 'test2' }, { Test1: 2, Test2: 'test4' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);
        that.headerFilterController.showHeaderFilterMenu(0);

        const list = that.getListOrTreeView();

        // act
        list.option('searchValue', 't2');

        // assert
        const listItems = list.$element().find('.dx-list-item');
        assert.strictEqual(listItems.length, 1, 'list item\'s count');
        assert.strictEqual(listItems.text(), 'test2', 'correct item\'s text');
    });

    // T643528
    QUnit.test('Search by value from calculateCellValue', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.headerFilter.search.enabled = true;
        that.columns = [{
            dataField: 'Test1',
            selector: function(data) {
                return data.Test1;
            },
            calculateCellValue: function(data) {
                return data.Test2 + data.Test1;
            }
        }];

        that.items = [{ Test1: 111, Test2: 'test2' }, { Test1: 2, Test2: 'test4' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);
        that.headerFilterController.showHeaderFilterMenu(0);

        const list = that.getListOrTreeView();

        // act
        list.option('searchValue', 'test2111');

        // assert
        const listItems = list.$element().find('.dx-list-item');
        assert.strictEqual(listItems.length, 1, 'list item\'s count');
        assert.strictEqual(listItems.text(), 'test2111', 'correct item\'s text');
    });

    // T629003
    QUnit.test('No exceptions on an attempt to filter a lookup column when valueExpr is not specified', function(assert) {
        // arrange
        try {
            const that = this;
            const $testElement = $('#container');
            const headerFilterDataSource = [
                { value: 1, text: 'test1' },
                { value: 2, text: 'test2' }
            ];

            that.columns[0].lookup = {
                displayExpr: 'text',
                dataSource: headerFilterDataSource
            };
            that.items = [{ Test1: 1, Test2: 'test2' }, { Test1: 2, Test2: 'test4' }];

            that.setupDataGrid();
            that.columnHeadersView.render($testElement);
            that.headerFilterView.render($testElement);
            that.headerFilterController.showHeaderFilterMenu(0);

            // assert
            assert.deepEqual(that.headerFilterView.getListComponent().option('items'), [
                {
                    'text': '(Blanks)',
                    'value': null
                },
                {
                    'text': 'test1',
                    'value': headerFilterDataSource[0]
                },
                {
                    'text': 'test2',
                    'value': headerFilterDataSource[1]
                }], 'list items');

            const $popupContent = that.headerFilterView.getPopupContainer().$content();

            // act
            $($popupContent.find('.dx-list-item').last()).trigger('dxclick');

            // assert
            assert.ok($popupContent.find('.dx-list-item').last().find('.dx-checkbox-checked').length, 'checkbox checked');
        } catch(e) {
            assert.ok(false, 'the error is thrown');
        }
    });

    // T644753
    QUnit.testInActiveWindow('No scroll on opening the header filter when the popup is cropped', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'focus is disabled for not desktop devices');
            return;
        }
        // arrange
        const that = this;
        let $popupContent;
        const viewPort = viewPortUtils.value();
        const $testElement = $('#container').wrap($('<div/>').css({
            position: 'absolute',
            width: '100%',
            height: '300px',
            overflowY: 'scroll',
            top: 10000,
            left: 10000
        }));

        fx.off = true;
        viewPortUtils.value($testElement.parent());

        try {
            that.items = [{ Test1: 'test1', Test2: 'test2' }, { Test1: 'test3', Test2: 'test4' }];
            that.setupDataGrid();
            that.columnHeadersView.render($testElement);
            that.headerFilterView.render($testElement);

            // assert
            assert.equal($testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

            // act
            that.headerFilterController.showHeaderFilterMenu(0);
            that.clock.tick(10);

            // assert
            $popupContent = that.headerFilterView.getPopupContainer().$content();
            assert.strictEqual($testElement.parent().scrollTop(), 0, 'scrollTop');
            assert.ok($popupContent.is(':visible'), 'visible popup');
            assert.ok($popupContent.find('.dx-list-select-all').first().hasClass('dx-state-focused'));
        } finally {
            fx.off = false;
            viewPortUtils.value(viewPort);
        }
    });

    QUnit.test('Checks whether the SelectAll checkbox is deselected when all filter items are deselected (T875471)', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.generateItems(3);
        this.columns[0].filterValues = [];
        this.columns[0].filterType = 'exclude';
        this.setupDataGrid();
        this.columnHeadersView.render($testElement);
        this.headerFilterView.render($testElement);

        this.headerFilterController.showHeaderFilterMenu(0);

        const $popupContent = this.headerFilterView.getPopupContainer().$content();
        const $selectAll = $popupContent.find('.dx-list-select-all-checkbox');
        const $items = $popupContent.find('.dx-list-item');

        // assert
        assert.ok($selectAll.hasClass('dx-checkbox-checked'), 'selectAll is checked');
        assert.equal($items.length, 3);

        $($items.eq(0)).trigger('dxclick');

        // assert
        assert.ok($selectAll.hasClass('dx-checkbox-indeterminate'), 'selectAll is in the indeterminate state');

        $($items.eq(1)).trigger('dxclick');
        $($items.eq(2)).trigger('dxclick');

        // assert
        assert.notOk($selectAll.hasClass('dx-checkbox-indeterminate'), 'selectAll is not in the indeterminate state');
        assert.notOk($selectAll.hasClass('dx-checkbox-checked'), 'selectAll is not checked');

        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // apply filter
        this.clock.tick(500);

        // assert
        assert.notOk(this.columns[0].filterValues, 'filterValues not defined');
    });

    QUnit.test('allowSelectAll option should work', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.columns[0].dataType = 'date';
        this.columns[0].filterValues = ['1986/4/1', '2004/5/30'];

        this.items = [{ Test1: new Date(1986, 3, 1), Test2: 'test2' }, { Test1: new Date(1986, 3, 2), Test2: 'test4' }];

        this.setupDataGrid();
        this.columnHeadersView.render($testElement);
        this.headerFilterView.render($testElement);

        const isAllowSelectAllShown = (columnIndex) => {
            this.headerFilterController.showHeaderFilterMenu(columnIndex);

            const $popupContent = this.headerFilterView.getPopupContainer().$content();
            const $selectAll = $popupContent.find('.dx-list-select-all-checkbox, .dx-treeview-select-all-item');

            return !!$selectAll.length;
        };

        // act
        this.option('headerFilter.allowSelectAll', false);

        // assert
        assert.notOk(isAllowSelectAllShown(0), 'select all checkbox should not be shown at column 0');
        assert.notOk(isAllowSelectAllShown(1), 'select all checkbox should not be shown at column 1');

        // act
        this.option('headerFilter.allowSelectAll', true);

        // assert
        assert.ok(isAllowSelectAllShown(0), 'select all checkbox should be shown at column 0');
        assert.ok(isAllowSelectAllShown(1), 'select all checkbox should be shown at column 1');
    });

    QUnit.test('headerFilter.search.editorOptions option should work', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.columns[0].dataType = 'date';
        this.columns[0].filterValues = ['1986/4/1', '2004/5/30'];

        this.columns[0].headerFilter = this.columns[1].headerFilter = {
            search: {
                enabled: true,
                editorOptions: {
                    placeholder: 'column.headerFilter.placeholder',
                }
            }
        };

        this.options.headerFilter.search.enabled = true;
        this.options.headerFilter.search.editorOptions = {
            placeholder: 'headerFilter.placeholder',
            name: 'headerFilter.name'
        };

        this.items = [{ Test1: new Date(1986, 3, 1), Test2: 'test2' }, { Test1: new Date(2004, 5, 30), Test2: 'test4' }];

        this.setupDataGrid();
        this.columnHeadersView.render($testElement);
        this.headerFilterView.render($testElement);

        const getTextBoxOptions = () => $('.dx-textbox').dxTextBox('instance').option();

        // act
        this.headerFilterController.showHeaderFilterMenu(0);

        // assert
        assert.strictEqual(getTextBoxOptions().name, 'headerFilter.name', 'value should be from generic headerFilter');
        assert.strictEqual(getTextBoxOptions().placeholder, 'column.headerFilter.placeholder', 'value should be from column headerFilter');

        // act
        this.headerFilterController.showHeaderFilterMenu(1);

        // assert
        assert.strictEqual(getTextBoxOptions().name, 'headerFilter.name', 'value should be from generic headerFilter');
        assert.strictEqual(getTextBoxOptions().placeholder, 'column.headerFilter.placeholder', 'value should be from column headerFilter');
    });
});

QUnit.module('Header Filter with real columnsController', {
    beforeEach: function() {
        this.items = [{ Test1: 'value1', Test2: 'value2' }, { Test1: 'value3', Test2: 'value4' }];

        this.options = {
            columns: [{ dataField: 'Test1', allowHeaderFiltering: true }, { dataField: 'Test2', allowHeaderFiltering: true }],
            remoteOperations: { filtering: true, sorting: true, paging: true },
            headerFilter: {
                allowSelectAll: true,
                visible: true,
                width: 250,
                height: 300,
                search: {
                    enabled: false,
                    timeout: 500,
                    mode: 'contains',
                    editorOptions: {},
                },
                texts: {
                    ok: 'Ok',
                    cancel: 'Cancel',
                    emptyValue: '(Blanks)'
                }
            },
            showColumnHeaders: true
        };

        this.setupDataGrid = function(options) {
            setupDataGridModules(this, ['columns', 'data', 'columnHeaders', 'filterRow', 'headerFilter', 'editorFactory', 'summary'], {
                initViews: true,
                controllers: options && options.controllers || {}
            });
        };

        this.getListOrTreeView = getListOrTreeView.bind(this);

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        this.headerFilterController.hideHeaderFilterMenu();
        this.dispose();
    }
}, () => {

    // T237910
    QUnit.test('Load data', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.setupDataGrid({
            controllers: {
                data: new MockDataController({ items: that.items })
            }
        });
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.equal($('body').children('.dx-header-filter-menu').length, 1, 'has wrapper header filter menu');
        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.equal($popupContent.find('.dx-list-item').length, 2, 'has list item in header filter menu');
        assert.strictEqual($popupContent.find('.dx-list-item').first().text(), 'value1', 'text list item');
    });

    QUnit.test('combined filter when filterValues defined', function(assert) {
        // arrange
        const that = this;

        that.options.columns = [{ dataField: 'column1', filterValues: [1, 2, 3], allowHeaderFiltering: true }, { dataField: 'column2', filterValues: [1, 2, 3], filterType: 'exclude', allowHeaderFiltering: true }];
        that.options.dataSource = {
            load: function() { return []; },
            totalCount: function() { return 0; }
        };

        that.setupDataGrid();

        // assert
        assert.deepEqual(that.getCombinedFilter(), [
            [
                ['column1', '=', 1],
                'or',
                ['column1', '=', 2],
                'or',
                ['column1', '=', 3]
            ],
            'and',
            [
                '!',
                [
                    ['column2', '=', 1],
                    'or',
                    ['column2', '=', 2],
                    'or',
                    ['column2', '=', 3]
                ]
            ]
        ]);
    });

    // T318497
    QUnit.test('Apply header filter after refresh grid', function(assert) {
        // arrange
        const that = this;
        const $testElement = $('#container');

        that.options.columns = [{ dataField: 'column1', filterValues: [2], allowFiltering: true }];
        that.options.dataSource = {
            load: function() { return [{ column1: 1 }, { column1: 2 }, { column1: 3 }, { column1: 4 }, { column1: 5 }]; },
            totalCount: function() { return 5; }
        };

        that.setupDataGrid();
        that.columnHeadersView.render($testElement);
        that.headerFilterView.render($testElement);

        // assert
        assert.deepEqual(that.getCombinedFilter(), ['column1', '=', 2], 'combined filter');

        // arrange
        that.headerFilterController.showHeaderFilterMenu(0);

        that.headerFilterController.hideHeaderFilterMenu();


        // act
        that.refresh();

        // assert
        assert.deepEqual(that.getCombinedFilter(), ['column1', '=', 2], 'combined filter after refresh grid');
    });

    // T310415
    QUnit.test('Header filter with items when column with filterValues', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.columns[0].filterValues = ['test3'];
        that.options.columns[1].filterValues = ['test2', 'test4'];
        that.options.dataSource = [{ Test1: 'test1', Test2: 'test2' }, { Test1: 'test3', Test2: 'test4' }, { Test1: 'test5', Test2: 'test6' }];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listElements = $popupContent.find('.dx-list-item');

        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($listElements.length, 2, 'count list items');
        assert.strictEqual($listElements.first().text(), 'test1', 'text of the first item');
        assert.strictEqual($listElements.last().text(), 'test3', 'text of the second item');
        assert.ok($listElements.last().hasClass('dx-list-item-selected'), 'selected second item');
        assert.ok($listElements.last().find('.dx-checkbox-checked').length, 'checked checkbox in second item');
        assert.equal($popupContent.find('.dx-checkbox-checked').length, 1, 'count checked checkboxes');
    });

    // T243382
    QUnit.test('Header filter with filter row and apply filter button', function(assert) {
        // arrange
        const that = this;
        let applyFilterCallCount = 0;
        const testElement = $('#container');

        that.options.dataSource = that.items;
        that.options.filterRow = {
            visible: true,
            applyFilter: 'onClick'
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        that.dataController._applyFilter = function() {
            applyFilterCallCount++;
        };

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // arrange
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        $($popupContent.find('.dx-list-item').first()).trigger('dxclick');

        // assert
        assert.ok($popupContent.find('.dx-list-item').first().find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        assert.equal(applyFilterCallCount, 1, 'call applyFilter');
    });

    // T242345
    QUnit.test('Header filter when set format by column', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.dataSource = [{ Test1: 12, Test2: 'value1' }, { Test1: 6, Test2: 'value2' }];
        that.options.columns[0] = { dataField: 'Test1', format: 'currency' };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        // assert
        assert.strictEqual($popupContent.find('.dx-list-item').first().text(), '$6', 'item text');
        assert.strictEqual($popupContent.find('.dx-list-item').last().text(), '$12', 'item text');
    });

    // T241043
    QUnit.test('Filtering by empty null value', function(assert) {
        // arrange
        const that = this;
        let items;
        const testElement = $('#container');

        that.options.dataSource = [{ Test1: null, Test2: 'value1' }, { Test1: 6, Test2: 'value2' }];
        that.options.columns[0] = { dataField: 'Test1', dataType: 'number', allowHeaderFiltering: true };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        items = that.dataController.items();
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');
        assert.equal(items.length, 2, 'count items');
        assert.deepEqual(items[0].data, { Test1: null, Test2: 'value1' }, 'data of the first item');
        assert.deepEqual(items[1].data, { Test1: 6, Test2: 'value2' }, 'data of the second item');

        // arrange
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        // assert
        assert.strictEqual($popupContent.find('.dx-list-item').first().text(), '(Blanks)', 'empty text item');

        // arrange
        $($popupContent.parent().find('.dx-list-item').first()).trigger('dxclick');

        // assert
        assert.ok($popupContent.find('.dx-list-item').first().find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        items = that.dataController.items();
        assert.equal(items.length, 1, 'count items');
        assert.deepEqual(items[0].data, { Test1: null, Test2: 'value1' }, 'data of the first item');
    });

    // T313688
    QUnit.test('Filtering by empty undefined value', function(assert) {
        // arrange
        const that = this;
        let items;
        const testElement = $('#container');

        that.options.dataSource = [{ Test2: 'value1' }, { Test1: 6, Test2: 'value2' }];
        that.options.columns[0] = { dataField: 'Test1', dataType: 'number', allowHeaderFiltering: true };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        items = that.dataController.items();
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');
        assert.equal(items.length, 2, 'count items');
        assert.deepEqual(items[0].data, { Test2: 'value1' }, 'data of the first item');
        assert.deepEqual(items[1].data, { Test1: 6, Test2: 'value2' }, 'data of the second item');

        // arrange
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        // assert
        assert.strictEqual($popupContent.find('.dx-list-item').first().text(), '(Blanks)', 'empty text item');

        // arrange
        $($popupContent.parent().find('.dx-list-item').first()).trigger('dxclick');

        // assert
        assert.ok($popupContent.find('.dx-list-item').first().find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        items = that.dataController.items();
        assert.equal(items.length, 1, 'count items');
        assert.deepEqual(items[0].data, { Test2: 'value1' }, 'data of the first item');
    });

    // T372825
    QUnit.test('Filtering by empty string', function(assert) {
        // arrange
        const that = this;
        let items;
        const testElement = $('#container');

        that.options.dataSource = [{ Test1: '', Test2: 'value1' }, { Test1: null, Test2: 'value2' }, { Test1: 'value3', Test2: 'value4' }];
        that.options.columns[0] = { dataField: 'Test1', allowHeaderFiltering: true };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        items = that.dataController.items();
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');
        assert.equal(items.length, 3, 'count items');
        assert.deepEqual(items[0].data, { Test1: '', Test2: 'value1' }, 'data of the first item');
        assert.deepEqual(items[1].data, { Test1: null, Test2: 'value2' }, 'data of the second item');
        assert.deepEqual(items[2].data, { Test1: 'value3', Test2: 'value4' }, 'data of the third item');

        // arrange
        that.headerFilterController.showHeaderFilterMenu(0);

        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        // assert
        assert.equal($popupContent.find('.dx-list-item').length, 2, 'count item');
        assert.strictEqual($popupContent.find('.dx-list-item').first().text(), '(Blanks)', 'empty text item');

        // arrange
        $($popupContent.parent().find('.dx-list-item').first()).trigger('dxclick');

        // assert
        assert.ok($popupContent.find('.dx-list-item').first().find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        items = that.dataController.items();
        assert.equal(items.length, 2, 'count items');
        assert.deepEqual(items[0].data, { Test1: '', Test2: 'value1' }, 'data of the first item');
        assert.deepEqual(items[1].data, { Test1: null, Test2: 'value2' }, 'data of the second item');
    });

    // T372825
    QUnit.test('Filtering by empty string with filterType is exclude', function(assert) {
        // arrange
        const that = this;
        let items;
        const testElement = $('#container');

        that.options.dataSource = [{ Test1: '', Test2: 'value1' }, { Test1: null, Test2: 'value2' }, { Test1: 'value3', Test2: 'value4' }];
        that.options.columns[0] = { dataField: 'Test1', allowHeaderFiltering: true, filterType: 'exclude' };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        items = that.dataController.items();
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');
        assert.equal(items.length, 3, 'count items');
        assert.deepEqual(items[0].data, { Test1: '', Test2: 'value1' }, 'data of the first item');
        assert.deepEqual(items[1].data, { Test1: null, Test2: 'value2' }, 'data of the second item');
        assert.deepEqual(items[2].data, { Test1: 'value3', Test2: 'value4' }, 'data of the third item');

        // arrange
        that.headerFilterController.showHeaderFilterMenu(0);

        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        // assert
        assert.equal($popupContent.find('.dx-list-item').length, 2, 'count item');
        assert.strictEqual($popupContent.find('.dx-list-item').first().text(), '(Blanks)', 'empty text item');

        // arrange
        $($popupContent.parent().find('.dx-list-item').first()).trigger('dxclick');

        // assert
        assert.ok(!$popupContent.find('.dx-list-item').first().find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        items = that.dataController.items();
        assert.equal(items.length, 1, 'count items');
        assert.deepEqual(items[0].data, { Test1: 'value3', Test2: 'value4' }, 'data of the first item');
    });

    // T251272
    QUnit.test('Header Filter when grid with CustomStore', function(assert) {
        // arrange
        const that = this;
        const loadArgs = [];
        const testElement = $('#container');

        that.options.dataSource = {
            filter: ['Test1', '<>', 'value14'],
            load: function(options) {
                loadArgs.push(options);
                return $.Deferred().resolve([{ Test1: 'value11', Test2: 'value21' }, { Test1: 'value13', Test2: 'value22' }, { Test1: 'value13', Test2: 'value23' }/* , { Test1: "value14", Test2: "value24" } */], { totalCount: 3 });
            }
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        // assert
        assert.strictEqual($popupContent.find('.dx-list-item').length, 2, 'header items count');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(0).text(), 'value11', 'item 1 text');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(1).text(), 'value13', 'item 2 text');
        assert.strictEqual(loadArgs.length, 2, 'load count');
        assert.deepEqual(loadArgs[1].filter, ['Test1', '<>', 'value14'], 'header filter load filter');
        assert.deepEqual(loadArgs[1].group, undefined, 'header filter load group');
    });

    QUnit.test('Header Filter when grid with CustomStore when remoteOperations false', function(assert) {
        // arrange
        const that = this;
        const loadArgs = [];
        const testElement = $('#container');

        that.options.remoteOperations = false;
        that.options.dataSource = {
            filter: ['Test1', '<>', 'value14'],
            load: function(options) {
                loadArgs.push(options);
                return $.Deferred().resolve([{ Test1: 'value11', Test2: 'value21' }, { Test1: 'value13', Test2: 'value22' }, { Test1: 'value13', Test2: 'value23' }, { Test1: 'value14', Test2: 'value24' }]);
            }
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        // assert
        assert.strictEqual($popupContent.find('.dx-list-item').length, 2, 'header items count. value14 is filtered locally');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(0).text(), 'value11', 'item 1 text');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(1).text(), 'value13', 'item 2 text');
        // T317818
        assert.strictEqual(loadArgs.length, 1, 'load count');
    });

    // T801018
    QUnit.test('Header filter with search bar if remote filtering and local grouping', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.headerFilter.search.enabled = true;
        that.options.remoteOperations = { sorting: true, filtering: true, paging: true };

        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);
        that.headerFilterController.showHeaderFilterMenu(0);

        const list = that.getListOrTreeView();

        // act
        assert.ok(list.option('searchEnabled'), 'list with search bar');
        assert.equal(list.option('searchExpr'), 'Test1', 'searchExpr is correct');
    });

    QUnit.test('Header Filter when grid with CustomStore when remote grouping and remote summary', function(assert) {
        // arrange
        const that = this;
        const loadArgs = [];
        const testElement = $('#container');

        that.options.remoteOperations = true;
        that.options.summary = {
            groupItems: [{ summaryType: 'count' }],
            totalItems: [{ summaryType: 'count' }]
        };
        that.options.dataSource = {
            filter: ['Test1', '<>', 'value14'],
            load: function(options) {
                loadArgs.push(options);
                if(options.group) {
                    return $.Deferred().resolve([{ key: 'value11', items: null }, { key: 'value13', items: null }]);
                } else {
                    return $.Deferred().resolve([{ Test1: 'value11', Test2: 'value21' }, { Test1: 'value13', Test2: 'value22' }, { Test1: 'value13', Test2: 'value23' }/* , { Test1: "value14", Test2: "value24" } */], { totalCount: 3 });
                }
            }
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        // assert
        assert.strictEqual($popupContent.find('.dx-list-item').length, 2, 'header items count. value14 is filtered locally');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(0).text(), 'value11', 'item 1 text');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(1).text(), 'value13', 'item 2 text');
        assert.strictEqual(loadArgs.length, 2, 'load count');
        assert.deepEqual(loadArgs[1].filter, ['Test1', '<>', 'value14'], 'header filter load filter');
        assert.deepEqual(loadArgs[1].filter, ['Test1', '<>', 'value14'], 'header filter load filter');
        assert.deepEqual(loadArgs[1].group, [{ selector: 'Test1', isExpanded: false }], 'header filter load group');
        assert.deepEqual(loadArgs[1].skip, 0, 'header filter load skip');
        assert.deepEqual(loadArgs[1].take, 20, 'header filter load take');

        assert.deepEqual(loadArgs[0].groupSummary, undefined, 'initial load groupSummary');
        assert.deepEqual(loadArgs[0].totalSummary, [{ selector: undefined, summaryType: 'count' }], 'initial load totalSummary');
        assert.deepEqual(loadArgs[1].groupSummary, undefined, 'header filter  load groupSummary');
        assert.deepEqual(loadArgs[1].totalSummary, undefined, 'header filter  load totalSummary');
    });

    QUnit.test('Header Filter when grid with CustomStore when remote grouping and groupInterval defined', function(assert) {
        // arrange
        const that = this;
        const loadArgs = [];
        const testElement = $('#container');

        that.options.remoteOperations = true;
        that.options.columns[0].headerFilter = { groupInterval: 10 };
        that.options.dataSource = {
            load: function(options) {
                loadArgs.push(options);
                if(options.group) {
                    return $.Deferred().resolve([{ key: 0, items: null }]);
                } else {
                    return $.Deferred().resolve([{ Test1: 0, Test2: 'value21' }, { Test1: 1, Test2: 'value22' }, { Test1: 2, Test2: 'value23' }], { totalCount: 3 });
                }
            }
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        // assert
        assert.strictEqual($popupContent.find('.dx-list-item').length, 1, 'header items count');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(0).text(), '0 - 10', 'item 1 text');
        assert.strictEqual(loadArgs.length, 2, 'load count');
        assert.deepEqual(loadArgs[1].group, [{ selector: 'Test1', groupInterval: 10, isExpanded: false }], 'header filter load group');
        assert.deepEqual(loadArgs[1].skip, 0, 'header filter load skip');
        assert.deepEqual(loadArgs[1].take, 20, 'header filter load take');
    });

    QUnit.test('Header Filter when grid with CustomStore when remote grouping and groupInterval defined as array', function(assert) {
        // arrange
        const that = this;
        const loadArgs = [];
        const testElement = $('#container');

        that.options.remoteOperations = true;
        that.options.columns[0].headerFilter = { groupInterval: [100, 10] };
        that.options.dataSource = {
            load: function(options) {
                loadArgs.push(options);
                if(options.group) {
                    return $.Deferred().resolve([{ key: 0, items: { key: 0, items: null } }]);
                } else {
                    return $.Deferred().resolve([{ Test1: 0, Test2: 'value21' }, { Test1: 1, Test2: 'value22' }, { Test1: 2, Test2: 'value23' }], { totalCount: 3 });
                }
            }
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        // assert
        assert.strictEqual($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).length, 1, 'header items count');
        assert.strictEqual($popupContent.find(`.${TREEVIEW_ITEM_CLASS}`).eq(0).text(), '0 - 100', 'item 1 text');
        assert.strictEqual(loadArgs.length, 2, 'load count');
        assert.deepEqual(loadArgs[1].group, [{ selector: 'Test1', groupInterval: 100, isExpanded: true }, { selector: 'Test1', groupInterval: 10, isExpanded: false }], 'header filter load group');
        assert.deepEqual(loadArgs[1].skip, undefined, 'header filter load skip');
        assert.deepEqual(loadArgs[1].take, undefined, 'header filter load take');
    });

    // T276179
    QUnit.test('Header Filter when grid with ODataStore with expand', function(assert) {
        // arrange
        const that = this;
        const loadArgs = [];
        const testElement = $('#container');

        const store = new ODataStore({});

        store._loadImpl = function(options) {
            loadArgs.push(options);
            return $.Deferred().resolve([{ Test1: 'value11', Test2: 'value21' }, { Test1: 'value13', Test2: 'value22' }, { Test1: 'value13', Test2: 'value23' }/* , { Test1: "value14", Test2: "value24" } */], { totalCount: 3 });
        };

        that.options.dataSource = {
            filter: ['Test1', '<>', 'value14'],
            expand: 'expandTest',
            store: store
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        // assert
        assert.strictEqual($popupContent.find('.dx-list-item').length, 2, 'header items count');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(0).text(), 'value11', 'item 1 text');
        assert.strictEqual($popupContent.find('.dx-list-item').eq(1).text(), 'value13', 'item 2 text');
        assert.strictEqual(loadArgs.length, 2, 'load count');
        assert.deepEqual(loadArgs[1].filter, ['Test1', '<>', 'value14'], 'header filter load filter');
        assert.deepEqual(loadArgs[1].group, undefined, 'header filter load group');
        // T276179
        assert.deepEqual(loadArgs[1].expand, 'expandTest', 'expand option');
        assert.deepEqual(loadArgs[1].dataField, 'Test1', 'dataField option');
    });

    // T267981
    QUnit.test('Not update indicator state for column with allowHeaderFiltering is false', function(assert) {
        // arrange
        const that = this;
        let $cells;
        const testElement = $('#container');

        that.options.columns[0] = { dataField: 'Test1', allowHeaderFiltering: false };
        that.setupDataGrid({
            controllers: {
                data: new MockDataController({ items: that.items })
            }
        });
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        $cells = that.columnHeadersView.element().find('td');
        assert.equal($cells.length, 2, 'count columns');
        assert.ok(!$cells.first().find('.dx-header-filter').length, 'not has header filter in first column');
        assert.ok($cells.last().find('.dx-header-filter').length, 'has header filter in second column');
        assert.ok($cells.last().find('.dx-header-filter-empty').length, 'header filter is empty in second column');
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.columnsController.columnOption(1, {
            filterValues: ['value2'],
            filterType: 'include'
        });

        // assert
        $cells = that.columnHeadersView.element().find('td');
        const columns = that.columnsController.getVisibleColumns();
        assert.deepEqual(columns[1].filterValues, ['value2'], 'filter values in second column');
        assert.ok(!$cells.first().find('.dx-header-filter').length, 'not has header filter in first column');
        assert.ok($cells.last().find('.dx-header-filter').length, 'has header filter in second column');
        assert.ok(!$cells.last().find('.dx-header-filter-empty').length, 'header filter is not empty in second column');
    });

    // T322354
    QUnit.test('Not show indicator when set filterValues for column and with headerFilter.visible is false', function(assert) {
        // arrange
        const that = this;
        let $cells;
        const testElement = $('#container');

        that.options.headerFilter.visible = false;
        that.setupDataGrid({
            controllers: {
                data: new MockDataController({ items: that.items })
            }
        });
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        $cells = that.columnHeadersView.element().find('td');
        assert.equal($cells.length, 2, 'count columns');
        assert.ok(!$cells.first().find('.dx-header-filter').length, 'not has header filter in first column');
        assert.ok(!$cells.last().find('.dx-header-filter').length, 'not has header filter in second column');

        // act
        that.columnsController.columnOption(1, {
            filterValues: ['value2'],
            filterType: 'include'
        });

        // assert
        $cells = that.columnHeadersView.element().find('td');
        const columns = that.columnsController.getVisibleColumns();
        assert.deepEqual(columns[1].filterValues, ['value2'], 'filter values in second column');
        assert.ok(!$cells.first().find('.dx-header-filter').length, 'not has header filter in first column');
        assert.ok(!$cells.last().find('.dx-header-filter').length, 'not has header filter in second column');
    });

    QUnit.test('Header Filter with CustomStore', function(assert) {
        // arrange
        const that = this;
        let applyFilterCallCount = 0;
        const testElement = $('#container');

        that.options.dataSource = that.items;
        that.options.columns[0] = { dataField: 'Test1', allowHeaderFiltering: true, headerFilter: { dataSource: [{ value: 'value1', text: 'Value1' }, { value: 'value2', text: 'Value2' }] } };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        that.dataController._applyFilter = function() {
            applyFilterCallCount++;
        };

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listItems = $popupContent.find('.dx-list-item');

        // assert
        assert.equal($listItems.length, 2, 'count item');
        assert.strictEqual($listItems.first().text(), 'Value1', 'text of the first item');
        assert.strictEqual($listItems.last().text(), 'Value2', 'text of the second item');

        $($listItems.last()).trigger('dxclick');

        // assert
        assert.ok($listItems.last().find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        assert.equal(applyFilterCallCount, 1, 'call applyFilter');
        assert.deepEqual(that.columnsController.getVisibleColumns()[0].filterValues, ['value2'], 'filter values of the first column');
    });

    // T306872
    QUnit.test('Header Filter - customStore value with filter data options', function(assert) {
        // arrange
        const that = this;
        let applyFilterCallCount = 0;
        const testElement = $('#container');

        that.options.dataSource = that.items;
        that.options.columns[0] = { dataField: 'Test1', allowHeaderFiltering: true, headerFilter: { dataSource: [{ value: ['Test1', '=', 'value1'], text: 'Value1' }, { value: 'value2', text: 'Value2' }] } };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        that.dataController._applyFilter = function() {
            applyFilterCallCount++;
        };

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listItems = $popupContent.find('.dx-list-item');

        // assert
        assert.equal($listItems.length, 2, 'count item');
        assert.strictEqual($listItems.first().text(), 'Value1', 'text of the first item');
        assert.strictEqual($listItems.last().text(), 'Value2', 'text of the second item');

        $($listItems.first()).trigger('dxclick');

        // assert
        assert.ok($listItems.first().find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        assert.equal(applyFilterCallCount, 1, 'call applyFilter');
        assert.deepEqual(that.columnsController.getVisibleColumns()[0].filterValues, [['Test1', '=', 'value1']], 'filter values of the first column');
        assert.deepEqual(that.getCombinedFilter(), ['Test1', '=', 'value1'], 'filter of the grid');
    });

    // T306872
    QUnit.test('Header Filter - saving state when customStore value with filter data options', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.dataSource = that.items;
        that.options.columns[0] = { dataField: 'Test1', allowHeaderFiltering: true, headerFilter: { dataSource: [{ value: ['Test1', '=', 'value1'], text: 'Value1' }, { value: 'value2', text: 'Value2' }] }, filterValues: [['Test1', '=', 'value1']] };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listItems = $popupContent.find('.dx-list-item');

        // assert
        assert.equal($listItems.length, 2, 'count item');
        assert.strictEqual($listItems.first().text(), 'Value1', 'text of the first item');
        assert.strictEqual($listItems.last().text(), 'Value2', 'text of the second item');
        assert.ok($listItems.first().find('.dx-checkbox-checked').length, 'checkbox checked');
    });

    QUnit.test('Header Filter - customization dataSource via event', function(assert) {
        // arrange
        const that = this;
        let applyFilterCallCount = 0;
        const testElement = $('#container');

        that.options.dataSource = that.items;
        that.options.columns[0] = {
            dataField: 'Test1', allowHeaderFiltering: true, headerFilter: {
                dataSource: function(options) {
                    options.dataSource.postProcess = function(items) {
                        items.unshift({ value: 'test1', text: 'Test1' });
                        return items;
                    };
                }
            }
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        that.dataController._applyFilter = function() {
            applyFilterCallCount++;
        };

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listItems = $popupContent.find('.dx-list-item');

        // assert
        assert.equal($listItems.length, 3, 'count item');
        assert.strictEqual($listItems.eq(0).text(), 'Test1', 'text of the first item');
        assert.strictEqual($listItems.eq(1).text(), 'value1', 'text of the second item');
        assert.strictEqual($listItems.eq(2).text(), 'value3', 'text of the third item');

        $($listItems.first()).trigger('dxclick');

        // assert
        assert.ok($listItems.first().find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        assert.equal(applyFilterCallCount, 1, 'call applyFilter');
        assert.deepEqual(that.columnsController.getVisibleColumns()[0].filterValues, ['test1'], 'filter values of the first column');
    });

    // T311441
    QUnit.test('Header Filter (List) - saving state with changed dataSource via event', function(assert) {
        // arrange
        const that = this;
        let $listItems;
        const testElement = $('#container');

        that.options.dataSource = that.items;
        that.options.columns[0] = {
            dataField: 'Test1', allowHeaderFiltering: true, headerFilter: {
                dataSource: function(options) {
                    options.dataSource.postProcess = function(items) {
                        items.unshift({ value: 'test1', text: 'Test1' });
                        return items;
                    };
                }
            }
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        $listItems = $popupContent.find('.dx-list-item');

        // assert
        assert.equal($listItems.length, 3, 'count item');
        assert.strictEqual($listItems.eq(0).text(), 'Test1', 'text of the first item');
        assert.strictEqual($listItems.eq(1).text(), 'value1', 'text of the second item');
        assert.strictEqual($listItems.eq(2).text(), 'value3', 'text of the third item');

        $($listItems.first()).trigger('dxclick');

        // assert
        assert.ok($listItems.first().find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        assert.deepEqual(that.columnsController.getVisibleColumns()[0].filterValues, ['test1'], 'filter values of the first column');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        // assert
        $listItems = $popupContent.find('.dx-list-item');
        assert.ok($listItems.first().find('.dx-checkbox-checked').length, 'checkbox checked');
    });

    // T311441
    QUnit.test('Header Filter (TreeView) - saving state with changed dataSource via event', function(assert) {
        // arrange
        const that = this;
        let $treeViewItems;
        const testElement = $('#container');

        that.options.dataSource = [{ Test1: new Date(1993, 7, 6), Test2: 'value1' }, { Test1: new Date(1994, 2, 6), Test2: 'value2' }];
        that.options.columns[0] = {
            dataField: 'Test1', allowHeaderFiltering: true, headerFilter: {
                dataSource: function(options) {
                    options.dataSource.postProcess = function(items) {
                        items.unshift({ value: '1992', text: '1992', items: [{ value: '1992/8', text: 'August', items: [{ value: '1992/8/6', text: 6 }, { value: '1992/8/28', text: 28 }] }] });
                        return items;
                    };
                }
            }
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        $treeViewItems = $popupContent.find(`.${TREEVIEW_ITEM_CLASS}`);

        // assert
        assert.equal($treeViewItems.length, 3, 'count item');
        assert.strictEqual($treeViewItems.eq(0).text(), '1992', 'text of the first item');
        assert.strictEqual($treeViewItems.eq(1).text(), '1993', 'text of the second item');
        assert.strictEqual($treeViewItems.eq(2).text(), '1994', 'text of the third item');

        $($popupContent.find('.dx-treeview-toggle-item-visibility').first()).trigger('dxclick'); // expanded first item
        $treeViewItems = $popupContent.find(`.${TREEVIEW_ITEM_CLASS}`);

        // assert
        assert.equal($treeViewItems.length, 4, 'count item');
        assert.strictEqual($treeViewItems.eq(1).text(), 'August', 'text of the second item');

        $($popupContent.find('.dx-treeview-toggle-item-visibility').eq(1)).trigger('dxclick'); // expanded nested item
        $treeViewItems = $popupContent.find(`.${TREEVIEW_ITEM_CLASS}`);

        // assert
        assert.equal($treeViewItems.length, 6, 'count item');
        assert.strictEqual($treeViewItems.eq(2).text(), '6', 'text of the third item');
        assert.strictEqual($treeViewItems.eq(3).text(), '28', 'text of the fourth item');

        // act
        $($treeViewItems.eq(3).parent().find('.dx-checkbox')).trigger('dxclick');

        // assert
        assert.ok($treeViewItems.eq(3).parent().find('.dx-checkbox').hasClass('dx-checkbox-checked'), 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        assert.deepEqual(that.columnsController.getVisibleColumns()[0].filterValues, ['1992/8/28'], 'filter values of the first column');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        $($popupContent.find('.dx-treeview-toggle-item-visibility').first()).trigger('dxclick'); // expanded first item
        $($popupContent.find('.dx-treeview-toggle-item-visibility').eq(1)).trigger('dxclick'); // expanded nested item

        // assert
        $treeViewItems = $popupContent.find(`.${TREEVIEW_ITEM_CLASS}`);
        assert.equal($treeViewItems.length, 6, 'count item');
        assert.ok($treeViewItems.eq(3).parent().find('.dx-checkbox').hasClass('dx-checkbox-checked'), 'checkbox checked');
    });

    QUnit.test('Header Filter with customize text', function(assert) {
        // arrange
        const that = this;
        let i = 1;
        let applyFilterCallCount = 0;
        const testElement = $('#container');

        that.options.dataSource = that.items;
        that.options.columns[0].customizeText = function(options) {
            if(options.target === 'headerFilter') {
                options.valueText = 'Custom Text ' + i;
                i++;
            }

            return options.valueText;
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        that.dataController._applyFilter = function() {
            applyFilterCallCount++;
        };

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listItems = $popupContent.find('.dx-list-item');

        // assert
        assert.equal($listItems.length, 2, 'count item');
        assert.strictEqual($listItems.eq(0).text(), 'Custom Text 1', 'text of the first item');
        assert.strictEqual($listItems.eq(1).text(), 'Custom Text 2', 'text of the second item');

        $($listItems.first()).trigger('dxclick');

        // assert
        assert.ok($listItems.first().find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        assert.equal(applyFilterCallCount, 1, 'call applyFilter');
        assert.deepEqual(that.columnsController.getVisibleColumns()[0].filterValues, ['value1'], 'filter values of the first column');
    });

    QUnit.test('Header Filter with customize text for column with dataType the date', function(assert) {
        // arrange
        const that = this;
        let i = 1;
        let $listItems;
        let applyFilterCallCount = 0;
        const testElement = $('#container');

        that.options.dataSource = [{ Test1: new Date(1992, 7, 6), Test2: 'value1' }, { Test1: new Date(1992, 2, 6), Test2: 'value2' }];
        that.options.columns[0].customizeText = function(options) {
            if(options.target === 'headerFilter' && options.groupInterval === 'month') {
                options.valueText = 'Custom Text ' + i;
                i++;
            }

            return options.valueText;
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        that.dataController._applyFilter = function() {
            applyFilterCallCount++;
        };

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        $listItems = $popupContent.find(`.${TREEVIEW_ITEM_CLASS}`);

        assert.equal($listItems.length, 1, 'count treeview item');
        assert.strictEqual($listItems.eq(0).text(), '1992', 'text of the first item');

        $($popupContent.find('.dx-treeview-toggle-item-visibility').first()).trigger('dxclick'); // expanded first item

        // assert
        $listItems = $popupContent.find(`.${TREEVIEW_ITEM_CLASS}`);
        assert.equal($popupContent.find('.dx-treeview-node-container-opened').length, 1, 'treeview node container opened');
        assert.equal($listItems.length, 3, 'has treeview items');
        assert.strictEqual($listItems.eq(1).text(), 'Custom Text 1', 'text the nested treeview item');
        assert.strictEqual($listItems.eq(2).text(), 'Custom Text 2', 'text the nested treeview item');

        $($listItems.eq(1).parent().find('.dx-checkbox')).trigger('dxclick');

        // assert
        assert.equal($popupContent.find('.dx-checkbox-checked').length, 1, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        assert.equal(applyFilterCallCount, 1, 'call applyFilter');
        assert.deepEqual(that.columnsController.getVisibleColumns()[0].filterValues, ['1992/3'], 'filter values of the first column');
    });

    QUnit.test('Header Filter with calculateFilterExpression', function(assert) {
        // arrange
        const that = this;
        let i = 0;
        const testElement = $('#container');

        that.options.dataSource = that.items;
        that.options.columns[0].calculateFilterExpression = function(filterValue, selectedFilterOperation, target) {
            if(target === 'headerFilter') {
                i++;
                return this.defaultCalculateFilterExpression('customFilterValue' + i, selectedFilterOperation, target);
            }
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listItems = $popupContent.find('.dx-list-item');

        // assert
        assert.equal($listItems.length, 2, 'count item');
        assert.strictEqual($listItems.eq(0).text(), 'value1', 'text of the first item');
        assert.strictEqual($listItems.eq(1).text(), 'value3', 'text of the second item');

        $($listItems.last()).trigger('dxclick');

        // assert
        assert.ok($listItems.last().find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        const filter = that.getCombinedFilter();
        assert.strictEqual(filter[2], 'customFilterValue2', 'filter values of the first column');
    });

    QUnit.test('Apply header filter', function(assert) {
        // arrange
        const that = this;
        let countCallColumnsChanged = 0;
        const testElement = $('#container');

        that.options.dataSource = [{ Test1: 'value1', Test2: 'value2' }, { Test1: 'value3', Test2: 'value4' }, { Test1: 'value5', Test2: 'value6' }];
        that.options.columns[0].filterValues = ['value1'];
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        that.columnsController.columnsChanged.add(function() {
            countCallColumnsChanged++;
        });

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listItems = $popupContent.find('.dx-list-item');

        // assert
        assert.equal($listItems.length, 3, 'count item');
        assert.ok($listItems.first().find('.dx-checkbox-checked').length, 'checkbox checked');

        $($listItems.eq(1)).trigger('dxclick');

        // assert
        assert.ok($listItems.eq(1).find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        assert.equal(countCallColumnsChanged, 1, 'count call columnsChanged');
    });

    QUnit.test('Header filter with group interval \'year\' for column with dataType \'date\'', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.dataSource = [{ Test1: new Date(1992, 7, 6), Test2: 'value1' }, { Test1: new Date(1997, 2, 6), Test2: 'value2' }];
        that.options.columns[0].headerFilter = { groupInterval: 'year' };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const listInstance = that.headerFilterView.getListComponent();
        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listItems = $popupContent.find('.dx-list-item');

        // assert
        assert.equal(listInstance.NAME, 'dxList', 'dxList');
        assert.equal($listItems.length, 2, 'count item');
        assert.strictEqual($listItems.first().text(), '1992', 'text of the first item');
        assert.strictEqual($listItems.last().text(), '1997', 'text of the second item');

        // act
        $($listItems.eq(1)).trigger('dxclick');

        // assert
        assert.ok($listItems.eq(1).find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        const filter = that.getCombinedFilter();
        assert.equal(filter.length, 3, 'has filter');
        assert.deepEqual(filter[0][2], new Date(1997, 0, 1), 'first filter value');
        assert.deepEqual(filter[2][2], new Date(1998, 0, 1), 'second filter value');
        assert.deepEqual(that.columnsController.getVisibleColumns()[0].filterValues, [1997], 'filter values of the first column');
    });

    QUnit.test('Header filter with group interval \'quarter\' for column with dataType \'date\'', function(assert) {
        // arrange
        const that = this;
        let $listItems;
        const testElement = $('#container');

        that.options.dataSource = [
            { Test1: new Date(1992, 9, 6), Test2: 'value1' },
            { Test1: new Date(1992, 4, 6), Test2: 'value2' },
            { Test1: new Date(1992, 1, 6), Test2: 'value3' },
            { Test1: new Date(1992, 2, 6), Test2: 'value4' }];
        that.options.columns[0].headerFilter = { groupInterval: 'quarter' };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        $listItems = $popupContent.find(`.${TREEVIEW_ITEM_CLASS}`);

        assert.equal($listItems.length, 1, 'count treeview item');
        assert.strictEqual($listItems.eq(0).text(), '1992', 'text of the first item');

        $($popupContent.find('.dx-treeview-toggle-item-visibility').first()).trigger('dxclick'); // expanded first item

        // assert
        $listItems = $popupContent.find(`.${TREEVIEW_ITEM_CLASS}`);
        assert.equal($popupContent.find('.dx-treeview-node-container-opened').length, 1, 'treeview node container opened');
        assert.equal($listItems.length, 4, 'has treeview items');
        assert.strictEqual($listItems.eq(1).text(), 'Q1', 'text of the nested treeview item');
        assert.strictEqual($listItems.eq(2).text(), 'Q2', 'text of the nested treeview item');
        assert.strictEqual($listItems.eq(3).text(), 'Q4', 'text of the nested treeview item');

        $($listItems.eq(3).parent().find('.dx-checkbox')).trigger('dxclick');

        // assert
        assert.equal($popupContent.find('.dx-checkbox-checked').length, 1, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        const filter = that.getCombinedFilter();
        assert.equal(filter.length, 3, 'has filter');
        assert.deepEqual(filter[0][2], new Date(1992, 9, 1), 'first filter value');
        assert.deepEqual(filter[2][2], new Date(1993, 0, 1), 'second filter value');
        assert.deepEqual(that.columnsController.getVisibleColumns()[0].filterValues, ['1992/4'], 'filter values of the first column');
    });

    // T636103
    QUnit.test('Header filter with custom data source and group interval null for column with dataType \'date\'', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.dataSource = [{ Test1: new Date(1992, 7, 6), Test2: 'value1' }];
        that.options.columns[0].headerFilter = {
            groupInterval: null,
            dataSource: [
                { text: '2018-01', value: new Date(2018, 0, 1) },
                { text: '2018-02', value: new Date(2018, 1, 1) }
            ]
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const listInstance = that.headerFilterView.getListComponent();
        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listItems = $popupContent.find('.dx-list-item');

        // assert
        assert.equal(listInstance.NAME, 'dxList', 'dxList');
        assert.equal($listItems.length, 2, 'count item');
        assert.strictEqual($listItems.first().text(), '2018-01', 'text of the first item');
        assert.strictEqual($listItems.last().text(), '2018-02', 'text of the second item');
    });

    QUnit.test('Header filter with group interval for column with dataType \'number\'', function(assert) {
        // arrange
        const that = this;
        let $listItems;
        const testElement = $('#container');

        that.options.dataSource = [
            { Test1: 19, Test2: 'value1' },
            { Test1: 200, Test2: 'value2' },
            { Test1: 9, Test2: 'value3' }];
        that.options.columns[0].headerFilter = { groupInterval: [100, 10] };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        $listItems = $popupContent.find(`.${TREEVIEW_ITEM_CLASS}`);

        assert.equal($listItems.length, 2, 'count treeview item');
        assert.strictEqual($listItems.eq(0).text(), '0 - 100', 'text of the first item');
        assert.strictEqual($listItems.eq(1).text(), '200 - 300', 'text of the first item');

        $($popupContent.find('.dx-treeview-toggle-item-visibility').first()).trigger('dxclick'); // expanded first item

        // assert
        $listItems = $popupContent.find(`.${TREEVIEW_ITEM_CLASS}`);
        assert.equal($popupContent.find('.dx-treeview-node-container-opened').length, 1, 'treeview node container opened');
        assert.equal($listItems.length, 4, 'has treeview items');
        assert.strictEqual($listItems.eq(1).text(), '0 - 10', 'text of the nested treeview item');
        assert.strictEqual($listItems.eq(2).text(), '10 - 20', 'text of the nested treeview item');

        $($listItems.eq(2).parent().find('.dx-checkbox')).trigger('dxclick');

        // assert
        assert.equal($popupContent.find('.dx-checkbox-checked').length, 1, 'checkbox checked');

        // act
        $($popupContent.parent().find('.dx-button').first()).trigger('dxclick');

        // assert
        const filter = that.getCombinedFilter();
        assert.equal(filter.length, 3, 'has filter');
        assert.equal(filter[0][2], 10, 'first filter value');
        assert.equal(filter[2][2], 20, 'second filter value');
        assert.deepEqual(that.columnsController.getVisibleColumns()[0].filterValues, ['0/10'], 'filter values of the first column');
    });

    // T311547
    QUnit.test('Header filter with group interval for column with dataType \'number\' and format is \'currency\'', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.dataSource = [
            { Test1: 19, Test2: 'value1' },
            { Test1: 200, Test2: 'value2' },
            { Test1: 9, Test2: 'value3' }];
        that.options.columns[0].format = 'currency';
        that.options.columns[0].headerFilter = { groupInterval: 100 };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listItems = $popupContent.find('.dx-list-item');

        assert.equal($listItems.length, 2, 'count treeview item');
        assert.strictEqual($listItems.eq(0).text(), '$0 - $100', 'text of the first item');
        assert.strictEqual($listItems.eq(1).text(), '$200 - $300', 'text of the second item');
    });

    // T311547
    QUnit.test('HeaderFilter - customizeText with group interval for column with dataType \'number\' and format is \'currency\'', function(assert) {
        // arrange
        const that = this;
        let countCallCustomizeText = 0;
        const testElement = $('#container');

        that.options.dataSource = [
            { Test1: 19, Test2: 'value1' },
            { Test1: 200, Test2: 'value2' },
            { Test1: 9, Test2: 'value3' }];
        that.options.columns[0].format = 'currency';
        that.options.columns[0].headerFilter = { groupInterval: 100 };
        that.options.columns[0].customizeText = function(options) {
            let result;

            if(options.target === 'headerFilter') {
                if(countCallCustomizeText === 0) {
                    assert.equal(options.groupInterval, 100, 'groupInterval');
                    assert.equal(options.value, 0, 'value of the first item');
                    assert.strictEqual(options.valueText, '$0 - $100', 'value text of the first item');
                    result = 'from $0 to $100';
                } else {
                    assert.equal(options.groupInterval, 100, 'groupInterval');
                    assert.equal(options.value, 200, 'value of the second item');
                    assert.strictEqual(options.valueText, '$200 - $300', 'value text of the second item');
                    result = 'from $200 to $300';
                }
            }

            countCallCustomizeText++;
            return result;
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listItems = $popupContent.find('.dx-list-item');

        assert.equal($listItems.length, 2, 'count treeview item');
        assert.equal(countCallCustomizeText, 2, 'count call customizeText');
        assert.strictEqual($listItems.eq(0).text(), 'from $0 to $100', 'text of the first item');
        assert.strictEqual($listItems.eq(1).text(), 'from $200 to $300', 'text of the second item');
    });

    // T470801
    QUnit.test('Header filter should ignore calculateGroupValue column option', function(assert) {
        // arrange
        const that = this;
        const testElement = $('#container');

        that.options.dataSource = [
            { Test1: 19, Test2: 'value1' },
            { Test1: 200, Test2: 'value2' },
            { Test1: 9, Test2: 'value3' }];
        that.options.columns[0].calculateGroupValue = function(data) {
            return data.Test2;
        };
        that.setupDataGrid();
        that.columnHeadersView.render(testElement);
        that.headerFilterView.render(testElement);

        // assert
        assert.equal(testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        that.headerFilterController.showHeaderFilterMenu(0);


        const $popupContent = that.headerFilterView.getPopupContainer().$content();
        const $listItems = $popupContent.find('.dx-list-item');

        // assert
        assert.equal($listItems.length, 3, 'count treeview item');
        assert.strictEqual($listItems.eq(0).text(), '9', 'text of the first item');
        assert.strictEqual($listItems.eq(1).text(), '19', 'text of the second item');
        assert.strictEqual($listItems.eq(2).text(), '200', 'text of the third item');
    });

    // T323372
    QUnit.test('Proxy customQueryParams load parameter during headerFilter operation', function(assert) {
        // arrange
        const that = this;
        let loadOptions;

        that.options.dataSource = { store: { type: 'odata' }, customQueryParams: { param: 'test' } };
        that.setupDataGrid();

        const column = that.columnsController.getVisibleColumns()[0];
        that.dataController.store().on('loading', function(options) {
            loadOptions = options;
        });

        // act
        that.headerFilterController.getDataSource(column).load({ userData: {} });
        that.clock.tick(10);

        // assert
        assert.deepEqual(loadOptions.customQueryParams, { param: 'test' }, 'custom query param');
    });

    QUnit.test('dataSource group parameter should contains compare option if column has sortingMethod callback', function(assert) {
        // arrange
        const that = this;

        let context;
        that.options.columns[0].sortingMethod = function(x, y) {
            context = this;
            return x - y;
        };

        that.options.dataSource = [];

        that.setupDataGrid();

        const column = that.columnsController.getVisibleColumns()[0];

        // act
        const dataSource = that.headerFilterController.getDataSource(column);
        that.clock.tick(10);

        // assert
        assert.equal(dataSource.group.length, 1, 'one group parameter');
        assert.equal(dataSource.group[0].selector({ Test1: 5 }), 5, 'group selector');
        assert.equal(dataSource.group[0].compare(10, 1), 9, 'group compare');
        assert.equal(context.dataField, 'Test1', 'compare context');
    });

    // T349706
    QUnit.test('Not apply filter when selected all items', function(assert) {
        // arrange
        const that = this;
        let callApplyFilter;
        const $testElement = $('#container');

        that.options.dataSource = [{ Test1: 'test1', Test2: 'test2' }];
        that.setupDataGrid();
        that.columnHeadersView.render($testElement);
        that.headerFilterView.render($testElement);
        that.dataController._applyFilter = function() {
            callApplyFilter = true;
        };

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $popupContent = that.headerFilterView.getPopupContainer().$content();

        assert.ok($popupContent.is(':visible'), 'visible popup');
        assert.ok($popupContent.find('.dx-list').length, 'has list in header filter menu');
        assert.equal($popupContent.find('.dx-list-item').length, 1, 'count list items');

        // act
        $($popupContent.find('.dx-list-item').first()).trigger('dxclick');

        // assert
        assert.ok($popupContent.find('.dx-list-item').first().find('.dx-checkbox-checked').length, 'checked checkbox in first item');

        // act
        $($popupContent.parent().find('.dx-button').eq(0)).trigger('dxclick'); // OK button
        that.clock.tick(500);

        // assert
        const column = that.columnsController.getVisibleColumns()[0];
        assert.ok(!$popupContent.is(':visible'), 'not visible popup');
        assert.ok(!callApplyFilter, 'not apply filter');
        assert.strictEqual(column.filterValues, null, 'filterValues of the first column');
        assert.strictEqual(column.filterType, 'exclude', 'filterType of the first column');
    });

    QUnit.test('Draw header filter indicator for band columns', function(assert) {
        // arrange
        const that = this;
        const $testElement = $('#container');

        that.options.dataSource = [{ Column1: 12, Column2: 'value1', Column3: 'value2', Column4: 'value3', Column5: 'value4' }, { Column1: 6, Column2: 'value5', Column3: 'value6', Column4: 'value7', Column5: 'value8' }];
        that.options.columns = [{ caption: 'Band column 1', columns: ['Column1', 'Column2'] }, 'Column3', { caption: 'Band column 2', columns: ['Column4', 'Column5'] }];
        that.setupDataGrid();

        // act
        that.columnHeadersView.render($testElement);
        that.headerFilterView.render($testElement);

        // assert
        const $cells = $testElement.find('td');
        assert.equal($cells.length, 7, 'count cell');
        assert.ok(!$cells.eq(0).find('.dx-header-filter').length, 'not has header filter indicator');
        assert.ok($cells.eq(1).find('.dx-header-filter').length, 'has header filter indicator');
        assert.ok(!$cells.eq(2).find('.dx-header-filter').length, 'not has header filter indicator');
        assert.ok($cells.eq(3).find('.dx-header-filter').length, 'has header filter indicator');
        assert.ok($cells.eq(4).find('.dx-header-filter').length, 'has header filter indicator');
        assert.ok($cells.eq(5).find('.dx-header-filter').length, 'has header filter indicator');
        assert.ok($cells.eq(6).find('.dx-header-filter').length, 'has header filter indicator');
    });

    QUnit.test('Load data for column with dataType is \'datetime\'', function(assert) {
        // arrange
        let items;
        const getTreeText = function(items) {
            const result = [];
            let item = items[0];

            while(item) {
                result.push(item.text);
                item = item.items && item.items[0];
            }

            return result;
        };

        this.options.dataSource = [{ birthday: new Date(1992, 8, 6, 12, 13, 14) }];
        this.options.columns = [{ dataField: 'birthday', dataType: 'datetime' }];
        this.setupDataGrid();
        const column = this.columnsController.getVisibleColumns()[0];
        const dataSourceOptions = this.headerFilterController.getDataSource(column);

        // act
        dataSourceOptions.load({ group: dataSourceOptions.group }).done(function(data) {
            items = data;
        });
        this.clock.tick(10);

        // assert
        assert.deepEqual(getTreeText(items), ['1992', 'September', '6', '12', '13'], 'loaded data');
    });

    [null, 'yyyy-MM-ddTHH:mm:ssZ', 'yyyy-MM-ddTHH:mm:ss\'Z\'', 'yyyy-MM-dd HH:mm:ss'].forEach(dateSerializationFormat => {
        [false, true].forEach(remoteOperations => {
            QUnit.test(`Load data for column with dataType is 'datetime' if remoteOperations is enabled and dates are formatted in UTC (dateSerializationFormat=${dateSerializationFormat}, remoteOperations=${remoteOperations}) (T1029128, T1051815)`, function(assert) {
                // arrange
                let items;
                const getTreeText = function(items) {
                    const result = [];
                    let item = items[0];

                    while(item) {
                        result.push(item.text);
                        item = item.items && item.items[0];
                    }

                    return result;
                };

                const loadArgs = [];
                const date = new Date(2021, 3, 26, 16, 30);

                this.options.columns = [{ dataField: 'birthday', dataType: 'datetime' }];
                this.options.remoteOperations = remoteOperations;
                this.options.dateSerializationFormat = dateSerializationFormat;

                const isUTCFormat = dateSerializationFormat && dateSerializationFormat.indexOf('Z') >= 0;
                this.options.dataSource = {
                    load: function(options) {
                        loadArgs.push(options);
                        if(!remoteOperations) {
                            const birthday = dateSerialization.serializeDate(date, dateSerializationFormat);
                            return $.Deferred().resolve([{ birthday }]);
                        }
                        return $.Deferred().resolve([{
                            key: 2021, items: [{
                                key: date.getMonth() + 1, items: [{
                                    key: isUTCFormat ? date.getUTCDate() : date.getDate(), items: [{
                                        key: isUTCFormat ? date.getUTCHours() : date.getHours(), items: [{
                                            key: isUTCFormat ? date.getUTCMinutes() : date.getMinutes(), items: null
                                        }]
                                    }]
                                }]
                            }]
                        }], { totalCount: 1 });
                    }
                };
                this.setupDataGrid();
                const column = this.columnsController.getVisibleColumns()[0];
                const dataSourceOptions = this.headerFilterController.getDataSource(column);

                // act
                const group = gridCoreUtils.getHeaderFilterGroupParameters(column, remoteOperations);

                dataSourceOptions.load({
                    group
                }).done(function(data) {
                    items = data;
                });
                this.clock.tick(10);

                // assert
                assert.deepEqual(getTreeText(items), [
                    '2021',
                    'April',
                    date.getDate().toString(),
                    date.getHours().toString(),
                    date.getMinutes().toString()
                ], 'loaded data');
            });
        });
    });

    QUnit.test('Load null data for column with dataType is \'datetime\' if remoteOperations is enabled and dates are formatted in UTC (T1029128)', function(assert) {
        // arrange
        let items;
        const getTreeText = function(items) {
            const result = [];
            let item = items[0];

            while(item) {
                result.push(item.text);
                item = item.items && item.items[0];
            }

            return result;
        };

        const loadArgs = [];

        this.options.columns = [{ dataField: 'birthday', dataType: 'datetime' }];
        this.options.remoteOperations = true;
        this.options.dateSerializationFormat = 'yyyy-MM-ddTHH:mm:ssZ';
        this.options.dataSource = {
            load: function(options) {
                loadArgs.push(options);
                return $.Deferred().resolve([{
                    key: null, items: [{
                        key: null, items: [{
                            key: null, items: [{
                                key: null, items: [{
                                    key: null, items: null
                                }]
                            }]
                        }]
                    }]
                }], { totalCount: 1 });
            }
        };
        this.setupDataGrid();
        const column = this.columnsController.getVisibleColumns()[0];
        const dataSourceOptions = this.headerFilterController.getDataSource(column);

        // act
        dataSourceOptions.load({}).done(function(data) {
            items = data;
        });
        this.clock.tick(10);

        // assert
        assert.deepEqual(getTreeText(items), [
            '(Blanks)',
        ], 'loaded data');
    });

    // T534059
    QUnit.test('Header filter should consider the \'trueText\' and \'falseText\' column options', function(assert) {
        // arrange
        const that = this;
        const $testElement = $('#container');

        that.options.columns = [{
            dataField: 'field',
            dataType: 'boolean',
            trueText: 'Yes',
            falseText: 'No'
        }];
        that.setupDataGrid({
            controllers: {
                data: new MockDataController({ items: [{ field: undefined }, { field: true }, { field: false }] })
            }
        });
        that.columnHeadersView.render($testElement);
        that.headerFilterView.render($testElement);

        // act
        that.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $itemElements = that.headerFilterView.getPopupContainer().$content().find('.dx-list-item');
        assert.equal($itemElements.length, 3, 'count item');
        assert.strictEqual($itemElements.eq(0).text(), '(Blanks)', 'text of the first item');
        assert.strictEqual($itemElements.eq(1).text(), 'No', 'text of the second item');
        assert.strictEqual($itemElements.eq(2).text(), 'Yes', 'text of the third item');
    });

    // T544400
    QUnit.test('Updating selection state should be correct when headerFilter.dataSource as ArrayStore', function(assert) {
        // arrange
        const that = this;
        let $listItems;
        let $popupContent;
        const $testElement = $('#container');

        that.options.dataSource = that.items;
        that.options.columns[0] = {
            dataField: 'Test1',
            allowHeaderFiltering: true,
            headerFilter: {
                dataSource: new ArrayStore([
                    { value: 'value1', text: 'Value1' },
                    { value: 'value2', text: 'Value2' }
                ])
            }
        };
        that.setupDataGrid();
        that.columnHeadersView.render($testElement);
        that.headerFilterView.render($testElement);

        that.headerFilterController.showHeaderFilterMenu(0);

        $popupContent = $(that.headerFilterView.getPopupContainer().$content());
        $listItems = $popupContent.find('.dx-list-item');
        $listItems.first().trigger('dxclick');

        // assert
        assert.ok($listItems.first().find('.dx-checkbox-checked').length, 'checkbox checked');

        // act
        const $cancelButton = $popupContent.parent().find('.dx-button').last();
        $cancelButton.trigger('dxclick');

        that.headerFilterController.showHeaderFilterMenu(0);
        $popupContent = that.headerFilterView.getPopupContainer().$content();
        $listItems = $popupContent.find('.dx-list-item');

        // assert
        assert.notOk($listItems.first().find('.dx-checkbox-checked').length, 'checkbox unchecked');
    });

    // T596758
    QUnit.test('Checking filter in loadOptions when value in headerFilter.dataSource is specified as filter expression for a date column', function(assert) {
        // arrange
        const spy = sinon.spy(function(loadOptions) {
            return [{ date: '2018/01/01' }, { date: '2018/01/02' }, { date: '2018/01/03' }];
        });

        this.options.remoteOperations = { filtering: true };
        this.options.columns = [{
            dataField: 'date',
            dataType: 'date',
            headerFilter: {
                dataSource: [{ text: '2018/01/01', value: ['date', '=', '2018/01/01'] }]
            }
        }];
        this.options.dataSource = { load: spy };
        this.setupDataGrid();
        spy.resetHistory();

        // act
        this.columnOption('date', 'filterValues', [['date', '=', '2018/01/01']]);

        // assert
        assert.deepEqual(spy.getCall(0).args[0].filter, ['date', '=', '2018/01/01']);
    });

    [true, false].forEach((hasLookupOptimization) => {
        QUnit.test(`Header filter should show only relevant values with syncLookupFilterValues = true, lookupOptimization = ${hasLookupOptimization}`, function(assert) {
            // arrange
            this.options.columns = [{
                dataField: 'column1',
                allowFiltering: true,
                lookup: {
                    dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                    valueExpr: 'id',
                    displayExpr: 'value',
                },
                calculateDisplayValue: hasLookupOptimization ? 'text' : undefined,
                filterValues: [1],
            }, {
                dataField: 'column2',
                allowFiltering: true,
                lookup: {
                    dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                    valueExpr: 'id',
                    displayExpr: 'value',
                },
                calculateDisplayValue: hasLookupOptimization ? 'text' : undefined,
            }];

            this.options.dataSource = [
                { column1: 1, column2: 1, text: 'value1' },
                { column1: 2, column2: 2, text: 'value2' },
            ];

            this.options.syncLookupFilterValues = true;

            const $testElement = $('#container');

            this.setupDataGrid();
            this.columnHeadersView.render($testElement);
            this.headerFilterView.render($testElement);

            // act
            this.headerFilterController.showHeaderFilterMenu(1);

            // assert
            const $popupContent = this.headerFilterView.getPopupContainer().$content();
            const $listItemElements = $popupContent.find('.dx-list-item-content');
            assert.equal($listItemElements.length, 2, 'count list item');
            assert.strictEqual($listItemElements.eq(0).text(), '(Blanks)');
            assert.strictEqual($listItemElements.eq(1).text(), 'value1');
        });

        QUnit.test(`Header filter search should work with syncLookupFilterValues = true, lookupOptimization = ${hasLookupOptimization}`, function(assert) {
            // arrange
            this.options.columns = [{
                dataField: 'column1',
                allowFiltering: true,
                lookup: {
                    dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                    valueExpr: 'id',
                    displayExpr: 'value',
                },
                calculateDisplayValue: hasLookupOptimization ? 'text' : undefined,
            }];

            this.options.dataSource = [
                { column1: 1, column2: 1, text: 'value1' },
                { column1: 2, column2: 2, text: 'value2' },
            ];

            this.options.syncLookupFilterValues = true;

            const $testElement = $('#container');

            this.setupDataGrid();
            this.columnHeadersView.render($testElement);
            this.headerFilterView.render($testElement);

            // act
            this.headerFilterController.showHeaderFilterMenu(0);

            // assert

            const $popupContent = this.headerFilterView.getPopupContainer().$content();
            let $listItemElements = $popupContent.find('.dx-list-item-content');
            assert.equal($listItemElements.length, 3, 'count list item');
            assert.strictEqual($listItemElements.eq(0).text(), '(Blanks)');
            assert.strictEqual($listItemElements.eq(1).text(), 'value1');
            assert.strictEqual($listItemElements.eq(2).text(), 'value2');

            // act
            const list = this.getListOrTreeView();
            list.option('searchValue', 'value1');

            // assert
            $listItemElements = $popupContent.find('.dx-list-item-content');
            assert.equal($listItemElements.length, 1, 'count list item');
            assert.strictEqual($listItemElements.eq(0).text(), 'value1');
        });

        // T1100536
        QUnit.test(`Lookup header filter should pass correct load options (skip, take, filter) for lookup dataSource, lookupOptimization = ${hasLookupOptimization}`, function(assert) {
            // arrange
            this.options.columns = [{
                dataField: 'column1',
                allowFiltering: true,
                lookup: {
                    dataSource: [...new Array(100).keys()].map(i => ({ id: i, value: `value${i}` })),
                    valueExpr: 'id',
                    displayExpr: 'value',
                },
                calculateDisplayValue: hasLookupOptimization ? 'text' : undefined,
            }];

            this.options.dataSource = [...new Array(100).keys()].map(i => ({
                column1: i, text: `value${i}`
            }));


            this.options.syncLookupFilterValues = true;

            const $testElement = $('#container');

            this.setupDataGrid();
            this.columnHeadersView.render($testElement);
            this.headerFilterView.render($testElement);

            // act
            this.headerFilterController.showHeaderFilterMenu(0);

            // assert
            const $popupContent = this.headerFilterView.getPopupContainer().$content();
            let $listItemElements = $popupContent.find('.dx-list-item-content');
            assert.equal($listItemElements.length, 21, 'count list item');
            assert.strictEqual($listItemElements.eq(0).text(), '(Blanks)');
            assert.strictEqual($listItemElements.eq(1).text(), 'value0');
            assert.strictEqual($listItemElements.eq(-1).text(), 'value19');

            // act
            const list = this.getListOrTreeView();
            list.scrollBy(100);
            this.clock.tick(10);

            // assert
            $listItemElements = $popupContent.find('.dx-list-item-content');
            assert.equal($listItemElements.length, 41, 'count list item');
            assert.strictEqual($listItemElements.eq(0).text(), '(Blanks)');
            assert.strictEqual($listItemElements.eq(1).text(), 'value0');
            assert.strictEqual($listItemElements.eq(-1).text(), 'value39');
        });

        // T1133935
        [true, false].forEach((syncLookupFilterValues) => {
            [true, false].forEach((lookupDataSourceHasNullItem) => {
                QUnit.test(`Header filter should not contain two blank items if dataSource has item with nullish lookup value,
                        syncLookupFilterValues = ${syncLookupFilterValues}
                        lookupOptimization = ${hasLookupOptimization}
                        lookupDataSourceHasNullItem = ${lookupDataSourceHasNullItem}`,
                function(assert) {
                    const lookupDataSource = [
                        { id: 1, value: 'value1' },
                        { id: 2, value: 'value2' }
                    ];

                    if(lookupDataSourceHasNullItem) {
                        lookupDataSource.unshift({ id: null, value: null });
                    }

                    // arrange
                    this.options.columns = [{
                        dataField: 'column1',
                        allowFiltering: true,
                        lookup: {
                            dataSource: lookupDataSource,
                            valueExpr: 'id',
                            displayExpr: 'value',
                        },
                        calculateDisplayValue: hasLookupOptimization ? 'text' : undefined,
                    }];

                    this.options.dataSource = [
                        { column1: 1, text: 'value1' },
                        { column1: 2, text: 'value2' },
                        { column1: null, text: null, },
                    ];


                    this.options.syncLookupFilterValues = syncLookupFilterValues;

                    const $testElement = $('#container');

                    this.setupDataGrid();
                    this.headerFilterView.render($testElement);

                    // act
                    this.headerFilterController.showHeaderFilterMenu(0);

                    // assert
                    const $popupContent = this.headerFilterView.getPopupContainer().$content();
                    const $listItemElements = $popupContent.find('.dx-list-item-content');
                    assert.equal($listItemElements.length, 3, 'count list item');
                    assert.strictEqual($listItemElements.eq(0).text(), '(Blanks)');
                    assert.strictEqual($listItemElements.eq(1).text(), 'value1');
                    assert.strictEqual($listItemElements.eq(2).text(), 'value2');
                });
            });
        });
    });

    QUnit.test('There is no additional request to grid datasource after searching in filter row editor with groupPaging: true', function(assert) {
        // arrange
        const loadSpy = sinon.spy((loadOptions) => {
            const d = $.Deferred();
            new ArrayStore([
                { column1: 1 },
                { column1: 2 },
            ]).load(loadOptions).done(items => d.resolve({
                data: items,
                totalCount: 2,
            }));

            return d;
        });

        this.options.columns = [{
            dataField: 'column1',
            allowFiltering: true,
            lookup: {
                dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                valueExpr: 'id',
                displayExpr: 'value'
            }
        }];

        this.options.dataSource = { load: loadSpy };
        this.options.syncLookupFilterValues = true;
        this.options.remoteOperations = { groupPaging: true };
        this.options.headerFilter.search.enabled = true;

        const $testElement = $('#container');

        this.setupDataGrid();
        this.columnHeadersView.render($testElement);
        this.headerFilterView.render($testElement);

        // assert
        assert.strictEqual(loadSpy.callCount, 1);
        loadSpy.resetHistory();

        // act
        this.headerFilterController.showHeaderFilterMenu(0);

        // assert
        const $popupContent = this.headerFilterView.getPopupContainer().$content();
        let $listItemElements = $popupContent.find('.dx-list-item-content');
        assert.equal($listItemElements.length, 3, 'count list item');
        assert.strictEqual($listItemElements.eq(0).text(), '(Blanks)');
        assert.strictEqual($listItemElements.eq(1).text(), 'value1');
        assert.strictEqual($listItemElements.eq(2).text(), 'value2');

        // assert
        assert.strictEqual(loadSpy.callCount, 1);
        loadSpy.resetHistory();

        // act
        const list = this.getListOrTreeView();
        list.option('searchValue', 'value1');

        // assert
        $listItemElements = $popupContent.find('.dx-list-item-content');
        assert.equal($listItemElements.length, 1, 'count list item');
        assert.strictEqual($listItemElements.eq(0).text(), 'value1');

        // assert
        assert.strictEqual(loadSpy.callCount, 0);
        loadSpy.resetHistory();
    });


    // T938460
    QUnit.test('The selection should work correctly after searching when calculateDisplayValue is used and when a lookup\'s key is specified', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options = {
            dataSource: [{ 'Test': '123' }, { 'Test': '132' }],
            headerFilter: {
                visible: true,
                search: {
                    enabled: true,
                    timeout: 500,
                    mode: 'contains',
                    editorOptions: {},
                },
                texts: {
                    ok: 'Ok',
                    cancel: 'Cancel',
                    emptyValue: '(Blanks)'
                }
            },
            showColumnHeaders: true,
            columns: [{
                dataField: 'Test',
                allowHeaderFiltering: true,
                lookup: {
                    dataSource: function() {
                        const store = new ArrayStore({
                            key: 'id',
                            data: [{
                                'id': '123',
                                'name': '123'
                            }, {
                                'id': '132',
                                'name': '132'
                            }]
                        });

                        return {
                            sort: 'name',
                            searchOperation: 'startswith',
                            store: store
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                    searchEnabled: true
                },
                calculateDisplayValue: 'Test'
            }]
        };
        this.setupDataGrid();
        this.columnHeadersView.render($testElement);
        this.columnHeadersView.render($testElement);
        this.headerFilterView.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-header-filter-menu').length, 1, 'has header filter menu');

        // act
        this.headerFilterController.showHeaderFilterMenu(0);
        const $popupContent = this.headerFilterView.getPopupContainer().$content();

        // assert
        assert.ok($popupContent.is(':visible'), 'visible popup');

        // act
        const list = this.getListOrTreeView();
        list.option('searchValue', '1');

        // assert
        assert.strictEqual(list.option('selectedItems').length, 0, 'no selected items');
    });

    QUnit.test('searchExpr option should work', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns = [
            {
                dataField: 'city',
                dataType: 'string',
                headerFilter: {
                    search: {
                        enabled: true,
                        searchExpr: ['city', 'country']
                    }
                }
            }
        ];

        this.options.dataSource = [
            { city: 'New York', country: 'USA' },
            { city: 'Munich', country: 'Germany' },
            { city: 'Berlin', country: 'Germany' },
        ];

        this.setupDataGrid();
        this.columnHeadersView.render($testElement);
        this.headerFilterView.render($testElement);

        // act
        this.headerFilterController.showHeaderFilterMenu(0);
        const list = this.getListOrTreeView();

        list.option('searchValue', 'Germany');

        // assert
        assert.strictEqual(list.option('items').length, 2);
    });

    QUnit.test('searchExpr option should work with custom headerFilter.dataSource', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns = [
            {
                dataField: 'city',
                dataType: 'string',
                headerFilter: {
                    dataSource: [
                        { text: 'New York', value: 'new_york', country: 'USA' },
                        { text: 'Munich', value: 'munich', country: 'Germany' },
                        { text: 'Berlin', value: 'berlin', country: 'Germany' },
                    ],
                    search: {
                        enabled: true,
                        searchExpr: ['city', 'country'],
                    }
                }
            }
        ];
        this.options.dataSource = [{ city: 'New York' }, { city: 'Munich' }, { city: 'Berlin' }];

        this.setupDataGrid();
        this.columnHeadersView.render($testElement);
        this.headerFilterView.render($testElement);

        // act
        this.headerFilterController.showHeaderFilterMenu(0);
        const list = this.getListOrTreeView();

        list.option('searchValue', 'Germany');

        // assert
        assert.strictEqual(list.option('items').length, 2);
    });

    QUnit.test('searchExpr option should work with lookup-column', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns = [{
            dataField: 'LookupColumn',
            headerFilter: {
                search: {
                    enabled: true,
                    searchExpr: ['displayText', 'country']
                }
            },
            lookup: {
                dataSource: [
                    { displayText: 'New York', valueExpr: 'new_york', country: 'USA' },
                    { displayText: 'Munich', valueExpr: 'munich', country: 'Germany' },
                    { displayText: 'Berlin', valueExpr: 'berlin', country: 'Germany' },
                ],
                displayExpr: 'displayText',
                valueExpr: 'lookupValue'
            }
        }];

        this.options.dataSource = [
            { LookupColumn: 'new_york' },
            { LookupColumn: 'munich' },
            { LookupColumn: 'berlin' },
        ];

        this.setupDataGrid();
        this.columnHeadersView.render($testElement);
        this.headerFilterView.render($testElement);

        // act
        this.headerFilterController.showHeaderFilterMenu(0);
        const list = this.getListOrTreeView();

        list.option('searchValue', 'Germany');

        // assert
        assert.strictEqual(list.option('items').length, 2);
    });

    QUnit.test('Filter should apply if allowSelectAll is false and first item was checked', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns = [
            {
                dataField: 'field1',
                headerFilter: {
                    allowSelectAll: false
                }
            }
        ];

        this.options.dataSource = [
            { field1: 'aaa' }, { field1: 'bbb' }, { field1: 'ccc' },
        ];

        this.setupDataGrid();
        this.columnHeadersView.render($testElement);
        this.headerFilterView.render($testElement);

        // act
        this.headerFilterController.showHeaderFilterMenu(0);

        const $popupContent = $(this.headerFilterView.getPopupContainer().$overlayContent());
        const $checkbox = $popupContent.find('.dx-checkbox').first();
        const $applyButton = $popupContent.find('.dx-button').first();

        $checkbox.trigger('dxclick');
        $applyButton.trigger('dxclick');

        this.clock.tick(500);

        // assert
        const column = this.columnsController.getVisibleColumns()[0];

        assert.strictEqual(column.filterValues.length, 1, 'filterValues length of the first column');
        assert.strictEqual(column.filterValues[0], 'aaa', 'filterValues of the first column');
    });
});

