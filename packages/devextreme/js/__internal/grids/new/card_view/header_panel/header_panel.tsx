/**
 * @module
 * @document headers.spec.md
 */

import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { Component } from 'inferno';

import { Sortable } from '../../grid_core/inferno_wrappers/sortable';
import { Item } from './item';

export const CLASSES = {
  headers: 'dx-gridcore-headers',
};

export interface HeaderPanelProps {
  columns: Column[];

  onReorder?: (fromIndex: number, toIndex: number) => void;
  onAdd?: (fromIndex: number, toIndex: number) => void;

  onHeaderRemoveButtonClicked?: (name: string) => void;
}

export class HeaderPanel extends Component<HeaderPanelProps> {
  public render(): JSX.Element {
    return (
      <div className={CLASSES.headers}>
        <Sortable
          itemOrientation='horizontal'
          dropFeedbackMode='indicate'
          onReorder={(e): void => this.props.onReorder?.(e.fromIndex, e.toIndex)}
          onAdd={(e): void => this.props.onAdd?.(e.fromIndex, e.toIndex)}
          group='cardview'
        >
          {this.props.columns.map((column) => (
            <Item
              column={column}
              onRemoveButtonClicked={
                (): void => this.props.onHeaderRemoveButtonClicked?.(column.name)
              }
            />
          ))}
        </Sortable>
      </div>
    );
  }
}
