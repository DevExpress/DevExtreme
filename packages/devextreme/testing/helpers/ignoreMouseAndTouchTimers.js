QUnit.timersDetector.ignoreRules.register(function(args) {
    const timerType = args.timerType;
    const callback = String(args.callback);

    if(timerType === 'timeouts' && callback.indexOf('that._mouseLocked = false') > -1) {
        return true;
    }

    return false;
});
