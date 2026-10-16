import $ from 'jquery';
import fx from 'common/core/animation/fx';
import ToolCallView, {
    CHAT_TOOL_CALL_VIEW_CLASS,
    CHAT_TOOL_CALL_TITLE_CLASS,
    CHAT_TOOL_CALL_ICON_CLASS,
    CHAT_TOOL_CALL_NAME_CLASS,
    CHAT_TOOL_CALL_CONTENT_CLASS,
    CHAT_TOOL_CALL_FIELD_CLASS,
    CHAT_TOOL_CALL_FIELD_LABEL_CLASS,
} from '__internal/ui/chat/tool_call_view/tool_call_view';

const { test } = QUnit;

const ACCORDION_CLASS = 'dx-accordion';
const ACCORDION_ITEM_TITLE_CLASS = 'dx-accordion-item-title';
const ACCORDION_ITEM_BODY_CLASS = 'dx-accordion-item-body';
const ICON_CLASS = 'dx-icon';
const TEXTAREA_CLASS = 'dx-textarea';

const toolCall = {
    name: 'getWeather',
    arguments: { city: 'London' },
    result: '15°C',
};

QUnit.module('ToolCallView', {
    beforeEach() {
        fx.off = true;
        this.$element = $('<div>').appendTo('#qunit-fixture');

        const init = (options) => {
            this.instance = new ToolCallView(this.$element, options);
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init({ toolCalls: [toolCall] });
    },
    afterEach() {
        this.instance.dispose();
        this.$element.remove();
        fx.off = false;
    },
}, () => {
    test('root element should have correct class', function(assert) {
        assert.strictEqual(this.$element.hasClass(CHAT_TOOL_CALL_VIEW_CLASS), true);
    });

    test('should render an accordion as a direct child of the root element', function(assert) {
        const $accordion = this.$element.children(`.${ACCORDION_CLASS}`);

        assert.strictEqual($accordion.length, 1);
    });

    test('item title should contain the icon and the name elements', function(assert) {
        const $title = this.$element.find(`.${ACCORDION_ITEM_TITLE_CLASS} > .${CHAT_TOOL_CALL_TITLE_CLASS}`);
        const $children = $title.children();

        assert.strictEqual($title.length, 1, 'title element exists');
        assert.strictEqual($children.eq(0).hasClass(ICON_CLASS), true, 'first child is an icon');
        assert.strictEqual($children.eq(0).hasClass(CHAT_TOOL_CALL_ICON_CLASS), true, 'icon is the toolbox icon');
        assert.strictEqual($children.eq(1).hasClass(CHAT_TOOL_CALL_NAME_CLASS), true, 'second child is the name');
        assert.strictEqual($children.eq(1).attr('title'), 'getWeather', 'name has a title attribute');
    });

    test('expanded item body should contain the content element with fields', function(assert) {
        this.$element.find(`.${ACCORDION_ITEM_TITLE_CLASS}`).trigger('dxclick');

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

    test('expanded group body should contain the content element with the nested accordion', function(assert) {
        this.reinit({ toolCalls: [toolCall, toolCall] });

        this.$element.find(`.${ACCORDION_ITEM_TITLE_CLASS}`).trigger('dxclick');

        const $content = this.$element.find(`.${ACCORDION_ITEM_BODY_CLASS} > .${CHAT_TOOL_CALL_CONTENT_CLASS}`);

        assert.strictEqual($content.length, 1, 'content element exists');
        assert.strictEqual($content.children(`.${ACCORDION_CLASS}`).length, 1, 'nested accordion is a direct child of the content');
    });
});
