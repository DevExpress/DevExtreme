import $ from 'jquery';

import Chat from 'ui/chat';

const CHAT_CLASS = 'dx-chat';
const CHAT_MESSAGEBOX_CLASS = 'dx-chat-messagebox';
const CHAT_MESSAGELIST_CLASS = 'dx-chat-messagelist';
const CHAT_ALERTLIST_CLASS = 'dx-chat-alertlist';
const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';
const CHAT_TYPINGINDICATOR_CLASS = 'dx-chat-typingindicator';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new Chat($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('Chat', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('Message list should be rendered', function(assert) {
            const $messageList = this.$element.find(`.${CHAT_MESSAGELIST_CLASS}`);

            assert.strictEqual($messageList.length, 1);
        });

        QUnit.test('Message box should be rendered', function(assert) {
            const $messageBox = this.$element.find(`.${CHAT_MESSAGEBOX_CLASS}`);

            assert.strictEqual($messageBox.length, 1);
        });

        QUnit.test('Error list should be rendered', function(assert) {
            const $alertList = this.$element.find(`.${CHAT_ALERTLIST_CLASS}`);

            assert.strictEqual($alertList.length, 1);
        });

        QUnit.test('TypingIndicator element should be rendered', function(assert) {
            const $typingIndicator = this.$element.find(`.${CHAT_TYPINGINDICATOR_CLASS}`);

            assert.strictEqual($typingIndicator.length, 1);
        });
    });

    QUnit.module('Classes', () => {
        QUnit.test(`root element should have ${CHAT_CLASS} class`, function(assert) {
            assert.strictEqual(this.$element.hasClass(CHAT_CLASS), true);
        });
    });

    QUnit.module('Accessibility', () => {
        [
            {
                attribute: 'role',
                expectedValue: 'group',
            },
            {
                attribute: 'aria-label',
                expectedValue: 'Chat',
            },
        ].forEach(({ attribute, expectedValue }) => {
            QUnit.test(`root element should have correct ${attribute}`, function(assert) {
                assert.strictEqual(this.$element.attr(attribute), expectedValue, `${attribute} is correct`);
            });
        });

        QUnit.test('textarea should not have aria-labelledby attribute if there are items', function(assert) {
            this.reinit({
                items: [
                    { text: '1' },
                    { text: '2' },
                ],
            });

            const $textArea = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

            assert.strictEqual($textArea.attr('aria-labelledby'), undefined);
        });

        QUnit.test('textarea should have correct aria-labelledby attribute if there are no items', function(assert) {
            const $textArea = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
            const $emptyView = this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`);

            assert.strictEqual($textArea.attr('aria-labelledby'), $emptyView.attr('id'));
        });

        QUnit.test('textarea should get rid of aria-labelledby attribute if items have been removed at runtime', function(assert) {
            this.instance.option({
                items: [
                    { text: '1' },
                    { text: '2' },
                ],
            });

            const $textArea = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);

            assert.strictEqual($textArea.attr('aria-labelledby'), undefined);
        });

        QUnit.test('textarea should get aria-labelledby attribute if items have been removed at runtime', function(assert) {
            this.reinit({
                items: [
                    { text: '1' },
                    { text: '2' },
                ],
            });

            this.instance.option({ items: [] });

            const $textArea = this.$element.find(`.${TEXTEDITOR_INPUT_CLASS}`);
            const $emptyView = this.$element.find(`.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`);

            assert.strictEqual($textArea.attr('aria-labelledby'), $emptyView.attr('id'));
        });
    });
});

