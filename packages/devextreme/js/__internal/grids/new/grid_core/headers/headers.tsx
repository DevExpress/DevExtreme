import type { Column } from '../columns_controller/types';
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
