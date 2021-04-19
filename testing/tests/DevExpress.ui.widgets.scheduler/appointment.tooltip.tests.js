import $ from 'jquery';
import fx from 'animation/fx';
import Color from 'color';
import {
    SchedulerTestWrapper,
    initTestMarkup,
    createWrapper
} from '../../helpers/scheduler/helpers.js';

import 'ui/scheduler/ui.scheduler';
import 'ui/switch';
import 'generic_light.css!';

const {
    module,
    test
} = QUnit;

initTestMarkup();

module('Integration: Appointment tooltip', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler($.extend(options,
                {
                    height: options && options.height || 600
                })
            ).dxScheduler('instance');

            this.clock.tick(300);
            this.instance.focus();

            this.scheduler = new SchedulerTestWrapper(this.instance);
        };
        this.getAppointmentColor = function($task, checkedProperty) {
            checkedProperty = checkedProperty || 'backgroundColor';
            return new Color($task.css(checkedProperty)).toHex();
        };
        this.clock = sinon.useFakeTimers();
        this.tasks = [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: 'Task 2',
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            }
        ];
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
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
        test(`Appointment tooltip should be consider disabled property of appointment (${testCase.text})`, function(assert) {
            const scheduler = createWrapper({
                dataSource: [{
                    text: 'Website Re-Design Plan',
                    startDate: new Date(2021, 4, 24, 1),
                    endDate: new Date(2021, 4, 24, 2),
                    disabled: testCase.disabled
                }],
                currentDate: new Date(2021, 4, 24),
                height: 600
            });

            const getAppointmentDisabled = sinon.spy(scheduler.instance._appointmentTooltip._options, 'getAppointmentDisabled');

            scheduler.appointments.click();

            const deleteButton = scheduler.tooltip.getDeleteButton();
            const getAppointmentDisabledResult = getAppointmentDisabled.returnValues[0];

            const isExistDeleteButton = !!deleteButton.length;
            const isDisabled = testCase.result;

            assert.equal(isExistDeleteButton, !isDisabled, `visibility button should be equal ${!isDisabled}`);
            assert.equal(getAppointmentDisabledResult, isDisabled, `getAppointmentDisabled should be return ${isDisabled}`);
        });
    });
});
