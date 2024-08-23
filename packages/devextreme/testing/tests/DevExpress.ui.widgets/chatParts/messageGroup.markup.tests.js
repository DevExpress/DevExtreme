import $ from 'jquery';

import MessageGroup from '__internal/ui/chat/chat_message_group';

const CHAT_MESSAGE_GROUP_CLASS = 'dx-chat-message-group';
const CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS = 'dx-chat-message-group-alignment-start';
const CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS = 'dx-chat-message-group-alignment-end';

const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_GROUP_INFORMATION_CLASS = 'dx-chat-message-group-information';
const CHAT_MESSAGE_TIME_CLASS = 'dx-chat-message-time';
const CHAT_MESSAGE_AUTHOR_NAME_CLASS = 'dx-chat-message-author-name';
const CHAT_MESSAGE_BUBBLE_CLASS = 'dx-chat-message-bubble';
const CHAT_MESSAGE_BUBBLE_FIRST_CLASS = 'dx-chat-message-bubble-first';
const CHAT_MESSAGE_BUBBLE_LAST_CLASS = 'dx-chat-message-bubble-last';

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
    QUnit.module('Classes', moduleConfig, () => {
        QUnit.test('root element should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGE_GROUP_CLASS), true);
        });

        QUnit.test(`root element should have ${CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS} class by default`, function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS), true);
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS), false);
        });

        ['start', 'end'].forEach((alignment) => {
            QUnit.test(`root element should have correct alignment class if alignment option value is ${alignment}`, function(assert) {
                this.reinit({
                    alignment
                });

                assert.strictEqual(this.$element.hasClass(CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS), alignment === 'start', `${CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS} class`);
                assert.strictEqual(this.$element.hasClass(CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS), alignment === 'end', `${CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS} class`);
            });

            QUnit.test(`root element should have correct alignment class if alignment option value is changed to ${alignment === 'start' ? 'end' : 'start'} at runtime`, function(assert) {
                this.reinit({ alignment });

                const oppositeAlignment = alignment === 'start' ? 'end' : 'start';
                this.instance.option('alignment', oppositeAlignment);

                assert.strictEqual(this.$element.hasClass(CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS), oppositeAlignment === 'start', `${CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS} class`);
                assert.strictEqual(this.$element.hasClass(CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS), oppositeAlignment === 'end', `${CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS} class`);
            });

            QUnit.test(`avatar should be have correct alignment class if alignment option value is ${alignment}`, function(assert) {
                this.reinit({
                    alignment
                });

                assert.strictEqual(this.$element.hasClass(CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS), alignment === 'start', `${CHAT_MESSAGE_GROUP_ALIGNMENT_START_CLASS} class`);
                assert.strictEqual(this.$element.hasClass(CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS), alignment === 'end', `${CHAT_MESSAGE_GROUP_ALIGNMENT_END_CLASS} class`);
            });
        });
    });

    QUnit.module('Avatar element', moduleConfig, () => {
        QUnit.test('should not be rendered by default', function(assert) {
            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGE_AVATAR_CLASS}`).length, 0);
        });

        QUnit.test('should be rendered by default if items is not empty array', function(assert) {
            this.reinit({
                items: [{}]
            });

            assert.strictEqual(this.$element.children().first().hasClass(CHAT_MESSAGE_AVATAR_CLASS), true);
        });

        QUnit.test('should not be rendered if alignment is end', function(assert) {
            this.reinit({
                items: [{}],
                alignment: 'end',
            });

            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGE_AVATAR_CLASS}`).length, 0);
        });

        QUnit.test('should be rendered or removed after change items option at runtime', function(assert) {
            this.instance.option('items', [{}]);

            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGE_AVATAR_CLASS}`).length, 1);

            this.instance.option('items', []);

            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGE_AVATAR_CLASS}`).length, 0);
        });

        QUnit.test('should be rendered or removed after change alignment option at runtime', function(assert) {
            this.reinit({
                items: [{}],
            });

            this.instance.option('alignment', 'end');

            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGE_AVATAR_CLASS}`).length, 0);

            this.instance.option('alignment', 'start');

            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGE_AVATAR_CLASS}`).length, 1);
        });
    });

    QUnit.module('Information element', moduleConfig, () => {
        QUnit.test('should not be rendered by default', function(assert) {
            const $information = this.$element.find(`.${CHAT_MESSAGE_GROUP_INFORMATION_CLASS}`);

            assert.strictEqual($information.length, 0);
        });

        QUnit.test('should be rendered if items is not empty array', function(assert) {
            this.reinit({
                items: [{}],
            });

            const $information = this.$element.find(`.${CHAT_MESSAGE_GROUP_INFORMATION_CLASS}`);

            assert.strictEqual($information.length, 1);
        });

        QUnit.test('should be rendered once for several message bubbles', function(assert) {
            this.reinit({
                items: [{}, {}, {}],
            });

            const $information = this.$element.find(`.${CHAT_MESSAGE_GROUP_INFORMATION_CLASS}`);

            assert.strictEqual($information.length, 1);
        });

        QUnit.test('name element should not be rendered if autor.name property is not passed', function(assert) {
            this.reinit({
                items: [{ author: {} }],
            });

            const $name = this.$element.find(`.${CHAT_MESSAGE_AUTHOR_NAME_CLASS}`);

            assert.strictEqual($name.length, 1);
            assert.strictEqual($name.text(), '', 'name text is empty');
        });

        QUnit.test('time element should be rendered if timestamp property is not passed', function(assert) {
            this.reinit({
                items: [{ }],
            });

            const $time = this.$element.find(`.${CHAT_MESSAGE_TIME_CLASS}`);

            assert.strictEqual($time.length, 1);
            assert.strictEqual($time.text(), '', 'name text is empty');
        });

        QUnit.test('name element should be rendered if autor.name property is passed', function(assert) {
            this.reinit({
                items: [{ author: { name: '' } }],
            });

            const $name = this.$element.find(`.${CHAT_MESSAGE_AUTHOR_NAME_CLASS}`);

            assert.strictEqual($name.length, 1);
        });

        QUnit.test('time element should be rendered if timestamp property is passed', function(assert) {
            this.reinit({
                items: [{ timestamp: new Date() }],
            });

            const $time = this.$element.find(`.${CHAT_MESSAGE_TIME_CLASS}`);

            assert.strictEqual($time.length, 1);
        });
    });

    QUnit.module('MessageBubble elements', moduleConfig, () => {
        QUnit.test('should not be rendered by default', function(assert) {
            const $messageBubble = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.length, 0);
        });

        QUnit.test('should be rendered if items is not empty array', function(assert) {
            this.reinit({
                items: [{}],
            });

            const $messageBubble = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.length, 1);
        });

        QUnit.test('count should be equal count of items', function(assert) {
            this.reinit({
                items: [{}, {}, {}, {}],
            });

            const $messageBubble = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.length, 4);
        });

        QUnit.test('single message should have additional classes', function(assert) {
            this.reinit({
                items: [{}],
            });

            const $messageBubble = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.length, 1);
            assert.strictEqual($messageBubble.hasClass(CHAT_MESSAGE_BUBBLE_FIRST_CLASS), true);
            assert.strictEqual($messageBubble.hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), true);
        });

        QUnit.test('first message bubble should have additional class', function(assert) {
            this.reinit({
                items: [{}, {}],
            });

            const $messageBubble = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.eq(0).hasClass(CHAT_MESSAGE_BUBBLE_FIRST_CLASS), true);
            assert.strictEqual($messageBubble.eq(0).hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), false);
        });

        QUnit.test('last message bubble should have additional class', function(assert) {
            this.reinit({
                items: [{}, {}],
            });

            const $messageBubble = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.eq(1).hasClass(CHAT_MESSAGE_BUBBLE_FIRST_CLASS), false);
            assert.strictEqual($messageBubble.eq(1).hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), true);
        });

        QUnit.test('middle message bubbles should not have additional classes', function(assert) {
            this.reinit({
                items: [{}, {}, {}, {}],
            });

            const $messageBubble = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.eq(1).hasClass(CHAT_MESSAGE_BUBBLE_FIRST_CLASS), false);
            assert.strictEqual($messageBubble.eq(1).hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), false);

            assert.strictEqual($messageBubble.eq(2).hasClass(CHAT_MESSAGE_BUBBLE_FIRST_CLASS), false);
            assert.strictEqual($messageBubble.eq(2).hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), false);
        });

        QUnit.test('last class should be deleted from last bubble after renderMessage', function(assert) {
            this.reinit({
                items: [{}, {}, {}],
            });

            let $messageBubble = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.eq(2).hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), true);

            const newMessage = {
                author: { id: 'MikeID' },
                timestamp: Date.now(),
                text: 'NEW MESSAGE',
            };

            this.instance.renderMessage(newMessage);

            $messageBubble = this.$element.find(`.${CHAT_MESSAGE_BUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.eq(2).hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), false);
            assert.strictEqual($messageBubble.eq(3).hasClass(CHAT_MESSAGE_BUBBLE_LAST_CLASS), true);
        });
    });
});
