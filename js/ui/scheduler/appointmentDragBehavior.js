import $ from "../../core/renderer";
import Draggable from "../draggable";
import translator from "../../animation/translator";
import { extend } from "../../core/utils/extend";

const FIXED_CONTAINER_PROP_NAME = "fixedContainer";

const APPOINTMENT_ITEM_CLASS = "dx-scheduler-appointment";

export default class AppointmentDragBehavior {
    constructor(scheduler) {
        this.scheduler = scheduler;

        this.initialPosition = {
            left: 0,
            top: 0
        };

        this.currentAppointment = null;
    }

    isAllDay(appointment) {
        return appointment.data("dxAppointmentSettings").allDay;
    }

    getDraggableArea() {
        let result = null;
        this.scheduler.notifyObserver("getDraggableAppointmentArea", { callback: appointmentArea => result = appointmentArea });
        return result;
    }

    getContainerShift(isAllDay) {
        const appointmentContainer = this.scheduler._getAppointmentContainer(isAllDay);
        const dragAndDropContainer = this.scheduler.option(FIXED_CONTAINER_PROP_NAME);

        const appointmentContainerRect = appointmentContainer[0].getBoundingClientRect();
        const dragAndDropContainerRect = dragAndDropContainer[0].getBoundingClientRect();

        return {
            left: appointmentContainerRect.left - dragAndDropContainerRect.left,
            top: appointmentContainerRect.top - dragAndDropContainerRect.top
        };
    }

    onDragStart(e) {
        this.initialPosition = translator.locate($(e.itemElement));
        this.scheduler.notifyObserver("hideAppointmentTooltip");
    }

    onDragEnd(e) {
        const itemElement = e.event.data && e.event.data.itemElement || e.itemElement;

        this.onDragEndCore($(itemElement), e);
    }

    onDragEndCore(appointment, e) {
        const container = this.scheduler._getAppointmentContainer(this.isAllDay(appointment));
        container.append(appointment);

        this.currentAppointment = appointment;

        if(this.scheduler._escPressed) {
            e.event.cancel = true;
        } else {
            this.scheduler.notifyObserver("updateAppointmentAfterDrag", {
                event: e,
                data: this.scheduler._getItemData(appointment),
                $appointment: appointment,
                coordinates: this.initialPosition
            });
        }
    }

    addTo(appointment, options) {
        this.scheduler._createComponent(appointment, Draggable, extend({
            contentTemplate: null,
            filter: `.${APPOINTMENT_ITEM_CLASS}`,
            immediate: false,
            onDragStart: this.onDragStart.bind(this),
            onDragEnd: this.onDragEnd.bind(this)
        }, options));
    }

    moveBack() {
        if(this.currentAppointment && this.initialPosition.left !== undefined && this.initialPosition.top !== undefined) {
            translator.move(this.currentAppointment, this.initialPosition);
        }
    }
}

module.exports = AppointmentDragBehavior;
