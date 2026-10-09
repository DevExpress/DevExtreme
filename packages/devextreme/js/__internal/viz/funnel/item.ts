/* eslint-disable no-bitwise */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { paintedColor } from '@ts/core/utils/css_variables';
import { isDefined } from '@ts/core/utils/m_type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

const states = ['normal', 'hover', 'selection', 'selection'];

interface ItemStyle {
  fill: string;
  hatching: ThemeValue;
  stroke: string;
  'stroke-width': number;
}

interface ItemWidget {
  _renderer?: { root?: { element?: Element } };
  _getOption: (name: string, isScalar?: boolean) => ThemeValue;
  _suspend: () => void;
  _resume: () => void;
  _eventTrigger: (name: string, args: ThemeValue) => void;
  _applyTilesAppearance: () => void;
  _showTooltip: (id: number, coords?: number[]) => void;
  clearHover: () => void;
  clearSelection: () => void;
}

interface ItemOptions {
  figure: number[];
  data: ThemeValue;
  percent: number;
  id: number;
  color: string;
  itemOptions: ThemeValue;
}

function parseStyles(color: string, style: ThemeValue, baseStyle: ThemeValue): ItemStyle {
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

class Item {
  declare code: number;

  declare widget: ItemWidget;

  declare figure: number[];

  declare argument: ThemeValue;

  declare value: ThemeValue;

  declare data: ThemeValue;

  declare percent: number;

  declare id: number;

  declare fill: string;

  declare states: Record<'normal' | 'hover' | 'selection', ItemStyle>;

  declare coords: number[];

  declare element: ThemeValue;

  constructor(widget: ItemWidget, options: ItemOptions) {
    const data = options.data;

    this.code = 0;
    this.widget = widget;

    this.figure = options.figure;
    this.argument = data.argument;
    this.value = data.value;
    this.data = data.dataItem;
    this.percent = options.percent;

    this.id = options.id;
    this.fill = options.color;

    this.states = {
      normal: parseStyles(options.color, options.itemOptions, options.itemOptions),
      hover: parseStyles(options.color, options.itemOptions.hoverStyle, options.itemOptions),
      selection: parseStyles(
        options.color,
        options.itemOptions.selectionStyle,
        options.itemOptions,
      ),
    };
  }

  get color(): string {
    return this.getColor();
  }

  set color(value: string) {
    this.fill = value;
  }

  getState(): string {
    return states[this.code];
  }

  getNormalStyle(): ItemStyle {
    return this.states.normal;
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
    this.setState(1, state);
    this.widget._eventTrigger('hoverChanged', { item: this });
    this.widget._resume();
  }

  setState(code: number, state: boolean): void {
    if (state) {
      this.code |= code;
    } else {
      this.code &= ~code;
    }
    this.widget._applyTilesAppearance();
  }

  select(state: boolean): void {
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
  }

  showTooltip(coords?: number[]): void {
    this.widget._showTooltip(this.id, coords);
  }

  getColor(): string {
    return paintedColor(this.fill, this.widget._renderer?.root?.element);
  }

  isHovered(): boolean {
    return !!(this.code & 1);
  }

  isSelected(): boolean {
    return !!(this.code & 2);
  }
}

export default Item;
