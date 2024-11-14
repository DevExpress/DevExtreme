// eslint-disable-next-line max-classes-per-file
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import { getWidth } from '@js/core/utils/size';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { DateBoxBase, Properties } from '@js/ui/date_box';
import DateBox from '@js/ui/date_box';
import type Popup from '@js/ui/popup';

import { getDeserializedDate, monthDifference } from './m_date_range.utils';
import type DateRangeBox from './m_date_range_box';
import RangeCalendarStrategy from './strategy/m_rangeCalendar';

const START_DATEBOX_CLASS = 'dx-start-datebox';

export interface MultiselectDateBoxProperties extends Properties {
  _dateRangeBoxInstance: DateRangeBox;
  _showValidationMessage?: boolean;
}

declare class ExtendedDateBox extends DateBoxBase<MultiselectDateBoxProperties> {
  reset(value?: Date | number | string | null): void;
}

const TypedDateBox: typeof ExtendedDateBox = DateBox as any;

class MultiselectDateBox extends TypedDateBox {
  // Temporary solution. Move to component level
  public NAME!: string;

  private _skipIsValidOptionChange?: boolean;

  private _strategy!: RangeCalendarStrategy;

  private readonly _popup?: Popup;

  private readonly _label: any;

  _initStrategy(): void {
    this._strategy = new RangeCalendarStrategy(this);
  }

  _initMarkup(): void {
    // @ts-expect-error
    super._initMarkup();

    this._renderInputClickEvent();
  }

  _renderInputClickEvent(): void {
    const clickEventName = addNamespace('dxclick', this.NAME);
    // @ts-expect-error
    eventsEngine.off(this._input(), clickEventName);
    // @ts-expect-error
    eventsEngine.on(this._input(), clickEventName, (e) => {
      this._processValueChange(e);
    });
  }

  _applyButtonHandler({ event }): void {
    const strategy = this.getStrategy();
    const value = strategy.getValue();

    strategy.getDateRangeBox().updateValue(value, event);

    this.close();
    this.option('focusStateEnabled') && this.focus();
  }

  _openHandler(e): void {
    if (this.getStrategy().getDateRangeBox().option('opened')) {
      return;
    }

    // @ts-expect-error
    super._openHandler(e);
  }

  _renderOpenedState() {
    const { opened } = this.option();

    this._getDateRangeBox().option('opened', opened);

    if (this._isStartDateBox()) {
      if (opened) {
        // @ts-expect-error
        this._createPopup();
      }

      // @ts-expect-error
      this._getDateRangeBox()._popupContentIdentifier(this._getControlsAria());

      // @ts-expect-error
      this._setPopupOption('visible', opened);

      this._getDateRangeBox()._setAriaAttributes();
    }
  }

  _getDateRangeBox(): DateRangeBox {
    return this.getStrategy().getDateRangeBox();
  }

  _isStartDateBox(): boolean {
    return $(this.element()).hasClass(START_DATEBOX_CLASS);
  }

  _renderPopup(): void {
    // @ts-expect-error
    super._renderPopup();

    if (this._isStartDateBox()) {
      // @ts-expect-error
      this._getDateRangeBox()._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
    }
  }

  _popupShownHandler(): void {
    // @ts-expect-error
    super._popupShownHandler();
    // @ts-expect-error
    this._getDateRangeBox()._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
  }

  _popupHiddenHandler(): void {
    // @ts-expect-error
    super._popupHiddenHandler();

    // @ts-expect-error
    this._getDateRangeBox()._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
  }

  _focusInHandler(e) {
    // @ts-expect-error
    super._focusInHandler(e);
    this._processValueChange(e);
  }

  _popupTabHandler(e): void {
    const $element = $(e.target);

    // @ts-expect-error
    if (e.shiftKey && $element.is(this._getFirstPopupElement())) {
      this._getDateRangeBox().getEndDateBox().focus();
      e.preventDefault();
    }

    // @ts-expect-error
    if (!e.shiftKey && $element.is(this._getLastPopupElement())) {
      this._getDateRangeBox().getStartDateBox().focus();
      e.preventDefault();
    }
  }

