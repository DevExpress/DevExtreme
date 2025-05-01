import $ from '@js/core/renderer';
import type * as SortableTypes from '@js/ui/sortable_types';
import { combineClasses } from '@ts/core/utils/combine_classes';
import type { ComponentType, InfernoNode } from 'inferno';
import { Component, render } from 'inferno';

import type { Column, VisibleColumn } from '../../grid_core/columns_controller/types';
import type { Props as SortableProps } from '../../grid_core/inferno_wrappers/sortable';
import { Sortable } from '../../grid_core/inferno_wrappers/sortable';

export type Status = 'forbid' | 'show' | 'moving' | 'none';

export type ColumnSortableArea = 'header-panel-main' | 'column-chooser';

export interface DraggingColumnData {
  column: Column;
  status: Status;
  source: ColumnSortableArea;
  destination: ColumnSortableArea;
  columnBefore: Column | undefined;
  columnAfter: Column | undefined;
}

export interface Props extends Omit<SortableProps, 'onAdd' | 'onReorder' | 'dragTemplate'> {
  source: ColumnSortableArea;

  getColumnByIndex: (index: number) => Column;

  isColumnDraggable?: (column: Column) => boolean;

  visibleColumns: VisibleColumn[];

  allowDragging?: boolean;

  onColumnMove?: (column: Column, toIndex: number, draggingData: DraggingColumnData) => void;

  columnDragTemplate?: ComponentType<{ column: Column; status?: Status; isDragging?: boolean }>;

  showDropzone?: boolean;

  dropzoneText?: string;

  onPlaceholderPrepared?: (e) => void;
}

const ALLOWED_DRAGGING_DISTANCE = 20;

const CLASS = {
  widget: 'dx-widget',
  dropzone: 'dx-cardview-dropzone',
  dropzoneVisible: 'dx-cardview-dropzone-visible',
};

const DropzoneIcon = (): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 2C0 1.17157 0.671573 0.5 1.5 0.5H3V2H1.5V3.5H0V2Z" />
    <path d="M0 5V7.25H1.5V5H0Z" />
    <path d="M1.5 8.75H0V11H1.5V8.75Z"/>
    <path d="M1.5 12.5H0V14C0 14.8284 0.671573 15.5 1.5 15.5H3V14H1.5V12.5Z" />
    <path d="M4.5 14V15.5H6.75V14H4.5Z" />
    <path d="M4.5 2H6.75V0.5H4.5V2Z" />
    <path d="M8.25 0.5V2H10.5V0.5H8.25Z" />
    <path d="M12 0.5V2H13.5V3.5H15V2C15 1.17157 14.3284 0.5 13.5 0.5H12Z" />
    <path d="M15 5H13.5V7.25H15V5Z" />
    <path d="M13.8937 15.875L10.6875 12.6688L9.75 15.5L7.5 8L15 10.25L12.1688 11.1875L15.375 14.3937L13.8937 15.875Z" />
  </svg>
);

export class ColumnSortable extends Component<Props> {
  private dragItemContainer?: Element;

  private readonly onDragStart = (e: SortableTypes.DragStartEvent): void => {
    const column = this.props.getColumnByIndex(e.fromIndex);
    const isDraggable = this.props.isColumnDraggable?.(column) ?? true;

    if (!isDraggable) {
      e.cancel = true;
      return;
    }

    const { source } = this.props;

    e.itemData = {
      column,
      status: 'moving',
      source,
      destination: source,
    } as DraggingColumnData;

    e.itemData = {
      ...e.itemData,
      ...this.getNeighborColumns(e),
    };

    this.props.onDragStart?.(e);
  };

  private readonly onDraggableElementShown = (e): void => {
    // add dx-widget for correct font
    $(e.dragElement).addClass(CLASS.widget);
  };

  private readonly onDragMove = (e: SortableTypes.DragMoveEvent): void => {
    // @ts-expect-error
    const destination = e.toComponent.option('_source') as ColumnSortableArea;
    const { columnBefore, columnAfter } = this.getNeighborColumns(e);

    e.itemData.columnBefore = columnBefore;
    e.itemData.columnAfter = columnAfter;
    e.itemData.destination = destination;
    e.itemData.status = this.getDraggingStatus(e);

    this.renderDragTemplate(e.itemData);
  };

  private readonly onColumnMove = (
    e: SortableTypes.AddEvent | SortableTypes.ReorderEvent,
  ): void => {
    if (e.itemData.status === 'forbid') {
      return;
    }

    this.props.onColumnMove?.(e.itemData.column, e.toIndex, e.itemData);
  };

