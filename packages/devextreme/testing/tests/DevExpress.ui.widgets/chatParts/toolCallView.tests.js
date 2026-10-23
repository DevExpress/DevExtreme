import $ from 'jquery';
import fx from 'common/core/animation/fx';
import localization from 'localization';

import ToolCallView, {
    CHAT_TOOL_CALL_CONTENT_CLASS,
    CHAT_TOOL_CALL_ERROR_BADGE_CLASS,
    CHAT_TOOL_CALL_FIELD_CLASS,
    CHAT_TOOL_CALL_FIELD_ERROR_CLASS,
    CHAT_TOOL_CALL_FIELD_LABEL_CLASS,
    CHAT_TOOL_CALL_NAME_CLASS,
    COPIED_STATE_DURATION,
    COPY_BUTTON_NAME,
} from '__internal/ui/chat/tool_call_view/tool_call_view';
import TextArea from '__internal/ui/text_area';

const ACCORDION_CLASS = 'dx-accordion';
const ACCORDION_ITEM_CLASS = 'dx-accordion-item';
const ACCORDION_ITEM_BODY_CLASS = 'dx-accordion-item-body';
const ACCORDION_ITEM_TITLE_CLASS = 'dx-accordion-item-title';
const ACCORDION_ITEM_OPENED_CLASS = 'dx-accordion-item-opened';
const TEXTAREA_CLASS = 'dx-textarea';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

const updateUserCall = {
    name: 'updateUser',
    arguments: {
        name: 'John Doe',
        email: 'john@example.com',
        active: true,
        count: 10,
    },
    result: 'Completed',
    status: 'success',
};

const currentTimeCall = {
    name: 'getCurrentTime',
    arguments: { locations: ['Barcelona', 'Los Angeles'] },
    result: 'Barcelona: 10:18',
};

const stockPriceCall = {
    name: 'getStockPrice',
    arguments: { symbol: 'CNTS' },
    result: 'Failed to execute the tool',
    status: 'error',
};

const moduleConfig = {
    beforeEach() {
        fx.off = true;

        const init = (options = {}) => {
            this.instance = new ToolCallView($('#component'), {
                toolCalls: [updateUserCall],
                ...options,
            });
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();
            init(options);
        };

        this.getItems = () => this.$element.find(`.${ACCORDION_ITEM_CLASS}`);
        this.getTitles = () => this.$element.find(`.${ACCORDION_ITEM_TITLE_CLASS}`);
        this.getNames = () => this.$element.find(`.${CHAT_TOOL_CALL_NAME_CLASS}`)
            .map((_, element) => $(element).text())
            .get();
        this.expand = (index = 0) => {
            this.getTitles().eq(index).trigger('dxclick');
        };
        this.getFields = () => this.$element.find(`.${CHAT_TOOL_CALL_FIELD_CLASS}`);
        this.getField = (label) => this.getFields()
            .filter((_, element) => $(element).find(`.${CHAT_TOOL_CALL_FIELD_LABEL_CLASS}`).text() === label);
        this.getFieldValue = (label) => this.getField(label).find(`.${TEXTEDITOR_INPUT_CLASS}`).val();
        this.getCopyButton = (label) => TextArea
            .getInstance(this.getField(label).find(`.${TEXTAREA_CLASS}`))
            .getButton(COPY_BUTTON_NAME);

        init();
    },
    afterEach() {
        fx.off = false;
    },
};

