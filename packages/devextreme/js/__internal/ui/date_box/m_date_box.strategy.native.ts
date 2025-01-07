import devices from '@js/core/devices';
import { noop } from '@js/core/utils/common';
import dateSerialization from '@js/core/utils/date_serialization';
import { extend } from '@js/core/utils/extend';
import { inputType } from '@js/core/utils/support';

import DateBoxStrategy from './m_date_box.strategy';
import dateUtils from './m_date_utils';

const NativeStrategy = DateBoxStrategy.inherit({

  NAME: 'Native',

  popupConfig(popupConfig) {
    return extend({}, popupConfig, { width: 'auto' });
  },

  getParsedText(text) {
    if (!text) {
      return null;
    }

    // NOTE: Required for correct date parsing when native picker is used (T418155)
    if (this.dateBox.option('type') === 'datetime') {
      return new Date(text.replace(/-/g, '/').replace('T', ' ').split('.')[0]);
    }

    return dateUtils.fromStandardDateFormat(text);
  },

  renderPopupContent: noop,

  _getWidgetName: noop,

  _getWidgetOptions: noop,

  _getDateBoxType() {
    let type = this.dateBox.option('type');

    if (!dateUtils.SUPPORTED_FORMATS.includes(type)) {
      type = 'date';
    } else if (type === 'datetime' && !inputType(type)) {
      type = 'datetime-local';
    }

    return type;
  },

  customizeButtons() {
    const dropDownButton = this.dateBox.getButton('dropDown');
    if (devices.real().android && dropDownButton) {
      dropDownButton.on('click', () => {
        this.dateBox._input().get(0).click();
      });
    }
  },

  getDefaultOptions() {
    return {
      mode: this._getDateBoxType(),
    };
  },

  getDisplayFormat(displayFormat) {
    const type = this._getDateBoxType();
    return displayFormat || dateUtils.FORMATS_MAP[type];
  },

  renderInputMinMax($input) {
    const type = this.dateBox.option('type');
    const defaultFormat = 'yyyy-MM-dd';
    const format = {
      datetime: 'yyyy-MM-ddTHH:mm:ss',
      date: defaultFormat,
      time: 'HH:mm:ss',
    }[type] ?? defaultFormat;

    $input.attr({
      min: dateSerialization.serializeDate(this.dateBox.dateOption('min'), format),
      max: dateSerialization.serializeDate(this.dateBox.dateOption('max'), format),
    });
  },
});

export default NativeStrategy;
