var windowUtils = require("../../core/utils/window"),
    window = windowUtils.getWindow(),
    registerComponent = require("../../core/component_registrator"),
    typeUtils = require("../../core/utils/type"),
    dom = require("../../core/utils/dom"),
    each = require("../../core/utils/iterator").each,
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
    DX_INVALID_BADGE_CLASS = "dx-show-invalid-badge",
    DX_CLEAR_BUTTON_CLASS = "dx-clear-button-area",
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

var DateBox = DropDownEditor.inherit({

    _supportedKeys: function() {
        return extend(this.callBase(), this._strategy.supportedKeys());
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            "maxZoomLevel": { since: "18.1", alias: "calendarOptions.maxZoomLevel" },
            "minZoomLevel": { since: "18.1", alias: "calendarOptions.minZoomLevel" }
        });
    },

    _renderButtonContainers: function() {
        this.callBase.apply(this, arguments);
        this._strategy.customizeButtons();
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
             * @name dxDateBoxOptions.type
             * @type Enums.DateBoxType
             * @default "date"
             */
            type: "date",

            /**
             * @name dxDateBoxOptions.showAnalogClock
             * @type boolean
             * @default true
             */
            showAnalogClock: true,

            /**
             * @name dxDateBoxOptions.value
             * @type Date|number|string
             * @default null
             */
            value: null,

            /**
             * @name dxDateBoxOptions.dateSerializationFormat
             * @type string
             * @default undefined
             */
            dateSerializationFormat: undefined,

            /**
             * @name dxDateBoxOptions.min
             * @type Date|number|string
             * @default undefined
             */
            min: undefined,

            /**
             * @name dxDateBoxOptions.max
             * @type Date|number|string
             * @default undefined
             */
            max: undefined,

            /**
             * @name dxDateBoxOptions.placeholder
             * @type string
             * @default ""
             */

            /**
             * @name dxDateBoxOptions.displayFormat
             * @type format
             * @default null
             */
            displayFormat: null,

            /**
             * @name dxDateBoxOptions.interval
             * @type number
             * @default 30
             */
            interval: 30,

            /**
             * @name dxDateBoxOptions.disabledDates
             * @type Array<Date>|function(data)
             * @default null
             * @type_function_param1 data:object
             * @type_function_param1_field1 component:dxDateBox
             * @type_function_param1_field2 date:Date
             * @type_function_param1_field3 view:string
             * @type_function_return boolean
             */
            disabledDates: null,

            /**
             * @name dxDateBoxOptions.maxZoomLevel
             * @type Enums.CalendarZoomLevel
             * @default 'month'
             * @deprecated dxDateBoxOptions.calendarOptions
             */
            maxZoomLevel: "month",

            /**
             * @name dxDateBoxOptions.minZoomLevel
             * @type Enums.CalendarZoomLevel
             * @default 'century'
             * @deprecated dxDateBoxOptions.calendarOptions
             */
            minZoomLevel: "century",

            /**
             * @name dxDateBoxOptions.pickerType
             * @type Enums.DateBoxPickerType
             * @default 'calendar'
             */
            pickerType: PICKER_TYPE["calendar"],

            /**
             * @name dxDateBoxOptions.invalidDateMessage
             * @type string
             * @default "Value must be a date or time"
             */
            invalidDateMessage: messageLocalization.format("dxDateBox-validation-datetime"),

            /**
             * @name dxDateBoxOptions.dateOutOfRangeMessage
             * @type string
             * @default "Value is out of range"
             */
            dateOutOfRangeMessage: messageLocalization.format("validation-range"),

            /**
             * @name dxDateBoxOptions.applyButtonText
             * @type string
             * @default "OK"
             */
            applyButtonText: messageLocalization.format("OK"),

            /**
             * @name dxDateBoxOptions.cancelButtonText
             * @type string
             * @default "Cancel"
             */

            /**
             * @name dxDateBoxMethods.open
             * @publicName open()
             */

            /**
             * @name dxDateBoxMethods.close
             * @publicName close()
             */

            /**
             * @name dxDateBoxOptions.adaptivityEnabled
             * @type boolean
             * @default false
             */
            adaptivityEnabled: false,

            /**
             * @name dxDateBoxOptions.calendarOptions
             * @type dxCalendarOptions
             * @default {}
             */
            calendarOptions: {},

            useHiddenSubmitElement: true
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
                device: { platform: "android" },
                options: {
                    buttonsLocation: "bottom after"
                }
            },
            {
                device: function() {
                    var realDevice = devices.real(),
                        platform = realDevice.platform;
                    return platform === "ios" || platform === "android";
                },
                options: {
                    /**
                     * @name dxDateBoxOptions.pickerType
                     * @default 'native' @for iOS
                     * @default 'native' @for Android
                     */
                    pickerType: PICKER_TYPE.native
                }
            },
            {
                device: function(currentDevice) {
                    var realDevice = devices.real(),
                        platform = realDevice.platform,
                        version = realDevice.version;
                    return platform === "generic" && currentDevice.deviceType !== "desktop" || (platform === "android" && compareVersions(version, [4, 4]) < 0);
                },
                options: {
                    /**
                     * @name dxDateBoxOptions.pickerType
                     * @default 'rollers' @for Android_below_version_4.4
                     * @default 'rollers' @for mobile_devices
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
                    buttonsLocation: "bottom after"
                }
            }
        ]);
    },

    _initOptions: function(options) {
        this._userOptions = extend({}, options);
        this.callBase(options);
        this._updatePickerOptions();
    },

    _updatePickerOptions: function() {
        var pickerType = this.option("pickerType");
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

    _init: function() {
        this._initStrategy();
        this.option(extend({}, this._strategy.getDefaultOptions(), this._userOptions));
        delete this._userOptions;
        this._skipCustomValidation = false;
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
            return STRATEGY_NAME.dateView;
        } else if(pickerType === PICKER_TYPE.native) {
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

    _initMarkup: function() {
        this.$element().addClass(DATEBOX_CLASS);

        this.callBase();

        this._refreshFormatClass();
        this._refreshPickerTypeClass();

        this._strategy.renderInputMinMax(this._input());
    },

    _render: function() {
        this.callBase();

        this._formatValidationIcon();
    },

    _renderDimensions: function() {
        this.callBase();
        this.$element().toggleClass(DX_AUTO_WIDTH_CLASS, !this.option("width"));
    },

    _refreshFormatClass: function() {
        var $element = this.$element();

        each(TYPE, function(_, item) {
            $element.removeClass(DATEBOX_CLASS + "-" + item);
        });

        $element.addClass(DATEBOX_CLASS + "-" + this.option("type"));
    },

    _refreshPickerTypeClass: function() {
        var $element = this.$element();

        each(PICKER_TYPE, function(_, item) {
            $element.removeClass(DATEBOX_CLASS + "-" + item);
        });

        $element.addClass(DATEBOX_CLASS + "-" + this._pickerType);
    },

    _formatValidationIcon: function() {
        if(!windowUtils.hasWindow()) {
            return;
        }

        var format = this._strategy.getDisplayFormat(this.option("displayFormat")),
            longestValue = dateLocalization.format(uiDateUtils.getLongestDate(format, dateLocalization.getMonthNames(), dateLocalization.getDayNames()), format);
        var $input = this._input();
        var inputElement = $input.get(0);
        var $dateBox = this.$element();
        var $longestValueElement = dom.createTextElementHiddenCopy($input, longestValue);
        var isPaddingStored = this.storedPadding !== undefined;
        var storedPadding = !isPaddingStored ? 0 : this.storedPadding;
        var isRtlEnabled = this.option("rtlEnabled");

        $longestValueElement.appendTo($dateBox);
        var elementWidth = parseFloat(window.getComputedStyle($longestValueElement.get(0)).width);
        var rightPadding = parseFloat(window.getComputedStyle(inputElement).paddingRight);
        var leftPadding = parseFloat(window.getComputedStyle(inputElement).paddingLeft);
        var necessaryWidth = elementWidth + leftPadding + rightPadding + storedPadding;
        $longestValueElement.remove();

        var clearButtonWidth = 0;
        if(this._isClearButtonVisible() && $input.val() === "") {
            var clearButtonElement = $dateBox.find("." + DX_CLEAR_BUTTON_CLASS).get(0);
            clearButtonWidth = parseFloat(window.getComputedStyle(clearButtonElement).width);
        }

        var curWidth = parseFloat(window.getComputedStyle(inputElement).width) - clearButtonWidth;
        var shouldHideValidationIcon = (necessaryWidth > curWidth);

        var style = inputElement.style;
        $dateBox.toggleClass(DX_INVALID_BADGE_CLASS, !shouldHideValidationIcon);
        if(shouldHideValidationIcon) {
            if(!isPaddingStored) {
                this.storedPadding = isRtlEnabled ? leftPadding : rightPadding;
            }
            isRtlEnabled ? style.paddingLeft = 0 : style.paddingRight = 0;
        } else {
            isRtlEnabled ? style.paddingLeft = this.storedPadding + "px" : style.paddingRight = this.storedPadding + "px";
        }
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

        var $element = this.$element();
        var classPostfixes = extend({}, TYPE, PICKER_TYPE);

        each(classPostfixes, (function(_, item) {
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
            this._formatValidationIcon();
        }
    },

    _clearValueHandler: function(e) {
        this.option("text", "");
        this.callBase(e);
    },

    _readOnlyPropValue: function() {
        if(this._pickerType === PICKER_TYPE.rollers) {
            return true;
        }

        var platform = devices.real().platform,
            isCustomValueDisabled = this._isNativeType() && (platform === "ios" || platform === "android");

        if(isCustomValueDisabled) {
            return this.option("readOnly");
        }

        return this.callBase();
    },

    _isClearButtonVisible: function() {
        return this.callBase() && !this._isNativeType();
    },

    _renderValue: function() {
        var value = this.dateOption("value");

        this.option("text", this._getDisplayedText(value));
        this._strategy.renderValue();

        return this.callBase();
    },

    _setSubmitValue: function() {
        var value = this.dateOption("value");
        var dateSerializationFormat = this.option("dateSerializationFormat");
        var submitFormat = uiDateUtils.SUBMIT_FORMATS_MAP[this.option("type")];
        var submitValue = dateSerializationFormat ? dateSerialization.serializeDate(value, dateSerializationFormat) : uiDateUtils.toStandardDateFormat(value, submitFormat);

        this._getSubmitElement().val(submitValue);
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
            currentValue = this.dateOption("value");

        if(text === this._getDisplayedText(currentValue)) {
            this._validateValue(currentValue);
            return;
        }

        var parsedDate = this._getParsedDate(text),
            value = currentValue || this._getDateByDefault(),
            type = this.option("type"),
            newValue = uiDateUtils.mergeDates(value, parsedDate, type),
            date = parsedDate && type === "time" ? newValue : parsedDate;

        if(this._applyInternalValidation(date)) {
            var displayedText = this._getDisplayedText(newValue);

            if(value && newValue && value.getTime() === newValue.getTime() && displayedText !== text) {
                this._renderValue();
            } else {
                this.dateValue(newValue, e);
            }
        }

        this._applyCustomValidation(newValue);
    },

    _getDateByDefault: function() {
        return this._strategy.useCurrentDateByDefault() && this._strategy.getDefaultDate();
    },

    _getParsedDate: function(text) {
        var displayFormat = this._strategy.getDisplayFormat(this.option("displayFormat"));
        var parsedText = this._strategy.getParsedText(text, displayFormat);

        return typeUtils.isDefined(parsedText) ? parsedText : undefined;
    },

    _validateValue: function(value) {
        const internalResult = this._applyInternalValidation(value),
            customResult = !this._skipCustomValidation ? this._applyCustomValidation(value) : true;
        this._skipCustomValidation = false;
        return internalResult && customResult;
    },

    _applyInternalValidation(value) {
        var text = this.option("text"),
            hasText = !!text && value !== null,
            isDate = !!value && typeUtils.isDate(value) && !isNaN(value.getTime()),
            isDateInRange = isDate && dateUtils.dateInRange(value, this.dateOption("min"), this.dateOption("max"), this.option("type")),
            isValid = !hasText && !value || isDateInRange,
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

    _applyCustomValidation: function(value) {
        this.validationRequest.fire({
            editor: this,
            value
        });

        return this.option("isValid");
    },

    _isValueChanged: function(newValue) {
        var oldValue = this.dateOption("value"),
            oldTime = oldValue && oldValue.getTime(),
            newTime = newValue && newValue.getTime();

        return oldTime !== newTime;
    },

    _isTextChanged: function(newValue) {
        var oldText = this.option("text"),
            newText = newValue && this._getDisplayedText(newValue) || "";

        return oldText !== newText;
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

    _applyButtonHandler: function(e) {
        var value = this._strategy.getValue();
        if(this._applyInternalValidation(value)) {
            this.dateValue(value, e.event);
        }
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
            case "showClearButton":
            case "buttons":
                this.callBase.apply(this, arguments);
                this._formatValidationIcon();
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
                this._formatValidationIcon();
                this._updateValue();
                break;
            case "placeholder":
                this._renderPlaceholder();
                break;
            case "min":
            case "max":
                this._applyInternalValidation(this.dateOption("value"));
                this._invalidate();
                break;
            case "dateSerializationFormat":
            case "interval":
            case "disabledDates":
            case "calendarOptions":
            case "minZoomLevel":
            case "maxZoomLevel":
                this._invalidate();
                break;
            case "displayFormat":
                this.option("text", this._getDisplayedText(this.dateOption("value")));
                this._renderInputValue();
                break;
            case "formatWidthCalculator":
                break;
            case "closeOnValueChange":
                var applyValueMode = args.value ? "instantly" : "useButtons";
                this.option("applyValueMode", applyValueMode);
                break;
            case "applyValueMode":
                this.option("closeOnValueChange", args.value === "instantly");
                this.callBase.apply(this, arguments);
                break;
            case "text":
                this._strategy.textChangedHandler(args.value);
                this.callBase.apply(this, arguments);
                break;
            case "isValid":
                this.callBase.apply(this, arguments);
                this._formatValidationIcon();
                break;
            case "showDropDownButton":
                this._formatValidationIcon();
                break;
            case "readOnly":
                this.callBase.apply(this, arguments);
                this._formatValidationIcon();
                break;
            case "invalidDateMessage":
            case "dateOutOfRangeMessage":
            case "adaptivityEnabled":
            case "showAnalogClock":
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

        if(typeUtils.isNumeric(value)) {
            return "number";
        }

        if(!typeUtils.isString(value)) {
            return;
        }

        return dateSerialization.getDateSerializationFormat(value);
    },

    _updateValue: function(value) {
        this.callBase();
        this._validateValue(value || this.dateOption("value"));
    },

    dateValue: function(value, dxEvent) {
        var isValueChanged = this._isValueChanged(value);

        if(isValueChanged && dxEvent) {
            this._saveValueChangeEvent(dxEvent);
        }

        if(!isValueChanged && this._isTextChanged(value)) {
            this._updateValue(value);
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
        const defaultOptions = this._getDefaultOptions();
        this._skipCustomValidation = defaultOptions.value === this.dateOption("value");
        this.callBase();
        this._updateValue(this.dateOption("value"));
    }
});

registerComponent("dxDateBox", DateBox);

module.exports = DateBox;
