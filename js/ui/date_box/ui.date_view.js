import $ from '../../core/renderer';
import Editor from '../editor/editor';
import DateViewRoller from './ui.date_view_roller';
import dateUtils from '../../core/utils/date';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import uiDateUtils from './ui.date_utils';
import registerComponent from '../../core/component_registrator';
import dateLocalization from '../../localization/date';

const DATEVIEW_CLASS = 'dx-dateview';
const DATEVIEW_COMPACT_CLASS = 'dx-dateview-compact';
const DATEVIEW_WRAPPER_CLASS = 'dx-dateview-wrapper';
const DATEVIEW_ROLLER_CONTAINER_CLASS = 'dx-dateview-rollers';
const DATEVIEW_ROLLER_CLASS = 'dx-dateviewroller';

const TYPE = {
    date: 'date',
    datetime: 'datetime',
    time: 'time'
};

const ROLLER_TYPE = {
    year: 'year',
    month: 'month',
    day: 'day',
    hours: 'hours'
};

const DateView = Editor.inherit({
    _valueOption: function() {
        const value = this.option('value');
        const date = new Date(value);

        return !value || isNaN(date) ? this._getDefaultDate() : date;
    },

    _getDefaultDate: function() {
        const date = new Date();

        if(this.option('type') === TYPE.date) {
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
            applyCompactClass: false
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function(device) {
                    return device.deviceType !== 'desktop';
                },
                options: {
                    applyCompactClass: true
                }
            }
        ]);
    },

    _render: function() {
        this.callBase();
        this.$element().addClass(DATEVIEW_CLASS);
        this._toggleFormatClasses(this.option('type'));
        this._toggleCompactClass();
    },

    _toggleFormatClasses: function(currentFormat, previousFormat) {
        this.$element().addClass(DATEVIEW_CLASS + '-' + currentFormat);

        previousFormat && this.$element().removeClass(DATEVIEW_CLASS + '-' + previousFormat);
    },

    _toggleCompactClass: function() {
        this.$element().toggleClass(DATEVIEW_COMPACT_CLASS, this.option('applyCompactClass'));
    },

    _wrapper: function() {
        return this._$wrapper;
    },

    _renderContentImpl: function() {
        this._$wrapper = $('<div>').addClass(DATEVIEW_WRAPPER_CLASS);
        this._renderRollers();
        this._$wrapper.appendTo(this.$element());
    },

    _renderRollers: function() {
        if(!this._$rollersContainer) {
            this._$rollersContainer = $('<div>').addClass(DATEVIEW_ROLLER_CONTAINER_CLASS);
        }

        this._$rollersContainer.empty();
        this._createRollerConfigs();

        this._rollers = {};

        const that = this;

        each(that._rollerConfigs, function(name) {
            const $roller = $('<div>').appendTo(that._$rollersContainer)
                .addClass(DATEVIEW_ROLLER_CLASS + '-' + that._rollerConfigs[name].type);

            that._rollers[that._rollerConfigs[name].type] = that._createComponent($roller, DateViewRoller, {
                items: that._rollerConfigs[name].displayItems,
                selectedIndex: that._rollerConfigs[name].selectedIndex,
                showScrollbar: false,
                onStart: function(e) {
                    const roller = e.component;
                    roller._toggleActive(true);
                    that._setActiveRoller(that._rollerConfigs[name], roller.option('selectedIndex'));
                },
                onEnd: function(e) {
                    const roller = e.component;
                    roller._toggleActive(false);
                },
                onClick: function(e) {
                    const roller = e.component;
                    roller._toggleActive(true);
                    that._setActiveRoller(that._rollerConfigs[name], roller.option('selectedIndex'));
                    that._setRollerState(that._rollerConfigs[name], roller.option('selectedIndex'));
                    roller._toggleActive(false);
                },
                onSelectedIndexChanged: function(e) {
                    const roller = e.component;
                    that._setRollerState(that._rollerConfigs[name], roller.option('selectedIndex'));
                }
            });
        });
        that._$rollersContainer.appendTo(that._wrapper());
    },

    _createRollerConfigs: function(type) {
        const that = this;
        type = type || that.option('type');
        that._rollerConfigs = {};

        dateLocalization.getFormatParts(uiDateUtils.FORMATS_MAP[type]).forEach(function(partName) {
            that._createRollerConfig(partName);
        });
    },

    _createRollerConfig: function(componentName) {
        const componentInfo = uiDateUtils.DATE_COMPONENTS_INFO[componentName];

        const valueRange = this._calculateRollerConfigValueRange(componentName);
        const startValue = valueRange.startValue;
        const endValue = valueRange.endValue;

        const formatter = componentInfo.formatter;

        const curDate = this._getCurrentDate();

        const config = {
            type: componentName,
            setValue: componentInfo.setter,
            valueItems: [],
            displayItems: [],
            getIndex: function(value) {
                return value[componentInfo.getter]() - startValue;
            }
        };

        for(let i = startValue; i <= endValue; i++) {
            config.valueItems.push(i);
            config.displayItems.push(formatter(i, curDate));
        }

        config.selectedIndex = config.getIndex(curDate);

        this._rollerConfigs[componentName] = config;
    },

    _setActiveRoller: function(currentRoller) {
        const activeRoller = currentRoller && this._rollers[currentRoller.type];

        each(this._rollers, function() {
            this.toggleActiveState(this === activeRoller);
        });
    },

    _updateRollersPosition: function() {
        const that = this;
        each(this._rollers, function(type) {
            const correctIndex = that._rollerConfigs[type].getIndex(that._getCurrentDate());
            this.option('selectedIndex', correctIndex);
        });
    },

    _setRollerState: function(roller, selectedIndex) {
        if(selectedIndex !== roller.selectedIndex) {
            const rollerValue = roller.valueItems[selectedIndex];
            const setValue = roller.setValue;
            let currentValue = new Date(this._getCurrentDate());
            let currentDate = currentValue.getDate();
            const minDate = this.option('minDate');
            const maxDate = this.option('maxDate');

            if(roller.type === ROLLER_TYPE.month) {
                currentDate = Math.min(currentDate, uiDateUtils.getMaxMonthDay(currentValue.getFullYear(), rollerValue));
            } else if(roller.type === ROLLER_TYPE.year) {
                currentDate = Math.min(currentDate, uiDateUtils.getMaxMonthDay(rollerValue, currentValue.getMonth()));
            }

            currentValue.setDate(currentDate);
            currentValue[setValue](rollerValue);

            const normalizedDate = dateUtils.normalizeDate(currentValue, minDate, maxDate);
            currentValue = uiDateUtils.mergeDates(normalizedDate, currentValue, 'time');
            currentValue = dateUtils.normalizeDate(currentValue, minDate, maxDate);

            this.option('value', currentValue);

            roller.selectedIndex = selectedIndex;
        }

        if(roller.type === ROLLER_TYPE.year) {
            this._refreshRollers();
        }

        if(roller.type === ROLLER_TYPE.month) {
            this._refreshRoller(ROLLER_TYPE.day);
            this._refreshRoller(ROLLER_TYPE.hours);
        }
    },

    _refreshRoller: function(rollerType) {
        const roller = this._rollers[rollerType];

        if(roller) {
            this._createRollerConfig(rollerType);
            const rollerConfig = this._rollerConfigs[rollerType];
            if(rollerType === ROLLER_TYPE.day || rollerConfig.displayItems.toString() !== roller.option('items').toString()) {
                roller.option({
                    items: rollerConfig.displayItems,
                    selectedIndex: rollerConfig.selectedIndex
                });
            }
        }
    },

    _getCurrentDate: function() {
        const curDate = this._valueOption();
        const minDate = this.option('minDate');
        const maxDate = this.option('maxDate');

        return dateUtils.normalizeDate(curDate, minDate, maxDate);
    },

    _calculateRollerConfigValueRange: function(componentName) {
        const curDate = this._getCurrentDate();
        const minDate = this.option('minDate');
        const maxDate = this.option('maxDate');

        const minYear = dateUtils.sameYear(curDate, minDate);
        const minMonth = minYear && curDate.getMonth() === minDate.getMonth();
        const maxYear = dateUtils.sameYear(curDate, maxDate);
        const maxMonth = maxYear && curDate.getMonth() === maxDate.getMonth();
        const minHour = minMonth && curDate.getDate() === minDate.getDate();
        const maxHour = maxMonth && curDate.getDate() === maxDate.getDate();

        const componentInfo = uiDateUtils.DATE_COMPONENTS_INFO[componentName];
        let startValue = componentInfo.startValue;
        let endValue = componentInfo.endValue;

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

        if(componentName === ROLLER_TYPE.hours) {
            startValue = minHour ? minDate.getHours() : startValue;
            endValue = maxHour ? maxDate.getHours() : endValue;
        }

        return {
            startValue: startValue,
            endValue: endValue
        };
    },

    _refreshRollers: function() {
        this._refreshRoller(ROLLER_TYPE.month);
        this._refreshRoller(ROLLER_TYPE.day);
        this._refreshRoller(ROLLER_TYPE.hours);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'minDate':
            case 'maxDate':
            case 'type':
                this._renderRollers();
                this._toggleFormatClasses(args.value, args.previousValue);
                break;
            case 'visible':
                this.callBase(args);
                if(args.value) {
                    this._renderRollers();
                }
                break;
            case 'value':
                this.option('value', this._valueOption());
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
    }
});

registerComponent('dxDateView', DateView);

export default DateView;
