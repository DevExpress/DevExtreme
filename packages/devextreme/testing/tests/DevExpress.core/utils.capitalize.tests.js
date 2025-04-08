import { capitalize } from '__internal/core/utils/capitalize';

QUnit.module('capitalize', {
    beforeEach: function() {
        this.capitalize = capitalize;
    }
});

QUnit.test('should capitalize first letter of a lowercase word', function(assert) {
    assert.strictEqual(this.capitalize('test'), 'Test', 'Capitalizes lowercase string');
});

QUnit.test('should return same string if first letter already capitalized', function(assert) {
    assert.strictEqual(this.capitalize('Test'), 'Test', 'Returns same string if already capitalized');
});

QUnit.test('should handle single-letter strings', function(assert) {
    assert.strictEqual(this.capitalize('a'), 'A', 'Capitalizes single character');
    assert.strictEqual(this.capitalize('A'), 'A', 'Preserves capitalized single character');
});

QUnit.test('should return empty string as is', function(assert) {
    assert.strictEqual(this.capitalize(''), '', 'Empty string stays empty');
});

QUnit.test('should not modify non-letter first characters', function(assert) {
    assert.strictEqual(this.capitalize('1test'), '1test', 'Numbers at beginning are preserved');
    assert.strictEqual(this.capitalize(' test'), ' test', 'Spaces at beginning are preserved');
    assert.strictEqual(this.capitalize('-test'), '-test', 'Punctuation at beginning is preserved');
});
