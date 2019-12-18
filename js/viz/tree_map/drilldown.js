var proto = require('./tree_map.base').prototype,
    _expand = require('../core/helpers').expand;

require('./api');

proto._eventsMap.onDrill = { name: 'drill' };

_expand(proto, '_extendProxyType', function(proto) {
    var that = this;

    proto.drillDown = function() {
        that._drillToNode(this._id);
    };
});

_expand(proto, '_onNodesCreated', function() {
    this._drilldownIndex = -1;
});

proto._drillToNode = function(index) {
    var that = this,
        node;

    if(that._drilldownIndex !== index) {
        node = that._nodes[index] || that._root;
        if(node.nodes) {
            that._drilldownIndex = index;
            that._topNode = node;
            that._context.suspend();
            that._context.change(['MAX_DEPTH', 'NODES_RESET']);
            that._context.resume();
            that._eventTrigger('drill', { node: node.proxy });
        }
    }
};

proto.resetDrillDown = function() {
    this._drillToNode(-1);
    return this;
};

proto.drillUp = function() {
    this._drillToNode(this._topNode.parent._id || -1);
    return this;
};

proto.getCurrentNode = function() {
    return this._topNode.proxy;
};
