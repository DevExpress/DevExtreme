import $ from 'jquery';

import MessageList from '__internal/ui/chat/messagelist';

const CHAT_MESSAGELIST_CLASS = 'dx-chat-messagelist';
const SCROLLABLE_CLASS = 'dx-scrollable';
const SCROLLVIEW_CONTENT_CLASS = 'dx-scrollview-content';
const CHAT_MESSAGELIST_EMPTY_CLASS = 'dx-chat-messagelist-empty';
const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';
const CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS = 'dx-chat-messagelist-empty-image';
const CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS = 'dx-chat-messagelist-empty-message';
const CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS = 'dx-chat-messagelist-empty-prompt';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new MessageList($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('MessageList', moduleConfig, () => {
    QUnit.module('Root element', () => {
        QUnit.test('should have correct class', function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGELIST_CLASS), true);
        });

        QUnit.test('should contain scrollable element', function(assert) {
            assert.strictEqual(this.$element.children().first().hasClass(SCROLLABLE_CLASS), true);
        });

        QUnit.test('should have empty class if there are no messages', function(assert) {
            this.reinit({
                items: []
            });

            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGELIST_EMPTY_CLASS), true);
        });

        QUnit.test('should not have empty class if there are no messages', function(assert) {
            this.reinit({
                items: [{}]
            });

            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGELIST_EMPTY_CLASS), false);
        });

        QUnit.test('empty should be toggled after items are updated at runtime', function(assert) {
            this.instance.option('items', [{}]);

            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGELIST_EMPTY_CLASS), false, 'messagelist empty class is removed');

            this.instance.option('items', []);

            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGELIST_EMPTY_CLASS), true, 'messagelist empty class is added');

            this.instance.option('items', [{}, {}, {}]);

            assert.strictEqual(this.$element.hasClass(CHAT_MESSAGELIST_EMPTY_CLASS), false, 'messagelist empty class is removed');
        });
    });

    QUnit.module('Empty view', () => {
        QUnit.test('container should be rendered if there are no messages', function(assert) {
            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`).length, 1);
        });

        QUnit.test('container should not be rendered if there are messages', function(assert) {
            this.reinit({
                items: [{}]
            });

            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`).length, 0);
        });

        QUnit.test('container should be removed or rendered after items are updated at runtime', function(assert) {
            this.instance.option('items', [{}]);

            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`).length, 0);

            this.instance.option('items', []);

            assert.strictEqual(this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`).length, 1);
        });

        QUnit.test('image should be rendered inside empty view', function(assert) {
            const $emptyView = this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`);

            assert.strictEqual($emptyView.find(`.${CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS}`).length, 1);
        });

        QUnit.test('message should be rendered inside empty view', function(assert) {
            const $emptyView = this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`);

            assert.strictEqual($emptyView.find(`.${CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS}`).length, 1);
        });

        QUnit.test('prompt should be rendered inside empty view', function(assert) {
            const $emptyView = this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`);

            assert.strictEqual($emptyView.find(`.${CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS}`).length, 1);
        });
    });

    QUnit.module('Accessibility', () => {
        QUnit.test('emptyView should have id attribute', function(assert) {
            const id = this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`).attr('id');

            assert.notStrictEqual(id, undefined);
        });

        [
            {
                attribute: 'role',
                expectedValue: 'log',
            },
            {
                attribute: 'aria-atomic',
                expectedValue: 'false',
            },
            {
                attribute: 'aria-label',
                expectedValue: 'Message list',
            },
            {
                attribute: 'aria-live',
                expectedValue: 'polite',
            },
            {
                attribute: 'aria-relevant',
                expectedValue: 'additions',
            },
        ].forEach(({ attribute, expectedValue }) => {
            QUnit.test(`element should have correct attribute ${attribute}`, function(assert) {
                assert.strictEqual(this.$element.attr(attribute), expectedValue, `${attribute} is correct`);
            });
        });
    });
});
