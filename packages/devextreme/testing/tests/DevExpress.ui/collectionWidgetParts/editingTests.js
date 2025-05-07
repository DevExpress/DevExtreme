import $ from 'jquery';
import CollectionWidget from 'ui/collection/ui.collection_widget.edit';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';
import { CustomStore } from 'common/data/custom_store';
import executeAsyncMock from '../../../helpers/executeAsyncMock.js';
import keyboardMock from '../../../helpers/keyboardMock.js';

const ITEM_CLASS = 'dx-item';
const ITEM_SELECTED_CLASS = `${ITEM_CLASS}-selected`;
const ITEM_RESPONSE_WAIT_CLASS = `${ITEM_CLASS}-response-wait`;

const { module, test } = QUnit;

class TestComponent extends CollectionWidget {
    constructor(element, options) {
        super(element, options);
        this.NAME = 'TestComponent';
        this._activeStateUnit = '.item';
    }

    _itemClass() { return 'item'; }
    _itemDataKey() { return '123'; }
    _itemContainer() { return this.$element(); }
}

const getItemElement = (instance, itemIndex) => instance.itemElements().eq(itemIndex);

module('onSelectionChanging event', () => {
    module('parameters', () => {
        test('should have corect parameters', function(assert) {
            const selectionChangingStub = sinon.stub();
            const $element = $('#cmp');

            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectionMode: 'multiple',
                onSelectionChanging: selectionChangingStub
            });

            instance.selectItem(0);

            const e = selectionChangingStub.getCall(0).args[0];
            assert.strictEqual(Object.keys(e).length, 5, '5 parameters are presented');
            assert.strictEqual(e.component, instance, 'component parameter is correct');
            assert.strictEqual(e.element, instance.element(), 'element parameter is correct');
            assert.deepEqual(e.addedItems, [0], 'addedItems parameter is correct');
            assert.deepEqual(e.removedItems, [], 'removedItems parameter is correct');
            assert.strictEqual(e.cancel, false, 'cancel parameter is correct');
        });

        test('addedItems and removedItems patameters should be correct when new selection is applied', function(assert) {
            const $element = $('#cmp');

            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectionMode: 'multiple',
                selectedItemKeys: [0, 1, 2],
                onSelectionChanging: function({ addedItems, removedItems }) {
                    assert.deepEqual(addedItems, [3], 'addedItems is correct');
                    assert.deepEqual(removedItems, [0], 'removedItems is correct');
                }
            });

            instance.option('selectedItemKeys', [1, 2, 3]);
        });
    });

    test('should not be raised on selected item click if previous selection was cancelled', function(assert) {
        const selectionChangingStub = sinon.spy((args) => {
            args.cancel = true;
        });
        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: [0, 1],
            selectionMode: 'single',
            selectedIndex: 0,
            onSelectionChanging: selectionChangingStub
        });

        instance.selectItem(1);
        instance.selectItem(0);

        assert.strictEqual(selectionChangingStub.callCount, 1, 'selectionChanging is raised only once');
    });

    module('should be triggered on selection change', () => {
        test('if is subscribed using "on" method', function(assert) {
            const selectionChangingHandler = sinon.stub();
            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectionMode: 'multiple'
            });

            instance.on('selectionChanging', selectionChangingHandler);

            instance.selectItem(1);

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
        });

        test('if is passed on initial config', function(assert) {
            const selectionChangingHandler = sinon.stub();
            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectionMode: 'multiple',
                onSelectionChanging: selectionChangingHandler
            });

            instance.selectItem(1);

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
        });

        test('if is changed at runtime', function(assert) {
            const selectionChangingHandler = sinon.stub();

            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectionMode: 'multiple',
            });

            instance.option('onSelectionChanging', selectionChangingHandler);
            instance.selectItem(1);

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
        });
    });

    QUnit.test('should be raised only once when selectOnFocus=true and item is clicked', function(assert) {
        const clock = sinon.useFakeTimers();
        const selectionChangingHandler = sinon.spy((e) => {
            e.cancel = true;
        });
        const selectionChangedHandler = sinon.stub();

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: [0, 1, 2, 3],
            selectionMode: 'multiple',
            selectedIndex: 0,
            focusStateEnabled: true,
            selectOnFocus: true,
            onSelectionChanging: selectionChangingHandler,
            onSelectionChanged: selectionChangedHandler
        });

        const $items = $(instance.itemElements());
        const $item = $items.eq(1);

        $item.trigger('pointerdown');
        $item.trigger('dxclick');
        clock.tick();

        assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
        assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged should not be raised');
        assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex should be remain unchanged');

        clock.restore();
    });

    QUnit.test('should not be raised on component focusin', function(assert) {
        const clock = sinon.useFakeTimers();
        const selectionChangingHandler = sinon.spy((e) => {
            e.cancel = true;
        });
        const selectionChangedHandler = sinon.stub();

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: [0, 1, 2, 3],
            selectionMode: 'multiple',
            selectedIndex: 0,
            focusStateEnabled: true,
            selectOnFocus: true,
            onSelectionChanging: selectionChangingHandler,
            onSelectionChanged: selectionChangedHandler
        });

        const $items = $(instance.itemElements());
        const $item = $items.eq(1);

        instance.option('focusedElement', $item.get(0));

        assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called because of item focusing');

        instance.focus();
        clock.tick();

        assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is not called after component focusin');
        clock.restore();
    });

    QUnit.module('when previous selection request is not processed yet', () => {
        QUnit.test('should be ignored, previous request is applied', function(assert) {
            const done = assert.async();

            const delay = 200;

            const selectionChangingHandler = sinon.spy((e) => {
                e.cancel = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(false);
                    }, delay);
                });
            });
            const selectionChangedHandler = sinon.stub();

            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectionMode: 'single',
                selectedIndex: 0,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            assert.strictEqual(instance.option('selectedIndex'), 0, 'initially selectedIndex should be 0');

            instance.selectItem(1);

            setTimeout(() => {
                assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
                assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged should not be raised');
                assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex should be remain unchanged');

                const secondSelectionDeferred = instance.selectItem(2);
                assert.strictEqual(secondSelectionDeferred.state(), 'rejected', 'second selection request is rejected');

                setTimeout(() => {
                    assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');
                    assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged is raised');
                    assert.strictEqual(instance.option('selectedIndex'), 1, 'selectedIndex is changed');

                    setTimeout(() => {
                        assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged is raised only once');
                        assert.strictEqual(instance.option('selectedIndex'), 1, 'selectedIndex is not updated after second request timeout');
                        done();
                    }, delay / 2);
                }, delay / 2);
            }, delay / 2);
        });

        QUnit.test('should be ignored, previous request is canceled', function(assert) {
            const done = assert.async();

            const delay = 200;

            const selectionChangingHandler = sinon.spy((e) => {
                e.cancel = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, delay);
                });
            });
            const selectionChangedHandler = sinon.stub();

            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectionMode: 'single',
                selectedIndex: 0,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            assert.strictEqual(instance.option('selectedIndex'), 0, 'initially selectedIndex should be 0');

            instance.selectItem(1);

            setTimeout(() => {
                assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
                assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged should not be raised');
                assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex should be remain unchanged');

                const secondSelectionDeferred = instance.selectItem(2);
                assert.strictEqual(secondSelectionDeferred.state(), 'rejected', 'second selection request is rejected');

                setTimeout(() => {
                    assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging is called once');
                    assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged is not raised');
                    assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is not changed');

                    setTimeout(() => {
                        assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged is not raised after second request timeout');
                        assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex is not updated after second request timeout');
                        done();
                    }, delay / 2);
                }, delay / 2);
            }, delay / 2);
        });
    });

    QUnit.module('should cancel selection change', () => {
        QUnit.test('if e.cancel=true', function(assert) {
            const selectionChangingHandler = sinon.spy((e) => {
                e.cancel = true;
            });
            const selectionChangedHandler = sinon.stub();

            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectionMode: 'multiple',
                selectedIndex: 0,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            assert.strictEqual(instance.option('selectedIndex'), 0, 'initially selectedIndex should be 0');

            instance.selectItem(1);

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
            assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged should not be raised');
            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex should be remain unchanged');
        });

        QUnit.test('after focusing if e.cancel=true and selectOnFocus=true', function(assert) {
            const clock = sinon.useFakeTimers();
            const selectionChangingHandler = sinon.spy((e) => {
                e.cancel = true;
            });
            const selectionChangedHandler = sinon.stub();

            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectionMode: 'multiple',
                selectedIndex: 0,
                focusStateEnabled: true,
                selectOnFocus: true,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            const keyboard = keyboardMock($element);

            $element.trigger('focusin');
            keyboard.keyDown('right');

            clock.tick();

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
            assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged should not be raised');
            assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex should be remain unchanged');

            clock.restore();
        });

        QUnit.test('if e.cancel is a promise resolved with true', function(assert) {
            const done = assert.async();

            const selectionChangingHandler = sinon.spy((e) => {
                e.cancel = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    });
                });
            });
            const selectionChangedHandler = sinon.stub();

            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectionMode: 'multiple',
                selectedIndex: 0,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            assert.strictEqual(instance.option('selectedIndex'), 0, 'initially selectedIndex should be 0');

            instance.selectItem(1);

            setTimeout(() => {
                assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
                assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged should not be raised');
                assert.strictEqual(instance.option('selectedIndex'), 0, 'selectedIndex should be remain unchanged');
                done();
            });
        });
    });

    QUnit.module('should not prevent selection change', () => {
        QUnit.test('if e.cancel is false', function(assert) {
            const selectionChangingHandler = sinon.stub();
            const selectionChangedHandler = sinon.stub();

            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectedIndex: 0,
                selectionMode: 'single',
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            assert.strictEqual(instance.option('selectedIndex'), 0, 'initially selectedIndex should be 0');

            instance.selectItem(1);

            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
            assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged should be raised once');
            assert.strictEqual(instance.option('selectedIndex'), 1, 'selectedIndex should be updated');
        });

        QUnit.test('if e.cancel is false even if previous request was cancelled and dataSource.store.key is used', function(assert) {
            let cancelSelectionChange = false;
            const selectionChangingHandler = sinon.spy((e) => {
                e.cancel = cancelSelectionChange;
            });
            const selectionChangedHandler = sinon.stub();

            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                dataSource: new DataSource({
                    store: new ArrayStore({
                        key: 'id',
                        data: [{ text: '1', id: 1 }, { text: '2', id: 2 }],
                    }),
                }),
                selectionMode: 'multiple',
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            assert.strictEqual(instance.option('selectedIndex'), -1, 'no item is selected initially');

            const $items = $(instance.itemElements());
            const $firstItem = $items.eq(0);

            cancelSelectionChange = false;
            $firstItem.trigger('dxclick');
            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
            assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged should be raised once');
            assert.strictEqual(instance.option('selectedIndex'), 0, 'item is selected');

            cancelSelectionChange = true;
            $firstItem.trigger('dxclick');
            assert.strictEqual(selectionChangingHandler.callCount, 2, 'selectionChanging should be raised once');
            assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged is not raised');
            assert.strictEqual(instance.option('selectedIndex'), 0, 'item is still selected');

            cancelSelectionChange = false;
            $firstItem.trigger('dxclick');
            assert.strictEqual(selectionChangingHandler.callCount, 3, 'selectionChanging should be raised once');
            assert.strictEqual(selectionChangedHandler.callCount, 2, 'selectionChanged is raised');
            assert.strictEqual(instance.option('selectedIndex'), -1, 'item is deselected');
        });

        QUnit.test('if e.cancel is a promise resolved with false', function(assert) {
            const done = assert.async();

            const selectionChangingHandler = sinon.spy((e) => {
                e.cancel = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(false);
                    });
                });
            });
            const selectionChangedHandler = sinon.stub();

            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectionMode: 'single',
                selectedIndex: 0,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            instance.selectItem(1);

            assert.strictEqual(instance.option('selectedIndex'), 0, 'initially selectedIndex should be 0');
            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised immediately after click');
            assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged should not be raised until promise resolves');

            setTimeout(() => {
                assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
                assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged should be raised once');
                assert.strictEqual(instance.option('selectedIndex'), 1, 'selectedIndex should be updated');
                done();
            });
        });

        QUnit.test('if e.cancel is a rejected promise', function(assert) {
            const done = assert.async();

            const selectionChangingHandler = sinon.spy((e) => {
                e.cancel = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject();
                    });
                });
            });
            const selectionChangedHandler = sinon.stub();

            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                items: [0, 1, 2, 3],
                selectionMode: 'single',
                selectedIndex: 0,
                onSelectionChanging: selectionChangingHandler,
                onSelectionChanged: selectionChangedHandler
            });

            instance.selectItem(1);

            assert.strictEqual(instance.option('selectedIndex'), 0, 'initially selectedIndex should be 0');
            assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised immediately after click');
            assert.strictEqual(selectionChangedHandler.callCount, 0, 'selectionChanged should not be raised until promise resolves');

            setTimeout(() => {
                assert.strictEqual(selectionChangingHandler.callCount, 1, 'selectionChanging should be raised once');
                assert.strictEqual(selectionChangedHandler.callCount, 1, 'selectionChanged should be raised once');
                assert.strictEqual(instance.option('selectedIndex'), 1, 'selectedIndex should be updated');
                done();
            });
        });
    });
});

