import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';

import { Card } from './card/card';

export interface ContentProps {
  items: DataRow[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldTemplate?: any;
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
          fieldTemplate={props.fieldTemplate}
        />
      ))}
    </div>
  );
}
