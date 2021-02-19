import $ from 'jquery';
import Class from 'core/class';
import ValidationEngine from 'ui/validation_engine';
import Validator from 'ui/validator';
import keyboardMock from '../../helpers/keyboardMock.js';
import '../../helpers/ignoreQuillTimers.js';

import 'generic_light.css!';
import 'ui/text_box';
import 'ui/date_box';
import 'ui/number_box';
import 'ui/autocomplete';
import 'ui/calendar';
import 'ui/check_box';
import 'ui/drop_down_box';
import 'ui/html_editor';
import 'ui/lookup';
import 'ui/radio_group';
import 'ui/select_box';
import 'ui/tag_box';
import 'ui/text_area';
import 'ui/slider';
import 'ui/range_slider';
import 'ui/switch';

const Fixture = Class.inherit({
    createInstance: function(editor, editorOptions, validatorOptions, keyboard = true) {
        const $element = $('<div/>').appendTo('#qunit-fixture');
        this.$element = $element[editor](editorOptions).dxValidator(validatorOptions);

        this.$input = $element.find('.dx-texteditor-input');

        if(keyboard) {
            this.keyboard = keyboardMock(this.$input);
        }
        this.editor = $element[editor]('instance');
        this.validator = Validator.getInstance($element);

        return $element;
    },

    createTextBoxWithValidator: function(validatorOptions) {
        this.$element = $('<div/>');
        const validator = this.$element.dxTextBox().dxValidator(validatorOptions).dxValidator('instance');
        return validator;
    },

    teardown: function() {
        this.$element.remove();
        ValidationEngine.initGroups();
    }
});

