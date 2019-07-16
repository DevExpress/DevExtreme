import { Selector, ClientFunction } from "testcafe";

const COMPACT_APPOINTMENT_CLASS_NAME = `.dx-scheduler-appointment-collector`;
const APPOINTMENT_CLASS_NAME = `.dx-scheduler-appointment`;
const APPOINTMENT_ALL_DAY_CONTAINER_CLASS_NAME = `.dx-scheduler-fixed-appointments`;
const APPOINTMENT_CONTAINER_CLASS_NAME = `.dx-scheduler-scrollable-appointments`;

export default class SchedulerTestHelper {
    scheduler: Selector;

    constructor(selector: string) {
        this.scheduler = Selector(selector);
    }

    getAppointment(index = 0, allDay = false) {
        if(allDay) {
            return this.scheduler.find(APPOINTMENT_ALL_DAY_CONTAINER_CLASS_NAME).find(APPOINTMENT_CLASS_NAME).nth(index);
        }
        return this.scheduler.find(APPOINTMENT_CONTAINER_CLASS_NAME).find(APPOINTMENT_CLASS_NAME).nth(index);
    }

    getCompactAppointment(index = 0, allDay = false) {
        if(allDay) {
            return this.scheduler.find(APPOINTMENT_ALL_DAY_CONTAINER_CLASS_NAME).find(COMPACT_APPOINTMENT_CLASS_NAME).nth(index);
        }
        return this.scheduler.find(APPOINTMENT_CONTAINER_CLASS_NAME).find(COMPACT_APPOINTMENT_CLASS_NAME).nth(index);
    }

    getAppointmentCount(allDay = false) {
        if(allDay) {
            return this.scheduler.find(APPOINTMENT_ALL_DAY_CONTAINER_CLASS_NAME).find(APPOINTMENT_CLASS_NAME).count;
        }
        return this.scheduler.find(APPOINTMENT_CONTAINER_CLASS_NAME).find(APPOINTMENT_CLASS_NAME).count;
    }

    getCompactAppointmentCount(allDay = false) {
        if(allDay) {
            return this.scheduler.find(APPOINTMENT_ALL_DAY_CONTAINER_CLASS_NAME).find(COMPACT_APPOINTMENT_CLASS_NAME).count;
        }
        return this.scheduler.find(APPOINTMENT_CONTAINER_CLASS_NAME).find(COMPACT_APPOINTMENT_CLASS_NAME).count;
    }

    isTooltipVisible() {
        return Selector(".dx-scheduler-appointment-tooltip-wrapper.dx-overlay-wrapper .dx-list").exists;
    }
}
