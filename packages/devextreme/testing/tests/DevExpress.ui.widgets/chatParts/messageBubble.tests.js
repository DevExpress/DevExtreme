import $ from 'jquery';

import MessageBubble from '__internal/ui/chat/messagebubble';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new MessageBubble($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageBubble', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof MessageBubble);
        });

        QUnit.test('should be rendered with passed text value', function(assert) {
            this.reinit({ text: 'message text' });

            assert.strictEqual(this.$element.text(), 'message text');
        });
    });

    QUnit.module('Options', () => {
        QUnit.test('text option should be updatable at runtime', function(assert) {
            this.instance.option('text', 'new message text');

            assert.strictEqual(this.$element.text(), 'new message text');
        });
    });
});


