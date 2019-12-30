const noop = require('../../core/utils/common').noop;
const DateBoxStrategy = require('./ui.date_box.strategy');
const support = require('../../core/utils/support');
const inArray = require('../../core/utils/array').inArray;
const dateUtils = require('./ui.date_utils');
const dateSerialization = require('../../core/utils/date_serialization');

const NativeStrategy = DateBoxStrategy.inherit({

    NAME: 'Native',

    popupConfig: noop,

    getParsedText: function(text) {
        if(!text) {
            return null;
        }

        // NOTE: Required for correct date parsing when native picker is used (T418155)
        if(this.dateBox.option('type') === 'datetime') {
            return new Date(text.replace(/-/g, '/').replace('T', ' ').split('.')[0]);
        }

        return dateUtils.fromStandardDateFormat(text);
    },

    renderPopupContent: noop,

    _getWidgetName: noop,

    _getWidgetOptions: noop,

    _getDateBoxType: function() {
        let type = this.dateBox.option('type');

        if(inArray(type, dateUtils.SUPPORTED_FORMATS) === -1) {
            type = 'date';
        } else if(type === 'datetime' && !support.inputType(type)) {
            type = 'datetime-local';
        }

        return type;
    },

    customizeButtons: function() {
        const dropDownButton = this.dateBox.getButton('dropDown');
        if(dropDownButton) {
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

module.exports = NativeStrategy;
