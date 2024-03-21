QUnit.timersDetector.ignoreRules.register(function(args) {
    const timerType = args.timerType;
    const callback = String(args.callback).replace(/\s|"use strict";/g, '');

    // NOTE:
    // 1. Implementation: https://github.com/angular/angular.js/blob/v1.5.x/src/ng/raf.js#L29
    // 2. Usage: https://github.com/angular/angular.js/blob/v1.5.x/src/ng/animateRunner.js#L10
    if(timerType === 'animationFrames' && [
        'function(){for(vara=0;a<d.length;a++)d[a]();d=[]}',
        'function(){for(vari=0;i<waitQueue.length;i++){waitQueue[i]();}waitQueue=[];}'
    ].indexOf(callback) > -1) {
        return true;
    }

    if(
        timerType === 'timeouts' &&
        (callback.indexOf('delete pendingDeferIds[timeoutId];') > -1 ||
        callback.indexOf('delete F[c];e(a)}') > -1)
    ) {
        return true;
    }
});
