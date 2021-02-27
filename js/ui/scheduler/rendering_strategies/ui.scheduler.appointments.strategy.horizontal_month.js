import HorizontalMonthLineAppointmentsStrategy from './ui.scheduler.appointments.strategy.horizontal_month_line';

const MONTH_APPOINTMENT_HEIGHT_RATIO = 0.6;
const MONTH_APPOINTMENT_MIN_OFFSET = 26;
const MONTH_APPOINTMENT_MAX_OFFSET = 30;
const MONTH_DROPDOWN_APPOINTMENT_MIN_RIGHT_OFFSET = 36;
const MONTH_DROPDOWN_APPOINTMENT_MAX_RIGHT_OFFSET = 60;

class HorizontalMonthRenderingStrategy extends HorizontalMonthLineAppointmentsStrategy {
    _getLeftPosition(settings) {
        const fullWeekAppointmentWidth = this._getFullWeekAppointmentWidth(settings.groupIndex);

        let result = this._calculateMultiWeekAppointmentLeftOffset(settings.hMax, fullWeekAppointmentWidth);

        if(this.instance._groupOrientation === 'vertical') {
            result += this.instance.fire('getWorkSpaceDateTableOffset');
        }

        return result;
    }

    // _getAppointmentParts(appointmentGeometry, appointmentSettings, startDate) {
    //     debugger;
    //     const apptDeltaWidth = appointmentGeometry.sourceAppointmentWidth - appointmentGeometry.reducedWidth;
    //     const height = appointmentGeometry.height;
    //     const fullWeekAppointmentWidth = this._getFullWeekAppointmentWidth(appointmentSettings.groupIndex);
    //     //const maxAppointmentWidth = this._getMaxAppointmentWidth(startDate);
    //     const longPartCount = Math.ceil((apptDeltaWidth) / fullWeekAppointmentWidth) - 1;
    //     const realTailWidth = Math.floor(apptDeltaWidth % fullWeekAppointmentWidth);
    //     const tailWidth = longPartCount ? realTailWidth : (realTailWidth || fullWeekAppointmentWidth);
    //     const result = [];
    //     let totalWidth = appointmentGeometry.reducedWidth + tailWidth;
    //     let currentPartTop = appointmentSettings.top + this.getDefaultCellHeight();
    //     let left = this._calculateMultiWeekAppointmentLeftOffset(appointmentSettings.hMax, fullWeekAppointmentWidth);


    //     if(this.instance._groupOrientation === 'vertical') {
    //         left += this.instance.fire('getWorkSpaceDateTableOffset');
    //     }

    //     for(let i = 0; i < longPartCount; i++) {

    //         result.push(extend(true, {}, appointmentSettings, {
    //             top: currentPartTop,
    //             left: left,
    //             height: height,
    //             width: fullWeekAppointmentWidth,
    //             appointmentReduced: 'body',
    //             rowIndex: ++appointmentSettings.rowIndex,
    //             cellIndex: 0
    //         }));

    //         currentPartTop += this.getDefaultCellHeight();
    //         totalWidth += fullWeekAppointmentWidth;
    //     }

    //     if(tailWidth) {
    //         if(this._isRtl()) {
    //             left = left + (fullWeekAppointmentWidth - tailWidth);
    //         }

    //         result.push(extend(true, {}, appointmentSettings, {
    //             top: currentPartTop,
    //             left: left,
    //             height: height,
    //             width: tailWidth,
    //             appointmentReduced: 'tail',
    //             rowIndex: ++appointmentSettings.rowIndex,
    //             cellIndex: 0
    //         }));
    //     }

    //     const { groupIndex } = appointmentSettings;
    //     const groupDeltaWidth = this._getGroupDeltaWidth(groupIndex);
    //     result.forEach(item => {
    //         item.left = Math.max(item.left + groupDeltaWidth, 0);
    //         item.width = Math.max(item.width - groupDeltaWidth, 0);
    //     });

    //     return result;
    // }

