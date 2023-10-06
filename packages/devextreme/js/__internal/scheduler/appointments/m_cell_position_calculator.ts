/* eslint-disable max-classes-per-file */
import { isDefined } from '@js/core/utils/type';
import { dateUtilsTs } from '@ts/core/utils/date';

class BaseStrategy {
  options: any;

  isVirtualScrolling = false;

  constructor(options) {
    this.options = options;
  }

  get DOMMetaData() { return this.options.DOMMetaData; }

  get appointments() { return this.options.dateSettings; } // TODO rename appoitments -> dateSettings

  get viewDataProvider() { return this.options.viewDataProvider; }

  get positionHelper() { return this.options.positionHelper; }

  get startViewDate() { return this.options.startViewDate; }

  get viewStartDayHour() { return this.options.viewStartDayHour; }

  get viewEndDayHour() { return this.options.viewEndDayHour; }

  get cellDuration() { return this.options.cellDuration; }

  get getPositionShift() { return this.options.getPositionShiftCallback; }

  get groupCount() { return this.options.groupCount; }

  get rtlEnabled() { return this.options.rtlEnabled; }

  get isVerticalGrouping() { return this.options.isVerticalGroupOrientation; }

  get showAllDayPanel() { return this.options.showAllDayPanel; }

  get supportAllDayRow() { return this.options.supportAllDayRow; }

  get isGroupedAllDayPanel() { return this.options.isGroupedAllDayPanel; }

  calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment) {
    const result: any = [];

    this.appointments.forEach((dateSetting, index) => {
      const coordinates = this.getCoordinateInfos({
        appointment: dateSetting,
        groupIndices,
        isAllDayRowAppointment,
        isRecurrentAppointment,
      });

      coordinates.forEach((item) => {
        !!item && result.push(
          this._prepareObject(item, index),
        );
      });
    });

    return result;
  }

  getCoordinateInfos(options) {
    const {
      appointment,
      isAllDayRowAppointment,
      groupIndices,
      recurrent,
    } = options;

    const { startDate } = appointment;

    const groupIndex = !recurrent
      ? appointment.source.groupIndex
      : undefined;

    return this.getCoordinatesByDateInGroup(
      startDate,
      groupIndices,
      isAllDayRowAppointment,
      groupIndex,
    );
  }

  _prepareObject(position, dateSettingIndex) {
    position.dateSettingIndex = dateSettingIndex;
    return {
      coordinates: position,
      dateSettingIndex,
    };
  }

  getCoordinatesByDate(date, groupIndex, inAllDayRow) {
    const validGroupIndex = groupIndex || 0;

    const cellInfo = { groupIndex: validGroupIndex, startDate: date, isAllDay: inAllDayRow };
    const positionByMap = this.viewDataProvider.findCellPositionInMap(cellInfo);
    if (!positionByMap) {
      return undefined;
    }

    const position = this.getCellPosition(
      positionByMap,
      inAllDayRow && !this.isVerticalGrouping,
    );

    const timeShift = inAllDayRow
      ? 0
      : this.getTimeShiftRatio(positionByMap, date);

    const shift = this.getPositionShift(timeShift, inAllDayRow);
    const horizontalHMax = this.positionHelper.getHorizontalMax(validGroupIndex, date);
    const verticalMax = this.positionHelper.getVerticalMax({
      groupIndex: validGroupIndex,
      isVirtualScrolling: this.isVirtualScrolling,
      showAllDayPanel: this.showAllDayPanel,
      supportAllDayRow: this.supportAllDayRow,
      isGroupedAllDayPanel: this.isGroupedAllDayPanel,
      isVerticalGrouping: this.isVerticalGrouping,
    });

    return {
      positionByMap,
      cellPosition: position.left + shift.cellPosition,
      top: position.top + shift.top,
      left: position.left + shift.left,
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex,
      hMax: horizontalHMax,
      vMax: verticalMax,
      groupIndex: validGroupIndex,
    };
  }

  getCoordinatesByDateInGroup(startDate, groupIndices, inAllDayRow, groupIndex) {
    const result: any = [];

    if (this.viewDataProvider.isSkippedDate(startDate)) {
      return result;
    }

    let validGroupIndices = [groupIndex];

    if (!isDefined(groupIndex)) {
      validGroupIndices = this.groupCount
        ? groupIndices
        : [0];
    }

    validGroupIndices.forEach((groupIndex) => {
      const coordinates = this.getCoordinatesByDate(startDate, groupIndex, inAllDayRow);
      if (coordinates) {
        result.push(coordinates);
      }
    });

    return result;
  }

  getCellPosition(cellCoordinates, isAllDayPanel) {
    const {
      dateTableCellsMeta,
      allDayPanelCellsMeta,
    } = this.DOMMetaData;
    const {
      columnIndex,
      rowIndex,
    } = cellCoordinates;

    const position = isAllDayPanel
      ? allDayPanelCellsMeta[columnIndex]
      : dateTableCellsMeta[rowIndex][columnIndex];

    const validPosition = { ...position };

    if (this.rtlEnabled) {
      validPosition.left += position.width;
    }

    if (validPosition) {
      validPosition.rowIndex = cellCoordinates.rowIndex;
      validPosition.columnIndex = cellCoordinates.columnIndex;
    }

    return validPosition;
  }

  private getTimeShiftRatio(
    positionByMap: any,
    appointmentDate: Date,
  ): number {
    const { cellDuration, viewOffset } = this.options;
    const { rowIndex, columnIndex } = positionByMap;
    const matchedCell = this.viewDataProvider.viewDataMap.dateTableMap[rowIndex][columnIndex];
    const matchedCellStartDate = dateUtilsTs.addOffsets(matchedCell.cellData.startDate, [-viewOffset]);

    return (appointmentDate.getTime() - matchedCellStartDate.getTime()) / cellDuration;
  }
}

class VirtualStrategy extends BaseStrategy {
  isVirtualScrolling = true;

  calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment) {
    const appointments = isAllDayRowAppointment
      ? this.appointments
      : this.appointments.filter(({ source, startDate, endDate }) => this.viewDataProvider.isGroupIntersectDateInterval(
        source.groupIndex,
        startDate,
        endDate,
      ));

    if (isRecurrentAppointment) {
      return this.createRecurrentAppointmentInfos(appointments, isAllDayRowAppointment);
    }

    return super.calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment);
  }

  createRecurrentAppointmentInfos(dateSettings, isAllDayRowAppointment) {
    const result: any = [];

    dateSettings.forEach(({ source, startDate }, index) => {
      const coordinate = this.getCoordinatesByDate(
        startDate,
        source.groupIndex,
        isAllDayRowAppointment,
      );

      if (coordinate) {
        result.push(
          this._prepareObject(coordinate, index),
        );
      }
    });

    return result;
  }
}

export class CellPositionCalculator {
  options: any;

  constructor(options) {
    this.options = options;
  }

  calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment) {
    const strategy = this.options.isVirtualScrolling
      ? new VirtualStrategy(this.options)
      : new BaseStrategy(this.options);

    return strategy.calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment);
  }
}
