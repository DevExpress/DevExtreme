var $ = require("jquery");

QUnit.testStart(function() {
    $("#qunit-fixture").html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

require("common.css!");
require("generic_light.css!");


var noop = require("core/utils/common").noop,
    errors = require("ui/widget/ui.errors"),
    translator = require("animation/translator"),
    dateLocalization = require("localization/date"),
    messageLocalization = require("localization/message"),
    dblclickEvent = require("events/dblclick"),
    fx = require("animation/fx"),
    pointerMock = require("../../helpers/pointerMock.js"),
    Color = require("color"),
    tooltip = require("ui/tooltip/ui.tooltip"),
    devices = require("core/devices"),
    config = require("core/config"),
    dragEvents = require("events/drag"),
    DataSource = require("data/data_source/data_source").DataSource,
    CustomStore = require("data/custom_store"),
    dataUtils = require("core/element_data"),
    dateSerialization = require("core/utils/date_serialization");

require("ui/scheduler/ui.scheduler");
require("ui/switch");

var DATE_TABLE_CELL_CLASS = "dx-scheduler-date-table-cell",
    APPOINTMENT_CLASS = "dx-scheduler-appointment";

var APPOINTMENT_DEFAULT_OFFSET = 25,
    APPOINTMENT_MOBILE_OFFSET = 50;


function getOffset() {
    if(devices.current().deviceType !== "desktop") {
        return APPOINTMENT_MOBILE_OFFSET;
    } else {
        return APPOINTMENT_DEFAULT_OFFSET;
    }
}

function isDeviceDesktop() {
    return devices.current().deviceType === "desktop";
}

function skipTestOnMobile(assert) {
    const isMobile = !isDeviceDesktop();
    if(isMobile) {
        assert.ok(true, "Test skipped on mobile");
    }
    return isMobile;
}

QUnit.module("T712431", () => {
    // TODO: there is a test for T712431 bug, when replace table layout on div layout, the test will also be useless
    var APPOINTMENT_WIDTH = 941;

    var createInstance = function(options) {
        return $("#scheduler").dxScheduler($.extend(options, { })).dxScheduler("instance");
    };

    QUnit.test('Appointment width should be not less 941px with width control 1100px', function(assert) {
        var data = [
            {
                text: "Website Re-Design Plan 2",
                startDate: new Date(2017, 4, 7, 9, 30),
                endDate: new Date(2017, 4, 12, 17, 20)
            }
        ];

        createInstance({
            dataSource: data,
            views: ["month"],
            currentView: "month",
            currentDate: new Date(2017, 4, 25),
            startDayHour: 9,
            width: 1100,
            height: 600
        });

        var appointment = $(".dx-scheduler-appointment");
        assert.roughEqual(appointment.outerWidth(), APPOINTMENT_WIDTH, 1);
    });
});

QUnit.module("Integration: Appointments", {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler($.extend(options, { maxAppointmentsPerCell: options && options.maxAppointmentsPerCell || null })).dxScheduler("instance");
        };
        this.getAppointmentColor = function($task, checkedProperty) {
            checkedProperty = checkedProperty || "backgroundColor";
            return new Color($task.css(checkedProperty)).toHex();
        };
        this.clock = sinon.useFakeTimers();
        this.tasks = [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: "Task 2",
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            }
        ];
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    },
    checkItemDataInDropDownTemplate: function(assert, dataSource, currentDate) {
        this.createInstance({
            dataSource: dataSource,
            height: 600,
            maxAppointmentsPerCell: 1,
            currentDate: currentDate,
            currentView: "month",
            views: ["month"],
            dropDownAppointmentTemplate: function(itemData) {
                assert.ok(dataSource.indexOf(itemData) > -1, "appointment data contains in the data source");
            }
        });

        $(".dx-scheduler-dropdown-appointments").eq(0).dxDropDownMenu("instance").open();
    }
});

QUnit.test("Appointments should be rendered on the same line after navigating to the next month, crossScrollingEnabled = true(T804721)", function(assert) {
    var expectedTop = 26;
    var views = ["timelineMonth", "timelineWeek"];

    var helper = {
        getNavigator: function() { return $(".dx-scheduler-navigator"); },
        getCaption: function() { return $(".dx-scheduler-navigator").find(".dx-scheduler-navigator-caption").text(); },
        clickOnPrevButton: function() {
            helper.getNavigator().find(".dx-scheduler-navigator-previous").trigger("dxclick");
        },
        clickOnNextButton: function() {
            helper.getNavigator().find(".dx-scheduler-navigator-next").trigger("dxclick");
        },
        getAppointments: function() {
            return $(".dx-scheduler-appointment");
        }
    };

    var data = [{
        text: "Event 1",
        recurrenceRule: "FREQ=DAILY",
        startDate: new Date(2019, 1, 1, 14, 0),
        endDate: new Date(2019, 1, 1, 12, 30),
    }];

    this.instance = $("#scheduler").dxScheduler({
        dataSource: data,
        views: views,
        currentView: views[0],
        currentDate: new Date(2019, 2, 1),
        crossScrollingEnabled: true,
        height: 600
    }).dxScheduler("instance");

    var testTopPosition = function(view, navigatorDate) {
        helper.getAppointments().each(function(index, element) {
            var currentTop = translator.locate($(element)).top;
            assert.equal(currentTop, expectedTop, `current appointment top position should be equal ${expectedTop} in ${view} type, ${navigatorDate} date`);
        });
    };

    views.forEach(function(view) {
        this.instance.option("currentView", view);

        testTopPosition(view, helper.getCaption());

        helper.clickOnNextButton();
        testTopPosition(view, helper.getCaption());

        helper.clickOnNextButton();
        testTopPosition(view, helper.getCaption());

        helper.clickOnPrevButton();
        testTopPosition(view, helper.getCaption());

        helper.clickOnPrevButton();
        testTopPosition(view, helper.getCaption());
    }.bind(this));
});

QUnit.test("DataSource option should be passed to the appointments collection after wrap by layout manager", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: "Task 2",
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            }
        ]
    });

    this.createInstance({
        views: ["day", "week"],
        currentView: "day",
        dataSource: data,
        currentDate: new Date(2015, 1, 9)
    });

    var dataSourceItems = this.instance.option("dataSource").items(),
        appointmentsItems = this.instance.getAppointmentsInstance().option("items");

    $.each(dataSourceItems, function(index, item) {
        assert.equal(appointmentsItems[index].itemData, item, "Item is correct");
    });
});

QUnit.test("appointmentTemplate option should be passed to Task module", function(assert) {
    var data = new DataSource({
        store: [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            }
        ]
    });
    this.createInstance({
        views: ["day", "week"],
        currentView: "day",
        currentDate: new Date(2015, 1, 9),
        appointmentTemplate: "template",
        dataSource: data
    });

    assert.deepEqual(this.instance.$element().find("." + APPOINTMENT_CLASS).eq(0).text(), "Task Template", "Tasks itemTemplate option is correct");
});

QUnit.test("Scheduler tasks should have a right parent", function(assert) {
    this.createInstance();

    assert.equal(this.instance.$element().find(".dx-scheduler-work-space .dx-scrollable-content>.dx-scheduler-scrollable-appointments").length, 1, "scrollable is parent of dxSchedulerAppointments");
});

QUnit.test("Tasks should have right boundOffset", function(assert) {
    var tasks = [
        { text: "Task", startDate: new Date(2015, 2, 17), endDate: new Date(2015, 2, 17, 0, 30) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: "week",
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        editing: true
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        draggableBounds = $appointment.dxDraggable("instance").option("boundOffset"),
        allDayPanelHeight = this.instance.$element().find(".dx-scheduler-all-day-table-cell").first().outerHeight();

    assert.roughEqual(draggableBounds.top, -allDayPanelHeight, 1, "bounds are OK");
});

QUnit.test("Draggable rendering option 'immediate' should be turned off", function(assert) {
    var tasks = [
        { text: "Task", startDate: new Date(2015, 2, 17), endDate: new Date(2015, 2, 17, 0, 30) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: "week",
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        editing: true
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        immediate = $appointment.dxDraggable("instance").option("immediate");

    assert.notOk(immediate, "immediate option is false");
});

QUnit.test("Tasks should have right draggable area", function(assert) {
    var tasks = [
        { text: "Task", startDate: new Date(2015, 2, 17), endDate: new Date(2015, 2, 17, 0, 30) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentView: "week",
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        editing: true
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        draggableArea = $appointment.dxDraggable("instance").option("area");

    assert.equal(draggableArea, this.instance.getWorkSpaceScrollableContainer(), "area is OK");
});

QUnit.test("Tasks should be filtered by date before render", function(assert) {
    var tasks = [
        { text: "One", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 1) },
        { text: "Two", startDate: new Date(2015, 2, 17), endDate: new Date(2015, 2, 17, 1) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        currentView: "day",
        remoteFiltering: true
    });

    assert.deepEqual(dataSource.items(), [tasks[0]], "Items are OK");

    this.instance.option("currentDate", new Date(2015, 2, 17));
    assert.deepEqual(dataSource.items(), [tasks[1]], "Items are OK");

    this.instance.option("currentView", "week");
    assert.deepEqual(dataSource.items(), tasks, "Items are OK");
});

QUnit.test("Tasks should be filtered by start day hour before render", function(assert) {
    var tasks = [
        { text: "One", startDate: new Date(2015, 2, 16, 5), endDate: new Date(2015, 2, 16, 5, 30) },
        { text: "Two", startDate: new Date(2015, 2, 16, 2), endDate: new Date(2015, 2, 16, 2, 30) },
        { text: "Three", startDate: new Date(2015, 2, 17, 2), endDate: new Date(2015, 2, 17, 2, 30) },
        { text: "Five", startDate: new Date(2015, 2, 10, 6), endDate: new Date(2015, 2, 10, 6, 30) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        startDayHour: 4,
        currentView: "week"
    });

    var $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 1, "There is only one appointment");
    assert.deepEqual(dataUtils.data($appointments[0], "dxItemData"), tasks[0], "Appointment data is OK");

    this.instance.option("startDayHour", 1);
    $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 3, "There are three appointments");
    assert.deepEqual(dataUtils.data($appointments.get(0), "dxItemData"), tasks[0], "Appointment data is OK");
    assert.deepEqual(dataUtils.data($appointments.get(1), "dxItemData"), tasks[1], "Appointment data is OK");
    assert.deepEqual(dataUtils.data($appointments.get(2), "dxItemData"), tasks[2], "Appointment data is OK");
});

QUnit.test("Tasks should be filtered by end day hour before render", function(assert) {
    var tasks = [
        { text: "One", startDate: new Date(2015, 2, 16, 7), endDate: new Date(2015, 2, 16, 7, 30) },
        { text: "Two", startDate: new Date(2015, 2, 16, 11), endDate: new Date(2015, 2, 16, 11, 30) },
        { text: "Three", startDate: new Date(2015, 2, 16, 12), endDate: new Date(2015, 2, 16, 12, 30) },
        { text: "Five", startDate: new Date(2015, 2, 10, 15), endDate: new Date(2015, 2, 10, 15, 30) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        endDayHour: 10,
        currentView: "week"
    });

    var $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 1, "There is only one appointment");
    assert.deepEqual(dataUtils.data($appointments[0], "dxItemData"), tasks[0], "Appointment data is OK");

    this.instance.option("endDayHour", 14);
    $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 3, "There are three appointments");
    assert.deepEqual(dataUtils.data($appointments.get(0), "dxItemData"), tasks[0], "Appointment data is OK");
    assert.deepEqual(dataUtils.data($appointments.get(1), "dxItemData"), tasks[1], "Appointment data is OK");
    assert.deepEqual(dataUtils.data($appointments.get(2), "dxItemData"), tasks[2], "Appointment data is OK");
});

QUnit.test("tasks should be filtered by resources before render", function(assert) {
    var tasks = [
        { text: "a", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: [1, 2] }, // false
        { text: "b", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2], managerId: 4 }, // true
        { text: "b", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 3, roomId: [1, 2] }, // false
        { text: "c", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2, 3] } // true
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        groups: ["ownerId", "roomId"],
        resources: [
            {
                field: "ownerId",
                allowMultiple: true,
                dataSource: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            },
            {
                field: "roomId",
                allowMultiple: true,
                dataSource: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            },
            {
                field: "managerId",
                allowMultiple: true,
                dataSource: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            }
        ]
    });

    var $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 4, "There are four appointment");
    assert.deepEqual(dataUtils.data($appointments.get(0), "dxItemData"), tasks[1], "The first appointment data is OK");
    assert.deepEqual(dataUtils.data($appointments.get(1), "dxItemData"), tasks[1], "The second appointment dat is OK");
    assert.deepEqual(dataUtils.data($appointments.get(2), "dxItemData"), tasks[3], "The first appointment data is OK");
    assert.deepEqual(dataUtils.data($appointments.get(3), "dxItemData"), tasks[3], "The second appointment dat is OK");
});

QUnit.test("Tasks should be filtered by resources if dataSource is changed", function(assert) {
    var tasks = [
        { text: "a", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: [1, 2] }, // false
        { text: "b", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2], managerId: 4 }, // true
        { text: "b", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 3, roomId: [1, 2] }, // false
        { text: "c", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2, 3] } // true
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentDate: new Date(2015, 2, 16),
        groups: ["ownerId", "roomId"],
        resources: [
            {
                field: "ownerId",
                allowMultiple: true,
                dataSource: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            },
            {
                field: "roomId",
                allowMultiple: true,
                dataSource: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            },
            {
                field: "managerId",
                allowMultiple: true,
                dataSource: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            }
        ]
    });

    this.instance.option("dataSource", dataSource);

    var $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 4, "There are four appointment");
    assert.deepEqual(dataUtils.data($appointments.get(0), "dxItemData"), tasks[1], "The first appointment data is OK");
    assert.deepEqual(dataUtils.data($appointments.get(1), "dxItemData"), tasks[1], "The second appointment dat is OK");
    assert.deepEqual(dataUtils.data($appointments.get(2), "dxItemData"), tasks[3], "The first appointment data is OK");
    assert.deepEqual(dataUtils.data($appointments.get(3), "dxItemData"), tasks[3], "The second appointment dat is OK");
});

QUnit.test("Tasks should be filtered by resources if resources are changed", function(assert) {
    var tasks = [
        { text: "a", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: [1, 2] }, // false
        { text: "b", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2], managerId: 4 }, // true
        { text: "b", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 3, roomId: [1, 2] }, // false
        { text: "c", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2, 3] } // true
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        groups: ["ownerId", "roomId"]
    });

    this.instance.option("resources", [
        {
            field: "ownerId",
            allowMultiple: true,
            dataSource: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
        },
        {
            field: "roomId",
            allowMultiple: true,
            dataSource: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
        },
        {
            field: "managerId",
            allowMultiple: true,
            dataSource: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
        }
    ]);

    var $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 4, "There are four appointment");
    assert.deepEqual(dataUtils.data($appointments.get(0), "dxItemData"), tasks[1], "The first appointment data is OK");
    assert.deepEqual(dataUtils.data($appointments.get(1), "dxItemData"), tasks[1], "The second appointment dat is OK");
    assert.deepEqual(dataUtils.data($appointments.get(2), "dxItemData"), tasks[3], "The first appointment data is OK");
    assert.deepEqual(dataUtils.data($appointments.get(3), "dxItemData"), tasks[3], "The second appointment dat is OK");
});

QUnit.test("Tasks should be filtered by resources if groups are changed", function(assert) {
    var tasks = [
        { text: "a", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: [1, 2] }, // false
        { text: "b", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2], managerId: 1 }, // true
        { text: "c", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 3, roomId: [1, 2] }, // false
        { text: "d", startDate: new Date(2015, 2, 16), endDate: new Date(2015, 2, 16, 0, 30), ownerId: 1, roomId: [1, 2, 3] } // false
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        groups: ["ownerId", "roomId"],
        resources: [
            {
                field: "ownerId",
                allowMultiple: true,
                dataSource: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            },
            {
                field: "roomId",
                allowMultiple: true,
                dataSource: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            },
            {
                field: "managerId",
                allowMultiple: true,
                dataSource: [{ id: 1, text: "a" }, { id: 2, text: "b" }]
            }
        ]
    });
    this.instance.option("groups", ["ownerId", "roomId", "managerId"]);
    var $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 2, "There are two appointment");
    assert.deepEqual(dataUtils.data($appointments.get(0), "dxItemData"), tasks[1], "The first appointment data is OK");
    assert.deepEqual(dataUtils.data($appointments.get(1), "dxItemData"), tasks[1], "The second appointment data is OK");
});

QUnit.test("Scheduler tasks should have a right height", function(assert) {
    this.createInstance({ dataSource: this.tasks, currentDate: new Date(2015, 1, 9) });
    this.clock.tick();
    var cellHeight = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height,
        resultHeight = cellHeight * 2;

    assert.equal(this.instance.$element().find("." + APPOINTMENT_CLASS).eq(0).outerHeight(), resultHeight, "Task has a right height");
});

