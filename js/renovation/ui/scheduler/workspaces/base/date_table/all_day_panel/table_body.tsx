import {
  Component, ComponentBindings, JSXComponent, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { AllDayPanelRow as Row } from './row';
import { AllDayPanelCell as Cell } from './cell';
import { getKeyByDateAndGroup } from '../../../utils';
import { ViewCellData } from '../../../types.d';

export const viewFunction = (viewModel: AllDayPanelTableBody): JSX.Element => (
  <Row
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    {viewModel.props.viewData!.map((cell, index) => (
      <Cell
        isFirstCell={index === 0}
        isLastCell={index === (viewModel.props.viewData!.length - 1)}
        dataCellTemplate={viewModel.props.dataCellTemplate}
        key={getKeyByDateAndGroup(cell.startDate, cell.groups)}
      />
    ))}
  </Row>
);

@ComponentBindings()
export class AllDayPanelTableBodyProps {
  @OneWay() viewData?: ViewCellData[];

  @Template() dataCellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelTableBody extends JSXComponent(AllDayPanelTableBodyProps) {
}