module('selecting of items', {
    beforeEach: function() {
        this.items = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }, { a: 8 }];
        this.$element = $('#cmp');
        this.instance = new TestComponent(this.$element, {
            items: this.items,
            selectionMode: 'multiple'
        });
    }
}, () => {
    test('selectItem by node should add class to element', function(assert) {
        const $item = getItemElement(this.instance, 0);

        this.instance.selectItem($item);

        assert.ok($item.hasClass(ITEM_SELECTED_CLASS), 'class added');
    });

    test('selectItem by index should add class to element', function(assert) {
        const $item = getItemElement(this.instance, 0);

        this.instance.selectItem(0);

        assert.ok($item.hasClass(ITEM_SELECTED_CLASS), 'class added');
    });

    test('selectItem by itemData should add class to element', function(assert) {
        const $item = getItemElement(this.instance, 0);

        this.instance.selectItem(this.items[0]);

        assert.ok($item.hasClass(ITEM_SELECTED_CLASS), 'class added');
    });

    test('selectItem by itemData should not fail if itemData is a string with special chars', function(assert) {
        const items = ['one.', 'two.', 'three.', 'four.'];
        this.instance.option('items', items);

        try {
            this.instance.selectItem(items[2]);

            const $item = getItemElement(this.instance, 2);
            assert.ok($item.hasClass(ITEM_SELECTED_CLASS), 'class added');
        } catch(error) {
            assert.ok(false, 'no error was thrown');
        }
    });

    test('Items should not be unwrapped if plain edit strategy is used', function(assert) {
        const items = [{ text: 'Item 1', items: [1] }, { text: 'Item 2', items: [2] }];
        this.instance.option({
            'items': items,
            selectedIndex: 0
        });

        const $item = getItemElement(this.instance, 0);
        assert.ok($item.hasClass(ITEM_SELECTED_CLASS), 'item was selected');
    });

    test('selectItem should add item to selectedItems', function(assert) {
        const selection = [1, 5, 0, 6, 8];
        const $items = this.instance.itemElements();
        const that = this;

        const selectItem = function(index) {
            that.instance.selectItem($items.eq(index));
        };

        $.each(selection, function(index, value) {
            selectItem(value);
        });

        const selected = this.instance.option('selectedItems');

        assert.equal(selected.length, selection.length, 'selection must have same length with selected');

        $.each(selection, function(index, value) {
            assert.notEqual($.inArray(that.items[value], selected), -1, that.items[value] + ' must be present in selected');
        });
    });

    test('selectItem should not process item which is not presented', function(assert) {
        this.instance.selectItem($('<div>'));
        assert.equal(this.instance.option('selectedItems').length, 0, 'selection must be empty');
    });

    test('selectItem should not process already selected item', function(assert) {
        this.instance.selectItem(0);
        this.instance.selectItem(0);
        assert.equal(this.instance.option('selectedItems').length, 1, 'selection must contain only one item');
    });

    test('unselectItem by node should remove class from element', function(assert) {
        const $item = getItemElement(this.instance, 0);

        this.instance.selectItem($item);
        this.instance.unselectItem($item);

        assert.ok(!$item.hasClass(ITEM_SELECTED_CLASS), 'class removed');
    });

    test('unselectItem by index should remove class from element', function(assert) {
        const $item = getItemElement(this.instance, 0);

        this.instance.selectItem(0);
        this.instance.unselectItem(0);

        assert.ok(!$item.hasClass(ITEM_SELECTED_CLASS), 'class removed');
    });

    test('unselectItem by itemData should remove class from element', function(assert) {
        const $item = getItemElement(this.instance, 0);

        this.instance.selectItem(0);
        this.instance.unselectItem(this.items[0]);

        assert.ok(!$item.hasClass(ITEM_SELECTED_CLASS), 'class removed');
    });

    test('unselectItem should remove item from selectedItems', function(assert) {
        const twiceClicking = [1, 5, 0, 6, 8];
        const $items = this.instance.itemElements();
        const that = this;

        const selectItem = function(index) {
            that.instance.selectItem($items.eq(index));
        };
        const unselectItem = function(index) {
            that.instance.unselectItem($items.eq(index));
        };

        $.each(twiceClicking, function(index, value) {
            selectItem(value);
            unselectItem(value);
        });

        assert.equal(this.instance.option('selectedItems').length, 0, 'should not be selected elements');
    });

    test('unselectItem should not process item which is not presented', function(assert) {
        this.instance.option('selectedItems', [this.items[0]]);

        this.instance.unselectItem($('<div>'));
        assert.equal(this.instance.option('selectedItems').length, 1, 'selection must contain only one item');
    });

    test('unselectItem should not process already selected item', function(assert) {
        this.instance.option('selectedItems', [this.items[0]]);

        this.instance.unselectItem(1);
        assert.equal(this.instance.option('selectedItems').length, 1, 'selection must contain only one item');
    });

    test('isItemSelected by node should reflect current item state', function(assert) {
        const $items = this.instance.itemElements();

        this.instance.selectItem($items.eq(0));
        assert.equal(this.instance.isItemSelected($items.eq(0)), true, 'isItemSelected return proper state');

        this.instance.unselectItem($items.eq(0));
        assert.equal(this.instance.isItemSelected($items.eq(0)), false, 'isItemSelected return proper state');
    });

    test('isItemSelected by index should reflect current item state', function(assert) {
        this.instance.selectItem(0);
        assert.equal(this.instance.isItemSelected(0), true, 'isItemSelected return proper state');

        this.instance.unselectItem(0);
        assert.equal(this.instance.isItemSelected(0), false, 'isItemSelected return proper state');
    });

    test('selection should be same when list refresh', function(assert) {
        const selection = [1, 5, 0, 6, 8];
        let $items = this.instance.itemElements();
        const that = this;

        const selectItem = function(index) {
            that.instance.selectItem($items.eq(index));
        };

        $.each(selection, function(index, value) {
            selectItem(value);
        });

        this.instance._refresh();

        const selected = this.instance.option('selectedItems');

        assert.equal(selected.length, selection.length, 'items in _selectedItems is presented');
        assert.equal(this.$element.find('.' + ITEM_SELECTED_CLASS).length, selection.length, 'selected elements is presented');

        $items = this.instance.itemElements();
        $.each(selection, function(index, value) {
            assert.ok($items.eq(value).hasClass(ITEM_SELECTED_CLASS), that.items[value] + ' must have selected class');
            assert.notEqual($.inArray(that.items[value], selected), -1, that.items[value] + ' must be present in selectedItems');
        });
    });

    test('selection shouldn be correct after item property was changed', function(assert) {
        const items = [{ a: 0, disabled: true }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            selectionMode: 'multiple',
            items: items,
            selectedIndex: 0
        });

        instance.option('items[0].disabled', false);
        instance.option('selectedIndex', 1);

        assert.equal($element.find('.' + ITEM_SELECTED_CLASS).length, 1, 'only one item is selected');
    });

    test('deleteItem should change selected items', function(assert) {
        this.instance.selectItem(getItemElement(this.instance, 0));
        this.instance.selectItem(getItemElement(this.instance, 1));
        this.instance.selectItem(getItemElement(this.instance, 2));
        this.instance.deleteItem(getItemElement(this.instance, 1));

        assert.deepEqual(this.instance.option('selectedItems'), [{ a: 0 }, { a: 2 }], 'item not deleted');
    });

    test('onItemSelect should not be fired on widget rendering', function(assert) {
        assert.expect(0);

        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');

        new TestComponent($element, {
            items: items,
            selectedItems: items,
            onItemSelect: function() {
                assert.ok(false, 'select action triggered');
            },
            selectionMode: 'multiple'
        });
    });

    test('onSelectionChanged should be fired if selection changed', function(assert) {

        this.instance.option('onSelectionChanged', function(args) {
            assert.ok(true, 'select action triggered');
        });

        this.instance.option('selectedItems', [this.items[0]]);
    });

    test('onSelectionChanged should have correct parameters', function(assert) {
        const selectionChangedStub = sinon.stub();
        this.instance.option('onSelectionChanged', selectionChangedStub);

        this.instance.option('selectedIndex', 1);

        const e = selectionChangedStub.getCall(0).args[0];
        assert.strictEqual(Object.keys(e).length, 4, '4 parameters are presented');
        assert.strictEqual(e.component, this.instance, 'component parameter is correct');
        assert.strictEqual(e.element, this.instance.element(), 'element parameter is correct');
        assert.deepEqual(e.addedItems, [{ 'a': 1 }], 'addedItems parameter is correct');
        assert.deepEqual(e.removedItems, [], 'removedItems parameter is correct');
    });

    test('onSelectionChanged should not be fired if selection not changed', function(assert) {
        assert.expect(0);

        this.instance.option('onSelectionChanged', function(args) {
            assert.ok(false, 'select action triggered');
        });

        this.instance.option('selectedItems', []);
    });

    test('onSelectionChanged should be fired with correct added items', function(assert) {
        const that = this;

        this.instance.option({
            selectedItems: [this.items[1]],
            onSelectionChanged: function(args) {
                assert.deepEqual(args.addedItems, [that.items[0]], 'correct added items specified');
            }
        });

        this.instance.option('selectedItems', [this.items[0]]);
    });

    test('onSelectionChanged should be fired with correct added and removed items when keyExpr or DataSource Store key is specified', function(assert) {
        const items = [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }];
        const $element = $('<div>');
        const selectionChangedHandler = sinon.spy();
        const instance = new TestComponent($element, {
            dataSource: new DataSource({
                store: new ArrayStore({
                    key: 'id',
                    data: items
                })
            }),
            selectedItemKeys: [2],
            onSelectionChanged: selectionChangedHandler
        });

        instance.option('selectedItemKeys', [1]);

        assert.equal(selectionChangedHandler.callCount, 1, 'selectionChanged was fired once');
        assert.deepEqual(selectionChangedHandler.getCall(0).args[0].addedItems, [items[0]], 'first item should be selected');
        assert.deepEqual(selectionChangedHandler.getCall(0).args[0].removedItems, [items[1]], 'second item should be deselected');
    });

    test('onSelectionChanged should be fired with correct removed items', function(assert) {
        const that = this;

        this.instance.option({
            selectedItems: [this.items[0], this.items[1]],
            onSelectionChanged: function(args) {
                assert.deepEqual(args.removedItems, [that.items[0]], 'correct added items specified');
            },
        });

        this.instance.option('selectedItems', [this.items[1]]);
    });

    test('onSelectionChanged should be fired if widget disabled', function(assert) {

        this.instance.option({
            selectedItems: [this.items[0], this.items[1]],
            disabled: true,
            onSelectionChanged: function(args) {
                assert.ok(true, 'select action triggered');
            }
        });

        this.instance.option('selectedItems', []);
    });

    test('changing selection should work inside onSelectionChanged handler', function(assert) {
        const that = this;

        this.instance.option({
            selectedItems: [this.items[0], this.items[1]],
            disabled: true,
            onSelectionChanged: function(args) {
                if(that.instance.option('selectedItems').length === 1) {
                    that.instance.option('selectedItems', []);
                }
            }
        });

        this.instance.option('selectedItems', [this.items[0]]);
        assert.ok(!this.instance.isItemSelected(0), 'selection changed');
    });

    test('selection should not be applied if selection mode is none', function(assert) {
        this.instance.option({
            selectedIndex: 0,
            selectionMode: 'none'
        });

        this.instance.option('selectedItems', [this.items[1]]);
        this.instance.option('selectedIndex', 2);
        this.instance.option('selectedItemKeys', { a: 3 });
        this.instance.selectItem(this.items[4]);

        assert.equal(this.instance.itemElements().filter('.dx-item-selected').length, 0, 'there are no items selected');
    });

    test('select unexisting item by selectedItems option should restore previous selection', function(assert) {
        this.instance.option({
            selectionRequired: true,
            selectionMode: 'single',
            selectedIndex: 2
        });

        this.instance.option('selectedItems', [{ text: 'UnExisting item' }]);

        assert.deepEqual(this.instance.option('selectedItems'), [this.items[2]], 'selectedItems is correct');
        assert.deepEqual(this.instance.option('selectedItem'), this.items[2], 'selectedItem is correct');
        assert.equal(this.instance.option('selectedIndex'), 2, 'selectedIndex is correct');
        assert.deepEqual(this.instance.option('selectedItemKeys'), [this.items[2]], 'selectedItemKeys is correct');
        assert.ok(getItemElement(this.instance, 2).hasClass('dx-item-selected'), 'selected item class is on the correct item');
    });

    test('select unexisting item by selectedItem option should restore previous selection', function(assert) {
        this.instance.option({
            selectionRequired: true,
            selectionMode: 'single',
            selectedIndex: 2
        });

        this.instance.option('selectedItem', { text: 'UnExisting item' });

        assert.deepEqual(this.instance.option('selectedItems'), [this.items[2]], 'selectedItems is correct');
        assert.deepEqual(this.instance.option('selectedItem'), this.items[2], 'selectedItem is correct');
        assert.equal(this.instance.option('selectedIndex'), 2, 'selectedIndex is correct');
        assert.deepEqual(this.instance.option('selectedItemKeys'), [this.items[2]], 'selectedItemKeys is correct');
        assert.ok(getItemElement(this.instance, 2).hasClass('dx-item-selected'), 'selected item class is on the correct item');
    });

    test('select unexisting item by selectedIndex option should restore previous selection', function(assert) {
        this.instance.option({
            selectionRequired: true,
            selectionMode: 'single',
            selectedIndex: 2
        });

        this.instance.option('selectedIndex', -10);

        assert.deepEqual(this.instance.option('selectedItems'), [this.items[2]], 'selectedItems is correct');
        assert.deepEqual(this.instance.option('selectedItem'), this.items[2], 'selectedItem is correct');
        assert.equal(this.instance.option('selectedIndex'), 2, 'selectedIndex is correct');
        assert.deepEqual(this.instance.option('selectedItemKeys'), [this.items[2]], 'selectedItemKeys is correct');
        assert.ok(getItemElement(this.instance, 2).hasClass('dx-item-selected'), 'selected item class is on the correct item');
    });

    test('select unexisting item by selectedItemKeys option should restore previous selection', function(assert) {
        this.instance.option({
            selectionRequired: true,
            selectionMode: 'single',
            selectedIndex: 2
        });

        this.instance.option('selectedItemKeys', [{ text: 'UnExisting item key' }]);

        assert.deepEqual(this.instance.option('selectedItems'), [this.items[2]], 'selectedItems is correct');
        assert.deepEqual(this.instance.option('selectedItem'), this.items[2], 'selectedItem is correct');
        assert.equal(this.instance.option('selectedIndex'), 2, 'selectedIndex is correct');
        assert.deepEqual(this.instance.option('selectedItemKeys'), [this.items[2]], 'selectedItemKeys is correct');
        assert.ok(getItemElement(this.instance, 2).hasClass('dx-item-selected'), 'selected item class is on the correct item');
    });

    test('select unexisting item by selectItem method should restore previous selection', function(assert) {
        this.instance.option({
            selectionRequired: true,
            selectionMode: 'single',
            selectedIndex: 2
        });

        this.instance.selectItem({ text: 'UnExisting item' });

        assert.deepEqual(this.instance.option('selectedItems'), [this.items[2]], 'selectedItems is correct');
        assert.deepEqual(this.instance.option('selectedItem'), this.items[2], 'selectedItem is correct');
        assert.equal(this.instance.option('selectedIndex'), 2, 'selectedIndex is correct');
        assert.deepEqual(this.instance.option('selectedItemKeys'), [this.items[2]], 'selectedItemKeys is correct');
        assert.ok(getItemElement(this.instance, 2).hasClass('dx-item-selected'), 'selected item class is on the correct item');
    });

    test('select should work when items are not equal by the link and store key is specified', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            const instance = new TestComponent($('<div>'), {
                selectionMode: 'multiple',
                dataSource: {
                    load: function(options) {
                        const d = $.Deferred();
                        const items = [
                            { id: 1, text: 'Item 1' },
                            { id: 2, text: 'Item 2' }
                        ];

                        setTimeout(function() {
                            if(options.filter) {
                                d.resolve([{ id: 2, text: 'Item 2' }]);
                            } else {
                                d.resolve(items);
                            }
                        }, 0);

                        return d.promise();
                    },
                    key: 'id'
                },
                selectedItem: { id: 2, text: 'Detached item 2' }
            });

            clock.tick();

            assert.equal(instance.option('selectedItem').text, 'Item 2', 'selectedItem is correct');
            assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
            assert.deepEqual(instance.option('selectedItemKeys'), [2], 'selectedItemKeys is correct');
            assert.equal(instance.option('selectedItems')[0].text, 'Item 2', 'selectedItems is correct');
            assert.ok(getItemElement(instance, 1).hasClass('dx-item-selected'), 'selected item class is on the correct item');
        } finally {
            clock.restore();
        }
    });

    test('selection should work with custom store without filter implementation', function(assert) {
        const clock = sinon.useFakeTimers();

        try {
            const instance = new TestComponent($('<div>'), {
                selectionMode: 'multiple',
                dataSource: {
                    load: function() {
                        const d = $.Deferred();
                        const items = [
                            { id: 1, text: 'Item 1' },
                            { id: 2, text: 'Item 2' }
                        ];

                        setTimeout(function() {
                            d.resolve(items);
                        }, 0);

                        return d.promise();
                    },
                    key: 'id'
                },
                selectedItem: { id: 2, text: 'Detached item 2' }
            });

            clock.tick();

            assert.equal(instance.option('selectedItem').text, 'Item 2', 'selectedItem is correct');
            assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
            assert.deepEqual(instance.option('selectedItemKeys'), [2], 'selectedItemKeys is correct');
            assert.equal(instance.option('selectedItems')[0].text, 'Item 2', 'selectedItems is correct');
            assert.ok(getItemElement(instance, 1).hasClass('dx-item-selected'), 'selected item class is on the correct item');
        } finally {
            clock.restore();
        }
    });

    test('selectedItems should be cleared if datasource instance has been changed to null', function(assert) {
        const instance = new TestComponent($('<div>'), {
            selectionMode: 'multiple',
            dataSource: [1, 2, 3],
            selectedItemKeys: [1, 2]
        });

        assert.deepEqual(instance.option('selectedItems'), [1, 2], 'selectedItems is correct');
        assert.deepEqual(instance.option('selectedItem'), 1, 'selectedItem is correct');
        assert.deepEqual(instance.option('selectedItemKeys'), [1, 2], 'selectedItem is correct');

        instance.option('dataSource', null);

        assert.deepEqual(instance.option('selectedItems'), [], 'selectedItems was cleared');
        assert.strictEqual(instance.option('selectedItem'), undefined, 'selectedItem was cleared');
        assert.deepEqual(instance.option('selectedItemKeys'), [], 'selectedItemKeys was cleared');
    });

    test('selectedItems should be cleared if datasource instance has been changed to empty array', function(assert) {
        const instance = new TestComponent($('<div>'), {
            selectionMode: 'multiple',
            dataSource: [1, 2, 3],
            selectedItemKeys: [1, 2]
        });

        assert.deepEqual(instance.option('selectedItems'), [1, 2], 'selectedItems is correct');
        assert.deepEqual(instance.option('selectedItem'), 1, 'selectedItem is correct');
        assert.deepEqual(instance.option('selectedItemKeys'), [1, 2], 'selectedItem is correct');

        instance.option('dataSource', []);

        assert.deepEqual(instance.option('selectedItems'), [], 'selectedItems was cleared');
        assert.strictEqual(instance.option('selectedItem'), undefined, 'selectedItem was cleared');
        assert.deepEqual(instance.option('selectedItemKeys'), [], 'selectedItemKeys was cleared');
    });

    test('selectedItems should not be cleared if datasource instance has been changed', function(assert) {
        const instance = new TestComponent($('<div>'), {
            selectionMode: 'multiple',
            dataSource: [1, 2, 3],
            selectedItemKeys: [1, 2]
        });

        assert.deepEqual(instance.option('selectedItems'), [1, 2], 'selectedItems is correct');
        assert.deepEqual(instance.option('selectedItem'), 1, 'selectedItem is correct');
        assert.deepEqual(instance.option('selectedItemKeys'), [1, 2], 'selectedItem is correct');

        instance.option('dataSource', [1, 2, 3, 4]);

        assert.deepEqual(instance.option('selectedItems'), [1, 2], 'selectedItems wasn\'t cleared');
        assert.strictEqual(instance.option('selectedItem'), 1, 'selectedItem wasn\'t cleared');
        assert.deepEqual(instance.option('selectedItemKeys'), [1, 2], 'selectedItemKeys wasn\'t cleared');
    });

    // T579731
    test('selectedItems should not be cleared if datasource instance has been changed to a dataSource config', function(assert) {
        const instance = new TestComponent($('<div>'), {
            selectionMode: 'multiple',
            dataSource: [1, 2, 3],
            selectedItemKeys: [1, 2]
        });

        assert.deepEqual(instance.option('selectedItems'), [1, 2], 'selectedItems is correct');
        assert.deepEqual(instance.option('selectedItem'), 1, 'selectedItem is correct');
        assert.deepEqual(instance.option('selectedItemKeys'), [1, 2], 'selectedItem is correct');

        instance.option('dataSource', { store: [1, 2, 3, 4] });

        assert.deepEqual(instance.option('selectedItems'), [1, 2], 'selectedItems wasn\'t cleared');
        assert.strictEqual(instance.option('selectedItem'), 1, 'selectedItem wasn\'t cleared');
        assert.deepEqual(instance.option('selectedItemKeys'), [1, 2], 'selectedItemKeys wasn\'t cleared');
    });

    test('option change should hsve correct arguments after deselecting a value', function(assert) {
        assert.expect(3);

        const instance = new TestComponent($('<div>'), {
            selectionMode: 'multiple',
            dataSource: [1, 2, 3],
            onOptionChanged: function(args) {
                if(args.name !== 'selectedItems') {
                    return;
                }
                assert.notStrictEqual(args.previousValue, args.value, 'values are not equal');
            }
        });

        instance.selectItem(1);
        instance.unselectItem(1);
    });
});


