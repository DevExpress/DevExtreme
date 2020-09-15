import {
  Component, ComponentBindings, JSXComponent, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../row';
import { ViewCellData } from '../../types.d';
import { isVerticalGroupOrientation } from '../../utils';
import { GroupOrientation } from '../../../types.d';

export const viewFunction = (viewModel: HeaderPanelLayout): JSX.Element => (
  <table
    className={`dx-scheduler-header-panel ${viewModel.props.className}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <thead>
      <Row>
        {viewModel.props.viewCellsData![0].map(({
          startDate, endDate, today, groups, groupIndex, index, key,
        }) => (
          <viewModel.props.cellTemplate
            startDate={startDate}
            endDate={endDate}
            groups={!viewModel.isVerticalGroupOrientation ? groups : undefined}
            groupIndex={!viewModel.isVerticalGroupOrientation ? groupIndex : undefined}
            today={today}
            index={index}
            // TODO: implement this when bug in Vue is fixed
            // But since we do not use it for now, it can be commented
            // dateCellTemplate={viewModel.props.dateCellTemplate}
            key={key}
          />
        ))}
      </Row>
    </thead>
  </table>
);

@ComponentBindings()
export class HeaderPanelLayoutProps {
  @OneWay() className?: string = '';

  @OneWay() viewCellsData?: ViewCellData[][] = [[]];

  @OneWay() groupOrientation?: GroupOrientation;

  @Template() cellTemplate?: any;

  @Template() dateCellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderPanelLayout extends JSXComponent(HeaderPanelLayoutProps) {
  get isVerticalGroupOrientation(): boolean {
    const { groupOrientation } = this.props;

    return isVerticalGroupOrientation(groupOrientation);
  }
}
