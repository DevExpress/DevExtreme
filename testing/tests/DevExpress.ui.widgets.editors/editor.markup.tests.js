const $ = require('jquery');
const Editor = require('ui/editor/editor');
const Class = require('core/class');

require('common.css!');

const READONLY_STATE_CLASS = 'dx-state-readonly';

const Fixture = Class.inherit({
    createEditor: function(options) {
        this.$element = $('<div/>').appendTo('body');
        const editor = new Editor(this.$element, options);

        return editor;
    },
    createOnlyElement: function(options) {
        this.$element = $('<div/>').appendTo('body');

        return this.$element;
    },
    teardown: function() {
        this.$element.remove();
    }
});

QUnit.module('Editor markup', {
    beforeEach: function() {
        this.fixture = new Fixture();
    },
    afterEach: function() {
        this.fixture.teardown();
    }
}, () => {
    QUnit.test('editor should have \'dx-state-readonly\' class depending on the \'readOnly\' option on init', function(assert) {
        var editor = this.fixture.createEditor({
            readOnly: true
        });

        assert.ok(editor._$element.hasClass(READONLY_STATE_CLASS));
    });

    QUnit.test('\'readOnly\' option with \'true\'/\'false\' value attaches/detaches \'dx-state-readonly\' class', function(assert) {
        var editor = this.fixture.createEditor();

        editor.option('readOnly', true);

        assert.ok(editor._$element.hasClass(READONLY_STATE_CLASS));

        editor.option('readOnly', false);

        assert.ok(!editor._$element.hasClass(READONLY_STATE_CLASS));
    });

    QUnit.test('\'readOnly\' option with 0 value should remove readonly class and should not add it', function(assert) {
        var editor = this.fixture.createEditor();

        editor.option('readOnly', 0);
        editor.option('readOnly', 0);

        assert.ok(!editor._$element.hasClass(READONLY_STATE_CLASS));
    });

    QUnit.test('\'readOnly\' option with undefined value should remove readonly class and should not add it', function(assert) {
        var editor = this.fixture.createEditor();

        editor.option('readOnly', undefined);
        editor.option('readOnly', undefined);

        assert.ok(!editor._$element.hasClass(READONLY_STATE_CLASS));
    });

    QUnit.test('\'readOnly\' option with null value should remove readonly class and should not add it', function(assert) {
        var editor = this.fixture.createEditor();

        editor.option('readOnly', null);
        editor.option('readOnly', null);

        assert.ok(!editor._$element.hasClass(READONLY_STATE_CLASS));
    });
});

