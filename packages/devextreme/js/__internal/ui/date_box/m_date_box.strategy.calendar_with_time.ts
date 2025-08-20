import dateLocalization from '@js/common/core/localization/date';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { getWidth } from '@js/core/utils/size';
import { getWindow } from '@js/core/utils/window';
import Box from '@ts/ui/box';
import TimeView from '@ts/ui/date_box/m_time_view';

import CalendarStrategy from './m_date_box.strategy.calendar';
import uiDateUtils from './m_date_utils';

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

  ctor(dateBox): void {
    super.ctor(dateBox);

    this.NAME = 'CalendarWithTime';
  }

  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      applyValueMode: 'useButtons',
      buttonsLocation: 'bottom after',
      'dropDownOptions.showTitle': false,
    };
  }

  _closeDropDownByEnter() {
    return dateUtils.sameDate(this._getContouredValue(), this.widgetOption('value'));
  }

  getDisplayFormat(displayFormat) {
    return displayFormat || 'shortdateshorttime';
  }

  _is24HourFormat() {
    // @ts-expect-error
    return dateLocalization.is24HourFormat(this.getDisplayFormat(this.dateBox.option('displayFormat')));
  }

  _getContouredValue() {
    const viewDate = super._getContouredValue();
    return this._updateDateTime(viewDate);
  }

  _renderWidget(): void {
    super._renderWidget();

    this._timeView = this.dateBox._createComponent($('<div>'), TimeView, {
      value: this.dateBoxValue(),
      _showClock: !this._isShrinkView(),
      use24HourFormat: this._is24HourFormat(),
      onValueChanged: this._valueChangedHandler.bind(this),
      stylingMode: this.dateBox.option('stylingMode'),
    });
  }

  renderOpenedState(): void {
    super.renderOpenedState();
    const popup = this._getPopup();

    if (popup) {
      popup.$wrapper().toggleClass(DATEBOX_ADAPTIVITY_MODE_CLASS, this._isSmallScreen());
    }

    clearTimeout(this._repaintTimer);

    this._repaintTimer = setTimeout(() => {
      this._getPopup()?.repaint();
    }, 0);
  }

  isAdaptivityChanged() {
    const isAdaptiveMode = this._isShrinkView();
    const currentAdaptiveMode = this._currentAdaptiveMode;

    if (isAdaptiveMode !== currentAdaptiveMode) {
      this._currentAdaptiveMode = isAdaptiveMode;
      return currentAdaptiveMode !== undefined;
    }

    return super.isAdaptivityChanged();
  }

  _updateValue(preventDefaultValue) {
    let date = this.dateBoxValue();

    if (!date && !preventDefaultValue) {
      date = new Date();
      uiDateUtils.normalizeTime(date);
    }

    super._updateValue();

    if (this._timeView) {
      date && this._timeView.option('value', date);
      this._timeView.option('use24HourFormat', this._is24HourFormat());
    }
  }

  _isSmallScreen() {
    return getWidth(window) <= SHRINK_VIEW_SCREEN_WIDTH;
  }

  _isShrinkView(): boolean {
    return !this.dateBox.option('showAnalogClock') || (this.dateBox.option('adaptivityEnabled') && this._isSmallScreen());
  }

  _getBoxItems() {
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

  renderPopupContent() {
    super.renderPopupContent();
    this._currentAdaptiveMode = this._isShrinkView();

    const $popupContent = this._getPopup().$content();

    this._box = this.dateBox._createComponent($('<div>').appendTo($popupContent), Box, {
      direction: 'row',
      crossAlign: 'stretch',
      items: this._getBoxItems(),
      itemTemplate: function (data, i, element) {
        const $container = $('<div>');

        // eslint-disable-next-line default-case
        switch (data.name) {
          case 'calendar':
            $container.append(this._widget.$element());
            if (this._isShrinkView()) {
              this._timeView.$element().addClass(DATEBOX_TIMEVIEW_SIDE_CLASS);
              $container.append(this._timeView.$element());
            }
            break;
          case 'time':
            $container.append(this._timeView.$element());
            $(element).addClass(DATEBOX_TIMEVIEW_SIDE_CLASS);
            break;
        }

        return $container;
      }.bind(this),
    });
  }

  popupConfig(popupConfig) {
    const calendarPopupConfig = super.popupConfig(popupConfig);
    return extend(calendarPopupConfig, { width: 'auto' });
  }

  _preventFocusOnPopup(e): void {
    if (!$(e.target).hasClass('dx-texteditor-input')) {
      // @ts-expect-error ts-error
      super._preventFocusOnPopup.apply(this, arguments);
      if (!this.dateBox._hasFocusClass()) {
        this.dateBox.focus();
      }
    }
  }

  _updateDateTime(date): void {
    const { value: time } = this._timeView.option();
    date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());

    return date;
  }

  getValue() {
    let date = this._widget.option('value') ?? this._widget.getContouredDate();
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
