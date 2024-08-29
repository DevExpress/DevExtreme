import type { ComponentType } from 'inferno';

import type { Column } from '../columns_controller/types';

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
      {props.column.name}
    </div>
  );
}
