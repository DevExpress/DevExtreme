/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */

import { extend as _extend } from '@ts/core/utils/m_extend';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

const updateTile = [updateLeaf, updateGroup];

class Node {
  declare _id: number;

  declare value: number;

  declare parent: ThemeValue;

  declare index: number;

  declare data: ThemeValue;

  declare label: ThemeValue;

  declare proxy: ThemeValue;

  declare code: number;

  declare statesMap: Record<number, number>;

  declare additionalStates: number[];

  declare setState: (code: number, state: boolean) => void;

  declare ctx: ThemeValue;

  declare nodes?: Node[];

  declare level: number;

  declare color?: string;

  declare tile: ThemeValue;

  declare state: ThemeValue;

  declare labelState: ThemeValue;

  declare labelParams: ThemeValue;

  isNode(): boolean {
    return !!(this.nodes && this.level < this.ctx.maxLevel);
  }

  isActive(): boolean {
    const { ctx } = this;

    return this.level >= ctx.minLevel && this.level <= ctx.maxLevel;
  }

  updateStyles(): void {
    const isNode = Number(this.isNode());

    this.state = this._buildState(this.ctx.settings[isNode].state, !isNode && this.color && { fill: this.color });
  }

  _buildState(state: ThemeValue, extra: ThemeValue): ThemeValue {
    const base = _extend({}, state);

    return extra ? _extend(base, extra) : base;
  }

  updateLabelStyle(): void {
    const settings = this.ctx.settings[Number(this.isNode())];

    this.labelState = settings.labelState;
    this.labelParams = settings.labelParams;
  }

  _getState(): ThemeValue {
    return this.state;
  }

  applyState(): void {
    updateTile[Number(this.isNode())](this.tile, this._getState());
  }
}

_extend(Node.prototype, {
  value: 0,
});

function updateLeaf(content: ThemeValue, attrs: ThemeValue): void {
  content.smartAttr(attrs);
}

function updateGroup(content: ThemeValue, attrs: ThemeValue): void {
  content.outer.attr({ stroke: attrs.stroke, 'stroke-width': attrs['stroke-width'], 'stroke-opacity': attrs['stroke-opacity'] });
  content.inner.smartAttr({ fill: attrs.fill, opacity: attrs.opacity, hatching: attrs.hatching });
}

export default Node;
