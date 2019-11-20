import $ from "../../core/renderer";
import Editor from "../editor/editor";
import NumberBox from "../number_box";
import SelectBox from "../select_box";
import Box from "../box";
import { extend } from "../../core/utils/extend";
import registerComponent from "../../core/component_registrator";
import { getTimeSeparator, getPeriodNames } from "../../localization/date";
import { normalizeTime } from "./ui.date_utils";

const TIMEVIEW_CLASS = "dx-timeview";
const TIMEVIEW_CLOCK_CLASS = "dx-timeview-clock";
const TIMEVIEW_FIELD_CLASS = "dx-timeview-field";
const TIMEVIEW_HOURARROW_CLASS = "dx-timeview-hourarrow";
const TIMEVIEW_TIME_SEPARATOR_CLASS = "dx-timeview-time-separator";
const TIMEVIEW_FORMAT12_CLASS = "dx-timeview-format12";
const TIMEVIEW_FORMAT12_AM = -1;
const TIMEVIEW_FORMAT12_PM = 1;
const TIMEVIEW_MINUTEARROW_CLASS = "dx-timeview-minutearrow";

const rotateArrow = function($arrow, angle, offset) {
    cssRotate($arrow, angle, offset);
};

const cssRotate = function($arrow, angle, offset) {
    $arrow.css("transform", "rotate(" + angle + "deg)" + " translate(0," + offset + "px)");
};


const TimeView = Editor.inherit({

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
        const $box = $("<div>").appendTo(this.$element());
        const items = [];

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

        const $container = $(container);
        $container.addClass(TIMEVIEW_CLOCK_CLASS)
            .append(this._$hourArrow)
            .append(this._$minuteArrow);

        this.setAria("role", "presentation", $container);
    },

    _updateClock: function() {
        const time = this._getValue();
        const hourArrowAngle = time.getHours() / 12 * 360 + time.getMinutes() / 60 * 30;
        const minuteArrowAngle = time.getMinutes() / 60 * 360;

        rotateArrow(this._$hourArrow, hourArrowAngle, this.option("_arrowOffset"));
        rotateArrow(this._$minuteArrow, minuteArrowAngle, this.option("_arrowOffset"));
    },

    _getBoxItems: function(is12HourFormat) {
        const items = [{
            ratio: 0,
            shrink: 0,
            baseSize: "auto",
            template: () => this._hourBox.$element()
        }, {
            ratio: 0,
            shrink: 0,
            baseSize: "auto",
            template: $("<div>").addClass(TIMEVIEW_TIME_SEPARATOR_CLASS).text(getTimeSeparator())
        }, {
            ratio: 0,
            shrink: 0,
            baseSize: "auto",
            template: () => this._minuteBox.$element()
        }];

        if(is12HourFormat) {
            items.push({
                ratio: 0,
                shrink: 0,
                baseSize: "auto",
                template: () => this._format12.$element()
            });
        }

        return items;
    },

    _renderField: function() {
        const is12HourFormat = !this.option("use24HourFormat");

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

    _attachKeyboardProcessorToEditor: function(editor) {
        const keyboardProcessor = editor._keyboardProcessor;

        if(keyboardProcessor) {
            keyboardProcessor
                .attachChildProcessor()
                .reinitialize(this._keyboardHandler, this);
        }
    },

    _createHourBox: function() {
        const editor = this._hourBox = this._createComponent($("<div>"), NumberBox, extend({
            min: -1,
            max: 24,
            value: this._getValue().getHours(),
            onValueChanged: this._onHourBoxValueChanged.bind(this),
        }, this._getNumberBoxConfig()));

        editor.setAria("label", "hours");
        this._attachKeyboardProcessorToEditor(editor);
    },

    _isPM: function() {
        return !this.option("use24HourFormat") && this._format12.option("value") === 1;
    },

    _onHourBoxValueChanged: function(args) {
        const currentValue = this._getValue();
        const newValue = new Date(currentValue);
        let newHours = this._convertMaxHourToMin(args.value);

        if(this._isPM()) {
            newHours += 12;
        }

        newValue.setHours(newHours);
        normalizeTime(newValue);
        this.option("value", newValue);
    },

    _convertMaxHourToMin: function(hours) {
        const maxHoursValue = this.option("use24HourFormat") ? 24 : 12;
        return (maxHoursValue + hours) % maxHoursValue;
    },

    _createMinuteBox: function() {
        const editor = this._minuteBox = this._createComponent($("<div>"), NumberBox, extend({
            min: -1,
            max: 60,
            value: this._getValue().getMinutes(),
            onValueChanged: ({ value, component }) => {
                const newMinutes = (60 + value) % 60;
                component.option("value", newMinutes);

                const time = new Date(this._getValue());
                time.setMinutes(newMinutes);
                normalizeTime(time);
                this.option("value", time);
            }
        }, this._getNumberBoxConfig()));

        editor.setAria("label", "minutes");
        this._attachKeyboardProcessorToEditor(editor);
    },

    _createFormat12Box: function() {
        const periodNames = getPeriodNames();
        const editor = this._format12 = this._createComponent($("<div>").addClass(TIMEVIEW_FORMAT12_CLASS), SelectBox, {
            items: [
                { value: TIMEVIEW_FORMAT12_AM, text: periodNames[0] },
                { value: TIMEVIEW_FORMAT12_PM, text: periodNames[1] }
            ],
            valueExpr: "value",
            displayExpr: "text",
            onValueChanged: ({ value }) => {
                const hours = this._getValue().getHours();
                const time = new Date(this._getValue());
                const newHours = (hours + value * 12) % 24;

                time.setHours(newHours);
                this.option("value", time);
            },
            value: this._getValue().getHours() >= 12 ? TIMEVIEW_FORMAT12_PM : TIMEVIEW_FORMAT12_AM,
            stylingMode: this.option("stylingMode")
        });

        this._attachKeyboardProcessorToEditor(editor);
        editor.setAria("label", "type");
    },

    _refreshFormat12: function() {
        if(this.option("use24HourFormat")) return;

        const value = this._getValue();
        const hours = value.getHours();
        const isPM = hours >= 12;
        const newValue = isPM ? TIMEVIEW_FORMAT12_PM : TIMEVIEW_FORMAT12_AM;

        this._silentEditorValueUpdate(this._format12, newValue);
    },

    _silentEditorValueUpdate: function(editor, value) {
        if(editor) {
            editor._suppressValueChangeAction();
            editor.option("value", value);
            editor._resumeValueChangeAction();
        }
    },

    _getNumberBoxConfig: function() {
        return {
            showSpinButtons: true,
            displayValueFormatter: function(value) {
                return (value < 10 ? "0" : "") + value;
            },
            stylingMode: this.option("stylingMode")
        };
    },

    _normalizeHours: function(hours) {
        return this.option("use24HourFormat") ? hours : hours % 12 || 12;
    },

    _updateField: function() {
        const hours = this._normalizeHours(this._getValue().getHours());

        this._silentEditorValueUpdate(this._hourBox, hours);
        this._silentEditorValueUpdate(this._minuteBox, this._getValue().getMinutes());

        this._refreshFormat12();
    },

    _updateTime: function() {
        if(this.option("_showClock")) {
            this._updateClock();
        }

        this._updateField();
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._updateTime();
        }
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
