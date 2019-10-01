var noop = require("../../../core/utils/common").noop,
    Class = require("../../../core/class"),
    extend = require("../../../core/utils/extend").extend,
    errors = require("../../widget/ui.errors"),
    dateUtils = require("../../../core/utils/date"),
    isNumeric = require("../../../core/utils/type").isNumeric,
    typeUtils = require("../../../core/utils/type"),
    themes = require("../../themes");

var toMs = dateUtils.dateToMilliseconds;

var abstract = Class.abstract;

var APPOINTMENT_MIN_COUNT = 1,
    APPOINTMENT_MIN_SIZE = 2,
    COMPACT_APPOINTMENT_DEFAULT_SIZE = 15,
    APPOINTMENT_DEFAULT_HEIGHT = 20,
    APPOINTMENT_DEFAULT_WIDTH = 40,
    COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT = 18,
    COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET = 22,
    COMPACT_APPOINTMENT_DEFAULT_OFFSET = 3,

    DROP_DOWN_BUTTON_DEFAULT_WIDTH = 24;

var BaseRenderingStrategy = Class.inherit({
    ctor: function(instance) {
        this.instance = instance;
    },

    getAppointmentMinSize: function() {
        return APPOINTMENT_MIN_SIZE;
    },

    keepAppointmentSettings: function() {
        return false;
    },

    getDeltaTime: abstract,

    getAppointmentGeometry: function(coordinates) {
        return coordinates;
    },

    needCorrectAppointmentDates: function() {
        return true;
    },

    getDirection: function() {
        return "horizontal";
    },

    createTaskPositionMap: function(items) {
        delete this._maxAppointmentCountPerCell;

        var length = items && items.length;
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
        var intervalWidth = this.instance.fire("getResizableStep") || this.getAppointmentMinSize(),
            initialWidth = initialSize.width;

        return Math.round((args.width - initialWidth) / intervalWidth);
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
            startDate = new Date(this.instance.fire("getField", "startDate", item)),
            isRecurring = !!this.instance.fire("getField", "recurrenceRule", item);

        for(var j = 0; j < position.length; j++) {
            var height = this.calculateAppointmentHeight(item, position[j], isRecurring),
                width = this.calculateAppointmentWidth(item, position[j], isRecurring),
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
                    }, position[j], startDate);


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
            startDate: this.startDate(itemData),
            originalStartDate: this.startDate(itemData, true),
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

    cropAppointmentWidth: function(width, cellWidth) {
        if(this.instance.fire("isGroupedByDate")) {
            width = cellWidth;
        }

        return width;
    },

    _getSortedPositions: function(positionList) {
        var result = [];

        var round = function(value) { return Math.round(value * 100) / 100; };
        var createSortedItem = function(rowIndex, cellIndex, top, left, position, isStart, allDay, tmpIndex) {
            return {
                i: rowIndex,
                j: cellIndex,
                top: round(top),
                left: round(left),
                cellPosition: position,
                isStart: isStart,
                allDay: allDay,
                __tmpIndex: tmpIndex
            };
        };

        var tmpIndex = 0; // unstable sorting fix

        for(var rowIndex = 0, rowCount = positionList.length; rowIndex < rowCount; rowIndex++) {
            for(var cellIndex = 0, cellCount = positionList[rowIndex].length; cellIndex < cellCount; cellIndex++) {
                var { top, left, height, width, cellPosition, allDay } = positionList[rowIndex][cellIndex];

                var start = createSortedItem(rowIndex, cellIndex, top, left, cellPosition, true, allDay, tmpIndex);
                tmpIndex++;

                var end = createSortedItem(rowIndex, cellIndex, top + height, left + width, cellPosition, false, allDay, tmpIndex);
                tmpIndex++;

                result.push(start, end);
            }
        }

        return result.sort(function(a, b) { return this._sortCondition(a, b); }.bind(this));
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
        var isSomeEdge = this._isSomeEdge(a, b);

        var columnCondition = this._normalizeCondition(a.left, b.left, isSomeEdge),
            rowCondition = this._normalizeCondition(a.top, b.top, isSomeEdge);
        return columnCondition ? columnCondition : rowCondition ? rowCondition : a.isStart - b.isStart;
    },

    _columnCondition: function(a, b) {
        var isSomeEdge = this._isSomeEdge(a, b);

        var columnCondition = this._normalizeCondition(a.left, b.left, isSomeEdge),
            rowCondition = this._normalizeCondition(a.top, b.top, isSomeEdge);
        return rowCondition ? rowCondition : columnCondition ? columnCondition : a.isStart - b.isStart;
    },

    _isSomeEdge: function(a, b) {
        return a.i === b.i && a.j === b.j;
    },

    _normalizeCondition: function(first, second, isSomeEdge) {
        // NOTE: ie & ff pixels
        var result = first - second;

        return isSomeEdge || Math.abs(result) > 1 ? result : 0;
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
                    sortedIndex: this._skipSortedIndex(position) ? null : sortedIndex++
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

    _skipSortedIndex: function(index) {
        return this.instance.fire("getMaxAppointmentsPerCell") && index > this._getMaxAppointmentCountPerCell() - 1;
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
        var appointmentCountPerCell = this._getMaxAppointmentCountPerCellByType(item.allDay);
        var compactCount = 0;

        if(appointmentCountPerCell !== undefined && item.index > appointmentCountPerCell - 1) {
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

    startDate: function(appointment, skipNormalize, position) {
        var startDate = position && position.startDate,
            rangeStartDate = this.instance._getStartDate(appointment, skipNormalize),
            text = this.instance.fire("getField", "text", appointment);

        if((startDate && rangeStartDate > startDate) || !startDate) {
            startDate = rangeStartDate;
        }

        if(isNaN(startDate.getTime())) {
            throw errors.Error("E1032", text);
        }

        return startDate;
    },

    endDate: function(appointment, position, isRecurring) {
        var endDate = this.instance._getEndDate(appointment),
            realStartDate = this.startDate(appointment, true),
            viewStartDate = this.startDate(appointment, false, position);

        if(viewStartDate.getTime() > endDate.getTime() || isRecurring) {
            var recurrencePartStartDate = position ? position.initialStartDate || position.startDate : realStartDate,
                recurrencePartCroppedByViewStartDate = position ? position.startDate : realStartDate,
                fullDuration = endDate.getTime() - realStartDate.getTime();

            fullDuration = this._adjustDurationByDaylightDiff(fullDuration, realStartDate, endDate);

            endDate = new Date((viewStartDate.getTime() >= recurrencePartStartDate.getTime() ? recurrencePartStartDate.getTime() : viewStartDate.getTime()));

            if(isRecurring) {
                endDate = new Date(endDate.getTime() + fullDuration);
            }

            if(!dateUtils.sameDate(realStartDate, endDate) && recurrencePartCroppedByViewStartDate.getTime() < viewStartDate.getTime()) {
                var headDuration = dateUtils.trimTime(endDate).getTime() - recurrencePartCroppedByViewStartDate.getTime(),
                    tailDuration = fullDuration - headDuration || fullDuration;

                endDate = new Date(dateUtils.trimTime(viewStartDate).getTime() + tailDuration);
            }

        }

        if(!this.isAllDay(appointment)) {
            var viewEndDate = dateUtils.roundToHour(this.instance.fire("getEndViewDate"));

            if(endDate > viewEndDate) {
                endDate = viewEndDate;
            }
        }

        return endDate;
    },

    _adjustDurationByDaylightDiff: function(duration, startDate, endDate) {
        var daylightDiff = this.instance.fire("getDaylightOffset", startDate, endDate);
        return this._needAdjustDuration(daylightDiff) ? this._calculateDurationByDaylightDiff(duration, daylightDiff) : duration;
    },

    _needAdjustDuration: function(diff) {
        return diff !== 0;
    },

    _calculateDurationByDaylightDiff: function(duration, diff) {
        return duration + diff * toMs("minute");
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
        var countFullWidthAppointmentInCell = this._getMaxAppointmentCountPerCellByType(isAllDay);
        if((coordinates.count - countFullWidthAppointmentInCell) > this._getMaxNeighborAppointmentCount()) {
            coordinates.virtual = {
                top: coordinates.top,
                left: coordinates.left,
                index: coordinates.groupIndex + "-" + coordinates.rowIndex + "-" + coordinates.cellIndex,
                isAllDay: isAllDay
            };
        }
    },

    _getMaxAppointmentCountPerCellByType: function(isAllDay) {
        var appointmentCountPerCell = this._getMaxAppointmentCountPerCell();

        if(typeUtils.isObject(appointmentCountPerCell)) {
            return isAllDay ? this._getMaxAppointmentCountPerCell().allDay : this._getMaxAppointmentCountPerCell().simple;
        } else {
            return appointmentCountPerCell;
        }
    },

    getCompactAppointmentGroupMaxWidth: function(intervalCount, isAllDay) {
        if(isAllDay || !typeUtils.isDefined(isAllDay)) {
            var widthInPercents = 75;
            return widthInPercents * this.getDefaultCellWidth() / 100;
        } else {
            return DROP_DOWN_BUTTON_DEFAULT_WIDTH;
        }
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

    _customizeCoordinates: function(coordinates, height, appointmentCountPerCell, topOffset, isAllDay) {
        var index = coordinates.index,
            appointmentHeight = height / appointmentCountPerCell,
            appointmentTop = coordinates.top + (index * appointmentHeight),
            top = appointmentTop + topOffset,
            width = coordinates.width,
            left = coordinates.left,
            compactAppointmentDefaultSize,
            compactAppointmentDefaultOffset;

        if(coordinates.isCompact) {
            compactAppointmentDefaultSize = this.getCompactAppointmentDefaultSize();
            compactAppointmentDefaultOffset = this.getCompactAppointmentDefaultOffset();
            top = coordinates.top + compactAppointmentDefaultOffset;
            left = coordinates.left + (index - appointmentCountPerCell) * (compactAppointmentDefaultSize + compactAppointmentDefaultOffset) + compactAppointmentDefaultOffset;
            appointmentHeight = compactAppointmentDefaultSize;
            width = compactAppointmentDefaultSize;

            this._markAppointmentAsVirtual(coordinates, isAllDay);
        }
        return {
            height: appointmentHeight,
            width: width,
            top: top,
            left: left,
            empty: this._isAppointmentEmpty(height, width)
        };
    },

    convertToPercents: function(x, offset) {
        return {
            x: x * 100 / (this.instance.fire("getDateTableWidth") - offset)
        };
    },

    _isAppointmentEmpty: function(height, width) {
        return height < this._getAppointmentMinHeight() || width < this._getAppointmentMinWidth();
    },

    _calculateGeometryConfig: function(coordinates) {
        var overlappingMode = this.instance.fire("getMaxAppointmentsPerCell"),
            offsets = this._getOffsets(),
            appointmentDefaultOffset = this._getAppointmentDefaultOffset();

        var appointmentCountPerCell = this._getAppointmentCount(overlappingMode, coordinates);
        var ratio = this._getDefaultRatio(coordinates, appointmentCountPerCell);
        var maxHeight = this._getMaxHeight();

        if(!isNumeric(appointmentCountPerCell)) {
            appointmentCountPerCell = coordinates.count;
            ratio = (maxHeight - offsets.unlimited) / maxHeight;
        }

        var topOffset = (1 - ratio) * maxHeight;
        if(overlappingMode === "auto" || isNumeric(overlappingMode)) {
            ratio = 1;
            maxHeight = maxHeight - appointmentDefaultOffset;
            topOffset = appointmentDefaultOffset;
        }

        return {
            height: ratio * maxHeight,
            appointmentCountPerCell: appointmentCountPerCell,
            offset: topOffset
        };
    },

    _getAppointmentCount: noop,

    _getDefaultRatio: noop,

    _getOffsets: noop,

    _getMaxHeight: noop,

    _needVerifyItemSize: function() {
        return false;
    },

    needSeparateAppointment: function(allDay) {
        return this.instance.fire("isGroupedByDate") && allDay;
    },

    _getMaxAppointmentCountPerCell: function() {
        if(!this._maxAppointmentCountPerCell) {
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

            this._maxAppointmentCountPerCell = appointmentCountPerCell;
        }

        return this._maxAppointmentCountPerCell;
    },

    _getDynamicAppointmentCountPerCell: function() {
        var cellHeight = this.instance.fire("getCellHeight");

        return Math.floor((cellHeight - this._getAppointmentDefaultOffset()) / this._getAppointmentDefaultHeight()) || this._getAppointmentMinCount();
    },

    _getAppointmentMinCount: function() {
        return APPOINTMENT_MIN_COUNT;
    },

    _isCompactTheme: function() {
        return (themes.current() || "").split(".")[2] === "compact";
    },

    _getAppointmentDefaultOffset: function() {
        return this._isCompactTheme()
            ? COMPACT_THEME_APPOINTMENT_DEFAULT_OFFSET
            : this.instance.option("_appointmentOffset");
    },

    _getAppointmentDefaultHeight: function() {
        return this._getAppointmentHeightByTheme();
    },

    _getAppointmentMinHeight: function() {
        return this._getAppointmentDefaultHeight();
    },

    _getAppointmentHeightByTheme: function() {
        return this._isCompactTheme() ? COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT : APPOINTMENT_DEFAULT_HEIGHT;
    },

    _getAppointmentDefaultWidth: function() {
        return APPOINTMENT_DEFAULT_WIDTH;
    },

    _getAppointmentMinWidth: function() {
        return this._getAppointmentDefaultWidth();
    },

    _needVerticalGroupBounds: function() {
        return false;
    },

    _needHorizontalGroupBounds: function() {
        return false;
    }
});

module.exports = BaseRenderingStrategy;
