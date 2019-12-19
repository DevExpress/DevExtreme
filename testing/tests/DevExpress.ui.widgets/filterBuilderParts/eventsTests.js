import $ from 'jquery';
import fields from '../../../helpers/filterBuilderTestData.js';

import {
    FILTER_BUILDER_ITEM_OPERATION_CLASS,
    FILTER_BUILDER_ITEM_FIELD_CLASS,
    FILTER_BUILDER_ITEM_VALUE_CLASS,
    FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS,
    FILTER_BUILDER_IMAGE_ADD_CLASS,
    FILTER_BUILDER_IMAGE_REMOVE_CLASS,
    FILTER_BUILDER_GROUP_OPERATION_CLASS
} from './constants.js';

import {
    clickByButtonAndSelectMenuItem,
    clickByValue,
    clickByOutside
} from './helpers.js';

import 'ui/filter_builder/filter_builder';

QUnit.module('Events', function() {
    QUnit.test('onEditorPreparing', function(assert) {
        // arrange
        var args,
            spy = sinon.spy(),
            container = $('#container'),
            companyNameValueField;

        container.dxFilterBuilder({
            value: [
                ['CompanyName', '=', 'DevExpress']
            ],
            fields: fields,
            onEditorPreparing: spy
        });

        // act
        companyNameValueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        companyNameValueField.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        // assert
        args = spy.args[0][0];
        assert.strictEqual(spy.callCount, 1, 'onEditorPreparing is called');
        assert.strictEqual(args.dataField, 'CompanyName', 'args -> dataField');
        assert.strictEqual(args.value, 'DevExpress', 'args -> value');
        assert.strictEqual(args.filterOperation, '=', 'args -> filterOperation');
        assert.deepEqual(args.component, container.dxFilterBuilder('instance'), 'args -> component');
    });

    QUnit.test('onEditorPreparing for between', function(assert) {
        // arrange
        var spy = sinon.spy(),
            container = $('#container'),
            companyNameValueField;

        container.dxFilterBuilder({
            value: [
                ['Field', 'between', [1, 2]]
            ],
            fields: [{
                dataField: 'Field',
                dataType: 'number'
            }],
            onEditorPreparing: spy
        });

        // act
        companyNameValueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        companyNameValueField.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        // assert
        assert.strictEqual(spy.callCount, 2, 'onEditorPreparing is called');

        var startArgs = spy.args[0][0];
        assert.strictEqual(startArgs.value, 1, 'args -> value');
        assert.strictEqual(startArgs.filterOperation, 'between', 'args -> filterOperation');

        var endArgs = spy.args[1][0];
        assert.strictEqual(endArgs.value, 2, 'args -> value');
        assert.strictEqual(endArgs.filterOperation, 'between', 'args -> filterOperation');
    });

    QUnit.test('onEditorPrepared', function(assert) {
        // arrange
        var args,
            spy = sinon.spy(),
            container = $('#container'),
            companyNameValueField;

        container.dxFilterBuilder({
            value: [
                ['CompanyName', '=', 'DevExpress']
            ],
            fields: fields,
            onEditorPrepared: spy
        });

        // act
        companyNameValueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        companyNameValueField.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        // assert
        args = spy.args[0][0];
        assert.strictEqual(spy.callCount, 1, 'onEditorPrepared is called');
        assert.strictEqual(args.dataField, 'CompanyName', 'args -> dataField');
        assert.strictEqual(args.value, 'DevExpress', 'args -> value');
        assert.strictEqual(args.filterOperation, '=', 'args -> filterOperation');
        assert.deepEqual(args.component, container.dxFilterBuilder('instance'), 'args -> component');
    });

    QUnit.test('onEditorPrepared for between', function(assert) {
        // arrange
        var spy = sinon.spy(),
            container = $('#container'),
            companyNameValueField;

        container.dxFilterBuilder({
            value: [
                ['Field', 'between', [1, 2]]
            ],
            fields: [{
                dataField: 'Field',
                dataType: 'number'
            }],
            onEditorPrepared: spy
        });

        // act
        companyNameValueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        companyNameValueField.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        // assert
        assert.strictEqual(spy.callCount, 2, 'onEditorPrepared is called');

        var startArgs = spy.args[0][0];
        assert.strictEqual(startArgs.value, 1, 'args -> value');
        assert.strictEqual(startArgs.filterOperation, 'between', 'args -> filterOperation');

        var endArgs = spy.args[1][0];
        assert.strictEqual(endArgs.value, 2, 'args -> value');
        assert.strictEqual(endArgs.filterOperation, 'between', 'args -> filterOperation');
    });

    QUnit.test('Clear keyup & dxpointerdown events after dispose', function(assert) {
        // arrange
        let dxPointerDownSpy = sinon.spy(),
            keyUpSpy = sinon.spy(),
            container = $('#container');

        const filterBuilder = container.dxFilterBuilder({
            value: ['NumberField', '=', ''],
            fields: fields
        }).dxFilterBuilder('instance');

        filterBuilder._addDocumentClick = function() {
            $(document).on('dxpointerdown', dxPointerDownSpy);
            this._documentClickHandler = dxPointerDownSpy;
        };
        filterBuilder._addDocumentKeyUp = function() {
            $(document).on('keyup', keyUpSpy);
            this._documentKeyUpHandler = keyUpSpy;
        };

        // act
        clickByValue();
        // assert
        assert.strictEqual(dxPointerDownSpy.callCount, 0);
        assert.strictEqual(keyUpSpy.callCount, 0);

        // act
        $(document).trigger('dxpointerdown');
        $(document).trigger('keyup');
        // assert
        assert.strictEqual(dxPointerDownSpy.callCount, 1);
        assert.strictEqual(keyUpSpy.callCount, 1);

        // act
        container.remove();
        $(document).trigger('dxpointerdown');
        $(document).trigger('keyup');
        // assert
        assert.strictEqual(dxPointerDownSpy.callCount, 1);
        assert.strictEqual(keyUpSpy.callCount, 1);
    });

    QUnit.test('onValueChanged', function(assert) {
        // arrange
        var args,
            spy = sinon.spy(),
            container = $('#container');

        container.dxFilterBuilder({
            value: ['Zipcode', '=', '666'],
            fields: fields,
            onValueChanged: spy
        });

        // act
        container.dxFilterBuilder('instance').option('value', ['CompanyName', '=', 'DevExpress']);

        // assert
        args = spy.args[0][0];
        assert.strictEqual(spy.callCount, 1, 'onValueChanged is called');
        assert.deepEqual(args.previousValue, ['Zipcode', '=', '666'], 'previous value');
        assert.deepEqual(args.value, ['CompanyName', '=', 'DevExpress'], 'current value');
    });

    // T732074
    QUnit.test('Change value in onValueChanged on remove item', function(assert) {
        // arrange
        var container = $('#container');

        var filterBuilder = container.dxFilterBuilder({
            value: ['Zipcode', '=', '666'],
            fields: fields,
            onValueChanged: function(e) {
                if(e.value === null) {
                    e.component.option('value', ['CompanyName', '=', 'DevExpress']);
                }
            }
        }).dxFilterBuilder('instance');

        // act
        var $removeButton = $('.' + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(0);
        $removeButton.trigger('dxclick');

        // assert
        assert.deepEqual(filterBuilder.option('value'), ['CompanyName', '=', 'DevExpress'], 'value');
        assert.deepEqual(filterBuilder.getFilterExpression(), ['CompanyName', '=', 'DevExpress'], 'filter expression');
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_FIELD_CLASS).length, 1, 'field item count');
    });

    QUnit.test('Skip the onValueChanged after change operation of an invalid condition to another invalid condition ', function(assert) {
        // arrange
        var spy = sinon.spy(),
            container = $('#container');

        container.dxFilterBuilder({
            value: ['NumberField', '=', ''],
            fields: fields,
            onValueChanged: spy
        });

        // act
        var $operationButton = container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS);
        clickByButtonAndSelectMenuItem($operationButton, 1);
        // assert
        assert.strictEqual($operationButton.text(), 'Does not equal');
        assert.strictEqual(spy.callCount, 0, 'onValueChanged is not called'); // operation has invalid condition and it was invalid before

        // act
        clickByButtonAndSelectMenuItem($operationButton, 6);
        // assert
        assert.strictEqual($operationButton.text(), 'Is blank');
        assert.strictEqual(spy.callCount, 1, 'onValueChanged is called'); // isblank has a valid condition

        // act
        clickByButtonAndSelectMenuItem($operationButton, 7);
        // assert
        assert.strictEqual($operationButton.text(), 'Is not blank');
        assert.strictEqual(spy.callCount, 2, 'onValueChanged is called'); // is not blank has a valid condition

        // act
        clickByButtonAndSelectMenuItem($operationButton, 1);
        // assert
        assert.strictEqual($operationButton.text(), 'Does not equal');
        assert.strictEqual(spy.callCount, 3, 'onValueChanged is called'); // operation has invalid condition but it was a valid before
    });

    QUnit.test('onValueChanged after change field', function(assert) {
        // arrange
        var spy = sinon.spy(),
            container = $('#container');

        container.dxFilterBuilder({
            value: ['NumberField', '=', ''],
            fields: fields,
            onValueChanged: spy
        });

        // act
        var $fieldButton = container.find('.' + FILTER_BUILDER_ITEM_FIELD_CLASS);
        clickByButtonAndSelectMenuItem($fieldButton, 3);
        // assert
        assert.strictEqual($fieldButton.text(), 'Zipcode');
        assert.strictEqual(spy.callCount, 0, 'onValueChanged is not called');

        // act
        clickByButtonAndSelectMenuItem($fieldButton, 0);
        // assert
        assert.strictEqual($fieldButton.text(), 'Company Name');
        assert.strictEqual(spy.callCount, 0, 'onValueChanged is not called'); // field has an invalid condition by default

        // act
        clickByButtonAndSelectMenuItem($fieldButton, 6);
        // assert
        assert.strictEqual($fieldButton.text(), 'Caption of Object Field');
        assert.strictEqual(spy.callCount, 1, 'onValueChanged is called'); // field has a valid condition by default
    });

    QUnit.test('onValueChanged after change groupValue', function(assert) {
        // arrange
        var spy = sinon.spy(),
            container = $('#container');

        container.dxFilterBuilder({
            value: [['NumberField', '=', ''], 'and', ['NumberField', '=', '']],
            fields: fields,
            onValueChanged: spy
        });

        // act
        var $groupButton = container.find('.' + FILTER_BUILDER_GROUP_OPERATION_CLASS);
        clickByButtonAndSelectMenuItem($groupButton, 1);
        // assert
        assert.strictEqual($groupButton.text(), 'Or');
        assert.strictEqual(spy.callCount, 0, 'onValueChanged is not called'); // group is not valid

        // act
        var $fieldButton = container.find('.' + FILTER_BUILDER_ITEM_FIELD_CLASS);
        clickByButtonAndSelectMenuItem($fieldButton.eq(0), 6);
        clickByButtonAndSelectMenuItem($fieldButton.eq(1), 6);
        // assert
        assert.strictEqual(spy.callCount, 2, 'onValueChanged is called'); // field has a valid condition by default

        // act
        clickByButtonAndSelectMenuItem($groupButton, 0);
        // assert
        assert.strictEqual($groupButton.text(), 'And');
        assert.strictEqual(spy.callCount, 3, 'onValueChanged is called'); // group is valid
    });

    QUnit.test('onInitialized', function(assert) {
        assert.expect(1);
        $('#container').dxFilterBuilder({
            value: ['Field', 'between', [666, 777]],
            fields: [{
                dataField: 'Field',
                dataType: 'number'
            }],
            onInitialized: function(e) {
                assert.deepEqual(e.component.getFilterExpression(), [['Field', '>=', 666], 'and', ['Field', '<=', 777]]);
            }
        });
    });

    // T701542
    QUnit.test('Content ready', function(assert) {
        // arrange
        var spy = sinon.spy(),
            container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['CompanyName', '=', 'DevExpress']
            ],
            fields: fields,
            onContentReady: spy
        });

        assert.strictEqual(spy.callCount, 1);

        clickByValue();
        assert.strictEqual(spy.callCount, 2);

        clickByOutside();
        assert.strictEqual(spy.callCount, 3);

        var $addButton = $('.' + FILTER_BUILDER_IMAGE_ADD_CLASS).eq(0);
        clickByButtonAndSelectMenuItem($addButton, 0);
        assert.strictEqual(spy.callCount, 4);

        clickByButtonAndSelectMenuItem($addButton, 1);
        assert.strictEqual(spy.callCount, 5);

        var $removeButton = $('.' + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(0);
        $removeButton.trigger('dxclick');
        assert.strictEqual(spy.callCount, 6);
    });
});
