/* eslint-disable class-methods-use-this */
import dateLocalization from '@js/common/core/localization/date';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { getWidth } from '@js/core/utils/size';
import { getWindow } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import type { Format } from '@js/localization';
import type { BoxItemData } from '@ts/ui/box';
import Box from '@ts/ui/box';
import TimeView from '@ts/ui/date_box/time_view';

import type { PopupProperties } from '../popup/m_popup';
import type DateBox from './date_box.base';
import type { DateBoxBaseProperties } from './date_box.base';
import uiDateUtils from './date_utils';
import CalendarStrategy from './m_date_box.strategy.calendar';

const window = getWindow();

const SHRINK_VIEW_SCREEN_WIDTH = 573;
const DATEBOX_ADAPTIVITY_MODE_CLASS = 'dx-datebox-adaptivity-mode';
const DATEBOX_TIMEVIEW_SIDE_CLASS = 'dx-datebox-datetime-time-side';

class CalendarWithTimeStrategy extends CalendarStrategy {
  _timeView!: TimeView;

  _repaintTimer?: ReturnType<typeof setTimeout>;

  _removeMinWidthTimer?: ReturnType<typeof setTimeout>;

  _currentAdaptiveMode?: boolean;

  _box?: Box;

  constructor(dateBox: DateBox) {
    super(dateBox);

    this.NAME = 'CalendarWithTime';
  }

  getDefaultOptions(): DateBoxBaseProperties {
    return {
      ...super.getDefaultOptions(),
      applyValueMode: 'useButtons',
      buttonsLocation: 'bottom after',
      dropDownOptions: {
        showTitle: false,
      },
    };
  }

  _closeDropDownByEnter(): boolean {
    return dateUtils.sameDate(this._getContouredValue(), this.widgetOption('value'));
  }

  getDisplayFormat(displayFormat?: Format): Format {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return displayFormat || 'shortdateshorttime';
  }

  _is24HourFormat(): boolean {
    const { displayFormat } = this.dateBox.option();
    // @ts-expect-error ts-error
    return dateLocalization.is24HourFormat(this.getDisplayFormat(displayFormat)) as boolean;
  }

  _getContouredValue(): Date {
    const viewDate = super._getContouredValue();
    return this._updateDateTime(viewDate as Date);
  }

  _renderWidget(): void {
    super._renderWidget();
    const { stylingMode } = this.dateBox.option();

    this._timeView = this.dateBox._createComponent($('<div>'), TimeView, {
      value: this.dateBoxValue() as Date,
      _showClock: !this._isShrinkView(),
      use24HourFormat: this._is24HourFormat(),
      onValueChanged: this._valueChangedHandler.bind(this),
      stylingMode,
    });
  }

  renderOpenedState(): void {
    super.renderOpenedState();
    const popup = this._getPopup();

    if (popup) {
      popup.$wrapper()?.toggleClass(DATEBOX_ADAPTIVITY_MODE_CLASS, this._isSmallScreen());
    }

    clearTimeout(this._repaintTimer);

    // eslint-disable-next-line no-restricted-globals
    this._repaintTimer = setTimeout(() => {
      this._getPopup()?.repaint();
    }, 0);
  }

  isAdaptivityChanged(): boolean {
    const isAdaptiveMode = this._isShrinkView();
    const currentAdaptiveMode = this._currentAdaptiveMode;

    if (isAdaptiveMode !== currentAdaptiveMode) {
      this._currentAdaptiveMode = isAdaptiveMode;
      return currentAdaptiveMode !== undefined;
    }

    return super.isAdaptivityChanged();
  }

  _updateValue(preventDefaultValue?: boolean): void {
    let date = this.dateBoxValue();

    if (!date && !preventDefaultValue) {
      date = new Date();
      uiDateUtils.normalizeTime(date);
    }

    super._updateValue();

    if (this._timeView) {
      if (date) {
        this._timeView.option('value', date);
      }
      this._timeView.option('use24HourFormat', this._is24HourFormat());
    }
  }

  _isSmallScreen(): boolean {
    return getWidth(window) <= SHRINK_VIEW_SCREEN_WIDTH;
  }

  _isShrinkView(): boolean {
    const { showAnalogClock = true, adaptivityEnabled = false } = this.dateBox.option();
    return !showAnalogClock || (adaptivityEnabled && this._isSmallScreen());
  }

  _getBoxItems(): BoxItemData[] {
    const items = [{
      ratio: 0, shrink: 0, baseSize: 'auto', name: 'calendar',
    }];

    if (!this._isShrinkView()) {
      items.push({
        ratio: 0, shrink: 0, baseSize: 'auto', name: 'time',
      });
    }

    return items;
  }

  renderPopupContent(): void {
    super.renderPopupContent();
    this._currentAdaptiveMode = this._isShrinkView();

    const $popupContent = this._getPopupContent();

    this._box = this.dateBox._createComponent($('<div>').appendTo($popupContent), Box, {
      direction: 'row',
      crossAlign: 'stretch',
      items: this._getBoxItems(),
      itemTemplate: ({ name }: { name: string }, _: number, element: HTMLElement) => {
        const $container = $('<div>');

        switch (name) {
          case 'calendar':
            $container.append(this.getWidget().$element());
            if (this._isShrinkView()) {
              this._timeView.$element().addClass(DATEBOX_TIMEVIEW_SIDE_CLASS);
              $container.append(this._timeView.$element());
            }
            break;
          case 'time':
            $container.append(this._timeView.$element());
            $(element).addClass(DATEBOX_TIMEVIEW_SIDE_CLASS);
            break;
          default:
            break;
        }

        return $container;
      },
    });
  }

  popupConfig(popupConfig: PopupProperties): PopupProperties {
    const calendarPopupConfig = super.popupConfig(popupConfig);
    return extend(calendarPopupConfig, { width: 'auto' }) as PopupProperties;
  }

  _preventFocusOnPopup(e: DxEvent<MouseEvent>): void {
    if (!$(e.target).hasClass('dx-texteditor-input')) {
      super._preventFocusOnPopup(e);
      if (!this.dateBox._hasFocusClass()) {
        this.dateBox.focus();
      }
    }
  }

  _updateDateTime(date: Date): Date {
    const { value: time } = this._timeView.option();
    date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());

    return date;
  }

  getValue(): Date {
    const calendar = this.getWidget();
    const { value } = calendar.option();
    let date = (value ?? calendar.getContouredDate()) as Date;
    date = date ? new Date(date) : new Date();

    return this._updateDateTime(date);
  }

  dispose(): void {
    clearTimeout(this._removeMinWidthTimer);
    clearTimeout(this._repaintTimer);
    super.dispose();
  }
}

export default CalendarWithTimeStrategy;
