import type { DateLike } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { extend } from '@js/core/utils/extend';
import { isFunction } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { ValueChangedEvent } from '@js/ui/calendar';
import type Calendar from '@ts/ui/calendar/calendar';
import CalendarStrategy from '@ts/ui/date_box/date_box.strategy.calendar';
import { getDeserializedDate, isSameDateArrays, isSameDates } from '@ts/ui/date_range_box/date_range.utils';
import type DateRangeBox from '@ts/ui/date_range_box/date_range_box';
import type { MultiselectDateBoxProperties } from '@ts/ui/date_range_box/multiselect_date_box';
import type MultiselectDateBox from '@ts/ui/date_range_box/multiselect_date_box';
import type { PopupProperties } from '@ts/ui/popup/popup';
import type Popup from '@ts/ui/popup/popup';

interface RangeValueChangedEvent extends Omit<ValueChangedEvent, 'value' | 'previousValue'> {
  value: (DateLike | undefined)[];
  previousValue: (DateLike | undefined)[];
}

class RangeCalendarStrategy extends CalendarStrategy<(DateLike | undefined)[], DateRangeBox> {
  dateBox!: MultiselectDateBox;

  private readonly dateRangeBox: DateRangeBox;

  private _shouldPreventFocusChange?: boolean;

  private _dateSelectedCounter = 0;

  public _widget!: Calendar;

  constructor(dateBox: MultiselectDateBox) {
    super(dateBox);
    this.dateBox = dateBox;

    const multiselectDateBoxOptions = dateBox.option() as MultiselectDateBoxProperties;
    this.dateRangeBox = multiselectDateBoxOptions._dateRangeBoxInstance as DateRangeBox;
  }

  popupConfig(popupConfig: PopupProperties): PopupProperties {
    return extend(true, super.popupConfig(popupConfig), {
      position: { of: this.getDateRangeBox().$element() },
    }) as PopupProperties;
  }

  popupShowingHandler(): void {
    this.getWidget()._restoreViewsMinMaxOptions();
    this._dateSelectedCounter = 0;
  }

  _getPopup(): Popup {
    return super._getPopup() || this.getDateRangeBox().getStartDateBox()._popup;
  }

  supportedKeys(): Record<string, (e: DxEvent<KeyboardEvent>) => boolean | undefined> {
    const dateRangeBox = this.getDateRangeBox();

    return {
      ...super.supportedKeys(),
      rightArrow: (): boolean | undefined => {
        if (dateRangeBox.option('opened')) {
          return true;
        }

        return undefined;
      },
      leftArrow: (): boolean | undefined => {
        if (dateRangeBox.option('opened')) {
          return true;
        }

        return undefined;
      },
      enter: (e: DxEvent<KeyboardEvent>): boolean | undefined => {
        if (dateRangeBox.option('opened')) {
          const dateBoxValue = this.dateBox.getDateOption('value');
          this.dateBox._valueChangeEventHandler(e);
          const newDateBoxValue = this.dateBox.getDateOption('value');
          const dateBoxValueChanged = !isSameDates(dateBoxValue, newDateBoxValue);

          if (dateBoxValueChanged) {
            dateRangeBox.getStartDateBox().getStrategy().getWidget().option('value', dateRangeBox.option('value'));
          } else {
            dateRangeBox.getStartDateBox().getStrategy().getWidget()._enterKeyHandler(e);
          }

          return false;
        }

        return undefined;
      },
      tab: (e: DxEvent<KeyboardEvent>): boolean | undefined => {
        if (!dateRangeBox.option('opened')) {
          return undefined;
        }

        if (!this._getPopup().getFocusableElements().length) {
          if ((!e.shiftKey && dateRangeBox._isEndDateActiveElement())
            || (e.shiftKey && dateRangeBox._isStartDateActiveElement())) {
            dateRangeBox.close();
          }
          return undefined;
        }

        if ((!e.shiftKey && dateRangeBox._isStartDateActiveElement())
          || (e.shiftKey && dateRangeBox._isEndDateActiveElement())) {
          return undefined;
        }

        const $focusableElement = e.shiftKey
          ? dateRangeBox.getStartDateBox()._getLastPopupElement()
          : dateRangeBox.getStartDateBox()._getFirstPopupElement();

        if ($focusableElement) {
          // @ts-expect-error the trigger method is not declared on EventsEngineType
          eventsEngine.trigger($focusableElement, 'focus');
          // @ts-expect-error the select method is not declared on dxElementWrapper
          $focusableElement.select();
        }

        e.preventDefault();
        return undefined;
      },
    };
  }

  _getWidgetOptions(): Record<string, unknown> {
    const { disabledDates: disabledDatesValue, value, multiView } = this.dateRangeBox.option();

    const disabledDates = isFunction(disabledDatesValue)
      ? this._injectComponent(disabledDatesValue)
      : disabledDatesValue ?? undefined;

    return extend(super._getWidgetOptions(), {
      disabledDates,
      value,
      selectionMode: 'range',
      viewsCount: multiView ? 2 : 1,
      allowChangeSelectionOrder: true,
      currentSelection: this.getCurrentSelection(),
    }) as Record<string, unknown>;
  }

  _refreshActiveDescendant(e: DxEvent & { actionValue: string }): void {
    this.getDateRangeBox().setAria('activedescendant', e.actionValue);
  }

  _getInjectedComponent(): DateRangeBox {
    return this.getDateRangeBox();
  }

  getKeyboardListener(): Calendar {
    const dateRangeBox = this.getDateRangeBox();

    return dateRangeBox.getStartDateBox()
      ? dateRangeBox.getStartDateBox().getStrategy().getWidget()
      : this.getWidget();
  }

  getValue(): (DateLike | undefined)[] {
    const { value } = this.getWidget().option();

    return value as (DateLike | undefined)[];
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
    const { applyValueMode } = this.getDateRangeBox().option();

    return applyValueMode === 'instantly';
  }

  _getDateSelectedCounter(
    currentSelection: 'startDate' | 'endDate' | undefined,
    value: RangeValueChangedEvent['value'],
  ): number {
    if (currentSelection === 'startDate') {
      return 0;
    }

    if (!value[0]) {
      return -1;
    }

    return 1;
  }

  _valueChangedHandler({ value, previousValue, event }: RangeValueChangedEvent): void {
    if (isSameDateArrays(value, previousValue) && !this.getWidget()._valueSelected) {
      this._shouldPreventFocusChange = false;
      return;
    }

    this.getWidget()._valueSelected = false;

    const dateRangeBox = this.getDateRangeBox();

    if (this._isInstantlyMode()) {
      if (!dateRangeBox.option('disableOutOfRangeSelection')) {
        const currentSelection = this._getCalendarCurrentSelection();

        this._dateSelectedCounter = this._getDateSelectedCounter(currentSelection, value);

        if (currentSelection !== 'startDate'
          && value[0]
          && getDeserializedDate(value[0]) > getDeserializedDate(value[1])) {
          dateRangeBox.updateValue([value[0], null], event);
          return;
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
    // @ts-expect-error the trigger method should support HTMLElement
    eventsEngine.trigger(targetDateBox.field(), 'dxclick');
  }

  getCurrentSelection(): 'startDate' | 'endDate' {
    const { currentSelection } = this.getDateRangeBox().option();

    return currentSelection;
  }

  _getCalendarCurrentSelection(): 'startDate' | 'endDate' | undefined {
    const { currentSelection } = this.getWidget().option();

    return currentSelection;
  }

  _closeDropDownByEnter(): boolean {
    if (this._getCalendarCurrentSelection() === 'startDate') {
      return false;
    }
    return true;
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
