/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { isDefined } from '@js/core/utils/type';

const states = ['normal', 'hover', 'selection', 'selection'];

function parseStyles(color, style, baseStyle) {
  const border = style.border;
  const baseBorder = baseStyle.border;
  const borderVisible = isDefined(border.visible) ? border.visible : baseBorder.visible;
  const borderWidth = isDefined(border.width) ? border.width : baseBorder.width;

  return {
    fill: color,
    hatching: style.hatching,
    stroke: border.color || baseBorder.color,
    'stroke-width': borderVisible ? borderWidth : 0,
  };
}

function Item(widget, options) {
  const that = this;
  const data = options.data;

  that.code = 0;
  that.widget = widget;

  that.figure = options.figure;
  that.argument = data.argument;
  that.value = data.value;
  that.data = data.dataItem;
  that.percent = options.percent;

  that.id = options.id;
  that.color = options.color;

  that.states = {
    normal: parseStyles(options.color, options.itemOptions, options.itemOptions),
    hover: parseStyles(options.color, options.itemOptions.hoverStyle, options.itemOptions),
    selection: parseStyles(options.color, options.itemOptions.selectionStyle, options.itemOptions),
  };
}

Item.prototype = {
  getState() {
    return states[this.code];
  },

  getNormalStyle() {
    return this.states.normal;
  },

  setHover() {
    this.hover(true);
  },

  hover(state) {
    if (!this.widget._getOption('hoverEnabled', true) || state === this.isHovered()) {
      return;
    }

    this.widget._suspend();
    state && this.widget.clearHover();
    this.setState(1, state);
    this.widget._eventTrigger('hoverChanged', { item: this });
    this.widget._resume();
  },

  setState(code, state) {
    if (state) {
      this.code |= code;
    } else {
      this.code &= ~code;
    }
    this.widget._applyTilesAppearance();
  },

  select(state) {
    const mode = this.widget._getOption('selectionMode', true);
    if (mode === 'none' || state === this.isSelected()) {
      return;
    }
    this.widget._suspend();
    if (state && mode !== 'multiple') {
      this.widget.clearSelection();
    }
    this.setState(2, state);
    this.widget._eventTrigger('selectionChanged', { item: this });
    this.widget._resume();
  },

  showTooltip(coords) {
    this.widget._showTooltip(this.id, coords);
  },

  getColor() {
    return this.color;
  },

  isHovered() {
    return !!(this.code & 1);
  },

  isSelected() {
    return !!(this.code & 2);
  },
};

export default Item;
