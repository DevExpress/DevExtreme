import { fx } from '@js/common/core/animation';
import { move } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import Swipeable from '@js/common/core/events/gesture/swipeable';
import { end as hoverEndEventName } from '@js/common/core/events/hover';
import { addNamespace, isCommandKeyPressed } from '@js/common/core/events/utils/index';
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import Guid from '@js/core/guid';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { FunctionTemplate } from '@js/core/templates/function_template';
import dateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';
import { inRange, sign } from '@js/core/utils/math';
import { getWidth } from '@js/core/utils/size';
import {
  isDefined,
  isFunction,
  isNumeric,
  isString,
} from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import type { ClickEvent } from '@js/ui/button';
import type {
  CalendarZoomLevel, DateLike, Properties,
} from '@js/ui/calendar';
import { current, isFluent } from '@js/ui/themes';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import type { SwipeEndEvent, SwipeStartEvent, SwipeUpdateEvent } from '@ts/events/m_swipe';
import Button from '@ts/ui/button/wrapper';
import Editor from '@ts/ui/editor/editor';

import type { BaseViewProperties, CellEvent } from './calendar.base_view';
import CalendarMultipleSelectionStrategy from './calendar.multiple.selection.strategy';
import type { NavigatorOptions } from './calendar.navigator';
import Navigator from './calendar.navigator';
import CalendarRangeSelectionStrategy from './calendar.range.selection.strategy';
import CalendarSingleSelectionStrategy from './calendar.single.selection.strategy';
import type {
  CenturyView, DecadeView, MonthView, MonthViewProperties, YearView,
} from './calendar.views';
import Views from './calendar.views';

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
const GESTURE_COVER_CLASS = 'dx-gesture-cover';

const ANIMATION_DURATION_SHOW_VIEW = 250;
const POP_ANIMATION_FROM = 0.6;
const POP_ANIMATION_TO = 1;

const CALENDAR_INPUT_STANDARD_PATTERN = 'yyyy-MM-dd';
const CALENDAR_DATE_VALUE_KEY = 'dxDateValueKey';

const CALENDAR_DXHOVEREND_EVENT_NAME = addNamespace(hoverEndEventName, 'dxCalendar');

const LEVEL_COMPARE_MAP = {
  month: 3,
  year: 2,
  decade: 1,
  century: 0,
};

const ZOOM_LEVEL: Record<string, CalendarZoomLevel> = {
  MONTH: 'month',
  YEAR: 'year',
  DECADE: 'decade',
  CENTURY: 'century',
};

const SELECTION_STRATEGIES = {
  SingleSelection: CalendarSingleSelectionStrategy,
  MultipleSelection: CalendarMultipleSelectionStrategy,
  RangeSelection: CalendarRangeSelectionStrategy,
};

export interface CalendarProperties extends Properties {
  viewsCount: number;

  currentDate?: Date;

  todayButtonText?: string;

  rangeMin?: Date;
  rangeMax?: Date;
  allowChangeSelectionOrder?: boolean;
  currentSelection?: 'startDate' | 'endDate';
  _todayDate: () => Date;
  onCellClick?: (e: CellEvent) => void;
  onContouredChanged?: (e: { activeElement: string }) => void;
}

class Calendar<
  TProperties extends CalendarProperties = CalendarProperties,
