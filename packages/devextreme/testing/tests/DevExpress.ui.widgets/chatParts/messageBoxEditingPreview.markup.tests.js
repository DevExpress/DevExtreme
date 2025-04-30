import $ from 'jquery';

import MessageBoxEditingPreview, {
    CHAT_EDITING_PREVIEW_CLASS,
    CHAT_EDITING_PREVIEW_CONTENT_CLASS,
    CHAT_EDITING_PREVIEW_CAPTION_CLASS,
    CHAT_EDITING_PREVIEW_TEXT_CLASS,
    CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS,
} from '__internal/ui/chat/messagebox_editing_preview';

const BUTTON_CLASS = 'dx-button';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = { text: 'test' }) => {
            this.instance = new MessageBoxEditingPreview($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageBoxEditingPreview', moduleConfig, () => {
    QUnit.module('Classes', () => {
        QUnit.test('root element should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_EDITING_PREVIEW_CLASS), true);
        });

        QUnit.test(`root element should contain editing message with ${CHAT_EDITING_PREVIEW_CONTENT_CLASS} class`, function(assert) {
            const $editingMessage = this.$element.children().eq(0);

            assert.strictEqual($editingMessage.hasClass(CHAT_EDITING_PREVIEW_CONTENT_CLASS), true);
        });

        QUnit.test('editing message should contain caption and text elements', function(assert) {
            const $editingMessageContent = this.$element.find(`.${CHAT_EDITING_PREVIEW_CONTENT_CLASS}`).children();

            assert.strictEqual($editingMessageContent.length, 2, 'editing message contains 2 children');
            assert.strictEqual($editingMessageContent.eq(0).hasClass(CHAT_EDITING_PREVIEW_CAPTION_CLASS), true, 'caption has correct class');
            assert.strictEqual($editingMessageContent.eq(1).hasClass(CHAT_EDITING_PREVIEW_TEXT_CLASS), true, 'text has correct class');
        });

        QUnit.test(`root element should contain cancel button with ${CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS} class if text is defined`, function(assert) {
            const $button = this.$element.find(`.${BUTTON_CLASS}`);

            assert.strictEqual($button.hasClass(CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS), true);
        });
    });

    QUnit.module('Accessibility', moduleConfig, () => {
        QUnit.test('cancel button should have correct aria-label', function(assert) {
            const $button = this.$element.find(`.${CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS}`);

            assert.strictEqual($button.attr('aria-label'), 'Cancel');
        });
    });
});
