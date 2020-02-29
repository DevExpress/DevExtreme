const proto = require('./funnel').prototype;
const Tracker = require('../components/tracker').Tracker;
const DATA_KEY_BASE = '__funnel_data_';
const isDefined = require('../../core/utils/type').isDefined;
let dataKeyModifier = 0;

proto._eventsMap.onItemClick = { name: 'itemClick' };
proto._eventsMap.onLegendClick = { name: 'legendClick' };

exports.plugin = {
    name: 'tracker',
    init: function() {
        const that = this;
        const dataKey = DATA_KEY_BASE + dataKeyModifier++;
        const getProxyData = function(e) {
            const rootOffset = that._renderer.getRootOffset();
            const x = Math.floor(e.pageX - rootOffset.left);
            const y = Math.floor(e.pageY - rootOffset.top);

            return that._hitTestTargets(x, y);
        };

        that._tracker = new Tracker({
            widget: that,
            root: that._renderer.root,
            getData: function(e, tooltipData) {
                const target = e.target;
                const data = target[dataKey];
                let proxyData;
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
                const proxyData = getProxyData(e.event);
                const dataType = proxyData && proxyData.type;
                const event = dataType === 'legend' ? 'legendClick' : 'itemClick';

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
            const dataKey = this._dataKey;
            this._items.forEach(function(item, index) {
                item.element.data(dataKey, index);
            });
        }
    }
};

