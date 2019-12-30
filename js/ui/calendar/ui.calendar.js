const $ = require('../../core/renderer');
const Guid = require('../../core/guid');
const registerComponent = require('../../core/component_registrator');
const noop = require('../../core/utils/common').noop;
const typeUtils = require('../../core/utils/type');
const inRange = require('../../core/utils/math').inRange;
const extend = require('../../core/utils/extend').extend;
const Button = require('../button');
const Editor = require('../editor/editor');
const Swipeable = require('../../events/gesture/swipeable');
const Navigator = require('./ui.calendar.navigator');
const Views = require('./ui.calendar.views');
const translator = require('../../animation/translator');
const browser = require('../../core/utils/browser');
const dateUtils = require('../../core/utils/date');
const dateSerialization = require('../../core/utils/date_serialization');
const devices = require('../../core/devices');
const fx = require('../../animation/fx');
const windowUtils = require('../../core/utils/window');
const messageLocalization = require('../../localization/message');
const FunctionTemplate = require('../../core/templates/function_template').FunctionTemplate;

const CALENDAR_CLASS = 'dx-calendar';
const CALENDAR_BODY_CLASS = 'dx-calendar-body';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_FOOTER_CLASS = 'dx-calendar-footer';
const CALENDAR_TODAY_BUTTON_CLASS = 'dx-calendar-today-button';
const CALENDAR_HAS_FOOTER_CLASS = 'dx-calendar-with-footer';
const CALENDAR_VIEWS_WRAPPER_CLASS = 'dx-calendar-views-wrapper';
const CALENDAR_VIEW_CLASS = 'dx-calendar-view';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const ANIMATION_DURATION_SHOW_VIEW = 250;
const POP_ANIMATION_FROM = 0.6;
const POP_ANIMATION_TO = 1;

const CALENDAR_INPUT_STANDARD_PATTERN = 'yyyy-MM-dd';
const CALENDAR_DATE_VALUE_KEY = 'dxDateValueKey';

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

