import 'generic_light.css!';

import 'ui/data_grid';
import 'ui/tag_box';
import ArrayStore from 'common/data/array_store';

import $ from 'jquery';
import { noop } from 'core/utils/common';
import { value as viewPort } from 'core/utils/view_port';
import { addShadowDomStyles } from 'core/utils/shadow_dom';
import devices from '__internal/core/m_devices';
import fx from 'common/core/animation/fx';
import dateLocalization from 'common/core/localization/date';
import { setupDataGridModules, MockDataController, MockColumnsController } from '../../helpers/dataGridMocks.js';

const device = devices.real();

const TEXTEDITOR_INPUT_SELECTOR = '.dx-texteditor-input';

QUnit.testStart(function() {
    viewPort($('#qunit-fixture').addClass('dx-viewport'));

    const markup =
        `<div>
            <div id="container">
                <div class="dx-datagrid"></div>
            </div>
        </div>`;

    $('#qunit-fixture').html(markup);
    addShadowDomStyles($('#qunit-fixture'));
});

QUnit.module('Filter Row', {
    beforeEach: function() {
        this.$element = () => $('#container');
        this.gridContainer = $('#container > .dx-datagrid');

        this.columns = [];
        this.options = {
            filterRow: {
                visible: true,
                showOperationChooser: true,
                operationDescriptions: {
                    'equal': 'Equals',
                    'notEqual': 'Not equals',
                    'lessThan': 'Less',
                    'lessThanOrEqual': 'Less or equals',
                    'greaterThan': 'Greater',
                    'greaterThanOrEqual': 'Greater or equals',
                    'startsWith': 'Starts with',
                    'contains': 'Contains',
                    'notContains': 'Not contains',
                    'endsWith': 'Ends with'
                },
                resetOperationText: 'Reset'
            }
        };

        setupDataGridModules(this, ['data', 'columnHeaders', 'filterRow', 'editorFactory', 'headerPanel'], {
            initViews: true,
            controllers: {
                columns: new MockColumnsController(this.columns),
                data: new MockDataController({})
            }
        });

        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
        fx.off = false;
    }
}, () => {

    QUnit.test('Draw filterRow with operation choosers', function(assert) {
    // arrange
        const $testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }, { caption: 'Column 2', allowFiltering: true }, { caption: 'Column 3' }]);

        // act
        this.columnHeadersView.render($testElement);

        const $filterMenu = $(this.columnHeadersView.element().find('.dx-menu').first());
        const rootMenuItem = $filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');

        const $cell = $filterMenu.parent();
        const $filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        // assert
        assert.ok($cell.children().first().is($filterMenu), 'first children is menu');
        assert.equal($filterMenu.length, 1, '1 filter operation button for first column');
        assert.equal($filterMenuItems.length, 3, '2 filter operation items for first column');
    });

    QUnit.test('Hide items without descriptions', function(assert) {
    // arrange
        const $testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>', 'isblank'] }]);

        // act
        this.columnHeadersView.render($testElement);

        const $filterMenu = $(this.columnHeadersView.element().find('.dx-menu').first());
        const rootMenuItem = $filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');

        $filterMenu.parent();
        const $filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        // assert
        assert.equal($filterMenuItems.length, 3, '2 filter operation items for first column');
    });

    QUnit.test('FilterRow with cssClass', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', cssClass: 'customCssClass' }, { caption: 'Column 2' }, { caption: 'Column 3' }]);

        // act
        this.columnHeadersView.render(testElement);

        const filterCell = this.columnHeadersView.element().find('.dx-datagrid-filter-row').first().find('td');

        // assert
        assert.equal(filterCell.length, 3, 'count filter cell');
        assert.ok(filterCell.first().hasClass('customCssClass'), 'has class customCssClass');
        assert.ok(!filterCell.eq(1).hasClass('customCssClass'), 'not has class customCssClass');
        assert.ok(!filterCell.last().hasClass('customCssClass'), 'not has class customCssClass');
    });

    QUnit.test('FilterRow with option showColumnLines true', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.showColumnLines = true;

        // act
        this.columnHeadersView.render(testElement);
        const filterRow = testElement.find('.dx-datagrid-filter-row');

        // assert
        assert.ok(filterRow.hasClass('dx-column-lines'), 'has class dx-column-lines');
    });

    QUnit.test('FilterRow with option showColumnLines false', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.showColumnLines = false;

        // act
        this.columnHeadersView.render(testElement);
        const filterRow = testElement.find('.dx-datagrid-filter-row');

        // assert
        assert.ok(!filterRow.hasClass('dx-column-lines'), 'not has class dx-column-lines');
    });

    QUnit.test('Not draw operation choosers for filterRow when showOperationChooser disabled', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }, { caption: 'Column 2', allowFiltering: true }, { caption: 'Column 3' }]);

        this.options.filterRow.showOperationChooser = false;

        // act
        this.columnHeadersView.render(testElement);

        // assert
        const selectedFilterOperationElements = this.columnHeadersView.element().find('.dx-icon-filter-operation-isSelected');
        assert.equal(selectedFilterOperationElements.length, 0, '1 filter operation button for first column');
    });

    QUnit.test('Draw descriptions for operation chooser of filterRow', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }, { caption: 'Column 2', allowFiltering: true }, { caption: 'Column 3' }]);

        this.options.filterRow.operationDescriptions = {
            'equal': 'test equals',
            'notEqual': 'test not equals'
        };

        // act
        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu').first();
        const rootMenuItem = filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');
        const filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        // assert
        assert.equal(filterMenu.length, 1, '1 filter operation button for first column');
        assert.equal(filterMenuItems.length, 3, '2 filter operation items for first column filter button');
        assert.equal(filterMenuItems.eq(0).find('.dx-menu-item').first().children('.dx-menu-item-content').find(':contains(\'test equals\')').length, 1, 'equals description exists');
        assert.equal(filterMenuItems.eq(1).find('.dx-menu-item').first().children('.dx-menu-item-content').find(':contains(\'test not equals\')').length, 1, 'not equals description exists');
    });

    QUnit.test('Draw operation chooser when filterOperations null', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true }]);

        // act
        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu');

        // assert
        assert.ok(!filterMenu.length, 'disabled option menu');
    });

    QUnit.test('Check that dxMenu have correct rtlEnabled option value', function(assert) {
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }]);
        this.options.rtlEnabled = true;

        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu').dxMenu('instance');

        assert.ok(filterMenu.option('rtlEnabled'), 'dxMenu have correct "rtlEnabled" option value');
    });

    QUnit.test('Default operation chooser', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu');

        // assert
        assert.ok(filterMenu.find('.dx-icon').first().hasClass('dx-icon-filter-operation-default'), 'default menu image');
    });

    QUnit.test('Change operation via operation chooser', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], index: 0 }, { caption: 'Column 2', allowFiltering: true, index: 1 }, { caption: 'Column 3', index: 2 }]);

        // act
        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu');
        const rootMenuItem = filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');
        const filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        $(filterMenuItems.find('.dx-menu-item')[1]).trigger('dxclick');

        // assert
        assert.deepEqual(this.columnsController.updateOptions[0], {
            columnIndex: 0,
            optionName: { 'selectedFilterOperation': '<>' },
            optionValue: undefined
        });
    });

    // T557200
    QUnit.test('Repaint view on change operation via operation chooser', function(assert) {
    // arrange
        const that = this;
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], index: 0 }, { caption: 'Column 2', allowFiltering: true, index: 1 }, { caption: 'Column 3', index: 2 }]);

        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu');
        const rootMenuItem = filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');
        const filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        const oldColumnOption = this.columnsController.columnOption;
        let isViewRepainted = false;

        this.columnsController.columnOption = function(columnIndex, options) {
            oldColumnOption.apply(this, arguments);
            if(options && options.selectedFilterOperation) {
                that.columnHeadersView.render();
                isViewRepainted = true;
            }
        };

        // act
        filterMenuItems.find('.dx-menu-item').eq(1).trigger('dxclick');

        // assert
        assert.ok(isViewRepainted, 'view is repainted without exceptions');
    });

    QUnit.test('Reset operation via operation chooser', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], selectedFilterOperation: '<>', index: 0 }, { caption: 'Column 2', allowFiltering: true, initialIndex: 1 }, { caption: 'Column 3', index: 2 }]);

        // act
        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu');
        const rootMenuItem = filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');
        const filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        const resetItem = filterMenuItems.find('.dx-menu-item').last();

        // act
        resetItem.trigger('dxclick');

        // assert
        assert.equal(resetItem.children('.dx-menu-item-content').find(':contains(\'Reset\')').length, 1, 'reset description exists');
        assert.deepEqual(this.columnsController.updateOptions[0], {
            columnIndex: 0,
            optionName: {
                selectedFilterOperation: null,
                filterValue: null
            },
            optionValue: undefined
        });
    });

    // T537880
    QUnit.test('Reset operation via operation chooser several times', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], selectedFilterOperation: '<>', index: 0 }, { caption: 'Column 2', allowFiltering: true, initialIndex: 1 }, { caption: 'Column 3', index: 2 }]);

        // act
        this.columnHeadersView.render(testElement);

        const filterMenu = this.columnHeadersView.element().find('.dx-menu');
        const rootMenuItem = filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');
        const filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        const $resetItem = filterMenuItems.find('.dx-menu-item').last();

        // act
        $resetItem.trigger('dxclick');
        $resetItem.trigger('dxclick');

        // assert
        assert.deepEqual(this.columnsController.updateOptions.length, 2, 'columnOption is called twice');
        assert.deepEqual(this.columnsController.updateOptions[1], {
            columnIndex: 0,
            optionName: {
                selectedFilterOperation: null,
                filterValue: null
            },
            optionValue: undefined
        });
    });

    // T516687
    QUnit.test('Reset operation via operation chooser when applyMode is onClick', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], selectedFilterOperation: '<>', index: 0 }, { caption: 'Column 2', allowFiltering: true, initialIndex: 1 }, { caption: 'Column 3', index: 2 }]);
        this.options.filterRow.applyFilter = 'onClick';

        // act
        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu');
        const rootMenuItem = filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');
        const filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        const resetItem = filterMenuItems.find('.dx-menu-item').last();

        // act
        resetItem.trigger('dxclick');

        // assert
        assert.equal(resetItem.children('.dx-menu-item-content').find(':contains(\'Reset\')').length, 1, 'reset description exists');
        assert.deepEqual(this.columnsController.updateOptions[0], {
            columnIndex: 0,
            optionName: {
                bufferedSelectedFilterOperation: null,
                bufferedFilterValue: null
            },
            optionValue: undefined
        });
    });


    QUnit.test('Change operation on columnsChanged event with filterValue optionName parameter', function(assert) {
    // arrange
        const testElement = $('#container');
        const that = this;

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], index: 0 }, { caption: 'Column 2', allowFiltering: true, index: 1 }, { caption: 'Column 3', index: 2 }]);

        // act
        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu');

        // act
        this.columnsController.columnOption = function(index) {
            return that.columns[this.getVisibleIndex(index)];
        };
        this.columns[0].selectedFilterOperation = '<>';
        this.columnsController.columnsChanged.fire({
            columnIndex: 0,
            optionNames: { selectedFilterOperation: true, length: 1 },
            changeTypes: { columns: true, length: 1 }
        });

        // assert
        assert.ok(filterMenu.find('.dx-icon').eq(0).hasClass('dx-icon-filter-operation-not-equals')); // <>
    });

    QUnit.test('Change operation on columnsChanged event with filterValue optionName parameter when columnIndex is not equal visible index', function(assert) {
    // arrange
        const testElement = $('#container');
        const that = this;

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], index: 1 }, { caption: 'Column 2', allowFiltering: true, index: 0 }, { caption: 'Column 3', index: 2 }]);

        // act
        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu');

        // act
        this.columnsController.columnOption = function(index) {
            return that.columns[this.getVisibleIndex(index)];
        };
        this.columns[0].selectedFilterOperation = '<>';
        this.columnsController.columnsChanged.fire({
            columnIndex: 1,
            optionNames: { selectedFilterOperation: true, length: 1 },
            changeTypes: { columns: true, length: 1 }
        });

        // assert
        assert.ok(filterMenu.find('.dx-icon').eq(0).hasClass('dx-icon-filter-operation-not-equals')); // <>
    });

    QUnit.test('Reset operation on columnsChanged event with filterValue optionName parameter', function(assert) {
    // arrange
        const testElement = $('#container');
        const that = this;

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], selectedFilterOperation: '<>', index: 0 }, { caption: 'Column 2', allowFiltering: true, index: 1 }, { caption: 'Column 3', index: 2 }]);

        // act
        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu');

        this.columnsController.columnOption = function(index) {
            return that.columns[this.getVisibleIndex(index)];
        };

        // act
        this.columns[0].selectedFilterOperation = undefined;
        this.columnsController.columnsChanged.fire({
            columnIndex: 0,
            optionNames: { selectedFilterOperation: true, length: 1 },
            changeTypes: { columns: true, length: 1 }
        });

        // assert
        assert.ok(filterMenu.find('.dx-icon').eq(0).hasClass('dx-icon-filter-operation-default')); // <>
    });

    function updateFilterTextTest(assert, that, eventToTrigger) {
    // arrange
        const testElement = $('#container');

        $.extend(that.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: false, index: 0, dataType: 'number' }]);
        that.options.filterRow.applyFilter = 'auto';

        // act
        that.columnHeadersView.render(testElement);

        const filterRowInput = $(that.columnHeadersView.element()).find('.dx-texteditor');
        assert.equal(filterRowInput.length, 1);

        filterRowInput.find('.dx-texteditor-input').val(90);
        filterRowInput.find('.dx-texteditor-input').trigger(eventToTrigger);

        // act
        that.clock.tick(600);

        // assert
        assert.strictEqual(that.columnsController.updateOptions.length, 0);

        // act
        that.clock.tick(100);

        // assert
        assert.strictEqual(that.columnsController.updateOptions.length, 1);
        assert.deepEqual(that.columnsController.updateOptions[0], {
            columnIndex: 0,
            optionName: 'filterValue',
            optionValue: 90
        });
    }

    QUnit.test('update filter text with timeout and keyup event', function(assert) {
        updateFilterTextTest(assert, this, 'keyup');
    });

    // T751914
    QUnit.test('update filter text with timeout and input event', function(assert) {
        updateFilterTextTest(assert, this, 'input');
    });

    QUnit.test('update filter text to empty string', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: false, index: 0, dataType: 'number' }]);

        // act
        this.columnHeadersView.render(testElement);

        const filterRowInput = $(this.columnHeadersView.element()).find('.dx-texteditor');
        assert.equal(filterRowInput.length, 1);

        filterRowInput.find('.dx-texteditor-input').val('');
        filterRowInput.find('.dx-texteditor-input').trigger('keyup');

        // act
        this.clock.tick(600);

        // assert
        assert.strictEqual(this.columnsController.updateOptions.length, 0);

        // act
        this.clock.tick(100);

        // assert
        assert.strictEqual(this.columnsController.updateOptions.length, 0);
    });

    // T117317
    QUnit.test('update filter text for number column with format', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{
            caption: 'Column 1',
            parseValue: function(text) {
                return Number(text);
            },
            allowFiltering: true, filterOperations: false, index: 0, dataType: 'number', format: 'currency'
        }]);

        this.columnHeadersView.render(testElement);

        // act
        const filterRowInput = $(this.columnHeadersView.element()).find('.dx-texteditor');
        filterRowInput.find('.dx-texteditor-input').val(90);
        filterRowInput.find('.dx-texteditor-input').trigger('keyup');

        this.clock.tick(700);

        // assert
        assert.deepEqual(this.columnsController.updateOptions[0], {
            columnIndex: 0,
            optionName: 'filterValue',
            optionValue: 90
        });
    });

    QUnit.test('update filter text for date column with format', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{
            caption: 'Column 1',
            parseValue: function(text) {
                return dateLocalization.parse(text);
            },
            editorOptions: {
                pickerType: 'calendar'
            },
            allowFiltering: true, filterOperations: false, index: 0, dataType: 'date', format: 'yyyy/MM/dd'
        }]);

        this.columnHeadersView.render(testElement);

        // act

        const filterRowInput = $(this.columnHeadersView.element()).find('.dx-texteditor-input');

        filterRowInput
            .val('1992/08/06')
            .trigger('change');

        this.clock.tick(700);

        // assert
        assert.deepEqual(this.columnsController.updateOptions[0], {
            columnIndex: 0,
            optionName: 'filterValue',
            optionValue: new Date('1992/08/06')
        });
    });

    // T469845
    QUnit.test('filter datebox should be valid after clearing filter value option', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{
            caption: 'dateColumn',
            parseValue: function(text) {
                return dateLocalization.parse(text);
            },
            editorOptions: {
                pickerType: 'calendar'
            },
            filterValue: new Date(2017, 10, 5),
            allowFiltering: true, filterOperations: false, index: 0, dataType: 'date', format: 'yyyy/MM/dd'
        }]);

        this.columnHeadersView.render(testElement);

        // act
        this.columns[0].filterValue = undefined;
        this.columnsController.columnsChanged.fire({
            columnIndex: 0,
            optionNames: { filterValue: true, length: 1 },
            changeTypes: { columns: true, length: 1 }
        });

        // assert
        const filterRowDateBox = this.columnHeadersView.element().find('.dx-datebox').eq(0).dxDateBox('instance');
        assert.ok(filterRowDateBox.option('isValid'), 'dateBox should be valid');
        assert.strictEqual(filterRowDateBox.option('value'), null, 'value was cleared');
    });

    // T104792
    QUnit.test('update filter value for boolean column to true', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{
            caption: 'Column 1',
            allowFiltering: true, filterOperations: false, index: 0, dataType: 'boolean'
        }]);
        this.columnHeadersView.render(testElement);

        // act
        const $selectBox = testElement.find('.dx-selectbox');
        assert.equal($selectBox.length, 1);
        $selectBox.dxSelectBox('instance').option('value', true);

        // assert
        assert.deepEqual(this.columnsController.updateOptions[0], {
            columnIndex: 0,
            optionName: 'filterValue',
            optionValue: true
        });
    });

    // T104792
    QUnit.test('update filter value for boolean column to false', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{
            caption: 'Column 1',
            allowFiltering: true, filterOperations: false, index: 0, dataType: 'boolean'
        }]);
        this.columnHeadersView.render(testElement);

        // act
        const $selectBox = testElement.find('.dx-selectbox');
        assert.equal($selectBox.length, 1);
        $selectBox.dxSelectBox('instance').option('value', false);

        // assert
        assert.deepEqual(this.columnsController.updateOptions[0], {
            columnIndex: 0,
            optionName: 'filterValue',
            optionValue: false
        });
    });

    QUnit.test('update filter value for array column with dxTagBox', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.onEditorPreparing = function(e) {
            if(e.parentType === 'filterRow' && e.caption === 'Tags') {
                e.editorName = 'dxTagBox';
                e.editorOptions.dataSource = [1, 2, 3, 4, 6];
                e.editorOptions.showSelectionControls = true;
                e.editorOptions.value = e.value || [];
                e.editorOptions.onValueChanged = function(args) {
                    e.setValue(args.value);
                };

            }
        };

        this.editorFactoryController.init();

        $.extend(this.columns, [{
            caption: 'Tags',
            allowFiltering: true, index: 0
        }]);

        this.columnHeadersView.render(testElement);

        // act
        testElement.find('.dx-tagbox').first().dxTagBox('instance').option('value', [1, 2, 3]);


        // assert
        assert.deepEqual(this.columnsController.updateOptions[0], {
            columnIndex: 0,
            optionName: 'filterValue',
            optionValue: [1, 2, 3]
        });

        // act
        this.columnsController.columnsChanged.fire({
            columnIndex: 0,
            optionName: 'filterValue',
            optionNames: { filterValue: true, length: 1 },
            optionValue: [1, 2, 3]
        });

        assert.equal(testElement.find('.dx-tagbox').length, 1);
        assert.deepEqual(testElement.find('.dx-tagbox').dxTagBox('instance').option('value'), [1, 2, 3]);
    });

    // B254521
    QUnit.test('Draw filterRow when all columns grouped', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{ headerCaption: 'Column 1', groupIndex: 0 },
            { headerCaption: 'Column 2', groupIndex: 1 },
            { headerCaption: 'Column 3', groupIndex: 2 },
            { command: 'empty' }
        ]);

        // act
        this.columnHeadersView.render($('.dx-datagrid'));

        const filterRow = testElement.find('.dx-datagrid-filter-row');

        // assert
        assert.ok(filterRow.length, 'has filter row');
        assert.ok(!filterRow.find('.dx-editor-cell').length);
        assert.equal(filterRow.find('td').length, 4, 'count td');
        assert.equal(filterRow.find('td').last().html(), '&nbsp;', 'text column with command is empty');
        assert.ok(filterRow.outerHeight() >= 30, 'height filter row');
    });

    // T100624
    QUnit.test('Filter Cell when the width of the columns in percent', function(assert) {
    // arrange
        const that = this;
        const testElement = $('#container');

        $.extend(that.columns, [{ caption: 'Column 1', allowFiltering: true, width: '40%' }, { caption: 'Column 2', allowFiltering: true, width: '60%' }]);

        // act
        that.columnHeadersView.render(testElement);

        // assert
        const textEditor = testElement.find('.dx-texteditor');
        assert.equal(textEditor.length, 2, 'text editor');
        assert.ok(!textEditor.first()[0].style.width, 'not width text editor');
        assert.ok(!textEditor.last()[0].style.width, 'not width text editor');
    });

    // T104915
    QUnit.test('Filter cell with lookup column', function(assert) {
    // arrange
        const that = this;
        const testElement = $('#container');

        $.extend(that.columns, [{
            caption: 'Column 1', allowFiltering: true, lookup: {
                dataSource: { sort: 'category_name', store: { type: 'array', data: [{ id: 2, category_name: 'Category 2' }, { id: 1, category_name: 'Category 1' }] } },
                valueExpr: 'id',
                displayExpr: 'category_name'
            }
        }, { caption: 'Column 2', allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        that.columnHeadersView.render(testElement);

        const cells = testElement.find('.dx-datagrid-filter-row').first().find('td');

        // assert
        assert.equal(cells.length, 2, 'count filter cell');
        assert.ok(!cells.first().find('.dx-editor-with-menu').length, 'first cell with lookup not have menu');
        assert.ok(cells.last().find('.dx-editor-with-menu').length, 'last cell has menu');
    });

    // T104915
    QUnit.test('Filter cell with empty filterOperations in column', function(assert) {
    // arrange
        const that = this;
        const testElement = $('#container');

        $.extend(that.columns, [{
            caption: 'Column 1', allowFiltering: true, filterOperations: []
        }, { caption: 'Column 2', allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        that.columnHeadersView.render(testElement);

        const cells = testElement.find('.dx-datagrid-filter-row').first().find('td');

        // assert
        assert.equal(cells.length, 2, 'count filter cell');
        assert.ok(!cells.first().find('.dx-editor-with-menu').length, 'first cell not have menu');
        assert.ok(cells.last().find('.dx-editor-with-menu').length, 'last cell has menu');
    });

    // T148717
    QUnit.test('Second render filterRow with operation choosers', function(assert) {
    // arrange
        const testElement = $('#container').width(300);

        $.extend(this.columns, [
            { caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] },
            { caption: 'Column 2', allowFiltering: true, filterOperations: ['=', '<>'] },
            { caption: 'Column 3', allowFiltering: true, filterOperations: ['=', '<>'] }
        ]);

        this.columnHeadersView.render(testElement);
        // act
        this.columnHeadersView.render(testElement);

        // assert
        assert.deepEqual(this.columnHeadersView.getColumnWidths(), [100, 100, 100]);
    });

    QUnit.test('Show apply filter button', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.filterRow.applyFilter = 'onClick';
        this.options.filterRow.applyFilterButtonText = 'Apply Filter';
        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        this.headerPanel.render(testElement);

        // assert
        const $button = testElement.find('.dx-apply-button');
        assert.equal($button.length, 1, 'apply button class');

        assert.ok($button.hasClass('dx-state-disabled'), 'button is disabled');
    });

    QUnit.test('Apply filter button is hidden when filter row options is undefined', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.filterRow = null;
        this.options.groupPanel = { visible: true };
        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        this.headerPanel.render(testElement);

        // assert
        const $button = testElement.find('.dx-apply-button');
        assert.equal($button.length, 0, 'apply button class');
    });

    QUnit.test('Apply filter button is hidden when visible of filter row option is false', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.filterRow.visible = false;
        this.options.groupPanel = { visible: true };
        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        this.headerPanel.render(testElement);

        // assert
        const $button = testElement.find('.dx-apply-button');
        assert.equal($button.length, 0, 'apply button class');
    });

    QUnit.test('Apply filter button is hidden when applyFilter mode is \'auto\'', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.filterRow.applyFilter = 'auto';
        this.options.groupPanel = { visible: true };
        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        this.headerPanel.render(testElement);

        // assert
        const $button = testElement.find('.dx-apply-button');
        assert.equal($button.length, 0, 'apply button class');
    });

    QUnit.test('Apply filter button is changed enabled state', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.filterRow.applyFilter = 'onClick';
        $.extend(this.columns, [{ caption: 'Column 1', index: 0, allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        this.applyFilterController.init();
        this.headerPanel.render(testElement);
        this.columnHeadersView.render(testElement);

        const filterRowInput = $(this.columnHeadersView.element()).find('.dx-texteditor');
        filterRowInput.find('input').val(90);
        filterRowInput.find('input').trigger('keyup');
        this.clock.tick(10);

        const $button = testElement.find('.dx-apply-button');
        assert.ok(!$button.hasClass('dx-state-disabled'), 'button is enabled');
    });

    QUnit.test('Set highlight when filter operation is changed', function(assert) {
    // arrange
        const testElement = $('#container');
        let isHighLight;

        this.options.filterRow.applyFilter = 'onClick';
        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], initialIndex: 0 }, { caption: 'Column 2', allowFiltering: true, initialIndex: 1 }, { caption: 'Column 3', initialIndex: 2 }]);

        // act
        this.applyFilterController.setHighLight = function() {
            isHighLight = true;
        };

        this.applyFilterController.init();
        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu');
        const rootMenuItem = filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');
        const filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        $(filterMenuItems.find('.dx-menu-item')[1]).trigger('dxclick');

        assert.ok(isHighLight);
    });


    QUnit.test('Apply filter button is changed enabled state when filter operation is changed', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.filterRow.applyFilter = 'onClick';
        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], initialIndex: 0 }, { caption: 'Column 2', allowFiltering: true, initialIndex: 1 }, { caption: 'Column 3', initialIndex: 2 }]);

        // act
        this.applyFilterController.init();
        this.columnHeadersView.render(testElement);

        const filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        $(filterMenuItems.find('.dx-menu-item')[1]).trigger('dxclick');

        const $button = testElement.find('.dx-apply-button');
        assert.ok(!$button.hasClass('dx-state-disabled'), 'button is enabled');
    });

    QUnit.test('Column option is changed when filter operation is changed', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.filterRow.applyFilter = 'onClick';
        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], index: 0 }, { caption: 'Column 2', allowFiltering: true, index: 1 }, { caption: 'Column 3', index: 2 }]);

        // act
        this.applyFilterController.init();
        this.columnHeadersView.render(testElement);

        const filterMenu = $(this.columnHeadersView.element()).find('.dx-menu');
        const rootMenuItem = filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');
        const filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        $(filterMenuItems.find('.dx-menu-item')[1]).trigger('dxclick');

        assert.deepEqual(this.columnsController.updateOptions[0], {
            columnIndex: 0,
            optionName: { 'bufferedSelectedFilterOperation': '<>' },
            optionValue: undefined
        });
    });

    QUnit.test('Header panel is not visible when apply filter button should not to be visible', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.filterRow.applyFilter = 'auto';
        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        this.headerPanel.render(testElement);

        // assert
        const $headerPanel = testElement.find('.dx-datagrid-header-panel');
        assert.equal($headerPanel.length, 0, 'apply button class');
    });

    QUnit.test('Set highlight to editor container when filter is changed', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.filterRow.applyFilter = 'onClick';
        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], index: 0 }]);

        // act
        this.applyFilterController.init();
        this.columnHeadersView.render(testElement);

        const filterRowInput = $(this.columnHeadersView.element()).find('.dx-texteditor');
        filterRowInput.find('input').val(90);
        filterRowInput.find('input').trigger('keyup');
        this.clock.tick(10);

        const $editorContainer = filterRowInput.closest('.dx-editor-container');
        const $filterCellContainer = filterRowInput.closest('.dx-editor-cell');
        assert.ok($editorContainer.hasClass('dx-highlight-outline'), 'highlight for editor container');
        assert.ok($filterCellContainer.hasClass('dx-filter-modified'), 'highlight for editor container');
        assert.deepEqual(this.columnsController.updateOptions[0], {
            columnIndex: 0,
            optionName: 'bufferedFilterValue',
            optionValue: '90'
        });
    });

    QUnit.test('Remove highlights from editor container when filter is applied', function(assert) {
    // arrange
        const testElement = $('#container');
        let $button;

        this.options.filterRow.applyFilter = 'onClick';
        $.extend(this.columns, [{ caption: 'Column 1', index: 0, allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        this.applyFilterController.init();
        this.columnHeadersView.render(testElement);
        this.headerPanel.render(testElement);

        const filterRowInput = $(this.columnHeadersView.element()).find('.dx-texteditor');
        filterRowInput.find('input').val(90);
        filterRowInput.find('input').trigger('keyup');
        this.clock.tick(10);

        $button = testElement.find('.dx-apply-button');
        $($button).trigger('dxclick');

        $button = testElement.find('.dx-apply-button');
        const $editorContainer = $(this.columnHeadersView.element().find('.dx-highlight-outline'));
        assert.equal($editorContainer.length, 0, 'highlights');
        const $filterCellContainer = $(this.columnHeadersView.element().find('.dx-filter-modified'));
        assert.equal($filterCellContainer.length, 0, 'highlights');
        assert.ok($button.hasClass('dx-state-disabled'), 'button is enabled');
        // assert.ok(this.dataController._isFilterApplied, "is filter applied");

        assert.deepEqual(this.columnsController.updateOptions, [{
            'columnIndex': 0,
            'optionName': 'bufferedFilterValue',
            'optionValue': '90'
        }, {
            'columnIndex': 0,
            'optionName': 'filterValue',
            'optionValue': '90'
        }], 'columns updated options');
    });

    QUnit.test('Set zero timeout for editor', function(assert) {
    // arrange
        const testElement = $('#container');
        let timeout;

        this.options.filterRow.applyFilter = 'onClick';
        this.options.onEditorPreparing = function(options) {
            timeout = options.updateValueTimeout;
        };
        this.editorFactoryController.init();
        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        this.columnHeadersView.render(testElement);

        // assert
        assert.equal(timeout, 0);
    });

    QUnit.test('Show apply button when applyFilter option is changed', function(assert) {
    // arrange
        const testElement = $('#container');
        let $button;

        this.options.filterRow.applyFilter = 'auto';
        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        this.headerPanel.render(testElement);

        // assert
        $button = testElement.find('.dx-apply-button');
        assert.equal($button.length, 0, 'apply button class');

        // act
        this.options.filterRow.applyFilter = 'onClick';
        this.headerPanel.component.isReady = function() {
            return true;
        };
        this.headerPanel.beginUpdate();
        this.headerPanel.optionChanged({ name: 'filterRow' });
        this.headerPanel.endUpdate();

        // assert
        $button = testElement.find('.dx-apply-button');
        assert.equal($button.length, 1, 'apply button class');
    });

    QUnit.test('Hide apply button when applyFilter option is changed', function(assert) {
    // arrange
        const testElement = $('#container');

        this.options.filterRow.applyFilter = 'onClick';
        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'] }]);

        // act
        this.headerPanel.isVisible = function() {
            return true;
        };
        this.headerPanel.render(testElement);

        // act
        this.options.filterRow.applyFilter = 'auto';
        this.headerPanel.component.isReady = function() {
            return true;
        };
        this.headerPanel.beginUpdate();
        this.headerPanel.optionChanged({ name: 'filterRow' });
        this.headerPanel.endUpdate();

        // assert
        const $button = testElement.find('.dx-apply-button');
        assert.equal($button.length, 0, 'apply button class');
    });

    QUnit.test('Filter row with headers when set option onCellPrepared', function(assert) {
    // arrange
        const testElement = $('#container');
        let resultOptions;
        let countCallCellPrepared = 0;

        $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' },
            { caption: 'Column 4' }, { caption: 'Column 5' }]);

        this.options.showColumnHeaders = true;
        this.options.onCellPrepared = function(options) {
            countCallCellPrepared++;
            if(options.rowType === 'filter' && options.columnIndex === 2) {
                resultOptions = options;
            }
        };

        this.columnHeadersView.init();

        // act
        this.columnHeadersView.render(testElement);

        // assert
        assert.equal(countCallCellPrepared, 10, 'countCallCellPrepared');
        assert.equal(resultOptions.columnIndex, 2, 'columnIndex');
        assert.strictEqual(resultOptions.rowType, 'filter', 'rowType');
        assert.deepEqual(resultOptions.column, { caption: 'Column 3' }, 'column');
    });

    QUnit.test('Filter row with headers when set option onRowPrepared', function(assert) {
    // arrange
        const testElement = $('#container');
        let resultOptions;
        let countCallRowPrepared = 0;

        $.extend(this.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' },
            { caption: 'Column 4' }, { caption: 'Column 5' }]);

        this.options.showColumnHeaders = true;
        this.options.onRowPrepared = function(options) {
            countCallRowPrepared++;
            if(options.rowType === 'filter') {
                resultOptions = options;
            }
        };

        this.columnHeadersView.init();

        // act
        this.columnHeadersView.render(testElement);

        // assert
        assert.equal(countCallRowPrepared, 2, 'countCallRowPrepared');
        assert.strictEqual(resultOptions.rowType, 'filter', 'rowType');
        assert.deepEqual(resultOptions.columns, [{ caption: 'Column 1' }, { caption: 'Column 2' }, { caption: 'Column 3' }, { caption: 'Column 4' }, { caption: 'Column 5' }], 'columns');
    });

    // T480331
    QUnit.test('State of the \'Apply filter\' button should be saved after repaint', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.options.filterRow.applyFilter = 'onClick';
        $.extend(this.columns, [{ caption: 'Column 1', index: 0, allowFiltering: true, filterOperations: ['=', '<>'] }]);

        this.applyFilterController.init();
        this.headerPanel.render($testElement);
        this.columnHeadersView.render($testElement);

        const filterRowInput = $testElement.find('.dx-datagrid-filter-row .dx-texteditor input').first();
        filterRowInput.val(90);
        filterRowInput.trigger('keyup');
        this.clock.tick(10);

        // act
        this.headerPanel.render();

        // assert
        const $button = $testElement.find('.dx-apply-button');
        assert.notOk($button.hasClass('dx-state-disabled'), 'button is enabled');
    });

    QUnit.testInActiveWindow('Title is not appended for menu item of filter row', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.columns, [{
            caption: 'Column 1',
            allowFiltering: true,
            filterOperations: ['=', '<>']
        }]);

        this.options.cellHintEnabled = true;
        this.options.filterRow.operationDescriptions = {
            'equal': 'test equals',
            'notEqual': 'test not equals'
        };

        // act
        this.columnHeadersView.render(testElement);

        const $filterMenu = $('.dx-filter-menu').first();

        $filterMenu.trigger('focusin');
        this.clock.tick(10);

        const $rootMenuItem = $filterMenu.find('.dx-menu-item');
        $rootMenuItem.trigger('mouseenter');

        $filterMenu.trigger('mousemove');

        // assert
        assert.equal($filterMenu.attr('title'), undefined, 'title of menu item');
    });

    // T688843
    QUnit.test('The filter menu should be rendered correctly when specified headerCellTemplate', function(assert) {
    // arrange
        const $testElement = $('#container');

        $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, filterOperations: ['=', '<>'], headerCellTemplate: function() {} }]);

        // act
        this.columnHeadersView.render($testElement);

        // assert
        const $firstCell = $(this.columnHeadersView.element()).find('.dx-datagrid-filter-row').children().first();
        assert.ok($firstCell.children().first().hasClass('dx-editor-with-menu'), 'editor with menu');
    });

    // T904124
    [true, false].forEach(rtlEnabled => {
        const textAlign = rtlEnabled ? 'right' : 'start';
        QUnit.test(`input's textAlign should be ${textAlign} if column's alignment is 'center' (rtlEnabled=${rtlEnabled})`, function(assert) {
            // arrange
            const $testElement = $('#container');

            $.extend(this.columns, [{ caption: 'Column 1', allowFiltering: true, alignment: 'center' }]);
            this.options.rtlEnabled = rtlEnabled;
            // act
            this.columnHeadersView.render($testElement);

            // assert
            assert.equal($testElement.find(TEXTEDITOR_INPUT_SELECTOR).css('textAlign'), textAlign, 'text align');
        });
    });
});

