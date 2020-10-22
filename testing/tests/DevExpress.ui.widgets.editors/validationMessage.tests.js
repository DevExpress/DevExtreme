import ValidationMessage from 'ui/validation_message';
import $ from 'jquery';

const moduleSetup = {
    beforeEach: function() {
        this._$container = $('<div>').appendTo('#qunit-fixture');
        this._$validationMessage = $('<div>').attr('id', 'validationMessageRootElement').appendTo(this._$container);
        this._validationMessage = new ValidationMessage(this._$validationMessage);
    },
    afterEach: function() {
        this._$container.remove();
    }
};

QUnit.module('options', moduleSetup, () => {
    QUnit.test('default maxWidth should be 100%', function(assert) {
        assert.strictEqual(this._validationMessage.option('maxWidth'), '100%', 'default maxWidth was calculated correctly');
    });

    QUnit.test('maxWidth option should be updated after target option change', function(assert) {
        const $target = $('<div>').attr('id', 'target');
        $target.outerWidth = () => {
            return 120;
        };

        try {
            $target.appendTo('#qunit-fixture');
            this._validationMessage.option('target', $target);
            assert.strictEqual(this._validationMessage.option('maxWidth'), 120, 'maxWidth was updated');
        } finally {
            $target.remove();
        }
    });

    QUnit.test('position should be recalculated after target option runtime change', function(assert) {
        const $element = $('<div>');

        try {
            $element.appendTo('#qunit-fixture');

            this._validationMessage.option('target', $element);

            assert.strictEqual(this._validationMessage.option('position').of, $element, 'position is recalculated');
        } finally {
            $element.remove();
        }
    });
});

QUnit.module('message inner html', moduleSetup, () => {
    QUnit.test('message html should be rendered correctly when there is one validation error on init', function(assert) {
        const validationErrors = [{
            message: 'required'
        }];
        this._validationMessage = new ValidationMessage(this._$validationMessage, { 'validationErrors': validationErrors });
        assert.strictEqual(this._validationMessage.$content().html(), 'required', 'message html is correct');
    });

    QUnit.test('message html should be rendered correctly when there is one validation error after runtime change', function(assert) {
        const validationErrors = [{
            message: 'required'
        }];
        this._validationMessage.option('validationErrors', validationErrors);
        assert.strictEqual(this._validationMessage.$content().html(), 'required', 'message html is correct');
    });

    QUnit.test('message html should be rendered correctly when there are several validation error on init', function(assert) {
        const validationErrors = [{
            message: 'required'
        }, {
            message: 'should be boolean'
        }];
        this._validationMessage = new ValidationMessage(this._$validationMessage, { 'validationErrors': validationErrors });
        assert.strictEqual(this._validationMessage.$content().html(), 'required<br>should be boolean', 'message html is correct');
    });

    QUnit.test('message html should be rendered correctly when there are several validation error after runtime change', function(assert) {
        const validationErrors = [{
            message: 'required'
        }, {
            message: 'should be boolean'
        }];
        this._validationMessage.option('validationErrors', validationErrors);
        assert.strictEqual(this._validationMessage.$content().html(), 'required<br>should be boolean', 'message html is correct');
    });
});

