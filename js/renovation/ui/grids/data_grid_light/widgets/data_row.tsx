import {
  Component, JSXComponent, ComponentBindings, OneWay, Effect, Consumer,
} from '@devextreme-generator/declarations';
import { PluginsContext, Plugins } from '../../../../utils/plugin/context';
import { Column, Row } from '../types';
import { RowBase, RowClassesGetter } from './row_base';

export const viewFunction = (viewModel: DataRow): JSX.Element => (
  <RowBase row={viewModel.props.row}>
    {viewModel.props.columns.map((column, index) => {
      const {
        cellTemplate: CellTemplate,
        cellContainerTemplate: CellContainerTemplate,
        dataField,
      } = column;

      const cellContentTemplate = CellTemplate
        ? <CellTemplate data={viewModel.props.row.data} />
        : dataField && `${viewModel.props.row.data[dataField]}`;

      return (
        !CellContainerTemplate
          ? (
            <td
            // eslint-disable-next-line react/no-array-index-key
              key={index}
            // TODO uncomment after https://trello.com/c/kVXfSWI7
            // aria-describedby={`dx-col-${index + 1}`}
              aria-selected="false"
              role="gridcell"
            >
              {cellContentTemplate}
            </td>
          )
          : (
            // eslint-disable-next-line react/no-array-index-key
            <CellContainerTemplate key={index} data={viewModel.props.row.data}>
              {cellContentTemplate}
            </CellContainerTemplate>
          )
      );
    })}
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
