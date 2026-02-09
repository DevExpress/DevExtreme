import devices from '@js/core/devices';
import dateSerialization from '@js/core/utils/date_serialization';
import { inputType } from '@js/core/utils/support';

import type { PopupProperties } from '../popup/m_popup';
import dateUtils from './date_utils';
import DateBoxStrategy from './m_date_box.strategy';

class NativeStrategy extends DateBoxStrategy {
  ctor(dateBox): void {
    super.ctor(dateBox);

    this.NAME = 'Native';
  }

  // eslint-disable-next-line class-methods-use-this
  popupConfig(popupConfig: PopupProperties): PopupProperties {
    return {
      ...popupConfig,
      width: 'auto',
    };
  }

  getParsedText(text) {
    if (!text) {
      return null;
    }

    // NOTE: Required for correct date parsing when native picker is used (T418155)
    if (this.dateBox.option('type') === 'datetime') {
      return new Date(text.replace(/-/g, '/').replace('T', ' ').split('.')[0]);
    }

    return dateUtils.fromStandardDateFormat(text);
  }

  renderPopupContent(): void {}

  _getWidgetName(): void {}

  _getWidgetOptions(): void {}

  _getDateBoxType() {
    let { type } = this.dateBox.option();

    if (!dateUtils.SUPPORTED_FORMATS.includes(type)) {
      type = 'date';
    } else if (type === 'datetime' && !inputType(type)) {
      type = 'datetime-local';
    }

    return type;
  }

  customizeButtons() {
    const dropDownButton = this.dateBox.getButton('dropDown');
    if (devices.real().android && dropDownButton) {
      dropDownButton.on('click', () => {
        this.dateBox._input().get(0).click();
      });
    }
  }

  getDefaultOptions() {
    return {
      mode: this._getDateBoxType(),
    };
  }

  getDisplayFormat(displayFormat?) {
    const type = this._getDateBoxType();
    return displayFormat || dateUtils.FORMATS_MAP[type];
  }

  renderInputMinMax($input?): void {
    const type = this.dateBox.option('type');
    const defaultFormat = 'yyyy-MM-dd';
    const format = {
      datetime: 'yyyy-MM-ddTHH:mm:ss',
      date: defaultFormat,
      time: 'HH:mm:ss',
    }[type] ?? defaultFormat;

    $input.attr({
      min: dateSerialization.serializeDate(this.dateBox.getDateOption('min'), format),
      max: dateSerialization.serializeDate(this.dateBox.getDateOption('max'), format),
    });
  }
}

export default NativeStrategy;
