import $ from 'jquery';
import localization from 'localization';

import MessageBubble, {
    CHAT_MESSAGEBUBBLE_CLASS,
    CHAT_MESSAGEBUBBLE_CONTENT_CLASS,
    CHAT_MESSAGEBUBBLE_DELETED_CLASS,
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
    }
};

QUnit.module('MessageBubble', moduleConfig, () => {
    QUnit.module('Classes', moduleConfig, () => {
        QUnit.test('root element should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEBUBBLE_CLASS), true);
        });

        QUnit.test('root element should have a child content element with correct class', function(assert) {
            const $content = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CONTENT_CLASS}`);

            assert.strictEqual($content.length, 1, 'content element exist');
            assert.strictEqual($content.parent().is(this.$element), true, 'content element is direct child of root element');
        });

        QUnit.test('root element should have a child content element with correct class after deletion', function(assert) {
            this.instance.option('isDeleted', true);

            const $content = this.$element.find(`.${CHAT_MESSAGEBUBBLE_DELETED_CLASS}`);

            assert.strictEqual($content.length, 1, 'content element exist');
            assert.strictEqual($content.parent().is(this.$element), true, 'content element is direct child of root element');
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

                const $content = this.$element.find(`.${CHAT_MESSAGEBUBBLE_DELETED_CLASS}`);
                assert.strictEqual($content.text(), deletedMessageText, 'deleted text is correct');
            } finally {
                localization.locale(defaultLocale);
            }
        });
    });
});
