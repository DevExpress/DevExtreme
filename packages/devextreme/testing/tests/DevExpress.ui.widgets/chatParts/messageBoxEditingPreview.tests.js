import $ from 'jquery';
import localization from 'localization';

import MessageBoxEditingPreview, {
    CHAT_EDITING_PREVIEW_TEXT_CLASS,
    CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS,
    CHAT_EDITING_PREVIEW_CAPTION_CLASS,
} from '__internal/ui/chat/messagebox_editing_preview';
import messageLocalization from 'common/core/localization/message';
import Button from 'ui/button';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = { text: 'test' }) => {
            this.instance = new MessageBoxEditingPreview($('#component'), options);
            this.$element = $(this.instance.$element());

            this.$cancelEditButton = this.$element.find(`.${CHAT_EDITING_PREVIEW_CANCEL_BUTTON_CLASS}`);
            this.cancelEditButton = Button.getInstance(this.$cancelEditButton);
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageBoxEditingPreview', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof MessageBoxEditingPreview);
        });

        QUnit.test('cancel button should be initialized with the corresponding configuration', function(assert) {
            const expectedOptions = {
                icon: 'remove',
                type: 'normal',
                stylingMode: 'text',
                elementAttr: { 'aria-label': messageLocalization.format('dxChat-cancelEditingButtonAriaLabel') },
            };

            Object.entries(expectedOptions).forEach(([key, value]) => {
                assert.deepEqual(value, this.cancelEditButton.option(key), `${key} value is correct`);
            });
        });
    });

    QUnit.module('Text option', () => {
        QUnit.test('message text should be updated if option changed in runtime', function(assert) {
            const updatedText = 'updated text';

            const $messageText = this.$element.find(`.${CHAT_EDITING_PREVIEW_TEXT_CLASS}`);

            assert.deepEqual($messageText.text(), 'test', 'Has correct initial text');

            this.instance.option('text', updatedText);

            assert.deepEqual($messageText.text(), updatedText, 'Message text was updated');
        });
    });

    QUnit.module('Localization', () => {
        QUnit.test('caption should be localized', function(assert) {
            const localizedCaption = 'Another caption text';

            localization.loadMessages({
                'en': { 'dxChat-editingMessageCaption': localizedCaption }
            });

            this.reinit();

            const $caption = $(`.${CHAT_EDITING_PREVIEW_CAPTION_CLASS}`);

            assert.strictEqual($caption.eq(0).text(), localizedCaption);
        });
    });
});
