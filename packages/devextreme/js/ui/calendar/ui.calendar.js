import { getWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import Guid from '../../core/guid';
import registerComponent from '../../core/component_registrator';
import { noop } from '../../core/utils/common';
import { isNumeric, isString, isFunction, isDefined } from '../../core/utils/type';
import { inRange } from '../../core/utils/math';
import { extend } from '../../core/utils/extend';
import Button from '../button';
import Editor from '../editor/editor';
import Swipeable from '../../events/gesture/swipeable';
import Navigator from './ui.calendar.navigator';
import Views from './ui.calendar.views';
import { move } from '../../animation/translator';
import dateUtils from '../../core/utils/date';
import dateSerialization from '../../core/utils/date_serialization';
import devices from '../../core/devices';
import fx from '../../animation/fx';
import { hasWindow } from '../../core/utils/window';
import messageLocalization from '../../localization/message';
import dateLocalization from '../../localization/date';
import { FunctionTemplate } from '../../core/templates/function_template';
import { isCommandKeyPressed, addNamespace } from '../../events/utils/index';
import CalendarSingleSelectionStrategy from './ui.calendar.single.selection.strategy';
import CalendarMultipleSelectionStrategy from './ui.calendar.multiple.selection.strategy';
import CalendarRangeSelectionStrategy from './ui.calendar.range.selection.strategy';
import { end as hoverEndEventName } from '../../events/hover';
import eventsEngine from '../../events/core/events_engine';

// STYLE calendar

const CALENDAR_CLASS = 'dx-calendar';
const CALENDAR_BODY_CLASS = 'dx-calendar-body';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_FOOTER_CLASS = 'dx-calendar-footer';
const CALENDAR_TODAY_BUTTON_CLASS = 'dx-calendar-today-button';
const CALENDAR_HAS_FOOTER_CLASS = 'dx-calendar-with-footer';
const CALENDAR_VIEWS_WRAPPER_CLASS = 'dx-calendar-views-wrapper';
const CALENDAR_VIEW_CLASS = 'dx-calendar-view';
const CALENDAR_MULTIVIEW_CLASS = 'dx-calendar-multiview';
const CALENDAR_RANGE_CLASS = 'dx-calendar-range';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const GESTURE_COVER_CLASS = 'dx-gesture-cover';

const ANIMATION_DURATION_SHOW_VIEW = 250;
const POP_ANIMATION_FROM = 0.6;
const POP_ANIMATION_TO = 1;

const CALENDAR_INPUT_STANDARD_PATTERN = 'yyyy-MM-dd';
const CALENDAR_DATE_VALUE_KEY = 'dxDateValueKey';

const CALENDAR_DXHOVEREND_EVENT_NAME = addNamespace(hoverEndEventName, 'dxCalendar');

const LEVEL_COMPARE_MAP = {
    'month': 3,
    'year': 2,
    'decade': 1,
    'century': 0
};

const ZOOM_LEVEL = {
    MONTH: 'month',
    YEAR: 'year',
    DECADE: 'decade',
    CENTURY: 'century'
};

const SELECTION_STRATEGIES = {
    SingleSelection: CalendarSingleSelectionStrategy,
    MultipleSelection: CalendarMultipleSelectionStrategy,
    RangeSelection: CalendarRangeSelectionStrategy
};

function elementHasFocus(element) {
    return element.hasClass(FOCUSED_STATE_CLASS);
}

const Calendar = Editor.inherit({
    _activeStateUnit: '.' + CALENDAR_CELL_CLASS,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            hoverStateEnabled: true,

            activeStateEnabled: true,

            /**
            * @name dxCalendarOptions.currentDate
            * @type Date
            * @hidden
            * @default new Date()
            */
            currentDate: new Date(),

            value: null,

            values: [],

            dateSerializationFormat: undefined,

            min: new Date(1000, 0),

            max: new Date(3000, 0),

            firstDayOfWeek: undefined,

            viewsCount: 1,

            zoomLevel: ZOOM_LEVEL.MONTH,

            maxZoomLevel: ZOOM_LEVEL.MONTH,

            minZoomLevel: ZOOM_LEVEL.CENTURY,

            selectionMode: 'single',

            showTodayButton: false,

            showWeekNumbers: false,

            weekNumberRule: 'auto',

            cellTemplate: 'cell',

            disabledDates: null,

            onCellClick: null,
            onContouredChanged: null,
            skipFocusCheck: false,

            _todayDate: () => new Date()


            /**
            * @name dxCalendarOptions.onContentReady
            * @hidden true
            * @action
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            }
        ]);
    },

    _supportedKeys: function() {
        return extend(this.callBase(), {
            rightArrow: function(e) {
                e.preventDefault();
                if(isCommandKeyPressed(e)) {
                    this._waitRenderView(1);
                } else {
                    this._moveCurrentDateByOffset(1 * this._getRtlCorrection());
                }
            },
            leftArrow: function(e) {
                e.preventDefault();
                if(isCommandKeyPressed(e)) {
                    this._waitRenderView(-1);
                } else {
                    this._moveCurrentDateByOffset(-1 * this._getRtlCorrection());
                }
            },
            upArrow: function(e) {
                e.preventDefault();
                if(isCommandKeyPressed(e)) {
                    this._navigateUp();
                } else {
                    if(fx.isAnimating(this._view.$element())) {
                        return;
                    }
                    this._moveCurrentDateByOffset(-1 * this._view.option('colCount'));
                }
            },
            downArrow: function(e) {
                e.preventDefault();
                if(isCommandKeyPressed(e)) {
                    this._navigateDown();
                } else {
                    if(fx.isAnimating(this._view.$element())) {
                        return;
                    }
                    this._moveCurrentDateByOffset(1 * this._view.option('colCount'));
                }
            },
            home: function(e) {
                e.preventDefault();

                const zoomLevel = this.option('zoomLevel');
                const currentDate = this.option('currentDate');
                const min = this._dateOption('min');

                if(this._view.isDateDisabled(currentDate)) {
                    return;
                }

                const date = dateUtils.sameView(zoomLevel, currentDate, min)
                    ? min
                    : dateUtils.getViewFirstCellDate(zoomLevel, currentDate);

                this._moveToClosestAvailableDate(date);
            },
            end: function(e) {
                e.preventDefault();

                const zoomLevel = this.option('zoomLevel');
                const currentDate = this.option('currentDate');
                const max = this._dateOption('max');

                if(this._view.isDateDisabled(currentDate)) {
                    return;
                }

                const date = dateUtils.sameView(zoomLevel, currentDate, max)
                    ? max
                    : dateUtils.getViewLastCellDate(zoomLevel, currentDate);

                this._moveToClosestAvailableDate(date);
            },
            pageUp: function(e) {
                e.preventDefault();
                this._waitRenderView(-1 * this._getRtlCorrection());
            },
            pageDown: function(e) {
                e.preventDefault();
                this._waitRenderView(1 * this._getRtlCorrection());
            },
            tab: noop,
            enter: this._enterKeyHandler
        });
    },

    _enterKeyHandler: function(e) {
        if(!this._isMaxZoomLevel()) {
            this._navigateDown();
        } else if(!this._view.isDateDisabled(this.option('currentDate'))) {
            const value = this._updateTimeComponent(this.option('currentDate'));
            this._selectionStrategy.selectValue(value, e);
        }
    },

    _getSerializationFormat: function(optionName) {
        const value = this.option(optionName || 'value');

        if(this.option('dateSerializationFormat')) {
            return this.option('dateSerializationFormat');
        }

        if(isNumeric(value)) {
            return 'number';
        }

        if(!isString(value)) {
            return;
        }

        return dateSerialization.getDateSerializationFormat(value);
    },

    _convertToDate: function(value) {
        return dateSerialization.deserializeDate(value);
    },

    _dateValue: function(value, event) {
        const optionName = Array.isArray(value) ? 'values' : 'value';
        if(event) {
            if(event.type === 'keydown') {
                const cellElement = this._view._getContouredCell().get(0);
                event.target = cellElement;
            }
            this._saveValueChangeEvent(event);
        }
        this._dateOption(optionName, value);
    },

    _dateOption: function(optionName, optionValue) {
        if(arguments.length === 1) {
            const values = this.option('values') ?? [];
            return optionName === 'values'
                ? values.map((value) => this._convertToDate(value))
                : this._convertToDate(this.option(optionName));
        }

        const serializationFormat = this._getSerializationFormat(optionName);
        const serializedValue = optionName === 'values'
            ? optionValue?.map((value) => dateSerialization.serializeDate(value, serializationFormat)) || []
            : dateSerialization.serializeDate(optionValue, serializationFormat);

        this.option(optionName, serializedValue);
    },

    _shiftDate: function(zoomLevel, date, offset, reverse) {
        switch(zoomLevel) {
            case ZOOM_LEVEL.MONTH:
                date.setDate(date.getDate() + offset * reverse);
                break;
            case ZOOM_LEVEL.YEAR:
                date.setMonth(date.getMonth() + offset * reverse);
                break;
            case ZOOM_LEVEL.DECADE:
                date.setFullYear(date.getFullYear() + offset * reverse);
                break;
            case ZOOM_LEVEL.CENTURY:
                date.setFullYear(date.getFullYear() + 10 * offset * reverse);
                break;
        }
    },

    _moveCurrentDateByOffset: function(offset) {
        const baseDate = this.option('currentDate');
        let currentDate = new Date(baseDate);
        const zoomLevel = this.option('zoomLevel');
        this._shiftDate(zoomLevel, currentDate, offset, 1);

        const maxDate = this._getMaxDate();
        const minDate = this._getMinDate();

        let isDateForwardInNeighborView = this._areDatesInNeighborView(zoomLevel, currentDate, baseDate);
        let isDateForwardInRange = inRange(currentDate, minDate, maxDate) && isDateForwardInNeighborView;
        const dateForward = new Date(currentDate);

        while(isDateForwardInRange) {
            if(!this._view.isDateDisabled(dateForward)) {
                currentDate = dateForward;
                break;
            }

            this._shiftDate(zoomLevel, dateForward, offset, 1);

            isDateForwardInNeighborView = this._areDatesInNeighborView(zoomLevel, dateForward, baseDate);
            isDateForwardInRange = inRange(dateForward, minDate, maxDate) && isDateForwardInNeighborView;
        }

        if(this._view.isDateDisabled(baseDate) || this._view.isDateDisabled(currentDate)) {
            this._waitRenderView(offset > 0 ? 1 : -1);
        } else {
            this._skipNavigate = true;
            this.option('currentDate', currentDate);
        }
    },

    _areDatesInSameView(zoomLevel, date1, date2) {
        switch(zoomLevel) {
            case ZOOM_LEVEL.MONTH:
                return date1.getMonth() === date2.getMonth();
            case ZOOM_LEVEL.YEAR:
                return date1.getYear() === date2.getYear();
            case ZOOM_LEVEL.DECADE:
                return parseInt(date1.getYear() / 10) === parseInt(date2.getYear() / 10);
            case ZOOM_LEVEL.CENTURY:
                return parseInt(date1.getYear() / 100) === parseInt(date2.getYear() / 100);
        }
    },

    _areDatesInNeighborView(zoomLevel, date1, date2) {
        const monthMinDistance = (a, b) => {
            const abs = Math.abs(a - b);
            return Math.min(abs, 12 - abs);
        };

        switch(zoomLevel) {
            case ZOOM_LEVEL.MONTH:
                return monthMinDistance(date1.getMonth(), date2.getMonth()) <= 1;
            case ZOOM_LEVEL.YEAR:
                return Math.abs(date1.getYear() - date2.getYear()) <= 1;
            case ZOOM_LEVEL.DECADE:
                return Math.abs(date1.getYear() - date2.getYear()) <= 10;
            case ZOOM_LEVEL.CENTURY:
                return Math.abs(date1.getYear() - date2.getYear()) <= 100;
        }
    },

    _moveToClosestAvailableDate: function(baseDate = this.option('currentDate')) {
        let currentDate = new Date(baseDate);
        const zoomLevel = this.option('zoomLevel');

        const isCurrentDateAvailable = !this._isDateNotAvailable(currentDate);

        let isDateForwardAvailable = isCurrentDateAvailable;
        let isDateBackwardAvailable = isCurrentDateAvailable;

        let isDateForwardInStartView;
        let isDateBackwardInStartView;

        const dateForward = new Date(currentDate);
        const dateBackward = new Date(currentDate);

        do {
            if(isDateForwardAvailable) {
                currentDate = dateForward;
                break;
            }

            if(isDateBackwardAvailable) {
                currentDate = dateBackward;
                break;
            }

            this._shiftDate(zoomLevel, dateForward, 1, 1);
            this._shiftDate(zoomLevel, dateBackward, 1, -1);

            isDateForwardInStartView = this._areDatesInSameView(zoomLevel, dateForward, baseDate);
            isDateBackwardInStartView = this._areDatesInSameView(zoomLevel, dateBackward, baseDate);

            isDateForwardAvailable = isDateForwardInStartView && !this._isDateNotAvailable(dateForward);
            isDateBackwardAvailable = isDateBackwardInStartView && !this._isDateNotAvailable(dateBackward);
        } while(isDateForwardInStartView || isDateBackwardInStartView);

        this.option('currentDate', currentDate);
    },

    _isDateNotAvailable: function(date) {
        const maxDate = this._getMaxDate();
        const minDate = this._getMinDate();

        return !inRange(date, minDate, maxDate) || this._view.isDateDisabled(date);
    },

    _init: function() {
        this.callBase();
        this._initSelectionStrategy();
        this._correctZoomLevel();
        this._initCurrentDate();
        this._initActions();
    },

    _initSelectionStrategy: function() {
        const strategyName = this._getSelectionStrategyName();
        const strategy = SELECTION_STRATEGIES[strategyName];

        if(!this._selectionStrategy || this._selectionStrategy.NAME !== strategyName) {
            this._selectionStrategy = new strategy(this);
        }
    },

    _refreshSelectionStrategy: function() {
        this._initSelectionStrategy();
        this._refresh();
    },

    _getSelectionStrategyName: function() {
        const selectionMode = this.option('selectionMode');

        switch(selectionMode) {
            case 'multiple':
                return 'MultipleSelection';
            case 'range':
                return 'RangeSelection';
            default:
                return 'SingleSelection';
        }
    },

    _correctZoomLevel: function() {
        const minZoomLevel = this.option('minZoomLevel');
        const maxZoomLevel = this.option('maxZoomLevel');
        const zoomLevel = this.option('zoomLevel');

        if(LEVEL_COMPARE_MAP[maxZoomLevel] < LEVEL_COMPARE_MAP[minZoomLevel]) {
            return;
        }

        if(LEVEL_COMPARE_MAP[zoomLevel] > LEVEL_COMPARE_MAP[maxZoomLevel]) {
            this.option('zoomLevel', maxZoomLevel);
        } else if(LEVEL_COMPARE_MAP[zoomLevel] < LEVEL_COMPARE_MAP[minZoomLevel]) {
            this.option('zoomLevel', minZoomLevel);
        }
    },

    _initCurrentDate: function() {
        const currentDate = this._getNormalizedDate(this._selectionStrategy.getDefaultCurrentDate())
            ?? this._getNormalizedDate(this.option('currentDate'));

        this.option('currentDate', currentDate);
    },

    _getNormalizedDate: function(date) {
        date = dateUtils.normalizeDate(date, this._getMinDate(), this._getMaxDate());
        return isDefined(date) ? this._getDate(date) : date;
    },

    _initActions: function() {
        this._cellClickAction = this._createActionByOption('onCellClick');
        this._onContouredChanged = this._createActionByOption('onContouredChanged');
    },

    _initTemplates: function() {
        this._templateManager.addDefaultTemplates({
            cell: new FunctionTemplate(function(options) {
                const data = options.model;
                $(options.container).append($('<span>').text(data && data.text || String(data)));
            })
        });
        this.callBase();
    },

    _updateCurrentDate: function(date) {
        if(fx.isAnimating(this._$viewsWrapper)) {
            fx.stop(this._$viewsWrapper, true);
        }

        const min = this._getMinDate();
        const max = this._getMaxDate();

        if(min > max) {
            this.option('currentDate', new Date());
            return;
        }

        const normalizedDate = this._getNormalizedDate(date);

        if(date.getTime() !== normalizedDate.getTime()) {
            this.option('currentDate', new Date(normalizedDate));
            return;
        }

        let offset = this._getViewsOffset(this._view.option('date'), normalizedDate);

        if(offset !== 0 && !this._isMaxZoomLevel() && this._isOtherViewCellClicked) { offset = 0; }

        if(this._view && offset !== 0 && !this._suppressNavigation) {
            if(this._additionalView) {
                if(offset > 2 || offset < -1) {
                    this._refreshViews();
                    this._setViewContoured(normalizedDate);
                    this._updateAriaId(normalizedDate);
                    this._renderNavigator();
                } else if(offset === 1 && this._skipNavigate) {
                    this._setViewContoured(normalizedDate);
                    this._updateAriaId(normalizedDate);
                } else {
                    this._navigate(offset, normalizedDate);
                }
            } else {
                this._navigate(offset, normalizedDate);
            }
        } else {
            this._renderNavigator();
            this._setViewContoured(normalizedDate);
            this._updateAriaId(normalizedDate);
        }
        this._skipNavigate = false;
    },

    _isAdditionalViewDate(date) {
        if(!this._additionalView) {
            return false;
        }

        return date >= this._additionalView._getFirstAvailableDate();
    },

    _getActiveView: function(date) {
        return this._isAdditionalViewDate(date) ? this._additionalView : this._view;
    },

    _setViewContoured: function(date) {
        if(this.option('skipFocusCheck') || elementHasFocus(this._focusTarget())) {
            this._view.option('contouredDate', null);
            this._additionalView?.option('contouredDate', null);

            const view = this._isAdditionalViewDate(date) ? this._additionalView : this._view;

            view.option('contouredDate', date);
        }
    },

    _getMinDate: function() {
        const _rangeMin = this.option('_rangeMin');
        if(_rangeMin) {
            return _rangeMin;
        }

        if(this.min) {
            return this.min;
        }

        this.min = this._dateOption('min') || new Date(1000, 0);
        return this.min;
    },

    _getMaxDate: function() {
        const _rangeMax = this.option('_rangeMax');
        if(_rangeMax) {
            return _rangeMax;
        }

        if(this.max) {
            return this.max;
        }

        this.max = this._dateOption('max') || new Date(3000, 0);
        return this.max;
    },

    _getViewsOffset: function(startDate, endDate) {
        const zoomLevel = this.option('zoomLevel');

        if(zoomLevel === ZOOM_LEVEL.MONTH) {
            return this._getMonthsOffset(startDate, endDate);
        }

        let zoomCorrection;

        switch(zoomLevel) {
            case ZOOM_LEVEL.CENTURY:
                zoomCorrection = 100;
                break;
            case ZOOM_LEVEL.DECADE:
                zoomCorrection = 10;
                break;
            default:
                zoomCorrection = 1;
                break;
        }

        return parseInt(endDate.getFullYear() / zoomCorrection) - parseInt(startDate.getFullYear() / zoomCorrection);
    },

    _getMonthsOffset: function(startDate, endDate) {
        const yearOffset = endDate.getFullYear() - startDate.getFullYear();
        const monthOffset = endDate.getMonth() - startDate.getMonth();

        return yearOffset * 12 + monthOffset;
    },

    _waitRenderView: function(offset) {
        if(this._alreadyViewRender) {
            return;
        }

        this._alreadyViewRender = true;

        const date = this._getDateByOffset(offset * this._getRtlCorrection());

        this._moveToClosestAvailableDate(date);

        this._waitRenderViewTimeout = setTimeout(() => {
            this._alreadyViewRender = false;
        });
    },

    _getRtlCorrection: function() {
        return this.option('rtlEnabled') ? -1 : 1;
    },

    _getDateByOffset: function(offset, date) {
        date = this._getDate(date ?? this.option('currentDate'));

        const currentDay = date.getDate();
        const difference = dateUtils.getDifferenceInMonth(this.option('zoomLevel')) * offset;

        date.setDate(1);
        date.setMonth(date.getMonth() + difference);

        const lastDay = dateUtils.getLastMonthDate(date).getDate();
        date.setDate(currentDay > lastDay ? lastDay : currentDay);

        return date;
    },

    _focusTarget: function() {
        return this.$element();
    },

    _initMarkup: function() {
        this._renderSubmitElement();

        this.callBase();

        const $element = this.$element();
        $element.addClass(CALENDAR_CLASS);
        $element.toggleClass(CALENDAR_RANGE_CLASS, this.option('selectionMode') === 'range');

        this._renderBody();
        $element.append(this.$body);

        this._renderViews();
        this._renderEvents();

        this._renderNavigator();
        $element.prepend(this._navigator.$element());

        this._renderSwipeable();
        this._renderFooter();

        this._selectionStrategy.updateAriaSelected();
        this._updateAriaId();

        this.setAria('role', 'application');

        this._moveToClosestAvailableDate();
    },

    _render: function() {
        this.callBase();

        this._setViewContoured(this.option('currentDate'));
    },

    _renderBody: function() {
        if(!this._$viewsWrapper) {
            this.$body = $('<div>').addClass(CALENDAR_BODY_CLASS);
            this._$viewsWrapper = $('<div>').addClass(CALENDAR_VIEWS_WRAPPER_CLASS);
            this.$body.append(this._$viewsWrapper);
        }
    },

    _getKeyboardListeners() {
        return this.callBase().concat([this._view]);
    },

    _renderViews: function() {
        this.$element().addClass(CALENDAR_VIEW_CLASS + '-' + this.option('zoomLevel'));

        const { currentDate, viewsCount } = this.option();

        this.$element().toggleClass(CALENDAR_MULTIVIEW_CLASS, viewsCount > 1);

        this._view = this._renderSpecificView(currentDate);

        if(hasWindow()) {
            const beforeDate = this._getDateByOffset(-1, currentDate);
            this._beforeView = this._isViewAvailable(beforeDate) ? this._renderSpecificView(beforeDate) : null;

            const afterDate = this._getDateByOffset(viewsCount, currentDate);
            afterDate.setDate(1);

            this._afterView = this._isViewAvailable(afterDate) ? this._renderSpecificView(afterDate) : null;
        }

        if(viewsCount > 1) {
            this._additionalView = this._renderSpecificView(this._getDateByOffset(1, currentDate));
        }

        this._translateViews();
    },

    _renderSpecificView: function(date) {
        const { zoomLevel } = this.option();
        const specificView = Views[zoomLevel];
        const $view = $('<div>').appendTo(this._$viewsWrapper);
        const config = this._viewConfig(date);

        const view = this._createComponent($view, specificView, config);

        return view;
    },

    _viewConfig: function(date) {
        let disabledDates = this.option('disabledDates');

        disabledDates = isFunction(disabledDates) ? this._injectComponent(disabledDates.bind(this)) : disabledDates;

        return {
            ...this._selectionStrategy.getViewOptions(),
            date: date,
            min: this._getMinDate(),
            max: this._getMaxDate(),
            firstDayOfWeek: this.option('firstDayOfWeek') ?? dateLocalization.firstDayOfWeekIndex(),
            showWeekNumbers: this.option('showWeekNumbers'),
            weekNumberRule: this.option('weekNumberRule'),
            zoomLevel: this.option('zoomLevel'),
            tabIndex: undefined,
            focusStateEnabled: this.option('focusStateEnabled'),
            hoverStateEnabled: this.option('hoverStateEnabled'),
            disabledDates,
            onCellClick: this._cellClickHandler.bind(this),
            cellTemplate: this._getTemplateByOption('cellTemplate'),
            allowValueSelection: this._isMaxZoomLevel(),
            _todayDate: this.option('_todayDate')
        };
    },

    _renderEvents() {
        eventsEngine.off(this._$viewsWrapper, CALENDAR_DXHOVEREND_EVENT_NAME);

        if(this.option('selectionMode') === 'range') {
            eventsEngine.on(this._$viewsWrapper, CALENDAR_DXHOVEREND_EVENT_NAME, null, ((e) => {
                this._updateViewsOption('hoveredRange', []);
            }));
        }
    },

    _injectComponent: function(func) {
        const that = this;
        return function(params) {
            extend(params, { component: that });
            return func(params);
        };
    },

    _isViewAvailable: function(date) {
        const zoomLevel = this.option('zoomLevel');
        const min = dateUtils.getViewMinBoundaryDate(zoomLevel, this._getMinDate());
        const max = dateUtils.getViewMaxBoundaryDate(zoomLevel, this._getMaxDate());

        return dateUtils.dateInRange(date, min, max);
    },

    _translateViews: function() {
        const { viewsCount } = this.option();

        move(this._view.$element(), { left: 0, top: 0 });
        this._moveViewElement(this._beforeView, -1);
        this._moveViewElement(this._afterView, viewsCount);
        this._moveViewElement(this._additionalView, 1);
    },

    _moveViewElement(view, coefficient) {
        view && move(view.$element(), {
            left: this._getViewPosition(coefficient),
            top: 0
        });
    },

    _getViewPosition: function(coefficient) {
        const rtlCorrection = this.option('rtlEnabled') ? -1 : 1;
        return (coefficient * 100 * rtlCorrection) + '%';
    },

    _cellClickHandler: function(e) {
        const zoomLevel = this.option('zoomLevel');
        const nextView = dateUtils.getViewDown(zoomLevel);

        const isMaxZoomLevel = this._isMaxZoomLevel();

        if(nextView && !isMaxZoomLevel) {
            this._navigateDown(e.event.currentTarget);
        } else {
            const newValue = this._updateTimeComponent(e.value);
            this._selectionStrategy.selectValue(newValue, e.event);
            this._cellClickAction(e);
        }
    },

    _updateTimeComponent: function(date) {
        const result = new Date(date);
        const currentValue = this._dateOption('value');

        if(currentValue) {
            result.setHours(currentValue.getHours());
            result.setMinutes(currentValue.getMinutes());
            result.setSeconds(currentValue.getSeconds());
            result.setMilliseconds(currentValue.getMilliseconds());
        }

        return result;
    },

    _isMaxZoomLevel: function() {
        return this.option('zoomLevel') === this.option('maxZoomLevel');
    },

    _navigateDown: function(cell) {
        const zoomLevel = this.option('zoomLevel');

        if(this._isMaxZoomLevel()) {
            return;
        }

        const nextView = dateUtils.getViewDown(zoomLevel);

        if(!nextView) {
            return;
        }

        let newCurrentDate = this._view.option('contouredDate') || this._view.option('date');

        if(cell) {
            newCurrentDate = $(cell).data(CALENDAR_DATE_VALUE_KEY);
        }

        this._isOtherViewCellClicked = true;

        this.option('currentDate', newCurrentDate);
        this.option('zoomLevel', nextView);

        this._isOtherViewCellClicked = false;

        this._renderNavigator();
        this._animateShowView();

        this._moveToClosestAvailableDate();
        this._setViewContoured(this._getNormalizedDate(this.option('currentDate')));
    },

    _renderNavigator: function() {
        if(!this._navigator) {
            this._navigator = new Navigator($('<div>'), this._navigatorConfig());
        }

        this._navigator.option('text', this._getViewsCaption(this._view, this._additionalView));
        this._updateButtonsVisibility();
    },

    _navigatorConfig: function() {
        const { rtlEnabled } = this.option();

        return {
            text: this._getViewsCaption(this._view, this._additionalView),
            onClick: this._navigatorClickHandler.bind(this),
            onCaptionClick: this._navigateUp.bind(this),
            rtlEnabled,
        };
    },

    _navigatorClickHandler: function(e) {
        const { currentDate, viewsCount } = this.option();
        let offset = e.direction;

        if(viewsCount > 1) {
            const additionalViewActive = this._isAdditionalViewDate(currentDate);
            const shouldDoubleOffset = additionalViewActive && offset < 0 || !additionalViewActive && offset > 0;

            if(shouldDoubleOffset) {
                offset *= 2;
            }
        }

        const newCurrentDate = this._getDateByOffset(offset, currentDate);
        this._moveToClosestAvailableDate(newCurrentDate);
    },

    _navigateUp: function() {
        const zoomLevel = this.option('zoomLevel');
        const nextView = dateUtils.getViewUp(zoomLevel);

        if(!nextView || this._isMinZoomLevel(zoomLevel)) {
            return;
        }

        this.option('zoomLevel', nextView);

        this._renderNavigator();

        this._animateShowView();

        this._moveToClosestAvailableDate();
        this._setViewContoured(this._getNormalizedDate(this.option('currentDate')));
    },

    _isMinZoomLevel: function(zoomLevel) {
        const min = this._getMinDate();
        const max = this._getMaxDate();

        return dateUtils.sameView(zoomLevel, min, max) || this.option('minZoomLevel') === zoomLevel;
    },

    _updateButtonsVisibility: function() {
        this._navigator.toggleButton('next', !isDefined(this._afterView));
        this._navigator.toggleButton('prev', !isDefined(this._beforeView));
    },

    _renderSwipeable: function() {
        if(!this._swipeable) {
            this._swipeable = this._createComponent(this.$element(), Swipeable, {
                onStart: this._swipeStartHandler.bind(this),
                onUpdated: this._swipeUpdateHandler.bind(this),
                onEnd: this._swipeEndHandler.bind(this),
                itemSizeFunc: this._viewWidth.bind(this)
            });
        }
    },

    _swipeStartHandler: function(e) {
        fx.stop(this._$viewsWrapper, true);
        const { viewsCount } = this.option();

        this._toggleGestureCoverCursor('grabbing');

        e.event.maxLeftOffset = this._getRequiredView('next') ? 1 / viewsCount : 0;
        e.event.maxRightOffset = this._getRequiredView('prev') ? 1 / viewsCount : 0;
    },

    _toggleGestureCoverCursor: function(cursor) {
        $(`.${GESTURE_COVER_CLASS}`).css('cursor', cursor);
    },

    _getRequiredView: function(name) {
        let view;
        const isRtl = this.option('rtlEnabled');

        if(name === 'next') {
            view = isRtl ? this._beforeView : this._afterView;
        } else if(name === 'prev') {
            view = isRtl ? this._afterView : this._beforeView;
        }

        return view;
    },

    _swipeUpdateHandler: function(e) {
        const offset = e.event.offset;

        move(this._$viewsWrapper, { left: offset * this._viewWidth(), top: 0 });
        this._updateNavigatorCaption(offset);
    },

    _swipeEndHandler: function(e) {
        this._toggleGestureCoverCursor('auto');

        const { currentDate, rtlEnabled } = this.option();
        const targetOffset = e.event.targetOffset;
        const moveOffset = !targetOffset ? 0 : targetOffset / Math.abs(targetOffset);

        const isAdditionalViewActive = this._isAdditionalViewDate(currentDate);
        const shouldDoubleOffset = isAdditionalViewActive && (rtlEnabled ? moveOffset === -1 : moveOffset === 1);

        if(moveOffset === 0) {
            this._animateWrapper(0, ANIMATION_DURATION_SHOW_VIEW);
            return;
        }

        const offset = -moveOffset * this._getRtlCorrection() * (shouldDoubleOffset ? 2 : 1);
        let date = this._getDateByOffset(offset);

        if(this._isDateInInvalidRange(date)) {
            if(moveOffset >= 0) {
                date = new Date(this._getMinDate());
            } else {
                date = new Date(this._getMaxDate());
            }
        }
        this.option('currentDate', date);
    },

    _viewWidth: function() {
        if(!this._viewWidthValue) {
            this._viewWidthValue = getWidth(this.$element()) / this.option('viewsCount');
        }

        return this._viewWidthValue;
    },

    _updateNavigatorCaption: function(offset) {
        offset *= this._getRtlCorrection();
        const isMultiView = this.option('viewsCount') > 1;

        let view;
        let additionalView;

        if(offset > 0.5 && this._beforeView) {
            view = this._beforeView;
            additionalView = isMultiView && this._view;
        } else if(offset < -0.5 && this._afterView) {
            view = isMultiView ? this._additionalView : this._afterView;
            additionalView = isMultiView ? this._afterView : null;
        } else {
            view = this._view;
            additionalView = isMultiView ? this._additionalView : null;
        }

        this._navigator.option('text', this._getViewsCaption(view, additionalView));
    },

    _getViewsCaption: function(view, additionalView) {
        let caption = view.getNavigatorCaption();
        const { viewsCount } = this.option();

        if(viewsCount > 1 && additionalView) {
            const additionalViewCaption = additionalView.getNavigatorCaption();
            caption = `${caption} - ${additionalViewCaption}`;
        }

        return caption;
    },

    _isDateInInvalidRange: function(date) {
        if(this._view.isBoundary(date)) {
            return;
        }

        const min = this._getMinDate();
        const max = this._getMaxDate();
        const normalizedDate = dateUtils.normalizeDate(date, min, max);

        return normalizedDate === min || normalizedDate === max;
    },

    _renderFooter: function() {
        const showTodayButton = this.option('showTodayButton');

        if(showTodayButton) {
            const $todayButton = this._createComponent($('<div>'),
                Button, {
                    focusStateEnabled: this.option('focusStateEnabled'),
                    text: messageLocalization.format('dxCalendar-todayButtonText'),
                    onClick: (args) => {
                        this._toTodayView(args);
                    },
                    type: 'default',
                    stylingMode: 'text',
                    integrationOptions: {}
                }).$element()
                .addClass(CALENDAR_TODAY_BUTTON_CLASS);

            this._$footer = $('<div>')
                .addClass(CALENDAR_FOOTER_CLASS)
                .append($todayButton);

            this.$element().append(this._$footer);
        }

        this.$element().toggleClass(CALENDAR_HAS_FOOTER_CLASS, showTodayButton);
    },

    _renderSubmitElement: function() {
        this._$submitElement = $('<input>')
            .attr('type', 'hidden')
            .appendTo(this.$element());
        this._setSubmitValue(this.option('value'));
    },

    _setSubmitValue: function(value) {
        const dateValue = this._convertToDate(value);
        this._getSubmitElement().val(dateSerialization.serializeDate(dateValue, CALENDAR_INPUT_STANDARD_PATTERN));
    },

    _getSubmitElement: function() {
        return this._$submitElement;
    },

    _animateShowView: function() {
        fx.stop(this._view.$element(), true);
        this._popAnimationView(this._view, POP_ANIMATION_FROM, POP_ANIMATION_TO, ANIMATION_DURATION_SHOW_VIEW);

        if(this.option('viewsCount') > 1) {
            fx.stop(this._additionalView.$element(), true);
            this._popAnimationView(this._additionalView, POP_ANIMATION_FROM, POP_ANIMATION_TO, ANIMATION_DURATION_SHOW_VIEW);
        }
    },

    _popAnimationView: function(view, from, to, duration) {
        return fx.animate(view.$element(), {
            type: 'pop',
            from: {
                scale: from,
                opacity: from
            },
            to: {
                scale: to,
                opacity: to
            },
            duration: duration
        });
    },

    _navigate: function(offset, value) {
        if(offset !== 0 && Math.abs(offset) !== 1 && this._isViewAvailable(value)) {
            const newView = this._renderSpecificView(value);

            if(offset > 0) {
                this._afterView && this._afterView.$element().remove();
                this._afterView = newView;
            } else {
                this._beforeView && this._beforeView.$element().remove();
                this._beforeView = newView;
            }

            this._translateViews();
        }

        const rtlCorrection = this._getRtlCorrection();
        const offsetSign = offset > 0 ? 1 : offset < 0 ? -1 : 0;
        const endPosition = -rtlCorrection * offsetSign * this._viewWidth();

        const viewsWrapperPosition = this._$viewsWrapper.position().left;

        if(viewsWrapperPosition !== endPosition) {
            if(this._preventViewChangeAnimation) {
                this._wrapperAnimationEndHandler(offset, value);
            } else {
                this._animateWrapper(endPosition, ANIMATION_DURATION_SHOW_VIEW)
                    .done(this._wrapperAnimationEndHandler.bind(this, offset, value));
            }
        }
    },

    _animateWrapper: function(to, duration) {
        return fx.animate(this._$viewsWrapper, {
            type: 'slide',
            from: { left: this._$viewsWrapper.position().left },
            to: { left: to },
            duration: duration
        });
    },

    _getDate(value) {
        return new Date(value);
    },

    _toTodayView: function(args) {
        const today = new Date();

        if(this._isMaxZoomLevel()) {
            this._selectionStrategy.selectValue(today, args.event);
            return;
        }

        this._preventViewChangeAnimation = true;

        this.option('zoomLevel', this.option('maxZoomLevel'));
        this._selectionStrategy.selectValue(today, args.event);

        this._animateShowView();

        this._preventViewChangeAnimation = false;
    },

    _wrapperAnimationEndHandler: function(offset, newDate) {
        this._rearrangeViews(offset);
        this._translateViews();
        this._resetLocation();
        this._renderNavigator();
        this._setViewContoured(newDate);
        this._updateAriaId(newDate);
        this._selectionStrategy.updateAriaSelected();
    },

    _rearrangeViews: function(offset) {
        if(offset === 0) {
            return;
        }

        const { viewsCount } = this.option();
        let viewOffset;
        let viewToCreateKey;
        let viewToRemoveKey;
        let viewBeforeCreateKey;
        let viewAfterRemoveKey;

        if(offset < 0) {
            viewOffset = 1;
            viewToCreateKey = '_beforeView';
            viewToRemoveKey = '_afterView';
            viewBeforeCreateKey = '_view';
            viewAfterRemoveKey = viewsCount === 1 ? '_view' : '_additionalView';
        } else {
            viewOffset = -1;
            viewToCreateKey = '_afterView';
            viewToRemoveKey = '_beforeView';
            viewBeforeCreateKey = viewsCount === 1 ? '_view' : '_additionalView';
            viewAfterRemoveKey = '_view';
        }

        if(!this[viewToCreateKey]) {
            return;
        }

        const destinationDate = this[viewToCreateKey].option('date');

        this[viewToRemoveKey]?.$element().remove();
        this[viewToRemoveKey] = this._renderSpecificView(this._getDateByOffset(viewOffset * viewsCount, destinationDate));
        this[viewAfterRemoveKey].$element().remove();

        if(viewsCount === 1) {
            this[viewAfterRemoveKey] = this[viewToCreateKey];
        } else {
            this[viewAfterRemoveKey] = this[viewBeforeCreateKey];
            this[viewBeforeCreateKey] = this[viewToCreateKey];
        }

        const dateByOffset = this._getDateByOffset(-viewOffset, destinationDate);
        this[viewToCreateKey] = this._isViewAvailable(dateByOffset) ? this._renderSpecificView(dateByOffset) : null;
    },

    _resetLocation: function() {
        move(this._$viewsWrapper, { left: 0, top: 0 });
    },

    _clean: function() {
        this.callBase();
        this._clearViewWidthCache();

        delete this._$viewsWrapper;
        delete this._navigator;
        delete this._$footer;
    },

    _clearViewWidthCache: function() {
        delete this._viewWidthValue;
    },

    _disposeViews: function() {
        this._view.$element().remove();
        this._beforeView && this._beforeView.$element().remove();
        this._additionalView && this._additionalView.$element().remove();
        this._afterView && this._afterView.$element().remove();
        delete this._view;
        delete this._additionalView;
        delete this._beforeView;
        delete this._afterView;
        delete this._skipNavigate;
    },

    _dispose: function() {
        clearTimeout(this._waitRenderViewTimeout);
        this.callBase();
    },

    _refreshViews: function() {
        this._resetActiveState();
        this._disposeViews();
        this._renderViews();
    },

    _visibilityChanged: function() {
        this._translateViews();
    },

    _focusInHandler: function() {
        this.callBase.apply(this, arguments);
        this._setViewContoured(this.option('currentDate'));
    },

    _focusOutHandler: function() {
        this.callBase.apply(this, arguments);
        this._view.option('contouredDate', null);
        this._additionalView?.option('contouredDate', null);
    },

    _updateViewsOption: function(optionName, newValue) {
        this._view.option(optionName, newValue);
        this._additionalView?.option(optionName, newValue);
        this._beforeView?.option(optionName, newValue);
        this._afterView?.option(optionName, newValue);
    },

    _setViewsMinOption: function(min) {
        this._restoreViewsMinMaxOptions();
        this.option('_rangeMin', this._convertToDate(min));
        this._updateViewsOption('min', this._getMinDate());
    },

    _setViewsMaxOption: function(max) {
        this._restoreViewsMinMaxOptions();
        this.option('_rangeMax', this._convertToDate(max));
        this._updateViewsOption('max', this._getMaxDate());
    },

    _restoreViewsMinMaxOptions: function() {
        this.option({
            _rangeMin: null,
            _rangeMax: null,
        });

        this._updateViewsOption('min', this._getMinDate());
        this._updateViewsOption('max', this._getMaxDate());
    },

    _updateAriaSelected: function(value, previousValue) {
        previousValue.forEach((item) => { this.setAria('selected', undefined, this._view._getCellByDate(item)); });
        value.forEach((item) => { this.setAria('selected', true, this._view._getCellByDate(item)); });

        if(this.option('viewsCount') > 1) {
            previousValue.forEach((item) => { this.setAria('selected', undefined, this._additionalView._getCellByDate(item)); });
            value.forEach((item) => { this.setAria('selected', true, this._additionalView._getCellByDate(item)); });
        }
    },

    _updateAriaId: function(value) {
        value = value ?? this.option('currentDate');

        const ariaId = 'dx-' + new Guid();
        const view = this._getActiveView(value);
        const $newCell = view._getCellByDate(value);

        this.setAria('id', ariaId, $newCell);
        this.setAria('activedescendant', ariaId);

        this._onContouredChanged(ariaId);
    },

    _suppressingNavigation: function(callback, args) {
        this._suppressNavigation = true;
        callback.apply(this, args);
        delete this._suppressNavigation;
    },

    _optionChanged: function(args) {
        const { value, previousValue } = args;

        switch(args.name) {
            case 'width':
                this.callBase(args);
                this._clearViewWidthCache();
                break;
            case 'min':
            case 'max':
                this.min = undefined;
                this.max = undefined;
                this._suppressingNavigation(this._updateCurrentDate, [this.option('currentDate')]);
                this._refreshViews();
                this._renderNavigator();
                break;
            case 'selectionMode':
                this._refreshSelectionStrategy();
                this._selectionStrategy.restoreValue();
                this._initCurrentDate();
                break;
            case 'firstDayOfWeek':
                this._refreshViews();
                this._updateButtonsVisibility();
                break;
            case 'currentDate':
                this.setAria('id', undefined, this._view._getCellByDate(previousValue));
                this._updateCurrentDate(value);
                break;
            case 'zoomLevel':
                this.$element().removeClass(CALENDAR_VIEW_CLASS + '-' + previousValue);
                this._correctZoomLevel();
                this._refreshViews();
                this._renderNavigator();
                this._updateAriaId();
                break;
            case 'minZoomLevel':
            case 'maxZoomLevel':
                this._correctZoomLevel();
                this._updateButtonsVisibility();
                break;
            case 'value':
                if(this.option('selectionMode') === 'single') {
                    this._selectionStrategy.processValueChanged([value], [previousValue]);
                }
                this._setSubmitValue(value);
                this.callBase(args);
                break;
            case 'values':
                if(this.option('selectionMode') !== 'single') {
                    this._selectionStrategy.processValueChanged(value, previousValue);
                }
                this._raiseValueChangeAction(value, previousValue);
                this._saveValueChangeEvent(undefined);
                break;
            case 'viewsCount':
                this._refreshViews();
                this._renderNavigator();
                break;
            case 'onCellClick':
                this._view.option('onCellClick', value);
                break;
            case 'onContouredChanged':
                this._onContouredChanged = this._createActionByOption('onContouredChanged');
                break;
            case 'disabledDates':
            case 'dateSerializationFormat':
            case 'cellTemplate':
            case 'showTodayButton':
                this._invalidate();
                break;
            case 'skipFocusCheck':
                break;
            case '_todayDate':
            case 'showWeekNumbers':
            case 'weekNumberRule':
                this._refreshViews();
                break;
            default:
                this.callBase(args);
        }
    },


    getContouredDate: function() {
        return this._view.option('contouredDate');
    }
});

registerComponent('dxCalendar', Calendar);

export default Calendar;
