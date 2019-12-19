var Guid = require('core/guid');

QUnit.module('Guid');

QUnit.test('normalization', function(assert) {
    var g = new Guid('B-1 9C Z DC D0C0_6011');
    assert.equal(String(g), 'b19cdcd0-c060-1100-0000-000000000000');
});

QUnit.test('normalization when longer (B253197)', function(assert) {
    var ten = '0123456789';

    var guid = new Guid(ten + ten + ten + ten);
    assert.equal(String(guid).length, 32 + 4);
});

QUnit.test('generation', function(assert) {
    var g = new Guid().toString();
    assert.ok(/[a-f0-9-]{36}/.test(g));
});

QUnit.test('valueOf and JSON stringify', function(assert) {
    var g = new Guid(),
        str = g.valueOf();

    assert.strictEqual(str, String(g));
    assert.strictEqual(JSON.stringify(g), JSON.stringify(str));
});
