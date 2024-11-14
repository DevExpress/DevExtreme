import $ from 'jquery';

import MessageBubble from '__internal/ui/chat/messagebubble';

const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
const CHAT_MESSAGEBUBBLE_CONTENT_CLASS = 'dx-chat-messagebubble-content';

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
    QUnit.module('Classes', moduleConfig, () => {
        QUnit.test('root element should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEBUBBLE_CLASS), true);
        });

        QUnit.test('root element should have a child content element with correct class', function(assert) {
            const $content = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CONTENT_CLASS}`);

            assert.strictEqual($content.length, 1, 'content element exist');
            assert.strictEqual($content.parent().is(this.$element), true, 'content element is direct child of root element');
        });
    });
});
