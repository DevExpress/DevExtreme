import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { isNumeric, isObject } from '@js/core/utils/type';
import { current as currentTheme } from '@js/ui/themes';
import { dateUtilsTs } from '@ts/core/utils/date';
import { isAppointmentTakesAllDay } from '@ts/scheduler/r1/utils/index';

import timeZoneUtils from '../../../m_utils_time_zone';
import type { SafeAppointment } from '../../../types';
import { AppointmentAdapter } from '../../../utils/appointment_adapter/appointment_adapter';
import type { AppointmentDataAccessor } from '../../../utils/data_accessor/appointment_data_accessor';
import { AppointmentSettingsGenerator } from '../m_settings_generator';
import AdaptivePositioningStrategy from './m_appointments_positioning_strategy_adaptive';
import AppointmentPositioningStrategy from './m_appointments_positioning_strategy_base';

const toMs = dateUtils.dateToMilliseconds;

const APPOINTMENT_MIN_SIZE = 2;
const APPOINTMENT_DEFAULT_HEIGHT = 20;

const COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT = 18;

const DROP_DOWN_BUTTON_ADAPTIVE_SIZE = 28;

const WEEK_VIEW_COLLECTOR_OFFSET = 5;
const COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET = 1;

class BaseRenderingStrategy {
  options: any;

  protected positioningStrategy: any;

  protected maxAppointmentCountPerCell: any;

  constructor(options) {
    this.options = options;
    this.initPositioningStrategy();
  }

  get isAdaptive() { return this.options.adaptivityEnabled; }

  get rtlEnabled() { return this.options.rtlEnabled; }

  get startDayHour() { return this.options.startDayHour; }

  get endDayHour() { return this.options.endDayHour; }

  get maxAppointmentsPerCell() { return this.options.maxAppointmentsPerCell; }

  get cellWidth() { return this.options.cellWidth; }

  get cellHeight() { return this.options.cellHeight; }

  get allDayHeight() { return this.options.allDayHeight; }

  get resizableStep() { return this.options.resizableStep; }

  get isGroupedByDate() { return this.options.isGroupedByDate; }

  get visibleDayDuration() { return this.options.visibleDayDuration; }

  get viewStartDayHour() { return this.options.viewStartDayHour; }

  get viewEndDayHour() { return this.options.viewEndDayHour; }

  get cellDuration() { return this.options.cellDuration; }

  get cellDurationInMinutes() { return this.options.cellDurationInMinutes; }

  get leftVirtualCellCount() { return this.options.leftVirtualCellCount; }

  get topVirtualCellCount() { return this.options.topVirtualCellCount; }

  get positionHelper() { return this.options.positionHelper; }

  get showAllDayPanel() { return this.options.showAllDayPanel; }

  get isGroupedAllDayPanel() { return this.options.isGroupedAllDayPanel; }

  get groupOrientation() { return this.options.groupOrientation; }

  get rowCount() { return this.options.rowCount; }

  get groupCount() { return this.options.groupCount; }

  get currentDate() { return this.options.currentDate; }

  get appointmentCountPerCell() { return this.options.appointmentCountPerCell; }

  get appointmentOffset() { return this.options.appointmentOffset; }

  get allowResizing() { return this.options.allowResizing; }

  get allowAllDayResizing() { return this.options.allowAllDayResizing; }

  get viewDataProvider() { return this.options.viewDataProvider; }

  get dataAccessors(): AppointmentDataAccessor { return this.options.dataAccessors; }

  get timeZoneCalculator() { return this.options.timeZoneCalculator; }

  get intervalCount() { return this.options.intervalCount; }

  get allDayPanelMode() { return this.options.allDayPanelMode; }

  get isVirtualScrolling() { return this.options.isVirtualScrolling; }

  protected correctCollectorCoordinatesInAdaptive(coordinates, isAllDay) {
    coordinates.top += this.getCollectorTopOffset(isAllDay);
    coordinates.left += this.getCollectorLeftOffset();
  }

