import $ from '../../core/renderer';
import Draggable from '../draggable';
import translator from '../../animation/translator';
import { extend } from '../../core/utils/extend';
import { LIST_ITEM_DATA_KEY } from './constants';

const FIXED_CONTAINER_PROP_NAME = 'fixedContainer';

const APPOINTMENT_ITEM_CLASS = 'dx-scheduler-appointment';

export default class AppointmentDragBehavior {
    constructor(scheduler) {
        this.scheduler = scheduler;
        this.appointments = scheduler._appointments;

        this.initialPosition = {
            left: 0,
            top: 0
        };

        this.currentAppointment = null;
    }

    isAllDay(appointment) {
        return appointment.data('dxAppointmentSettings').allDay;
    }

    getContainerShift(isAllDay) {
        const appointmentContainer = this.appointments._getAppointmentContainer(isAllDay);
        const dragAndDropContainer = this.appointments.option(FIXED_CONTAINER_PROP_NAME);

        const appointmentContainerRect = appointmentContainer[0].getBoundingClientRect();
        const dragAndDropContainerRect = dragAndDropContainer[0].getBoundingClientRect();

        return {
            left: appointmentContainerRect.left - dragAndDropContainerRect.left,
            top: appointmentContainerRect.top - dragAndDropContainerRect.top
        };
    }

    onDragStart(e) {
        this.initialPosition = translator.locate($(e.itemElement));
        this.appointments.notifyObserver('hideAppointmentTooltip');
    }

    getAppointmentElement(e) {
        const itemElement = e.event.data && e.event.data.itemElement || e.itemElement;

        return $(itemElement);
    }

    onDragEnd(e) {
        const $appointment = this.getAppointmentElement(e);
        const container = this.appointments._getAppointmentContainer(this.isAllDay($appointment));
        container.append($appointment);

        this.currentAppointment = $appointment;

        this.appointments.notifyObserver('updateAppointmentAfterDrag', {
            event: e,
            data: this.appointments._getItemData($appointment),
            $appointment: $appointment,
            coordinates: this.initialPosition
        });
    }

    getItemData(appointment) {
        const itemData = $(appointment).data(LIST_ITEM_DATA_KEY);
        return itemData && itemData.data || this.appointments._getItemData(appointment);
    }

    getItemSettings(appointment) {
        const itemData = $(appointment).data(LIST_ITEM_DATA_KEY);
        return itemData && itemData.settings || [];
    }

    createDragStartHandler(options, appointmentDragging) {
        return (e) => {
            e.itemData = this.getItemData(e.itemElement);
            e.itemSettings = this.getItemSettings(e.itemElement);

            appointmentDragging.onDragStart && appointmentDragging.onDragStart(e);

            if(!e.cancel) {
                options.onDragStart(e);
            }
        };
    }

    createDragEndHandler(options, appointmentDragging) {
        return (e) => {
            appointmentDragging.onDragEnd && appointmentDragging.onDragEnd(e);

            if(!e.cancel) {
                options.onDragEnd(e);
                if(e.fromComponent !== e.toComponent) {
                    appointmentDragging.onRemove && appointmentDragging.onRemove(e);
                }
            }
        };
    }

    createDropHandler(appointmentDragging) {
        return (e) => {
            e.itemData = extend({}, e.itemData, this.appointments.invoke('getUpdatedData', {
                data: e.itemData
            }));

            if(e.fromComponent !== e.toComponent) {
                appointmentDragging.onAdd && appointmentDragging.onAdd(e);
            }
        };
    }

    addTo(container, config) {
        const appointmentDragging = this.scheduler.option('appointmentDragging') || {};
        const options = extend({
            component: this.scheduler,
            contentTemplate: null,
            filter: `.${APPOINTMENT_ITEM_CLASS}`,
            immediate: false,
            onDragStart: this.onDragStart.bind(this),
            onDragEnd: this.onDragEnd.bind(this)
        }, config);

        this.appointments._createComponent(container, Draggable, extend({}, options, appointmentDragging, {
            onDragStart: this.createDragStartHandler(options, appointmentDragging),
            onDragEnd: this.createDragEndHandler(options, appointmentDragging),
            onDrop: this.createDropHandler(appointmentDragging),
        }));
    }

    moveBack() {
        if(this.currentAppointment && this.initialPosition.left !== undefined && this.initialPosition.top !== undefined) {
            translator.move(this.currentAppointment, this.initialPosition);
        }
    }
}

module.exports = AppointmentDragBehavior;
