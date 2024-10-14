import $ from '@js/core/renderer';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { PureComponent } from '@ts/grids/new/grid_core/core/pure_component';
import { Toolbar } from '@ts/grids/new/grid_core/inferno_wrappers/toolbar';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type ComponentType, type InfernoNode, render } from 'inferno';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FieldProps } from './field';
import { Field } from './field';

export const CLASSES = {
  card: 'dx-cardview-card',
};

export interface CardProps {
  row: DataRow;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldTemplate?: any;
}

export class Card extends PureComponent<CardProps> {
  render(): InfernoNode {
    const FieldTemplate = this.props.fieldTemplate ?? Field;
    return (
      <div className={CLASSES.card} tabIndex={0}>
        <Toolbar
          items={[
            {
              location: 'before',
              widget: 'dxCheckBox',
            },
            {
              location: 'before',
              template: (model, _index, container): void => {
                render(<span>Card Header</span>, $(container).get(0));
              },
            },
            {
              location: 'after',
              widget: 'dxButton',
              options: {
                icon: 'save',
                stylingMode: 'text',
              },
            },
            {
              location: 'after',
              widget: 'dxButton',
              options: {
                icon: 'edit',
                stylingMode: 'text',
              },
            },
            {
              location: 'after',
              widget: 'dxButton',
              options: {
                icon: 'remove',
                stylingMode: 'text',
              },
            },
          ]}
        />
        {this.props.row.cells.map((cell, index) => (
          <FieldTemplate
            index={index}
            // eslint-disable-next-line max-len, @typescript-eslint/explicit-function-return-type
            defaultTemplate={{ render(model, _index, container) { render(<Field {...model} />, $(container).get(0)); } }}
            alignment={cell.column.alignment}
            title={cell.column.caption}
            value={cell.value}
          />
        ))}
      </div>
    );
  }
}
