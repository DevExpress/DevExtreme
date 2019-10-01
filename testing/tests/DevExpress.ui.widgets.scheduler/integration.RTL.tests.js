import fx from "animation/fx";
import { createWrapper, initTestMarkup } from "./helpers.js";
import translator from "animation/translator";

import "ui/scheduler/ui.scheduler";
import "common.css!";
import "generic_light.css!";

const { test, module } = QUnit;

initTestMarkup();

const moduleConfig = {
    beforeEach() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach() {
        fx.off = false;
        this.clock.restore();
    }
};

module("RTL", moduleConfig, () => {
    test("Appointment should have correct position with multiple resources if rtlEnabled is true (T803275)", assert => {
        const views = ["month", "week"];

        const expectedValues = {
            month: [
                {
                    top: 257,
                    left: 599
                }, {
                    top: 257,
                    left: 250
                }
            ],
            week: [
                {
                    top: 0,
                    left: 539
                }, {
                    top: 0,
                    left: 241
                }
            ]
        };

        const scheduler = createWrapper({
            views: views,
            currentView: views[0],
            rtlEnabled: true,
            dataSource: [{
                text: "Apt1",
                roomId: [1, 2],
                startDate: new Date(2017, 4, 22),
                endDate: new Date(2017, 4, 22, 1, 30)
            }],
            currentDate: new Date(2017, 4, 22),
            groups: ['roomId'],
            resources: [{
                fieldExpr: "roomId",
                dataSource: [
                    {
                        text: "Room 1",
                        id: 1
                    }, {
                        text: "Room 2",
                        id: 2
                    }
                ],
            }],
            width: 700,
            height: 600
        });

        views.forEach(view => {
            const { getAppointment } = scheduler.appointments;
            const expectedValue = expectedValues[view];

            scheduler.option("currentView", view);

            [getAppointment(0), getAppointment(1)].forEach((appointment, index) => {
                const position = translator.locate(appointment);

                assert.roughEqual(Math.round(position.left), expectedValue[index].left, 2.1, `left position of ${index} appointment should be correct in ${view} view`);
                assert.roughEqual(Math.round(position.top), expectedValue[index].top, 2.1, `top position of ${index} appointment should be correct in ${view} view`);
            });
        });
    });

    module("Task positions", () => {
        const createScheduler = view => {
            return createWrapper({
                currentView: view,
                currentDate: new Date(2015, 1, 9),
                height: 600,
                dataSource: [{
                    text: "Task 1",
                    startDate: new Date(2015, 1, 9, 1, 0),
                    endDate: new Date(2015, 1, 9, 2, 0)
                }],
                rtlEnabled: true,
                maxAppointmentsPerCell: null
            });
        };

        test("Day view", assert => {
            const scheduler = createScheduler("day");

            const cell = scheduler.workSpace.getCell(8);
            const appointment = scheduler.appointments.getAppointment();

            assert.equal(appointment.position().left + appointment.outerWidth(), cell.position().left + cell.outerWidth(), "task position is correct");
        });

        test("Week view", assert => {
            const scheduler = createScheduler("week");

            const cell = scheduler.workSpace.getCell(1);
            const appointment = scheduler.appointments.getAppointment();

            assert.equal(Math.round(appointment.position().left + appointment.outerWidth()), Math.round(cell.position().left + cell.outerWidth()), "task position is correct");
        });

        test("Month view", assert => {
            const scheduler = createScheduler("month");

            const cell = scheduler.workSpace.getCell(1);
            const appointment = scheduler.appointments.getAppointment();

            assert.roughEqual(appointment.position().left + appointment.outerWidth(), cell.position().left + cell.outerWidth(), 1, "task position is correct");
        });
    });
});
