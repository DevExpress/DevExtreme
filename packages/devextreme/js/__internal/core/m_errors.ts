import errorUtils from './utils/error';

/**
* @docid
* @name ErrorsCore
*/
export default errorUtils({

  /**
    * @name ErrorsCore.E0001
    */
  E0001: 'Method is not implemented',

  /**
    * @name ErrorsCore.E0002
    */
  E0002: 'Member name collision: {0}',

  /**
    * @name ErrorsCore.E0003
    */
  E0003: 'A class must be instantiated using the \'new\' keyword',

  /**
    * @name ErrorsCore.E0004
    */
  E0004: 'The NAME property of the component is not specified',

  /**
    * @name ErrorsCore.E0005
    */
  E0005: 'Unknown device',

  /**
    * @name ErrorsCore.E0006
    */
  E0006: 'Unknown endpoint key is requested',

  /**
    * @name ErrorsCore.E0007
    */
  E0007: '\'Invalidate\' method is called outside the update transaction',

  /**
    * @name ErrorsCore.E0008
    */
  E0008: 'Type of the option name is not appropriate to create an action',

  /**
    * @name ErrorsCore.E0009
    */
  E0009: 'Component \'{0}\' has not been initialized for an element',

  /**
    * @name ErrorsCore.E0010
    */
  E0010: 'Animation configuration with the \'{0}\' type requires \'{1}\' configuration as {2}',

  /**
    * @name ErrorsCore.E0011
    */
  E0011: 'Unknown animation type \'{0}\'',

  /**
    * @name ErrorsCore.E0012
    */
  E0012: 'jQuery version is too old. Please upgrade jQuery to 1.10.0 or later',

  /**
    * @name ErrorsCore.E0013
    */
  E0013: 'KnockoutJS version is too old. Please upgrade KnockoutJS to 2.3.0 or later',

  /**
    * @name ErrorsCore.E0014
    */
  E0014: 'The \'release\' method shouldn\'t be called for an unlocked Lock object',

  /**
    * @name ErrorsCore.E0015
    */
  E0015: 'Queued task returned an unexpected result',

  /**
    * @name ErrorsCore.E0017
    */
  E0017: 'Event namespace is not defined',

  /**
    * @name ErrorsCore.E0018
    */
  E0018: 'DevExpress.ui.DevExpressPopup widget is required',

  /**
    * @name ErrorsCore.E0020
    */
  E0020: 'Template engine \'{0}\' is not supported',

  /**
    * @name ErrorsCore.E0021
    */
  E0021: 'Unknown theme is set: {0}',

  /**
    * @name ErrorsCore.E0022
    */
  E0022: 'LINK[rel=DevExpress-theme] tags must go before DevExpress included scripts',

  /**
    * @name ErrorsCore.E0023
    */
  E0023: 'Template name is not specified',

  /**
    * @name ErrorsCore.E0024
    */
  E0024: 'DevExtreme bundle already included',

  /**
    * @name ErrorsCore.E0025
    */
  E0025: 'Unexpected argument type',

  /**
    * @name ErrorsCore.E0100
    */
  E0100: 'Unknown validation type is detected',

  /**
    * @name ErrorsCore.E0101
    */
  E0101: 'Misconfigured range validation rule is detected',

  /**
    * @name ErrorsCore.E0102
    */
  E0102: 'Misconfigured comparison validation rule is detected',

  /**
    * @name ErrorsCore.E0103
    */
  E0103: 'validationCallback of an asynchronous rule should return a jQuery or a native promise',

  /**
    * @name ErrorsCore.E0110
    */
  E0110: 'Unknown validation group is detected',

  /**
    * @name ErrorsCore.E0120
    */
  E0120: 'Adapter for a DevExpressValidator component cannot be configured',

  /**
    * @name ErrorsCore.E0121
    */
  E0121: 'The \'customItem\' parameter of the \'onCustomItemCreating\' function is empty or contains invalid data. Assign a custom object or a Promise that is resolved after the item is created.',

  /**
    * @name ErrorsCore.W0000
    */
  W0000: '\'{0}\' is deprecated in {1}. {2}',

  /**
    * @name ErrorsCore.W0001
    */
  W0001: '{0} - \'{1}\' option is deprecated in {2}. {3}',

  /**
    * @name ErrorsCore.W0002
    */
  W0002: '{0} - \'{1}\' method is deprecated in {2}. {3}',

  /**
    * @name ErrorsCore.W0003
    */
  W0003: '{0} - \'{1}\' property is deprecated in {2}. {3}',

  /**
    * @name ErrorsCore.W0004
    */
  W0004: 'Timeout for theme loading is over: {0}',

  /**
    * @name ErrorsCore.W0005
    */
  W0005: '\'{0}\' event is deprecated in {1}. {2}',

  /**
    * @name ErrorsCore.W0006
    */
  W0006: 'Invalid recurrence rule: \'{0}\'',

  /**
    * @name ErrorsCore.W0007
    */
  W0007: '\'{0}\' Globalize culture is not defined',

  /**
    * @name ErrorsCore.W0008
    */
  W0008: 'Invalid view name: \'{0}\'',

  /**
    * @name ErrorsCore.W0009
    */
  W0009: 'Invalid time zone name: \'{0}\'',

  /**
    * @name ErrorsCore.W0010
    */
  W0010: '{0} is deprecated in {1}. {2}',

  /**
    * @name ErrorsCore.W0011
    */
  W0011: 'Number parsing is invoked while the parser is not defined',

  /**
    * @name ErrorsCore.W0012
    */
  W0012: 'Date parsing is invoked while the parser is not defined',

  /**
    * @name ErrorsCore.W0013
    */
  W0013: '\'{0}\' file is deprecated in {1}. {2}',

  /**
    * @name ErrorsCore.W0014
    */
  W0014: '{0} - \'{1}\' type is deprecated in {2}. {3}',

  /**
    * @name ErrorsCore.W0015
    */
  W0015: 'Instead of returning a value from the \'{0}\' function, write it into the \'{1}\' field of the function\'s parameter.',

  /**
    * @name ErrorsCore.W0016
    */
  W0016: 'The "{0}" option does not accept the "{1}" value since v{2}. {3}.',
  /**
    * @name ErrorsCore.W0017
    */
  W0017: 'Setting the "{0}" property with a function is deprecated since v21.2',
  /**
    * @name ErrorsCore.W0018
    */
  W0018: 'Setting the "position" property with a function is deprecated since v21.2',
  /**
    * @name ErrorsCore.W0019
    */
  W0019: 'DevExtreme: Unable to Locate a Valid License Key.\n\n'
        + 'Detailed license/registration related information and instructions: https://js.devexpress.com/Documentation/Licensing/.\n\n'
        + 'If you are using a 30-day trial version of DevExtreme, you must uninstall all copies of DevExtreme once your 30-day trial period expires. For terms and conditions that govern use of DevExtreme UI components/libraries, please refer to the DevExtreme End User License Agreement: https://js.devexpress.com/EULAs/DevExtremeComplete.\n\n'
        + 'To use DevExtreme in a commercial project, you must purchase a license. For pricing/licensing options, please visit: https://js.devexpress.com/Buy.\n\n'
        + 'If you have licensing-related questions or need help with a purchase, please email clientservices@devexpress.com.\n\n',
  /**
     * @name ErrorsCore.W0020
     */
  W0020: 'DevExtreme: License Key Has Expired.\n\n'
        + 'Detailed license/registration related information and instructions: https://js.devexpress.com/Documentation/Licensing/.\n\n'
        + 'A mismatch exists between the license key used and the DevExtreme version referenced in this project.\n\n'
        + 'To proceed, you can:\n'
        + '• use a version of DevExtreme linked to your license key: https://www.devexpress.com/ClientCenter/DownloadManager\n'
        + '• renew your DevExpress Subscription: https://www.devexpress.com/buy/renew (once you renew your subscription, you will be entitled to product updates and support service as defined in the DevExtreme End User License Agreement)\n\n'
        + 'If you have licensing-related questions or need help with a renewal, please email clientservices@devexpress.com.\n\n',
  /**
     * @name ErrorsCore.W0021
     */
  W0021: 'DevExtreme: License Key Verification Has Failed.\n\n'
        + 'Detailed license/registration related information and instructions: https://js.devexpress.com/Documentation/Licensing/.\n\n'
        + 'To verify your DevExtreme license, make certain to specify a correct key in the GlobalConfig. If you continue to encounter this error, please visit https://www.devexpress.com/ClientCenter/DownloadManager to obtain a valid license key.\n\n'
        + 'If you have a valid license and this problem persists, please submit a support ticket via the DevExpress Support Center. We will be happy to follow-up: https://supportcenter.devexpress.com/ticket/create.\n\n',
  /**
     * @name ErrorsCore.W0022
     */
  W0022: 'DevExtreme: Pre-release software. Not suitable for commercial use.\n\n'
        + 'Detailed license/registration related information and instructions: https://js.devexpress.com/Documentation/Licensing/.\n\n'
        + 'Pre-release software may contain deficiencies and as such, should not be considered for use or integrated in any mission critical application.\n\n',
  /**
     * @name ErrorsCore.W0023
     */
  W0023: 'DevExtreme: the following \'devextreme\' package version does not match versions of other DevExpress products used in this application:\n\n'
        + '{0}\n\n'
        + 'Interoperability between different versions of the products listed herein cannot be guaranteed.\n\n',
});
