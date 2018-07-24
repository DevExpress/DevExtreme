"use strict";

var $ = require("jquery"),
    themes = require("ui/themes"),
    dateLocalization = require("localization/date");

QUnit.testStart(function() {
    $("#qunit-fixture").html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

require("common.css!");
require("generic_light.css!");


var $ = require("jquery"),
    eventsEngine = require("events/core/events_engine"),
    renderer = require("core/renderer"),
    fx = require("animation/fx"),
    pointerMock = require("../../helpers/pointerMock.js"),
    dragEvents = require("events/drag"),
    CustomStore = require("data/custom_store"),
    dateLocalization = require("localization/date"),
    isRenderer = require("core/utils/type").isRenderer,
    config = require("core/config");

require("ui/scheduler/ui.scheduler");

var DATE_TABLE_CELL_BORDER = 1;

QUnit.module("Integration: Work space", {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler($.extend(options, { maxAppointmentsPerCell: null })).dxScheduler("instance");
        };
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("Scheduler should have a right work space", function(assert) {
    this.createInstance({
        views: ["day", "week"],
        currentView: "day"
    });
    var $element = this.instance.$element();

    assert.ok($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance"), "Work space is day on init");

    this.instance.option("currentView", "week");

    assert.ok($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceWeek("instance"), "Work space is week after change option ");
});

QUnit.test("Work space should have correct currentDate option", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 0, 28)
    });
    var $element = this.instance.$element();

    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance").option("currentDate"), new Date(2015, 0, 28), "Work space has a right currentDate option");

    this.instance.option("currentDate", new Date(2015, 1, 28));

    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance").option("currentDate"), new Date(2015, 1, 28), "Work space has a right currentDate option");
});


QUnit.test("Work space should have correct min option", function(assert) {
    this.createInstance({
        min: new Date(2015, 0, 28)
    });
    var $element = this.instance.$element();

    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance").option("min"), new Date(2015, 0, 28), "Work space has a right currentDate option");

    this.instance.option("min", new Date(2015, 1, 28));

    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance").option("min"), new Date(2015, 1, 28), "Work space has a right currentDate option");
});

QUnit.test("Work space should have correct max option", function(assert) {
    this.createInstance({
        max: new Date(2015, 0, 28)
    });
    var $element = this.instance.$element();

    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance").option("max"), new Date(2015, 0, 28), "Work space has a right currentDate option");

    this.instance.option("max", new Date(2015, 1, 28));

    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance").option("max"), new Date(2015, 1, 28), "Work space has a right currentDate option");
});

QUnit.test("Work space should have correct firstDayOfWeek option", function(assert) {
    this.createInstance({
        currentView: "week",
        firstDayOfWeek: 2
    });
    var $element = this.instance.$element();

    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceWeek("instance").option("firstDayOfWeek"), 2, "Work space has a right first day of week");

    this.instance.option("firstDayOfWeek", 1);

    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceWeek("instance").option("firstDayOfWeek"), 1, "Work space has a right first day of week");
});

QUnit.test("Scheduler work space should have a single type class", function(assert) {
    this.createInstance({
        currentView: "week",
        firstDayOfWeek: 2,
        views: ["day", "week", "workWeek", "month"]
    });

    var $element = this.instance.$element();

    var check = function(className) {
        var checked = true;
        $.each([
            "dx-scheduler-work-space-day",
            "dx-scheduler-work-space-week",
            "dx-scheduler-work-space-work-week",
            "dx-scheduler-work-space-month"
        ], function(_, item) {
            if(className === item) {
                checked = checked && $element.find("." + className).length === 1;
            } else {
                checked = checked && (!$element.find("." + item).length);
            }
        });

        return checked;
    };

    this.instance.option("currentView", "day");
    assert.ok(check("dx-scheduler-work-space-day"), "Work space has a right type class");

    this.instance.option("currentView", "week");
    assert.ok(check("dx-scheduler-work-space-week"), "Work space has a right type class");

    this.instance.option("currentView", "workWeek");
    assert.ok(check("dx-scheduler-work-space-work-week"), "Work space has a right type class");

    this.instance.option("currentView", "month");
    assert.ok(check("dx-scheduler-work-space-month"), "Work space has a right type class");
});

QUnit.test("Pointer down on workspace cell should focus cell", function(assert) {
    this.createInstance({ currentDate: new Date(2015, 1, 10) });

    var $firstCell = $(this.instance.$element()).find(".dx-scheduler-date-table td").eq(0),
        $otherCell = $(this.instance.$element()).find(".dx-scheduler-date-table td").eq(1);

    $firstCell.trigger("dxpointerdown");

    assert.ok($firstCell.hasClass("dx-state-focused"), "first cell was focused after first pointerdown");

    $otherCell.trigger("dxpointerdown");

    assert.ok(!$firstCell.hasClass("dx-state-focused"), "first cell is not focused");
    assert.ok($otherCell.hasClass("dx-state-focused"), "other cell is focused");
});

QUnit.test("Double click on workspace cell should call scheduler.showAppointmentPopup method in day view", function(assert) {
    this.createInstance({ currentDate: new Date(2015, 1, 10) });
    var spy = sinon.spy();
    var showAppointmentPopup = this.instance.showAppointmentPopup;
    this.instance.showAppointmentPopup = spy;
    try {

        pointerMock(this.instance.$element().find(".dx-scheduler-all-day-table-cell").first()).start().click().click();

        assert.ok(spy.calledOnce, "showAppointmentPopup is called");
        assert.deepEqual(spy.getCall(0).args[0], {
            startDate: new Date(2015, 1, 10, 0, 0),
            endDate: new Date(2015, 1, 11, 0, 0),
            allDay: true
        }, "showAppointmentPopup has a right arguments");
        assert.ok(spy.calledOn(this.instance), "showAppointmentPopup has a right context");

        pointerMock(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(3)).start().click().click();
        assert.deepEqual(spy.getCall(1).args[0], {
            startDate: new Date(2015, 1, 10, 1, 30),
            endDate: new Date(2015, 1, 10, 2, 0),
            allDay: false
        }, "showAppointmentPopup has a right arguments");

    } finally {
        this.instance.showAppointmentPopup = showAppointmentPopup;
    }
});

QUnit.test("Double click on works space cell should call scheduler.showAppointmentPopup method in week view", function(assert) {
    this.createInstance({ currentDate: new Date(2015, 1, 9), currentView: "week", firstDayOfWeek: 1 });
    var spy = sinon.spy();
    var showAppointmentPopup = this.instance.showAppointmentPopup;
    this.instance.showAppointmentPopup = spy;
    try {

        pointerMock(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(22)).start().click().click();
        assert.deepEqual(spy.getCall(0).args[0], {
            startDate: new Date(2015, 1, 10, 1, 30),
            endDate: new Date(2015, 1, 10, 2, 0),
            allDay: false
        }, "showAppointmentPopup has a right arguments");

    } finally {
        this.instance.showAppointmentPopup = showAppointmentPopup;
    }
});

