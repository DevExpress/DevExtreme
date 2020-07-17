import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../row';
import { TimePanelCell as Cell } from './cell';
import { GroupedViewData, ViewCellData } from '../../types';
import { getKeyByDateAndGroup } from '../../utils';

export const viewFunction = (viewModel: TimePanelTableLayout) => (
  <table
    className={`${viewModel.props.className} dx-scheduler-time-panel`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <tbody>
      {viewModel.props.viewData!
        .groupedData.map(({ dateTable }) => dateTable.map((cellsRow) => (
          <Row
            className="dx-scheduler-time-panel-row"
            key={getKeyByDateAndGroup(cellsRow[0].startDate, cellsRow[0].groups)}
          >
            {cellsRow.map(({
              startDate,
              text,
              groups,
            }: ViewCellData) => (
              <Cell
                startDate={startDate}
                text={text}
                key={getKeyByDateAndGroup(startDate, groups)}
              />
            ))}
          </Row>
        )))}
    </tbody>
  </table>
);

@ComponentBindings()
export class TimePanelTableLayoutProps {
  @OneWay() viewData?: GroupedViewData;

  @OneWay() className?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TimePanelTableLayout extends JSXComponent(TimePanelTableLayoutProps) {
}