  _processValueChange(e): void {
    const { target } = e;
    const dateRangeBox = this._getDateRangeBox();
    const [startDateInput, endDateInput] = dateRangeBox.field();
    if ($(target).is($(startDateInput))) {
      dateRangeBox.option('_currentSelection', 'startDate');
    }
    if ($(target).is($(endDateInput))) {
      dateRangeBox.option('_currentSelection', 'endDate');
    }

    if (!dateRangeBox.getStartDateBox().getStrategy().getWidget()) {
      return;
    }

    const calendar = dateRangeBox.getStartDateBox().getStrategy().getWidget();
    const { value } = calendar.option();
    const startDate = getDeserializedDate(value?.[0]);
    const endDate = getDeserializedDate(value?.[1]);

    if ($(target).is($(startDateInput))) {
      if (startDate) {
        // @ts-expect-error
        calendar._skipNavigate = true;
        calendar.option('currentDate', startDate);
      }
      this.getStrategy().setActiveStartDateBox();
      calendar.option('_currentSelection', 'startDate');

      if (dateRangeBox.option('disableOutOfRangeSelection')) {
        // @ts-expect-error
        calendar._setViewsMaxOption(endDate);
      }
    }

    if ($(target).is($(endDateInput))) {
      if (endDate) {
        if (startDate && monthDifference(startDate, endDate) > 1) {
          // @ts-expect-error
          calendar.option('currentDate', calendar._getDateByOffset(null, endDate));
          // @ts-expect-error
          calendar.option('currentDate', calendar._getDateByOffset(-1, endDate));
        }

        // @ts-expect-error
        calendar._skipNavigate = true;
        calendar.option('currentDate', endDate);
      }
      dateRangeBox.getStartDateBox().getStrategy().setActiveEndDateBox();
      calendar.option('_currentSelection', 'endDate');

      if (dateRangeBox.option('disableOutOfRangeSelection')) {
        // @ts-expect-error
        calendar._setViewsMinOption(startDate);
      }
    }
  }

  _invalidate(): void {
    super._invalidate();

    // @ts-expect-error
    this._refreshStrategy();
  }

  _updateInternalValidationState(isValid, validationMessage): void {
    this.option({
      isValid,
      validationError: isValid ? null : {
        message: validationMessage,
      },
    });
  }

  _recallInternalValidation(value): void {
    // @ts-expect-error
    this._applyInternalValidation(value);
  }

  _isTargetOutOfComponent(target) {
    const $dateRangeBox = $(this._getDateRangeBox().element());
    const isTargetOutOfDateRangeBox = $(target).closest($dateRangeBox).length === 0;

    // @ts-expect-error
    return super._isTargetOutOfComponent(target) && isTargetOutOfDateRangeBox;
  }

  _updateLabelWidth(): void {
    const $beforeButtonsContainer = this._getDateRangeBox()._$beforeButtonsContainer;
    const { labelMode } = this.option();

    if (labelMode === 'outside' && $beforeButtonsContainer && this._isStartDateBox()) {
      this._label._updateLabelTransform(getWidth($beforeButtonsContainer));
      return;
    }

    // @ts-expect-error
    super._updateLabelWidth();
  }

  _optionChanged(args): void {
    switch (args.name) {
      case 'isValid': {
        const isValid = this._getDateRangeBox().option('isValid');

        if (this._skipIsValidOptionChange || isValid === args.value) {
          // @ts-expect-error
          super._optionChanged(args);
          return;
        }

        this._skipIsValidOptionChange = true;
        this.option({ isValid });
        this._skipIsValidOptionChange = false;
        break;
      }
      default:
        // @ts-expect-error
        super._optionChanged(args);
        break;
    }
  }

  close(): void {
    this.getStrategy().getDateRangeBox().getStartDateBox().option('opened', false);
  }

  getStrategy(): RangeCalendarStrategy {
    return this._strategy;
  }
}

export default MultiselectDateBox;
