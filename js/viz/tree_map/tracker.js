const proto = require('./tree_map.base').prototype;
const Tracker = require('../components/tracker').Tracker;
const expand = require('../core/helpers').expand;
const _parseScalar = require('../core/utils').parseScalar;
const DATA_KEY_BASE = '__treemap_data_';
let dataKeyModifier = 0;

require('./api');
require('./hover');
require('./tooltip');

proto._eventsMap.onClick = { name: 'click' };

expand(proto, '_initCore', function() {
    const that = this;
    const dataKey = DATA_KEY_BASE + dataKeyModifier++;
    const getProxy = function(index) {
        return that._nodes[index].proxy;
    };

    that._tracker = new Tracker({
        widget: that,
        root: that._renderer.root,
        getNode: function(id) {
            const proxy = getProxy(id);
            const interactWithGroup = _parseScalar(that._getOption('interactWithGroup', true));

            return interactWithGroup && proxy.isLeaf() && proxy.getParent().isActive() ? proxy.getParent() : proxy;
        },
        getData: function(e) {
            const target = e.target;
            return (target.tagName === 'tspan' ? target.parentNode : target)[dataKey];
        },
        getProxy: getProxy,
        click: function(e) {
            that._eventTrigger('click', e);
        }
    });
    that._handlers.setTrackerData = function(node, element) {
        element.data(dataKey, node._id);
    };

    ///#DEBUG
    exports._TESTS_dataKey = dataKey;
    ///#ENDDEBUG
});

expand(proto, '_disposeCore', function() {
    this._tracker.dispose();
});
