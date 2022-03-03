import {
  Component, JSXComponent, ComponentBindings, OneWay, Effect, Consumer, JSXTemplate,
} from '@devextreme-generator/declarations';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';
import { ColumnInternal, Row, RowTemplateProps } from '../types';
import { DataCell } from './data_cell';
import { RowBase, RowClassesGetter } from './row_base';
import CLASSES from '../classes';

export const viewFunction = (viewModel: DataRow): JSX.Element => {
  const { rowTemplate: RowTemplate } = viewModel;
  const { row, columns, rowIndex } = viewModel.props;

  return (
    RowTemplate
      ? (
        <RowTemplate
          row={row}
          rowIndex={rowIndex}
        />
      ) : (
        <RowBase row={row}>
          {columns.map((column, index) => (
            <DataCell
            // eslint-disable-next-line react/no-array-index-key
              key={index}
              columnIndex={index}
              countColumn={columns.length}
              column={column}
              cellTemplate={column.cellTemplate}
              cellContainerTemplate={column.cellContainerTemplate}
              row={row}
            />
          ))}
        </RowBase>
      )
  );
};

@ComponentBindings()
export class DataRowProps {
  @OneWay()
  row: Row = {
    data: {},
    rowType: 'data',
  };

  @OneWay()
  rowIndex = 0;

  @OneWay()
  columns: ColumnInternal[] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DataRow extends JSXComponent(DataRowProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  get rowTemplate(): JSXTemplate<RowTemplateProps> | undefined {
    return this.props.row.template;
  }

  @Effect()
  extendDataRowClasses(): () => void {
    return this.plugins.extend(
      RowClassesGetter, 1,
      (base) => (row): Record<string, boolean> => {
        if (row.rowType === 'data') {
          return {
            ...base(row),
            [CLASSES.dataRow]: true,
          };
        }
        return base(row);
      },
    );
  }
}
