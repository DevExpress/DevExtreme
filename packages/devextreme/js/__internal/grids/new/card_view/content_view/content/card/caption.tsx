import type { FieldInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ComponentType } from 'inferno';

export interface CaptionProps {
  field: FieldInfo;
  template?: ComponentType<{ field: FieldInfo }>;
}

export const Caption = (props: CaptionProps): JSX.Element => {
  const Template = props.template;

  return (
    <div className="dx-cardview-field-caption">
      {Template ? (
        <Template field={props.field} />
      )
        : <>{props.field.column.caption}:</>
      }
    </div>
  );
};
