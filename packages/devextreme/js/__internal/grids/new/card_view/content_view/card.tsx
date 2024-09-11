import $ from '@js/core/renderer';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { PureComponent } from '@ts/grids/new/grid_core/core/pure_component';
import { type ComponentType, type InfernoNode, render } from 'inferno';

import type { FieldProps } from './field';
import { Field } from './field';

export const CLASSES = {
  card: 'dx-cardview-card',
};

export interface CardProps {
  row: DataRow;
  isEditing?: boolean;

  onChange?: (columnName: string, value: unknown) => void;

  fieldTemplate?: any;
}

export class Card extends PureComponent<CardProps> {
  render(): InfernoNode {
    const FieldTemplate = this.props.fieldTemplate ?? Field;
    return (
      <div className={CLASSES.card} tabIndex={0}>
        {this.props.row.cells.map((cell, index) => (
          <FieldTemplate
            index={index}
            defaultTemplate={{ render(model, index, container) { render(<Field {...model} />, $(container).get(0)); } }}
            alignment={cell.column.alignment}
            title={cell.column.name}
            value={cell.value}
            isEditing={this.props.isEditing}
            onChanged={(v): void => {
              if (!cell.column.name) {
                return;
              }
              this.props.onChange?.(cell.column.name, v);
            }}
          />
        ))}
      </div>
    );
  }
}
