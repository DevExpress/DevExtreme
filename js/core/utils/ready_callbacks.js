const domAdapter = require("../dom_adapter");
const injector = require("./dependency_injector");
const windowUtils = require("./window");
const callOnce = require("./call_once");
let callbacks = [];

const isReady = () => {
    // NOTE: we can't use document.readyState === "interactive" because of ie9/ie10 support
    return domAdapter.getReadyState() === "complete" || (domAdapter.getReadyState() !== "loading" && !domAdapter.getDocumentElement().doScroll);
};

const subscribeReady = callOnce(() => {
    const removeListener = domAdapter.listen(domAdapter.getDocument(), "DOMContentLoaded", () => {
        readyCallbacks.fire();
        removeListener();
    });
});

const readyCallbacks = {
    add: callback => {
        const hasWindow = windowUtils.hasWindow();

        if(hasWindow && isReady()) {
            callback();
        } else {
            callbacks.push(callback);
            hasWindow && subscribeReady();
        }
    },
    fire: () => {
        callbacks.forEach(callback => callback());
        callbacks = [];
    }
};

module.exports = injector(readyCallbacks);
