export const waitAsync = (timeout = 0, clock = undefined) =>
    clock
        ? clock.tickAsync(timeout)
        : new Promise((resolve) => setTimeout(resolve, timeout));

export const waitForAsync = (condition, clock = undefined, timeout = 500, step = 10) => {
    const startTime = Date.now();
    const loop = () => {
        if(!condition() && Date.now() - startTime < timeout) {
            return waitAsync(step, clock).then(loop);
        }
    };

    return Promise.resolve().then(loop);
};

export const waitGlobalFailure = () => {
    return new Promise((resolve) => {
        const original = QUnit.onUncaughtException;
        QUnit.onUncaughtException = function(message) {
            QUnit.onUncaughtException = original;

            resolve(message);
            return false;
        };
    });
};
