

import timeZoneUtils from 'ui/scheduler/utils.timeZone';

const { test, module } = QUnit;

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