QUnit.test("Double click on work space cell should call scheduler.showAppointmentPopup method in month view", function(assert) {
    this.createInstance({ currentDate: new Date(2015, 1, 9), currentView: "month", firstDayOfWeek: 1 });
    var spy = sinon.spy();
    var showAppointmentPopup = this.instance.showAppointmentPopup;
    this.instance.showAppointmentPopup = spy;
    try {

        pointerMock(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(22)).start().click().click();
        assert.deepEqual(spy.getCall(0).args[0], {
            startDate: new Date(2015, 1, 17),
            endDate: new Date(2015, 1, 18)
        }, "showAppointmentPopup has a right arguments");

    } finally {
        this.instance.showAppointmentPopup = showAppointmentPopup;
    }
});

QUnit.test("scheduler.showAppointmentPopup method should have resource arg if there is some resource", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        firstDayOfWeek: 1,
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "John" },
                    { id: 2, text: "Mike" }
                ]
            }
        ]
    });
    var spy = sinon.spy();
    var showAppointmentPopup = this.instance.showAppointmentPopup;
    this.instance.showAppointmentPopup = spy;
    try {
        pointerMock(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(24)).start().click().click();
        assert.deepEqual(spy.getCall(0).args[0], {
            startDate: new Date(2015, 1, 12, 0, 30),
            endDate: new Date(2015, 1, 12, 1),
            ownerId: 2,
            allDay: false
        }, "showAppointmentPopup has a right arguments");

    } finally {
        this.instance.showAppointmentPopup = showAppointmentPopup;
    }
});

QUnit.test("scheduler.showAppointmentPopup method should have resource arg if there is some resource and view is month", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: "month",
        firstDayOfWeek: 1,
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "John" },
                    { id: 2, text: "Mike" }
                ]
            }
        ]
    });
    var spy = sinon.spy();
    var showAppointmentPopup = this.instance.showAppointmentPopup;
    this.instance.showAppointmentPopup = spy;
    try {

        pointerMock(this.instance.$element().find(".dx-scheduler-date-table-cell").eq(22)).start().click().click();
        assert.deepEqual(spy.getCall(0).args[0], {
            startDate: new Date(2015, 1, 3),
            endDate: new Date(2015, 1, 4),
            ownerId: 2
        }, "showAppointmentPopup has a right arguments");

    } finally {
        this.instance.showAppointmentPopup = showAppointmentPopup;
    }
});

QUnit.test("WorkSpace should have a correct 'groups' option", function(assert) {
    this.createInstance({
        groups: ["resource1"],
        resources: [
            {
                displayExpr: "name",
                valueExpr: "key",
                field: "resource1",
                dataSource: [
                    { key: 1, name: "One" },
                    { key: 2, name: "Two" }
                ]
            },
            {
                field: "resource2",
                dataSource: [
                    { id: 1, text: "Room 1" }
                ]
            }
        ]
    });

    var workSpace = this.instance.$element().find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance");

    assert.deepEqual(workSpace.option("groups"),
        [
            {
                name: "resource1",
                items: [
                    { id: 1, text: "One" },
                    { id: 2, text: "Two" }
                ],
                data: [
                    { key: 1, name: "One" },
                    { key: 2, name: "Two" }
                ]
            }
        ],
        "Groups are OK");

    this.instance.option("groups", ["resource2"]);

    workSpace = this.instance.$element().find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance");
    assert.deepEqual(workSpace.option("groups"),
        [
            {
                name: "resource2",
                items: [
                    { id: 1, text: "Room 1" }
                ],
                data: [
                    { id: 1, text: "Room 1" }
                ]
            }
        ],
        "Groups are OK");
});

QUnit.test("WorkSpace should have a correct 'startDayHour' option", function(assert) {
    this.createInstance({
        startDayHour: 1
    });

    var workSpace = this.instance.$element().find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance");

    assert.equal(workSpace.option("startDayHour"), 1, "Start day hour is OK on init");

    this.instance.option("startDayHour", 5);
    assert.equal(workSpace.option("startDayHour"), 5, "Start day hour is OK if option is changed");
});

QUnit.test("WorkSpace should have a correct 'endDayHour' option", function(assert) {
    this.createInstance({
        endDayHour: 10
    });

    var workSpace = this.instance.$element().find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance");

    assert.equal(workSpace.option("endDayHour"), 10, "End day hour is OK on init");

    this.instance.option("endDayHour", 12);
    assert.equal(workSpace.option("endDayHour"), 12, "End day hour is OK if option is changed");
});

QUnit.test("drop and dragenter handlers should be different for date table and allDay table, T245137", function(assert) {
    var guid = 0;
    var log = {};

    log[dragEvents.drop] = {};
    log[dragEvents.enter] = {};

    var onSpy = sinon.spy(eventsEngine, "on");

    this.createInstance();

    onSpy.getCalls().forEach(function(spyCall) {
        var $element = $(spyCall.args[0]);
        var eventName = spyCall.args[1];
        var logByEvent = log[eventName.split(".")[0]];

        if(!logByEvent) {
            return;
        }

        if($element.hasClass("dx-scheduler-date-table")) {
            logByEvent["dateTable"] = guid++;
        }
        if($element.hasClass("dx-scheduler-all-day-table")) {
            logByEvent["allDayTable"] = guid++;
        }
    });

    assert.ok(log[dragEvents.drop].allDayTable > log[dragEvents.drop].dateTable, "AllDay drop handler was created after dateTable drop handler");
    assert.ok(log[dragEvents.enter].allDayTable > log[dragEvents.enter].dateTable, "AllDay dragenter handler was created after dateTable dragenter handler");

    eventsEngine.on.restore();
});

QUnit.test("event handlers should be reattached after changing allDayExpanded", function(assert) {
    var onSpy = sinon.spy(eventsEngine, "on").withArgs(sinon.match(function(element) {
        return $(element).hasClass("dx-scheduler-date-table");
    }), sinon.match(function(eventName) {
        eventName = eventName.split(".")[0];
        return eventName === dragEvents.drop;
    }));

    this.createInstance();

    var previousSubscriptionsLength = onSpy.callCount;

    this.instance.getWorkSpace().option("allDayExpanded", true);

    assert.ok(onSpy.callCount > previousSubscriptionsLength, "Events were reattached");

    eventsEngine.on.restore();
});

