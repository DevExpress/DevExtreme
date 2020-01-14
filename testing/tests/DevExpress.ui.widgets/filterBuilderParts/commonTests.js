import $ from 'jquery';
import { isRenderer } from 'core/utils/type';
import devices from 'core/devices';
import config from 'core/config';
import renderer from 'core/renderer';
import fields from '../../../helpers/filterBuilderTestData.js';

import 'ui/filter_builder/filter_builder';
import 'ui/drop_down_box';
import 'ui/button';

import {
    FILTER_BUILDER_ITEM_FIELD_CLASS,
    FILTER_BUILDER_ITEM_OPERATION_CLASS,
    FILTER_BUILDER_ITEM_VALUE_CLASS,
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS,
    FILTER_BUILDER_OVERLAY_CLASS,
    FILTER_BUILDER_GROUP_OPERATION_CLASS,
    FILTER_BUILDER_IMAGE_ADD_CLASS,
    FILTER_BUILDER_IMAGE_REMOVE_CLASS,
    FILTER_BUILDER_RANGE_CLASS,
    FILTER_BUILDER_RANGE_START_CLASS,
    FILTER_BUILDER_RANGE_END_CLASS,
    FILTER_BUILDER_RANGE_SEPARATOR_CLASS,
    ACTIVE_CLASS,
    FILTER_BUILDER_MENU_CUSTOM_OPERATION_CLASS,
    TREE_VIEW_CLASS,
    TREE_VIEW_ITEM_CLASS,
    DISABLED_STATE_CLASS
} from './constants.js';

import {
    getSelectedMenuText,
    getFilterBuilderGroups,
    getFilterBuilderItems,
    clickByOutside,
    clickByValue,
    selectMenuItem,
    clickByButtonAndSelectMenuItem
} from './helpers.js';

