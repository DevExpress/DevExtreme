"use strict";

var $ = require("../../core/renderer"),
    registerComponent = require("../../core/component_registrator"),
    commonUtils = require("../../core/utils/common"),
    compareVersions = require("../../core/utils/version").compare,
    extend = require("../../core/utils/extend").extend,
    support = require("../../core/utils/support"),
    devices = require("../../core/devices"),
    config = require("../../core/config"),
    dateUtils = require("../../core/utils/date"),
    uiDateUtils = require("./ui.date_utils"),
    dateSerialization = require("../../core/utils/date_serialization"),
    DropDownEditor = require("../drop_down_editor/ui.drop_down_editor"),
    dateLocalization = require("../../localization/date"),
    messageLocalization = require("../../localization/message"),

    DATEBOX_CLASS = "dx-datebox",
    DX_AUTO_WIDTH_CLASS = "dx-auto-width",
    DATEBOX_WRAPPER_CLASS = "dx-datebox-wrapper";

var PICKER_TYPE = {
    calendar: "calendar",
    rollers: "rollers",
    list: "list",
    native: "native"
};

var TYPE = {
    date: "date",
    datetime: "datetime",
    time: "time"
};

var STRATEGY_NAME = {
    calendar: 'Calendar',
    dateView: 'DateView',
    native: 'Native',
    calendarWithTime: 'CalendarWithTime',
    list: 'List'
};

var STRATEGY_CLASSES = {
    Calendar: require("./ui.date_box.strategy.calendar"),
    DateView: require("./ui.date_box.strategy.date_view"),
    Native: require("./ui.date_box.strategy.native"),
    CalendarWithTime: require("./ui.date_box.strategy.calendar_with_time"),
    List: require("./ui.date_box.strategy.list")
};

var isRealWidthSet = function($element) {
    var explicitWidth = $element[0].style.width;

    if(explicitWidth && explicitWidth !== "auto" && explicitWidth !== "inherit") {
        return true;
    }

    return false;
};

var calculateWidth = function(value, $input, $element) {
    var IE_ROUNDING_ERROR = 10;
    var NATIVE_BUTTONS_WIDTH = 48;
    var $longestValueElement = $("<div>").text(value).css({
        "font-style": $input.css("font-style"),
        "font-variant": $input.css("font-variant"),
        "font-weight": $input.css("font-weight"),
        "font-size": $input.css("font-size"),
        "font-family": $input.css("font-family"),
        "letter-spacing": $input.css("letter-spacing"),
        "padding-left": $input.css("padding-left"),
        "padding-right": $input.css("padding-right"),
        "border": $input.css("border"),
        "visibility": "hidden",
        "white-space": "nowrap",
        "position": "absolute",
        "float": "left"
    });

    $longestValueElement.appendTo($element);
    var width = $longestValueElement.outerWidth() + IE_ROUNDING_ERROR + ($input.prop("type") !== "text" ? NATIVE_BUTTONS_WIDTH : 0);
    $longestValueElement.remove();

    return width;
};

