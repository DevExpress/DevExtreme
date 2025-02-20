import dateUtils from '@js/core/utils/date';
import { each } from '@js/core/utils/iterator';

import { createAppointmentAdapter } from '../../m_appointment_adapter';
import { ExpressionUtils } from '../../m_expression_utils';
import { groupAppointmentsByResources } from '../../resources/m_utils';
import { getAppointmentTakesSeveralDays, replaceWrongEndDate } from '../data_provider/m_utils';
import BaseRenderingStrategy from './m_strategy_base';

class AgendaRenderingStrategy extends BaseRenderingStrategy {
  _rows: any;

  get instance() { return this.options.instance; }

  get agendaDuration() { return this.options.agendaDuration; }

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

  groupAppointmentByResources(appointments) {
    const groups = this.instance._getCurrentViewOption('groups');

    const config = {
      loadedResources: this.options.loadedResources,
      resources: this.options.resources,
      dataAccessors: this.dataAccessors.resources,
    };

    return groupAppointmentsByResources(
      config,
      appointments,
      groups,
    );
  }

  createTaskPositionMap(appointments) {
    let height;
    let appointmentsByResources;

    this.calculateRows(
      appointments,
      this.agendaDuration,
      this.currentDate,
    );

    if (appointments.length) {
      height = this.instance.fire('getAgendaVerticalStepHeight');

      appointmentsByResources = this.groupAppointmentByResources(appointments);

      let groupedAppts: any = [];

      each(appointmentsByResources, (i, appts) => {
        let additionalAppointments = [];
        let recurrentIndexes = [];

        each(appts, (index, appointment) => {
          const recurrenceBatch = this.instance.getAppointmentsInstance()._processRecurrenceAppointment(appointment, index);
          let appointmentBatch: any = null;

          if (!recurrenceBatch.indexes.length) {
            appointmentBatch = this.instance.getAppointmentsInstance()._processLongAppointment(appointment);
            additionalAppointments = additionalAppointments.concat(appointmentBatch.parts);
          }

          additionalAppointments = additionalAppointments.concat(recurrenceBatch.parts);
          recurrentIndexes = recurrentIndexes.concat(recurrenceBatch.indexes);
        });

        this.instance.getAppointmentsInstance()._reduceRecurrenceAppointments(recurrentIndexes, appts);
        this.instance.getAppointmentsInstance()._combineAppointments(appts, additionalAppointments);

        groupedAppts = groupedAppts.concat(appts);
      });

      Array.prototype.splice.apply(appointments, ([0, appointments.length] as any).concat(groupedAppts));
    }

    const result: any = [];
    let sortedIndex = 0;

    appointments.forEach((appt, index) => {
      result.push([{
        height,
        width: '100%',
        sortedIndex: sortedIndex++,
        groupIndex: this._calculateGroupIndex(index, appointmentsByResources),
        agendaSettings: appt.settings,
      }]);

      delete appt.settings;
    });

    return result;
  }