    _getAppointmentParts(geometry, settings) {
        const result = [];
        const firstChunkWidth = geometry.reducedWidth;
        const allChunksWidth = geometry.sourceAppointmentWidth;
        const leftPosition = this._getLeftPosition(settings);

        const hasTail = this.instance.fire('getEndViewDate') > settings.info.appointment.endDate;

        const fullWeekAppointmentWidth = this._getFullWeekAppointmentWidth(settings.groupIndex);
        const chunkCount = Math.ceil((settings.left + allChunksWidth) / fullWeekAppointmentWidth);

        const deltaWidth = allChunksWidth - firstChunkWidth;
        const tailWidth = Math.floor(deltaWidth % fullWeekAppointmentWidth);

        for(let chunkIndex = 1; chunkIndex < chunkCount; chunkIndex++) {
            const topPosition = settings.top + this.getDefaultCellHeight() * chunkIndex;

            const lastChunkIndex = chunkIndex === chunkCount - 1;
            const appointmentReducedValue = lastChunkIndex && hasTail ? 'tail' : 'body';
            const width = lastChunkIndex && hasTail ? tailWidth || fullWeekAppointmentWidth : fullWeekAppointmentWidth;

            result.push({ ...settings, ...{
                top: topPosition,
                left: leftPosition,
                height: geometry.height,
                width: width,
                appointmentReduced: appointmentReducedValue,
                rowIndex: ++settings.rowIndex,
                cellIndex: 0
            } });
        }

        const groupDeltaWidth = this._getGroupDeltaWidth(settings.groupIndex);
        result.forEach(item => {
            item.left = Math.max(item.left + groupDeltaWidth, 0);
            item.width = Math.max(item.width - groupDeltaWidth, 0);
        });

        return result;
    }

    _getGroupDeltaWidth(groupIndex) {
        let result = 0;
        const workspace = this.instance.getWorkSpace();
        if(workspace.isRenovatedRender()) {
            const { viewDataProvider } = workspace;

            const cellCountDelta = viewDataProvider.getGroupCellCountDelta(groupIndex);
            result = cellCountDelta * workspace.getCellWidth();
        }

        return result;
    }

    _calculateMultiWeekAppointmentLeftOffset(max, width) {
        return this._isRtl() ? max : max - width;
    }

    _getFullWeekAppointmentWidth(groupIndex) {
        this._maxFullWeekAppointmentWidth = this.instance.fire('getFullWeekAppointmentWidth', {
            groupIndex: groupIndex,
        });

        return this._maxFullWeekAppointmentWidth;
    }

    _getAppointmentDefaultHeight() {
        return this._getAppointmentHeightByTheme();
    }

    _getAppointmentMinHeight() {
        return this._getAppointmentDefaultHeight();
    }

    _columnCondition(a, b) {
        const conditions = this._getConditions(a, b);
        return conditions.rowCondition || conditions.columnCondition || conditions.cellPositionCondition;
    }

    createTaskPositionMap(items) {
        return super.createTaskPositionMap(items, true);
    }

    _getSortedPositions(map) {
        return super._getSortedPositions(map, true);
    }

    _getDefaultRatio() {
        return MONTH_APPOINTMENT_HEIGHT_RATIO;
    }

    _getOffsets() {
        return {
            unlimited: MONTH_APPOINTMENT_MIN_OFFSET,
            auto: MONTH_APPOINTMENT_MAX_OFFSET
        };
    }

    getDropDownAppointmentWidth(intervalCount) {
        if(this.instance.fire('isAdaptive')) {
            return this.getDropDownButtonAdaptiveSize();
        }
        const offset = intervalCount > 1 ? MONTH_DROPDOWN_APPOINTMENT_MAX_RIGHT_OFFSET : MONTH_DROPDOWN_APPOINTMENT_MIN_RIGHT_OFFSET;
        return this.getDefaultCellWidth() - offset;
    }

    needCorrectAppointmentDates() {
        return false;
    }

    _needVerticalGroupBounds() {
        return false;
    }

    _needHorizontalGroupBounds() {
        return true;
    }
}

export default HorizontalMonthRenderingStrategy;