module('selecting of item keys', {
    beforeEach: function() {
        this.$element = $('#cmp');
    }
}, () => {
    test('widget works fine if selectedItemKeys is null', function(assert) {
        const items = [
            { id: 1, key: 'key1', text: 'Item 1' },
            { id: 2, key: 'key2', text: 'Item 2' },
            { id: 3, key: 'key3', text: 'Item 3' }
        ];

        const instance = new TestComponent(this.$element, {
            items: items,
            keyExpr: 'id',
            selectionMode: 'multiple',
            selectedItemKeys: null
        });

        assert.deepEqual(instance.option('selectedItems'), [], 'selectedItems is correct');
        assert.deepEqual(instance.option('selectedItem'), null, 'selectedItem is correct');
        assert.equal(instance.option('selectedIndex'), -1, 'selectedIndex is correct');
        assert.equal(instance.option('selectedItemKeys'), null, 'selectedItemKeys is correct');
    });

    test('selectedItemKeys should work when it is set on initialization', function(assert) {
        const items = [
            { id: 1, key: 'key1', text: 'Item 1' },
            { id: 2, key: 'key2', text: 'Item 2' },
            { id: 3, key: 'key3', text: 'Item 3' }
        ];

        const instance = new TestComponent(this.$element, {
            items: items,
            keyExpr: 'id',
            selectionMode: 'multiple',
            selectedItemKeys: [2]
        });

        const $item = this.$element.find('.' + ITEM_CLASS).eq(1);

        assert.deepEqual(instance.option('selectedItems'), [items[1]], 'selectedItems is correct');
        assert.deepEqual(instance.option('selectedItem'), items[1], 'selectedItem is correct');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
        assert.ok($item.hasClass('dx-item-selected'), 'item has selected class');
    });

    test('using keyExpr as primitive', function(assert) {
        const items = [
            { key: 'key1', text: 'Item 1' },
            { key: 'key2', text: 'Item 2' },
            { key: 'key3', text: 'Item 3' }
        ];
        const instance = new TestComponent(this.$element, {
            items: items,
            keyExpr: 'key',
            selectionMode: 'multiple'
        });
        const $item = this.$element.find('.' + ITEM_CLASS).eq(1);

        instance.option('selectedItemKeys', ['key2']);

        assert.deepEqual(instance.option('selectedItems'), [items[1]], 'selectedItems is correct');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
        assert.deepEqual(instance.option('selectedItem'), items[1], 'selectedItem is correct');
        assert.ok($item.hasClass('dx-item-selected'), 'item has selected class');
    });

    test('changing keyExpr by option', function(assert) {
        const items = [
            { key: 'key1', text: 'Item 1' },
            { key: 'key2', text: 'Item 2' },
            { key: 'key3', text: 'Item 3' }
        ];
        const instance = new TestComponent(this.$element, {
            items: items,
            keyExpr: 'text',
            selectionMode: 'multiple'
        });
        const $item = this.$element.find('.' + ITEM_CLASS).eq(1);

        instance.option('keyExpr', 'key');
        instance.option('selectedItemKeys', ['key2']);

        assert.deepEqual(instance.option('selectedItems'), [items[1]], 'selectedItems is correct');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
        assert.deepEqual(instance.option('selectedItem'), items[1], 'selectedItem is correct');
        assert.ok($item.hasClass('dx-item-selected'), 'item has selected class');
    });

    test('using keyExpr with dataSource', function(assert) {
        const items = [
            { key: 'key1', text: 'Item 1' },
            { key: 'key2', text: 'Item 2' },
            { key: 'key3', text: 'Item 3' }
        ];
        const instance = new TestComponent(this.$element, {
            dataSource: new DataSource({
                store: new ArrayStore({
                    key: 'text',
                    data: items
                })
            }),
            keyExpr: 'key',
            selectionMode: 'multiple'
        });
        const $item = this.$element.find('.' + ITEM_CLASS).eq(1);

        instance.option('keyExpr', 'key');
        instance.option('selectedItemKeys', ['key2']);

        assert.deepEqual(instance.option('selectedItems'), [items[1]], 'selectedItems is correct');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
        assert.deepEqual(instance.option('selectedItem'), items[1], 'selectedItem is correct');
        assert.ok($item.hasClass('dx-item-selected'), 'item has selected class');
    });

    test('using items and selectedItems', function(assert) {
        const items = ['item 1', 'item 2', 'item 3'];
        const instance = new TestComponent(this.$element, {
            items: [],
            selectionMode: 'multiple'
        });

        instance.option('items', items);
        instance.option('selectedItems', ['item 2']);

        const $item = this.$element.find(`.${ITEM_CLASS}`).eq(1);

        assert.deepEqual(instance.option('selectedItems'), [items[1]], 'selectedItems is correct');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
        assert.deepEqual(instance.option('selectedItem'), items[1], 'selectedItem is correct');
        assert.ok($item.hasClass('dx-item-selected'), 'item has selected class');
    });

    test('using dataSource and selectedItems', function(assert) {
        const items = ['item 1', 'item 2', 'item 3'];
        const instance = new TestComponent(this.$element, {
            dataSource: [],
            selectionMode: 'multiple'
        });

        instance.option('dataSource', items);
        instance.option('selectedItems', ['item 2']);

        const $item = this.$element.find(`.${ITEM_CLASS}`).eq(1);

        assert.deepEqual(instance.option('selectedItems'), [items[1]], 'selectedItems is correct');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
        assert.deepEqual(instance.option('selectedItem'), items[1], 'selectedItem is correct');
        assert.ok($item.hasClass('dx-item-selected'), 'item has selected class');
    });

    test('using dataSource(items change after initialize) and selectedItems', function(assert) {
        const items = ['item 1', 'item 2', 'item 3'];
        const instance = new TestComponent(this.$element, {
            dataSource: [],
            selectionMode: 'multiple'
        });

        instance.option('items', items);
        instance.option('selectedItems', ['item 2']);

        const $item = this.$element.find(`.${ITEM_CLASS}`).eq(1);

        assert.deepEqual(instance.option('selectedItems'), [items[1]], 'selectedItems is correct');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
        assert.deepEqual(instance.option('selectedItem'), items[1], 'selectedItem is correct');
        assert.ok($item.hasClass('dx-item-selected'), 'item has selected class');
    });

    test('using items and selectedItems with unexisting key', function(assert) {
        const items = ['item 1', 'item 2', 'item 3'];
        const instance = new TestComponent(this.$element, {
            items: [],
            selectionMode: 'multiple'
        });

        instance.option('items', items);
        instance.option('selectedItems', ['item 2', 'unexisting']);

        const $item = this.$element.find(`.${ITEM_CLASS}`).eq(1);

        assert.deepEqual(instance.option('selectedItems'), [items[1]], 'selectedItems is correct');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
        assert.deepEqual(instance.option('selectedItem'), items[1], 'selectedItem is correct');
        assert.ok($item.hasClass('dx-item-selected'), 'item has selected class');
    });

    test('using dataSource: [] and selectedItems with unexisting key', function(assert) {
        const items = ['item 1', 'item 2', 'item 3'];
        const instance = new TestComponent(this.$element, {
            dataSource: [],
            selectionMode: 'multiple'
        });

        instance.option('dataSource', items);
        instance.option('selectedItems', ['item 2', 'unexisting']);

        const $item = this.$element.find(`.${ITEM_CLASS}`).eq(1);

        assert.deepEqual(instance.option('selectedItems'), [items[1]], 'selectedItems is correct');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
        assert.deepEqual(instance.option('selectedItem'), items[1], 'selectedItem is correct');
        assert.ok($item.hasClass('dx-item-selected'), 'item has selected class');
    });

    test('using dataSource: ["item 1", "item 2", "item 3"] and selectedItems with unexisting key', function(assert) {
        const items = ['item 1', 'item 2', 'item 3'];
        const instance = new TestComponent(this.$element, {
            dataSource: items,
            selectionMode: 'multiple'
        });

        instance.option('selectedItems', ['item 2', 'unexisting']);

        const $item = this.$element.find(`.${ITEM_CLASS}`).eq(1);

        assert.deepEqual(instance.option('selectedItems'), [items[1]], 'selectedItems is correct');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
        assert.deepEqual(instance.option('selectedItem'), items[1], 'selectedItem is correct');
        assert.ok($item.hasClass('dx-item-selected'), 'item has selected class');
    });

    test('selecting options should be synchronized when selectedItemKeys is set with complex keys', function(assert) {
        const items = [
            { id: 1, key: 'key1', text: 'Item 1' },
            { id: 2, key: 'key2', text: 'Item 2' },
            { id: 3, key: 'key3', text: 'Item 3' }
        ];

        const instance = new TestComponent(this.$element, {
            dataSource: new DataSource({
                store: new ArrayStore({
                    key: ['id', 'key'],
                    data: items
                })
            }),
            selectionMode: 'multiple'
        });

        const $item = this.$element.find('.' + ITEM_CLASS).eq(1);

        instance.option('selectedItems', [{ id: 2, key: 'key2', text: 'Item 2' }]);

        assert.deepEqual(instance.option('selectedItemKeys'), [{ id: items[1].id, key: items[1].key }], 'selectedItems is correct');
        assert.deepEqual(instance.option('selectedItem'), items[1], 'selectedItem is correct');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
        assert.ok($item.hasClass('dx-item-selected'), 'item has selected class');
    });

    test('selecting options should be synchronized when selectedItemKeys is set ', function(assert) {
        const items = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }];

        const instance = new TestComponent(this.$element, {
            dataSource: new DataSource({
                store: new ArrayStore({
                    key: 'id',
                    data: items
                })
            }),
            selectionMode: 'multiple'
        });

        instance.option('selectedItemKeys', [1, 2]);

        assert.deepEqual(instance.option('selectedItems'), [ { id: 1 }, { id: 2 }], 'selectedItems is correct');
        assert.deepEqual(instance.option('selectedItem'), { id: 1 }, 'selectedItem is correct');
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex is correct');
        assert.ok(this.$element.find('.' + ITEM_CLASS).eq(1).hasClass('dx-item-selected'), 'first item has selected class');
    });
});


