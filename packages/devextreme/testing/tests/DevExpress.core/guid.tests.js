const Guid = require('core/guid');

QUnit.module('Guid');

QUnit.test('normalization', function(assert) {
    const g = new Guid('B-1 9C Z DC D0C0_6011');
    assert.equal(String(g), 'b19cdcd0-c060-1100-0000-000000000000');
});

QUnit.test('normalization when longer (B253197)', function(assert) {
    const ten = '0123456789';

    const guid = new Guid(ten + ten + ten + ten);
    assert.equal(String(guid).length, 32 + 4);
});

QUnit.test('generation', function(assert) {
    const g = new Guid().toString();
    assert.ok(/[a-f0-9-]{36}/.test(g));
});

QUnit.test('generated values are canonical and unique', function(assert) {
    const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    const values = new Set();
    let malformedCount = 0;

    for(let i = 0; i < 1000; i++) {
        const value = String(new Guid());

        if(!GUID_REGEX.test(value)) {
            malformedCount++;
        }
        values.add(value);
    }

    assert.strictEqual(malformedCount, 0, 'every generated value has the canonical guid format');
    assert.strictEqual(values.size, 1000, 'generated values do not repeat');
});

QUnit.test('generation is based on crypto.getRandomValues', function(assert) {
    const bytes = [0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0x10, 0x32, 0x54, 0x76, 0x98, 0xba, 0xdc, 0xfe];
    const stub = sinon.stub(window.crypto, 'getRandomValues').callsFake(function(array) {
        array.set(bytes);
        return array;
    });

    try {
        assert.strictEqual(String(new Guid()), '01234567-89ab-cdef-1032-547698badcfe');
    } finally {
        stub.restore();
    }
});

QUnit.test('valueOf and JSON stringify', function(assert) {
    const g = new Guid();
    const str = g.valueOf();

    assert.strictEqual(str, String(g));
    assert.strictEqual(JSON.stringify(g), JSON.stringify(str));
});
