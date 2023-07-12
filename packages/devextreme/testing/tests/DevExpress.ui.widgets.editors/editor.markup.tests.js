import $ from 'jquery';
import Editor from 'ui/editor/editor';
import Class from 'core/class';

const READONLY_STATE_CLASS = 'dx-state-readonly';

const Fixture = Class.inherit({
    createEditor: function(options) {
        this.$element = $('<div/>').appendTo('#qunit-fixture');
        const editor = new Editor(this.$element, options);

        return editor;
    },
    createOnlyElement: function(options) {
        this.$element = $('<div/>').appendTo('#qunit-fixture');

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
    QUnit.test('editor should have "dx-state-readonly" class depending on the "readOnly" option on init', function(assert) {
        const editor = this.fixture.createEditor({
            readOnly: true
        });

        assert.ok(editor.$element().hasClass(READONLY_STATE_CLASS));
    });

    QUnit.test('readOnly property change toggles "dx-state-readonly" class', function(assert) {
        const editor = this.fixture.createEditor();

        editor.option('readOnly', true);
        assert.ok(editor.$element().hasClass(READONLY_STATE_CLASS));

        editor.option('readOnly', false);
        assert.ok(!editor.$element().hasClass(READONLY_STATE_CLASS));
    });

    [0, undefined, null].forEach((readOnly) => {
        QUnit.test(`readOnly=${readOnly} should remove readonly class and should not add it`, function(assert) {
            const editor = this.fixture.createEditor();

            editor.option('readOnly', readOnly);
            editor.option('readOnly', readOnly);

            assert.ok(!editor.$element().hasClass(READONLY_STATE_CLASS));
        });
    });
});