  // TODO: move all none-native approaches to sortable wrapper
  private readonly renderDragTemplate = (itemData: DraggingColumnData): void => {
    if (!itemData || !this.dragItemContainer) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const DragTemplate = this.props.columnDragTemplate!;

    render(
        <DragTemplate
          column={itemData.column}
          status={itemData.status}
          isDragging={true}
        />,
        this.dragItemContainer,
    );
  };

  render(): InfernoNode {
    const {
      source,
      getColumnByIndex,
      allowDragging,
      onColumnMove,
      columnDragTemplate,
      dropFeedbackMode,
      ...restProps
    } = this.props;

    const needSortable = allowDragging ?? true;

    if (!needSortable) {
      return this.props.children;
    }

    const dragTemplate = columnDragTemplate ? (e, container): void => {
      this.dragItemContainer = $(container).get(0);

      this.renderDragTemplate(e.itemData);
    } : undefined;

    const dropzoneClasses = combineClasses({
      [CLASS.dropzone]: true,
      [CLASS.dropzoneVisible]: !!this.props.showDropzone,
    });

    return (
      <Sortable
        {...restProps}
        dropFeedbackMode={dropFeedbackMode ?? 'indicate'}
        onDragStart={this.onDragStart}
        group='dx-cardview-columns'
        onAdd={this.onColumnMove}
        onReorder={this.onColumnMove}
        onDragMove={this.onDragMove}
        dragTemplate={dragTemplate}
        // @ts-expect-error
        _source={source}
        onPlaceholderPrepared={this.props.onPlaceholderPrepared}
        onDraggableElementShown={this.onDraggableElementShown}
      >
      {this.props.children}

      <div className={dropzoneClasses}>
        <DropzoneIcon/>
        { this.props.dropzoneText }
      </div>
    </Sortable>
    );
  }

  private getDraggingStatus(e: SortableTypes.DragMoveEvent): Status {
    const {
      column,
      source, destination,
      columnBefore, columnAfter,
    } = e.itemData as DraggingColumnData;

    const containerRect = $(e.element).get(0).getBoundingClientRect();
    // @ts-expect-error
    const mouseX = e.event.clientX;
    // @ts-expect-error
    const mouseY = e.event.clientY;

    const yDistance = Math.min(
      Math.abs(mouseY - containerRect.y),
      Math.abs(mouseY - (containerRect.y + containerRect.height)),
    );
    const isMouseOnSourceContainer = mouseX >= containerRect.x
      && mouseX <= containerRect.x + containerRect.width
      && mouseY >= containerRect.y
      && mouseY <= containerRect.y + containerRect.height;

    if (source === 'column-chooser' && destination === 'header-panel-main') {
      return 'moving';
    }

    if (source === 'header-panel-main' && destination === 'column-chooser') {
      return column.allowHiding ? 'moving' : 'forbid';
    }

    if (source === 'header-panel-main' && destination === 'header-panel-main') {
      const isDragCloseEnough = yDistance <= ALLOWED_DRAGGING_DISTANCE;
      const canReorder = column.allowReordering;
      const canInsert = !!columnBefore?.allowReordering || !!columnAfter?.allowReordering;

      const isMoving = isDragCloseEnough && canInsert && canReorder;

      return isMoving ? 'moving' : 'forbid';
    }

    if (source === 'column-chooser' && destination === 'column-chooser') {
      const isMoving = isMouseOnSourceContainer;

      return isMoving ? 'moving' : 'forbid';
    }

    return 'forbid';
  }

  private getNeighborColumns(
    e: SortableTypes.DragStartEvent | SortableTypes.DragMoveEvent,
  ): { columnBefore: Column | undefined; columnAfter: Column | undefined } {
    const { source, destination } = e.itemData as DraggingColumnData;

    if (destination !== 'header-panel-main') {
      return { columnBefore: undefined, columnAfter: undefined };
    }

    const column = e.itemData.column as VisibleColumn;
    const toIndex = (e as SortableTypes.DragMoveEvent).toIndex ?? column.headerPanelIndex;
    const { visibleColumns } = this.props;

    if (source === 'header-panel-main') {
      const isMovingLeft = toIndex < column.headerPanelIndex;

      return isMovingLeft
        ? {
          columnBefore: visibleColumns[toIndex - 1],
          columnAfter: visibleColumns[toIndex],
        }
        : {
          columnBefore: visibleColumns[toIndex],
          columnAfter: visibleColumns[toIndex + 1],
        };
    }

    if (source === 'column-chooser') {
      return {
        columnBefore: visibleColumns[toIndex - 1],
        columnAfter: visibleColumns[toIndex],
      };
    }

    return { columnBefore: undefined, columnAfter: undefined };
  }
}