QUnit.module('Rendering', function() {
    QUnit.test('field menu test', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['CompanyName', '=', 'K&S Music']
            ],
            fields: [{
                dataField: 'CompanyName'
            }, {
                dataField: 'Budget',
                visible: false // this is unavailable property but it available in grid. See T579785.
            }]
        });

        const $fieldButton = container.find('.' + FILTER_BUILDER_ITEM_FIELD_CLASS);
        $fieldButton.trigger('dxclick');

        const $menuItem = $(`.${TREE_VIEW_ITEM_CLASS}`).eq(1);
        assert.equal($menuItem.text(), 'Budget');
    });

    // T619643
    QUnit.test('deferRendering is enabled in menu', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            fields: [{
                dataField: 'CompanyName'
            }]
        });

        container.find('.' + FILTER_BUILDER_GROUP_OPERATION_CLASS).trigger('dxclick');
        const popupInstance = container.find('.' + FILTER_BUILDER_OVERLAY_CLASS).dxPopup('instance');
        assert.ok(popupInstance.option('deferRendering'));
    });

    QUnit.test('operation menu has between item with custom operation class', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['CompanyName', '=', 1]
            ],
            fields: [{
                dataField: 'CompanyName',
                dataType: 'number'
            }]
        });

        const $fieldButton = container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        $fieldButton.trigger('dxclick');

        const $customItems = $(`.${TREE_VIEW_CLASS}`).find('.' + FILTER_BUILDER_MENU_CUSTOM_OPERATION_CLASS);
        assert.equal($customItems.length, 1, 'one custom');
        assert.equal($customItems.text(), 'Is between', 'between is custom');
    });

    QUnit.test('value and operations depend on selected field', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: [
                ['CompanyName', '=', 'K&S Music']
            ],
            fields: fields
        });

        const $fieldButton = container.find('.' + FILTER_BUILDER_ITEM_FIELD_CLASS);
        $fieldButton.trigger('dxclick');
        assert.ok($fieldButton.hasClass(ACTIVE_CLASS));

        assert.ok($('.dx-filterbuilder-fields').length > 0);

        const $menuItem = $(`.${TREE_VIEW_ITEM_CLASS}`).eq(2);
        assert.equal($menuItem.text(), 'State');
        $menuItem.trigger('dxclick');
        assert.equal($fieldButton.html(), 'State');
        assert.ok(!$fieldButton.hasClass(ACTIVE_CLASS));
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS).text(), 'Contains');
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).text(), '<enter a value>');
        assert.ok($('.dx-filterbuilder-fields').length === 0);
    });

    QUnit.test('editorElement argument of onEditorPreparing option is correct', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['CompanyName', '=', 'DevExpress']
            ],
            onEditorPreparing: function(e) {
                assert.equal(isRenderer(e.editorElement), !!config().useJQuery, 'editorElement is correct');
            },
            fields: fields
        });

        // act
        clickByValue();
    });

    QUnit.test('operations are changed after field change', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: [
                ['State', '<>', 'K&S Music']
            ],
            fields: fields
        });

        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS).text(), 'Does not equal');

        const $fieldButton = container.find('.' + FILTER_BUILDER_ITEM_FIELD_CLASS);
        $fieldButton.trigger('dxclick');

        const $menuItem = $(`.${TREE_VIEW_ITEM_CLASS}`).eq(5);
        $menuItem.trigger('dxclick');

        assert.equal($fieldButton.html(), 'City');
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS).text(), 'Equals');
    });

    QUnit.test('selected element must change in field menu after click', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['State', '<>', 'K&S Music']
            ],
            fields: fields
        });

        const $fieldButton = container.find('.' + FILTER_BUILDER_ITEM_FIELD_CLASS);
        $fieldButton.trigger('dxclick');

        assert.equal(getSelectedMenuText(), 'State');

        selectMenuItem(1);

        $fieldButton.trigger('dxclick');
        assert.equal(getSelectedMenuText(), 'Date');
    });

    QUnit.test('selected element must change in group operation menu after click', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['State', '<>', 'K&S Music']
            ],
            fields: fields
        });

        const $groupButton = container.find('.' + FILTER_BUILDER_GROUP_OPERATION_CLASS);
        $groupButton.trigger('dxclick');

        assert.ok($('.dx-filterbuilder-group-operations').length > 0);
        assert.equal(getSelectedMenuText(), 'And');

        selectMenuItem(3);

        assert.ok($('.dx-filterbuilder-group-operations').length === 0);

        $groupButton.trigger('dxclick');
        assert.equal(getSelectedMenuText(), 'Not Or');
    });

    QUnit.test('selected element must change in filter operation menu after click', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['Date', '=', '']
            ],
            fields: fields
        });

        const $operationButton = container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        $operationButton.trigger('dxclick');

        assert.ok($('.dx-filterbuilder-operations').length > 0);
        assert.equal(getSelectedMenuText(), 'Equals');

        selectMenuItem(3);

        assert.ok($('.dx-filterbuilder-operations').length === 0);
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 1);

        $operationButton.trigger('dxclick');
        assert.equal(getSelectedMenuText(), 'Is greater than');
    });

    // T704561
    QUnit.test('check menu correct maxHeight & position', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['Date', '=', '']
            ],
            fields: fields
        });

        const scrollTop = sinon.stub(renderer.fn, 'scrollTop').returns(100);
        const windowHeight = sinon.stub(renderer.fn, 'innerHeight').returns(300);
        const offset = sinon.stub(renderer.fn, 'offset').returns({ left: 0, top: 200 });

        const $operationButton = container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        $operationButton.trigger('dxclick');

        try {
            const popup = container.find('.dx-overlay').dxPopup('instance');
            const maxHeight = popup.option('maxHeight');
            const positionCollision = popup.option('position.collision');

            assert.ok(Math.floor(maxHeight()) < windowHeight(), 'maxHeight is correct');
            assert.equal(positionCollision, 'flip', 'collision is correct');
        } finally {
            scrollTop.restore();
            windowHeight.restore();
            offset.restore();
        }
    });

    // T588221
    QUnit.testInActiveWindow('click by dropdownbox specified editorTemplate', function(assert) {
        const container = $('#container');
        const INNER_ELEMENT_CLASS = 'test-inner-element';
        const VALUE = 'Value after click by button';

        container.dxFilterBuilder({
            value: ['Field', '=', 'Test1'],
            fields: [{
                dataField: 'Field',
                editorTemplate: function(options, $container) {
                    $('<div>')
                        .appendTo($container)
                        .dxDropDownBox({
                            value: 3,
                            valueExpr: 'ID',
                            contentTemplate: function(e) {
                                const dropDownContent = $('<div>');
                                $('<div>')
                                    .addClass(INNER_ELEMENT_CLASS)
                                    .appendTo(dropDownContent);
                                $('<div>')
                                    .appendTo(dropDownContent)
                                    .dxButton({
                                        onClick: function() {
                                            options.setValue(VALUE);
                                        }
                                    });

                                return dropDownContent;
                            }
                        });
                }
            }]
        });

        container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');
        assert.equal($('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).length, 0, 'hide button');
        assert.equal($('.dx-dropdowneditor-button').length, 1, 'has one dropdowneditor button');

        $('.dx-dropdowneditor-button').trigger('dxclick');
        assert.equal($('.' + INNER_ELEMENT_CLASS).length, 1, 'dropdown opened');

        $('.' + INNER_ELEMENT_CLASS).trigger('dxclick');
        assert.equal($('.' + INNER_ELEMENT_CLASS).length, 1, 'dropdown opened after click by its inner element');

        $('.dx-button').trigger('dxclick');
        clickByOutside();

        assert.equal($('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).text(), VALUE);
    });

    QUnit.test('Add and remove group', function(assert) {
        const container = $('#container');
        const instance = container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ['State', '<>', 'Test'],
            fields: fields
        }).dxFilterBuilder('instance');

        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_IMAGE_ADD_CLASS), 1);
        assert.deepEqual(instance.option('value'), ['State', '<>', 'Test']);

        $('.' + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(1).trigger('dxclick');
        assert.deepEqual(instance.option('value'), ['State', '<>', 'Test']);
    });

    // T589531
    QUnit.test('datebox returns null when a date value is specified as an empty string', function(assert) {
        $('#container').dxFilterBuilder({
            value: ['Date', '=', ''],
            fields: fields
        });

        $('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');
        assert.equal($('.dx-datebox').dxDateBox('instance').option('value'), null);
    });

    // T589341
    QUnit.test('the formatter is applied to a field with the date type', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'This test is not actual for mobile devices');
            return;
        }

        $('#container').dxFilterBuilder({
            value: ['Date', '=', ''],
            fields: [{
                dataField: 'Date',
                dataType: 'date',
                format: 'dd.MM.yyyy'
            }]
        });

        $('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');
        $('.dx-datebox input').val('12/12/2017');
        $('.dx-datebox input').trigger('change');
        clickByOutside();

        assert.equal($('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).text(), '12.12.2017');
    });

    // T589341
    QUnit.test('NumberBox with custom format', function(assert) {
        const $container = $('#container');

        $container.dxFilterBuilder({
            value: ['Weight', '=', 3.14],
            fields: [{
                dataField: 'Weight',
                dataType: 'number',
                editorOptions: {
                    format: '#0.## kg'
                }
            }]
        });

        $('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        // assert
        assert.equal($container.find('.dx-texteditor-input').val(), '3.14 kg', 'numberbox formatted value');
    });

    // T603217
    QUnit.test('Menu popup hasn\'t target', function(assert) {
        // arrange
        const $container = $('#container');

        $container.dxFilterBuilder({
            value: ['Weight', '=', 3.14],
            fields: [{
                dataField: 'Weight',
                dataType: 'number'
            }]
        });

        // act
        $('.' + FILTER_BUILDER_GROUP_OPERATION_CLASS).trigger('dxclick');

        // assert
        assert.notOk($container.find('.' + FILTER_BUILDER_OVERLAY_CLASS).dxPopup('instance').option('target'), 'popup target shoud not be set');
    });
});

