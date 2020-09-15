import {
  Component, ComponentBindings, JSXComponent, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../../row';
import { AllDayPanelCell as Cell } from './cell';
import { ViewCellData } from '../../../types.d';

export const viewFunction = (viewModel: AllDayPanelTableBody): JSX.Element => (
  <Row
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={`dx-scheduler-all-day-table-row ${viewModel.props.className}`}
  >
    {viewModel.props.viewData!.map(({
      startDate,
      endDate,
      groups,
      groupIndex: cellGroupIndex,
      index: cellIndex,
      key,
    }, index) => (
      <Cell
        isFirstCell={index === 0}
        isLastCell={index === (viewModel.props.viewData!.length - 1)}
        startDate={startDate}
        endDate={endDate}
        groups={groups}
        groupIndex={cellGroupIndex}
        index={cellIndex}
        dataCellTemplate={viewModel.props.dataCellTemplate}
        key={key}
      />
    ))}
  </Row>
);

@ComponentBindings()
export class AllDayPanelTableBodyProps {
  @OneWay() viewData?: ViewCellData[];

  @OneWay() className?: string = '';

  @Template() dataCellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelTableBody extends JSXComponent(AllDayPanelTableBodyProps) {
}
