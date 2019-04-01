require("../switch");

var $ = require("../../core/renderer"),
    Class = require("../../core/class"),
    Guid = require("../../core/guid"),
    registerComponent = require("../../core/component_registrator"),
    recurrenceUtils = require("./utils.recurrence"),
    domUtils = require("../../core/utils/dom"),
    isDefined = require("../../core/utils/type").isDefined,
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    each = require("../../core/utils/iterator").each,
    Editor = require("../editor/editor"),
    CheckBox = require("../check_box"),
    RadioGroup = require("../radio_group"),
    NumberBox = require("../number_box"),
    SelectBox = require("../select_box"),
    DateBox = require("../date_box"),
    messageLocalization = require("../../localization/message"),
    dateLocalization = require("../../localization/date"),
    dateUtils = require("../../core/utils/date"),
    publisherMixin = require("./ui.scheduler.publisher_mixin");

var RECURRENCE_EDITOR = "dx-recurrence-editor",
    LABEL_POSTFIX = "-label",
    WRAPPER_POSTFIX = "-wrapper",
    RECURRENCE_EDITOR_CONTAINER = "dx-recurrence-editor-container",
    FREQUENCY_EDITOR = "dx-recurrence-selectbox-freq",
    INTERVAL_EDITOR = "dx-recurrence-numberbox-interval",
    INTERVAL_EDITOR_FIELD = "dx-recurrence-interval-field",

    REPEAT_END_EDITOR = "dx-recurrence-repeat-end",
    REPEAT_END_EDITOR_CONTAINER = "dx-recurrence-repeat-end-container",
    REPEAT_TYPE_EDITOR = "dx-recurrence-radiogroup-repeat-type",
    REPEAT_COUNT_EDITOR = "dx-recurrence-numberbox-repeat-count",
    REPEAT_UNTIL_DATE_EDITOR = "dx-recurrence-datebox-until-date",

    REPEAT_ON_EDITOR = "dx-recurrence-repeat-on",
    REPEAT_ON_WEEK_EDITOR = "dx-recurrence-repeat-on-week",
    DAY_OF_WEEK = "dx-recurrence-checkbox-day-of-week",
    REPEAT_ON_MONTH_EDITOR = "dx-recurrence-repeat-on-month",
    DAY_OF_MONTH = "dx-recurrence-numberbox-day-of-month",
    REPEAT_ON_YEAR_EDITOR = "dx-recurrence-repeat-on-year",
    MONTH_OF_YEAR = "dx-recurrence-selectbox-month-of-year",

    FIELD_CLASS = "dx-field",
    FIELD_LABEL_CLASS = "dx-field-label",
    FIELD_VALUE_CLASS = "dx-field-value",

    frequencies = [
        { text: function() { return messageLocalization.format("dxScheduler-recurrenceNever"); }, value: "never" },
        { text: function() { return messageLocalization.format("dxScheduler-recurrenceDaily"); }, value: "daily" },
        { text: function() { return messageLocalization.format("dxScheduler-recurrenceWeekly"); }, value: "weekly" },
        { text: function() { return messageLocalization.format("dxScheduler-recurrenceMonthly"); }, value: "monthly" },
        { text: function() { return messageLocalization.format("dxScheduler-recurrenceYearly"); }, value: "yearly" }
    ],

    repeatEndTypes = [
        { text: function() { return messageLocalization.format("dxScheduler-recurrenceNever"); }, value: "never" },
        { text: function() { return messageLocalization.format("dxScheduler-recurrenceRepeatOnDate"); }, value: "until" },
        { text: function() { return messageLocalization.format("dxScheduler-recurrenceRepeatCount"); }, value: "count" }
    ],

    days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

