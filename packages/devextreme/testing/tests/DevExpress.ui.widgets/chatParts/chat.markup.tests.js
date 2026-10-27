import $ from 'jquery';

import Chat from 'ui/chat';

const CHAT_CLASS = 'dx-chat';
const CHAT_MESSAGEBOX_CLASS = 'dx-chat-messagebox';
const CHAT_MESSAGELIST_CLASS = 'dx-chat-messagelist';
const CHAT_ALERTLIST_CLASS = 'dx-chat-alertlist';
const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';
const CHAT_TYPINGINDICATOR_CLASS = 'dx-chat-typingindicator';
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
const CHAT_MESSAGEBUBBLE_CONTENT_CLASS = 'dx-chat-messagebubble-content';
const CHAT_FILE_VIEW_CLASS = 'dx-chat-file-view';
const CHAT_TOOL_CALL_VIEW_CLASS = 'dx-chat-tool-call-view';
const CHAT_TOOL_CALL_HEADER_CLASS = 'dx-chat-tool-call-header';
const CHAT_TOOL_CALL_NAME_CLASS = 'dx-chat-tool-call-name';
const ACCORDION_CLASS = 'dx-accordion';
const ACCORDION_ITEM_CLASS = 'dx-accordion-item';
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

    QUnit.module('Tool calls', {
        beforeEach() {
            this.getBubbleChildren = () => this.$element.find(`.${CHAT_MESSAGEBUBBLE_CLASS}`).children();
            this.getToolCallView = () => this.$element.find(`.${CHAT_TOOL_CALL_VIEW_CLASS}`);
            this.getToolCallNames = () => this.$element
                .find(`.${CHAT_TOOL_CALL_NAME_CLASS}`)
                .map((_, element) => $(element).text())
                .get();
        },
    }, () => {
        QUnit.test('bubble of a message without tool calls should contain only the content element', function(assert) {
            this.reinit({ items: [{ text: 'answer' }] });

            const $children = this.getBubbleChildren();

            assert.strictEqual($children.length, 1, 'bubble has one child');
            assert.strictEqual($children.eq(0).hasClass(CHAT_MESSAGEBUBBLE_CONTENT_CLASS), true, 'the child is the content');
        });

        QUnit.test('bubble should contain the tool calls, the content and the attachments in this order', function(assert) {
            this.reinit({
                items: [{
                    text: 'answer',
                    toolCalls: [{ name: 'getWeather' }],
                    attachments: [{ name: 'report.pdf', size: 1024 }],
                }],
            });

            const $children = this.getBubbleChildren();

            assert.strictEqual($children.eq(0).hasClass(CHAT_TOOL_CALL_VIEW_CLASS), true, 'tool calls are first');
            assert.strictEqual($children.eq(1).hasClass(CHAT_MESSAGEBUBBLE_CONTENT_CLASS), true, 'content is second');
            assert.strictEqual($children.eq(2).hasClass(CHAT_FILE_VIEW_CLASS), true, 'attachments are third');
        });

        QUnit.test('should render one accordion without the header for a single tool call', function(assert) {
            this.reinit({ items: [{ text: 'answer', toolCalls: [{ name: 'getWeather' }] }] });

            const $view = this.getToolCallView();

            assert.strictEqual($view.children(`.${ACCORDION_CLASS}`).length, 1, 'one accordion is rendered');
            assert.deepEqual(this.getToolCallNames(), ['getWeather'], 'accordion has an item for the tool call');
            assert.strictEqual($view.children(`.${CHAT_TOOL_CALL_HEADER_CLASS}`).length, 0, 'header is not rendered');
        });

        QUnit.test('should render the header above one accordion with an item for every tool call for several tool calls', function(assert) {
            this.reinit({ items: [{ text: 'answer', toolCalls: [{ name: 'getWeather' }, { name: 'getCurrentTime' }] }] });

            const $children = this.getToolCallView().children();

            assert.strictEqual($children.length, 2, 'block has two children');
            assert.strictEqual($children.eq(0).hasClass(CHAT_TOOL_CALL_HEADER_CLASS), true, 'header is first');
            assert.strictEqual($children.eq(0).text(), '2 tools', 'header contains the count');
            assert.strictEqual($children.eq(1).hasClass(ACCORDION_CLASS), true, 'accordion is second');
            assert.strictEqual($children.eq(1).find(`.${ACCORDION_ITEM_CLASS}`).length, 2, 'accordion has an item for every tool call');
            assert.deepEqual(this.getToolCallNames(), ['getWeather', 'getCurrentTime'], 'items are titled with the tool names');
        });

        QUnit.test('bubble of a message with tool calls and without text should contain the tool calls and the empty content', function(assert) {
            this.reinit({ items: [{ toolCalls: [{ name: 'getWeather' }] }] });

            const $children = this.getBubbleChildren();

            assert.strictEqual($children.eq(0).hasClass(CHAT_TOOL_CALL_VIEW_CLASS), true, 'tool calls are rendered');
            assert.strictEqual($children.eq(1).hasClass(CHAT_MESSAGEBUBBLE_CONTENT_CLASS), true, 'content follows the tool calls');
            assert.strictEqual($children.eq(1).text(), '', 'content is empty');
        });

        QUnit.test('should render a tool call name as text', function(assert) {
            const name = '<b>getWeather</b>';

            this.reinit({ items: [{ text: 'answer', toolCalls: [{ name }] }] });

            assert.deepEqual(this.getToolCallNames(), [name], 'name is rendered as text');
            assert.strictEqual(this.getToolCallView().find('b').length, 0, 'name is not parsed as markup');
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

