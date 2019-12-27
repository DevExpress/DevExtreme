const inArray = require('../core/utils/array').inArray;

const hideCallback = (function() {
    let callbacks = [];
    return {
        add: function(callback) {
            const indexOfCallback = inArray(callback, callbacks);
            if(indexOfCallback === -1) {
                callbacks.push(callback);
            }
        },
        remove: function(callback) {
            const indexOfCallback = inArray(callback, callbacks);
            if(indexOfCallback !== -1) {
                callbacks.splice(indexOfCallback, 1);
            }
        },
        fire: function() {
            const callback = callbacks.pop(); const result = !!callback;
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
