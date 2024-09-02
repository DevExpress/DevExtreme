/**
 * @module
 * @document headers.spec.md
 */

import type { Column } from '@ts/grids/new/grid_core/columns_controller/types';

import { HeaderItem } from './header_item';

export const CLASSES = {
  headers: 'dx-gridcore-headers',
};

export interface HeadersProps {
  columns: Column[];
}

export function Headers(props: HeadersProps): JSX.Element {
  return (
    <div className={CLASSES.headers}>
      {props.columns.map((column) => (
        <HeaderItem
          column={column}
        />
      ))}
    </div>
  );
}
