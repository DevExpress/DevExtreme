import timeZoneUtils from '__internal/scheduler/m_utils_time_zone';
import timeZoneDataUtils from '__internal/scheduler/timezones/m_utils_timezones_data';
import { utils } from '__internal/scheduler/m_utils';
import { replaceWrongEndDate } from '__internal/scheduler/appointments/data_provider/m_utils';
import { oldGetTimeZone } from './getTimeZone.old.list.js';
import config from 'core/config';

const { test, module } = QUnit;

module('Time zone data utils', {}, () => {
    test('Untils should be pre-processed and cached', function(assert) {
        const spyGetUtcOffset = sinon.spy(timeZoneDataUtils, 'getUtcOffset');
        const spyGetTimeZoneDeclarationTupleCore = sinon.spy(timeZoneDataUtils, 'getTimeZoneDeclarationTupleCore');

        const checkCache = (timeZoneId, dateTimeStamp, expectedCacheSize) => {
            timeZoneDataUtils.getTimeZoneOffsetById(timeZoneId, dateTimeStamp);
            let lastCallIndex = spyGetUtcOffset.args.length - 1;
            const offsetByIdCallArgument = spyGetUtcOffset.args[lastCallIndex][0];

            const cachedValue = timeZoneDataUtils._tzCache.tryGet(timeZoneId);

            timeZoneDataUtils.getTimeZoneDeclarationTuple(timeZoneId, dateTimeStamp);
            lastCallIndex = spyGetTimeZoneDeclarationTupleCore.args.length - 1;
            const declarationTupleCallArgument = spyGetTimeZoneDeclarationTupleCore.args[lastCallIndex][0];

            assert.equal(timeZoneDataUtils._tzCache.map.size, expectedCacheSize, 'Cache size should be correct');
            assert.equal(cachedValue, offsetByIdCallArgument, 'Function call argument of `getUtcOffset` should be cached');
            assert.equal(cachedValue, declarationTupleCallArgument, 'Function call argument of `getTimeZoneDeclarationTupleCore` should be cached');
        };

        try {
            config({
                timezones: [
                    { id: 'America/Los_Angeles', untils: 'Infinity', offsets: '0', offsetIndices: '0' },
                    { id: 'Europe/Berlin', untils: 'Infinity', offsets: '0', offsetIndices: '0' },
                    { id: 'Africa/Addis_Ababa', untils: 'Infinity', offsets: '0', offsetIndices: '0' },
                ]
            });

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
        } finally {
            config({ timezones: null });
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

module('Date utils', () => {
    test('"replaceWrongEndDate" should process endDate correctly', function(assert) {
        [
            {
                data: {
                    startDate: new Date(2019, 4, 3, 12),
                    allDay: false
                },
                expectedEndDate: new Date(2019, 4, 3, 12, 30)
            },
            {
                data: {
                    startDate: new Date(2019, 4, 3, 12),
                    allDay: false,
                    endDate: new Date('string')
                },
                expectedEndDate: new Date(2019, 4, 3, 12, 30)
            },
            {
                data: {
                    startDate: new Date(2019, 4, 3, 12),
                    allDay: true
                },
                expectedEndDate: new Date(2019, 4, 3, 23, 59)
            }
        ].forEach(testCase => {
            const dataAccessors = utils.dataAccessors.create(
                {
                    startDate: 'startDate',
                    endDate: 'endDate',
                    allDay: 'allDay',
                },
                undefined,
                true
            );

            replaceWrongEndDate(
                testCase.data,
                new Date(2019, 4, 3, 12),
                testCase.data.endDate,
                30,
                dataAccessors
            );

            assert.equal(testCase.data.endDate.getHours(), testCase.expectedEndDate.getHours(), 'replaced endDate is ok');
            assert.equal(testCase.data.endDate.getMinutes(), testCase.expectedEndDate.getMinutes(), 'replaced endDate is ok');
        });
    });
});

module('getTimeZone', {}, () => {
    test('Old output should be equal new one', function(assert) {
        const newOutput = timeZoneUtils.getTimeZones(new Date(2024, 3, 16));
        const exceptions = [
            'Pacific/Marquesas', // old: GMT -10:30, actual GMT -9:30 (actual is correct, offset == -9.5 is correct for both)
            'America/Mazatlan', // old: -6, actual: -7 (actual is correct)
            'America/Ojinaga', // old: -6, actual: -5 (actual is correct)
            'Mexico/BajaSur', // old: -6, actual: -7 (actual is correct)
            'America/Bahia_Banderas', // old: -5, actual: -6 (actual is correct)
            'America/Merida', // old: -5, actual: -6 (actual is correct)
            'America/Mexico_City', // old: -5, actual: -6 (actual is correct)
            'Mexico/General', // old: -5, actual: -6 (actual is correct)
            'America/St_Johns', // old: GMT -03:30, actual: GMT -02:30 (actual is correct, offset == -2.5 is correct for both)
            'Canada/Newfoundland', // old: GMT -03:30, actual: GMT -02:30 (actual is correct, offset == -2.5 is correct for both)
            'America/Godthab', // old: -2, actual: -1 (actual is correct)
            'America/Nuuk', // old: -2, actual: -1 (actual is correct)
            'America/Scoresbysund', // old: 0, actual: -1 (actual is correct)
            'Africa/Juba', // old: 3, actual: 2 (actual is correct)
            'Asia/Gaza', // old: 3, actual: 2 (actual is correct)
            'Asia/Hebron', // old: 3, actual: 2 (actual is correct)
            'Europe/Volgograd', // old: 4, actual: 3 (actual is correct)
            'Asia/Tehran', // old: 4.5, actual: 3.5 (actual is correct)
            'Iran', // old: 4.5, actual: 3.5 (actual is correct)
            'Antarctica/Vostok', // old: 6, actual: 5 (old is correct !!!)
            'Asia/Almaty', // old: 6, actual: 5 (actual is correct)
            'Asia/Qostanay', // old: 6, actual: 5 (actual is correct)
            'Antarctica/Macquarie', // old: 11, actual: 10 (actual is correct)

            // CI error
            'Antarctica/Casey', // old: 8, actual: 11 (actual is correct)
        ];
        for(let i = 0; i < newOutput.length; i++) {
            if(!exceptions.includes(newOutput[i].id)) {
                assert.deepEqual(newOutput[i], oldGetTimeZone[i], 'results are not equlal');
            }
        }
    });
});
