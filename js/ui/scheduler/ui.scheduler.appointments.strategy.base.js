"use strict";

var noop = require("../../core/utils/common").noop,
    Class = require("../../core/class"),
    extend = require("../../core/utils/extend").extend,
    errors = require("../widget/ui.errors"),
    dateUtils = require("../../core/utils/date"),
    isNumeric = require("../../core/utils/type").isNumeric;

var abstract = Class.abstract;

var APPOINTMENT_MIN_SIZE = 2,
    COMPACT_APPOINTMENT_DEFAULT_SIZE = 15,
    APPOINTMENT_DEFAULT_HEIGHT = 20,
    COMPACT_APPOINTMENT_DEFAULT_OFFSET = 3;

var BaseRenderingStrategy = Class.inherit({
    ctor: function(instance) {
        this.instance = instance;
    },

    getAppointmentMinSize: function() {
        return APPOINTMENT_MIN_SIZE;
    },

    getDeltaTime: abstract,

    getAppointmentGeometry: function(coordinates) {
        return coordinates;
    },

    createTaskPositionMap: function(items) {
        var length = items.length;
        if(!length) return;

        this._defaultWidth = this.instance._cellWidth;
        this._defaultHeight = this.instance._cellHeight;
        this._allDayHeight = this.instance._allDayCellHeight;

        var map = [];
        for(var i = 0; i < length; i++) {
            var coordinates = this._getItemPosition(items[i]);

            if(this._isRtl()) {
                coordinates = this._correctRtlCoordinates(coordinates);
            }

            map.push(coordinates);
        }

        var positionArray = this._getSortedPositions(map),
            resultPositions = this._getResultPositions(positionArray);

        return this._getExtendedPositionMap(map, resultPositions);
    },

    _getDeltaWidth: function(args, initialSize) {
        var cellWidth = this._defaultWidth || this.getAppointmentMinSize(),
            initialWidth = initialSize.width;

        return Math.round((args.width - initialWidth) / cellWidth);
    },

    _correctRtlCoordinates: function(coordinates) {
        var width = coordinates[0].width || this._getAppointmentMaxWidth();

        if(!coordinates[0].appointmentReduced) {
            coordinates[0].left -= width;
        }

        this._correctRtlCoordinatesParts(coordinates, width);

        return coordinates;
    },

    _correctRtlCoordinatesParts: noop,

    _getAppointmentMaxWidth: function() {
        return this._defaultWidth;
    },

    _getItemPosition: function(item) {
        var position = this._getAppointmentCoordinates(item),
            allDay = this.isAllDay(item),
            result = [],
            startDate = new Date(this.instance.fire("getField", "startDate", item));

        for(var j = 0; j < position.length; j++) {
            var height = this.calculateAppointmentHeight(item, position[j]),
                width = this.calculateAppointmentWidth(item, position[j]),
                resultWidth = width,
                appointmentReduced = null,
                multiWeekAppointmentParts = [],
                initialRowIndex = position[j].rowIndex,
                initialCellIndex = position[j].cellIndex;

            if((this._needVerifyItemSize() || allDay)) {
                var currentMaxAllowedPosition = position[j].hMax;

                if(this.isAppointmentGreaterThan(currentMaxAllowedPosition, {
                    left: position[j].left,
                    width: width
                })) {

                    appointmentReduced = "head";

                    initialRowIndex = position[j].rowIndex;
                    initialCellIndex = position[j].cellIndex;

                    resultWidth = this._reduceMultiWeekAppointment(width, {
                        left: position[j].left,
                        right: currentMaxAllowedPosition
                    });

                    multiWeekAppointmentParts = this._getAppointmentParts({
                        sourceAppointmentWidth: width,
                        reducedWidth: resultWidth,
                        height: height
                    }, position[j], startDate, j);


                    if(this._isRtl()) {
                        position[j].left = currentMaxAllowedPosition;
                    }

                }
            }

            extend(position[j], {
                height: height,
                width: resultWidth,
                allDay: allDay,
                rowIndex: initialRowIndex,
                cellIndex: initialCellIndex,
                appointmentReduced: appointmentReduced
            });
            result = this._getAppointmentPartsPosition(multiWeekAppointmentParts, position[j], result);
        }

        return result;
    },

    _getAppointmentPartsPosition: function(appointmentParts, position, result) {
        if(appointmentParts.length) {
            appointmentParts.unshift(position);
            result = result.concat(appointmentParts);
        } else {
            result.push(position);
        }

        return result;
    },

    _getAppointmentCoordinates: function(itemData) {
        var coordinates = [{
            top: 0,
            left: 0
        }];
        this.instance.fire("needCoordinates", {
            startDate: this._startDate(itemData),
            originalStartDate: this._startDate(itemData, true),
            appointmentData: itemData,
            callback: function(value) {
                coordinates = value;
            }
        });

        return coordinates;
    },

    _isRtl: function() {
        return this.instance.option("rtlEnabled");
    },

    _getAppointmentParts: function() {
        return [];
    },

    _getCompactAppointmentParts: function(appointmentWidth) {
        var cellWidth = this._defaultWidth || this.getAppointmentMinSize();

        return Math.round(appointmentWidth / cellWidth);
    },

    _reduceMultiWeekAppointment: function(sourceAppointmentWidth, bound) {
        if(this._isRtl()) {
            sourceAppointmentWidth = Math.floor(bound.left - bound.right);
        } else {
            sourceAppointmentWidth = bound.right - Math.floor(bound.left);
        }
        return sourceAppointmentWidth;
    },

    calculateAppointmentHeight: function() {
        return 0;
    },

    calculateAppointmentWidth: function() {
        return 0;
    },

    isAppointmentGreaterThan: function(etalon, comparisonParameters) {
        var result = comparisonParameters.left + comparisonParameters.width - etalon;

        if(this._isRtl()) {
            result = etalon + comparisonParameters.width - comparisonParameters.left;
        }

        return result > this._defaultWidth / 2;
    },

    isAllDay: function() {
        return false;
    },

    _getSortedPositions: function(arr) {
        var result = [],
            // unstable sorting fix
            __tmpIndex = 0;

        for(var i = 0, arrLength = arr.length; i < arrLength; i++) {
            for(var j = 0, itemLength = arr[i].length; j < itemLength; j++) {
                var item = arr[i][j];

                var start = {
                    i: i,
                    j: j,
                    top: item.top,
                    left: item.left,
                    isStart: true,
                    allDay: item.allDay,
                    __tmpIndex: __tmpIndex
                };

                __tmpIndex++;

                var end = {
                    i: i,
                    j: j,
                    top: item.top + item.height,
                    left: item.left + item.width,
                    isStart: false,
                    allDay: item.allDay,
                    __tmpIndex: __tmpIndex
                };

                result.push(start, end);

                __tmpIndex++;
            }
        }

        result.sort((function(a, b) {
            return this._sortCondition(a, b);
        }).bind(this));

        return result;
    },

    _fixUnstableSorting: function(comparisonResult, a, b) {
        if(comparisonResult === 0) {
            if(a.__tmpIndex < b.__tmpIndex) return -1;
            if(a.__tmpIndex > b.__tmpIndex) return 1;
        }
        return comparisonResult;
    },

    _sortCondition: abstract,

    _rowCondition: function(a, b) {
        var columnCondition = this._normalizeCondition(a.left, b.left),
            rowCondition = this._normalizeCondition(a.top, b.top);
        return columnCondition ? columnCondition : rowCondition ? rowCondition : a.isStart - b.isStart;
    },

    _columnCondition: function(a, b) {
        var columnCondition = this._normalizeCondition(a.left, b.left),
            rowCondition = this._normalizeCondition(a.top, b.top);
        return rowCondition ? rowCondition : columnCondition ? columnCondition : a.isStart - b.isStart;
    },

    _normalizeCondition: function(first, second) {
        //NOTE: ie & ff pixels
        var result = first - second;
        return Math.abs(result) > 1.001 ? result : 0;
    },

    _getResultPositions: function(sortedArray) {
        var stack = [],
            indexes = [],
            result = [],
            intersectPositions = [],
            intersectPositionCount = 0,
            sortedIndex = 0,
            position;

        for(var i = 0; i < sortedArray.length; i++) {
            var current = sortedArray[i],
                j;

            if(current.isStart) {
                position = undefined;
                for(j = 0; j < indexes.length; j++) {
                    if(!indexes[j]) {

                        position = j;
                        indexes[j] = true;
                        break;
                    }
                }

                if(position === undefined) {

                    position = indexes.length;

                    indexes.push(true);

                    for(j = 0; j < stack.length; j++) {
                        stack[j].count++;
                    }
                }

                stack.push({
                    index: position,
                    count: indexes.length,
                    i: current.i,
                    j: current.j,
                    sortedIndex: sortedIndex++
                });

                if(intersectPositionCount < indexes.length) {
                    intersectPositionCount = indexes.length;
                }
            } else {
                var removeIndex = this._findIndexByKey(stack, "i", "j", current.i, current.j),
                    resultItem = stack[removeIndex];

                stack.splice(removeIndex, 1);

                indexes[resultItem.index] = false;
                intersectPositions.push(resultItem);

                if(!stack.length) {
                    indexes = [];
                    for(var k = 0; k < intersectPositions.length; k++) {
                        intersectPositions[k].count = intersectPositionCount;
                    }
                    intersectPositions = [];
                    intersectPositionCount = 0;
                }

                result.push(resultItem);

            }
        }

        return result.sort(function(a, b) {
            var columnCondition = a.j - b.j,
                rowCondition = a.i - b.i;
            return rowCondition ? rowCondition : columnCondition;
        });
    },

    _findIndexByKey: function(arr, iKey, jKey, iValue, jValue) {
        var result = 0;
        for(var i = 0, len = arr.length; i < len; i++) {
            if(arr[i][iKey] === iValue && arr[i][jKey] === jValue) {
                result = i;
                break;
            }
        }
        return result;
    },

    _getExtendedPositionMap: function(map, positions) {
        var positionCounter = 0,
            result = [];
        for(var i = 0, mapLength = map.length; i < mapLength; i++) {
            var resultString = [];
            for(var j = 0, itemLength = map[i].length; j < itemLength; j++) {
                map[i][j].index = positions[positionCounter].index;
                map[i][j].sortedIndex = positions[positionCounter].sortedIndex;
                map[i][j].count = positions[positionCounter++].count;
                resultString.push(map[i][j]);
                this._checkLongCompactAppointment(map[i][j], resultString);
            }
            result.push(resultString);
        }
        return result;
    },

    _checkLongCompactAppointment: noop,

    _splitLongCompactAppointment: function(item, result) {
        var appointmentCountPerCell = this._getMaxAppointmentCountPerCell();
        var compactCount = 0;

        if(appointmentCountPerCell && item.index > appointmentCountPerCell - 1) {
            item.isCompact = true;
            compactCount = this._getCompactAppointmentParts(item.width);
            for(var k = 1; k < compactCount; k++) {
                var compactPart = extend(true, {}, item);
                compactPart.left = this._getCompactLeftCoordinate(item.left, k);
                compactPart.cellIndex = compactPart.cellIndex + k;
                compactPart.sortedIndex = null;
                result.push(compactPart);
            }
        }
        return result;
    },

    _startDate: function(appointment, skipNormalize, position) {
        var startDate = position && position.startDate,
            viewStartDate = this.instance._getStartDate(appointment, skipNormalize),
            text = this.instance.fire("getField", "text", appointment);

        if((startDate && viewStartDate > startDate) || !startDate) {
            startDate = viewStartDate;
        }
        if(isNaN(startDate.getTime())) {
            throw errors.Error("E1032", text);
        }

        return startDate;
    },

    _endDate: function(appointment, position) {
        var endDate = this.instance._getEndDate(appointment),
            realStartDate = this._startDate(appointment, true),
            viewStartDate = this._startDate(appointment, false, position);

        this._checkWrongEndDate(appointment, realStartDate, endDate);

        if(viewStartDate.getTime() >= endDate.getTime()) {
            var recurrencePartStartDate = position ? position.startDate : realStartDate,
                fullDuration = endDate.getTime() - realStartDate.getTime();

            endDate = new Date((viewStartDate.getTime() >= recurrencePartStartDate.getTime() ? recurrencePartStartDate.getTime() : viewStartDate.getTime()) + fullDuration);

            if(!dateUtils.sameDate(realStartDate, endDate) && recurrencePartStartDate.getTime() < viewStartDate.getTime()) {
                var headDuration = dateUtils.trimTime(endDate).getTime() - recurrencePartStartDate.getTime(),
                    tailDuration = fullDuration - headDuration || fullDuration;

                endDate = new Date(dateUtils.trimTime(viewStartDate).getTime() + tailDuration);
            }

        }

        var viewEndDate = dateUtils.roundToHour(this.instance.fire("getEndViewDate"));

        if(endDate > viewEndDate) {
            endDate = viewEndDate;
        }

        return endDate;
    },

    _checkWrongEndDate: function(appointment, startDate, endDate) {
        if(!endDate || startDate.getTime() >= endDate.getTime()) {
            endDate = new Date(startDate.getTime() + this.instance.getAppointmentDurationInMinutes() * 60000);
            this.instance.fire("setField", "endDate", appointment, endDate);
        }
    },

    _getAppointmentDurationInMs: function(startDate, endDate, allDay) {
        var result;
        this.instance.fire("getAppointmentDurationInMs", {
            startDate: startDate,
            endDate: endDate,
            allDay: allDay,
            callback: function(duration) {
                result = duration;
            }
        });

        return result;
    },

    _getMaxNeighborAppointmentCount: function() {
        var overlappingMode = this.instance.fire("getMaxAppointmentsPerCell");
        if(!overlappingMode) {
            var outerAppointmentWidth = this.getCompactAppointmentDefaultSize() + this.getCompactAppointmentDefaultOffset();
            return Math.floor(this.getCompactAppointmentGroupMaxWidth() / outerAppointmentWidth);
        } else {
            return 0;
        }
    },

    _markAppointmentAsVirtual: function(coordinates, isAllDay) {
        var countFullWidthAppointmentInCell = this._getMaxAppointmentCountPerCell();
        if((coordinates.count - countFullWidthAppointmentInCell) > this._getMaxNeighborAppointmentCount()) {
            coordinates.virtual = {
                top: coordinates.top,
                left: coordinates.left,
                index: coordinates.groupIndex + "-" + coordinates.rowIndex + "-" + coordinates.cellIndex,
                isAllDay: isAllDay
            };
        }
    },

    getCompactAppointmentGroupMaxWidth: function() {
        var widthInPercents = 75;
        return widthInPercents * this.getDefaultCellWidth() / 100;
    },

    getDefaultCellWidth: function() {
        return this._defaultWidth;
    },

    getCompactAppointmentDefaultSize: function() {
        return COMPACT_APPOINTMENT_DEFAULT_SIZE;
    },

    getCompactAppointmentDefaultOffset: function() {
        return COMPACT_APPOINTMENT_DEFAULT_OFFSET;
    },

    getAppointmentDataCalculator: noop,

    _customizeCoordinates: function(coordinates, ratio, appointmentCountPerCell, maxHeight, isAllDay) {
        var index = coordinates.index,
            height = ratio * maxHeight / appointmentCountPerCell,
            top = (1 - ratio) * maxHeight + coordinates.top + (index * height),
            width = coordinates.width,
            left = coordinates.left,
            compactAppointmentDefaultSize,
            compactAppointmentDefaultOffset;

        if(coordinates.isCompact) {
            compactAppointmentDefaultSize = this.getCompactAppointmentDefaultSize();
            compactAppointmentDefaultOffset = this.getCompactAppointmentDefaultOffset();
            top = coordinates.top + compactAppointmentDefaultOffset;
            left = coordinates.left + (index - appointmentCountPerCell) * (compactAppointmentDefaultSize + compactAppointmentDefaultOffset) + compactAppointmentDefaultOffset;
            height = compactAppointmentDefaultSize;
            width = compactAppointmentDefaultSize;

            this._markAppointmentAsVirtual(coordinates, isAllDay);
        }

        return {
            height: height,
            width: width,
            top: top,
            left: left
        };
    },

    _calculateGeometryConfig: function(coordinates) {
        var overlappingMode = this.instance.fire("getMaxAppointmentsPerCell"),
            offsets = this._getOffsets();

        var appointmentCountPerCell = this._getAppointmentCount(overlappingMode, coordinates);
        var ratio = this._getDefaultRatio(coordinates, appointmentCountPerCell);
        var maxHeight = this._getMaxHeight();

        if(!appointmentCountPerCell) {
            appointmentCountPerCell = coordinates.count;
            ratio = (maxHeight - offsets.unlimited) / maxHeight;
        }
        if(overlappingMode === "auto") {
            ratio = (maxHeight - offsets.auto) / maxHeight;
        }

        return {
            ratio: ratio,
            appointmentCountPerCell: appointmentCountPerCell,
            maxHeight: maxHeight
        };
    },

    _getAppointmentCount: noop,

    _getDefaultRatio: noop,

    _getOffsets: noop,

    _getMaxHeight: noop,

    _needVerifyItemSize: function() {
        return false;
    },

    _getMaxAppointmentCountPerCell: function() {
        var overlappingMode = this.instance.fire("getMaxAppointmentsPerCell"),
            appointmentCountPerCell;

        if(!overlappingMode) {
            appointmentCountPerCell = 2;
        }
        if(isNumeric(overlappingMode)) {
            appointmentCountPerCell = overlappingMode;
        }
        if(overlappingMode === "auto") {
            appointmentCountPerCell = this._getDynamicAppointmentCountPerCell();
        }
        if(overlappingMode === "unlimited") {
            appointmentCountPerCell = undefined;
        }

        return appointmentCountPerCell;
    },

    _getDynamicAppointmentCountPerCell: function() {
        var cellHeight = this.instance.fire("getCellHeight");

        return Math.floor((cellHeight - APPOINTMENT_DEFAULT_HEIGHT) / APPOINTMENT_DEFAULT_HEIGHT) || 1;
    }
});

module.exports = BaseRenderingStrategy;
