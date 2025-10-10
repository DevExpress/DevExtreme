import $ from 'jquery';

import MessageBox, {
    CHAT_MESSAGEBOX_CLASS,
    CHAT_MESSAGEBOX_INPUT_CONTAINER_CLASS,
    CHAT_MESSAGEBOX_TEXTAREA_CLASS,
} from '__internal/ui/chat/message_box/message_box';

const TEXTAREA_CLASS = 'dx-textarea';
const BUTTON_CLASS = 'dx-button';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new MessageBox($('#component'), options);
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
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEBOX_CLASS), true);
        });

        QUnit.test('root element should contain only input container by default', function(assert) {
            const $messageBoxContent = this.$element.children();

            assert.strictEqual($messageBoxContent.length, 1, 'message box content has one elements');
            assert.strictEqual($messageBoxContent.eq(0).hasClass(CHAT_MESSAGEBOX_INPUT_CONTAINER_CLASS), true, 'message box contains input container');
        });

        QUnit.test(`textarea field should have ${CHAT_MESSAGEBOX_TEXTAREA_CLASS} class`, function(assert) {
            const $textArea = this.$element.find(`.${TEXTAREA_CLASS}`);

            assert.strictEqual($textArea.hasClass(CHAT_MESSAGEBOX_TEXTAREA_CLASS), true);
        });
    });

    QUnit.module('Accessibility', moduleConfig, () => {
        QUnit.test('send button should have correct aria-label', function(assert) {
            const $button = this.$element.find(`.${BUTTON_CLASS}`);

            assert.strictEqual($button.attr('aria-label'), 'Send');
        });
    });
});
