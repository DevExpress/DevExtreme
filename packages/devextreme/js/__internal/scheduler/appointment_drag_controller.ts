import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type {
  DragEndEvent, DragMoveEvent, DragStartEvent, DragTemplateData, Properties as DraggableProperties,
} from '@js/ui/draggable';
import type { Appointment } from '@js/ui/scheduler';
import { getHeight, getWidth } from '@ts/core/utils/m_size';
import Draggable from '@ts/m_draggable';

import { APPOINTMENT_CLASSES } from './appointments_new/const';
import type Scheduler from './m_scheduler';
import type { AppointmentTooltipItem } from './types';
import type { AppointmentItemViewModel } from './view_model/types';

const APPOINTMENT_DRAG_SOURCE_CLASS = 'dx-scheduler-appointment-drag-source';
const TOOLTIP_LIST_ITEM_CLASS = 'dx-list-item';
const HIGHLIGHTED_CELL_CLASS = 'dx-scheduler-date-table-droppable-cell';

export interface AppointmentDragControllerOptions {
  component: Scheduler;
  $draggableContainer: () => dxElementWrapper;
  canDragAppointment: (appointmentData: Appointment) => boolean;
  getCellFromDragTarget: ($dragTarget: dxElementWrapper) => dxElementWrapper | null;

  createComponent: <T>(
    $element: dxElementWrapper,
    componentType: new () => T,
    options: object,
  ) => T;
  hideAppointmentTooltip: () => void;

  updateAppointmentOnDrop: (
    appointmentData: Appointment,
    $cell: dxElementWrapper,
    event: DragEndEvent,
  ) => void;
}

export interface WorkSpaceDraggableOptions {
  getAppointmentData: ($element: dxElementWrapper) => Appointment;
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
        e.itemData = draggableOptions.getAppointmentData($(e.itemElement));

        this.onDragStart(e);
      },
    };

    this.workSpaceDraggable = this.options.createComponent($workSpace, Draggable, config);
  }

  public disposeWorkSpaceDraggable(): void {
    this.workSpaceDraggable?.dispose();
    this.workSpaceDraggable = null;
  }

  public createTooltipDraggable(
    $tooltipList: dxElementWrapper,
    draggableOptions: TooltipDraggableOptions,
  ): void {
    let draggingTooltipItem: AppointmentTooltipItem | null = null;

    const config: DraggableProperties = {
      ...this.getCommonDraggableConfig(),
      filter: `.${TOOLTIP_LIST_ITEM_CLASS}`,
      dragTemplate: () => {
        if (!draggingTooltipItem) {
          return $();
        }

        const appointmentViewModel = draggingTooltipItem.settings;

        this.$dragClone = draggableOptions.dragTemplate(appointmentViewModel);
        this.$dragClone.css({ top: '', left: '' });
        this.$dragClone.removeClass(APPOINTMENT_DRAG_SOURCE_CLASS);

        return this.$dragClone;
      },
      onDragStart: (e: DragStartEvent) => {
        draggingTooltipItem = $(e.itemElement).data('dxListItemData') as unknown as AppointmentTooltipItem;
        e.itemData = draggingTooltipItem.appointment;

        this.onDragStart(e);
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
    return {
      // @ts-expect-error private option
      component: this.options.component,
      container: this.options.$draggableContainer().get(0),
      onCancelByEsc: true,
      onDragMove: this.onDragMove.bind(this),
      onDragEnd: this.onDragEnd.bind(this),
      onDragCancel: this.onDragCancel.bind(this),
    };
  }

  private onDragStart(e: DragStartEvent): void {
    if (!this.options.canDragAppointment(e.itemData)) {
      e.cancel = true;
      return;
    }

    this.$initialCell = this.options.getCellFromDragTarget($(e.itemElement));

    this.options.hideAppointmentTooltip();

    $(e.itemElement).addClass(APPOINTMENT_DRAG_SOURCE_CLASS);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onDragMove(e: DragMoveEvent): void {
    const $cell = this.options.getCellFromDragTarget($(this.$dragClone));

    if (!$cell) {
      this.removeHighlight();
      return;
    }

    this.highlightCell($cell);
  }

  private onDragEnd(e: DragEndEvent): void {
    if (!this.$highlightedCell) {
      this.removeDraggingClasses($(e.itemElement));
      return;
    }

    const isSameCell = this.$initialCell?.is(this.$highlightedCell) ?? false;
    const isSameScheduler = this.$highlightedCell.closest(e.fromComponent.$element()).length > 0;

    if (!isSameCell && isSameScheduler) {
      this.options.updateAppointmentOnDrop(e.itemData, this.$highlightedCell, e);
    }

    this.removeDraggingClasses($(e.itemElement));
  }

  private onDragCancel(e): void {
    this.removeDraggingClasses($(e.itemElement));
  }

  public removeDraggingClasses($dragSource: dxElementWrapper): void {
    $dragSource.removeClass(APPOINTMENT_DRAG_SOURCE_CLASS);
    this.$dragClone = null;
    this.removeHighlight();
  }

  private highlightCell($cell: dxElementWrapper): void {
    this.removeHighlight();
    $cell.addClass(HIGHLIGHTED_CELL_CLASS);
    this.$highlightedCell = $cell;
  }

  private removeHighlight(): void {
    this.$highlightedCell?.removeClass(HIGHLIGHTED_CELL_CLASS);
    this.$highlightedCell = null;
  }
}
