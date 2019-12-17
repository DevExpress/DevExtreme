import { findChanges } from 'core/utils/array_compare';
import { extend } from 'core/utils/extend';

QUnit.module('findChanges', {
    beforeEach: function() {
        var isItemEquals = (item1, item2) => JSON.stringify(item1) === JSON.stringify(item2);
        this.oldItems = [{ a: 'Item 0', id: 0 }, { a: 'Item 1', id: 1 }];
        this.newItems = extend(true, [], this.oldItems);
        this.findChanges = () => findChanges(this.oldItems, this.newItems, item => item.id, isItemEquals);
    }
}, function() {
    QUnit.test('add item in the beginning', function(assert) {
        this.newItems.unshift({ a: 'Item 2', id: 2 });

        var changes = this.findChanges();

        assert.equal(changes.length, 1);
        assert.equal(changes[0].type, 'insert');
        assert.equal(changes[0].data.id, 2);
    });

    QUnit.test('remove item from the beginning', function(assert) {
        this.newItems.shift();

        var changes = this.findChanges();

        assert.equal(changes.length, 1);
        assert.equal(changes[0].type, 'remove');
        assert.equal(changes[0].key, 0);
    });

    QUnit.test('remove(beginning), insert(end), update', function(assert) {
        this.newItems.shift();
        this.newItems.push({ a: 'Item 2', id: 2 });
        this.newItems[0].a = 'Item 1 updated';

        var changes = this.findChanges();

        assert.equal(changes.length, 3);
        assert.equal(changes[0].type, 'remove');
        assert.equal(changes[0].key, 0);
        assert.equal(changes[1].type, 'update');
        assert.equal(changes[1].data.id, 1);
        assert.equal(changes[2].type, 'insert');
        assert.equal(changes[2].data.id, 2);
    });

    QUnit.test('remove(end), insert(beginning), update', function(assert) {
        this.newItems.pop();
        this.newItems.unshift({ a: 'Item 2', id: 2 });
        this.newItems[1].a = 'Item 0 updated';

        var changes = this.findChanges();

        assert.equal(changes[0].type, 'insert');
        assert.equal(changes[0].data.id, 2);
        assert.equal(changes[1].type, 'update');
        assert.equal(changes[1].data.id, 0);
        assert.equal(changes[2].type, 'remove');
        assert.equal(changes[2].key, 1);
    });

    QUnit.test('remove(end), update(beginning)', function(assert) {
        this.newItems.pop();
        this.newItems[0].a = 'Item 0 updated';

        var changes = this.findChanges();

        assert.equal(changes[0].type, 'update');
        assert.equal(changes[0].data.id, 0);
        assert.equal(changes[1].type, 'remove');
        assert.equal(changes[1].key, 1);
    });
});
