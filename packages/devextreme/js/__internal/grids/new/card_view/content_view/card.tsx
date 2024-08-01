import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { PureComponent } from '@ts/grids/new/grid_core/core/pure_component';
import type { InfernoNode } from 'inferno';

export const CLASSES = {
  card: 'dx-cardview-card',
  field: 'dx-cardview-field',
  fieldName: 'dx-cardview-field-name',
  fieldValue: 'dx-cardview-field-value',
};

export interface CardProps {
  row: DataRow;
}

export class Card extends PureComponent<CardProps> {
  render(): InfernoNode {
    return (
      <div className={CLASSES.card}>
        {this.props.row.cells.map((cell) => (
          <div className={CLASSES.field}>
            <span className={CLASSES.fieldName}>{cell.column.name}: </span>
            <span className={CLASSES.fieldName}>{cell.value}</span>
          </div>
        ))}
      </div>
    );
  }
}
