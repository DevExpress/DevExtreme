import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { AllDayPanelRow as Row } from './row';
import { AllDayPanelCell as Cell } from './cell';
import { getKeyByDateAndGroup } from '../../../utils';
import { ViewCellData } from '../../../types.d';

export const viewFunction = (viewModel: AllDayPanelTableBody) => (
  <Row
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    {viewModel.props.viewData!.map((cell, index) => (
      <Cell
        isFirstGroupCell={index === 0}
        isLastGroupCell={index === (viewModel.props.viewData!.length - 1)}
        key={getKeyByDateAndGroup(cell.startDate, cell.groups)}
      />
    ))}
  </Row>
);

@ComponentBindings()
export class AllDayPanelTableBodyProps {
  @OneWay() viewData?: ViewCellData[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelTableBody extends JSXComponent(AllDayPanelTableBodyProps) {
}
