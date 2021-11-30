import {
  Component, JSXComponent, ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = (viewModel: HeaderRow): JSX.Element => (
  <tr className="dx-row dx-column-lines dx-header-row" role="row">
    {viewModel.props.columns.map((dataField, index) => (
      <td
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        aria-selected="false"
        role="columnheader" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
        aria-colindex={index + 1}
        id={`dx-col-${index + 1}`}
        aria-label={`Column ${dataField}`}
        className="dx-datagrid-action dx-cell-focus-disabled"
        aria-sort="none"
        tabIndex={0}
      >
        <div className="dx-datagrid-text-content dx-text-content-alignment-left" role="presentation">
          {dataField}
        </div>
      </td>
    ))}
  </tr>
);

@ComponentBindings()
export class HeaderRowProps {
  @OneWay()
  columns: string[] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderRow extends JSXComponent(HeaderRowProps) {
}