module('selecting of items with datasource', () => {
    test('added and removed selection should be correct', function(assert) {
        const items = [1, 2, 3, 4, 5];
        const ds = new DataSource({
            store: items,
            pageSize: 2,
            paginate: true
        });

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: ds,
            selectedItems: items.slice(),
            selectionMode: 'multiple',
            onSelectionChanged: function(args) {
                assert.ok(args.addedItems.length <= 1, 'unloaded items does not present in selection');
                assert.ok(args.removedItems.length <= 1, 'unloaded items does not present in selection');
            }
        });

        instance.unselectItem(0);
        instance.selectItem(0);
    });

    test('added and removed selection should be correct, if items are mapped', function(assert) {
        const items = [{ id: 1, name: 'alex' }, { id: 2, name: 'john' }, { id: 3, name: 'bob' }, { id: 4, name: 'amanda' }];

        const ds = new DataSource({
            store: items,
            pageSize: 2,
            paginate: true
        });

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: ds,
            selectedItems: items.slice(),
            selectionMode: 'multiple'
        });

        ds._mapFunc = function(item) {
            return $.extend(item, { map: item.id + item.name });
        };

        instance.unselectItem(0);
        instance.selectItem(0);
        assert.equal(instance.option('selectedItems')[0].map, '1alex', 'selectedItems is correct');
    });

    test('dynamically loaded items should be selected', function(assert) {
        const items = [1, 2, 3, 4];
        const ds = new DataSource({
            store: items,
            pageSize: 2,
            paginate: true
        });

        const $element = $('#cmp');

        new TestComponent($element, {
            dataSource: ds,
            selectedItems: items.slice(0, 3),
            selectionMode: 'multiple',
            onItemRendered: function(args) {
                const isSelected = $.inArray(args.itemData, args.component.option('selectedItems')) > -1;
                assert.equal($(args.itemElement).hasClass(ITEM_SELECTED_CLASS), isSelected, 'item selection is correct');
            }
        });

        ds.pageIndex(1 + ds.pageIndex());
        ds.load();
    });

    test('selectItem should not remove not loaded items', function(assert) {
        const items = [1, 2, 3, 4, 5];
        const ds = new DataSource({
            store: items,
            pageSize: 2,
            paginate: true
        });

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: ds,
            selectedItems: items.slice(1),
            selectionMode: 'multiple'
        });

        instance.selectItem(0);
        assert.deepEqual(instance.option('selectedItems'), items, 'selected items is correct');
    });

    test('it should not be possible to select multiple items in \'single\' selection mode (T386482)', function(assert) {
        const items = [1, 3];
        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            selectionMode: 'single',
            dataSource: items,
            selectedItem: ''
        });

        instance.selectItem($element.find('.' + ITEM_CLASS).eq(0));
        assert.equal(instance.option('selectedItems').length, 1, 'only one item is selected');
    });

    test('unselectItem should remove only unselected item', function(assert) {
        const items = [1, 2, 3, 4, 5];
        const ds = new DataSource({
            store: items,
            pageSize: 2,
            paginate: true
        });

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: ds,
            selectedItems: items.slice(),
            selectionMode: 'multiple'
        });

        instance.unselectItem(0);
        assert.deepEqual(instance.option('selectedItems'), items.slice().splice(1, 4), 'selected items is correct');
    });

    test('selectedIndex after initialization test', function(assert) {
        let clock;
        try {
            clock = sinon.useFakeTimers();

            const ds = new CustomStore({
                load: function() {
                    const deferred = $.Deferred();

                    setTimeout(function() {
                        deferred.resolve([1, 2, 3, 4, 5]);
                    }, 3000);

                    return deferred.promise();
                }
            });

            const $element = $('#cmp');
            const instance = new TestComponent($element, {
                dataSource: ds,
                selectedIndex: 2,
                selectionMode: 'single'
            });

            clock.tick(4000);

            assert.equal(instance.option('selectedIndex'), 2, 'selected index is correct');
        } finally {
            clock.restore();
        }
    });

    test('selection should be applied with deferred dataSource if selectedItemKeys has value on init', function(assert) {
        let clock;

        try {
            clock = sinon.useFakeTimers();

            const instance = new TestComponent($('#cmp'), {
                dataSource: {
                    key: 'id',
                    load: function() {
                        const deferred = $.Deferred();

                        setTimeout(function() {
                            deferred.resolve([{ id: 1, text: 'Item 1' }]);
                        }, 100);

                        return deferred.promise();
                    }
                },
                selectedItemKeys: [1],
                selectionMode: 'all'
            });

            clock.tick(100);

            assert.equal(instance.option('selectedIndex'), 0, 'selectedIndex is correct');
        } finally {
            clock.restore();
        }
    });

    // T938460
    test('The selectedIndex should be correct after resetting selectedItems when the data contains an item without a key', function(assert) {
        const instance = new TestComponent($('#cmp'), {
            dataSource: new ArrayStore({
                key: 'id',
                data: [{ text: 'Item 0' }, { id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }]
            }),
            selectionMode: 'all'
        });

        assert.equal(instance.option('selectedIndex'), -1, 'selectedIndex is correct');

        instance.option('selectedItems', []);

        assert.equal(instance.option('selectedIndex'), -1, 'selectedIndex is correct');
    });
});