> extends Editor<TProperties> {
  _swipeable?: Swipeable;

  _$viewsWrapper!: dxElementWrapper;

  $body!: dxElementWrapper;

  _skipNavigate?: boolean;

  _onContouredChanged?: (activeElement: string) => void;

  _cellClickAction?: (e: CellEvent) => void;

  _view!: MonthView | YearView | DecadeView | CenturyView;

  _additionalView!: MonthView | YearView | DecadeView | CenturyView;

  _beforeView?: MonthView | YearView | DecadeView | CenturyView | null;

  _afterView?: MonthView | YearView | DecadeView | CenturyView | null;

  _selectionStrategy!: CalendarSingleSelectionStrategy
    | CalendarMultipleSelectionStrategy
    | CalendarRangeSelectionStrategy;

  _suppressNavigation?: true;

  max?: Date;

  min?: Date;

  _navigator!: Navigator;

  _alreadyViewRender?: boolean;

  _waitRenderViewTimeout?: NodeJS.Timeout;

  _$footer?: dxElementWrapper;

  _viewWidthValue?: number;

  _preventViewChangeAnimation?: boolean;

  _$submitElement!: dxElementWrapper;

  _isOtherViewCellClicked?: boolean;

  _valueSelected?: boolean;

  protected _activeStateUnit(): string {
    return `.${CALENDAR_CELL_CLASS}`;
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      hoverStateEnabled: true,
      activeStateEnabled: true,
      currentDate: new Date(),
      value: null,
      min: new Date(1000, 0),
      max: new Date(3000, 0),
      viewsCount: 1,
      zoomLevel: ZOOM_LEVEL.MONTH,
      maxZoomLevel: ZOOM_LEVEL.MONTH,
      minZoomLevel: ZOOM_LEVEL.CENTURY,
      selectionMode: 'single',
      selectWeekOnClick: true,
      showTodayButton: false,
      todayButtonText: messageLocalization.format('dxCalendar-todayButtonText'),
      showWeekNumbers: false,
      weekNumberRule: 'auto',
      cellTemplate: 'cell',
      disabledDates: null,
      onCellClick: null,
      onContouredChanged: null,
      skipFocusCheck: false,

      _todayDate: () => new Date(),
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        // @ts-expect-error ts-error
        options: {
          focusStateEnabled: true,
        },
      },
    ]);
  }

  _supportedKeys(): SupportedKeys {
    return {
      ...super._supportedKeys(),
      rightArrow(e: DxEvent<KeyboardEvent>): void {
        e.preventDefault();
        if (isCommandKeyPressed(e)) {
          this._waitRenderView(1);
        } else {
          this._moveCurrentDateByOffset(1 * this._getRtlCorrection());
        }
      },
      leftArrow(e: DxEvent<KeyboardEvent>): void {
        e.preventDefault();
        if (isCommandKeyPressed(e)) {
          this._waitRenderView(-1);
        } else {
          this._moveCurrentDateByOffset(-1 * this._getRtlCorrection());
        }
      },
      upArrow(e: DxEvent<KeyboardEvent>): void {
        e.preventDefault();
        if (isCommandKeyPressed(e)) {
          this._navigateUp();
        } else {
          if (fx.isAnimating(this._view.$element().get(0))) {
            return;
          }
          this._moveCurrentDateByOffset(-1 * this._view.option('colCount'));
        }
      },
      downArrow(e: DxEvent<KeyboardEvent>): void {
        e.preventDefault();
        if (isCommandKeyPressed(e)) {
          this._navigateDown();
        } else {
          if (fx.isAnimating(this._view.$element().get(0))) {
            return;
          }
          this._moveCurrentDateByOffset(1 * this._view.option('colCount'));
        }
      },
      home(e: DxEvent<KeyboardEvent>): void {
        e.preventDefault();

        const zoomLevel = this.option('zoomLevel');
        const currentDate = this.option('currentDate');
        const min = this._getDateOption('min');

        if (this._view.isDateDisabled(currentDate)) {
          return;
        }

        const date = dateUtils.sameView(zoomLevel, currentDate, min)
          ? min
          : dateUtils.getViewFirstCellDate(zoomLevel, currentDate);

        this._moveToClosestAvailableDate(date);
      },
      end(e: DxEvent<KeyboardEvent>): void {
        e.preventDefault();

        const zoomLevel = this.option('zoomLevel');
        const currentDate = this.option('currentDate');
        const max = this._getDateOption('max');

        if (this._view.isDateDisabled(currentDate)) {
          return;
        }

        const date = dateUtils.sameView(zoomLevel, currentDate, max)
          ? max
          : dateUtils.getViewLastCellDate(zoomLevel, currentDate);

        this._moveToClosestAvailableDate(date);
      },
      pageUp(e: DxEvent<KeyboardEvent>): void {
        e.preventDefault();
        this._waitRenderView(-1 * this._getRtlCorrection());
      },
      pageDown(e: DxEvent<KeyboardEvent>): void {
        e.preventDefault();
        this._waitRenderView(1 * this._getRtlCorrection());
      },
      tab(): void {},
      enter: this._enterKeyHandler,
    };
  }

  _enterKeyHandler(e: DxEvent<KeyboardEvent>): void {
    const { currentDate = new Date() } = this.option();
    if (!this._isMaxZoomLevel()) {
      this._navigateDown();
    } else if (!this._view.isDateDisabled(currentDate)) {
      const value = this._updateTimeComponent(currentDate);
      this._selectionStrategy.selectValue(value, e);
    }
  }

  _getSerializationFormat(optionName: 'value' | 'min' | 'max' = 'value'): string | undefined | null {
    const { [optionName]: value } = this.option();
    const { dateSerializationFormat } = this.option();

    if (dateSerializationFormat) {
      return dateSerializationFormat;
    }

    if (isNumeric(value)) {
      return 'number';
    }

    if (!isString(value) || value === '') {
      return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return dateSerialization.getDateSerializationFormat(value);
  }

  _convertToDate(value: DateLike | undefined): Date | null {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return dateSerialization.deserializeDate(value);
  }

  _dateValue(value: Date | null | (Date | null)[], event: DxEvent): void {
    if (event) {
      if (event.type === 'keydown') {
        const cellElement = this._view._getContouredCell().get(0);
        event.target = cellElement;
      }
      this._saveValueChangeEvent(event);
    }
    this._setDateOption('value', value);
  }

  _isArrayValue(optionName: 'value' | 'min' | 'max', value: DateLike | DateLike[] | undefined): value is DateLike[] {
    return optionName === 'value' && !this._isSingleMode();
  }

  _setDateOption(
    optionName: 'value' | 'min' | 'max',
    optionValue: DateLike | DateLike[],
  ): void {
    const serializationFormat = this._getSerializationFormat(optionName);
    const serializedValue = this._isArrayValue(optionName, optionValue)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      ? optionValue.map((value) => dateSerialization.serializeDate(value, serializationFormat))
      : dateSerialization.serializeDate(optionValue, serializationFormat);

    this.option(optionName, serializedValue);
  }

  _getDateOption(optionName: 'value'): Date | null | (Date | null)[];
  _getDateOption(optionName: 'min' | 'max'): Date | null;
  _getDateOption(optionName: 'value' | 'min' | 'max'): Date | null | (Date | null)[] {
    let { [optionName]: optionValue } = this.option();
    if (!this._isArrayValue(optionName, optionValue)) {
      if (optionValue === '') {
        optionValue = null;
      }
      return this._convertToDate(optionValue);
    }

    const valueArray = optionValue ?? [];

    return valueArray.map((item) => this._convertToDate(item));
  }

  _isSingleMode(): boolean {
    const { selectionMode } = this.option();

    return selectionMode === 'single';
  }

  _shiftDate(zoomLevel: CalendarZoomLevel, date: Date, offset: number, reverse: number): void {
    switch (zoomLevel) {
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
      default:
        break;
    }
  }

  _moveCurrentDateByOffset(offset: number): void {
    const {
      currentDate: baseDate = new Date(),
      zoomLevel = ZOOM_LEVEL.MONTH,
    } = this.option();
    let currentDate = new Date(baseDate);
    this._shiftDate(zoomLevel, currentDate, offset, 1);

    const maxDate = this._getMaxDate();
    const minDate = this._getMinDate();

    let isDateForwardInNeighborView = this._areDatesInNeighborView(
      zoomLevel,
      currentDate,
      baseDate,
    );
    let isDateForwardInRange = inRange(currentDate, minDate, maxDate)
      && isDateForwardInNeighborView;
    const dateForward = new Date(currentDate);

    while (isDateForwardInRange) {
      if (!this._view.isDateDisabled(dateForward)) {
        currentDate = dateForward;
        break;
      }

      this._shiftDate(zoomLevel, dateForward, offset, 1);

      isDateForwardInNeighborView = this._areDatesInNeighborView(zoomLevel, dateForward, baseDate);
      isDateForwardInRange = inRange(dateForward, minDate, maxDate) && isDateForwardInNeighborView;
    }

    if (this._view.isDateDisabled(baseDate) || this._view.isDateDisabled(currentDate)) {
      const direction = offset > 0 ? 1 : -1;
      const isViewDisabled = direction === 1
        ? this._isNextViewDisabled()
        : this._isPrevViewDisabled();

      if (!isViewDisabled) {
        this._waitRenderView(direction);
      } else {
        this._moveToClosestAvailableDate(currentDate);
      }
    } else {
      this._skipNavigate = true;
      this.option('currentDate', currentDate);
    }
  }

  _isNextViewDisabled(): boolean {
    const { disabled } = this._navigator._nextButton.option();

    return disabled === true;
  }

  _isPrevViewDisabled(): boolean {
    const { disabled } = this._navigator._prevButton.option();

    return disabled === true;
  }

  _areDatesInSameView(zoomLevel: CalendarZoomLevel, date1: Date, date2: Date): boolean {
    switch (zoomLevel) {
      case ZOOM_LEVEL.YEAR:
        return date1.getFullYear() === date2.getFullYear();
      case ZOOM_LEVEL.DECADE:
        return Math.floor(date1.getFullYear() / 10) === Math.floor(date2.getFullYear() / 10);
      case ZOOM_LEVEL.CENTURY:
        return Math.floor(date1.getFullYear() / 100) === Math.floor(date2.getFullYear() / 100);
      case ZOOM_LEVEL.MONTH:
      default:
        return date1.getMonth() === date2.getMonth();
    }
  }

  _areDatesInNeighborView(zoomLevel: CalendarZoomLevel, date1: Date, date2: Date): boolean {
    const monthMinDistance = (a: number, b: number): number => {
      const abs = Math.abs(a - b);
      return Math.min(abs, 12 - abs);
    };

    switch (zoomLevel) {
      case ZOOM_LEVEL.YEAR:
        return Math.abs(date1.getFullYear() - date2.getFullYear()) <= 1;
      case ZOOM_LEVEL.DECADE:
        return Math.abs(date1.getFullYear() - date2.getFullYear()) <= 10;
      case ZOOM_LEVEL.CENTURY:
        return Math.abs(date1.getFullYear() - date2.getFullYear()) <= 100;
      case ZOOM_LEVEL.MONTH:
      default:
        return monthMinDistance(date1.getMonth(), date2.getMonth()) <= 1;
    }
  }

  _moveToClosestAvailableDate(baseDate?: Date): void {
    const {
      zoomLevel = ZOOM_LEVEL.MONTH,
      currentDate: oldCurrentDate = new Date(),
    } = this.option();
    let currentDate = new Date(baseDate ?? oldCurrentDate);

    const isCurrentDateAvailable = !this._isDateNotAvailable(currentDate);

    let isDateForwardAvailable = isCurrentDateAvailable;
    let isDateBackwardAvailable = isCurrentDateAvailable;

    let isDateForwardInStartView = true;
    let isDateBackwardInStartView = true;

    const dateForward = new Date(currentDate);
    const dateBackward = new Date(currentDate);

    do {
      if (isDateForwardAvailable) {
        currentDate = dateForward;
        break;
      }

      if (isDateBackwardAvailable) {
        currentDate = dateBackward;
        break;
      }

      this._shiftDate(zoomLevel, dateForward, 1, 1);
      this._shiftDate(zoomLevel, dateBackward, 1, -1);

      isDateForwardInStartView = this._areDatesInSameView(
        zoomLevel,
        dateForward,
        baseDate ?? oldCurrentDate,
      );
      isDateBackwardInStartView = this._areDatesInSameView(
        zoomLevel,
        dateBackward,
        baseDate ?? oldCurrentDate,
      );

      isDateForwardAvailable = isDateForwardInStartView
        && !this._isDateNotAvailable(dateForward);
      isDateBackwardAvailable = isDateBackwardInStartView
        && !this._isDateNotAvailable(dateBackward);
    } while (isDateForwardInStartView || isDateBackwardInStartView);

    this.option('currentDate', currentDate);
  }

  _isDateNotAvailable(date: Date): boolean {
    const maxDate = this._getMaxDate();
    const minDate = this._getMinDate();

    return !inRange(date, minDate, maxDate) || this._view.isDateDisabled(date);
  }

  _init(): void {
    super._init();

    this._initSelectionStrategy();
    this._correctZoomLevel();
    this._initCurrentDate();
    this._initActions();
  }

  _initSelectionStrategy(): void {
    const strategyName = this._getSelectionStrategyName();
    const strategy = SELECTION_STRATEGIES[strategyName];

    if (this._selectionStrategy?.NAME !== strategyName) {
      // eslint-disable-next-line new-cap
      this._selectionStrategy = new strategy(this);
    }
  }

  _refreshSelectionStrategy(): void {
    this._initSelectionStrategy();
    this._selectionStrategy.restoreValue();
    this._refresh();
  }

  _getSelectionStrategyName(): string {
    const { selectionMode } = this.option();

    switch (selectionMode) {
      case 'multiple':
        return 'MultipleSelection';
      case 'range':
        return 'RangeSelection';
      default:
        return 'SingleSelection';
    }
  }

  _correctZoomLevel(): void {
    const {
      minZoomLevel = ZOOM_LEVEL.CENTURY,
      maxZoomLevel = ZOOM_LEVEL.MONTH,
      zoomLevel = ZOOM_LEVEL.MONTH,
    } = this.option();

    if (LEVEL_COMPARE_MAP[maxZoomLevel] < LEVEL_COMPARE_MAP[minZoomLevel]) {
      return;
    }

    if (LEVEL_COMPARE_MAP[zoomLevel] > LEVEL_COMPARE_MAP[maxZoomLevel]) {
      this.option('zoomLevel', maxZoomLevel);

      return;
    }

    if (LEVEL_COMPARE_MAP[zoomLevel] < LEVEL_COMPARE_MAP[minZoomLevel]) {
      this.option('zoomLevel', minZoomLevel);
    }
  }

  _initCurrentDate(): void {
    const { currentDate = new Date() } = this.option();
    const defaultCurrentDate = this._selectionStrategy.getDefaultCurrentDate();
    const date = (defaultCurrentDate ? this._getNormalizedDate(defaultCurrentDate) : null)
    ?? this._getNormalizedDate(currentDate);

    this.option('currentDate', date);
  }

  _getNormalizedDate(date: Date): Date;
  _getNormalizedDate(date: null): null;
  _getNormalizedDate(date: Date | null): Date | null {
    const normalizedDate = dateUtils.normalizeDate(date, this._getMinDate(), this._getMaxDate());
    return isDefined(normalizedDate) ? this._getDate(normalizedDate) : date;
  }

  _initActions(): void {
    this._cellClickAction = this._createActionByOption('onCellClick');
    this._onContouredChanged = this._createActionByOption('onContouredChanged');
  }

  _initTemplates(): void {
    this._templateManager.addDefaultTemplates({
      // @ts-expect-error ts-error
      cell: new FunctionTemplate((options) => {
        const data = options.model;
        $(options.container).append($('<span>').text(data?.text || String(data)));
      }),
    });
    super._initTemplates();
  }

  _updateCurrentDate(date: Date): void {
    if (fx.isAnimating(this._$viewsWrapper.get(0))) {
      fx.stop(this._$viewsWrapper.get(0), true);
    }

    const min = this._getMinDate();
    const max = this._getMaxDate();

    if (min > max) {
      this.option('currentDate', new Date());
      return;
    }

    const normalizedDate = this._getNormalizedDate(date);

    if (date.getTime() !== normalizedDate.getTime()) {
      this.option('currentDate', new Date(normalizedDate));
      return;
    }

    const { date: viewDate } = this._view.option();
    let offset = this._getViewsOffset(viewDate, normalizedDate);

    if (offset !== 0 && !this._isMaxZoomLevel() && this._isOtherViewCellClicked) { offset = 0; }

    if (this._view && offset !== 0 && !this._suppressNavigation) {
      if (this._additionalView) {
        if (offset > 2 || offset < -1) {
          this._refreshViews();
          this._setViewContoured(normalizedDate);
          this._updateAriaId(normalizedDate);
          this._renderNavigator();
        } else if (offset === 1 && this._skipNavigate) {
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
  }

  _isAdditionalViewDate(date: Date = new Date()): boolean {
    if (!this._additionalView) {
      return false;
    }

    return date >= this._additionalView._getFirstAvailableDate();
  }

  _getActiveView(date: Date): MonthView | YearView | DecadeView | CenturyView {
    return this._isAdditionalViewDate(date) ? this._additionalView : this._view;
  }

  _setViewContoured(date: Date): void {
    if (this.option('skipFocusCheck') || $(this._$viewsWrapper).is(':focus')) {
      this._view.option('contouredDate', null);
      this._additionalView?.option('contouredDate', null);

      const view = this._isAdditionalViewDate(date) ? this._additionalView : this._view;

      view.option('contouredDate', date);
    }
  }

  _getMinDate(): Date {
    const { rangeMin } = this.option();
    if (rangeMin) {
      return rangeMin;
    }

    if (this.min) {
      return this.min;
    }

    this.min = this._getDateOption('min') ?? new Date(1000, 0);
    return this.min;
  }

  _getMaxDate(): Date {
    const { rangeMax } = this.option();
    if (rangeMax) {
      return rangeMax;
    }

    if (this.max) {
      return this.max;
    }

    this.max = this._getDateOption('max') ?? new Date(3000, 0);
    return this.max;
  }

  _getViewsOffset(startDate: Date, endDate: Date): number {
    const { zoomLevel } = this.option();

    if (zoomLevel === ZOOM_LEVEL.MONTH) {
      return this._getMonthsOffset(startDate, endDate);
    }

    let zoomCorrection = 1;

    switch (zoomLevel) {
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

    return Math.floor(endDate.getFullYear() / zoomCorrection)
      - Math.floor(startDate.getFullYear() / zoomCorrection);
  }

  _getMonthsOffset(startDate: Date, endDate: Date): number {
    const yearOffset = endDate.getFullYear() - startDate.getFullYear();
    const monthOffset = endDate.getMonth() - startDate.getMonth();

    return yearOffset * 12 + monthOffset;
  }

  _waitRenderView(offset: number): void {
    if (this._alreadyViewRender) {
      return;
    }

    this._alreadyViewRender = true;

    const date = this._getDateByOffset(offset * this._getRtlCorrection());

    this._moveToClosestAvailableDate(date);

    // eslint-disable-next-line no-restricted-globals
    this._waitRenderViewTimeout = setTimeout(() => {
      this._alreadyViewRender = false;
    });
  }

  _getRtlCorrection(): number {
    const { rtlEnabled } = this.option();

    return rtlEnabled ? -1 : 1;
  }

  _getDateByOffset(offset: number, initialDate?: DateLike): Date {
    const { currentDate = new Date() } = this.option();
    const date = this._getDate(initialDate ?? currentDate);

    const currentDay = date.getDate();
    const difference = dateUtils.getDifferenceInMonth(this.option('zoomLevel')) * offset;

    date.setDate(1);
    date.setMonth(date.getMonth() + difference);

    // @ts-expect-error ts-error
    const lastDay = dateUtils.getLastMonthDate(date).getDate();
    date.setDate(currentDay > lastDay ? lastDay : currentDay);

    return date;
  }

  _focusTarget(): dxElementWrapper {
    return this._$viewsWrapper;
  }

  _focusEventTarget(): dxElementWrapper {
    return this.$element();
  }

  _initMarkup(): void {
    this._renderSubmitElement();

    const $element = this.$element();
    $element.addClass(CALENDAR_CLASS);
    const { selectionMode } = this.option();
    $element.toggleClass(CALENDAR_RANGE_CLASS, selectionMode === 'range');

    this._renderBody();
    $element.append(this.$body);

    this._renderViews();
    this._renderNavigator();

    super._initMarkup();

    this._renderEvents();

    $element.prepend(this._navigator.$element());

    this._renderSwipeable();
    this._renderFooter();

    this._selectionStrategy.updateAriaSelected();
    this._updateAriaId();
    this._updateNavigatorLabels();

    this.setAria('role', 'application');
    this._updateAriaLabelAndRole();

    this._moveToClosestAvailableDate();
  }

  _render(): void {
    super._render();

    const { currentDate = new Date() } = this.option();
    this._setViewContoured(currentDate);
  }

  _renderBody(): void {
    if (!this._$viewsWrapper) {
      this.$body = $('<div>').addClass(CALENDAR_BODY_CLASS);
      this._$viewsWrapper = $('<div>').addClass(CALENDAR_VIEWS_WRAPPER_CLASS);
      this.$body.append(this._$viewsWrapper);
    }
  }

  _updateAriaLabelAndRole(): void {
    const readOnly = this.option('readOnly');
    const $element = this.$element();

    const aria = {
      role: readOnly ? 'group' : undefined,
      label: readOnly ? messageLocalization.format('dxCalendar-readOnlyLabel') : undefined,
    };

    this.setAria(aria, $element);
  }

  _setAriaReadonly(): void {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getKeyboardListeners(): any {
    return super._getKeyboardListeners().concat([this._view]);
  }

  _renderViews(): void {
    const { zoomLevel } = this.option();

    this.$element().addClass(`${CALENDAR_VIEW_CLASS}-${zoomLevel}`);

    const { currentDate = new Date(), viewsCount } = this.option();

    this.$element().toggleClass(CALENDAR_MULTIVIEW_CLASS, viewsCount > 1);

    this._view = this._renderSpecificView(currentDate);

    if (hasWindow()) {
      const beforeDate = this._getDateByOffset(-1, currentDate);
      this._beforeView = this._isViewAvailable(beforeDate)
        ? this._renderSpecificView(beforeDate)
        : null;

      const afterDate = this._getDateByOffset(viewsCount, currentDate);
      afterDate.setDate(1);
      this._afterView = this._isViewAvailable(afterDate)
        ? this._renderSpecificView(afterDate)
        : null;
    }

    if (viewsCount > 1) {
      this._additionalView = this._renderSpecificView(this._getDateByOffset(1, currentDate));
    }

    this._translateViews();
  }

  _renderSpecificView(date: Date): MonthView | YearView | DecadeView | CenturyView {
    const { zoomLevel = ZOOM_LEVEL.MONTH } = this.option();
    const specificView = Views[zoomLevel];
    const $view = $('<div>').appendTo(this._$viewsWrapper);
    const config = this._viewConfig(date);

    // @ts-expect-error ts-error
    const view = this._createComponent($view, specificView, config);

    return view;
  }

  _viewConfig(date: Date): MonthViewProperties | BaseViewProperties {
    const {
      firstDayOfWeek = dateLocalization.firstDayOfWeekIndex(),
      showWeekNumbers = false,
      selectWeekOnClick,
      weekNumberRule,
      zoomLevel = ZOOM_LEVEL.MONTH,
      focusStateEnabled,
      hoverStateEnabled,
      disabledDates: disabledDatesOption,
      _todayDate: todayDate,
    } = this.option();

    const disabledDates = isFunction(disabledDatesOption)
      ? this._injectComponent(disabledDatesOption.bind(this))
      : disabledDatesOption;

    return {
      ...this._selectionStrategy.getViewOptions(),
      date,
      min: this._getMinDate(),
      max: this._getMaxDate(),
      // @ts-expect-error ts-error
      firstDayOfWeek,
      showWeekNumbers,
      selectWeekOnClick,
      weekNumberRule,
      zoomLevel,
      tabIndex: undefined,
      focusStateEnabled,
      hoverStateEnabled,
      disabledDates,
      onCellClick: this._cellClickHandler.bind(this),
      cellTemplate: this._getTemplateByOption('cellTemplate'),
      allowValueSelection: this._isMaxZoomLevel(),
      _todayDate: todayDate,
    };
  }

  _renderEvents(): void {
    eventsEngine.off(this._$viewsWrapper, CALENDAR_DXHOVEREND_EVENT_NAME);

    const { selectionMode } = this.option();

    if (selectionMode === 'range') {
      eventsEngine.on(this._$viewsWrapper, CALENDAR_DXHOVEREND_EVENT_NAME, null, () => {
        this._updateViewsOption('hoveredRange', []);
      });
    }
  }

  _injectComponent<T>(
    func: (params: T & { component: Calendar<TProperties> }) => boolean,
  ): (params: T) => boolean {
    return (params: T): boolean => func({ ...params, component: this });
  }

  _isViewAvailable(date: Date): boolean {
    const { zoomLevel } = this.option();
    const min = dateUtils.getViewMinBoundaryDate(zoomLevel, this._getMinDate());
    const max = dateUtils.getViewMaxBoundaryDate(zoomLevel, this._getMaxDate());

    return dateUtils.dateInRange(date, min, max);
  }

  _translateViews(): void {
    const { viewsCount } = this.option();

    move(this._view.$element(), { left: 0, top: 0 });
    this._moveViewElement(this._beforeView, -1);
    this._moveViewElement(this._afterView, viewsCount);
    this._moveViewElement(this._additionalView, 1);
  }

  _moveViewElement(
    view: MonthView | YearView | DecadeView | CenturyView | undefined | null,
    coefficient: number,
  ): void {
    if (view) {
      move(view.$element(), {
        left: this._getViewPosition(coefficient),
        top: 0,
      });
    }
  }

  _getViewPosition(coefficient: number): string {
    const rtlCorrection = this.option('rtlEnabled') ? -1 : 1;
    return `${coefficient * 100 * rtlCorrection}%`;
  }

  _cellClickHandler(e: CellEvent): void {
    const zoomLevel = this.option('zoomLevel');
    const nextView = dateUtils.getViewDown(zoomLevel);

    const isMaxZoomLevel = this._isMaxZoomLevel();

    if (nextView && !isMaxZoomLevel) {
      this._navigateDown(e.event.currentTarget);
    } else {
      const newValue = this._updateTimeComponent(e.value);
      this._selectionStrategy.selectValue(newValue, e.event);
      this._cellClickAction?.(e);
    }
  }

  _updateTimeComponent(date: Date): Date {
    const result = new Date(date);
    const currentValue = this._getDateOption('value');

    if (currentValue && !this._isArrayValue('value', currentValue)) {
      result.setHours(currentValue.getHours());
      result.setMinutes(currentValue.getMinutes());
      result.setSeconds(currentValue.getSeconds());
      result.setMilliseconds(currentValue.getMilliseconds());
    }

    return result;
  }

  _isMaxZoomLevel(): boolean {
    const { zoomLevel = ZOOM_LEVEL.MONTH, maxZoomLevel } = this.option();
    return zoomLevel === maxZoomLevel;
  }

  _navigateDown(cell?: Element): void {
    const { zoomLevel, currentDate = new Date() } = this.option();

    if (this._isMaxZoomLevel()) {
      return;
    }

    const nextView = dateUtils.getViewDown(zoomLevel);

    if (!nextView) {
      return;
    }
    const { contouredDate, date } = this._view.option();
    let newCurrentDate = contouredDate ?? date;

    if (cell) {
      // @ts-expect-error ts-error
      newCurrentDate = $(cell).data(CALENDAR_DATE_VALUE_KEY);
    }

    this._isOtherViewCellClicked = true;

    this.option('currentDate', newCurrentDate);
    this.option('zoomLevel', nextView);

    this._isOtherViewCellClicked = false;

    this._renderNavigator();
    this._animateShowView();

    this._moveToClosestAvailableDate();
    this._setViewContoured(this._getNormalizedDate(currentDate));
  }

  _renderNavigator(): void {
    if (!this._navigator) {
      this._navigator = this._createComponent($('<div>'), Navigator, this._navigatorConfig());
    }

    this._navigator.option('text', this._getViewsCaption(this._view, this._additionalView));
    this._updateButtonsVisibility();
  }

  _navigatorConfig(): NavigatorOptions {
    const { focusStateEnabled, rtlEnabled } = this.option();

    return {
      text: this._getViewsCaption(this._view, this._additionalView),
      onClick: this._navigatorClickHandler.bind(this),
      onCaptionClick: this._navigateUp.bind(this),
      focusStateEnabled,
      rtlEnabled,
      tabIndex: undefined,
    };
  }

  _navigatorClickHandler(e: { direction: number; event: ClickEvent }): void {
    const { currentDate, viewsCount } = this.option();
    let offset = e.direction;

    if (viewsCount > 1) {
      const additionalViewActive = this._isAdditionalViewDate(currentDate);
      const shouldDoubleOffset = (additionalViewActive && offset < 0)
        || (!additionalViewActive && offset > 0);

      if (shouldDoubleOffset) {
        offset *= 2;
      }
    }

    const newCurrentDate = this._getDateByOffset(offset, currentDate);
    this._moveToClosestAvailableDate(newCurrentDate);
  }

  _navigateUp(): void {
    const { zoomLevel = ZOOM_LEVEL.MONTH, currentDate = new Date() } = this.option();
    const nextView = dateUtils.getViewUp(zoomLevel);

    if (!nextView || this._isMinZoomLevel(zoomLevel)) {
      return;
    }

    this.option('zoomLevel', nextView);

    this._renderNavigator();

    this._animateShowView();

    this._moveToClosestAvailableDate();
    this._setViewContoured(this._getNormalizedDate(currentDate));
  }

  _isMinZoomLevel(zoomLevel: CalendarZoomLevel): boolean {
    const min = this._getMinDate();
    const max = this._getMaxDate();
    const { minZoomLevel } = this.option();

    return !!dateUtils.sameView(zoomLevel, min, max) || minZoomLevel === zoomLevel;
  }

  _updateButtonsVisibility(): void {
    this._navigator.toggleButton('next', !isDefined(this._afterView));
    this._navigator.toggleButton('prev', !isDefined(this._beforeView));
  }

  _renderSwipeable(): void {
    if (!this._swipeable) {
      this._swipeable = this._createComponent(this.$element(), Swipeable, {
        onStart: (e) => {
          this._swipeStartHandler(e.event);
        },
        onUpdated: (e) => {
          this._swipeUpdateHandler(e.event);
        },
        onEnd: (e) => {
          this._swipeEndHandler(e.event);
        },
        itemSizeFunc: this._viewWidth.bind(this),
      });
    }
  }

  _swipeStartHandler(event: SwipeStartEvent): void {
    fx.stop(this._$viewsWrapper.get(0), true);
    const { viewsCount } = this.option();

    this._toggleGestureCoverCursor('grabbing');

    event.maxLeftOffset = this._getRequiredView('next') ? 1 / viewsCount : 0;
    event.maxRightOffset = this._getRequiredView('prev') ? 1 / viewsCount : 0;
  }

  _toggleGestureCoverCursor(cursor: string): void {
    $(`.${GESTURE_COVER_CLASS}`).css('cursor', cursor);
  }

  _getRequiredView(
    name: string,
  ): MonthView | YearView | DecadeView | CenturyView | undefined | null {
    const { rtlEnabled } = this.option();

    if (name === 'prev') {
      return rtlEnabled ? this._afterView : this._beforeView;
    }
    return rtlEnabled ? this._beforeView : this._afterView;
  }

  _swipeUpdateHandler(event: SwipeUpdateEvent): void {
    const { offset } = event;

    move(this._$viewsWrapper, { left: offset * this._viewWidth(), top: 0 });
    this._updateNavigatorCaption(offset);
  }

  _swipeEndHandler(event: SwipeEndEvent): void {
    this._toggleGestureCoverCursor('auto');

    const { currentDate, rtlEnabled } = this.option();
    const { targetOffset } = event;
    const moveOffset = !targetOffset ? 0 : targetOffset / Math.abs(targetOffset);

    const isAdditionalViewActive = this._isAdditionalViewDate(currentDate);
    const shouldDoubleOffset = isAdditionalViewActive
      && (rtlEnabled ? moveOffset === -1 : moveOffset === 1);

    if (moveOffset === 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._animateWrapper(0, ANIMATION_DURATION_SHOW_VIEW);
      return;
    }

    const offset = -moveOffset * this._getRtlCorrection() * (shouldDoubleOffset ? 2 : 1);
    let date = this._getDateByOffset(offset);

    if (this._isDateInInvalidRange(date)) {
      if (moveOffset >= 0) {
        date = new Date(this._getMinDate());
      } else {
        date = new Date(this._getMaxDate());
      }
    }
    this.option('currentDate', date);
  }

  _viewWidth(): number {
    if (!this._viewWidthValue) {
      const { viewsCount } = this.option();

      this._viewWidthValue = getWidth(this.$element()) / viewsCount;
    }

    return this._viewWidthValue;
  }

  _updateNavigatorCaption(initialOffset: number): void {
    const offset = initialOffset * this._getRtlCorrection();
    const { viewsCount } = this.option();

    const isMultiView = viewsCount > 1;

    let view: MonthView | YearView | DecadeView | CenturyView | null = null;
    let additionalView: MonthView | YearView | DecadeView | CenturyView | null = null;

    if (offset > 0.5 && this._beforeView) {
      view = this._beforeView;
      if (isMultiView) {
        additionalView = this._view;
      }
    } else if (offset < -0.5 && this._afterView) {
      view = isMultiView ? this._additionalView : this._afterView;
      additionalView = isMultiView ? this._afterView : null;
    } else {
      view = this._view;
      additionalView = isMultiView ? this._additionalView : null;
    }

    this._navigator.option('text', this._getViewsCaption(view, additionalView));
  }

  _getViewsCaption(
    view: MonthView | YearView | DecadeView | CenturyView,
    additionalView: MonthView | YearView | DecadeView | CenturyView | null,
  ): string {
    let caption = view.getNavigatorCaption();
    const { viewsCount } = this.option();

    if (viewsCount > 1 && additionalView) {
      const additionalViewCaption = additionalView.getNavigatorCaption();
      caption = `${caption} - ${additionalViewCaption}`;
    }

    return caption;
  }

  _isDateInInvalidRange(date: Date): boolean {
    if (this._view.isBoundary(date)) {
      return false;
    }

    const min = this._getMinDate();
    const max = this._getMaxDate();
    const normalizedDate = dateUtils.normalizeDate(date, min, max);

    return normalizedDate === min || normalizedDate === max;
  }

  _renderFooter(): void {
    const { showTodayButton, todayButtonText: text } = this.option();

    if (showTodayButton) {
      const $todayButton = this._createComponent(
        $('<div>'),
        Button,
        {
          focusStateEnabled: this.option('focusStateEnabled'),
          text,
          onClick: (args) => {
            this._toTodayView(args);
          },
          type: isFluent(current()) ? 'normal' : 'default',
          stylingMode: isFluent(current()) ? 'outlined' : 'text',
          integrationOptions: {},
        },
      ).$element()
        .addClass(CALENDAR_TODAY_BUTTON_CLASS);

      this._$footer = $('<div>')
        .addClass(CALENDAR_FOOTER_CLASS)
        .append($todayButton);

      this.$element().append(this._$footer);
    }

    this.$element().toggleClass(CALENDAR_HAS_FOOTER_CLASS, showTodayButton);
  }

  _renderSubmitElement(): void {
    this._$submitElement = $('<input>')
      .attr('type', 'hidden')
      .appendTo(this.$element());

    const { value } = this.option();

    this._setSubmitValue(value);
  }

  _setSubmitValue(value: DateLike | DateLike[] | undefined): void {
    if (this._isArrayValue('value', value)) {
      return;
    }

    const dateValue = this._convertToDate(value);
    this._getSubmitElement()
      .val(dateSerialization.serializeDate(dateValue, CALENDAR_INPUT_STANDARD_PATTERN));
  }

  _getSubmitElement(): dxElementWrapper {
    return this._$submitElement;
  }

  _animateShowView(): void {
    fx.stop(this._view.$element().get(0), true);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popAnimationView(
      this._view,
      POP_ANIMATION_FROM,
      POP_ANIMATION_TO,
      ANIMATION_DURATION_SHOW_VIEW,
    );

    const { viewsCount } = this.option();

    if (viewsCount > 1) {
      fx.stop(this._additionalView.$element().get(0), true);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._popAnimationView(
        this._additionalView,
        POP_ANIMATION_FROM,
        POP_ANIMATION_TO,
        ANIMATION_DURATION_SHOW_VIEW,
      );
    }
  }

  _popAnimationView(
    view: MonthView | YearView | DecadeView | CenturyView,
    from: number,
    to: number,
    duration: number,
  ): Promise<unknown> {
    return fx.animate(view.$element().get(0), {
      type: 'pop',
      from: {
        scale: from,
        opacity: from,
      },
      to: {
        scale: to,
        opacity: to,
      },
      duration,
    });
  }

  _navigate(offset: number, value: Date): void {
    if (offset !== 0 && Math.abs(offset) !== 1 && this._isViewAvailable(value)) {
      const newView = this._renderSpecificView(value);

      if (offset > 0) {
        this._afterView?.$element().remove();
        this._afterView = newView;
      } else {
        this._beforeView?.$element().remove();
        this._beforeView = newView;
      }

      this._translateViews();
    }

    const rtlCorrection = this._getRtlCorrection();
    const offsetSign = sign(offset);
    const endPosition = -rtlCorrection * offsetSign * this._viewWidth();
    // @ts-expect-error ts-error
    const viewsWrapperPosition = this._$viewsWrapper.position().left;

    if (viewsWrapperPosition !== endPosition) {
      if (this._preventViewChangeAnimation) {
        this._wrapperAnimationEndHandler(offset, value);
      } else {
        this._animateWrapper(endPosition, ANIMATION_DURATION_SHOW_VIEW)
          // @ts-expect-error ts-error
          .done(this._wrapperAnimationEndHandler.bind(this, offset, value));
      }
    }
  }

  _animateWrapper(to: number, duration: number): Promise<void> {
    return fx.animate(this._$viewsWrapper.get(0), {
      type: 'slide',
      // @ts-expect-error ts-error
      from: { left: this._$viewsWrapper.position().left },
      to: { left: to },
      duration,
    });
  }

  _getDate(value: Date | number | string): Date {
    return new Date(value);
  }

  _toTodayView(args: DxEvent<ClickEvent>): void {
    const today = new Date();

    if (this._isMaxZoomLevel()) {
      // @ts-expect-error ts-error
      this._selectionStrategy.selectValue(today, args.event);
      return;
    }

    this._preventViewChangeAnimation = true;

    this.option('zoomLevel', this.option('maxZoomLevel'));
    // @ts-expect-error
    this._selectionStrategy.selectValue(today, args.event);

    this._animateShowView();

    this._preventViewChangeAnimation = false;
  }

  _wrapperAnimationEndHandler(offset: number, newDate: Date): void {
    this._rearrangeViews(offset);
    this._translateViews();
    this._resetLocation();
    this._renderNavigator();
    this._setViewContoured(newDate);
    this._updateAriaId(newDate);
    this._selectionStrategy.updateAriaSelected();
  }

  _rearrangeViews(offset: number): void {
    if (offset === 0) {
      return;
    }

    const { viewsCount } = this.option();
    let viewOffset = -1;
    let viewToCreateKey = '_afterView';
    let viewToRemoveKey = '_beforeView';
    let viewBeforeCreateKey = viewsCount === 1 ? '_view' : '_additionalView';
    let viewAfterRemoveKey = '_view';

    if (offset < 0) {
      viewOffset = 1;
      viewToCreateKey = '_beforeView';
      viewToRemoveKey = '_afterView';
      viewBeforeCreateKey = '_view';
      viewAfterRemoveKey = viewsCount === 1 ? '_view' : '_additionalView';
    }

    if (!this[viewToCreateKey]) {
      return;
    }

    const destinationDate = this[viewToCreateKey].option('date');

    this[viewToRemoveKey]?.$element().remove();
    this[viewToRemoveKey] = this._renderSpecificView(
      this._getDateByOffset(viewOffset * viewsCount, destinationDate),
    );
    this[viewAfterRemoveKey].$element().remove();

    if (viewsCount === 1) {
      this[viewAfterRemoveKey] = this[viewToCreateKey];
    } else {
      this[viewAfterRemoveKey] = this[viewBeforeCreateKey];
      this[viewBeforeCreateKey] = this[viewToCreateKey];
    }

    const dateByOffset = this._getDateByOffset(-viewOffset, destinationDate);
    this[viewToCreateKey] = this._isViewAvailable(dateByOffset)
      ? this._renderSpecificView(dateByOffset)
      : null;
  }

  _resetLocation(): void {
    move(this._$viewsWrapper, { left: 0, top: 0 });
  }

  _clean(): void {
    super._clean();
    this._clearViewWidthCache();
    // @ts-expect-error ts-error
    delete this._$viewsWrapper;
    // @ts-expect-error ts-error
    delete this._navigator;
    delete this._$footer;
  }

  _clearViewWidthCache(): void {
    delete this._viewWidthValue;
  }

  _disposeViews(): void {
    this._view.$element().remove();
    this._beforeView?.$element().remove();
    this._additionalView?.$element().remove();
    this._afterView?.$element().remove();
    // @ts-expect-error ts-error
    delete this._view;
    // @ts-expect-error ts-error
    delete this._additionalView;
    delete this._beforeView;
    delete this._afterView;
    delete this._skipNavigate;
  }

  _dispose(): void {
    clearTimeout(this._waitRenderViewTimeout);
    super._dispose();
  }

  _refreshViews(): void {
    this._resetActiveState();
    this._disposeViews();
    this._renderViews();
  }

  _visibilityChanged(): void {
    this._translateViews();
  }

  _shouldSkipFocusEvent(event: DxEvent<FocusEvent>): boolean {
    const { target, relatedTarget } = event;

    return Boolean($(target).parents(`.${CALENDAR_CLASS}`).length)
      && Boolean($(relatedTarget as Element).parents(`.${CALENDAR_CLASS}`).length);
  }

  _focusInHandler(event: DxEvent<FocusEvent>): void {
    if ($(event.target).is(this._$viewsWrapper)) {
      const { currentDate = new Date() } = this.option();
      this._setViewContoured(currentDate);
    }

    if (this._shouldSkipFocusEvent(event)) {
      return;
    }

    super._focusInHandler.apply(this, [event]);
    this._toggleFocusClass(true, this.$element());
  }

  _focusOutHandler(event: DxEvent<FocusEvent>): void {
    if ($(event.target).is(this._$viewsWrapper)) {
      this._view.option('contouredDate', null);
      this._additionalView?.option('contouredDate', null);
    }

    if (this._shouldSkipFocusEvent(event)) {
      return;
    }

    super._focusOutHandler.apply(this, [event]);
    this._toggleFocusClass(false, this.$element());
  }

  _updateViewsOption(optionName: string, newValue: Date | Date[]): void {
    this._view.option(optionName, newValue);
    this._additionalView?.option(optionName, newValue);
    this._beforeView?.option(optionName, newValue);
    this._afterView?.option(optionName, newValue);
  }

  _setViewsMinOption(min: Date): void {
    this._restoreViewsMinMaxOptions();
    this.option('rangeMin', this._convertToDate(min));
    this._updateViewsOption('min', this._getMinDate());
  }

  _setViewsMaxOption(max: Date): void {
    this._restoreViewsMinMaxOptions();
    this.option('rangeMax', this._convertToDate(max));
    this._updateViewsOption('max', this._getMaxDate());
  }

  _restoreViewsMinMaxOptions(): void {
    this._resetActiveState();
    this.option({
      rangeMin: null,
      rangeMax: null,
    });

    this._updateViewsOption('min', this._getMinDate());
    this._updateViewsOption('max', this._getMaxDate());
  }

  _updateNavigatorLabels(): void {
    const { zoomLevel = ZOOM_LEVEL.MONTH } = this.option();
    const capitalizedZoomLevel = zoomLevel.charAt(0).toUpperCase() + zoomLevel.slice(1);

    const captionButtonText = this._navigator._caption.option('text');
    const localizedPrevButtonLabel = messageLocalization.format(`dxCalendar-previous${capitalizedZoomLevel}ButtonLabel`);
    const localizedCaptionLabel = messageLocalization.format(`dxCalendar-caption${capitalizedZoomLevel}Label`);
    const localizedNextButtonLabel = messageLocalization.format(`dxCalendar-next${capitalizedZoomLevel}ButtonLabel`);

    this.setAria('label', localizedPrevButtonLabel, this._navigator._prevButton.$element());
    this.setAria('label', `${captionButtonText}. ${localizedCaptionLabel}`, this._navigator._caption.$element());
    this.setAria('label', localizedNextButtonLabel, this._navigator._nextButton.$element());
  }

  _updateAriaSelected(
    value: (Date | null)[] | null,
    previousValue: (Date | null)[] | null,
  ): void {
    previousValue?.forEach((item) => {
      if (!item) {
        return;
      }
      this.setAria('selected', false, this._view._getCellByDate(item));
    });

    value?.forEach((item) => {
      if (!item) {
        return;
      }
      this.setAria('selected', true, this._view._getCellByDate(item));
    });

    const { viewsCount } = this.option();

    if (viewsCount > 1) {
      previousValue?.forEach((item) => {
        if (!item) {
          return;
        }
        this.setAria('selected', false, this._additionalView._getCellByDate(item));
      });

      value?.forEach((item) => {
        if (!item) {
          return;
        }
        this.setAria('selected', true, this._additionalView._getCellByDate(item));
      });
    }
  }

  _updateAriaId(value?: Date): void {
    const { currentDate = new Date() } = this.option();
    const date = value ?? currentDate;

    const ariaId = `dx-${new Guid()}`;
    const view = this._getActiveView(date);
    const $newCell = view._getCellByDate(date);

    this.setAria('id', ariaId, $newCell);
    this.setAria('activedescendant', ariaId);

    this._onContouredChanged?.(ariaId);
  }

  _suppressingNavigation(callback: (date: Date) => void, args: [Date]): void {
    this._suppressNavigation = true;
    callback.apply(this, args);
    delete this._suppressNavigation;
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'width':
        super._optionChanged(args);
        this._clearViewWidthCache();
        break;
      case 'min':
      case 'max':
      {
        this.min = undefined;
        this.max = undefined;
        const { currentDate = new Date() } = this.option();
        this._suppressingNavigation(this._updateCurrentDate, [currentDate]);
        this._refreshViews();
        this._renderNavigator();
        break;
      }
      case 'selectionMode':
        this._refreshSelectionStrategy();
        this._initCurrentDate();
        break;
      case 'selectWeekOnClick':
        this._refreshViews();
        break;
      case 'firstDayOfWeek':
        this._refreshViews();
        this._updateButtonsVisibility();
        break;
      case 'focusStateEnabled':
        this._invalidate();
        break;
      case 'currentDate':
        this.setAria('id', undefined, this._view._getCellByDate(previousValue as Date));
        this._updateCurrentDate(value as Date);
        break;
      case 'zoomLevel':
        this.$element().removeClass(`${CALENDAR_VIEW_CLASS}-${previousValue}`);
        this._correctZoomLevel();
        this._refreshViews();
        this._renderNavigator();
        this._updateAriaId();
        this._updateNavigatorLabels();
        break;
      case 'minZoomLevel':
      case 'maxZoomLevel':
        this._correctZoomLevel();
        this._updateButtonsVisibility();
        break;
      case 'value': {
        // @ts-expect-error ts-error
        const isSameValue = dateUtils.sameDatesArrays(value, previousValue);

        if (!isSameValue) {
          this._selectionStrategy.processValueChanged(
            value as (Date | null)[],
            previousValue as (Date | null)[],
          );
        }
        this._setSubmitValue(value as DateLike | DateLike[] | undefined);
        super._optionChanged(args);
        break;
      }
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
      case 'todayButtonText':
        this._invalidate();
        break;
      case 'readOnly':
        super._optionChanged(args);
        this._updateAriaLabelAndRole();
        break;
      case 'skipFocusCheck':
        break;
      case '_todayDate':
      case 'showWeekNumbers':
      case 'weekNumberRule':
        this._refreshViews();
        break;
      default:
        super._optionChanged(args);
    }
  }

  getContouredDate(): Date | undefined {
    const { contouredDate } = this._view.option();

    return contouredDate;
  }
}

registerComponent('dxCalendar', Calendar);

export default Calendar;
