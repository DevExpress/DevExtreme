import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { Scrollable } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import type { ComponentType, RefObject } from 'inferno';
import { Component } from 'inferno';

import { ColumnSortable } from './column_sortable';
import { CLASSES as itemClasses, Item } from './item';
import type { DraggingOptions } from './options';

export const CLASSES = {
  headers: 'dx-cardview-headers',
  content: 'dx-cardview-headerpanel-content',
};

export interface HeaderPanelProps {
  containerRef: RefObject<HTMLDivElement>;

  columns: Column[];

  onMove: (column: Column, toIndex: number) => void;

  allowColumnReordering: boolean;

  showSortIndexes: boolean;

  onSortClick: (column: Column, e: MouseEvent) => void;

  onFilterClick?: (
    element: Element,
    column: Column,
    onFilterCloseCallback?: () => void,
  ) => void;

  itemTemplate?: ComponentType<{ column: Column }>;

  itemCssClass?: string;

  visible: boolean;

  draggingOptions?: DraggingOptions;
}

export class HeaderPanel extends Component<HeaderPanelProps> {
  public render(): JSX.Element {
    if (!this.props.visible) {
      return <></>;
    }

    return (
      <div className={CLASSES.headers} ref={this.props.containerRef}>
        <ColumnSortable
          {...this.props.draggingOptions}
          allowColumnReordering={this.props.allowColumnReordering}
          source="header-panel-main"
          visibleColumns={this.props.columns}
          itemOrientation="horizontal"
          onMove={(column, index): void => this.props.onMove?.(column, index)}
          filter={`.${itemClasses.item}`}
          dragTemplate={Item}
        >
          <Scrollable
            direction='horizontal'
            showScrollbar='never'
            useNative={false}
            scrollByContent={true}
          >
            <div className={CLASSES.content}>
              {this.props.columns.map((column) => (
                <Item
                  showSortIndexes={this.props.showSortIndexes}
                  column={column}
                  onSortClick={(e): void => { this.props.onSortClick(column, e); }}
                  template={this.props.itemTemplate}
                  cssClass={this.props.itemCssClass}
                  onFilterClick={(
                    element: Element,
                    callback?: () => void,
                  ) => this.props.onFilterClick?.(element, column, callback)}
                />
              ))}
            </div>
          </Scrollable>
        </ColumnSortable>
      </div>
    );
  }
}
