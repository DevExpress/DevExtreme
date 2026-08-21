import errors from '@ts/core/m_errors';
import errorUtils from '@ts/core/utils/m_error';

export default errorUtils(errors.ERROR_MESSAGES, {
  E1001: 'Module \'{0}\'. Controller \'{1}\' is already registered',

  E1002: 'Module \'{0}\'. Controller \'{1}\' does not inherit from DevExpress.ui.dxDataGrid.Controller',

  E1003: 'Module \'{0}\'. View \'{1}\' is already registered',

  E1004: 'Module \'{0}\'. View \'{1}\' does not inherit from DevExpress.ui.dxDataGrid.View',

  E1005: 'Public method \'{0}\' is already registered',

  E1006: 'Public method \'{0}.{1}\' does not exist',

  E1007: 'State storing cannot be provided due to the restrictions of the browser',

  E1010: 'The template does not contain the TextBox widget',

  E1011: 'Items cannot be deleted from the List. Implement the "remove" function in the data store',

  E1012: 'Editing type \'{0}\' with the name \'{1}\' is unsupported',

  E1016: 'Unexpected type of data source is provided for a lookup column',

  E1018: 'The \'collapseAll\' method cannot be called if you use a remote data source',

  E1019: 'Search mode \'{0}\' is unavailable',

  E1020: 'The type cannot be changed after initialization',

  E1021: '{0} \'{1}\' you are trying to remove does not exist',

  E1022: 'The "markers" option is given an invalid value. Assign an array instead',

  E1023: 'The "routes" option is given an invalid value. Assign an array instead',

  E1025: 'This layout is too complex to render',

  E1026: 'The "calculateCustomSummary" function is missing from a field whose "summaryType" option is set to "custom"',

  E1031: 'Unknown subscription in the Scheduler widget: \'{0}\'',

  E1032: 'Unknown start date in an appointment: \'{0}\'',

  E1033: 'Unknown step in the date navigator: \'{0}\'',

  E1034: 'The browser does not implement an API for saving files',

  E1035: 'The editor cannot be created: {0}',

  E1037: 'Invalid structure of grouped data',

  E1038: 'The browser does not support local storages for local web pages',

  E1039: 'A cell\'s position cannot be calculated',

  E1040: 'The \'{0}\' key value is not unique within the data array',

  E1041: 'The \'{0}\' script is referenced after the DevExtreme scripts or not referenced at all',

  E1042: '{0} requires the key field to be specified',

  E1043: 'Changes cannot be processed due to the incorrectly set key',

  E1044: 'The key field specified by the keyExpr option does not match the key field specified in the data store',

  E1045: 'Editing requires the key field to be specified in the data store',

  E1046: 'The \'{0}\' key field is not found in data objects',

  E1047: 'The "{0}" field is not found in the fields array',

  E1048: 'The "{0}" operation is not found in the filterOperations array',

  E1049: 'Column \'{0}\': filtering is allowed but the \'dataField\' or \'name\' option is not specified',

  E1050: 'The validationRules option does not apply to third-party editors defined in the editCellTemplate',

  E1052: '{0} should have the "dataSource" option specified',

  E1053: 'The "buttons" option accepts an array that contains only objects or string values',

  E1054: 'All text editor buttons must have names',

  E1055: 'One or several text editor buttons have invalid or non-unique "name" values',

  E1056: 'The {0} widget does not support buttons of the "{1}" type',

  // NOTE:
  // E1057 is reserved. See https://js.devexpress.com/Documentation/19_2/ApiReference/UI_Widgets/Errors_and_Warnings/#E1057

  E1058: 'The "startDayHour" and "endDayHour" options must be integers in the [0, 24] range, with "endDayHour" being greater than "startDayHour".',

  E1059: 'The following column names are not unique: {0}',

  E1060: 'All editable columns must have names',

  E1061: 'The "offset" option must be an integer in the [-1440, 1440] range, divisible by 5 without a remainder.',

  E1062: 'The "cellDuration" must be a positive integer, evenly dividing the ("endDayHour" - "startDayHour") interval into minutes.',

  E1063: 'The \'smartPaste(text)\' method was called, but \'aiIntegration\' is not configured.',

  E1064: 'AI returned {1} for the {0} field, but this field only accepts {2} values. Update the \'instruction\' for this field.',

  E1065: 'The browser does not support Web Speech API (SpeechRecognition)',

  E1066: 'All AI columns must have names.',

  E1067: '\'aiIntegration\' is not configured in the {0} column.',

  E1068: '\'aiIntegration\' is not configured for the AI Assistant.',

  E1069: 'Could not find a compatible version of OpenLayers. Load a supported version before Map initialization.',

  W1001: 'The "key" option cannot be modified after initialization',

  W1002: 'An item with the key \'{0}\' does not exist',

  W1003: 'A group with the key \'{0}\' in which you are trying to select items does not exist',

  W1004: 'The item \'{0}\' you are trying to select in the group \'{1}\' does not exist',

  W1005: 'Due to column data types being unspecified, data has been loaded twice in order to apply initial filter settings. To resolve this issue, specify data types for all grid columns.',

  W1006: 'The map service returned the following error: \'{0}\'',

  W1007: 'No item with key {0} was found in the data source, but this key was used as the parent key for item {1}',

  W1008: 'Cannot scroll to the \'{0}\' date because it does not exist on the current view',

  W1009: 'Searching works only if data is specified using the dataSource option',
  W1010: 'The capability to select all items works with source data of plain structure only',
  W1011: 'The "keyExpr" option is not applied when dataSource is not an array',

  W1012: 'The \'{0}\' key field is not found in data objects',

  W1013: 'The "message" field in the dialog component was renamed to "messageHtml". Change your code correspondingly. In addition, if you used HTML code in the message, make sure that it is secure',

  W1014: 'The Floating Action Button exceeds the recommended speed dial action count. If you need to display more speed dial actions, increase the maxSpeedDialActionCount option value in the global config.',

  W1017: 'The \'key\' property is not specified for a lookup data source. Please specify it to prevent requests for the entire dataset when users filter data.',

  W1018: 'Infinite scrolling may not work properly with multiple selection. To use these features together, set \'selection.deferred\' to true or set \'selection.selectAllMode\' to \'page\'.',

  W1019: 'Filter query string exceeds maximum length limit of {0} characters.',

  W1020: 'hideEvent is ignored when the shading property is true',

  W1021: 'The \'{0}\' is not rendered because none of the DOM elements match the value of the "container" property.',

  W1022: '{0} JSON parsing error: \'{1}\'',

  W1023: 'Appointments require unique keys. Otherwise, the agenda view may not work correctly.',

  W1024: 'The client-side export is enabled. Implement the \'onExporting\' function.',

  W1025: '\'scrolling.mode\' is set to \'virtual\' or \'infinite\'. Specify the height of the component.',
  W1026: 'The \'ai\' toolbar item is defined, but aiIntegration is missing.',
  W1027: 'A prompt should be specified for a custom command.',
  W1028: 'Nested/banded columns do not support the following properties: {0}.',
  W1029: '\'hiddenWeekDays\' must leave at least one weekday visible.',
  W1030: '\'tileServer\' is not configured for the OSM map provider.',
  W1031: '\'calculateLocation\' is not configured for the OSM map provider.',
  W1032: '\'attribution\' is not configured for the OSM tile server.',
  W1033: '\'calculateRoute\' is not configured for the OSM map provider.',
});
