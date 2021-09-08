import { TimeZoneCalculator } from 'ui/scheduler/timeZoneCalculator';
import dateUtils from 'core/utils/date';

const toMs = dateUtils.dateToMilliseconds;
const { test, module } = QUnit;

module('TimeZoneCalculator', {}, () => {
    const localOffset = (new Date()).getTimezoneOffset() * 60000;
    const commonOffset = 15;
    const appointmentOffset = 7.5;

    const sourceDate = new Date(2020, 6, 6, 18, 0);

    const mock = {
        getClientOffset: date => localOffset,
        getCommonOffset: date => commonOffset,
        getAppointmentOffset: (date, appointmentTimezone) => appointmentOffset
    };

    ['Grid', 'Appointment' ].forEach(path => {
        test(`converting operations with '${path}' should be symmetrical`, function(assert) {
            const calculator = new TimeZoneCalculator(mock);

            const convertedDate = calculator.createDate(sourceDate, { path: `to${path}` });
            const convertedDateBack = calculator.createDate(convertedDate, { path: `from${path}` });

            assert.notStrictEqual(convertedDate.getTime(), sourceDate.getTime(), 'converted date shouldn\'t equal to source date');
            assert.strictEqual(sourceDate.getTime(), convertedDateBack.getTime(), 'source date should be equal converted back date');
        });
    });

    ['America/Los_Angeles', undefined].forEach(appointmentTimezone => {
        ['toGrid', 'fromGrid'].forEach(path => {
            test(`if converting to common timezone, should use common time zone
                [path: ${path}, appointmentTimezone: ${appointmentTimezone}]`, function(assert) {
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

    ['America/Los_Angeles', undefined].forEach(appointmentTimezone => {
        ['toAppointment', 'fromAppointment'].forEach(path => {
            test(`if converting to appointment timezone, should use appointment time zone
                [path: ${path}, appointmentTimezone: ${appointmentTimezone}]`, function(assert) {
                const calculator = new TimeZoneCalculator(mock);

                const getConvertedDateByOffsetsStub = sinon.stub(calculator, '_getConvertedDateByOffsets');
                calculator.createDate(sourceDate, { path: path, appointmentTimeZone: appointmentTimezone });

                assert.ok(getConvertedDateByOffsetsStub.calledOnce);

                assert.equal(getConvertedDateByOffsetsStub.args[0][0].getTime(), sourceDate.getTime(), 'source date should passed to converter');
                assert.equal(getConvertedDateByOffsetsStub.args[0][1], -localOffset / toMs('hour'), 'valid local offset should passed to converter');

                if(appointmentTimezone === undefined) {
                    assert.equal(getConvertedDateByOffsetsStub.args[0][2], commonOffset, 'common offset should passed to converter, if appointment timezone not set');
                } else {
                    assert.equal(getConvertedDateByOffsetsStub.args[0][2], appointmentOffset, 'appointment offset should passed to converter');
                }
            });
        });
    });
});
