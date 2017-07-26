"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    dateUtils = require("core/utils/date"),
    BaseView = require("ui/calendar/ui.calendar.base_view"),
    Views = require("ui/calendar/ui.calendar.views"),
    pointerMock = require("../../helpers/pointerMock.js"),
    fx = require("animation/fx"),
    dateSerialization = require("core/utils/date_serialization");

require("common.css!");
require("ui/calendar");

var CALENDAR_EMPTY_CELL_CLASS = "dx-calendar-empty-cell",
    CALENDAR_CELL_CLASS = "dx-calendar-cell",
    CALENDAR_TODAY_CLASS = "dx-calendar-today",
    CALENDAR_OTHER_VIEW_CLASS = "dx-calendar-other-view",
    CALENDAR_SELECTED_DATE_CLASS = "dx-calendar-selected-date",
    CALENDAR_CONTOURED_DATE_CLASS = "dx-calendar-contoured-date";

var getShortDate = function(date) {
    return dateSerialization.serializeDate(date, dateUtils.getShortDateFormat());
};

var getTextsArray = function(elements) {
    var result = [];

    $.each(elements, function(_, element) {
        result.push($(element).text());
    });

    return result;
};

var FakeView = BaseView.inherit({
    _isTodayCell: noop,
    _isDateOutOfRange: function() {
        return false;
    },
    _isOtherView: noop,
    _getCellText: noop,
    _getFirstCellData: noop,
    _getNextCellData: noop,
    _getCellByDate: noop,
    isBoundary: noop,
    _renderValue: noop
});


QUnit.module("Basics");

QUnit.test("all views must be derived from the base view class", function(assert) {
    $.each(Views, function() {
        assert.ok(new this($("<div>")) instanceof BaseView);
    });
});

QUnit.test("onCellClick action should be fired on cell click", function(assert) {
    var $element = $("<div>").appendTo("body");

    try {
        var spy = sinon.spy();
        new FakeView($element, {
            onCellClick: spy
        });

        $element.find("td").eq(4).trigger("dxclick");
        assert.ok(spy.calledOnce, "onCellClick fired once");
    } finally {
        $element.remove();
    }
});

QUnit.test("no contouredDate is set by default", function(assert) {
    var $element = $("<div>").appendTo("body");

    try {
        var view = new FakeView($element, {});
        assert.equal(view.option("contouredDate"), null, "contoured Date is null");
    } finally {
        $element.remove();
    }
});

QUnit.test("onCellClick should not be fired on out of range cells", function(assert) {
    var $element = $("<div>").appendTo("body");

    try {
        var spy = sinon.spy();
        new FakeView($element, {
            onCellClick: spy
        });

        $element.find("." + CALENDAR_CELL_CLASS).addClass(CALENDAR_EMPTY_CELL_CLASS);
        $element.find("." + CALENDAR_CELL_CLASS).eq(5).trigger("dxclick");
        assert.equal(spy.callCount, 0, "onCellClick was not called");
    } finally {
        $element.remove();
    }
});


