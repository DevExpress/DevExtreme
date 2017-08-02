"use strict";

var $ = require("../../core/renderer"),
    noop = require("../../core/utils/common").noop,
    isNumeric = require("../../core/utils/type").isNumeric,
    errors = require("../widget/ui.errors"),
    dateUtils = require("../../core/utils/date"),
    extend = require("../../core/utils/extend").extend,
    registerComponent = require("../../core/component_registrator"),
    devices = require("../../core/devices"),
    Widget = require("../widget/ui.widget"),
    Button = require("../button"),
    Calendar = require("../calendar"),
    Popover = require("../popover"),
    Popup = require("../popup"),
    publisherMixin = require("./ui.scheduler.publisher_mixin"),
    dateLocalization = require("../../localization/date");

var ELEMENT_CLASS = "dx-scheduler-navigator",
    CALENDAR_CLASS = "dx-scheduler-navigator-calendar",
    NEXT_BUTTON_CLASS = "dx-scheduler-navigator-next",
    CAPTION_BUTTON_CLASS = "dx-scheduler-navigator-caption",
    PREVIOUS_BUTTON_CLASS = "dx-scheduler-navigator-previous",

    MONDAY_INDEX = 1;

var getDefaultFirstDayOfWeekIndex = function(shift) {
    return shift ? MONDAY_INDEX : dateLocalization.firstDayOfWeekIndex();
};

var getDateMonthFormat = function(short) {
    return function(date) {
        var monthName = dateLocalization.getMonthNames(short ? "abbreviated" : "wide")[date.getMonth()];
        return [dateLocalization.format(date, "day"), monthName].join(" ");
    };
};

var getMonthYearFormat = function(date) {
    return dateLocalization.getMonthNames("abbreviated")[date.getMonth()] + " " + dateLocalization.format(date, "year");
};

var getCaptionFormat = function(short, intervalCount, duration) {
    var dateMonthFormat = getDateMonthFormat(short);
    return function(date) {
        if(intervalCount > 1) {
            var lastIntervalDate = new Date(date),
                defaultViewDuration = duration;
            lastIntervalDate.setDate(date.getDate() + defaultViewDuration - 1);

            var isDifferentMonthDates = date.getMonth() !== lastIntervalDate.getMonth(),
                useShortFormat = isDifferentMonthDates || short,
                firstWeekDateText = dateLocalization.format(date, isDifferentMonthDates ? getDateMonthFormat(useShortFormat) : "d"),
                lastWeekDateText = dateLocalization.format(lastIntervalDate, getCaptionFormat(useShortFormat));

            return firstWeekDateText + "-" + lastWeekDateText;
        }

        return [dateMonthFormat(date), dateLocalization.format(date, "year")].join(" ");
    };
};

var getWeekCaption = function(date, shift, rejectWeekend) {
    var firstWeekDate = dateUtils.getFirstWeekDate(date, this.option("firstDayOfWeek") || getDefaultFirstDayOfWeekIndex(shift)),
        weekendDuration = 2;

    if(rejectWeekend) {
        firstWeekDate = dateUtils.normalizeDateByWeek(firstWeekDate, date);
    }

    if(this.option("firstDayOfWeek") >= 6 && rejectWeekend) {
        firstWeekDate.setDate(firstWeekDate.getDate() + (7 - this.option("firstDayOfWeek") + 1));
    }

    var lastWeekDate = new Date(firstWeekDate),
        intervalCount = this.option("intervalCount");

    shift = shift || 6;

    lastWeekDate = new Date(lastWeekDate.setDate(lastWeekDate.getDate() + (intervalCount > 1 ? 7 * (intervalCount - 1) + shift : shift)));

    if(lastWeekDate.getDay() % 6 === 0 && rejectWeekend) {
        lastWeekDate.setDate(lastWeekDate.getDate() + weekendDuration);
    }

    var isDifferentMonthDates = firstWeekDate.getMonth() !== lastWeekDate.getMonth(),
        useShortFormat = isDifferentMonthDates || this.option("_useShortDateFormat"),
        firstWeekDateText = dateLocalization.format(firstWeekDate, isDifferentMonthDates ? getDateMonthFormat(useShortFormat) : "d"),
        lastWeekDateText = dateLocalization.format(lastWeekDate, getCaptionFormat(useShortFormat));

    return firstWeekDateText + "-" + lastWeekDateText;
};

