const callOnce = function(handler) {
    let result;

    var wrappedHandler = function() {
        result = handler.apply(this, arguments);
        wrappedHandler = function() {
            return result;
        };
        return result;
    };

    return function() {
        return wrappedHandler.apply(this, arguments);
    };
};

module.exports = callOnce;