QUnit.test("Work space should have right all-day-collapsed class on init", function(assert) {
    this.createInstance({
        showAllDayPanel: true,
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 7),
            endDate: new Date(2015, 1, 9, 8),
        }]
    });
    var $element = this.instance.$element(),
        $workSpace = $element.find(".dx-scheduler-work-space");

    assert.ok($workSpace.hasClass("dx-scheduler-work-space-all-day-collapsed"), "Work-space has right class");

    this.instance.option("dataSource", [{
        text: "a",
        startDate: new Date(2015, 1, 9, 7),
        endDate: new Date(2015, 1, 9, 7, 30),
        allDay: true
    }]);

    assert.notOk($workSpace.hasClass("dx-scheduler-work-space-all-day-collapsed"), "Work-space has not 'all-day-expanded' class");
});

QUnit.test("Work space should have right showAllDayPanel option value", function(assert) {
    this.createInstance({
        showAllDayPanel: false
    });
    var $element = this.instance.$element(),
        $workSpace = $element.find(".dx-scheduler-work-space");

    assert.deepEqual($workSpace.dxSchedulerWorkSpaceDay("instance").option("showAllDayPanel"), false, "Work space has a right allDay visibility");

    this.instance.option("showAllDayPanel", true);

    assert.deepEqual($workSpace.dxSchedulerWorkSpaceDay("instance").option("showAllDayPanel"), true, "Work space has a right allDay visibility");
});

QUnit.test("Work space 'allDayExpanded' option value when 'showAllDayPanel' = true", function(assert) {
    this.createInstance({
        showAllDayPanel: true,
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 7),
            endDate: new Date(2015, 1, 9, 7, 30),
            allDay: true
        }]
    });

    var $element = this.instance.$element();

    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceWeek("instance").option("allDayExpanded"), true, "Work space has a right allDay visibility");

    this.instance.option("dataSource", [{
        text: "a",
        startDate: new Date(2015, 1, 9, 7),
        endDate: new Date(2015, 1, 9, 9),
        allDay: false
    }]);

    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceWeek("instance").option("allDayExpanded"), false, "Work space has a right allDay visibility");
});

QUnit.test("Work space 'allDayExpanded' option value should be correct after changing view", function(assert) {
    this.createInstance({
        showAllDayPanel: true,
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 10, 7),
            endDate: new Date(2015, 1, 10, 7, 30),
            allDay: true
        }]
    });

    var $element = this.instance.$element();

    this.instance.option("currentView", "day");
    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance").option("allDayExpanded"), false, "Work space has a right allDay visibility");

    this.instance.option("currentView", "week");
    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceWeek("instance").option("allDayExpanded"), true, "Work space has a right allDay visibility");
});

QUnit.test("Work space 'allDayExpanded' option value should be correct after changing currentDate", function(assert) {
    this.createInstance({
        showAllDayPanel: true,
        currentDate: new Date(2015, 1, 9),
        currentView: "day",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9),
            endDate: new Date(2015, 1, 9, 0, 30),
            allDay: true
        }]
    });

    var $element = this.instance.$element();

    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance").option("allDayExpanded"), true, "Work space has a right allDay visibility");

    this.instance.option("currentDate", new Date(2015, 1, 10));
    assert.deepEqual($element.find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance").option("allDayExpanded"), false, "Work space has a right allDay visibility");
});

QUnit.test("Work space 'allDayExpanded' option value should be correct after deleting last allDay appointment", function(assert) {
    var appointment = {
        text: "a",
        startDate: new Date(2015, 1, 10, 7),
        allDay: true
    };

    this.createInstance({
        showAllDayPanel: true,
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        dataSource: [appointment]
    });

    this.instance.deleteAppointment(appointment);

    assert.deepEqual(this.instance.$element().find(".dx-scheduler-work-space").dxSchedulerWorkSpaceWeek("instance").option("allDayExpanded"), false, "Work space has correct allDay visibility");
});

QUnit.test("Work space 'allDayExpanded' option should depend on client-side filtered appointments", function(assert) {
    var appointment = {
        text: "All-day",
        startDate: new Date(2015, 2, 4),
        endDate: new Date(2015, 2, 5),
        allDay: true,
        recurrenceRule: "FREQ=DAILY"
    };

    this.createInstance({
        showAllDayPanel: true,
        currentView: 'day',
        startDayHour: 3,
        endDayHour: 10,
        currentDate: new Date(2015, 2, 3),
        firstDayOfWeek: 1,
        dataSource: [appointment]
    });

    assert.deepEqual(this.instance.$element().find(".dx-scheduler-work-space").dxSchedulerWorkSpaceDay("instance").option("allDayExpanded"), false, "Work space has correct allDay visibility");
});

QUnit.test("Cell data should be applied when resources are loaded", function(assert) {
    var done = assert.async();
    this.createInstance({
        currentView: "day",
        groups: ["owner"],
        resources: [
            {
                fieldExpr: "owner",
                dataSource: new CustomStore({
                    load: function() {
                        var d = $.Deferred();
                        setTimeout(function() {
                            d.resolve([{ id: 1 }]);
                        }, 300);
                        return d.promise();
                    }
                })
            }
        ],
        dataSource: [],
        onContentReady: function(e) {
            var groups = e.component.$element().find(".dx-scheduler-date-table-cell").data("dxCellData").groups;
            assert.deepEqual(groups, { owner: 1 });
            done();
        }
    });


});

QUnit.test("Cell data should be updated after view changing", function(assert) {
    this.createInstance({
        views: ["day", "week"],
        currentView: "day",
        dataSource: [{
            text: "test",
            startDate: new Date(2016, 8, 5, 1),
            endDate: new Date(2016, 8, 5, 1),
        }],
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0
    });

    this.instance.option("currentView", "week");

    var workSpace = this.instance.getWorkSpace();
    assert.deepEqual(workSpace.getCellDataByCoordinates({
        top: 10,
        left: 100,
    }), {
        allDay: false,
        startDate: new Date(2016, 8, 4),
        endDate: new Date(2016, 8, 4, 0, 30)
    }, "Cell data is OK!");


});

QUnit.test("Appointments in month view should be sorted same as in all-day section", function(assert) {
    var items = [{
        text: "1",
        startDate: new Date(2016, 1, 11, 13, 0),
        endDate: new Date(2016, 1, 10, 14, 0),
        allDay: true
    }, {
        text: "2",
        startDate: new Date(2016, 1, 11, 12, 0),
        endDate: new Date(2016, 1, 10, 13, 0),
        allDay: true
    }, {
        text: "3",
        startDate: new Date(2016, 1, 11, 11, 0),
        endDate: new Date(2016, 1, 10, 12, 0),
        allDay: true
    }];
    this.createInstance({
        dataSource: items,
        currentDate: new Date(2016, 1, 11),
        currentView: "week"
    });

    var allDayAppointments = this.instance.$element().find(".dx-scheduler-appointment"),
        i;

    for(i = 0; i < 3; i++) {
        assert.deepEqual(allDayAppointments.eq(i).data("dxItemData"), items[i], "Order is right");
    }

    this.instance.option("currentView", "month");

    var monthAppointments = this.instance.$element().find(".dx-scheduler-appointment");
    for(i = 0; i < 3; i++) {
        assert.deepEqual(monthAppointments.eq(i).data("dxItemData"), items[i], "Order is right");
    }
});

