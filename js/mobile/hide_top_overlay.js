var inArray = require('../core/utils/array').inArray;

var hideCallback = (function() {
    var callbacks = [];
    return {
        add: function(callback) {
            var indexOfCallback = inArray(callback, callbacks);
            if(indexOfCallback === -1) {
                callbacks.push(callback);
            }
        },
        remove: function(callback) {
            var indexOfCallback = inArray(callback, callbacks);
            if(indexOfCallback !== -1) {
                callbacks.splice(indexOfCallback, 1);
            }
        },
        fire: function() {
            var callback = callbacks.pop(), result = !!callback;
            if(result) {
                callback();
            }
            return result;
        },
        hasCallback: function() {
            return callbacks.length > 0;
        }
        ///#DEBUG
        // eslint-disable-next-line comma-style
        , reset: function() {
            callbacks = [];
        }
        ///#ENDDEBUG
    };
})();

module.exports = function() {
    return hideCallback.fire();
};
module.exports.hideCallback = hideCallback;
