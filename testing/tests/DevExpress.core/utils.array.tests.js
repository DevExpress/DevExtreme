import * as arrayUtils from 'core/utils/array';

QUnit.module('array utils');

QUnit.test('groupBy', function(assert) {
    const grouped = arrayUtils.groupBy([
        { v: 1, g: 'g1' },
        { v: 2, g: 'g2' },
        { v: 3, g: 'g2' },
        { v: 4, g: 'g1' },
        { v: 5 },
    ], (i) => i.g);

    assert.deepEqual(grouped, {
        g1: [
            { v: 1, g: 'g1' },
            { v: 4, g: 'g1' },
        ],
        g2: [
            { v: 2, g: 'g2' },
            { v: 3, g: 'g2' }
        ],
        undefined: [
            { v: 5 }
        ]
    });
});
