var noop = require("../../../core/utils/common").noop,
    dateUtils = require("../../../core/utils/date"),
    each = require("../../../core/utils/iterator").each,
    arrayUtils = require("../../../core/utils/array"),
    BaseAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.base");

var AgendaRenderingStrategy = BaseAppointmentsStrategy.inherit({
    ctor: function(instance) {
        this.instance = instance;
    },

    getAppointmentMinSize: noop,

    getDeltaTime: noop,

    keepAppointmentSettings: function() {
        return true;
    },

    getAppointmentGeometry: function(geometry) {
        return geometry;
    },

    createTaskPositionMap: function(appointments) {

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
    },

    _calculateGroupIndex: function(apptIndex, appointmentsByResources) {
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
    },

    _getDeltaWidth: noop,

    _getAppointmentMaxWidth: function() {
        return this._defaultWidth;
    },

    _needVerifyItemSize: function() {
        return false;
    },

    _isRtl: function() {
        return this.instance.option("rtlEnabled");
    },

    _getAppointmentParts: noop,

    _reduceMultiWeekAppointment: noop,

    calculateAppointmentHeight: function() {
        return 0;
    },

    calculateAppointmentWidth: function() {
        return 0;
    },

    isAppointmentGreaterThan: noop,

    isAllDay: function() {
        return false;
    },

    _sortCondition: noop,

    _rowCondition: noop,

    _columnCondition: noop,

    _findIndexByKey: noop,

    _getMaxNeighborAppointmentCount: noop,

    _markAppointmentAsVirtual: noop,

    getCompactAppointmentGroupMaxWidth: noop,

    getDefaultCellWidth: function() {
        return this._defaultWidth;
    },

    getCompactAppointmentDefaultSize: noop,

    getCompactAppointmentDefaultOffset: noop,

    calculateRows: function(appointments, agendaDuration, currentDate, needClearSettings) {
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
    },

    _iterateRow: function(row, obj, index) {
        for(var i = 0; i < row.length; i++) {
            obj.counter = obj.counter + row[i];
            if(obj.counter >= index) {
                obj.indexInRow = i;
                break;
            }
        }
    },

    getDateByIndex: function(index, rows, startViewDate) {
        var obj = { counter: 0, indexInRow: 0 };
        index++;

        for(var i = 0; i < rows.length; i++) {
            this._iterateRow(rows[i], obj, index);
            if(obj.indexInRow) break;
        }

        return new Date(new Date(startViewDate).setDate(startViewDate.getDate() + obj.indexInRow));
    },

    getAppointmentDataCalculator: function() {
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
});

module.exports = AgendaRenderingStrategy;
