import ValidationMessage from 'ui/validationMessage';
import $ from 'jquery';

const moduleSetup = {
    beforeEach: function() {
        this._$validationMessage = $('<div>').attr('id', 'validationMessage').appendTo('#qunit-fixture');
        this._validationMessage = new ValidationMessage(this._$validationMessage);
    },
    afterEach: function() {
        this._$validationMessage.remove();
    }
};

QUnit.module('markup', moduleSetup, () => {
    QUnit.test('element and overlay wrapper should have invalid message class', function(assert) {
        assert.ok(this._$validationMessage.hasClass('dx-invalid-message'), 'element has correct class');
        assert.ok(this._validationMessage._wrapper().hasClass('dx-invalid-message'), 'overlay wrapper has correct class');
    });

    QUnit.test('mode option change should toggle element class', function(assert) {
        assert.ok(this._$validationMessage.hasClass('dx-invalid-message-auto'), 'class is correct on init');

        this._validationMessage.option('mode', 'always');
        assert.ok(this._$validationMessage.hasClass('dx-invalid-message-always'), 'class is correct after runtime option change');

        this._validationMessage.option('mode', 'auto');
        assert.ok(this._$validationMessage.hasClass('dx-invalid-message-auto'), 'class is correct after runtime option change');
    });

    QUnit.test('overlay content should have "dx-invalid-message-content" class', function(assert) {
        assert.ok(this._validationMessage.$content().hasClass('dx-invalid-message-content'), 'overlay content has correct class');
    });

    QUnit.test('overlay content should have id attr', function(assert) {
        assert.ok(this._validationMessage.$content().attr('id'), 'overlay content has id attr');
    });
});
