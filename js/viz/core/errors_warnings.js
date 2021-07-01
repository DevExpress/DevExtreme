const errorUtils = require('../../core/utils/error');
const errors = require('../../core/errors');

module.exports = errorUtils(errors.ERROR_MESSAGES, {
    /**
    * @name ErrorsUIWidgets.E2001
    */
    E2001: 'Invalid data source',
    /**
    * @name ErrorsUIWidgets.E2002
    */
    E2002: 'Axis type and data type are incompatible',
    /**
    * @name ErrorsUIWidgets.E2003
    */
    E2003: 'The "{0}" data source field contains data of unsupported type',
    /**
    * @name ErrorsUIWidgets.E2004
    */
    E2004: 'The "{0}" data source field is inconsistent',
    /**
    * @name ErrorsUIWidgets.E2005
    */
    E2005: 'The value field "{0}" is absent in the data source or all its values are negative',
    /**
    * @name ErrorsUIWidgets.E2006
    */
    E2006: 'A cycle is detected in provided data',
    /**
    * @name ErrorsUIWidgets.E2007
    */
    E2007: 'The value field "{0}" is absent in the data source',
    /**
    * @name ErrorsUIWidgets.E2008
    */
    E2008: 'The value field "{0}" must be a string',
    /**
    * @name ErrorsUIWidgets.E2009
    */
    E2009: 'The value field "{0}" must be a positive numeric value',
    /**
    * @name ErrorsUIWidgets.E2101
    */
    E2101: 'Unknown series type: {0}',
    /**
    * @name ErrorsUIWidgets.E2102
    */
    E2102: 'Ambiguity occurred between two value axes with the same name',
    /**
    * @name ErrorsUIWidgets.E2103
    */
    E2103: 'The "{0}" option is given an invalid value. Assign a function instead',
    /**
    * @name ErrorsUIWidgets.E2104
    */
    E2104: 'Invalid logarithm base',
    /**
    * @name ErrorsUIWidgets.E2105
    */
    E2105: 'Invalid value of a "{0}"',
    /**
    * @name ErrorsUIWidgets.E2106
    */
    E2106: 'Invalid visible range',
    /**
    * @name ErrorsUIWidgets.E2202
    */
    E2202: 'Invalid {0} scale value',
    /**
    * @name ErrorsUIWidgets.E2203
    */
    E2203: 'The range you are trying to set is invalid',
    /**
    * @name ErrorsUIWidgets.W2002
    */
    W2002: 'The {0} series cannot be drawn because the {1} data field is missing',
    /**
    * @name ErrorsUIWidgets.W2003
    */
    W2003: 'Tick interval is too small',
    /**
    * @name ErrorsUIWidgets.W2101
    */
    W2101: 'The "{0}" pane does not exist; the last pane is used by default',
    /**
    * @name ErrorsUIWidgets.W2102
    */
    W2102: 'A value axis with the "{0}" name was created automatically',
    /**
    * @name ErrorsUIWidgets.W2103
    */
    W2103: 'The chart title was hidden due to the container size',
    /**
    * @name ErrorsUIWidgets.W2104
    */
    W2104: 'The legend was hidden due to the container size',
    /**
    * @name ErrorsUIWidgets.W2105
    */
    W2105: 'The title of the "{0}" axis was hidden due to the container size',
    /**
    * @name ErrorsUIWidgets.W2106
    */
    W2106: 'The labels of the "{0}" axis were hidden due to the container size',
    /**
    * @name ErrorsUIWidgets.W2107
    */
    W2107: 'The export menu was hidden due to the container size',
    /**
    * @name ErrorsUIWidgets.W2108
    */
    W2108: 'The browser does not support exporting images to {0} format.',
    /**
    * @name ErrorsUIWidgets.W2301
    */
    W2301: 'Invalid value range'
});