module('selecting of items in single mode', () => {
    test('selectedItem should select only one item', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items,
            selectionMode: 'single'
        });

        const item = function(index) {
            return getItemElement(instance, index);
        };

        instance.selectItem(item(0));
        instance.selectItem(item(1));

        assert.deepEqual(instance.option('selectedItems'), [{ a: 1 }], 'selected only one item');
    });

    test('selectedItems should accept only one item', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items,
            selectedItems: items,
            selectionMode: 'single'
        });

        assert.deepEqual(instance.option('selectedItems'), [{ a: 0 }], 'selected only one item');

        instance.option('selectedItems', items);
        assert.deepEqual(instance.option('selectedItems'), [{ a: 0 }], 'selected only one item');
    });

    test('onSelectionChanged should not be fired on widget rendering after adjusting selected items', function(assert) {
        assert.expect(0);

        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');

        new TestComponent($element, {
            items: items,
            selectedItems: items,
            selectionMode: 'single',
            onSelectionChanged: function() {
                assert.ok(false, 'select action triggered');
            }
        });
    });

    test('onSelectionChanged should be fired on widget rendering after adjusting selected items', function(assert) {
        assert.expect(0);

        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');

        new TestComponent($element, {
            items: items,
            selectedItems: items,
            selectionMode: 'single',
            onSelectionChanged: function() {
                assert.ok(false, 'unselect action triggered');
            }
        });
    });

    test('selectedItem is set on init', function(assert) {
        const $element = $('#cmp');
        const items = [1, 2, 3];
        const instance = new TestComponent($element, {
            selectionMode: 'single',
            items: items,
            selectedItem: items[2]
        });

        assert.equal(instance.option('selectedIndex'), 2, 'selectedIndex option value is correct');
        assert.deepEqual(instance.option('selectedItems'), [items[2]], 'selectedItems option value is correct');
    });

    test('selectedIndex is set on init', function(assert) {
        const $element = $('#cmp');
        const items = [1, 2, 3];
        const instance = new TestComponent($element, {
            selectionMode: 'single',
            items: items,
            selectedIndex: 2
        });

        assert.equal(instance.option('selectedItem'), items[2], 'selectedItem option value is correct');
        assert.deepEqual(instance.option('selectedItems'), [items[2]], 'selectedItems option value is correct');
    });

    test('selectedItem and selectedIndex options should depend on each other', function(assert) {
        const $element = $('#cmp');
        const items = [1, 2, 3];
        const instance = new TestComponent($element, {
            selectionMode: 'single',
            items: items
        });

        assert.equal(instance.option('selectedItem'), null, 'selectedItem is null on init');

        instance.option('selectedIndex', 2);
        assert.deepEqual(instance.option('selectedItem'), items[2], 'selectedItem option value is correct after selectedIndex change');

        instance.option('selectedItem', items[1]);
        assert.equal(instance.option('selectedIndex'), 1, 'selectedIndex option value is correct after selectedItem change');
    });

    test('selectedItem and selectedItems options should depend on each other', function(assert) {
        const $element = $('#cmp');
        const items = [1, 2, 3];
        const instance = new TestComponent($element, {
            selectionMode: 'single',
            items: items
        });

        instance.option('selectedItem', items[0]);
        assert.deepEqual(instance.option('selectedItems'), [items[0]], 'selectedItems option value is correct after selectedItem change');

        instance.option('selectedItems', [items[1]]);
        assert.equal(instance.option('selectedItem'), items[1], 'selectedItem option value is correct after selectedItems change');
    });

    test('selection change should not block other options change', function(assert) {
        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            selectionMode: 'single',
            items: [1, 2],
            selectedIndex: 0
        });

        instance.option('onOptionChanged', function(args) {
            if(args.name === 'selectedItem') {
                instance.option('items', [2, 3]);
            }
        });
        instance.option('selectedIndex', 1);
        assert.equal($element.text(), '23', 'items changed correctly');
    });
});

