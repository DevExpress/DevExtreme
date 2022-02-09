import {
  Component, JSXComponent, ComponentBindings, OneWay, JSXTemplate,
} from '@devextreme-generator/declarations';
import { Column, Row, RowData } from '../types';
import { combineClasses } from '../../../../utils/combine_classes';

import CLASSES from '../classes';

export const viewFunction = (viewModel: DataCell): JSX.Element => {
  const {
    cellText,
    cellTemplate: CellTemplate,
    cellContainerTemplate: CellContainerTemplate,
    classes,
  } = viewModel;
  const { row } = viewModel.props;
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
        <CellContainerTemplate data={row.data}>
          {cellContentTemplate}
        </CellContainerTemplate>
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

  get cellContainerTemplate(): JSXTemplate<{ data: RowData }, 'data'> | undefined {
    return this.props.column.cellContainerTemplate;
  }

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
