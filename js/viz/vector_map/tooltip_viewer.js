var TOOLTIP_OFFSET = 12;

// TODO: Somehow it should be merged with the core.Tooltip
function TooltipViewer(params) {
    this._subscribeToTracker(params.tracker, params.tooltip, params.layerCollection);
}

TooltipViewer.prototype = {
    constructor: TooltipViewer,

    dispose: function() {
        this._offTracker();
        this._offTracker = null;
    },

    _subscribeToTracker: function(tracker, tooltip, layerCollection) {
        this._offTracker = tracker.on({
            'focus-on': function(arg) {
                var result = false,
                    layer,
                    proxy;
                if(tooltip.isEnabled()) {
                    layer = layerCollection.byName(arg.data.name);
                    proxy = layer && layer.getProxy(arg.data.index);
                    if(proxy && tooltip.show(proxy, { x: 0, y: 0, offset: 0 }, { target: proxy })) {
                        tooltip.move(arg.x, arg.y, TOOLTIP_OFFSET);
                        result = true;
                    }
                }
                arg.done(result);
            },
            // There are no checks for `tooltip.isEnabled()` in the following two handlers because they are called only if the previous one has finished with `true`
            'focus-move': function(arg) {
                tooltip.move(arg.x, arg.y, TOOLTIP_OFFSET);
            },
            'focus-off': function() {
                tooltip.hide();
            }
        });
    }
};

exports.TooltipViewer = TooltipViewer;