QUnit.module("MonthView", {
    beforeEach: function() {
        fx.off = true;

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["month"](this.$element, {
            date: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $("<div>").appendTo("body");
        this.view = new Views["month"](this.$element, options);
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("main table should be 6 by 7", function(assert) {
    var table = this.$element.find("tbody");
    assert.ok(table.length === 1, "table has been rendered");

    var rows = table.find("tr");
    assert.ok(rows.length === 6, "with 6 rows");

    for(var i = 0; i < 6; ++i) {
        var columns = $(rows[i]).find("td");
        assert.ok(columns.length === 7, "of 7 columns");
    }
});

QUnit.test("getNavigatorCaption must return a proper caption", function(assert) {
    assert.equal(this.view.getNavigatorCaption(), "October 2013", "caption is correct");
});

QUnit.test("getNavigatorCaption must return a proper caption in RTL mode", function(assert) {
    this.view.option("rtl", true);
    assert.equal(this.view.getNavigatorCaption(), "October 2013", "caption is correct");
});

QUnit.test("day captions must be rendered in proper order", function(assert) {
    var captions = this.$element.find("table").find("th");
    assert.deepEqual(getTextsArray(captions), ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], "day captions order is correct");
});

QUnit.test("day captions must be rendered in proper order in RTL mode", function(assert) {
    this.reinit({
        date: new Date(2013, 9, 16),
        firstDayOfWeek: 1,
        rtl: true
    });

    var captions = this.$element.find("table").find("th");
    assert.deepEqual(getTextsArray(captions), ["Sun", "Sat", "Fri", "Thu", "Wed", "Tue", "Mon"], "day captions order is correct");
});

QUnit.test("dates must be rendered in proper positions", function(assert) {
    var dateCells = this.$element.find("table").find("td");
    assert.deepEqual(getTextsArray(dateCells),
        ["30", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13",
            "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27",
            "28", "29", "30", "31", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
});

QUnit.test("dates must be rendered in proper positions in RTL mode", function(assert) {
    this.reinit({
        date: new Date(2013, 9, 16),
        firstDayOfWeek: 1,
        rtl: true
    });

    var dateCells = this.$element.find("table").find("td");
    assert.deepEqual(getTextsArray(dateCells),
        ["6", "5", "4", "3", "2", "1", "30", "13", "12", "11", "10", "9", "8", "7",
            "20", "19", "18", "17", "16", "15", "14", "27", "26", "25", "24", "23", "22", "21",
            "3", "2", "1", "31", "30", "29", "28", "10", "9", "8", "7", "6", "5", "4"]);
});

QUnit.test("dates must be rendered in proper positions when the first day of the month comes right before the first day of the week", function(assert) {
    this.reinit({
        date: new Date(2013, 8, 11),
        firstDayOfWeek: 1
    });

    var dateCells = this.$element.find("table").find("td");
    assert.deepEqual(getTextsArray(dateCells),
        ["26", "27", "28", "29", "30", "31", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
            "24", "25", "26", "27", "28", "29", "30", "1", "2", "3", "4", "5", "6"]);
});

QUnit.test("non-current month dates must be decorated with a CSS class", function(assert) {
    var dateCells = this.$element.find("table").find("td").filter("." + CALENDAR_OTHER_VIEW_CLASS);
    assert.deepEqual(getTextsArray(dateCells), ["30", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
});

QUnit.test("change value option must add a CSS class to a cell", function(assert) {
    var secondDate = new Date(2013, 9, 1),
        secondDateCell = this.$element.find("table").find("td").eq(1);
    this.view.option("value", secondDate);
    assert.ok(secondDateCell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
});

QUnit.test("it should be possible to specify contouredDate via the constructor", function(assert) {
    var date = new Date(2013, 9, 1);
    this.reinit({
        date: new Date(2013, 9, 16),
        contouredDate: date
    });

    assert.strictEqual(this.view.option("contouredDate"), date);
});

QUnit.test("changing contouredDate must add CALENDAR_CONTOURED_DATE_CLASS class to a cell", function(assert) {
    var date = new Date(2013, 9, 1),
        dateCell = this.$element.find("table").find("td").eq(1);

    this.view.option("contouredDate", date);
    assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
});

QUnit.test("changing contouredDate must remove CALENDAR_CONTOURED_DATE_CLASS class from the old cell", function(assert) {
    var date = new Date(2013, 9, 1),
        newDate = new Date(2013, 9, 2),
        dateCell = this.$element.find("table").find("td").eq(1);

    this.view.option("contouredDate", date);
    assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));

    this.view.option("contouredDate", newDate);
    assert.ok(!dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
});

QUnit.test("today must be decorated with a css class", function(assert) {
    this.reinit({});

    var todayCell = this.$element.find("." + CALENDAR_TODAY_CLASS);
    assert.equal(todayCell.length, 1);
});

QUnit.test("if option.disabled is set in a constructor, cells should not be clickable", function(assert) {
    assert.expect(0);

    this.reinit({
        disabled: true
    });

    this.view.cellClickHandler = function() { assert.ok(false); };

    var date = this.$element.find("table").find("td")[0];
    pointerMock(date).click();
});

QUnit.test("value time component should not be compared in min and max options", function(assert) {
    this.reinit({
        value: new Date(2015, 2, 14, 12),
        min: new Date(2015, 2, 14, 10)
    });
    assert.ok(!$(".dx-calendar-selected-date").hasClass("dx-calendar-empty-cell"), "current date is available");

    this.reinit({
        value: new Date(2015, 2, 14, 12),
        max: new Date(2015, 2, 14, 13)
    });
    assert.ok(!$(".dx-calendar-selected-date").hasClass("dx-calendar-empty-cell"), "current date is available");
});


QUnit.module("YearView", {
    beforeEach: function() {
        fx.off = true;

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["year"](this.$element, {
            date: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $("<div>").appendTo("body");
        this.view = new Views["year"](this.$element, options);
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("main table for year view should be 4 by 3", function(assert) {
    var table = this.$element.find("tbody");

    assert.ok(table.length === 1, "table has been rendered");

    var rows = table.find("tr");
    assert.ok(rows.length === 3, "with 3 rows");

    for(var i = 0; i < 3; ++i) {
        var columns = $(rows[i]).find("td");
        assert.ok(columns.length === 4, "of 4 columns");
    }
});

QUnit.test("getNavigatorCaption must return a proper caption", function(assert) {
    assert.ok(this.view.getNavigatorCaption().toString() === "2013");
});

QUnit.test("month must be rendered in proper positions", function(assert) {
    var dateCells = this.$element.find("table").find("td");
    assert.deepEqual(getTextsArray(dateCells),
        ["Jan", "Feb", "Mar", "Apr", "May",
            "Jun", "Jul", "Aug", "Sep",
            "Oct", "Nov", "Dec"]);
});

QUnit.test("month must be rendered in proper positions in RTL mode", function(assert) {
    this.reinit({
        date: new Date(2015, 2, 1),
        rtl: true
    });

    var dateCells = this.$element.find("table").find("td");
    assert.deepEqual(getTextsArray(dateCells),
        ["Apr", "Mar", "Feb", "Jan",
            "Aug", "Jul", "Jun", "May",
            "Dec", "Nov", "Oct", "Sep"]);
});

QUnit.test("data-value after render for cells in year view", function(assert) {
    var dateCells = this.$element.find("table").find("td"),
        startMonth = 0;

    $.each(dateCells, function(_, dateCell) {
        var shortDate = getShortDate(new Date(2013, startMonth, 1));
        assert.equal(shortDate, $(dateCell).data().value, "data-value has a current value");
        startMonth++;
    });
});

QUnit.test("change value option must add a CSS class to a cell", function(assert) {
    var secondDate = new Date(2013, 1, 1),
        secondDateCell = this.$element.find("table").find("td").eq(1);

    this.view.option("value", secondDate);
    assert.ok(secondDateCell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
});

QUnit.test("changing contouredDate must add CALENDAR_CONTOURED_DATE_CLASS class to a cell", function(assert) {
    var date = new Date(2013, 4, 1),
        dateCell = this.$element.find("table").find("td").eq(4);

    this.view.option("contouredDate", date);
    assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
});

QUnit.test("changing contouredDate must remove CALENDAR_CONTOURED_DATE_CLASS class from the old cell", function(assert) {
    var date = new Date(2013, 9, 1),
        newDate = new Date(2013, 4, 1),
        dateCell = this.$element.find("table").find("td").eq(9);

    this.view.option("contouredDate", date);
    assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));

    this.view.option("contouredDate", newDate);
    assert.ok(!dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
});

QUnit.test("today must be decorated with a css class", function(assert) {
    this.reinit({});

    var todayCell = this.$element.find("." + CALENDAR_TODAY_CLASS);
    assert.equal(todayCell.length, 1);
});


QUnit.module("DecadeView", {
    beforeEach: function() {
        fx.off = true;

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["decade"](this.$element, {
            date: new Date(2013, 9, 16),
            value: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $("<div>").appendTo("body");
        this.view = new Views["decade"](this.$element, options);
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("main table for decade view should be 4 by 3", function(assert) {
    var table = this.$element.find("tbody");

    assert.ok(table.length === 1, "table has been rendered");

    var rows = table.find("tr");
    assert.ok(rows.length === 3, "with 3 rows");

    for(var i = 0; i < 3; ++i) {
        var columns = $(rows[i]).find("td");
        assert.ok(columns.length === 4, "of 4 columns");
    }
});

QUnit.test("getNavigatorCaption must return a proper caption", function(assert) {
    assert.ok(this.view.getNavigatorCaption() === "2010-2019");
});

QUnit.test("years must be rendered in proper positions", function(assert) {
    var dateCells = this.$element.find("table").find("td");
    assert.deepEqual(getTextsArray(dateCells),
        ["2009", "2010", "2011", "2012", "2013",
            "2014", "2015", "2016", "2017",
            "2018", "2019", "2020"]);
});

QUnit.test("years must be rendered in proper positions in RTL mode", function(assert) {
    this.reinit({
        date: new Date(2015, 2, 1),
        rtl: true
    });

    var dateCells = this.$element.find("table").find("td");
    assert.deepEqual(getTextsArray(dateCells),
        ["2012", "2011", "2010", "2009", "2016",
            "2015", "2014", "2013", "2020",
            "2019", "2018", "2017"]);
});

QUnit.test("non-current decade dates must be decorated with a CSS class", function(assert) {
    var dateCells = this.$element.find("table").find("td").filter("." + CALENDAR_OTHER_VIEW_CLASS);
    assert.deepEqual(getTextsArray(dateCells), ["2009", "2020"]);
});

QUnit.test("change value option must add a CSS class to a cell", function(assert) {
    var secondDate = new Date(2010, 1, 1),
        secondDateCell = this.$element.find("table").find("td").eq(1);

    this.view.option("value", secondDate);
    assert.ok(secondDateCell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
});

QUnit.test("changing contouredDate must add CALENDAR_CONTOURED_DATE_CLASS class to a cell", function(assert) {
    var date = new Date(2012, 1, 1),
        dateCell = this.$element.find("table").find("td").eq(3);

    this.view.option("contouredDate", date);
    assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
});

QUnit.test("changing contouredDate must remove CALENDAR_CONTOURED_DATE_CLASS class from the old cell", function(assert) {
    var date = new Date(2012, 1, 1),
        newDate = new Date(2016, 1, 1),
        dateCell = this.$element.find("table").find("td").eq(3);

    this.view.option("contouredDate", date);
    assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));

    this.view.option("contouredDate", newDate);
    assert.ok(!dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
});

QUnit.test("today must be decorated with a css class", function(assert) {
    this.reinit({});

    var todayCell = this.$element.find("." + CALENDAR_TODAY_CLASS);
    assert.equal(todayCell.length, 1);
});

QUnit.test("data-value after render for cells in decade view", function(assert) {
    var dateCells = this.$element.find("table").find("td"),
        startYear = 2009;

    $.each(dateCells, function(_, dateCell) {
        var shortDate = getShortDate(new Date(startYear, 0, 1));
        assert.equal(shortDate, $(dateCell).data().value, "data-value has a current value");
        startYear++;
    });
});


QUnit.module("CenturyView", {
    beforeEach: function() {
        fx.off = true;

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["century"](this.$element, {
            date: new Date(2013, 9, 16),
            value: new Date(2013, 9, 16),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });
    },
    reinit: function(options) {
        this.$element.remove();
        this.$element = $("<div>").appendTo("body");
        this.view = new Views["century"](this.$element, options);
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("main table for century view should be 4 by 3", function(assert) {
    var table = this.$element.find("tbody");

    assert.ok(table.length === 1, "table has been rendered");

    var rows = table.find("tr");
    assert.ok(rows.length === 3, "with 3 rows");

    for(var i = 0; i < 3; ++i) {
        var columns = $(rows[i]).find("td");
        assert.ok(columns.length === 4, "of 4 columns");
    }
});

QUnit.test("getNavigatorCaption must return a proper caption", function(assert) {
    assert.ok(this.view.getNavigatorCaption() === "2000-2099");
});

QUnit.test("decades must be rendered in proper positions", function(assert) {
    var dateCells = this.$element.find("table").find("td");
    assert.deepEqual(getTextsArray(dateCells),
        ["1990 - 1999", "2000 - 2009", "2010 - 2019", "2020 - 2029", "2030 - 2039",
            "2040 - 2049", "2050 - 2059", "2060 - 2069", "2070 - 2079",
            "2080 - 2089", "2090 - 2099", "2100 - 2109"]);
});

QUnit.test("decades must be rendered in proper positions in RTL mode", function(assert) {
    this.reinit({
        date: new Date(2015, 2, 1),
        rtl: true
    });

    var dateCells = this.$element.find("table").find("td");
    assert.deepEqual(getTextsArray(dateCells),
        ["2020 - 2029", "2010 - 2019", "2000 - 2009", "1990 - 1999", "2060 - 2069",
            "2050 - 2059", "2040 - 2049", "2030 - 2039", "2100 - 2109",
            "2090 - 2099", "2080 - 2089", "2070 - 2079"]);
});

QUnit.test("data-value after render for cells in century view", function(assert) {
    var dateCells = this.$element.find("table").find("td"),
        startYear = 1990;

    $.each(dateCells, function(_, dateCell) {
        var shortDate = getShortDate(new Date(startYear, 0, 1));
        assert.equal(shortDate, $(dateCell).data().value, "data-value has a current value");
        startYear += 10;
    });
});

QUnit.test("non-current century dates must be decorated with a CSS class", function(assert) {
    var dateCells = this.$element.find("table").find("td").filter("." + CALENDAR_OTHER_VIEW_CLASS);
    assert.deepEqual(getTextsArray(dateCells), ["1990 - 1999", "2100 - 2109"]);
});

QUnit.test("change value option must add a CSS class to a cell", function(assert) {
    var secondDate = new Date(2010, 1, 1),
        secondDateCell = this.$element.find("table").find("td").eq(2);

    this.view.option("value", secondDate);
    assert.ok(secondDateCell.hasClass(CALENDAR_SELECTED_DATE_CLASS));
});

QUnit.test("changing contouredDate must add CALENDAR_CONTOURED_DATE_CLASS class to a cell", function(assert) {
    var date = new Date(2030, 1, 1),
        dateCell = this.$element.find("table").find("td").eq(4);

    this.view.option("contouredDate", date);
    assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
});

QUnit.test("changing contouredDate must remove CALENDAR_CONTOURED_DATE_CLASS class from the old cell", function(assert) {
    var date = new Date(2030, 1, 1),
        newDate = new Date(2050, 1, 1),
        dateCell = this.$element.find("table").find("td").eq(4);

    this.view.option("contouredDate", date);
    assert.ok(dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));

    this.view.option("contouredDate", newDate);
    assert.ok(!dateCell.hasClass(CALENDAR_CONTOURED_DATE_CLASS));
});

QUnit.test("today must be decorated with a css class", function(assert) {
    this.reinit({});

    var todayCell = this.$element.find("." + CALENDAR_TODAY_CLASS);
    assert.equal(todayCell.length, 1);
});


QUnit.module("MonthView min/max", {
    beforeEach: function() {
        fx.off = true;

        this.min = new Date(2010, 10, 5);
        this.max = new Date(2010, 10, 25);

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["month"](this.$element, {
            min: this.min,
            date: new Date(2010, 10, 10),
            value: new Date(2010, 10, 10),
            max: this.max
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("monthView should not display dates earlier than min and later than max by decorating them with a CSS class", function(assert) {
    var dateCells = this.$element.find("table").find("td"),
        dateCellsText = dateCells.filter("." + CALENDAR_EMPTY_CELL_CLASS).text();

    assert.equal(dateCellsText, "31123426272829301234567891011");
});

QUnit.test("monthView should not allow to select dates earlier than min and later than max via pointer events", function(assert) {
    var dateCells = this.$element.find("table").find("td");

    pointerMock(dateCells[0]).click();
    assert.ok(this.min.valueOf() < this.view.option("value").valueOf());

    pointerMock(dateCells[dateCells.length - 1]).click();
    assert.ok(this.max.valueOf() > this.view.option("value").valueOf());
});

QUnit.test("monthView should not allow to navigate to a date earlier than min and later than max via keyboard events", function(assert) {
    var $element = this.$element,
        view = this.view,
        trigger = function(which) { var e = $.Event("keydown", { which: which }); $element.find("table").trigger(e); };

    view.option("contouredDate", this.min);
    trigger(38);
    assert.deepEqual(view.option("contouredDate"), this.min);

    view.option("contouredDate", this.max);
    trigger(40);
    assert.deepEqual(view.option("contouredDate"), this.max);
});


QUnit.module("MonthView disabledDates", {
    beforeEach: function() {
        fx.off = true;

        this.disabledDates = function(args) {
            if(args.date.getDate() < 5) {
                return true;
            }
        };

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["month"](this.$element, {
            disabledDates: this.disabledDates,
            date: new Date(2010, 10, 10),
            value: new Date(2010, 10, 10)
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("monthView should not display disabled dates by decorating them with a CSS class", function(assert) {
    var dateCells = this.$element.find("table").find("td"),
        dateCellsText = dateCells.filter("." + CALENDAR_EMPTY_CELL_CLASS).text();

    assert.equal(dateCellsText, "12341234");
});

QUnit.test("monthView should not allow to select disabled dates via pointer events", function(assert) {
    var disabledDays = [1, 2, 3, 4],
        dateCells = this.$element.find("table").find("td");

    pointerMock(dateCells[0]).click();
    assert.ok(disabledDays.indexOf(this.view.option("value").getDate()));
});

QUnit.test("monthView should not allow to navigate to a disabled date", function(assert) {
    var $element = this.$element,
        view = this.view,
        trigger = function(which) { var e = $.Event("keydown", { which: which }); $element.find("table").trigger(e); };

    view.option("contouredDate", new Date(2010, 10, 5));
    trigger(38);
    assert.deepEqual(view.option("contouredDate"), new Date(2010, 10, 5));
});


QUnit.module("MonthView disabledDates as array", {
    beforeEach: function() {
        fx.off = true;

        this.disabledDates = [
            new Date(2010, 10, 1),
            new Date(2010, 10, 2),
            new Date(2010, 10, 3),
            new Date(2010, 10, 4)
        ];

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["month"](this.$element, {
            disabledDates: this.disabledDates,
            date: new Date(2010, 10, 10),
            value: new Date(2010, 10, 10)
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("monthView should not display disabled dates by decorating them with a CSS class", function(assert) {
    var dateCells = this.$element.find("table").find("td"),
        dateCellsText = dateCells.filter("." + CALENDAR_EMPTY_CELL_CLASS).text();

    assert.equal(dateCellsText, "1234");
});

QUnit.test("monthView should not allow to select disabled dates via pointer events", function(assert) {
    var disabledDays = [1, 2, 3, 4],
        dateCells = this.$element.find("table").find("td");

    pointerMock(dateCells[0]).click();
    assert.ok(disabledDays.indexOf(this.view.option("value").getDate()));
});

QUnit.test("monthView should not allow to navigate to a disabled date", function(assert) {
    var $element = this.$element,
        view = this.view,
        trigger = function(which) { var e = $.Event("keydown", { which: which }); $element.find("table").trigger(e); };

    view.option("contouredDate", new Date(2010, 10, 5));
    trigger(38);
    assert.deepEqual(view.option("contouredDate"), new Date(2010, 10, 5));
});


QUnit.module("YearView min/max", {
    beforeEach: function() {
        fx.off = true;

        this.min = new Date(2015, 0, 18);
        this.max = new Date(2015, 6, 18);

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["year"](this.$element, {
            min: this.min,
            date: new Date(2015, 3, 15),
            max: this.max
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("yearView should add empty_class for cells out of range ", function(assert) {
    assert.equal(this.$element.find("." + CALENDAR_EMPTY_CELL_CLASS).length, 5, "correct empty cells count was rendered");
});

QUnit.test("yearView should not display dates earlier than min and later than max by decorating them with a CSS class", function(assert) {
    var dateCells = this.$element.find("table").find("td"),
        dateCellsText = dateCells.filter("." + CALENDAR_EMPTY_CELL_CLASS).text();

    assert.equal(dateCellsText, "AugSepOctNovDec");
});

QUnit.test("yearView should not allow to navigate to a date earlier than min and later than max via keyboard events", function(assert) {
    var $element = this.$element,
        view = this.view,
        trigger = function(which) { var e = $.Event("keydown", { which: which }); $element.find("table").trigger(e); };

    view.option("contouredDate", this.min);
    trigger(38);

    assert.deepEqual(view.option("contouredDate"), this.min);
    view.option("contouredDate", this.max);

    trigger(40);
    assert.deepEqual(view.option("contouredDate"), this.max);
});


QUnit.module("YearView disabledDates", {
    beforeEach: function() {
        fx.off = true;

        this.disabledDates = function(args) {
            if(args.date.getMonth() < 3) {
                return true;
            }
        };

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["year"](this.$element, {
            disabledDates: this.disabledDates,
            date: new Date(2015, 3, 15)
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("yearView should add empty_class for disabled dates", function(assert) {
    assert.equal(this.$element.find("." + CALENDAR_EMPTY_CELL_CLASS).length, 3, "correct empty cells count was rendered");
});

QUnit.test("yearView should not display disabled dates by decorating them with a CSS class", function(assert) {
    var dateCells = this.$element.find("table").find("td"),
        dateCellsText = dateCells.filter("." + CALENDAR_EMPTY_CELL_CLASS).text();

    assert.equal(dateCellsText, "JanFebMar");
});

QUnit.test("yearView should not allow to navigate to a disabled date via keyboard events", function(assert) {
    var $element = this.$element,
        view = this.view,
        trigger = function(which) { var e = $.Event("keydown", { which: which }); $element.find("table").trigger(e); };

    view.option("contouredDate", new Date(2015, 3, 15));
    trigger(38);

    assert.deepEqual(view.option("contouredDate"), new Date(2015, 3, 15));
});


QUnit.module("DecadeView min/max", {
    beforeEach: function() {
        fx.off = true;

        this.min = new Date(2013, 0, 18);
        this.max = new Date(2018, 6, 18);

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["decade"](this.$element, {
            min: this.min,
            value: new Date(2015, 3, 15),
            max: this.max
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("decadeView should add empty_class for cells out of range ", function(assert) {
    assert.equal(this.$element.find("." + CALENDAR_EMPTY_CELL_CLASS).length, 6, "correct empty cells count was rendered");
});

QUnit.test("decadeView should not display dates earlier than min and later than max by decorating them with a CSS class", function(assert) {
    var dateCells = this.$element.find("table").find("td"),
        dateCellsText = dateCells.filter("." + CALENDAR_EMPTY_CELL_CLASS).text();

    assert.equal(dateCellsText, "200920102011201220192020");
});

QUnit.test("decadeView should not allow to navigate to a date earlier than min and later than max via keyboard events", function(assert) {
    var $element = this.$element,
        view = this.view,
        trigger = function(which) { var e = $.Event("keydown", { which: which }); $element.find("table").trigger(e); };

    view.option("contouredDate", this.min);
    trigger(38);
    assert.deepEqual(view.option("contouredDate"), this.min);

    view.option("contouredDate", this.max);
    trigger(40);

    assert.deepEqual(view.option("contouredDate"), this.max);
});


QUnit.module("DecadeView disabledDates", {
    beforeEach: function() {
        fx.off = true;

        this.disabledDates = function(args) {
            if(args.date.getFullYear() < 2013) {
                return true;
            }
        };

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["decade"](this.$element, {
            disabledDates: this.disabledDates,
            value: new Date(2015, 3, 15),
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("decadeView should add empty_class for disabled dates", function(assert) {
    assert.equal(this.$element.find("." + CALENDAR_EMPTY_CELL_CLASS).length, 4, "correct empty cells count was rendered");
});

QUnit.test("decadeView should not display disabled dates by decorating them with a CSS class", function(assert) {
    var dateCells = this.$element.find("table").find("td"),
        dateCellsText = dateCells.filter("." + CALENDAR_EMPTY_CELL_CLASS).text();

    assert.equal(dateCellsText, "2009201020112012");
});

QUnit.test("decadeView should not allow to navigate to a disabled date via keyboard events", function(assert) {
    var $element = this.$element,
        view = this.view,
        trigger = function(which) { var e = $.Event("keydown", { which: which }); $element.find("table").trigger(e); };

    view.option("contouredDate", Date(2015, 3, 15));
    trigger(38);
    assert.deepEqual(view.option("contouredDate"), Date(2015, 3, 15));
});


QUnit.module("CenturyView min/max", {
    beforeEach: function() {
        fx.off = true;

        this.min = new Date(2005, 0, 18);
        this.max = new Date(2075, 6, 18);

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["century"](this.$element, {
            min: this.min,
            value: new Date(2015, 3, 15),
            max: this.max
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("centuryView should add empty_class for cells out of range ", function(assert) {
    assert.equal(this.$element.find("." + CALENDAR_EMPTY_CELL_CLASS).length, 4, "correct empty cells count was rendered");
});

QUnit.test("centuryView should not display dates earlier than min and later than max by decorating them with a CSS class", function(assert) {
    var dateCells = this.$element.find("table").find("td"),
        dateCellsText = dateCells.filter("." + CALENDAR_EMPTY_CELL_CLASS).text();

    assert.equal(dateCellsText, "1990 - 19992080 - 20892090 - 20992100 - 2109");
});

QUnit.test("centuryView should not allow to navigate to a date earlier than min and later than max via keyboard events", function(assert) {
    var $element = this.$element,
        view = this.view,
        trigger = function(which) { var e = $.Event("keydown", { which: which }); $element.find("table").trigger(e); };

    view.option("contouredDate", this.min);
    trigger(38);
    assert.deepEqual(view.option("contouredDate"), this.min);
    view.option("contouredDate", this.max);
    trigger(40);
    assert.deepEqual(view.option("contouredDate"), this.max);
});


QUnit.module("CenturyView disabledDates", {
    beforeEach: function() {
        fx.off = true;

        this.disabledDates = function(args) {
            if(args.date.getFullYear() < 2010) {
                return true;
            }
        };

        this.$element = $("<div>").appendTo("body");
        this.view = new Views["century"](this.$element, {
            disabledDates: this.disabledDates,
            value: new Date(2015, 3, 15)
        });
    },
    afterEach: function() {
        this.$element.remove();
        fx.off = false;
    }
});

QUnit.test("centuryView should add empty_class for disabled dates", function(assert) {
    assert.equal(this.$element.find("." + CALENDAR_EMPTY_CELL_CLASS).length, 2, "correct empty cells count was rendered");
});

QUnit.test("centuryView should not display disabled dates by decorating them with a CSS class", function(assert) {
    var dateCells = this.$element.find("table").find("td"),
        dateCellsText = dateCells.filter("." + CALENDAR_EMPTY_CELL_CLASS).text();

    assert.equal(dateCellsText, "1990 - 19992000 - 2009");
});

QUnit.test("centuryView should not allow to navigate to a disabled date via keyboard events", function(assert) {
    var $element = this.$element,
        view = this.view,
        trigger = function(which) { var e = $.Event("keydown", { which: which }); $element.find("table").trigger(e); };

    view.option("contouredDate", new Date(2070, 0, 15));
    trigger(38);
    assert.deepEqual(view.option("contouredDate"), new Date(2070, 0, 15));
});


QUnit.module("Aria accessibility", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("getCellAriaLabel method", function(assert) {
    var expectations = {
        "month": "Monday, June 1, 2015",
        "year": "June 2015",
        "decade": "2015",
        "century": "2010 - 2019"
    };

    $.each(["month", "year", "decade", "century"], function(_, type) {
        var $element = $("<div>").appendTo("body");

        new Views[type]($element, {
            date: new Date(2015, 5, 1),
            value: new Date(2015, 5, 1),
            contouredDate: new Date(2015, 5, 1),
            firstDayOfWeek: 1,
            focusStateEnabled: true
        });

        try {
            var $cell = $element.find("." + CALENDAR_CONTOURED_DATE_CLASS);
            assert.equal($cell.attr("aria-label"), expectations[type], "aria label is correct");
        } finally {
            $element.remove();
        }
    });
});