  protected initPositioningStrategy() {
    this.positioningStrategy = this.isAdaptive
      ? new AdaptivePositioningStrategy(this)
      : new AppointmentPositioningStrategy(this);
  }

  getPositioningStrategy() {
    return this.positioningStrategy;
  }

  getAppointmentMinSize(): any {
    return APPOINTMENT_MIN_SIZE;
  }

  keepAppointmentSettings() {
    return false;
  }

  getAppointmentGeometry(coordinates) {
    return coordinates;
  }

  getDirection() {
    return 'horizontal';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createTaskPositionMap(items: SafeAppointment[], skipSorting?) {
    delete this.maxAppointmentCountPerCell;

    const length = items?.length;
    if (!length) return;

    const map: any = [];
    for (let i = 0; i < length; i++) {
      let coordinates = this.getItemPosition(items[i]);

      if (coordinates.length && this.rtlEnabled) {
        coordinates = this.correctRtlCoordinates(coordinates);
      }

      coordinates.forEach((item: any) => {
        item.leftVirtualCellCount = this.leftVirtualCellCount;
        item.topVirtualCellCount = this.topVirtualCellCount;
        item.leftVirtualWidth = this.leftVirtualCellCount * this.cellWidth;
        item.topVirtualHeight = this.topVirtualCellCount * this.cellHeight;
      });

      map.push(coordinates);
    }

    const positionArray = this.getSortedPositions(map);
    const resultPositions = this.getResultPositions(positionArray);

    return this.getExtendedPositionMap(map, resultPositions);
  }

  protected correctRtlCoordinates(coordinates) {
    const width = coordinates[0].width || this.getAppointmentMaxWidth();

    coordinates.forEach((coordinate) => {
      if (!coordinate.appointmentReduced) {
        coordinate.left -= width;
      }
    });

    return coordinates;
  }

  protected getAppointmentMaxWidth() {
    return this.cellWidth;
  }

  protected getItemPosition(initialAppointment) {
    const appointment = this.shiftAppointmentByViewOffset(initialAppointment);
    const position = this.generateAppointmentSettings(appointment);
    const allDay = this.isAllDay(appointment);

    let result = [];

    for (let j = 0; j < position.length; j++) {
      const height = this.calculateAppointmentHeight(appointment, position[j]);
      const width = this.calculateAppointmentWidth(appointment, position[j]);

      let resultWidth = width;
      let appointmentReduced: any = null;
      let multiWeekAppointmentParts = [];
      let initialRowIndex = position[j].rowIndex;
      let initialColumnIndex = position[j].columnIndex;

      if (this.needVerifyItemSize() || allDay) {
        const currentMaxAllowedPosition = position[j].hMax;

        if (this.isAppointmentGreaterThan(currentMaxAllowedPosition, {
          left: position[j].left,
          width,
        })) {
          appointmentReduced = 'head';

          initialRowIndex = position[j].rowIndex;
          initialColumnIndex = position[j].columnIndex;

          resultWidth = this.reduceMultiWeekAppointment(
            width,
            {
              left: position[j].left,
              right: currentMaxAllowedPosition,
            },
          );

          multiWeekAppointmentParts = this.getAppointmentParts({
            sourceAppointmentWidth: width,
            reducedWidth: resultWidth,
            height,
          }, position[j]);

          if (this.rtlEnabled) {
            position[j].left = currentMaxAllowedPosition;
          }
        }
      }

      extend(position[j], {
        height,
        width: resultWidth,
        allDay,
        rowIndex: initialRowIndex,
        columnIndex: initialColumnIndex,
        appointmentReduced,
      });
      result = this.getAppointmentPartsPosition(multiWeekAppointmentParts, position[j], result);
    }

    return result;
  }

  protected getAppointmentPartsPosition(appointmentParts, position, result) {
    if (appointmentParts.length) {
      appointmentParts.unshift(position);
      appointmentParts.forEach((part, index) => {
        part.partIndex = index;
        part.partTotalCount = appointmentParts.length;
      });
      result = result.concat(appointmentParts);
    } else {
      result.push(position);
    }

    return result;
  }

  getAppointmentSettingsGenerator(rawAppointment) {
    return new AppointmentSettingsGenerator({
      rawAppointment,
      appointmentTakesAllDay: this.isAppointmentTakesAllDay(rawAppointment), // TODO move to the settings
      getPositionShiftCallback: this.getPositionShift.bind(this),
      ...this.options,
    });
  }

  generateAppointmentSettings(rawAppointment) {
    return this.getAppointmentSettingsGenerator(rawAppointment).create();
  }

  isAppointmentTakesAllDay(rawAppointment) {
    return isAppointmentTakesAllDay(
      new AppointmentAdapter(rawAppointment, this.dataAccessors),
      this.allDayPanelMode,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getAppointmentParts(geometry, settings): any {
    return [];
  }

  protected getCompactAppointmentParts(appointmentWidth) {
    const cellWidth = this.cellWidth || this.getAppointmentMinSize();

    return Math.round(appointmentWidth / cellWidth);
  }

  protected reduceMultiWeekAppointment(sourceAppointmentWidth, bound) {
    if (this.rtlEnabled) {
      sourceAppointmentWidth = Math.floor(bound.left - bound.right);
    } else {
      sourceAppointmentWidth = bound.right - Math.floor(bound.left);
    }
    return sourceAppointmentWidth;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculateAppointmentHeight(appointment, position) {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculateAppointmentWidth(appointment, position) {
    return 0;
  }

  isAppointmentGreaterThan(etalon, comparisonParameters): any {
    let result = comparisonParameters.left + comparisonParameters.width - etalon;

    if (this.rtlEnabled) {
      result = etalon + comparisonParameters.width - comparisonParameters.left;
    }

    return result > this.cellWidth / 2;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isAllDay(appointment) {
    return false;
  }

  cropAppointmentWidth(width, cellWidth) { // TODO get rid of this
    return this.isGroupedByDate
      ? cellWidth
      : width;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getSortedPositions(positionList, skipSorting?) {
    const result: any = [];

    const round = (value) => Math.round(value * 100) / 100;
    const createItem = (rowIndex, columnIndex, top, left, bottom, right, position, allDay) => ({
      i: rowIndex,
      j: columnIndex,
      top: round(top),
      left: round(left),
      bottom: round(bottom),
      right: round(right),
      cellPosition: position,
      allDay,
    });

    for (let rowIndex = 0, rowCount = positionList.length; rowIndex < rowCount; rowIndex++) {
      for (let columnIndex = 0, cellCount = positionList[rowIndex].length; columnIndex < cellCount; columnIndex++) {
        const {
          top, left, height, width, cellPosition, allDay,
        } = positionList[rowIndex][columnIndex];

        result.push(createItem(rowIndex, columnIndex, top, left, top + height, left + width, cellPosition, allDay));
      }
    }

    return result.sort((a, b) => this.sortCondition(a, b));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected sortCondition(a, b) {
  }

  protected getConditions(a, b) {
    const isSomeEdge = this.isSomeEdge(a, b);

    return {
      columnCondition: isSomeEdge || this.normalizeCondition(a.left, b.left),
      rowCondition: isSomeEdge || this.normalizeCondition(a.top, b.top),
      cellPositionCondition: isSomeEdge || this.normalizeCondition(a.cellPosition, b.cellPosition),
    };
  }

  protected rowCondition(a, b): any {
    const conditions = this.getConditions(a, b);
    return conditions.columnCondition || conditions.rowCondition;
  }

  protected columnCondition(a, b): any {
    const conditions = this.getConditions(a, b);
    return conditions.rowCondition || conditions.columnCondition;
  }

  protected isSomeEdge(a, b) {
    return a.i === b.i && a.j === b.j;
  }

  protected normalizeCondition(first, second) {
    // NOTE: ie & ff pixels
    const result = first - second;
    return Math.abs(result) > 1 ? result : 0;
  }

  protected isItemsCross(firstItem, secondItem) {
    const areItemsInTheSameTable = Boolean(firstItem.allDay) === Boolean(secondItem.allDay);
    const areItemsAllDay = firstItem.allDay && secondItem.allDay;

    if (areItemsInTheSameTable) {
      const orientation = this.getOrientation(areItemsAllDay);

      return this.checkItemsCrossing(firstItem, secondItem, orientation);
    }
    return false;
  }

  protected checkItemsCrossing(firstItem, secondItem, orientation) {
    const firstItemSide1 = Math.floor(firstItem[orientation[0]]);
    const firstItemSide2 = Math.floor(firstItem[orientation[1]]);

    const secondItemSide1 = Math.ceil(secondItem[orientation[0]]);
    const secondItemSide2 = Math.ceil(secondItem[orientation[1]]);

    const isItemCross = Math.abs(firstItem[orientation[2]] - secondItem[orientation[2]]) <= 1;
    return isItemCross && (
      (firstItemSide1 <= secondItemSide1 && firstItemSide2 > secondItemSide1)
                || (firstItemSide1 < secondItemSide2 && firstItemSide2 >= secondItemSide2 || (
                  firstItemSide1 === secondItemSide1 && firstItemSide2 === secondItemSide2
                ))
    );
  }

  protected getOrientation(isAllDay) {
    return isAllDay ? ['left', 'right', 'top'] : ['top', 'bottom', 'left'];
  }

  protected getResultPositions(sortedArray) {
    const result: any = [];
    let i;
    let sortedIndex = 0;
    let currentItem;
    let indexes;
    let itemIndex;
    let maxIndexInStack = 0;
    let stack: any = {};

    const findFreeIndex = (indexes, index) => {
      const isFind = indexes.some((item) => item === index);
      if (isFind) {
        return findFreeIndex(indexes, ++index);
      }
      return index;
    };

    const createItem = (currentItem, index?) => {
      const currentIndex = index || 0;
      const skipSortIndex = this.skipSortedIndex(currentIndex);

      if (skipSortIndex) {
        stack.shouldShiftAfterSkip = true;
      }

      return {
        index: currentIndex,
        i: currentItem.i,
        j: currentItem.j,
        left: currentItem.left,
        right: currentItem.right,
        top: currentItem.top,
        bottom: currentItem.bottom,
        allDay: currentItem.allDay,
        sortedIndex: skipSortIndex ? stack.startSortedIndex : sortedIndex++,
      };
    };

    const startNewStack = (currentItem) => {
      stack.items = [createItem(currentItem)];
      stack.left = currentItem.left;
      stack.right = currentItem.right;
      stack.top = currentItem.top;
      stack.bottom = currentItem.bottom;
      stack.allDay = currentItem.allDay;
      stack.startSortedIndex = stack.items[0].sortedIndex;
    };
    const pushItemsInResult = (stack) => {
      stack.items.forEach((item) => {
        result.push({
          index: item.index,
          count: maxIndexInStack + 1,
          i: item.i,
          j: item.j,
          sortedIndex: stack.shouldShiftAfterSkip && !this.skipSortedIndex(item.index)
            ? item.sortedIndex + 1
            : item.sortedIndex,
        });
      });

      if (stack.shouldShiftAfterSkip) {
        sortedIndex += 1;
      }
    };

    for (i = 0; i < sortedArray.length; i++) {
      currentItem = sortedArray[i];
      indexes = [];

      if (!stack.items) {
        startNewStack(currentItem);
      } else if (this.isItemsCross(stack, currentItem)) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        stack.items.forEach((item) => {
          if (this.isItemsCross(item, currentItem)) {
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
        pushItemsInResult(stack);
        stack = {};
        startNewStack(currentItem);
        maxIndexInStack = 0;
      }
    }
    if (stack.items) {
      pushItemsInResult(stack);
    }

    return result.sort((a, b) => {
      const columnCondition = a.j - b.j;
      const rowCondition = a.i - b.i;
      return rowCondition || columnCondition;
    });
  }

  protected skipSortedIndex(index) {
    return index > this.getMaxAppointmentCountPerCell() - 1;
  }

  protected findIndexByKey(arr, iKey, jKey, iValue, jValue): any {
    let result = 0;
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i][iKey] === iValue && arr[i][jKey] === jValue) {
        result = i;
        break;
      }
    }
    return result;
  }

  protected getExtendedPositionMap(map, positions) {
    let positionCounter = 0;
    const result: any = [];

    for (let i = 0, mapLength = map.length; i < mapLength; i++) {
      const resultString: any = [];
      for (let j = 0, itemLength = map[i].length; j < itemLength; j++) {
        map[i][j].index = positions[positionCounter].index;
        map[i][j].sortedIndex = positions[positionCounter].sortedIndex;
        map[i][j].count = positions[positionCounter++].count;
        resultString.push(map[i][j]);
        this.checkLongCompactAppointment(map[i][j], resultString);
      }
      result.push(resultString);
    }

    return result;
  }

  protected checkLongCompactAppointment(item, result) {
    this.splitLongCompactAppointment(item, result);

    return result;
  }

  protected splitLongCompactAppointment(item, result) {
    const appointmentCountPerCell = this.getMaxAppointmentCountPerCellByType(item.allDay);
    let compactCount = 0;

    if (appointmentCountPerCell !== undefined && item.index > appointmentCountPerCell - 1) {
      item.isCompact = true;
      compactCount = this.getCompactAppointmentParts(item.width);
      for (let k = 1; k < compactCount; k++) {
        const compactPart = extend(true, {}, item);
        compactPart.left = (this as any)._getCompactLeftCoordinate(item.left, k);
        compactPart.columnIndex += k;
        compactPart.sortedIndex = null;
        result.push(compactPart);
      }
    }
    return result;
  }

  protected adjustDurationByDaylightDiff(
    duration: number,
    startDate: Date,
    endDate: Date,
  ): number {
    const { viewOffset } = this.options;
    const originalStartDate = dateUtilsTs.addOffsets(startDate, [viewOffset]);
    const originalEndDate = dateUtilsTs.addOffsets(endDate, [viewOffset]);
    const daylightDiff = timeZoneUtils.getDaylightOffset(originalStartDate, originalEndDate);
    const correctedDuration: number = this.needAdjustDuration(daylightDiff)
      ? this.calculateDurationByDaylightDiff(duration, daylightDiff)
      : duration;

    return correctedDuration <= Math.abs(daylightDiff) ? duration : correctedDuration;
  }

  protected needAdjustDuration(diff) {
    return diff !== 0;
  }

  protected calculateDurationByDaylightDiff(duration, diff) {
    return duration + diff * toMs('minute');
  }

  protected calculateCollectorLeftOffset(isAllDay) {
    if (isAllDay || !this.isApplyCompactAppointmentOffset()) {
      return 0;
    }

    const dropDownButtonWidth = this.getDropDownAppointmentWidth(this.intervalCount, isAllDay);
    const rightOffset = this.isCompactTheme()
      ? COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET
      : WEEK_VIEW_COLLECTOR_OFFSET;

    return this.cellWidth - dropDownButtonWidth - rightOffset;
  }

  protected markAppointmentAsVirtual(coordinates, isAllDay = false) {
    const countFullWidthAppointmentInCell = this.getMaxAppointmentCountPerCellByType(isAllDay);
    if ((coordinates.count - countFullWidthAppointmentInCell) > 0) {
      const { top, left } = coordinates;
      const compactRender = this.isAdaptive || !isAllDay && this.supportCompactDropDownAppointments();
      const width = this.getDropDownAppointmentWidth(this.intervalCount, isAllDay) - this.options._collectorOffset;
      const height = this.getDropDownAppointmentHeight();
      const rtlOffset = this.rtlEnabled ? width : 0;
      coordinates.virtual = {
        left: left + this.calculateCollectorLeftOffset(isAllDay) + rtlOffset,
        top,
        width,
        height,
        index: this.generateAppointmentCollectorIndex(coordinates, isAllDay),
        isAllDay,
        groupIndex: coordinates.groupIndex,
        isCompact: compactRender,
      };
    }
  }

  isApplyCompactAppointmentOffset() {
    return this.supportCompactDropDownAppointments();
  }

  supportCompactDropDownAppointments() {
    return true;
  }

  protected generateAppointmentCollectorIndex({
    groupIndex, rowIndex, columnIndex,
  }, isAllDay) {
    return `${groupIndex}-${rowIndex}-${columnIndex}-${isAllDay}`;
  }

  protected getMaxAppointmentCountPerCellByType(isAllDay?) {
    const appointmentCountPerCell = this.getMaxAppointmentCountPerCell();

    if (isObject(appointmentCountPerCell)) {
      return isAllDay
        ? (appointmentCountPerCell as any).allDay
        : (appointmentCountPerCell as any).simple;
    }
    return appointmentCountPerCell;
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

  getCollectorTopOffset(allDay) {
    return this.getPositioningStrategy().getCollectorTopOffset(allDay);
  }

  getCollectorLeftOffset() {
    return this.getPositioningStrategy().getCollectorLeftOffset();
  }

  getAppointmentDataCalculator() {
  }

  getVerticalAppointmentHeight(cellHeight, currentAppointmentCountInCell, maxAppointmentsPerCell) {
    let resultMaxAppointmentsPerCell = maxAppointmentsPerCell;

    if (isNumeric(this.maxAppointmentsPerCell)) {
      const dynamicAppointmentCountPerCell = this.getDynamicAppointmentCountPerCell();
      const maxAppointmentCountDisplayedInCell = dynamicAppointmentCountPerCell.allDay || dynamicAppointmentCountPerCell;

      const maxAppointmentsCount = Math.max(currentAppointmentCountInCell, maxAppointmentCountDisplayedInCell);
      resultMaxAppointmentsPerCell = Math.min(maxAppointmentsCount, maxAppointmentsPerCell);
    }
    return cellHeight / resultMaxAppointmentsPerCell;
  }

  protected customizeCoordinates(coordinates, cellHeight, appointmentCountPerCell, topOffset, isAllDay?) {
    const { index, count } = coordinates;

    const appointmentHeight = this.getVerticalAppointmentHeight(cellHeight, count, appointmentCountPerCell);

    const appointmentTop = coordinates.top + (index * appointmentHeight);
    const top = appointmentTop + topOffset;
    const { width } = coordinates;
    const { left } = coordinates;

    if (coordinates.isCompact) {
      this.isAdaptive && this.correctCollectorCoordinatesInAdaptive(coordinates, isAllDay);

      this.markAppointmentAsVirtual(coordinates, isAllDay);
    }
    return {
      height: appointmentHeight,
      width,
      top,
      left,
      empty: this.isAppointmentEmpty(cellHeight, width),
    };
  }

  protected isAppointmentEmpty(height, width) {
    return height < this.getAppointmentMinHeight() || width < this.getAppointmentMinWidth();
  }

  protected calculateGeometryConfig(coordinates) {
    const overlappingMode = this.maxAppointmentsPerCell;
    const offsets: any = this.getOffsets();
    const appointmentDefaultOffset = this.getAppointmentDefaultOffset();

    let appointmentCountPerCell = this.getAppointmentCount(overlappingMode, coordinates);
    let ratio: any = this.getDefaultRatio(coordinates, appointmentCountPerCell);
    let maxHeight: any = this.getMaxHeight();

    if (!isNumeric(appointmentCountPerCell)) {
      appointmentCountPerCell = coordinates.count;
      ratio = (maxHeight - offsets.unlimited) / maxHeight;
    }

    let topOffset = (1 - ratio) * maxHeight;
    if (overlappingMode === 'auto' || isNumeric(overlappingMode)) {
      ratio = 1;
      maxHeight -= appointmentDefaultOffset;
      topOffset = appointmentDefaultOffset;
    }

    return {
      height: ratio * maxHeight,
      appointmentCountPerCell,
      offset: topOffset,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getAppointmentCount(overlappingMode, coordinates) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getDefaultRatio(coordinates, appointmentCountPerCell) {
  }

  protected getOffsets() {
  }

  protected getMaxHeight() {
  }

  protected needVerifyItemSize() {
    return false;
  }

  protected getMaxAppointmentCountPerCell() {
    if (!this.maxAppointmentCountPerCell) {
      const overlappingMode = this.maxAppointmentsPerCell;
      let appointmentCountPerCell;

      if (isNumeric(overlappingMode)) {
        appointmentCountPerCell = overlappingMode;
      }
      if (overlappingMode === 'auto') {
        appointmentCountPerCell = this.getDynamicAppointmentCountPerCell();
      }
      if (overlappingMode === 'unlimited') {
        appointmentCountPerCell = undefined;
      }

      this.maxAppointmentCountPerCell = appointmentCountPerCell;
    }

    return this.maxAppointmentCountPerCell;
  }

  protected getDynamicAppointmentCountPerCell() {
    return this.getPositioningStrategy().getDynamicAppointmentCountPerCell();
  }

  allDaySupported() {
    return false;
  }

  protected isCompactTheme() {
    return (currentTheme() || '').split('.').pop() === 'compact';
  }

  protected getAppointmentDefaultOffset() {
    return this.getPositioningStrategy().getAppointmentDefaultOffset();
  }

  protected getAppointmentDefaultHeight() {
    return this.getAppointmentHeightByTheme();
  }

  protected getAppointmentMinHeight() {
    return this.getAppointmentDefaultHeight();
  }

  protected getAppointmentHeightByTheme(): number { // TODO get rid of depending from themes
    return this.isCompactTheme()
      ? COMPACT_THEME_APPOINTMENT_DEFAULT_HEIGHT
      : APPOINTMENT_DEFAULT_HEIGHT;
  }

  protected getAppointmentDefaultWidth() {
    return this.getPositioningStrategy()._getAppointmentDefaultWidth();
  }

  protected getAppointmentMinWidth() {
    return this.getAppointmentDefaultWidth();
  }

  getAppointmentDurationInMs(apptStartDate, apptEndDate, allDay) {
    if (allDay) {
      const appointmentDuration = apptEndDate.getTime() - apptStartDate.getTime();
      const ceilQuantityOfDays = Math.ceil(appointmentDuration / toMs('day'));

      return ceilQuantityOfDays * this.visibleDayDuration;
    }

    const msInHour = toMs('hour');
    const trimmedStartDate = dateUtils.trimTime(apptStartDate);
    const trimmedEndDate = dateUtils.trimTime(apptEndDate);

    const deltaDate = trimmedEndDate - trimmedStartDate;
    const quantityOfDays = deltaDate / toMs('day') + 1;
    const dayVisibleHours = this.endDayHour - this.startDayHour;
    const appointmentDayHours = dayVisibleHours * quantityOfDays;

    const startHours = (apptStartDate - trimmedStartDate) / msInHour;
    const apptStartDelta = Math.max(0, startHours - this.startDayHour);

    const endHours = Math.max(0, (apptEndDate - trimmedEndDate) / msInHour - this.startDayHour);
    const apptEndDelta = Math.max(0, dayVisibleHours - endHours);

    const result = (appointmentDayHours - (apptStartDelta + apptEndDelta)) * msInHour;

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPositionShift(timeShift, isAllDay?) {
    return {
      top: timeShift * this.cellHeight,
      left: 0,
      cellPosition: 0,
    };
  }

  protected shiftAppointmentByViewOffset(appointment: SafeAppointment): any {
    const { viewOffset } = this.options;

    const startDateField = this.dataAccessors.expr.startDateExpr;
    const endDateField = this.dataAccessors.expr.endDateExpr;

    let startDate = this.dataAccessors.get('startDate', appointment);
    let endDate = this.dataAccessors.get('endDate', appointment);

    startDate = dateUtilsTs.addOffsets(startDate, [-viewOffset]);
    endDate = dateUtilsTs.addOffsets(endDate, [-viewOffset]);

    return {
      ...appointment,
      [startDateField]: startDate,
      [endDateField]: endDate,
    };
  }
}

export default BaseRenderingStrategy;
