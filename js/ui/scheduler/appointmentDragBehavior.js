import $ from "../../core/renderer";
import Draggable from "../draggable";
import translator from "../../animation/translator";
import { extend } from "../../core/utils/extend";

const FIXED_CONTAINER_PROP_NAME = "fixedContainer";

const APPOINTMENT_ITEM_CLASS = "dx-scheduler-appointment";
const LIST_ITEM_DATA_KEY = "dxListItemData";

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

    getAppointmentElement(e) {
        const itemElement = e.event.data && e.event.data.itemElement || e.itemElement;

        return $(itemElement);
    }

    onDragEnd(e) {
        const $appointment = this.getAppointmentElement(e);
        const container = this.scheduler._getAppointmentContainer(this.isAllDay($appointment));
        container.append($appointment);

        this.currentAppointment = $appointment;

        if(this.scheduler._escPressed) {
            e.event.cancel = true;
        } else {
            this.scheduler.notifyObserver("updateAppointmentAfterDrag", {
                event: e,
                data: this.scheduler._getItemData($appointment),
                $appointment: $appointment,
                coordinates: this.initialPosition
            });
        }
    }

    getItemData(appointment) {
        let itemData = $(appointment).data(LIST_ITEM_DATA_KEY);
        return itemData && itemData.data || this.scheduler._getItemData(appointment);
    }

    getDragEventHandler(eventName, options, appointmentDragging) {
        return function(e) {
            let handler = appointmentDragging && appointmentDragging[eventName];

            if(eventName === "onDragStart") {
                e.itemData = this.getItemData(e.itemElement);
            } else if(eventName === "onAdd") {
                e.itemData = extend({}, e.itemData, this.scheduler.invoke("getUpdatedData", {
                    data: e.itemData
                }));
            }

            handler && handler.call(this, e);

            if(!e.cancel) {
                options[eventName] && options[eventName].call(this, e);
                if(eventName === "onDragEnd" && e.fromComponent !== e.toComponent) {
                    appointmentDragging["onRemove"] && appointmentDragging["onRemove"].call(this, e);
                }
            }
        }.bind(this);
    }

    addTo(appointment, config) {
        let appointmentDragging = this.scheduler.option("appointmentDragging"),
            options = extend({
                contentTemplate: null,
                filter: `.${APPOINTMENT_ITEM_CLASS}`,
                immediate: false,
                onDragStart: this.onDragStart.bind(this),
                onDragEnd: this.onDragEnd.bind(this)
            }, config);

        this.scheduler._createComponent(appointment, Draggable, extend({}, options, appointmentDragging, {
            onDragStart: this.getDragEventHandler("onDragStart", options, appointmentDragging),
            onDragEnd: this.getDragEventHandler("onDragEnd", options, appointmentDragging),
            onDrop: this.getDragEventHandler("onAdd", options, appointmentDragging),
        }));
    }

    moveBack() {
        if(this.currentAppointment && this.initialPosition.left !== undefined && this.initialPosition.top !== undefined) {
            translator.move(this.currentAppointment, this.initialPosition);
        }
    }
}

module.exports = AppointmentDragBehavior;
