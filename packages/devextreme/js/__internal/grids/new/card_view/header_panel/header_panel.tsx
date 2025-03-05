/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { Scrollable } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import type { ComponentType } from 'inferno';
import { Component } from 'inferno';

import { ColumnSortable } from './column_sortable';
import { CLASSES as itemClasses, Item } from './item';
import type { DraggingOptions } from './options';

export const CLASSES = {
  headers: 'dx-cardview-headers',
  content: 'dx-cardview-headers-content',
};

export interface HeaderPanelProps {
  columns: Column[];

  onMove: (column: Column, toIndex: number) => void;

  allowColumnReordering: boolean;

  showSortIndexes: boolean;

  onSortClick: (column: Column, e: MouseEvent) => void;

  itemTemplate?: ComponentType<{ column: Column }>;

  itemCssClass?: string;

  visible: boolean;

  draggingOptions?: DraggingOptions;
}

/**
 * <img src="../../../../../../../../e2e/testcafe-devextreme/tests/cardView/etalons/headers.png"></img>
 */
export class HeaderPanel extends Component<HeaderPanelProps> {
  public render(): JSX.Element {
    if (!this.props.visible) {
      return <></>;
    }

    return (
      <div className={CLASSES.headers}>
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
                />
              ))}
            </div>
          </Scrollable>
        </ColumnSortable>
      </div>
    );
  }
}
