import Calendar from '../calendar';
import DateBoxStrategy from './ui.date_box.strategy';
import dateUtils from '../../core/utils/date';
import { splitPair } from '../../core/utils/common';
import { isFunction, isEmptyObject } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import messageLocalization from '../../localization/message';

const CalendarStrategy = DateBoxStrategy.inherit({

    NAME: 'Calendar',

    getDefaultOptions: function() {
        return extend(this.callBase(), {
            todayButtonText: messageLocalization.format('dxCalendar-todayButtonText'),
        });
    },

    supportedKeys: function() {
        const homeEndHandler = function(e) {
            if(this.option('opened')) {
                e.preventDefault();
                return true;
            }
            return false;
        };

        return {
            rightArrow: function() {
                if(this.option('opened')) {
                    return true;
                }
            },
            leftArrow: function() {
                if(this.option('opened')) {
                    return true;
                }
            },
            enter: (function(e) {
                if(this.dateBox.option('opened')) {
                    e.preventDefault();

                    if(this._widget.option('zoomLevel') === this._widget.option('maxZoomLevel')) {
                        const viewValue = this._getContouredValue();
                        const lastActionElement = this._lastActionElement;
                        const shouldCloseDropDown = this._closeDropDownByEnter();

                        if(shouldCloseDropDown && viewValue && lastActionElement === 'calendar') {
                            this.dateBoxValue(viewValue, e);
                        }

                        shouldCloseDropDown && this.dateBox.close();
                        this.dateBox._valueChangeEventHandler(e);

                        return !shouldCloseDropDown;
                    } else {
                        return true;
                    }
                } else {
                    this.dateBox._valueChangeEventHandler(e);
                }
            }).bind(this),
            home: homeEndHandler,
            end: homeEndHandler
        };
    },

    getDisplayFormat: function(displayFormat) {
        return displayFormat || 'shortdate';
    },

    _closeDropDownByEnter: () => true,

    _getWidgetName: function() {
        return Calendar;
    },

    _getContouredValue: function() {
        return this._widget._view.option('contouredDate');
    },

    getKeyboardListener() {
        return this._widget;
    },

    _getWidgetOptions: function() {
        const disabledDates = this.dateBox.option('disabledDates');

        return extend(this.dateBox.option('calendarOptions'), {
            value: this.dateBoxValue() || null,
            dateSerializationFormat: null,
            min: this.dateBox.dateOption('min'),
            max: this.dateBox.dateOption('max'),
            onValueChanged: this._valueChangedHandler.bind(this),
            onCellClick: this._cellClickHandler.bind(this),
            tabIndex: null,
            disabledDates: isFunction(disabledDates) ? this._injectComponent(disabledDates.bind(this.dateBox)) : disabledDates,
            onContouredChanged: this._refreshActiveDescendant.bind(this),
            skipFocusCheck: true
        });
    },

    _injectComponent: function(func) {
        const that = this;
        return function(params) {
            extend(params, { component: that.dateBox });
            return func(params);
        };
    },

    _refreshActiveDescendant: function(e) {
        this._lastActionElement = 'calendar';
        this.dateBox.setAria('activedescendant', e.actionValue);
    },

    _getTodayButtonConfig() {
        const buttonsLocation = this.dateBox.option('buttonsLocation');
        const isButtonsLocationDefault = buttonsLocation === 'default';

        const position = isButtonsLocationDefault ? ['bottom', 'center'] : splitPair(buttonsLocation);

        return {
            widget: 'dxButton',
            toolbar: position[0],
            location: position[1] === 'after' ? 'before' : position[1],
            options: {
                onInitialized: function(e) {
                    e.component.registerKeyHandler('escape', this._escapeHandler.bind(this));
                }.bind(this),
                onClick: (args) => { this._widget._toTodayView(args); },
                text: this.dateBox.option('todayButtonText'),
                type: 'today',
            }
        };
    },

    _isCalendarVisible: function() {
        const { calendarOptions } = this.dateBox.option();

        return isEmptyObject(calendarOptions) || calendarOptions.visible !== false;
    },

    _getPopupToolbarItems(toolbarItems) {
        const useButtons = this.dateBox.option('applyValueMode') === 'useButtons';
        const shouldRenderTodayButton = useButtons && this._isCalendarVisible();

        if(shouldRenderTodayButton) {
            const todayButton = this._getTodayButtonConfig();

            return [
                todayButton,
                ...toolbarItems,
            ];
        }

        return toolbarItems;
    },

    popupConfig: function(popupConfig) {
        return extend(true, popupConfig, {
            position: { collision: 'flipfit flip' },
            width: 'auto'
        });
    },

    _escapeHandler: function() {
        this.dateBox.close();
        this.dateBox.focus();
    },

    _valueChangedHandler: function(e) {
        const value = e.value;
        const prevValue = e.previousValue;

        if(dateUtils.sameDate(value, prevValue) && dateUtils.sameHoursAndMinutes(value, prevValue)) {
            return;
        }

        if(this.dateBox.option('applyValueMode') === 'instantly') {
            this.dateBoxValue(this.getValue(), e.event);
        }
    },

    _updateValue: function() {
        if(!this._widget) {
            return;
        }

        this._widget.option('value', this.dateBoxValue());
    },

    textChangedHandler: function() {
        this._lastActionElement = 'input';

        if(this.dateBox.option('opened') && this._widget) {
            this._updateValue(true);
        }
    },

    _cellClickHandler: function(e) {
        const dateBox = this.dateBox;

        if(dateBox.option('applyValueMode') === 'instantly') {
            dateBox.option('opened', false);
            this.dateBoxValue(this.getValue(), e.event);
        }
    },
});

export default CalendarStrategy;
