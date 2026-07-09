import eventsEngine from '@js/common/core/events/core/events_engine';
import { enter as dragEventEnter, leave as dragEventLeave } from '@js/common/core/events/drag';
import { addNamespace } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getWindow } from '@js/core/utils/window';
import type {
  DragEndEvent, DragMoveEvent, DragStartEvent, DragTemplateData, Properties as DraggableProperties,
} from '@js/ui/draggable';
import type {
  Appointment,
  AppointmentDraggingAddEvent,
  AppointmentDraggingEndEvent,
  AppointmentDraggingMoveEvent,
  AppointmentDraggingRemoveEvent,
  AppointmentDraggingStartEvent,
  Properties as SchedulerProperties,
} from '@js/ui/scheduler';
import { getHeight, getWidth } from '@ts/core/utils/m_size';
import Draggable from '@ts/m_draggable';

import { APPOINTMENT_CLASSES } from './appointments_new/const';
import type Scheduler from './scheduler';
import type { AppointmentTooltipItem, TargetedAppointment } from './types';
import type { AppointmentItemViewModel } from './view_model/types';

const APPOINTMENT_DRAG_SOURCE_CLASS = 'dx-scheduler-appointment-drag-source';
const TOOLTIP_LIST_ITEM_CLASS = 'dx-list-item';
const HIGHLIGHTED_CELL_CLASS = 'dx-scheduler-date-table-droppable-cell';
const CELL_SELECTOR = '.dx-scheduler-date-table-cell, .dx-scheduler-all-day-table-cell';

const DRAG_ENTER_EVENT = addNamespace(dragEventEnter, 'dxSchedulerAppointmentDrag');
const DRAG_LEAVE_EVENT = addNamespace(dragEventLeave, 'dxSchedulerAppointmentDrag');

type AppointmentDraggingConfig = NonNullable<SchedulerProperties['appointmentDragging']>;

interface DraggedItemData {
  appointmentData: Appointment;
  targetedAppointmentData: TargetedAppointment;
}

export interface AppointmentDragControllerOptions {
  component: Scheduler;
  $draggableContainer: () => dxElementWrapper;
  canDragAppointment: (appointmentData: Appointment) => boolean;
  getCellFromDragTarget: ($dragTarget: dxElementWrapper) => dxElementWrapper | null;
  getCellFromPoint: (x: number, y: number) => dxElementWrapper | null;
  getDroppableCell: () => dxElementWrapper;

  createComponent: <T>(
    $element: dxElementWrapper,
    componentType: new () => T,
    options: object,
  ) => T;
  hideAppointmentTooltip: () => void;

  getAppointmentDraggingConfig: () => AppointmentDraggingConfig;
  getUpdatedItemData: (
    appointmentData: Appointment,
    $cell?: dxElementWrapper,
  ) => Appointment;

  updateAppointmentOnDrop: (
    appointmentData: Appointment,
    targetedAppointmentData: TargetedAppointment,
    $cell: dxElementWrapper,
  ) => Promise<void>;
}

export interface WorkSpaceDraggableOptions {
  getAppointmentData: ($element: dxElementWrapper) => {
    appointmentData: Appointment;
    targetedAppointmentData: TargetedAppointment;
  };
}

export interface TooltipDraggableOptions {
  dragTemplate: (appointmentViewModel: AppointmentItemViewModel) => dxElementWrapper;
}

export class AppointmentDragController {
  private workSpaceDraggable: Draggable | null = null;

  private tooltipDraggable: Draggable | null = null;

  private $initialCell: dxElementWrapper | null = null;

  private $highlightedCell: dxElementWrapper | null = null;

  private $dragClone: dxElementWrapper | null = null;

  private $workSpace: dxElementWrapper | null = null;

  private draggedItemData: DraggedItemData | null = null;

  constructor(
    private readonly options: AppointmentDragControllerOptions,
  ) { }

  public createWorkSpaceDraggable(
    $workSpace: dxElementWrapper,
    draggableOptions: WorkSpaceDraggableOptions,
  ): void {
    const config: DraggableProperties = {
      ...this.getCommonDraggableConfig(),
      // @ts-expect-error private option
      filter: `.${APPOINTMENT_CLASSES.CONTAINER}`,
      dragTemplate: (dragInfo: DragTemplateData) => {
        this.$dragClone = $(dragInfo.itemElement).clone();
        this.$dragClone.css({ top: '', left: '' });
        this.$dragClone.removeClass(APPOINTMENT_DRAG_SOURCE_CLASS);

        return this.$dragClone;
      },
      onDragStart: (e: DragStartEvent) => {
        this.onDragStart(e, draggableOptions.getAppointmentData($(e.itemElement)));
      },
    };

    this.workSpaceDraggable = this.options.createComponent($workSpace, Draggable, config);

    this.$workSpace = $workSpace;
    eventsEngine.on($workSpace, DRAG_ENTER_EVENT, CELL_SELECTOR, this.onExternalDragEnter);
    eventsEngine.on($workSpace, DRAG_LEAVE_EVENT, this.onExternalDragLeave);
  }

