"use strict";

var errorUtils = require("../../core/utils/error"),
    errors = require("../../core/errors");
/**
* @docid
* @name ErrorsViz
*/
module.exports = errorUtils(errors.ERROR_MESSAGES, {
    /**
    * @name ErrorsViz.E2001
    */
    E2001: "Invalid data source",
    /**
    * @name ErrorsViz.E2002
    */
    E2002: "Axis type and data type are incompatible",
    /**
    * @name ErrorsViz.E2003
    */
    E2003: "The \"{0}\" data source field contains data of unsupported type",
    /**
    * @name ErrorsViz.E2004
    */
    E2004: "The \"{0}\" data source field is inconsistent",
    /**
    * @name ErrorsViz.E2005
    */
    E2005: "The value field \"{0}\" is absent in the data source or all its values are negative",
    /**
    * @name ErrorsViz.E2006
    */
    E2006: "A cycle is detected in provided data",
    /**
    * @name ErrorsViz.E2007
    */
    E2007: "Input data must be an array",
    /**
    * @name ErrorsViz.E2008
    */
    E2008: "Each link must be an array of three items: [string, string, number]",
    /**
    * @name ErrorsViz.E2009
    */
    E2009: "Each link must have positive weight",
    /**
    * @name ErrorsViz.E2101
    */
    E2101: "Unknown series type: {0}",
    /**
    * @name ErrorsViz.E2102
    */
    E2102: "Ambiguity occurred between two value axes with the same name",
    /**
    * @name ErrorsViz.E2103
    */
    E2103: "The \"{0}\" option is given an invalid value. Assign a function instead",
    /**
    * @name ErrorsViz.E2104
    */
    E2104: "Invalid logarithm base",
    /**
    * @name ErrorsViz.E2105
    */
    E2105: "Invalid value of a \"{0}\"",
    /**
    * @name ErrorsViz.E2106
    */
    E2106: "Invalid visible range",
    /**
    * @name ErrorsViz.E2202
    */
    E2202: "Invalid {0} scale value",
    /**
    * @name ErrorsViz.E2203
    */
    E2203: "The range you are trying to set is invalid",
    /**
    * @name ErrorsViz.W2002
    */
    W2002: "The {0} data field is absent",
    /**
    * @name ErrorsViz.W2003
    */
    W2003: "Tick interval is too small",
    /**
    * @name ErrorsViz.W2101
    */
    W2101: "The \"{0}\" pane does not exist; the last pane is used by default",
    /**
    * @name ErrorsViz.W2102
    */
    W2102: "A value axis with the \"{0}\" name was created automatically",
    /**
    * @name ErrorsViz.W2103
    */
    W2103: "The chart title was hidden due to the container size",
    /**
    * @name ErrorsViz.W2104
    */
    W2104: "The legend was hidden due to the container size",
    /**
    * @name ErrorsViz.W2105
    */
    W2105: "The title of the \"{0}\" axis was hidden due to the container size",
    /**
    * @name ErrorsViz.W2106
    */
    W2106: "The labels of the \"{0}\" axis were hidden due to the container size",
    /**
    * @name ErrorsViz.W2107
    */
    W2107: "The export menu was hidden due to the container size",
    /**
    * @name ErrorsViz.W2301
    */
    W2301: "Invalid value range"
});
