import $ from '../../core/renderer';
import Draggable from '../draggable';
import { extend } from '../../core/utils/extend';
import { LIST_ITEM_DATA_KEY } from './constants';

const APPOINTMENT_ITEM_CLASS = 'dx-scheduler-appointment';

export default class AppointmentDragBehavior {
    constructor(scheduler) {
        this.scheduler = scheduler;
        this.appointments = scheduler._appointments;

        this.initialPosition = {
            left: 0,
            top: 0
        };

        this.appointmentInfo = null;
    }

    isAllDay(appointment) {
        return appointment.data('dxAppointmentSettings').allDay;
    }

    onDragStart(e) {
        const { itemSettings, itemData, initialPosition } = e;

        this.initialPosition = initialPosition;
        this.appointmentInfo = {
            appointment: itemData,
            settings: itemSettings,
        };

        this.appointments.notifyObserver('hideAppointmentTooltip');
    }

    onDragMove(e) {
        if(e.fromComponent !== e.toComponent) {
            this.appointments.notifyObserver('removeDroppableCellClass');
        }
    }

    getAppointmentElement(e) {
        const itemElement = e.event.data && e.event.data.itemElement || e.itemElement;

        return $(itemElement);
    }

    onDragEnd(e) {
        const $appointment = this.getAppointmentElement(e);
        const container = this.appointments._getAppointmentContainer(this.isAllDay($appointment));
        container.append($appointment);

        this.appointments.notifyObserver('updateAppointmentAfterDrag', {
            event: e,
            data: this.appointments._getItemData($appointment),
            $appointment: $appointment,
            coordinates: this.initialPosition
        });
    }

    getItemData(appointmentElement) {
        const dataFromTooltip = $(appointmentElement).data(LIST_ITEM_DATA_KEY);
        const itemDataFromTooltip = dataFromTooltip?.appointment;
        const itemDataFromGrid = this.appointments._getItemData(appointmentElement);

        return itemDataFromTooltip || itemDataFromGrid;
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

    createDragMoveHandler(options, appointmentDragging) {
        return (e) => {
            appointmentDragging.onDragMove && appointmentDragging.onDragMove(e);

            if(!e.cancel) {
                options.onDragMove(e);
            }
        };
    }

    createDragEndHandler(options, appointmentDragging) {
        return (e) => {
            this.appointmentInfo = null;
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
            const rawAppointment = extend({}, e.itemData, this.appointments.invoke('getUpdatedData', {
                data: e.itemData
            }));

            e.itemData = this.scheduler.createAppointmentAdapter(rawAppointment).clone({ pathTimeZone: 'fromGrid' }).source();

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
            onDragMove: this.onDragMove.bind(this),
            onDragEnd: this.onDragEnd.bind(this)
        }, config);

        this.appointments._createComponent(container, Draggable, extend({}, options, appointmentDragging, {
            onDragStart: this.createDragStartHandler(options, appointmentDragging),
            onDragMove: this.createDragMoveHandler(options, appointmentDragging),
            onDragEnd: this.createDragEndHandler(options, appointmentDragging),
            onDrop: this.createDropHandler(appointmentDragging),
        }));
    }

    updateDragSource(appointment, settings) {
        const { appointmentInfo } = this;
        if(appointmentInfo || appointment) {
            const currentAppointment = appointment || appointmentInfo.appointment;
            const currentSettings = settings || appointmentInfo.settings;

            this.appointments._setDragSourceAppointment(
                currentAppointment, currentSettings,
            );
        }
    }
}
