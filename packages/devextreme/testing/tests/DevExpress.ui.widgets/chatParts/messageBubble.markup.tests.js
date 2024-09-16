import $ from 'jquery';

import MessageBubble from '__internal/ui/chat/messagebubble';

const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';

const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="messageBubble"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new MessageBubble($('#messageBubble'), options);
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
    QUnit.module('Classes', moduleConfig, () => {
        QUnit.test('root element should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEBUBBLE_CLASS), true);
        });
    });
});
