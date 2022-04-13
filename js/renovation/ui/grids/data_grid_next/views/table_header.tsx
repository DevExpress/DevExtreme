import {
  Component, JSXComponent, ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

import { Table } from '../widgets/table';
import { HeaderRow } from '../widgets/header_row';
import { ColumnInternal } from '../types';
import CLASSES from '../classes';

export const viewFunction = (viewModel: TableHeader): JSX.Element => (
  <div className={`${CLASSES.headers} ${CLASSES.noWrap}`} role="presentation">
    <div className={`${CLASSES.content} ${CLASSES.scrollContainer}`} role="presentation">
      <Table>
        <HeaderRow columns={viewModel.props.columns} />
      </Table>
    </div>
  </div>
);

@ComponentBindings()
export class TableHeaderProps {
  @OneWay()
  columns: ColumnInternal[] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TableHeader extends JSXComponent(TableHeaderProps) {
}