var getMonthCaption = function(date) {
    if(this.option("intervalCount") > 1) {
        var firstDate = new Date(date);

        if(firstDate.getDate() !== 1) {
            firstDate.setMonth(firstDate.getMonth() + 1);
        }
        var lastDate = new Date(firstDate);
        lastDate.setMonth(lastDate.getMonth() + this.option("intervalCount") - 1);

        var isSameYear = firstDate.getYear() === lastDate.getYear(),
            lastDateText = getMonthYearFormat(lastDate),
            firstDateText = isSameYear ? dateLocalization.getMonthNames("abbreviated")[firstDate.getMonth()] : getMonthYearFormat(firstDate);

        return firstDateText + "-" + lastDateText;
    } else {
        return dateLocalization.format(date, "monthandyear");
    }
};

var dateGetter = function(date, offset) {
    return new Date(date[this.setter](date[this.getter]() + offset));
};

var getConfig = function(step) {
    var agendaDuration;

    switch(step) {
        case "day":
            return {
                duration: 1 * this.option("intervalCount"),
                setter: "setDate",
                getter: "getDate",
                getDate: dateGetter,
                getCaption: function(date) {
                    var format = getCaptionFormat(this.option("_useShortDateFormat"), this.option("intervalCount"), this._getConfig().duration);
                    return dateLocalization.format(date, format);
                }
            };
        case "week":
            return {
                duration: 7 * this.option("intervalCount"),
                setter: "setDate",
                getter: "getDate",
                getDate: dateGetter,
                getCaption: getWeekCaption
            };
        case "workWeek":
            return {
                duration: 7 * this.option("intervalCount"),
                setter: "setDate",
                getter: "getDate",
                getDate: dateGetter,
                getCaption: function(date) {
                    return getWeekCaption.call(this, date, 4, true);
                }
            };
        case "month":
            return {
                duration: 1 * this.option("intervalCount"),
                setter: "setMonth",
                getter: "getMonth",
                getDate: function(date, offset) {
                    var currentDate = date.getDate();
                    if(currentDate !== 1 && Math.abs(offset) !== 1) {
                        date.setMonth(date.getMonth() + 1);
                    }
                    date.setDate(1);

                    date = dateGetter.call(this, date, offset);

                    var lastDate = dateUtils.getLastMonthDay(date);
                    date.setDate(currentDate < lastDate ? currentDate : lastDate);
                    return date;
                },
                getCaption: getMonthCaption
            };
        case "agenda":
            agendaDuration = this.invoke("getAgendaDuration");
            agendaDuration = isNumeric(agendaDuration) && agendaDuration > 0 ? agendaDuration : 7;

            return {
                duration: agendaDuration,
                setter: "setDate",
                getter: "getDate",
                getDate: dateGetter,
                getCaption: function(date) {
                    var format = getCaptionFormat(this.option("_useShortDateFormat"));

                    if(agendaDuration > 1) {
                        var lastDate = new Date(date);

                        lastDate.setDate(lastDate.getDate() + agendaDuration - 1);
                        return dateLocalization.format(date, "d") + "-" + dateLocalization.format(lastDate, format);
                    } else {
                        return dateLocalization.format(date, format);
                    }
                }
            };
    }
};

