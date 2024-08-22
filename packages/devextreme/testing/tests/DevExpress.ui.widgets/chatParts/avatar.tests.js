import $ from 'jquery';

import ChatAvatar from '__internal/ui/chat/chat_avatar';

const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="avatar"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new ChatAvatar($('#avatar'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('ChatAvatar', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof ChatAvatar);
        });

        QUnit.test('should be rendered with empty value by default', function(assert) {
            assert.strictEqual(this.$element.text(), '');
        });
    });

    QUnit.module('Options', () => {
        QUnit.test('should be rendered with correct initials according passed name option value', function(assert) {
            this.reinit({ name: 'Chat title' });

            assert.strictEqual(this.$element.text(), 'C');
        });

        QUnit.test('name option should be possible to update at runtime', function(assert) {
            this.instance.option('name', 'New Value');

            assert.strictEqual(this.$element.text(), 'N');
        });

        [
            { name: 888, expectedInitials: '8' },
            { name: undefined, expectedInitials: '' },
            { name: null, expectedInitials: '' },
            // TODO: consider scenarios
            // { name: ' New Name', expectedInitials: 'N' },
            // { name: NaN, expectedInitials: '' },
            // { name: Infinity, expectedInitials: '' },
            // { name: -Infinity, expectedInitials: '' },
            // { name: { firstName: 'name' }, expectedInitials: '' }
        ].forEach(({ name, expectedInitials }) => {
            QUnit.test(`name option is ${name}`, function(assert) {
                this.reinit({ name });

                assert.strictEqual(this.$element.text(), expectedInitials);
            });
        });
    });
});
