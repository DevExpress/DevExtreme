import { createWidget, getContainerFileUrl } from '../../helpers/testHelper';
import SchedulerTestHelper from '../../helpers/scheduler.test.helper';
import { ClientFunction } from 'testcafe';

fixture`Behaviour dragging between table rows in DayView-mode`.page(getContainerFileUrl());

const scheduler = new SchedulerTestHelper("#container");

const listOfDragRows = [1, 2, 3, 5, 8];

const groups = [{
    id: 0,
    text: 'Red',
    color: "#ff324a"
},
{
    id: 1,
    text: 'Blue',
    color: "#0090c6"
},];

const pinkAppointments = [{
    text: "Red #1",
    startDate: new Date(2018, 3, 20, 9, 0),
    endDate: new Date(2018, 3, 20, 9, 30),
    group: [0],
    height: '50px'
},
{
    text: "Red #2",
    startDate: new Date(2018, 3, 20, 9, 0),
    endDate: new Date(2018, 3, 20, 10, 0),
    group: [0],
    height: '100px'
},
{
    text: "Red #3",
    startDate: new Date(2018, 3, 20, 9, 0),
    endDate: new Date(2018, 3, 20, 10, 30),
    group: [0],
    height: '150px'
},
{
    text: "Red #4",
    startDate: new Date(2018, 3, 20, 9, 0),
    endDate: new Date(2018, 3, 20, 11, 0),
    group: [0],
    height: '200px'
},
{
    text: "Red #5",
    startDate: new Date(2018, 3, 20, 9, 0),
    endDate: new Date(2018, 3, 20, 11, 30),
    group: [0],
    height: '250px'
},
];

const blueAppointments = [{
    text: "Blue #1",
    startDate: new Date(2018, 3, 20, 13, 0),
    endDate: new Date(2018, 3, 20, 13, 30),
    group: [1],
    height: '50px'
},
{
    text: "Blue #2",
    startDate: new Date(2018, 3, 20, 13, 0),
    endDate: new Date(2018, 3, 20, 14, 0),
    group: [1],
    height: '100px'
},
{
    text: "Blue #3",
    startDate: new Date(2018, 3, 20, 13, 0),
    endDate: new Date(2018, 3, 20, 14, 30),
    group: [1],
    height: '150px'
},
{
    text: "Blue #4",
    startDate: new Date(2018, 3, 20, 13, 0),
    endDate: new Date(2018, 3, 20, 15, 0),
    group: [1],
    height: '200px'
},
{
    text: "Blue #5",
    startDate: new Date(2018, 3, 20, 13, 0),
    endDate: new Date(2018, 3, 20, 15, 30),
    group: [1],
    height: '250px'
}
];

const createScheduler = async () => {
    await createWidget("dxScheduler", {
        dataSource: pinkAppointments.concat(blueAppointments),
        resources: [{
            fieldExpr: "group",
            dataSource: groups,
            label: "Group"
        }],
        views: ["day", "week"],
        currentView: "day",
        currentDate: new Date(2018, 3, 20),
        startDayHour: 9,
        useColorAsDefault: true
    });
}

test('Appointments should be replaced on the timeline with maintaining their size and duration', async t => {
    for (let index = 0; index < 5; index++) {
        const actionList = listOfDragRows.map(row =>
            async () => {
                const pinkAppointment = scheduler.getAppointmentByTitle(pinkAppointments[index].text);
                const blueAppointment = scheduler.getAppointmentByTitle(blueAppointments[index].text);

                const pinkAppointmentHeight = await pinkAppointment.getStyleProperty('height');
                const blueAppointmentHeight = await blueAppointment.getStyleProperty('height');

                const pinkAppointmentHeightExpect = pinkAppointments[index].height;
                const blueAppointmentHeightExpect = blueAppointments[index].height;

                await t
                    .dragToElement(pinkAppointment, scheduler.getDateTableRow(row))
                    .expect(pinkAppointmentHeight).eql(pinkAppointmentHeightExpect)

                    .dragToElement(blueAppointment, scheduler.getDateTableRow(8 - row))
                    .expect(blueAppointmentHeight).eql(blueAppointmentHeightExpect);
            }
        );

        for (let action of actionList) {
            await action();
        }
    }
}).before(async () => await createScheduler());
