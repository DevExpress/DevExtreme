import $ from 'jquery';

import MessageGroup from '__internal/ui/chat/messagegroup';

const CHAT_MESSAGEGROUP_CLASS = 'dx-chat-messagegroup';
const CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS = 'dx-chat-messagegroup-alignment-start';
const CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS = 'dx-chat-messagegroup-alignment-end';

const AVATAR_CLASS = 'dx-avatar';
const CHAT_MESSAGEGROUP_INFORMATION_CLASS = 'dx-chat-messagegroup-information';
const CHAT_MESSAGEGROUP_TIME_CLASS = 'dx-chat-messagegroup-time';
const CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS = 'dx-chat-messagegroup-author-name';
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';

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
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEGROUP_CLASS), true);
        });

        QUnit.test(`root element should have ${CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS} class by default`, function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS), true);
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS), false);
        });

        ['start', 'end'].forEach((alignment) => {
            QUnit.test(`root element should have correct alignment class if alignment option value is ${alignment}`, function(assert) {
                this.reinit({
                    alignment
                });

                assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS), alignment === 'start', `${CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS} class`);
                assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS), alignment === 'end', `${CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS} class`);
            });

            QUnit.test(`root element should have correct alignment class if alignment option value is changed to ${alignment === 'start' ? 'end' : 'start'} at runtime`, function(assert) {
                this.reinit({ alignment });

                const oppositeAlignment = alignment === 'start' ? 'end' : 'start';
                this.instance.option('alignment', oppositeAlignment);

                assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS), oppositeAlignment === 'start', `${CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS} class`);
                assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS), oppositeAlignment === 'end', `${CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS} class`);
            });

            QUnit.test(`avatar should be have correct alignment class if alignment option value is ${alignment}`, function(assert) {
                this.reinit({
                    alignment
                });

                assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS), alignment === 'start', `${CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS} class`);
                assert.strictEqual(this.$element.hasClass(CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS), alignment === 'end', `${CHAT_MESSAGEGROUP_ALIGNMENT_END_CLASS} class`);
            });
        });
    });

    QUnit.module('Avatar element', moduleConfig, () => {
        QUnit.test('should not be rendered by default', function(assert) {
            assert.strictEqual(this.$element.find(`.${AVATAR_CLASS}`).length, 0);
        });

        QUnit.test('should be rendered by default if items is not empty array', function(assert) {
            this.reinit({
                items: [{}]
            });

            assert.strictEqual(this.$element.children().first().hasClass(AVATAR_CLASS), true);
        });

        QUnit.test('should not be rendered if alignment is end', function(assert) {
            this.reinit({
                items: [{}],
                alignment: 'end',
            });

            assert.strictEqual(this.$element.find(`.${AVATAR_CLASS}`).length, 0);
        });

        QUnit.test('should be rendered or removed after change items option at runtime', function(assert) {
            this.instance.option('items', [{}]);

            assert.strictEqual(this.$element.find(`.${AVATAR_CLASS}`).length, 1);

            this.instance.option('items', []);

            assert.strictEqual(this.$element.find(`.${AVATAR_CLASS}`).length, 0);
        });

        QUnit.test('should be rendered or removed after change alignment option at runtime', function(assert) {
            this.reinit({
                items: [{}],
            });

            this.instance.option('alignment', 'end');

            assert.strictEqual(this.$element.find(`.${AVATAR_CLASS}`).length, 0);

            this.instance.option('alignment', 'start');

            assert.strictEqual(this.$element.find(`.${AVATAR_CLASS}`).length, 1);
        });
    });

    QUnit.module('Information element', moduleConfig, () => {
        QUnit.test('should not be rendered by default', function(assert) {
            const $information = this.$element.find(`.${CHAT_MESSAGEGROUP_INFORMATION_CLASS}`);

            assert.strictEqual($information.length, 0);
        });

        QUnit.test('should be rendered if items is not empty array', function(assert) {
            this.reinit({
                items: [{}],
            });

            const $information = this.$element.find(`.${CHAT_MESSAGEGROUP_INFORMATION_CLASS}`);

            assert.strictEqual($information.length, 1);
        });

        QUnit.test('should be rendered once for several message bubbles', function(assert) {
            this.reinit({
                items: [{}, {}, {}],
            });

            const $information = this.$element.find(`.${CHAT_MESSAGEGROUP_INFORMATION_CLASS}`);

            assert.strictEqual($information.length, 1);
        });

        QUnit.test('name element should be rendered with correct text if autor.name property is not passed', function(assert) {
            this.reinit({
                items: [{ author: {} }],
            });

            const $name = this.$element.find(`.${CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS}`);

            assert.strictEqual($name.length, 1);
            assert.strictEqual($name.text(), 'Unknown User', 'name text is Unknown User');
        });

        QUnit.test('time element should be rendered with empty text if timestamp property is not passed', function(assert) {
            this.reinit({
                items: [{ }],
            });

            const $time = this.$element.find(`.${CHAT_MESSAGEGROUP_TIME_CLASS}`);

            assert.strictEqual($time.length, 1);
            assert.strictEqual($time.text(), '', 'time text is empty');
        });

        QUnit.test('name element should be rendered if autor.name property is passed', function(assert) {
            this.reinit({
                items: [{ author: { name: '' } }],
            });

            const $name = this.$element.find(`.${CHAT_MESSAGEGROUP_AUTHOR_NAME_CLASS}`);

            assert.strictEqual($name.length, 1);
        });

        QUnit.test('time element should be rendered if timestamp property is passed', function(assert) {
            this.reinit({
                items: [{ timestamp: new Date() }],
            });

            const $time = this.$element.find(`.${CHAT_MESSAGEGROUP_TIME_CLASS}`);

            assert.strictEqual($time.length, 1);
        });
    });

    QUnit.module('MessageBubble elements', moduleConfig, () => {
        QUnit.test('should not be rendered by default', function(assert) {
            const $messageBubble = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.length, 0);
        });

        QUnit.test('should be rendered if items is not empty array', function(assert) {
            this.reinit({
                items: [{}],
            });

            const $messageBubble = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.length, 1);
        });

        QUnit.test('count should be equal count of items', function(assert) {
            this.reinit({
                items: [{}, {}, {}, {}],
            });

            const $messageBubble = this.$element.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`);

            assert.strictEqual($messageBubble.length, 4);
        });
    });
});
