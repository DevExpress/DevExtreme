import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { Component } from 'inferno';

import { Row } from './row';

export interface ContentProps {
  items: DataRow[];
}

export const CLASSES = {
  content: 'dx-datagridnew-content',
};

export class Content extends Component<ContentProps> {
  public render(): JSX.Element {
    return (
      <div
        tabIndex={0}
        className={CLASSES.content}
      >
        {this.props.items.map((item) => (
          <Row
            row={item}
          />
        ))}
      </div>
    );
  }
}
