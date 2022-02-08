import {
  Component, JSXComponent, ComponentBindings, OneWay, JSXTemplate,
} from '@devextreme-generator/declarations';
import { Column, Row, RowData } from '../types';

export const viewFunction = ({
  cellText,
  cellTemplate: CellTemplate,
  classes,
  props: {
    row,
  },
}: DataCell): JSX.Element => (
  <td
    // TODO uncomment after https://trello.com/c/kVXfSWI7
    // aria-describedby={`dx-col-${columnIndex + 1}`}
    aria-selected="false"
    role="gridcell"
    className={classes}
  >
    { CellTemplate && <CellTemplate data={row.data} /> }
    { !CellTemplate && cellText}
  </td>
);

@ComponentBindings()
export class DataCellProps {
  @OneWay()
  row: Row = {
    data: {},
    rowType: '',
  };

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
    const value = dataField && this.props.row.data[dataField];
    return value !== undefined ? String(value) : '';
  }

  get classes(): string {
    return this.props.columnIndex === 0 ? 'dx-first-child' : '';
  }
}