QUnit.module('Filter value', function() {

    QUnit.test('hide filter value for isblank & isNotBlank', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['State', '<>', 'K&S Music']
            ],
            fields: fields
        });

        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 1);

        // for is blank
        const $operationButton = container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS);

        clickByButtonAndSelectMenuItem($operationButton, 6);
        assert.equal($operationButton.text(), 'Is blank');
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 0);

        clickByButtonAndSelectMenuItem($operationButton, 5);
        assert.equal($operationButton.text(), 'Does not equal');
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 1);

        // for is not blank
        clickByButtonAndSelectMenuItem($operationButton, 7);
        assert.equal($operationButton.text(), 'Is not blank');
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 0);

        clickByButtonAndSelectMenuItem($operationButton, 4);
        assert.equal($operationButton.text(), 'Equals');
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 1);
    });

    QUnit.test('change filter value text when customOperation is selected', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['field', '=', 'K&S Music']
            ],
            customOperations: [{
                name: 'customOperation'
            }],
            fields: [{
                dataField: 'field',
                filterOperations: ['=', 'customOperation']
            }]
        });

        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).text(), 'K&S Music');

        const $operationButton = container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        clickByButtonAndSelectMenuItem($operationButton, 1);

        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).text(), '<enter a value>');
    });

    QUnit.test('execute customOperation.customizeText for field with lookup', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['field', 'customOperation', '1']
            ],
            customOperations: [{
                name: 'customOperation',
                customizeText: function() {
                    return 'custom text';
                }
            }],
            fields: [{
                dataField: 'field',
                lookup: {
                    dataSource: ['1', '2']
                },
                filterOperations: ['customOperation']
            }]
        });

        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).text(), 'custom text');
    });

    QUnit.test('hide filter value for field with object dataType', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['State', '<>', 'K&S Music']
            ],
            fields: fields
        });

        const $fieldButton = container.find('.' + FILTER_BUILDER_ITEM_FIELD_CLASS);

        clickByButtonAndSelectMenuItem($fieldButton, 6);
        assert.equal($fieldButton.text(), 'Caption of Object Field');
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 0);

        clickByButtonAndSelectMenuItem($fieldButton, 2);
        assert.equal($fieldButton.text(), 'State');
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 1);
    });

    QUnit.test('hide filter value for customOperation', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['State', 'lastWeek']
            ],
            customOperations: [{
                name: 'lastWeek',
                dataTypes: ['string'],
                hasValue: false
            }],
            fields: [{ dataField: 'State' }]
        });

        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).length, 0);
    });

    QUnit.testInActiveWindow('value button loses focus after value change and outside click', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: ['State', '<>', 'K&S Music'],
            fields: fields
        }).dxFilterBuilder('instance');

        container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        const textBoxInstance = $('.dx-textbox').dxTextBox('instance');
        textBoxInstance.option('value', 'Test');
        clickByOutside();

        const valueButton = container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        assert.notOk(valueButton.is(':focus'));
    });

    QUnit.testInActiveWindow('range start editor has focus', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: ['field', 'between', [1, 2]],
            fields: [{ dataField: 'field', dataType: 'number' }]
        });

        container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        const $rangeStartEditor = container.find('.' + FILTER_BUILDER_RANGE_START_CLASS + ' .dx-texteditor-input');
        assert.ok($rangeStartEditor.is(':focus'));
    });

    QUnit.testInActiveWindow('change filter value', function(assert) {
        const container = $('#container');
        const instance = container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ['State', '<>', 'K&S Music'],
            fields: fields
        }).dxFilterBuilder('instance');

        const $valueButton = container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        $valueButton.trigger('dxclick');

        const $textBoxContainer = container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS + ' .dx-textbox');
        const textBoxInstance = $textBoxContainer.dxTextBox('instance');
        const $input = $textBoxContainer.find('input');
        assert.ok($input.is(':focus'));

        textBoxInstance.option('value', 'Test');
        $input.trigger('blur');
        assert.ok(container.find('input').length, 'has input');
        assert.notDeepEqual(instance.option('value'), ['State', '<>', 'Test']);
        clickByOutside();
        assert.deepEqual(instance.option('value'), ['State', '<>', 'Test']);
    });

    QUnit.testInActiveWindow('change filter value in selectbox', function(assert) {
        const $container = $('#container');
        const instance = $container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ['CompanyName', '<>', 'KS Music'],
            fields: fields
        }).dxFilterBuilder('instance');

        const $valueButton = $container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        $valueButton.trigger('dxclick');

        const $input = $container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).find('input.dx-texteditor-input');
        assert.ok($input.is(':focus'));

        const selectBoxInstance = $container.find('.dx-selectbox').dxSelectBox('instance');
        selectBoxInstance.open();

        $('.dx-list-item').eq(1).trigger('dxclick');

        assert.ok($container.find('input').length, 'has input');
        assert.notDeepEqual(instance.option('value'), ['CompanyName', '<>', 'Super Mart of the West']);
        clickByOutside();
        assert.deepEqual(instance.option('value'), ['CompanyName', '<>', 'Super Mart of the West']);
    });

    QUnit.testInActiveWindow('change filter value in selectbox with different value and displayText', function(assert) {
        const $container = $('#container');
        const instance = $container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ['Product', '=', 1],
            fields: fields
        }).dxFilterBuilder('instance');

        assert.equal($container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).text(), 'DataGrid');

        const $valueButton = $container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        $valueButton.trigger('dxclick');

        const selectBoxInstance = $container.find('.dx-selectbox').dxSelectBox('instance');
        selectBoxInstance.open();
        $('.dx-list-item').eq(1).trigger('dxclick');
        clickByOutside();

        assert.equal($container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).text(), 'PivotGrid');
        assert.deepEqual(instance.option('value'), ['Product', '=', 2]);
    });

    QUnit.testInActiveWindow('check default value for number', function(assert) {
        const container = $('#container');
        const instance = container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ['Zipcode', '<>', 123],
            fields: fields
        }).dxFilterBuilder('instance');

        container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        const editorInstance = container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS + ' > div').dxNumberBox('instance');
        editorInstance.option('value', 0);
        clickByOutside();
        assert.deepEqual(instance.option('value'), ['Zipcode', '<>', 0]);
    });

    QUnit.testInActiveWindow('change filter value when specified editorTemplate', function(assert) {
        const container = $('#container');
        const instance = container.dxFilterBuilder({
            value: ['Field', '=', 'Test1'],
            fields: [{
                dataField: 'Field',
                editorTemplate: function(options, $container) {
                    $('<input/>').val(options.val).on('change', function(e) {
                        options.setValue($(e.currentTarget).val());
                    }).appendTo($container);
                }
            }]
        }).dxFilterBuilder('instance');

        let $valueButton = container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        assert.strictEqual($valueButton.text(), 'Test1', 'filter value');

        $valueButton.trigger('dxclick');

        const $input = container.find('input');
        assert.ok($input.is(':focus'));

        $input.val('Test2');
        $input.trigger('change');
        clickByOutside();

        $valueButton = container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS);
        assert.strictEqual($valueButton.text(), 'Test2', 'filter value');
        assert.deepEqual(instance.option('value'), ['Field', '=', 'Test2']);
        assert.notOk(container.find('input').length, 'hasn\'t input');
    });

    // T750946
    QUnit.test('Two fields with the same dataField', function(assert) {
        const container = $('#container');

        const filterBuilder = container.dxFilterBuilder({
            value: [
                ['field1', '<>', 'K&S Music']
            ],
            fields: [{
                dataField: 'State',
                caption: 'field 1',
                name: 'field1'
            }, {
                dataField: 'State',
                caption: 'field 2',
                name: 'field2'
            }]
        }).dxFilterBuilder('instance');

        // act, assert
        $('.' + FILTER_BUILDER_ITEM_FIELD_CLASS).trigger('dxclick');

        assert.equal($('.' + TREE_VIEW_ITEM_CLASS).length, 2, 'treeview items count');
        assert.equal($('.' + FILTER_BUILDER_ITEM_FIELD_CLASS).text(), 'field 1', 'initial field was set correctly');

        $('.' + TREE_VIEW_ITEM_CLASS).eq(1).trigger('dxclick');
        assert.equal($('.' + FILTER_BUILDER_ITEM_FIELD_CLASS).text(), 'field 2', 'field was changed correctly');

        assert.equal($('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS).text(), 'Contains', 'operation was changed correctly');

        $('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');
        const valueInput = container.find('input');
        valueInput.val('K&S Music');
        valueInput.find('input').trigger('change');

        clickByOutside();
        assert.deepEqual(filterBuilder.option('value'), ['field2', 'contains', 'K&S Music'], 'expression is correct');
    });

    // T812261
    QUnit.test('hierarchical fields', function(assert) {
        const container = $('#container');
        let $fields;

        container.dxFilterBuilder({
            value: [
                ['id', '=', '1']
            ],
            allowHierarchicalFields: true,
            fields: [{
                dataField: 'id',
            }, {
                dataField: 'address.state',
            }, {
                dataField: 'address.city',
            }]
        }).dxFilterBuilder('instance');

        // act, assert
        $('.' + FILTER_BUILDER_ITEM_FIELD_CLASS).trigger('dxclick');

        $fields = $('.' + TREE_VIEW_ITEM_CLASS);

        assert.equal($fields.length, 2, 'treeview items count');
        assert.equal($('.dx-treeview-toggle-item-visibility').length, 1, '');

        assert.equal($fields.eq(0).text(), 'Id');
        assert.equal($fields.eq(1).text(), 'Address');

        $('.dx-treeview-toggle-item-visibility').trigger('dxclick');

        $fields = $('.' + TREE_VIEW_ITEM_CLASS);

        assert.equal($fields.length, 4, 'treeview items count');

        assert.equal($fields.eq(0).text(), 'Id');
        assert.equal($fields.eq(1).text(), 'Address');
        assert.equal($fields.eq(2).text(), 'State');
        assert.equal($fields.eq(3).text(), 'City');
    });

    // T812261, T750946
    QUnit.test('hierarchical fields with two fields with the same dataField', function(assert) {
        const container = $('#container');
        let $fields;

        container.dxFilterBuilder({
            value: [
                ['id', '=', '1']
            ],
            allowHierarchicalFields: true,
            fields: [{
                dataField: 'id',
            }, {
                dataField: 'address.same',
                caption: 'State',
                name: 'State'
            }, {
                dataField: 'address.same',
                caption: 'City',
                name: 'City'
            }]
        }).dxFilterBuilder('instance');

        // act, assert
        $('.' + FILTER_BUILDER_ITEM_FIELD_CLASS).trigger('dxclick');

        $fields = $('.' + TREE_VIEW_ITEM_CLASS);

        assert.equal($fields.length, 2, 'treeview items count');
        assert.equal($('.dx-treeview-toggle-item-visibility').length, 1, '');

        assert.equal($fields.eq(0).text(), 'Id');
        assert.equal($fields.eq(1).text(), 'Address');

        $('.dx-treeview-toggle-item-visibility').trigger('dxclick');

        $fields = $('.' + TREE_VIEW_ITEM_CLASS);

        assert.equal($fields.length, 4, 'treeview items count');

        assert.equal($fields.eq(0).text(), 'Id');
        assert.equal($fields.eq(1).text(), 'Address');
        assert.equal($fields.eq(2).text(), 'State');
        assert.equal($fields.eq(3).text(), 'City');
    });
});

