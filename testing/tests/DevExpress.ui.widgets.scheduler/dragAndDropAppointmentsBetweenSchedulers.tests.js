import $ from 'jquery';
import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';
import pointerMock from '../../helpers/pointerMock.js';

const {
    testStart,
    test,
    module
} = QUnit;

const FIRST_SCHEDULER_ID = 'scheduler-first';
const SECOND_SCHEDULER_ID = 'scheduler-second';

testStart(function() {
    $('#qunit-fixture').html(`
    <div style="display: flex;">
        <div id="${FIRST_SCHEDULER_ID}"></div>
        <div id="${SECOND_SCHEDULER_ID}"></div>
    </div>
    `);
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
        timeZone: 'America/Los_Angeles',
        dataSource,
        currentView: 'workWeek',
        views: ['workWeek'],
        currentDate: new Date(2021, 3, 26),
        startDayHour: 9,
        width: 600,
        height: 600,
        editing: true,
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
    test('Drag appointment with schedulers cells with same indexes', function(assert) {
        const { getSchedulerOptions, firstSchedulerData, secondSchedulerData } = dragAppointmentBetweenSchedulersConfig;
        const $firstScheduler = $(`#${FIRST_SCHEDULER_ID}`);
        const $secondScheduler = $(`#${SECOND_SCHEDULER_ID}`);

        $firstScheduler.dxScheduler(getSchedulerOptions(firstSchedulerData)).dxScheduler('instance');
        $secondScheduler.dxScheduler(getSchedulerOptions(secondSchedulerData)).dxScheduler('instance');

        const appointments = $firstScheduler.find('.dx-scheduler-appointment-content');
        const [appointmentToMove] = appointments;
        const appointmentToMoveRect = appointmentToMove.getBoundingClientRect();

        const firstCells = $secondScheduler.first('.dx-scheduler-first-group-cell');
        const [cellToMove] = firstCells;
        const cellToMoveRect = cellToMove.getBoundingClientRect();

        const pointer = pointerMock(appointmentToMove);

        pointer
            .start()
            .down(appointmentToMoveRect.x + appointmentToMoveRect.width / 2, appointmentToMoveRect.y + appointmentToMoveRect.height / 2)
            .move(1, 1)
            .move(cellToMoveRect.x - appointmentToMoveRect.x + appointmentToMoveRect.width, 0)
            .up();

        const result = $secondScheduler.find('.dx-scheduler-appointment-content');
        assert.ok(result.length > 0, 'appointment doesn\'t exist in second scheduler.');
    });
});