QUnit.test("Scheduler tasks should have a right dimensions for month view", function(assert) {
    this.createInstance({
        dataSource: [
            { text: "Task 1", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 10) }
        ],
        currentDate: new Date(2015, 1, 9),
        views: ["month"],
        currentView: "month",
        height: 800
    });
    this.clock.tick();

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $cell = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0);

    assert.roughEqual($appointment.height(), $cell.outerHeight() * 0.6 / 2, 2, "Task has a right height");
    assert.roughEqual($appointment.outerWidth(), $cell.outerWidth(), 1.001, "Task has a right width");
});

QUnit.test("Scheduler tasks should have a right height when currentView is changed", function(assert) {
    this.createInstance({
        dataSource: [
            { text: "Task 1", startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 10) }
        ],
        currentDate: new Date(2015, 1, 9),
        views: ["day", "week", "month"],
        height: 800
    });
    this.clock.tick();

    this.instance.option("currentView", "month");

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $cell = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0);

    assert.roughEqual($appointment.height(), $cell.outerHeight() * 0.6 / 2, 2, "Task has a right height");
    assert.roughEqual($appointment.outerWidth(), $cell.outerWidth(), 1.001, "Task has a right width");
});

QUnit.test("Short tasks should have a right height (T725948)", function(assert) {
    this.createInstance({
        dataSource: [
            {
                endDate: "2019-03-20T12:06:41.000Z",
                startDate: "2019-03-20T12:06:40.000Z"
            }
        ],
        currentView: "day",
        views: ["day"],
        height: 800,
        currentDate: new Date(2019, 2, 20),
        firstDayOfWeek: 1,
        cellDuration: 15
    });
    this.clock.tick();

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);

    assert.roughEqual($appointment.height(), 3, 0.5, "Task has a right height");
});

QUnit.test("Two not rival appointments with fractional coordinates should have correct positions(ie)", function(assert) {
    this.createInstance({
        dataSource: [
            { text: "Appointment 1", startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
            { text: "Appointment 2", startDate: new Date(2015, 1, 11, 8), endDate: new Date(2015, 1, 11, 10) },
            { text: "Appointment 3", startDate: new Date(2015, 1, 10, 8), endDate: new Date(2015, 1, 10, 10) }
        ],
        currentDate: new Date(2015, 1, 9),
        views: ["month"],
        currentView: "month",
        width: 720
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS);

    assert.equal($appointment.length, 3, "All appointments are rendered");
    assert.equal(translator.locate($appointment.eq(0)).top, translator.locate($appointment.eq(1)).top, "appointment is rendered in right place");
    assert.equal(translator.locate($appointment.eq(1)).top, translator.locate($appointment.eq(2)).top, "appointment is rendered in right place");
});

QUnit.test("DblClick on appointment should call scheduler.showAppointmentPopup", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });
    this.clock.tick();

    var spy = sinon.stub(this.instance, "showAppointmentPopup");

    try {
        $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(1).trigger(dblclickEvent.name);

        assert.ok(spy.calledOnce, "Method was called");
        assert.deepEqual(spy.getCall(0).args[0],
            {
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0),
                text: "Task 2"
            },
            "Method has a right arguments");
    } finally {
        this.instance.showAppointmentPopup.restore();
    }
});

QUnit.test("DblClick on appointment should not call scheduler.showAppointmentPopup, disabled mode", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, disabled: true });
    this.clock.tick();

    var spy = sinon.spy(this.instance, "showAppointmentPopup");

    $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(1).trigger(dblclickEvent.name);

    assert.ok(!spy.calledOnce, "Method was not called");
});

QUnit.test("DblClick on appointment should not affect the related cell start date(T395620)", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });

    sinon.stub(this.instance, "showAppointmentPopup");

    try {
        var $appt = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
            apptData = dataUtils.data($appt[0], "dxItemData");

        apptData.startDate = new Date(2015, 1, 9, 2);

        $appt.trigger(dblclickEvent.name);

        var relatedCellData = dataUtils.data($(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).get(2), "dxCellData").startDate;

        assert.equal(relatedCellData.getTime(), new Date(2015, 1, 9, 1).getTime(), "Cell start date is OK");
    } finally {
        this.instance.showAppointmentPopup.restore();
    }
});

QUnit.test("Recurrence repeat-type editor should have default 'never' value after reopening appointment popup", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: "week"
    });

    var firstAppointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: "caption 1" },
        secondAppointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: "caption 2" };

    this.instance.showAppointmentPopup(firstAppointment);

    var form = this.instance.getAppointmentDetailsForm(),
        repeatOnEditor = form.getEditor("repeatOnOff"),
        repeatEndEditor = form.getEditor("recurrenceRule")._switchEndEditor;

    repeatOnEditor.option("value", true);

    repeatEndEditor.option("value", true);
    $(".dx-scheduler-appointment-popup").find(".dx-popup-done").trigger("dxclick");

    this.instance.showAppointmentPopup(secondAppointment);

    form = this.instance.getAppointmentDetailsForm(),
    repeatOnEditor = form.getEditor("repeatOnOff"),
    repeatEndEditor = form.getEditor("recurrenceRule")._switchEndEditor;

    repeatOnEditor.option("value", true);

    assert.notOk(repeatEndEditor.option("value"), "Switch is closed");
});

QUnit.test("Disabled appointment could not be focused", function(assert) {
    if(devices.real().platform !== "generic") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: [{ startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 3), disabled: true }] });
    this.clock.tick();

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);
    $appointment.trigger("focusin");

    assert.notOk($appointment.hasClass("dx-state-focused"), "Appointment is not focused");
});

QUnit.test("Appointment dates should not be normalized before sending to the details view", function(assert) {
    var startDate = 1429776000000,
        endDate = 1429794000000,
        task = {
            text: "Task 1",
            ownerId: 1,
            startDate: startDate,
            endDate: endDate
        };

    this.createInstance({
        dataSource: new DataSource({
            store: [task]
        }),
        currentDate: new Date(2015, 3, 23)
    });

    this.clock.tick();

    var spy = sinon.spy(this.instance, "showAppointmentPopup");

    $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0).trigger("dxclick");
    this.clock.tick(300);
    var $tooltip = $(".dx-scheduler-appointment-tooltip");
    $tooltip.find(".dx-scheduler-appointment-tooltip-buttons").find(".dx-button").eq(1).trigger("dxclick");

    try {
        var args = spy.getCall(0).args[0];
        assert.deepEqual(args.startDate, startDate, "Start date is OK");
        assert.deepEqual(args.endDate, endDate, "End date is OK");

        tooltip.hide();
    } finally {
        this.instance.showAppointmentPopup.restore();
    }
});

QUnit.test("Appointment labels should be localized before sending to the details view", function(assert) {
    var startDate = 1429776000000,
        endDate = 1429794000000,
        task = {
            text: "Task 1",
            startDate: startDate,
            endDate: endDate
        };

    this.createInstance({
        dataSource: new DataSource({
            store: [task]
        }),
        currentDate: new Date(2015, 3, 23)
    });

    this.clock.tick();
    this.instance.showAppointmentPopup(task);

    var detailsForm = this.instance.getAppointmentDetailsForm(),
        formItems = detailsForm.option("items");

    assert.equal(formItems[0].label.text, messageLocalization.format("dxScheduler-editorLabelTitle"), "Title is OK");
    assert.equal(formItems[1].itemType, "empty", "Item is empty");
    assert.equal(formItems[2].label.text, messageLocalization.format("dxScheduler-allDay"), "All-day is OK");
    assert.equal(formItems[3].label.text, messageLocalization.format("dxScheduler-editorLabelStartDate"), "Start date is OK");
    assert.equal(formItems[4].label.text, " ", "Start date tz is OK");
    assert.equal(formItems[5].label.text, messageLocalization.format("dxScheduler-editorLabelEndDate"), "End date is OK");
    assert.equal(formItems[6].label.text, " ", "End date tz is OK");
    assert.equal(formItems[7].itemType, "empty", "Item is empty");
    assert.equal(formItems[8].label.text, messageLocalization.format("dxScheduler-editorLabelDescription"), "Description is OK");
    assert.equal(formItems[9].label.text, messageLocalization.format("dxScheduler-editorLabelRecurrence"), "Recurrence is OK");
});

QUnit.test("Appointment should be copied before sending to the details view", function(assert) {
    var task = {
        text: "Task 1",
        startDate: 1429776000000,
        endDate: 1429794000000
    };

    this.createInstance({
        dataSource: new DataSource({
            store: [task]
        }),
        currentDate: new Date(2015, 3, 23)
    });

    this.clock.tick();

    this.instance.showAppointmentPopup(task);

    var detailsForm = this.instance.getAppointmentDetailsForm(),
        formData = detailsForm.option("formData");

    assert.notEqual(formData, task, "Appointment data is copied");
});

QUnit.test("Add new appointment", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });
    var addAppointment = this.instance.addAppointment,
        spy = sinon.spy(noop),
        newItem = { startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 1, 2), text: "caption" };
    this.instance.addAppointment = spy;
    try {
        this.instance.showAppointmentPopup(newItem, true);

        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.ok(spy.calledOnce, "Add method is called");
        assert.deepEqual(spy.getCall(0).args[0], newItem, "New item is correct");
    } finally {
        this.instance.addAppointment = addAppointment;
    }
});

QUnit.test("Appointments should be rendered correctly when resourses store is asynchronous", function(assert) {
    var appointments = [
        { startDate: new Date(2015, 2, 4), text: "a", endDate: new Date(2015, 2, 4, 0, 30), roomId: 1 },
        { startDate: new Date(2015, 2, 4), text: "b", endDate: new Date(2015, 2, 4, 0, 30), roomId: 2 }
    ];
    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        views: ["month"],
        dataSource: appointments,
        width: 840,
        currentView: "month",
        firstDayOfWeek: 1,
        groups: ["roomId"],
        resources: [
            {
                field: "roomId",
                allowMultiple: true,
                dataSource: new DataSource({
                    store: new CustomStore({
                        load: function() {
                            var d = $.Deferred();
                            setTimeout(function() {
                                d.resolve([
                                    { id: 1, text: "Room 1", color: "#ff0000" },
                                    { id: 2, text: "Room 2", color: "#0000ff" }
                                ]);
                            }, 300);

                            return d.promise();
                        }
                    })
                })
            }
        ]
    });

    this.clock.tick(300);
    assert.deepEqual(this.instance.$element().find("." + APPOINTMENT_CLASS).length, 2, "Appointments are rendered");
});

QUnit.test("Add new appointment with delay(T381444)", function(assert) {
    var done = assert.async(),
        data = [],
        popup;

    this.clock.restore();

    var dataSource = new DataSource({
        load: function() {
            return data;
        },
        insert: function(appt) {
            var d = $.Deferred();

            setTimeout(function() {
                assert.ok(popup.option("visible"), "Popup is visible");

                data.push(appt);
                d.resolve(appt);

                assert.notOk(popup.option("visible"), "Popup isn't visible");
                done();

            }, 50);

            return d.promise();
        }
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: dataSource });

    this.instance.showAppointmentPopup({
        startDate: new Date(2015, 1, 1, 1),
        endDate: new Date(2015, 1, 1, 2),
        text: "caption"
    }, true);

    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

    popup = this.instance.getAppointmentPopup();
});

QUnit.test("Add new appointment with delay and an error(T381444)", function(assert) {
    var done = assert.async(),
        data = [],
        popup;

    this.clock.restore();

    var dataSource = new DataSource({
        load: function() {
            return data;
        },
        insert: function(appt) {
            var d = $.Deferred();

            setTimeout(function() {
                assert.ok(popup.option("visible"), "Popup is visible");
                d.reject();
                assert.ok(popup.option("visible"), "Popup is still visible");
                done();
            }, 100);

            return d.promise();
        }
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: dataSource });

    this.instance.showAppointmentPopup({
        startDate: new Date(2015, 1, 1, 1),
        endDate: new Date(2015, 1, 1, 2),
        text: "caption"
    }, true);

    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

    popup = this.instance.getAppointmentPopup();
});

QUnit.test("Scheduler should not update scroll position if appointment is visible ", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: "week",
        height: 500
    });

    var appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), text: "caption" },
        workSpace = this.instance.getWorkSpace(),
        scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        this.instance.showAppointmentPopup(appointment);
        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.notOk(scrollToTimeSpy.calledOnce, "scrollToTime was not called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should update scroll position if appointment was added to invisible bottom area", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: "week",
        height: 300
    });

    var appointment = { startDate: new Date(2015, 1, 9, 21), endDate: new Date(2015, 1, 9, 22), text: "caption 2" },
        workSpace = this.instance.getWorkSpace(),
        scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        this.instance.showAppointmentPopup(appointment);
        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.ok(scrollToTimeSpy.calledOnce, "scrollToTime was called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should update scroll position if appointment is not visible, timeline view ", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: "timelineDay",
        height: 500
    });

    var appointment = { startDate: new Date(2015, 1, 9, 7), endDate: new Date(2015, 1, 9, 1, 8), text: "caption" },
        workSpace = this.instance.$element().find(".dx-scheduler-work-space").dxSchedulerTimelineDay("instance"),
        scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        this.instance.showAppointmentPopup(appointment);
        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.ok(scrollToTimeSpy.calledOnce, "scrollToTime was called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should update scroll position if appointment is not visible, timeline week view ", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: "timelineWeek",
        height: 500,
        width: 500
    });

    var appointment = { startDate: new Date(2015, 1, 12, 7), endDate: new Date(2015, 1, 12, 1, 8), text: "caption" },
        workSpace = this.instance.getWorkSpace(),
        scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        this.instance.showAppointmentPopup(appointment);
        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.ok(scrollToTimeSpy.calledOnce, "scrollToTime was called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should update scroll position if appointment was added to invisible top area", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: "week",
        height: 300
    });

    this.instance.getWorkSpaceScrollable().scrollBy(220);

    var appointment = { startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30), text: "caption" },
        workSpace = this.instance.getWorkSpace(),
        scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        this.instance.showAppointmentPopup(appointment);
        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.ok(scrollToTimeSpy.calledOnce, "scrollToTime was called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should update scroll position if appointment was added to invisible top area: minutes case", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: "week",
        height: 500
    });

    this.instance.getWorkSpaceScrollable().scrollBy(220);

    var appointment = { startDate: new Date(2015, 1, 9, 2), endDate: new Date(2015, 1, 9, 2, 30), text: "caption" },
        workSpace = this.instance.getWorkSpace(),
        scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        this.instance.showAppointmentPopup(appointment);
        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.ok(scrollToTimeSpy.calledOnce, "scrollToTime was called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test("Scheduler should update scroll position if appointment was added to invisible bottom area: minutes case", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: "week",
        height: 500,
        showAllDayPanel: false
    });

    this.instance.getWorkSpaceScrollable().scrollBy(140);

    var appointment = { startDate: new Date(2015, 1, 9, 5, 45), endDate: new Date(2015, 1, 9, 6, 30), text: "caption" },
        workSpace = this.instance.getWorkSpace(),
        scrollToTimeSpy = sinon.spy(workSpace, "scrollToTime");

    try {
        this.instance.showAppointmentPopup(appointment);
        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        assert.ok(scrollToTimeSpy.calledOnce, "scrollToTime was called");
    } finally {
        workSpace.scrollToTime.restore();
    }
});

// TODO: update editors in popup
QUnit.test("Update appointment", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });

    this.clock.tick();

    var updateAppointment = this.instance.updateAppointment,
        spy = sinon.spy(noop),
        updatedItem = this.tasks[0];
    this.instance.updateAppointment = spy;
    try {
        this.instance.showAppointmentPopup(updatedItem);

        $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick");

        tooltip.hide();

        assert.ok(spy.calledOnce, "Update method is called");
        assert.deepEqual(spy.getCall(0).args[0], updatedItem, "Target item is correct");
        assert.deepEqual(spy.getCall(0).args[1], updatedItem, "New data is correct");
    } finally {
        this.instance.updateAppointment = updateAppointment;
    }
});

QUnit.test("updateAppointment method should be called when task was resized", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, editing: true });

    this.clock.tick();

    var updateAppointment = this.instance._updateAppointment,
        spy = sinon.spy(noop),
        oldItem = this.tasks[0];

    this.instance._updateAppointment = spy;

    var cellHeight = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(0).outerHeight(),
        hourHeight = cellHeight * 2;

    try {
        var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-bottom").eq(0)).start();
        pointer.dragStart().drag(0, hourHeight).dragEnd();

        assert.ok(spy.calledOnce, "Update method is called");
        assert.deepEqual(spy.getCall(0).args[0], oldItem, "Target item is correct");
        assert.deepEqual(spy.getCall(0).args[1], $.extend(true, oldItem, { endDate: new Date(2015, 1, 9, 3, 0) }), "New data is correct");
    } finally {
        this.instance._updateAppointment = updateAppointment;
    }
});