QUnit.module('Filter Row with real dataController and columnsController', {
    beforeEach: function() {
        this.$element = () => $('#container');
        this.gridContainer = $('#container > .dx-datagrid');

        this.items = [
            { name: 'Alex', age: 15 },
            { name: 'Dan', age: 16 },
            { name: 'Vadim', age: 17 },
            { name: 'Dmitry', age: 18 },
            { name: 'Sergey', age: 18 },
            { name: 'Kate', age: 20 },
            { name: 'Dan', age: 21 }
        ];

        this.options = {
            filterRow: {
                visible: true,
                showOperationChooser: true,
                showAllText: '(All)',
                operationDescriptions: {
                    'equal': 'Equals',
                    'notEqual': 'Not equals',
                    'lessThan': 'Less',
                    'lessThanOrEqual': 'Less or equals',
                    'greaterThan': 'Greater',
                    'greaterThanOrEqual': 'Greater or equals',
                    'startsWith': 'Starts with',
                    'contains': 'Contains',
                    'notContains': 'Not contains',
                    'endsWith': 'Ends with',
                    'between': 'Between'
                },
                resetOperationText: 'Reset'
            },
            columns: ['name', 'age'],
            dataSource: {
                asyncLoadEnabled: false,
                store: this.items
            }
        };

        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.dispose();
        this.clock.restore();
        fx.off = false;
    }
}, () => {

    function getFilterMenuItem($columnHeadersView, index) {
        const filterMenu = $columnHeadersView.find('.dx-menu').first();
        const rootMenuItem = filterMenu.find('.dx-menu-item');

        $(rootMenuItem).trigger('dxclick');
        const filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content.dx-datagrid').first().find('li');
        return filterMenuItems.find('.dx-menu-item').eq(index);
    }

    // T104040
    QUnit.test('Not apply filter when changed filter operation with empty filter value', function(assert) {
    // arrange
        const that = this;
        const testElement = $('#container');
        let countApplyFilter = 0;

        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        that.dataController._applyFilter = function() {
            countApplyFilter++;
        };

        that.columnHeadersView.render(testElement);

        const filterRowInput = testElement.find('input').first();
        const filterMenu = that.columnHeadersView.element().find('.dx-menu');
        const rootMenuItem = filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');
        const filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        // act
        filterRowInput.val('test');
        filterRowInput.trigger('change');

        // assert
        assert.equal(countApplyFilter, 1, 'apply filter');

        // act
        filterMenuItems.find('.dx-menu-item').last().trigger('dxclick'); // reset filter

        // assert
        assert.equal(filterRowInput.val(), '', 'input value');
        assert.equal(countApplyFilter, 2, 'apply filter');

        // act
        filterMenuItems.find('.dx-menu-item').first().trigger('dxclick'); // contains filter operation

        // assert
        assert.equal(countApplyFilter, 2, 'not apply filter');
    });

    QUnit.test('Return to selectedFilterOperation when reset is chosen', function(assert) {
    // arrange
        const testElement = $('#container');

        $.extend(this.options.columns, [{
            caption: 'Column 1',
            allowFiltering: true,
            selectedFilterOperation: '<>',
            initialIndex: 0
        },
        {
            caption: 'Column 2',
            allowFiltering: true,
            initialIndex: 1
        },
        {
            caption: 'Column 3',
            initialIndex: 2
        }]);

        $.each(this.options.columns, function(index, column) {
            column.dataType = 'string';
        });

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        this.columnHeadersView.render(testElement);
        const $columnHeadersView = $(this.columnHeadersView.element());

        getFilterMenuItem($columnHeadersView, 3).trigger('dxclick'); // startswith

        getFilterMenuItem($columnHeadersView, 6).trigger('dxclick'); // reset

        // assert
        assert.ok(getFilterMenuItem($columnHeadersView, 5).hasClass('dx-menu-item-selected'));
        assert.equal(getFilterMenuItem($columnHeadersView, 5).find('.dx-menu-item-text').text(), 'Not equals');
    });

    QUnit.testInActiveWindow('Filter row with menu: focus behavior', function(assert) {
    // arrange
        const $testElement = $('#container');

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        this.columnHeadersView.render($testElement);

        const $filterMenu = $(this.columnHeadersView.element().find('.dx-menu').first());

        $filterMenu
            .parent()
            .find('input')
            .focus();

        this.clock.tick(10);
        assert.ok($filterMenu.parent().find('input').is(':focus'), 'filter input is focused');

        const rootMenuItem = $filterMenu.find('.dx-menu-item').eq(0);

        $(rootMenuItem).trigger('dxclick');

        const filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');

        assert.ok(filterMenuItems.length, 'items were found');

        filterMenuItems
            .eq(2)
            .find('.dx-menu-item')
            .trigger('dxclick');

        this.clock.tick(10);

        assert.ok($filterMenu.parent().find('input').is(':focus'), 'filter input is focused');
    });

    // T189448
    QUnit.test('Filter row - focus editor', function(assert) {
    // arrange
        const that = this;

        that.gridContainer.addClass('dx-datagrid-borders');

        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        that.columnHeadersView.render(that.gridContainer);

        // act
        that.editorFactoryController.focus(that.gridContainer.find('td').first());
        that.clock.tick(10);

        assert.roughEqual(that.gridContainer.find('.dx-datagrid-focus-overlay').outerHeight(), that.gridContainer.find('td').first().outerHeight(), 1.01, 'height focus overlay');
    });

    QUnit.test('Filter row with menu for number column', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        that.columnHeadersView.render($testElement);

        const $filterMenu = $testElement.find('.dx-menu').last();

        // assert
        assert.equal($filterMenu.length, 1, 'has menu');

        // act
        const rootMenuItem = $filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');

        // assert
        assert.ok(!!$('#qunit-fixture').find('.dx-menu-item:contains(\'Between\')').length, 'has filter range operation');
    });

    QUnit.test('Filter row with menu for date column', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns.push({ caption: 'Date', dataType: 'date' });
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        that.columnHeadersView.render($testElement);

        const $filterMenu = $testElement.find('.dx-menu').last();

        // assert
        assert.equal($filterMenu.length, 1, 'has menu');

        // act
        const rootMenuItem = $filterMenu.find('.dx-menu-item');
        $(rootMenuItem).trigger('dxclick');

        // assert
        assert.ok(!!$('#qunit-fixture').find('.dx-menu-item:contains(\'Between\')').length, 'has filter range operation');
    });

    // T428602
    QUnit.test('Date column - select filter operation via api', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns.push({ caption: 'Date', dataType: 'date', allowFiltering: true });
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        that.columnHeadersView.render($testElement);

        // act
        that.columnOption(2, 'selectedFilterOperation', 'between');

        // assert
        assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');
        assert.equal($('.dx-viewport').children('.dx-datagrid-filter-range-overlay').length, 0, 'no overlay wrapper');
    });

    // T619045
    QUnit.test('Overlay of between operation does not hide after scroll event', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container');

        that.options.columns.push({ caption: 'Date', dataType: 'date', allowFiltering: true });
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'gridView', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        that.gridView._resizingController.updateDimensions = function() { };
        that.columnHeadersView.render($testElement);

        // act
        const $filterMenu = $testElement.find('.dx-menu').last();

        // assert
        assert.equal($filterMenu.length, 1, 'has menu');

        // arrange
        const $menuItem = $filterMenu.find('.dx-menu-item');
        $($menuItem).trigger('dxclick'); // show menu
        $('#qunit-fixture').find('.dx-menu-item:contains(\'Between\')').trigger('dxclick'); // select filter operation is 'between'

        // assert
        assert.equal($('.dx-viewport').children('.dx-datagrid-filter-range-overlay').length, 1, 'has overlay wrapper');

        // arrange
        $('.dx-viewport').find('.dx-filter-range-content').trigger('scroll');

        // assert
        assert.equal($('.dx-viewport').children('.dx-datagrid-filter-range-overlay').length, 1, 'has overlay wrapper');
    });

    // T428602
    QUnit.test('Date column - select filter operation via menu', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns.push({ caption: 'Date', dataType: 'date', allowFiltering: true });
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });
        that.columnHeadersView.render($testElement);

        const $filterMenu = $testElement.find('.dx-menu').last();

        // assert
        assert.equal($filterMenu.length, 1, 'has menu');

        // arrange
        const $menuItem = $filterMenu.find('.dx-menu-item');
        $($menuItem).trigger('dxclick'); // show menu
        $('#qunit-fixture').find('.dx-menu-item:contains(\'Between\')').trigger('dxclick'); // select filter operation is 'between'

        // assert
        assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');
        assert.equal($('.dx-viewport').children('.dx-datagrid-filter-range-overlay').length, 1, 'has overlay wrapper');
    });

    QUnit.test('Show filter range popup when column with selectedFilterOperation is \'isBetween\'', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns[1] = { dataField: 'age', selectedFilterOperation: 'between' };
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        that.columnHeadersView.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');

        // act
        $($testElement.find('td').last().find('.dx-filter-range-content')).trigger('focusin');
        that.clock.tick(10);

        // assert
        assert.equal($('.dx-viewport').children('.dx-datagrid-filter-range-overlay').length, 1, 'has overlay wrapper');
        assert.equal($('.dx-viewport').children('.dx-datagrid-filter-range-overlay').find('.dx-numberbox').length, 2, 'count number box');
    });

    QUnit.test('Show filter range popup when column with selectedFilterOperation is \'isBetween\' and filter value is array', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns[1] = { dataField: 'age', selectedFilterOperation: 'between', filterValue: [15, 18] };
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        that.columnHeadersView.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');
        assert.strictEqual($testElement.find('.dx-filter-range-content').text(), '15 - 18', 'filter range value');

        // act
        $($testElement.find('td').last().find('.dx-filter-range-content')).trigger('focusin');
        that.clock.tick(10);

        // assert
        const $startRange = $('.dx-viewport').children('.dx-datagrid-filter-range-overlay').find('.dx-numberbox').first();
        const $endRange = $('.dx-viewport').children('.dx-datagrid-filter-range-overlay').find('.dx-numberbox').last();
        assert.equal($startRange.length, 1, 'has number box');
        assert.equal($endRange.length, 1, 'has number box');
        assert.strictEqual($startRange.find('input').val(), '15', 'value of the first editor');
        assert.strictEqual($endRange.find('input').val(), '18', 'value of the second editor');
    });

    QUnit.test('Not calculated filter expression when range not has a start value', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns[1] = { dataField: 'age', selectedFilterOperation: 'between', filterValue: [undefined, 18] };
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        that.columnHeadersView.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');
        assert.strictEqual($testElement.find('.dx-filter-range-content').text(), ' - 18', 'filter range value');
        assert.ok(!that.getCombinedFilter(), 'not has filter');
    });

    QUnit.test('Not calculated filter expression when range not has a end value', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns[1] = { dataField: 'age', selectedFilterOperation: 'between', filterValue: [15, undefined] };
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        that.columnHeadersView.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');
        assert.strictEqual($testElement.find('.dx-filter-range-content').text(), '15', 'filter range value');
        assert.ok(!that.getCombinedFilter(), 'not has filter');
    });

    QUnit.test('Calculated filter expression when range has start value and end value', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns[1] = { dataField: 'age', selectedFilterOperation: 'between', filterValue: [15, 18] };
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        that.columnHeadersView.render($testElement);

        // assert
        const filter = that.getCombinedFilter();
        assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');
        assert.strictEqual($testElement.find('.dx-filter-range-content').text(), '15 - 18', 'filter range value');
        assert.equal(filter.length, 3, 'has filter');
        assert.strictEqual(filter[0][1], '>=', 'selectedFilterOperation of the first filter');
        assert.equal(filter[0][2], 15, 'value of the first filter');
        assert.strictEqual(filter[1], 'and');
        assert.strictEqual(filter[2][1], '<=', 'selectedFilterOperation of the second filter');
        assert.equal(filter[2][2], 18, 'value of the second filter');
    });

    // T312151
    QUnit.test('Reset filter range when selectedFilterOperation is \'between\'', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns[1] = { dataField: 'age', selectedFilterOperation: 'between', filterValue: [100, 200] };
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        that.columnHeadersView.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');
        assert.strictEqual($testElement.find('.dx-filter-range-content').text(), '100 - 200', 'filter range value');

        // act
        that.columnOption('age', 'filterValue', undefined);

        // assert
        assert.strictEqual($testElement.find('.dx-filter-range-content').html(), '&nbsp;', 'filter range value');
    });

    // T325295
    QUnit.test('Reset filter range when changed selectedFilterOperation', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns[1] = { dataField: 'age', selectedFilterOperation: 'between', filterValue: [100, 200] };
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        that.columnHeadersView.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');
        assert.strictEqual($testElement.find('.dx-filter-range-content').text(), '100 - 200', 'filter range value');

        // arrange
        const $filterMenu = $testElement.find('.dx-menu').last();
        const $rootMenuItem = $filterMenu.find('.dx-menu-item');
        $($rootMenuItem).trigger('dxclick'); // show operation chooser

        // act
        const $filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');
        $($filterMenuItems.find('.dx-menu-item')[0]).trigger('dxclick'); // change selectedFilterOperation on '='

        // assert
        const column = that.columnsController.getVisibleColumns()[1];
        assert.strictEqual(column.selectedFilterOperation, '=', 'selected filter operation');
        assert.strictEqual($testElement.find('input').last().val(), '', 'text of the cell');
        assert.strictEqual(column.filterValue, null, 'filter value of the column');
    });

    // T325295
    QUnit.test('Reset filter value when changed selectedFilterOperation on \'between\'', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns[1] = { dataField: 'age', selectedFilterOperation: '=', filterValue: 100 };
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        that.columnHeadersView.render($testElement);

        // assert
        assert.strictEqual($testElement.find('input').last().val(), '100', 'filter value');

        // arrange
        const $filterMenu = $testElement.find('.dx-menu').last();
        const $rootMenuItem = $filterMenu.find('.dx-menu-item');
        $($rootMenuItem).trigger('dxclick'); // show operation chooser

        // act
        const $filterMenuItems = $('#qunit-fixture').find('.dx-overlay-content').first().find('li');
        $($filterMenuItems.find('.dx-menu-item')[6]).trigger('dxclick'); // change selectedFilterOperation on 'between'

        // assert
        const column = that.columnsController.getVisibleColumns()[1];
        assert.strictEqual(column.selectedFilterOperation, 'between', 'selected filter operation');
        assert.strictEqual($('.dx-viewport').children('.dx-datagrid-filter-range-overlay').find('input').eq(0).val(), '', 'start value of the range');
        assert.strictEqual(column.filterValue, null, 'filter value of the column');
    });

    // T306826
    QUnit.test('Apply filter by range when entering the filter value quickly', function(assert) {
        // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns[1] = { dataField: 'age', selectedFilterOperation: 'between' };
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        that.columnHeadersView.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');

        // arrange
        $($testElement.find('td').last().find('.dx-filter-range-content')).trigger('focusin');
        that.clock.tick(10);

        // assert
        const $startRangeInput = $('.dx-viewport').children('.dx-datagrid-filter-range-overlay').find('.dx-numberbox').first().find(TEXTEDITOR_INPUT_SELECTOR);
        assert.equal($startRangeInput.length, 1, 'has input');
        const $endRangeInput = $('.dx-viewport').children('.dx-datagrid-filter-range-overlay').find('.dx-numberbox').last().find(TEXTEDITOR_INPUT_SELECTOR);
        assert.equal($endRangeInput.length, 1, 'has input');

        // act
        $startRangeInput.val(17);
        $($startRangeInput).trigger('change');
        $endRangeInput.val(18);
        $($endRangeInput).trigger('change');
        that.clock.tick(750);

        // assert
        assert.strictEqual($startRangeInput.val(), '17', 'start value of the range');
        assert.strictEqual($endRangeInput.val(), '18', 'end value of the range');
        assert.equal(that.dataController.items().length, 3, 'count items');
        const filter = that.getCombinedFilter();
        assert.equal(filter.length, 3, 'has filter');
        assert.strictEqual(filter[0][1], '>=', 'selectedFilterOperation of the first filter');
        assert.equal(filter[0][2], 17, 'value of the first filter');
        assert.strictEqual(filter[1], 'and');
        assert.strictEqual(filter[2][1], '<=', 'selectedFilterOperation of the second filter');
        assert.equal(filter[2][2], 18, 'value of the second filter');
    });

    // T1013123
    QUnit.test('changed event should be fired once on entering filter by range', function(assert) {
        // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns[1] = { dataField: 'age', selectedFilterOperation: 'between' };
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        that.columnHeadersView.render($testElement);

        $($testElement.find('td').last().find('.dx-filter-range-content')).trigger('focusin');
        that.clock.tick(10);

        const $startRangeInput = $('.dx-viewport').children('.dx-datagrid-filter-range-overlay').find('.dx-numberbox').first().find(TEXTEDITOR_INPUT_SELECTOR);
        assert.equal($startRangeInput.length, 1, 'has input');
        const $endRangeInput = $('.dx-viewport').children('.dx-datagrid-filter-range-overlay').find('.dx-numberbox').last().find(TEXTEDITOR_INPUT_SELECTOR);
        assert.equal($endRangeInput.length, 1, 'has input');

        const changedSpy = sinon.spy();
        that.dataController.changed.add(changedSpy);

        // act
        $startRangeInput.val(17);
        $($startRangeInput).trigger('change');
        $endRangeInput.val(18);
        $($endRangeInput).trigger('change');
        that.clock.tick(750);

        // assert
        assert.strictEqual(changedSpy.callCount, 1, 'changed is called once');
        assert.ok(that.getCombinedFilter(), 'has filter');
    });

    // T318603
    QUnit.test('filter by 0 value for number column', function(assert) {
    // arrange
        const that = this;
        const testElement = $('#container');
        let $filterRowInput;
        let countApplyFilter = 0;

        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        that.dataController._applyFilter = function() {
            countApplyFilter++;
        };

        that.columnHeadersView.render(testElement);

        $filterRowInput = testElement.find(TEXTEDITOR_INPUT_SELECTOR).eq(1);

        // act
        $filterRowInput.val('0');
        $($filterRowInput).trigger('change');

        $filterRowInput = testElement.find(TEXTEDITOR_INPUT_SELECTOR).eq(1);

        // assert
        assert.equal(countApplyFilter, 1, 'applyFilter called once');
        assert.strictEqual(that.columnsController.columnOption(1, 'filterValue'), 0, 'filterValue is changed to 0');
        assert.equal($filterRowInput.val(), '0', 'input value');
    });

    // T386403
    QUnit.test('buffered filter is not applied on refresh when applyFilter mode is onClick', function(assert) {
    // arrange
        const that = this;
        const testElement = $('#container');
        let $filterRowInput;
        let countApplyFilter = 0;

        this.options.filterRow.applyFilter = 'onClick';

        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory', 'headerPanel'], {
            initViews: true
        });

        that.dataController._applyFilter = function() {
            countApplyFilter++;
        };

        that.headerPanel.render(testElement);
        that.columnHeadersView.render(testElement);

        $filterRowInput = testElement.find(TEXTEDITOR_INPUT_SELECTOR).eq(1);

        // act
        $filterRowInput.val('1');
        $($filterRowInput).trigger('change');

        that.dataController.refresh();

        $filterRowInput = testElement.find('input').eq(1);

        // assert
        assert.equal(countApplyFilter, 0, 'applyFilter called once');
        assert.strictEqual(that.columnsController.columnOption(1, 'bufferedFilterValue'), 1, 'bufferedFilterValue is changed to 1');
        assert.strictEqual(that.columnsController.columnOption(1, 'filterValue'), undefined, 'filterValue is not changed');
        assert.strictEqual(that.dataController.getCombinedFilter(), undefined, 'combinedFilter does not exist');

        // act
        const $button = testElement.find('.dx-apply-button');
        $($button).trigger('dxclick');

        // assert
        assert.equal(countApplyFilter, 1, 'applyFilter called once');
        assert.strictEqual(that.columnsController.columnOption(1, 'bufferedFilterValue'), undefined, 'bufferedFilterValue is changed to undefined');
        assert.strictEqual(that.columnsController.columnOption(1, 'filterValue'), 1, 'filterValue is changed to 1');
        assert.deepEqual(that.dataController.getCombinedFilter().length, 3, 'combinedFilter exists');
        assert.equal(that.dataController.getCombinedFilter()[1], '=', 'combinedFilter operator');
        assert.equal(that.dataController.getCombinedFilter()[2], 1, 'combinedFilter value');
        assert.equal(testElement.find(TEXTEDITOR_INPUT_SELECTOR).eq(1).val(), '1', 'input value');
    });

    // T429643
    QUnit.test('Filter by range when column with customizeText and filter value is array', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns[2] = {
            dataField: 'birthday', dataType: 'date', selectedFilterOperation: 'between', filterValue: [new Date(1992, 7, 6), new Date(1992, 7, 8)], customizeText: function(cellInfo) {
                if(cellInfo.target === 'filterRow') {
                    cellInfo.valueText = cellInfo.value.getDate() + '/' + cellInfo.value.getMonth();
                }

                return cellInfo.valueText;
            }
        };

        that.options.dataSource.store = [
            { name: 'Alex', age: 15, birthday: new Date(1992, 7, 6) },
            { name: 'Dan', age: 16, birthday: new Date(1991, 10, 21) },
            { name: 'Vadim', age: 17, birthday: new Date(1997, 2, 6) }
        ];

        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        that.columnHeadersView.render($testElement);

        // assert
        assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');
        assert.strictEqual($testElement.find('.dx-filter-range-content').text(), '6/7 - 8/7', 'filter range value');
        assert.equal(that.dataController.items().length, 1, 'count item');
    });

    // T663887
    QUnit.test('Filter by range when column with calculateCellValue and filter value is array', function(assert) {
        this.options.columns = [{
            dataType: 'date',
            selectedFilterOperation: 'between',
            allowFiltering: true,
            filterValue: [new Date(1992, 7, 6), new Date(1992, 7, 8)],
            calculateCellValue: function(data) {
                return new Date(data.OrderDate);
            }
        }];

        setupDataGridModules(this, ['data', 'columns', 'filterRow'], {
            initViews: true
        });

        // act
        const filter = this.dataController.getCombinedFilter();

        // assert
        assert.equal(filter.length, 3, 'has filter range content');
        assert.equal(typeof filter[0][0], 'function', 'has selector');
        assert.equal(typeof filter[2][0], 'function', 'has selector');
    });

    QUnit.test('Rows view is not rendered when value is entered to editor of the filter row (applyFilter mode is onClick)', function(assert) {
    // arrange
        const $testElement = $('#container');
        let isRowsRendered;

        this.options.filterRow.applyFilter = 'onClick';
        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'rows', 'headerPanel', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        this.columnHeadersView.render($testElement);
        this.rowsView.render($testElement);

        this.rowsView._renderCore = function() {
            isRowsRendered = true;
        };
        const $input = $('.dx-datagrid-filter-row input').first();
        $input.val('test value');
        $($input).trigger('keyup');

        this.clock.tick(700);

        // assert
        assert.ok(!isRowsRendered, 'items of rows view is not rendered');
    });

    QUnit.test('Reset an invalid value of filter row for the DateBox editor', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.items = [
            { date: new Date() }
        ];

        this.options.columns = [{ dataField: 'date', dataType: 'date' }];
        // T528529
        this.options.filterRow.resetOperationText = 'My Reset';

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        // act
        this.columnHeadersView.render($testElement);

        const $input = $('.dx-datebox input');
        $input.val('test');
        $input.change();

        const $resetMenuItem = $(getFilterMenuItem(this.columnHeadersView.element(), 7));

        $($resetMenuItem).trigger('dxclick'); // reset

        // assert
        assert.equal($resetMenuItem.text(), 'My Reset');
        const dateBox = $('.dx-datebox').dxDateBox('instance');
        assert.ok(!dateBox.option('text'), 'text option');
        assert.ok(dateBox.option('isValid'), 'isValid option');
    });

    // T502318
    QUnit.test('There are no errors on repaint a filter row when filter range popup is visible', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.columns[1] = { dataField: 'age', selectedFilterOperation: 'between' };
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });

        that.columnHeadersView.render($testElement);

        $($testElement.find('td').last().find('.dx-filter-range-content')).trigger('focusin');
        that.clock.tick(10);

        // assert
        assert.equal($('.dx-viewport').children('.dx-datagrid-filter-range-overlay').length, 1, 'has overlay wrapper');

        // act
        that.columnHeadersView.render($testElement);
        that.columnHeadersView.resize();

        // assert
        assert.equal($('.dx-viewport').children('.dx-datagrid-filter-range-overlay').length, 0, 'hasn\'t overlay wrapper');
    });

    QUnit.test('Add custom tabIndex to filter range content', function(assert) {
    // arrange
        const that = this;
        const $testElement = $('#container').addClass('dx-datagrid-borders');

        that.options.tabIndex = 3;
        that.options.columns.push({ caption: 'Date', dataType: 'date', allowFiltering: true });
        setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });
        that.columnHeadersView.render($testElement);

        const $filterMenu = $testElement.find('.dx-menu').last();

        const $menuItem = $filterMenu.find('.dx-menu-item');
        $($menuItem).trigger('dxclick');
        $('.dx-menu-item').filter(':contains(\'Between\')').trigger('dxclick');

        const $filterRangeContent = $('.dx-filter-range-content');

        // assert
        assert.equal($filterRangeContent.attr('tabIndex'), '3', 'tabIndex of filter range content');
    });

    ['repaint', 'reshape', 'full'].forEach((refreshMode) => {
        [true, false].forEach((hasLookupOptimization) => {
            QUnit.test(`Lookup select box should show only relevant values, lookup optimization = ${hasLookupOptimization}, refreshMode = ${refreshMode}`, function(assert) {
            // arrange
                const $testElement = $('#container');

                this.options.columns = [{
                    dataField: 'column1',
                    allowFiltering: true,
                    lookup: {
                        dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                        valueExpr: 'id',
                        displayExpr: 'value'
                    }
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
                this.options.editing = {
                    refreshMode
                };

                setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
                    initViews: true
                });
                this.columnHeadersView.render($testElement);

                // act
                const dropDown1 = $('.dx-dropdowneditor-button').eq(0);
                const dropDown2 = $('.dx-dropdowneditor-button').eq(1);

                dropDown1.trigger('dxclick');
                dropDown2.trigger('dxclick');

                // assert
                const dropDownList1 = $('.dx-list').eq(0);
                const dropDownList2 = $('.dx-list').eq(1);

                assert.strictEqual(dropDownList1.find('.dx-item').length, 3);
                assert.strictEqual(dropDownList1.find('.dx-item').eq(1).text(), 'value1');
                assert.strictEqual(dropDownList1.find('.dx-item').eq(2).text(), 'value2');

                assert.strictEqual(dropDownList2.find('.dx-item').length, 3);
                assert.strictEqual(dropDownList2.find('.dx-item').eq(1).text(), 'value1');
                assert.strictEqual(dropDownList2.find('.dx-item').eq(2).text(), 'value2');

                // act
                dropDownList1.find('.dx-item').eq(1).trigger('dxclick');

                // assert
                assert.strictEqual(dropDownList2.find('.dx-item').length, 2);
                assert.strictEqual(dropDownList2.find('.dx-item').eq(1).text(), 'value1');
            });

            QUnit.test(`Lookup select box should show only relevant values after initialization, lookup optimization = ${hasLookupOptimization}, refreshMode = ${refreshMode}`, function(assert) {
            // arrange
                const $testElement = $('#container');

                this.options.columns = [{
                    dataField: 'column1',
                    allowFiltering: true,
                    lookup: {
                        dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                        valueExpr: 'id',
                        displayExpr: 'value'
                    },
                    filterValue: 1,
                }, {
                    dataField: 'column2',
                    allowFiltering: true,
                    lookup: {
                        dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                        valueExpr: 'id',
                        displayExpr: 'value'
                    },
                    calculateDisplayValue: hasLookupOptimization ? 'text' : undefined,
                }];
                this.options.dataSource = [
                    { column1: 1, column2: 1, text: 'value1' },
                    { column1: 2, column2: 2, text: 'value2' },
                ];
                this.options.syncLookupFilterValues = true;
                this.options.editing = {
                    refreshMode
                };

                setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
                    initViews: true
                });
                this.columnHeadersView.render($testElement);

                // act
                const dropDown = $('.dx-dropdowneditor-button').eq(1);
                dropDown.trigger('dxclick');
                const dropDownList = $('.dx-list');

                // assert
                assert.strictEqual(dropDownList.find('.dx-item').length, 2);
                assert.strictEqual(dropDownList.find('.dx-item').eq(1).text(), 'value1');
            });

            QUnit.test(`Lookup select box should be empty if no rows are displayed, lookup optimization = ${hasLookupOptimization}, refreshMode = ${refreshMode}`, function(assert) {
                // arrange
                const $testElement = $('#container');

                this.options.columns = [{
                    dataField: 'column1',
                    allowFiltering: true,
                    lookup: {
                        dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                        valueExpr: 'id',
                        displayExpr: 'value'
                    },
                    filterValue: 2,
                }, {
                    dataField: 'column2',
                    allowFiltering: true,
                    lookup: {
                        dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                        valueExpr: 'id',
                        displayExpr: 'value'
                    },
                    calculateDisplayValue: hasLookupOptimization ? 'text' : undefined,
                }];

                this.options.dataSource = [
                    { column1: 1, column2: 1, text: 'value1' },
                ];
                this.options.syncLookupFilterValues = true;
                this.options.editing = { refreshMode };
                this.options.filterRow.showAllText = '(All)';

                setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
                    initViews: true
                });
                this.columnHeadersView.render($testElement);

                // act
                const dropDown = $('.dx-dropdowneditor-button').eq(1);
                dropDown.trigger('dxclick');
                const dropDownList = $('.dx-list');

                // assert
                assert.strictEqual(dropDownList.find('.dx-item').length, 1);
                assert.strictEqual(dropDownList.find('.dx-item:eq(0)').text(), '(All)');
            });
        });
    });


    QUnit.test('Lookup select box should not show only relevant values if syncLookupFilterValues = false', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns = [{
            dataField: 'column1',
            allowFiltering: true,
            lookup: {
                dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                valueExpr: 'id',
                displayExpr: 'value'
            }
        }, {
            dataField: 'column2',
            allowFiltering: true,
            lookup: {
                dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                valueExpr: 'id',
                displayExpr: 'value'
            }
        }];
        this.options.dataSource = [
            { column1: 1, column2: 1 },
            { column1: 2, column2: 2 },
        ];
        this.options.syncLookupFilterValues = false;

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });
        this.columnHeadersView.render($testElement);

        // act
        const dropDown1 = $('.dx-dropdowneditor-button').eq(0);
        const dropDown2 = $('.dx-dropdowneditor-button').eq(1);

        dropDown1.trigger('dxclick');
        dropDown2.trigger('dxclick');

        // assert
        const dropDownList1 = $('.dx-list').eq(0);
        const dropDownList2 = $('.dx-list').eq(1);

        assert.strictEqual(dropDownList1.find('.dx-item').length, 3);
        assert.strictEqual(dropDownList1.find('.dx-item').eq(1).text(), 'value1');
        assert.strictEqual(dropDownList1.find('.dx-item').eq(2).text(), 'value2');

        assert.strictEqual(dropDownList2.find('.dx-item').length, 3);
        assert.strictEqual(dropDownList2.find('.dx-item').eq(1).text(), 'value1');
        assert.strictEqual(dropDownList2.find('.dx-item').eq(2).text(), 'value2');

        // act
        dropDownList1.find('.dx-item').eq(1).trigger('dxclick');

        // assert
        assert.strictEqual(dropDownList2.find('.dx-item').length, 3);
        assert.strictEqual(dropDownList2.find('.dx-item').eq(1).text(), 'value1');
    });

    // T1103389
    QUnit.test('Lookup select box should not show only relevant values for unbound columns', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns = [{
            calculateCellValue() {
                return 1;
            },
            allowFiltering: true,
            lookup: {
                dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                valueExpr: 'id',
                displayExpr: 'value'
            }
        }];
        this.options.dataSource = [ { }, { } ];
        this.options.syncLookupFilterValues = true;

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });
        this.columnHeadersView.render($testElement);

        // act
        const dropDown1 = $('.dx-dropdowneditor-button').eq(0);

        dropDown1.trigger('dxclick');

        // assert
        const dropDownList1 = $('.dx-list').eq(0);

        assert.strictEqual(dropDownList1.find('.dx-item').length, 3);
        assert.strictEqual(dropDownList1.find('.dx-item').eq(1).text(), 'value1');
        assert.strictEqual(dropDownList1.find('.dx-item').eq(2).text(), 'value2');
    });

    // T1099516
    QUnit.test('Lookup select box should have actual values after dataSource reload', function(assert) {
        // arrange
        const $testElement = $('#container');
        let loadCount = 0;

        this.options.columns = [{
            dataField: 'column1',
            allowFiltering: true,
            lookup: {
                dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                valueExpr: 'id',
                displayExpr: 'value'
            }
        }];
        this.options.dataSource = {
            load() {
                loadCount++;
                if(loadCount === 1) {
                    return [{ column1: 1, column2: 1 }];
                } else {
                    return [
                        { column1: 1, column2: 1 },
                        { column1: 2, column2: 2 }
                    ];
                }
            }
        },
        this.options.syncLookupFilterValues = true;

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });
        this.columnHeadersView.render($testElement);

        // act
        const dropDown1 = $('.dx-dropdowneditor-button').eq(0);

        dropDown1.trigger('dxclick');

        // assert
        const dropDownList1 = $('.dx-list').eq(0);

        assert.strictEqual(dropDownList1.find('.dx-item').length, 2);
        assert.strictEqual(dropDownList1.find('.dx-item').eq(1).text(), 'value1');

        // act
        this.getDataSource().reload();

        // assert
        assert.strictEqual(dropDownList1.find('.dx-item').length, 3);
        assert.strictEqual(dropDownList1.find('.dx-item').eq(1).text(), 'value1');
        assert.strictEqual(dropDownList1.find('.dx-item').eq(2).text(), 'value2');
    });

    [
        false, // T1098872
        true, // T1111398
    ].forEach(groupPaging => {
        QUnit.test(`Lookup select box should pass correct group load options for dataGrid dataSource, groupPaging = ${groupPaging}`, function(assert) {
        // arrange
            const loadSpy = sinon.spy((loadOptions) => {
                const d = $.Deferred();
                new ArrayStore([
                    { column1: 1, text: 1 },
                    { column1: 2, text: 2 },
                ]).load(loadOptions).done(items => {
                    d.resolve({
                        data: items,
                        totalCount: 2,
                    });
                });

                return d;
            });

            const $testElement = $('#container');

            this.options.columns = [{
                dataField: 'column1',
                allowFiltering: true,
                calculateDisplayValue: 'text',
                lookup: {
                    dataSource: {
                        store: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                        paginate: true,
                    },
                    valueExpr: 'id',
                    displayExpr: 'value'
                }
            }];
            this.options.dataSource = { load: loadSpy };
            this.options.remoteOperations = groupPaging ? { groupPaging: true } : true;
            this.options.syncLookupFilterValues = true;

            setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
                initViews: true
            });
            this.columnHeadersView.render($testElement);

            // act
            const dropDown1 = $('.dx-dropdowneditor-button').eq(0);
            dropDown1.trigger('dxclick');

            // assert
            const loadOptions = loadSpy.getCall(1).args[0];
            assert.deepEqual(loadOptions.group, [{
                isExpanded: true,
                selector: 'column1'
            },
            {
                isExpanded: false,
                selector: 'text'
            }]);

            if(groupPaging) {
                assert.strictEqual(loadOptions.skip, 0);
                assert.strictEqual(loadOptions.take, 20);
            }
        });
    });


    // T1100782
    [true, false].forEach((hasLookupOptimization) => {
        QUnit.test(`Lookup select box should pass correct load options (skip, take, filter) for lookup dataSource, hasLookupOptimization: ${hasLookupOptimization}`, function(assert) {
            // arrange
            const loadSpy = sinon.spy((loadOptions) => {
                const d = $.Deferred();
                new ArrayStore(
                    [...new Array(100).keys()].map(i => ({ id: i, value: `value${i}` }))
                ).load(loadOptions).done(items => d.resolve({
                    data: items,
                    totalCount: 100,
                }));

                return d;
            });

            const $testElement = $('#container');

            this.options.columns = [{
                dataField: 'column1',
                allowFiltering: true,
                calculateDisplayValue: hasLookupOptimization ? 'text' : undefined,
                lookup: {
                    dataSource: {
                        load: loadSpy,
                        filter: ['id', '>=', 10]
                    },
                    valueExpr: 'id',
                    displayExpr: 'value'
                }
            }];
            this.options.dataSource = [...new Array(100).keys()].map(i => ({ column1: i, text: `value${i}` }));
            this.options.syncLookupFilterValues = true;

            setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
                initViews: true
            });
            this.columnHeadersView.render($testElement);

            // act
            const dropDown1 = $('.dx-dropdowneditor-button').eq(0);
            dropDown1.trigger('dxclick');

            // assert
            if(!hasLookupOptimization) {
                assert.deepEqual(loadSpy.getCall(0).args[0].filter, ['id', '>=', 10]);
                assert.strictEqual(loadSpy.getCall(0).args[0].take, undefined);
                assert.strictEqual(loadSpy.getCall(0).args[0].skip, undefined);
            }

            const dropDownList1 = $('.dx-list').eq(0);
            assert.strictEqual(dropDownList1.find('.dx-item').length, 91); // 90 rows + (All)
            assert.strictEqual(dropDownList1.find('.dx-item:eq(1)').text(), 'value10');
            assert.strictEqual(dropDownList1.find('.dx-item:eq(-1)').text(), 'value99');
        });
    });

    // T1107543
    QUnit.test('Lookup should show all relevant values in case one cell can contain multiple values', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns = [{
            dataField: 'column1',
            allowFiltering: true,
            lookup: {
                dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                valueExpr: 'id',
                displayExpr: 'value'
            }
        }];
        this.options.dataSource = [
            { column1: [1, 2] },
        ];
        this.options.syncLookupFilterValues = true;

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });
        this.columnHeadersView.render($testElement);

        // act
        const dropDown1 = $('.dx-dropdowneditor-button').eq(0);
        dropDown1.trigger('dxclick');

        // assert
        const dropDownList1 = $('.dx-list').eq(0);

        assert.strictEqual(dropDownList1.find('.dx-item').length, 3);
        assert.strictEqual(dropDownList1.find('.dx-item:eq(1)').text(), 'value1');
        assert.strictEqual(dropDownList1.find('.dx-item:eq(2)').text(), 'value2');
    });

    QUnit.test('It should be possible to turn off syncLookupFilterValues option in runtime', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns = [{
            dataField: 'column1',
            allowFiltering: true,
            lookup: {
                dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                valueExpr: 'id',
                displayExpr: 'value'
            }
        }];
        this.options.dataSource = [
            { column1: 1 },
        ];
        this.options.syncLookupFilterValues = true;

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });
        this.columnHeadersView.render($testElement);

        // act
        let dropDown1 = $('.dx-dropdowneditor-button').eq(0);
        dropDown1.trigger('dxclick');

        // assert
        let dropDownList1 = $('.dx-list').eq(0);

        assert.strictEqual(dropDownList1.find('.dx-item').length, 2);
        assert.strictEqual(dropDownList1.find('.dx-item').eq(1).text(), 'value1');

        // act
        this.option('syncLookupFilterValues', false);
        dropDown1 = $('.dx-dropdowneditor-button').eq(0);
        dropDown1.trigger('dxclick');

        // assert
        dropDownList1 = $('.dx-list').eq(0);
        assert.strictEqual(dropDownList1.find('.dx-item').length, 3);
        assert.strictEqual(dropDownList1.find('.dx-item').eq(1).text(), 'value1');
        assert.strictEqual(dropDownList1.find('.dx-item').eq(2).text(), 'value2');
    });

    // T1097980
    QUnit.test('Filtering should not throw an exception when there is hidden column', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns = [{
            dataField: 'column1',
            allowFiltering: true,
            visible: false,
        }, {
            dataField: 'column2',
            allowFiltering: true,
            lookup: {
                dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                valueExpr: 'id',
                displayExpr: 'value'
            }
        }];
        this.options.dataSource = [
            { column1: 1, column2: 1 },
            { column1: 2, column2: 2 },
        ];
        this.options.syncLookupFilterValues = true;

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });
        this.columnHeadersView.render($testElement);
        this.clock.tick(100);

        // act
        this.columnOption('column2', 'filterValue', 1);
        this.clock.tick(100);

        // assert
        assert.ok(true, 'no exceptions');
    });

    // T1097980
    QUnit.test('Filtering should not throw an exception when dataSource is null', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns = [{
            dataField: 'column1',
            allowFiltering: true,
            visible: false,
        }, {
            dataField: 'column2',
            allowFiltering: true,
            lookup: {
                dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                valueExpr: 'id',
                displayExpr: 'value'
            }
        }];
        this.options.dataSource = null;
        this.options.syncLookupFilterValues = true;

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });
        this.columnHeadersView.render($testElement);
        this.clock.tick(100);

        // assert
        assert.ok(true, 'no exceptions');
    });

    // T1047481
    QUnit.test('Search box should render aria-label attribute', function(assert) {
        // arrange
        const $testElement = $('#container');
        this.options.filterRow.visible = true;

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
            initViews: true
        });
        this.columnHeadersView.render($testElement);

        // assert
        assert.equal(this.columnHeadersView.element().find('.dx-menu-item').first().attr('aria-label'), 'Search box');
    });

    // T1192700
    QUnit.test('Lookup select box should not show only relevant values for the current filtered column when filterSyncEnabled is true', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columns = [{
            dataField: 'column1',
            allowFiltering: true,
            filterValue: 1,
            lookup: {
                dataSource: [{ id: 1, value: 'value1' }, { id: 2, value: 'value2' }],
                valueExpr: 'id',
                displayExpr: 'value'
            }
        }];
        this.options.dataSource = [
            { column1: 1 },
            { column1: 2 },
        ];
        this.options.syncLookupFilterValues = true;
        this.options.filterSyncEnabled = true;

        setupDataGridModules(this, ['data', 'columns', 'columnHeaders', 'filterRow', 'headerFilter', 'editorFactory', 'filterSync', 'filterBuilder', 'filterPanel'], {
            initViews: true
        });
        this.columnHeadersView.render($testElement);

        // act
        const dropDown1 = $('.dx-dropdowneditor-button').eq(0);

        dropDown1.trigger('dxclick');

        // assert
        const dropDownList1 = $('.dx-list').eq(0);
        assert.strictEqual(dropDownList1.find('.dx-item').length, 3);
        assert.strictEqual(dropDownList1.find('.dx-item').eq(0).text(), '(All)');
        assert.strictEqual(dropDownList1.find('.dx-item').eq(1).text(), 'value1');
        assert.strictEqual(dropDownList1.find('.dx-item').eq(2).text(), 'value2');
    });

    if(device.deviceType === 'desktop') {
    // T306751
        QUnit.testInActiveWindow('Filter range - keyboard navigation', function(assert) {
        // arrange
            const that = this;
            const $testElement = $('#container').addClass('dx-datagrid-borders');

            that.options.columns = [{ dataField: 'age', selectedFilterOperation: 'between' }, 'name'];
            setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
                initViews: true
            });
            that.updateDimensions = noop;
            that.columnHeadersView.render($testElement);

            // assert
            assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');

            // act
            $($testElement.find('.dx-filter-range-content')).trigger('focusin'); // show range

            // assert
            const $cells = $testElement.find('td');
            const $numberBoxElements = $('.dx-viewport').children('.dx-datagrid-filter-range-overlay').find('.dx-numberbox');
            assert.equal($cells.first().find('.dx-datagrid-filter-range-overlay').length, 1, 'has filter range popup');
            assert.equal($('.dx-viewport').children('.dx-datagrid-filter-range-overlay').length, 1, 'has popup wrapper');
            assert.equal($numberBoxElements.length, 2, 'count number box');

            // act
            $($numberBoxElements.last().find(TEXTEDITOR_INPUT_SELECTOR)).trigger($.Event('keydown', { key: 'Tab' })); // focus on menu of the second cell, hide range

            // assert
            assert.equal($cells.first().find('.dx-filter-range-content').length, 1, 'has filter range content');
            assert.ok(!$('.dx-viewport').children('.dx-datagrid-filter-range-overlay').length, 'not has popup wrapper');
            assert.ok($cells.last().find('.dx-menu').first().is(':focus'), 'focus on menu of the second cell');
        });

        // T306751
        QUnit.testInActiveWindow('Filter range - keyboard navigation with key pressed the shift', function(assert) {
        // arrange
            const that = this;
            const $testElement = $('#container').addClass('dx-datagrid-borders');

            that.options.columns = [{ dataField: 'age', selectedFilterOperation: 'between' }, 'name'];
            setupDataGridModules(that, ['data', 'columns', 'columnHeaders', 'filterRow', 'editorFactory'], {
                initViews: true
            });
            that.updateDimensions = noop;
            that.columnHeadersView.render($testElement);

            // assert
            assert.equal($testElement.find('.dx-filter-range-content').length, 1, 'has filter range content');

            // act
            $($testElement.find('.dx-filter-range-content')).trigger('focusin'); // show range

            // assert
            const $cells = $testElement.find('td');
            const $numberBoxElements = $('.dx-viewport').children('.dx-datagrid-filter-range-overlay').find('.dx-numberbox');
            assert.equal($cells.first().find('.dx-datagrid-filter-range-overlay').length, 1, 'has filter range popup');
            assert.equal($('.dx-viewport').children('.dx-datagrid-filter-range-overlay').length, 1, 'has popup wrapper');
            assert.equal($numberBoxElements.length, 2, 'count number box');

            // act
            $($numberBoxElements.first().find('input')).trigger($.Event('keydown', { key: 'Tab', shiftKey: true })); // focus on menu of the first cell, hide range

            // assert
            assert.equal($cells.first().find('.dx-filter-range-content').length, 1, 'has filter range content');
            assert.ok(!$('.dx-viewport').children('.dx-datagrid-filter-range-popup').length, 'not has popup wrapper');
            assert.ok($cells.first().find('.dx-menu').first().is(':focus'), 'focus on menu of the first cell');
        });
    }
});

