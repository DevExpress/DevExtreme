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

module.exports = notify;
