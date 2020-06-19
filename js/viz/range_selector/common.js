import { smartFormatter as _format } from '../axes/smart_formatter';
import { isFunction } from '../../core/utils/type';
const HEIGHT_COMPACT_MODE = 24;
const POINTER_SIZE = 4;
const EMPTY_SLIDER_MARKER_TEXT = '. . .';

const utils = {
    trackerSettings: {
        fill: 'grey',
        stroke: 'grey',
        opacity: 0.0001
    },
    animationSettings: { duration: 250 }
};
const consts = {
    emptySliderMarkerText: EMPTY_SLIDER_MARKER_TEXT,
    pointerSize: POINTER_SIZE
};

const formatValue = function(value, formatOptions, tickIntervalsInfo, valueType, type, logarithmBase) {
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

export { utils };
export { consts };
export { formatValue };
export { HEIGHT_COMPACT_MODE };
