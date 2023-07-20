import $ from 'jquery';
import Class from 'core/class';
import DefaultAdapter from 'ui/validation/default_adapter';
import ValidationEngine from 'ui/validation_engine';
import Validator from 'ui/validator';

import 'ui/validation_summary';
import 'ui/text_box';

const VALIDATION_SUMMARY_CLASS = 'dx-validationsummary';

const Fixture = Class.inherit({
    createSummary: function(container, options) {
        this.$summaryContainer = $(container || '#dxSummary');
        return this.$summaryContainer.dxValidationSummary($.extend({}, options)).dxValidationSummary('instance');
    },

    createValidator: function(validatorOptions) {
        const $container = $('<div/>');
        this.stubAdapter = sinon.createStubInstance(DefaultAdapter);
        $container.appendTo('#qunit-fixture');
        return $container.dxValidator($.extend({
            adapter: this.stubAdapter
        }, validatorOptions)).dxValidator('instance');
    }
});


QUnit.testStart(function() {
    const markup = '\
    <div id="dxSummary"></div>\
    <div data-bind="dxValidationGroup: {}">\
        <div id="knockoutSummary" data-bind="dxValidationSummary: {}"></div>\
    </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('events', {
    beforeEach: function() {
        this.fixture = new Fixture();
    }
}, () => {
    QUnit.test('Check item click event subscription', function(assert) {
        const itemClickHandler = sinon.spy();
        const summary = this.fixture.createSummary(null, {
        });

        summary.on('itemClick', itemClickHandler);
        const validator = sinon.createStubInstance(Validator);

        summary._groupValidationHandler({
            isValid: false,
            brokenRules: [{
                type: 'required',
                validator: validator
            }],
            validators: [validator]
        });
        const itemElements = this.fixture.$summaryContainer.find('.dx-validationsummary-item');
        $(itemElements).eq(0).trigger('dxclick');

        assert.strictEqual(itemClickHandler.callCount, 1, 'Item click has been handled');
        assert.strictEqual(itemClickHandler.lastCall.args[0].itemIndex, 0, 'Item click handler should have arguments');
    });

    QUnit.test('Check item onClick subscription', function(assert) {
        const itemClickHandler = sinon.spy();
        const summary = this.fixture.createSummary(null, {
            onItemClick: itemClickHandler
        });
        const validator = sinon.createStubInstance(Validator);

        summary._groupValidationHandler({
            isValid: false,
            brokenRules: [{
                type: 'required',
                validator: validator
            }],
            validators: [validator]
        });

        const itemElements = this.fixture.$summaryContainer.find('.dx-validationsummary-item');
        itemElements.trigger('dxclick');

        assert.ok(itemClickHandler.calledOnce, 'Item click has been handled');
        assert.strictEqual(itemClickHandler.lastCall.args[0].itemIndex, 0, 'Item click handler should have arguments');
    });

    QUnit.test('Check item onContentReady subscription', function(assert) {
        const contentReadyHandler = sinon.spy();
        const group = 'group1';
        const validator = sinon.createStubInstance(Validator);
        validator.validate.returns({ isValid: true, brokenRule: null });
        ValidationEngine.registerValidatorInGroup(group, validator);

        this.fixture.createSummary(null, {
            validationGroup: group,
            onContentReady: contentReadyHandler
        });

        assert.strictEqual(contentReadyHandler.callCount, 1, 'contentReady has been handled');
        assert.ok(contentReadyHandler.lastCall.args[0].component, 'contentReady handler should have arguments');
        assert.ok(this.fixture.$summaryContainer.hasClass(VALIDATION_SUMMARY_CLASS), 'validation summary should be rendered');

        ValidationEngine.validateGroup(group);
        assert.strictEqual(contentReadyHandler.callCount, 2, 'contentReady has been handled');
    });

    QUnit.test('Check item contentReady event subscription', function(assert) {
        const contentReadyHandler = sinon.spy();
        const group = 'group1';
        const validator = sinon.createStubInstance(Validator);
        validator.validate.returns({ isValid: true, brokenRule: null });
        ValidationEngine.registerValidatorInGroup(group, validator);

        this.fixture.createSummary(null, {
            validationGroup: group,
            onInitialized: (e) => {
                e.component.on('contentReady', contentReadyHandler);
            }
        });

        assert.strictEqual(contentReadyHandler.callCount, 1, 'contentReady has been handled');
        assert.ok(contentReadyHandler.lastCall.args[0].component, 'contentReady handler should have arguments');
        assert.ok(this.fixture.$summaryContainer.hasClass(VALIDATION_SUMMARY_CLASS), 'validation summary should be rendered');

        ValidationEngine.validateGroup(group);
        assert.strictEqual(contentReadyHandler.callCount, 2, 'contentReady has been handled');
    });
});

QUnit.module('refreshValidationGroup method', {
    beforeEach: function() {
        this.fixture = new Fixture();
        this.validationGroup = 'groupName';
        this.$container = $('<div>').attr({ id: 'container' });
        this.failMessage = 'required';

        $('#qunit-fixture').append(this.$container);

        this.renderValidationGroup = () => {
            this.$editor = $('<div>')
                .dxTextBox({})
                .dxValidator({
                    validationRules: [{ type: 'required', message: this.failMessage }],
                    validationGroup: this.validationGroup
                });
            this.$editor.appendTo(this.$container);
        };
        this.removeValidationGroup = () => {
            this.$editor.remove();
        };

    },
    afterEach: function() {
        this.$container.remove();
    }
}, () => {
    QUnit.test('should resubsribe validation summary to a group with name specified in "validationGroup" property', function(assert) {
        this.renderValidationGroup();
        const summary = this.fixture.createSummary('#dxSummary', {
            validationGroup: this.validationGroup
        });

        this.removeValidationGroup();
        this.renderValidationGroup();
        summary.refreshValidationGroup();

        ValidationEngine.validateGroup(this.validationGroup);

        const summaryItems = summary.option('items');
        assert.strictEqual(summaryItems.length, 1, 'summary was resubscribed on recreated group');
        assert.strictEqual(summaryItems[0].text, this.failMessage, 'text is correct');
    });
});

