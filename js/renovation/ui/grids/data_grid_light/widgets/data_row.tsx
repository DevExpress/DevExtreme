import {
  Component, JSXComponent, ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = (viewModel: DataRow): JSX.Element => (
  <tr
    className="dx-row dx-data-row dx-column-lines"
    role="row"
    aria-selected="false"
    // TODO uncomment after https://trello.com/c/kVXfSWI7
    // aria-rowindex={viewModel.props.rowIndex + 1}
  >
    {viewModel.cellTexts.map((text, index) => (
      <td
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        // TODO uncomment after https://trello.com/c/kVXfSWI7
        // aria-describedby={`dx-col-${index + 1}`}
        aria-selected="false"
        role="gridcell"
        // TODO uncomment after https://trello.com/c/kVXfSWI7
        // aria-colindex={index + 1}
      >
        {text}
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
  get cellTexts(): string[] {
    const { columns, data } = this.props;
    return columns.map((dataField) => String(data[dataField]));
  }
}
