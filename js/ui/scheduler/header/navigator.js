import $ from '../../../core/renderer';
import { noop } from '../../../core/utils/common';
import errors from '../../widget/ui.errors';
import dateUtils from '../../../core/utils/date';
import { extend } from '../../../core/utils/extend';
import registerComponent from '../../../core/component_registrator';
import devices from '../../../core/devices';
import Widget from '../../widget/ui.widget';
import Button from '../../button';
import Calendar from '../../calendar';
import Popover from '../../popover';
import Popup from '../../popup';
import publisherMixin from '../publisher_mixin';
import Scrollable from '../../scroll_view/ui.scrollable';
import { getCaption, getNextIntervalDate } from './utils';

const ELEMENT_CLASS = 'dx-scheduler-navigator';
const CALENDAR_CLASS = 'dx-scheduler-navigator-calendar';
const NEXT_BUTTON_CLASS = 'dx-scheduler-navigator-next';
const CAPTION_BUTTON_CLASS = 'dx-scheduler-navigator-caption';
const PREVIOUS_BUTTON_CLASS = 'dx-scheduler-navigator-previous';
const CALENDAR_POPOVER_CLASS = 'dx-scheduler-navigator-calendar-popover';

const DEFAULT_AGENDA_DURATION = 7;

const ACCEPRED_STEPS = ['day', 'week', 'workWeek', 'month', 'agenda'];

