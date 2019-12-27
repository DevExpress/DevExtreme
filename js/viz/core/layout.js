const _normalizeEnum = require('./utils').normalizeEnum;
const _min = Math.min;
const _max = Math.max;
const _round = Math.round;

const ALIGN_START = 0;
const ALIGN_MIDDLE = 1;
const ALIGN_END = 2;

const horizontalAlignmentMap = {
    left: ALIGN_START,
    center: ALIGN_MIDDLE,
    right: ALIGN_END
};

const verticalAlignmentMap = {
    top: ALIGN_START,
    center: ALIGN_MIDDLE,
    bottom: ALIGN_END
};

const sideMap = {
    horizontal: 0,
    vertical: 1
};

const slicersMap = {};

const BBOX_CEIL_CORRECTION = 2;

slicersMap[ALIGN_START] = function(a, b, size) {
    return [a, _min(b, a + size)];
};
slicersMap[ALIGN_MIDDLE] = function(a, b, size) {
    return [_max(a, (a + b - size) / 2), _min(b, (a + b + size) / 2)];
};
slicersMap[ALIGN_END] = function(a, b, size) {
    return [_max(a, b - size), b];
};

function pickValue(value, map, defaultValue) {
    const val = _normalizeEnum(value);
    return val in map ? map[val] : defaultValue;
}

function normalizeLayoutOptions(options) {
    const side = pickValue(options.side, sideMap, 1);
    const alignment = [
        pickValue(options.horizontalAlignment, horizontalAlignmentMap, ALIGN_MIDDLE),
        pickValue(options.verticalAlignment, verticalAlignmentMap, ALIGN_START)
    ];

    return {
        side: side,
        primary: bringToEdge(alignment[side]),
        secondary: alignment[1 - side],
        weak: options.weak,
        priority: options.priority || 0,
        header: options.header,
        position: options.position
    };
}

function bringToEdge(primary) {
    return primary < 2 ? 0 : 2;
}

function getConjugateSide(side) {
    return 1 - side;
}

function getSlice(alignment, a, b, size) {
    return slicersMap[alignment](a, b, size);
}

function getShrink(alignment, size) {
    return (alignment > 0 ? -1 : +1) * size;
}

function processForward(item, rect, minSize) {
    const side = item.side;
    const size = item.element.measure([rect[2] - rect[0], rect[3] - rect[1]]);
    const minSide = item.position === 'indside' ? 0 : minSize[side];
    const isValid = size[side] < rect[2 + side] - rect[side] - minSide;

    if(isValid) {
        if(item.position !== 'inside') {
            rect[item.primary + side] += getShrink(item.primary, size[side]);
        }
        item.size = size;
    }
    return isValid;
}

function processRectBackward(item, rect, alignmentRect) {
    const primarySide = item.side;
    const secondarySide = getConjugateSide(primarySide);
    const itemRect = [];
    const secondary = getSlice(item.secondary, alignmentRect[secondarySide], alignmentRect[2 + secondarySide], item.size[secondarySide]);

    itemRect[primarySide] = _round(itemRect[2 + primarySide] = rect[item.primary + primarySide] + (item.position === 'inside' ? getShrink(item.primary, item.size[primarySide]) : 0));
    itemRect[item.primary + primarySide] = _round(rect[item.primary + primarySide] - getShrink(item.primary, item.size[primarySide]));

    if(item.position !== 'inside') {
        rect[item.primary + primarySide] = itemRect[item.primary + primarySide];
    }

    itemRect[secondarySide] = _round(secondary[0]);
    itemRect[2 + secondarySide] = _round(secondary[1]);

    return itemRect;
}

function processBackward(item, rect, alignmentRect, fitRect, size, targetRect) {
    const itemRect = processRectBackward(item, rect, alignmentRect);
    const itemFitRect = processRectBackward(item, fitRect, fitRect);

    if(size[item.side] > 0) {
        size[item.side] -= item.size[item.side];
        targetRect[item.primary + item.side] = itemRect[item.primary + item.side];
        item.element.freeSpace();
    } else {
        item.element.move(itemRect, itemFitRect);
    }

}

function Layout() {
    this._targets = [];
}