QUnit.test("updateAppointment method should be called with right args when task was resized, timelineMonth view", function(assert) {
    var data = [{
        text: "Task 1",
        startDate: new Date(2015, 1, 2, 1),
        endDate: new Date(2015, 1, 2, 2)
    }];

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, editing: true, views: ["timelineMonth"], currentView: "timelineMonth" });

    this.clock.tick();

    var updateAppointment = this.instance._updateAppointment,
        spy = sinon.spy(noop),
        oldItem = data[0];

    this.instance._updateAppointment = spy;

    var cellWidth = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(0).outerWidth();

    try {
        var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-right").eq(0)).start();
        pointer.dragStart().drag(cellWidth, 0).dragEnd();

        assert.ok(spy.calledOnce, "Update method is called");
        assert.deepEqual(spy.getCall(0).args[0], oldItem, "Target item is correct");
        assert.deepEqual(spy.getCall(0).args[1], $.extend(true, oldItem, { endDate: new Date(2015, 1, 3, 2, 0) }), "New data is correct");
    } finally {
        this.instance._updateAppointment = updateAppointment;
    }
});

QUnit.test("Non-grid-aligned appointments should be resized correctly", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        editing: true,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 1),
            endDate: new Date(2015, 1, 9, 1, 20)
        }]
    });

    var cellHeight = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();

    var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-bottom").eq(0)).start();
    pointer.dragStart().drag(0, cellHeight).dragEnd();

    assert.deepEqual(this.instance.option("dataSource")[0].endDate, new Date(2015, 1, 9, 2), "End date is OK");
});

QUnit.test("Non-grid-aligned appointments should be resized correctly, when startDayHour is set", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        editing: true,
        startDayHour: 9,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 10, 25),
            endDate: new Date(2015, 1, 9, 11)
        }]
    });

    var cellHeight = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();

    var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-top").eq(0)).start();
    pointer.dragStart().drag(0, -3 * cellHeight).dragEnd();

    assert.deepEqual(this.instance.option("dataSource")[0].startDate, new Date(2015, 1, 9, 9), "Start date is OK");
});

QUnit.test("Non-grid-aligned appointments should be resized correctly, when endDayHour is set", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        editing: true,
        endDayHour: 15,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 13),
            endDate: new Date(2015, 1, 9, 14, 25)
        }]
    });

    var cellHeight = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();

    var pointer = pointerMock(this.instance.$element().find(".dx-resizable-handle-bottom").eq(0)).start();
    pointer.dragStart().drag(0, cellHeight).dragEnd();

    assert.deepEqual(this.instance.option("dataSource")[0].endDate, new Date(2015, 1, 9, 15), "End date is OK");
});

// TODO: also need test when task is dragging outside the area. updated dates should be equal to old dates
QUnit.test("Task dragging", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, editing: true });

    this.clock.tick();

    var updatedItem = {
        text: "Task 1",
        startDate: new Date(2015, 1, 9, 2, 30),
        endDate: new Date(2015, 1, 9, 3, 30),
        allDay: false
    };

    $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0).trigger(dragEvents.start);
    $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(5).trigger(dragEvents.enter);
    $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0).trigger(dragEvents.end);

    var dataSourceItem = this.instance.option("dataSource").items()[0];

    this.clock.tick();
    assert.equal(dataSourceItem.text, updatedItem.text, "New data is correct");
    assert.equal(dataSourceItem.allDay, updatedItem.allDay, "New data is correct");
    assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, "New data is correct");
    assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, "New data is correct");
});

[false, true].forEach(function(forceIsoDateParsing) {
    QUnit.test("Drag task that contains timestamps when forceIsoDateParsing is " + forceIsoDateParsing, function(assert) {
        var defaultForceIsoDateParsing = config().forceIsoDateParsing;


        try {
            config().forceIsoDateParsing = forceIsoDateParsing;

            var data = new DataSource({
                store: [
                    {
                        text: "Task 1",
                        startDate: new Date(2015, 1, 9).getTime(),
                        endDate: new Date(2015, 1, 9, 1).getTime()
                    }
                ]
            });

            this.createInstance({
                currentDate: new Date(2015, 1, 9),
                dataSource: data,
                editing: true,
                allDayExpr: "AllDay"
            });

            this.clock.tick();

            var updatedItem = {
                text: "Task 1",
                startDate: forceIsoDateParsing ? new Date(2015, 1, 9, 2, 30).getTime() : new Date(2015, 1, 9, 2, 30),
                endDate: forceIsoDateParsing ? new Date(2015, 1, 9, 3, 30).getTime() : new Date(2015, 1, 9, 3, 30),
                AllDay: false
            };

            $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0).trigger(dragEvents.start);
            $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(5).trigger(dragEvents.enter);
            $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0).trigger(dragEvents.end);

            this.clock.tick();

            var dataSourceItem = this.instance.option("dataSource").items()[0];

            assert.equal(dataSourceItem.text, updatedItem.text, "New data is correct");
            assert.equal(dataSourceItem.AllDay, updatedItem.AllDay, "New data is correct");
            assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, "New data is correct");
            assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, "New data is correct");
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });
});

QUnit.test("Appointment should have correct position while vertical dragging", function(assert) {
    this.createInstance({
        height: 500,
        editing: true,
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 7),
            endDate: new Date(2015, 1, 9, 7, 30)
        }]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        scrollable = this.instance.getWorkSpace().$element().find(".dx-scrollable").dxScrollable("instance"),
        allDayHeight = this.instance.$element().find(".dx-scheduler-all-day-table-cell").first().outerHeight(),
        scrollDistance = 400,
        dragDistance = -300,
        headerPanelHeight = this.instance.$element().find(".dx-scheduler-header-panel").outerHeight(true);

    scrollable.scrollBy(scrollDistance);

    var pointer = pointerMock($appointment).start(),
        startPosition = translator.locate($appointment);

    pointer.dragStart().drag(0, dragDistance);

    var currentPosition = translator.locate($appointment);

    assert.roughEqual(startPosition.top, currentPosition.top + scrollDistance - allDayHeight - dragDistance - headerPanelHeight, 1, "Appointment position is correct");
    pointer.dragEnd();
});

QUnit.test("Appointment should have correct position while vertical dragging, crossScrollingEnabled = true", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 6, 10),
        editing: true,
        views: ["month"],
        currentView: "month",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 6, 10, 0),
            endDate: new Date(2015, 6, 10, 0, 30),
            ownerId: 1
        }],
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" },
                    { id: 3, text: "three" },
                    { id: 4, text: "four" }
                ]
            }
        ],
        width: 800,
        crossScrollingEnabled: true
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        dragDistance = -50,
        headerPanelHeight = this.instance.$element().find(".dx-scheduler-header-panel").outerHeight(true);

    var pointer = pointerMock($appointment).start(),
        startPosition = translator.locate($appointment);

    pointer.dragStart().drag(0, dragDistance);

    var currentPosition = translator.locate($appointment);

    assert.roughEqual(startPosition.top, currentPosition.top - headerPanelHeight - dragDistance, 1.001, "Appointment position is correct");
    pointer.dragEnd();
});

QUnit.test("Appointment should be dragged correctly in grouped timeline (T739132)", function(assert) {
    let data = new DataSource({
        store: [{
            "text": "Google AdWords Strategy",
            "ownerId": [2],
            "startDate": new Date(2017, 4, 2, 9, 0),
            "endDate": new Date(2017, 4, 2, 10, 30),
            "priority": 1
        }]
    });

    let priorityData = [
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
        dataSource: data,
        views: ["timelineMonth"],
        currentView: "timelineMonth",
        currentDate: new Date(2017, 4, 1),
        startDayHour: 8,
        endDayHour: 20,
        cellDuration: 60,
        editing: true,
        groups: ["priority"],
        resources: [{
            fieldExpr: "priority",
            allowMultiple: false,
            dataSource: priorityData,
            label: "Priority"
        }]
    });

    this.clock.tick();

    let updatedItem = {
        "text": "Google AdWords Strategy",
        "ownerId": [2],
        "startDate": new Date(2017, 4, 1, 8, 0),
        "endDate": new Date(2017, 4, 1, 9, 30),
        "priority": 1
    };

    $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0).trigger(dragEvents.start);
    $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0).trigger(dragEvents.enter);
    $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0).trigger(dragEvents.end);

    let dataSourceItem = this.instance.option("dataSource").items()[0];

    this.clock.tick();
    assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, "New data is correct");
    assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, "New data is correct");
});

QUnit.test("Appointment should have correct position while dragging from group", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 6, 10),
        editing: true,
        views: ["week"],
        currentView: "week",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 6, 10, 0),
            endDate: new Date(2015, 6, 10, 0, 30),
            ownerId: { id: 1 }
        }],
        groups: ["ownerId.id"],
        resources: [
            {
                field: "ownerId.id",
                allowMultiple: false,
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            }
        ],
        width: 800
    });
    var $appointment = $(this.instance.$element().find("." + APPOINTMENT_CLASS)).eq(0);

    $appointment.trigger(dragEvents.start);
    $(this.instance.$element().find("." + DATE_TABLE_CELL_CLASS)).eq(7).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.end);

    this.clock.tick();
    var appointmentData = dataUtils.data(this.instance.$element().find("." + APPOINTMENT_CLASS).get(0), "dxItemData");

    assert.deepEqual(appointmentData.startDate, new Date(2015, 6, 5, 0), "Start date is correct");
    assert.deepEqual(appointmentData.endDate, new Date(2015, 6, 5, 0, 30), "End date is correct");
    assert.deepEqual(appointmentData.ownerId, { id: [2] }, "Resources is correct");
});

QUnit.test("getWorkSpaceScrollableScrollTop should be called while dragging from allDay panel, vertical grouping", function(assert) {
    var spy = sinon.spy();
    this.createInstance({
        currentDate: new Date(2015, 6, 10),
        editing: true,
        views: [{
            type: "week",
            name: "Week",
            groupOrientation: "vertical"
        }],
        currentView: "week",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 6, 7, 10),
            endDate: new Date(2015, 6, 7, 10, 30),
            allDay: true,
            ownerId: { id: 2 }
        }],
        startDayHour: 9,
        endDayHour: 12,
        groups: ["ownerId.id"],
        resources: [
            {
                field: "ownerId.id",
                allowMultiple: false,
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            }
        ],
        width: 800,
        height: 500
    });

    var getScrollableOffset = this.instance.getWorkSpaceScrollableScrollTop;
    this.instance.getWorkSpaceScrollableScrollTop = spy;

    try {
        var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);
        var pointer = pointerMock($appointment).start();
        pointer.dragStart().drag(0, 100);

        assert.ok(spy.calledOnce, "getWorkSpaceScrollableScrollTop was called");
        assert.strictEqual(spy.getCall(0).args[0], true, "getWorkSpaceScrollableScrollTop was called with right args");

        pointer.dragEnd();
    } finally {
        this.instance.getWorkSpaceScrollableScrollTop = getScrollableOffset;
    }
});

QUnit.test("Appointment should have correct position while dragging from group, vertical grouping", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 6, 10),
        editing: true,
        views: [{
            type: "week",
            name: "Week",
            groupOrientation: "vertical"
        }],
        currentView: "week",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 6, 7, 10),
            endDate: new Date(2015, 6, 7, 10, 30),
            ownerId: { id: 2 },
            roomId: { id: 1 }
        }],
        startDayHour: 9,
        endDayHour: 12,
        groups: ["ownerId.id", "roomId.id"],
        resources: [
            {
                field: "ownerId.id",
                allowMultiple: false,
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            },
            {
                field: "roomId.id",
                allowMultiple: false,
                dataSource: [
                    { id: 1, text: "room one" },
                    { id: 2, text: "room two" }
                ]
            }
        ],
        width: 800
    });
    var $appointment = $(this.instance.$element().find("." + APPOINTMENT_CLASS)).eq(0);

    $appointment.trigger(dragEvents.start);

    var startPosition = translator.locate($appointment);
    assert.roughEqual(startPosition.top, 850, 1.5, "Start position is correct");
    assert.roughEqual(startPosition.left, 406, 1.5, "Start position is correct");

    $(this.instance.$element().find("." + DATE_TABLE_CELL_CLASS)).eq(7).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.end);

    this.clock.tick();
    var appointmentData = dataUtils.data(this.instance.$element().find("." + APPOINTMENT_CLASS).get(0), "dxItemData");

    assert.deepEqual(appointmentData.startDate, new Date(2015, 6, 5, 9, 30), "Start date is correct");
    assert.deepEqual(appointmentData.endDate, new Date(2015, 6, 5, 10, 0), "End date is correct");
    assert.deepEqual(appointmentData.ownerId, { id: [1] }, "Resources is correct");
});

QUnit.test("Appointment should have correct position while dragging into allDay panel, vertical grouping", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 6, 10),
        editing: true,
        views: [{
            type: "week",
            name: "Week",
            groupOrientation: "vertical"
        }],
        currentView: "week",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 6, 7, 10),
            endDate: new Date(2015, 6, 7, 10, 30),
            ownerId: { id: 2 }
        }],
        startDayHour: 9,
        endDayHour: 12,
        groups: ["ownerId.id"],
        resources: [
            {
                field: "ownerId.id",
                allowMultiple: false,
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            }
        ],
        width: 800
    });
    var $appointment = $(this.instance.$element().find("." + APPOINTMENT_CLASS)).eq(0);

    $appointment.trigger(dragEvents.start);

    var startPosition = translator.locate($appointment);
    assert.roughEqual(startPosition.top, 500, 1.5, "Start position is correct");
    assert.roughEqual(startPosition.left, 370, 1.5, "Start position is correct");

    $(this.instance.$element().find(".dx-scheduler-all-day-table-cell")).eq(11).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.end);

    this.clock.tick();
    var appointmentData = dataUtils.data(this.instance.$element().find("." + APPOINTMENT_CLASS).get(0), "dxItemData");

    assert.deepEqual(appointmentData.startDate, new Date(2015, 6, 9, 0), "Start date is correct");
    assert.deepEqual(appointmentData.endDate, new Date(2015, 6, 9, 0, 30), "End date is correct");
    assert.deepEqual(appointmentData.ownerId, { id: [2] }, "Resources is correct");
});

QUnit.test("Appointment should be rendered correctly after changing view (T593699)", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 6, 10),
        views: ["month", "week"],
        currentView: "month",
        maxAppointmentsPerCell: "auto",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 6, 10, 0),
            endDate: new Date(2015, 6, 10, 0, 30),
            ownerId: { id: 1 }
        }],
        height: 300
    });

    this.instance.option("currentView", "week");
    assert.notOk(this.instance.$element().find(".dx-scheduler-appointment").eq(0).data("dxItemData").settings, "Item hasn't excess settings");
});

QUnit.test("Appointment should push correct data to the onAppointmentUpdating event on changing group by drag'n'drop ", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        editing: true,
        views: ["workWeek"],
        currentView: "workWeek",
        dataSource: [{
            text: "Test appointment",
            priorityId: 1,
            startDate: new Date(2015, 4, 25, 14, 30),
            endDate: new Date(2015, 4, 25, 15, 30)
        }],
        groups: ["priorityId"],
        resources: [
            {
                fieldExpr: "priorityId",
                allowMultiple: false,
                dataSource: [
                    { text: "Low Priority", id: 1 },
                    { text: "High Priority", id: 2 }
                ],
                label: "Priority"
            }
        ],
        onAppointmentUpdating: function(e) {
            assert.equal(e.oldData.priorityId, 1, "Appointment was located in the first group");
            assert.equal(e.newData.priorityId, 2, "Appointment located in the second group now");
        },
        width: 800
    });
    var $appointment = $(this.instance.$element().find("." + APPOINTMENT_CLASS)).eq(0);

    $appointment.trigger(dragEvents.start);
    $(this.instance.$element().find("." + DATE_TABLE_CELL_CLASS)).eq(7).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.end);

    assert.expect(2);
    this.clock.tick();
});

QUnit.test("Appointments should be repainted if the 'crossScrollingEnabled' is changed", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 6, 10),
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 6, 10, 0),
            endDate: new Date(2015, 6, 10, 4),
            ownerId: 1
        }],
        crossScrollingEnabled: true
    });

    var appointmentsInst = this.instance.getAppointmentsInstance(),
        items = appointmentsInst.option("items");

    this.instance.option("crossScrollingEnabled", false);

    assert.notDeepEqual(appointmentsInst.option("items"), items, "Appointments are repainted");
});

QUnit.test("Appointment should have correct position while horizontal dragging", function(assert) {
    if(skipTestOnMobile(assert)) return;
    this.createInstance({
        height: 500,
        editing: true,
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 1),
            endDate: new Date(2015, 1, 9, 1, 30)
        }]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        dragDistance = 150,
        timePanelWidth = this.instance.$element().find(".dx-scheduler-time-panel").outerWidth(true);


    var pointer = pointerMock($appointment).start(),
        startPosition = translator.locate($appointment);

    pointer.dragStart().drag(dragDistance, 0);

    var currentPosition = translator.locate($appointment);

    assert.roughEqual(startPosition.left, currentPosition.left - dragDistance + timePanelWidth, 2, "Appointment position is correct");
    pointer.dragEnd();
});

