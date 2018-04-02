"use strict";

var errorUtils = require("./utils/error");

/**
* @docid
* @name ErrorsCore
* @publicName ErrorsCore
*/
module.exports = errorUtils({

    /**
    * @name ErrorsCore_E0001
    * @publicName E0001
    */
    E0001: "Method is not implemented",

    /**
    * @name ErrorsCore_E0002
    * @publicName E0002
    */
    E0002: "Member name collision: {0}",

    /**
    * @name ErrorsCore_E0003
    * @publicName E0003
    */
    E0003: "A class must be instantiated using the 'new' keyword",

    /**
    * @name ErrorsCore_E0004
    * @publicName E0004
    */
    E0004: "The NAME property of the component is not specified",

    /**
    * @name ErrorsCore_E0005
    * @publicName E0005
    */
    E0005: "Unknown device",

    /**
    * @name ErrorsCore_E0006
    * @publicName E0006
    */
    E0006: "Unknown endpoint key is requested",

    /**
    * @name ErrorsCore_E0007
    * @publicName E0007
    */
    E0007: "'Invalidate' method is called outside the update transaction",

    /**
    * @name ErrorsCore_E0008
    * @publicName E0008
    */
    E0008: "Type of the option name is not appropriate to create an action",

    /**
    * @name ErrorsCore_E0009
    * @publicName E0009
    */
    E0009: "Component '{0}' has not been initialized for an element",

    /**
    * @name ErrorsCore_E0010
    * @publicName E0010
    */
    E0010: "Animation configuration with the '{0}' type requires '{1}' configuration as {2}",

    /**
    * @name ErrorsCore_E0011
    * @publicName E0011
    */
    E0011: "Unknown animation type '{0}'",

    /**
    * @name ErrorsCore_E0012
    * @publicName E0012
    */
    E0012: "jQuery version is too old. Please upgrade jQuery to 1.10.0 or later",

    /**
    * @name ErrorsCore_E0013
    * @publicName E0013
    */
    E0013: "KnockoutJS version is too old. Please upgrade KnockoutJS to 2.3.0 or later",

    /**
    * @name ErrorsCore_E0014
    * @publicName E0014
    */
    E0014: "The 'release' method shouldn't be called for an unlocked Lock object",

    /**
    * @name ErrorsCore_E0015
    * @publicName E0015
    */
    E0015: "Queued task returned an unexpected result",

    /**
    * @name ErrorsCore_E0017
    * @publicName E0017
    */
    E0017: "Event namespace is not defined",

    /**
    * @name ErrorsCore_E0018
    * @publicName E0018
    */
    E0018: "DevExpress.ui.DevExpressPopup widget is required",

    /**
    * @name ErrorsCore_E0020
    * @publicName E0020
    */
    E0020: "Template engine '{0}' is not supported",

    /**
    * @name ErrorsCore_E0021
    * @publicName E0021
    */
    E0021: "Unknown theme is set: {0}",

    /**
    * @name ErrorsCore_E0022
    * @publicName E0022
    */
    E0022: "LINK[rel=DevExpress-theme] tags must go before DevExpress included scripts",

    /**
    * @name ErrorsCore_E0023
    * @publicName E0023
    */
    E0023: "Template name is not specified",

    /**
    * @name ErrorsCore_E0024
    * @publicName E0024
    */
    E0024: "DevExtreme bundle already included",

    /**
    * @name ErrorsCore_E0025
    * @publicName E0025
    */
    E0025: "Unexpected argument type",

    /**
    * @name ErrorsCore_E0100
    * @publicName E0100
    */
    E0100: "Unknown validation type is detected",

    /**
    * @name ErrorsCore_E0101
    * @publicName E0101
    */
    E0101: "Misconfigured range validation rule is detected",


    /**
    * @name ErrorsCore_E0102
    * @publicName E0102
    */
    E0102: "Misconfigured comparison validation rule is detected",

    /**
    * @name ErrorsCore_E0110
    * @publicName E0110
    */
    E0110: "Unknown validation group is detected",

    /**
    * @name ErrorsCore_E0120
    * @publicName E0120
    */
    E0120: "Adapter for a DevExpressValidator component cannot be configured",

    /**
    * @name ErrorsCore_E0121
    * @publicName E0121
    */
    E0121: "The 'customItem' field of the 'onCustomItemCreating' function's parameter should contain a custom item or Promise that is resolved after the item is created.",


    /**
    * @name ErrorsCore_E4016
    * @publicName E4016
    */
    E4016: "The compileSetter(expr) method is called with 'self' passed as a parameter",


    /**
    * @name ErrorsCore_W0000
    * @publicName W0000
    */
    W0000: "'{0}' is deprecated in {1}. {2}",

    /**
    * @name ErrorsCore_W0001
    * @publicName W0001
    */
    W0001: "{0} - '{1}' option is deprecated in {2}. {3}",

    /**
    * @name ErrorsCore_W0002
    * @publicName W0002
    */
    W0002: "{0} - '{1}' method is deprecated in {2}. {3}",

    /**
    * @name ErrorsCore_W0003
    * @publicName W0003
    */
    W0003: "{0} - '{1}' property is deprecated in {2}. {3}",

    /**
    * @name ErrorsCore_W0004
    * @publicName W0004
    */
    W0004: "Timeout for theme loading is over: {0}",

    /**
    * @name ErrorsCore_W0005
    * @publicName W0005
    */
    W0005: "'{0}' event is deprecated in {1}. {2}",

    /**
    * @name ErrorsCore_W0006
    * @publicName W0006
    */
    W0006: "Invalid recurrence rule: '{0}'",

    /**
    * @name ErrorsCore_W0007
    * @publicName W0007
    */
    W0007: "'{0}' Globalize culture is not defined",

    /**
    * @name ErrorsCore_W0008
    * @publicName W0008
    */
    W0008: "Invalid view name: '{0}'",

    /**
    * @name ErrorsCore_W0009
    * @publicName W0009
    */
    W0009: "Invalid time zone name: '{0}'",

    /**
    * @name ErrorsCore_W0010
    * @publicName W0010
    */
    W0010: "{0} is deprecated in {1}. {2}",

    /**
    * @name ErrorsCore_W0011
    * @publicName W0011
    */
    W0011: "Number parsing is invoked while the parser is not defined",

    /**
    * @name ErrorsCore_W0012
    * @publicName W0012
    */
    W0012: "Date parsing is invoked while the parser is not defined",

    /**
    * @name ErrorsCore_W0013
    * @publicName W0013
    */
    W0013: "'{0}' file is deprecated in {1}. {2}",

    /**
    * @name ErrorsCore_W0014
    * @publicName W0014
    */
    W0014: "{0} - '{1}' type is deprecated in {2}. {3}",

    /**
    * @name ErrorsCore_W0015
    * @publicName W0015
    */
    W0015: "Instead of returning a value from the '{0}' function, write it into the '{1}' field of the function's parameter."
});
