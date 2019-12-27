const windowUtils = require('./window');
const domAdapter = require('../dom_adapter');
const Callbacks = require('./callbacks');
const readyCallbacks = require('./ready_callbacks');
const callOnce = require('./call_once');

const resizeCallbacks = (function() {
    let prevSize;
    const callbacks = Callbacks();
    const originalCallbacksAdd = callbacks.add;
    const originalCallbacksRemove = callbacks.remove;

    if(!windowUtils.hasWindow()) {
        return callbacks;
    }

    const formatSize = function() {
        const window = windowUtils.getWindow();
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    };

    const handleResize = function() {
        const now = formatSize();
        if(now.width === prevSize.width && now.height === prevSize.height) {
            return;
        }

        let changedDimension;
        if(now.width === prevSize.width) {
            changedDimension = 'height';
        }
        if(now.height === prevSize.height) {
            changedDimension = 'width';
        }

        prevSize = now;

        callbacks.fire(changedDimension);
    };

    const setPrevSize = callOnce(function() {
        prevSize = formatSize();
    });

    let removeListener;

    callbacks.add = function() {
        const result = originalCallbacksAdd.apply(callbacks, arguments);

        setPrevSize();

        readyCallbacks.add(function() {
            if(!removeListener && callbacks.has()) {
                removeListener = domAdapter.listen(windowUtils.getWindow(), 'resize', handleResize);
            }
        });

        return result;
    };

    callbacks.remove = function() {
        const result = originalCallbacksRemove.apply(callbacks, arguments);

        if(!callbacks.has() && removeListener) {
            removeListener();
            removeListener = undefined;
        }
        return result;
    };

    return callbacks;
})();

module.exports = resizeCallbacks;