export const Navigator = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            date: new Date(),
            step: 'day',
            intervalCount: 1,
            min: undefined,
            max: undefined,
            firstDayOfWeek: undefined,
            _useShortDateFormat: false,
            todayDate: () => new Date()
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return !devices.real().generic || devices.isSimulator();
                },
                options: {
                    _useShortDateFormat: true
                }
            }
        ]);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'step':
            case 'date':
            case 'intervalCount':
                this._validateStep();
                this._updateButtonsState();
                this._renderCaption();
                this._setCalendarOption('value', this.option('date'));
                break;
            case 'min':
            case 'max':
                this._updateButtonsState();
                this._setCalendarOption(args.name, args.value);
                break;
            case 'firstDayOfWeek':
                this._setCalendarOption(args.name, args.value);
                break;
            case 'customizeDateNavigatorText':
                this._renderCaption();
                break;
            case 'tabIndex':
            case 'focusStateEnabled':
                this._next.option(args.name, args.value);
                this._caption.option(args.name, args.value);
                this._prev.option(args.name, args.value);
                this._setCalendarOption(args.name, args.value);
                this.callBase(args);
                break;
            case '_useShortDateFormat':
                break;
            default:
                this.callBase(args);
        }
    },

    _init: function() {
        this.callBase();
        this.$element().addClass(ELEMENT_CLASS);
        this._initButtons();
    },

    _initButtons: function() {
        const $next = $('<div>').addClass(NEXT_BUTTON_CLASS);

        this._next = this._createComponent($next, Button, {
            icon: 'chevronnext',
            onClick: this._updateCurrentDate.bind(this, 1),
            focusStateEnabled: this.option('focusStateEnabled'),
            tabIndex: this.option('tabIndex'),
            integrationOptions: {}
        });

        const $caption = $('<div>').addClass(CAPTION_BUTTON_CLASS);
        this._caption = this._createComponent($caption, Button, {
            focusStateEnabled: this.option('focusStateEnabled'),
            tabIndex: this.option('tabIndex'),
            integrationOptions: {}
        });

        const $prev = $('<div>').addClass(PREVIOUS_BUTTON_CLASS);
        this._prev = this._createComponent($prev, Button, {
            icon: 'chevronprev',
            onClick: this._updateCurrentDate.bind(this, -1),
            focusStateEnabled: this.option('focusStateEnabled'),
            tabIndex: this.option('tabIndex'),
            integrationOptions: {}
        });

        this.setAria('label', 'Next period', $next);
        this.setAria('label', 'Previous period', $prev);

        this._updateButtonsState();
        this.$element().append($prev, $caption, $next);
    },

    _updateButtonsState: function() {
        let min = this.option('min');
        let max = this.option('max');

        const date = this.option('date');
        const caption = this._getCaption(date);

        min = min ? dateUtils.trimTime(min) : min;
        max = max ? dateUtils.trimTime(max) : max;

        max && max.setHours(23, 59, 59);

        this._prev.option('disabled', min && !isNaN(min.getTime()) && this._getNextDate(-1, caption.endDate) < min);
        this._next.option('disabled', max && !isNaN(max.getTime()) && this._getNextDate(1, caption.startDate) > max);
    },

    _updateCurrentDate: function(direction) {
        const date = this._getNextDate(direction);

        dateUtils.normalizeDate(date, this.option('min'), this.option('max'));
        this.notifyObserver('currentDateUpdated', date);
    },

    _getNextDate: function(direction, initialDate = null) {
        const date = initialDate || this.option('date');
        const options = { ...this._getIntervalOptions(), date };

        return getNextIntervalDate(options, direction);
    },

    _renderFocusTarget: noop,

    _initMarkup: function() {
        this.callBase();

        this._renderCaption();
    },

    _render: function() {
        this.callBase();

        this._renderPopover();
        this._renderCaptionKeys();
    },

    _isMobileLayout: function() {
        return !devices.current().generic;
    },

    _renderPopover: function() {
        const overlayType = this._isMobileLayout() ? Popup : Popover;
        const popoverContainer = $('<div>').addClass(CALENDAR_POPOVER_CLASS);
        this._popover = this._createComponent(popoverContainer, overlayType, {
            contentTemplate: () => this._createPopupContent(),
            defaultOptionsRules: [
                {
                    device: function() {
                        return !devices.current().generic;
                    },
                    options: {
                        fullScreen: true,
                        showCloseButton: false,
                        toolbarItems: [{ shortcut: 'cancel' }]
                    }
                },
                {
                    device: function() {
                        return devices.current().generic;
                    },
                    options: {
                        target: this._caption.$element()
                    }
                }
            ]
        });
        this._popover.$element().appendTo(this.$element());
    },

    _createScrollable: function(content) {
        const result = this._createComponent($('<div>'), Scrollable, {
            direction: 'vertical'
        });
        result.$content().append(content);

        return result;
    },

    _createPopupContent: function() {
        const result = $('<div>').addClass(CALENDAR_CLASS);
        this._calendar = this._createComponent(result, Calendar, this._calendarOptions());

        if(this._isMobileLayout()) {
            const scrollable = this._createScrollable(result);
            return scrollable.$element();
        }

        return result;
    },

    _calendarOptions: function() {
        return {
            min: this.option('min'),
            max: this.option('max'),
            firstDayOfWeek: this.option('firstDayOfWeek'),
            value: this.option('date'),
            _todayDate: this.option('todayDate'),
            focusStateEnabled: this.option('focusStateEnabled'),
            onValueChanged: (function(e) {
                if(!this.option('visible')) return;

                this.notifyObserver('currentDateUpdated', e.value);
                this._popover.hide();
            }).bind(this),
            hasFocus: function() { return true; },
            tabIndex: null
        };
    },

    _getIntervalOptions: function() {
        const step = this.option('step');
        const intervalCount = this.option('intervalCount');
        const firstDayOfWeek = this.option('firstDayOfWeek') || 0; // TODO
        const agendaDuration = this.invoke('getAgendaDuration') || DEFAULT_AGENDA_DURATION;

        return { step, intervalCount, firstDayOfWeek, agendaDuration };
    },

    _getCaption: function(date) {
        const options = { ...this._getIntervalOptions(), date };
        const customizationFunction = this.option('customizeDateNavigatorText');
        const useShortDateFormat = this.option('_useShortDateFormat');

        return getCaption(options, useShortDateFormat, customizationFunction);
    },

    _renderCaption: function() {
        const date = this.option('date');

        const caption = this._getCaption(date);

        this._caption.option({
            text: caption.text,
            onKeyboardHandled: opts => {
                this.option('focusStateEnabled') &&
                    !this.option('disabled') &&
                    this._calendar._keyboardHandler(opts);
            },
            onClick: () => this._popover.toggle()
        });
    },

    _renderCaptionKeys: function() {
        if(!this.option('focusStateEnabled') || this.option('disabled')) {
            return;
        }

        const that = this;
        const executeHandler = function() {
            if(that._popover.$content().is(':hidden')) {
                that._popover.show();
            } else {
                return true;
            }
        };
        const tabHandler = function() {
            that._popover.hide();
        };

        this._caption.registerKeyHandler('enter', executeHandler);
        this._caption.registerKeyHandler('space', executeHandler);
        this._caption.registerKeyHandler('tab', tabHandler);
    },

    _setCalendarOption: function(name, value) {
        if(this._calendar) {
            this._calendar.option(name, value);
        }
    },

    _validateStep: function() {
        const step = this.option('step');

        if(!ACCEPRED_STEPS.includes(step)) {
            throw errors.Error('E1033', step);
        }
    }
}).include(publisherMixin);

registerComponent('dxSchedulerNavigator', Navigator);
