import $ from 'jquery';

import Suggestions from '__internal/ui/chat/suggestions';

const CHAT_SUGGESTIONS_CLASS = 'dx-chat-suggestions';
const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const BUTTON_GROUP_ITEM_CLASS = 'dx-buttongroup-item';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.$element = $('#component');
            this.instance = new Suggestions(this.$element, options);
        };

        this.getSuggestions = () => this.$element.find(`.${CHAT_SUGGESTIONS_CLASS}`);
        this.getItems = () => this.$element.find(`.${BUTTON_GROUP_ITEM_CLASS}`);

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
        QUnit.test('should be initialized correctly', function(assert) {
            assert.ok(this.instance instanceof Suggestions);
        });
    });

    QUnit.module('updateOptions', () => {
        QUnit.test('should update items list', function(assert) {
            this.instance.updateOptions({ items: [{ text: 'New Item 1' }, { text: 'New Item 2' }, { text: 'New Item 3' }] });

            const $items = this.getItems();

            assert.strictEqual($items.length, 3, 'items count updated');
            assert.strictEqual($items.eq(0).text(), 'New Item 1', 'first item text updated');
        });

        QUnit.test('should initialize ButtonGroup on updateOptions if not initialized', function(assert) {
            this.reinit();

            assert.strictEqual(this.getSuggestions().hasClass(BUTTON_GROUP_CLASS), false, 'ButtonGroup not rendered initially');

            this.instance.updateOptions({ items: [{ text: 'Item 1' }] });

            assert.strictEqual(this.getSuggestions().hasClass(BUTTON_GROUP_CLASS), true, 'ButtonGroup rendered after updateOptions');
            assert.strictEqual(this.getItems().length, 1, 'item rendered correctly');
        });

        QUnit.test('should update items to empty list', function(assert) {
            this.instance.updateOptions({ items: [] });

            const $items = this.getItems();

            assert.strictEqual($items.length, 0, 'all items removed');
        });
    });

    QUnit.module('dispose', () => {
        QUnit.test('should not throw on dispose', function(assert) {
            try {
                this.instance.dispose();
                assert.ok(true, 'dispose executed without errors');
            } catch(e) {
                assert.ok(false, `dispose threw an error: ${e.message}`);
            }
        });

        QUnit.test('should dispose without errors even if no items were provided', function(assert) {
            this.reinit({ items: [] });

            try {
                this.instance.dispose();
                assert.ok(true, 'dispose executed without errors');
            } catch(e) {
                assert.ok(false, `dispose threw an error: ${e.message}`);
            }
        });
    });

    QUnit.module('item click', () => {
        QUnit.test('should execute onItemClick callback when item is clicked', function(assert) {
            assert.expect(1);

            const clickedText = 'Item 1';

            this.reinit({
                items: [{ text: clickedText }, { text: 'Item 2' }],
                onItemClick: (e) => {
                    assert.strictEqual(e.itemData.text, clickedText, 'correct item passed to callback');
                },
            });

            const $firstItem = this.getItems().first();
            $firstItem.trigger('dxclick');
        });
    });
});
