import fx from 'common/core/animation/fx';
import {
    initTestMarkup,
    createWrapper
} from '../../helpers/scheduler/helpers.js';

import '__internal/scheduler/m_scheduler';
import 'ui/switch';
import 'fluent_blue_light.css!';

const {
    module,
    test
} = QUnit;

QUnit.testStart(() => initTestMarkup());

module('Integration: Appointment tooltip', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    [{
        disabled: true,
        result: true,
        text: 'disabled is true'
    }, {
        disabled: false,
        result: false,
        text: 'disabled is false'
    }, {
        result: false,
        text: 'disabled is undefined'
    }, {
        disabled: () => false,
        result: false,
        text: 'disabled is function, return false'
    }, {
        disabled: () => true,
        result: true,
        text: 'disabled is function, return true'
    }].forEach(testCase => {
        test(`Appointment tooltip should be consider disabled property of appointment (${testCase.text})`, async function(assert) {
            const scheduler = await createWrapper({
                dataSource: [{
                    text: 'Website Re-Design Plan',
                    startDate: new Date(2021, 4, 24, 1),
                    endDate: new Date(2021, 4, 24, 2),
                    disabled: testCase.disabled
                }],
                currentDate: new Date(2021, 4, 24),
                height: 600
            });

            const getAppointmentDisabled = sinon.spy(scheduler.instance.appointmentTooltip.options, 'getAppointmentDisabled');

            const clock = sinon.useFakeTimers();
            await scheduler.appointments.click(0, clock);
            clock.restore();

            const deleteButton = scheduler.tooltip.getDeleteButton();
            const getAppointmentDisabledResult = getAppointmentDisabled.returnValues[0];

            const isExistDeleteButton = !!deleteButton.length;
            const isDisabled = testCase.result;

            assert.equal(isExistDeleteButton, !isDisabled, `visibility button should be equal ${!isDisabled}`);
            assert.equal(getAppointmentDisabledResult, isDisabled, `getAppointmentDisabled should be return ${isDisabled}`);
        });
    });
});
