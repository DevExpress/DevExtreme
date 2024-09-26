import dateUtils from 'core/utils/date';
const { test, module } = QUnit;

module('getRangesByDates', {}, () => {
    test('getRangesByDates should generate correctly ranges', function(assert) {
        const dates = [
            new Date(1716745334957), // May 26 2024
            '2024-11-27T13:27:01',
            '2024-10-27T16:54:10',
            '2024-09-20T16:54:48',
            '2024-09-21T18:54:21',
            '2024-09-23T16:54:04',
            '2024-09-24T02:54:12',
            '2024-09-27T02:17:07',
            '2024-09-26T18:28:11',
            '2024-09-25T00:28:10',
        ];

        const result = dateUtils.getRangesByDates(dates);
        const expectedResult = [
            [
                new Date('2024-05-26T00:00:00'),
            ],
            [
                new Date('2024-09-20T00:00:00'),
                new Date('2024-09-21T00:00:00'),
            ],
            [
                new Date('2024-09-23T00:00:00'),
                new Date('2024-09-27T00:00:00'),
            ],
            [
                new Date('2024-10-27T00:00:00'),
            ],
            [
                new Date('2024-11-27T00:00:00'),
            ]
        ];

        assert.deepEqual(result, expectedResult);
    });
});
