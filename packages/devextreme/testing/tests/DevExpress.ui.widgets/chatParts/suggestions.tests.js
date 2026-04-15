import $ from 'jquery';

import Suggestions from '__internal/ui/chat/suggestions';

const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const BUTTON_GROUP_ITEM_CLASS = 'dx-buttongroup-item';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.$container = $('#component');
            this.instance = new Suggestions(this.$container, options);
        };

        this.getSuggestions = () => this.$container.children().eq(0);
        this.getItems = () => this.$container.find(`.${BUTTON_GROUP_ITEM_CLASS}`);

        this.reinit = (options) => {
            this.instance.dispose();
            this.$container.empty();
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

        QUnit.test('should clean ButtonGroup when called with undefined', function(assert) {
            assert.strictEqual(this.getSuggestions().hasClass(BUTTON_GROUP_CLASS), true, 'ButtonGroup rendered initially');

            this.instance.updateOptions(undefined);

            const $element = this.$container.children().eq(0);

            assert.strictEqual($element.hasClass(BUTTON_GROUP_CLASS), false, 'ButtonGroup cleaned after updateOptions(undefined)');
            assert.strictEqual($element.length, 1, 'container element remains in DOM');
        });

        QUnit.test('should clean ButtonGroup when called with empty object', function(assert) {
            assert.strictEqual(this.getSuggestions().hasClass(BUTTON_GROUP_CLASS), true, 'ButtonGroup rendered initially');

            this.instance.updateOptions({});

            assert.strictEqual(this.getSuggestions().hasClass(BUTTON_GROUP_CLASS), false, 'ButtonGroup cleaned after updateOptions({})');
            assert.strictEqual(this.getSuggestions().length, 1, 'container element remains in DOM');
        });
    });

    QUnit.module('clean', () => {
        QUnit.test('should remove ButtonGroup but keep element in DOM', function(assert) {
            this.instance.clean();

            assert.strictEqual(this.getSuggestions().hasClass(BUTTON_GROUP_CLASS), false, 'ButtonGroup is removed');
            assert.strictEqual(this.$container.children().length, 1, 'element remains in DOM');
        });
    });

    QUnit.module('dispose', () => {
        QUnit.test('should clean ButtonGroup and remove element from DOM', function(assert) {
            this.instance.dispose();

            assert.strictEqual(this.$container.find(`.${BUTTON_GROUP_ITEM_CLASS}`).length, 0, 'ButtonGroup items are cleaned');
            assert.strictEqual(this.$container.children().length, 0, 'element is removed from DOM');
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
