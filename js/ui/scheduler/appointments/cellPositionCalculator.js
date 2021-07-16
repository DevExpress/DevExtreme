class BaseStrategy {
    constructor(options) {
        this.options = options;
    }

    get DOMMetaData() { return this.options.DOMMetaData; }
    get appointments() { return this.options.dateSettings; } // TODO rename appoitments -> dateSettings
    get viewDataProvider() { return this.options.viewDataProvider; }
    get positionHelper() { return this.options.positionHelper; }

    calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment) {
        const result = [];

        this.appointments.forEach((dateSetting, index) => {
            const coordinates = this.getCoordinateInfos({
                appointment: dateSetting,
                groupIndices,
                isAllDayRowAppointment,
                isRecurrentAppointment
            });

            coordinates.forEach(item => {
                !!item && result.push(
                    this._prepareObject(item, index)
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
            recurrent
        } = options;

        const { startDate } = appointment;

        const groupIndex = !recurrent
            ? appointment.source.groupIndex
            : undefined;

        return this.positionHelper.getCoordinatesByDateInGroup(
            startDate,
            groupIndices,
            isAllDayRowAppointment,
            groupIndex
        );
    }

    _prepareObject(position, dateSettingIndex) {
        position.dateSettingIndex = dateSettingIndex;
        return {
            coordinates: position,
            dateSettingIndex
        };
    }
}

class VirtualStrategy extends BaseStrategy {
    calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment) {
        const appointments = isAllDayRowAppointment
            ? this.appointments
            : this.appointments.filter(({ source, startDate, endDate }) => {
                return this.viewDataProvider.isGroupIntersectDateInterval(
                    source.groupIndex,
                    startDate,
                    endDate
                );
            });

        if(isRecurrentAppointment) {
            return this.createRecurrentAppointmentInfos(appointments, isAllDayRowAppointment);
        }

        return super.calculateCellPositions(groupIndices, isAllDayRowAppointment, isRecurrentAppointment);
    }

    createRecurrentAppointmentInfos(dateSettings, isAllDayRowAppointment) {
        const result = [];

        dateSettings.forEach(({ source, startDate }, index) => {
            const coordinate = this.positionHelper.getCoordinatesByDate(
                startDate,
                source.groupIndex,
                isAllDayRowAppointment
            );

            if(coordinate) {
                result.push(
                    this._prepareObject(coordinate, index)
                );
            }
        });

        return result;
    }
}

export class CellPositionCalculator {
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
