import $ from 'jquery';
import ToolCallView, {
    CHAT_TOOL_CALL_VIEW_CLASS,
    CHAT_TOOL_CALL_TITLE_CLASS,
    CHAT_TOOL_CALL_ICON_CLASS,
    CHAT_TOOL_CALL_NAME_CLASS,
} from '__internal/ui/chat/tool_call_view/tool_call_view';

const { test } = QUnit;

const ACCORDION_CLASS = 'dx-accordion';
const ACCORDION_ITEM_TITLE_CLASS = 'dx-accordion-item-title';
const ICON_CLASS = 'dx-icon';

const toolCall = {
    name: 'getWeather',
    arguments: { city: 'London' },
    result: '15°C',
};

QUnit.module('ToolCallView', {
    beforeEach() {
        this.$element = $('<div>').appendTo('#qunit-fixture');
        this.instance = new ToolCallView(this.$element, { toolCalls: [toolCall] });
    },
    afterEach() {
        this.instance.dispose();
        this.$element.remove();
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
});
