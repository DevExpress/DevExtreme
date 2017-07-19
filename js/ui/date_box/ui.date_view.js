"use strict";

var $ = require("../../core/renderer"),
    Editor = require("../editor/editor"),
    DateViewRoller = require("./ui.date_view_roller"),
    dateUtils = require("../../core/utils/date"),
    each = require("../../core/utils/iterator").each,
    extend = require("../../core/utils/extend").extend,
    uiDateUtils = require("./ui.date_utils"),
    registerComponent = require("../../core/component_registrator"),
    dateLocalization = require("../../localization/date");

var DATEVIEW_CLASS = "dx-dateview",
    DATEVIEW_WRAPPER_CLASS = "dx-dateview-wrapper",
    DATEVIEW_ROLLER_CONTAINER_CLASS = "dx-dateview-rollers",
    DATEVIEW_ROLLER_CLASS = "dx-dateviewroller";

var TYPE = {
    date: 'date',
    datetime: 'datetime',
    time: 'time'
};

var ROLLER_TYPE = {
    year: 'year',
    month: 'month',
    day: 'day'
};

var DateView = Editor.inherit({
    _valueOption: function() {
        var value = this.option("value"),
            date = new Date(value);

        return !value || isNaN(date) ? this._getDefaultDate() : date;
    },

    _getDefaultDate: function() {
        var date = new Date();

        if(this.option("type") === TYPE.date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }

        return date;
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            minDate: uiDateUtils.MIN_DATEVIEW_DEFAULT_DATE,
            maxDate: uiDateUtils.MAX_DATEVIEW_DEFAULT_DATE,
            type: TYPE.date,
            value: new Date(),
            showNames: false
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function(device) {
                    return device.platform === "win" && device.version && device.version[0] === 8;
                },
                options: {
                    showNames: true
                }
            }
        ]);
    },

    _render: function() {
        this.callBase();
        this.element().addClass(DATEVIEW_CLASS);
        this._toggleFormatClasses(this.option("type"));
    },

    _toggleFormatClasses: function(currentFormat, previousFormat) {
        this.element().addClass(DATEVIEW_CLASS + "-" + currentFormat);

        previousFormat && this.element().removeClass(DATEVIEW_CLASS + "-" + previousFormat);
    },

    _wrapper: function() {
        return this._$wrapper;
    },

    _renderContentImpl: function() {
        this._$wrapper = $("<div>").addClass(DATEVIEW_WRAPPER_CLASS);
        this._renderRollers();
        this._$wrapper.appendTo(this.element());
    },

    _renderRollers: function() {
        if(!this._$rollersContainer) {
            this._$rollersContainer = $("<div>").addClass(DATEVIEW_ROLLER_CONTAINER_CLASS);
        }

        this._$rollersContainer.empty();
        this._createRollerConfigs();

        this._rollers = {};

        var that = this;

        each(that._rollerConfigs, function(name) {
            var $roller = $("<div>").appendTo(that._$rollersContainer)
                .addClass(DATEVIEW_ROLLER_CLASS + "-" + that._rollerConfigs[name].type);

            that._rollers[that._rollerConfigs[name].type] = that._createComponent($roller, DateViewRoller, {
                items: that._rollerConfigs[name].displayItems,
                selectedIndex: that._rollerConfigs[name].selectedIndex,
                showScrollbar: false,
                onStart: function(e) {
                    var roller = e.component;
                    roller._toggleActive(true);
                    that._setActiveRoller(that._rollerConfigs[name], roller.option("selectedIndex"));
                },
                onEnd: function(e) {
                    var roller = e.component;
                    roller._toggleActive(false);
                },
                onClick: function(e) {
                    var roller = e.component;
                    roller._toggleActive(true);
                    that._setActiveRoller(that._rollerConfigs[name], roller.option("selectedIndex"));
                    that._setRollerState(that._rollerConfigs[name], roller.option("selectedIndex"));
                    roller._toggleActive(false);
                },
                onSelectedIndexChanged: function(e) {
                    var roller = e.component;
                    that._setRollerState(that._rollerConfigs[name], roller.option("selectedIndex"));
                }
            });
        });
        that._$rollersContainer.appendTo(that._wrapper());
    },

    _createRollerConfigs: function(type) {
        var that = this;
        type = type || that.option("type");
        that._rollerConfigs = {};

        dateLocalization.getFormatParts(uiDateUtils.FORMATS_MAP[type]).forEach(function(partName) {
            that._createRollerConfig(partName);
        });
    },

    _createRollerConfig: function(componentName) {
        var componentInfo = uiDateUtils.DATE_COMPONENTS_INFO[componentName],

            valueRange = this._calculateRollerConfigValueRange(componentName),
            startValue = valueRange.startValue,
            endValue = valueRange.endValue,

            formatter = componentInfo.formatter,
            showNames = this.option("showNames"),

            curDate = this._getCurrentDate();

        var config = {
            type: componentName,
            setValue: componentInfo.setter,
            valueItems: [],
            displayItems: [],
            getIndex: function(value) {
                return value[componentInfo.getter]() - startValue;
            }
        };

        for(var i = startValue; i <= endValue; i++) {
            config.valueItems.push(i);
            config.displayItems.push(formatter(i, showNames, curDate));
        }

        config.selectedIndex = config.getIndex(curDate);

        this._rollerConfigs[componentName] = config;
    },

    _setActiveRoller: function(currentRoller) {
        var activeRoller = currentRoller && this._rollers[currentRoller.type];

        each(this._rollers, function() {
            this.toggleActiveState(this === activeRoller);
        });
    },

    _updateRollersPosition: function() {
        var that = this;
        each(this._rollers, function(type) {
            var correctIndex = that._rollerConfigs[type].getIndex(that._getCurrentDate());
            this.option("selectedIndex", correctIndex);
        });
    },

    _setRollerState: function(roller, selectedIndex) {
        if(selectedIndex !== roller.selectedIndex) {
            var rollerValue = roller.valueItems[selectedIndex],
                setValue = roller.setValue,
                currentValue = new Date(this._getCurrentDate()),
                currentDate = currentValue.getDate();

            if(roller.type === ROLLER_TYPE.month) {
                currentDate = Math.min(currentDate, uiDateUtils.getMaxMonthDay(currentValue.getFullYear(), rollerValue));
            } else if(roller.type === ROLLER_TYPE.year) {
                currentDate = Math.min(currentDate, uiDateUtils.getMaxMonthDay(rollerValue, currentValue.getMonth()));
            }

            currentValue.setDate(currentDate);
            currentValue[setValue](rollerValue);

            currentValue = dateUtils.normalizeDate(currentValue, this.option("minDate"), this.option("maxDate"));

            this.option("value", currentValue);

            roller.selectedIndex = selectedIndex;
        }

        if(roller.type === ROLLER_TYPE.year) {
            this._refreshMonthRoller();
            this._refreshDayRoller();
        }

        if(roller.type === ROLLER_TYPE.month) {
            this._refreshDayRoller();
        }
    },

    _refreshMonthRoller: function() {
        var monthRoller = this._rollers[ROLLER_TYPE.month];

        if(monthRoller) {
            this._createRollerConfig(ROLLER_TYPE.month);
            var monthRollerConfig = this._rollerConfigs[ROLLER_TYPE.month];

            if(monthRollerConfig.displayItems.length !== monthRoller.option("items").length) {
                monthRoller.option({
                    items: monthRollerConfig.displayItems,
                    selectedIndex: monthRollerConfig.selectedIndex
                });
            }
        }
    },

    _refreshDayRoller: function() {
        var dayRoller = this._rollers[ROLLER_TYPE.day];

        if(dayRoller) {
            this._createRollerConfig(ROLLER_TYPE.day);
            var dayRollerConfig = this._rollerConfigs[ROLLER_TYPE.day];

            dayRoller.option({
                items: dayRollerConfig.displayItems,
                selectedIndex: dayRollerConfig.selectedIndex
            });
        }
    },

    _getCurrentDate: function() {
        var curDate = this._valueOption(),
            minDate = this.option("minDate"),
            maxDate = this.option("maxDate");

        if(minDate && curDate.getTime() <= minDate.getTime()) {
            curDate = minDate;
        } else if(maxDate && curDate.getTime() >= maxDate.getTime()) {
            curDate = maxDate;
        }

        return curDate;
    },

    _calculateRollerConfigValueRange: function(componentName) {
        var curDate = this._getCurrentDate(),
            minDate = this.option("minDate"),
            maxDate = this.option("maxDate"),

            minYear = dateUtils.sameYear(curDate, minDate),
            minMonth = minYear && curDate.getMonth() === minDate.getMonth(),
            maxYear = dateUtils.sameYear(curDate, maxDate),
            maxMonth = maxYear && curDate.getMonth() === maxDate.getMonth(),

            componentInfo = uiDateUtils.DATE_COMPONENTS_INFO[componentName],
            startValue = componentInfo.startValue,
            endValue = componentInfo.endValue;

        // TODO: think about these exceptions for 'year' and 'day'
        if(componentName === ROLLER_TYPE.year) {
            startValue = minDate.getFullYear();
            endValue = maxDate.getFullYear();
        }

        if(componentName === ROLLER_TYPE.month) {
            if(minYear) {
                startValue = minDate.getMonth();
            }
            if(maxYear) {
                endValue = maxDate.getMonth();
            }
        }

        if(componentName === ROLLER_TYPE.day) {
            endValue = uiDateUtils.getMaxMonthDay(curDate.getFullYear(), curDate.getMonth());
            if(minYear && minMonth) {
                startValue = minDate.getDate();
            }
            if(maxYear && maxMonth) {
                endValue = maxDate.getDate();
            }
        }

        return {
            startValue: startValue,
            endValue: endValue
        };
    },

    _refreshRollers: function() {
        this._refreshMonthRoller();
        this._refreshDayRoller();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "showNames":
            case "minDate":
            case "maxDate":
            case "type":
                this._renderRollers();
                this._toggleFormatClasses(args.value, args.previousValue);
                break;
            case "visible":
                this.callBase(args);
                if(args.value) {
                    this._renderRollers();
                }
                break;
            case "value":
                this.option("value", this._valueOption());
                this._refreshRollers();
                this._updateRollersPosition();
                break;
            default:
                this.callBase(args);
        }
    },

    _clean: function() {
        this.callBase();
        delete this._$rollersContainer;
    },

    _dispose: function() {
        clearTimeout(this._deferredRenderDayTimeout);
        clearTimeout(this._deferredRenderMonthTimeout);
        this.callBase();
    }
});

registerComponent("dxDateView", DateView);

module.exports = DateView;
