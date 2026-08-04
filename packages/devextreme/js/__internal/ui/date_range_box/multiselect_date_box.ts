import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import { getWidth } from '@js/core/utils/size';
import type { DxEvent, InteractionEvent } from '@js/events';
import type { OptionChanged } from '@ts/core/widget/types';
import DateBox from '@ts/ui/date_box/date_box';
import type { DateBoxBaseProperties } from '@ts/ui/date_box/date_box.base';
import type { DateBoxMaskProperties } from '@ts/ui/date_box/date_box.mask';
import { getDeserializedDate, monthDifference } from '@ts/ui/date_range_box/date_range.utils';
import type DateRangeBox from '@ts/ui/date_range_box/date_range_box';
import RangeCalendarStrategy from '@ts/ui/date_range_box/strategy/rangeCalendar';

const START_DATEBOX_CLASS = 'dx-start-datebox';

export interface MultiselectDateBoxProperties extends DateBoxMaskProperties {
  _dateRangeBoxInstance?: DateRangeBox;
}

class MultiselectDateBox extends DateBox {
  // Temporary solution. Move to component level
  public NAME!: string;

  private _skipIsValidOptionChange?: boolean;

  _strategy!: RangeCalendarStrategy;

  _initStrategy(): void {
    this._strategy = new RangeCalendarStrategy(this);
  }

  _initMarkup(): void {
    super._initMarkup();

    this._renderInputClickEvent();
  }

  _renderInputClickEvent(): void {
    const clickEventName = addNamespace('dxclick', this.NAME);

    eventsEngine.off(this._input(), clickEventName);
    eventsEngine.on(this._input(), clickEventName, (e: DxEvent) => {
      this._processValueChange(e);
    });
  }

  _applyButtonHandler({ event }: { event: InteractionEvent }): void {
    const strategy = this.getStrategy();
    const value = strategy.getValue();

    strategy.getDateRangeBox().updateValue(value, event);

    this.close();

    const { focusStateEnabled } = this.option();

    if (focusStateEnabled) {
      this.focus();
    }
  }

  _openHandler(e?: unknown): void {
    if (this.getStrategy().getDateRangeBox().option('opened')) {
      return;
    }

    // @ts-expect-error the base method has no arguments
    super._openHandler(e);
  }

  _renderOpenedState(): void {
    const { opened } = this.option();

    this._getDateRangeBox().option('opened', opened);

    if (this._isStartDateBox()) {
      if (opened) {
        this._createPopup();
      }

      this._getDateRangeBox()._popupContentIdentifier(this._getControlsAria());

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
    super._renderPopup();

    if (this._isStartDateBox()) {
      this._getDateRangeBox()._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
    }
  }

  _popupShownHandler(): void {
    super._popupShownHandler();

    this._getDateRangeBox()._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
  }

  _popupHiddenHandler(): void {
    super._popupHiddenHandler();

    this._getDateRangeBox()._validationMessage?.option('positionSide', this._getValidationMessagePositionSide());
  }

  _focusInHandler(e: DxEvent<FocusEvent>): void {
    super._focusInHandler(e);
    this._processValueChange(e);
  }

  _popupTabHandler(e: DxEvent<KeyboardEvent>): void {
    const $element = $(e.target);

    if (e.shiftKey && $element.is(this._getFirstPopupElement())) {
      this._getDateRangeBox().getEndDateBox().focus();
      e.preventDefault();
    }

    if (!e.shiftKey && $element.is(this._getLastPopupElement())) {
      this._getDateRangeBox().getStartDateBox().focus();
      e.preventDefault();
    }
  }

  _processValueChange(e: DxEvent): void {
    const { target } = e;
    const dateRangeBox = this._getDateRangeBox();
    const [startDateInput, endDateInput] = dateRangeBox.field();

    if ($(target).is($(startDateInput))) {
      dateRangeBox.option('currentSelection', 'startDate');
    }
    if ($(target).is($(endDateInput))) {
      dateRangeBox.option('currentSelection', 'endDate');
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
        calendar._skipNavigate = true;
        calendar.option('currentDate', startDate);
      }
      this.getStrategy().setActiveStartDateBox();
      calendar.option('currentSelection', 'startDate');

      if (dateRangeBox.option('disableOutOfRangeSelection')) {
        calendar._setViewsMaxOption(endDate);
      }
    }

    if ($(target).is($(endDateInput))) {
      if (endDate) {
        if (startDate && monthDifference(startDate, endDate) > 1) {
          calendar.option('currentDate', calendar._getDateByOffset(0, endDate));
          calendar.option('currentDate', calendar._getDateByOffset(-1, endDate));
        }

        calendar._skipNavigate = true;
        calendar.option('currentDate', endDate);
      }
      dateRangeBox.getStartDateBox().getStrategy().setActiveEndDateBox();
      calendar.option('currentSelection', 'endDate');

      if (dateRangeBox.option('disableOutOfRangeSelection')) {
        calendar._setViewsMinOption(startDate);
      }
    }
  }

  _invalidate(): void {
    super._invalidate();

    this._refreshStrategy();
  }

  _updateInternalValidationState(isValid: boolean, validationMessage?: string): void {
    this.option({
      isValid,
      validationError: isValid ? null : {
        message: validationMessage,
      },
    });
  }

  _recallInternalValidation(value: unknown): void {
    this._applyInternalValidation(value as Date);
  }

  _isTargetOutOfComponent(target: EventTarget | null): boolean {
    const $dateRangeBox = $(this._getDateRangeBox().element());
    // @ts-expect-error Should be fixed on core/renderer level
    const isTargetOutOfDateRangeBox = $(target).closest($dateRangeBox).length === 0;

    return super._isTargetOutOfComponent(target) && isTargetOutOfDateRangeBox;
  }

  _updateLabelWidth(): void {
    const $beforeButtonsContainer = this._getDateRangeBox()._$beforeButtonsContainer;
    const { labelMode } = this.option();

    if (labelMode === 'outside' && $beforeButtonsContainer && this._isStartDateBox()) {
      this._label._updateLabelTransform(getWidth($beforeButtonsContainer));
      return;
    }

    super._updateLabelWidth();
  }

  _optionChanged(args: OptionChanged<DateBoxBaseProperties>): void {
    switch (args.name) {
      case 'isValid': {
        const { isValid } = this._getDateRangeBox().option();

        if (this._skipIsValidOptionChange || isValid === args.value) {
          super._optionChanged(args);
          return;
        }

        this._skipIsValidOptionChange = true;
        this.option({ isValid });
        this._skipIsValidOptionChange = false;
        break;
      }
      default:
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
