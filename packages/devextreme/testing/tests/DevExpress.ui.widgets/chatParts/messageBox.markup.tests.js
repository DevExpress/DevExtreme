import $ from 'jquery';

import MessageBox, {
    CHAT_MESSAGEBOX_WRAPPER_CLASS,
    CHAT_MESSAGEBOX_CLASS,
    CHAT_MESSAGEBOX_TEXTAREA_CLASS,
    CHAT_MESSAGEBOX_BUTTON_CLASS,
} from '__internal/ui/chat/messagebox';
import { CHAT_EDITING_PREVIEW_CLASS } from '__internal/ui/chat/messageEditingPreview';

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
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEBOX_WRAPPER_CLASS), true);
        });

        QUnit.test('root element should contain element for editing preview and messagebox', function(assert) {
            const $messageBoxContent = this.$element.children();

            assert.strictEqual($messageBoxContent.length, 2, 'message box content has two elements');
            assert.strictEqual($messageBoxContent.eq(0).hasClass(CHAT_EDITING_PREVIEW_CLASS), true, 'first child is editing preview');
            assert.strictEqual($messageBoxContent.eq(1).hasClass(CHAT_MESSAGEBOX_CLASS), true, 'second child is messagebox');
        });

        QUnit.test(`textarea field should have ${CHAT_MESSAGEBOX_TEXTAREA_CLASS} class`, function(assert) {
            const $textArea = this.$element.find(`.${TEXTAREA_CLASS}`);

            assert.strictEqual($textArea.hasClass(CHAT_MESSAGEBOX_TEXTAREA_CLASS), true);
        });

        QUnit.test(`send button should have ${CHAT_MESSAGEBOX_BUTTON_CLASS} class`, function(assert) {
            const $button = this.$element.find(`.${BUTTON_CLASS}`);

            assert.strictEqual($button.hasClass(CHAT_MESSAGEBOX_BUTTON_CLASS), true);
        });
    });

    QUnit.module('Accessibility', moduleConfig, () => {
        QUnit.test('send button should have correct aria-label', function(assert) {
            const $button = this.$element.find(`.${BUTTON_CLASS}`);

            assert.strictEqual($button.attr('aria-label'), 'Send');
        });
    });
});