module('selecting of items in multiple mode', {
    beforeEach() {
        this.TestComponent = function($element, options) {
            return new TestComponent($element, options);
        };
    }
}, () => {
    test('selectedItems should have precedence over selectedIndex if initialized with empty collection', function(assert) {
        const $element = $('#cmp');
        const instance = new this.TestComponent($element, {
            selectionMode: 'multiple',
            items: [1, 2, 3],
            selectedItems: []
        });

        assert.deepEqual(instance.option('selectedItems'), [], 'selectedItems option value is correct after selectedItem change');
    });

    test('selectedItemKeys should have precedence over selectedIndex if initialized with empty collection', function(assert) {
        const $element = $('#cmp');
        const instance = new this.TestComponent($element, {
            selectionMode: 'multiple',
            items: [1, 2, 3],
            selectedItemKeys: []
        });

        assert.deepEqual(instance.option('selectedItemKeys'), [], 'selectedItems option value is correct after selectedItem change');
    });
});

module('selection mode', () => {
    test('selection mode option none', function(assert) {
        assert.expect(1);

        const $element = $('#cmp');

        new TestComponent($element, {
            selectedIndex: 1,
            items: [0, 1, 2, 3, 4],
            selectionMode: 'none'
        });

        const $items = $element.find('.item');
        const $item = $items.eq(1);

        assert.ok(!$item.hasClass('dx-item-selected'), 'selected class was not attached');
    });

    test('selection mode option single', function(assert) {
        assert.expect(3);

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            selectedIndex: 1,
            items: [0, 1, 2, 3, 4],
            selectionMode: 'single'
        });
        const $items = $element.find('.item');
        const $item = $items.eq(1);

        assert.ok($item.hasClass('dx-item-selected'), 'selected class was attached');

        instance.option('selectedIndex', 0);

        assert.ok(!$item.hasClass('dx-item-selected'), 'selected class was removed');

        assert.ok($items.first().hasClass('dx-item-selected'), 'selected class was attached');
    });
});

module('selection mode changing', () => {
    test('selectedItems should be updated with one item', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items,
            selectedItems: items,
            selectionMode: 'multiple'
        });

        instance.option('selectionMode', 'single');
        assert.deepEqual(instance.option('selectedItems'), [{ a: 0 }], 'selected only one item');
    });

    test('onItemSelect should not be fired', function(assert) {
        assert.expect(0);

        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items,
            selectedItems: items,
            selectionMode: 'multiple',
            onItemSelect: function() {
                assert.ok(false, 'select action triggered');
            }
        });

        instance.option('selectionMode', 'single');
    });

    test('onSelectionChanged should be fired', function(assert) {
        assert.expect(3);

        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items,
            selectedItems: items,
            selectionMode: 'multiple',
            onSelectionChanged: function(e) {
                assert.ok(true, 'unselect action triggered');
                assert.deepEqual(e.removedItems, [items[1]], 'one removed item');
                assert.deepEqual(e.addedItems, [], 'no added items');
            }
        });

        instance.option('selectionMode', 'single');
    });
});

module('selection required', () => {
    test('first item should be selected if selection required', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items,
            selectedIndex: -1,
            selectionMode: 'single',
            selectionRequired: true
        });

        assert.equal(instance.option('selectedIndex'), 0, 'selection present');
    });

    test('selection should not be dropped if selection removed', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items,
            selectedIndex: 1,
            selectionMode: 'single',
            selectionRequired: true
        });

        instance.option('selectedIndex', -1);
        assert.equal(instance.option('selectedIndex'), 1, 'previous selection present');
    });

    test('at least one item should be selected if \'selectionRequired\' option changed to \'true\'', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items,
            selectedIndex: -1,
            selectionMode: 'single',
            selectionRequired: false
        });

        assert.equal(instance.option('selectedItems').length, 0, 'no items are selected on init');

        instance.option('selectionRequired', true);
        assert.equal(instance.option('selectedItems').length, 1, 'one item is selected');
    });

    test('several items should be selected if \'selectionItemKeys\' is set and \'selectionRequired\' option is \'true\'', function(assert) {
        const items = [{ key: 0 }, { key: 1 }, { key: 2 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items,
            keyExpr: 'key',
            selectionMode: 'multiple',
            selectionRequired: true
        });
        instance.option('selectedItemKeys', [1, 2]);

        assert.deepEqual(instance.option('selectedItems'), items.slice(1), 'items is selected');
    });
});

