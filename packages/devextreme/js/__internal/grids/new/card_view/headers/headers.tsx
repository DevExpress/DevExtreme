/**
 * @module
 * @document headers.spec.md
 */

import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { Component } from 'inferno';

import { Sortable } from '../../grid_core/inferno_wrappers/sortable';
import { HeaderItem } from './header_item';

export const CLASSES = {
  headers: 'dx-gridcore-headers',
};

export interface HeadersProps {
  columns: Column[];

  onReorder?: (fromIndex: number, toIndex: number) => void;
}

export class Headers extends Component<HeadersProps> {
  public render(): JSX.Element {
    return (
      <div className={CLASSES.headers}>
        <Sortable
          itemOrientation='horizontal'
          dropFeedbackMode='indicate'
          onReorder={(e): void => this.props.onReorder?.(e.fromIndex, e.toIndex)}
        >
          {this.props.columns.map((column) => (
            <HeaderItem
              column={column}
            />
          ))}
        </Sortable>
      </div>
    );
  }
}
