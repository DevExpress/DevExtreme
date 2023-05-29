export const visualViewportCallback = (() => {
    const callbacks = {};

    return {
        add(event, callback) {
            callbacks[event] = callback;
        },
        remove(event) {
            callbacks[event] = null;
        },
        get(event) {
            return callbacks[event];
        },
    };
})();
