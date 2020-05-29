import BasePositioningStrategy from './ui.scheduler.appointmentsPositioning.strategy.base';
import AdaptivePositioningStrategy from './ui.scheduler.appointmentsPositioning.strategy.adaptive';
import { extend } from '../../../core/utils/extend';
import errors from '../../widget/ui.errors';
import dateUtils from '../../../core/utils/date';
import { isNumeric } from '../../../core/utils/type';
import typeUtils from '../../../core/utils/type';
import themes from '../../themes';

import timeZoneUtils from '../utils.timeZone';

const toMs = dateUtils.dateToMilliseconds;

const APPOINTMENT_MIN_SIZE = 2;
const APPOINTMENT_DEFAULT_HEIGHT = 20;

const COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT = 18;

const DROP_DOWN_BUTTON_ADAPTIVE_SIZE = 28;

class BaseRenderingStrategy {
    constructor(instance) {
        this.instance = instance;
        this._initPositioningStrategy();
    }

    _isAdaptive() {
        return this.instance.fire('isAdaptive');
    }

    _correctCollectorCoordinatesInAdaptive(coordinates, isAllDay) {
        coordinates.top = coordinates.top + this.getCollectorTopOffset(isAllDay);
        coordinates.left = coordinates.left + this.getCollectorLeftOffset();
    }

    _initPositioningStrategy() {
        this._positioningStrategy = this._isAdaptive() ? new AdaptivePositioningStrategy(this) : new BasePositioningStrategy(this);
    }

    getPositioningStrategy() {
        return this._positioningStrategy;
    }

    getAppointmentMinSize() {
        return APPOINTMENT_MIN_SIZE;
    }

    keepAppointmentSettings() {
        return false;
    }

    getDeltaTime() {
    }

    getAppointmentGeometry(coordinates) {
        return coordinates;
    }

    needCorrectAppointmentDates() {
        return true;
    }

    getDirection() {
        return 'horizontal';
    }

    createTaskPositionMap(items) {
        delete this._maxAppointmentCountPerCell;

        const length = items && items.length;
        if(!length) return;

        this._defaultWidth = this.instance._cellWidth;
        this._defaultHeight = this.instance._cellHeight;
        this._allDayHeight = this.instance._allDayCellHeight;

        const map = [];
        for(let i = 0; i < length; i++) {
            let coordinates = this._getItemPosition(items[i]);

            if(this._isRtl()) {
                coordinates = this._correctRtlCoordinates(coordinates);
            }

            map.push(coordinates);
        }

        const positionArray = this._getSortedPositions(map);
        const resultPositions = this._getResultPositions(positionArray);
        return this._getExtendedPositionMap(map, resultPositions);
    }

    _getDeltaWidth(args, initialSize) {
        const intervalWidth = this.instance.fire('getResizableStep') || this.getAppointmentMinSize();
        const initialWidth = initialSize.width;

        return Math.round((args.width - initialWidth) / intervalWidth);
    }

    _correctRtlCoordinates(coordinates) {
        const width = coordinates[0].width || this._getAppointmentMaxWidth();

        coordinates.forEach(coordinate => {
            if(!coordinate.appointmentReduced) {
                coordinate.left -= width;
            }
        });

        return coordinates;
    }

    _getAppointmentMaxWidth() {
        return this.getDefaultCellWidth();
    }

