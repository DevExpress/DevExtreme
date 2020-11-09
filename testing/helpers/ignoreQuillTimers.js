QUnit.timersDetector.ignoreRules.register(function(args) {
    const timerType = args.timerType;
    const callback = String(args.callback).replace(/\s/g, '');
    const stack = args.stack.toLowerCase();

    if(
        timerType === 'timeouts' &&
        /handledom.*quill|register.*quill/.test(stack) &&
        (
            callback.indexOf('function(){[nativecode]}') > -1 ||
            callback.toLowerCase().indexOf('firefox') > -1
        )
    ) {
        return true;
    }

});
