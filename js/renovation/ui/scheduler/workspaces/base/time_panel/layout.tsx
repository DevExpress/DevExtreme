import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../row';
import { TimePanelCell as Cell } from './cell';
import { CellBase } from '../cell';
import { getKeyByDateAndGroup, getIsGroupedAllDayPanel } from '../../utils';
import { Table } from '../table';
import { LayoutProps } from '../layout_props';
import { AllDayPanelTitle } from '../date_table/all_day_panel/title';

export const viewFunction = (viewModel: TimePanelTableLayout) => (
  <Table
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={`dx-scheduler-time-panel ${viewModel.props.className}`}
  >
    {viewModel.props.viewData!
      .groupedData.map(({ dateTable }, groupIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={groupIndex}>
          { getIsGroupedAllDayPanel(viewModel.props.viewData!)
          && (
          <Row>
            <CellBase className="dx-scheduler-time-panel-title-cell">
              <AllDayPanelTitle />
            </CellBase>
          </Row>
          )}
          {
            dateTable.map((cellsRow, index) => {
              const isFirstCell = index === 0;
              const isLastCell = index === dateTable.length - 1;

              return (
                <Row
                  className="dx-scheduler-time-panel-row"
                  key={getKeyByDateAndGroup(cellsRow[0].startDate, cellsRow[0].groups)}
                >
                  <Cell
                    startDate={cellsRow[0].startDate}
                    text={cellsRow[0].text}
                    isFirstCell={isFirstCell}
                    isLastCell={isLastCell}
                  />
                </Row>
              );
            })
          }
        </Fragment>
      ))}
  </Table>
);

@ComponentBindings()
export class TimePanelTableLayoutProps extends LayoutProps {
  @OneWay() className?: string;
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