QUnit.module('Create editor', function() {
    QUnit.test('dataType - number', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ['Zipcode', '=', 98027],
            fields: fields
        });
        const valueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        assert.ok(valueField.find('.dx-numberbox').dxNumberBox('instance'));
    });

    QUnit.test('dataType - string', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ['State', '=', 'Test'],
            fields: fields
        });

        const valueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        valueField.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');
        assert.ok(valueField.find('.dx-textbox').dxTextBox('instance'));
    });

    QUnit.test('dataType - date', function(assert) {
        const container = $('#container');
        let dateBoxInstance;

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ['Date', '=', new Date()],
            fields: fields
        });

        const valueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        dateBoxInstance = valueField.find('.dx-datebox').dxDateBox('instance');
        assert.strictEqual(dateBoxInstance.option('type'), 'date');
    });

    QUnit.test('dataType - datetime', function(assert) {
        const container = $('#container');
        let dateBoxInstance;

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ['DateTime', '=', new Date()],
            fields: fields
        });

        const valueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        dateBoxInstance = valueField.find('.dx-datebox').dxDateBox('instance');
        assert.strictEqual(dateBoxInstance.option('type'), 'datetime');
    });

    QUnit.test('dataType - boolean', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ['Contributor', '=', false],
            fields: fields
        });

        const valueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        assert.ok(valueField.find('.dx-selectbox').dxSelectBox('instance'));
    });

    QUnit.test('dataType - object', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ['ObjectField', '=', null],
            fields: fields
        });

        const valueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        assert.notOk(valueField.length);
    });

    QUnit.test('field with lookup', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            allowHierarchicalFields: true,
            value: ['CompanyName', '=', 'Test'],
            fields: fields
        });

        const valueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        assert.ok(valueField.find('.dx-selectbox').dxSelectBox('instance'));
    });

    QUnit.test('field.editorTemplate', function(assert) {
        let args;
        const fields = [{
            dataField: 'Field',
            editorTemplate: function(options, $container) {
                args = options;

                return $('<input/>').addClass('my-editor');
            }
        }];

        $('#container').dxFilterBuilder({
            value: [
                ['Field', '=', 'value']
            ],
            fields: fields
        });

        const valueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        assert.ok(valueField.find('input').hasClass('my-editor'));

        assert.strictEqual(args.value, 'value', 'filter value');
        assert.strictEqual(args.filterOperation, '=', 'filter operation');
        assert.strictEqual(args.field.dataField, fields[0].dataField);
        assert.strictEqual(args.field.editorTemplate, fields[0].editorTemplate);
        assert.ok(args.setValue, 'has setValue');
    });

    QUnit.test('customOperation.editorTemplate', function(assert) {
        let args;
        const fields = [{
            dataField: 'Field'
        }];

        $('#container').dxFilterBuilder({
            value: [
                ['Field', 'lastDays', 2]
            ],
            fields: fields,
            customOperations: [{
                name: 'lastDays',
                dataTypes: ['string'],
                editorTemplate: function(options, $container) {
                    args = options;

                    return $('<input/>').addClass('my-editor');
                }
            }]
        });

        const valueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        clickByValue();
        assert.ok(valueField.find('input').hasClass('my-editor'));

        assert.strictEqual(args.value, 2, 'filter value');
        assert.strictEqual(args.filterOperation, 'lastDays', 'filter operation');
        assert.strictEqual(args.field.dataField, fields[0].dataField);
        assert.strictEqual(args.field.editorTemplate, fields[0].editorTemplate);
        assert.ok(args.setValue, 'has setValue');
    });

    QUnit.test('customOperation.editorTemplate has more priority than field.editorTemplate', function(assert) {
        let event;
        const fields = [{
            dataField: 'Field',
            dataType: 'number',
            editorTemplate: function(options, $container) {
                event = 'field.editorTemplate';
            }
        }];
        const instance = $('#container').dxFilterBuilder({
            value: [
                ['Field', 'lastDays', 2]
            ],
            fields: fields,
            customOperations: [{
                name: 'lastDays',
                dataTypes: ['number'],
                editorTemplate: function(options, $container) {
                    event = 'customOperation.editorTemplate';
                }
            }]
        }).dxFilterBuilder('instance');


        clickByValue();
        assert.equal(event, 'customOperation.editorTemplate', 'customOperation.editorTemplate is executed');

        instance.option('value', ['Field', '=', 2]);
        clickByValue();
        assert.equal(event, 'field.editorTemplate', 'field.editorTemplate is executed');
    });

    QUnit.test('between.editorTemplate', function(assert) {
        // arrange
        const fields = [{
            dataField: 'Field',
            dataType: 'number'
        }];

        $('#container').dxFilterBuilder({
            value: [
                ['Field', 'between', [1, 2]]
            ],
            fields: fields
        });

        // act
        clickByValue();

        const $rangeContainer = $('.' + FILTER_BUILDER_RANGE_CLASS);
        const $editorStart = $rangeContainer.find('.' + FILTER_BUILDER_RANGE_START_CLASS);
        const $editorEnd = $rangeContainer.find('.' + FILTER_BUILDER_RANGE_END_CLASS);
        const $separator = $rangeContainer.find('.' + FILTER_BUILDER_RANGE_SEPARATOR_CLASS);

        // assert
        assert.equal($editorStart.length, 1, 'Start editor is created');
        assert.equal($editorEnd.length, 1, 'End editor is created');
        assert.equal($separator.length, 1, 'Separator is created');
        assert.equal($editorStart.dxNumberBox('instance').option('value'), 1, 'Start editor value = 1');
        assert.equal($editorEnd.dxNumberBox('instance').option('value'), 2, 'End editor value = 2');
    });
});

