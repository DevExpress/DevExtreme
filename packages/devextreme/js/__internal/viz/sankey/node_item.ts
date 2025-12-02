/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { isDefined } from '@js/core/utils/type';
import { patchFontOptions } from '@ts/viz/core/utils';

const states = ['normal', 'hover'];

function compileAttrs(color, itemOptions, itemBaseOptions?) {
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

function compileLabelAttrs(labelOptions, filter, node) {
  const _patchFontOptions = patchFontOptions;

  if (labelOptions.useNodeColors) {
    labelOptions.font.color = node.color;
  }

  const borderVisible = isDefined(labelOptions.border.visible) ? labelOptions.border.visible : false;
  const borderWidth = isDefined(labelOptions.border.width) ? labelOptions.border.width : 0;
  const borderColor = isDefined(labelOptions.border.color) ? labelOptions.border.color : labelOptions.font.color;
  const borderOpacity = isDefined(labelOptions.border.opacity) ? labelOptions.border.opacity : 1;
  const attr = {
    filter,
  };

  if (borderVisible && borderWidth) {
    // @ts-expect-error
    attr.stroke = borderColor;
    attr['stroke-width'] = borderVisible ? borderWidth : 0;
    attr['stroke-opacity'] = borderOpacity;
  }

  return {
    attr,
    css: _patchFontOptions(labelOptions.font),
  };
}

function Node(widget, params) {
  const that = this;
  const widgetOffset = widget._renderer.getRootOffset();

  that.code = 0;
  that.widget = widget;

  that.color = params.color;
  that.options = params.options;
  that.rect = params.rect;
  that.label = params.rect._name;
  that.coords = {
    x: params.rect.x + params.rect.width / 2 + widgetOffset.left,
    y: params.rect.y + params.rect.height / 2 + widgetOffset.top,
  };
  that.id = params.id;
  that.linksIn = params.linksIn;
  that.linksOut = params.linksOut;

  this.states = {
    normal: compileAttrs(this.color, that.options, that.options),
    hover: compileAttrs(this.color, that.options.hoverStyle, that.options),
  };
}

Node.prototype = {
  compileAttrs() {
    return compileAttrs(this.color, this.options);
  },

  getState() {
    return states[this.code];
  },

  isHovered() {
    return !!(this.code & 1);
  },

  setState(code, state) {
    if (state) {
      this.code |= code;
    } else {
      this.code &= ~code;
    }

    if (state) {
      this.linksIn.concat(this.linksOut).forEach((adjacentLink) => {
        this.widget._links[adjacentLink.index].setAdjacentNodeHover(true);
      });
    } else {
      this.widget._links.forEach((link) => {
        link.isAdjacentNodeHovered() && link.adjacentNodeHover(false);
      });
      this.hideTooltip();
    }

    this.widget._applyNodesAppearance();
    this.widget._applyLinksAppearance();
  },

  hover(state) {
    if (!this.widget._getOption('hoverEnabled', true) || state === this.isHovered()) {
      return;
    }

    this.widget._suspend();
    state && this.widget.clearHover();
    this.setState(1, state);
    this.widget._eventTrigger('nodeHoverChanged', { target: this });
    this.widget._resume();
  },

  setHover() {
    this.hover(true);
  },

  showTooltip(coords) {
    this.widget._getOption('hoverEnabled', true) && this.widget._tooltip && this.widget._tooltip.show({
      type: 'node',
      info: {
        label: this.label,
        title: this.label,
        weightIn: this.linksIn.reduce((previousValue, currentValue) => previousValue + currentValue.weight, 0),
        weightOut: this.linksOut.reduce((previousValue, currentValue) => previousValue + currentValue.weight, 0),
      },
    }, typeof coords !== 'undefined' ? { x: coords[0], y: coords[1] } : this.coords);
  },

  hideTooltip() {
    this.widget._tooltip && this.widget._tooltip.hide();
  },

  getLabelAttributes(labelSettings, filter) {
    return compileLabelAttrs(labelSettings, filter, this);
  },

};

export default Node;
