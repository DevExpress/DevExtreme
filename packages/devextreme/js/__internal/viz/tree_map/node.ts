/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { extend as _extend } from '@js/core/utils/extend';

function Node() { }

const updateTile = [updateLeaf, updateGroup];

_extend(Node.prototype, {
  value: 0,

  isNode() {
    return !!(this.nodes && this.level < this.ctx.maxLevel);
  },

  isActive() {
    const { ctx } = this;

    return this.level >= ctx.minLevel && this.level <= ctx.maxLevel;
  },

  updateStyles() {
    const that = this;
    const isNode = Number(that.isNode());

    that.state = that._buildState(that.ctx.settings[isNode].state, !isNode && that.color && { fill: that.color });
  },

  _buildState(state, extra) {
    const base = _extend({}, state);

    return extra ? _extend(base, extra) : base;
  },

  updateLabelStyle() {
    const settings = this.ctx.settings[Number(this.isNode())];

    this.labelState = settings.labelState;
    this.labelParams = settings.labelParams;
  },

  _getState() {
    return this.state;
  },

  applyState() {
    updateTile[Number(this.isNode())](this.tile, this._getState());
  },
});

function updateLeaf(content, attrs) {
  content.smartAttr(attrs);
}

function updateGroup(content, attrs) {
  content.outer.attr({ stroke: attrs.stroke, 'stroke-width': attrs['stroke-width'], 'stroke-opacity': attrs['stroke-opacity'] });
  content.inner.smartAttr({ fill: attrs.fill, opacity: attrs.opacity, hatching: attrs.hatching });
}

export default Node;
