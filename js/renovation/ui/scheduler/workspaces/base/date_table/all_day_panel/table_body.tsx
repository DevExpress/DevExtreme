import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { AllDayPanelRow as Row } from './row';
import { AllDayPanelCell as Cell } from './cell';
import { getKeyByDateAndGroup } from '../../../utils';
import { ViewCellData } from '../../../types.d';

export const viewFunction = (viewModel: AllDayPanelTableBody) => (
  <Fragment>
    <Row key={getKeyByDateAndGroup(viewModel.props.viewData![0].startDate)}>
      {viewModel.props.viewData!.map((_, cellIndex) => (
        <Cell key={getKeyByDateAndGroup(viewModel.props.viewData![cellIndex].startDate)} />
      ))}
    </Row>
  </Fragment>
);

@ComponentBindings()
export class AllDayPanelTableBodyProps {
  @OneWay() viewData?: ViewCellData[] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelTableBody extends JSXComponent(AllDayPanelTableBodyProps) {
}
