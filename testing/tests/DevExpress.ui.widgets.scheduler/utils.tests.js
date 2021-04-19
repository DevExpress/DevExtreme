

import timeZoneUtils from 'ui/scheduler/utils.timeZone';
import timeZoneDataUtils from 'ui/scheduler/timezones/utils.timezones_data';

const { test, module } = QUnit;

module('Time zone data utils', {}, () => {
    test('Untils should be pre-processed and cached', function(assert) {
        const spyGetUtcOffset = sinon.spy(timeZoneDataUtils, 'getUtcOffset');
        const spyGetTimeZoneDeclarationTupleCore = sinon.spy(timeZoneDataUtils, 'getTimeZoneDeclarationTupleCore');

        const checkCache = (timeZoneId, dateTimeStamp, expectedCacheSize) => {
            timeZoneDataUtils.getTimeZoneOffsetById(timeZoneId, dateTimeStamp);
            let lastCallIndex = spyGetUtcOffset.args.length - 1;
            const offsetByIdCallArgument = spyGetUtcOffset.args[lastCallIndex][0];

            const cachedValue = timeZoneDataUtils._tzCache.get(timeZoneId);

            timeZoneDataUtils.getTimeZoneDeclarationTuple(timeZoneId, dateTimeStamp);
            lastCallIndex = spyGetTimeZoneDeclarationTupleCore.args.length - 1;
            const declarationTupleCallArgument = spyGetTimeZoneDeclarationTupleCore.args[lastCallIndex][0];

            assert.equal(timeZoneDataUtils._tzCache.map.size, expectedCacheSize, 'Cache size should be correct');
            assert.equal(cachedValue, offsetByIdCallArgument, 'Function call argument of `getUtcOffset` should be cached');
            assert.equal(cachedValue, declarationTupleCallArgument, 'Function call argument of `getTimeZoneDeclarationTupleCore` should be cached');
        };

        try {
            assert.equal(timeZoneDataUtils._tzCache.map.size, 0, 'Timezone cache should be empty');

            checkCache('America/Los_Angeles', new Date(2021, 3, 3), 1);

            checkCache('America/Los_Angeles', new Date(2021, 3, 3), 1);

            checkCache('Europe/Berlin', new Date(2021, 3, 3), 2);

            checkCache('Europe/Berlin', new Date(2021, 3, 3), 2);

            checkCache('Africa/Addis_Ababa', 2021, 3);
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
