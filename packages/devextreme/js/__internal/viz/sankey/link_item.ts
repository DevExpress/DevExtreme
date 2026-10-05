/* eslint-disable no-nested-ternary */
/* eslint-disable @stylistic/max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { isDefined } from '@js/core/utils/type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import type { BBox } from '@ts/viz/core/types';
import { COLOR_MODE_GRADIENT, COLOR_MODE_SOURCE, COLOR_MODE_TARGET } from '@ts/viz/sankey/constants';

const states = ['normal', 'adjacentNodeHover', 'hover'];

interface LinkAttrs {
  fill: string;
  'stroke-width': number;
  stroke: string;
  'stroke-opacity': number;
  opacity: number;
  hatching: ThemeValue;
}

type LinkStates = Record<'normal' | 'adjacentNodeHover' | 'hover', LinkAttrs>;

interface LinkConnection {
  source: string;
  target: string;
  weight: number;
}

interface LinkWidget {
  _renderer: { getRootOffset: () => { left: number; top: number } };
  _tooltip?: { show: (target: ThemeValue, coords: { x: number; y: number }) => void; hide: () => void };
  _getOption: (name: string, isScalar?: boolean) => ThemeValue;
  _suspend: () => void;
  _resume: () => void;
  _eventTrigger: (name: string, args: ThemeValue) => void;
  _applyLinksAppearance: () => void;
  clearHover: () => void;
}

interface LinkParams {
  color: string;
  connection: LinkConnection;
  d: ThemeValue;
  options: ThemeValue;
  boundingRect: BBox;
  gradient: ThemeValue;
}

function compileAttrs(color: string, itemOptions: ThemeValue, itemBaseOptions: ThemeValue, gradient?: ThemeValue): LinkAttrs {
  const border = itemOptions.border;
  const baseBorder = itemBaseOptions.border;
  const borderVisible = isDefined(border.visible) ? border.visible : baseBorder.visible;
  const borderWidth = isDefined(border.width) ? border.width : baseBorder.width;
  const borderOpacity = isDefined(border.opacity) ? border.opacity : isDefined(baseBorder.opacity) ? baseBorder.opacity : 1;
  const opacity = isDefined(itemOptions.opacity) ? itemOptions.opacity : isDefined(itemBaseOptions.opacity) ? itemBaseOptions.opacity : 1;
  let fill = itemOptions.color || color;

  if (itemBaseOptions.colorMode === COLOR_MODE_TARGET || itemBaseOptions.colorMode === COLOR_MODE_SOURCE) {
    fill = color;
  } else if (itemBaseOptions.colorMode === COLOR_MODE_GRADIENT && gradient && isDefined(gradient.id)) {
    fill = gradient.id;
  }

  return {
    fill,
    'stroke-width': borderVisible ? borderWidth : 0,
    stroke: itemOptions.border.color || itemBaseOptions.border.color,
    'stroke-opacity': borderOpacity,
    opacity,
    hatching: itemOptions.hatching,
  };
}

class Link {
  declare code: number;

  declare widget: LinkWidget;

  declare color: string;

  declare connection: LinkConnection;

  declare d: ThemeValue;

  declare options: ThemeValue;

  declare boundingRect: BBox;

  declare coords: { x: number; y: number };

  declare states: LinkStates;

  declare overlayStates: LinkStates;

  constructor(widget: LinkWidget, params: LinkParams) {
    const widgetOffset = widget._renderer.getRootOffset();

    this.code = 0;
    this.widget = widget;

    this.color = params.color;
    this.connection = params.connection;
    this.d = params.d;
    this.options = params.options;
    this.boundingRect = params.boundingRect;
    this.coords = {
      x: params.boundingRect.x + params.boundingRect.width / 2 + widgetOffset.left,
      y: params.boundingRect.y + params.boundingRect.height / 2 + widgetOffset.top,
    };

    this.states = {
      normal: compileAttrs(this.color, this.options, this.options, params.gradient),
      adjacentNodeHover: compileAttrs(this.color, { opacity: 0, border: {} }, this.options, params.gradient),
      hover: compileAttrs(this.color, { opacity: 0, border: {} }, this.options, params.gradient),
    };

    this.overlayStates = {
      normal: compileAttrs(this.color, { opacity: 0, border: {} }, this.options),
      adjacentNodeHover: compileAttrs(this.color, this.options.hoverStyle, this.options),
      hover: compileAttrs(this.color, this.options.hoverStyle, this.options),
    };
  }

  getState(): string {
    return states[this.code];
  }

  isHovered(): boolean {
    return this.code === 2;
  }

  isAdjacentNodeHovered(): boolean {
    return this.code === 1;
  }

  setState(code: number, state: boolean): void {
    if (state) {
      this.code = code;
    } else {
      this.code = 0;
      this.hideTooltip();
    }

    this.widget._applyLinksAppearance();
  }

  setHover(): void {
    this.hover(true);
  }

  hover(state: boolean): void {
    if (!this.widget._getOption('hoverEnabled', true) || state === this.isHovered()) {
      return;
    }

    this.widget._suspend();
    state && this.widget.clearHover();
    this.setState(2, state);
    this.widget._eventTrigger('linkHoverChanged', { target: this });
    this.widget._resume();
  }

  adjacentNodeHover(state: boolean): void {
    if (!this.widget._getOption('hoverEnabled', true) || state === this.isAdjacentNodeHovered()) {
      return;
    }

    this.widget._suspend();
    this.setState(1, state);
    this.widget._resume();
  }

  setAdjacentNodeHover(): void {
    this.adjacentNodeHover(true);
  }

  showTooltip(coords?: number[]): void {
    this.widget._getOption('hoverEnabled', true) && this.widget._tooltip && this.widget._tooltip.show({
      type: 'link',
      info: {
        source: this.connection.source,
        target: this.connection.target,
        weight: this.connection.weight,
      },
    }, typeof coords !== 'undefined' ? { x: coords[0], y: coords[1] } : this.coords);
  }

  hideTooltip(): void {
    this.widget._tooltip && this.widget._tooltip.hide();
  }
}

export default Link;
