import dateUtils from "../../../core/utils/date";
import { each } from "../../../core/utils/iterator";
import arrayUtils from "../../../core/utils/array";
import BaseAppointmentsStrategy from "./ui.scheduler.appointments.strategy.base";

class AgendaRenderingStrategy extends BaseAppointmentsStrategy {
    getAppointmentMinSize() {
    }

    getDeltaTime() {
    }

    keepAppointmentSettings() {
        return true;
    }

    getAppointmentGeometry(geometry) {
        return geometry;
    }

    createTaskPositionMap(appointments) {

        if(appointments.length) {
            var height = this.instance.fire("getAgendaVerticalStepHeight"),
                appointmentsByResources = this.instance.fire("groupAppointmentsByResources", appointments),
                groupedAppts = [];

            each(appointmentsByResources, function(i, appts) {

                var additionalAppointments = [],
                    recurrentIndexes = [];

                each(appts, function(index, appointment) {
                    var recurrenceBatch = this.instance.getAppointmentsInstance()._processRecurrenceAppointment(appointment, index),
                        appointmentBatch = null;

                    if(!recurrenceBatch.indexes.length) {
                        appointmentBatch = { parts: [] };
                        appointmentBatch = this.instance.getAppointmentsInstance()._processLongAppointment(appointment);
                        additionalAppointments = additionalAppointments.concat(appointmentBatch.parts);
                    }

                    additionalAppointments = additionalAppointments.concat(recurrenceBatch.parts);
                    recurrentIndexes = recurrentIndexes.concat(recurrenceBatch.indexes);

                }.bind(this));

                this.instance.getAppointmentsInstance()._reduceRecurrenceAppointments(recurrentIndexes, appts);
                this.instance.getAppointmentsInstance()._combineAppointments(appts, additionalAppointments);

                groupedAppts = groupedAppts.concat(appts);

            }.bind(this));

            Array.prototype.splice.apply(appointments, [0, appointments.length].concat(groupedAppts));
        }

        var result = [],
            sortedIndex = 0;

        appointments.forEach(function(appt, index) {
            result.push([{
                height: height,
                width: "100%",
                sortedIndex: sortedIndex++,
                groupIndex: this._calculateGroupIndex(index, appointmentsByResources)
            }]);
        }.bind(this));

        return result;
    }

    _calculateGroupIndex(apptIndex, appointmentsByResources) {
        var resultInd,
            counter = 0;

        for(var i in appointmentsByResources) {
            var countApptInGroup = appointmentsByResources[i].length;

            if(apptIndex >= counter && apptIndex < counter + countApptInGroup) {
                resultInd = Number(i);
                break;
            }

            counter += countApptInGroup;
        }

        return resultInd;
    }

    _getDeltaWidth() {
    }

    _correctRtlCoordinatesParts() {
    }

    _getAppointmentMaxWidth() {
        return this.getDefaultCellWidth();
    }

    _needVerifyItemSize() {
        return false;
    }

    _isRtl() {
        return this.instance.option("rtlEnabled");
    }

    _getAppointmentParts() {
    }

    _reduceMultiWeekAppointment() {
    }

    calculateAppointmentHeight() {
        return 0;
    }

    calculateAppointmentWidth() {
        return 0;
    }

    isAppointmentGreaterThan() {
    }

    isAllDay() {
        return false;
    }

    _sortCondition() {
    }

    _rowCondition() {
    }

    _columnCondition() {
    }

    _findIndexByKey() {
    }

    _getMaxNeighborAppointmentCount() {
    }

    _markAppointmentAsVirtual() {
    }

    getDropDownAppointmentWidth() {
    }

    getDefaultCellWidth() {
        return this._defaultWidth;
    }

    getCompactAppointmentDefaultWidth() {
    }

    getCompactAppointmentLeftOffset() {
    }
    getCompactAppointmentTopOffset() {
    }

    calculateRows(appointments, agendaDuration, currentDate, needClearSettings) {
        this._rows = [];

        var appts = {
            indexes: [],
            parts: []
        };
        var groupedAppointments = this.instance.fire("groupAppointmentsByResources", appointments);
        currentDate = dateUtils.trimTime(new Date(currentDate));

        each(groupedAppointments, function(groupIndex, currentAppointments) {

            var groupResult = [];

            if(!currentAppointments.length) {
                this._rows.push([]);
                return true;
            }

            each(currentAppointments, function(index, appointment) {
                var startDate = this.instance.fire("getField", "startDate", appointment),
                    endDate = this.instance.fire("getField", "endDate", appointment);

                this.instance.fire("fixWrongEndDate", appointment, startDate, endDate);

                needClearSettings && delete appointment.settings;

                var result = this.instance.getAppointmentsInstance()._processRecurrenceAppointment(appointment, index, false);
                appts.parts = appts.parts.concat(result.parts);
                appts.indexes = appts.indexes.concat(result.indexes);
            }.bind(this));

            this.instance.getAppointmentsInstance()._reduceRecurrenceAppointments(appts.indexes, currentAppointments);

            arrayUtils.merge(currentAppointments, appts.parts);

            var appointmentCount = currentAppointments.length;
            for(var i = 0; i < agendaDuration; i++) {
                var day = new Date(currentDate);
                day.setMilliseconds(day.getMilliseconds() + (24 * 3600000 * i));

                if(groupResult[i] === undefined) {
                    groupResult[i] = 0;
                }

                for(var j = 0; j < appointmentCount; j++) {
                    var appointmentData = currentAppointments[j].settings || currentAppointments[j],
                        appointmentIsLong = this.instance.fire("appointmentTakesSeveralDays", currentAppointments[j]),
                        appointmentIsRecurrence = this.instance.fire("getField", "recurrenceRule", currentAppointments[j]);

                    if(this.instance.fire("dayHasAppointment", day, appointmentData, true) || (!appointmentIsRecurrence && appointmentIsLong && this.instance.fire("dayHasAppointment", day, currentAppointments[j], true))) {
                        groupResult[i] += 1;
                    }
                }
            }

            this._rows.push(groupResult);

        }.bind(this));

        return this._rows;
    }

    _iterateRow(row, obj, index) {
        for(var i = 0; i < row.length; i++) {
            obj.counter = obj.counter + row[i];
            if(obj.counter >= index) {
                obj.indexInRow = i;
                break;
            }
        }
    }

    getDateByIndex(index, rows, startViewDate) {
        var obj = { counter: 0, indexInRow: 0 };
        index++;

        for(var i = 0; i < rows.length; i++) {
            this._iterateRow(rows[i], obj, index);
            if(obj.indexInRow) break;
        }

        return new Date(new Date(startViewDate).setDate(startViewDate.getDate() + obj.indexInRow));
    }

    getAppointmentDataCalculator() {
        return function($appointment, originalStartDate) {
            var apptIndex = $appointment.index(),
                startViewDate = this.instance.getStartViewDate(),
                calculatedStartDate = this.getDateByIndex(apptIndex, this._rows, startViewDate),
                wrappedOriginalStartDate = new Date(originalStartDate);

            return {
                startDate: new Date(calculatedStartDate.setHours(
                    wrappedOriginalStartDate.getHours(),
                    wrappedOriginalStartDate.getMinutes(),
                    wrappedOriginalStartDate.getSeconds(),
                    wrappedOriginalStartDate.getMilliseconds()
                ))
            };

        }.bind(this);
    }
}

module.exports = AgendaRenderingStrategy;
