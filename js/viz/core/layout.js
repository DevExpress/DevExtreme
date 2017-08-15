"use strict";

var _normalizeEnum = require("./utils").normalizeEnum,
    _min = Math.min,
    _max = Math.max,

    ALIGN_START = 0,
    ALIGN_MIDDLE = 1,
    ALIGN_END = 2,

    horizontalAlignmentMap = {
        left: ALIGN_START,
        center: ALIGN_MIDDLE,
        right: ALIGN_END
    },

    verticalAlignmentMap = {
        top: ALIGN_START,
        center: ALIGN_MIDDLE,
        bottom: ALIGN_END
    },

    sideMap = {
        horizontal: 0,
        vertical: 1
    },

    slicersMap = {};

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
    var val = _normalizeEnum(value);
    return val in map ? map[val] : defaultValue;
}

function normalizeLayoutOptions(options) {
    var side = pickValue(options.side, sideMap, 1),
        alignment = [
            pickValue(options.horizontalAlignment, horizontalAlignmentMap, ALIGN_MIDDLE),
            pickValue(options.verticalAlignment, verticalAlignmentMap, ALIGN_START)
        ];

    return {
        side: side,
        primary: bringToEdge(alignment[side]),
        secondary: alignment[1 - side],
        weak: options.weak
    };
}

function bringToEdge(primary) {
    return primary < 2 ? 0 : 2;
}

function getConjugateSide(side) {
    return 1 - side;
}

function getOppositeAlignment(alignment) {
    return 2 - alignment;
}

function getSlice(alignment, a, b, size) {
    return slicersMap[alignment](a, b, size);
}

function getShrink(alignment, size) {
    return (alignment > 0 ? -1 : +1) * size;
}

function processForward(item, rect, minSize) {
    var side = item.side,
        size = item.element.measure([rect[2] - rect[0], rect[3] - rect[1]]),
        isValid = size[side] < rect[2 + side] - rect[side] - minSize[side];

    if(isValid) {
        rect[item.primary + side] += getShrink(item.primary, size[side]);
        item.size = size;
    }
    return isValid;
}

function processBackward(item, rect) {
    var primarySide = item.side,
        secondarySide = getConjugateSide(primarySide),
        itemRect = [],
        secondary = getSlice(item.secondary, rect[secondarySide], rect[2 + secondarySide], item.size[secondarySide]);

    itemRect[primarySide] = itemRect[2 + primarySide] = rect[item.primary + primarySide];
    itemRect[item.primary + primarySide] = rect[item.primary + primarySide] -= getShrink(item.primary, item.size[primarySide]);
    itemRect[secondarySide] = secondary[0];
    itemRect[2 + secondarySide] = secondary[1];
    item.element.move(itemRect);
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
        var rect = targetRect.slice(),
            targets = createTargets(this._targets),
            i,
            ii = targets.length,
            cache = [];

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

    backward: function(targetRect) {
        var rect = targetRect.slice(),
            targets = this._cache,
            i,
            ii = targets.length;

        for(i = 0; i < ii; ++i) {
            processBackward(targets[i], rect);
        }
        this._cache = null;
    }
};

function createTargets(targets) {
    var i,
        ii = targets.length,
        collection = [],
        layout;

    for(i = 0; i < ii; ++i) {
        layout = targets[i].layoutOptions();
        if(layout) {
            layout = normalizeLayoutOptions(layout);
            layout.element = targets[i];
            collection.push(layout);
        }
    }
    processWeakItems(collection);
    return collection;
}

function processWeakItems(collection) {
    var i,
        ii,
        j,
        weakItem,
        isProcessed = true;

    while(isProcessed) {
        isProcessed = false;
        ii = collection.length;
        for(i = 0; i < ii; ++i) {
            if(collection[i].weak) {
                weakItem = collection[i];
                for(j = 0; j < ii; ++j) {
                    if(i !== j && weakItem.side === collection[j].side && weakItem.primary === collection[j].primary) {
                        collection[_min(i, j)] = makePair(collection[_min(i, j)], collection[_max(i, j)]);
                        collection.splice(_max(i, j), 1);
                        isProcessed = true;
                        break;
                    }
                }
                if(isProcessed) {
                    break;
                }
            }
        }
    }
}

function makePair(first, second) {
    return {
        side: first.side,
        primary: first.primary,
        secondary: first.secondary === second.secondary ? first.secondary : (bringToEdge(first.secondary) || bringToEdge(second.secondary)),
        element: new PairElement(first, second)
    };
}

function PairElement(first, second) {
    this._first = first;
    this._second = second;
}

PairElement.prototype.measure = function(targetSize) {
    var first = this._first,
        second = this._second,
        size = targetSize.slice(),
        primarySide = first.side,
        secondarySide = getConjugateSide(primarySide),
        firstSize = first.element.measure(size.slice()),
        secondSize;

    size[secondarySide] -= firstSize[secondarySide];
    secondSize = second.element.measure(size.slice());
    size[primarySide] = _max(firstSize[primarySide], secondSize[primarySide]);
    if(first.secondary === second.secondary) {
        size[secondarySide] = firstSize[secondarySide] + secondSize[secondarySide];
    } else if(first.secondary === ALIGN_MIDDLE || second.secondary === ALIGN_MIDDLE) {
        size[secondarySide] = targetSize[secondarySide] / 2 + (first.secondary === ALIGN_MIDDLE ? firstSize : secondSize)[secondarySide] / 2;
    } else {
        size[secondarySide] = targetSize[secondarySide];
    }
    first.size = firstSize;
    second.size = secondSize;
    return size;
};

PairElement.prototype.move = function(targetRect) {
    var first = this._first,
        second = this._second,
        primarySide = first.side,
        secondarySide = getConjugateSide(primarySide),
        alignment = first.secondary === second.secondary ? bringToEdge(first.secondary) :
            (first.secondary === ALIGN_MIDDLE ? getOppositeAlignment(bringToEdge(second.secondary)) : bringToEdge(first.secondary)),
        primary,
        secondary,
        rect;

    primary = getSlice(ALIGN_MIDDLE, targetRect[primarySide], targetRect[2 + primarySide], first.size[primarySide]);
    secondary = getSlice(alignment, targetRect[secondarySide], targetRect[2 + secondarySide], first.size[secondarySide]);
    rect = [];
    rect[primarySide] = primary[0];
    rect[2 + primarySide] = primary[1];
    rect[secondarySide] = secondary[0];
    rect[2 + secondarySide] = secondary[1];
    first.element.move(rect);
    primary = getSlice(ALIGN_MIDDLE, targetRect[primarySide], targetRect[2 + primarySide], second.size[primarySide]);
    secondary = getSlice(getOppositeAlignment(alignment), targetRect[secondarySide], targetRect[2 + secondarySide],
        targetRect[2 + secondarySide] - targetRect[secondarySide] - first.size[secondarySide]);
    secondary = getSlice(getOppositeAlignment(alignment), secondary[0], secondary[1], second.size[secondarySide]);
    rect = [];
    rect[primarySide] = primary[0];
    rect[2 + primarySide] = primary[1];
    rect[secondarySide] = secondary[0];
    rect[2 + secondarySide] = secondary[1];
    second.element.move(rect);
};

PairElement.prototype.freeSpace = function() {
    this._first.element.freeSpace();
    this._second.element.freeSpace();
};

module.exports = Layout;
