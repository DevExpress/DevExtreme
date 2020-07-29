import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../../row';

export const viewFunction = (viewModel: AllDayPanelRow) => (
  <Row
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={`dx-scheduler-all-day-table-row ${viewModel.props.className}`}
  >
    {viewModel.props.children}
  </Row>
);

@ComponentBindings()
export class AllDayPanelRowProps {
  @OneWay() className?: string = '';

  @Slot() children?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelRow extends JSXComponent(AllDayPanelRowProps) {
}