const Calendar = Editor.inherit({
    _activeStateUnit: '.' + CALENDAR_CELL_CLASS,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            /**
            * @name dxCalendarOptions.hoverStateEnabled
            * @type boolean
            * @default true
            */
            hoverStateEnabled: true,

            /**
            * @name dxCalendarOptions.activeStateEnabled
            * @type boolean
            * @default true
            */
            activeStateEnabled: true,

            /**
            * @name dxCalendarOptions.currentDate
            * @type Date
            * @hidden
            * @default new Date()
            */
            currentDate: new Date(),

            /**
            * @name dxCalendarOptions.value
            * @type Date|number|string
            * @default null
            */
            value: null,

            /**
            * @name dxCalendarOptions.dateSerializationFormat
            * @type string
            * @default undefined
            */
            dateSerializationFormat: undefined,

            /**
            * @name dxCalendarOptions.min
            * @type Date|number|string
            * @default new Date(1000, 0)
            */
            min: new Date(1000, 0),

            /**
            * @name dxCalendarOptions.max
            * @type Date|number|string
            * @default new Date(3000, 0)
            */
            max: new Date(3000, 0),

            /**
            * @name dxCalendarOptions.firstDayOfWeek
            * @type Enums.FirstDayOfWeek
            * @default undefined
            */
            firstDayOfWeek: undefined,

            /**
            * @name dxCalendarOptions.zoomLevel
            * @type Enums.CalendarZoomLevel
            * @default 'month'
            * @fires dxCalendarOptions.onOptionChanged
            */
            zoomLevel: ZOOM_LEVEL.MONTH,

            /**
            * @name dxCalendarOptions.maxZoomLevel
            * @type Enums.CalendarZoomLevel
            * @default 'month'
            */
            maxZoomLevel: ZOOM_LEVEL.MONTH,

            /**
            * @name dxCalendarOptions.minZoomLevel
            * @type Enums.CalendarZoomLevel
            * @default 'century'
            */
            minZoomLevel: ZOOM_LEVEL.CENTURY,

            /**
            * @name dxCalendarOptions.showTodayButton
            * @type boolean
            * @default false
            */
            showTodayButton: false,

            /**
            * @name dxCalendarOptions.cellTemplate
            * @type template|function
            * @default "cell"
            * @type_function_param1 itemData:object
            * @type_function_param1_field1 date:Date
            * @type_function_param1_field2 view:string
            * @type_function_param1_field3 text:string
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            cellTemplate: 'cell',

            /**
             * @name dxCalendarOptions.disabledDates
             * @type Array<Date>|function(data)
             * @default null
             * @type_function_param1 data:object
             * @type_function_param1_field1 component:object
             * @type_function_param1_field2 date:Date
             * @type_function_param1_field3 view:string
             * @type_function_return boolean
             */
            disabledDates: null,

            onCellClick: null,
            onContouredChanged: null,
            hasFocus: function(element) {
                return element.hasClass(FOCUSED_STATE_CLASS);
            }

            /**
            * @name dxCalendarOptions.name
            * @type string
            * @hidden false
            */

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
                    /**
                    * @name dxCalendarOptions.focusStateEnabled
                    * @type boolean
                    * @default true @for desktop
                    */
                    focusStateEnabled: true
                }
            }
        ]);
    },

    _supportedKeys: function() {
        return extend(this.callBase(), {
            rightArrow: function(e) {
                e.preventDefault();
                if(e.ctrlKey) {
                    this._waitRenderView(1);
                } else {
                    this._moveCurrentDate(1 * this._getRtlCorrection());
                }
            },
            leftArrow: function(e) {
                e.preventDefault();
                if(e.ctrlKey) {
                    this._waitRenderView(-1);
                } else {
                    this._moveCurrentDate(-1 * this._getRtlCorrection());
                }
            },
            upArrow: function(e) {
                e.preventDefault();
                if(e.ctrlKey) {
                    this._navigateUp();
                } else {
                    if(fx.isAnimating(this._view.$element())) {
                        return;
                    }
                    this._moveCurrentDate(-1 * this._view.option('colCount'));
                }
            },
            downArrow: function(e) {
                e.preventDefault();
                if(e.ctrlKey) {
                    this._navigateDown();
                } else {
                    if(fx.isAnimating(this._view.$element())) {
                        return;
                    }
                    this._moveCurrentDate(1 * this._view.option('colCount'));
                }
            },
            home: function(e) {
                e.preventDefault();

                const zoomLevel = this.option('zoomLevel');
                const currentDate = this.option('currentDate');
                const min = this._dateOption('min');

                const date = dateUtils.sameView(zoomLevel, currentDate, min)
                    ? min
                    : dateUtils.getViewFirstCellDate(zoomLevel, currentDate);

                this._moveToClosestAvailableDate(date, 1);
            },
            end: function(e) {
                e.preventDefault();

                const zoomLevel = this.option('zoomLevel');
                const currentDate = this.option('currentDate');
                const max = this._dateOption('max');

                const date = dateUtils.sameView(zoomLevel, currentDate, max)
                    ? max
                    : dateUtils.getViewLastCellDate(zoomLevel, currentDate);

                this._moveToClosestAvailableDate(date, -1);
            },
            pageUp: function(e) {
                e.preventDefault();
                this._waitRenderView(-1);
            },
            pageDown: function(e) {
                e.preventDefault();
                this._waitRenderView(1);
            },
            tab: noop,
            enter: function(e) {
                if(!this._isMaxZoomLevel()) {
                    this._navigateDown();
                } else {
                    const value = this._updateTimeComponent(this.option('currentDate'));
                    this._dateValue(value, e);
                }
            }
        });
    },

    _getSerializationFormat: function(optionName) {
        const value = this.option(optionName || 'value');

        if(this.option('dateSerializationFormat')) {
            return this.option('dateSerializationFormat');
        }

        if(typeUtils.isNumeric(value)) {
            return 'number';
        }

        if(!typeUtils.isString(value)) {
            return;
        }

        return dateSerialization.getDateSerializationFormat(value);
    },

    _convertToDate: function(value, optionName) {
        return dateSerialization.deserializeDate(value);
    },

    _dateValue: function(value, dxEvent) {
        if(dxEvent) this._saveValueChangeEvent(dxEvent);
        this._dateOption('value', value);
    },

    _dateOption: function(optionName, optionValue) {
        if(arguments.length === 1) {
            return this._convertToDate(this.option(optionName), optionName);
        }

        const serializationFormat = this._getSerializationFormat(optionName);
        this.option(optionName, dateSerialization.serializeDate(optionValue, serializationFormat));
    },

    _moveCurrentDate: function(offset, baseDate) {
        let currentDate = baseDate || new Date(this.option('currentDate'));
        const maxDate = this._getMaxDate();
        const minDate = this._getMinDate();
        const zoomLevel = this.option('zoomLevel');
        const isCurrentDateInRange = inRange(currentDate, minDate, maxDate);
        const dateForward = new Date(currentDate);
        const dateBackward = new Date(currentDate);
        let isDateForwardInRange = isCurrentDateInRange;
        let isDateBackwardInRange = isCurrentDateInRange;
        const step = offset || 1;

        while((!offset && (isDateForwardInRange || isDateBackwardInRange)) || (offset && isDateForwardInRange)) {
            switch(zoomLevel) {
                case ZOOM_LEVEL.MONTH:
                    dateForward.setDate(dateForward.getDate() + step);
                    dateBackward.setDate(dateBackward.getDate() - step);
                    break;
                case ZOOM_LEVEL.YEAR:
                    dateForward.setMonth(dateForward.getMonth() + step);
                    dateBackward.setMonth(dateBackward.getMonth() - step);
                    break;
                case ZOOM_LEVEL.DECADE:
                    dateForward.setFullYear(dateForward.getFullYear() + step);
                    dateBackward.setFullYear(dateBackward.getFullYear() - step);
                    break;
                case ZOOM_LEVEL.CENTURY:
                    dateForward.setFullYear(dateForward.getFullYear() + 10 * step);
                    dateBackward.setFullYear(dateBackward.getFullYear() - 10 * step);
                    break;
            }

            if(isDateForwardInRange && !this._view.isDateDisabled(dateForward)) {
                currentDate = dateForward;
                break;
            }

            if(isDateBackwardInRange && !offset && !this._view.isDateDisabled(dateBackward)) {
                currentDate = dateBackward;
                break;
            }

            isDateBackwardInRange = inRange(dateBackward, minDate, maxDate);
            isDateForwardInRange = inRange(dateForward, minDate, maxDate);
        }

        this.option('currentDate', currentDate);
    },

    _moveToClosestAvailableDate: function(baseDate, offset) {
        if(this._view.isDateDisabled(baseDate)) {
            this._moveCurrentDate(offset, baseDate);
        } else {
            this.option('currentDate', baseDate);
        }
    },

    _init: function() {
        this.callBase();
        this._correctZoomLevel();
        this._initCurrentDate();
        this._initActions();
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
        const currentDate = this._getNormalizedDate(this._dateOption('value')) || this._getNormalizedDate(this.option('currentDate'));
        this.option('currentDate', currentDate);
    },

    _getNormalizedDate: function(date) {
        date = dateUtils.normalizeDate(date, this._getMinDate(), this._getMaxDate());
        return typeUtils.isDefined(date) ? new Date(date) : date;
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
            this._navigate(offset, normalizedDate);
        } else {
            this._renderNavigator();
            this._setViewContoured(normalizedDate);
            this._updateAriaId(normalizedDate);
        }
    },

    _setViewContoured: function(date) {
        if(this.option('hasFocus')(this._focusTarget())) {
            this._view.option('contouredDate', date);
        }
    },

    _getMinDate: function() {
        if(this.min) {
            return this.min;
        }

        this.min = this._dateOption('min') || new Date(1000, 0);
        return this.min;
    },

    _getMaxDate: function() {
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

        this._moveToClosestAvailableDate(date, offset);

        setTimeout((function() {
            this._alreadyViewRender = false;
        }).bind(this));
    },

    _getRtlCorrection: function() {
        return this.option('rtlEnabled') ? -1 : 1;
    },

    _getDateByOffset: function(offset, date) {
        date = new Date(date || this.option('currentDate'));

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

        this._renderBody();
        $element.append(this.$body);

        this._renderViews();

        this._renderNavigator();
        $element.append(this._navigator.$element());

        this._renderSwipeable();
        this._renderFooter();

        this.setAria({
            'role': 'listbox',
            'label': messageLocalization.format('dxCalendar-ariaWidgetName')
        });
        this._updateAriaSelected();
        this._updateAriaId();

        if(this._view.isDateDisabled(this.option('currentDate'))) {
            this._moveCurrentDate(0);
        }

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

        const currentDate = this.option('currentDate');

        this._view = this._renderSpecificView(currentDate);

        if(windowUtils.hasWindow()) {
            const beforeDate = this._getDateByOffset(-1, currentDate);
            this._beforeView = this._isViewAvailable(beforeDate) ? this._renderSpecificView(beforeDate) : null;

            const afterDate = this._getDateByOffset(1, currentDate);
            afterDate.setDate(1);

            this._afterView = this._isViewAvailable(afterDate) ? this._renderSpecificView(afterDate) : null;
        }

        this._translateViews();
    },

    _renderSpecificView: function(date) {
        const specificView = Views[this.option('zoomLevel')];
        const $view = $('<div>').appendTo(this._$viewsWrapper);
        const config = this._viewConfig(date);

        return new specificView($view, config);
    },

    _viewConfig: function(date) {
        let disabledDates = this.option('disabledDates');

        disabledDates = typeUtils.isFunction(disabledDates) ? this._injectComponent(disabledDates.bind(this)) : disabledDates;
        return {
            date: date,
            min: this._getMinDate(),
            max: this._getMaxDate(),
            firstDayOfWeek: this.option('firstDayOfWeek'),
            value: this._dateOption('value'),
            rtl: this.option('rtlEnabled'),
            disabled: this.option('disabled'),
            tabIndex: undefined,
            focusStateEnabled: this.option('focusStateEnabled'),
            hoverStateEnabled: this.option('hoverStateEnabled'),
            disabledDates: disabledDates,
            onCellClick: this._cellClickHandler.bind(this),
            cellTemplate: this._getTemplateByOption('cellTemplate'),
            allowValueSelection: this._isMaxZoomLevel()
        };
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
        translator.move(this._view.$element(), { left: 0, top: 0 });

        this._beforeView && translator.move(this._beforeView.$element(), {
            left: this._getViewPosition(-1),
            top: 0
        });

        this._afterView && translator.move(this._afterView.$element(), {
            left: this._getViewPosition(1),
            top: 0
        });
    },

    _getViewPosition: function(coefficient) {
        const rtlCorrection = this.option('rtlEnabled') && !browser.msie ? -1 : 1;
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
            this._dateValue(newValue, e.event);
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

        this._setViewContoured(this._getNormalizedDate(newCurrentDate));
    },

    _renderNavigator: function() {
        if(!this._navigator) {
            this._navigator = new Navigator($('<div>'), this._navigatorConfig());
        }

        this._navigator.option('text', this._view.getNavigatorCaption());
        this._updateButtonsVisibility();
    },

    _navigatorConfig: function() {
        return {
            text: this._view.getNavigatorCaption(),
            onClick: this._navigatorClickHandler.bind(this),
            onCaptionClick: this._navigateUp.bind(this),
            rtlEnabled: this.option('rtlEnabled')
        };
    },

    _navigatorClickHandler: function(e) {
        const currentDate = this._getDateByOffset(e.direction, this.option('currentDate'));

        this._moveToClosestAvailableDate(currentDate, 1 * e.direction);
        this._updateNavigatorCaption(-e.direction * this._getRtlCorrection());
    },

    _navigateUp: function() {
        const zoomLevel = this.option('zoomLevel');
        const nextView = dateUtils.getViewUp(zoomLevel);

        if(!nextView || this._isMinZoomLevel(zoomLevel)) {
            return;
        }

        const contouredDate = this._view.option('contouredDate');

        this.option('zoomLevel', nextView);
        this.option('currentDate', contouredDate || this._view.option('date'));

        this._renderNavigator();

        this._animateShowView().done((function() {
            this._setViewContoured(contouredDate);
        }).bind(this));
    },

    _isMinZoomLevel: function(zoomLevel) {
        const min = this._getMinDate();
        const max = this._getMaxDate();

        return dateUtils.sameView(zoomLevel, min, max) || this.option('minZoomLevel') === zoomLevel;
    },

    _updateButtonsVisibility: function() {
        this._navigator.toggleButton('next', !typeUtils.isDefined(this._getRequiredView('next')));
        this._navigator.toggleButton('prev', !typeUtils.isDefined(this._getRequiredView('prev')));
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

        e.event.maxLeftOffset = this._getRequiredView('next') ? 1 : 0;
        e.event.maxRightOffset = this._getRequiredView('prev') ? 1 : 0;
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

        translator.move(this._$viewsWrapper, { left: offset * this._viewWidth(), top: 0 });
        this._updateNavigatorCaption(offset);
    },

    _swipeEndHandler: function(e) {
        const targetOffset = e.event.targetOffset;
        const moveOffset = !targetOffset ? 0 : targetOffset / Math.abs(targetOffset);

        if(moveOffset === 0) {
            this._animateWrapper(0, ANIMATION_DURATION_SHOW_VIEW);
            return;
        }

        let date = this._getDateByOffset(-moveOffset * this._getRtlCorrection());

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
            this._viewWidthValue = this.$element().width();
        }

        return this._viewWidthValue;
    },

    _updateNavigatorCaption: function(offset) {
        offset *= this._getRtlCorrection();

        let view = this._view;

        if(offset > 0.5 && this._beforeView) {
            view = this._beforeView;
        } else if(offset < -0.5 && this._afterView) {
            view = this._afterView;
        }

        this._navigator.option('text', view.getNavigatorCaption());
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
            const $todayButton = this._createComponent($('<a>'),
                Button, {
                    focusStateEnabled: false,
                    text: messageLocalization.format('dxCalendar-todayButtonText'),
                    onClick: (function() {
                        this._toTodayView();
                    }).bind(this),
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
        return this._popAnimationView(this._view, POP_ANIMATION_FROM, POP_ANIMATION_TO, ANIMATION_DURATION_SHOW_VIEW).promise();
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

    _toTodayView: function() {
        const today = new Date();

        if(this._isMaxZoomLevel()) {
            this._dateOption('value', today);
            return;
        }

        this._preventViewChangeAnimation = true;

        this.option('zoomLevel', this.option('maxZoomLevel'));
        this._dateOption('value', today);

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
    },

    _rearrangeViews: function(offset) {
        if(offset === 0) {
            return;
        }

        let viewOffset;
        let viewToCreateKey;
        let viewToRemoveKey;

        if(offset < 0) {
            viewOffset = 1;
            viewToCreateKey = '_beforeView';
            viewToRemoveKey = '_afterView';
        } else {
            viewOffset = -1;
            viewToCreateKey = '_afterView';
            viewToRemoveKey = '_beforeView';
        }

        if(!this[viewToCreateKey]) {
            return;
        }

        const destinationDate = this[viewToCreateKey].option('date');

        if(this[viewToRemoveKey]) {
            this[viewToRemoveKey].$element().remove();
        }

        if(offset === viewOffset) {
            this[viewToRemoveKey] = this._view;
        } else {
            this[viewToRemoveKey] = this._renderSpecificView(this._getDateByOffset(viewOffset, destinationDate));
            this._view.$element().remove();
        }

        this._view = this[viewToCreateKey];

        const dateByOffset = this._getDateByOffset(-viewOffset, destinationDate);
        this[viewToCreateKey] = this._isViewAvailable(dateByOffset) ? this._renderSpecificView(dateByOffset) : null;
    },

    _resetLocation: function() {
        translator.move(this._$viewsWrapper, { left: 0, top: 0 });
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
        this._afterView && this._afterView.$element().remove();
        delete this._view;
        delete this._beforeView;
        delete this._afterView;
    },

    _refreshViews: function() {
        this._disposeViews();
        this._renderViews();
    },

    _visibilityChanged: function() {
        this._translateViews();
    },

    _focusInHandler: function() {
        this.callBase.apply(this, arguments);
        this._view.option('contouredDate', this.option('currentDate'));
    },

    _focusOutHandler: function() {
        this.callBase.apply(this, arguments);
        this._view.option('contouredDate', null);
    },

    _updateViewsValue: function(value) {
        const newValue = value ? new Date(value) : null;

        this._view.option('value', newValue);
        this._beforeView && this._beforeView.option('value', newValue);
        this._afterView && this._afterView.option('value', newValue);
    },

    _updateAriaSelected: function(value, previousValue) {
        value = value || this._dateOption('value');

        const $prevSelectedCell = this._view._getCellByDate(previousValue);
        const $selectedCell = this._view._getCellByDate(value);

        this.setAria('selected', undefined, $prevSelectedCell);
        this.setAria('selected', true, $selectedCell);

        if(value && this.option('currentDate').getTime() === value.getTime()) {
            this._updateAriaId(value);
        }
    },

    _updateAriaId: function(value) {
        value = value || this.option('currentDate');

        const ariaId = 'dx-' + new Guid();
        const $newCell = this._view._getCellByDate(value);

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
        let value = args.value;
        let previousValue = args.previousValue;

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
                value = this._convertToDate(value);
                previousValue = this._convertToDate(previousValue);
                this._updateAriaSelected(value, previousValue);
                this.option('currentDate', typeUtils.isDefined(value) ? new Date(value) : new Date());
                this._updateViewsValue(value);
                this._setSubmitValue(value);
                this.callBase(args);
                break;
            case 'disabled':
                this._view.option('disabled', value);
                this.callBase(args);
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
            case 'hasFocus':
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent('dxCalendar', Calendar);

module.exports = Calendar;
