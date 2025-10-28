import $ from 'jquery';
import localization from 'localization';

import MessageBubble, {
    CHAT_MESSAGEBUBBLE_CLASS,
    CHAT_MESSAGEBUBBLE_CONTENT_CLASS,
    CHAT_MESSAGEBUBBLE_DELETED_CLASS,
    CHAT_MESSAGEBUBBLE_HAS_IMAGE_CLASS,
    CHAT_MESSAGEBUBBLE_IMAGE_CLASS,
    CHAT_MESSAGEBUBBLE_ATTACHMENTS_CLASS
} from '__internal/ui/chat/messagebubble';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new MessageBubble($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    },
};

QUnit.module('MessageBubble', moduleConfig, () => {
    QUnit.module('Classes', moduleConfig, () => {
        QUnit.test('root element should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEBUBBLE_CLASS), true, 'root element has correct messagebubble class');
        });

        QUnit.test('root element should have a child content element with correct class', function(assert) {
            const $content = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CONTENT_CLASS}`);

            assert.strictEqual($content.length, 1, 'content element exist');
            assert.strictEqual($content.parent().is(this.$element), true, 'content element is direct child of root element');
        });

        QUnit.test('root element should have a child attachments element with correct class', function(assert) {
            const $content = this.$element.find(`.${CHAT_MESSAGEBUBBLE_ATTACHMENTS_CLASS}`);

            assert.strictEqual($content.length, 1, 'attachments element exist');
            assert.strictEqual($content.parent().is(this.$element), true, 'attachments element is direct child of root element');
        });

        QUnit.test('root element should switch classes when deletion and undo happens', function(assert) {
            this.instance.option('isDeleted', true);
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEBUBBLE_DELETED_CLASS), true, 'root element has deleted class');

            this.instance.option('isDeleted', false);
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEBUBBLE_DELETED_CLASS), false, 'root element does not have deleted class');
        });

        QUnit.test('should have correct classes for image message', function(assert) {
            this.reinit({ type: 'image', src: '', alt: '' });

            const $content = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CONTENT_CLASS}`);
            const $img = $content.find('img');

            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEBUBBLE_HAS_IMAGE_CLASS), true, 'root has image class');
            assert.strictEqual($img.hasClass(CHAT_MESSAGEBUBBLE_IMAGE_CLASS), true, 'img has correct class');
        });
    });

    QUnit.module('Localization', moduleConfig, () => {
        QUnit.test('Should check that deleted message are properly localized', function(assert) {
            const defaultLocale = localization.locale();

            const deletedMessageText = 'See sõnum on kustutatud';

            try {
                localization.loadMessages({
                    'ee': {
                        'dxChat-deletedMessageText': deletedMessageText,
                    }
                });
                localization.locale('ee');

                this.reinit();

                this.instance.option('isDeleted', true);

                const $content = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CONTENT_CLASS}`);
                assert.strictEqual($content.text(), deletedMessageText, 'deleted text is correct');
            } finally {
                localization.locale(defaultLocale);
            }
        });
    });
});
