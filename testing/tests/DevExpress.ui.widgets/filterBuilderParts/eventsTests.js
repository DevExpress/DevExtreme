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
        const spy = sinon.spy();
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['CompanyName', '=', 'DevExpress']
            ],
            fields: fields,
            onEditorPreparing: spy
        });

        // act
        const companyNameValueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        companyNameValueField.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        // assert
        const args = spy.args[0][0];
        assert.strictEqual(spy.callCount, 1, 'onEditorPreparing is called');
        assert.strictEqual(args.dataField, 'CompanyName', 'args -> dataField');
        assert.strictEqual(args.value, 'DevExpress', 'args -> value');
        assert.strictEqual(args.filterOperation, '=', 'args -> filterOperation');
        assert.deepEqual(args.component, container.dxFilterBuilder('instance'), 'args -> component');
    });

    QUnit.test('onEditorPreparing for between', function(assert) {
        // arrange
        const spy = sinon.spy();
        const container = $('#container');

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
        const companyNameValueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        companyNameValueField.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        // assert
        assert.strictEqual(spy.callCount, 2, 'onEditorPreparing is called');

        const startArgs = spy.args[0][0];
        assert.strictEqual(startArgs.value, 1, 'args -> value');
        assert.strictEqual(startArgs.filterOperation, 'between', 'args -> filterOperation');

        const endArgs = spy.args[1][0];
        assert.strictEqual(endArgs.value, 2, 'args -> value');
        assert.strictEqual(endArgs.filterOperation, 'between', 'args -> filterOperation');
    });

    QUnit.test('onEditorPrepared', function(assert) {
        // arrange
        const spy = sinon.spy();
        const container = $('#container');

        container.dxFilterBuilder({
            value: [
                ['CompanyName', '=', 'DevExpress']
            ],
            fields: fields,
            onEditorPrepared: spy
        });

        // act
        const companyNameValueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        companyNameValueField.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        // assert
        const args = spy.args[0][0];
        assert.strictEqual(spy.callCount, 1, 'onEditorPrepared is called');
        assert.strictEqual(args.dataField, 'CompanyName', 'args -> dataField');
        assert.strictEqual(args.value, 'DevExpress', 'args -> value');
        assert.strictEqual(args.filterOperation, '=', 'args -> filterOperation');
        assert.deepEqual(args.component, container.dxFilterBuilder('instance'), 'args -> component');
    });

    QUnit.test('onEditorPrepared for between', function(assert) {
        // arrange
        const spy = sinon.spy();
        const container = $('#container');

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
        const companyNameValueField = $('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        companyNameValueField.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        // assert
        assert.strictEqual(spy.callCount, 2, 'onEditorPrepared is called');

        const startArgs = spy.args[0][0];
        assert.strictEqual(startArgs.value, 1, 'args -> value');
        assert.strictEqual(startArgs.filterOperation, 'between', 'args -> filterOperation');

        const endArgs = spy.args[1][0];
        assert.strictEqual(endArgs.value, 2, 'args -> value');
        assert.strictEqual(endArgs.filterOperation, 'between', 'args -> filterOperation');
    });

    QUnit.test('Clear keyup & dxpointerdown events after dispose', function(assert) {
        // arrange
        const dxPointerDownSpy = sinon.spy();
        const keyUpSpy = sinon.spy();
        const container = $('#container');

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
        const spy = sinon.spy();
        const container = $('#container');

        container.dxFilterBuilder({
            value: ['Zipcode', '=', '666'],
            fields: fields,
            onValueChanged: spy
        });

        // act
        container.dxFilterBuilder('instance').option('value', ['CompanyName', '=', 'DevExpress']);

        // assert
        const args = spy.args[0][0];
        assert.strictEqual(spy.callCount, 1, 'onValueChanged is called');
        assert.deepEqual(args.previousValue, ['Zipcode', '=', '666'], 'previous value');
        assert.deepEqual(args.value, ['CompanyName', '=', 'DevExpress'], 'current value');
    });

    // T732074
    QUnit.test('Change value in onValueChanged on remove item', function(assert) {
        // arrange
        const container = $('#container');

        const filterBuilder = container.dxFilterBuilder({
            value: ['Zipcode', '=', '666'],
            fields: fields,
            onValueChanged: function(e) {
                if(e.value === null) {
                    e.component.option('value', ['CompanyName', '=', 'DevExpress']);
                }
            }
        }).dxFilterBuilder('instance');

        // act
        const $removeButton = $('.' + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(0);
        $removeButton.trigger('dxclick');

        // assert
        assert.deepEqual(filterBuilder.option('value'), ['CompanyName', '=', 'DevExpress'], 'value');
        assert.deepEqual(filterBuilder.getFilterExpression(), ['CompanyName', '=', 'DevExpress'], 'filter expression');
        assert.equal(container.find('.' + FILTER_BUILDER_ITEM_FIELD_CLASS).length, 1, 'field item count');
    });

    QUnit.test('Skip the onValueChanged after change operation of an invalid condition to another invalid condition ', function(assert) {
        // arrange
        const spy = sinon.spy();
        const container = $('#container');

        container.dxFilterBuilder({
            value: ['NumberField', '=', ''],
            fields: fields,
            onValueChanged: spy
        });

        // act
        const $operationButton = container.find('.' + FILTER_BUILDER_ITEM_OPERATION_CLASS);
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
        const spy = sinon.spy();
        const container = $('#container');

        container.dxFilterBuilder({
            value: ['NumberField', '=', ''],
            fields: fields,
            onValueChanged: spy
        });

        // act
        const $fieldButton = container.find('.' + FILTER_BUILDER_ITEM_FIELD_CLASS);
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
        const spy = sinon.spy();
        const container = $('#container');

        container.dxFilterBuilder({
            value: [['NumberField', '=', ''], 'and', ['NumberField', '=', '']],
            fields: fields,
            onValueChanged: spy
        });

        // act
        const $groupButton = container.find('.' + FILTER_BUILDER_GROUP_OPERATION_CLASS);
        clickByButtonAndSelectMenuItem($groupButton, 1);
        // assert
        assert.strictEqual($groupButton.text(), 'Or');
        assert.strictEqual(spy.callCount, 0, 'onValueChanged is not called'); // group is not valid

        // act
        const $fieldButton = container.find('.' + FILTER_BUILDER_ITEM_FIELD_CLASS);
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

    // T978958
    QUnit.test('onValueChanged after change group operation from negative to positive and remove child', function(assert) {
        // arrange
        const container = $('#container');
        const onValueChangedSpy = sinon.spy();


        const filterBuilder = container.dxFilterBuilder({
            value: ['!', [['Zipcode', '=', 1], 'or', ['Zipcode', '=', 2]]],
            fields: fields,
            onValueChanged: onValueChangedSpy
        }).dxFilterBuilder('instance');

        // act
        const $groupButton = container.find('.' + FILTER_BUILDER_GROUP_OPERATION_CLASS);
        clickByButtonAndSelectMenuItem($groupButton, 0);

        // assert
        assert.strictEqual(onValueChangedSpy.callCount, 1, 'onValueChanged is called');

        // act
        const $removeButton = $('.' + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(0);
        $removeButton.trigger('dxclick');

        // assert
        assert.strictEqual(onValueChangedSpy.callCount, 2, 'onValueChanged is called');
        assert.deepEqual(filterBuilder.option('value'), ['Zipcode', '=', 2], 'value');
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
        const spy = sinon.spy();
        const container = $('#container');

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

        const $addButton = $('.' + FILTER_BUILDER_IMAGE_ADD_CLASS).eq(0);
        clickByButtonAndSelectMenuItem($addButton, 0);
        assert.strictEqual(spy.callCount, 4);

        clickByButtonAndSelectMenuItem($addButton, 1);
        assert.strictEqual(spy.callCount, 5);

        const $removeButton = $('.' + FILTER_BUILDER_IMAGE_REMOVE_CLASS).eq(0);
        $removeButton.trigger('dxclick');
        assert.strictEqual(spy.callCount, 6);
    });

    QUnit.test('valueChanged should not be raised for both widgets (T935367)', function(assert) {
        // arrange
        const valueChangedSpy1 = sinon.spy();
        const valueChangedSpy2 = sinon.spy();
        const $container1 = $('#container');
        const $container2 = $('#container1');

        const filterBuilder1 = $container1.dxFilterBuilder({
            value: ['Zipcode', '=', '555'],
            fields: fields
        }).dxFilterBuilder('instance');
        filterBuilder1.on('valueChanged', valueChangedSpy1);

        const filterBuilder2 = $container2.dxFilterBuilder({
            value: ['Zipcode', '=', '555'],
            fields: fields
        }).dxFilterBuilder('instance');
        filterBuilder2.on('valueChanged', valueChangedSpy2);

        // act
        filterBuilder1.option('value', ['CompanyName', '=', 'DevExpress1']);
        filterBuilder2.option('value', ['CompanyName', '=', 'DevExpress2']);

        const args1 = valueChangedSpy1.args[0][0];
        const args2 = valueChangedSpy2.args[0][0];

        // assert
        assert.strictEqual(valueChangedSpy1.callCount, 1, 'valueChanged of the first widget is called once');
        assert.deepEqual(args1.value, ['CompanyName', '=', 'DevExpress1'], 'value of the first widget');
        assert.strictEqual(valueChangedSpy2.callCount, 1, 'valueChanged of the second widget is called once');
        assert.deepEqual(args2.value, ['CompanyName', '=', 'DevExpress2'], 'value of the second widget');
    });

    QUnit.test('editorPreparing should not be raised for both widgets (T935367)', function(assert) {
        // arrange
        const valueChangedSpy1 = sinon.spy();
        const valueChangedSpy2 = sinon.spy();
        const $container1 = $('#container');
        const $container2 = $('#container1');

        const filterBuilder1 = $container1.dxFilterBuilder({
            value: [
                ['CompanyName', '=', 'DevExpress']
            ],
            fields: fields
        }).dxFilterBuilder('instance');
        filterBuilder1.on('editorPreparing', valueChangedSpy1);

        const filterBuilder2 = $container2.dxFilterBuilder({
            value: [
                ['CompanyName', '=', 'DevExpress']
            ],
            fields: fields
        }).dxFilterBuilder('instance');
        filterBuilder2.on('editorPreparing', valueChangedSpy2);

        // act
        const $companyNameValueField1 = $container1.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        $companyNameValueField1.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        const $companyNameValueField2 = $container2.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        $companyNameValueField2.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        const args1 = valueChangedSpy1.args[0][0];
        const args2 = valueChangedSpy2.args[0][0];

        // assert
        assert.strictEqual(valueChangedSpy1.callCount, 1, 'editorPreparing of the first widget is called once');
        assert.strictEqual(args1.dataField, 'CompanyName', 'args -> dataField of the first widget');
        assert.strictEqual(args1.value, 'DevExpress', 'args -> value of the first widget');
        assert.strictEqual(args1.filterOperation, '=', 'args -> filterOperation of the first widget');
        assert.strictEqual(args1.component, filterBuilder1, 'args -> component of the first widget');
        assert.strictEqual(valueChangedSpy2.callCount, 1, 'editorPreparing of the second widget is called once');
        assert.strictEqual(args2.dataField, 'CompanyName', 'args -> dataField of the second widget');
        assert.strictEqual(args2.value, 'DevExpress', 'args -> value of the second widget');
        assert.strictEqual(args2.filterOperation, '=', 'args -> filterOperation of the second widget');
        assert.strictEqual(args2.component, filterBuilder2, 'args -> component of the second widget');
    });

    QUnit.test('editorPrepared should not be raised for both widgets (T935367)', function(assert) {
        // arrange
        const valueChangedSpy1 = sinon.spy();
        const valueChangedSpy2 = sinon.spy();
        const $container1 = $('#container');
        const $container2 = $('#container1');

        const filterBuilder1 = $container1.dxFilterBuilder({
            value: [
                ['CompanyName', '=', 'DevExpress']
            ],
            fields: fields
        }).dxFilterBuilder('instance');
        filterBuilder1.on('editorPrepared', valueChangedSpy1);

        const filterBuilder2 = $container2.dxFilterBuilder({
            value: [
                ['CompanyName', '=', 'DevExpress']
            ],
            fields: fields
        }).dxFilterBuilder('instance');
        filterBuilder2.on('editorPrepared', valueChangedSpy2);

        // act
        const $companyNameValueField1 = $container1.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        $companyNameValueField1.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        const $companyNameValueField2 = $container2.find('.' + FILTER_BUILDER_ITEM_VALUE_CLASS).eq(0);
        $companyNameValueField2.find('.' + FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).trigger('dxclick');

        const args1 = valueChangedSpy1.args[0][0];
        const args2 = valueChangedSpy2.args[0][0];

        // assert
        assert.strictEqual(valueChangedSpy1.callCount, 1, 'editorPrepared of the first widget is called once');
        assert.strictEqual(args1.dataField, 'CompanyName', 'args -> dataField of the first widget');
        assert.strictEqual(args1.value, 'DevExpress', 'args -> value of the first widget');
        assert.strictEqual(args1.filterOperation, '=', 'args -> filterOperation of the first widget');
        assert.strictEqual(args1.component, filterBuilder1, 'args -> component of the first widget');
        assert.strictEqual(valueChangedSpy2.callCount, 1, 'editorPrepared of the second widget is called once');
        assert.strictEqual(args2.dataField, 'CompanyName', 'args -> dataField of the second widget');
        assert.strictEqual(args2.value, 'DevExpress', 'args -> value of the second widget');
        assert.strictEqual(args2.filterOperation, '=', 'args -> filterOperation of the second widget');
        assert.strictEqual(args2.component, filterBuilder2, 'args -> component of the second widget');
    });
});