QUnit.test("Appointment should not twitch on drag start with horizontal dragging", function(assert) {
    if(skipTestOnMobile(assert)) return;
    let resourcesData = [
        {
            text: "Samantha Bright",
            id: 1,
            color: "#cb6bb2"
        }, {
            text: "John Heart",
            id: 2,
            color: "#56ca85"
        }
    ];

    let priorityData = [
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

    let data = [{
        "text": "Google AdWords Strategy",
        "ownerId": [2],
        "startDate": new Date(2017, 4, 1, 9, 0),
        "endDate": new Date(2017, 4, 1, 10, 30),
        "priority": 1
    }, {
        "text": "New Brochures",
        "ownerId": [1],
        "startDate": new Date(2017, 4, 1, 11, 30),
        "endDate": new Date(2017, 4, 1, 14, 15),
        "priority": 2
    }];

    this.createInstance({
        dataSource: data,
        views: ["timelineDay"],
        currentView: "timelineDay",
        currentDate: new Date(2017, 4, 1),
        firstDayOfWeek: 0,
        startDayHour: 8,
        endDayHour: 20,
        cellDuration: 60,
        groups: ["priority"],
        resources: [{
            fieldExpr: "ownerId",
            allowMultiple: true,
            dataSource: resourcesData,
            label: "Owner",
            useColorAsDefault: true
        }, {
            fieldExpr: "priority",
            allowMultiple: false,
            dataSource: priorityData,
            label: "Priority"
        }],
        height: 400
    });
    let $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        dragDistance = 50;

    const defaultPosition = translator.locate($appointment);
    let pointer = pointerMock($appointment).start();
    pointer.dragStart().drag(dragDistance, 0);
    let startPosition = translator.locate($appointment);
    assert.roughEqual(defaultPosition.left, startPosition.left - dragDistance, 1, "Appointment start position does not twitch after drag start");
});

QUnit.test("Appointment should have correct position while horizontal dragging, crossScrollingEnabled = true (T732885)", function(assert) {
    if(skipTestOnMobile(assert)) return;
    this.createInstance({
        height: 500,
        editing: true,
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 1),
            endDate: new Date(2015, 1, 9, 1, 30)
        }],
        crossScrollingEnabled: true,
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        dragDistance = 150;

    let pointer = pointerMock($appointment).start(),
        startPosition = translator.locate($appointment);

    pointer.dragStart().drag(dragDistance, 0);

    var currentPosition = translator.locate($appointment);

    assert.roughEqual(startPosition.left, currentPosition.left - dragDistance, 2, "Appointment position is correct");
    pointer.dragEnd();
});

QUnit.test("Appointment should have correct position while horizontal dragging in scrolled date table, crossScrollingEnabled = true", function(assert) {
    if(skipTestOnMobile(assert)) return;
    this.createInstance({
        height: 500,
        width: 800,
        editing: true,
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        groups: ["room"],
        resources: [
            { field: "room", dataSource: [{ id: 1, text: "1" }, { id: 2, text: "2" }, { id: 3, text: "3" }] }
        ],
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 1),
            endDate: new Date(2015, 1, 9, 1, 30),
            room: 2
        }],
        crossScrollingEnabled: true
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        scrollable = this.instance.getWorkSpace().$element().find(".dx-scrollable").dxScrollable("instance"),
        scrollDistance = 400,
        dragDistance = 100;

    scrollable.scrollTo({ left: scrollDistance, top: 0 });

    var pointer = pointerMock($appointment).start(),
        startPosition = translator.locate($appointment);
    pointer.dragStart().drag(dragDistance, 0);

    var currentPosition = translator.locate($appointment);
    assert.equal(startPosition.left, currentPosition.left + scrollDistance - dragDistance, "Appointment position is correct");
    pointer.dragEnd();
});

QUnit.test("Appointment should not be updated if it is dropped to the initial cell (week view)", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        firstDayOfWeek: 0,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 0, 7),
            endDate: new Date(2015, 1, 9, 0, 37)
        }]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);
    $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(1).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.start);
    $appointment.trigger(dragEvents.end);

    this.clock.tick();
    var appointmentData = dataUtils.data(this.instance.$element().find("." + APPOINTMENT_CLASS).get(0), "dxItemData");

    assert.deepEqual(appointmentData.startDate, new Date(2015, 1, 9, 0, 7), "Start date is correct");
    assert.deepEqual(appointmentData.endDate, new Date(2015, 1, 9, 0, 37), "End date is correct");
});

QUnit.test("Appointment should not be updated if it is dropped to the initial cell (month view)", function(assert) {

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        views: ["month"],
        currentView: "month",
        firstDayOfWeek: 0,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 8, 7),
            endDate: new Date(2015, 1, 9, 8, 37)
        }]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);
    $appointment.trigger(dragEvents.start);
    $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(8).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.end);

    this.clock.tick();

    var appointmentData = dataUtils.data(this.instance.$element().find("." + APPOINTMENT_CLASS).get(0), "dxItemData");

    assert.deepEqual(appointmentData.startDate, new Date(2015, 1, 9, 8, 7), "Start date is correct");
    assert.deepEqual(appointmentData.endDate, new Date(2015, 1, 9, 8, 37), "End date is correct");
});

QUnit.test("Appointment should be updated correctly if it is dropped to the neighbor cell (month view)", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        views: ["month"],
        editing: true,
        currentView: "month",
        firstDayOfWeek: 0,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 1, 9, 8, 0),
            endDate: new Date(2015, 1, 9, 9, 0),
        }]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);
    $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(9).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.start);
    $appointment.trigger(dragEvents.end);

    this.clock.tick();
    var appointmentData = dataUtils.data(this.instance.$element().find("." + APPOINTMENT_CLASS).get(0), "dxItemData");

    assert.deepEqual(appointmentData.startDate, new Date(2015, 1, 10, 8, 0), "Start date is correct");
    assert.deepEqual(appointmentData.endDate, new Date(2015, 1, 10, 9, 0), "End date is correct");
});

QUnit.test("Dropping appointment to the neighbor cell (month view) with predefined start & end day hours", function(assert) {
    this.createInstance({
        views: ["month"],
        currentView: "month",
        editing: true,
        currentDate: new Date(2015, 4, 25),
        firstDayOfWeek: 0,
        endDayHour: 19,
        startDayHour: 8,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 4, 13, 8),
            endDate: new Date(2015, 4, 13, 9, 30)
        }]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);
    $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(16).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.start);
    $appointment.trigger(dragEvents.end);

    this.clock.tick();
    var appointmentData = dataUtils.data(this.instance.$element().find("." + APPOINTMENT_CLASS).get(0), "dxItemData");

    assert.deepEqual(appointmentData.startDate, new Date(2015, 4, 12, 8), "Start date is correct");
    assert.deepEqual(appointmentData.endDate, new Date(2015, 4, 12, 9, 30), "End date is correct");
});

QUnit.test("Dropping appointment should keep predefined hours (month view)", function(assert) {
    this.createInstance({
        views: ["month"],
        currentView: "month",
        editing: true,
        currentDate: new Date(2015, 4, 25),
        firstDayOfWeek: 0,
        endDayHour: 19,
        startDayHour: 8,
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 4, 13, 10),
            endDate: new Date(2015, 4, 13, 17)
        }]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);
    $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(16).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.start);
    $appointment.trigger(dragEvents.end);

    this.clock.tick();
    var appointmentData = dataUtils.data(this.instance.$element().find("." + APPOINTMENT_CLASS).get(0), "dxItemData");

    assert.deepEqual(appointmentData.startDate, new Date(2015, 4, 12, 10), "Start date is correct");
    assert.deepEqual(appointmentData.endDate, new Date(2015, 4, 12, 17), "End date is correct");
});

QUnit.test("Appointment should be returned back if an error occurs during drag (T453486)", function(assert) {
    this.createInstance({
        views: ["month"],
        currentView: "month",
        editing: true,
        currentDate: new Date(2015, 4, 25),
        firstDayOfWeek: 0,
        endDayHour: 19,
        startDayHour: 8,
        dataSource: {
            load: function() {
                return [{
                    text: "a",
                    startDate: new Date(2015, 4, 13, 8),
                    endDate: new Date(2015, 4, 13, 9, 30)
                }];
            },
            update: function() {
                throw new Error("An error occured");
            }
        }
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);
    var initialPosition = $appointment.position();

    assert.throws(function() {
        $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(16).trigger(dragEvents.enter);
        $appointment.trigger(dragEvents.start);
        $appointment.trigger(dragEvents.end);
    }, function(err) {
        var updatedPosition = this.instance.$element().find("." + APPOINTMENT_CLASS).eq(0).position();

        assert.equal(updatedPosition.top, initialPosition.top, "Top is OK");
        assert.equal(updatedPosition.left, initialPosition.left, "Left is OK");
        assert.equal(err.message, "An error occured", "Error message is OK");

        return true;
    }.bind(this));
});

QUnit.test("Appointment should be returned back if the 'update' method rejects deferred during drag (T453486)", function(assert) {
    this.createInstance({
        views: ["month"],
        currentView: "month",
        editing: true,
        currentDate: new Date(2015, 4, 25),
        firstDayOfWeek: 0,
        endDayHour: 19,
        startDayHour: 8,
        dataSource: {
            load: function() {
                return [{
                    text: "a",
                    startDate: new Date(2015, 4, 13, 8),
                    endDate: new Date(2015, 4, 13, 9, 30)
                }];
            },
            update: function() {
                return $.Deferred().reject("An error occured");
            }
        }
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);
    var initialPosition = $appointment.position();

    $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(16).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.start);
    $appointment.trigger(dragEvents.end);

    var updatedPosition = this.instance.$element().find("." + APPOINTMENT_CLASS).eq(0).position();

    assert.equal(updatedPosition.top, initialPosition.top, "Top is OK");
    assert.equal(updatedPosition.left, initialPosition.left, "Left is OK");
});

QUnit.test("Task should be placed in right group", function(assert) {
    var data = new DataSource({
        store: [{ text: "Item 1", ownerId: 2, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) }]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        groups: ["ownerId"],
        resources: [{
            field: "ownerId",
            dataSource: [{ id: 1, text: "John" }, { id: 2, text: "Mike" }]
        }],
        width: 700
    });

    var workSpace = this.instance.getWorkSpace(),
        spy = sinon.spy(workSpace, "getCoordinatesByDateInGroup");

    this.instance.option("dataSource", data);

    var itemShift = ($(".dx-scheduler-date-table").outerWidth() - $(".dx-scheduler-time-panel").outerWidth()) * 0.5 + $(".dx-scheduler-time-panel").outerWidth();

    try {
        var value = spy.returnValues[0];
        assert.roughEqual(value[0].top, 0, 1.001, "Top is OK");
        assert.roughEqual(value[0].left, itemShift, 1.001, "Left is OK");
    } finally {
        workSpace.getCoordinatesByDateInGroup.restore();
    }
});

QUnit.test("Tasks should have a right color", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 2, 18),
        dataSource: [
            {
                id: 1,
                text: "Item 1",
                roomId: [1, 2],
                ownerId: [1, 2],
                managerId: 1,
                startDate: new Date(2015, 2, 18),
                endDate: new Date(2015, 2, 18, 0, 30)
            },
            {
                id: 2,
                text: "Item 2",
                roomId: 1,
                ownerId: 2,
                managerId: 1,
                startDate: new Date(2015, 2, 18),
                endDate: new Date(2015, 2, 18, 0, 30)
            }
        ],
        groups: ["roomId", "ownerId"],
        resources: [
            {
                field: "roomId",
                allowMultiple: true,
                dataSource: [
                    { id: 1, text: "Room 1", color: "#ff0000" },
                    { id: 2, text: "Room 2", color: "#0000ff" }
                ]
            },
            {
                fieldExpr: "ownerId",
                allowMultiple: true,
                dataSource: [
                    { id: 1, text: "John", color: "#cb2824" },
                    { id: 2, text: "Mike", color: "#cb7d7b" }
                ]
            },
            {
                field: "managerId",
                dataSource: [
                    { id: 1, text: "mr. Smith", color: "#CB6BB2" },
                    { id: 2, text: "mr. Bale", color: "#CB289F" }
                ]
            }
        ]
    });

    var tasks = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.equal(this.getAppointmentColor(tasks.eq(0)), "#cb2824", "Color is OK");
    assert.equal(this.getAppointmentColor(tasks.eq(1)), "#cb7d7b", "Color is OK");
    assert.equal(this.getAppointmentColor(tasks.eq(2)), "#cb2824", "Color is OK");
    assert.equal(this.getAppointmentColor(tasks.eq(3)), "#cb7d7b", "Color is OK");
    assert.equal(this.getAppointmentColor(tasks.eq(4)), "#cb7d7b", "Color is OK");
});

QUnit.test("Ungrouped tasks should have a right color(via the 'useColorAsDefault' field)", function(assert) {
    try {
        var data = new DataSource({
            store: [
                { text: "Item 1", ownerId: 2, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) },
                { text: "Item 2", startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) }
            ]
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            resources: [{
                field: "ownerId",
                useColorAsDefault: true,
                dataSource: [{ id: 1, text: "John", color: "#ff0000" }, { id: 2, text: "Mike", color: "#0000ff" }]
            }],
            dataSource: data,
            width: 700
        });

        var tasks = this.instance.$element().find("." + APPOINTMENT_CLASS);
        assert.equal(this.getAppointmentColor(tasks.eq(0)), "#0000ff", "Color is OK");
        assert.equal($.inArray(this.getAppointmentColor(tasks.eq(1)), ["#ff0000", "#0000ff"]), -1, "Color is OK");
    } finally {
        $(".dynamic-styles").remove();
    }
});

QUnit.test("Grouped recurrence tasks should have a right color", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 11, 10),
        currentView: "month",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 11, 12),
            endDate: new Date(2015, 11, 14),
            ownerId: [1, 2],
            recurrenceRule: "FREQ=DAILY;INTERVAL=1;COUNT=2",
            firstDayOfWeek: 1
        }],
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "one", color: "#ff0000" },
                    { id: 2, text: "two", color: "#0000ff" }
                ]
            }
        ]
    });

    var task = this.instance.$element().find("." + APPOINTMENT_CLASS);
    assert.equal(this.getAppointmentColor(task.eq(0)), "#ff0000", "Color is OK");
    assert.equal(this.getAppointmentColor(task.eq(2)), "#0000ff", "Color is OK");
});

QUnit.test("Task with resources should contain a right data attr", function(assert) {
    var data = new DataSource({
        store: [
            { text: "Item 1", ownerId: 2, roomId: 1, startDate: new Date(2015, 1, 8), endDate: new Date(2015, 1, 8, 0, 30) },
            { text: "Item 2", ownerId: [1, 2], startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) },
            { text: "Item 3", startDate: new Date(2015, 1, 9) }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        resources: [{
            field: "ownerId",
            dataSource: [{ id: 1, text: "a", color: "red" }, { id: 2, text: "b", color: "green" }],
        }, {
            field: "roomId",
            dataSource: [{ id: 1, text: "c", color: "blue" }, { id: 2, text: "d", color: "white" }]
        }],
        dataSource: data,
        width: 700
    });

    var tasks = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.ok(tasks.eq(0).attr("data-ownerid-2"));
    assert.ok(tasks.eq(0).attr("data-roomid-1"));

    assert.ok(tasks.eq(1).attr("data-ownerid-1"));
    assert.ok(tasks.eq(1).attr("data-ownerid-2"));

    assert.ok(!tasks.eq(2).attr("data-ownerid-1"));
    assert.ok(!tasks.eq(2).attr("data-ownerid-2"));
    assert.ok(!tasks.eq(2).attr("data-roomid-1"));
    assert.ok(!tasks.eq(2).attr("data-roomid-2"));
});

QUnit.test("Task with resources should contain a right data attr if field contains a space", function(assert) {
    var data = new DataSource({
        store: [
            { text: "Item 1", "owner  Id": 2, startDate: new Date(2015, 1, 8), endDate: new Date(2015, 1, 8, 0, 30) },
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        currentView: "week",
        resources: [{
            field: "owner  Id",
            dataSource: [{ id: 1, text: "a", color: "red" }, { id: 2, text: "b", color: "green" }],
        }],
        dataSource: data,
        width: 700
    });

    var tasks = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.ok(tasks.eq(0).attr("data-owner__32____32__id-2"));
});

QUnit.test("Appointment width should depend on cell width", function(assert) {

    this.createInstance({
        currentDate: new Date(2015, 2, 18)
    });

    var workSpace = this.instance.getWorkSpace(),
        defaultGetCellWidthMethod = workSpace.getCellWidth,
        CELL_WIDTH = 777,
        offset = getOffset();

    workSpace.getCellWidth = function() {
        return CELL_WIDTH;
    };
    try {
        this.instance.option("dataSource", [
            { id: 1, text: "Item 1", startDate: new Date(2015, 2, 18), endDate: new Date(2015, 2, 18, 0, 30) }
        ]);

        assert.equal(this.instance.$element().find("." + APPOINTMENT_CLASS).first().outerWidth(), CELL_WIDTH - offset, "Appointment width is OK");

    } finally {
        workSpace.getCellWidth = defaultGetCellWidthMethod;
    }
});

QUnit.test("Appointments should be filtered correctly by end day hour when current date was changed", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 6),
        currentView: "week",
        endDayHour: 10,
        firstDayOfWeek: 1,
        dataSource: [
            {
                startDate: new Date(2015, 4, 7, 11)
            }
        ]
    });

    var $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 0, "There are not appointments");

    this.instance.option("currentDate", new Date(2015, 4, 7));

    $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 0, "There is one appointment");
});

