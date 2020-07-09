import { refreshPaths } from './core/renderers/renderer';
import { each as _each } from '../core/utils/iterator';

// 'var' because JSHint throws W021 error
export let prepareSegmentRectPoints = function(left, top, width, height, borderOptions) {
    const maxSW = ~~((width < height ? width : height) / 2);
    const sw = borderOptions.width || 0;
    const newSW = sw < maxSW ? sw : maxSW;

    left = left + newSW / 2;
    top = top + newSW / 2;
    width = width - newSW;
    height = height - newSW;

    const right = left + width;
    const bottom = top + height;
    let points = [];
    let segments = [];
    let segmentSequence;
    let visiblyOpt = 0;
    let prevSegmentVisibility = 0;
    const allSegment = {
        top: [[left, top], [right, top]],
        right: [[right, top], [right, bottom]],
        bottom: [[right, bottom], [left, bottom]],
        left: [[left, bottom], [left, top]]
    };
    _each(allSegment, function(seg) {
        const visibility = !!borderOptions[seg];
        visiblyOpt = visiblyOpt * 2 + (~~visibility);
    });
    switch(visiblyOpt) {
        case 13:
        case 9:
            segmentSequence = ['left', 'top', 'right', 'bottom'];
            break;
        case 11:
            segmentSequence = ['bottom', 'left', 'top', 'right'];
            break;
        default:
            segmentSequence = ['top', 'right', 'bottom', 'left'];
    }

    _each(segmentSequence, function(_, seg) {
        const segmentVisibility = !!borderOptions[seg];

        if(!prevSegmentVisibility && segments.length) {
            points.push(segments);
            segments = [];
        }

        if(segmentVisibility) {
            _each(allSegment[seg].slice(prevSegmentVisibility), function(_, segment) {
                segments = segments.concat(segment);
            });
        }
        prevSegmentVisibility = ~~segmentVisibility;
    });
    segments.length && points.push(segments);

    points.length === 1 && (points = points[0]);

    return { points: points, pathType: visiblyOpt === 15 ? 'area' : 'line' };
};

export {
    refreshPaths
};

///#DEBUG
export const _test_prepareSegmentRectPoints = function() {
    const original = prepareSegmentRectPoints.original || prepareSegmentRectPoints;
    if(arguments[0]) {
        prepareSegmentRectPoints = arguments[0];
    }
    prepareSegmentRectPoints.original = original;
    prepareSegmentRectPoints.restore = function() { prepareSegmentRectPoints = original; };
    return prepareSegmentRectPoints;
};
///#ENDDEBUG
