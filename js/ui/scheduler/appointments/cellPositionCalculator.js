class BaseStrategy {
    constructor(options) {
        this.options = options;
    }

    get DOMMetaData() { return this.options.DOMMetaData; }
    get appointments() { return this.options.dateSettings; } // TODO rename appoitments -> dateSettings
    get viewDataProvider() { return this.options.viewDataProvider; }
    get positionHelper() { return this.options.positionHelper; }

    calculateCellPositions(groupIndices, isAllDayAppointment, isRecurrentAppointment) {
        const result = [];

        this.appointments.forEach((dateSetting) => {
            const coordinates = this.getCoordinateInfos({
                appointment: dateSetting,
                groupIndices,
                isAllDayAppointment,
                isRecurrentAppointment
            });

            result.push(...coordinates);
        });

        return result;
    }

    getCoordinateInfos(options) {
        const {
            appointment,
            isAllDay,
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
            isAllDay,
            groupIndex
        );
    }
}

class VirtualStrategy extends BaseStrategy {
    calculateCellPositions(groupIndices, isAllDayAppointment, isRecurrentAppointment) {
        const appointments = isAllDayAppointment
            ? this.appointments
            : this.appointments.filter(({ source, startDate, endDate }) => {
                return this.viewDataProvider.isGroupIntersectDateInterval(
                    source.groupIndex,
                    startDate,
                    endDate
                );
            });

        if(isRecurrentAppointment) {
            return this.createRecurrentAppointmentInfos(appointments, isAllDayAppointment);
        }

        return super.calculateCellPositions(groupIndices, isAllDayAppointment, isRecurrentAppointment);
    }

    createRecurrentAppointmentInfos(dateSettings, isAllDayAppointment) {
        const result = dateSettings.map(({ source, startDate }) => {
            return this.positionHelper.getCoordinatesByDate(
                startDate,
                source.groupIndex,
                isAllDayAppointment
            );
        });

        return result;
    }
}

export class CellPositionCalculator {
    constructor(options) {
        this.options = options;
    }

    calculateCellPositions(groupIndices, isAllDayAppointment, isRecurrentAppointment) {
        const strategy = this.options.isVirtualScrolling
            ? new VirtualStrategy(this.options)
            : new BaseStrategy(this.options);

        return strategy.calculateCellPositions(groupIndices, isAllDayAppointment, isRecurrentAppointment);
    }
}
