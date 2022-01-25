import {
  Component, JSXComponent, ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import { Column } from '../types';

export const viewFunction = (viewModel: HeaderRow): JSX.Element => (
  <tr className="dx-row dx-column-lines dx-header-row" role="row">
    {viewModel.props.columns.map((column, index) => {
      const HeaderTemplate = column.headerTemplate;
      return (
        <td
        // eslint-disable-next-line react/no-array-index-key
          key={index}
          aria-selected="false"
          role="columnheader" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
        // TODO uncomment after https://trello.com/c/kVXfSWI7
        // aria-colindex={index + 1}
          id={`dx-col-${index + 1}`}
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
    })}
  </tr>
);

@ComponentBindings()
export class HeaderRowProps {
  @OneWay()
  columns: Column[] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderRow extends JSXComponent(HeaderRowProps) {
}
