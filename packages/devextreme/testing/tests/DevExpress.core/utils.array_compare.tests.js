import { findChanges } from 'core/utils/array_compare';
import { extend } from 'core/utils/extend';

const ITEMS_ARRAY_LENGTH = 4;
const createItems = (length = ITEMS_ARRAY_LENGTH) => Array.from({ length }, (_, i) => ({ a: `Item ${i}`, id: i }));

QUnit.module('findChanges', {
    beforeEach: function() {
        const isItemEquals = (item1, item2) => JSON.stringify(item1) === JSON.stringify(item2);
        this.oldItems = createItems();
        this.newItems = extend(true, [], this.oldItems);
        this.findChanges = () => findChanges(this.oldItems, this.newItems, item => item.id, isItemEquals);
    }
}, function() {
    QUnit.test('add item in the beginning', function(assert) {
        this.newItems.unshift({ a: 'Item 4', id: 4 });

        const changes = this.findChanges();

        assert.strictEqual(changes.length, 1);
        assert.strictEqual(changes[0].type, 'insert');
        assert.strictEqual(changes[0].data.id, 4);
    });

    QUnit.test('remove item from the beginning', function(assert) {
        this.newItems.shift();

        const changes = this.findChanges();

        assert.strictEqual(changes.length, 1);
        assert.strictEqual(changes[0].type, 'remove');
        assert.strictEqual(changes[0].key, 0);
    });

    QUnit.test('remove(beginning), insert(end), update', function(assert) {
        this.newItems.shift();
        this.newItems.push({ a: 'Item 4', id: 4 });
        this.newItems[0].a = 'Item 1 updated';

        const changes = this.findChanges();

        assert.strictEqual(changes.length, 3);
        assert.strictEqual(changes[0].type, 'remove');
        assert.strictEqual(changes[0].key, 0);
        assert.strictEqual(changes[1].type, 'update');
        assert.strictEqual(changes[1].data.id, 1);
        assert.strictEqual(changes[2].type, 'insert');
        assert.strictEqual(changes[2].data.id, 4);
    });

    QUnit.test('remove(end), insert(beginning), update', function(assert) {
        this.newItems.pop();
        this.newItems.unshift({ a: 'Item 4', id: 4 });
        this.newItems[1].a = 'Item 0 updated';

        const changes = this.findChanges();

        assert.strictEqual(changes[0].type, 'insert');
        assert.strictEqual(changes[0].data.id, 4);
        assert.strictEqual(changes[1].type, 'update');
        assert.strictEqual(changes[1].data.id, 0);
        assert.strictEqual(changes[2].type, 'remove');
        assert.strictEqual(changes[2].key, 3);
    });

    QUnit.test('remove(end), update(beginning)', function(assert) {
        this.newItems.pop();
        this.newItems[0].a = 'Item 0 updated';

        const changes = this.findChanges();

        assert.strictEqual(changes[0].type, 'update');
        assert.strictEqual(changes[0].data.id, 0);
        assert.strictEqual(changes[1].type, 'remove');
        assert.strictEqual(changes[1].key, 3);
    });

    QUnit.module('reorder', function() {
        for(let from = 0; from < ITEMS_ARRAY_LENGTH; from++) {
            for(let to = 0; to < ITEMS_ARRAY_LENGTH; to++) {
                if(from === to) continue;

                QUnit.test(`move item from index ${from} to ${to}`, function(assert) {
                    const [itemToMove] = this.newItems.splice(from, 1);
                    this.newItems.splice(to, 0, itemToMove);

                    const changes = this.findChanges();

                    const affectedItems = this.oldItems.filter((oldItem, oldIndex) => {
                        const newIndex = this.newItems.findIndex(newItem => newItem.id === oldItem.id);
                        return newIndex !== oldIndex;
                    });

                    assert.strictEqual(
                        changes.length,
                        affectedItems.length * 2,
                        `${affectedItems.length * 2} changes (reorder = remove + insert)`
                    );

                    affectedItems.forEach(item => {
                        const remove = changes.find(c => c.type === 'remove' && c.key === item.id);
                        const insert = changes.find(c => c.type === 'insert' && c.data.id === item.id);
                        const oldIndex = this.oldItems.findIndex(i => i.id === item.id);
                        const newIndex = this.newItems.findIndex(i => i.id === item.id);

                        assert.strictEqual(!!remove, true, `remove operation exists for item with id=${item.id}`);
                        assert.strictEqual(remove.index, oldIndex, 'remove index is correct');

                        assert.strictEqual(!!insert, true, `insert operation exists for item with id=${item.id}`);
                        assert.strictEqual(insert.index, newIndex, 'insert index is correct');
                    });
                });
            }
        }
    });
});
