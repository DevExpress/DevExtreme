import {
  Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import {
  Row, RowProps,
} from '../row';

export const viewFunction = (viewModel: DateTableRow) => (
  <Row
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className="dx-scheduler-date-table-row"
  >
    {viewModel.props.children}
  </Row>
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableRow extends JSXComponent(RowProps) {
}
