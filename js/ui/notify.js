const $ = require('../core/renderer');
const Action = require('../core/action');
const viewPortUtils = require('../core/utils/view_port');
const extend = require('../core/utils/extend').extend;
const isPlainObject = require('../core/utils/type').isPlainObject;
const Toast = require('./toast');


let $notify = null;

const notify = function(message, /* optional */ type, displayTime) {
    const options = isPlainObject(message) ? message : { message: message };

    const userHiddenAction = options.onHidden;

    extend(options, {
        type: type,
        displayTime: displayTime,
        onHidden: function(args) {
            $(args.element).remove();

            new Action(userHiddenAction, {
                context: args.model
            }).execute(arguments);
        }
    });

    $notify = $('<div>').appendTo(viewPortUtils.value());
    new Toast($notify, options).show();
};

/**
 * @name ui.notify
 * @static
 * @publicName notify(message,type,displayTime)
 * @param1 message:string
 * @param2 type:string|undefined
 * @param3 displayTime:integer|undefined
 * @module ui/notify
 * @export default
 */
/**
 * @name ui.notify
 * @static
 * @publicName notify(options,type,displayTime)
 * @param1 options:object
 * @param2 type:string|undefined
 * @param3 displayTime:integer|undefined
 * @module ui/notify
 * @export default
 */
module.exports = notify;
