import eventsEngine from '@js/common/core/events/core/events_engine';
import { extend } from '@js/core/utils/extend';
import { isFunction } from '@js/core/utils/type';
import type Calendar from '@js/ui/calendar';
import type DateBox from '@js/ui/date_box';

import CalendarStrategy from '../../date_box/m_date_box.strategy.calendar';
import { getDeserializedDate, isSameDateArrays, isSameDates } from '../m_date_range.utils';
import type DateRangeBox from '../m_date_range_box';
import type MultiselectDateBox from '../m_multiselect_date_box';

class RangeCalendarStrategy extends CalendarStrategy {
  private dateBox: DateBox;

  private readonly dateRangeBox: DateRangeBox;

  private _shouldPreventFocusChange?: boolean;

  private _dateSelectedCounter = 0;

  public _widget!: Calendar;

  constructor(dateBox: MultiselectDateBox) {
    super();
    this.dateBox = dateBox;
    this.dateRangeBox = dateBox.option('_dateRangeBoxInstance');
  }

  popupConfig(popupConfig) {
    return extend(true, super.popupConfig(popupConfig), {
      position: { of: this.getDateRangeBox().$element() },
    });
  }

  popupShowingHandler(): void {
    // @ts-expect-error
    this.getWidget()._restoreViewsMinMaxOptions();
    this._dateSelectedCounter = 0;
  }

  _getPopup() {
    // @ts-expect-error
    return super._getPopup() || this.getDateRangeBox().getStartDateBox()._popup;
  }

  supportedKeys() {
    const dateRangeBox = this.getDateRangeBox();

    return {
      ...super.supportedKeys(),
      rightArrow: () => {
        if (dateRangeBox.option('opened')) {
          return true;
        }

        return undefined;
      },
      leftArrow: () => {
        if (dateRangeBox.option('opened')) {
          return true;
        }

        return undefined;
      },
      enter: (e) => {
        if (dateRangeBox.option('opened')) {
          // @ts-expect-error
          const dateBoxValue = this.dateBox.dateOption('value');
          // @ts-expect-error
          this.dateBox._valueChangeEventHandler(e);
          // @ts-expect-error
          const newDateBoxValue = this.dateBox.dateOption('value');
          const dateBoxValueChanged = !isSameDates(dateBoxValue, newDateBoxValue);

          if (dateBoxValueChanged) {
            dateRangeBox.getStartDateBox().getStrategy().getWidget().option('value', dateRangeBox.option('value'));
          } else {
            // @ts-expect-error
            dateRangeBox.getStartDateBox().getStrategy().getWidget()._enterKeyHandler(e);
          }

          return false;
        }

        return undefined;
      },
      tab: (e) => {
        if (!dateRangeBox.option('opened')) {
          return;
        }

        if (!this._getPopup().getFocusableElements().length) {
          if ((!e.shiftKey && dateRangeBox._isEndDateActiveElement())
            || (e.shiftKey && dateRangeBox._isStartDateActiveElement())) {
            dateRangeBox.close();
          }
          return;
        }

        if ((!e.shiftKey && dateRangeBox._isStartDateActiveElement())
          || (e.shiftKey && dateRangeBox._isEndDateActiveElement())) {
          return;
        }

        const $focusableElement = e.shiftKey
        // @ts-expect-error
          ? dateRangeBox.getStartDateBox()._getLastPopupElement()
        // @ts-expect-error
          : dateRangeBox.getStartDateBox()._getFirstPopupElement();

        if ($focusableElement) {
          // @ts-expect-error
          eventsEngine.trigger($focusableElement, 'focus');
          $focusableElement.select();
        }

        e.preventDefault();
      },
    };
  }

  _getWidgetOptions() {
    // @ts-expect-error
    const { disabledDates: disabledDatesValue, value, multiView } = this.dateRangeBox.option();

    const disabledDates = isFunction(disabledDatesValue)
      ? this._injectComponent(disabledDatesValue)
      : disabledDatesValue ?? undefined;

    return extend(super._getWidgetOptions(), {
      disabledDates,
      value,
      selectionMode: 'range',
      viewsCount: multiView ? 2 : 1,
      _allowChangeSelectionOrder: true,
      _currentSelection: this.getCurrentSelection(),
    });
  }