var DateBox = DropDownEditor.inherit({

    _supportedKeys: function() {
        return extend(this.callBase(), this._strategy.supportedKeys());
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            /**
            * @name dxDateBoxOptions_format
            * @publicName format
            * @deprecated dxDateBoxOptions_type
            * @extend_doc
            */
            "format": { since: "16.1", alias: "type" },

            /**
            * @name dxDateBoxOptions_formatString
            * @publicName formatString
            * @deprecated dxDateBoxOptions_displayFormat
            * @extend_doc
            */
            "formatString": { since: "16.1", alias: "displayFormat" },

            "useNative": { since: "15.1", message: "'useNative' option is deprecated in 15.1. Use the 'pickerType' option instead" },
            "useCalendar": { since: "15.1", message: "'useCalendar' option is deprecated in 15.1. Use the 'pickerType' option instead" }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxDateBoxOptions_type
            * @publicName type
            * @type string
            * @default "date"
            * @acceptValues 'date'|'time'|'datetime'
            */
            type: "date",

            /**
            * @name dxDateBoxOptions_value
            * @publicName value
            * @type Date|number|string
            * @default null
            */
            value: null,

            /**
            * @name dxDateBoxOptions_dateSerializationFormat
            * @publicName dateSerializationFormat
            * @type string
            * @default undefined
            */
            dateSerializationFormat: undefined,

            /**
            * @name dxDateBoxOptions_min
            * @publicName min
            * @type Date|number|string
            * @default undefined
            */
            min: undefined,

            /**
            * @name dxDateBoxOptions_max
            * @publicName max
            * @type Date|number|string
            * @default undefined
            */
            max: undefined,

            /**
            * @name dxDateBoxOptions_placeholder
            * @publicName placeholder
            * @type string
            * @default ""
            */

            /**
            * @name dxDateBoxOptions_useCalendar
            * @publicName useCalendar
            * @type boolean
            * @default false
            * @deprecated
            */
            useCalendar: false,

            /**
            * @name dxDateBoxOptions_displayFormat
            * @publicName displayFormat
            * @type format
            * @default null
            */
            displayFormat: null,

            /**
            * @name dxDateBoxOptions_interval
            * @publicName interval
            * @type number
            * @default 30
            */
            interval: 30,

            /**
            * @name dxDateBoxOptions_maxZoomLevel
            * @publicName maxZoomLevel
            * @type string
            * @default 'month'
            * @acceptValues 'month'|'year'|'decade'|'century'
            */
            maxZoomLevel: "month",

            /**
            * @name dxDateBoxOptions_minZoomLevel
            * @publicName minZoomLevel
            * @type string
            * @default 'century'
            * @acceptValues 'month'|'year'|'decade'|'century'
            */
            minZoomLevel: "century",

            /**
            * @name dxDateBoxOptions_useNative
            * @publicName useNative
            * @type boolean
            * @default true
            * @deprecated
            */
            useNative: true,

            /**
            * @name dxDateBoxOptions_pickerType
            * @publicName pickerType
            * @type string
            * @default 'native'
            * @acceptValues 'native'|'calendar'|'rollers'|'list'
            */
            pickerType: PICKER_TYPE["native"],

            /**
            * @name dxDateBoxOptions_invalidDateMessage
            * @publicName invalidDateMessage
            * @type string
            * @default "Value must be a date or time"
            */
            invalidDateMessage: messageLocalization.format("dxDateBox-validation-datetime"),

            /**
            * @name dxDateBoxOptions_dateOutOfRangeMessage
            * @publicName dateOutOfRangeMessage
            * @type string
            * @default "Value is out of range"
            */
            dateOutOfRangeMessage: messageLocalization.format("validation-range"),

            /**
           * @name dxDateBoxOptions_applyButtonText
           * @publicName applyButtonText
           * @type string
           * @default "Done"
           */
            applyButtonText: messageLocalization.format("Done"),

            /**
           * @name dxDateBoxOptions_cancelButtonText
           * @publicName cancelButtonText
           * @type string
           * @default "Cancel"
           */

            /**
            * @name dxDateBoxMethods_open
            * @publicName open()
            */

            /**
            * @name dxDateBoxMethods_close
            * @publicName close()
            */

            /**
            * @name dxDateBoxOptions_adaptivityEnabled
            * @publicName adaptivityEnabled
            * @type boolean
            * @default false
            */
            adaptivityEnabled: false,

            /**
             * @name dxDateBoxOptions_onContentReady
             * @publicName onContentReady
             * @extends Action
             * @hidden false
             * @action
             * @extend_doc
             */
            onContentReady: null
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: { platform: "ios" },
                options: {
                    showPopupTitle: true
                }
            },
            {
                device: function(device) {
                    return device.platform === "android";
                },
                options: {
                    buttonsLocation: "bottom after"
                }
            },
            {
                device: function(device) {
                    return device.platform === "win" && device.version && device.version[0] === 8;
                },
                options: {
                    buttonsLocation: "bottom after"
                }
            },
            {
                device: function(device) {
                    return device.platform === "win" && device.version && device.version[0] === 10;
                },
                options: {
                    buttonsLocation: "bottom center"
                }
            },
            {
                device: function() {
                    var realDevice = devices.real(),
                        platform = realDevice.platform,
                        version = realDevice.version;

                    return platform === "generic" || platform === "win" || (platform === "android" && compareVersions(version, [4, 4]) < 0);
                },
                options: {
                    /**
                    * @name dxDateBoxOptions_pickerType
                    * @publicName pickerType
                    * @custom_default_for_android_below_version_4 "rollers"
                    * @custom_default_for_desktop "rollers"
                    * @custom_default_for_windows "rollers"
                    */
                    pickerType: PICKER_TYPE.rollers
                }
            },
            {
                device: {
                    platform: "generic",
                    deviceType: "desktop"
                },
                options: {
                    /**
                    * @name dxDateBoxOptions_pickerType
                    * @publicName pickerType
                    * @custom_default_for_generic_desktop "calendar"
                    */
                    pickerType: PICKER_TYPE.calendar,
                    buttonsLocation: "bottom after"
                }
            },
            {
                device: function() {
                    var realDevice = devices.real(),
                        platform = realDevice.platform,
                        isPhone = realDevice.phone;

                    return platform === "win" && !isPhone;
                },
                options: {
                    /**
                    * @name dxDateBoxOptions_pickerType
                    * @publicName pickerType
                    * @custom_default_for_no-phone_windows "calendar"
                    */
                    pickerType: PICKER_TYPE.calendar
                }
            }
        ]);
    },

    _initOptions: function(options) {
        this._userOptions = extend({}, options);
        this.callBase(options);
        this._updatePickerOptions(this._userOptions);
    },

    _updatePickerOptions: function(userOptions) {
        var pickerType = this._getPickerTypeByDeprecatedOptions(userOptions);

        var type = this.option("type");

        if(pickerType === PICKER_TYPE.list && (type === TYPE.datetime || type === TYPE.date)) {
            pickerType = PICKER_TYPE.calendar;
        }

        if(type === TYPE.time && pickerType === PICKER_TYPE.calendar) {
            pickerType = PICKER_TYPE.list;
        }

        this.option("showDropDownButton", devices.real().platform !== "generic" || pickerType !== PICKER_TYPE["native"]);
        this._pickerType = pickerType;
    },

    _getPickerTypeByDeprecatedOptions: function(userOptions) {
        return userOptions.pickerType
            ? userOptions.pickerType
            : commonUtils.isDefined(userOptions.useCalendar) || commonUtils.isDefined(userOptions.useNative)
                ? this._getPickerType()
                : this._pickerType || this.option("pickerType");
    },

    _getPickerType: function() {
        if(this.option().useCalendar) {
            return this.option("type") === TYPE.time ? PICKER_TYPE.list : PICKER_TYPE.calendar;
        }

        if(this.option().useNative) {
            return PICKER_TYPE["native"];
        }

        return PICKER_TYPE.rollers;
    },

    _init: function() {
        this._initStrategy();
        this.option(extend({}, this._strategy.getDefaultOptions(), this._userOptions));
        delete this._userOptions;

        this.callBase();
    },

    _toLowerCaseFirstLetter: function(string) {
        return string.charAt(0).toLowerCase() + string.substr(1);
    },

    _initStrategy: function() {
        var strategyName = this._getStrategyName(this._getFormatType()),
            strategy = STRATEGY_CLASSES[strategyName];

        if(!(this._strategy && this._strategy.NAME === strategyName)) {
            this._strategy = new strategy(this);
        }
    },

    _getFormatType: function() {
        var currentType = this.option("type");
        var isTime = /h|m|s/g.test(currentType),
            isDate = /d|M|Y/g.test(currentType);
        var type = "";

        if(isDate) {
            type += TYPE.date;
        }

        if(isTime) {
            type += TYPE.time;
        }

        return type;
    },

    _getStrategyName: function(type) {
        var pickerType = this._pickerType;

        if(pickerType === PICKER_TYPE.rollers) {
            return this.option().useCalendar ? STRATEGY_NAME.calendar : STRATEGY_NAME.dateView;
        }

        if(pickerType === PICKER_TYPE["native"]) {
            return STRATEGY_NAME["native"];
        }

        if(type === TYPE.date) {
            return STRATEGY_NAME.calendar;
        }

        if(type === TYPE.datetime) {
            return STRATEGY_NAME.calendarWithTime;
        }

        return STRATEGY_NAME.list;
    },

    _render: function() {
        this.element().addClass(DATEBOX_CLASS);

        this._refreshFormatClass();
        this._refreshPickerTypeClass();
        this._renderSubmitElement();
        this.callBase();

        this._updateSize();
        this._strategy.renderInputMinMax(this._input());
    },

    _renderDimensions: function() {
        this.callBase();
        this.element().toggleClass(DX_AUTO_WIDTH_CLASS, !this.option("width"));
    },

    _refreshFormatClass: function() {
        var $element = this.element();

        $.each(TYPE, function(_, item) {
            $element.removeClass(DATEBOX_CLASS + "-" + item);
        });

        $element.addClass(DATEBOX_CLASS + "-" + this.option("type"));
    },

    _refreshPickerTypeClass: function() {
        var $element = this.element();

        $.each(PICKER_TYPE, function(_, item) {
            $element.removeClass(DATEBOX_CLASS + "-" + item);
        });

        $element.addClass(DATEBOX_CLASS + "-" + this._pickerType);
    },

    _renderSubmitElement: function() {
        this._$submitElement = $("<input>")
            .attr("type", "hidden")
            .appendTo(this.element());
    },

    _getSubmitElement: function() {
        return this._$submitElement;
    },

    _updateSize: function() {
        var $element = this.element(),
            widthOption = this.option("width"),
            isWidthSet = commonUtils.isDefined(widthOption) || (isRealWidthSet($element) && !this._isSizeUpdatable),
            isElementVisible = $element.is(":visible"),
            pickerType = this._pickerType,
            // NOTE: no calculateWidth if type is rollers, why?
            shouldCalculateWidth = pickerType !== PICKER_TYPE.rollers && devices.current().platform === "generic";

        if(isWidthSet || !(shouldCalculateWidth && isElementVisible)) {
            return;
        }

        var $input = this._input(),
            format = this._strategy.getDisplayFormat(this.option("displayFormat")),
            longestValue = dateLocalization.format(uiDateUtils.getLongestDate(format, dateLocalization.getMonthNames(), dateLocalization.getDayNames()), format);

        $element.width(calculateWidth(longestValue, $input, this.element()));
        this._isSizeUpdatable = true;
    },

    _attachChildKeyboardEvents: function() {
        this._strategy.attachKeyboardEvents(this._keyboardProcessor);
    },

    _renderPopup: function() {
        this.callBase();
        this._popup._wrapper().addClass(DATEBOX_WRAPPER_CLASS);
        this._renderPopupWrapper();
    },

    _popupConfig: function() {
        var popupConfig = this.callBase();
        return extend(this._strategy.popupConfig(popupConfig), {
            title: this._getPopupTitle(),
            dragEnabled: false
        });
    },

    _renderPopupWrapper: function() {
        if(!this._popup) {
            return;
        }

        var $element = this.element();
        var classPostfixes = extend({}, TYPE, PICKER_TYPE);

        $.each(classPostfixes, (function(_, item) {
            $element.removeClass(DATEBOX_WRAPPER_CLASS + "-" + item);
        }).bind(this));

        this._popup._wrapper()
            .addClass(DATEBOX_WRAPPER_CLASS + "-" + this.option("type"))
            .addClass(DATEBOX_WRAPPER_CLASS + "-" + this._pickerType);
    },

    _renderPopupContent: function() {
        this.callBase();
        this._strategy.renderPopupContent();
    },

    _getFirstPopupElement: function() {
        return this._strategy.getFirstPopupElement() || this.callBase();
    },

    _getLastPopupElement: function() {
        return this._strategy.getLastPopupElement() || this.callBase();
    },

    _popupShowingHandler: function() {
        this.callBase();
        this._strategy.popupShowingHandler();
    },

    _popupHiddenHandler: function() {
        this.callBase();
        this._strategy.popupHiddenHandler();
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._updateSize();
        }
    },

    _readOnlyPropValue: function() {
        return this.callBase() || this._pickerType === PICKER_TYPE.rollers;
    },

    _clearButtonVisibility: function() {
        return this.callBase() && !this._isNativeType();
    },

    _renderValue: function() {
        var value = this.dateOption("value"),
            dateSerializationFormat = this.option("dateSerializationFormat");

        this.option("text", this._getDisplayedText(value));

        var submitFormat = uiDateUtils.SUBMIT_FORMATS_MAP[this.option("type")];
        var submitValue = dateSerializationFormat ? dateSerialization.serializeDate(value, dateSerializationFormat) : uiDateUtils.toStandardDateFormat(value, submitFormat);
        this._$submitElement.val(submitValue);

        this._strategy.renderValue();
        this.callBase();
    },

    _getDisplayedText: function(value) {
        var mode = this.option("mode"),
            displayedText;

        if(mode === "text") {
            var displayFormat = this._strategy.getDisplayFormat(this.option("displayFormat"));
            displayedText = dateLocalization.format(value, displayFormat);
        } else {
            var format = this._getFormatByMode(mode);

            if(format) {
                displayedText = dateLocalization.format(value, format);
            } else {
                displayedText = uiDateUtils.toStandardDateFormat(value, mode);
            }
        }

        return displayedText;
    },

    _getFormatByMode: function(mode) {
        return support.inputType(mode) ? null : uiDateUtils.FORMATS_MAP[mode];
    },

    _valueChangeEventHandler: function(e) {
        var text = this.option("text"),
            parsedDate = this._getParsedDate(text),
            value = this.dateOption("value"),
            type = this.option("type"),
            newValue = uiDateUtils.mergeDates(value, parsedDate, type),
            date = parsedDate && type === "time" ? newValue : parsedDate;

        if(this._validateValue(date)) {
            var displayedText = this._getDisplayedText(newValue);

            if(value && newValue && value.getTime() === newValue.getTime() && displayedText !== text) {
                this._renderValue();
            } else {
                this.dateValue(newValue, e);
            }
        }

        this.validationRequest.fire({
            value: newValue,
            editor: this
        });
    },

    _getParsedDate: function(text) {
        var displayFormat = this._strategy.getDisplayFormat(this.option("displayFormat"));
        var parsedText = this._strategy.getParsedText(text, displayFormat);

        return commonUtils.isDefined(parsedText) ? parsedText : undefined;
    },

    _validateValue: function(value) {
        var text = this.option("text"),
            hasText = !!text && value !== null,
            isDate = !!value && commonUtils.isDate(value) && !isNaN(value.getTime()),
            isDateInRange = isDate && dateUtils.dateInRange(value, this.dateOption("min"), this.dateOption("max"), this.option("type")),
            isValid = !hasText || !hasText && !value || isDateInRange,
            validationMessage = "";

        if(!isDate) {
            validationMessage = this.option("invalidDateMessage");
        } else if(!isDateInRange) {
            validationMessage = this.option("dateOutOfRangeMessage");
        }

        this.option({
            isValid: isValid,
            validationError: isValid ? null : {
                editorSpecific: true,
                message: validationMessage
            }
        });

        return isValid;
    },

    _isValueChanged: function(newValue) {
        var oldValue = this.dateOption("value"),
            oldTime = oldValue && oldValue.getTime(),
            newTime = newValue && newValue.getTime();

        return oldTime !== newTime;
    },

    _renderProps: function() {
        this.callBase();
        this._input().attr("autocomplete", "off");
    },

    _renderOpenedState: function() {
        if(!this._isNativeType()) {
            this.callBase();
        }

        if(this._strategy.isAdaptivityChanged()) {
            this._refreshStrategy();
        }

        this._strategy.renderOpenedState();
    },

    _getPopupTitle: function() {
        var placeholder = this.option("placeholder");

        if(placeholder) {
            return placeholder;
        }

        var type = this.option("type");

        if(type === TYPE.time) {
            return messageLocalization.format("dxDateBox-simulatedDataPickerTitleTime");
        }

        if(type === TYPE.date || type === TYPE.datetime) {
            return messageLocalization.format("dxDateBox-simulatedDataPickerTitleDate");
        }

        return "";
    },

    _renderPlaceholder: function() {
        this._popup && this._popup.option("title", this._getPopupTitle());
        this.callBase();
    },

    _refreshStrategy: function() {
        this._strategy.dispose();
        this._initStrategy();
        this.option(this._strategy.getDefaultOptions());
        this._refresh();
    },

    _applyButtonHandler: function() {
        this.dateValue(this._strategy.getValue());
        this.callBase();
    },

    _dispose: function() {
        this._strategy && this._strategy.dispose();
        this.callBase();
    },

    _isNativeType: function() {
        return this._pickerType === PICKER_TYPE["native"];
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "useCalendar":
                this._updatePickerOptions({ useCalendar: args.value });
                this._refreshStrategy();
                break;
            case "useNative":
                this._updatePickerOptions({ useNative: args.value });
                this._refreshStrategy();
                break;
            case "showClearButton":
                this.callBase.apply(this, arguments);
                this._updateSize();
                break;
            case "pickerType":
                this._updatePickerOptions({ pickerType: args.value });
                this._refreshStrategy();
                this._refreshPickerTypeClass();
                this._invalidate();
                break;
            case "type":
                this._updatePickerOptions({ format: args.value });
                this._refreshStrategy();
                this._refreshFormatClass();
                this._renderPopupWrapper();
                this._updateSize();
                break;
            case "placeholder":
                this._renderPlaceholder();
                break;
            case "min":
            case "max":
                this._validateValue(this.dateOption("value"));
                this._invalidate();
                break;
            case "dateSerializationFormat":
            case "readOnly":
            case "interval":
            case "minZoomLevel":
            case "maxZoomLevel":
                this._invalidate();
                break;
            case "displayFormat":
                this._updateValue();
                break;
            case "formatWidthCalculator":
                break;
            case "closeOnValueChange":
                var applyValueMode = args.value ? "instantly" : "useButtons";
                this.option("applyValueMode", applyValueMode);
                break;
            case "applyValueMode":
                this._suppressDeprecatedWarnings();
                this.option("closeOnValueChange", args.value === "instantly");
                this._resumeDeprecatedWarnings();
                this.callBase.apply(this, arguments);
                break;
            case "text":
                this._strategy.textChangedHandler(args.value);
                this.callBase.apply(this, arguments);
                break;
            case "isValid":
                this.callBase.apply(this, arguments);
                this._updateSize();
                break;
            case "value":
                this._validateValue(this.dateOption("value"));
                this.callBase.apply(this, arguments);
                break;
            case "showDropDownButton":
            case "invalidDateMessage":
            case "dateOutOfRangeMessage":
            case "adaptivityEnabled":
                break;
            default:
                this.callBase.apply(this, arguments);
        }
    },

    _getSerializationFormat: function() {
        var value = this.option("value");

        if(this.option("dateSerializationFormat") && config().forceIsoDateParsing) {
            return this.option("dateSerializationFormat");
        }

        if(commonUtils.isNumeric(value)) {
            return "number";
        }

        if(!commonUtils.isString(value)) {
            return;
        }

        return dateSerialization.getDateSerializationFormat(value);
    },

    dateValue: function() {
        var jQueryEvent = arguments[1],
            value = arguments[0];

        if(this._isValueChanged(value) && jQueryEvent) {
            this._saveValueChangeEvent(jQueryEvent);
        }

        return this.dateOption("value", value);
    },

    dateOption: function(optionName, value) {
        if(arguments.length === 1) {
            return dateSerialization.deserializeDate(this.option(optionName));
        }

        var serializationFormat = this._getSerializationFormat();
        this.option(optionName, dateSerialization.serializeDate(value, serializationFormat));
    },

    reset: function() {
        this.callBase();
        this._updateValue();
    }
});

registerComponent("dxDateBox", DateBox);

module.exports = DateBox;
