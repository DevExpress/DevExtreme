"use strict";

var errorUtils = require("../../core/utils/error"),
    errors = require("../../core/errors");
/**
* @docid
* @name ErrorsViz
* @publicName ErrorsViz
*/
module.exports = errorUtils(errors.ERROR_MESSAGES, {
    /**
    * @name ErrorsViz.e2001
    * @publicName E2001
    */
    E2001: "Invalid data source",
    /**
    * @name ErrorsViz.e2002
    * @publicName E2002
    */
    E2002: "Axis type and data type are incompatible",
    /**
    * @name ErrorsViz.e2003
    * @publicName E2003
    */
    E2003: "The \"{0}\" data source field contains data of unsupported type",
    /**
    * @name ErrorsViz.e2004
    * @publicName E2004
    */
    E2004: "The \"{0}\" data source field is inconsistent",
    /**
    * @name ErrorsViz.e2005
    * @publicName E2005
    */
    E2005: "The value field \"{0}\" is absent in the data source or all its values are negative",
    /**
    * @name ErrorsViz.e2101
    * @publicName E2101
    */
    E2101: "Unknown series type: {0}",
    /**
    * @name ErrorsViz.e2102
    * @publicName E2102
    */
    E2102: "Ambiguity occurred between two value axes with the same name",
    /**
    * @name ErrorsViz.e2103
    * @publicName E2103
    */
    E2103: "The \"{0}\" option is given an invalid value. Assign a function instead",
    /**
    * @name ErrorsViz.e2104
    * @publicName E2104
    */
    E2104: "Invalid logarithm base",
    /**
    * @name ErrorsViz.e2105
    * @publicName E2105
    */
    E2105: "Invalid value of a \"{0}\"",
    /**
    * @name ErrorsViz.e2106
    * @publicName E2106
    */
    E2106: "Invalid visible range",
    /**
    * @name ErrorsViz.e2202
    * @publicName E2202
    */
    E2202: "Invalid {0} scale value",
    /**
    * @name ErrorsViz.e2203
    * @publicName E2203
    */
    E2203: "The range you are trying to set is invalid",
    /**
    * @name ErrorsViz.w2002
    * @publicName W2002
    */
    W2002: "The {0} data field is absent",
    /**
    * @name ErrorsViz.w2003
    * @publicName W2003
    */
    W2003: "Tick interval is too small",
    /**
    * @name ErrorsViz.w2101
    * @publicName W2101
    */
    W2101: "The \"{0}\" pane does not exist; the last pane is used by default",
    /**
    * @name ErrorsViz.w2102
    * @publicName W2102
    */
    W2102: "A value axis with the \"{0}\" name was created automatically",
    /**
    * @name ErrorsViz.w2103
    * @publicName W2103
    */
    W2103: "The chart title was hidden due to the container size",
    /**
    * @name ErrorsViz.w2104
    * @publicName W2104
    */
    W2104: "The legend was hidden due to the container size",
    /**
    * @name ErrorsViz.w2105
    * @publicName W2105
    */
    W2105: "The title of the \"{0}\" axis was hidden due to the container size",
    /**
    * @name ErrorsViz.w2106
    * @publicName W2106
    */
    W2106: "The labels of the \"{0}\" axis were hidden due to the container size",
    /**
    * @name ErrorsViz.w2107
    * @publicName W2107
    */
    W2107: "The export menu was hidden due to the container size",
    /**
    * @name ErrorsViz.w2301
    * @publicName W2301
    */
    W2301: "Invalid value range"
});
