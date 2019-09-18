var $ = require("../../core/renderer"),
    Editor = require("../editor/editor"),
    NumberBox = require("../number_box"),
    SelectBox = require("../select_box"),
    Box = require("../box"),
    extend = require("../../core/utils/extend").extend,
    registerComponent = require("../../core/component_registrator"),
    dateLocalization = require("../../localization/date"),
    uiDateUtils = require("./ui.date_utils");

var TIMEVIEW_CLASS = "dx-timeview",
    TIMEVIEW_CLOCK_CLASS = "dx-timeview-clock",
    TIMEVIEW_FIELD_CLASS = "dx-timeview-field",
    TIMEVIEW_HOURARROW_CLASS = "dx-timeview-hourarrow",
    TIMEVIEW_TIME_SEPARATOR_CLASS = "dx-timeview-time-separator",
    TIMEVIEW_FORMAT12_CLASS = "dx-timeview-format12",
    TIMEVIEW_FORMAT12_AM = -1,
    TIMEVIEW_FORMAT12_PM = 1,
    TIMEVIEW_MINUTEARROW_CLASS = "dx-timeview-minutearrow";

var rotateArrow = function($arrow, angle, offset) {
    cssRotate($arrow, angle, offset);
};

var cssRotate = function($arrow, angle, offset) {
    $arrow.css("transform", "rotate(" + angle + "deg)" + " translate(0," + offset + "px)");
};