Layout.prototype = {
    constructor: Layout,

    dispose: function() {
        this._targets = null;
    },

    add: function(target) {
        this._targets.push(target);
    },

    // Note on possible improvement.
    // "createTargets" part depends on options of a target while the following cycle depends on container size - those areas do not intersect.
    // When any of options are changed targets have to be recreated and cycle has to be executed. But when container size is changed there is no
    // need to recreate targets - only cycle has to be executed.
    forward: function(targetRect, minSize) {
        const rect = targetRect.slice();
        const targets = createTargets(this._targets);
        let i;
        const ii = targets.length;
        const cache = [];

        for(i = 0; i < ii; ++i) {
            if(processForward(targets[i], rect, minSize)) {
                cache.push(targets[i]);
            } else {
                targets[i].element.freeSpace();
            }
        }
        this._cache = cache.reverse();
        return rect;
    },

    backward: function(targetRect, alignmentRect, size = [0, 0]) {
        let backwardRect = targetRect.slice();
        const fitRect = targetRect.slice();
        const targets = this._cache;
        let targetSide = 0;
        let target;
        let i;

        const ii = targets.length;

        for(i = 0; i < ii; ++i) {
            target = targets[i];
            if(target.side !== targetSide) {
                backwardRect = targetRect.slice();
            }
            processBackward(target, backwardRect, alignmentRect, fitRect, size, targetRect);
            targetSide = target.side;
        }

        return size;
    }
};

function createTargets(targets) {
    let i;
    const ii = targets.length;
    let collection = [];
    let layout;

    for(i = 0; i < ii; ++i) {
        layout = targets[i].layoutOptions();
        if(layout) {
            layout = normalizeLayoutOptions(layout);
            layout.element = targets[i];
            collection.push(layout);
        }
    }

    collection.sort(function(a, b) {
        return b.side - a.side || a.priority - b.priority;
    });

    collection = processWeakItems(collection);

    return collection;
}

function processWeakItems(collection) {
    const weakItem = collection.filter(function(item) {
        return item.weak === true;
    })[0];
    let headerItem;

    if(weakItem) {
        headerItem = collection.filter(function(item) {
            return weakItem.primary === item.primary && item.side === weakItem.side && item !== weakItem;
        })[0];
    }

    if(weakItem && headerItem) {
        return [makeHeader(headerItem, weakItem)].concat(collection.filter(function(item) {
            return !(item === headerItem || item === weakItem);
        }));
    }

    return collection;
}

function processBackwardHeaderRect(element, rect) {
    const rectCopy = rect.slice();
    const itemRect = processRectBackward(element, rectCopy, rectCopy);
    itemRect[element.side] = rect[element.side];

    itemRect[2 + element.side] = rect[2 + element.side];

    return itemRect;
}

function makeHeader(header, weakElement) {
    const side = header.side;
    const primary = header.primary;
    const secondary = header.secondary;

    return {
        side: side,
        primary: primary,
        secondary: secondary,
        priority: 0,
        element: {
            measure: function(targetSize) {
                const result = targetSize.slice();
                const weakSize = weakElement.element.measure(targetSize.slice());
                targetSize[primary] -= weakSize[primary];
                const headerSize = header.element.measure(targetSize.slice());
                result[side] = weakSize[side] = headerSize[side] = Math.max(headerSize[side], weakSize[side]);

                weakElement.size = weakSize;
                header.size = headerSize;


                return result;
            },

            move: function(rect, fitRect) {
                if(fitRect[2] - fitRect[0] < header.size[0] + weakElement.size[0] - BBOX_CEIL_CORRECTION) {
                    this.freeSpace();
                    return;
                }

                const weakRect = processBackwardHeaderRect(weakElement, fitRect, fitRect);
                fitRect[2 + weakElement.primary] = weakRect[weakElement.primary];
                const headerFitReact = processBackwardHeaderRect(header, fitRect, fitRect);

                if(fitRect[2 + weakElement.primary] < rect[2 + weakElement.primary] && header.size[header.primary] > rect[2 + header.primary] - rect[header.primary]) {
                    rect[2 + weakElement.primary] = fitRect[2 + weakElement.primary];
                }

                let headerRect = processBackwardHeaderRect(header, rect, rect);
                if(headerRect[2 + weakElement.primary] > fitRect[2 + weakElement.primary]) {
                    rect[2 + weakElement.primary] = fitRect[2 + weakElement.primary];
                    headerRect = processBackwardHeaderRect(header, rect, rect);
                }

                weakElement.element.move(weakRect);
                header.element.move(headerRect, headerFitReact);
            },

            freeSpace: function() {
                header.element.freeSpace();
                weakElement.element.freeSpace();
            }
        }
    };
}

module.exports = Layout;
