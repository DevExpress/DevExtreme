import dateUtils from 'core/utils/date';
const { test, module } = QUnit;

module('getRangesByDates', {}, () => {
    test('getRangesByDates should generate correctly ranges when dates is empty array', function(assert) {
        const dates = [];
        const expectedResult = [];

        const result = dateUtils.getRangesByDates(dates);

        assert.deepEqual(result, expectedResult);
    });

    test('getRangesByDates should generate correctly ranges when dates is 1-length array', function(assert) {
        const dates = [ new Date('2024-11-27T13:27:01') ];
        const expectedResult = [ [ new Date('2024-11-27T00:00:00') ] ];

        const result = dateUtils.getRangesByDates(dates);

        assert.deepEqual(result, expectedResult);
    });

    test('getRangesByDates should generate correctly ranges when dates is array with single range', function(assert) {
        const dates = [
            new Date('2024-09-27T02:17:07'),
            new Date('2024-09-28T02:17:07'),
            new Date('2024-09-29T02:17:07'),
        ];

        const expectedResult = [
            [
                new Date('2024-09-27T00:00:00'),
                new Date('2024-09-29T00:00:00'),
            ],
        ];

        const result = dateUtils.getRangesByDates(dates);

        assert.deepEqual(result, expectedResult);
    });

    test('getRangesByDates should generate correctly ranges', function(assert) {
        const dates = [
            new Date('2024-11-27T13:27:01'),
            new Date('2024-10-27T16:54:10'),
            new Date('2024-09-20T16:54:48'),
            new Date('2024-09-21T18:54:21'),
            new Date('2024-09-23T16:54:04'),
            new Date('2024-09-24T02:54:12'),
            new Date('2024-09-27T02:17:07'),
            new Date('2024-09-26T18:28:11'),
            new Date('2024-09-25T00:28:10'),
        ];

        const expectedResult = [
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

        const result = dateUtils.getRangesByDates(dates);

        assert.deepEqual(result, expectedResult);
    });
});
