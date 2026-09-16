import { each } from '@js/core/utils/iterator';
import { isString } from '@js/core/utils/type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { extractColor } from '@ts/viz/core/utils';
import { BaseElement } from '@ts/viz/gauges/base_indicators';

interface Segment {
  start: number;
  end: number;
}

export interface RangeInfo extends Segment {
  color?: ThemeValue;
  className?: string;
  classIndex?: number;
  startWidth?: number;
  endWidth?: number;
}

export interface RangeContainerMeasure {
  min: number;
  max: number;
}

export function getMaxRangeWidth(width: ThemeValue): number {
  return Number(width) || Math.max(Number(width.start), Number(width.end));
}

function subtractSegmentAsc(
  segmentStart: number,
  segmentEnd: number,
  otherStart: number,
  otherEnd: number,
): Segment[] {
  if (otherStart > segmentStart && otherEnd < segmentEnd) {
    return [{ start: segmentStart, end: otherStart }, { start: otherEnd, end: segmentEnd }];
  }
  if (otherStart >= segmentEnd || otherEnd <= segmentStart) {
    return [{ start: segmentStart, end: segmentEnd }];
  }
  if (otherStart <= segmentStart && otherEnd >= segmentEnd) {
    return [];
  }
  if (otherStart > segmentStart) {
    return [{ start: segmentStart, end: otherStart }];
  }
  return [{ start: otherEnd, end: segmentEnd }];
}

function subtractSegmentDesc(
  segmentStart: number,
  segmentEnd: number,
  otherStart: number,
  otherEnd: number,
): Segment[] {
  if (otherStart < segmentStart && otherEnd > segmentEnd) {
    return [{ start: segmentStart, end: otherStart }, { start: otherEnd, end: segmentEnd }];
  }
  if (otherStart <= segmentEnd || otherEnd >= segmentStart) {
    return [{ start: segmentStart, end: segmentEnd }];
  }
  if (otherStart >= segmentStart && otherEnd <= segmentEnd) {
    return [];
  }
  if (otherStart < segmentStart) {
    return [{ start: segmentStart, end: otherStart }];
  }
  return [{ start: otherEnd, end: segmentEnd }];
}

function areEqualValues(start: number, end: number, { startValue, endValue }: ThemeValue): boolean {
  return endValue === startValue && startValue === start && end === start;
}

function isValidSegmentAsc(start: number, end: number, options: ThemeValue): boolean {
  return end - start > 0 || areEqualValues(start, end, options);
}

function isValidSegmentDesc(start: number, end: number, options: ThemeValue): boolean {
  return start - end > 0 || areEqualValues(start, end, options);
}

abstract class BaseRangeContainer extends BaseElement {
  _root;

  _container;

  _themeManager;

  _ranges?: RangeInfo[] | null;

  enabled?: boolean | null;

  _init(): void {
    this._root = this._renderer.g()
      .attr({ class: 'dxg-range-container' })
      .linkOn(this._container, 'range-container');
  }

  _dispose(): void {
    this._root.linkOff();
  }

  clean(): this {
    this._root.linkRemove().clear();
    this.enabled = null;
    this._options = null;
    return this;
  }

  _getRanges(): RangeInfo[] | null {
    const options = this._options;
    const translator = this._translator;
    const totalStart: number = translator.getDomain()[0];
    const totalEnd: number = translator.getDomain()[1];
    const totalDelta = totalEnd - totalStart;
    const isValidSegment = totalDelta >= 0 ? isValidSegmentAsc : isValidSegmentDesc;
    const subtractSegment = totalDelta >= 0 ? subtractSegmentAsc : subtractSegmentDesc;
    let ranges: RangeInfo[] = [];
    let backgroundRanges: RangeInfo[] = [{ start: totalStart, end: totalEnd }];
    const backgroundColor = extractColor(options.backgroundColor) || 'none';
    const width = options.width || {};
    const startWidth = Number(width > 0 ? width : width.start);
    const endWidth = Number(width > 0 ? width : width.end);
    const deltaWidth = endWidth - startWidth;

    if (options.ranges !== undefined && !Array.isArray(options.ranges)) {
      return null;
    }
    if (!(startWidth >= 0 && endWidth >= 0 && startWidth + endWidth > 0)) {
      return null;
    }
    const rangesOptions: ThemeValue[] = Array.isArray(options.ranges) ? options.ranges : [];
    const list = rangesOptions.reduce((result: RangeInfo[], rangeOptions, i) => {
      const currentOptions = rangeOptions || {};
      const start = translator.adjust(currentOptions.startValue);
      const end = translator.adjust(currentOptions.endValue);
      if (Number.isFinite(start) && Number.isFinite(end)
        && isValidSegment(start, end, currentOptions)) {
        result.push({
          start, end, color: extractColor(currentOptions.color), classIndex: i,
        });
      }
      return result;
    }, []);

    const palette = this._themeManager.createPalette(options.palette, {
      type: 'indicatingSet',
      extensionMode: options.paletteExtensionMode,
      keepLastColorInEnd: true,
      count: list.length,
    });

    each(list, (_, item: RangeInfo) => {
      const paletteColor = palette.getNextColor();
      item.color = (isString(item.color) && item.color) || paletteColor || 'none';
      item.className = `dxg-range dxg-range-${item.classIndex}`;
      delete item.classIndex;
    });

    each(list, (_, item: RangeInfo) => {
      const newRanges: RangeInfo[] = [];
      const newBackgroundRanges: RangeInfo[] = [];

      ranges.forEach((range) => {
        const subs: RangeInfo[] = subtractSegment(range.start, range.end, item.start, item.end);
        subs.forEach((sub) => {
          sub.color = range.color;
          sub.className = range.className;
          newRanges.push(sub);
        });
      });
      newRanges.push(item);
      ranges = newRanges;
      backgroundRanges.forEach((range) => {
        const subs = subtractSegment(range.start, range.end, item.start, item.end);
        subs.forEach((sub) => {
          newBackgroundRanges.push(sub);
        });
      });
      backgroundRanges = newBackgroundRanges;
    });
    each(backgroundRanges, (_, range: RangeInfo) => {
      range.color = backgroundColor;
      range.className = 'dxg-range dxg-background-range';
      ranges.push(range);
    });
    each(ranges, (_, range: RangeInfo) => {
      range.startWidth = ((range.start - totalStart) / totalDelta) * deltaWidth + startWidth;
      range.endWidth = ((range.end - totalStart) / totalDelta) * deltaWidth + startWidth;
    });
    return ranges;
  }

  render(options: ThemeValue): this {
    this._options = options;
    this._processOptions();
    this._ranges = this._getRanges();
    if (this._ranges) {
      this.enabled = true;
      this._root.linkAppend();
    }
    return this;
  }

  resize(layout: ThemeValue): this {
    this._root.clear();
    if (this._isVisible(layout)) {
      each(this._ranges, (_, range: RangeInfo) => {
        this._createRange(range, layout)
          .attr({ fill: range.color, class: range.className })
          .append(this._root);
      });
    }
    return this;
  }

  abstract _processOptions(): void;

  abstract _isVisible(layout: ThemeValue): boolean;

  abstract _createRange(range: RangeInfo, layout: ThemeValue): ThemeValue;

  // S170193
  getColorForValue(value: number): ThemeValue {
    let color: ThemeValue = null;
    each(this._ranges, (_, range: RangeInfo) => {
      const inRange = (range.start <= value && value <= range.end)
        || (range.start >= value && value >= range.end);
      if (inRange) {
        color = range.color;
      }
      return !inRange;
    });
    return color;
  }
}

export default BaseRangeContainer;
