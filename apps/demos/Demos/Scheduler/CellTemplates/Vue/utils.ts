import { dinnerTime, holidays } from './data.ts';

export default class Utils {
  static isHoliday(date: Date) {
    const localeDate = date.toLocaleDateString();
    return holidays.filter((holiday) => holiday.toLocaleDateString() === localeDate).length > 0;
  }

  static isWeekend(date: Date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  static isDisableDate(date: Date) {
    return Utils.isHoliday(date) || Utils.isWeekend(date);
  }

  static isDinner(date: Date) {
    const hours = date.getHours();
    return hours >= dinnerTime.from && hours < dinnerTime.to;
  }

  static hasCoffeeCupIcon(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return hours === dinnerTime.from && minutes === 0;
  }

  static isValidAppointment(component, appointmentData) {
    const startDate = new Date(appointmentData.startDate);
    const endDate = new Date(appointmentData.endDate);
    const cellDuration = component.option('cellDuration');
    return Utils.isValidAppointmentInterval(startDate, endDate, cellDuration);
  }

  static isValidAppointmentInterval(startDate: Date, endDate: Date, cellDuration: number) {
    const edgeEndDate = new Date(endDate.getTime() - 1);

    if (!Utils.isValidAppointmentDate(edgeEndDate)) {
      return false;
    }

    const durationInMs = cellDuration * 60 * 1000;
    const date = startDate;
    while (date <= endDate) {
      if (!Utils.isValidAppointmentDate(date)) {
        return false;
      }
      const newDateTime = date.getTime() + durationInMs - 1;
      date.setTime(newDateTime);
    }

    return true;
  }

  static isValidAppointmentDate(date: Date) {
    return !Utils.isHoliday(date) && !Utils.isDinner(date) && !Utils.isWeekend(date);
  }
}
