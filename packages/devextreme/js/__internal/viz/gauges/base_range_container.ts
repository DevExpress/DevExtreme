/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { each } from '@js/core/utils/iterator';
import { isString } from '@js/core/utils/type';
import { extractColor } from '@ts/viz/core/utils';
import { BaseElement } from '@ts/viz/gauges/base_indicators';

const _Number = Number;
const _isArray = Array.isArray;
const _isFinite = isFinite;

const BaseRangeContainer = BaseElement.inherit({
  _init() {
    this._root = this._renderer.g().attr({ class: 'dxg-range-container' }).linkOn(this._container, 'range-container');
  },

  _dispose() {
    this._root.linkOff();
  },

  clean() {
    this._root.linkRemove().clear();
    this._options = this.enabled = null;
    return this;
  },

  _getRanges() {
    const that = this;
    const options = that._options;
    const translator = that._translator;
    const totalStart = translator.getDomain()[0];
    const totalEnd = translator.getDomain()[1];
    const totalDelta = totalEnd - totalStart;
    const isValidSegment = totalDelta >= 0 ? isValidSegmentAsc : isValidSegmentDesc;
    const subtractSegment = totalDelta >= 0 ? subtractSegmentAsc : subtractSegmentDesc;
    let list = [];
    let ranges = [];
    let backgroundRanges = [{ start: totalStart, end: totalEnd }];
    const backgroundColor = extractColor(options.backgroundColor) || 'none';
    const width = options.width || {};
    const startWidth = _Number(width > 0 ? width : width.start);
    const endWidth = _Number(width > 0 ? width : width.end);
    const deltaWidth = endWidth - startWidth;

    if (options.ranges !== undefined && !_isArray(options.ranges)) {
      return null;
    }
    if (!(startWidth >= 0 && endWidth >= 0 && startWidth + endWidth > 0)) {
      return null;
    }
    list = (_isArray(options.ranges) ? options.ranges : []).reduce((result, rangeOptions, i) => {
      rangeOptions = rangeOptions || {};
      const start = translator.adjust(rangeOptions.startValue);
      const end = translator.adjust(rangeOptions.endValue);
      if (_isFinite(start) && _isFinite(end) && isValidSegment(start, end, rangeOptions)) {
        result.push({
          start, end, color: extractColor(rangeOptions.color), classIndex: i,
        });
      }
      return result;
    }, []);

    const palette = that._themeManager.createPalette(options.palette, {
      type: 'indicatingSet',
      extensionMode: options.paletteExtensionMode,
      keepLastColorInEnd: true,
      count: list.length,
    });

    each(list, (_, item) => {
      const paletteColor = palette.getNextColor();
      item.color = (isString(item.color) && item.color) || paletteColor || 'none';
      item.className = `dxg-range dxg-range-${item.classIndex}`;
      delete item.classIndex;
    });

    each(list, (_, item) => {
      let i;
      let ii;
      let sub;
      let subs;
      let range;
      const newRanges = [];
      const newBackgroundRanges = [];

      for (i = 0, ii = ranges.length; i < ii; ++i) {
        range = ranges[i];
        subs = subtractSegment(range.start, range.end, item.start, item.end);
        // @ts-expect-error
        (sub = subs[0]) && (sub.color = range.color) && (sub.className = range.className) && newRanges.push(sub);
        // @ts-expect-error
        (sub = subs[1]) && (sub.color = range.color) && (sub.className = range.className) && newRanges.push(sub);
      }
      // @ts-expect-error
      newRanges.push(item);
      ranges = newRanges;
      for (i = 0, ii = backgroundRanges.length; i < ii; ++i) {
        range = backgroundRanges[i];
        subs = subtractSegment(range.start, range.end, item.start, item.end);
        // @ts-expect-error
        (sub = subs[0]) && newBackgroundRanges.push(sub);
        // @ts-expect-error
        (sub = subs[1]) && newBackgroundRanges.push(sub);
      }
      backgroundRanges = newBackgroundRanges;
    });
    each(backgroundRanges, (_, range) => {
      range.color = backgroundColor;
      range.className = 'dxg-range dxg-background-range';
      // @ts-expect-error
      ranges.push(range);
    });
    each(ranges, (_, range) => {
      range.startWidth = (range.start - totalStart) / totalDelta * deltaWidth + startWidth;
      range.endWidth = (range.end - totalStart) / totalDelta * deltaWidth + startWidth;
    });
    return ranges;
  },

  render(options) {
    const that = this;
    that._options = options;
    that._processOptions();
    that._ranges = that._getRanges();
    if (that._ranges) {
      that.enabled = true;
      that._root.linkAppend();
    }
    return that;
  },

  resize(layout) {
    const that = this;
    that._root.clear();
    if (that._isVisible(layout)) {
      each(that._ranges, (_, range) => {
        that._createRange(range, layout).attr({ fill: range.color, class: range.className }).append(that._root);
      });
    }
    return that;
  },

  _processOptions: null,

  _isVisible: null,

  _createRange: null,

  // S170193
  getColorForValue(value) {
    let color = null;
    // @ts-expect-error
    each(this._ranges, (_, range) => {
      if ((range.start <= value && value <= range.end) || (range.start >= value && value >= range.end)) {
        color = range.color;
        return false;
      }
    });
    return color;
  },
});

function subtractSegmentAsc(segmentStart, segmentEnd, otherStart, otherEnd) {
  let result;
  if (otherStart > segmentStart && otherEnd < segmentEnd) {
    result = [{ start: segmentStart, end: otherStart }, { start: otherEnd, end: segmentEnd }];
  } else if (otherStart >= segmentEnd || otherEnd <= segmentStart) {
    result = [{ start: segmentStart, end: segmentEnd }];
  } else if (otherStart <= segmentStart && otherEnd >= segmentEnd) {
    result = [];
  } else if (otherStart > segmentStart) {
    result = [{ start: segmentStart, end: otherStart }];
  } else if (otherEnd < segmentEnd) {
    result = [{ start: otherEnd, end: segmentEnd }];
  }
  return result;
}

function subtractSegmentDesc(segmentStart, segmentEnd, otherStart, otherEnd) {
  let result;
  if (otherStart < segmentStart && otherEnd > segmentEnd) {
    result = [{ start: segmentStart, end: otherStart }, { start: otherEnd, end: segmentEnd }];
  } else if (otherStart <= segmentEnd || otherEnd >= segmentStart) {
    result = [{ start: segmentStart, end: segmentEnd }];
  } else if (otherStart >= segmentStart && otherEnd <= segmentEnd) {
    result = [];
  } else if (otherStart < segmentStart) {
    result = [{ start: segmentStart, end: otherStart }];
  } else if (otherEnd > segmentEnd) {
    result = [{ start: otherEnd, end: segmentEnd }];
  }
  return result;
}

function areEqualValues(start, end, { startValue, endValue }) {
  return endValue === startValue && startValue === start && end === start;
}

function isValidSegmentAsc(start, end, options) {
  return end - start > 0 || areEqualValues(start, end, options);
}

function isValidSegmentDesc(start, end, options) {
  return start - end > 0 || areEqualValues(start, end, options);
}

export default BaseRangeContainer;
