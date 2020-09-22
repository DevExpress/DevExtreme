

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

        assert.equal(hasDST, startDate.getTimezoneOffset() !== endDate.getTimezoneOffset(), 'function should be return valid result');
    });

    test('isEqualLocalTimeZone', function(assert) {
        const result = timeZoneUtils.isEqualLocalTimeZone('Africa/Abidjan');

        assert.notOk(result, 'local time zone shouldn\'t equal \'Africa/Abidjan\'');
    });
});
