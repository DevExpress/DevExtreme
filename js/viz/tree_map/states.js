const proto = require('./tree_map.base').prototype;
const nodeProto = require('./node').prototype;

const handlers = proto._handlers;
const _calculateState = handlers.calculateState;
const _buildState = nodeProto._buildState;
const _extend = require('../../core/utils/extend').extend;

handlers.calculateState = function(options) {
    const states = { 0: _calculateState(options) };

    handlers.calculateAdditionalStates(states, options);
    return states;
};

handlers.calculateAdditionalStates = require('../../core/utils/common').noop;

nodeProto.code = 0;

nodeProto.statesMap = { 0: 0 };

nodeProto.additionalStates = [];

nodeProto._buildState = function(state, extra) {
    const states = { 0: _buildState(state[0], extra) };

    if(this.additionalStates.length) {
        buildAdditionalStates(states, states[0], state, this.additionalStates);
    }
    return states;
};

nodeProto._getState = function() {
    return this.state[this.statesMap[this.code]];
};

nodeProto.setState = function(code, state) {
    if(state) {
        this.code |= code;
    } else {
        this.code &= ~code;
    }
    this.ctx.change(['TILES']);
};

function buildAdditionalStates(states, base, source, list) {
    let i;
    const ii = list.length;

    for(i = 0; i < ii; ++i) {
        states[list[i]] = _extend({}, base, source[list[i]]);
    }
}
