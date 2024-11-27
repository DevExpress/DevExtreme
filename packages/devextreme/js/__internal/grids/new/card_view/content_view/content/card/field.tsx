import { PureComponent } from '@ts/grids/new/grid_core/core/pure_component';
import type { InfernoNode, RefObject } from 'inferno';

export const CLASSES = {
  field: 'dx-cardview-field',
  fieldName: 'dx-cardview-field-name',
  fieldValue: 'dx-cardview-field-value',
};

export interface FieldProps {
  title: string | undefined;

  value: unknown;

  alignment: 'right' | 'center' | 'left';

  elementRef?: RefObject<HTMLDivElement>;
}

export class Field extends PureComponent<FieldProps> {
  render(): InfernoNode {
    return (
      <div className={CLASSES.field} tabIndex={0} ref={this.props.elementRef}>
        <span className={CLASSES.fieldName}>{this.props.title}: </span>
        <span
          style={{ 'text-align': this.props.alignment }}
          className={CLASSES.fieldName}
        >
          {this.props.value}
        </span>
      </div>
    );
  }
}
