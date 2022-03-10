import {
  Component, JSXComponent, ComponentBindings, Slot, OneWay,
} from '@devextreme-generator/declarations';
import CLASSES from '../classes';
import type { ColumnInternal } from '../types';

export const viewFunction = (viewModel: Table): JSX.Element => (
  <table className={`${CLASSES.table} ${CLASSES.fixedTable}`} role="presentation">
    <colgroup>
      {viewModel.props.columns.map((column) => <col style={{ width: column.width }} />)}
    </colgroup>
    <tbody role="presentation">
      {viewModel.props.children}
    </tbody>
  </table>
);

@ComponentBindings()
export class TableProps {
  @OneWay()
  columns!: ColumnInternal[];

  @Slot() children?: JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Table extends JSXComponent<TableProps, 'columns'>(TableProps) {
}