QUnit.module('Short condition', function() {
    QUnit.test('check value field', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: ['CompanyName', 'K&S Music'],
            fields: fields
        });

        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).text(), 'K&S Music');
    });

    QUnit.test('check value input', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: ['CompanyName', 'K&S Music'],
            fields: fields
        });

        container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        assert.equal(container.find('input').val(), 'K&S Music');
    });

    QUnit.test('check value field after change of operation field', function(assert) {
        const container = $('#container');
        const instance = container.dxFilterBuilder({
            value: ['CompanyName', 'K&S Music'],
            fields: fields
        }).dxFilterBuilder('instance');

        clickByButtonAndSelectMenuItem(container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS), 3);

        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).text(), 'K&S Music');
        assert.deepEqual(instance.option('value'), ['CompanyName', 'endswith', 'K&S Music']);
    });

    QUnit.test('check value input after change of operation field', function(assert) {
        const container = $('#container');

        container.dxFilterBuilder({
            value: ['CompanyName', 'K&S Music'],
            fields: fields
        });

        container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS).trigger('dxclick');
        $('.dx-menu-item-text').eq(3).trigger('dxclick');
        container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        assert.equal(container.find('input').val(), 'K&S Music');
    });
});

QUnit.module('on value changed', function() {
    const changeValue = function(container, newValue) {
        container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');
        const $textBoxContainer = container.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS + ' .dx-textbox');
        const textBoxInstance = $textBoxContainer.dxTextBox('instance');
        textBoxInstance.option('value', 'Test');
        return $textBoxContainer;
    };

    QUnit.test('add/remove empty group', function(assert) {
        const container = $('#container');
        let value = [['CompanyName', 'K&S Music']];
        const instance = container.dxFilterBuilder({
            value: value,
            fields: fields
        }).dxFilterBuilder('instance');

        // add empty group
        value = instance.option('value');
        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_IMAGE_ADD_CLASS).eq(1), 0);
        assert.equal(instance.option('value'), value);

        // remove empty group
        value = instance.option('value');
        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(2), 0);
        assert.equal(instance.option('value'), value);

    });

    QUnit.test('add/remove group with condition', function(assert) {
        const container = $('#container');
        const value = [['CompanyName', 'K&S Music']];

        container.dxFilterBuilder({
            value: value,
            fields: fields
        }).dxFilterBuilder('instance');

        assert.equal(getFilterBuilderGroups(container).length, 1);

        // add group
        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_IMAGE_ADD_CLASS), 1);
        assert.equal(getFilterBuilderGroups(container).length, 2);
        assert.equal(getFilterBuilderItems(container).length, 1);

        // add inner condition
        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_IMAGE_ADD_CLASS).eq(1), 0);
        assert.equal(getFilterBuilderItems(container).length, 2);
        assert.equal(getFilterBuilderGroups(container).length, 2);

        // remove group
        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(1), 0);
        assert.equal(getFilterBuilderItems(container).length, 1);
        assert.equal(getFilterBuilderGroups(container).length, 1);

    });

    QUnit.test('add/remove conditions', function(assert) {
        const container = $('#container');
        const value = [['CompanyName', 'K&S Music']];
        container.dxFilterBuilder({
            value: value,
            fields: fields
        });

        assert.equal(getFilterBuilderItems(container).length, 1);

        // add condition
        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_IMAGE_ADD_CLASS), 0);
        assert.equal(getFilterBuilderItems(container).length, 2);

        // remove condition
        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(1), 0);
        assert.equal(getFilterBuilderItems(container).length, 1);
    });

    // T824147
    QUnit.test('Add-condition popup should be closed on scroll', function(assert) {
        // arrange
        const container = $('#container');
        const value = [['CompanyName', 'K&S Music']];
        let popupInstance;

        container.dxFilterBuilder({
            value: value,
            fields: fields
        });

        // act
        $('.' + FILTER_BUILDER_IMAGE_ADD_CLASS).trigger('dxclick');

        popupInstance = container.children('.dx-filterbuilder-overlay').dxPopup('instance');

        // assert
        assert.equal(popupInstance.option('closeOnTargetScroll'), true, 'popup\'s closeOnTargetScroll');
    });

    // T804262
    QUnit.test('Deleting of condition doesn\'t cause group deleting in controlled mode (React)', function(assert) {
        const container = $('#container');
        const value = [
            ['Name', '=', 'John'],
            'or',
            [
                ['Name', '=', 'Fed'],
                'and',
                ['Price', '>', 2000]
            ]
        ];
        const fields = [{
            dataField: 'Name'
        }, {
            dataField: 'Price',
            dataType: 'number'
        }];

        container.dxFilterBuilder({
            value: value,
            fields: fields,
            onValueChanged: function(e) {
                e.component.option('value', e.value);
            }
        });

        // act
        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(3), 0);

        // assert
        assert.equal(getFilterBuilderGroups(container).length, 2, 'Group is not deleted');
    });

    QUnit.test('add/remove not valid conditions', function(assert) {
        const container = $('#container');
        let value = [['Zipcode', '']];
        const instance = container.dxFilterBuilder({
            value: value,
            fields: [fields[3]]
        }).dxFilterBuilder('instance');

        // add condition
        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_IMAGE_ADD_CLASS), 0);

        assert.equal(instance.option('value'), value);

        // remove condition
        value = instance.option('value');
        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(1), 0);

        assert.equal(instance.option('value'), value);
    });

    QUnit.test('change condition field', function(assert) {
        const container = $('#container');
        let value = [['CompanyName', 'K&S Music']];
        const instance = container.dxFilterBuilder({
            value: value,
            fields: fields
        }).dxFilterBuilder('instance');

        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_ITEM_FIELD_CLASS), 2);

        assert.notEqual(instance.option('value'), value);

        value = instance.option('value');
        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_ITEM_FIELD_CLASS), 2);

        assert.equal(instance.option('value'), value);
    });

    QUnit.test('change condition operation', function(assert) {
        const container = $('#container');
        let value = [['CompanyName', 'K&S Music']];
        const instance = container.dxFilterBuilder({
            value: value,
            fields: fields
        }).dxFilterBuilder('instance');

        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS), 2);

        assert.notEqual(instance.option('value'), value);

        value = instance.option('value');
        clickByButtonAndSelectMenuItem($('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS), 2);

        assert.equal(instance.option('value'), value);
    });

    QUnit.testInActiveWindow('change condition value by outer click', function(assert) {
        const container = $('#container');
        let value = [['State', '=', '']];
        const instance = container.dxFilterBuilder({
            value: value,
            fields: fields
        }).dxFilterBuilder('instance');

        changeValue(container, 'Test');
        clickByOutside();

        assert.notEqual(instance.option('value'), value);
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).length, 1);

        value = instance.option('value');

        changeValue(container, 'Test');
        clickByOutside();

        assert.equal(instance.option('value'), value);
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).length, 1);
    });

    QUnit.test('change between value', function(assert) {
        // arrange
        const fields = [{
            dataField: 'Field',
            dataType: 'number'
        }];
        const value = [
            ['Field', 'between', []]
        ];
        const instance = $('#container').dxFilterBuilder({
            value: value,
            fields: fields
        }).dxFilterBuilder('instance');

        // act
        clickByValue();

        const $editorStart = $('.' + FILTER_BUILDER_RANGE_START_CLASS);
        $editorStart.dxNumberBox('instance').option('value', 0);
        clickByOutside();

        // assert
        assert.deepEqual(instance.option('value')[2], [0, null]);

        // act
        instance.option('value', value);
        clickByValue();

        const $editorEnd = $('.' + FILTER_BUILDER_RANGE_END_CLASS);
        $editorEnd.dxNumberBox('instance').option('value', 0);
        clickByOutside();

        // assert
        assert.deepEqual(instance.option('value')[2], [null, 0]);
    });
});

