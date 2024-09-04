import $ from 'jquery';

import ChatAvatar from '__internal/ui/chat/chat_avatar';

const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_IMAGE_CLASS = 'dx-chat-message-avatar-image';
const CHAT_MESSAGE_AVATAR_INITIALS_CLASS = 'dx-chat-message-avatar-initials';

const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="avatar"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new ChatAvatar($('#avatar'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('Avatar classes', moduleConfig, () => {
    QUnit.test('root element should have correct class', function(assert) {
        assert.strictEqual(this.$element.hasClass(CHAT_MESSAGE_AVATAR_CLASS), true);
    });

    QUnit.test('image element should have correct class', function(assert) {
        const $image = this.$element.children().eq(0);

        assert.strictEqual($image.hasClass(CHAT_MESSAGE_AVATAR_IMAGE_CLASS), true);
    });

    QUnit.test('text element should have correct class', function(assert) {
        const $text = this.$element.children().eq(1);

        assert.strictEqual($text.hasClass(CHAT_MESSAGE_AVATAR_INITIALS_CLASS), true);
    });
});
