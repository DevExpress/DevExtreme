import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { inputType } from '@js/core/utils/support';
import { getWindow } from '@js/core/utils/window';

import dateUtils from './date_utils';
import DateView from './date_view';
import DateBoxStrategy from './m_date_box.strategy';

const window = getWindow();

class DateViewStrategy extends DateBoxStrategy {
  ctor(dateBox): void {
    super.ctor(dateBox);

    this.NAME = 'DateView';
  }

  getDefaultOptions() {
    return {
      ...super.getDefaultOptions(),
      openOnFieldClick: true,
      applyButtonText: messageLocalization.format('OK'),
      'dropDownOptions.showTitle': true,
    };
  }

  getDisplayFormat(displayFormat) {
    return displayFormat || dateUtils.FORMATS_MAP[this.dateBox.option('type')];
  }

  popupConfig(config) {
    return {
      toolbarItems: this.dateBox._popupToolbarItemsConfig(),
      onInitialized: config.onInitialized,

      defaultOptionsRules: [
        {
          device: { platform: 'android' },
          options: {
            width: 333,
            height: 331,
          },
        },
        {
          device(device) {
            const { platform } = device;
            return platform === 'generic' || platform === 'ios';
          },
          options: {
            width: 'auto',
            height: 'auto',
          },
        },
        {
          device(device) {
            const { platform } = device;
            const { phone } = device;

            return platform === 'generic' && phone;
          },
          options: {
            width: 333,
            maxWidth: '100%',
            maxHeight: '100%',
            height: 'auto',
            position: {
              collision: 'flipfit flip',
            },
          },
        },
        {
          device: { platform: 'ios', phone: true },
          options: {
            width: '100%',
            position: {
              my: 'bottom',
              at: 'bottom',
              of: window,
            },
          },
        },
      ],
    };
  }

  _renderWidget() {
    if (inputType(this.dateBox.option('mode')) && this.dateBox._isNativeType() || this.dateBox.option('readOnly')) {
      if (this._widget) {
        this._widget.$element().remove();
        this._widget = null;
      }

      return;
    }

    const popup = this._getPopup();

    if (this._widget) {
      this._widget.option(this._getWidgetOptions());
    } else {
      const element = $('<div>').appendTo(popup.$content());
      this._widget = this._createWidget(element);
    }

    this._widget.$element().appendTo(this._getWidgetContainer());
  }

  _getWidgetName() {
    return DateView;
  }

  renderOpenedState(): void {
    super.renderOpenedState();

    if (this._widget) {
      this._widget.option('value', this._widget._getCurrentDate());
    }
  }

  _getWidgetOptions() {
    return {
      value: this.dateBoxValue() || new Date(),
      type: this.dateBox.option('type'),
      minDate: this.dateBox.getDateOption('min') || new Date(1900, 0, 1),
      maxDate: this.dateBox.getDateOption('max') || new Date(Date.now() + 50 * dateUtils.ONE_YEAR),
      onDisposing: function () {
        this._widget = null;
      }.bind(this),
    };
  }
}

export default DateViewStrategy;
