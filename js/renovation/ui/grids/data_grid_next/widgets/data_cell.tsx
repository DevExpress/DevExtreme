import {
  Component, JSXComponent, ComponentBindings, OneWay, JSXTemplate, Template,
} from '@devextreme-generator/declarations';
import { ColumnInternal, Row, RowData } from '../types';
import { combineClasses } from '../../../../utils/combine_classes';

import CLASSES from '../classes';

export const viewFunction = (viewModel: DataCell): JSX.Element => {
  const {
    cellText,
    classes,
  } = viewModel;
  const {
    row,
    cellTemplate: CellTemplate,
    cellContainerTemplate: CellContainerTemplate,
  } = viewModel.props;
  const cellContentTemplate = CellTemplate
    ? <CellTemplate data={row.data} />
    : cellText;

  return (
    !CellContainerTemplate
      ? (
        <td
          // TODO uncomment after https://trello.com/c/kVXfSWI7
          // aria-describedby={`dx-col-${columnIndex + 1}`}
          aria-selected="false"
          role="gridcell"
          className={classes}
        >
          {cellContentTemplate}
        </td>
      )
      : (
        <CellContainerTemplate data={row.data} />
      )
  );
};

@ComponentBindings()
export class DataCellProps {
  @OneWay()
  row: Row = {
    data: {},
    rowType: 'data',
  };

  @OneWay()
  columnIndex = 0;

  @OneWay()
  countColumn = 0;

  @OneWay()
  column: ColumnInternal = {};

  @Template()
  cellTemplate?: JSXTemplate<{ data: RowData }, 'data'>;

  @Template()
  cellContainerTemplate?: JSXTemplate<{ data: RowData }, 'data'>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DataCell extends JSXComponent(DataCellProps) {
  get cellText(): string {
    const { dataField } = this.props.column;
    const value = dataField && this.props.row.data[dataField];
    return value !== undefined ? String(value) : '';
  }

  get classes(): string {
    const { columnIndex, countColumn } = this.props;

    const classesMap = {
      [CLASSES.firstChild]: columnIndex === 0,
      [CLASSES.lastChild]: columnIndex === countColumn - 1,
    };

    return combineClasses(classesMap);
  }
}
