import Calendar from '../calendar';
import DateBoxStrategy from './ui.date_box.strategy';
import dateUtils from '../../core/utils/date';
import { splitPair } from '../../core/utils/common';
import { isFunction, isEmptyObject } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import messageLocalization from '../../localization/message';

const CalendarStrategy = DateBoxStrategy.inherit({

    NAME: 'Calendar',

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
                        const contouredDate = this._widget._view.option('contouredDate');
                        const lastActionElement = this._lastActionElement;
                        if(contouredDate && lastActionElement === 'calendar') {
                            this.dateBoxValue(contouredDate, e);
                        }

                        this.dateBox.close();
                        this.dateBox._valueChangeEventHandler(e);
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

    _getWidgetName: function() {
        return Calendar;
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
            hasFocus: function() { return true; }
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

    popupConfig: function(popupConfig) {
        const toolbarItems = popupConfig.toolbarItems;
        const buttonsLocation = this.dateBox.option('buttonsLocation');

        let position = [];

        if(buttonsLocation !== 'default') {
            position = splitPair(buttonsLocation);
        } else {
            position = ['bottom', 'center'];
        }

        if(this.dateBox.option('applyValueMode') === 'useButtons' && this._isCalendarVisible()) {
            toolbarItems.unshift({
                widget: 'dxButton',
                toolbar: position[0],
                location: position[1] === 'after' ? 'before' : position[1],
                options: {
                    onInitialized: function(e) {
                        e.component.registerKeyHandler('escape', this._escapeHandler.bind(this));
                    }.bind(this),
                    onClick: (function() { this._widget._toTodayView(); }).bind(this),
                    text: messageLocalization.format('dxCalendar-todayButtonText'),
                    type: 'today'
                }
            });
        }

        return extend(true, popupConfig, {
            toolbarItems: toolbarItems,
            position: {
                collision: 'flipfit flip'
            },
            width: 'auto'
        });
    },

    _isCalendarVisible: function() {
        return isEmptyObject(this.dateBox.option('calendarOptions')) || this.dateBox.option('calendarOptions.visible') !== false;
    },

    _escapeHandler: function() {
        this.dateBox.close();
        this.dateBox.focus();
    },

    _valueChangedHandler: function(e) {
        const dateBox = this.dateBox;
        const value = e.value;
        const prevValue = e.previousValue;

        if(dateUtils.sameDate(value, prevValue)) {
            return;
        }

        if(dateBox.option('applyValueMode') === 'instantly') {
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
    }
});

export default CalendarStrategy;
