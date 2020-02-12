QUnit.timersDetector.ignoreRules.register(function(args) {
    const timerType = args.timerType;
    const callback = String(args.callback).replace(/\s/g, '');
    const stack = args.stack;

    if(
        timerType === 'timeouts' &&
        /handleDOM.*quill.js/.test(stack) &&
        callback.indexOf('function(){[nativecode]}') > -1
    ) {
        return true;
    }

});
