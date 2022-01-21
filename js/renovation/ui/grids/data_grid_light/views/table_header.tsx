import {
  Component, JSXComponent, ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

import { Table } from '../widgets/table';
import { HeaderRow } from '../widgets/header_row';
import { Column } from '../types';

export const viewFunction = (viewModel: TableHeader): JSX.Element => (
  <div className="dx-datagrid-headers dx-datagrid-nowrap" role="presentation">
    <div className="dx-datagrid-content dx-datagrid-scroll-container" role="presentation">
      <Table>
        <HeaderRow columns={viewModel.props.columns} />
      </Table>
    </div>
  </div>
);

@ComponentBindings()
export class TableHeaderProps {
  @OneWay()
  columns: Column[] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TableHeader extends JSXComponent(TableHeaderProps) {
}
