export const hideCallback = (function() {
    let callbacks = [];
    return {
        add: function(callback) {
            if(!callbacks.includes(callback)) {
                callbacks.push(callback);
            }
        },
        remove: function(callback) {
            const indexOfCallback = callbacks.indexOf(callback);
            if(indexOfCallback !== -1) {
                callbacks.splice(indexOfCallback, 1);
            }
        },
        fire: function() {
            const callback = callbacks.pop();
            const result = !!callback;
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
