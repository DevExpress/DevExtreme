/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { Scrollable } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';
import { Component } from 'inferno';

import { ColumnSortable } from './column_sortable';
import { CLASSES as itemClasses, Item } from './item';

export const CLASSES = {
  headers: 'dx-cardview-headers',
  content: 'dx-cardview-headers-content',
};

export interface HeaderPanelProps {
  columns: Column[];

  onMove: (column: Column, toIndex: number) => void;

  allowColumnReordering: boolean;
}

export class HeaderPanel extends Component<HeaderPanelProps> {
  public render(): JSX.Element {
    return (
      <div className={CLASSES.headers}>
        <ColumnSortable
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
                  column={column}
                />
              ))}
            </div>
          </Scrollable>
        </ColumnSortable>
      </div>
    );
  }
}
