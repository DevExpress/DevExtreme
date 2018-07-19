"use strict";

var errorUtils = require("../../core/utils/error"),
    errors = require("../../core/errors");

/**
* @docid
* @name ErrorsUIWidgets
*/

module.exports = errorUtils(errors.ERROR_MESSAGES, {

    /**
    * @name ErrorsUIWidgets.E1001
    */
    E1001: "Module '{0}'. Controller '{1}' is already registered",

    /**
    * @name ErrorsUIWidgets.E1002
    */
    E1002: "Module '{0}'. Controller '{1}' does not inherit from DevExpress.ui.dxDataGrid.Controller",

    /**
    * @name ErrorsUIWidgets.E1003
    */
    E1003: "Module '{0}'. View '{1}' is already registered",

    /**
    * @name ErrorsUIWidgets.E1004
    */
    E1004: "Module '{0}'. View '{1}' does not inherit from DevExpress.ui.dxDataGrid.View",

    /**
    * @name ErrorsUIWidgets.E1005
    */
    E1005: "Public method '{0}' is already registered",

    /**
    * @name ErrorsUIWidgets.E1006
    */
    E1006: "Public method '{0}.{1}' does not exist",

    /**
    * @name ErrorsUIWidgets.E1007
    */
    E1007: "State storing cannot be provided due to the restrictions of the browser",

    /**
    * @name ErrorsUIWidgets.E1010
    */
    E1010: "The template does not contain the TextBox widget",

    /**
    * @name ErrorsUIWidgets.E1011
    */
    E1011: "Items cannot be deleted from the List. Implement the \"remove\" function in the data store",

    /**
    * @name ErrorsUIWidgets.E1012
    */
    E1012: "Editing type '{0}' with the name '{1}' is unsupported",

    /**
    * @name ErrorsUIWidgets.E1016
    */
    E1016: "Unexpected type of data source is provided for a lookup column",

    /**
    * @name ErrorsUIWidgets.E1018
    */
    E1018: "The 'collapseAll' method cannot be called if you use a remote data source",

    /**
    * @name ErrorsUIWidgets.E1019
    */
    E1019: "Search mode '{0}' is unavailable",

    /**
    * @name ErrorsUIWidgets.E1020
    */
    E1020: "The type cannot be changed after initialization",

    /**
    * @name ErrorsUIWidgets.E1021
    */
    E1021: "{0} '{1}' you are trying to remove does not exist",

    /**
    * @name ErrorsUIWidgets.E1022
    */
    E1022: "The \"markers\" option is given an invalid value. Assign an array instead",

    /**
    * @name ErrorsUIWidgets.E1023
    */
    E1023: "The \"routes\" option is given an invalid value. Assign an array instead",

    /**
    * @name ErrorsUIWidgets.E1025
    */
    E1025: "This layout is too complex to render",

    /**
    * @name ErrorsUIWidgets.E1026
    */
    E1026: "The \"calculateCustomSummary\" function is missing from a field whose \"summaryType\" option is set to \"custom\"",

    /**
    * @name ErrorsUIWidgets.E1030
    */
    E1030: "Unknown ScrollView refresh strategy: '{0}'",

    /**
    * @name ErrorsUIWidgets.E1031
    */
    E1031: "Unknown subscription in the Scheduler widget: '{0}'",

    /**
    * @name ErrorsUIWidgets.E1032
    */
    E1032: "Unknown start date in an appointment: '{0}'",

    /**
    * @name ErrorsUIWidgets.E1033
    */
    E1033: "Unknown step in the date navigator: '{0}'",

    /**
    * @name ErrorsUIWidgets.E1034
    */
    E1034: "The browser does not implement an API for saving files",

    /**
     * @name ErrorsUIWidgets.E1035
     */
    E1035: "The editor cannot be created because of an internal error: {0}",

    /**
     * @name ErrorsUIWidgets.E1036
     */
    E1036: "Validation rules are not defined for any form item",

    /**
     * @name ErrorsUIWidgets.E1037
     */
    E1037: "Invalid structure of grouped data",

    /**
     * @name ErrorsUIWidgets.E1038
     */
    E1038: "The browser does not support local storages for local web pages",

    /**
    * @name ErrorsUIWidgets.E1039
    */
    E1039: "A cell's position cannot be calculated",

    /**
     * @name ErrorsUIWidgets.E1040
     */
    E1040: "The '{0}' key value is not unique within the data array",

    /**
     * @name ErrorsUIWidgets.E1041
     */
    E1041: "The JSZip script is referenced after the DevExtreme scripts or not referenced at all",

    /**
    * @name ErrorsUIWidgets.E1042
    */
    E1042: 'Deferred selection cannot be performed. Set the "key" field for the data store',

    /**
    * @name ErrorsUIWidgets.E1043
    */
    E1043: 'Changes cannot be processed due to the incorrectly set key',

    /**
    * @name ErrorsUIWidgets.E1044
    */
    E1044: 'The key field specified by the keyExpr option does not match the key field specified in the data store',

    /**
    * @name ErrorsUIWidgets.E1045
    */
    E1045: 'Editing requires the key field to be specified in the data store',

    /**
    * @name ErrorsUIWidgets.E1046
    */
    E1046: "The '{0}' key field is not found in data objects",

    /**
    * @name ErrorsUIWidgets.E1047
    */
    E1047: "The \"{0}\" field is not found in the fields array",

    /**
    * @name ErrorsUIWidgets.E1048
    */
    E1048: "The \"{0}\" operation is not found in the filterOperations array",

    /**
    * @name ErrorsUIWidgets.E1049
    */
    E1049: `Column '{0}': filtering is allowed but the 'dataField' or 'name' option is not specified`,

    /**
    * @name ErrorsUIWidgets.W1001
    */
    W1001: "The \"key\" option cannot be modified after initialization",

    /**
    * @name ErrorsUIWidgets.W1002
    */
    W1002: "An item with the key '{0}' does not exist",

    /**
    * @name ErrorsUIWidgets.W1003
    */
    W1003: "A group with the key '{0}' in which you are trying to select items does not exist",

    /**
    * @name ErrorsUIWidgets.W1004
    */
    W1004: "The item '{0}' you are trying to select in the group '{1}' does not exist",

    /**
    * @name ErrorsUIWidgets.W1005
    */
    W1005: "Due to column data types being unspecified, data has been loaded twice in order to apply initial filter settings. To resolve this issue, specify data types for all grid columns.",

    /**
    * @name ErrorsUIWidgets.W1006
    */
    W1006: "The map service returned the '{0}' error",

    /**
     * @name ErrorsUIWidgets.W1007
     */
    W1007: "No item with key {0} was found in the data source, but this key was used as the parent key for item {1}",

    /**
     * @name ErrorsUIWidgets.W1008
     */
    W1008: "Cannot scroll to the '{0}' date because it does not exist on the current view",

    /**
     * @name ErrorsUIWidgets.W1009
     */
    W1009: "Searching works only if data is specified using the dataSource option",
    /**
     * @name ErrorsUIWidgets.W1010
     */
    W1010: "The capability to select all items works with source data of plain structure only",
    /**
     * @name ErrorsUIWidgets.W1011
     */
    W1011: "The \"keyExpr\" option is not applied when dataSource is not an array",

    W1012: "The '{0}' key field is not found in data objects"
});
