

import timeZoneUtils from 'ui/scheduler/utils.timeZone';
import timeZoneDataUtils from 'ui/scheduler/timezones/utils.timezones_data';

const { test, module } = QUnit;

module('Time zone data utils', {}, () => {
    test('Untils should be pre-processed and cached', function(assert) {
        const spyGetUtcOffset = sinon.spy(timeZoneDataUtils, 'getUtcOffset');
        const spyGetTimeZoneDeclarationTupleCore = sinon.spy(timeZoneDataUtils, 'getTimeZoneDeclarationTupleCore');

        try {
            assert.equal(timeZoneDataUtils._tzCache.map.size, 0, '');

            timeZoneDataUtils.getTimeZoneOffsetById('America/Los_Angeles', new Date(2021, 3, 3));
            assert.ok(Array.isArray(spyGetUtcOffset.args[0][2]));

            assert.equal(timeZoneDataUtils._tzCache.map.size, 1);

            timeZoneDataUtils.getTimeZoneOffsetById('America/Los_Angeles', new Date(2021, 3, 3));
            assert.ok(Array.isArray(spyGetUtcOffset.args[1][2]));

            assert.equal(timeZoneDataUtils._tzCache.map.size, 1);

            timeZoneDataUtils.getTimeZoneOffsetById('Europe/Berlin', new Date(2021, 3, 3));
            assert.ok(Array.isArray(spyGetUtcOffset.args[2][2]));

            assert.equal(timeZoneDataUtils._tzCache.map.size, 2);

            timeZoneDataUtils.getTimeZoneOffsetById('Europe/Berlin', new Date(2021, 3, 3));
            assert.ok(Array.isArray(spyGetUtcOffset.args[3][2]));

            assert.equal(timeZoneDataUtils._tzCache.map.size, 2);

            timeZoneDataUtils.getTimeZoneDeclarationTuple('Europe/Berlin', 2021);
            assert.ok(Array.isArray(spyGetTimeZoneDeclarationTupleCore.args[0][2]));

            assert.equal(timeZoneDataUtils._tzCache.map.size, 2);
        } catch(error) {
            spyGetUtcOffset.restore();
            spyGetTimeZoneDeclarationTupleCore.restore();

            assert.ok(false, 'test throw an error');
        }
    });
});

module('Time zone utils', {}, () => {
    test('hasDSTInLocalTimeZone', function(assert) {
        const hasDST = timeZoneUtils.hasDSTInLocalTimeZone();

        const nowDate = new Date(Date.now());
        const startDate = new Date();
        const endDate = new Date();

        startDate.setFullYear(nowDate.getFullYear(), 0, 1);
        endDate.setFullYear(nowDate.getFullYear(), 6, 1);

        assert.equal(hasDST, startDate.getTimezoneOffset() !== endDate.getTimezoneOffset(), 'function should return valid result');
    });

    test('isEqualLocalTimeZone', function(assert) {
        const result = timeZoneUtils.isEqualLocalTimeZone('Brazil/Acre', new Date(2021, 6, 6));

        assert.notOk(result, 'local time zone shouldn\'t equal to \'Brazil/Acre\'');
    });

    test('isEqualLocalTimeZoneByDeclaration', function(assert) {
        const result = timeZoneUtils.isEqualLocalTimeZoneByDeclaration('Brazil/Acre', new Date(2021, 6, 6));

        assert.notOk(result, 'local time zone shouldn\'t equal to \'Brazil/Acre\'');
    });
});
