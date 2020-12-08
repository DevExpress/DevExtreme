import { noop } from '../../core/utils/common';
import DateBoxStrategy from './ui.date_box.strategy';
import { inputType } from '../../core/utils/support';
import { inArray } from '../../core/utils/array';
import dateUtils from './ui.date_utils';
import dateSerialization from '../../core/utils/date_serialization';
import { extend } from '../../core/utils/extend';
import devices from '../../core/devices';

const NativeStrategy = DateBoxStrategy.inherit({

    NAME: 'Native',

    popupConfig: function(popupConfig) {
        return extend({}, popupConfig, { width: 'auto' });
    },

    getParsedText: function(text, format) {
        if(!text) {
            return null;
        }

        // NOTE: Required for correct date parsing when native picker is used (T418155)
        if(this.dateBox.option('type') === 'datetime') {
            return new Date(text.replace(/-/g, '/').replace('T', ' ').split('.')[0]);
        }

        if(this._isTextInput()) {
            return this.callBase(text, format);
        } else {
            return dateUtils.fromStandardDateFormat(text);
        }
    },

    // IE11 fallback (T902036)
    _isTextInput: function() {
        return this.dateBox._input().prop('type') === 'text';
    },

    renderPopupContent: noop,

    _getWidgetName: noop,

    _getWidgetOptions: noop,

    _getDateBoxType: function() {
        let type = this.dateBox.option('type');

        if(inArray(type, dateUtils.SUPPORTED_FORMATS) === -1) {
            type = 'date';
        } else if(type === 'datetime' && !inputType(type)) {
            type = 'datetime-local';
        }

        return type;
    },

    customizeButtons: function() {
        const dropDownButton = this.dateBox.getButton('dropDown');
        if(devices.real().android && dropDownButton) {
            dropDownButton.on('click', function() {
                this.dateBox._input().get(0).click();
            }.bind(this));
        }
    },

    getDefaultOptions: function() {
        return {
            mode: this._getDateBoxType()
        };
    },

    getDisplayFormat: function(displayFormat) {
        const type = this._getDateBoxType();
        return displayFormat || dateUtils.FORMATS_MAP[type];
    },

    renderInputMinMax: function($input) {
        $input.attr({
            min: dateSerialization.serializeDate(this.dateBox.dateOption('min'), 'yyyy-MM-dd'),
            max: dateSerialization.serializeDate(this.dateBox.dateOption('max'), 'yyyy-MM-dd')
        });
    }
});

export default NativeStrategy;