QUnit.test("Multi-day appointments should be filtered correctly if it's time less than startDayHour", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 11, 14),
        currentView: "week",
        endDayHour: 10,
        startDayHour: 2,
        firstDayOfWeek: 1,
        dataSource: [
            {
                startDate: new Date(2015, 11, 14),
                endDate: new Date(2015, 11, 19),
                text: "Second shift",
                Status: { StatusId: 0 }
            }
        ]
    });

    var $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 1, "Appointment was rendered");
});

QUnit.test("Appointments should be cleared when currentDate option is changed", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 3, 16),
        firstDayOfWeek: 1,
        currentView: "week",
        dataSource: new DataSource({
            store: new CustomStore({
                load: function(options) {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([{
                            text: "b", allDay: true, startDate: new Date(2015, 3, 16), endDate: new Date(2015, 3, 16, 0, 30)
                        }, {
                            text: "a", startDate: new Date(2015, 3, 16), endDate: new Date(2015, 3, 16, 0, 30)
                        }]);
                    }, 300);

                    return d.promise();
                }
            })
        })
    });
    this.clock.tick(300);
    assert.strictEqual(this.instance.$element().find("." + APPOINTMENT_CLASS).length, 2);

    this.instance.option("currentDate", new Date(2015, 4, 6));
    this.clock.tick(300);

    assert.strictEqual(this.instance.$element().find("." + APPOINTMENT_CLASS).length, 0);

    this.instance.option("currentDate", new Date(2015, 3, 16));
    this.clock.tick(300);

    assert.equal(this.instance.$element().find("." + APPOINTMENT_CLASS).length, 2);
});

QUnit.test("Appointments should be cleared when startDayHour option is changed", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 3, 16),
        firstDayOfWeek: 1,
        currentView: "day",
        dataSource: new DataSource({
            store: new CustomStore({
                load: function(options) {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([{
                            text: "a", startDate: new Date(2015, 3, 16, 0), endDate: new Date(2015, 3, 16, 0, 30)
                        }, {
                            text: "b", startDate: new Date(2015, 3, 16, 3), endDate: new Date(2015, 3, 16, 3, 30)
                        }]);
                    }, 300);

                    return d.promise();
                }
            })
        })
    });
    this.clock.tick(300);
    assert.strictEqual(this.instance.$element().find("." + APPOINTMENT_CLASS).length, 2);

    this.instance.option("startDayHour", 2);
    this.clock.tick(300);

    assert.strictEqual(this.instance.$element().find("." + APPOINTMENT_CLASS).length, 1);

    this.instance.option("startDayHour", 0);
    this.clock.tick(300);

    assert.equal(this.instance.$element().find("." + APPOINTMENT_CLASS).length, 2);
});

QUnit.test("Appointments should be cleared when endDayHour option is changed", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 3, 16),
        firstDayOfWeek: 1,
        currentView: "day",
        dataSource: new DataSource({
            store: new CustomStore({
                load: function(options) {
                    var d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([{
                            text: "a", startDate: new Date(2015, 3, 16, 0), endDate: new Date(2015, 3, 16, 0, 30)
                        }, {
                            text: "b", startDate: new Date(2015, 3, 16, 3), endDate: new Date(2015, 3, 16, 3, 30)
                        }]);
                    }, 300);

                    return d.promise();
                }
            })
        })
    });
    this.clock.tick(300);
    assert.strictEqual(this.instance.$element().find("." + APPOINTMENT_CLASS).length, 2);

    this.instance.option("endDayHour", 2);
    this.clock.tick(300);

    assert.strictEqual(this.instance.$element().find("." + APPOINTMENT_CLASS).length, 1);

    this.instance.option("endDayHour", 10);
    this.clock.tick(300);

    assert.equal(this.instance.$element().find("." + APPOINTMENT_CLASS).length, 2);
});

QUnit.test("Month appointment inside grouped view should have a right resizable area", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 6, 10),
        editing: true,
        views: ["month"],
        currentView: "month",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 6, 10, 0),
            endDate: new Date(2015, 6, 10, 0, 30),
            ownerId: 1
        }, {
            text: "b",
            startDate: new Date(2015, 6, 10, 0),
            endDate: new Date(2015, 6, 10, 0, 30),
            ownerId: 2
        }],
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            }
        ]
    });

    var $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS),
        area1 = $appointments.eq(0).dxResizable("instance").option("area"),
        area2 = $appointments.eq(1).dxResizable("instance").option("area"),
        $cells = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS),
        halfOfCellWidth = 0.5 * $cells.eq(0).outerWidth();

    assert.roughEqual(area1.left, $cells.eq(0).offset().left - halfOfCellWidth, 1.001);
    assert.roughEqual(area1.right, $cells.eq(7).offset().left + halfOfCellWidth, 1.001);

    assert.roughEqual(area2.left, $cells.eq(7).offset().left - halfOfCellWidth, 1.001);
    assert.roughEqual(area2.right, $cells.eq(13).offset().left + halfOfCellWidth * 3, 1.001);
});

QUnit.test("Month appointment inside grouped view should have a right resizable area after horizontal scroll end", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 6, 10),
        views: ["month"],
        editing: true,
        currentView: "month",
        dataSource: [{
            text: "a",
            startDate: new Date(2015, 6, 10, 0),
            endDate: new Date(2015, 6, 10, 0, 30),
            ownerId: 1
        }],
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" },
                    { id: 3, text: "three" },
                    { id: 4, text: "four" }
                ]
            }
        ],
        width: 800,
        crossScrollingEnabled: true
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).first(),
        initialResizableAreaLeft = $appointment.dxResizable("instance").option("area").left,
        initialResizableAreaRight = $appointment.dxResizable("instance").option("area").right,
        scrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance"),
        scrollOffset = 100;

    scrollable.scrollTo({ left: scrollOffset, top: 0 });

    assert.equal($appointment.dxResizable("instance").option("area").left, initialResizableAreaLeft - scrollOffset);
    assert.equal($appointment.dxResizable("instance").option("area").right, initialResizableAreaRight - scrollOffset);
});

QUnit.test("Rival appointments should have correct positions on month view, rtl mode", function(assert) {
    this.createInstance({
        rtlEnabled: true,
        currentDate: new Date(2015, 2, 4),
        views: ["month"],
        currentView: "month",
        firstDayOfWeek: 1,
        dataSource: [
            { startDate: new Date(2015, 2, 4), endDate: new Date(2015, 2, 7), text: "long" },
            { startDate: new Date(2015, 2, 5), endDate: new Date(2015, 2, 5, 1), text: "short" }]
    });

    var $longAppointment = this.instance.$element().find("." + APPOINTMENT_CLASS).eq(0),
        $shortAppointment = this.instance.$element().find("." + APPOINTMENT_CLASS).eq(1);

    assert.notEqual($longAppointment.position().top, $shortAppointment.position().top, "Appointments positions are correct");
});

QUnit.test("DropDown appointment button should have correct coordinates", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        views: ["month"],
        width: 840,
        currentView: "month",
        firstDayOfWeek: 1
    });

    sinon.stub(this.instance.getRenderingStrategyInstance(), "_getMaxNeighborAppointmentCount").returns(4);

    this.instance.option("dataSource", [
        { startDate: new Date(2015, 2, 4), text: "a", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "b", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "c", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "d", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "e", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "f", endDate: new Date(2015, 2, 4, 0, 30) }
    ]);

    var $dropDownButton = this.instance.$element().find(".dx-scheduler-dropdown-appointments");

    assert.equal($dropDownButton.length, 0, "DropDown button has not been rendered yet");

    this.instance.addAppointment({ startDate: new Date(2015, 2, 4), text: "d", endDate: new Date(2015, 2, 4, 0, 30) });

    $dropDownButton = this.instance.$element().find(".dx-scheduler-dropdown-appointments");
    var buttonCoordinates = translator.locate($dropDownButton),
        expectedCoordinates = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(9).position();

    assert.equal($dropDownButton.length, 1, "DropDown button is rendered");
    assert.roughEqual(buttonCoordinates.left, expectedCoordinates.left, 1.001, "Left coordinate is OK");
    assert.roughEqual(buttonCoordinates.top, expectedCoordinates.top, 1.001, "Top coordinate is OK");
});

QUnit.test("DropDown appointment button should have correct width when intervalCount is set", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        views: [{ type: "month", intervalCount: 2 }],
        width: 850,
        maxAppointmentsPerCell: 2,
        currentView: "month",
        firstDayOfWeek: 1
    });

    this.instance.option("dataSource", [
        { startDate: new Date(2015, 2, 4), text: "a", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "b", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "c", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "d", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "e", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "f", endDate: new Date(2015, 2, 4, 0, 30) }
    ]);

    var cellWidth = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(0).outerWidth(),
        $dropDownButton = this.instance.$element().find(".dx-scheduler-dropdown-appointments");

    assert.roughEqual($dropDownButton.outerWidth(), cellWidth - 60, 1.5, "DropDown button has correct width");

    this.instance.option("views", ["month"]);

    $dropDownButton = this.instance.$element().find(".dx-scheduler-dropdown-appointments");

    assert.roughEqual($dropDownButton.outerWidth(), cellWidth - 36, 1.5, "DropDown button has correct width");
});

QUnit.test("DropDown appointment buttons should have correct quantity with multiday appointments", function(assert) {
    this.createInstance({
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2016, 8, 20),
        width: 470,
        height: 650
    });

    this.instance.option("dataSource", [
        { text: 'a', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
        { text: 'b', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
        { text: 'c', startDate: new Date(2016, 8, 12), endDate: new Date(2016, 8, 15) },
        { text: 'd', startDate: new Date(2016, 8, 12), endDate: new Date(2016, 8, 15) },
        { text: 'e', startDate: new Date(2016, 8, 12), endDate: new Date(2016, 8, 15) },
        { text: 'f', startDate: new Date(2016, 8, 12), endDate: new Date(2016, 8, 15) }
    ]);

    var $dropDownButton = this.instance.$element().find(".dx-scheduler-dropdown-appointments");

    assert.equal($dropDownButton.length, 3, "There are 3 drop down buttons");
});

QUnit.test("Many dropDown appts with one multi day task should be grouped correctly", function(assert) {
    this.createInstance({
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2015, 4, 29),
        width: 800,
        height: 500
    });

    this.instance.option("dataSource", [
        { text: '1', startDate: new Date(2015, 4, 29), endDate: new Date(2015, 4, 29, 1) },
        { text: '2', startDate: new Date(2015, 4, 29), endDate: new Date(2015, 4, 29, 1) },
        { text: '3', startDate: new Date(2015, 4, 29), endDate: new Date(2015, 4, 29, 1) },
        { text: '4', startDate: new Date(2015, 4, 29), endDate: new Date(2015, 4, 29, 1) },
        { text: '5', startDate: new Date(2015, 4, 29), endDate: new Date(2015, 4, 29, 1) },
        { text: '6', startDate: new Date(2015, 4, 29), endDate: new Date(2015, 4, 29, 1) },
        { text: '7', startDate: new Date(2015, 4, 29), endDate: new Date(2015, 4, 29, 1) },
        { text: '8', startDate: new Date(2015, 4, 29), endDate: new Date(2015, 4, 29, 1) },
        { text: 'long appt', startDate: new Date(2015, 4, 29), endDate: new Date(2015, 4, 31, 1) }
    ]);

    var dropDown = this.instance.$element().find(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");

    dropDown.open();
    var ddAppointments = dropDown._list.$element().find(".dx-scheduler-dropdown-appointment");

    assert.equal(ddAppointments.length, 7, "There are 7 drop down appts");
});

QUnit.test("Many dropDown appts should be grouped correctly with one multi day task which started before dropDown (T525443)", function(assert) {
    this.createInstance({
        views: ['month'],
        currentView: 'month',
        maxAppointmentsPerCell: 1,
        currentDate: new Date(2017, 5, 25),
        width: 800,
        height: 950
    });

    this.instance.option("dataSource", [
        { text: 'long appt', startDate: new Date(2017, 5, 8, 9, 0), endDate: new Date(2017, 5, 20, 9, 15) },
        { text: '1', startDate: new Date(2017, 5, 11, 9, 30), endDate: new Date(2017, 5, 11, 11, 30) },
        { text: '2', startDate: new Date(2017, 5, 11, 12, 0), endDate: new Date(2017, 5, 11, 13, 0) },
        { text: '3', startDate: new Date(2017, 5, 11, 12, 0), endDate: new Date(2017, 5, 11, 13, 0) },
        { text: '4', startDate: new Date(2017, 5, 11, 8, 0), endDate: new Date(2017, 5, 11, 23, 59) },
        { text: '5', startDate: new Date(2017, 5, 11, 9, 45), endDate: new Date(2017, 5, 11, 11, 15) },
        { text: '6', startDate: new Date(2017, 5, 11, 11, 0), endDate: new Date(2017, 5, 11, 12, 0) },
        { text: '7', startDate: new Date(2017, 5, 11, 11, 0), endDate: new Date(2017, 5, 11, 13, 30) },
        { text: '8', startDate: new Date(2017, 5, 11, 14, 0), endDate: new Date(2017, 5, 11, 15, 30) },
        { text: '9', startDate: new Date(2017, 5, 11, 14, 0), endDate: new Date(2017, 5, 11, 15, 30) },
        { text: '10', startDate: new Date(2017, 5, 11, 14, 0), endDate: new Date(2017, 5, 11, 15, 30) },
        { text: '11', startDate: new Date(2017, 5, 11, 14, 0), endDate: new Date(2017, 5, 11, 15, 30) },
        { text: '12', startDate: new Date(2017, 5, 11, 14, 0), endDate: new Date(2017, 5, 11, 15, 30) },
        { text: '13', startDate: new Date(2017, 5, 11, 14, 30), endDate: new Date(2017, 5, 11, 16, 0) }
    ]);

    var dropDown = this.instance.$element().find(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");

    dropDown.open();
    var ddAppointments = dropDown._list.$element().find(".dx-scheduler-dropdown-appointment");

    assert.equal(ddAppointments.length, 13, "There are 13 drop down appts");
});

QUnit.test("DropDown appointment button should have correct coordinates: rtl mode", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        views: ["month"],
        width: 840,
        currentView: "month",
        firstDayOfWeek: 1,
        rtlEnabled: true
    });

    sinon.stub(this.instance.getRenderingStrategyInstance(), "_getMaxNeighborAppointmentCount").returns(4);

    this.instance.option("dataSource", [
        { startDate: new Date(2015, 2, 4), text: "a", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "b", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "c", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "d", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "e", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "f", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "g", endDate: new Date(2015, 2, 4, 0, 30) }
    ]);

    var $dropDownButton = this.instance.$element().find(".dx-scheduler-dropdown-appointments"),
        buttonCoordinates = translator.locate($dropDownButton),
        $relatedCell = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(9),
        expectedCoordinates = $relatedCell.position(),
        rtlOffset = $relatedCell.outerWidth() - 36;

    assert.equal($dropDownButton.length, 1, "DropDown button is rendered");
    assert.roughEqual(buttonCoordinates.left, expectedCoordinates.left + rtlOffset, 1.001, "Left coordinate is OK");
    assert.roughEqual(buttonCoordinates.top, expectedCoordinates.top, 1.001, "Top coordinate is OK");
});

QUnit.test("DropDown appointment buttons should have correct quantity with multiday appointments", function(assert) {
    this.createInstance({
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2016, 8, 20),
        width: 470,
        height: 650
    });

    this.instance.option("dataSource", [
        { text: 'a', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
        { text: 'b', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
        { text: 'c', startDate: new Date(2016, 8, 12), endDate: new Date(2016, 8, 15) },
        { text: 'd', startDate: new Date(2016, 8, 12), endDate: new Date(2016, 8, 15) },
        { text: 'e', startDate: new Date(2016, 8, 12), endDate: new Date(2016, 8, 15) },
        { text: 'f', startDate: new Date(2016, 8, 12), endDate: new Date(2016, 8, 15) }
    ]);

    var $dropDownButton = this.instance.$element().find(".dx-scheduler-dropdown-appointments");

    assert.equal($dropDownButton.length, 3, "There are 3 drop down buttons");
});

QUnit.test("DropDown appointment should raise the onAppointmentClick event", function(assert) {
    var spy = sinon.spy();
    var appointments = [
        { startDate: new Date(2015, 2, 4), text: "a", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "b", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "c", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "d", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "e", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "f", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "g", endDate: new Date(2015, 2, 4, 0, 30) }
    ];
    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        views: ["month"],
        width: 840,
        currentView: "month",
        firstDayOfWeek: 1,
        onAppointmentClick: function(args) {
            assert.equal(args.component, instance, "dxScheduler is 'component'");
            assert.equal(args.element, instance.element(), "dxScheduler element is 'element'");
            assert.deepEqual(args.appointmentData, appointments[4], "Appointment data is OK");
            assert.equal($(args.appointmentElement).get(0), dropDown._list.$element().find(".dx-list-item").eq(2).get(0), "Appointment element is OK");
            assert.ok(args.event instanceof $.Event, "Event is OK");

            assert.notOk(args.hasOwnProperty('itemData'));
            assert.notOk(args.hasOwnProperty('itemIndex'));
            assert.notOk(args.hasOwnProperty('itemElement'));
        }
    });

    var showAppointmentPopup = this.instance.showAppointmentPopup;
    this.instance.showAppointmentPopup = spy;
    try {
        var instance = this.instance;

        sinon.stub(instance.getRenderingStrategyInstance(), "_getMaxNeighborAppointmentCount").returns(4);

        instance.option("dataSource", appointments);

        var dropDown = instance.$element().find(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");
        dropDown.open();
        $(dropDown._list.$element()).find(".dx-list-item").eq(2).trigger("dxclick");

    } finally {
        this.instance.showAppointmentPopup = showAppointmentPopup;
    }
});

