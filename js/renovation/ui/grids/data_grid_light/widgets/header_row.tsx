import {
  Component, JSXComponent, ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import { Column } from '../types';
import { HeaderCell } from './header_cell';

import CLASSES from '../classes';

export const viewFunction = (viewModel: HeaderRow): JSX.Element => (
  <tr className={`${CLASSES.row} ${CLASSES.columnLines} ${CLASSES.headerRow}`} role="row">
    {viewModel.props.columns.map((column, index) => (
      <HeaderCell
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        column={column}
        countColumn={viewModel.props.columns.length}
        columnIndex={index}
      />
    ))}
  </tr>
);

@ComponentBindings()
export class HeaderRowProps {
  @OneWay()
  columns: Column[] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderRow extends JSXComponent(HeaderRowProps) {
}
