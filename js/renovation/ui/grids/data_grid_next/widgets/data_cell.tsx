import {
  Component, JSXComponent, ComponentBindings, OneWay, JSXTemplate, Template,
} from '@devextreme-generator/declarations';
import { ColumnInternal, Row, RowData } from '../types';
import { combineClasses } from '../../../../utils/combine_classes';

import CLASSES from '../classes';
import formatHelper from '../../../../../format_helper';

export const viewFunction = (viewModel: DataCell): JSX.Element => {
  const {
    cellText,
    classes,
  } = viewModel;
  const {
    row,
    column,
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
          style={{ textAlign: column.alignment }}
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
  row!: Row;

  @OneWay()
  columnIndex = 0;

  @OneWay()
  columnCount = 0;

  @OneWay()
  column!: ColumnInternal;

  @Template()
  cellTemplate?: JSXTemplate<{ data: RowData }, 'data'>;

  @Template()
  cellContainerTemplate?: JSXTemplate<{ data: RowData }, 'data'>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DataCell extends JSXComponent<DataCellProps, 'column' | 'row'>(DataCellProps) {
  get cellText(): string {
    const { format, calculateCellValue } = this.props.column;
    const value = calculateCellValue ? calculateCellValue(this.props.row.data) : undefined;
    return formatHelper.format(value, format) || '';
  }

  get classes(): string {
    const { columnIndex, columnCount, column } = this.props;

    const classesMap = {
      [CLASSES.firstChild]: columnIndex === 0,
      [CLASSES.lastChild]: columnIndex === columnCount - 1,
      [column.cssClass ?? '']: true,
    };

    return combineClasses(classesMap);
  }
}