QUnit.test("Data cell should has right content when used dataCellTemplate option", function(assert) {
    this.createInstance({
        currentView: "week",
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        dataCellTemplate: function(itemData, index, container) {
            $(container).addClass("custom-cell-class");
        }
    });

    var $element = this.instance.$element();

    assert.ok($element.find(".custom-cell-class").length > 0, "class is ok");
});

QUnit.test("Data cell should has right content when dataCellTemplate option was change", function(assert) {
    this.createInstance({
        currentView: "week",
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        dataCellTemplate: function(itemData, index, container) {
            $(container).addClass("custom-cell-class");
        }
    });

    var $element = this.instance.$element();

    assert.ok($element.find(".custom-cell-class").length > 0, "class before option changing is ok");

    this.instance.option("dataCellTemplate", function(itemData, index, container) {
        $(container).addClass("new-custom-class");
    });

    assert.ok($element.find(".new-custom-class").length > 0, "class is ok");
});

QUnit.test("dataCellTemplate should have correct options", function(assert) {
    var templateOptions;

    this.createInstance({
        currentView: "week",
        startDayHour: 5,
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "John" },
                    { id: 2, text: "Mike" }
                ]
            }
        ],
        dataCellTemplate: function(itemData, index, $container) {
            if(index === 3 && $($container).hasClass("dx-scheduler-date-table-cell")) templateOptions = itemData;
        }
    });

    assert.equal(templateOptions.text, "", "text options is ok");
    assert.equal(templateOptions.startDate.getTime(), new Date(2016, 8, 7, 5).getTime(), "startDate option is ok");
    assert.equal(templateOptions.endDate.getTime(), new Date(2016, 8, 7, 5, 30).getTime(), "endDate option is ok");
    assert.deepEqual(templateOptions.groups, {
        "ownerId": 1
    }, "Resources option is ok");
});

QUnit.test("dataCellTemplate should take cellElement with correct geometry(T453520)", function(assert) {
    assert.expect(2);
    this.createInstance({
        currentView: "week",
        views: ["week"],
        height: 700,
        width: 700,
        dataSource: [],
        dataCellTemplate: function(cellData, cellIndex, cellElement) {
            if(!cellData.allDay && !cellIndex) {
                assert.roughEqual($(cellElement).get(0).getBoundingClientRect().width, 85, 1.001, "Data cell width is OK");
                assert.equal($(cellElement).get(0).getBoundingClientRect().height, 50, "Data cell height is OK");
            }
        }
    });
});

QUnit.test("dataCellTemplate for all-day panel should take cellElement with correct geometry(T453520)", function(assert) {
    assert.expect(2);
    this.createInstance({
        currentView: "week",
        views: ["week"],
        height: 700,
        width: 700,
        dataSource: [],
        dataCellTemplate: function(cellData, cellIndex, cellElement) {
            if(cellData.allDay && !cellIndex) {
                assert.roughEqual($(cellElement).outerWidth(), 85, 1.001, "Data cell width is OK");
                assert.roughEqual($(cellElement).outerHeight(), 24, 1.001, "Data cell height is OK");
            }
        }
    });
});

QUnit.test("dateCellTemplate should take cellElement with correct geometry(T453520)", function(assert) {
    assert.expect(3);
    this.createInstance({
        currentView: "week",
        views: ["week"],
        height: 700,
        width: 700,
        dataSource: [],
        dateCellTemplate: function(cellData, cellIndex, cellElement) {
            if(!cellIndex) {
                assert.equal(isRenderer(cellElement), !!config().useJQuery, "element is correct");
                assert.roughEqual($(cellElement).outerWidth(), 85, 1.001, "Date cell width is OK");
                assert.equal($(cellElement).outerHeight(), 40, "Date cell height is OK");
            }
        }
    });
});

QUnit.test("timeCellTemplate should take cellElement with correct geometry(T453520)", function(assert) {
    assert.expect(3);

    this.createInstance({
        currentView: "week",
        views: ["week"],
        height: 700,
        width: 700,
        dataSource: [],
        timeCellTemplate: function(cellData, cellIndex, cellElement) {
            if(!cellIndex) {
                assert.equal(isRenderer(cellElement), !!config().useJQuery, "element is correct");
                assert.equal($(cellElement).get(0).getBoundingClientRect().height, 50, "Time cell height is OK");
                assert.equal($(cellElement).outerWidth(), 100, "Time cell width is OK");
            }
        }
    });
});

QUnit.test("resourceCellTemplate should take cellElement with correct geometry(T453520)", function(assert) {
    assert.expect(3);
    this.createInstance({
        currentView: "week",
        views: ["week"],
        height: 700,
        width: 700,
        dataSource: [],
        groups: ["owner"],
        resources: [{
            field: "owner",
            dataSource: ["a", "b"]
        }],
        resourceCellTemplate: function(cellData, cellIndex, cellElement) {
            if(!cellIndex) {
                assert.equal(isRenderer(cellElement), !!config().useJQuery, "element is correct");
                var $cell = $(cellElement).parent();
                assert.roughEqual($cell.outerWidth(), 299, 1.001, "Resource cell width is OK");
                assert.equal($cell.outerHeight(), 30, "Resource cell height is OK");
            }
        }
    });
});

QUnit.test("resourceCellTemplate should take cellElement with correct geometry in timeline (T453520)", function(assert) {
    assert.expect(2);
    this.createInstance({
        currentView: "timelineWeek",
        views: ["timelineWeek"],
        height: 700,
        width: 700,
        dataSource: [],
        groups: ["owner"],
        resources: [{
            field: "owner",
            dataSource: ["a", "b"]
        }],
        resourceCellTemplate: function(cellData, cellIndex, cellElement) {
            if(!cellIndex) {
                var $cell = $(cellElement).parent();
                assert.equal($cell.outerWidth(), 99, "Resource cell width is OK");
                assert.roughEqual($cell.outerHeight(), 275, 1.001, "Resource cell height is OK");
            }
        }
    });
});

