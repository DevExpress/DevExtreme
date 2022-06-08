import 'generic_light.css!';
import Scheduler from 'ui/scheduler/ui.scheduler';
import pointerMock from '../../helpers/pointerMock.js';
import { isDesktopEnvironment } from '../../helpers/scheduler/helpers';

const {
    testStart,
    test,
    module
} = QUnit;

const FIRST_SCHEDULER_ID = 'scheduler-first';
const SECOND_SCHEDULER_ID = 'scheduler-second';
const FIXTURE_SELECTOR = '#qunit-fixture';
const APPOINTMENT_SELECTOR = '.dx-scheduler-appointment-content';
const FIRST_CELL_SELECTOR = '.dx-scheduler-first-group-cell';

testStart(function() {
    const fixtureRef = document.querySelector(FIXTURE_SELECTOR);
    fixtureRef.innerHTML = `
        <div style="display: flex;">
            <div id="${FIRST_SCHEDULER_ID}"></div>
            <div id="${SECOND_SCHEDULER_ID}"></div>
        </div>
    `;
});

const testDragGroupName = 'testDragGroup';
const dragAppointmentBetweenSchedulersConfig = {
    firstSchedulerData: [
        {
            appointmentId: 100,
            text: 'Book Flights to San Fran for Sales Trip',
            startDate: new Date('2021-04-30T19:00:00.000Z'),
            endDate: new Date('2021-04-30T20:00:00.000Z'),
            allDay: true,
        },
    ],
    secondSchedulerData: [],
    getSchedulerOptions: (dataSource) => ({
        dataSource,
        currentView: 'workWeek',
        currentDate: new Date(2021, 3, 26),
        width: 300,
        appointmentDragging: {
            group: testDragGroupName,
            onRemove(e) {
                e.component.deleteAppointment(e.itemData);
            },
            onAdd(e) {
                e.component.addAppointment(e.itemData);
            },
        },
    })
};

module('Drag appointment between two schedulers with array DataSources', dragAppointmentBetweenSchedulersConfig, () => {
    if(!isDesktopEnvironment()) {
        return;
    }

    test('Drag appointment with schedulers cells with same indexes', function(assert) {
        const { getSchedulerOptions, firstSchedulerData, secondSchedulerData } = dragAppointmentBetweenSchedulersConfig;
        const firstSchedulerRef = document.querySelector(`#${FIRST_SCHEDULER_ID}`);
        const secondSchedulerRef = document.querySelector(`#${SECOND_SCHEDULER_ID}`);

        new Scheduler(firstSchedulerRef, getSchedulerOptions(firstSchedulerData));
        new Scheduler(secondSchedulerRef, getSchedulerOptions(secondSchedulerData));

        const appointmentToMove = firstSchedulerRef.querySelector(APPOINTMENT_SELECTOR);
        const appointmentToMoveRect = appointmentToMove.getBoundingClientRect();

        const firstCell = secondSchedulerRef.querySelector(FIRST_CELL_SELECTOR);
        const cellToMoveRect = firstCell.getBoundingClientRect();

        const pointer = pointerMock(appointmentToMove);

        pointer
            .start()
            .down(appointmentToMoveRect.x + appointmentToMoveRect.width / 2, appointmentToMoveRect.y + appointmentToMoveRect.height / 2)
            .move(1, 1)
            .move(cellToMoveRect.x - appointmentToMoveRect.x, 0)
            .up();

        const result = secondSchedulerRef.querySelector(APPOINTMENT_SELECTOR);
        assert.notStrictEqual(result, null, 'appointment doesn\'t exist in the second scheduler.');
    });
});
