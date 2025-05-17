export const waitAsync = (timeout = 1000) => new Promise((resolve) => setTimeout(resolve, timeout));

export const waitForAsync = (condition, timeout = 1000, step = 10) => {
    const startTime = Date.now();
    const loop = () => {
        if(!condition() && Date.now() - startTime < timeout) {
            return waitAsync(step).then(loop);
        }
    };

    return Promise.resolve().then(loop);
};