  public disposeWorkSpaceDraggable(): void {
    if (this.$workSpace) {
      eventsEngine.off(this.$workSpace, DRAG_ENTER_EVENT);
      eventsEngine.off(this.$workSpace, DRAG_LEAVE_EVENT);
      this.$workSpace = null;
    }

    this.workSpaceDraggable?.dispose();
    this.workSpaceDraggable = null;
  }

  private readonly onExternalDragEnter = (e: { target: Element }): void => {
    if (this.draggedItemData) {
      return;
    }

    this.highlightCell($(e.target).closest(CELL_SELECTOR));
  };

  private readonly onExternalDragLeave = (): void => {
    if (this.draggedItemData) {
      return;
    }

    this.removeCellHighlight();
  };

  public createTooltipDraggable(
    $tooltipList: dxElementWrapper,
    draggableOptions: TooltipDraggableOptions,
  ): void {
    let tooltipItem: AppointmentTooltipItem | null = null;

    const config: DraggableProperties = {
      ...this.getCommonDraggableConfig(),
      filter: `.${TOOLTIP_LIST_ITEM_CLASS}`,
      dragTemplate: () => {
        if (!tooltipItem) {
          return $();
        }

        const appointmentViewModel = tooltipItem.settings;

        this.$dragClone = draggableOptions.dragTemplate(appointmentViewModel);
        this.$dragClone.css({ top: '', left: '' });
        this.$dragClone.removeClass(APPOINTMENT_DRAG_SOURCE_CLASS);

        return this.$dragClone;
      },
      onDragStart: (e: DragStartEvent) => {
        tooltipItem = $(e.itemElement).data('dxListItemData') as unknown as AppointmentTooltipItem;

        this.onDragStart(e, {
          appointmentData: tooltipItem.appointment,
          targetedAppointmentData: (
            tooltipItem.targetedAppointment ?? tooltipItem.appointment
          ) as TargetedAppointment,
        });
      },
      // @ts-expect-error private option
      cursorOffset: () => ({
        x: getWidth(this.$dragClone) / 2,
        y: getHeight(this.$dragClone) / 2,
      }),
    };

    this.tooltipDraggable = this.options.createComponent($tooltipList, Draggable, config);
  }

  public disposeTooltipDraggable(): void {
    this.tooltipDraggable?.dispose();
    this.tooltipDraggable = null;
  }

  private getCommonDraggableConfig(): DraggableProperties {
    const config = this.options.getAppointmentDraggingConfig();

    const draggableConfig: DraggableProperties = {
      // @ts-expect-error private option
      component: this.options.component,
      container: this.options.$draggableContainer().get(0),
      onCancelByEsc: true,
      onDragMove: this.onDragMove.bind(this),
      onDragEnd: this.onDragEnd.bind(this),
      onDragCancel: this.onDragCancel.bind(this),
      onDrop: this.onDrop.bind(this),
    };

    return extend(draggableConfig, {
      autoScroll: config.autoScroll,
      data: config.data,
      group: config.group,
      scrollSpeed: config.scrollSpeed,
      scrollSensitivity: config.scrollSensitivity,
    }) as DraggableProperties;
  }

  private onDragStart(e: DragStartEvent, draggedItemData: DraggedItemData): void {
    e.itemData = draggedItemData.appointmentData;

    if (!this.options.canDragAppointment(draggedItemData.appointmentData)) {
      e.cancel = true;
      return;
    }

    this.options.getAppointmentDraggingConfig()
      .onDragStart?.(e as unknown as AppointmentDraggingStartEvent);

    if (e.cancel) {
      return;
    }

    this.draggedItemData = draggedItemData;

    this.$initialCell = this.options.getCellFromDragTarget($(e.itemElement));

    this.options.hideAppointmentTooltip();

    $(e.itemElement).addClass(APPOINTMENT_DRAG_SOURCE_CLASS);
  }

  private onDragMove(e: DragMoveEvent): void {
    this.options.getAppointmentDraggingConfig()
      .onDragMove?.(e as unknown as AppointmentDraggingMoveEvent);

    if (e.cancel) {
      return;
    }

    const $cell = this.options.getCellFromDragTarget($(this.$dragClone));

    if (!$cell) {
      this.removeHighlightedCell();
      return;
    }

    this.highlightCell($cell);
  }

