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

    onDragStart(args) {
        const appointment = $(args.element);
        this.initialPosition = translator.locate(appointment);

        this.scheduler.option(FIXED_CONTAINER_PROP_NAME).append(appointment);
        this.scheduler.notifyObserver("hideAppointmentTooltip");

        const containerShift = this.getContainerShift(this.isAllDay(appointment));

        this.initialPosition.left += containerShift.left;
        this.initialPosition.top += containerShift.top;

        this.onDragMove(args);
    }

    onDragMove(args) {
        const mouseOffset = args.event.offset || { x: 0, y: 0 };

        translator.move($(args.element), {
            left: this.initialPosition.left + mouseOffset.x,
            top: this.initialPosition.top + mouseOffset.y
        });
    }

    onDragEnd(args) {
        const appointment = $(args.element);
        const container = this.scheduler._getAppointmentContainer(this.isAllDay(appointment));
        container.append(appointment);

        if(this.scheduler._escPressed) {
            args.event.cancel = true;
        } else {
            this.scheduler.notifyObserver("updateAppointmentAfterDrag", {
                data: this.scheduler._getItemData(appointment),
                $appointment: appointment,
                coordinates: this.initialPosition
            });
        }
    }

    addTo(appointment) {
        this.scheduler._createComponent(appointment, Draggable, {
            area: this.getDraggableArea(),
            boundOffset: this.scheduler._calculateBoundOffset(),
            immediate: false,

            onDragStart: args => this.onDragStart(args),
            onDrag: args => this.onDragMove(args),
            onDragEnd: args => this.onDragEnd(args)
        });
    }
}