QUnit.test("timeCellTemplate should have correct options", function(assert) {
    var templateOptions;

    this.createInstance({
        currentView: "week",
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        timeCellTemplate: function(itemData, index, $container) {
            if(index === 6) {
                templateOptions = itemData;
            }
        }
    });

    assert.equal(templateOptions.text, "3:00 AM", "text options is ok");
});

QUnit.test("resourceCellTemplate should have correct options", function(assert) {
    var templateOptions;

    this.createInstance({
        currentView: "week",
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "John" },
                    { id: 2, text: "Mike" }
                ]
            }
        ],
        resourceCellTemplate: function(itemData, index, $container) {
            if(index === 0) {
                templateOptions = itemData;
            }
        }
    });

    assert.equal(templateOptions.id, 1, "id option is OK");
    assert.equal(templateOptions.text, "John", "text option is OK");
    assert.deepEqual(templateOptions.data, { text: "John", id: 1 }, "data option is OK");
});

QUnit.test("resourceCellTemplate should work correct in timeline view", function(assert) {
    this.createInstance({
        currentView: "timelineWeek",
        currentDate: new Date(2016, 8, 5),
        firstDayOfWeek: 0,
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "John" },
                    { id: 2, text: "Mike" }
                ]
            }
        ],
        resourceCellTemplate: function(itemData, index, container) {
            if(index === 0) {
                $(container).addClass("custom-group-cell-class");
            }
        }
    });

    var $cell1 = this.instance.$element().find(".dx-scheduler-group-header-content").eq(0),
        $cell2 = this.instance.$element().find(".dx-scheduler-group-header-content").eq(1);

    assert.ok($cell1.hasClass("custom-group-cell-class"), "first cell has right class");
    assert.notOk($cell2.hasClass("custom-group-cell-class"), "second cell has no class");
});

QUnit.test("resourceCellTemplate should work correct in agenda view", function(assert) {
    this.createInstance({
        views: ["agenda"],
        currentView: "agenda",
        currentDate: new Date(2016, 8, 5),
        dataSource: [{
            text: "a",
            ownerId: 1,
            startDate: new Date(2016, 8, 5, 7),
            endDate: new Date(2016, 8, 5, 8),
        },
        {
            text: "b",
            ownerId: 2,
            startDate: new Date(2016, 8, 5, 10),
            endDate: new Date(2016, 8, 5, 11),
        }],
        firstDayOfWeek: 0,
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "John" },
                    { id: 2, text: "Mike" }
                ]
            }
        ],
        resourceCellTemplate: function(itemData, index, container) {
            if(index === 0) {
                $(container).addClass("custom-group-cell-class");
            }

            return $("<div />").text(itemData.text);
        }
    });

    var $cell1 = this.instance.$element().find(".dx-scheduler-group-header-content").eq(0),
        $cell2 = this.instance.$element().find(".dx-scheduler-group-header-content").eq(1);

    assert.ok($cell1.hasClass("custom-group-cell-class"), "first cell has right class");
    assert.notOk($cell2.hasClass("custom-group-cell-class"), "second cell has no class");
});

QUnit.test("dateCellTemplate should work correctly", function(assert) {
    this.createInstance({
        views: ["month"],
        currentView: "month",
        currentDate: new Date(2016, 8, 5),
        dataSource: [],
        firstDayOfWeek: 0,
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "John" },
                    { id: 2, text: "Mike" }
                ]
            }
        ],
        dateCellTemplate: function(itemData, index, container) {
            if(index === 0) {
                $(container).addClass("custom-group-cell-class");
            }
        }
    });

    var $cell1 = this.instance.$element().find(".dx-scheduler-header-panel-cell").eq(0),
        $cell2 = this.instance.$element().find(".dx-scheduler-header-panel-cell").eq(1);

    assert.ok($cell1.hasClass("custom-group-cell-class"), "first cell has right class");
    assert.notOk($cell2.hasClass("custom-group-cell-class"), "second cell has no class");
});

QUnit.test("dateCellTemplate should work correctly in workWeek view", function(assert) {
    var dayOfWeekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    this.createInstance({
        views: ["workWeek"],
        currentView: "workWeek",
        currentDate: new Date(2016, 8, 5),
        dataSource: [],
        startDayHour: 7,
        endDayHour: 23,
        dateCellTemplate: function(cellData, index, container) {
            $(container).append(
                $("<div />")
                    .addClass("name")
                    .text(dayOfWeekNames[cellData.date.getDay()]),
                $("<div />")
                    .addClass("number")
                    .text(cellData.date.getDate())
            );
        },
    });

    var $headerPanel = this.instance.$element().find(".dx-scheduler-header-panel");

    assert.ok($headerPanel.text(), "Mon5Tue6Wed7Thu8Fri9");
});

QUnit.test("dateCellTemplate should work correctly in agenda view", function(assert) {
    this.createInstance({
        views: ["agenda"],
        currentView: "agenda",
        currentDate: new Date(2016, 8, 5),
        dataSource: [{
            text: "a",
            ownerId: 1,
            startDate: new Date(2016, 8, 5, 7),
            endDate: new Date(2016, 8, 5, 8),
        },
        {
            text: "b",
            ownerId: 2,
            startDate: new Date(2016, 8, 5, 10),
            endDate: new Date(2016, 8, 5, 11),
        }],
        firstDayOfWeek: 0,
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "John" },
                    { id: 2, text: "Mike" }
                ]
            }
        ],
        dateCellTemplate: function(itemData, index, container) {
            if(index === 0) {
                $(container).addClass("custom-group-cell-class");
            }
        }
    });

    var $cell1 = this.instance.$element().find(".dx-scheduler-time-panel-cell").eq(0),
        $cell2 = this.instance.$element().find(".dx-scheduler-time-panel-cell").eq(1);

    assert.ok($cell1.hasClass("custom-group-cell-class"), "first cell has right class");
    assert.notOk($cell2.hasClass("custom-group-cell-class"), "second cell has no class");
});

QUnit.test("dateCellTemplate should have correct options", function(assert) {
    var templateOptions;

    this.createInstance({
        currentView: "month",
        currentDate: new Date(2016, 8, 5),
        dateCellTemplate: function(itemData, index, $container) {
            if(index === 0) {
                templateOptions = itemData;
            }
        }
    });

    assert.equal(templateOptions.text, "Sun", "text option is ok");
    assert.deepEqual(templateOptions.date.getTime(), new Date(2016, 7, 28).getTime(), "date option is ok");
});

