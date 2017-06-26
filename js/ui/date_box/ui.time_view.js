"use strict";

var $ = require("../../core/renderer"),
    Editor = require("../editor/editor"),
    NumberBox = require("../number_box"),
    Box = require("../box"),
    extend = require("../../core/utils/extend").extend,
    registerComponent = require("../../core/component_registrator"),
    dateLocalization = require("../../localization/date");

var TIMEVIEW_CLASS = "dx-timeview",
    TIMEVIEW_CLOCK_CLASS = "dx-timeview-clock",
    TIMEVIEW_FIELD_CLASS = "dx-timeview-field",
    TIMEVIEW_HOURARROW_CLASS = "dx-timeview-hourarrow",
    TIMEVIEW_TIME_SEPARATOR_CLASS = "dx-timeview-time-separator",
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
            _showClock: true,
            _arrowOffset: 0
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

        this.element().addClass(TIMEVIEW_CLASS);
    },

    _render: function() {
        this.callBase();

        this._renderBox();
        this._updateTime();
    },

    _renderBox: function() {
        var $box = $("<div>").appendTo(this.element()),
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

    _renderClock: function(_, __, $container) {
        this._$hourArrow = $("<div>").addClass(TIMEVIEW_HOURARROW_CLASS);
        this._$minuteArrow = $("<div>").addClass(TIMEVIEW_MINUTEARROW_CLASS);

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

    _renderField: function() {
        this._createHourBox();
        this._createMinuteBox();

        return this._createComponent($("<div>").addClass(TIMEVIEW_FIELD_CLASS), Box, {
            direction: "row",
            align: "center",
            crossAlign: "center",
            items: [{
                ratio: 0,
                shrink: 0,
                baseSize: "auto",
                template: (function() { return this._hourBox.element(); }).bind(this)
            }, {
                ratio: 0,
                shrink: 0,
                baseSize: "auto",
                template: $("<div>", { "class": TIMEVIEW_TIME_SEPARATOR_CLASS }).text(dateLocalization.getTimeSeparator())
            }, {
                ratio: 0,
                shrink: 0,
                baseSize: "auto",
                template: (function() { return this._minuteBox.element(); }).bind(this)
            }]
        }).element();
    },

    _createHourBox: function() {
        this._hourBox = this._createComponent($("<div>"), NumberBox, extend({
            min: -1,
            max: 24,
            value: this._getValue().getHours(),
            onValueChanged: (function(args) {
                var newHours = (24 + args.value) % 24;
                this._hourBox.option("value", newHours);

                var time = new Date(this._getValue());
                time.setHours(newHours);
                this.option("value", time);
            }).bind(this)
        }, this._getNumberBoxConfig()));

        this._hourBox.setAria("label", "hours");
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
                this.option("value", time);
            }).bind(this)
        }, this._getNumberBoxConfig()));

        this._minuteBox.setAria("label", "minutes");
    },

    _getNumberBoxConfig: function() {
        return {
            showSpinButtons: true,
            disabled: this.option("disabled"),
            valueFormat: function(value) {
                return (value < 10 ? "0" : "") + value;
            }
        };
    },

    _updateField: function() {
        this._hourBox && this._hourBox.option("value", this._getValue().getHours());
        this._minuteBox && this._minuteBox.option("value", this._getValue().getMinutes());
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
            case "_showClock":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    }

});

registerComponent("dxTimeView", TimeView);

module.exports = TimeView;
