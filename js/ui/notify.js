import $ from '../core/renderer';
import Action from '../core/action';
import viewPortUtils from '../core/utils/view_port';
import { extend } from '../core/utils/extend';
import { isPlainObject } from '../core/utils/type';
import Toast from './toast';


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