QUnit.test("dateCellTemplate should have correct options in agenda view", function(assert) {
    var templateOptions;

    this.createInstance({
        views: ["agenda"],
        currentView: "agenda",
        currentDate: new Date(2016, 8, 5),
        dataSource: [{
            text: "a",
            ownerId: 1,
            startDate: new Date(2016, 8, 5, 7),
            endDate: new Date(2016, 8, 5, 8),
        },
        {
            text: "b",
            ownerId: 2,
            startDate: new Date(2016, 8, 5, 10),
            endDate: new Date(2016, 8, 5, 11),
        }],
        firstDayOfWeek: 0,
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "John" },
                    { id: 2, text: "Mike" }
                ]
            }
        ],
        dateCellTemplate: function(itemData, index, $container) {
            if(index === 0) {
                templateOptions = itemData;
            }
        }
    });

    assert.equal(templateOptions.text, "5 Mon", "text option is ok");
    assert.equal(templateOptions.date.getTime(), new Date(2016, 8, 5).getTime(), "date option is ok");
    assert.deepEqual(templateOptions.groups, { "ownerId": 1 }, "groups option is ok");

});


QUnit.test("Agenda has right arguments in resourceCellTemplate arguments", function(assert) {
    var params;

    this.createInstance({
        views: ["agenda"],
        currentView: "agenda",
        currentDate: new Date(2016, 8, 5),
        groups: ["ownerId"],
        dataSource: [{
            text: "a",
            ownerId: 1,
            startDate: new Date(2016, 8, 5, 7),
            endDate: new Date(2016, 8, 5, 8),
        },
        {
            text: "b",
            ownerId: 2,
            startDate: new Date(2016, 8, 5, 10),
            endDate: new Date(2016, 8, 5, 11),
        }],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "John", color: "#A2a" },
                    { id: 2, text: "Mike", color: "#E2a" }
                ]
            }
        ],
        resourceCellTemplate: function(itemData, index, $container) {
            if(!index) params = itemData.data;
        }
    });

    assert.deepEqual(params, { id: 1, text: "John", color: "#A2a" }, "Cell text is OK");
});


QUnit.test("workSpace recalculation after render cellTemplates", function(assert) {
    this.createInstance({
        currentView: "month",
        currentDate: new Date(2016, 8, 5),
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "John" },
                    { id: 2, text: "Mike" }
                ]
            }
        ],
        resourceCellTemplate: function(itemData, index, $container) {
            return $("<div>").css({ height: "150px" });
        }
    });

    var schedulerHeaderHeight = parseInt(this.instance.$element().find(".dx-scheduler-header").outerHeight(true), 10),
        schedulerHeaderPanelHeight = parseInt(this.instance.$element().find(".dx-scheduler-header-panel").outerHeight(true), 10),
        $allDayTitle = this.instance.$element().find(".dx-scheduler-all-day-title"),
        $dateTableScrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable");

    assert.equal(parseInt($allDayTitle.css("top"), 10), schedulerHeaderHeight + schedulerHeaderPanelHeight, "All day title element top value");
    assert.equal(parseInt($dateTableScrollable.css("paddingBottom"), 10), schedulerHeaderPanelHeight, "dateTableScrollable element padding bottom");
    assert.equal(parseInt($dateTableScrollable.css("marginBottom"), 10), -schedulerHeaderPanelHeight, "dateTableScrollable element margin bottom");
});

QUnit.test("WorkSpace recalculation works fine after render resourceCellTemplate if workspace has allDay appointment", function(assert) {
    this.createInstance({
        currentView: "week",
        currentDate: new Date(2016, 8, 5),
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "John" },
                    { id: 2, text: "Mike" }
                ]
            }
        ],
        dataSource: [{
            text: "a",
            ownerId: 1,
            startDate: new Date(2016, 8, 5, 7),
            endDate: new Date(2016, 8, 5, 8),
            allDay: true
        }],
        crossScrollingEnabled: true,
        resourceCellTemplate: function(itemData, index, $container) {
            return $("<div>").css({ height: "150px" });
        }
    });

    var schedulerHeaderHeight = parseInt(this.instance.$element().find(".dx-scheduler-header").outerHeight(true), 10),
        schedulerHeaderPanelHeight = parseInt(this.instance.$element().find(".dx-scheduler-header-panel").outerHeight(true), 10),
        $allDayTitle = this.instance.$element().find(".dx-scheduler-all-day-title"),
        $dateTableScrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable"),
        allDayPanelHeight = this.instance._workSpace._$allDayTable.outerHeight(),
        $sidebarScrollable = this.instance.$element().find(".dx-scheduler-sidebar-scrollable"),
        $headerScrollable = this.instance.$element().find(".dx-scheduler-header-scrollable");

    assert.equal(parseInt($allDayTitle.css("top"), 10), schedulerHeaderHeight + schedulerHeaderPanelHeight, "All day title element top value");
    assert.roughEqual(parseInt($dateTableScrollable.css("paddingBottom"), 10), schedulerHeaderPanelHeight + allDayPanelHeight, 1, "dateTableScrollable element padding bottom");
    assert.roughEqual(parseInt($dateTableScrollable.css("marginBottom"), 10), -1 * (schedulerHeaderPanelHeight + allDayPanelHeight), 1, "dateTableScrollable element margin bottom");

    assert.roughEqual(parseInt($sidebarScrollable.css("paddingBottom"), 10), schedulerHeaderPanelHeight + allDayPanelHeight, 1, "sidebarScrollable element padding bottom");
    assert.roughEqual(parseInt($sidebarScrollable.css("marginBottom"), 10), -1 * (schedulerHeaderPanelHeight + allDayPanelHeight), 1, "sidebarScrollable element margin bottom");
    assert.roughEqual($headerScrollable.outerHeight(), schedulerHeaderPanelHeight + allDayPanelHeight, 1, "headerScrollable height is correct");
});

QUnit.test("WorkSpace recalculation works fine after render dateCellTemplate if workspace has allDay appointment", function(assert) {
    this.createInstance({
        currentView: "week",
        currentDate: new Date(2016, 8, 5),
        dataSource: [{
            text: "a",
            ownerId: 1,
            startDate: new Date(2016, 8, 5, 7),
            endDate: new Date(2016, 8, 5, 8),
            allDay: true
        }],
        crossScrollingEnabled: true,
        dateCellTemplate: function(itemData, index, $container) {
            return $("<div>").css({ height: "150px" });
        }
    });

    var schedulerHeaderHeight = parseInt(this.instance.$element().find(".dx-scheduler-header").outerHeight(true), 10),
        schedulerHeaderPanelHeight = parseInt(this.instance.$element().find(".dx-scheduler-header-panel").outerHeight(true), 10),
        $allDayTitle = this.instance.$element().find(".dx-scheduler-all-day-title"),
        $dateTableScrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable"),
        allDayPanelHeight = this.instance._workSpace._$allDayTable.outerHeight();

    assert.equal(parseInt($allDayTitle.css("top"), 10), schedulerHeaderHeight + schedulerHeaderPanelHeight, "All day title element top value");
    assert.roughEqual(parseInt($dateTableScrollable.css("paddingBottom"), 10), schedulerHeaderPanelHeight + allDayPanelHeight, 1, "dateTableScrollable element padding bottom");
    assert.roughEqual(parseInt($dateTableScrollable.css("marginBottom"), 10), -1 * (schedulerHeaderPanelHeight + allDayPanelHeight), 1, "dateTableScrollable element margin bottom");
});

