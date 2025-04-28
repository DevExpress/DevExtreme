import $ from 'jquery';

import MessageEditingPreview, {
    CHAT_EDITING_MESSAGE_TEXT_CLASS,
    CHAT_CANCEL_EDITING_BUTTON_CLASS,
} from '__internal/ui/chat/messageEditingPreview';
import messageLocalization from 'common/core/localization/message';
import Button from 'ui/button';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new MessageEditingPreview($('#component'), options);
            this.$element = $(this.instance.$element());

            this.$cancelEditButton = this.$element.find(`.${CHAT_CANCEL_EDITING_BUTTON_CLASS}`);
            this.cancelEditButton = Button.getInstance(this.$cancelEditButton);
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init({ text: 'test' });
    }
};

QUnit.module('MessageEditingPreview', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof MessageEditingPreview);
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

            const $messageText = this.$element.find(`.${CHAT_EDITING_MESSAGE_TEXT_CLASS}`);

            assert.deepEqual($messageText.text(), 'test', 'Has correct initial text');

            this.instance.option('text', updatedText);

            assert.deepEqual($messageText.text(), updatedText, 'Message text was updated');
        });
    });
});
