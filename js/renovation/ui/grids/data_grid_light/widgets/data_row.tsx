import {
  Component, JSXComponent, ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = (viewModel: DataRow): JSX.Element => (
  <tr
    className="dx-row dx-data-row dx-column-lines"
    role="row"
    aria-selected="false"
    aria-rowindex={viewModel.props.rowIndex + 1}
  >
    {viewModel.props.columns.map((dataField, index) => (
      <td
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        aria-describedby={`dx-col-${index + 1}`}
        aria-selected="false"
        role="gridcell"
        aria-colindex={index + 1}
      >
        {String(viewModel.props.data[dataField])}
      </td>
    ))}
  </tr>
);

@ComponentBindings()
export class DataRowProps {
  @OneWay()
  data: Record<string, unknown> = {};

  @OneWay()
  rowIndex = 0;

  @OneWay()
  columns: string[] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DataRow extends JSXComponent(DataRowProps) {
}
