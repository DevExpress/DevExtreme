var $ = require("jquery");

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
