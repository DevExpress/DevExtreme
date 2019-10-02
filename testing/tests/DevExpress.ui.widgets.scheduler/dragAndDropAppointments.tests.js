import fx from "animation/fx";
import $ from "jquery";
import pointerMock from "../../helpers/pointerMock.js";
import translator from "animation/translator";
import {
    createWrapper,
    initTestMarkup,
    isDesktopEnvironment
} from "./helpers.js";

import "common.css!";
import "generic_light.css!";
import "ui/scheduler/ui.scheduler";

const {
    testStart,
    test,
    module
} = QUnit;

testStart(() => initTestMarkup());

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

module("Drag and drop appointments", moduleConfig, () => {
    if(!isDesktopEnvironment()) {
        return;
    }

    const commonViews = [{
        type: "day",
        name: "day"
    }, {
        type: "month",
        name: "month"
    }, {
        type: "week",
        name: "week"
    }];

    const timeLineViews = [{
        type: "timelineDay",
        name: "timelineDay"
    }, {
        type: "timelineWeek",
        name: "timelineWeek"
    }, {
        type: "timelineWorkWeek",
        name: "timelineWorkWeek"
    }, {
        type: "timelineMonth",
        name: "timelineMonth"
    }];

    const groupViews = [{
        type: "workWeek",
        name: "Vertical Grouping",
        groupOrientation: "vertical",
        cellDuration: 60,
        intervalCount: 2
    }, {
        type: "workWeek",
        name: "Horizontal Grouping",
        groupOrientation: "horizontal",
        cellDuration: 30,
        intervalCount: 2
    }];

    const priorityData = [{
        text: "Low Priority",
        id: 1,
        color: "#1e90ff"
    }, {
        text: "High Priority",
        id: 2,
        color: "#ff9747"
    }];

    const getAbsolutePosition = appointment => {
        const appointmentPosition = translator.locate(appointment);
        const parentPosition = appointment.parent()[0].getBoundingClientRect();

        return {
            top: parentPosition.top + appointmentPosition.top,
            left: parentPosition.left + appointmentPosition.left
        };
    };

    module("Appointment should move a same distance in dragging from tooltip case", () => {
        const data = [
            {
                text: "app1",
                startDate: new Date(2017, 4, 22, 9, 30),
                endDate: new Date(2017, 4, 22, 11, 30),
                priorityId: 1
            }, {
                text: "app2",
                startDate: new Date(2017, 4, 22, 10, 30),
                endDate: new Date(2017, 4, 22, 11, 30),
                priorityId: 1
            }, {
                text: "app3",
                startDate: new Date(2017, 4, 22, 10, 30),
                endDate: new Date(2017, 4, 22, 11, 30),
                priorityId: 1
            }, {
                text: "app-all-day-1",
                startDate: new Date(2017, 4, 25, 11, 0),
                endDate: new Date(2017, 4, 25, 12, 0),
                allDay: true,
                priorityId: 2
            }, {
                text: "app-all-day-2",
                startDate: new Date(2017, 4, 25, 11, 0),
                endDate: new Date(2017, 4, 25, 12, 0),
                allDay: true,
                priorityId: 2
            }, {
                text: "app-all-day-3",
                startDate: new Date(2017, 4, 25, 11, 0),
                endDate: new Date(2017, 4, 25, 12, 0),
                allDay: true,
                priorityId: 2
            }, {
                text: "app-all-day-4",
                startDate: new Date(2017, 4, 25, 11, 0),
                endDate: new Date(2017, 4, 25, 12, 0),
                allDay: true,
                priorityId: 2
            }
        ];

        const createScheduler = (views) => {
            return createWrapper({
                dataSource: $.extend(true, [], data),
                views: views,
                currentView: views[0].name,
                currentDate: new Date(2017, 4, 25),
                startDayHour: 9,
                width: 800,
                height: 600,
                groups: ["priorityId"],
                resources: [{
                    fieldExpr: "priorityId",
                    dataSource: priorityData,
                    label: "Priority"
                }]
            });
        };

        const scrollToButton = (scheduler, button) => {
            const scrollContainer = scheduler.workSpace.getDataTableScrollableContainer();

            scrollContainer.scrollTop($(button).offset().top - scrollContainer.offset().top);
            scrollContainer.scrollLeft($(button).offset().left - scrollContainer.offset().left);
        };

        const getFakeAppointmentPosition = scheduler => {
            const fakeAppointment = scheduler.appointments.compact.getFakeAppointment();
            const position = translator.locate(fakeAppointment);

            return {
                left: position.left + fakeAppointment.width() / 2,
                top: position.top + fakeAppointment.height() / 2
            };
        };

        const createMousePosition = (compactAppointment) => {
            const position = getAbsolutePosition(compactAppointment);

            return {
                x: position.left + compactAppointment.width() / 2,
                y: position.top + compactAppointment.height() / 2
            };
        };

        const testViews = (views, assert) => {
            const scheduler = createScheduler(views);

            commonViews.forEach(view => {
                scheduler.option("currentView", view.name);

                [false, true].forEach(rtlEnabled => {
                    scheduler.option("rtlEnabled", rtlEnabled);
                    scheduler.option("dataSource", $.extend(true, [], data));

                    scheduler.appointments.compact.getButtons().slice(0, 1).each((index, button) => {
                        testFakeAppointmentPosition(scheduler, button, index, view.name, rtlEnabled, assert);
                    });
                });
            });
        };

        const testFakeAppointmentPosition = (scheduler, button, index, viewName, rtlEnabled, assert) => {
            const dragOffset = { left: 100, top: 100 };

            scrollToButton(scheduler, button);
            scheduler.appointments.compact.click(index);

            const compactAppointment = scheduler.appointments.compact.getAppointment();
            const mousePosition = createMousePosition(compactAppointment);

            const pointer = pointerMock(compactAppointment).start();

            pointer
                .down(mousePosition.x, mousePosition.y)
                .move(dragOffset.left, dragOffset.top);

            const fakeAppointmentPosition = getFakeAppointmentPosition(scheduler);

            assert.roughEqual(Math.round(fakeAppointmentPosition.left - dragOffset.left), Math.round(mousePosition.x), 1.1,
                `appointment should have correct left position in ${viewName} and rtlEnable=${rtlEnabled}`);
            assert.roughEqual(Math.round(fakeAppointmentPosition.top - dragOffset.top), Math.round(mousePosition.y), 1.1,
                `appointment should have correct top position in ${viewName} and rtlEnable=${rtlEnabled}`);

            pointer
                .up();
        };

        test("in common views", assert => testViews(commonViews, assert));
        test("in time line views", assert => testViews(timeLineViews, assert));
        test("in group views", assert => testViews(groupViews, assert));
    });

    module("Appointment should move a same distance as mouse", () => {
        const createScheduler = views => {
            return createWrapper({
                dataSource: $.extend(true, [], data),
                width: 850,
                height: 600,
                views: views,
                currentView: views[0].name,
                crossScrollingEnabled: true,
                currentDate: new Date(2018, 4, 21),
                startDayHour: 9,
                endDayHour: 16,
                groups: ["priorityId"],
                resources: [{
                    fieldExpr: "priorityId",
                    dataSource: priorityData,
                    label: "Priority"
                }]
            });
        };

        const data = [{
            text: "Website Re-Design Plan",
            priorityId: 2,
            startDate: new Date(2018, 4, 21, 9, 30),
            endDate: new Date(2018, 4, 21, 11, 30)
        }, {
            text: "Book Flights to San Fran for Sales Trip",
            priorityId: 1,
            startDate: new Date(2018, 4, 21, 10, 0),
            endDate: new Date(2018, 4, 21, 12, 0),
            allDay: true
        }];

        const dragCases = [
            {
                top: 20,
                left: 20
            }, {
                top: -10,
                left: 5
            }
        ];

        const testAppointmentPosition = (scheduler, text, rtlEnabled, dragCase, viewName, assert) => {
            const appointment = scheduler.appointments.find(text);

            const positionBeforeDrag = getAbsolutePosition(appointment);
            const pointer = pointerMock(appointment).start();
            pointer
                .down(positionBeforeDrag.left, positionBeforeDrag.top)
                .move(dragCase.left, dragCase.top);

            const positionAfterDrag = translator.locate(appointment);

            pointer
                .up();

            assert.equal(positionAfterDrag.left - positionBeforeDrag.left, dragCase.left,
                `appointment '${text}' should have correct left position in ${viewName} and rtlEnabled=${rtlEnabled}`);
            assert.equal(positionAfterDrag.top - positionBeforeDrag.top, dragCase.top,
                `appointment '${text}' should have correct top position in ${viewName} and rtlEnabled=${rtlEnabled}`);
        };

        const testViews = (views, assert) => {
            const scheduler = createScheduler(views);

            views.forEach(view => {
                scheduler.option("currentView", view.name);

                [false, true].forEach(rtlEnabled => {
                    let items = $.extend(true, [], data);
                    scheduler.option("rtlEnabled", rtlEnabled);
                    scheduler.option("dataSource", items);

                    dragCases.forEach(dragCase =>
                        items.forEach(({ text }) => testAppointmentPosition(scheduler, text, rtlEnabled, dragCase, view.name, assert))
                    );
                });
            });
        };

        test("in common views", assert => testViews(commonViews, assert));
        test("in time line views", assert => testViews(timeLineViews, assert));
        test("in group views", assert => testViews(groupViews, assert));
    });

    test("DropDownAppointment shouldn't be draggable if editing.allowDragging is false", function(assert) {
        const tasks = [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: "Task 2",
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            },
            {
                text: "Task 3",
                startDate: new Date(2015, 1, 9, 13, 0),
                endDate: new Date(2015, 1, 9, 14, 0)
            }
        ];

        const scheduler = createWrapper({
            editing: {
                allowDragging: false
            },
            height: 600,
            views: ["month"],
            currentView: "month",
            dataSource: tasks,
            currentDate: new Date(2015, 1, 9)
        });

        scheduler.appointments.compact.click();

        const appointment = scheduler.tooltip.getItemElement();
        const renderStub = sinon.stub(scheduler.instance.getAppointmentsInstance(), "_renderItem");

        appointment.trigger("dxdragstart");

        assert.notOk(renderStub.calledOnce, "Phanton item was not rendered");
    });

    test("Phantom appointment should have correct template", function(assert) {
        const scheduler = createWrapper({
            editing: true,
            height: 600,
            views: [{ type: "timelineDay", maxAppointmentsPerCell: 1 }],
            currentView: "timelineDay",
            dataSource: [{
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: "Task 2",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            }],
            currentDate: new Date(2015, 1, 9)
        });

        const pointer = pointerMock(scheduler.tooltip.getItemElement())
            .start()
            .dragStart();

        const phantomAppointment = scheduler.appointments.getAppointment();

        assert.equal(phantomAppointment.find(".dx-scheduler-appointment-content-date").eq(0).text(), "1:00 AM", "Appointment start is correct");
        assert.equal(phantomAppointment.find(".dx-scheduler-appointment-content-date").eq(2).text(), "2:00 AM", "Appointment edn is correct");

        pointer.dragEnd();
    });

    QUnit.test("Appointment should move to the first cell from tooltip case", function(assert) {
        const scheduler = createWrapper({
            editing: true,
            height: 600,
            views: [{ type: "month", maxAppointmentsPerCell: 1 }],
            currentView: "month",
            dataSource: [{
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: "Task 2",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            }],
            currentDate: new Date(2015, 1, 9)
        });

        scheduler.appointments.compact.click(0);
        const compactAppointment = scheduler.appointments.compact.getAppointment();
        const compactAppointmentOffset = $(compactAppointment).offset();

        pointerMock(compactAppointment).start().down(compactAppointmentOffset.left, compactAppointmentOffset.top).move(0, -100).up();

        const data = scheduler.instance.option("dataSource")[1];
        assert.deepEqual(data.startDate, new Date(2015, 1, 1, 1), "start date is correct");
        assert.deepEqual(data.endDate, new Date(2015, 1, 1, 2), "end date is correct");
    });
});
