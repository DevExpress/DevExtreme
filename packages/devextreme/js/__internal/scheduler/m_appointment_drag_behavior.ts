/* eslint-disable devextreme-custom/no-deferred */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import Draggable from '@js/ui/draggable';
import type {
  AppointmentDraggingAddEvent,
  AppointmentDraggingEndEvent,
  AppointmentDraggingMoveEvent,
  AppointmentDraggingRemoveEvent,
  AppointmentDraggingStartEvent,
  Properties as SchedulerProperties,
} from '@js/ui/scheduler';

import { APPOINTMENT_SETTINGS_KEY, LIST_ITEM_DATA_KEY } from './constants';
import type Scheduler from './scheduler';
import type { SafeAppointment } from './types';
import { isSchedulerComponent } from './utils/is_scheduler_component';
import type { AppointmentViewModelPlain } from './view_model/types';

const APPOINTMENT_ITEM_CLASS = 'dx-scheduler-appointment';

type AppointmentDragging = NonNullable<SchedulerProperties['appointmentDragging']>;

interface DragPosition {
  left: number;
  top: number;
}

interface DragStartData {
  itemData: SafeAppointment;
  itemSettings: AppointmentViewModelPlain;
  initialPosition: DragPosition;
}

interface AppointmentInfo {
  appointment: SafeAppointment;
  settings: AppointmentViewModelPlain;
}

interface ListItemData {
  appointment?: SafeAppointment;
  settings?: AppointmentViewModelPlain;
}

type DragStartArgs = AppointmentDraggingStartEvent & {
  itemSettings?: AppointmentViewModelPlain;
};

type DragEndArgs = Omit<AppointmentDraggingEndEvent, 'itemData' | 'toItemData'> & {
  itemData?: SafeAppointment;
  toItemData?: SafeAppointment;
};

type DropArgs = Omit<AppointmentDraggingAddEvent, 'itemData'> & {
  itemData?: SafeAppointment;
};

interface DragBehaviorOptions {
  onDragStart: (e: AppointmentDraggingStartEvent) => void;
  onDragMove: (e: AppointmentDraggingMoveEvent) => void;
  onDragEnd: (e: AppointmentDraggingEndEvent) => void;
  onDragCancel: (e: AppointmentDraggingRemoveEvent) => void;
}

export default class AppointmentDragBehavior {
  workspace = this.scheduler._workSpace;

  appointments = this.scheduler._appointments;

  initialPosition: DragPosition = {
    left: 0,
    top: 0,
  };

  appointmentInfo: AppointmentInfo | null = null;

  dragBetweenComponentsPromise: DeferredObj<void> | null = null;

  constructor(public scheduler: Scheduler) {
  }

  isAllDay(appointment: dxElementWrapper): boolean {
    return (appointment.data(APPOINTMENT_SETTINGS_KEY) as unknown as AppointmentViewModelPlain)
      .allDay;
  }

  onDragStart(e: DragStartData): void {
    const { itemSettings, itemData, initialPosition } = e;

    this.initialPosition = initialPosition;
    this.appointmentInfo = {
      appointment: itemData,
      settings: itemSettings,
    };

    this.appointments.notifyObserver('hideAppointmentTooltip');
  }

  onDragMove(e: AppointmentDraggingMoveEvent): void {
    if (e.fromComponent !== e.toComponent) {
      this.appointments.notifyObserver('removeDroppableCellClass');
    }
  }

  getAppointmentElement(e: AppointmentDraggingEndEvent): dxElementWrapper {
    // @ts-expect-error the event of a drag end always carries the original event
    const itemElement = e.event.data?.itemElement || e.itemElement;

    return $(itemElement);
  }

  onDragEnd(event: AppointmentDraggingEndEvent): void {
    const element = this.getAppointmentElement(event);

    const isAllDay = this.isAllDay(element);
    const rawAppointment = this.appointments._getItemData(element);
    const container = this.appointments._getAppointmentContainer(isAllDay);
    container.append(element);

    const $targetCell = this.workspace.getDroppableCell();
    const $dragCell = this.workspace.getCellByCoordinates(this.initialPosition, isAllDay);

    this.appointments.notifyObserver('updateAppointmentAfterDrag', {
      event,
      element,
      rawAppointment,
      isDropToTheSameCell: $targetCell.is($dragCell),
      isDropToSelfScheduler: $targetCell.length > 0,
    });
  }

  onDragCancel(): void {
    this.removeDroppableClasses();
  }

  getItemData(appointmentElement: Element | dxElementWrapper): SafeAppointment {
    const dataFromTooltip = $(appointmentElement)
      .data(LIST_ITEM_DATA_KEY) as unknown as ListItemData | undefined;
    const itemDataFromTooltip = dataFromTooltip?.appointment;
    const itemDataFromGrid: SafeAppointment = this.appointments._getItemData(appointmentElement);

    return itemDataFromTooltip || itemDataFromGrid;
  }

