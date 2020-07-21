import {
  Component, ComponentBindings, JSXComponent, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../row';
import { ViewCellData } from '../../types';
import { getKeyByDateAndGroup } from '../../utils';

export const viewFunction = (viewModel: HeaderPanelLayout) => (
  <table
    className={`dx-scheduler-header-panel ${viewModel.props.className}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <thead>
      <Row>
        {viewModel.props.viewCellsData![0].map(({
          startDate, endDate, today, groups,
        }) => (
          <viewModel.props.cellTemplate
            startDate={startDate}
            endDate={endDate}
            today={today}
            key={getKeyByDateAndGroup(startDate, groups)}
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

  @Template() cellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class HeaderPanelLayout extends JSXComponent(HeaderPanelLayoutProps) {}
