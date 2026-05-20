/* eslint-disable class-methods-use-this */
import messageLocalization from '@js/common/core/localization/message';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { isEmptyObject, isFunction } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { Format } from '@js/localization';
import type { ClickEvent } from '@js/ui/button';
import type { ValueChangedEvent } from '@js/ui/calendar';
import type { ToolbarItem } from '@js/ui/popup';
import { current, isMaterial } from '@js/ui/themes';
import { getGlobalFormatByDataType } from '@ts/core/m_global_format_config';
import { splitPair } from '@ts/core/utils/m_common';
import Calendar from '@ts/ui/calendar/calendar';

import type { CellEvent } from '../calendar/calendar.base_view';
import type { PopupProperties } from '../popup/m_popup';
import type { DateBoxBaseProperties } from './date_box.base';
import type DateBox from './date_box.base';
import DateBoxStrategy from './m_date_box.strategy';

const TODAY_BUTTON_CLASS = 'dx-button-today';

class CalendarStrategy extends DateBoxStrategy {
  _lastActionElement?: string;

  constructor(dateBox: DateBox) {
    super(dateBox);

    this.NAME = 'Calendar';
  }

  getWidget(): Calendar {
    return this._widget as Calendar;
  }

  getDefaultOptions(): DateBoxBaseProperties {
    const { todayButtonText } = this.dateBox.option();
    return {
      ...super.getDefaultOptions(),
      todayButtonText: todayButtonText ?? messageLocalization.format('dxCalendar-todayButtonText'),
    };
  }

  supportedKeys(): Record<string, (e: KeyboardEvent) => boolean | undefined> {
    const homeEndHandler = (e: KeyboardEvent): boolean | undefined => {
      if (this.dateBox.option('opened')) {
        e.preventDefault();
        return true;
      }
      return false;
    };

    return {
      rightArrow(): boolean | undefined {
        if (this.option('opened')) {
          return true;
        }
        return undefined;
      },
      leftArrow(): boolean | undefined {
        if (this.option('opened')) {
          return true;
        }
        return undefined;
      },
      enter: (e): boolean | undefined => {
        if (this.dateBox.option('opened')) {
          e.preventDefault();
          const { zoomLevel, maxZoomLevel } = this.getWidget().option();
          if (zoomLevel === maxZoomLevel) {
            const viewValue = this._getContouredValue();
            const lastActionElement = this._lastActionElement;
            const shouldCloseDropDown = this._closeDropDownByEnter();

            if (shouldCloseDropDown && viewValue && lastActionElement === 'calendar') {
              this.dateBoxValue(viewValue, e);
            }

            if (shouldCloseDropDown) {
              this.dateBox.close();
            }
            this.dateBox._valueChangeEventHandler(e);

            return !shouldCloseDropDown;
          }
          return true;
        }
        this.dateBox._valueChangeEventHandler(e);
        return undefined;
      },
      home: homeEndHandler,
      end: homeEndHandler,
    };
  }

  getDisplayFormat(displayFormat?: Format): Format {
    const globalDateFormat = getGlobalFormatByDataType('date');
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return displayFormat || globalDateFormat || 'shortdate';
  }

  _closeDropDownByEnter(): boolean {
    return true;
  }

  _getWidgetName(): typeof Calendar {
    return Calendar;
  }

  _getContouredValue(): Date | undefined {
    const { contouredDate } = this.getWidget()._view.option();
    return contouredDate;
  }

  getKeyboardListener(): Calendar {
    return this.getWidget();
  }

  _getWidgetOptions(): Record<string, unknown> {
    const {
      disabledDates, min, max, todayButtonText, calendarOptions = {},
    } = this.dateBox.option();

    return extend(calendarOptions, {
      value: this.dateBoxValue() ?? null,
      selectionMode: 'single',
      dateSerializationFormat: null,
      min,
      max,
      onValueChanged: this._valueChangedHandler.bind(this),
      onCellClick: this._cellClickHandler.bind(this),
      disabledDates: isFunction(disabledDates)
        ? this._injectComponent(disabledDates.bind(this.dateBox))
        : disabledDates,
      onContouredChanged: this._refreshActiveDescendant.bind(this),
      skipFocusCheck: true,
      todayButtonText,
    }) as Record<string, unknown>;
  }

  _injectComponent<T>(
    func: (params: T & { component: DateBox }) => boolean,
  ): (params: T) => boolean {
    return (params: T): boolean => func({ ...params, component: this.dateBox });
  }

  _refreshActiveDescendant(e: DxEvent & { actionValue: string }): void {
    this._lastActionElement = 'calendar';
    this.dateBox.setAria('activedescendant', e.actionValue);
  }

  _getTodayButtonConfig(): ToolbarItem {
    const { buttonsLocation } = this.dateBox.option();
    const isButtonsLocationDefault = buttonsLocation === 'default';
    const position = isButtonsLocationDefault ? ['bottom', 'center'] : splitPair(buttonsLocation);
    const stylingMode = isMaterial(current()) ? 'text' : 'outlined';

    return {
      widget: 'dxButton',
      toolbar: position[0],
      location: position[1] === 'after' ? 'before' : position[1],
      options: {
        onClick: (
          args: DxEvent<ClickEvent>,
        ): void => { this.getWidget()._toTodayView(args); },
        text: this.dateBox.option('todayButtonText'),
        elementAttr: { class: TODAY_BUTTON_CLASS },
        stylingMode,
      },
    };
  }

  _isCalendarVisible(): boolean {
    const { calendarOptions = {} } = this.dateBox.option();

    return isEmptyObject(calendarOptions) || calendarOptions.visible !== false;
  }

  _getPopupToolbarItems(toolbarItems: ToolbarItem[]): ToolbarItem[] {
    const { applyValueMode } = this.dateBox.option();
    const useButtons = applyValueMode === 'useButtons';
    const shouldRenderTodayButton = useButtons && this._isCalendarVisible();

    if (shouldRenderTodayButton) {
      const todayButton = this._getTodayButtonConfig();

      return [
        todayButton,
        ...toolbarItems,
      ];
    }

    return toolbarItems;
  }

  popupConfig(popupConfig: PopupProperties): PopupProperties {
    return extend(true, popupConfig, {
      position: { collision: 'flipfit flip' },
      width: 'auto',
    }) as PopupProperties;
  }

  _valueChangedHandler(e: ValueChangedEvent): void {
    const { value } = e;
    const prevValue = e.previousValue;

    if (dateUtils.sameDate(value, prevValue) && dateUtils.sameHoursAndMinutes(value, prevValue)) {
      return;
    }

    const { applyValueMode } = this.dateBox.option();

    if (applyValueMode === 'instantly') {
      this.dateBoxValue(this.getValue(), e.event);
    }
  }

  _updateValue(): void {
    if (!this._widget) {
      return;
    }

    const value = this.dateBoxValue();

    this._widget.option({ value });
  }

  textChangedHandler(): void {
    this._lastActionElement = 'input';

    if (this.dateBox.option('opened') && this._widget) {
      this._updateValue();
    }
  }

  _cellClickHandler(e: CellEvent): void {
    const { dateBox } = this;
    const { applyValueMode } = dateBox.option();

    if (applyValueMode === 'instantly') {
      dateBox.option('opened', false);
      this.dateBoxValue(this.getValue(), e.event);
    }
  }
}

export default CalendarStrategy;
