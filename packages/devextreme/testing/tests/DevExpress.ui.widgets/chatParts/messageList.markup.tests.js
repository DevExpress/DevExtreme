import $ from 'jquery';

import MessageList from '__internal/ui/chat/chat_message_list';

const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';
const SCROLLABLE_CLASS = 'dx-scrollable';

const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="messageList"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new MessageList($('#messageList'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageList', moduleConfig, () => {
    QUnit.module('Classes', moduleConfig, () => {
        QUnit.test('root element should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGE_LIST_CLASS), true);
        });

        QUnit.test('root element should contain scrollable element', function(assert) {
            assert.strictEqual(this.$element.children().first().hasClass(SCROLLABLE_CLASS), true);
        });
    });
});