QUnit.test("Timepanel text should be calculated correctly if DST makes sense (T442904)", function(assert) {
        // can be reproduced in PST timezone
    this.createInstance({
        dataSource: [],
        views: ["week"],
        currentView: "week",
        currentDate: new Date(2016, 10, 6),
        firstDayOfWeek: 0,
        startDayHour: 1,
        timeZone: "America/Los_Angeles",
        height: 600
    });

    var $cells = this.instance.$element().find(".dx-scheduler-time-panel-cell div");

    assert.equal($cells.eq(0).text(), dateLocalization.format(new Date(2016, 10, 6, 1), "shorttime"), "Cell text is OK");
    assert.equal($cells.eq(2).text(), dateLocalization.format(new Date(2016, 10, 6, 2), "shorttime"), "Cell text is OK");
});

QUnit.test("DateTimeIndicator should show correct time in current time zone", function(assert) {
    var currentDate = new Date(2018, 1, 4);

    this.createInstance({
        dataSource: [],
        views: ["week"],
        currentView: "week",
        cellDuration: 60,
        showCurrentTimeIndicator: true,
        currentDate: currentDate,
        indicatorTime: new Date(2018, 1, 4, 9, 30),
        height: 600
    });

    var indicatorPositionBefore = this.instance.$element().find(".dx-scheduler-date-time-indicator").position(),
        cellHeight = $(this.instance.$element()).find(".dx-scheduler-date-table td").eq(0).get(0).getBoundingClientRect().height;

    this.instance.option("timeZone", "Asia/Yekaterinburg");

    var indicatorPositionAfter = this.instance.$element().find(".dx-scheduler-date-time-indicator").position(),
        tzDiff = this.instance.fire("getClientTimezoneOffset", currentDate) / 3600000 + this.instance.fire("getTimezone");

    assert.equal(indicatorPositionAfter.top, indicatorPositionBefore.top + cellHeight * tzDiff, "indicator has correct position");
});

QUnit.test("Tables should take css class after width calculation(T491453)", function(assert) {
    assert.expect(1);

    var counter = 0;
    var originalWidthFn = renderer.fn.width;

    sinon.stub(renderer.fn, "width", function(value) {
        if(value === 999 && !counter) {
            var $headerTable = $("#scheduler").find("table").first();
            assert.notOk($headerTable.attr("class"), "Header table doesn't have any css classes yet");
            counter++;
        } else {
            return originalWidthFn.apply(this, arguments);
        }
    });

    try {
        this.createInstance({
            dataSource: [],
            views: ["month"],
            currentView: "month",
            crossScrollingEnabled: true,
            width: 999
        });
    } finally {
        renderer.fn.width.restore();
    }
});

QUnit.test("ScrollTo of dateTable scrollable shouldn't be called when dateTable scrollable scroll in timeLine view", function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        dataSource: [],
        currentView: "timelineWeek",
        height: 500
    });

    var headerScrollable = this.instance.$element().find(".dx-scheduler-header-scrollable").dxScrollable("instance"),
        dateTableScrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance"),
        headerScrollToSpy = sinon.spy(headerScrollable, "scrollTo"),
        dateTableScrollToSpy = sinon.spy(dateTableScrollable, "scrollTo");

    dateTableScrollable.scrollBy(1000);

    assert.ok(headerScrollToSpy.calledOnce, "header scrollTo was called");
    assert.notOk(dateTableScrollToSpy.calledOnce, "dateTable scrollTo was not called");
});

QUnit.test("OnScroll of header scrollable shouldn't be called when dateTable scrollable scroll in timeLine view", function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        dataSource: [],
        currentView: "timelineWeek",
        height: 500
    });

    var callCount = 0;

    var headerScrollable = this.instance.$element().find(".dx-scheduler-header-scrollable").dxScrollable("instance"),
        dateTableScrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

    headerScrollable.option("onScroll", function() {
        callCount++;
    });

    dateTableScrollable.scrollBy(1000);

    assert.equal(callCount, 0, "header onScroll was not called");
});

QUnit.test("ScrollTo of dateTable & header scrollable should are called when headerScrollable scroll", function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        dataSource: [],
        currentView: "timelineWeek",
        height: 500
    });

    var headerScrollable = this.instance.$element().find(".dx-scheduler-header-scrollable").dxScrollable("instance"),
        dateTableScrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance"),
        headerScrollToSpy = sinon.spy(headerScrollable, "scrollTo"),
        dateTableScrollToSpy = sinon.spy(dateTableScrollable, "scrollTo");

    headerScrollable.scrollBy(1000);

    assert.ok(dateTableScrollToSpy.calledOnce, "dateTable scrollTo was called");
    assert.notOk(headerScrollToSpy.calledOnce, "header scrollTo wasn't called");
});

QUnit.test("OnScroll of dateTable scrollable shouldn't be called when header scrollable scroll in timeLine view", function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        dataSource: [],
        currentView: "timelineWeek",
        height: 500
    });

    var callCount = 0;

    var headerScrollable = this.instance.$element().find(".dx-scheduler-header-scrollable").dxScrollable("instance"),
        dateTableScrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

    dateTableScrollable.option("onScroll", function() {
        callCount++;
    });

    headerScrollable.scrollBy(1000);

    assert.equal(callCount, 0, "dateTable onScroll was not called");
});

QUnit.test("ScrollTo of sidebar scrollable shouldn't be called when sidebar scrollable scroll and crossScrollingEnabled is turn on", function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        dataSource: [],
        crossScrollingEnabled: true,
        currentView: "week",
        height: 500
    });

    var sideBarScrollable = this.instance.$element().find(".dx-scheduler-sidebar-scrollable").dxScrollable("instance"),
        dateTableScrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance"),
        sideBarScrollToSpy = sinon.spy(sideBarScrollable, "scrollTo"),
        dateTableScrollToSpy = sinon.spy(dateTableScrollable, "scrollTo");

    sideBarScrollable.scrollBy(1000);

    assert.notOk(sideBarScrollToSpy.calledOnce, "sidebar scrollTo was not called");
    assert.ok(dateTableScrollToSpy.calledOnce, "dateTable scrollTo was called");
});

