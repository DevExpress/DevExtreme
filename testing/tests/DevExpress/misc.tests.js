define(function(require) {
    var noop = require('core/utils/common').noop;

    if(!('chrome' in window)) {
        return;
    }

    QUnit.test('sinon is patched to return negative descending identifiers', function(assert) {
        var clock = sinon.useFakeTimers(),
            id = setTimeout(noop, 1),
            id2 = setTimeout(noop, 2);

        assert.ok(id === -1000 && id2 === -1001, 'sinon.js must be patched. See diff in the source of this test');

        // - var id = 1;
        // + var id = -1000;

        // - var toId = id++;
        // + var toId = id--;

        // NOTE because during clean-up of qunit-fixture, unmocked clearTimeout may be called for mocked timer id.
        // Appears in hang-ups of QUnit tests, because internal QUnit timeout gets cleared

        clock.restore();
    });
});