    _getItemPosition(item) {
        const position = this._getAppointmentCoordinates(item);
        const allDay = this.isAllDay(item);
        let result = [];
        const startDate = new Date(this.instance.fire('getField', 'startDate', item));
        const isRecurring = !!this.instance.fire('getField', 'recurrenceRule', item);

        for(let j = 0; j < position.length; j++) {
            const height = this.calculateAppointmentHeight(item, position[j], isRecurring);
            const width = this.calculateAppointmentWidth(item, position[j], isRecurring);
            let resultWidth = width;
            let appointmentReduced = null;
            let multiWeekAppointmentParts = [];
            let initialRowIndex = position[j].rowIndex;
            let initialCellIndex = position[j].cellIndex;

            if((this._needVerifyItemSize() || allDay)) {
                const currentMaxAllowedPosition = position[j].hMax;

                if(this.isAppointmentGreaterThan(currentMaxAllowedPosition, {
                    left: position[j].left,
                    width: width
                })) {

                    appointmentReduced = 'head';

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
                appointmentReduced: appointmentReduced,
                originalAppointmentStartDate: this.startDate(item, true),
                originalAppointmentEndDate: this.endDate(item),
                endDate: this.endDate(item, position[j], isRecurring)
            });
            result = this._getAppointmentPartsPosition(multiWeekAppointmentParts, position[j], result);
        }

        return result;
    }

    _getAppointmentPartsPosition(appointmentParts, position, result) {
        if(appointmentParts.length) {
            appointmentParts.unshift(position);
            result = result.concat(appointmentParts);
        } else {
            result.push(position);
        }

        return result;
    }

    _getAppointmentCoordinates(itemData) {
        return this.instance.fire('needCoordinates', {
            startDate: this.startDate(itemData),
            originalStartDate: this.startDate(itemData, true),
            appointmentData: itemData,
        });
    }

    _isRtl() {
        return this.instance.option('rtlEnabled');
    }

    _getAppointmentParts() {
        return [];
    }

    _getCompactAppointmentParts(appointmentWidth) {
        const cellWidth = this.getDefaultCellWidth() || this.getAppointmentMinSize();

        return Math.round(appointmentWidth / cellWidth);
    }

    _reduceMultiWeekAppointment(sourceAppointmentWidth, bound) {
        if(this._isRtl()) {
            sourceAppointmentWidth = Math.floor(bound.left - bound.right);
        } else {
            sourceAppointmentWidth = bound.right - Math.floor(bound.left);
        }
        return sourceAppointmentWidth;
    }

    calculateAppointmentHeight() {
        return 0;
    }

    calculateAppointmentWidth() {
        return 0;
    }

    isAppointmentGreaterThan(etalon, comparisonParameters) {
        let result = comparisonParameters.left + comparisonParameters.width - etalon;

        if(this._isRtl()) {
            result = etalon + comparisonParameters.width - comparisonParameters.left;
        }

        return result > this.getDefaultCellWidth() / 2;
    }

    isAllDay() {
        return false;
    }

    cropAppointmentWidth(width, cellWidth) {
        if(this.instance.fire('isGroupedByDate')) {
            width = cellWidth;
        }

        return width;
    }

    _getSortedPositions(positionList) {
        const result = [];

        const round = value => Math.round(value * 100) / 100;
        const createItem = (rowIndex, cellIndex, top, left, bottom, right, position, allDay) => {
            return {
                i: rowIndex,
                j: cellIndex,
                top: round(top),
                left: round(left),
                bottom: round(bottom),
                right: round(right),
                cellPosition: position,
                allDay: allDay,
            };
        };

        for(let rowIndex = 0, rowCount = positionList.length; rowIndex < rowCount; rowIndex++) {
            for(let cellIndex = 0, cellCount = positionList[rowIndex].length; cellIndex < cellCount; cellIndex++) {
                const { top, left, height, width, cellPosition, allDay } = positionList[rowIndex][cellIndex];

                result.push(createItem(rowIndex, cellIndex, top, left, top + height, left + width, cellPosition, allDay));
            }
        }

        return result.sort((a, b) => this._sortCondition(a, b));
    }

    _sortCondition() {
    }

    _getConditions(a, b) {
        const isSomeEdge = this._isSomeEdge(a, b);

        return {
            columnCondition: isSomeEdge || this._normalizeCondition(a.left, b.left),
            rowCondition: isSomeEdge || this._normalizeCondition(a.top, b.top),
            cellPositionCondition: isSomeEdge || this._normalizeCondition(a.cellPosition, b.cellPosition)
        };
    }

