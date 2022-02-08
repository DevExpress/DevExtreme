import {
  Component, JSXComponent, ComponentBindings, OneWay, Effect, Consumer,
} from '@devextreme-generator/declarations';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';
import { Column, Row } from '../types';
import { DataCell } from './data_cell';
import { RowBase, RowClassesGetter } from './row_base';

export const viewFunction = (viewModel: DataRow): JSX.Element => (
  <RowBase row={viewModel.props.row}>
    {viewModel.props.columns.map((column, index) => (
      <DataCell
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        columnIndex={index}
        column={column}
        row={viewModel.props.row}
      />
    ))}
  </RowBase>
);

@ComponentBindings()
export class DataRowProps {
  @OneWay()
  row: Row = {
    data: {},
    rowType: '',
  };

  @OneWay()
  rowIndex = 0;

  @OneWay()
  columns: Column[] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DataRow extends JSXComponent(DataRowProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @Effect()
  extendDataRowClasses(): () => void {
    return this.plugins.extend(
      RowClassesGetter, 1,
      (base) => (row): Record<string, boolean> => {
        if (row.rowType === 'data') {
          return {
            ...base(row),
            'dx-data-row': true,
          };
        }
        return base(row);
      },
    );
  }
}
