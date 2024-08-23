import $ from 'jquery';

import ChatHeader from '__internal/ui/chat/chat_header';

const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="header"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new ChatHeader($('#header'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('ChatHeader', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof ChatHeader);
        });

        QUnit.test('should be rendered with empty value by default', function(assert) {
            assert.strictEqual(this.$element.text(), '');
        });
    });

    QUnit.module('Options', () => {
        QUnit.test('should be rendered with passed title option value', function(assert) {
            this.reinit({ title: 'Chat title' });

            assert.strictEqual(this.$element.text(), 'Chat title');
        });

        QUnit.test('title option should be updatable at runtime', function(assert) {
            this.instance.option('title', 'new message text');

            assert.strictEqual(this.$element.text(), 'new message text');
        });
    });
});