  _calculateGroupIndex(apptIndex, appointmentsByResources) {
    let resultInd;
    let counter = 0;

    // eslint-disable-next-line
    for (const i in appointmentsByResources) {
      const countApptInGroup = appointmentsByResources[i].length;

      if (apptIndex >= counter && apptIndex < counter + countApptInGroup) {
        resultInd = Number(i);
        break;
      }

      counter += countApptInGroup;
    }

    return resultInd;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getDeltaWidth(args, initialSize) {
  }

  _getAppointmentMaxWidth() {
    return this.cellWidth;
  }

  _needVerifyItemSize() {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getAppointmentParts(geometry, settings) {
  }

  _reduceMultiWeekAppointment() {
  }

  calculateAppointmentHeight() {
    return 0;
  }

  calculateAppointmentWidth() {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isAppointmentGreaterThan(etalon, comparisonParameters) {
  }

  isAllDay() {
    return false;
  }

  _sortCondition() {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _rowCondition(a, b) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _columnCondition(a, b) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _findIndexByKey(arr, iKey, jKey, iValue, jValue) {
  }

  _markAppointmentAsVirtual() {
  }

  getDropDownAppointmentWidth() {
  }

  getCollectorLeftOffset() {
  }

  getCollectorTopOffset() {
  }

  // From subscribe
  replaceWrongAppointmentEndDate(rawAppointment, startDate, endDate) {
    const adapter = createAppointmentAdapter(rawAppointment, this.dataAccessors, this.timeZoneCalculator);

    replaceWrongEndDate(adapter, startDate, endDate, this.cellDuration, this.dataAccessors);
  }

  calculateRows(appointments, agendaDuration, currentDate) {
    this._rows = [];
    currentDate = dateUtils.trimTime(new Date(currentDate));

    const groupedAppointments = this.groupAppointmentByResources(appointments);
    // @ts-expect-error
    each(groupedAppointments, (_, currentAppointments) => {
      const groupResult: any = [];
      const appts = {
        indexes: [],
        parts: [],
      };

      if (!currentAppointments.length) {
        this._rows.push([]);
        return true;
      }

      each(currentAppointments, (index, appointment) => {
        const startDate = ExpressionUtils.getField(this.dataAccessors, 'startDate', appointment);
        const endDate = ExpressionUtils.getField(this.dataAccessors, 'endDate', appointment);

        this.replaceWrongAppointmentEndDate(appointment, startDate, endDate);

        const result = this.instance.getAppointmentsInstance()._processRecurrenceAppointment(appointment, index, false);
        appts.parts = appts.parts.concat(result.parts);
        appts.indexes = appts.indexes.concat(result.indexes);
      });

      this.instance.getAppointmentsInstance()._reduceRecurrenceAppointments(appts.indexes, currentAppointments);

      currentAppointments.push(...appts.parts);

      const appointmentCount = currentAppointments.length;
      for (let i = 0; i < agendaDuration; i++) {
        const day = new Date(currentDate);
        day.setMilliseconds(day.getMilliseconds() + (24 * 3600000 * i));

        if (groupResult[i] === undefined) {
          groupResult[i] = 0;
        }

        for (let j = 0; j < appointmentCount; j++) {
          const appointmentData = currentAppointments[j].settings || currentAppointments[j];

          const adapter = createAppointmentAdapter(currentAppointments[j], this.dataAccessors, this.timeZoneCalculator);
          const appointmentIsLong = getAppointmentTakesSeveralDays(adapter);
          const appointmentIsRecurrence = ExpressionUtils.getField(this.dataAccessors, 'recurrenceRule', currentAppointments[j]);

          if (this.instance.fire('dayHasAppointment', day, appointmentData, true) || (!appointmentIsRecurrence && appointmentIsLong && this.instance.fire('dayHasAppointment', day, currentAppointments[j], true))) {
            groupResult[i] += 1;
          }
        }
      }

      this._rows.push(groupResult);
    });

    return this._rows;
  }

  _iterateRow(row, obj, index) {
    for (let i = 0; i < row.length; i++) {
      obj.counter += row[i];
      if (obj.counter >= index) {
        obj.indexInRow = i;
        break;
      }
    }
  }

  getDateByIndex(index, rows, startViewDate) {
    const obj = { counter: 0, indexInRow: 0 };
    index++;

    for (let i = 0; i < rows.length; i++) {
      this._iterateRow(rows[i], obj, index);
      if (obj.indexInRow) break;
    }

    return new Date(new Date(startViewDate).setDate(startViewDate.getDate() + obj.indexInRow));
  }

  getAppointmentDataCalculator() {
    return ($appointment, originalStartDate) => {
      const apptIndex = $appointment.index();
      const startViewDate = this.instance.getStartViewDate();
      const calculatedStartDate = this.getDateByIndex(apptIndex, this._rows, startViewDate);
      const wrappedOriginalStartDate = new Date(originalStartDate);

      return {
        startDate: new Date(calculatedStartDate.setHours(
          wrappedOriginalStartDate.getHours(),
          wrappedOriginalStartDate.getMinutes(),
          wrappedOriginalStartDate.getSeconds(),
          wrappedOriginalStartDate.getMilliseconds(),
        )),
      };
    };
  }
}

export default AgendaRenderingStrategy;
