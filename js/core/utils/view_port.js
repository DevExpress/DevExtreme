const $ = require('../renderer');
const readyCallbacks = require('./ready_callbacks');
const ready = readyCallbacks.add;
const changeCallback = require('./callbacks')();
let $originalViewPort = $();

var value = (function() {
    let $current;

    return function(element) {
        if(!arguments.length) {
            return $current;
        }

        const $element = $(element);
        $originalViewPort = $element;
        const isNewViewportFound = !!$element.length;
        const prevViewPort = value();
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