    _rowCondition(a, b) {
        const conditions = this._getConditions(a, b);
        return conditions.columnCondition || conditions.rowCondition;
    }

    _columnCondition(a, b) {
        const conditions = this._getConditions(a, b);
        return conditions.rowCondition || conditions.columnCondition;
    }

    _isSomeEdge(a, b) {
        return a.i === b.i && a.j === b.j;
    }

    _normalizeCondition(first, second) {
        // NOTE: ie & ff pixels
        const result = first - second;
        return Math.abs(result) > 1 ? result : 0;
    }

    _isItemsCross(firstItem, secondItem, orientation) {
        const firstItemSide_1 = Math.floor(firstItem[orientation[0]]);
        const firstItemSide_2 = Math.floor(firstItem[orientation[1]]);

        const secondItemSide_1 = Math.ceil(secondItem[orientation[0]]);
        const secondItemSide_2 = Math.ceil(secondItem[orientation[1]]);

        const isItemCross = Math.abs(firstItem[orientation[2]] - secondItem[orientation[2]]) <= 1;
        return isItemCross && (
            (firstItemSide_1 <= secondItemSide_1 && firstItemSide_2 > secondItemSide_1) ||
                (firstItemSide_1 < secondItemSide_2 && firstItemSide_2 >= secondItemSide_2 || (
                    firstItemSide_1 === secondItemSide_1 && firstItemSide_2 === secondItemSide_2
                ))
        );
    }

    _getOrientation() {
        return ['top', 'bottom', 'left'];
    }

    _getResultPositions(sortedArray) {
        const result = [];
        let i;
        let sortedIndex = 0;
        let currentItem;
        let indexes;
        let itemIndex;
        let maxIndexInStack = 0;
        let stack = {};
        const orientation = this._getOrientation();

        const findFreeIndex = (indexes, index) => {
            const isFind = indexes.some((item) => {
                return item === index;
            });
            if(isFind) {
                return findFreeIndex(indexes, ++index);
            } else {
                return index;
            }
        };

        const createItem = (currentItem, index) => {
            const currentIndex = index || 0;
            return {
                index: currentIndex,
                i: currentItem.i,
                j: currentItem.j,
                left: currentItem.left,
                right: currentItem.right,
                top: currentItem.top,
                bottom: currentItem.bottom,
                allDay: currentItem.allDay,
                sortedIndex: this._skipSortedIndex(currentIndex) ? null : sortedIndex++,
            };
        };


        const startNewStack = (currentItem) => {
            stack.items = [createItem(currentItem)];
            stack.left = currentItem.left;
            stack.right = currentItem.right;
            stack.top = currentItem.top;
            stack.bottom = currentItem.bottom;
            stack.allDay = currentItem.allDay;
        };
        const pushItemsInResult = (items) => {
            items.forEach((item) => {
                result.push({
                    index: item.index,
                    count: maxIndexInStack + 1,
                    i: item.i,
                    j: item.j,
                    sortedIndex: item.sortedIndex
                });
            });
        };

        for(i = 0; i < sortedArray.length; i++) {
            currentItem = sortedArray[i];
            indexes = [];

            if(!stack.items) {
                startNewStack(currentItem);
            } else {
                if(this._isItemsCross(stack, currentItem, orientation)) {
                    stack.items.forEach((item, index) => {
                        if(this._isItemsCross(item, currentItem, orientation)) {
                            indexes.push(item.index);
                        }
                    });
                    itemIndex = indexes.length ? findFreeIndex(indexes, 0) : 0;
                    stack.items.push(createItem(currentItem, itemIndex));
                    maxIndexInStack = Math.max(itemIndex, maxIndexInStack);
                    stack.left = Math.min(stack.left, currentItem.left);
                    stack.right = Math.max(stack.right, currentItem.right);
                    stack.top = Math.min(stack.top, currentItem.top);
                    stack.bottom = Math.max(stack.bottom, currentItem.bottom);
                    stack.allDay = currentItem.allDay;
                } else {
                    pushItemsInResult(stack.items);
                    stack = {};
                    startNewStack(currentItem);
                    maxIndexInStack = 0;
                }
            }
        }
        if(stack.items) {
            pushItemsInResult(stack.items);
        }

        return result.sort(function(a, b) {
            const columnCondition = a.j - b.j;
            const rowCondition = a.i - b.i;
            return rowCondition ? rowCondition : columnCondition;
        });
    }