module('deleting of items', () => {
    test('deleteItem should remove item by node', function(assert) {
        const items = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }, { a: 8 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        instance.deleteItem(getItemElement(instance, 2));

        assert.equal(instance.itemElements().length, 8, 'item deleted');
        assert.equal(instance.option('items').length, 8, 'item deleted from items');
    });

    test('deleteItem should remove item by index', function(assert) {
        const items = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }, { a: 8 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        instance.deleteItem(2);

        assert.equal(instance.itemElements().length, 8, 'item deleted');
        assert.equal(instance.option('items').length, 8, 'item deleted from items');
    });

    test('deleteItem should be resolved', function(assert) {
        assert.expect(1);

        const items = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }, { a: 8 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        instance.deleteItem(getItemElement(instance, 2)).done(function() {
            assert.ok(true, 'resolved');
        });
    });

    test('onDeleteItem should trigger delete callback only once with correct itemData', function(assert) {
        const item = '0';
        const deleteActionSpy = sinon.spy();
        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: [item],
            onItemDeleted: deleteActionSpy
        });

        instance.deleteItem(getItemElement(instance, 0));

        assert.strictEqual(deleteActionSpy.callCount, 1, 'itemDeleted triggered 1 time');
        assert.strictEqual(deleteActionSpy.firstCall.args[0].itemData, item, 'item equals selected item');
    });

    test('deleteItem event should trigger delete callback only once with correct itemData', function(assert) {
        const item = '0';
        const deleteActionSpy = sinon.spy();
        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: [item]
        });

        instance.on('itemDeleted', deleteActionSpy);
        instance.deleteItem(getItemElement(instance, 0));

        assert.strictEqual(deleteActionSpy.callCount, 1, 'itemDeleted triggered 1 time');
        assert.strictEqual(deleteActionSpy.firstCall.args[0].itemData, item, 'item equals selected item');
    });

    test('deleteItem should not process item which is not presented', function(assert) {
        assert.expect(3);

        const items = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 }, { a: 8 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        instance.deleteItem($('<div>')).fail(function() {
            assert.ok(true, 'rejected');
        });

        assert.equal(instance.itemElements().length, 9, 'item not deleted');
        assert.equal(instance.option('items').length, 9, 'item not deleted');
    });

    test('deleteItem should not cause refresh', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        const item = function(index) {
            return getItemElement(instance, index);
        };

        item(0).data('rendered', true);
        instance.deleteItem(item(1));

        assert.equal(item(0).data('rendered'), true, 'item not deleted');
    });

    test('deleteItem should trigger onOptionChanged action', function(assert) {
        assert.expect(2);

        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        instance.option('onOptionChanged', function(args) {
            if(args.name !== 'items') return;

            assert.equal(args.component, instance, 'correct option value');
            assert.deepEqual(args.value, [items[0]], 'correct option value');
        });
        instance.deleteItem(1);
    });

    test('onItemDeleting should be fired', function(assert) {
        const itemDeletingSpy = sinon.spy();
        const instance = new TestComponent($('#cmp'), {
            items: [0],
            onItemDeleting: itemDeletingSpy
        });

        const $item = getItemElement(instance, 0);
        instance.deleteItem($item);

        assert.ok(itemDeletingSpy.calledOnce, 'onItemDeleting is fired');
    });

    test('itemDeleting event should be fired', function(assert) {
        const itemDeletingSpy = sinon.spy();
        const instance = new TestComponent($('#cmp'), {
            items: [0]
        });

        instance.on('itemDeleting', itemDeletingSpy);
        const $item = getItemElement(instance, 0);
        instance.deleteItem($item);

        assert.ok(itemDeletingSpy.calledOnce, 'onItemDeleting is fired');
    });

    test('item should not be deleted if \'cancel\' flag in onItemDeleting is true', function(assert) {
        const instance = new TestComponent($('#cmp'), {
            items: [0],
            onItemDeleting: function(e) {
                e.cancel = true;
            }
        });

        let $item = getItemElement(instance, 0);
        instance.deleteItem($item);

        $item = getItemElement(instance, 0);
        assert.equal($item.length, 1, 'item not removed');
    });

    test('item should not be deleted if \'cancel\' flag in onItemDeleting is resolved with true', function(assert) {
        const instance = new TestComponent($('#cmp'), {
            items: [0],
            onItemDeleting: function(e) {
                e.cancel = $.Deferred().resolve(true);
            }
        });

        let $item = getItemElement(instance, 0);
        instance.deleteItem($item);

        $item = getItemElement(instance, 0);
        assert.equal($item.length, 1, 'item not removed');
    });

    test('item should be deleted if \'cancel\' flag in onItemDeleting is resolved', function(assert) {
        const instance = new TestComponent($('#cmp'), {
            dataSource: [0],
            onItemDeleting: function(e) {
                e.cancel = $.Deferred().resolve();
            }
        });

        let $item = getItemElement(instance, 0);
        instance.deleteItem($item);

        $item = getItemElement(instance, 0);
        assert.equal($item.length, 0, 'item removed');
    });

    test('\'cancel\' flag in onItemDeleting option should support Promise/A+ standart', function(assert) {
        let resolve;
        const promise = new Promise(function(onResolve) {
            resolve = onResolve;
        });

        const instance = new TestComponent($('#cmp'), {
            dataSource: [0],
            onItemDeleting: function(e) {
                e.cancel = promise;
            }
        });

        let $item = getItemElement(instance, 0);
        instance.deleteItem($item);

        promise.then(function() {
            $item = getItemElement(instance, 0);
            assert.equal($item.length, 0, 'item removed');
        });

        resolve();
        return promise;
    });
});

module('deleting with confirmation', () => {
    test('item should be deleted if confirmation resolved', function(assert) {
        const confirmation = $.Deferred();
        let itemDeleted = false;

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: ['0'],
            onItemDeleting: function(e) {
                return confirmation.promise();
            },
            onItemDeleted: function() {
                itemDeleted = true;
            }
        });

        instance.deleteItem(0);
        assert.equal(itemDeleted, false, 'item not deleted');

        confirmation.resolve();
        assert.equal(itemDeleted, true, 'item deleted');
    });

    test('item should be deleted if confirmation resolved with true', function(assert) {
        const confirmation = $.Deferred();
        let itemDeleted = false;

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: ['0'],
            onItemDeleting: function(e) {
                return confirmation.promise();
            },
            onItemDeleted: function() {
                itemDeleted = true;
            }
        });

        instance.deleteItem(0);
        assert.equal(itemDeleted, false, 'item not deleted');

        confirmation.resolve(true);
        assert.equal(itemDeleted, true, 'item deleted');
    });

    test('item should not be deleted if confirmation rejected', function(assert) {
        const confirmation = $.Deferred();
        let itemDeleted = false;

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: ['0'],
            onItemDeleting: function(e) {
                return confirmation.promise();
            },
            onItemDeleted: function() {
                itemDeleted = true;
            }
        });

        instance.deleteItem(0);
        assert.equal(itemDeleted, false, 'item not deleted');

        confirmation.reject();
        assert.equal(itemDeleted, false, 'item not deleted');
    });

    test('item should not be deleted if confirmation resolved with false', function(assert) {
        const confirmation = $.Deferred();
        let itemDeleted = false;

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: ['0'],
            onItemDeleting: function(e) {
                return confirmation.promise();
            },
            onItemDeleted: function() {
                itemDeleted = true;
            }
        });

        instance.deleteItem(0);
        assert.equal(itemDeleted, false, 'item not deleted');

        confirmation.resolve(false);
        assert.equal(itemDeleted, false, 'item not deleted');
    });

    test('deleteItem should be resolved if confirmation pass', function(assert) {
        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: ['0'],
            onItemDeleting: function(e) {
                return $.Deferred().resolve().promise();
            }
        });

        instance.deleteItem(0).done(function() {
            assert.ok(true, 'deleteItem resolved');
        });
    });

    test('deleteItem should not be resolved if confirmation not pass', function(assert) {
        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: ['0'],
            onItemDeleting: function(e) {
                return $.Deferred().reject().promise();
            }
        });

        instance.deleteItem(0).fail(function() {
            assert.ok(true, 'deleteItem rejected');
        });
    });

    test('deleteItem should delete item without confirmation if item is already deleting', function(assert) {
        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: ['0'],
            onItemDeleting: function(e) {
                instance.deleteItem(0);
            },
            onItemDeleted: function() {
                assert.ok(true, 'item deleted');
            }
        });

        instance.deleteItem(0);
    });

    test('deleteItem should not delete item without confirmation if previous confirmation fails', function(assert) {
        assert.expect(0);

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: ['0'],
            onItemDeleting: function(e) {
                return $.Deferred().reject().promise();
            },
            onItemDeleted: function() {
                assert.ok(false, 'item deleted');
            }
        });

        instance.deleteItem(0);
        instance.deleteItem(0);
    });
});

