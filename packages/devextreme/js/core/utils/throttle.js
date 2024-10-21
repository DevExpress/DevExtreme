export function throttle(func, delay) {
    let timestamp = 0;

    return function(...args) {
        const now = Date.now();

        if(now - timestamp >= delay) {
            func.apply(this, args);

            timestamp = now;
        }
    };
}
