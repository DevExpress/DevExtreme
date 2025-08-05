import { findChanges } from 'core/utils/array_compare';
import { extend } from 'core/utils/extend';
import { applyBatch } from 'common/data/array_utils';
import { logger } from '__internal/core/utils/m_console';
import errors from 'ui/widget/ui.errors';

const ITEMS_ARRAY_LENGTH = 4;
const createItems = (length = ITEMS_ARRAY_LENGTH) => Array.from({ length }, (_, i) => ({ a: `Item ${i}`, id: i }));

QUnit.module('findChanges', {
    beforeEach: function() {
        const isItemEquals = (item1, item2) => JSON.stringify(item1) === JSON.stringify(item2);
        const keyOf = item => item.id;
        const keyInfo = {
            key: () => 'id',
            keyOf,
        };
        this.oldItems = createItems();
        this.newItems = extend(true, [], this.oldItems);
        this.findChanges = () => findChanges({
            oldItems: this.oldItems,
            newItems: this.newItems,
            getKey: item => item.id,
            isItemEquals,
            detectReorders: true,
        });

        this.checkChanges = (assert) => {
            const changes = this.findChanges();

            const output = applyBatch({
                keyInfo,
                useInsertIndex: true,
                immutable: true,
                data: this.oldItems,
                changes,
            });

            assert.deepEqual(this.newItems, output, 'changes applied correctly');
        };
    }
}, function() {
    QUnit.test('add item in the beginning', function(assert) {
        this.newItems.unshift({ a: 'Item 4', id: 4 });
        this.checkChanges(assert);
    });

    QUnit.test('remove item from the beginning', function(assert) {
        this.newItems.shift();
        this.checkChanges(assert);
    });

    QUnit.test('remove(beginning), insert(end), update', function(assert) {
        this.newItems.shift();
        this.newItems.push({ a: 'Item 4', id: 4 });
        this.newItems[0].a = 'Item 1 updated';

        this.checkChanges(assert);
    });

    QUnit.test('remove(end), insert(beginning), update', function(assert) {
        this.newItems.pop();
        this.newItems.unshift({ a: 'Item 4', id: 4 });
        this.newItems[1].a = 'Item 0 updated';

        this.checkChanges(assert);
    });

    QUnit.test('remove(end), update(beginning)', function(assert) {
        this.newItems.pop();
        this.newItems[0].a = 'Item 0 updated';

        this.checkChanges(assert);
    });

    QUnit.module('reorder 1-1', function() {
        for(let from = 0; from < ITEMS_ARRAY_LENGTH; from++) {
            for(let to = 0; to < ITEMS_ARRAY_LENGTH; to++) {
                if(from === to) continue;

                QUnit.test(`move item from index ${from} to ${to}`, function(assert) {
                    const [itemToMove] = this.newItems.splice(from, 1);
                    this.newItems.splice(to, 0, itemToMove);

                    this.checkChanges(assert);
                });
            }
        }
    });

    QUnit.test('reorder of several elements', function(assert) {
        this.oldItems = createItems(5);
        this.newItems = [...this.oldItems].reverse();

        this.checkChanges(assert);
    });

    QUnit.test('reorder + insert', function(assert) {
        const [itemToMove] = this.newItems.splice(3, 1);
        this.newItems.splice(2, 0, itemToMove);
        this.newItems.push({ a: 'Item 4', id: 4 });

        this.checkChanges(assert);
    });

    QUnit.test('reorder + remove', function(assert) {
        const [itemToMove] = this.newItems.splice(3, 1);
        this.newItems.splice(2, 0, itemToMove);
        this.newItems.shift();

        this.checkChanges(assert);
    });

    QUnit.test('reorder + update', function(assert) {
        const [itemToMove] = this.newItems.splice(3, 1);
        this.newItems.splice(2, 0, itemToMove);
        this.newItems[0].a = 'Item 0 updated';

        this.checkChanges(assert);
    });

    QUnit.test('should return undefined when reordering if detectReorders=false', function(assert) {
        const isItemEquals = (item1, item2) => JSON.stringify(item1) === JSON.stringify(item2);
        const findChangesWithoutReorders = () => findChanges({
            oldItems: this.oldItems,
            newItems: this.newItems,
            getKey: item => item.id,
            isItemEquals,
            detectReorders: false,
        });

        this.oldItems = createItems(5);
        this.newItems = [...this.oldItems].reverse();

        const result = findChangesWithoutReorders();

        assert.strictEqual(result, undefined);
    });

    QUnit.test('should return undefined and log error if detect items with duplicated keys', function(assert) {
        sinon.spy(logger, 'error');
        sinon.spy(errors, 'Error');

        this.newItems.push({ a: 'Item 4', id: 3 });
        const changes = this.findChanges();

        assert.strictEqual(changes, undefined, 'changes are undefined');
        assert.strictEqual(errors.Error.callCount, 1, 'throws 1 error');
        assert.strictEqual(errors.Error.lastCall.args[0], 'E1040', 'error code id E1040');
        assert.strictEqual(errors.Error.lastCall.args[1], 3, 'error argument is duplicated key');
        assert.deepEqual(logger.error.getCall(0).args[0], errors.Error('E1040', 3));

        logger.error.restore();
        errors.Error.restore();
    });
});
