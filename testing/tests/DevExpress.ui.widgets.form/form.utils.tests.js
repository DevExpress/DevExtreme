import { getRootLevelOfExpectedComplexOption } from 'ui/form/ui.form.utils.js';

QUnit.module('Form utils', () => {
    QUnit.test('getRootLevelOfExpectedComplexOption', function(assert) {
        assert.strictEqual(getRootLevelOfExpectedComplexOption(''), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('.'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('.a'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('.items'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('.formData'), undefined);

        assert.strictEqual(getRootLevelOfExpectedComplexOption('a'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('a.'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('a.b'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('a.b.'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('a.b.c'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('a.b.c'), undefined);

        assert.strictEqual(getRootLevelOfExpectedComplexOption('formData'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('formData.'), 'formData');
        assert.strictEqual(getRootLevelOfExpectedComplexOption(' formData . '), 'formData');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('formData.a'), 'formData');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('formData.a.'), 'formData');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('formData.a.b'), 'formData');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('formData.items'), 'formData');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('formData.formData'), 'formData');

        assert.strictEqual(getRootLevelOfExpectedComplexOption('items'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('items.'), 'items');
        assert.strictEqual(getRootLevelOfExpectedComplexOption(' items . '), 'items');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('items.a'), 'items');
        assert.strictEqual(getRootLevelOfExpectedComplexOption(' items . a '), 'items');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('items.a.'), 'items');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('items.a.b'), 'items');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('items.formData'), 'items');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('items.formData.a'), 'items');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('items.items'), 'items');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('items[0]'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('items[0].a'), 'items');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('items[0].items'), 'items');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('items[0].formData'), 'items');
        assert.strictEqual(getRootLevelOfExpectedComplexOption('items[0].items[0]'), 'items');

        assert.strictEqual(getRootLevelOfExpectedComplexOption('a.items'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('a.items.'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('a.items.a'), undefined);
        assert.strictEqual(getRootLevelOfExpectedComplexOption('a.items[0]'), undefined);
    });
});
