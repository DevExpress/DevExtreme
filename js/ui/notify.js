var $ = require('../core/renderer'),
    Action = require('../core/action'),
    viewPortUtils = require('../core/utils/view_port'),
    extend = require('../core/utils/extend').extend,
    isPlainObject = require('../core/utils/type').isPlainObject,
    Toast = require('./toast');


var $notify = null;

var notify = function(message, /* optional */ type, displayTime) {
    var options = isPlainObject(message) ? message : { message: message };

    var userHiddenAction = options.onHidden;

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
