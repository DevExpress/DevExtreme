import { capitalize } from '__internal/core/utils/capitalize';

QUnit.module('capitalize', () => {
    QUnit.test('should capitalize first letter of a lowercase word', function(assert) {
        assert.strictEqual(capitalize('test'), 'Test', 'Capitalizes lowercase string');
    });

    QUnit.test('should return same string if first letter already capitalized', function(assert) {
        assert.strictEqual(capitalize('Test'), 'Test', 'Returns same string if already capitalized');
    });

    QUnit.test('should handle single-letter strings', function(assert) {
        assert.strictEqual(capitalize('a'), 'A', 'Capitalizes single character');
        assert.strictEqual(capitalize('A'), 'A', 'Preserves capitalized single character');
    });

    QUnit.test('should return empty string as is', function(assert) {
        assert.strictEqual(capitalize(''), '', 'Empty string stays empty');
    });

    QUnit.test('should not modify non-letter first characters', function(assert) {
        assert.strictEqual(capitalize('1test'), '1test', 'Numbers at beginning are preserved');
        assert.strictEqual(capitalize(' test'), ' test', 'Spaces at beginning are preserved');
        assert.strictEqual(capitalize('-test'), '-test', 'Punctuation at beginning is preserved');
    });
});
