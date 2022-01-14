import {
  Component, JSXComponent, ComponentBindings, OneWay, JSXTemplate,
} from '@devextreme-generator/declarations';
import { Column, RowData } from '../types';

export const viewFunction = ({
  cellText,
  cellTemplate: CellTemplate,
  props: {
    data,
  },
}: DataCell): JSX.Element => (
  <td
    // TODO uncomment after https://trello.com/c/kVXfSWI7
    // aria-describedby={`dx-col-${columnIndex + 1}`}
    aria-selected="false"
    role="gridcell"
  >
    { CellTemplate && <CellTemplate data={data} /> }
    { !CellTemplate && cellText}
  </td>
);

@ComponentBindings()
export class DataCellProps {
  @OneWay()
  data: RowData = {};

  @OneWay()
  columnIndex = 0;

  @OneWay()
  column: Column = {};
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DataCell extends JSXComponent(DataCellProps) {
  get cellTemplate(): JSXTemplate<{ data: RowData }, 'data'> | undefined {
    return this.props.column.cellTemplate;
  }

  get cellText(): string {
    const { dataField } = this.props.column;
    const value = dataField && this.props.data[dataField];
    return value !== undefined ? String(value) : '';
  }
}
