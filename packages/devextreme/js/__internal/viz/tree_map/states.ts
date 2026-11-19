/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-use-before-define */

import { noop } from '@ts/core/utils/common';
import { extend as _extend } from '@ts/core/utils/extend';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import Node from '@ts/viz/tree_map/node';
import TreeMapBase from '@ts/viz/tree_map/tree_map.base';

const proto = TreeMapBase.prototype;
const nodeProto = Node.prototype;
const handlers = proto._handlers;
const _calculateState = handlers.calculateState;
const { _buildState } = nodeProto;

handlers.calculateState = function (options: ThemeValue): Record<number, ThemeValue> {
  const states = { 0: _calculateState(options) };

  handlers.calculateAdditionalStates(states, options);
  return states;
};

handlers.calculateAdditionalStates = noop;

nodeProto.code = 0;

nodeProto.statesMap = { 0: 0 };

nodeProto.additionalStates = [];

nodeProto._buildState = function (this: Node, state: ThemeValue, extra: ThemeValue): ThemeValue {
  const states = { 0: _buildState(state[0], extra) };

  if (this.additionalStates.length) {
    buildAdditionalStates(states, states[0], state, this.additionalStates);
  }
  return states;
};

nodeProto._getState = function (this: Node): ThemeValue {
  return this.state[this.statesMap[this.code]];
};

nodeProto.setState = function (this: Node, code, state): void {
  if (state) {
    this.code |= code;
  } else {
    this.code &= ~code;
  }
  this.ctx.change(['TILES']);
};

function buildAdditionalStates(states, base, source, list): void {
  let i;
  const ii = list.length;

  for (i = 0; i < ii; i += 1) {
    states[list[i]] = _extend({}, base, source[list[i]]);
  }
}