QUnit.module('Methods', function() {
    QUnit.test('getFilterExpression', function(assert) {
        // arrange
        const instance = $('#container').dxFilterBuilder({
            value: [
                ['State', '<>', 'K&S Music'],
                'and',
                ['OrderDate', 'lastDay']
            ],
            fields: [{
                dataField: 'State',
                calculateFilterExpression: function(filterValue, selectedFieldOperation) {
                    return [[this.dataField, selectedFieldOperation, filterValue], 'and', [this.dataField, '=', 'Some state']];
                }
            }, {
                dataField: 'OrderDate'
            }],
            customOperations: [{
                name: 'lastDay',
                dataTypes: ['string'],
                calculateFilterExpression: function(filterValue, field) {
                    return [field.dataField, '>', '1'];
                }
            }]
        }).dxFilterBuilder('instance');

        // act, assert
        assert.deepEqual(instance.getFilterExpression(), [
            [
                ['State', '<>', 'K&S Music'],
                'and',
                ['State', '=', 'Some state']
            ],
            'and',
            ['OrderDate', '>', '1']
        ]);
    });

    // T624888
    QUnit.test('between is available in field.calculateFilterExpression', function(assert) {
        // arrange
        const instance = $('#container').dxFilterBuilder({
            value: [
                ['field', 'between', [1, 5]]
            ],
            fields: [{
                dataField: 'field',
                dataType: 'number',
                calculateFilterExpression: function(filterValue, selectedFieldOperation, target) {
                    assert.strictEqual(target, 'filterBuilder');
                    assert.strictEqual(selectedFieldOperation, 'between');
                    return [[this.dataField, '>', filterValue[0]], 'and', [this.dataField, '<', filterValue[1]]];
                }
            }]
        }).dxFilterBuilder('instance');

        // act, assert
        assert.deepEqual(instance.getFilterExpression(), [
            ['field', '>', 1],
            'and',
            ['field', '<', 5]
        ]);
    });
});

