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
    {viewModel.props.viewData!.map(({
      startDate,
      endDate,
      groups,
      groupIndex: cellGroupIndex,
      index: cellIndex,
      isFirstGroupCell,
      isLastGroupCell,
    }) => (
      <Cell
        isFirstGroupCell={!viewModel.props.isVerticalGroupOrientation && isFirstGroupCell}
        isLastGroupCell={!viewModel.props.isVerticalGroupOrientation && isLastGroupCell}
        startDate={startDate}
        endDate={endDate}
        groups={groups}
        groupIndex={cellGroupIndex}
        index={cellIndex}
        dataCellTemplate={viewModel.props.dataCellTemplate}
        key={getKeyByDateAndGroup(startDate, groups)}
      />
    ))}
  </Row>
);

@ComponentBindings()
export class AllDayPanelTableBodyProps {
  @OneWay() viewData?: ViewCellData[];

  @OneWay() isVerticalGroupOrientation?: boolean = false;

  @Template() dataCellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelTableBody extends JSXComponent(AllDayPanelTableBodyProps) {
}
