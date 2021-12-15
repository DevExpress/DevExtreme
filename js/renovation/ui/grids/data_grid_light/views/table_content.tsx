import {
  Component, JSXComponent, ComponentBindings, OneWay, Fragment,
} from '@devextreme-generator/declarations';

import { Table } from '../widgets/table';
import { DataRow } from '../widgets/data_row';

export const viewFunction = (viewModel: TableContent): JSX.Element => (
  <div className="dx-datagrid-rowsview dx-datagrid-nowrap dx-datagrid-after-headers" role="presentation">
    <div className="dx-datagrid-content">
      <Table>
        <Fragment>
          {viewModel.props.dataSource.map((data, rowIndex) => (
            <DataRow
              // eslint-disable-next-line react/no-array-index-key
              key={rowIndex}
              rowIndex={rowIndex}
              data={data}
              columns={viewModel.props.columns}
            />
          ))}
        </Fragment>
      </Table>
    </div>
  </div>
);

@ComponentBindings()
export class TableContentProps {
  @OneWay()
  dataSource: Record<string, unknown>[] = [];

  @OneWay()
  columns: string[] = [];
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: false },
  view: viewFunction,
})
export class TableContent extends JSXComponent(TableContentProps) {
}
