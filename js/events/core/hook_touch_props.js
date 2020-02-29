const touchPropsToHook = ['pageX', 'pageY', 'screenX', 'screenY', 'clientX', 'clientY'];
const touchPropHook = function(name, event) {
    if(event[name] && !event.touches || !event.touches) {
        return event[name];
    }

    const touches = event.touches.length ? event.touches : event.changedTouches;
    if(!touches.length) {
        return;
    }

    return touches[0][name];
};

module.exports = function(callback) {
    touchPropsToHook.forEach(function(name) {
        callback(name, function(event) {
            return touchPropHook(name, event);
        });
    }, this);
};
