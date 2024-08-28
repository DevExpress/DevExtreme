import $ from 'jquery';

import MessageBox from '__internal/ui/chat/chat_message_box';

const CHAT_MESSAGE_BOX_CLASS = 'dx-chat-message-box';
const CHAT_MESSAGE_BOX_TEXTAREA_CLASS = 'dx-chat-message-box-text-area';
const CHAT_MESSAGE_BOX_BUTTON_CLASS = 'dx-chat-message-box-button';

const TEXTAREA_CLASS = 'dx-textarea';
const BUTTON_CLASS = 'dx-button';

const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="messageBox"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new MessageBox($('#messageBox'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageBox', moduleConfig, () => {
    QUnit.module('Classes', () => {
        QUnit.test('root element should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGE_BOX_CLASS), true);
        });

        QUnit.test(`textarea field should have ${CHAT_MESSAGE_BOX_TEXTAREA_CLASS} class`, function(assert) {
            const $textArea = this.$element.find(`.${TEXTAREA_CLASS}`);

            assert.strictEqual($textArea.hasClass(CHAT_MESSAGE_BOX_TEXTAREA_CLASS), true);
        });

        QUnit.test(`send button should have ${CHAT_MESSAGE_BOX_BUTTON_CLASS} class`, function(assert) {
            const $button = this.$element.find(`.${BUTTON_CLASS}`);

            assert.strictEqual($button.hasClass(CHAT_MESSAGE_BOX_BUTTON_CLASS), true);
        });
    });
});
