
(function() {
    const originalSinonTick = sinon.tick;

    sinon.tick = (ms) => {
        ms = ms ?? 10;
        originalSinonTick(ms);
    };
})();
