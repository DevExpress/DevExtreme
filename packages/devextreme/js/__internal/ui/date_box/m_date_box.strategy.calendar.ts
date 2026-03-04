/* eslint-disable class-methods-use-this */
import messageLocalization from '@js/common/core/localization/message';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { isEmptyObject, isFunction } from '@js/core/utils/type';
import Calendar from '@js/ui/calendar';
import type { ToolbarItem } from '@js/ui/popup';
import { isMaterial } from '@js/ui/themes';
import { splitPair } from '@ts/core/utils/m_common';

import type { PopupProperties } from '../popup/m_popup';
import DateBoxStrategy from './m_date_box.strategy';

const TODAY_BUTTON_CLASS = 'dx-button-today';

class CalendarStrategy extends DateBoxStrategy {
  _lastActionElement?: string;

  ctor(dateBox): void {
    super.ctor(dateBox);

    this.NAME = 'Calendar';
  }

  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      todayButtonText: this.dateBox.option('todayButtonText') ?? messageLocalization.format('dxCalendar-todayButtonText'),
    };
  }

  supportedKeys(): Record<string, (e: KeyboardEvent) => void> {
    const homeEndHandler = function (e) {
      if (this.option('opened')) {
        e.preventDefault();
        return true;
      }
      return false;
    };

    return {
      // @ts-expect-error
      rightArrow() {
        if (this.option('opened')) {
          return true;
        }
      },
      // @ts-expect-error
      leftArrow() {
        if (this.option('opened')) {
          return true;
        }
      },
      // @ts-expect-error
      enter: function (e) {
        if (this.dateBox.option('opened')) {
          e.preventDefault();

          if (this._widget.option('zoomLevel') === this._widget.option('maxZoomLevel')) {
            const viewValue = this._getContouredValue();
            const lastActionElement = this._lastActionElement;
            const shouldCloseDropDown = this._closeDropDownByEnter();

            if (shouldCloseDropDown && viewValue && lastActionElement === 'calendar') {
              this.dateBoxValue(viewValue, e);
            }

            shouldCloseDropDown && this.dateBox.close();
            this.dateBox._valueChangeEventHandler(e);

            return !shouldCloseDropDown;
          }
          return true;
        }
        this.dateBox._valueChangeEventHandler(e);
      }.bind(this),
      home: homeEndHandler,
      end: homeEndHandler,
    };
  }

  getDisplayFormat(displayFormat) {
    return displayFormat || 'shortdate';
  }

  _closeDropDownByEnter() {
    return true;
  }

  _getWidgetName() {
    return Calendar;
  }

  _getContouredValue() {
    return this._widget._view.option('contouredDate');
  }

  getKeyboardListener() {
    return this._widget;
  }

  _getWidgetOptions() {
    const {
      disabledDates, min, max, todayButtonText,
    } = this.dateBox.option();

    return extend(this.dateBox.option('calendarOptions'), {
      value: this.dateBoxValue() || null,
      selectionMode: 'single',
      dateSerializationFormat: null,
      min,
      max,
      onValueChanged: this._valueChangedHandler.bind(this),
      onCellClick: this._cellClickHandler.bind(this),
      disabledDates: isFunction(disabledDates) ? this._injectComponent(disabledDates.bind(this.dateBox)) : disabledDates,
      onContouredChanged: this._refreshActiveDescendant.bind(this),
      skipFocusCheck: true,
      todayButtonText,
    });
  }

  _injectComponent(func) {
    const that = this;
    return function (params) {
      extend(params, { component: that.dateBox });
      return func(params);
    };
  }

  _refreshActiveDescendant(e) {
    this._lastActionElement = 'calendar';
    this.dateBox.setAria('activedescendant', e.actionValue);
  }

  _getTodayButtonConfig(): ToolbarItem {
    const buttonsLocation = this.dateBox.option('buttonsLocation');
    const isButtonsLocationDefault = buttonsLocation === 'default';
    const position = isButtonsLocationDefault ? ['bottom', 'center'] : splitPair(buttonsLocation);
    // @ts-expect-error
    const stylingMode = isMaterial() ? 'text' : 'outlined';

    return {
      widget: 'dxButton',
      toolbar: position[0],
      location: position[1] === 'after' ? 'before' : position[1],
      options: {
        onClick: (args) => { this._widget._toTodayView(args); },
        text: this.dateBox.option('todayButtonText'),
        elementAttr: { class: TODAY_BUTTON_CLASS },
        stylingMode,
      },
    };
  }

  _isCalendarVisible() {
    const { calendarOptions } = this.dateBox.option();

    return isEmptyObject(calendarOptions) || calendarOptions.visible !== false;
  }

  _getPopupToolbarItems(toolbarItems: ToolbarItem[]): ToolbarItem[] {
    const useButtons = this.dateBox.option('applyValueMode') === 'useButtons';
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

  _valueChangedHandler(e) {
    const { value } = e;
    const prevValue = e.previousValue;

    if (dateUtils.sameDate(value, prevValue) && dateUtils.sameHoursAndMinutes(value, prevValue)) {
      return;
    }

    if (this.dateBox.option('applyValueMode') === 'instantly') {
      this.dateBoxValue(this.getValue(), e.event);
    }
  }

  _updateValue() {
    if (!this._widget) {
      return;
    }

    const dateBoxValue = this.dateBoxValue();

    this._widget.option('value', dateBoxValue);

    // this._widget.option('value', this.dateBoxValue());
  }

  textChangedHandler() {
    this._lastActionElement = 'input';

    if (this.dateBox.option('opened') && this._widget) {
      this._updateValue();
    }
  }

  _cellClickHandler(e) {
    const { dateBox } = this;

    if (dateBox.option('applyValueMode') === 'instantly') {
      dateBox.option('opened', false);
      this.dateBoxValue(this.getValue(), e.event);
    }
  }
}

export default CalendarStrategy;
