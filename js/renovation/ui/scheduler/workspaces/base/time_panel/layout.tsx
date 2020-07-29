import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../row';
import { TimePanelCell as Cell } from './cell';
import { GroupedViewData } from '../../types.d';
import { getKeyByDateAndGroup } from '../../utils';
import { Table } from '../table';
import { LayoutProps } from '../layout_props';

export const viewFunction = (viewModel: TimePanelTableLayout) => (
  <Table
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={`dx-scheduler-time-panel ${viewModel.props.className}`}
  >
    {viewModel.props.viewData!
      .groupedData.map(({ dateTable }) => dateTable.map((cellsRow) => (
        <Row
          className="dx-scheduler-time-panel-row"
          key={getKeyByDateAndGroup(cellsRow[0].startDate, cellsRow[0].groups)}
        >
          <Cell
            startDate={cellsRow[0].startDate}
            text={cellsRow[0].text}
          />
        </Row>
      )))}
  </Table>
);

@ComponentBindings()
export class TimePanelTableLayoutProps extends LayoutProps {
  @OneWay() className?: string;

  @OneWay() viewData?: GroupedViewData;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
  },
})
export class TimePanelTableLayout extends JSXComponent(TimePanelTableLayoutProps) {
}
