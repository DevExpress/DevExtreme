var proto = require('./funnel').prototype,
    Tracker = require('../components/tracker').Tracker,
    DATA_KEY_BASE = '__funnel_data_',
    isDefined = require('../../core/utils/type').isDefined,
    dataKeyModifier = 0;

proto._eventsMap.onItemClick = { name: 'itemClick' };
proto._eventsMap.onLegendClick = { name: 'legendClick' };

exports.plugin = {
    name: 'tracker',
    init: function() {
        var that = this,
            dataKey = DATA_KEY_BASE + dataKeyModifier++,
            getProxyData = function(e) {
                var rootOffset = that._renderer.getRootOffset(),
                    x = Math.floor(e.pageX - rootOffset.left),
                    y = Math.floor(e.pageY - rootOffset.top);

                return that._hitTestTargets(x, y);
            };

        that._tracker = new Tracker({
            widget: that,
            root: that._renderer.root,
            getData: function(e, tooltipData) {
                var target = e.target,
                    data = target[dataKey],
                    proxyData;
                if(isDefined(data)) {
                    return data;
                }
                proxyData = getProxyData(e);

                if(tooltipData && proxyData && proxyData.type !== 'inside-label') {
                    return;
                }

                return proxyData && proxyData.id;
            },
            getNode: function(index) {
                return that._items[index];
            },
            click: function(e) {
                var proxyData = getProxyData(e.event),
                    dataType = proxyData && proxyData.type,
                    event = dataType === 'legend' ? 'legendClick' : 'itemClick';

                that._eventTrigger(event, {
                    item: e.node,
                    event: e.event
                });
            }
        });

        ///#DEBUG
        exports._TESTS_dataKey = dataKey;
        ///#ENDDEBUG

        this._dataKey = dataKey;
    },
    dispose: function() {
        this._tracker.dispose();
    },
    extenders: {
        _change_TILING: function() {
            var dataKey = this._dataKey;
            this._items.forEach(function(item, index) {
                item.element.data(dataKey, index);
            });
        }
    }
};

