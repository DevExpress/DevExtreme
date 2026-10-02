/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable @stylistic/max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { isDefined } from '@js/core/utils/type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { patchFontOptions } from '@ts/viz/core/utils';
import type Link from '@ts/viz/sankey/link_item';

const states = ['normal', 'hover'];

interface NodeAttrs {
  fill: string;
  'stroke-width': number;
  stroke: string;
  'stroke-opacity': number;
  opacity: number;
  hatching: ThemeValue;
}

interface NodeRect {
  x: number;
  y: number;
  width: number;
  height: number;
  _name: string;
}

interface NodeLayoutLink {
  index: number;
  weight: number;
}

interface NodeWidget {
  _renderer: { getRootOffset: () => { left: number; top: number } };
  _tooltip?: { show: (target: ThemeValue, coords: { x: number; y: number }) => void; hide: () => void };
  _links: Link[];
  _getOption: (name: string, isScalar?: boolean) => ThemeValue;
  _suspend: () => void;
  _resume: () => void;
  _eventTrigger: (name: string, args: ThemeValue) => void;
  _applyNodesAppearance: () => void;
  _applyLinksAppearance: () => void;
  clearHover: () => void;
}

interface NodeParams {
  id: number;
  color: string;
  rect: NodeRect;
  options: ThemeValue;
  linksIn: NodeLayoutLink[];
  linksOut: NodeLayoutLink[];
}

function compileAttrs(color: string, itemOptions: ThemeValue, itemBaseOptions?: ThemeValue): NodeAttrs {
  const border = itemOptions.border;
  const baseBorder = itemBaseOptions.border;
  const borderVisible = isDefined(border.visible) ? border.visible : baseBorder.visible;
  const borderWidth = isDefined(border.width) ? border.width : baseBorder.width;
  const borderOpacity = isDefined(border.opacity) ? border.opacity : isDefined(baseBorder.opacity) ? baseBorder.opacity : 1;
  const opacity = isDefined(itemOptions.opacity) ? itemOptions.opacity : isDefined(itemBaseOptions.opacity) ? itemBaseOptions.opacity : 1;

  return {
    fill: itemOptions.color || color,
    'stroke-width': borderVisible ? borderWidth : 0,
    stroke: itemOptions.border.color || itemBaseOptions.border.color,
    'stroke-opacity': borderOpacity,
    opacity,
    hatching: itemOptions.hatching,
  };
}

function compileLabelAttrs(labelOptions: ThemeValue, filter: ThemeValue, node: Node): { attr: Record<string, ThemeValue>; css: ThemeValue } {
  const _patchFontOptions = patchFontOptions;

  if (labelOptions.useNodeColors) {
    labelOptions.font.color = node.color;
  }

  const borderVisible = isDefined(labelOptions.border.visible) ? labelOptions.border.visible : false;
  const borderWidth = isDefined(labelOptions.border.width) ? labelOptions.border.width : 0;
  const borderColor = isDefined(labelOptions.border.color) ? labelOptions.border.color : labelOptions.font.color;
  const borderOpacity = isDefined(labelOptions.border.opacity) ? labelOptions.border.opacity : 1;
  const attr: Record<string, ThemeValue> = {
    filter,
  };

  if (borderVisible && borderWidth) {
    attr.stroke = borderColor;
    attr['stroke-width'] = borderVisible ? borderWidth : 0;
    attr['stroke-opacity'] = borderOpacity;
  }

  return {
    attr,
    css: _patchFontOptions(labelOptions.font),
  };
}

class Node {
  declare code: number;

  declare widget: NodeWidget;

  declare color: string;

  declare options: ThemeValue;

  declare rect: NodeRect;

  declare label: string;

  declare coords: { x: number; y: number };

  declare id: number;

  declare linksIn: NodeLayoutLink[];

  declare linksOut: NodeLayoutLink[];

  declare states: Record<'normal' | 'hover', NodeAttrs>;

  constructor(widget: NodeWidget, params: NodeParams) {
    const widgetOffset = widget._renderer.getRootOffset();

    this.code = 0;
    this.widget = widget;

    this.color = params.color;
    this.options = params.options;
    this.rect = params.rect;
    this.label = params.rect._name;
    this.coords = {
      x: params.rect.x + params.rect.width / 2 + widgetOffset.left,
      y: params.rect.y + params.rect.height / 2 + widgetOffset.top,
    };
    this.id = params.id;
    this.linksIn = params.linksIn;
    this.linksOut = params.linksOut;

    this.states = {
      normal: compileAttrs(this.color, this.options, this.options),
      hover: compileAttrs(this.color, this.options.hoverStyle, this.options),
    };
  }

  compileAttrs(): NodeAttrs {
    return compileAttrs(this.color, this.options);
  }

  getState(): string {
    return states[this.code];
  }

  isHovered(): boolean {
    return !!(this.code & 1);
  }

  setState(code: number, state: boolean): void {
    if (state) {
      this.code |= code;
    } else {
      this.code &= ~code;
    }

    if (state) {
      this.linksIn.concat(this.linksOut).forEach((adjacentLink) => {
        this.widget._links[adjacentLink.index].setAdjacentNodeHover();
      });
    } else {
      this.widget._links.forEach((link) => {
        link.isAdjacentNodeHovered() && link.adjacentNodeHover(false);
      });
      this.hideTooltip();
    }

    this.widget._applyNodesAppearance();
    this.widget._applyLinksAppearance();
  }

  hover(state: boolean): void {
    if (!this.widget._getOption('hoverEnabled', true) || state === this.isHovered()) {
      return;
    }

    this.widget._suspend();
    state && this.widget.clearHover();
    this.setState(1, state);
    this.widget._eventTrigger('nodeHoverChanged', { target: this });
    this.widget._resume();
  }

  setHover(): void {
    this.hover(true);
  }

  showTooltip(coords?: number[]): void {
    this.widget._getOption('hoverEnabled', true) && this.widget._tooltip && this.widget._tooltip.show({
      type: 'node',
      info: {
        label: this.label,
        title: this.label,
        weightIn: this.linksIn.reduce((previousValue, currentValue) => previousValue + currentValue.weight, 0),
        weightOut: this.linksOut.reduce((previousValue, currentValue) => previousValue + currentValue.weight, 0),
      },
    }, typeof coords !== 'undefined' ? { x: coords[0], y: coords[1] } : this.coords);
  }

  hideTooltip(): void {
    this.widget._tooltip && this.widget._tooltip.hide();
  }

  getLabelAttributes(labelSettings: ThemeValue, filter: ThemeValue): { attr: Record<string, ThemeValue>; css: ThemeValue } {
    return compileLabelAttrs(labelSettings, filter, this);
  }
}

export default Node;
