import $ from '@js/core/renderer';
import messageLocalization from '@js/localization/message';
import type * as SortableTypes from '@js/ui/sortable_types';
import { combineClasses } from '@ts/core/utils/combine_classes';
import type { ComponentType, InfernoNode } from 'inferno';
import { Component, render } from 'inferno';

import type { Column, VisibleColumn } from '../../grid_core/columns_controller/types';
import { Icon } from '../../grid_core/icon';
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

  onPlaceholderPrepared?: (e) => void;
}

const ALLOWED_DRAGGING_DISTANCE = 20;

const CLASS = {
  widget: 'dx-widget',
  columnSortable: 'dx-cardview-column-sortable',
  dropzone: 'dx-cardview-dropzone',
  dropzoneVisible: 'dx-cardview-dropzone-visible',
};

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
    $(e.dragElement).addClass(CLASS.columnSortable);
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
        <Icon name='dropzone'/>
        <span>{messageLocalization.format('dxCardView-headerItemDropZoneText')}</span>
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
