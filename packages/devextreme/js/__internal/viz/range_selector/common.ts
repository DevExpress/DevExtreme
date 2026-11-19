/* eslint-disable func-names */

import devices from '@ts/core/devices';
import { browser } from '@ts/core/utils/browser';
import { isFunction } from '@ts/core/utils/type';
import { smartFormatter as _format } from '@ts/viz/axes/smart_formatter';

export const HEIGHT_COMPACT_MODE = 24;
const POINTER_SIZE = 4;
const EMPTY_SLIDER_MARKER_TEXT = '. . .';

export const utils = {
  trackerSettings: {
    fill: 'grey',
    stroke: 'grey',
    opacity: 0.0001,
  },
  animationSettings: { duration: 250 },
};

export const consts = {
  emptySliderMarkerText: EMPTY_SLIDER_MARKER_TEXT,
  pointerSize: POINTER_SIZE,
};

interface FormatObject {
  value: unknown;
  valueText: string;
}

interface ValueFormatOptions {
  customizeText?: (this: FormatObject, formatObject: FormatObject) => unknown;
}

export const formatValue = function (
  value: unknown,
  formatOptions: ValueFormatOptions,
  tickIntervalsInfo?: { ticks: unknown[]; tickInterval?: unknown },
  valueType?: string,
  type?: string,
  logarithmBase?: number,
): string {
  const formatObject = {
    value,
    valueText: _format(value, {
      labelOptions: formatOptions,
      ticks: tickIntervalsInfo ? tickIntervalsInfo.ticks : [],
      tickInterval: tickIntervalsInfo ? tickIntervalsInfo.tickInterval : undefined,
      dataType: valueType,
      type,
      logarithmBase,
    }),
  };
  return String(
    isFunction(formatOptions.customizeText)
      ? formatOptions.customizeText.call(formatObject, formatObject)
      : formatObject.valueText,
  );
};

export const isFirefoxOnAndroid = (): boolean | undefined => browser.mozilla
  && devices.real().android;
