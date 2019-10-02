var $ = require("jquery");
var translator = require("animation/translator");

QUnit.testStart(function() {
    $("#qunit-fixture").html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

require("common.css!");
require("generic_light.css!");


var fx = require("animation/fx"),
    Color = require("color"),
    DataSource = require("data/data_source/data_source").DataSource;

require("ui/scheduler/ui.scheduler");

QUnit.module("Integration: RTL", {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $("#scheduler").dxScheduler($.extend(options, { height: 600, maxAppointmentsPerCell: null })).dxScheduler("instance");
        };
        this.getAppointmentColor = function($task) {
            return new Color($task.css("backgroundColor")).toHex();
        };
        this.clock = sinon.useFakeTimers();
        this.tasks = [
            {
                text: "Task 1",
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            }
        ];
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("Appointment should have correct position with multiple resources if rtlEnabled is true (T803275)", function(assert) {
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

    var scheduler = $("#scheduler").dxScheduler({
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
    }).dxScheduler("instance");

    views.forEach(view => {
        var getAppointment = function(index) {
            return scheduler.$element().find(".dx-scheduler-appointment").eq(index);
        };
        var expectedValue = expectedValues[view];

        scheduler.option("currentView", view);

        [getAppointment(0), getAppointment(1)].forEach((appointment, index) => {
            var position = translator.locate(appointment);

            assert.roughEqual(Math.round(position.left), expectedValue[index].left, 2.1, `left position of ${index} appointment should be correct in ${view} view`);
            assert.roughEqual(Math.round(position.top), expectedValue[index].top, 2.1, `top position of ${index} appointment should be correct in ${view} view`);
        });
    });
});

QUnit.test("Task positions, day view", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, rtlEnabled: true, currentView: "day" });

    var $targetCell = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(8),
        $appointment = this.instance.$element().find(".dx-scheduler-appointment").eq(0);

    assert.equal($appointment.position().left + $appointment.outerWidth(), $targetCell.position().left + $targetCell.outerWidth(), "task position is correct");
});

QUnit.test("Task positions, week view", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, rtlEnabled: true, currentView: "week" });

    var $cell = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(1),
        $appointment = this.instance.$element().find(".dx-scheduler-appointment").eq(0);

    assert.equal(Math.round($appointment.position().left + $appointment.outerWidth()), Math.round($cell.position().left + $cell.outerWidth()), "task position is correct");
});

QUnit.test("Task positions, month view", function(assert) {
    var data = new DataSource({
        store: this.tasks
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, rtlEnabled: true, currentView: "month" });

    var $cell = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(1),
        $appointment = this.instance.$element().find(".dx-scheduler-appointment").eq(0);

    assert.roughEqual($appointment.position().left + $appointment.outerWidth(), $cell.position().left + $cell.outerWidth(), 1, "task position is correct");
});
