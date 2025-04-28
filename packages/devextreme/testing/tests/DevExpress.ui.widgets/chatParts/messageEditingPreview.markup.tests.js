import $ from 'jquery';

import MessageEditingPreview, {
    CHAT_EDITING_PREVIEW_CLASS,
    CHAT_EDITING_MESSAGE_CLASS,
    CHAT_EDITING_MESSAGE_CAPTION_CLASS,
    CHAT_EDITING_MESSAGE_TEXT_CLASS,
    CHAT_CANCEL_EDITING_BUTTON_CLASS,
} from '__internal/ui/chat/messageEditingPreview';

const BUTTON_CLASS = 'dx-button';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new MessageEditingPreview($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageEditingPreview', moduleConfig, () => {
    QUnit.module('Classes', () => {
        QUnit.test('root element should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_EDITING_PREVIEW_CLASS), true);
        });

        QUnit.test('root element should be empty by default', function(assert) {
            const $messageBoxContent = this.$element.children();

            assert.strictEqual($messageBoxContent.length, 0);
        });

        QUnit.test(`root element should contain editing message with ${CHAT_EDITING_MESSAGE_CLASS} class if text is defined`, function(assert) {
            this.reinit({ text: 'test' });

            const $editingMessage = this.$element.children().eq(1);

            assert.strictEqual($editingMessage.hasClass(CHAT_EDITING_MESSAGE_CLASS), true);
        });

        QUnit.test('editing message should contain caption and text elements', function(assert) {
            this.reinit({ text: 'test' });

            const $editingMessageContent = this.$element.find(`.${CHAT_EDITING_MESSAGE_CLASS}`).children();

            assert.strictEqual($editingMessageContent.length, 2, 'editing message contains 2 children');
            assert.strictEqual($editingMessageContent.eq(0).hasClass(CHAT_EDITING_MESSAGE_CAPTION_CLASS), true, 'caption has correct class');
            assert.strictEqual($editingMessageContent.eq(1).hasClass(CHAT_EDITING_MESSAGE_TEXT_CLASS), true, 'text has correct class');
        });

        QUnit.test(`root element should contain cancel button with ${CHAT_CANCEL_EDITING_BUTTON_CLASS} class if text is defined`, function(assert) {
            this.reinit({ text: 'test' });

            const $button = this.$element.find(`.${BUTTON_CLASS}`);

            assert.strictEqual($button.hasClass(CHAT_CANCEL_EDITING_BUTTON_CLASS), true);
        });

        QUnit.test('root element should update content if text option changed in runtime', function(assert) {
            assert.strictEqual(this.$element.children().length, 0, 'Editing message preview is empty by default');

            this.instance.option('text', 'new test');

            assert.strictEqual(this.$element.children().length, 3, 'Editing message preview contains 3 elements after text passed');

            this.instance.option('text', '');

            assert.strictEqual(this.$element.children().length, 0, 'Editing message preview is empty after text cleared');
        });
    });

    QUnit.module('Accessibility', moduleConfig, () => {
        QUnit.test('cancel button should have correct aria-label', function(assert) {
            this.reinit({ text: 'test' });

            const $button = this.$element.find(`.${CHAT_CANCEL_EDITING_BUTTON_CLASS}`);

            assert.strictEqual($button.attr('aria-label'), 'Cancel');
        });
    });
});
