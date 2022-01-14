import {
  Component, JSXComponent, ComponentBindings, OneWay, JSXTemplate,
} from '@devextreme-generator/declarations';
import { Column } from '../types';

export const viewFunction = ({
  props: { column, columnIndex },
  headerTemplate: HeaderTemplate,
}: HeaderCell): JSX.Element => (
  <td
    aria-selected="false"
    role="columnheader" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
    // TODO uncomment after https://trello.com/c/kVXfSWI7
    // aria-colindex={index + 1}
    id={`dx-col-${columnIndex + 1}`}
    aria-label={`Column ${column.dataField}`}
    className="dx-datagrid-action dx-cell-focus-disabled"
    aria-sort="none"
    tabIndex={0}
  >
    <div className="dx-datagrid-text-content dx-text-content-alignment-left" role="presentation">
      {HeaderTemplate ? <HeaderTemplate /> : column.dataField}
    </div>
  </td>
);

@ComponentBindings()
export class HeaderCellProps {
  @OneWay()
  column: Column = {};

  @OneWay()
  columnIndex = 0;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderCell extends JSXComponent(HeaderCellProps) {
  get headerTemplate(): JSXTemplate | undefined {
    return this.props.column.headerTemplate;
  }
}