QUnit.module('Group operations', function() {
    const checkPopupDisabledState = function(assert, container) {
        const groupButton = container.find('.' + FILTER_BUILDER_GROUP_OPERATION_CLASS);
        groupButton.trigger('dxclick');
        const popup = container.find(`.${FILTER_BUILDER_OVERLAY_CLASS}`);

        assert.ok(groupButton.hasClass(DISABLED_STATE_CLASS));
        assert.equal(popup.length, 0);
    };

    QUnit.test('change groupOperation array', function(assert) {
        const container = $('#container');
        container.dxFilterBuilder({
            fields: fields,
            groupOperations: ['and', 'or']
        });
        container.find('.' + FILTER_BUILDER_GROUP_OPERATION_CLASS).trigger('dxclick');
        const items = $(`.${TREE_VIEW_ITEM_CLASS}`);

        assert.equal(items.length, 2);
        assert.equal(items.eq(0).text(), 'And');
        assert.equal(items.eq(1).text(), 'Or');
    });

    QUnit.test('group operation contains 1 item', function(assert) {
        const container = $('#container');
        container.dxFilterBuilder({
            fields: fields,
            groupOperations: ['and']
        });

        checkPopupDisabledState(assert, container);
    });

    QUnit.test('group operation does not contain items', function(assert) {
        const container = $('#container');
        container.dxFilterBuilder({
            fields: fields,
            groupOperations: []
        });

        checkPopupDisabledState(assert, container);
    });

    QUnit.test('group operation is undefined', function(assert) {
        const container = $('#container');
        container.dxFilterBuilder({
            fields: fields,
            groupOperations: undefined
        });

        checkPopupDisabledState(assert, container);
    });

    QUnit.test('adding of groups is disabled', function(assert) {
        const container = $('#container');
        container.dxFilterBuilder({
            fields: fields,
            maxGroupLevel: 0,
            groupOperations: undefined
        }).dxFilterBuilder('instance');

        $('.' + FILTER_BUILDER_IMAGE_ADD_CLASS).trigger('dxclick');
        const popup = container.find(`.${FILTER_BUILDER_OVERLAY_CLASS}`);

        assert.equal(popup.length, 0);
    });

    QUnit.test('nested level of groups = 1', function(assert) {
        const container = $('#container');
        container.dxFilterBuilder({
            fields: fields,
            maxGroupLevel: 1,
            groupOperations: undefined
        });

        $('.' + FILTER_BUILDER_IMAGE_ADD_CLASS).trigger('dxclick');
        let popup = container.find(`.${FILTER_BUILDER_OVERLAY_CLASS}`);
        assert.equal(popup.length, 1);

        selectMenuItem(1);

        $('.' + FILTER_BUILDER_IMAGE_ADD_CLASS).eq(1).trigger('dxclick');

        popup = container.find(`.${FILTER_BUILDER_OVERLAY_CLASS}`);
        assert.equal(popup.length, 0);
    });
});
