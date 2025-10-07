import $ from 'jquery';

import EditingPreview, {
    CHAT_EDITING_PREVIEW_CLASS,
    CHAT_EDITING_PREVIEW_HIDING_CLASS,
    CHAT_EDITING_PREVIEW_CONTENT_CLASS,
    CHAT_EDITING_PREVIEW_CAPTION_CLASS,
    CHAT_EDITING_PREVIEW_TEXT_CLASS,
    CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS,
} from '__internal/ui/chat/message_box/editing_preview';
import { BUTTON_CLASS } from '__internal/ui/button/button';

const ANIMATION_TIMEOUT = 300;

const moduleConfig = {
    beforeEach: function() {
        const init = (options) => {
            this.instance = new EditingPreview($('#component'), options || { text: 'test' });
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('EditingPreview', moduleConfig, () => {
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

        QUnit.test('Editing preview should not appear when text is empty', function(assert) {
            this.reinit({
                text: ''
            });

            assert.strictEqual(this.$element.parent().get(0), undefined, 'Preview element is not attached to DOM when text is empty');
        });

        QUnit.test('Editing preview should appear and be removed at runtime when text option changes', function(assert) {
            const done = assert.async();

            this.instance.option('text', 'test');
            assert.strictEqual(this.$element.length, 1, 'Preview is rendered after setting non-empty text');

            this.instance.option('text', '');

            setTimeout(() => {
                assert.strictEqual(this.$element.parent().get(0), undefined, 'Preview element is removed after setting text to empty');
                done();
            }, ANIMATION_TIMEOUT);
        });

        QUnit.test('Editing preview should receive hiding class when text is changed to empty', function(assert) {
            this.instance.option('text', 'test');

            assert.strictEqual(this.$element.hasClass(CHAT_EDITING_PREVIEW_HIDING_CLASS), false, 'Hiding class is not applied initially');

            this.instance.option('text', '');

            assert.strictEqual(this.$element.hasClass(CHAT_EDITING_PREVIEW_HIDING_CLASS), true, 'Hiding class is applied after clearing text');
        });
    });

    QUnit.module('Accessibility', moduleConfig, () => {
        QUnit.test('cancel button should have correct aria-label', function(assert) {
            const $button = this.$element.find(`.${CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS}`);

            assert.strictEqual($button.attr('aria-label'), 'Cancel');
        });
    });
});
