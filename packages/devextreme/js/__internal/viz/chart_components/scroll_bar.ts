/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable prefer-destructuring */

import eventsEngine from '@js/common/core/events/core/events_engine';
import { end as dragEventEnd, move as dragEventMove, start as dragEventStart } from '@js/common/core/events/drag';
import { fireEvent } from '@js/common/core/events/utils/index';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

import { Translator2D } from '../translators/translator2d';

const _min = Math.min;
const _max = Math.max;
const MIN_SCROLL_BAR_SIZE = 10;

type ScrollBarPosition = 'left' | 'right' | 'top' | 'bottom';

interface ScrollBarCanvas {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface ScrollBarMargins {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface ScrollBarLayoutOptions {
  width: number;
  offset: number;
  vertical: boolean;
  position: ScrollBarPosition;
}

interface ScrollBarPointerEvent {
  offset: { x: number; y: number };
}

interface ScrollBarRange {
  startValue: ThemeValue;
  endValue: ThemeValue;
}

interface ScrollBarDragEvent {
  type: string;
  originalEvent: ScrollBarPointerEvent;
  target: ThemeValue;
  offset: { x: number; y: number };
  scrollRange: ScrollBarRange | undefined;
}

function _getXCoord(
  canvas: ScrollBarCanvas,
  pos: ScrollBarPosition,
  offset: number,
  width: number,
): number {
  let x = 0;

  if (pos === 'right') {
    x = canvas.width - canvas.right + offset;
  } else if (pos === 'left') {
    x = canvas.left - offset - width;
  }

  return x;
}

function _getYCoord(
  canvas: ScrollBarCanvas,
  pos: ScrollBarPosition,
  offset: number,
  width: number,
): number {
  let y = 0;

  if (pos === 'top') {
    y = canvas.top - offset;
  } else if (pos === 'bottom') {
    y = canvas.height - canvas.bottom + width + offset;
  }

  return y;
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let ScrollBar = class ScrollBar {
  declare _translator: ThemeValue;

  declare _scroll: ThemeValue;

  declare _dragStartOffset?: number;

  declare _offset: number;

  declare _thumbLength: number;

  declare _scale: number;

  declare _layoutOptions: ScrollBarLayoutOptions;

  declare _translateWithOffset: number;

  declare _hasBreaks: boolean;

  declare _canvas: ScrollBarCanvas;

  declare pane: string;

  declare hideTitle: () => void;

  declare hideOuterElements: () => void;

  constructor(renderer: ThemeValue, group: ThemeValue) {
    this._translator = new Translator2D({}, {}, {});
    this._scroll = renderer.rect().append(group);
    this._addEvents();
  }

  _addEvents(): void {
    const scrollElement = this._scroll.element;

    eventsEngine.on(scrollElement, dragEventStart, (e) => {
      this._dragStartOffset = this._offset;

      fireEvent({
        type: 'dxc-scroll-start',
        originalEvent: e,
        target: scrollElement,
      });
    });

    eventsEngine.on(scrollElement, dragEventMove, (e) => {
      const position = this._getDragPosition(e);
      this._applyPosition(position, position + this._thumbLength);

      fireEvent(this._getDragEvent('dxc-scroll-move', e, scrollElement, position));
    });

    eventsEngine.on(scrollElement, dragEventEnd, (e) => {
      fireEvent(this._getDragEvent('dxc-scroll-end', e, scrollElement, this._getDragPosition(e)));
    });
  }

  _getDragPosition(e: ScrollBarPointerEvent): number {
    const offset = this._layoutOptions.vertical ? e.offset.y : e.offset.x;

    return (this._dragStartOffset ?? this._offset) + offset;
  }

  _getDragEvent(
    type: string,
    e: ScrollBarPointerEvent,
    target: ThemeValue,
    position: number,
  ): ScrollBarDragEvent {
    return {
      type,
      originalEvent: e,
      target,
      offset: {
        x: -e.offset.x * this._scale,
        y: -e.offset.y * this._scale,
      },
      scrollRange: this._getRangeAtPosition(position),
    };
  }

  _getBoundaryDirection(): number {
    return this._translateWithOffset || (this._hasBreaks ? 1 : 0);
  }

  _getRangeAtPosition(position: number): ScrollBarRange | undefined {
    const translator = this._translator;
    const length = this._thumbLength;

    if (!isFinite(position) || !isFinite(length)) {
      return undefined;
    }

    const visibleArea = translator.getCanvasVisibleArea();
    const lastPosition = _max(visibleArea.max - length, visibleArea.min);
    const start = _min(_max(position, visibleArea.min), lastPosition);

    const direction = this._getBoundaryDirection();
    const from = translator.from(start, -direction);
    const to = translator.from(start + length, direction);

    return translator.isInverted()
      ? { startValue: to, endValue: from }
      : { startValue: from, endValue: to };
  }

  update(options: ThemeValue): this {
    let position = options.position;
    const isVertical = options.rotated;
    const defaultPosition = isVertical ? 'right' : 'top';
    const secondaryPosition = isVertical ? 'left' : 'bottom';

    if (position !== defaultPosition && position !== secondaryPosition) {
      position = defaultPosition;
    }

    this._scroll.attr({
      rotate: !options.rotated ? -90 : 0,
      rotateX: 0,
      rotateY: 0,
      fill: options.color,
      width: options.width,
      opacity: options.opacity,
    });

    this._layoutOptions = {
      width: options.width,
      offset: options.offset,
      vertical: isVertical,
      position,
    };

    return this;
  }

  init(range: ThemeValue, stick: boolean, wholeRangeBreaks?: ThemeValue[]): this {
    const isDiscrete = range.axisType === 'discrete';
    this._translateWithOffset = (isDiscrete && !stick && 1) || 0;
    this._hasBreaks = !!wholeRangeBreaks?.length;
    this._translator.update(extend({}, range, {
      minVisible: null,
      maxVisible: null,
      visibleCategories: null,
      breaks: wholeRangeBreaks?.length ? wholeRangeBreaks : null,
      userBreaks: null,
    }, isDiscrete && {
      min: null,
      max: null,
    } || {}), this._canvas, { isHorizontal: !this._layoutOptions.vertical, stick, breaksSize: 0 });
    return this;
  }

  getOptions(): ScrollBarLayoutOptions {
    return this._layoutOptions;
  }

  setPane(panes: { name: string }[]): this {
    const position = this._layoutOptions.position;
    let pane;

    if (position === 'left' || position === 'top') {
      pane = panes[0];
    } else {
      pane = panes[panes.length - 1];
    }
    this.pane = pane.name;

    return this;
  }

  updateSize(canvas: ScrollBarCanvas): void {
    this._canvas = extend({}, canvas);

    const options = this._layoutOptions;
    const pos = options.position;
    const offset = options.offset;
    const width = options.width;

    this._scroll.attr({
      translateX: _getXCoord(canvas, pos, offset, width),
      translateY: _getYCoord(canvas, pos, offset, width),
    });
  }

  getMultipleAxesSpacing(): number {
    return 0;
  }

  estimateMargins(): ScrollBarMargins { return this.getMargins(); }

  getMargins(): ScrollBarMargins {
    const options = this._layoutOptions;
    const margins = {
      left: 0, top: 0, right: 0, bottom: 0,
    };

    margins[options.position] = options.width + options.offset;

    return margins;
  }

  shift(margins: ScrollBarMargins): void {
    const options = this._layoutOptions;
    const side = options.position;
    const isVertical = options.vertical;
    const attr = {
      translateX: this._scroll.attr('translateX') ?? 0,
      translateY: this._scroll.attr('translateY') ?? 0,
    };
    const shift = margins[side];

    attr[isVertical ? 'translateX' : 'translateY'] += (side === 'left' || side === 'top' ? -1 : 1) * shift;
    this._scroll.attr(attr);
  }

  setPosition(min: ThemeValue, max: ThemeValue): void {
    const translator = this._translator;
    const direction = this._getBoundaryDirection();
    const minPoint = isDefined(min) ? translator.translate(min, -direction) : translator.translate('canvas_position_start');
    const maxPoint = isDefined(max) ? translator.translate(max, direction) : translator.translate('canvas_position_end');

    this._offset = _min(minPoint, maxPoint);
    this._thumbLength = Math.abs(maxPoint - minPoint);
    this._scale = this._thumbLength
      ? translator.canvasLength / this._thumbLength
      : translator.getScale(min, max);

    this._applyPosition(_min(minPoint, maxPoint), _max(minPoint, maxPoint));
  }

  customPositionIsAvailable(): boolean {
    return false;
  }

  dispose(): void {
    this._scroll.dispose();
    this._scroll = this._translator = null;
  }

  _applyPosition(x1: number, x2: number): void {
    const visibleArea = this._translator.getCanvasVisibleArea();

    const min = visibleArea.min;
    const max = visibleArea.max;

    if (max <= min) {
      return;
    }

    if (x1 > x2) {
      [x1, x2] = [x2, x1];
    }

    x1 = Math.max(x1, min);
    x2 = Math.min(x2, max);

    if (x2 - x1 < MIN_SCROLL_BAR_SIZE) {
      if (max - min < MIN_SCROLL_BAR_SIZE) {
        x1 = min;
        x2 = max;
      } else {
        const center = (x1 + x2) / 2;

        x1 = center - MIN_SCROLL_BAR_SIZE / 2;
        x2 = center + MIN_SCROLL_BAR_SIZE / 2;

        if (x1 < min) {
          x1 = min;
          x2 = min + MIN_SCROLL_BAR_SIZE;
        } else if (x2 > max) {
          x2 = max;
          x1 = max - MIN_SCROLL_BAR_SIZE;
        }
      }
    }

    x1 = Math.max(x1, min);
    x2 = Math.min(x2, max);

    const height = Math.max(x2 - x1, 0);

    this._scroll.attr({
      y: x1,
      height,
    });
  }
};

Object.assign(ScrollBar.prototype, {
  // Axis like functions
  hideTitle: noop,

  hideOuterElements: noop,
  // Axis like functions
});

/// #DEBUG
export function DEBUG_set_ScrollBar(value: typeof ScrollBar): void {
  ScrollBar = value;
}
/// #ENDDEBUG
