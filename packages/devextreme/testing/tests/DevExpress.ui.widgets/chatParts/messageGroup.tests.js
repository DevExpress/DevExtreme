import $ from 'jquery';

import MessageGroup from '__internal/ui/chat/messagegroup';
import ChatAvatar from '__internal/ui/chat/avatar';
import dateLocalization from 'common/core/localization/date';

const AVATAR_CLASS = 'dx-avatar';
const CHAT_MESSAGEGROUP_TIME_CLASS = 'dx-chat-messagegroup-time';
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
const CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS = 'dx-chat-messagegroup-author-name';

const getStringTime = (time) => {
    return dateLocalization.format(time, 'shorttime');
};

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new MessageGroup($('#component'), options);
            this.$element = $(this.instance.$element());

            this.getAvatar = () => this.$element.find(`.${AVATAR_CLASS}`);
            this.getUsername = () => this.$element.find(`.${CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS}`);
            this.getMessageTimestamp = () => this.$element.find(`.${CHAT_MESSAGEGROUP_TIME_CLASS}`);
            this.getBubbles = () => this.$element.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);
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

        QUnit.test('Avatar should not be rendered when showAvatar is set to false', function(assert) {
            this.reinit({
                items: [{ timestamp: new Date().getTime(), text: 'ABC' }],
                showAvatar: false,
            });

            const $avatar = this.getAvatar();

            assert.strictEqual($avatar.length, 0, 'avatar was not added');
        });

        QUnit.test('Username should not be rendered when showUserName is set to false', function(assert) {
            this.reinit({
                items: [{ timestamp: new Date().getTime(), text: 'ABC' }],
                showUserName: false,
            });

            const $username = this.getUsername();

            assert.strictEqual($username.length, 0, 'username was not added');
        });

        QUnit.test('Message timestamps should not be rendered when showMessageTimestamp is set to false', function(assert) {
            this.reinit({
                items: [{ timestamp: new Date().getTime(), text: 'ABC' }],
                showMessageTimestamp: false,
            });

            const $messageTimestamp = this.getMessageTimestamp();

            assert.strictEqual($messageTimestamp.length, 0, 'message timestamp was not added');
        });
    });

    QUnit.module('Time', () => {
        [
            { timestamp: new Date(2021, 9, 17, 21, 34) },
            { timestamp: '2021-10-17T21:34:00' },
            { timestamp: new Date(2021, 9, 17, 21, 34).getTime() },
        ].forEach(({ timestamp }) => {
            QUnit.test('time element should display the time value correctly if the timestamp is presented in different formats', function(assert) {
                this.reinit({
                    items: [{ timestamp }],
                });

                const $time = this.$element.find(`.${CHAT_MESSAGEGROUP_TIME_CLASS}`);

                assert.strictEqual($time.length, 1);
                assert.strictEqual($time.text(), getStringTime(new Date(timestamp)), 'time text is correct');
            });
        });

        QUnit.test('value should be presented in the correct format and taken from the first message in the group', function(assert) {
            const messageTimeFirst = new Date(2021, 9, 17, 21, 34);
            const messageTimeSecond = new Date(2021, 9, 17, 14, 43);

            this.reinit({
                items: [
                    { timestamp: messageTimeFirst },
                    { timestamp: messageTimeSecond },
                ],
            });

            const $time = this.$element.find(`.${CHAT_MESSAGEGROUP_TIME_CLASS}`);

            assert.strictEqual($time.text(), getStringTime(messageTimeFirst));
        });

        QUnit.test('time should have formatted value if messageTimestampFormat is specified on init', function(assert) {
            const messageTime = new Date(2021, 9, 17, 4, 20);

            this.reinit({
                items: [
                    { timestamp: messageTime },
                ],
                messageTimestampFormat: 'hh_mm',
            });

            const $time = this.$element.find(`.${CHAT_MESSAGEGROUP_TIME_CLASS}`);

            assert.strictEqual($time.text(), '04_20');
        });

        QUnit.test('time should have formatted value if messageTimestampFormat is specified at runtime', function(assert) {
            const messageTime = new Date(2021, 9, 17, 4, 20);

            this.reinit({
                items: [
                    { timestamp: messageTime },
                ],
            });

            this.instance.option('messageTimestampFormat', 'hh...mm');

            const $time = this.$element.find(`.${CHAT_MESSAGEGROUP_TIME_CLASS}`);

            assert.strictEqual($time.text(), '04...20');
        });
    });

    QUnit.module('Author name', () => {
        QUnit.test('text of a name element should be equal to author name if alignment is start', function(assert) {
            const name = 'custom';

            this.reinit({
                items: [
                    {
                        author: { name: 'custom' },
                    },
                ],
            });

            const $name = this.$element.find(`.${CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS}`);

            assert.strictEqual($name.text(), name);
        });

        QUnit.test('text of a name element should be empty if alignment is end', function(assert) {
            this.reinit({
                alignment: 'end',
                items: [
                    {
                        author: { name: 'custom' },
                    },
                ],
            });

            const $name = this.$element.find(`.${CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS}`);

            assert.strictEqual($name.text(), '');
        });
    });

    QUnit.module('renderMessage()', () => {
        QUnit.test('new message bubble should be rendered into the group after calling the renderMessage function', function(assert) {
            this.reinit({
                items: [{}, {}, {}],
            });

            let $messageBubble = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.length, 3);

            const newMessage = {
                author: { id: 'MikeID' },
                timestamp: Date.now(),
                text: 'NEW MESSAGE',
            };

            this.instance.renderMessage(newMessage);

            $messageBubble = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.length, 4);
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

                const avatar = ChatAvatar.getInstance(this.$element.find(`.${AVATAR_CLASS}`));

                assert.deepEqual(avatar.option('name'), passedNameValue);
            });
        });

        QUnit.test('avatar component should be initialized with correct url property', function(assert) {
            [
                { items: [{}], passedUrlValue: undefined },
                { items: [{ author: {} }], passedUrlValue: undefined },
                { items: [{ author: undefined }], passedUrlValue: undefined },
                { items: [{ author: { avatarUrl: undefined } }], passedUrlValue: undefined },
                { items: [{ author: { avatarUrl: null } }], passedUrlValue: null },
                { items: [{ author: { avatarUrl: '' } }], passedUrlValue: '' },
                { items: [{ author: { avatarUrl: ' ' } }], passedUrlValue: ' ' },
                { items: [{ author: { avatarUrl: 888 } }], passedUrlValue: 888 },
                { items: [{ author: { avatarUrl: NaN } }], passedUrlValue: NaN },
            ].forEach(({ items, passedUrlValue }) => {
                this.reinit({
                    items,
                });

                const avatar = ChatAvatar.getInstance(this.$element.find(`.${AVATAR_CLASS}`));

                assert.deepEqual(avatar.option('url'), passedUrlValue);
            });
        });

        QUnit.test('avatar component should be initialized with correct alt property', function(assert) {
            [
                { items: [{}], passedAltValue: undefined },
                { items: [{ author: {} }], passedAltValue: undefined },
                { items: [{ author: undefined }], passedAltValue: undefined },
                { items: [{ author: { avatarAlt: undefined } }], passedAltValue: undefined },
                { items: [{ author: { avatarAlt: null } }], passedAltValue: null },
                { items: [{ author: { avatarAlt: '' } }], passedAltValue: '' },
                { items: [{ author: { avatarAlt: ' ' } }], passedAltValue: ' ' },
                { items: [{ author: { avatarAlt: 888 } }], passedAltValue: 888 },
                { items: [{ author: { avatarAlt: NaN } }], passedAltValue: NaN },
            ].forEach(({ items, passedAltValue }) => {
                this.reinit({
                    items,
                });

                const avatar = ChatAvatar.getInstance(this.$element.find(`.${AVATAR_CLASS}`));

                assert.deepEqual(avatar.option('alt'), passedAltValue);
            });
        });
    });

    QUnit.module('Options', {
        beforeEach: function() {
            const createInvalidateStub = () => {
                this.invalidateStub = sinon.stub(this.instance, '_invalidate');
            };

            this.recreateInvalidateStub = () => {
                createInvalidateStub();
            };

            createInvalidateStub();
        },
        afterEach: function() {
            this.invalidateStub.restore();
        }
    }, () => {
        ['showAvatar', 'showUserName', 'showMessageTimestamp'].forEach(option => {
            QUnit.test(`should run invalidate after changing ${option} in runtime`, function(assert) {
                this.instance.option({ [option]: false });

                assert.strictEqual(this.invalidateStub.callCount, 1);
            });
        });

        QUnit.test('messageTemplate should be called on bubble template call', function(assert) {
            const messageTemplate = sinon.stub();
            const message = {
                text: 'CustomText',
                timestamp: 1234567,
                author: { name: 'someName', id: 'someId' },
            };

            this.reinit({
                items: [message],
                messageTemplate,
            });

            assert.strictEqual(messageTemplate.callCount, 1, 'messageTemplate function was called on bubble template render');
            assert.deepEqual(messageTemplate.lastCall.args[0], message, 'messageTemplate function was called with correct data');
        });
    });
});


