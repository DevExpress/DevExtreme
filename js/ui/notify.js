"use strict";

var $ = require("jquery"),
    Action = require("../core/action"),
    viewPortUtils = require("../core/utils/view_port"),
    Toast = require("./toast");


var $notify = null;

var notify = function(message, /* optional */ type, displayTime) {
    var options = $.isPlainObject(message) ? message : { message: message };

    var userHiddenAction = options.onHidden;

    $.extend(options, {
        type: type,
        displayTime: displayTime,
        onHidden: function(args) {
            args.element.remove();

            new Action(userHiddenAction, {
                context: args.model
            }).execute(arguments);
        }
    });

    $notify = $("<div>").appendTo(viewPortUtils.value());
    new Toast($notify, options).show();
};

/**
 * @name ui_notify
 * @publicName notify(message,type,displayTime)
 * @param1 message:string
 * @param2 type:string
 * @param3 displayTime:integer
 * @module ui/notify
 * @export default
 */
/**
 * @name ui_notify
 * @publicName notify(options)
 * @param1 options:object
 * @module ui/notify
 * @export default
 */
module.exports = notify;