QUnit.module('ToolCallView', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should render a collapsed item titled with the tool name for a single tool call', function(assert) {
            assert.strictEqual(this.getItems().length, 1, 'one accordion item');
            assert.deepEqual(this.getNames(), ['updateUser'], 'title contains the tool name');
            assert.strictEqual(this.getItems().hasClass(ACCORDION_ITEM_OPENED_CLASS), false, 'item is collapsed');
        });

        QUnit.test('should render an error badge in the title of a failed tool call', function(assert) {
            this.reinit({ toolCalls: [stockPriceCall] });

            const $badge = this.getTitles().find(`.${CHAT_TOOL_CALL_ERROR_BADGE_CLASS}`);

            assert.strictEqual($badge.length, 1, 'badge is rendered');
            assert.strictEqual($badge.text(), 'Error', 'badge text is correct');
        });

        QUnit.test('should not render an error badge for a tool call without the error status', function(assert) {
            this.reinit({ toolCalls: [currentTimeCall] });

            assert.strictEqual(this.$element.find(`.${CHAT_TOOL_CALL_ERROR_BADGE_CLASS}`).length, 0);
        });

        QUnit.test('should render a group item titled with the tool call count for several tool calls', function(assert) {
            this.reinit({ toolCalls: [currentTimeCall, stockPriceCall] });

            assert.strictEqual(this.getItems().length, 1, 'only the group item is rendered while collapsed');
            assert.deepEqual(this.getNames(), ['2 tools'], 'group title contains the count');

            this.expand();

            assert.deepEqual(this.getNames(), ['2 tools', 'getCurrentTime', 'getStockPrice'], 'tool calls are rendered inside the group');
            assert.strictEqual(this.getTitles().eq(0).find(`.${CHAT_TOOL_CALL_ERROR_BADGE_CLASS}`).length, 0, 'group title has no error badge');
            assert.strictEqual(this.getTitles().eq(2).find(`.${CHAT_TOOL_CALL_ERROR_BADGE_CLASS}`).length, 1, 'failed tool call title has an error badge');
        });

        QUnit.test('should not render items for an empty toolCalls array', function(assert) {
            this.reinit({ toolCalls: [] });

            assert.strictEqual(this.getItems().length, 0);
        });
    });

    QUnit.module('Structure', () => {
        QUnit.test('expanded item body should contain the content element with fields', function(assert) {
            this.expand();

            const $content = this.$element.find(`.${ACCORDION_ITEM_BODY_CLASS} > .${CHAT_TOOL_CALL_CONTENT_CLASS}`);
            const $fields = $content.children(`.${CHAT_TOOL_CALL_FIELD_CLASS}`);

            assert.strictEqual($content.length, 1, 'content element exists');
            assert.strictEqual($fields.length, 2, 'two fields are rendered');

            $fields.each((_, field) => {
                const $fieldChildren = $(field).children();

                assert.strictEqual($fieldChildren.eq(0).hasClass(CHAT_TOOL_CALL_FIELD_LABEL_CLASS), true, 'first child is the label');
                assert.strictEqual($fieldChildren.eq(1).hasClass(TEXTAREA_CLASS), true, 'second child is the text area');
            });
        });

        QUnit.test('expanded group body should contain the content element with the nested accordion', function(assert) {
            this.reinit({ toolCalls: [currentTimeCall, stockPriceCall] });
            this.expand();

            const $content = this.$element.find(`.${ACCORDION_ITEM_BODY_CLASS} > .${CHAT_TOOL_CALL_CONTENT_CLASS}`);

            assert.strictEqual($content.length, 1, 'content element exists');
            assert.strictEqual($content.children(`.${ACCORDION_CLASS}`).length, 1, 'nested accordion is a direct child of the content');
        });
    });

    QUnit.module('Fields', () => {
        QUnit.test('should not render fields until the item is expanded', function(assert) {
            assert.strictEqual(this.getFields().length, 0);
        });

        QUnit.test('should render arguments as comma-separated key-value pairs', function(assert) {
            this.expand();

            assert.strictEqual(
                this.getFieldValue('Arguments'),
                'name: "John Doe", email: "john@example.com", active: true, count: 10',
            );
        });

        QUnit.test('should separate array items with a comma and a space', function(assert) {
            this.reinit({ toolCalls: [currentTimeCall] });
            this.expand();

            assert.strictEqual(this.getFieldValue('Arguments'), 'locations: ["Barcelona", "Los Angeles"]');
        });

        QUnit.test('should render a string result as is', function(assert) {
            this.expand();

            assert.strictEqual(this.getFieldValue('Result'), 'Completed');
        });

        QUnit.test('should render an object result as indented JSON', function(assert) {
            this.reinit({
                toolCalls: [{ name: 'getExchangeRate', result: { base: 'USD', rates: { EUR: 0.92 } } }],
            });
            this.expand();

            assert.strictEqual(
                this.getFieldValue('Result'),
                '{\n  "base": "USD",\n  "rates": {\n    "EUR": 0.92\n  }\n}',
            );
        });

        QUnit.test('should render a non-string primitive result as text', function(assert) {
            this.reinit({ toolCalls: [{ name: 'getCount', result: 0 }] });
            this.expand();

            assert.strictEqual(this.getFieldValue('Result'), '0');
        });

        QUnit.test('should render only the result field when there are no arguments', function(assert) {
            this.reinit({ toolCalls: [{ name: 'getTime', arguments: {}, result: '10:18' }] });
            this.expand();

            const labels = this.getFields().find(`.${CHAT_TOOL_CALL_FIELD_LABEL_CLASS}`).map((_, element) => $(element).text()).get();

            assert.deepEqual(labels, ['Result']);
        });

        QUnit.test('should render only the arguments field when there is no result', function(assert) {
            this.reinit({ toolCalls: [{ name: 'getWeather', arguments: { city: 'London' } }] });
            this.expand();

            const labels = this.getFields().find(`.${CHAT_TOOL_CALL_FIELD_LABEL_CLASS}`).map((_, element) => $(element).text()).get();

            assert.deepEqual(labels, ['Arguments']);
        });

        QUnit.test('should mark only the result field of a failed tool call as an error', function(assert) {
            this.reinit({ toolCalls: [stockPriceCall] });
            this.expand();

            assert.strictEqual(this.getField('Result').hasClass(CHAT_TOOL_CALL_FIELD_ERROR_CLASS), true, 'result field is an error');
            assert.strictEqual(this.getField('Arguments').hasClass(CHAT_TOOL_CALL_FIELD_ERROR_CLASS), false, 'arguments field is not an error');
        });

        QUnit.test('should not mark the result field of a successful tool call as an error', function(assert) {
            this.expand();

            assert.strictEqual(this.getField('Result').hasClass(CHAT_TOOL_CALL_FIELD_ERROR_CLASS), false);
        });

        QUnit.test('should render read-only fields', function(assert) {
            this.expand();

            const $inputs = this.getFields().find(`.${TEXTEDITOR_INPUT_CLASS}`);

            assert.strictEqual($inputs.length, 2, 'two fields are rendered');
            assert.strictEqual($inputs.filter('[readonly]').length, 2, 'both fields are read-only');
        });
    });

    QUnit.module('Copy', {
        beforeEach() {
            this.clock = sinon.useFakeTimers();
            this.writeText = sinon.stub(navigator.clipboard, 'writeText').returns(Promise.resolve());
            this.waitForWrite = () => this.writeText.lastCall.returnValue;
        },
        afterEach() {
            this.writeText.restore();
            this.clock.restore();
        },
    }, () => {
        QUnit.test('should copy the field value to the clipboard on a field click', function(assert) {
            this.expand();

            this.getField('Arguments').find(`.${TEXTEDITOR_INPUT_CLASS}`).trigger('dxclick');

            assert.strictEqual(this.writeText.callCount, 1, 'clipboard is written once');
            assert.strictEqual(
                this.writeText.firstCall.args[0],
                'name: "John Doe", email: "john@example.com", active: true, count: 10',
                'formatted arguments are copied',
            );
        });

        QUnit.test('should copy the field value once on a copy button click', function(assert) {
            this.expand();

            $(this.getCopyButton('Result').element()).trigger('dxclick');

            assert.strictEqual(this.writeText.callCount, 1, 'clipboard is written once');
            assert.strictEqual(this.writeText.firstCall.args[0], 'Completed', 'result is copied');
        });

        QUnit.test('should switch the copy button to the copied state after the value is copied', async function(assert) {
            this.expand();

            const copyButton = this.getCopyButton('Result');

            this.getField('Result').find(`.${TEXTEDITOR_INPUT_CLASS}`).trigger('dxclick');
            await this.waitForWrite();

            assert.strictEqual(copyButton.option('icon'), 'check', 'icon is correct');
            assert.strictEqual(copyButton.option('type'), 'success', 'type is correct');
            assert.strictEqual(copyButton.option('hint'), 'Copied', 'hint is correct');
            assert.strictEqual($(copyButton.element()).attr('aria-label'), 'Copied', 'aria-label is correct');
        });

        QUnit.test('should restore the copy state of the button after the copied state duration', async function(assert) {
            this.expand();

            const copyButton = this.getCopyButton('Result');

            this.getField('Result').find(`.${TEXTEDITOR_INPUT_CLASS}`).trigger('dxclick');
            await this.waitForWrite();

            this.clock.tick(COPIED_STATE_DURATION - 1);
            assert.strictEqual(copyButton.option('icon'), 'check', 'copied state is shown before the duration ends');

            this.clock.tick(1);
            assert.strictEqual(copyButton.option('icon'), 'copy', 'icon is restored');
            assert.strictEqual(copyButton.option('type'), 'normal', 'type is restored');
            assert.strictEqual(copyButton.option('hint'), 'Copy', 'hint is restored');
            assert.strictEqual($(copyButton.element()).attr('aria-label'), 'Copy', 'aria-label is restored');
        });

        QUnit.test('should restart the copied state duration on a repeated copy', async function(assert) {
            this.expand();

            const copyButton = this.getCopyButton('Result');
            const $input = this.getField('Result').find(`.${TEXTEDITOR_INPUT_CLASS}`);

            $input.trigger('dxclick');
            await this.waitForWrite();
            this.clock.tick(COPIED_STATE_DURATION - 1);

            $input.trigger('dxclick');
            await this.waitForWrite();
            this.clock.tick(COPIED_STATE_DURATION - 1);

            assert.strictEqual(copyButton.option('icon'), 'check');
        });

        QUnit.test('should keep the copy state of the button when writing to the clipboard fails', async function(assert) {
            this.writeText.returns(Promise.reject(new Error('Write permission denied')));
            this.expand();

            const copyButton = this.getCopyButton('Result');

            this.getField('Result').find(`.${TEXTEDITOR_INPUT_CLASS}`).trigger('dxclick');
            await this.waitForWrite().catch(() => {});

            assert.strictEqual(copyButton.option('icon'), 'copy');
        });

        QUnit.test('should clear the copied state timer on dispose', async function(assert) {
            this.expand();

            this.getField('Result').find(`.${TEXTEDITOR_INPUT_CLASS}`).trigger('dxclick');
            await this.waitForWrite();

            const timerCountWithCopiedState = this.clock.countTimers();

            this.instance.dispose();

            assert.strictEqual(this.clock.countTimers(), timerCountWithCopiedState - 1);
        });
    });

    QUnit.module('Options', () => {
        QUnit.test('should render new tool calls after the toolCalls option is changed at runtime', function(assert) {
            this.instance.option('toolCalls', [currentTimeCall, stockPriceCall]);

            assert.deepEqual(this.getNames(), ['2 tools']);
        });
    });

    QUnit.module('Accessibility', () => {
        QUnit.test('field inputs should be labelled with the field labels', function(assert) {
            this.expand();

            const labels = this.getFields().find(`.${TEXTEDITOR_INPUT_CLASS}`).map((_, element) => $(element).attr('aria-label')).get();

            assert.deepEqual(labels, ['Arguments', 'Result']);
        });

        QUnit.test('copy buttons should have a localized label', function(assert) {
            this.expand();

            const copyButton = this.getCopyButton('Arguments');

            assert.strictEqual($(copyButton.element()).attr('aria-label'), 'Copy', 'aria-label is correct');
            assert.strictEqual(copyButton.option('hint'), 'Copy', 'hint is correct');
        });
    });

    QUnit.module('Localization', () => {
        QUnit.test('should localize the group title, the field labels and the error badge', function(assert) {
            const defaultLocale = localization.locale();

            try {
                localization.loadMessages({
                    'ee': {
                        'dxChat-toolCallsGroupTitle': '{0} tööriista',
                        'dxChat-toolCallArgumentsLabel': 'Argumendid',
                        'dxChat-toolCallResultLabel': 'Tulemus',
                        'dxChat-toolCallErrorText': 'Viga',
                    },
                });
                localization.locale('ee');

                this.reinit({ toolCalls: [currentTimeCall, stockPriceCall] });
                this.expand();
                this.expand(2);

                const labels = this.getFields().find(`.${CHAT_TOOL_CALL_FIELD_LABEL_CLASS}`).map((_, element) => $(element).text()).get();

                assert.strictEqual(this.getNames()[0], '2 tööriista', 'group title is localized');
                assert.deepEqual(labels, ['Argumendid', 'Tulemus'], 'field labels are localized');
                assert.strictEqual(this.$element.find(`.${CHAT_TOOL_CALL_ERROR_BADGE_CLASS}`).text(), 'Viga', 'error badge is localized');
            } finally {
                localization.locale(defaultLocale);
            }
        });
    });
});
