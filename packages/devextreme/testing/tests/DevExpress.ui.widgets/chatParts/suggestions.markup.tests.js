import $ from 'jquery';

import Suggestions from '__internal/ui/chat/suggestions';

const CHAT_SUGGESTIONS_CLASS = 'dx-chat-suggestions';
const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const BUTTON_GROUP_ITEM_CLASS = 'dx-buttongroup-item';
const BUTTON_GROUP_OUTLINED_CLASS = 'dx-buttongroup-mode-outlined';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.$element = $('#component');
            this.instance = new Suggestions(this.$element, options);
            this.$suggestions = this.$element.find(`.${CHAT_SUGGESTIONS_CLASS}`);
        };

        this.reinit = (options) => {
            this.instance.dispose();
            this.$element.empty();
            init(options);
        };

        init({ items: [{ text: 'Item 1' }, { text: 'Item 2' }] });
    },
};

QUnit.module('Suggestions', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should render suggestions container with correct class', function(assert) {
            assert.strictEqual(this.$suggestions.length, 1, 'suggestions container is rendered');
            assert.ok(this.$suggestions.hasClass(CHAT_SUGGESTIONS_CLASS), 'has correct class');
        });

        QUnit.test('should have ButtonGroup class', function(assert) {
            assert.strictEqual(this.$suggestions.hasClass(BUTTON_GROUP_CLASS), true, 'ButtonGroup is rendered');
        });

        QUnit.test('should render correct number of items', function(assert) {
            this.reinit({ items: [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' }] });

            const $items = this.$element.find(`.${BUTTON_GROUP_ITEM_CLASS}`);

            assert.strictEqual($items.length, 3, 'correct number of items rendered');
        });

        QUnit.test('should render items with correct text', function(assert) {
            this.reinit({ items: [{ text: 'First' }, { text: 'Second' }] });

            const $items = this.$element.find(`.${BUTTON_GROUP_ITEM_CLASS}`);

            assert.strictEqual($items.eq(0).text(), 'First', 'first item text is correct');
            assert.strictEqual($items.eq(1).text(), 'Second', 'second item text is correct');
        });

        QUnit.test('should not render ButtonGroup if no options provided', function(assert) {
            this.reinit();

            assert.strictEqual(this.$suggestions.hasClass(BUTTON_GROUP_CLASS), false, 'ButtonGroup is not rendered');
        });

        QUnit.test('should use outlined stylingMode by default', function(assert) {
            assert.ok(this.$suggestions.hasClass(BUTTON_GROUP_OUTLINED_CLASS), 'outlined class applied by default');
        });

        QUnit.test('should allow overriding stylingMode', function(assert) {
            this.reinit({ items: [{ text: 'Item 1' }], stylingMode: 'text' });

            assert.notOk(this.$suggestions.hasClass(BUTTON_GROUP_OUTLINED_CLASS), 'outlined class is not applied');
        });
    });
});
