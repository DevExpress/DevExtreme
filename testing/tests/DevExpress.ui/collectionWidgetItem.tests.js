const $ = require('jquery');
const CollectionWidget = require('ui/collection/ui.collection_widget.edit');
const CollectionWidgetItem = require('ui/collection/item');


QUnit.module('changing item field', {
    beforeEach: function() {
        const TestCollectionItem = this.TestCollectionItem = CollectionWidgetItem.inherit({
            _renderWatchers: function() {
                this._startWatcher('value', this._renderValue.bind(this));
            },
            _renderValue: function(value) {
                this._$element.data('value', value);
            },
            value: function(value) {
                this._renderValue(value);
            }
        });

        const TestCollection = this.TestCollection = CollectionWidget.inherit({
            _getDefaultOptions: function() {
                return $.extend(this.callBase(), {
                    valueExpr: 'value'
                });
            }
        });
        TestCollection.ItemClass = TestCollectionItem;
    }
});

QUnit.test('changing field that is basis for complex expression should correctly rerender item', function(assert) {
    const widget = new this.TestCollection($('<div>'), {
        items: [{ value: 1 }],
        valueExpr: function(data) {
            return data.value + 1;
        }
    });
    const $item = widget.itemElements().eq(0);

    assert.equal($item.data('value'), 2);

    widget.option('items[0].value', 2);
    assert.equal($item.data('value'), 3);
});

QUnit.test('changing field that is basis for complex with different field expression should correctly rerender item', function(assert) {
    const widget = new this.TestCollection($('<div>'), {
        items: [{ anotherValue: 1 }],
        valueExpr: function(data) {
            return data.anotherValue + 1;
        }
    });
    const $item = widget.itemElements().eq(0);

    assert.equal($item.data('value'), 2);

    widget.option('items[0].anotherValue', 2);
    assert.equal($item.data('value'), 3);
});

QUnit.test('changing complex item field should correctly rerender one item', function(assert) {
    const widget = new this.TestCollection($('<div>'), {
        items: [{ options: { value: 1 } }, {}]
    });
    const $itemElements = widget.itemElements();

    assert.equal($itemElements.eq(0).data('dxItemData').options.value, 1);

    // act
    widget.option('items[0].options.value', 2);

    // assert
    const $newItemElements = widget.itemElements();
    assert.equal($newItemElements.eq(0).data('dxItemData').options.value, 2, 'item 0 data is changed');
    assert.notEqual($newItemElements.get(0), $itemElements.get(0), 'item 0 element is changed');
    assert.equal($newItemElements.get(1), $itemElements.get(1), 'item 1 element is not changed');
});

QUnit.module('visible builtin');

const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

QUnit.test('visible should be rendered correctly by default', function(assert) {
    const widget = new CollectionWidget($('<div>'), {
        items: [{}]
    });
    const $item = widget.itemElements().eq(0);

    assert.ok(!$item.hasClass(INVISIBLE_STATE_CLASS));
});

QUnit.test('visible should be rendered correctly with value = true', function(assert) {
    const widget = new CollectionWidget($('<div>'), {
        items: [{ visible: true }]
    });
    const $item = widget.itemElements().eq(0);

    assert.ok(!$item.hasClass(INVISIBLE_STATE_CLASS));
});

QUnit.test('visible should be rendered correctly with value = false', function(assert) {
    const widget = new CollectionWidget($('<div>'), {
        items: [{ visible: false }]
    });
    const $item = widget.itemElements().eq(0);

    assert.ok($item.hasClass(INVISIBLE_STATE_CLASS));
});

QUnit.test('visible should be rendered correctly after value changed', function(assert) {
    const widget = new CollectionWidget($('<div>'), {
        items: [{}]
    });
    const $item = widget.itemElements().eq(0);

    widget.option('items[0].visible', false);

    assert.ok($item.hasClass(INVISIBLE_STATE_CLASS));
});


QUnit.module('disabled builtin');

const DISABLED_STATE_CLASS = 'dx-state-disabled';

QUnit.test('disabled should be rendered correctly by default', function(assert) {
    const widget = new CollectionWidget($('<div>'), {
        items: [{ disabled: false }]
    });
    const $item = widget.itemElements().eq(0);

    assert.ok(!$item.hasClass(DISABLED_STATE_CLASS));
});

QUnit.test('disabled should be rendered correctly with value = true', function(assert) {
    const widget = new CollectionWidget($('<div>'), {
        items: [{ disabled: true }]
    });
    const $item = widget.itemElements().eq(0);

    assert.ok($item.hasClass(DISABLED_STATE_CLASS));
});

QUnit.test('disabled should be rendered correctly after value changed', function(assert) {
    const widget = new CollectionWidget($('<div>'), {
        items: [{ disabled: false }]
    });
    const $item = widget.itemElements().eq(0);

    widget.option('items[0].disabled', true);

    assert.ok($item.hasClass(DISABLED_STATE_CLASS));
});
