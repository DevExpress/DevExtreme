var iterateUtils = require('../../core/utils/iterator'),
    BaseElement = require('./base_indicators').BaseElement,

    _Number = Number,
    _abs = Math.abs,
    _isString = require('../../core/utils/type').isString,
    _isArray = Array.isArray,
    _isFinite = isFinite,
    _each = iterateUtils.each;

var BaseRangeContainer = BaseElement.inherit({
    _init: function() {
        this._root = this._renderer.g().attr({ 'class': 'dxg-range-container' }).linkOn(this._container, 'range-container');
    },

    _dispose: function() {
        this._root.linkOff();
    },

    clean: function() {
        this._root.linkRemove().clear();
        this._options = this.enabled = null;
        return this;
    },

    _getRanges: function() {
        var that = this,
            options = that._options,
            translator = that._translator,
            totalStart = translator.getDomain()[0],
            totalEnd = translator.getDomain()[1],
            totalDelta = totalEnd - totalStart,
            isNotEmptySegment = totalDelta >= 0 ? isNotEmptySegmentAsc : isNotEmptySegmentDesc,
            subtractSegment = totalDelta >= 0 ? subtractSegmentAsc : subtractSegmentDesc,
            list = [],
            ranges = [],
            backgroundRanges = [{ start: totalStart, end: totalEnd }],
            threshold = _abs(totalDelta) / 1E4,
            palette,
            backgroundColor = _isString(options.backgroundColor) ? options.backgroundColor : 'none',
            width = options.width || {},
            startWidth = _Number(width > 0 ? width : width.start),
            endWidth = _Number(width > 0 ? width : width.end),
            deltaWidth = endWidth - startWidth;

        if(options.ranges !== undefined && !_isArray(options.ranges)) {
            return null;
        }
        if(!(startWidth >= 0 && endWidth >= 0 && startWidth + endWidth > 0)) {
            return null;
        }
        list = (_isArray(options.ranges) ? options.ranges : []).reduce((result, rangeOptions, i) => {
            rangeOptions = rangeOptions || {};
            var start = translator.adjust(rangeOptions.startValue),
                end = translator.adjust(rangeOptions.endValue);
            if(_isFinite(start) && _isFinite(end) && isNotEmptySegment(start, end, threshold)) {
                result.push({ start: start, end: end, color: rangeOptions.color, classIndex: i });
            }
            return result;
        }, []);

        palette = that._themeManager.createPalette(options.palette, {
            type: 'indicatingSet',
            extensionMode: options.paletteExtensionMode,
            keepLastColorInEnd: true,
            count: list.length
        });

        _each(list, function(_, item) {
            var paletteColor = palette.getNextColor();
            item.color = (_isString(item.color) && item.color) || paletteColor || 'none';
            item.className = 'dxg-range dxg-range-' + item.classIndex;
            delete item.classIndex;
        });

        _each(list, function(_, item) {
            var i, ii,
                sub,
                subs,
                range,
                newRanges = [],
                newBackgroundRanges = [];

            for(i = 0, ii = ranges.length; i < ii; ++i) {
                range = ranges[i];
                subs = subtractSegment(range.start, range.end, item.start, item.end);
                (sub = subs[0]) && (sub.color = range.color) && (sub.className = range.className) && newRanges.push(sub);
                (sub = subs[1]) && (sub.color = range.color) && (sub.className = range.className) && newRanges.push(sub);
            }
            newRanges.push(item);
            ranges = newRanges;
            for(i = 0, ii = backgroundRanges.length; i < ii; ++i) {
                range = backgroundRanges[i];
                subs = subtractSegment(range.start, range.end, item.start, item.end);
                (sub = subs[0]) && newBackgroundRanges.push(sub);
                (sub = subs[1]) && newBackgroundRanges.push(sub);
            }
            backgroundRanges = newBackgroundRanges;
        });
        _each(backgroundRanges, function(_, range) {
            range.color = backgroundColor;
            range.className = 'dxg-range dxg-background-range';
            ranges.push(range);
        });
        _each(ranges, function(_, range) {
            range.startWidth = (range.start - totalStart) / totalDelta * deltaWidth + startWidth;
            range.endWidth = (range.end - totalStart) / totalDelta * deltaWidth + startWidth;
        });
        return ranges;
    },

    render: function(options) {
        var that = this;
        that._options = options;
        that._processOptions();
        that._ranges = that._getRanges();
        if(that._ranges) {
            that.enabled = true;
            that._root.linkAppend();
        }
        return that;
    },

    resize: function(layout) {
        var that = this;
        that._root.clear();
        if(that._isVisible(layout)) {
            _each(that._ranges, function(_, range) {
                that._createRange(range, layout).attr({ fill: range.color, 'class': range.className }).append(that._root);
            });
        }
        return that;
    },

    _processOptions: null,

    _isVisible: null,

    _createRange: null,

    // S170193
    getColorForValue: function(value) {
        var color = null;
        _each(this._ranges, function(_, range) {
            if((range.start <= value && value <= range.end) || (range.start >= value && value >= range.end)) {
                color = range.color;
                return false;
            }
        });
        return color;
    }
});

function subtractSegmentAsc(segmentStart, segmentEnd, otherStart, otherEnd) {
    var result;
    if(otherStart > segmentStart && otherEnd < segmentEnd) {
        result = [{ start: segmentStart, end: otherStart }, { start: otherEnd, end: segmentEnd }];
    } else if(otherStart >= segmentEnd || otherEnd <= segmentStart) {
        result = [{ start: segmentStart, end: segmentEnd }];
    } else if(otherStart <= segmentStart && otherEnd >= segmentEnd) {
        result = [];
    } else if(otherStart > segmentStart) {
        result = [{ start: segmentStart, end: otherStart }];
    } else if(otherEnd < segmentEnd) {
        result = [{ start: otherEnd, end: segmentEnd }];
    }
    return result;
}

function subtractSegmentDesc(segmentStart, segmentEnd, otherStart, otherEnd) {
    var result;
    if(otherStart < segmentStart && otherEnd > segmentEnd) {
        result = [{ start: segmentStart, end: otherStart }, { start: otherEnd, end: segmentEnd }];
    } else if(otherStart <= segmentEnd || otherEnd >= segmentStart) {
        result = [{ start: segmentStart, end: segmentEnd }];
    } else if(otherStart >= segmentStart && otherEnd <= segmentEnd) {
        result = [];
    } else if(otherStart < segmentStart) {
        result = [{ start: segmentStart, end: otherStart }];
    } else if(otherEnd > segmentEnd) {
        result = [{ start: otherEnd, end: segmentEnd }];
    }
    return result;
}

function isNotEmptySegmentAsc(start, end, threshold) {
    return end - start >= threshold;
}

function isNotEmptySegmentDesc(start, end, threshold) {
    return start - end >= threshold;
}

module.exports = BaseRangeContainer;
