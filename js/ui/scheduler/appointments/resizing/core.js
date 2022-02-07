import {
    getEndResizeAppointmentStartDate,
    normalizeStartDate,
    normalizeEndDate,
} from './utils';

const getCellData = (viewDataProvider, rowIndex, columnIndex, isAllDayAppointment, rtlEnabled) => {
    const { viewData } = viewDataProvider;
    const { allDayPanel } = viewData.groupedData[0];
    const hasAllDayPanel = !isAllDayAppointment && !viewData.isGroupedAllDayPanel && allDayPanel?.length > 0;

    if(hasAllDayPanel) {
        rowIndex += 1;
    }

    return viewDataProvider.getCellByPositionInMap(
        rowIndex,
        columnIndex,
        rtlEnabled
    );
};

const getAppointmentLeftCell = (options) => {
    const {
        cellHeight,
        cellWidth,
        viewDataProvider,
        relativeAppointmentRect,
        appointmentSettings,
        rtlEnabled,
    } = options;

    const cellRowIndex = Math.floor(relativeAppointmentRect.top / cellHeight);
    const cellColumnIndex = Math.round(relativeAppointmentRect.left / cellWidth);

    const leftCell = getCellData(
        viewDataProvider,
        cellRowIndex,
        cellColumnIndex,
        appointmentSettings.allDay,
        rtlEnabled
    );

    return {
        ...leftCell,
        startDate: getEndResizeAppointmentStartDate(
            options,
            leftCell.startDate
        )
    };
};

const getDateRangeHorizontal = (options) => {
    const {
        cellWidth,
        cellCountInRow,
        relativeAppointmentRect,
        viewDataProvider,
        appointmentSettings,
        handles,
    } = options;

    const appointmentFirstCell = getAppointmentLeftCell(options);
    const appointmentCellsAmount = Math.round(relativeAppointmentRect.width / cellWidth);
    const appointmentLastCellIndex = appointmentFirstCell.index + (appointmentCellsAmount - 1);

    const { sourceAppointment } = appointmentSettings.info;

    if(handles.left) {
        const startDate = normalizeStartDate(
            options,
            appointmentFirstCell.startDate,
            sourceAppointment.startDate
        );

        return {
            startDate,
            endDate: sourceAppointment.endDate,
        };
    }

    const appointmentRowIndex = Math.floor(appointmentLastCellIndex / cellCountInRow);
    const appointmentColumnIndex = appointmentLastCellIndex % cellCountInRow;
    const appointmentLastCell = viewDataProvider.getCellByPositionInMap(
        appointmentRowIndex,
        appointmentColumnIndex,
    );

    let endDate = !options.considerTime
        ? appointmentLastCell.endDate
        : appointmentLastCell.startDate;
    endDate = normalizeEndDate(
        options,
        endDate,
        sourceAppointment.endDate
    );

    return {
        startDate: sourceAppointment.startDate,
        endDate,
    };
};

const getDateRangeHorizontalRTL = (options) => {
    const {
        viewDataProvider,
        cellCountInRow,
        appointmentSettings,
        handles,
        cellWidth,
        relativeAppointmentRect,
    } = options;

    const appointmentLastCell = getAppointmentLeftCell(options);

    const { sourceAppointment } = appointmentSettings.info;

    if(handles.right) {
        const appointmentLastCellIndex = appointmentLastCell.index;
        const appointmentCellsAmount = Math.round(relativeAppointmentRect.width / cellWidth);
        const appointmentFirstCellIndex = appointmentLastCellIndex - appointmentCellsAmount + 1;
        const appointmentRowIndex = Math.floor(appointmentLastCellIndex / cellCountInRow);
        const appointmentFirstCell = viewDataProvider.getCellByPositionInMap(
            appointmentRowIndex,
            appointmentFirstCellIndex,
        );

        const startDate = normalizeStartDate(
            options,
            appointmentFirstCell.startDate,
            sourceAppointment.endDate
        );

        return {
            startDate,
            endDate: sourceAppointment.endDate,
        };
    }

    let endDate = !options.considerTime
        ? appointmentLastCell.endDate
        : appointmentLastCell.startDate;
    endDate = normalizeEndDate(
        options,
        endDate,
        sourceAppointment.endDate
    );

    return {
        startDate: sourceAppointment.startDate,
        endDate,
    };
};

const getRelativeAppointmentRect = (appointmentRect, parentAppointmentRect) => {
    const left = appointmentRect.left - parentAppointmentRect.left;
    const top = appointmentRect.top - parentAppointmentRect.top;
    const width = left < 0
        ? appointmentRect.width + left
        : appointmentRect.width;
    const height = top < 0
        ? appointmentRect.height + top
        : appointmentRect.height;

    return {
        left: Math.max(0, left),
        top: Math.max(0, top),
        width,
        height,
    };
};

const getAppointmentCellsInfo = (options) => {
    const {
        appointmentSettings,
        isVerticalGroupedWorkSpace,
        DOMMetaData,
    } = options;

    const DOMMetaTable = appointmentSettings.allDay && !isVerticalGroupedWorkSpace
        ? [DOMMetaData.allDayPanelCellsMeta]
        : DOMMetaData.dateTableCellsMeta;

    const { positionByMap } = appointmentSettings;
    const {
        height: cellHeight,
        width: cellWidth,
    } = DOMMetaTable[positionByMap.rowIndex][positionByMap.columnIndex];
    const cellCountInRow = DOMMetaTable[positionByMap.rowIndex].length;

    return {
        cellWidth,
        cellHeight,
        cellCountInRow
    };
};

export const getAppointmentDateRange = (options) => {
    const {
        appointmentSettings
    } = options;

    const relativeAppointmentRect = getRelativeAppointmentRect(
        options.appointmentRect,
        options.parentAppointmentRect,
    );
    const cellInfo = getAppointmentCellsInfo(options);
    const considerTime = !options.isDateAndTimeView || appointmentSettings.allDay;
    const extendedOptions = {
        ...options,
        ...cellInfo,
        considerTime,
        relativeAppointmentRect
    };

    return !options.rtlEnabled
        ? getDateRangeHorizontal(extendedOptions)
        : getDateRangeHorizontalRTL(extendedOptions);
};
