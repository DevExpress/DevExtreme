/* eslint-disable class-methods-use-this */
import messageLocalization from '@js/common/core/localization/message';
import type { Device } from '@js/core/devices';
import $ from '@js/core/renderer';
import { inputType } from '@js/core/utils/support';
import { getWindow } from '@js/core/utils/window';
import type { Format } from '@js/localization';

import type { PopupProperties } from '../popup/m_popup';
import type DateBox from './date_box.base';
import type { DateBoxBaseProperties } from './date_box.base';
import dateUtils from './date_utils';
import DateView from './date_view';
import DateBoxStrategy from './m_date_box.strategy';

const window = getWindow();

class DateViewStrategy extends DateBoxStrategy {
  constructor(dateBox: DateBox) {
    super(dateBox);

    this.NAME = 'DateView';
  }

  getWidget(): DateView {
    return this._widget as DateView;
  }

  getDefaultOptions(): DateBoxBaseProperties {
    return {
      ...super.getDefaultOptions(),
      openOnFieldClick: true,
      applyButtonText: messageLocalization.format('OK'),
      dropDownOptions: {
        showTitle: true,
      },
    };
  }

  getDisplayFormat(displayFormat: Format): Format {
    const { type = 'date' } = this.dateBox.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return displayFormat || dateUtils.FORMATS_MAP[type];
  }

  popupConfig(config: PopupProperties): PopupProperties {
    return {
      toolbarItems: this.dateBox._popupToolbarItemsConfig(),
      onInitialized: config.onInitialized,
      // @ts-expect-error ts-error
      defaultOptionsRules: [
        {
          device: { platform: 'android' },
          options: {
            width: 333,
            height: 331,
          },
        },
        {
          device(device: Device): boolean {
            const { platform } = device;
            return platform === 'generic' || platform === 'ios';
          },
          options: {
            width: 'auto',
            height: 'auto',
          },
        },
        {
          device(device: Device): boolean {
            const { platform } = device;
            const { phone } = device;

            return platform === 'generic' && Boolean(phone);
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

  _renderWidget(): void {
    const { mode, readOnly } = this.dateBox.option();
    if ((inputType(mode) && this.dateBox._isNativeType()) || readOnly) {
      if (this._widget) {
        this._widget.$element().remove();
        this._widget = null;
      }

      return;
    }

    const $popupContent = this._getPopupContent();

    if (this._widget) {
      this._widget.option(this._getWidgetOptions());
    } else {
      const element = $('<div>').appendTo($popupContent);
      this._widget = this._createWidget(element);
    }

    this._widget.$element().appendTo(this._getWidgetContainer());
  }

  _getWidgetName(): typeof DateView {
    return DateView;
  }

  renderOpenedState(): void {
    super.renderOpenedState();
    const widget = this.getWidget();

    if (widget) {
      widget.option('value', widget._getCurrentDate());
    }
  }

  _getWidgetOptions(): Record<string, unknown> {
    const { type = 'date' } = this.dateBox.option();
    return {
      value: this.dateBoxValue() ?? new Date(),
      type,
      minDate: this.dateBox.getDateOption('min') ?? new Date(1900, 0, 1),
      maxDate: this.dateBox.getDateOption('max') ?? new Date(Date.now() + 50 * dateUtils.ONE_YEAR),
      onDisposing: (): void => {
        this._widget = null;
      },
    };
  }
}

export default DateViewStrategy;