    _skipSortedIndex(index) {
        return index > this._getMaxAppointmentCountPerCell() - 1;
    }

    _findIndexByKey(arr, iKey, jKey, iValue, jValue) {
        let result = 0;
        for(let i = 0, len = arr.length; i < len; i++) {
            if(arr[i][iKey] === iValue && arr[i][jKey] === jValue) {
                result = i;
                break;
            }
        }
        return result;
    }

    _getExtendedPositionMap(map, positions) {
        let positionCounter = 0;
        const result = [];
        for(let i = 0, mapLength = map.length; i < mapLength; i++) {
            const resultString = [];
            for(let j = 0, itemLength = map[i].length; j < itemLength; j++) {
                map[i][j].index = positions[positionCounter].index;
                map[i][j].sortedIndex = positions[positionCounter].sortedIndex;
                map[i][j].count = positions[positionCounter++].count;
                resultString.push(map[i][j]);
                this._checkLongCompactAppointment(map[i][j], resultString);
            }
            result.push(resultString);
        }
        return result;
    }

    _checkLongCompactAppointment(item, result) {
        this._splitLongCompactAppointment(item, result);

        return result;
    }

    _splitLongCompactAppointment(item, result) {
        const appointmentCountPerCell = this._getMaxAppointmentCountPerCellByType(item.allDay);
        let compactCount = 0;

        if(appointmentCountPerCell !== undefined && item.index > appointmentCountPerCell - 1) {
            item.isCompact = true;
            compactCount = this._getCompactAppointmentParts(item.width);
            for(let k = 1; k < compactCount; k++) {
                const compactPart = extend(true, {}, item);
                compactPart.left = this._getCompactLeftCoordinate(item.left, k);
                compactPart.cellIndex = compactPart.cellIndex + k;
                compactPart.sortedIndex = null;
                result.push(compactPart);
            }
        }
        return result;
    }

    startDate(appointment, skipNormalize, position) {
        let startDate = position && position.startDate;
        const rangeStartDate = this.instance._getStartDate(appointment, skipNormalize);
        const text = this.instance.fire('getField', 'text', appointment);

        if((startDate && rangeStartDate > startDate) || !startDate) {
            startDate = rangeStartDate;
        }

        if(isNaN(startDate.getTime())) {
            throw errors.Error('E1032', text);
        }

        return startDate;
    }

    endDate(appointment, position, isRecurring, ignoreViewDates = false) {
        let endDate = this.instance._getEndDate(appointment, ignoreViewDates);
        const realStartDate = this.startDate(appointment, true);
        const viewStartDate = this.startDate(appointment, false, position);

        if(viewStartDate.getTime() > endDate.getTime() || isRecurring) {
            const recurrencePartStartDate = position ? position.initialStartDate || position.startDate : realStartDate;
            const recurrencePartCroppedByViewStartDate = position ? position.startDate : realStartDate;

            let fullDuration = viewStartDate.getTime() > endDate.getTime() ?
                this.instance.fire('getField', 'endDate', appointment).getTime() - this.instance.fire('getField', 'startDate', appointment).getTime() :
                endDate.getTime() - realStartDate.getTime();

            fullDuration = this._adjustDurationByDaylightDiff(fullDuration, realStartDate, endDate);

            endDate = new Date((viewStartDate.getTime() >= recurrencePartStartDate.getTime() ? recurrencePartStartDate.getTime() : viewStartDate.getTime()));

            if(isRecurring) {
                endDate = new Date(endDate.getTime() + fullDuration);
            }

            if(!dateUtils.sameDate(realStartDate, endDate) && recurrencePartCroppedByViewStartDate.getTime() < viewStartDate.getTime()) {
                const headDuration = dateUtils.trimTime(endDate).getTime() - recurrencePartCroppedByViewStartDate.getTime();
                const tailDuration = fullDuration - headDuration || fullDuration;

                endDate = new Date(dateUtils.trimTime(viewStartDate).getTime() + tailDuration);
            }

        }

        if(!this.isAllDay(appointment)) {
            const viewEndDate = dateUtils.roundToHour(this.instance.fire('getEndViewDate'));

            if(endDate > viewEndDate) {
                endDate = viewEndDate;
            }
        }

        const currentViewEndTime = new Date(new Date(endDate).setHours(this.instance.option('endDayHour'), 0, 0));

        if(endDate.getTime() > currentViewEndTime.getTime()) {
            endDate = currentViewEndTime;
        }

        return endDate;
    }

