import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';
import { Button } from '@ts/grids/new/grid_core/inferno_wrappers/button';
import type { ComponentType } from 'inferno';

export const CLASSES = {
  headerItem: 'dx-gridcore-header-item',
  button: 'dx-gridcore-header-item-button',
};

export interface HeaderItemProps {
  column: Column;
  buttons?: ComponentType;
  onRemoveButtonClicked?: () => void;
}

export function HeaderItem(props: HeaderItemProps): JSX.Element {
  return (
    <div className={CLASSES.headerItem}>
      {props.column.caption}
      <Button
          icon='close'
          stylingMode='text'
          elementAttr={{ class: CLASSES.button }}
          onClick={(): void => { props.onRemoveButtonClicked?.(); }}
        />
    </div>
  );
}
