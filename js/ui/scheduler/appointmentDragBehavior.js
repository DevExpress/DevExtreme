import $ from "../../core/renderer";
import Draggable from "../draggable";
import translator from "../../animation/translator";

const FIXED_CONTAINER_PROP_NAME = "fixedContainer";

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
        const appointment = $(e.element);
        this.onDragStartCore(appointment, this.isAllDay(appointment));
    }

    onDragStartCore(appointment, isAllDay) {
        this.initialPosition = translator.locate(appointment);

        this.scheduler.option(FIXED_CONTAINER_PROP_NAME).append(appointment);
        this.scheduler.notifyObserver("hideAppointmentTooltip");

        const containerShift = this.getContainerShift(isAllDay);
        this.initialPosition.left += containerShift.left;
        this.initialPosition.top += containerShift.top;

        this.onDragMoveCore(appointment, { x: 0, y: 0 });
    }

    onDragMove(e) {
        this.onDragMoveCore($(e.element), e.event.offset);
    }

    onDragMoveCore(appointment, mouseOffset) {
        translator.move(appointment, {
            left: this.initialPosition.left + mouseOffset.x,
            top: this.initialPosition.top + mouseOffset.y
        });
    }

    onDragEnd(e) {
        this.onDragEndCore($(e.element), e);
    }

    onDragEndCore(appointment, e) {
        const container = this.scheduler._getAppointmentContainer(this.isAllDay(appointment));
        container.append(appointment);

        const containerShift = this.getContainerShift(this.isAllDay(appointment));
        this.initialPosition.left -= containerShift.left;
        this.initialPosition.top -= containerShift.top;

        this.currentAppointment = appointment;

        if(this.scheduler._escPressed) {
            e.event.cancel = true;
        } else {
            this.scheduler.notifyObserver("updateAppointmentAfterDrag", {
                data: this.scheduler._getItemData(appointment),
                $appointment: appointment,
                coordinates: this.initialPosition
            });
        }

        this.initialPosition = {};
        this.currentAppointment = null;
    }

    addTo(appointment) {
        this.scheduler._createComponent(appointment, Draggable, {
            area: this.getDraggableArea(),
            boundOffset: this.scheduler._calculateBoundOffset(),
            immediate: false,

            onDragStart: e => this.onDragStart(e),
            onDrag: e => this.onDragMove(e),
            onDragEnd: e => this.onDragEnd(e)
        });
    }

    moveBack() {
        if(this.currentAppointment && this.initialPosition.left !== undefined && this.initialPosition.top !== undefined) {
            translator.move(this.currentAppointment, this.initialPosition);
        }
    }
}