  private onDragEnd(e: DragEndEvent): void {
    const { draggedItemData } = this;
    this.draggedItemData = null;

    if (!draggedItemData) {
      this.removeDraggingClasses($(e.itemElement));
      return;
    }

    if (this.$initialCell && !this.$initialCell.get(0)?.isConnected) {
      this.$initialCell = null;
    }

    const isSameComponent = e.fromComponent === e.toComponent;
    const $dropCell = this.getSourceDropCell(e);

    (e as { toItemData?: unknown }).toItemData = {
      ...e.itemData,
      ...this.options.getUpdatedItemData(e.itemData, $dropCell ?? this.$initialCell ?? undefined),
    };

    this.options.getAppointmentDraggingConfig()
      .onDragEnd?.(e as unknown as AppointmentDraggingEndEvent);

    if (e.cancel === true) {
      this.removeDraggingClasses($(e.itemElement));
      return;
    }

    if (!isSameComponent) {
      this.options.getAppointmentDraggingConfig()
        .onRemove?.(e as unknown as AppointmentDraggingRemoveEvent);
      this.removeDraggingClasses($(e.itemElement));
      return;
    }

    const isSameCell = this.$initialCell?.is($dropCell ?? $()) ?? false;

    if (!$dropCell || isSameCell) {
      this.removeDraggingClasses($(e.itemElement));
      return;
    }

    this.options.updateAppointmentOnDrop(
      draggedItemData.appointmentData,
      draggedItemData.targetedAppointmentData,
      $dropCell,
    )
      .finally(() => { this.removeDraggingClasses($(e.itemElement)); })
      .catch((err) => { throw err; });

    this.removeCellHighlight();
  }

  private getSourceDropCell(e: DragEndEvent): dxElementWrapper | null {
    const $cell = this.$highlightedCell;

    if (!$cell || $cell.closest(e.fromComponent.$element()).length === 0) {
      return null;
    }

    return $cell;
  }

  private onDrop(e: DragEndEvent): void {
    if (e.fromComponent === e.toComponent) {
      return;
    }

    const $cell = this.getDropCell(e) ?? undefined;

    (e as { itemData?: unknown }).itemData = {
      ...e.itemData,
      ...this.options.getUpdatedItemData(e.itemData, $cell),
    };

    this.options.getAppointmentDraggingConfig()
      .onAdd?.(e as unknown as AppointmentDraggingAddEvent);

    this.removeCellHighlight();
  }

  private getDropCell(e: DragEndEvent): dxElementWrapper | null {
    const point = this.getDropPoint(e);
    const $cellFromPoint = point
      ? this.options.getCellFromPoint(point.x, point.y)
      : null;

    if ($cellFromPoint) {
      return $cellFromPoint;
    }

    const $droppableCell = this.options.getDroppableCell();
    return $droppableCell.length ? $droppableCell : null;
  }

  private getDropPoint(e: DragEndEvent): { x: number; y: number } | null {
    const { event } = e as {
      event?: { clientX?: number; clientY?: number; pageX?: number; pageY?: number };
    };

    if (!event) {
      return null;
    }

    const window = getWindow();

    const toClient = (
      client: number | undefined,
      page: number | undefined,
      scroll: number,
    ): number | undefined => client ?? (page != null ? page - (scroll || 0) : undefined);

    const x = toClient(event.clientX, event.pageX, window.scrollX);
    const y = toClient(event.clientY, event.pageY, window.scrollY);

    return x != null && y != null ? { x, y } : null;
  }

  // Note: onDragCancel is private callback, so there's no type for it
  private onDragCancel(e: DragEndEvent): void {
    this.draggedItemData = null;
    this.removeDraggingClasses($(e.itemElement));
  }

  private removeDraggingClasses($dragSource: dxElementWrapper): void {
    $dragSource.removeClass(APPOINTMENT_DRAG_SOURCE_CLASS);
    this.removeCellHighlight();
  }

  private highlightCell($cell: dxElementWrapper): void {
    this.removeHighlightedCell();
    $cell.addClass(HIGHLIGHTED_CELL_CLASS);
    this.$highlightedCell = $cell;
  }

  private removeHighlightedCell(): void {
    this.$highlightedCell?.removeClass(HIGHLIGHTED_CELL_CLASS);
    this.$highlightedCell = null;
  }

  private removeCellHighlight(): void {
    this.removeHighlightedCell();
    this.options.getDroppableCell().removeClass(HIGHLIGHTED_CELL_CLASS);
  }
}
