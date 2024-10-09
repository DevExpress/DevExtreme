import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';

import { Card } from './card/card';

export interface ContentProps {
  items: DataRow[];
}

export const CLASSES = {
  content: 'dx-cardview-content',
};

export function Content(props: ContentProps): JSX.Element {
  return (
    <div className={CLASSES.content}>
      {props.items.map((item) => (
        <Card
          row={item}
          // isEditing={isEditing}
          // onChange={
          //   (columnName, value): void => this.editing.onChanged(item.key, columnName, value)
          // }
          // fieldTemplate={fieldTemplate}
        />
      ))}
    </div>
  );
}
