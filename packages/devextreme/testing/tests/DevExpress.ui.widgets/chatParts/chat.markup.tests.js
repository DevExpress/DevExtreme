import $ from 'jquery';

import Chat from 'ui/chat';

import { shouldHeaderBeRendered } from '__internal/ui/chat/chat';

const CHAT_CLASS = 'dx-chat';
const CHAT_HEADER_CLASS = 'dx-chat-header';
const CHAT_MESSAGE_BOX_CLASS = 'dx-chat-message-box';
const CHAT_MESSAGE_LIST_CLASS = 'dx-chat-message-list';

const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="chat"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new Chat($('#chat'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('Chat', moduleConfig, () => {
    QUnit.module('Render', () => {
        const method = shouldHeaderBeRendered ? 'test' : 'skip';

        QUnit[method]('Header should be rendered', function(assert) {
            const $header = this.$element.find(`.${CHAT_HEADER_CLASS}`);

            assert.strictEqual($header.length, 1);
        });

        QUnit.test('Message list should be rendered', function(assert) {
            const $messageList = this.$element.find(`.${CHAT_MESSAGE_LIST_CLASS}`);

            assert.strictEqual($messageList.length, 1);
        });

        QUnit.test('Message box should be rendered', function(assert) {
            const $messageBox = this.$element.find(`.${CHAT_MESSAGE_BOX_CLASS}`);

            assert.strictEqual($messageBox.length, 1);
        });
    });

    QUnit.module('Classes', () => {
        QUnit.test(`root element should have ${CHAT_CLASS} class`, function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_CLASS), true);
        });
    });
});

