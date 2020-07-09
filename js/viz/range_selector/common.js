import { smartFormatter as _format } from '../axes/smart_formatter';
import { isFunction } from '../../core/utils/type';
export const HEIGHT_COMPACT_MODE = 24;
const POINTER_SIZE = 4;
const EMPTY_SLIDER_MARKER_TEXT = '. . .';

export const utils = {
    trackerSettings: {
        fill: 'grey',
        stroke: 'grey',
        opacity: 0.0001
    },
    animationSettings: { duration: 250 }
};
export const consts = {
    emptySliderMarkerText: EMPTY_SLIDER_MARKER_TEXT,
    pointerSize: POINTER_SIZE
};

export const formatValue = function(value, formatOptions, tickIntervalsInfo, valueType, type, logarithmBase) {
    const formatObject = {
        value: value,
        valueText: _format(value, {
            labelOptions: formatOptions,
            ticks: tickIntervalsInfo ? tickIntervalsInfo.ticks : [],
            tickInterval: tickIntervalsInfo ? tickIntervalsInfo.tickInterval : undefined,
            dataType: valueType,
            type: type,
            logarithmBase: logarithmBase
        })
    };
    return String(isFunction(formatOptions.customizeText) ? formatOptions.customizeText.call(formatObject, formatObject) : formatObject.valueText);
};
