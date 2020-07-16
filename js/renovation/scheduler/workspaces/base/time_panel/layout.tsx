import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../row';
import { TimePanelCell as Cell } from './cell';
import { ViewCellData } from '../../types';

export const viewFunction = (viewModel: TimePanelTableLayout) => (
  <table
    className={`${viewModel.props.className} dx-scheduler-time-panel`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <tbody>
      {viewModel.props.viewCellsData!.map((cellsRow) => (
        <Row
          className="dx-scheduler-time-panel-row"
          key={cellsRow[0].startDate.toString()}
        >
          {cellsRow.map(({
            startDate,
            text,
          }: ViewCellData) => (
            <Cell
              startDate={startDate}
              text={text}
              key={startDate.toString()}
            />
          ))}
        </Row>
      ))}
    </tbody>
  </table>
);

@ComponentBindings()
export class TimePanelTableLayoutProps {
  @OneWay() viewCellsData?: ViewCellData[][] = [[]];

  @OneWay() className?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TimePanelTableLayout extends JSXComponent(TimePanelTableLayoutProps) {
}
