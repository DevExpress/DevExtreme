import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment, Template,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../row';
import { TimePanelCell as Cell } from './cell';
import { CellBase } from '../cell';
import {
  getKeyByDateAndGroup,
  getKeyByGroup,
  getIsGroupedAllDayPanel,
} from '../../utils';
import { Table } from '../table';
import { LayoutProps } from '../layout_props';
import { AllDayPanelTitle } from '../date_table/all_day_panel/title';

export const viewFunction = (viewModel: TimePanelTableLayout): JSX.Element => (
  <div
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <Table
      isVirtual={viewModel.isVirtual}
      topVirtualRowHeight={viewModel.topVirtualRowHeight}
      bottomVirtualRowHeight={viewModel.bottomVirtualRowHeight}
      className={`dx-scheduler-time-panel ${viewModel.props.className}`}
    >
      {viewModel.props.viewData!
        .groupedData.map(({ dateTable }, groupIndex) => (
          <Fragment key={getKeyByGroup(groupIndex)}>
            { getIsGroupedAllDayPanel(viewModel.props.viewData!, groupIndex)
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
                      timeCellTemplate={viewModel.props.timeCellTemplate}
                    />
                  </Row>
                );
              })
            }
          </Fragment>
        ))}
    </Table>
  </div>
);

@ComponentBindings()
export class TimePanelTableLayoutProps extends LayoutProps {
  @OneWay() className? = '';

  @OneWay() allDayPanelVisible? = false;

  @Template() timeCellTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
  },
})
export class TimePanelTableLayout extends JSXComponent(TimePanelTableLayoutProps) {
  get isVirtual(): boolean {
    const { viewData } = this.props;
    return !!viewData!.isVirtual;
  }

  get topVirtualRowHeight(): number {
    return this.props.viewData!.topVirtualRowHeight || 0;
  }

  get bottomVirtualRowHeight(): number {
    return this.props.viewData!.bottomVirtualRowHeight || 0;
  }
}
