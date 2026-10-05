/* eslint-disable radix */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @stylistic/max-len */

import { noop } from '@js/core/utils/common';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

const _round = Math.round;

const defaultOffset = {
  horizontal: 0,
  vertical: 0,
};
const alignFactors = {
  center: 0.5,
  right: 1,
  bottom: 1,
  left: 0,
  top: 0,
};

export interface LayoutRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutAlignment {
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'center' | 'bottom';
}

export interface AlignedLayoutRect extends LayoutRect {
  verticalAlignment?: string;
  horizontalAlignment?: string;
  cutLayoutSide?: string;
  cutSide?: string;
  position?: LayoutAlignment;
}

interface LayoutBox {
  getLayoutOptions: () => LayoutRect;
}

interface PositionedElement extends LayoutBox {
  shift: (x: number, y: number) => unknown;
}

interface PositionOptions {
  of: LayoutBox;
  my: LayoutAlignment;
  at: LayoutAlignment;
  offset?: ThemeValue;
}

interface LayoutRenderElement {
  getBBox: () => LayoutRect;
  move: (x: number, y: number) => unknown;
}

class LayoutElement {
  declare _options: ThemeValue;

  constructor(options?: ThemeValue) {
    this._options = options;
  }

  position(this: PositionedElement, options: PositionOptions): void {
    const ofBBox = options.of.getLayoutOptions();
    const myBBox = this.getLayoutOptions();
    const { at } = options;
    const { my } = options;
    const offset = options.offset || defaultOffset;
    const shiftX = -alignFactors[my.horizontal] * myBBox.width + ofBBox.x + alignFactors[at.horizontal] * ofBBox.width + parseInt(offset.horizontal);
    const shiftY = -alignFactors[my.vertical] * myBBox.height + ofBBox.y + alignFactors[at.vertical] * ofBBox.height + parseInt(offset.vertical);

    this.shift(_round(shiftX), _round(shiftY));
  }
}

Object.assign(LayoutElement.prototype, {
  getLayoutOptions: noop,
});

class WrapperLayoutElement extends LayoutElement {
  declare _renderElement: LayoutRenderElement;

  declare _cacheBBox?: LayoutRect;

  constructor(renderElement: LayoutRenderElement | null, bBox?: LayoutRect) {
    super();
    // @ts-expect-error `null` comes only together with a cached bBox: such a wrapper is a static layout target that is never shifted
    this._renderElement = renderElement;
    this._cacheBBox = bBox;
  }

  getLayoutOptions(): LayoutRect {
    return this._cacheBBox || this._renderElement.getBBox();
  }

  shift(shiftX: number, shiftY: number): void {
    const bBox = this.getLayoutOptions();
    this._renderElement.move(_round(shiftX - bBox.x), _round(shiftY - bBox.y));
  }
}

export {
  LayoutElement,
  WrapperLayoutElement,
};