QUnit.module('position', moduleSetup, () => {
    const rtlEnabledSetupModule = {
        beforeEach: function() {
            this._validationMessage.option('rtlEnabled', true);
        },
        afterEach: function() {
            this._validationMessage.option('rtlEnabled', false);
        }
    };

    QUnit.module('positionRequest is below', {
        beforeEach: function() {
            this._validationMessage.option('positionRequest', 'below');
        },
        afterEach: function() {
            this._validationMessage.option('positionRequest', undefined);
        }
    }, () => {
        QUnit.module('rtlEnabled = true', rtlEnabledSetupModule, () => {
            QUnit.test('position boundary should be equal to boundary option value, collision should be "none flip"', function(assert) {
                this._validationMessage.option('boundary', this._$container);
                assert.strictEqual(this._validationMessage.option('position.boundary'), this._$container, 'boundary is correct');
                assert.strictEqual(this._validationMessage.option('position.collision'), 'none flip', 'collision is correct');
            });
            QUnit.test('position offset should be calculated correctly', function(assert) {
                const offset = { h: 10, v: 20 };
                this._validationMessage.option('offset', offset);
                offset.h = -offset.h;
                assert.deepEqual(this._validationMessage.option('position.offset'), offset, 'offset is correct');
            });

            QUnit.test('position my and at should be calculated correctly', function(assert) {
                assert.deepEqual(this._validationMessage.option('position.my'), 'right top', 'my is correct');
                assert.deepEqual(this._validationMessage.option('position.at'), 'right bottom', 'at is correct');
            });
        });
        QUnit.module('rtlEnabled = false', {}, () => {
            QUnit.test('position boundary should be equal to boundary option value', function(assert) {
                this._validationMessage.option('boundary', this._$container);
                assert.strictEqual(this._validationMessage.option('position.boundary'), this._$container, 'boundary is correct');
                assert.strictEqual(this._validationMessage.option('position.collision'), 'none flip', 'collision is correct');
            });

            QUnit.test('position offset should be equal to offset option value', function(assert) {
                const offset = { h: 10, v: 20 };
                this._validationMessage.option('offset', offset);
                assert.deepEqual(this._validationMessage.option('position.offset'), offset, 'offset is correct');
            });

            QUnit.test('position my and at should be calculated correctly', function(assert) {
                assert.deepEqual(this._validationMessage.option('position.my'), 'left top', 'my is correct');
                assert.deepEqual(this._validationMessage.option('position.at'), 'left bottom', 'at is correct');
            });
        });
    });

    QUnit.module('positionRequest is not below', {}, () => {
        QUnit.module('rtlEnabled=true', rtlEnabledSetupModule, () => {
            QUnit.test('position boundary should be equal to boundary option value', function(assert) {
                this._validationMessage.option('boundary', this._$container);
                assert.strictEqual(this._validationMessage.option('position.boundary'), this._$container, 'boundary is correct');
                assert.strictEqual(this._validationMessage.option('position.collision'), 'none flip', 'collision is correct');
            });

            QUnit.test('position offset should be equal to offset option value', function(assert) {
                const offset = { h: 10, v: 20 };
                this._validationMessage.option('offset', offset);
                offset.v = -offset.v;
                offset.h = -offset.h;
                assert.deepEqual(this._validationMessage.option('position.offset'), offset, 'offset is correct');
            });

            QUnit.test('position my and at should be calculated correctly', function(assert) {
                assert.deepEqual(this._validationMessage.option('position.my'), 'right bottom', 'my is correct');
                assert.deepEqual(this._validationMessage.option('position.at'), 'right top', 'at is correct');
            });
        });
        QUnit.module('rtlEnabled=false', {}, () => {
            QUnit.test('position boundary should be equal to boundary option value', function(assert) {
                this._validationMessage.option('boundary', this._$container);
                assert.strictEqual(this._validationMessage.option('position.boundary'), this._$container, 'boundary is correct');
                assert.strictEqual(this._validationMessage.option('position.collision'), 'none flip', 'collision is correct');
            });

            QUnit.test('position offset should be equal to offset option value', function(assert) {
                const offset = { h: 10, v: 20 };
                this._validationMessage.option('offset', offset);
                offset.v = -offset.v;
                assert.deepEqual(this._validationMessage.option('position.offset'), offset, 'offset is correct');
            });

            QUnit.test('position my and at should be calculated correctly', function(assert) {
                assert.deepEqual(this._validationMessage.option('position.my'), 'left bottom', 'my is correct');
                assert.deepEqual(this._validationMessage.option('position.at'), 'left top', 'at is correct');
            });
        });
    });
});
