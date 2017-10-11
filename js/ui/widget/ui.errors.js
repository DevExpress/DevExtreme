"use strict";

var errorUtils = require("../../core/utils/error"),
    errors = require("../../core/errors");

/**
* @docid
* @name Errors and Warnings
* @publicName Errors and Warnings
*/

module.exports = errorUtils(errors.ERROR_MESSAGES, {

    /**
    * @name Errors and Warnings_E1001
    * @publicName E1001
    */
    E1001: "Module '{0}'. Controller '{1}' is already registered",

    /**
    * @name Errors and Warnings_E1002
    * @publicName E1002
    */
    E1002: "Module '{0}'. Controller '{1}' does not inherit from DevExpress.ui.dxDataGrid.Controller",

    /**
    * @name Errors and Warnings_E1003
    * @publicName E1003
    */
    E1003: "Module '{0}'. View '{1}' is already registered",

    /**
    * @name Errors and Warnings_E1004
    * @publicName E1004
    */
    E1004: "Module '{0}'. View '{1}' does not inherit from DevExpress.ui.dxDataGrid.View",

    /**
    * @name Errors and Warnings_E1005
    * @publicName E1005
    */
    E1005: "Public method '{0}' is already registered",

    /**
    * @name Errors and Warnings_E1006
    * @publicName E1006
    */
    E1006: "Public method '{0}.{1}' does not exist",

    /**
    * @name Errors and Warnings_E1007
    * @publicName E1007
    */
    E1007: "State storing cannot be provided due to the restrictions of the browser",

    /**
    * @name Errors and Warnings_E1010
    * @publicName E1010
    */
    E1010: "The template does not contain the TextBox widget",

    /**
    * @name Errors and Warnings_E1011
    * @publicName E1011
    */
    E1011: "Items cannot be deleted from the List. Implement the \"remove\" function in the data store",

    /**
    * @name Errors and Warnings_E1012
    * @publicName E1012
    */
    E1012: "Editing type '{0}' with the name '{1}' is unsupported",

    /**
    * @name Errors and Warnings_E1016
    * @publicName E1016
    */
    E1016: "Unexpected type of data source is provided for a lookup column",

    /**
    * @name Errors and Warnings_E1018
    * @publicName E1018
    */
    E1018: "The 'collapseAll' method cannot be called if you use a remote data source",

    /**
    * @name Errors and Warnings_E1019
    * @publicName E1019
    */
    E1019: "Search mode '{0}' is unavailable",

    /**
    * @name Errors and Warnings_E1020
    * @publicName E1020
    */
    E1020: "The type cannot be changed after initialization",

    /**
    * @name Errors and Warnings_E1021
    * @publicName E1021
    */
    E1021: "{0} '{1}' you are trying to remove does not exist",

    /**
    * @name Errors and Warnings_E1022
    * @publicName E1022
    */
    E1022: "The \"markers\" option is given an invalid value. Assign an array instead",

    /**
    * @name Errors and Warnings_E1023
    * @publicName E1023
    */
    E1023: "The \"routes\" option is given an invalid value. Assign an array instead",

    /**
    * @name Errors and Warnings_E1025
    * @publicName E1025
    */
    E1025: "This layout is too complex to render",

    /**
    * @name Errors and Warnings_E1026
    * @publicName E1026
    */
    E1026: "The \"calculateCustomSummary\" function is missing from a field whose \"summaryType\" option is set to \"custom\"",

    /**
    * @name Errors and Warnings_E1030
    * @publicName E1030
    */
    E1030: "Unknown ScrollView refresh strategy: '{0}'",

    /**
    * @name Errors and Warnings_E1031
    * @publicName E1031
    */
    E1031: "Unknown subscription in the Scheduler widget: '{0}'",

    /**
    * @name Errors and Warnings_E1032
    * @publicName E1032
    */
    E1032: "Unknown start date in an appointment: '{0}'",

    /**
    * @name Errors and Warnings_E1033
    * @publicName E1033
    */
    E1033: "Unknown step in the date navigator: '{0}'",

    /**
    * @name Errors and Warnings_E1034
    * @publicName E1034
    */
    E1034: "The browser does not implement an API for saving files",

    /**
     * @name Errors and Warnings_E1035
     * @publicName E1035
     */
    E1035: "The editor cannot be created because of an internal error: {0}",

    /**
     * @name Errors and Warnings_E1036
     * @publicName E1036
     */
    E1036: "Validation rules are not defined for any form item",

    /**
     * @name Errors and Warnings_E1037
     * @publicName E1037
     */
    E1037: "Invalid structure of grouped data",

    /**
     * @name Errors and Warnings_E1038
     * @publicName E1038
     */
    E1038: "The browser does not support local storages for local web pages",

    /**
    * @name Errors and Warnings_E1039
    * @publicName E1039
    */
    E1039: "A cell's position cannot be calculated",

    /**
     * @name Errors and Warnings_E1040
     * @publicName E1040
     */
    E1040: "The '{0}' key value is not unique within the data array",

    /**
     * @name Errors and Warnings_E1041
     * @publicName E1041
     */
    E1041: "The JSZip script is referenced after DevExtreme scripts",

    /**
    * @name Errors and Warnings_E1042
    * @publicName E1042
    */
    E1042: 'Deferred selection cannot be performed. Set the "key" field for the data store',

    /**
    * @name Errors and Warnings_E1043
    * @publicName E1043
    */
    E1043: 'Changes cannot be processed due to the incorrectly set key',

    /**
    * @name Errors and Warnings_E1044
    * @publicName E1044
    */
    E1044: 'The key field specified by the keyExpr option does not match the key field specified in the data store',

    /**
    * @name Errors and Warnings_E1045
    * @publicName E1045
    */
    E1045: 'Editing requires the key field to be specified in the data store',

    /**
    * @name Errors and Warnings_E1046
    * @publicName E1046
    */
    E1046: "The '{0}' key field is not found in data objects",

    /**
    * @name Errors and Warnings_E1047
    * @publicName E1047
    */
    E1047: "The '{0}' field is not found in fields array",

    /**
    * @name Errors and Warnings_E1048
    * @publicName E1048
    */
    E1048: "The '{0}' operation is not found in array of filterOperations",

    /**
    * @name Errors and Warnings_W1001
    * @publicName W1001
    */
    W1001: "The \"key\" option cannot be modified after initialization",

    /**
    * @name Errors and Warnings_W1002
    * @publicName W1002
    */
    W1002: "An item with the key '{0}' does not exist",

    /**
    * @name Errors and Warnings_W1003
    * @publicName W1003
    */
    W1003: "A group with the key '{0}' in which you are trying to select items does not exist",

    /**
    * @name Errors and Warnings_W1004
    * @publicName W1004
    */
    W1004: "The item '{0}' you are trying to select in the group '{1}' does not exist",

    /**
    * @name Errors and Warnings_W1005
    * @publicName W1005
    */
    W1005: "Due to column data types being unspecified, data has been loaded twice in order to apply initial filter settings. To resolve this issue, specify data types for all grid columns.",

    /**
    * @name Errors and Warnings_W1006
    * @publicName W1006
    */
    W1006: "The map service returned the '{0}' error",

    /**
     * @name Errors and Warnings_W1007
     * @publicName W1007
     */
    W1007: "No item with key {0} was found in the data source, but this key was used as the parent key for item {1}",

    /**
     * @name Errors and Warnings_W1008
     * @publicName W1008
     */
    W1008: "Cannot scroll to the '{0}' date because it does not exist on the current view",

    /**
     * @name Errors and Warnings_W1009
     * @publicName W1009
     */
    W1009: "Searching works only if data is specified using the dataSource option"
});
