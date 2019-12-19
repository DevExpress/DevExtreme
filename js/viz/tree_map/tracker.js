var proto = require('./tree_map.base').prototype,
    Tracker = require('../components/tracker').Tracker,
    expand = require('../core/helpers').expand,
    _parseScalar = require('../core/utils').parseScalar,
    DATA_KEY_BASE = '__treemap_data_',
    dataKeyModifier = 0;

require('./api');
require('./hover');
require('./tooltip');

proto._eventsMap.onClick = { name: 'click' };

expand(proto, '_initCore', function() {
    var that = this,
        dataKey = DATA_KEY_BASE + dataKeyModifier++,
        getProxy = function(index) {
            return that._nodes[index].proxy;
        };

    that._tracker = new Tracker({
        widget: that,
        root: that._renderer.root,
        getNode: function(id) {
            var proxy = getProxy(id),
                interactWithGroup = _parseScalar(that._getOption('interactWithGroup', true));

            return interactWithGroup && proxy.isLeaf() && proxy.getParent().isActive() ? proxy.getParent() : proxy;
        },
        getData: function(e) {
            var target = e.target;
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