  getItemSettings(appointment: Element | dxElementWrapper): AppointmentViewModelPlain | undefined {
    const itemData = $(appointment).data(LIST_ITEM_DATA_KEY) as unknown as ListItemData | undefined;
    return itemData?.settings;
  }

  createDragStartHandler(
    options: DragBehaviorOptions,
    appointmentDragging: AppointmentDragging,
  ): (e: DragStartArgs) => void {
    return (e) => {
      // @ts-expect-error the event of a drag start always carries the item element
      e.itemData = this.getItemData(e.itemElement);
      // @ts-expect-error the event of a drag start always carries the item element
      e.itemSettings = this.getItemSettings(e.itemElement);

      if (this.scheduler._isAppointmentBeingUpdated(e.itemData)) {
        e.cancel = true;
        return;
      }

      appointmentDragging.onDragStart?.(e);

      if (!e.cancel) {
        options.onDragStart(e);
      }
    };
  }

  createDragMoveHandler(
    options: DragBehaviorOptions,
    appointmentDragging: AppointmentDragging,
  ): (e: AppointmentDraggingMoveEvent) => void {
    return (e) => {
      if (!this.appointmentInfo) {
        e.cancel = true;
        return;
      }

      if (this.scheduler._isAppointmentBeingUpdated(this.appointmentInfo.appointment)) {
        e.cancel = true;
        return;
      }

      appointmentDragging.onDragMove?.(e);

      if (!e.cancel) {
        options.onDragMove(e);
      }
    };
  }

  createDragEndHandler(
    options: DragBehaviorOptions,
    appointmentDragging: AppointmentDragging,
  ): (e: DragEndArgs) => void {
    return (e) => {
      if (!this.appointmentInfo) {
        e.cancel = true;
        return;
      }

      const updatedData = this.appointments.invoke('getUpdatedData', e.itemData);

      this.appointmentInfo = null;
      e.toItemData = extend({}, e.itemData, updatedData);

      appointmentDragging.onDragEnd?.(e);

      if (!e.cancel) {
        options.onDragEnd(e);
        if (e.fromComponent !== e.toComponent) {
          appointmentDragging.onRemove?.(e);
        }
      }

      // NOTE: event.cancel may be promise or different type, so we need strict check here.
      if (e.cancel === true) {
        options.onDragCancel(e);
      }

      if (e.cancel !== true && isSchedulerComponent(e.toComponent)) {
        // @ts-expect-error toComponent is a Scheduler here, see isSchedulerComponent
        const targetDragBehavior = e.toComponent._getDragBehavior();
        // @ts-expect-error Deferred is declared as a function
        targetDragBehavior.dragBetweenComponentsPromise = new Deferred();
      }
    };
  }

  createDropHandler(appointmentDragging: AppointmentDragging): (e: DropArgs) => void {
    return (e) => {
      const updatedData = this.appointments.invoke('getUpdatedData', e.itemData);
      e.itemData = extend({}, e.itemData, updatedData);

      if (e.fromComponent !== e.toComponent) {
        appointmentDragging.onAdd?.(e);
      }

      if (this.dragBetweenComponentsPromise) {
        this.dragBetweenComponentsPromise.resolve();
      }
    };
  }

  addTo(container: dxElementWrapper, config: Partial<DragBehaviorOptions>): void {
    const appointmentDragging = this.scheduler.option('appointmentDragging') || {};
    const options: DragBehaviorOptions = extend({
      component: this.scheduler,
      contentTemplate: null,
      filter: `.${APPOINTMENT_ITEM_CLASS}`,
      immediate: false,
      onDragStart: this.onDragStart.bind(this),
      onDragMove: this.onDragMove.bind(this),
      onDragEnd: this.onDragEnd.bind(this),
      onDragCancel: this.onDragCancel.bind(this),
    }, config);

    this.appointments._createComponent(container, Draggable, extend(
      {},
      options,
      appointmentDragging,
      {
        onDragStart: this.createDragStartHandler(options, appointmentDragging),
        onDragMove: this.createDragMoveHandler(options, appointmentDragging),
        onDragEnd: this.createDragEndHandler(options, appointmentDragging),
        onDrop: this.createDropHandler(appointmentDragging),
        onCancelByEsc: true,
      },
    ));
  }

  updateDragSource(
    appointment: unknown,
    settings: AppointmentViewModelPlain | undefined,
  ): void {
    const { appointmentInfo } = this;
    if (appointmentInfo || appointment) {
      // @ts-expect-error appointmentInfo is set when appointment is not passed
      const currentAppointment = appointment || appointmentInfo.appointment;
      // @ts-expect-error appointmentInfo is set when appointment is not passed
      const currentSettings = settings || appointmentInfo.settings;

      this.appointments._setDragSourceAppointment(currentAppointment, currentSettings);
    }
  }

  removeDroppableClasses(): void {
    this.appointments._removeDragSourceClassFromDraggedAppointment();
    this.workspace.removeDroppableCellClass();
  }
}
