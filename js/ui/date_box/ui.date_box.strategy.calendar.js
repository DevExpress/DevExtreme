const Calendar = require('../calendar');
const DateBoxStrategy = require('./ui.date_box.strategy');
const dateUtils = require('../../core/utils/date');
const commonUtils = require('../../core/utils/common');
const isFunction = require('../../core/utils/type').isFunction;
const extend = require('../../core/utils/extend').extend;
const messageLocalization = require('../../localization/message');

const CalendarStrategy = DateBoxStrategy.inherit({

    NAME: 'Calendar',

    supportedKeys: function() {
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
            }).bind(this)
        };
    },

    getDisplayFormat: function(displayFormat) {
        return displayFormat || 'shortdate';
    },

    _getWidgetName: function() {
        return Calendar;
    },

    _getWidgetOptions: function() {
        const disabledDates = this.dateBox.option('disabledDates');

        return extend(this.dateBox.option('calendarOptions'), {
            value: this.dateBoxValue() || null,
            dateSerializationFormat: null,
            _keyboardProcessor: this._widgetKeyboardProcessor,
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
            position = commonUtils.splitPair(buttonsLocation);
        } else {
            position = ['bottom', 'center'];
        }

        if(this.dateBox.option('applyValueMode') === 'useButtons') {
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
            }
        });
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

module.exports = CalendarStrategy;
