import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import type { ComponentType } from 'inferno';

export const CLASSES = {
  headerItem: 'dx-gridcore-header-item',
};

export interface HeaderItemProps {
  column: Column;
  buttons?: ComponentType;
}

export function HeaderItem(props: HeaderItemProps): JSX.Element {
  return (
    <div className={CLASSES.headerItem}>
      {props.column.caption}
    </div>
  );
}