    _adjustDurationByDaylightDiff(duration, startDate, endDate) {
        const daylightDiff = timeZoneUtils.getDaylightOffset(startDate, endDate);
        return this._needAdjustDuration(daylightDiff) ? this._calculateDurationByDaylightDiff(duration, daylightDiff) : duration;
    }

    _needAdjustDuration(diff) {
        return diff !== 0;
    }

    _calculateDurationByDaylightDiff(duration, diff) {
        return duration + diff * toMs('minute');
    }

    _getAppointmentDurationInMs(startDate, endDate, allDay) {
        return this.instance.fire('getAppointmentDurationInMs', {
            startDate: startDate,
            endDate: endDate,
            allDay: allDay,
        });
    }

    _markAppointmentAsVirtual(coordinates, isAllDay) {
        const countFullWidthAppointmentInCell = this._getMaxAppointmentCountPerCellByType(isAllDay);
        if((coordinates.count - countFullWidthAppointmentInCell) > 0) {
            coordinates.virtual = {
                top: coordinates.top,
                left: coordinates.left,
                index: coordinates.appointmentReduced === 'tail' ?
                    coordinates.groupIndex + '-' + coordinates.rowIndex + '-' + coordinates.cellIndex :
                    coordinates.groupIndex + '-' + coordinates.rowIndex + '-' + coordinates.cellIndex + '-tail',
                isAllDay: isAllDay
            };
        }
    }

    _getMaxAppointmentCountPerCellByType(isAllDay) {
        const appointmentCountPerCell = this._getMaxAppointmentCountPerCell();

        if(typeUtils.isObject(appointmentCountPerCell)) {
            return isAllDay ? this._getMaxAppointmentCountPerCell().allDay : this._getMaxAppointmentCountPerCell().simple;
        } else {
            return appointmentCountPerCell;
        }
    }

    getDropDownAppointmentWidth(intervalCount, isAllDay) {
        return this.getPositioningStrategy().getDropDownAppointmentWidth(intervalCount, isAllDay);
    }

    getDropDownAppointmentHeight() {
        return this.getPositioningStrategy().getDropDownAppointmentHeight();
    }

    getDropDownButtonAdaptiveSize() {
        return DROP_DOWN_BUTTON_ADAPTIVE_SIZE;
    }

    getDefaultCellWidth() {
        return this._defaultWidth;
    }

    getDefaultCellHeight() {
        return this._defaultHeight;
    }

    getDefaultAllDayCellHeight() {
        return this._allDayHeight;
    }

    getCollectorTopOffset(allDay) {
        return this.getPositioningStrategy().getCollectorTopOffset(allDay);
    }

    getCollectorLeftOffset() {
        return this.getPositioningStrategy().getCollectorLeftOffset();
    }

    getAppointmentDataCalculator() {
    }

