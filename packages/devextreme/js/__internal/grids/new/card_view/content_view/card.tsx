import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { PureComponent } from '@ts/grids/new/grid_core/core/pure_component';
import type { InfernoNode } from 'inferno';

import { Field } from './field';

export const CLASSES = {
  card: 'dx-cardview-card',
};

export interface CardProps {
  row: DataRow;
}

export class Card extends PureComponent<CardProps> {
  render(): InfernoNode {
    return (
      <div className={CLASSES.card} tabIndex={0}>
        {this.props.row.cells.map((cell) => (
          <Field
            title={cell.column.name}
            value={cell.value}
          />
        ))}
      </div>
    );
  }
}