QUnit.test("OnScroll of sidebar scrollable shouldn't be called when dateTable scrollable scroll and crossScrollingEnabled is turn on", function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        dataSource: [],
        crossScrollingEnabled: true,
        currentView: "week",
        height: 500
    });

    var callCount = 0;

    var sideBarScrollable = this.instance.$element().find(".dx-scheduler-sidebar-scrollable").dxScrollable("instance"),
        dateTableScrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

    sideBarScrollable.option("onScroll", function() {
        callCount++;
    });

    dateTableScrollable.scrollBy(1000);

    assert.equal(callCount, 0, "sidebar onScroll was not called");
});

QUnit.test("intervalCount should be passed to workSpace", function(assert) {
    this.createInstance({
        currentDate: new Date(2017, 3, 16),
        views: [{
            type: "day",
            name: "Test Day",
            intervalCount: 2
        }],
        currentView: "day",
        height: 500
    });

    var workSpace = this.instance.getWorkSpace();

    assert.equal(workSpace.option("intervalCount"), 2, "option intervalCount was passed");
});

QUnit.test("Group header should contain group header content with right height, groupOrientation = vertical", function(assert) {
    var priorityData = [
        {
            text: "Low Priority",
            id: 1,
            color: "#1e90ff"
        }, {
            text: "High Priority",
            id: 2,
            color: "#ff9747"
        }
    ];

    this.createInstance({
        dataSource: [],
        views: [{
            type: "day",
            name: "day",
            groupOrientation: "vertical" }],
        currentView: "day",
        showAllDayPanel: true,
        currentDate: new Date(2018, 2, 16),
        groups: ["priorityId"],
        resources: [{
            fieldExpr: "priorityId",
            allowMultiple: false,
            dataSource: priorityData,
            label: "Priority"
        }
        ],
        startDayHour: 9,
        endDayHour: 12,
        height: 600
    });
    var header = this.instance.$element().find(".dx-scheduler-group-header"),
        $headerContents = header.find(".dx-scheduler-group-header-content"),
        cellHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(1).outerHeight();

    assert.roughEqual($headerContents.eq(0).outerHeight(), 7 * cellHeight - 2 * DATE_TABLE_CELL_BORDER, 1, "Group header content has right height");
});

QUnit.test("WorkSpace should be refreshed after groups changed", function(assert) {
    this.createInstance({
        groups: ["resource1"],
        resources: [
            {
                displayExpr: "name",
                valueExpr: "key",
                field: "resource1",
                dataSource: [
                    { key: 1, name: "One" },
                    { key: 2, name: "Two" }
                ]
            },
            {
                field: "resource2",
                dataSource: [
                    { id: 1, text: "Room 1" }
                ]
            }
        ]
    });

    var refreshStub = sinon.stub(this.instance, "_refreshWorkSpace");

    try {
        this.instance.option("groups", ["resource2"]);

        assert.ok(refreshStub.calledOnce, "Workspace was refreshed");

    } finally {
        refreshStub.restore();
    }
});

QUnit.test("SelectedCellData option should have rigth data of focused cell", function(assert) {
    this.createInstance({
        dataSource: [],
        views: ["week"],
        currentView: "week",
        showAllDayPanel: true,
        currentDate: new Date(2018, 3, 11),
        height: 600
    });

    var $cells = this.instance.$element().find(".dx-scheduler-date-table-cell");

    $($cells.eq(0)).trigger("dxpointerdown");

    assert.deepEqual(this.instance.option("selectedCellData"), [{ startDate: new Date(2018, 3, 8), endDate: new Date(2018, 3, 8, 0, 30), allDay: false }], "option has right value");
});

QUnit.test("SelectedCellData option should make cell in focused state", function(assert) {
    this.createInstance({
        dataSource: [],
        views: ["week"],
        currentView: "week",
        showAllDayPanel: true,
        selectedCellData: [{ startDate: new Date(2018, 3, 8), endDate: new Date(2018, 3, 8, 0, 30), allDay: false }],
        currentDate: new Date(2018, 3, 11),
        height: 600
    });

    var $cells = this.instance.$element().find(".dx-scheduler-date-table-cell");

    assert.ok($($cells.eq(0)).hasClass("dx-state-focused", "correct cell is focused"));
});

QUnit.test("Focused cells cash should be correct (T640466)", function(assert) {
    this.createInstance({
        dataSource: [],
        views: ["week"],
        currentView: "week",
        showAllDayPanel: true,
        selectedCellData: [{ startDate: new Date(2018, 3, 8), endDate: new Date(2018, 3, 8, 0, 30), allDay: false }],
        currentDate: new Date(2018, 3, 11),
        height: 600
    });
    var $cells = this.instance.$element().find(".dx-scheduler-date-table-cell"),
        workSpace = this.instance.getWorkSpace();

    assert.deepEqual(workSpace._focusedCells[0], $cells.eq(0).get(0), "Cashed cells is correct");
});

QUnit.test("Scheduler timeline workweek should contain two spans in header panel cell in Material theme", function(assert) {
    var origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };

    this.createInstance({
        views: [ "week" ],
        currentDate: new Date(2015, 9, 29),
        firstDayOfWeek: 1,
        startDayHour: 4,
        endDayHour: 5,
        currentView: "week"
    });

    var $rows = this.instance.$element().find(".dx-scheduler-header-row"),
        $firstRowCells = $rows.first().find("th"),
        startDate = 26;

    var formatWeekdayAndDay = function(date) {
        return dateLocalization.getDayNames("abbreviated")[date.getDay()] + " " + dateLocalization.format(date, "day");
    };

    for(var i = 0; i < 5; i++) {
        var $cell = $firstRowCells.eq(i);
        assert.equal($cell.text(), formatWeekdayAndDay(new Date(2015, 9, startDate + i)), "Cell text is OK");
        assert.equal($cell.find("span").length, 2, "Cell contains two spans in material theme");
        assert.ok($cell.find("span").first().hasClass("dx-scheduler-header-panel-cell-date"), "first span has correct class");
        assert.ok($cell.find("span").last().hasClass("dx-scheduler-header-panel-cell-date"), "second span has correct class");
    }
    themes.isMaterial = origIsMaterial;
});

QUnit.test("Vertical scrollable should work after switching currentDate if allDayPanel and crossScrollingEnabled are turned on", function(assert) {
    this.createInstance({
        dataSource: [],
        views: ["day"],
        currentView: "day",
        showAllDayPanel: true,
        crossScrollingEnabled: true,
        currentDate: new Date(2018, 5, 14),
        height: 600
    });

    this.instance.option("currentDate", new Date(2018, 5, 15));
    var $scroll = this.instance.$element().find(".dx-scrollbar-vertical").eq(1);

    assert.notEqual($scroll.css("display"), "none", "ok");
});