QUnit.test("DropDown appointment should process the onAppointmentClick event correctly if e.cancel = true", function(assert) {
    var spy = sinon.spy();
    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        views: ["month"],
        width: 840,
        currentView: "month",
        firstDayOfWeek: 1,
        onAppointmentClick: function(e) {
            e.cancel = true;
        }
    });
    var showAppointmentPopup = this.instance.showAppointmentPopup;
    this.instance.showAppointmentPopup = spy;
    try {
        var appointments = [
            { startDate: new Date(2015, 2, 4), text: "a", endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: "b", endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: "c", endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: "d", endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: "e", endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: "f", endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: "g", endDate: new Date(2015, 2, 4, 0, 30) }
        ];

        var instance = this.instance;

        instance.option("dataSource", appointments);

        var dropDown = instance.$element().find(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");
        dropDown.open();
        $(dropDown._list.$element()).find(".dx-list-item").eq(2).trigger("dxclick");

        assert.notOk(spy.calledOnce, "showAppointmentPopup wasn't called");
    } finally {
        this.instance.showAppointmentPopup = showAppointmentPopup;
    }
});

QUnit.test("DropDown appointment should be painted depend on resource color", function(assert) {
    var appointments = [
        { startDate: new Date(2015, 2, 4), text: "a", endDate: new Date(2015, 2, 4, 0, 30), roomId: 1 },
        { startDate: new Date(2015, 2, 4), text: "b", endDate: new Date(2015, 2, 4, 0, 30), roomId: 1 },

        { startDate: new Date(2015, 2, 4), text: "c", endDate: new Date(2015, 2, 4, 0, 30), roomId: 1 },
        { startDate: new Date(2015, 2, 4), text: "d", endDate: new Date(2015, 2, 4, 0, 30), roomId: 1 },
        { startDate: new Date(2015, 2, 4), text: "e", endDate: new Date(2015, 2, 4, 0, 30), roomId: 2 },
        { startDate: new Date(2015, 2, 4), text: "f", endDate: new Date(2015, 2, 4, 0, 30), roomId: 2 },
        { startDate: new Date(2015, 2, 4), text: "g", endDate: new Date(2015, 2, 4, 0, 30), roomId: 2 }
    ];
    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        views: ["month"],
        width: 840,
        currentView: "month",
        firstDayOfWeek: 1,
        resources: [
            {
                field: "roomId",
                dataSource: [
                    { id: 1, color: "#ff0000" },
                    { id: 2, color: "#0000ff" }
                ]
            }
        ]
    });

    sinon.stub(this.instance.getRenderingStrategyInstance(), "_getMaxNeighborAppointmentCount").returns(4);

    this.instance.option("dataSource", appointments);

    var dropDown = this.instance.$element().find(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");

    dropDown.open();
    var ddAppointments = dropDown._list.$element().find(".dx-scheduler-dropdown-appointment");

    assert.equal(this.getAppointmentColor(ddAppointments.eq(0), "borderLeftColor"), "#ff0000", "Appointment color is OK");
    assert.equal(this.getAppointmentColor(ddAppointments.eq(1), "borderLeftColor"), "#ff0000", "Appointment color is OK");
    assert.equal(this.getAppointmentColor(ddAppointments.eq(2), "borderLeftColor"), "#0000ff", "Appointment color is OK");
    assert.equal(this.getAppointmentColor(ddAppointments.eq(3), "borderLeftColor"), "#0000ff", "Appointment color is OK");
    assert.equal(this.getAppointmentColor(ddAppointments.eq(4), "borderLeftColor"), "#0000ff", "Appointment color is OK");
});

QUnit.test("DropDown appointment should be painted depend on resource color when resourses store is asynchronous", function(assert) {
    var appointments = [
        { startDate: new Date(2015, 2, 4), text: "a", endDate: new Date(2015, 2, 4, 0, 30), roomId: 1 },
        { startDate: new Date(2015, 2, 4), text: "b", endDate: new Date(2015, 2, 4, 0, 30), roomId: 1 },

        { startDate: new Date(2015, 2, 4), text: "c", endDate: new Date(2015, 2, 4, 0, 30), roomId: 1 },
        { startDate: new Date(2015, 2, 4), text: "d", endDate: new Date(2015, 2, 4, 0, 30), roomId: 1 },
        { startDate: new Date(2015, 2, 4), text: "e", endDate: new Date(2015, 2, 4, 0, 30), roomId: 2 },
        { startDate: new Date(2015, 2, 4), text: "f", endDate: new Date(2015, 2, 4, 0, 30), roomId: 2 },
        { startDate: new Date(2015, 2, 4), text: "g", endDate: new Date(2015, 2, 4, 0, 30), roomId: 2 }
    ];
    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        views: ["month"],
        width: 840,
        currentView: "month",
        firstDayOfWeek: 1,
        resources: [
            {
                field: "roomId",
                allowMultiple: true,
                dataSource: new DataSource({
                    store: new CustomStore({
                        load: function() {
                            var d = $.Deferred();
                            setTimeout(function() {
                                d.resolve([
                                    { id: 1, text: "Room 1", color: "#ff0000" },
                                    { id: 2, text: "Room 2", color: "#0000ff" }
                                ]);
                            }, 300);

                            return d.promise();
                        }
                    })
                })
            }
        ]
    });

    sinon.stub(this.instance.getRenderingStrategyInstance(), "_getMaxNeighborAppointmentCount").returns(4);

    this.instance.option("dataSource", appointments);

    this.clock.tick(300);
    var dropDown = this.instance.$element().find(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");

    dropDown.open();
    var ddAppointments = dropDown._list.$element().find(".dx-scheduler-dropdown-appointment");

    assert.equal(this.getAppointmentColor(ddAppointments.eq(0), "borderLeftColor"), "#ff0000", "Appointment color is OK");
    assert.equal(this.getAppointmentColor(ddAppointments.eq(1), "borderLeftColor"), "#ff0000", "Appointment color is OK");
    assert.equal(this.getAppointmentColor(ddAppointments.eq(2), "borderLeftColor"), "#0000ff", "Appointment color is OK");
    assert.equal(this.getAppointmentColor(ddAppointments.eq(3), "borderLeftColor"), "#0000ff", "Appointment color is OK");
    assert.equal(this.getAppointmentColor(ddAppointments.eq(4), "borderLeftColor"), "#0000ff", "Appointment color is OK");
});

QUnit.test("DropDown appointments should not be duplicated when items option change (T503748)", function(assert) {
    this.createInstance({
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2016, 8, 20),
        dataSource: [
            { text: 'a', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
            { text: 'b', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
            { text: 'c', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
            { text: 'd', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
            { text: 'e', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
            { text: 'f', startDate: new Date(2016, 8, 12), endDate: new Date(2016, 8, 12, 2) }
        ],
        width: 470,
        height: 650
    });

    this.instance.addAppointment({
        text: "g",
        startDate: new Date(2016, 8, 12),
        endDate: new Date(2016, 8, 12, 1)
    });

    var dropDown = this.instance.$element().find(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance");

    dropDown.open();
    var ddAppointments = dropDown._list.$element().find(".dx-scheduler-dropdown-appointment");

    assert.equal(ddAppointments.length, 3, "There are 3 drop down appts");
});

QUnit.test("Recurrence appointment should be rendered correctly when currentDate was changed: month view", function(assert) {
    var appointment = {
        startDate: new Date(2015, 1, 14, 0),
        endDate: new Date(2015, 1, 14, 0, 30),
        text: "appointment",
        recurrenceRule: "FREQ=MONTHLY"
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 14),
        dataSource: [appointment],
        views: ["month"],
        currentView: "month"
    });

    this.instance.option("currentDate", new Date(2015, 2, 14));

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS);

    assert.equal($appointment.length, 1, "Appointment is rendered");
});

QUnit.test("Recurrence long appointment should be rendered correctly when currentDate was changed: month view", function(assert) {
    var appointment = {
        text: "Website Re-Design Plan",
        priorityId: 2,
        startDate: new Date(2015, 4, 25, 9, 0),
        endDate: new Date(2015, 4, 26, 11, 30),
        recurrenceRule: "FREQ=DAILY;INTERVAL=5"
    };

    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        dataSource: [appointment],
        views: ["month"],
        currentView: "month"
    });

    this.instance.option("currentDate", new Date(2015, 5, 25));

    var $appointment = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.equal($appointment.length, 10, "Appointments were rendered");
});

QUnit.test("Appointment should be rendered correctly with expressions on init", function(assert) {
    var startDate = new Date(2015, 1, 4, 0),
        endDate = new Date(2015, 1, 4, 1);
    var appointments = [{
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "abc"
    }, {
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "def",
        RecRule: "FREQ=DAILY"
    }];

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        views: ["day"],
        currentView: "day",
        firstDayOfWeek: 1,
        dataSource: appointments,
        startDateExpr: "Start",
        endDateExpr: "End",
        textExpr: "Text",
        recurrenceRuleExpr: "RecRule"
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $recAppointment = this.instance.$element().find("." + APPOINTMENT_CLASS).eq(1);

    assert.equal($appointment.find(".dx-scheduler-appointment-content div").eq(0).text(), "abc", "Text is correct on init");
    assert.equal($appointment.find(".dx-scheduler-appointment-content-date").eq(0).text(), dateLocalization.format(startDate, "shorttime"), "Start Date is correct on init");
    assert.equal($appointment.find(".dx-scheduler-appointment-content-date").eq(2).text(), dateLocalization.format(endDate, "shorttime"), "End Date is correct on init");
    assert.notOk($appointment.find(".dx-scheduler-appointment-recurrence-icon").length, "Repeat icon isn't rendered");
    assert.equal($recAppointment.find(".dx-scheduler-appointment-recurrence-icon").length, 1, "Repeat icon is rendered");
});

QUnit.test("Appointment should be rendered correctly with recurrenceRule expression", function(assert) {
    var startDate = new Date(2015, 1, 4, 0),
        endDate = new Date(2015, 1, 4, 1);
    var appointments = [{
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        text: "def",
        RecRule: "FREQ=DAILY"
    }
    ];

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        views: ["day"],
        currentView: "day",
        firstDayOfWeek: 1,
        dataSource: appointments,
        recurrenceRuleExpr: "RecRule"
    });

    var $recAppointment = this.instance.$element().find("." + APPOINTMENT_CLASS).eq(0);

    assert.equal($recAppointment.find(".dx-scheduler-appointment-content div").eq(0).text(), "def", "Text is correct on init");

    assert.equal($recAppointment.find(".dx-scheduler-appointment-content-date").eq(0).text(), dateLocalization.format(startDate, "shorttime"), "Start Date is correct on init");
    assert.equal($recAppointment.find(".dx-scheduler-appointment-content-date").eq(2).text(), dateLocalization.format(endDate, "shorttime"), "End Date is correct on init");
    assert.equal($recAppointment.find(".dx-scheduler-appointment-recurrence-icon").length, 1, "Recurrence icon is rendered");
});

QUnit.test("Appointment should be rendered correctly with expressions on optionChanged", function(assert) {
    var oldStartDate = new Date(2015, 1, 4),
        startDate = new Date(2015, 1, 4, 1),
        endDate = new Date(2015, 1, 4, 2);
    var appointment = {
        Start: oldStartDate.getTime(),
        End: startDate.getTime(),
        Text: "abc",

        AppointmentStart: startDate.getTime(),
        AppointmentEnd: endDate.getTime(),
        AppointmentText: "xyz"
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        views: ["day"],
        currentView: "day",
        firstDayOfWeek: 1,
        dataSource: [appointment],
        startDateExpr: "Start",
        endDateExpr: "End",
        textExpr: "Text",
    });

    this.instance.option({
        startDateExpr: "AppointmentStart",
        endDateExpr: "AppointmentEnd",
        textExpr: "AppointmentText"
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);

    assert.equal($appointment.find(".dx-scheduler-appointment-content .dx-scheduler-appointment-title").eq(0).text(), "xyz", "Text is correct on init");
    assert.equal($appointment.find(".dx-scheduler-appointment-content-date").eq(0).text(), dateLocalization.format(startDate, "shorttime"), "Start Date is correct on init");
    assert.equal($appointment.find(".dx-scheduler-appointment-content-date").eq(2).text(), dateLocalization.format(endDate, "shorttime"), "End Date is correct on init");
});

QUnit.test("Appointment should be rendered correctly with expressions on custom template", function(assert) {
    var startDate = new Date(2015, 1, 4, 1),
        endDate = new Date(2015, 1, 4, 2);
    var appointment = {
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "abc"
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        views: ["day"],
        currentView: "day",
        firstDayOfWeek: 1,
        dataSource: [appointment],
        startDateExpr: "Start",
        endDateExpr: "End",
        textExpr: "Text",
        appointmentTemplate: function(data) {
            return "<div class='custom-title'>" + data.Text + "</div>";
        }
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);

    assert.equal($appointment.find(".custom-title").text(), "abc", "Text is correct on init");
});

QUnit.test("DropDown appointment should be rendered correctly with expressions on custom template", function(assert) {
    var startDate = new Date(2015, 1, 4, 1),
        endDate = new Date(2015, 1, 4, 2);
    var appointments = [{
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "Item 1"
    }, {
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "Item 2"
    }, {
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "Item 3"
    }];

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        views: ["month"],
        currentView: "month",
        firstDayOfWeek: 1,
        dataSource: appointments,
        startDateExpr: "Start",
        endDateExpr: "End",
        textExpr: "Text",
        height: 500,
        maxAppointmentsPerCell: "auto",
        dropDownAppointmentTemplate: function(data) {
            return "<div class='custom-title'>" + data.Text + "</div>";
        }
    });

    $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance").open();

    var $appointment = $(".dx-dropdownmenu-list .dx-item").first();

    assert.equal($appointment.find(".custom-title").text(), "Item 2", "Text is correct on init");
});

QUnit.test("DropDown button should be rendered correctly when appointmentCollectorTemplate is used", function(assert) {
    var startDate = new Date(2015, 1, 4, 1),
        endDate = new Date(2015, 1, 4, 2);
    var appointments = [{
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "Item 1"
    }, {
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "Item 2"
    }, {
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "Item 3"
    }];

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        views: ["month"],
        currentView: "month",
        firstDayOfWeek: 1,
        dataSource: appointments,
        startDateExpr: "Start",
        endDateExpr: "End",
        textExpr: "Text",
        height: 500,
        maxAppointmentsPerCell: "auto",
        appointmentCollectorTemplate: function(data) {
            return "<div class='button-title'>Appointment count is " + data.appointmentCount + "</div>";
        }
    });

    var $dropDown = $(".dx-scheduler-dropdown-appointments").eq(0);

    assert.equal($dropDown.find(".button-title").text(), "Appointment count is 2", "Template is applied correctly");
});

QUnit.test("dxScheduler should render custom appointment template with render function that returns dom node", function(assert) {

    var startDate = new Date(2015, 1, 4, 1),
        endDate = new Date(2015, 1, 4, 2);
    var appointment = {
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "abc"
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        dataSource: [appointment],
        startDateExpr: "Start",
        endDateExpr: "End",
        textExpr: "Text",
        appointmentTemplate: "appointmentTemplate",
        integrationOptions: {
            templates: {
                "appointmentTemplate": {
                    render: function(args) {
                        var $element = $("<span>")
                            .addClass("dx-template-wrapper")
                            .text("text");

                        return $element.get(0);
                    }
                }
            }
        }
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);

    assert.equal($appointment.text(), "text", "container is correct");
});

QUnit.test("dxScheduler should render dropDownAppointment appointment template with render function that returns dom node", function(assert) {
    var startDate = new Date(2015, 1, 4, 1),
        endDate = new Date(2015, 1, 4, 2);
    var appointments = [{
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "Item 1"
    }, {
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "Item 2"
    }, {
        Start: startDate.getTime(),
        End: endDate.getTime(),
        Text: "Item 3"
    }];

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        views: ["month"],
        currentView: "month",
        firstDayOfWeek: 1,
        dataSource: appointments,
        startDateExpr: "Start",
        endDateExpr: "End",
        textExpr: "Text",
        height: 500,
        maxAppointmentsPerCell: "auto",
        dropDownAppointmentTemplate: "dropDownAppointmentTemplate",
        integrationOptions: {
            templates: {
                "dropDownAppointmentTemplate": {
                    render: function(args) {
                        var $element = $("<span>")
                            .addClass("dx-template-wrapper")
                            .text("text");

                        return $element.get(0);
                    }
                }
            }
        }
    });

    $(".dx-scheduler-dropdown-appointments").dxDropDownMenu("instance").open();
    var $appointment = $(".dx-dropdownmenu-list .dx-item").first();

    assert.equal($appointment.text(), "text", "Text is correct on init");
});