    _customizeCoordinates(coordinates, height, appointmentCountPerCell, topOffset, isAllDay) {
        const index = coordinates.index;
        const appointmentHeight = height / appointmentCountPerCell;
        const appointmentTop = coordinates.top + (index * appointmentHeight);
        const top = appointmentTop + topOffset;
        const width = coordinates.width;
        const left = coordinates.left;

        if(coordinates.isCompact) {
            this._isAdaptive() && this._correctCollectorCoordinatesInAdaptive(coordinates, isAllDay);

            this._markAppointmentAsVirtual(coordinates, isAllDay);
        }
        return {
            height: appointmentHeight,
            width: width,
            top: top,
            left: left,
            empty: this._isAppointmentEmpty(height, width)
        };
    }

    _isAppointmentEmpty(height, width) {
        return height < this._getAppointmentMinHeight() || width < this._getAppointmentMinWidth();
    }

    _calculateGeometryConfig(coordinates) {
        const overlappingMode = this.instance.fire('getMaxAppointmentsPerCell');
        const offsets = this._getOffsets();
        const appointmentDefaultOffset = this._getAppointmentDefaultOffset();

        let appointmentCountPerCell = this._getAppointmentCount(overlappingMode, coordinates);
        let ratio = this._getDefaultRatio(coordinates, appointmentCountPerCell);
        let maxHeight = this._getMaxHeight();

        if(!isNumeric(appointmentCountPerCell)) {
            appointmentCountPerCell = coordinates.count;
            ratio = (maxHeight - offsets.unlimited) / maxHeight;
        }

        let topOffset = (1 - ratio) * maxHeight;
        if(overlappingMode === 'auto' || isNumeric(overlappingMode)) {
            ratio = 1;
            maxHeight = maxHeight - appointmentDefaultOffset;
            topOffset = appointmentDefaultOffset;
        }

        return {
            height: ratio * maxHeight,
            appointmentCountPerCell: appointmentCountPerCell,
            offset: topOffset
        };
    }

    _getAppointmentCount() {
    }

    _getDefaultRatio() {
    }

    _getOffsets() {
    }

    _getMaxHeight() {
    }

    _needVerifyItemSize() {
        return false;
    }

    needSeparateAppointment(allDay) {
        return this.instance.fire('isGroupedByDate') && allDay;
    }

    _getMaxAppointmentCountPerCell() {
        if(!this._maxAppointmentCountPerCell) {
            const overlappingMode = this.instance.fire('getMaxAppointmentsPerCell');
            let appointmentCountPerCell;

            if(isNumeric(overlappingMode)) {
                appointmentCountPerCell = overlappingMode;
            }
            if(overlappingMode === 'auto') {
                appointmentCountPerCell = this._getDynamicAppointmentCountPerCell();
            }
            if(overlappingMode === 'unlimited') {
                appointmentCountPerCell = undefined;
            }

            this._maxAppointmentCountPerCell = appointmentCountPerCell;
        }

        return this._maxAppointmentCountPerCell;
    }

    _getDynamicAppointmentCountPerCell() {
        return this.getPositioningStrategy().getDynamicAppointmentCountPerCell();
    }

    hasAllDayAppointments() {
        return false;
    }

    _isCompactTheme() {
        return (themes.current() || '').split('.').pop() === 'compact';
    }

    _getAppointmentDefaultOffset() {
        return this.getPositioningStrategy().getAppointmentDefaultOffset();
    }

    _getAppointmentDefaultHeight() {
        return this._getAppointmentHeightByTheme();
    }

    _getAppointmentMinHeight() {
        return this._getAppointmentDefaultHeight();
    }

    _getAppointmentHeightByTheme() {
        return this._isCompactTheme() ? COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT : APPOINTMENT_DEFAULT_HEIGHT;
    }

    _getAppointmentDefaultWidth() {
        return this.getPositioningStrategy()._getAppointmentDefaultWidth();
    }

    _getAppointmentMinWidth() {
        return this._getAppointmentDefaultWidth();
    }

    _needVerticalGroupBounds() {
        return false;
    }

    _needHorizontalGroupBounds() {
        return false;
    }
}

module.exports = BaseRenderingStrategy;