  _refreshActiveDescendant(e): void {
    // @ts-expect-error
    this.getDateRangeBox().setAria('activedescendant', e.actionValue);
  }

  _injectComponent(func) {
    return (params) => func(extend(params, { component: this.getDateRangeBox() }));
  }

  getKeyboardListener(): Calendar {
    const dateRangeBox = this.getDateRangeBox();

    return dateRangeBox.getStartDateBox()
      ? dateRangeBox.getStartDateBox().getStrategy().getWidget()
      : this.getWidget();
  }

  getValue() {
    return this.getWidget().option('value');
  }

  _updateValue(): void {
    const { value } = this.getDateRangeBox().option();

    if (!this.getWidget()) {
      return;
    }

    this._shouldPreventFocusChange = true;
    this.getWidget().option('value', value);
  }

  _isInstantlyMode(): boolean {
    return this.getDateRangeBox().option('applyValueMode') === 'instantly';
  }

  _valueChangedHandler({ value, previousValue, event }) {
    // @ts-expect-error
    if (isSameDateArrays(value, previousValue) && !this.getWidget()._valueSelected) {
      this._shouldPreventFocusChange = false;
      return;
    }

    // @ts-expect-error
    this.getWidget()._valueSelected = false;

    const dateRangeBox = this.getDateRangeBox();

    if (this._isInstantlyMode()) {
      if (!dateRangeBox.option('disableOutOfRangeSelection')) {
        if (this._getCalendarCurrentSelection() === 'startDate') {
          this._dateSelectedCounter = 0;
        } else {
          this._dateSelectedCounter = 1;

          if (!value[0]) {
            this._dateSelectedCounter = -1;
          } else if (getDeserializedDate(value[0]) > getDeserializedDate(value[1])) {
            dateRangeBox.updateValue([value[0], null], event);
            return;
          }
        }
      }

      dateRangeBox.updateValue(value, event);
      this._dateSelectedCounter += 1;

      if (this._dateSelectedCounter === 2) {
        dateRangeBox.close();

        return;
      }
    } else if (this._getCalendarCurrentSelection() === 'endDate') {
      if (value[0] && getDeserializedDate(value[0]) > getDeserializedDate(value[1])) {
        return;
      }
    }

    if (!this._shouldPreventFocusChange) {
      this._moveFocusToNextInput();
    }

    this._shouldPreventFocusChange = false;
  }

  _moveFocusToNextInput(): void {
    const targetDateBox = this._getCalendarCurrentSelection() === 'startDate'
      ? this.getDateRangeBox().getEndDateBox()
      : this.getDateRangeBox().getStartDateBox();

    targetDateBox.focus();
    // @ts-expect-error
    eventsEngine.trigger(targetDateBox.field(), 'dxclick');
  }

  getCurrentSelection() {
    return this.getDateRangeBox().option('_currentSelection');
  }

  _getCalendarCurrentSelection() {
    return this.getWidget().option('_currentSelection');
  }

  _closeDropDownByEnter(): boolean {
    if (this._getCalendarCurrentSelection() === 'startDate') {
      return false;
    }
    return true;
  }

  dateBoxValue() {
    const { dateBox } = this;

    if (arguments.length) {
      // @ts-expect-error
      return dateBox.dateValue.apply(dateBox, arguments);
    }
    // @ts-expect-error
    return dateBox.dateOption.apply(dateBox, ['value']);
  }

  _cellClickHandler(): void { }

  setActiveStartDateBox(): void {
    this.dateBox = this.getDateRangeBox().getStartDateBox();
  }

  setActiveEndDateBox(): void {
    this.dateBox = this.getDateRangeBox().getEndDateBox();
  }

  getDateRangeBox(): DateRangeBox {
    return this.dateRangeBox;
  }

  getWidget(): Calendar {
    return this._widget;
  }
}

export default RangeCalendarStrategy;