var SchedulerNavigator = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            date: new Date(),
            step: "day",
            intervalCount: 1,
            min: undefined,
            max: undefined,
            firstDayOfWeek: undefined,
            _useShortDateFormat: false
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return !devices.real().generic || devices.isSimulator();
                },
                options: {
                    _useShortDateFormat: true
                }
            }
        ]);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "step":
            case "date":
            case "intervalCount":
                this._updateButtonsState();
                this._renderCaption();
                this._setCalendarOption("value", this.option("date"));
                break;
            case "min":
            case "max":
                this._updateButtonsState();
                this._setCalendarOption(args.name, args.value);
                break;
            case "firstDayOfWeek":
                this._setCalendarOption(args.name, args.value);
                break;
            case "tabIndex":
            case "focusStateEnabled":
                this._next.option(args.name, args.value);
                this._caption.option(args.name, args.value);
                this._prev.option(args.name, args.value);
                this._setCalendarOption(args.name, args.value);
                this.callBase(args);
                break;
            case "_useShortDateFormat":
                break;
            default:
                this.callBase(args);
        }
    },

    _init: function() {
        this.callBase();
        this.element().addClass(ELEMENT_CLASS);
        this._initButtons();
    },

    _initButtons: function() {
        var $next = $("<div>").addClass(NEXT_BUTTON_CLASS);

        this._next = this._createComponent($next, Button, {
            icon: "chevronnext",
            onClick: this._updateCurrentDate.bind(this, 1),
            focusStateEnabled: this.option("focusStateEnabled"),
            tabIndex: this.option("tabIndex"),
            integrationOptions: {}
        });

        var $caption = $("<div>").addClass(CAPTION_BUTTON_CLASS);
        this._caption = this._createComponent($caption, Button, {
            focusStateEnabled: this.option("focusStateEnabled"),
            tabIndex: this.option("tabIndex"),
            integrationOptions: {}
        });

        var $prev = $("<div>").addClass(PREVIOUS_BUTTON_CLASS);
        this._prev = this._createComponent($prev, Button, {
            icon: "chevronprev",
            onClick: this._updateCurrentDate.bind(this, -1),
            focusStateEnabled: this.option("focusStateEnabled"),
            tabIndex: this.option("tabIndex"),
            integrationOptions: {}
        });

        this.setAria("label", "Next period", $next);
        this.setAria("label", "Previous period", $prev);

        this._updateButtonsState();
        this.element().append($prev, $caption, $next);
    },

    _updateButtonsState: function() {
        var min = this.option("min"),
            max = this.option("max");

        this._prev.option("disabled", min && this._getNextDate(-1) <= min);
        this._next.option("disabled", max && this._getNextDate(1) >= max);
    },

    _updateCurrentDate: function(direction) {
        var date = this._getNextDate(direction);

        dateUtils.normalizeDate(date, this.option("min"), this.option("max"));
        this.notifyObserver("currentDateUpdated", date);
    },

    _getNextDate: function(direction) {
        var stepConfig = this._getConfig(),
            offset = stepConfig.duration * direction,
            date = stepConfig.getDate(new Date(this.option("date")), offset);

        return date;
    },

    _renderFocusTarget: noop,

    _render: function() {
        this.callBase();

        this._renderPopover();
        this._renderCaption();
        this._renderCaptionKeys();
    },

    _renderPopover: function() {
        var overlayType = !devices.current().generic ? Popup : Popover;

        this._popover = this._createComponent("<div>", overlayType, {
            onContentReady: this._popoverContentReadyHandler.bind(this),
            defaultOptionsRules: [
                {
                    device: function() {
                        return !devices.current().generic;
                    },
                    options: {
                        fullScreen: true,
                        showCloseButton: false,
                        toolbarItems: [{ shortcut: "cancel" }]
                    }
                },
                {
                    device: function() {
                        return devices.current().generic;
                    },
                    options: {
                        target: this._caption.element()
                    }
                }
            ]
        });
        this._popover.element().appendTo(this.element());
    },

    _popoverContentReadyHandler: function() {
        this._calendar = this._createComponent($("<div>"), Calendar, this._calendarOptions());
        this._calendar.element().addClass(CALENDAR_CLASS);
        this._popover.content().append(this._calendar.element());
    },

    _calendarOptions: function() {
        return {
            min: this.option("min"),
            max: this.option("max"),
            firstDayOfWeek: this.option("firstDayOfWeek"),
            value: this.option("date"),
            focusStateEnabled: this.option("focusStateEnabled"),
            onValueChanged: (function(e) {
                if(!this.option("visible")) return;

                this.notifyObserver("currentDateUpdated", e.value);
                this._popover.hide();
            }).bind(this),
            hasFocus: function() { return true; },
            tabIndex: null,
            _keyboardProcessor: this._calendarKeyboardProcessor
        };
    },

    _renderCaption: function() {
        var date = this.option("date"),
            caption = this._getConfig().getCaption.call(this, date);

        this._caption.option({
            text: caption,
            onClick: (function() {
                this._popover.toggle();
            }).bind(this)
        });
    },

    _renderCaptionKeys: function() {
        if(!this.option("focusStateEnabled") || this.option("disabled")) {
            return;
        }

        this._calendarKeyboardProcessor = this._caption._keyboardProcessor.attachChildProcessor();
        this._setCalendarOption("_keyboardProcessor", this._calendarKeyboardProcessor);

        var that = this,
            executeHandler = function() {
                if(that._popover.content().is(":hidden")) {
                    that._popover.show();
                } else {
                    return true;
                }
            },
            tabHandler = function() {
                that._popover.hide();
            };

        this._caption.registerKeyHandler("enter", executeHandler);
        this._caption.registerKeyHandler("space", executeHandler);
        this._caption.registerKeyHandler("tab", tabHandler);
    },

    _setCalendarOption: function(name, value) {
        if(this._calendar) {
            this._calendar.option(name, value);
        }
    },

    _getConfig: function() {
        var step = this.option("step"),
            config = getConfig.call(this, step);

        if(!config) {
            throw errors.Error("E1033", step);
        }

        return config;
    }

}).include(publisherMixin);

registerComponent("dxSchedulerNavigator", SchedulerNavigator);

module.exports = SchedulerNavigator;