QUnit.test("Appointment should have right position, if it's startDate time less than startDayHour option value", function(assert) {
    var appointment = {
        startDate: new Date(2016, 2, 1, 2),
        endDate: new Date(2016, 2, 1, 5)
    };

    this.createInstance({
        currentDate: new Date(2016, 2, 1),
        currentView: "week",
        firstDayOfWeek: 1,
        dataSource: [appointment],
        startDayHour: 3
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $targetCell = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(1);

    assert.roughEqual($appointment.position().top, $targetCell.position().top, 1.001, "appointment top is correct");
    assert.roughEqual($appointment.position().left, $targetCell.position().left, 1.001, "appointment left is correct");
});

QUnit.test("Appointment should have right position on timeline month view", function(assert) {
    var appointment = {
        startDate: new Date(2016, 1, 3, 8, 15),
        endDate: new Date(2016, 1, 3, 9, 0)
    };

    this.createInstance({
        currentDate: new Date(2016, 1, 1),
        currentView: "timelineMonth",
        firstDayOfWeek: 0,
        dataSource: [appointment]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $targetCell = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(2);

    assert.roughEqual($appointment.position().top, $targetCell.position().top, 1.001, "appointment top is correct");
    assert.roughEqual($appointment.position().left, $targetCell.position().left, 1.001, "appointment left is correct");
});

QUnit.test("Rival appointments should have right position on timeline month view", function(assert) {
    var data = [{
        "id": "1",
        "text": "Recurrence event",
        "recurrenceRule": "FREQ=DAILY;INTERVAL=2;COUNT=2",
        "startDate": new Date(2018, 11, 3, 9, 0),
        "endDate": new Date(2018, 11, 1, 10, 30)
    },
    {
        "id": "2",
        "text": "Some event",
        "startDate": new Date(2018, 11, 4, 9, 0),
        "endDate": new Date(2018, 11, 4, 10, 29),
    }];

    this.createInstance({
        dataSource: data,
        views: ["timelineMonth"],
        currentView: "timelineMonth",
        currentDate: new Date(2018, 11, 3),
        firstDayOfWeek: 0,
        startDayHour: 8,
        endDayHour: 20
    });

    this.instance.$element().find("." + APPOINTMENT_CLASS).each(function(index, appointment) {
        assert.equal($(appointment).position().top, 0, "Appointment top is ok");
    });
});

QUnit.test("Rival long appointments should have right position on timeline month view", function(assert) {
    var data = [{
        "id": "1",
        "text": "Long event",
        "startDate": new Date(2018, 11, 1, 9, 0),
        "endDate": new Date(2018, 11, 5, 10, 30)
    },
    {
        "id": "2",
        "text": "Some event",
        "startDate": new Date(2018, 11, 4, 9, 0),
        "endDate": new Date(2018, 11, 4, 10, 29),
    }];

    this.createInstance({
        dataSource: data,
        views: ["timelineMonth"],
        currentView: "timelineMonth",
        currentDate: new Date(2018, 11, 3),
        firstDayOfWeek: 0,
        startDayHour: 8,
        endDayHour: 20
    });

    var $secondAppointment = this.instance.$element().find("." + APPOINTMENT_CLASS).eq(1);

    assert.equal($secondAppointment.position().top, 40, "Second appointment top is ok");
});

QUnit.test("Long appointment part should not be rendered on timeline month view (T678380)", function(assert) {
    var appointment = {
        "text": "Ends april 1st at 7:59 am",
        "startDate": new Date(2019, 2, 20, 9, 0),
        "endDate": new Date(2019, 3, 1, 7, 59)
    };

    this.createInstance({
        currentDate: new Date(2019, 3, 2),
        currentView: "timelineMonth",
        views: ["timelineMonth"],
        recurrenceRuleExpr: null,
        startDayHour: 8,
        firstDayOfWeek: 0,
        endDayHour: 18,
        cellDuration: 60,
        dataSource: [appointment]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS);

    assert.equal($appointment.length, 0, "appointment-part was not rendered");
});

QUnit.test("Long appointment part should not be rendered on timeline workWeek view (T678380)", function(assert) {
    var appointment = {
        "text": "Ends april 1st at 7:59 am",
        "startDate": new Date(2019, 2, 20, 9, 0),
        "endDate": new Date(2019, 3, 1, 7, 59)
    };

    this.createInstance({
        currentDate: new Date(2019, 3, 2),
        currentView: "timelineWorkWeek",
        views: ["timelineWorkWeek"],
        recurrenceRuleExpr: null,
        startDayHour: 8,
        firstDayOfWeek: 0,
        endDayHour: 18,
        cellDuration: 60,
        dataSource: [appointment]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS);

    assert.equal($appointment.length, 0, "appointment-part was not rendered");
});

QUnit.test("Appointment should have right width on timeline week view", function(assert) {
    var appointment = {
        startDate: new Date(2015, 2, 3, 9, 30),
        endDate: new Date(2015, 2, 3, 10, 30)
    };

    this.createInstance({
        currentDate: 1425416400000,
        currentView: "timelineWeek",
        dataSource: [appointment],
        startDayHour: 8,
        endDayHour: 10
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $cell = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0);

    assert.roughEqual($appointment.outerWidth(), $cell.outerWidth(), 1.001, "Task has a right width");
});

QUnit.test("Multiday appointment should have right width on timelineWeek view when set startDayHour > appointment endDate (T533348)", function(assert) {
    var appointment = {
        startDate: new Date(2016, 1, 1, 11, 0),
        endDate: new Date(2016, 1, 2, 1, 0)
    };

    this.createInstance({
        currentDate: new Date(2016, 1, 1),
        views: ["timelineWeek"],
        currentView: "timelineWeek",
        cellDuration: 60,
        firstDayOfWeek: 1,
        dataSource: [appointment],
        startDayHour: 8,
        endDayHour: 20,
        height: 200
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $cell = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0),
        cellsInAppointment = 9;

    assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, "Task has a right width");
});

QUnit.test("Recurrence appointment part should have right width on timeline week view", function(assert) {
    var appointment = {
        startDate: new Date(2015, 4, 25, 21),
        endDate: new Date(2015, 4, 26, 2),
        recurrenceRule: "FREQ=DAILY;INTERVAL=2"
    };

    this.createInstance({
        currentDate: new Date(2015, 4, 26),
        currentView: "timelineWeek",
        dataSource: [appointment],
        startDayHour: 1,
        endDayHour: 22
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(1),
        $cell = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0);

    assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * 4, 1.001, "Task has a right width");
});

QUnit.test("Multiday appointment should have right width on timeline week view", function(assert) {
    var appointment = {
        startDate: new Date(2015, 2, 2, 19),
        endDate: new Date(2015, 2, 3, 13)
    };

    this.createInstance({
        currentDate: new Date(2015, 2, 3),
        currentView: "timelineWeek",
        cellDuration: 60,
        dataSource: [appointment],
        startDayHour: 10,
        endDayHour: 20
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $cell = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0),
        cellsInAppointment = 4;

    assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, "Task has a right width");
});

QUnit.test("AllDay appointment should have right width on timeline week view", function(assert) {
    var appointment = {
        startDate: new Date(2015, 11, 14),
        endDate: new Date(2015, 11, 17),
        allDay: true
    };

    this.createInstance({
        currentDate: new Date(2015, 11, 14),
        currentView: "timelineWeek",
        cellDuration: 60,
        dataSource: [appointment],
        startDayHour: 10,
        endDayHour: 22
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $cell = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0),
        cellsInAppointment = 36;

    assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, "Task has a right width");
});

QUnit.test("AllDay appointment without allDay field should have right width on timeline day view", function(assert) {
    var appointment = {
        startDate: new Date(2015, 11, 14, 0, 0),
        endDate: new Date(2015, 11, 14, 24, 0)
    };

    this.createInstance({
        currentDate: new Date(2015, 11, 14),
        currentView: "timelineDay",
        cellDuration: 60,
        dataSource: [appointment],
        startDayHour: 10,
        endDayHour: 22
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $cell = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0),
        cellsInAppointment = 12;

    assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, "Task has a right width");
});

QUnit.test("Long multiday appointment should have right width on timeline work week view", function(assert) {
    var appointment = {
        startDate: new Date(2015, 2, 2, 9),
        endDate: new Date(2015, 2, 4, 18)
    };

    this.createInstance({
        currentDate: new Date(2015, 2, 3),
        currentView: "timelineWorkWeek",
        cellDuration: 60,
        dataSource: [appointment],
        startDayHour: 10,
        endDayHour: 20
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $cell = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0),
        cellsInAppointment = 28;

    assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, "Task has a right width");
});

QUnit.test("Long multiday appointment should have right width on timeline week view when set startDayHour > appointment endDate (T533348)", function(assert) {
    var appointment = {
        startDate: new Date(2016, 1, 1, 11, 0),
        endDate: new Date(2016, 1, 4, 1, 0)
    };

    this.createInstance({
        currentDate: new Date(2016, 1, 1),
        views: ["timelineWeek"],
        currentView: "timelineWeek",
        cellDuration: 60,
        firstDayOfWeek: 1,
        dataSource: [appointment],
        startDayHour: 8,
        endDayHour: 20,
        height: 200
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $cell = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0),
        cellsInAppointment = 33;

    assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, "Task has a right width");
});

QUnit.test("Long multiday appointment should have right position on timeline week view", function(assert) {
    var appointment = {
        startDate: new Date(2015, 2, 2, 9),
        endDate: new Date(2015, 2, 5, 18)
    };

    this.createInstance({
        currentDate: new Date(2015, 2, 3),
        currentView: "timelineWeek",
        cellDuration: 60,
        dataSource: [appointment],
        startDayHour: 10,
        endDayHour: 20
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $cell = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0),
        cellsToAppointment = 10;

    assert.roughEqual($appointment.position().left, $cell.outerWidth() * cellsToAppointment, 1.001, "Task has a right width");
});

QUnit.test("DropDown appointment button should have correct width on timeline view", function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        views: [{ type: "timelineDay", name: "timelineDay" }],
        width: 850,
        maxAppointmentsPerCell: 2,
        currentView: "timelineDay"
    });

    this.instance.option("dataSource", [
        { startDate: new Date(2015, 2, 4), text: "a", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "b", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "c", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "d", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "e", endDate: new Date(2015, 2, 4, 0, 30) },
        { startDate: new Date(2015, 2, 4), text: "f", endDate: new Date(2015, 2, 4, 0, 30) }
    ]);

    var cellWidth = this.instance.$element().find("." + DATE_TABLE_CELL_CLASS).eq(0).outerWidth(),
        $dropDownButton = this.instance.$element().find(".dx-scheduler-dropdown-appointments").eq(0);

    assert.roughEqual($dropDownButton.outerWidth(), cellWidth - 4, 1.5, "DropDown button has correct width");
});

QUnit.test("Appointment with zero-duration should be rendered correctly(T443143)", function(assert) {

    this.createInstance({
        dataSource: [{
            text: "Website Re-Design Plan",
            startDate: new Date(2016, 8, 16),
            endDate: new Date(2016, 8, 16)
        }],
        currentDate: new Date(2016, 8, 16),
        currentView: "agenda",
        views: ["day", "workWeek", "week", "month", "agenda"],
        height: 600
    });

    var $element = this.instance.$element();
    var $appointments = $element.find("." + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 1, "Appt is rendered");
    assert.equal($element.find(".dx-scheduler-agenda-nodata").length, 0, "There is no 'No data' message");
});

QUnit.test("Small appointment should have hidden content information but visible content element(T469453)", function(assert) {
    this.createInstance({
        dataSource: [{
            text: "Meeting",
            startDate: new Date(2016, 8, 16),
            endDate: new Date(2016, 8, 16, 0, 5),
            recurrenceRule: "FREQ=DAILY"
        }],
        currentDate: new Date(2016, 8, 16),
        currentView: "day",
        views: ["day"],
        height: 600
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment-empty"),
        $appointmentContent = $appointment.find(".dx-scheduler-appointment-content"),
        $appointmentTitle = $appointmentContent.find(".dx-scheduler-appointment-title"),
        $appointmentDetails = $appointmentContent.find(".dx-scheduler-appointment-content-details"),
        $appointmentRecurringIcon = $appointmentContent.find(".dx-scheduler-appointment-recurrence-icon");

    assert.equal($appointmentContent.css("display"), "block", "Appointment content is visible");
    assert.equal($appointmentTitle.css("display"), "none", "Appointment title isn't visible");
    assert.equal($appointmentDetails.css("display"), "none", "Appointment title isn't visible");
    assert.equal($appointmentRecurringIcon.css("display"), "none", "Appointment recurring icon isn't visible");
});

QUnit.test("Recurrence icon position should be correct (T718691)", function(assert) {
    var data = [{
        text: "Book Flights to San Fran for Sales Trip",
        startDate: new Date(2017, 4, 29, 12, 0),
        endDate: new Date(2017, 5, 5, 13, 0),
        allDay: true,
        recurrenceRule: "FREQ=WEEKLY;BYDAY=TU;COUNT=10"
    }];
    this.createInstance({
        dataSource: data,
        views: ["month"],
        currentView: "month",
        currentDate: new Date(2017, 4, 25),
        startDayHour: 9,
        height: 600
    });

    var $appointment = $(this.instance.$element()).find(".dx-scheduler-appointment"),
        $appointmentContent = $appointment.find(".dx-scheduler-appointment-content"),
        $appointmentRecurringIcon = $appointmentContent.find(".dx-scheduler-appointment-recurrence-icon");

    assert.equal($appointmentRecurringIcon.eq(0).css("right"), "20px", "Icon position is OK");
    assert.equal($appointmentRecurringIcon.eq(1).css("right"), "5px", "Icon position is OK");
    assert.equal($appointmentRecurringIcon.eq(2).css("right"), "5px", "Icon position is OK");
});

QUnit.test("Appointment startDate should be preprocessed before position calculating", function(assert) {
    this.createInstance({
        dataSource: [{ "text": "a", "allDay": true, "startDate": "2017-03-13T09:05:00Z", "endDate": "2017-03-20T09:05:00Z" }],
        currentDate: new Date(2017, 2, 13),
        currentView: "month",
        views: ["month"],
        height: 600
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS);

    assert.equal($appointment.length, 2, "appointment is rendered");
});

QUnit.test("Appointment startDate and endDate should have correct format in the details view after allDay appoitment opening (T505119)", function(assert) {
    var tasks = [{
        text: "AllDay task",
        start: new Date(2017, 2, 13),
        end: new Date(2017, 2, 13, 0, 30),
        AllDay: true
    }, {
        text: "Short task",
        start: new Date(2017, 2, 13),
        end: new Date(2017, 2, 13, 0, 30)
    }];

    this.createInstance({
        dataSource: tasks,
        currentDate: new Date(2017, 2, 13),
        currentView: "week",
        views: ["week"],
        startDateExpr: "start",
        endDateExpr: "end",
        allDayExpr: "AllDay"
    });
    this.instance.showAppointmentPopup(tasks[0]);
    this.instance.hideAppointmentPopup();
    this.instance.showAppointmentPopup(tasks[1]);

    var detailsForm = this.instance.getAppointmentDetailsForm(),
        startDateEditor = detailsForm.getEditor("start"),
        endDateEditor = detailsForm.getEditor("end");

    assert.equal(startDateEditor.option("type"), "datetime", "start date is correct");
    assert.equal(endDateEditor.option("type"), "datetime", "end date is correct");
});

QUnit.test("Scheduler appointment popup should be opened correctly for recurrence appointments after multiple opening(T710140)", function(assert) {
    var tasks = [{
        text: "Recurrence task",
        start: new Date(2017, 2, 13),
        end: new Date(2017, 2, 13, 0, 30),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10"
    }];

    this.createInstance({
        dataSource: tasks,
        currentDate: new Date(2017, 2, 13),
        currentView: "month",
        views: ["month"],
        startDateExpr: "start",
        endDateExpr: "end"
    });
    this.instance.showAppointmentPopup(tasks[0]);
    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");
    var form = this.instance.getAppointmentDetailsForm(),
        descriptionEditor = form.getEditor("description");

    descriptionEditor.option("value", "Recurrence task 1");

    this.instance.hideAppointmentPopup();
    this.instance.showAppointmentPopup(tasks[0]);

    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var popup = this.instance.getAppointmentPopup(),
        $checkboxes = $(popup.$content()).find(".dx-checkbox");

    assert.equal($checkboxes.eq(1).dxCheckBox("instance").option("value"), true, "Right checkBox was checked. Popup is correct");
    assert.equal($checkboxes.eq(4).dxCheckBox("instance").option("value"), true, "Right checkBox was checked. Popup is correct");
});

QUnit.test("Scheduler appointment popup should be opened correctly for recurrence appointments after opening for ordinary appointments(T710140)", function(assert) {
    var tasks = [{
        text: "Task",
        start: new Date(2017, 2, 13),
        end: new Date(2017, 2, 13, 0, 30)
    }, {
        text: "Recurrence task",
        start: new Date(2017, 2, 13),
        end: new Date(2017, 2, 13, 0, 30),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10"
    }];

    this.createInstance({
        dataSource: tasks,
        currentDate: new Date(2017, 2, 13),
        currentView: "month",
        views: ["month"],
        startDateExpr: "start",
        endDateExpr: "end"
    });
    this.instance.showAppointmentPopup(tasks[0]);

    var form = this.instance.getAppointmentDetailsForm(),
        descriptionEditor = form.getEditor("description");

    descriptionEditor.option("value", "Task 1");

    this.instance.hideAppointmentPopup();
    this.instance.showAppointmentPopup(tasks[1]);

    $(".dx-dialog-buttons .dx-button").eq(0).trigger("dxclick");

    var popup = this.instance.getAppointmentPopup(),
        $checkboxes = $(popup.$content()).find(".dx-checkbox");

    assert.equal($checkboxes.eq(1).dxCheckBox("instance").option("value"), true, "Right checkBox was checked. Popup is correct");
    assert.equal($checkboxes.eq(4).dxCheckBox("instance").option("value"), true, "Right checkBox was checked. Popup is correct");

    this.instance.hideAppointmentPopup();
    this.instance.showAppointmentPopup(tasks[0]);

    form = this.instance.getAppointmentDetailsForm();
    var recurrenceEditor = form.getEditor("recurrenceRule");

    assert.equal(recurrenceEditor._$container.css("display"), "none", "Recurrence editor is hidden. Popup is correct");
});

QUnit.test("Scheduler shouldn't throw error at deferred appointment loading (T518327)", function(assert) {
    var data = [{ text: "Task 1", startDate: new Date(2017, 4, 22, 16), endDate: new Date(2017, 4, 24, 1) }];

    this.createInstance({
        dataSource: new DataSource({
            store: new CustomStore({
                load: function() {
                    var d = $.Deferred();
                    d.resolve(data);
                    return d.promise();
                }
            })
        }),
        currentDate: new Date(2017, 4, 20),
        views: ["week", "day"],
        currentView: "week"
    });

    var errorLogStub = sinon.stub(errors, "log");
    this.instance.option("currentView", "day");

    assert.notOk(errorLogStub.called, "Error was not thrown");
    errorLogStub.restore();
});

QUnit.test("Exception should not be thrown on second details view opening if form items was not found", function(assert) {
    var task = { text: "Task", startDate: new Date(2017, 2, 13), endDate: new Date(2017, 2, 13, 0, 30) };

    this.createInstance({
        dataSource: [task],
        currentDate: new Date(2017, 2, 13),
        currentView: "week",
        views: ["week"],
        onAppointmentFormOpening: function(e) {
            e.form.option("items", []);
        }
    });

    try {
        this.instance.showAppointmentPopup(task);
        this.instance.hideAppointmentPopup();

        this.instance.showAppointmentPopup(task);
        assert.ok(true, "exception is not expected");
    } catch(e) {
        assert.ok(false, "Exception: " + e);
    }
});

QUnit.test("FormData should be reset on saveChanges, dateSerializationFormat is set in initial appointment data (T569673)", function(assert) {
    var task = { text: "Task", StartDate: "2016-05-25T09:40:00",
        EndDate: "2016-05-25T10:40:00" };

    this.createInstance({
        dataSource: [task],
        currentDate: new Date(2016, 4, 25),
        currentView: "week",
        views: ["week"],
        startDateExpr: "StartDate",
        endDateExpr: "EndDate",
        onAppointmentFormOpening: function(data) {
            var form = data.form,
                startDate = data.appointmentData.StartDate,
                endDate = data.appointmentData.EndDate;

            form.option("items", [
                {
                    dataField: "StartDate",
                    editorType: "dxDateBox",
                    editorOptions: {
                        value: startDate,
                        type: "datetime",
                        onValueChanged: function(args) {
                            startDate = args.value;
                            form.getEditor("EndDate")
                                .option("value", new Date(1464160900000));
                        }
                    }
                }, {
                    name: "EndDate",
                    dataField: "EndDate",
                    editorType: "dxDateBox",
                    editorOptions: {
                        value: endDate,
                        type: "datetime",
                        readOnly: true
                    }
                }
            ]);
        }
    });

    this.instance.showAppointmentPopup(task, true);

    var detailsForm = this.instance.getAppointmentDetailsForm(),
        startDateEditor = detailsForm.getEditor("StartDate");

    startDateEditor.option("value", "2016-05-25T10:40:00");

    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick").trigger("dxclick");

    var $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);

    var endDateFormat = dateSerialization.getDateSerializationFormat(dataUtils.data($appointments[1], "dxItemData").EndDate);
    assert.deepEqual(endDateFormat, "yyyy-MM-ddTHH:mm:ss", "Appointment EndDate format is OK");
});

QUnit.test("Appointments should be rendered correctly, Month view with intervalCount and startDate", function(assert) {
    var tasks = [
        { text: "One", startDate: new Date(2017, 5, 22, 4), endDate: new Date(2017, 5, 22, 4, 30) },
        { text: "Two", startDate: new Date(2017, 5, 26, 0), endDate: new Date(2017, 5, 26, 0, 30) },
        { text: "Three", startDate: new Date(2017, 6, 2, 10), endDate: new Date(2017, 6, 2, 11) },
        { text: "Four", startDate: new Date(2017, 6, 9, 8), endDate: new Date(2017, 6, 9, 8, 30) },
        { text: "Five", startDate: new Date(2017, 7, 9, 8), endDate: new Date(2017, 7, 9, 8, 30) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentDate: new Date(2017, 5, 26),
        dataSource: dataSource,
        views: [{
            type: "month",
            intervalCount: 3,
            startDate: new Date(2017, 0, 19)
        }],
        currentView: "month",
        firstDayOfWeek: 1
    });

    var $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 3, "Appointments were rendered correctly");
});

QUnit.test("Scheduler should add only one appointment at multiple 'done' button clicks on appointment form", function(assert) {
    var a = { text: "a", startDate: new Date(2017, 7, 9), endDate: new Date(2017, 7, 9, 0, 15) };
    this.createInstance({
        dataSource: [],
        currentDate: new Date(2017, 7, 9),
        currentView: "week",
        views: ["week"],
        onAppointmentAdding: function(e) {
            var d = $.Deferred();

            window.setTimeout(function() {
                d.resolve();
            }, 300);

            e.cancel = d.promise();
        }
    });

    this.instance.showAppointmentPopup(a, true);
    $(".dx-scheduler-appointment-popup .dx-popup-done").trigger("dxclick").trigger("dxclick");
    this.clock.tick(300);

    var $appointments = this.instance.$element().find("." + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 1, "right appointment quantity");
});

QUnit.test("Appointments should be rendered correctly in vertical grouped workspace Month", function(assert) {
    this.createInstance({
        dataSource: [{
            text: "a",
            startDate: new Date(2018, 2, 16, 9),
            endDate: new Date(2018, 2, 16, 10, 30),
            id: 1
        }, {
            text: "b",
            startDate: new Date(2018, 2, 16, 9),
            endDate: new Date(2018, 2, 16, 10, 30),
            id: 2
        }],
        currentDate: new Date(2018, 2, 1),
        views: [{
            type: "month",
            groupOrientation: "vertical"
        }],
        currentView: "month",
        groups: ["id"],
        resources: [
            {
                field: "id",
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            }
        ]
    });

    var $appointments = $(this.instance.$element()).find("." + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 2, "two appointments is rendered");

    var cellHeight = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(0).outerHeight(),
        cellPosition = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(5).position().left,
        monthTopOffset = cellHeight * 0.4;

    assert.roughEqual($appointments.eq(0).position().top, cellHeight * 2 + monthTopOffset, 1, "correct top position");
    assert.roughEqual($appointments.eq(0).position().left, cellPosition, 1.5, "correct left position");
    assert.roughEqual($appointments.eq(1).position().top, cellHeight * 8 + monthTopOffset, 3.5, "correct top position");
    assert.roughEqual($appointments.eq(1).position().left, cellPosition, 1.5, "correct left position");
});

QUnit.test("Appointment should be dragged correctly between the groups in vertical grouped workspace Month", function(assert) {
    this.createInstance({
        dataSource: [{
            text: "a",
            startDate: new Date(2018, 2, 16, 12),
            endDate: new Date(2018, 2, 16, 12, 30),
            id: 1
        }],
        currentDate: new Date(2018, 2, 1),
        views: [{
            type: "month",
            groupOrientation: "vertical"
        }],
        editing: true,
        currentView: "month",
        groups: ["id"],
        resources: [
            {
                field: "id",
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            }
        ]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0);

    $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(54).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.start);
    $appointment.trigger(dragEvents.end);

    this.clock.tick();
    var appointmentData = dataUtils.data(this.instance.$element().find("." + APPOINTMENT_CLASS).get(0), "dxItemData");

    assert.deepEqual(appointmentData.startDate, new Date(2018, 2, 9, 12), "Start date is correct");
    assert.deepEqual(appointmentData.endDate, new Date(2018, 2, 9, 12, 30), "End date is correct");
    assert.deepEqual(appointmentData.id, 2, "Group is OK");
});

QUnit.test("Long appt parts should have correct coordinates if duration > week in vertical grouped workspace Month", function(assert) {
    this.createInstance({
        dataSource: [{
            text: "a",
            startDate: new Date(2018, 2, 11, 12),
            endDate: new Date(2018, 2, 18, 11, 30),
            id: 1
        }],
        currentDate: new Date(2018, 2, 1),
        views: [{
            type: "month",
            groupOrientation: "vertical"
        }],
        currentView: "month",
        groups: ["id"],
        resources: [
            {
                field: "id",
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            }
        ]
    });

    var $firstPart = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $secondPart = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(1);

    assert.roughEqual($firstPart.position().left, 0, 1.1, 'correct left position');
    assert.roughEqual($secondPart.position().left, 0, 1.1, 'correct left position');
});

QUnit.test("Long appt parts should have correct coordinates after drag to the last row cell in vertical grouped workspace Month", function(assert) {
    this.createInstance({
        dataSource: [{
            text: "a",
            startDate: new Date(2018, 2, 4, 12),
            endDate: new Date(2018, 2, 5, 13, 30),
            id: 1
        }],
        currentDate: new Date(2018, 2, 1),
        views: [{
            type: "month",
            groupOrientation: "vertical"
        }],
        editing: true,
        currentView: "month",
        groups: ["id"],
        resources: [
            {
                field: "id",
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            }
        ]
    });

    var $appointment = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        cellPosition = $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(6).position().left;

    $(this.instance.$element()).find("." + DATE_TABLE_CELL_CLASS).eq(6).trigger(dragEvents.enter);
    $appointment.trigger(dragEvents.start);
    $appointment.trigger(dragEvents.end);

    this.clock.tick();
    var $firstPart = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(0),
        $secondPart = $(this.instance.$element()).find("." + APPOINTMENT_CLASS).eq(1);

    assert.roughEqual($firstPart.position().left, cellPosition, 2, 'correct left position');
    assert.equal($secondPart.position().left, 0, 'correct left position');
});

QUnit.test("Appointment should be resized correctly to left side in horizontal grouped workspace Month", function(assert) {
    this.createInstance({
        dataSource: [{
            text: "a",
            startDate: new Date(2018, 2, 5, 12),
            endDate: new Date(2018, 2, 5, 12, 30),
            id: 1
        }],
        currentDate: new Date(2018, 2, 1),
        views: [{
            type: "month",
            groupOrientation: "vertical"
        }],
        currentView: "month",
        groups: ["id"],
        editing: true,
        resources: [
            {
                field: "id",
                dataSource: [
                    { id: 1, text: "one" },
                    { id: 2, text: "two" }
                ]
            }
        ]
    });

    var $element = $(this.instance.$element()),
        cellWidth = $element.find("." + DATE_TABLE_CELL_CLASS).eq(0).outerWidth(),
        pointer = pointerMock($element.find(".dx-resizable-handle-left").eq(0)).start();

    pointer.dragStart().drag(-(cellWidth / 2), 0);
    pointer.dragEnd();

    var $appointment = $element.find("." + APPOINTMENT_CLASS).eq(0);

    assert.roughEqual($appointment.position().left, 0, 1.1, "Left coordinate is correct");
});

QUnit.test("Tail of long appointment should have a right position, groupByDate = true", function(assert) {
    this.createInstance({
        dataSource: [
            { text: "Task 1", startDate: new Date(2015, 8, 22, 22, 0), endDate: new Date(2015, 8, 23, 21, 0), ownerId: 2 }
        ],
        groupByDate: true,
        groups: ["ownerId"],
        resources: [
            {
                field: "ownerId",
                label: "o",
                allowMultiple: true,
                dataSource: [
                    {
                        text: "a",
                        id: 1
                    },
                    {
                        text: "b",
                        id: 2
                    }
                ]
            }
        ],
        currentDate: new Date(2015, 8, 22),
        views: ["week"],
        startDayHour: 20,
        currentView: "week",
        firstDayOfWeek: 1
    });

    var $appointmentTail = $(this.instance.$element()).find(".dx-scheduler-work-space .dx-scheduler-appointment").eq(1),
        $cell = $(this.instance.$element()).find(".dx-scheduler-work-space .dx-scheduler-date-table-cell").eq(5);

    assert.roughEqual($appointmentTail.position().left, $cell.position().left, 1.001, "Tail has a right position");
});

QUnit.test("The itemData argument of the drop down appointment template is should be instance of the data source", function(assert) {
    var dataSource = [{
        startDate: new Date(2015, 4, 24, 9),
        endDate: new Date(2015, 4, 24, 11),
        allDay: true,
        text: "Task 1"
    }, {
        startDate: new Date(2015, 4, 24, 15),
        endDate: new Date(2015, 4, 24, 20),
        allDay: true,
        text: "Task 2"
    }, {
        startDate: new Date(2015, 4, 24, 45),
        endDate: new Date(2015, 4, 24, 55),
        allDay: true,
        text: "Task 3"
    }];
    this.checkItemDataInDropDownTemplate(assert, dataSource, new Date(2015, 4, 24));
});

QUnit.test("The itemData argument of the drop down appointment template is should be instance of the data source for recurrence rule", function(assert) {
    var dataSource = [{
        startDate: new Date(2015, 4, 24, 9),
        endDate: new Date(2015, 4, 24, 11),
        recurrenceRule: "FREQ=DAILY;COUNT=3",
        allDay: true,
        text: "Task 1"
    }, {
        startDate: new Date(2015, 4, 24, 19),
        endDate: new Date(2015, 4, 24, 31),
        allDay: true,
        recurrenceRule: "FREQ=DAILY;COUNT=2",
        text: "Task 2"
    }, {
        startDate: new Date(2015, 4, 24, 24),
        endDate: new Date(2015, 4, 24, 34),
        allDay: true,
        recurrenceRule: "FREQ=DAILY;COUNT=4",
        text: "Task 3"
    }];
    this.checkItemDataInDropDownTemplate(assert, dataSource, new Date(2015, 4, 24));
});

QUnit.test("Appointment should be rendered without compact ones if only one per cell (even with zoom) (T723354)", function(assert) {
    this.createInstance({
        dataSource: [{
            text: "Recruiting students",
            startDate: new Date(2018, 2, 26, 10, 0),
            endDate: new Date(2018, 2, 26, 11, 0),
            recurrenceRule: "FREQ=DAILY"
        }],
        views: ["timelineMonth"],
        currentView: "timelineMonth",
        currentDate: new Date(2018, 3, 27)
    });

    var $appointment = $(this.instance.$element).find(".dx-scheduler-appointment");
    assert.equal($appointment.length, 30, "Scheduler appointments are rendered without compact ones");
});

QUnit.test("Multi-day appointment is hidden in compact collectors according to head and tail coordinates (T835541)", function(assert) {
    this.createInstance({
        dataSource: [{
            text: "Appointment 1",
            startDate: new Date(2017, 4, 22, 10, 45),
            endDate: new Date(2017, 4, 23, 10, 30)
        }, {
            text: "Appointment 2",
            startDate: new Date(2017, 4, 22, 15, 15),
            endDate: new Date(2017, 4, 23, 13, 0)
        }],
        views: ["week"],
        currentView: "week",
        currentDate: new Date(2017, 4, 21),
        startDayHour: 9,
        height: 800,
        width: 500,
        maxAppointmentsPerCell: 1,
    });

    let compactAppointments = $(this.instance.element).find(".dx-scheduler-appointment-collector-compact");

    assert.strictEqual(compactAppointments.length, 2, "Appointments are rendered");

    const tailCoords = translator.locate($(compactAppointments[1]));

    assert.strictEqual(tailCoords.top, 0, "Appointment top is correct");
    assert.roughEqual(tailCoords.left, 240, 2, "Appointment left is correct");
});
