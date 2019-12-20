var proto = require('./tree_map.base').prototype,
    nodeProto = require('./node').prototype,
    expand = require('../core/helpers').expand,
    common = require('./common'),

    _parseScalar = require('../core/utils').parseScalar,
    _buildRectAppearance = common.buildRectAppearance,

    STATE_CODE = 1;

require('./api');
require('./states');

proto._eventsMap.onHoverChanged = { name: 'hoverChanged' };

expand(proto._handlers, 'calculateAdditionalStates', function(states, options) {
    states[1] = options.hoverStyle ? _buildRectAppearance(options.hoverStyle) : {};
});

require('./tree_map.base').addChange({
    code: 'HOVER_ENABLED',
    handler: function() {
        var hoverEnabled = _parseScalar(this._getOption('hoverEnabled', true), true);
        if(!hoverEnabled) {
            this.clearHover();
        }
        this._hoverEnabled = hoverEnabled;
    },
    isThemeDependent: true,
    isOptionChange: true,
    option: 'hoverEnabled'
});

nodeProto.statesMap[1] = 1;
nodeProto.additionalStates.push(1);

expand(proto, '_extendProxyType', function(proto) {
    var that = this;

    proto.setHover = function() {
        that._hoverNode(this._id);
    };
    proto.isHovered = function() {
        return that._hoverIndex === this._id;
    };
});

expand(proto, '_onNodesCreated', function() {
    this._hoverIndex = -1;
});

expand(proto, '_changeGroupSettings', function() {
    var that = this;
    that._groupHoverEnabled = _parseScalar(that._getOption('group').hoverEnabled, true);
    if(!that._groupHoverEnabled) {
        that.clearHover();
    }
});

proto._applyHoverState = function(index, state) {
    setNodeStateRecursive(this._nodes[index], STATE_CODE, state);
    this._eventTrigger('hoverChanged', { node: this._nodes[index].proxy });
};

function setNodeStateRecursive(node, code, state) {
    var nodes = node.isNode() && node.nodes,
        i,
        ii = nodes && nodes.length;

    node.setState(code, state);
    for(i = 0; i < ii; ++i) {
        setNodeStateRecursive(nodes[i], code, state);
    }
}

proto._hoverNode = function(index) {
    var that = this,
        currentIndex = that._hoverIndex;

    if(that._hoverEnabled && currentIndex !== index) {
        if(!that._groupHoverEnabled && index >= 0 && that._nodes[index].isNode()) {
            that.clearHover();
            return;
        }
        that._context.suspend();
        that._hoverIndex = -1;
        if(currentIndex >= 0) {
            that._applyHoverState(currentIndex, false);
        }
        that._hoverIndex = index;
        if(index >= 0) {
            that._applyHoverState(index, true);
        }
        that._context.resume();
    }
};

proto.clearHover = function() {
    this._hoverNode(-1);
};
