import type { Cell } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ComponentType } from 'inferno';

export interface CaptionProps {
  cell: Cell;
  template?: ComponentType<{ cell: Cell }>;
}

export const Caption = (props: CaptionProps): JSX.Element => {
  const Template = props.template;

  return (
    <div className="dx-cardview-field-caption">
      {Template ? (
        <Template cell={props.cell} />
      )
        : <>{props.cell.column.caption}:</>
      }
    </div>
  );
};
