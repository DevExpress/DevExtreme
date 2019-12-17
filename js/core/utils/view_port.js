var $ = require('../renderer'),
    readyCallbacks = require('./ready_callbacks'),
    ready = readyCallbacks.add,
    changeCallback = require('./callbacks')(),
    $originalViewPort = $();

var value = (function() {
    var $current;

    return function(element) {
        if(!arguments.length) {
            return $current;
        }

        var $element = $(element);
        $originalViewPort = $element;
        var isNewViewportFound = !!$element.length;
        var prevViewPort = value();
        $current = isNewViewportFound ? $element : $('body');
        changeCallback.fire(isNewViewportFound ? value() : $(), prevViewPort);
    };
})();

ready(function() {
    value('.dx-viewport');
});

exports.value = value;
exports.changeCallback = changeCallback;
exports.originalViewPort = function() {
    return $originalViewPort;
};
