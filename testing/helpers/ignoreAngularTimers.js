export default function(args) {
    const timerType = args.timerType;
    const callback = String(args.callback);

    if(
        timerType === 'timeouts' &&
        (callback.indexOf('delete pendingDeferIds[timeoutId];') > -1 ||
        callback.indexOf('delete F[c];e(a)}') > -1)
    ) {
        return true;
    }
}