QUnit.module('Regression', {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('dateBox and Validator', function(assert) {
        this.fixture.createInstance('dxDateBox', { pickerType: 'calendar' }, { validationRules: [{ type: 'required' }] });

        this.fixture.keyboard.type('somethingwrong');
        this.fixture.$input.trigger('change');

        assert.strictEqual(this.fixture.editor.option('isValid'), false, 'Editor should be invalid because incorrect date was typed');
        const editorValidationError = this.fixture.editor.option('validationError');
        assert.ok(editorValidationError, 'Editor should have specific validation error');
        assert.ok(editorValidationError.editorSpecific, 'editorSpecific flag');
    });

    QUnit.test('T197118: dateBox and Validator simultaneous validation', function(assert) {
        this.fixture.createInstance('dxDateBox', { pickerType: 'calendar' }, { validationRules: [{ type: 'required' }] });

        this.fixture.keyboard.type('somethingwrong');
        this.fixture.$input.trigger('change');
        // action
        // validate Validator which is associated with Editor that is not ready for official validation
        this.fixture.validator.validate();

        assert.strictEqual(this.fixture.editor.option('isValid'), false, 'Editor should be invalid because incorrect date was typed');
        const editorValidationError = this.fixture.editor.option('validationError');
        assert.ok(editorValidationError, 'Editor should have specific validation error');
        assert.ok(editorValidationError.editorSpecific, 'editorSpecific flag');
    });

    QUnit.test('T197157: dateBox and Validator - validation with wrong-typed date', function(assert) {
        this.fixture.createInstance('dxDateBox', { pickerType: 'calendar' }, { validationRules: [{ type: 'required' }] });

        this.fixture.keyboard.type('somethingwrong');
        this.fixture.$input.trigger('change');
        this.fixture.validator.validate();

        this.fixture.$input.val('');
        // action
        // this should cause validation, and now - as empty string is "acceptable" date/time string for NULL date - it should result in "Required" validation
        this.fixture.$input.trigger('change');

        assert.strictEqual(this.fixture.editor.option('isValid'), false, 'Editor should be invalid because incorrect date was typed');
        const editorValidationError = this.fixture.editor.option('validationError');
        assert.ok(editorValidationError, 'Editor should have specific validation error');
        assert.strictEqual(editorValidationError.editorSpecific, undefined, 'editorSpecific flag should not be set');
        assert.strictEqual(editorValidationError.message, 'Required', 'Message should came from dxValidator');
    });

    QUnit.test('T525700: numberBox and Validator - validation on focusout with validation rule range', function(assert) {
        this.fixture.createInstance('dxNumberBox', {}, { validationRules: [{ type: 'range', min: 100 }] });

        this.fixture.keyboard.type('1');
        this.fixture.$input.trigger('change');
        // action
        this.fixture.$input.trigger('focusout');

        assert.strictEqual(this.fixture.editor.option('isValid'), false, 'Editor should be invalid because value is less then min');
        const editorValidationError = this.fixture.editor.option('validationError');
        assert.ok(editorValidationError, 'Editor should have specific validation error');
        assert.strictEqual(editorValidationError.message, 'Value is out of range', 'Message should came from dxValidator');
    });

    QUnit.test('T260652: disabled widgets should not be validated', function(assert) {
        this.fixture.createInstance('dxTextBox', { value: '', disabled: true }, { validationRules: [{ type: 'required' }] });

        const result = this.fixture.validator.validate();

        assert.strictEqual(result.isValid, true, 'Disabled widget should bypass validation');
    });

    QUnit.test('T426721: dxValidator text jumps during validation', function(assert) {
        const validator = this.fixture.createTextBoxWithValidator({ validationRules: [{ type: 'required' }] });
        const textBox = this.fixture.$element.dxTextBox('instance');

        try {
            this.fixture.$element.appendTo('#qunit-fixture');

            textBox.option('templatesRenderAsynchronously', true);

            validator.validate();

            const $overlayWrapper = validator.$element().find('.dx-overlay-wrapper');

            assert.equal($overlayWrapper.length, 1, 'validation message not blinking on render');
        } finally {
            this.fixture.$element.remove();
        }
    });

    QUnit.test('Validator message does not detached when parent scrolled', function(assert) {
        const validator = this.fixture.createTextBoxWithValidator({ validationRules: [{ type: 'required' }] });
        const topDiff = 22;

        $('<div style=\'height: 100px\'/>').insertAfter(
            this.fixture.$element.wrap('<div id=\'bingo\' style=\'overflow-y: scroll; height: 100px\' />')
        );
        const $scrollableWrapper = validator.$element().parent().appendTo('body');

        validator.validate();

        const top1 = validator.$element().find('.dx-overlay').offset().top;
        $scrollableWrapper.scrollTop(topDiff);
        const top2 = validator.$element().find('.dx-overlay').offset().top;

        assert.roughEqual(top1 - top2 - topDiff, 0, 0.01, 'message overlay was not detached from input');
    });

    QUnit.test('NumberBox and Validator', function(assert) {
        this.fixture.createInstance('dxNumberBox', { }, { validationRules: [{ type: 'required' }] });

        this.fixture.editor.option('value', 'asd');

        assert.strictEqual(this.fixture.editor.option('isValid'), false, 'Editor should be invalid because of empty value');

        const editorValidationError = this.fixture.editor.option('validationError');
        assert.ok(editorValidationError, 'Editor should have specific validation error');
        assert.ok(editorValidationError.editorSpecific, 'editorSpecific flag');
    });

    QUnit.test('NumberBox and Validator with the \'required\' rule (T368398)', function(assert) {
        this.fixture.createInstance('dxNumberBox', { }, { validationRules: [{ type: 'required' }] });

        this.fixture.validator.validate();
        this.fixture.$input.val('1').trigger('change');
        this.fixture.$input.val('').trigger('change');

        assert.strictEqual(this.fixture.editor.option('isValid'), false, 'Editor should be invalid because of empty value');
    });

    [
        'dxAutocomplete', 'dxCalendar', 'dxCheckBox', 'dxDateBox',
        'dxDropDownBox', 'dxHtmlEditor', 'dxLookup', 'dxRadioGroup',
        'dxRangeSlider', 'dxSelectBox', 'dxSlider', 'dxSwitch',
        'dxTagBox', 'dxTextArea', 'dxTextBox'
    ].forEach(editor => {
        QUnit.test(`${editor}.reset should not validate the default value`, function(assert) {
            const validationCallback = sinon.spy();
            this.fixture.createInstance(editor, { }, {
                validationRules: [{
                    type: 'custom',
                    validationCallback
                }]
            }, false);

            this.fixture.editor.reset();

            assert.notOk(validationCallback.called, 'validationCallback should not be called');
        });

        QUnit.test(`Validator.reset should not validate the default value for ${editor}`, function(assert) {
            const validationCallback = sinon.spy();
            this.fixture.createInstance(editor, { }, {
                validationRules: [{
                    type: 'custom',
                    validationCallback
                }]
            }, false);

            this.fixture.validator.reset();

            assert.notOk(validationCallback.called, 'validationCallback should not be called');
        });
    });

    QUnit.test('NumberBox.reset should validate the default value', function(assert) {
        const validationCallback = sinon.spy();
        this.fixture.createInstance('dxNumberBox', { }, {
            validationRules: [{
                type: 'custom',
                validationCallback
            }]
        }, false);

        this.fixture.editor.reset();
        // This happens because the default dxNumberBox.value is 0, but the dxNumberBox.reset method resets it to null.
        // Validation is executed due to the valueChanged event.
        // When we decide to break this behavior, we can add "dxNumberBox" to the editors array in the test case above and delete this test.
        assert.ok(validationCallback.called, 'validationCallback should be called after dxNumberBox.reset');
    });

    QUnit.test('Validator.reset should not validate the default NumberBox value', function(assert) {
        const validationCallback = sinon.spy();
        this.fixture.createInstance('dxNumberBox', { }, {
            validationRules: [{
                type: 'custom',
                validationCallback
            }]
        }, false);

        this.fixture.validator.reset();

        assert.notOk(validationCallback.called, 'validationCallback should not be called');
    });

    QUnit.test('Validator should not toggle the "dx-rtl" class', function(assert) {
        this.fixture.createInstance('dxTextBox', { rtlEnabled: true }, {
            rtlEnabled: false,
            validationRules: [{
                type: 'required'
            }]
        }, false);

        assert.ok(this.fixture.$element.hasClass('dx-rtl'), 'Root element has the "dx-rtl" class');
    });
});

