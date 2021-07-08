class BaseStrategy {
    constructor(options) {
        this.options = options;
    }

    get DOMMetaData() { return this.options.DOMMetaData; }
    get appointments() { return this.options.dateSettings; } // TODO rename appoitments -> dateSettings
    get viewDataProvider() { return this.options.viewDataProvider; }
    get positionHelper() { return this.options.positionHelper; }

    calculateCellPositions(groupIndices, isAllDay, recurrent) {
        const result = [];

        this.appointments.forEach((dateSetting) => {
            const coordinates = this.getCoordinateInfos({
                appointment: dateSetting,
                groupIndices,
                isAllDay,
                recurrent
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
    calculateCellPositions(groupIndices, allDay, recurrent) {
        const appointments = allDay
            ? this.appointments
            : this.appointments.filter(({ source, startDate, endDate }) => {
                const { groupIndex } = source;

                return this.viewDataProvider.isGroupIntersectDateInterval(groupIndex, startDate, endDate);
            });

        if(recurrent) {
            return this.createRecurrentAppointmentInfos(appointments, allDay);
        }

        return super.calculateCellPositions(groupIndices, allDay, recurrent);
    }

    createRecurrentAppointmentInfos(dateSettings, allDay) {
        const result = dateSettings.map((item) => {
            const {
                source,
                startDate
            } = item;
            const { groupIndex } = source;

            return this.positionHelper.getCoordinatesByDate(
                startDate,
                groupIndex,
                allDay
            );
        });

        return result;
    }
}

export class CellPositionCalculator {
    constructor(options) {
        this.options = options;
    }

    calculateCellPositions(groupIndices, isAllDay, recurrent) {
        const strategy = this.options.isVirtualScrolling
            ? new VirtualStrategy(this.options)
            : new BaseStrategy(this.options);

        return strategy.calculateCellPositions(groupIndices, isAllDay, recurrent);
    }
}
