import { shallowEquals } from '@ts/core/r1/utils';
import type { InfernoNode } from 'inferno';
import { Component } from 'inferno';

import type { DataRow } from '../columns_controller/types';

export const CLASSES = {
  card: 'dx-cardview-card',
  field: 'dx-cardview-field',
  fieldName: 'dx-cardview-field-name',
  fieldValue: 'dx-cardview-field-value',
};

export interface CardProps {
  row: DataRow;
}

class PureComponent<P = {}, S = {}> extends Component<P, S> {
  shouldComponentUpdate(nextProps: P): boolean {
    return !shallowEquals(this.props, nextProps as any);
  }
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
