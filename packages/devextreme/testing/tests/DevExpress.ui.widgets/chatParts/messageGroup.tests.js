import $ from 'jquery';

import MessageGroup from '__internal/ui/chat/chat_message_group';
import ChatAvatar from '__internal/ui/chat/chat_avatar';

const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';

const moduleConfig = {
    beforeEach: function() {
        const markup = '<div id="messageGroup"></div>';
        $('#qunit-fixture').html(markup);

        const init = (options = {}) => {
            this.instance = new MessageGroup($('#messageGroup'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageGroup', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof MessageGroup);
        });
    });

    QUnit.module('Time', () => {
        QUnit.test('value should be presented in the correct format and taken from the first message in the group', function(assert) {
            const messageTimeFirst = new Date(2021, 9, 17, 21, 34);
            const messageTimeSecond = new Date(2021, 9, 17, 14, 43);

            this.reinit({
                items: [{
                    timestamp: messageTimeFirst,
                }, {
                    timestamp: messageTimeSecond
                }]
            });

            const $time = this.$element.find(`.${CHAT_MESSAGE_TIME_CLASS}`);

            assert.strictEqual($time.text(), '21:34');
        });
    });

    QUnit.module('Nested avatar component', () => {
        QUnit.test('avatar component should be initialized with correct name property', function(assert) {
            [
                { items: [{}], passedNameValue: undefined },
                { items: [{ author: {} }], passedNameValue: undefined },
                { items: [{ author: undefined }], passedNameValue: undefined },
                { items: [{ author: { name: undefined } }], passedNameValue: undefined },
                { items: [{ author: { name: null } }], passedNameValue: null },
                { items: [{ author: { name: '' } }], passedNameValue: '' },
                { items: [{ author: { name: 888 } }], passedNameValue: 888 },
                { items: [{ author: { name: NaN } }], passedNameValue: NaN },
            ].forEach(({ items, passedNameValue }) => {
                this.reinit({
                    items,
                });

                const avatar = ChatAvatar.getInstance(this.$element.find(`.${CHAT_MESSAGE_AVATAR_CLASS}`));

                assert.deepEqual(avatar.option('name'), passedNameValue);
            });
        });
    });
});