var RecurrenceRule = Class.inherit({

    ctor: function(recurrence) {
        this._recurrenceRule = recurrenceUtils.getRecurrenceRule(recurrence).rule;
    },

    makeRules: function(string) {
        var that = this;

        that._recurrenceRule = recurrenceUtils.getRecurrenceRule(string).rule;
    },

    makeRule: function(field, value) {
        if(!value) {
            delete this._recurrenceRule[field];
            return;
        }

        if(isDefined(field)) {
            if(field === "until") {
                delete this._recurrenceRule.count;
            }

            if(field === "count") {
                delete this._recurrenceRule.until;
            }

            this._recurrenceRule[field] = value;
        }
    },

    repeatableRule: function() {
        var rules = this._recurrenceRule;

        if("count" in rules) {
            return "count";
        }

        if("until" in rules) {
            return "until";
        }

        return null;
    },

    recurrenceString: function() {
        return recurrenceUtils.getRecurrenceString(this._recurrenceRule);
    },

    rules: function() {
        return this._recurrenceRule;
    },

    daysFromByDayRule: function() {
        return recurrenceUtils.daysFromByDayRule(this._recurrenceRule);
    }
});

var RecurrenceEditor = Editor.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxRecurrenceEditorOptions.value
            * @type string
            * @default null
            * @fires dxRecurrenceEditorOptions.onValueChanged
            */
            value: null,

            /**
            * @name dxRecurrenceEditorOptions.startDate
            * @type Date
            * @default new Date()
            * @hidden
            */
            startDate: new Date(),

            /**
            * @name dxRecurrenceEditorOptions.firstDayOfWeek
            * @type Enums.FirstDayOfWeek
            * @default undefined
            * @hidden
            */
            firstDayOfWeek: undefined
        });
    },

    _getFirstDayOfWeek: function() {
        return isDefined(this.option("firstDayOfWeek")) ? this.option("firstDayOfWeek") : dateLocalization.firstDayOfWeekIndex();
    },

    _createComponent: function(element, name, config) {
        config = config || {};
        this._extendConfig(config, {
            readOnly: this.option("readOnly")
        });
        return this.callBase(element, name, config);
    },

    _init: function() {
        this.callBase();
        this._recurrenceRule = new RecurrenceRule(this.option("value"));
    },

    _render: function() {
        this.callBase();

        this.$element().addClass(RECURRENCE_EDITOR);

        this._$container = $("<div>")
            .addClass(RECURRENCE_EDITOR_CONTAINER)
            .appendTo(this.$element());

        this._renderEditors();

        this._renderContainerVisibility(this.option("value"));
    },

    _renderContainerVisibility: function(value) {
        if(value) {
            this._$container.show();
            domUtils.triggerShownEvent(this._$container);
        } else {
            this._$container.hide();
        }
    },

    _changeValueByVisibility: function(value) {
        this._renderContainerVisibility(value);

        if(value) {
            if(!this.option("value")) {
                this._handleDefaults();
            }
        } else {
            this._recurrenceRule.makeRules("");
            this.option("value", "");
        }
    },

    _handleDefaults: function() {
        this._recurrenceRule.makeRule("freq", "daily");
        this._changeEditorValue();
    },

    _changeEditorValue: function() {
        this.option("value", this._recurrenceRule.recurrenceString() || "");
    },

    _renderEditors: function() {
        this._renderFreqEditor();
        this._renderIntervalEditor();

        this._renderRepeatOnEditor();

        this._renderRepeatEndEditor();
    },

    _renderFreqEditor: function() {
        var freq = (this._recurrenceRule.rules().freq || "never").toLowerCase();

        var $freqEditor = $("<div>")
            .addClass(FREQUENCY_EDITOR)
            .addClass(FIELD_VALUE_CLASS);

        this._freqEditor = this._createComponent($freqEditor, SelectBox, {
            field: "freq",
            items: frequencies,
            value: freq,
            valueExpr: "value",
            displayExpr: "text",
            layout: "horizontal",
            onValueChanged: (args)=> {
                this._valueChangedHandler(args);
                this.invoke("resizePopup");
            }
        });

        var $field = $("<div>")
            .addClass(FIELD_CLASS)
            .append($freqEditor);

        this.$element().prepend($field);
    },

    _renderIntervalEditor: function() {
        var freq = this._recurrenceRule.rules().freq || "daily";

        var $intervalEditor = $("<div>")
            .addClass(INTERVAL_EDITOR)
            .addClass(FIELD_VALUE_CLASS);

        var $intervalEditorLabel = $("<div>")
            .text(messageLocalization.format("dxScheduler-recurrenceRepeatEvery"))
            .addClass(INTERVAL_EDITOR + LABEL_POSTFIX)
            .addClass(FIELD_LABEL_CLASS);

        this._$intervalTypeLabel = $("<div>")
            .text(messageLocalization.format("dxScheduler-recurrenceRepeat" + freq.charAt(0).toUpperCase() + freq.substr(1).toLowerCase()))
            .addClass(REPEAT_TYPE_EDITOR + LABEL_POSTFIX);

        var interval = this._recurrenceRule.rules().interval || 1;

        this._intervalEditor = this._createComponent($intervalEditor, NumberBox, {
            field: "interval",
            min: 1,
            value: interval,
            showSpinButtons: true,
            useLargeSpinButtons: false,
            onValueChanged: this._valueChangedHandler.bind(this)
        });

        var $field = $("<div>")
            .addClass(FIELD_CLASS)
            .addClass(INTERVAL_EDITOR_FIELD)
            .append($intervalEditorLabel, $intervalEditor, this._$intervalTypeLabel);

        this._$container.append($field);

        this._setAriaDescribedBy(this._intervalEditor, $intervalEditorLabel);
    },

    _renderRepeatOnEditor: function() {
        var freq = (this._recurrenceRule.rules().freq || "").toLowerCase();

        if(!isDefined(this._$repeatOnEditor)) {
            this._$repeatOnEditor = $("<div>")
                .addClass(REPEAT_ON_EDITOR)
                .addClass(FIELD_CLASS)
                .appendTo(this._$container);
        }

        if(!freq || freq === "daily") {
            this._clearRepeatOnEditor();
            this._clearRepeatOnLabel();
            return;
        }

        if(!isDefined(this._$repeatOnLabel)) {
            this._renderRepeatOnLabel(this._$repeatOnEditor);
        }

        if(freq === "weekly" && !this._$repeatOnWeek) {
            this._renderRepeatOnWeekEditor();
            return;
        }

        if(freq === "monthly" && !this._$repeatOnMonth) {
            this._renderRepeatOnMonthEditor();
            return;
        }

        if(freq === "yearly" && !this._$repeatOnYear) {
            this._renderRepeatOnYearEditor();
            return;
        }
    },

    _renderRepeatOnLabel: function($element) {
        this._$repeatOnLabel = $("<div>")
            .text(messageLocalization.format("dxScheduler-recurrenceRepeatOn"))
            .addClass(REPEAT_ON_EDITOR + LABEL_POSTFIX)
            .addClass(FIELD_LABEL_CLASS);

        $element.append(this._$repeatOnLabel);
    },

    _clearRepeatOnEditor: function() {
        if(isDefined(this._$repeatOnWeek)) {
            this._$repeatOnWeek.detach();
            this._$repeatOnWeek.remove();

            delete this._$repeatOnWeek;
        }

        if(isDefined(this._$repeatOnMonth)) {
            this._$repeatOnMonth.detach();
            this._$repeatOnMonth.remove();

            delete this._$repeatOnMonth;
        }

        if(isDefined(this._$repeatOnYear)) {
            this._$repeatOnYear.detach();
            this._$repeatOnYear.remove();

            delete this._$repeatOnYear;
        }
    },

    _clearRepeatOnLabel: function() {
        if(isDefined(this._$repeatOnLabel)) {
            this._$repeatOnLabel.detach();
            this._$repeatOnLabel.remove();

            delete this._$repeatOnLabel;
        }
    },

    _renderRepeatOnWeekEditor: function() {
        this._clearRepeatOnEditor();

        this._$repeatOnWeek = $("<div>")
            .addClass(REPEAT_ON_WEEK_EDITOR)
            .addClass(FIELD_VALUE_CLASS)
            .appendTo(this._$repeatOnEditor);

        var localDaysNames = dateLocalization.getDayNames("short"),
            daysFromRules = this._daysOfWeekByRules();

        this._daysOfWeek = [];

        for(var i = 0; i < 7; i++) {
            var daysOffset = this._getFirstDayOfWeek() + i,
                dayIndex = daysOffset % 7,
                checkBoxText = localDaysNames[dayIndex].toUpperCase(),
                dayName = days[dayIndex];

            var $day = $("<div>").addClass(DAY_OF_WEEK),
                day = this._createComponent($day, CheckBox, {
                    text: checkBoxText,
                    value: inArray(dayName, daysFromRules) > -1 ? true : false,
                    onValueChanged: this._repeatByDayValueChangeHandler.bind(this)
                });

            this._daysOfWeek[dayIndex] = day;
            this._$repeatOnWeek.append($day);
        }
    },

    _daysOfWeekByRules: function() {
        var daysByRule = this._recurrenceRule.daysFromByDayRule();

        if(!daysByRule.length) {
            daysByRule = [days[this.option("startDate").getDay()]];
        }

        return daysByRule;
    },

    _repeatByDayValueChangeHandler: function() {
        var byDayRule = "";

        each(this._daysOfWeek, function(index, day) {
            if(day.option("value")) {
                var dayName = days[index];

                if(!byDayRule) {
                    byDayRule = dayName;
                } else {
                    byDayRule = byDayRule + "," + dayName;
                }
            }
        });

        this._recurrenceRule.makeRule("byday", byDayRule);
        this._changeEditorValue();
    },

    _renderRepeatOnMonthEditor: function() {
        this._clearRepeatOnEditor();

        this._$repeatOnMonth = $("<div>")
            .addClass(REPEAT_ON_MONTH_EDITOR)
            .addClass(FIELD_VALUE_CLASS)
            .appendTo(this._$repeatOnEditor);

        this._renderDayOfMonthEditor(this._$repeatOnMonth);
    },

    _renderRepeatOnYearEditor: function() {
        this._clearRepeatOnEditor();

        this._$repeatOnYear = $("<div>")
            .addClass(REPEAT_ON_YEAR_EDITOR)
            .addClass(FIELD_VALUE_CLASS).appendTo(this._$repeatOnEditor);

        var months = [],
            monthsNames = dateLocalization.getMonthNames("wide");

        for(var i = 0; i < 12; i++) {
            months[i] = { value: String(i + 1), text: monthsNames[i] };
        }

        var byMonth = this._monthOfYearByRules();

        var $monthOfYear = $("<div>")
            .addClass(MONTH_OF_YEAR)
            .appendTo(this._$repeatOnYear);

        var monthChanged = function(args) {
            this._valueChangedHandler.call(this, args);

            var monthValue = parseInt(args.component.option("value"));
            if(this._dayEditor && monthValue) {
                var maxAllowedDay = new Date(new Date().getFullYear(), parseInt(monthValue), 0).getDate();
                if(monthValue === 2) {
                    maxAllowedDay = 29;
                }
                this._dayEditor.option("max", maxAllowedDay);
            }
        };

        this._monthEditor = this._createComponent($monthOfYear, SelectBox, {
            field: "bymonth",
            items: months,
            value: byMonth,
            displayExpr: "text",
            valueExpr: "value",
            onValueChanged: monthChanged.bind(this)
        });

        this._renderDayOfMonthEditor(this._$repeatOnYear);
    },

    _monthOfYearByRules: function() {
        var monthByRule = this._recurrenceRule.rules()["bymonth"];

        if(!monthByRule) {
            monthByRule = this.option("startDate").getMonth() + 1;
        }

        return monthByRule;
    },

    _renderDayOfMonthEditor: function($element) {
        var byMonthDay = this._dayOfMonthByRules();

        var $dayEditor = $("<div>").addClass(DAY_OF_MONTH);
        this._dayEditor = this._createComponent($dayEditor, NumberBox, {
            field: "bymonthday",
            min: 1,
            max: 31,
            showSpinButtons: true,
            useLargeSpinButtons: false,
            value: byMonthDay,
            onValueChanged: this._valueChangedHandler.bind(this)
        });

        $element.append($dayEditor);
    },

    _dayOfMonthByRules: function() {
        var dayByRule = this._recurrenceRule.rules()["bymonthday"];

        if(!dayByRule) {
            dayByRule = this.option("startDate").getDate();
        }

        return dayByRule;
    },

    _setAriaDescribedBy: function(editor, $label) {
        var labelId = "label-" + new Guid();

        editor.setAria("describedby", labelId);
        editor.setAria("id", labelId, $label);
    },

    _repeatEndSwitchValueChangeHandler: function(args) {
        var value = args.value;

        this._renderRepeatEndVisibility(value);

        if(!this._recurrenceRule.rules().count && !this._recurrenceRule.rules().until && value) {
            this._handleRepeatEndDefaults();
        } else if(!value) {
            this._recurrenceRule.makeRule("count", "");
            this._recurrenceRule.makeRule("until", "");
            this._changeEditorValue();
        }
    },

    _renderRepeatEndVisibility: function(value) {
        if(!value) {
            this._$repeatEndEditor.hide();
        } else {
            this._$repeatEndEditor.show();
        }
    },

    _handleRepeatEndDefaults: function() {
        this._recurrenceRule.makeRule("count", 1);

        this._changeEditorValue();
    },

    _renderRepeatEndEditor: function(rule) {
        rule = isDefined(rule) ? rule : this._recurrenceRule.repeatableRule();

        if(!rule) rule = "count";

        if(!isDefined(this._$repeatEndEditor)) {
            $("<div>")
                .text(messageLocalization.format("dxScheduler-recurrenceEnd"))
                .addClass(INTERVAL_EDITOR + LABEL_POSTFIX)
                .addClass(FIELD_LABEL_CLASS)
                .appendTo(this._$container);

            this._$repeatEndEditor = $("<div>")
                .addClass(REPEAT_END_EDITOR_CONTAINER)
                .addClass(FIELD_CLASS)
                .appendTo(this._$container);

            this._renderRepeatEndTypeEditor();
        }
    },

    _renderRepeatEndTypeEditor: function() {
        var repeatType = this._recurrenceRule.repeatableRule() || "never",
            that = this;

        this._$repeatTypeEditor = $("<div>")
            .addClass(REPEAT_TYPE_EDITOR)
            .addClass(FIELD_VALUE_CLASS)
            .appendTo(this._$repeatEndEditor);

        this._repeatTypeEditor = this._createComponent(this._$repeatTypeEditor, RadioGroup, {
            items: repeatEndTypes,
            value: repeatType,
            displayExpr: "text",
            valueExpr: "value",
            itemTemplate: function(itemData) {
                if(itemData.value === "count") {
                    return that._renderRepeatCountEditor();
                }
                if(itemData.value === "until") {
                    return that._renderRepeatUntilEditor();
                }

                return that._renderDefaultRepeatEnd();

            },
            layout: "vertical",
            onValueChanged: this._repeatTypeValueChangedHandler.bind(this)
        });

        this._disableRepeatEndParts(repeatType);
    },

    _renderDefaultRepeatEnd: function() {
        var $editorTemplate = $("<div>").addClass(REPEAT_END_EDITOR + WRAPPER_POSTFIX);

        $("<div>")
            .text(messageLocalization.format("dxScheduler-recurrenceNever"))
            .addClass(REPEAT_END_EDITOR + LABEL_POSTFIX)
            .appendTo($editorTemplate);

        return $editorTemplate;
    },

    _repeatTypeValueChangedHandler: function(args) {
        var value = args.value;

        this._disableRepeatEndParts(value);

        if(value === "until") {
            this._recurrenceRule.makeRule(value, this._getUntilValue());
        }
        if(value === "count") {
            this._recurrenceRule.makeRule(value, this._repeatCountEditor.option("value"));
        }
        if(value === "never") {
            this._recurrenceRule.makeRule("count", "");
            this._recurrenceRule.makeRule("until", "");
        }

        this._changeEditorValue();
    },

    _disableRepeatEndParts: function(value) {
        if(value === "until") {
            this._repeatCountEditor.option("disabled", true);
            this._repeatUntilDate.option("disabled", false);
        }
        if(value === "count") {
            this._repeatCountEditor.option("disabled", false);
            this._repeatUntilDate.option("disabled", true);
        }
        if(value === "never") {
            this._repeatCountEditor.option("disabled", true);
            this._repeatUntilDate.option("disabled", true);
        }
    },

    _renderRepeatCountEditor: function() {
        var repeatCount = this._recurrenceRule.rules().count || 1,
            $editorTemplate = $("<div>").addClass(REPEAT_END_EDITOR + WRAPPER_POSTFIX);

        $("<div>")
            .text(messageLocalization.format("dxScheduler-recurrenceAfter"))
            .addClass(REPEAT_END_EDITOR + LABEL_POSTFIX)
            .appendTo($editorTemplate);

        this._$repeatCountEditor = $("<div>")
            .addClass(REPEAT_COUNT_EDITOR)
            .addClass(FIELD_VALUE_CLASS)
            .appendTo($editorTemplate);

        $("<div>")
            .text(messageLocalization.format("dxScheduler-recurrenceRepeatCount"))
            .addClass(REPEAT_END_EDITOR + LABEL_POSTFIX)
            .appendTo($editorTemplate);

        this._repeatCountEditor = this._createComponent(this._$repeatCountEditor, NumberBox, {
            field: "count",
            min: 1,
            showSpinButtons: true,
            useLargeSpinButtons: false,
            value: repeatCount,
            onValueChanged: this._repeatCountValueChangeHandler.bind(this)
        });

        return $editorTemplate;
    },

    _repeatCountValueChangeHandler: function(args) {
        if(this._recurrenceRule.repeatableRule() !== "count") {
            return;
        }

        var value = args.value;
        this._recurrenceRule.makeRule("count", value);
        this._changeEditorValue();
    },

    _formatUntilDate: function(date) {
        if(this._recurrenceRule.rules().until && dateUtils.sameDate(this._recurrenceRule.rules().until, date)) {
            return date;
        }

        var result = dateUtils.trimTime(date);

        result.setDate(result.getDate() + 1);
        return new Date(result.getTime() - 1);
    },

    _renderRepeatUntilEditor: function() {
        var repeatUntil = this._recurrenceRule.rules().until || this._formatUntilDate(new Date()),
            $editorTemplate = $("<div>").addClass(REPEAT_END_EDITOR + WRAPPER_POSTFIX);

        $("<div>")
            .text(messageLocalization.format("dxScheduler-recurrenceOn"))
            .addClass(REPEAT_END_EDITOR + LABEL_POSTFIX)
            .appendTo($editorTemplate);

        this._$repeatDateEditor = $("<div>")
            .addClass(REPEAT_UNTIL_DATE_EDITOR)
            .addClass(FIELD_VALUE_CLASS)
            .appendTo($editorTemplate);

        this._repeatUntilDate = this._createComponent(this._$repeatDateEditor, DateBox, {
            field: "until",
            value: repeatUntil,
            type: "date",
            onValueChanged: this._repeatUntilValueChangeHandler.bind(this),
            calendarOptions: {
                firstDayOfWeek: this._getFirstDayOfWeek()
            }
        });

        return $editorTemplate;
    },

    _repeatUntilValueChangeHandler: function(args) {
        if(this._recurrenceRule.repeatableRule() !== "until") {
            return;
        }

        var untilDate = this._formatUntilDate(new Date(args.value));

        this._repeatUntilDate.option("value", untilDate);

        this._recurrenceRule.makeRule("until", untilDate);
        this._changeEditorValue();
    },

    _valueChangedHandler: function(args) {
        var value = args.component.option("value"),
            field = args.component.option("field"),
            visible = true;

        if(field === "freq" && value === "never") {
            visible = false;
            this.option("value", "");
        } else {
            this._recurrenceRule.makeRule(field, value);

            this._makeRepeatOnRule(field, value);
            this._changeEditorValue();
        }

        this._renderContainerVisibility(visible);
    },

    _makeRepeatOnRule: function(field, value) {
        if(field !== "freq") {
            return;
        }

        if(value === "daily") {
            this._recurrenceRule.makeRule("byday", "");
            this._recurrenceRule.makeRule("bymonth", "");
            this._recurrenceRule.makeRule("bymonthday", "");
        }
        if(value === "weekly") {
            this._recurrenceRule.makeRule("byday", this._daysOfWeekByRules());
            this._recurrenceRule.makeRule("bymonth", "");
            this._recurrenceRule.makeRule("bymonthday", "");
        }

        if(value === "monthly") {
            this._recurrenceRule.makeRule("bymonthday", this._dayOfMonthByRules());
            this._recurrenceRule.makeRule("bymonth", "");
            this._recurrenceRule.makeRule("byday", "");
        }

        if(value === "yearly") {
            this._recurrenceRule.makeRule("bymonthday", this._dayOfMonthByRules());
            this._recurrenceRule.makeRule("bymonth", this._monthOfYearByRules());
            this._recurrenceRule.makeRule("byday", "");
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "value":
                this._recurrenceRule.makeRules(args.value);

                this._repeatTypeEditor.option("value", this._recurrenceRule.repeatableRule() || "never");
                this._renderRepeatEndEditor();
                this._renderRepeatOnEditor();

                this._changeEditorsValues(this._recurrenceRule.rules());

                this.callBase(args);
                break;
            case "startDate":
                this._clearRepeatOnEditor();
                this._renderRepeatOnEditor();
                this._makeRepeatOnRule("freq", this._recurrenceRule.rules().freq);

                if(isDefined(this._recurrenceRule.recurrenceString())) {
                    this._changeEditorValue();
                }

                break;
            case "firstDayOfWeek":
                this._clearRepeatOnEditor();
                this._renderRepeatOnEditor();

                if(this._$repeatDateEditor) {
                    this._repeatUntilDate.option("calendarOptions.firstDayOfWeek", this._getFirstDayOfWeek());
                }
                break;
            case "visible":
                this._changeValueByVisibility(args.value);
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    },

    _changeEditorsValues: function(rules) {
        this._changeCheckBoxesValue(!!rules["byday"]);

        this._freqEditor.option("value", (rules.freq || "never").toLowerCase());
        this._changeRepeatTypeLabel();
        this._intervalEditor.option("value", rules.interval);

        this._changeRepeatCountValue();
        this._changeRepeatUntilValue();

        this._changeDayOfMonthValue();
        this._changeMonthOfYearValue();
    },

    _changeRepeatTypeLabel: function() {
        var $labels = this.$element().find("." + REPEAT_TYPE_EDITOR + LABEL_POSTFIX);

        if(!$labels.length) {
            return;
        }

        var freq = this._recurrenceRule.rules().freq || "daily";

        each($labels, function(_, $label) {
            $($label).text(messageLocalization.format("dxScheduler-recurrenceRepeat" + freq.charAt(0).toUpperCase() + freq.substr(1).toLowerCase()));
        });
    },

    _changeRepeatCountValue: function() {
        if(!this._$repeatCountEditor) {
            return;
        }

        var count = this._recurrenceRule.rules().count || 1;
        this._repeatCountEditor.option("value", count);
    },

    _changeRepeatUntilValue: function() {
        if(!this._$repeatDateEditor) {
            return;
        }

        this._repeatUntilDate.option("value", this._getUntilValue());
    },

    _getUntilValue: function() {
        return this._recurrenceRule.rules().until || this._formatUntilDate(new Date());
    },

    _changeCheckBoxesValue: function(byDayChanged) {
        if(!this._$repeatOnWeek || !byDayChanged) {
            return;
        }

        var daysByRule = this._daysOfWeekByRules();

        each(this._daysOfWeek, function(index, day) {
            var dayName = days[index];

            day.option("value", inArray(dayName, daysByRule) > -1);
        });
    },

    _changeDayOfMonthValue: function() {
        if(!this._$repeatOnMonth && !this._$repeatOnYear) {
            return;
        }

        var day = this._dayOfMonthByRules() || 1;
        this._dayEditor.option("value", day);
    },

    _changeMonthOfYearValue: function() {
        if(!this._$repeatOnYear) {
            return;
        }

        var month = this._monthOfYearByRules() || 1;
        this._monthEditor.option("value", month);
    },

    toggle: function() {
        this._freqEditor.focus();
    },

    setAria: function() {
        if(this._switchEditor) {
            this._switchEditor.setAria(arguments[0], arguments[1]);
        }
    }
}).include(publisherMixin);

registerComponent("dxRecurrenceEditor", RecurrenceEditor);

module.exports = RecurrenceEditor;
