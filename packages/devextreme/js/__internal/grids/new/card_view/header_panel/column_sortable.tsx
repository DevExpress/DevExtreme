import $ from '@js/core/renderer';
import type * as SortableTypes from '@js/ui/sortable_types';
import type { ComponentType, InfernoNode } from 'inferno';
import { Component, createRef, render } from 'inferno';

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

  visibleColumns: VisibleColumn[];

  allowDragging: boolean;

  columnChooserDragModeOpened?: boolean;

  onColumnMove: (column: Column, toIndex: number, draggingData: DraggingColumnData) => void;

  columnDragTemplate?: ComponentType<{ column: Column; status?: Status; isDragging?: boolean }>;
}

const ALLOWED_DRAGGING_DISTANCE = 20;

const CLASS = {
  hidden: 'dx-hidden',
  dropzone: 'dx-cardview-dropzone',
  dropzoneVisible: 'dx-cardview-dropzone-visible',
};

export class ColumnSortable extends Component<Props> {
  private dragItemContainer?: Element;

  private readonly dropzoneRef = createRef<HTMLDivElement>();

  private readonly onDragStart = (e: SortableTypes.DragStartEvent): void => {
    const column = this.props.getColumnByIndex(e.fromIndex);
    const { source } = this.props;
    const isDraggable = this.isColumnDraggable(column);

    if (!isDraggable) {
      e.cancel = true;
      return;
    }

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
  };

  private readonly onDragEnter = (e): void => {
    this.showDropzoneIfNeed(e.itemData);
  };

  private readonly onDragLeave = (): void => {
    this.hideDropzone();
  };

  private readonly onPlaceholderPrepared = (e): void => {
    const $placeholderElement = $(e.placeholderElement);

    if (this.props.source === 'column-chooser') {
      $placeholderElement.addClass(CLASS.hidden);
    }

    if (this.props.source === 'header-panel-main') {
      const { column } = e.itemData as DraggingColumnData;

      $placeholderElement.toggleClass(CLASS.hidden, !column.allowReordering);
    }
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
    this.hideDropzone();

    if (e.itemData.status === 'forbid') {
      return;
    }

    this.props.onColumnMove(e.itemData.column, e.toIndex, e.itemData);
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
      columnChooserDragModeOpened,
      onColumnMove,
      columnDragTemplate,
      dropFeedbackMode,
      ...restProps
    } = this.props;

    const needSortable = allowDragging || columnChooserDragModeOpened;

    if (!needSortable) {
      return this.props.children;
    }

    const dragTemplate = columnDragTemplate ? (e, container): void => {
      this.dragItemContainer = $(container).get(0);

      this.renderDragTemplate(e.itemData);
    } : undefined;

    const needDropzone = this.props.source === 'header-panel-main';

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
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onPlaceholderPrepared={this.onPlaceholderPrepared}
      >
      {this.props.children}

      { needDropzone
         && <div className={CLASS.dropzone} ref={this.dropzoneRef}>
          Drop header item here
        </div>
      }
    </Sortable>
    );
  }

  private showDropzoneIfNeed(itemData: DraggingColumnData): void {
    if (!this.dropzoneRef.current) {
      return;
    }

    const { column, source } = itemData;

    if (this.props.source === 'header-panel-main') {
      const isToHeaderPanel = source !== 'header-panel-main';
      const isDropzoneVisible = !column.allowReordering && isToHeaderPanel;

      $(this.dropzoneRef.current).toggleClass(CLASS.dropzoneVisible, isDropzoneVisible);
    }
  }

  private hideDropzone(): void {
    if (!this.dropzoneRef.current) {
      return;
    }

    $(this.dropzoneRef.current).removeClass(CLASS.dropzoneVisible);
  }

  private isColumnDraggable(column: Column): boolean {
    if (this.props.source === 'header-panel-main') {
      const canBeHidden = column.allowHiding && !!this.props.columnChooserDragModeOpened;

      return column.allowReordering || canBeHidden;
    }

    if (this.props.source === 'column-chooser') {
      return true;
    }

    return false;
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
