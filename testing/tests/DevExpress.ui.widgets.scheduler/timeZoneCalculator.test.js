import { TimeZoneCalculator } from 'ui/scheduler/TimeZoneCalculator';
import dateUtils from 'core/utils/date';

const toMs = dateUtils.dateToMilliseconds;
const { test, module } = QUnit;

module('TimeZoneCalculator', {}, () => {
    ['Grid', 'Appointment' ].forEach(path => {
        test(`converting operations with '${path}' should be symmetrical`, function(assert) {
            const mock = {
                getClientOffset: date => date.getTimezoneOffset(),
                getCommonOffset: date => 3,
                getAppointmentOffset: (date, appointmentTimezone) => 4
            };

            const sourceDate = new Date(2020, 6, 6, 18, 0);
            const calculator = new TimeZoneCalculator(mock);

            const convertedDate = calculator.createDate(sourceDate, { path: `to${path}` });
            const convertedDateBack = calculator.createDate(convertedDate, { path: `from${path}` });

            assert.notStrictEqual(convertedDate.getTime(), sourceDate.getTime(), 'converted date shouldn\'t equal to source date');
            assert.strictEqual(sourceDate.getTime(), convertedDateBack.getTime(), 'source date should be equal converted back date');
        });
    });

    ['America/Los_Angeles', undefined].forEach(appointmentTimezone => {
        ['toGrid', 'fromGrid'].forEach(path => {
            test(`if converting to common timezone, shouldn't use appointment time zone
                [path: ${path}, appointmentTimezone: ${appointmentTimezone}]`, function(assert) {
                const localOffset = (new Date()).getTimezoneOffset() * 60000;
                const commonOffset = 11;

                const mock = {
                    getClientOffset: date => localOffset,
                    getCommonOffset: date => commonOffset,
                    getAppointmentOffset: (date, appointmentTimezone) => 7.5
                };

                const sourceDate = new Date(2020, 6, 6, 18, 0);
                const calculator = new TimeZoneCalculator(mock);

                const getConvertedDateByOffsetsStub = sinon.stub(calculator, '_getConvertedDateByOffsets');
                calculator.createDate(sourceDate, { path: path, appointmentTimeZone: appointmentTimezone });


                assert.ok(getConvertedDateByOffsetsStub.calledOnce);

                assert.equal(getConvertedDateByOffsetsStub.args[0][0].getTime(), sourceDate.getTime(), 'source date should passed to converter');
                assert.equal(getConvertedDateByOffsetsStub.args[0][1], -localOffset / toMs('hour'), 'valid local offset should passed to converter');
                assert.equal(getConvertedDateByOffsetsStub.args[0][2], commonOffset, 'common offset should passed to converter');
            });
        });
    });
});
