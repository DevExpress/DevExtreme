import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from '@devextreme-generator/declarations';
import { Row } from '../../row';
import { AllDayPanelCell as Cell } from './cell';
import {
  DataCellTemplateProps,
  ViewCellData,
} from '../../../types.d';
import { combineClasses } from '../../../../../../utils/combine_classes';

export const viewFunction = (viewModel: AllDayPanelTableBody): JSX.Element => (
  <Row
    leftVirtualCellWidth={viewModel.props.leftVirtualCellWidth}
    rightVirtualCellWidth={viewModel.props.rightVirtualCellWidth}
    leftVirtualCellCount={viewModel.props.leftVirtualCellCount}
    rightVirtualCellCount={viewModel.props.rightVirtualCellCount}
    className={viewModel.classes}
  >
    {viewModel.props.viewData.map(({
      startDate,
      endDate,
      groups,
      groupIndex: cellGroupIndex,
      index: cellIndex,
      isFirstGroupCell,
      isLastGroupCell,
      isSelected,
      isFocused,
      key,
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
        key={key}
        isSelected={isSelected}
        isFocused={isFocused}
      />
    ))}
  </Row>
);

@ComponentBindings()
export class AllDayPanelTableBodyProps {
  @OneWay() viewData: ViewCellData[] = [];

  @OneWay() isVerticalGroupOrientation?: boolean = false;

  @OneWay() className?: string = '';

  @OneWay() leftVirtualCellWidth = 0;

  @OneWay() rightVirtualCellWidth = 0;

  @OneWay() leftVirtualCellCount?: number;

  @OneWay() rightVirtualCellCount?: number;

  @Template() dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AllDayPanelTableBody extends JSXComponent(AllDayPanelTableBodyProps) {
  get classes(): string {
    const { className = '' } = this.props;

    return combineClasses({
      'dx-scheduler-all-day-table-row': true,
      [className]: !!className,
    });
  }
}
