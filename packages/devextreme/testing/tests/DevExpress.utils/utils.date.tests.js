import dateUtils from 'core/utils/date';
const { test, module } = QUnit;

module('getRangesByDates', {}, () => {
    test('getRangesByDates should generate correctly ranges', function(assert) {
        const dates = [
            new Date(1726765744957), // 19
            '2024-11-27',
            '2024-10-27T16:54:10',
            1726765744957, // 19
            1726852144957, // 20
            1726938544957, // 21
            1727111344957, // 23
            1727197744957, // 24
            1727434511000, // 27
            '2024-09-26T18:28:10',
            '2024-09-25T00:28:10',
        ];

        assert.equal(result.v, 100, 'v value should be rounded');
    });
});
