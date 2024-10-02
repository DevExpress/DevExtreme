import $ from '../renderer';
import readyCallbacks from './ready_callbacks';
const ready = readyCallbacks.add;
import callbacks from './callbacks';
const changeCallback = callbacks();
let $originalViewPort = $();

const value = (function() {
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

export {
    value,
    changeCallback
};

export function originalViewPort() {
    return $originalViewPort;
}
