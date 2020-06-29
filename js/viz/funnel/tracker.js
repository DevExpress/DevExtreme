import Funnel from './funnel';
import { Tracker } from '../components/tracker';
const DATA_KEY_BASE = '__funnel_data_';
import { isDefined } from '../../core/utils/type';
let dataKeyModifier = 0;
const proto = Funnel.prototype;
///#DEBUG
let _TESTS_dataKey;
///#ENDDEBUG
proto._eventsMap.onItemClick = { name: 'itemClick' };
proto._eventsMap.onLegendClick = { name: 'legendClick' };

const getDataKey = function() {
    return DATA_KEY_BASE + dataKeyModifier++;
};

export const plugin = {
    name: 'tracker',
    init: function() {
        const that = this;
        const dataKey = getDataKey();
        ///#DEBUG
        _TESTS_dataKey = dataKey;
        ///#ENDDEBUG
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
                if(isDefined(data)) {
                    return data;
                }
                const proxyData = getProxyData(e);

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
///#DEBUG
export { _TESTS_dataKey };
///#ENDDEBUG

