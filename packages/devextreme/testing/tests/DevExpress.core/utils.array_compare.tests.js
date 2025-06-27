import { findChanges } from 'core/utils/array_compare';
import { extend } from 'core/utils/extend';

QUnit.module('findChanges', {
    beforeEach: function() {
        const isItemEquals = (item1, item2) => JSON.stringify(item1) === JSON.stringify(item2);
        this.oldItems = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];
        this.newItems = extend(true, [], this.oldItems);
        this.findChanges = () => findChanges(this.oldItems, this.newItems, item => item.id, isItemEquals);
    }
}, function() {
    QUnit.test('add item in the beginning', function(assert) {
        this.newItems.unshift({ a: 'Item 2', id: 2 });

        const changes = this.findChanges();

        assert.strictEqual(changes.length, 1);
        assert.strictEqual(changes[0].type, 'insert');
        assert.strictEqual(changes[0].data.id, 2);
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
        this.newItems.push({ a: 'Item 2', id: 2 });
        this.newItems[0].a = 'Item 1 updated';

        const changes = this.findChanges();

        assert.strictEqual(changes.length, 3);
        assert.strictEqual(changes[0].type, 'remove');
        assert.strictEqual(changes[0].key, 0);
        assert.strictEqual(changes[1].type, 'update');
        assert.strictEqual(changes[1].data.id, 1);
        assert.strictEqual(changes[2].type, 'insert');
        assert.strictEqual(changes[2].data.id, 2);
    });

    QUnit.test('remove(end), insert(beginning), update', function(assert) {
        this.newItems.pop();
        this.newItems.unshift({ a: 'Item 2', id: 2 });
        this.newItems[1].a = 'Item 0 updated';

        const changes = this.findChanges();

        assert.strictEqual(changes[0].type, 'insert');
        assert.strictEqual(changes[0].data.id, 2);
        assert.strictEqual(changes[1].type, 'update');
        assert.strictEqual(changes[1].data.id, 0);
        assert.strictEqual(changes[2].type, 'remove');
        assert.strictEqual(changes[2].key, 1);
    });

    QUnit.test('remove(end), update(beginning)', function(assert) {
        this.newItems.pop();
        this.newItems[0].a = 'Item 0 updated';

        const changes = this.findChanges();

        assert.strictEqual(changes[0].type, 'update');
        assert.strictEqual(changes[0].data.id, 0);
        assert.strictEqual(changes[1].type, 'remove');
        assert.strictEqual(changes[1].key, 1);
    });

    QUnit.test('reorder items', function(assert) {
        const movedItem = this.newItems.shift();
        this.newItems.push(movedItem);

        const changes = this.findChanges();

        assert.strictEqual(changes.length, 4);
        assert.strictEqual(changes[0].type, 'remove');
        assert.strictEqual(changes[0].key, 1);
        assert.strictEqual(changes[0].index, 1);
        assert.strictEqual(changes[1].type, 'insert');
        assert.strictEqual(changes[1].data.id, 1);
        assert.strictEqual(changes[1].index, 0);
        assert.strictEqual(changes[2].type, 'remove');
        assert.strictEqual(changes[2].key, 0);
        assert.strictEqual(changes[2].index, 0);
        assert.strictEqual(changes[3].type, 'insert');
        assert.strictEqual(changes[3].data.id, 0);
        assert.strictEqual(changes[3].index, 1);
    });
});