module('deleting from dataSource', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        executeAsyncMock.setup();
    },
    afterEach: function() {
        this.clock.restore();
        executeAsyncMock.teardown();
    }
}, () => {
    test('deleteItem should remove item', function(assert) {
        assert.expect(2);

        const store = new ArrayStore({
            data: [
                { id: 0, text: 0 },
                { id: 1, text: 1 },
                { id: 2, text: 2 }
            ],
            key: 'id'
        });

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: {
                store: store
            }
        });

        instance.deleteItem(getItemElement(instance, 1)).done(function() {
            assert.equal(instance.itemElements().length, 2, 'item deleted');
            assert.equal(instance.option('items').length, 2, 'item deleted from items');
        });
    });

    test('deleteItem should not remove when error occurred', function(assert) {
        assert.expect(2);

        const store = new ArrayStore({
            data: [
                { text: 0 },
                { text: 1 },
                { text: 2 }
            ]
        });

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: {
                store: store
            }
        });

        store._removeImpl = function() {
            return $.Deferred().reject().promise();
        };

        instance.deleteItem(getItemElement(instance, 1)).fail(function() {
            assert.equal(instance.itemElements().length, 3, 'item not deleted');
            assert.equal(instance.option('items').length, 3, 'item not deleted from items');
        });
    });

    test('deleteItem should fade deleting item when deleting and disable widget', function(assert) {
        assert.expect(4);

        const deferred = $.Deferred();

        const store = new ArrayStore({
            data: [
                { text: 0 },
                { text: 1 },
                { text: 2 }
            ]
        });

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: {
                store: store
            }
        });

        store._removeImpl = function() {
            const d = $.Deferred();

            deferred.done(function() {
                d.reject();
            });

            return d.promise();
        };

        const $item = getItemElement(instance, 1);

        instance.deleteItem($item).fail(function() {
            assert.equal($item.hasClass(ITEM_RESPONSE_WAIT_CLASS), false, 'item not wait for response');
            assert.equal(instance.option('disabled'), false, 'widget is not disabled');
        });

        assert.equal($item.hasClass(ITEM_RESPONSE_WAIT_CLASS), true, 'item wait for response');
        assert.equal(instance.option('disabled'), true, 'widget is disabled');

        deferred.resolve();
    });

    test('only needed items should be rendered after delete', function(assert) {
        assert.expect(1);

        const dataSource = new DataSource({
            store: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            pageSize: 2
        });

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: dataSource
        });

        instance.deleteItem(0);

        const $newItems = $('.' + ITEM_CLASS, $element);
        assert.equal($newItems.text(), '12', 'element was not removed');
    });

    test('last item should not be duplicated after delete items', function(assert) {
        const dataSource = new DataSource({
            store: [0, 1, 2, 3]
        });

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: dataSource
        });

        instance.deleteItem(0);
        const $newItems = $('.' + ITEM_CLASS, $element);

        assert.equal($newItems.text(), '123');
    });

    test('deleteItem should trigger delete callback only once with correct itemData even if items changed at runtime', function(assert) {
        const dataSource = new DataSource({
            store: new ArrayStore({
                data: [0],
                onRemoved: function() {
                    instance.option('dataSource', { store: [] });
                }
            })
        });

        let args;
        const instance = new TestComponent($('#cmp'), {
            dataSource: dataSource,
            onItemDeleted: function(e) {
                args = e;
            }
        });

        const $item = getItemElement(instance, 0);
        instance.deleteItem($item);
        assert.strictEqual($(args.itemElement).get(0), $item.get(0), 'item equals selected item');
        assert.strictEqual(args.itemData, 0, 'item equals selected item');
        assert.strictEqual(args.itemIndex, 0, 'item equals selected item');
    });

    test('deleteItem should trigger onOptionChanged action', function(assert) {
        assert.expect(2);

        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: items
        });

        instance.option('onOptionChanged', function(args) {
            if(args.name !== 'dataSource') return;

            assert.equal(args.component, instance, 'correct option value');
            assert.deepEqual(args.value, [items[0]], 'correct option value');
        });
        instance.deleteItem(1);
    });

    test('deleteItem should not trigger onOptionChanged action if instance of DataSource', function(assert) {
        assert.expect(0);

        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: new DataSource(items)
        });

        instance.option('onOptionChanged', function(args) {
            if(args.name !== 'dataSource') return;

            assert.ok(false, 'action fired');
        });
        instance.deleteItem(1);
    });
});

module('reordering of items', () => {
    test('reorderItem should swap items by index', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        const item = function(index) {
            return getItemElement(instance, index).get(0);
        };

        const item0 = item(0);
        const item1 = item(1);

        instance.reorderItem(0, 1);
        assert.equal(item0, item(1));
        assert.equal(item1, item(0));
    });

    test('reorderItem should swap items by node', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        const item = function(index) {
            return getItemElement(instance, index).get(0);
        };

        const item0 = item(0);
        const item1 = item(1);

        instance.reorderItem(item0, item1);
        assert.equal(item0, item(1));
        assert.equal(item1, item(0));
    });

    test('reorderItem should swap last with first items', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        const item = function(index) {
            return getItemElement(instance, index).get(0);
        };

        const item0 = item(0);
        const item1 = item(1);

        instance.reorderItem(1, 0);
        assert.equal(item0, item(1));
        assert.equal(item1, item(0));
    });

    test('reorderItem should swap items in items option', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        instance.reorderItem(0, 1);

        assert.deepEqual(instance.option('items'), [{ a: 1 }, { a: 0 }], 'items rearranged');
    });

    test('reorderItem should swap last with first items in items option', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        instance.reorderItem(1, 0);

        assert.deepEqual(instance.option('items'), [{ a: 1 }, { a: 0 }], 'items rearranged');
    });

    test('reorderItem should not cause refresh', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        const item = function(index) {
            return getItemElement(instance, index);
        };

        item(0).data('rendered', true);
        instance.reorderItem(0, 1);

        assert.equal(item(1).data('rendered'), true, 'item not deleted');
    });

    test('reorderItem should be resolved', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items
        });

        instance.reorderItem(0, 1).done(function() {
            assert.ok(true, 'resolved');
            assert.equal(this, instance, 'correct context');
        });
    });

    test('reorderItem should not be executed if items are equal', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items,
            itemReorder: function(args) {
                assert.ok(false, 'items reordered');
            }

        });

        instance.reorderItem(0, 0).fail(function() {
            assert.ok(true, 'failed');
        });
    });

    test('onItemReordered should be fired if items reordered', function(assert) {
        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: [{ a: 0 }, { a: 1 }],
            onItemReordered: function(args) {
                assert.equal($(args.itemElement).get(0), item(1), 'correct item element');
                assert.equal(args.fromIndex, 0, 'correct from index');
                assert.equal(args.toIndex, 1, 'correct to index');
            }
        });

        const item = function(index) {
            return getItemElement(instance, index).get(0);
        };

        instance.reorderItem(item(0), item(1));
    });

    test('itemReordered event should be fired if items reordered', function(assert) {
        const $element = $('#cmp');

        const instance = new TestComponent($element, {
            items: [{ a: 0 }, { a: 1 }]
        });

        instance.on('itemReordered', (args) => {
            assert.equal($(args.itemElement).get(0), item(1), 'correct item element');
            assert.equal(args.fromIndex, 0, 'correct from index');
            assert.equal(args.toIndex, 1, 'correct to index');
        });

        const item = function(index) {
            return getItemElement(instance, index).get(0);
        };

        instance.reorderItem(item(0), item(1));
    });

    test('selection should be updated after items reordered', function(assert) {
        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items,
            selectedItems: [items[0]],
            selectionMode: 'multiple'
        });

        const item = function(index) {
            return getItemElement(instance, index).get(0);
        };

        instance.reorderItem(0, 1);
        assert.equal(instance.isItemSelected(item(0)), false, 'selection changed');
        assert.equal(instance.isItemSelected(item(1)), true, 'selection changed');
    });

    test('deleteItem should trigger onOptionChanged action', function(assert) {
        assert.expect(2);

        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            items: items.slice()
        });

        instance.option('onOptionChanged', function(args) {
            if(args.name !== 'items') return;

            assert.equal(args.component, instance, 'correct option value');
            assert.deepEqual(args.value, [items[1], items[0]], 'correct option value');
        });
        instance.reorderItem(0, 1);
    });
});

module('reordering with dataSource', () => {
    test('deleteItem should not trigger onOptionChanged action', function(assert) {
        assert.expect(0);

        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: items.slice()
        });

        instance.option('onOptionChanged', function(args) {
            if(args.name !== 'dataSource') return;

            assert.ok(false, 'action fired');
        });
        instance.reorderItem(0, 1);
    });

    test('deleteItem should not trigger onOptionChanged action if instance of DataSource', function(assert) {
        assert.expect(0);

        const items = [{ a: 0 }, { a: 1 }];

        const $element = $('#cmp');
        const instance = new TestComponent($element, {
            dataSource: new DataSource(items.slice())
        });

        instance.option('onOptionChanged', function(args) {
            if(args.name !== 'dataSource') return;

            assert.ok(false, 'action fired');
        });
        instance.deleteItem(1);
    });

    test('items should update when datasource option changed', function(assert) {
        const $element = $('#cmp');

        const widget = new TestComponent($element, {
            dataSource: new DataSource({
                store: new ArrayStore([{ text: 'item 1' }])
            })
        });

        assert.equal(widget.option('items')[0].text, 'item 1', 'item were initialized');

        widget.option('dataSource', new DataSource({
            store: new ArrayStore([{ text: 'item 2' }])
        }));

        assert.equal(widget.option('items')[0].text, 'item 2', 'items wew changed');
    });
});

module('internal methods', () => {
    test('getItemElement, getNormalizedIndex and getIndex methods should not call "get" in item model (T996102)', function(assert) {
        const getCallSpy = sinon.spy();
        this.items = [{ get: getCallSpy }];
        this.$element = $('#cmp');
        this.instance = new TestComponent(this.$element, {
            items: this.items,
        });

        this.instance._editStrategy.getItemElement(this.items[0]);
        this.instance._editStrategy.getNormalizedIndex(this.items[0]);
        this.instance._editStrategy.getIndex(this.items[0]);
        assert.strictEqual(getCallSpy.callCount, 0);
    });
});
