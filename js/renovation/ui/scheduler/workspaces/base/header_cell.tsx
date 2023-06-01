import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { CellProps } from './ordinary_cell';

export const viewFunction = ({
  props: {
    colSpan,
    className,
    styles,
    children,
  },
}: HeaderCell): JSX.Element => (
  <th
    className={className}
    style={styles}
    colSpan={colSpan}
  >
    {children}
  </th>
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderCell extends JSXComponent(CellProps) {}