var TimeView = Editor.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            value: new Date(Date.now()),
            use24HourFormat: true,
            _showClock: true,
            _arrowOffset: 0,
            stylingMode: undefined
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: { platform: "android" },
                options: {
                    _arrowOffset: 15
                }
            },
            {
                device: { platform: "generic" },
                options: {
                    _arrowOffset: 5
                }
            }
        ]);
    },

    _getValue: function() {
        return this.option("value") || new Date();
    },

    _init: function() {
        this.callBase();

        this.$element().addClass(TIMEVIEW_CLASS);
    },

    _render: function() {
        this.callBase();

        this._renderBox();
        this._updateTime();
    },

    _renderBox: function() {
        var $box = $("<div>").appendTo(this.$element()),
            items = [];

        if(this.option("_showClock")) {
            items.push({
                ratio: 1,
                shrink: 0,
                baseSize: "auto",
                template: this._renderClock.bind(this)
            });
        }

        items.push({
            ratio: 0,
            shrink: 0,
            baseSize: 50,
            template: this._renderField.bind(this)
        });

        this._createComponent($box, Box, {
            height: "100%",
            width: "100%",
            direction: "col",
            items: items
        });
    },

    _renderClock: function(_, __, container) {
        this._$hourArrow = $("<div>").addClass(TIMEVIEW_HOURARROW_CLASS);
        this._$minuteArrow = $("<div>").addClass(TIMEVIEW_MINUTEARROW_CLASS);

        var $container = $(container);
        $container.addClass(TIMEVIEW_CLOCK_CLASS)
            .append(this._$hourArrow)
            .append(this._$minuteArrow);

        this.setAria("role", "presentation", $container);
    },

    _updateClock: function() {
        var time = this._getValue(),
            hourArrowAngle = time.getHours() / 12 * 360 + time.getMinutes() / 60 * 30,
            minuteArrowAngle = time.getMinutes() / 60 * 360;

        rotateArrow(this._$hourArrow, hourArrowAngle, this.option("_arrowOffset"));
        rotateArrow(this._$minuteArrow, minuteArrowAngle, this.option("_arrowOffset"));
    },

    _getBoxItems: function(is12HourFormat) {
        var items = [{
            ratio: 0,
            shrink: 0,
            baseSize: "auto",
            template: (function() { return this._hourBox.$element(); }).bind(this)
        }, {
            ratio: 0,
            shrink: 0,
            baseSize: "auto",
            template: $("<div>").addClass(TIMEVIEW_TIME_SEPARATOR_CLASS).text(dateLocalization.getTimeSeparator())
        }, {
            ratio: 0,
            shrink: 0,
            baseSize: "auto",
            template: (function() { return this._minuteBox.$element(); }).bind(this)
        }];

        if(is12HourFormat) {
            items.push({
                ratio: 0,
                shrink: 0,
                baseSize: "auto",
                template: (function() { return this._format12.$element(); }).bind(this)
            });
        }

        return items;
    },

    _renderField: function() {
        var is12HourFormat = !this.option("use24HourFormat");

        this._createHourBox();
        this._createMinuteBox();

        if(is12HourFormat) {
            this._createFormat12Box();
        }

        return this._createComponent($("<div>").addClass(TIMEVIEW_FIELD_CLASS), Box, {
            direction: "row",
            align: "center",
            crossAlign: "center",
            items: this._getBoxItems(is12HourFormat)
        }).$element();
    },

    _createHourBox: function() {
        this._hourBox = this._createComponent($("<div>"), NumberBox, extend({
            min: -1,
            max: 24,
            value: this._getValue().getHours(),
            onValueChanged: this._onHourBoxValueChanged.bind(this),
        }, this._getNumberBoxConfig()));

        this._hourBox.setAria("label", "hours");
    },

    _isPM: function() {
        return !this.option("use24HourFormat") && this._format12.option("value") === 1;
    },

    _onHourBoxValueChanged: function(args) {
        var currentValue = this._getValue(),
            newHours = this._convertMaxHourToMin(args.value),
            newValue = new Date(currentValue);

        if(this._isPM()) {
            newHours += 12;
        }

        newValue.setHours(newHours);
        uiDateUtils.normalizeTime(newValue);
        this.option("value", newValue);
    },

    _convertMaxHourToMin: function(hours) {
        var maxHoursValue = this.option("use24HourFormat") ? 24 : 12;
        return (maxHoursValue + hours) % maxHoursValue;
    },

    _createMinuteBox: function() {
        this._minuteBox = this._createComponent($("<div>"), NumberBox, extend({
            min: -1,
            max: 60,
            value: this._getValue().getMinutes(),
            onValueChanged: (function(args) {
                var newMinutes = (60 + args.value) % 60;
                this._minuteBox.option("value", newMinutes);

                var time = new Date(this._getValue());
                time.setMinutes(newMinutes);
                uiDateUtils.normalizeTime(time);
                this.option("value", time);
            }).bind(this)
        }, this._getNumberBoxConfig()));

        this._minuteBox.setAria("label", "minutes");
    },

    _createFormat12Box: function() {
        var periodNames = dateLocalization.getPeriodNames();
        this._format12 = this._createComponent($("<div>").addClass(TIMEVIEW_FORMAT12_CLASS), SelectBox, extend({
            items: [
                { value: TIMEVIEW_FORMAT12_AM, text: periodNames[0] },
                { value: TIMEVIEW_FORMAT12_PM, text: periodNames[1] }
            ],
            valueExpr: "value",
            displayExpr: "text",
            onValueChanged: (function(args) {
                var hours = this._getValue().getHours(),
                    time = new Date(this._getValue()),
                    newHours = (hours + args.value * 12) % 24;

                time.setHours(newHours);
                this.option("value", time);
            }).bind(this),
            value: this._getValue().getHours() >= 12 ? TIMEVIEW_FORMAT12_PM : TIMEVIEW_FORMAT12_AM
        }, {
            stylingMode: this.option("stylingMode")
        }));

        this._format12.setAria("label", "type");
    },

    _refreshFormat12: function() {
        if(this.option("use24HourFormat")) return;

        var value = this._getValue(),
            hours = value.getHours(),
            isPM = hours >= 12;

        this._format12._valueChangeActionSuppressed = true;
        this._format12.option("value", isPM ? TIMEVIEW_FORMAT12_PM : TIMEVIEW_FORMAT12_AM);
        this._format12._valueChangeActionSuppressed = false;
    },

    _getNumberBoxConfig: function() {
        return extend({
            showSpinButtons: true,
            disabled: this.option("disabled"),
            valueFormat: function(value) {
                return (value < 10 ? "0" : "") + value;
            }
        }, {
            stylingMode: this.option("stylingMode")
        });
    },

    _normalizeHours: function(hours) {
        return this.option("use24HourFormat") ? hours : hours % 12 || 12;
    },

    _updateField: function() {
        if(this._hourBox) {
            this._hourBox._valueChangeActionSuppressed = true;
            this._hourBox.option("value", this._normalizeHours(this._getValue().getHours()));
            this._hourBox._valueChangeActionSuppressed = false;
        }

        if(this._minuteBox) {
            this._minuteBox._valueChangeActionSuppressed = true;
            this._minuteBox.option("value", this._getValue().getMinutes());
            this._minuteBox._valueChangeActionSuppressed = false;
        }

        this._refreshFormat12();
    },

    _updateTime: function() {
        if(this.option("_showClock")) this._updateClock();
        this._updateField();
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._updateTime();
        }
    },

    _toggleDisabledState: function(value) {
        this._hourBox && this._hourBox.option("disabled", value);
        this._minuteBox && this._minuteBox.option("disabled", value);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "value":
                this._updateTime();
                this.callBase(args);
                break;
            case "_arrowOffset":
                break;
            case "use24HourFormat":
            case "_showClock":
            case "stylingMode":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    }

});

registerComponent("dxTimeView", TimeView);

module.exports = TimeView;
