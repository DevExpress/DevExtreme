import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment, Template,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../row';
import { TimePanelCell as Cell } from './cell';
import { CellBase } from '../cell';
import {
  getKeyByDateAndGroup,
  getKeyByGroup,
  getIsAllDayPanelInsideDateTable,
  isVerticalGroupOrientation,
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
        .groupedData.map(({ dateTable }, index) => {
          const { groupIndex = index } = dateTable[0][0];

          return (
            <Fragment key={getKeyByGroup(groupIndex)}>
              {getIsAllDayPanelInsideDateTable(viewModel.props.viewData!, groupIndex) && (
                <Row>
                  <CellBase className="dx-scheduler-time-panel-title-cell">
                    <AllDayPanelTitle />
                  </CellBase>
                </Row>
              )}
              {dateTable.map((cellsRow, rowIndex) => {
                const { cellCountInGroupRow } = viewModel.props.viewData!;
                const isFirstCell = rowIndex === 0;
                const isLastCell = rowIndex === dateTable.length - 1;
                const {
                  groups, startDate, text, index: cellIndex,
                } = cellsRow[0];

                return (
                  <Row
                    className="dx-scheduler-time-panel-row"
                    key={getKeyByDateAndGroup(startDate, groups)}
                  >
                    <Cell
                      startDate={startDate}
                      text={text}
                      groups={viewModel.isVerticalGroupOrientation ? groups : undefined}
                      groupIndex={viewModel.isVerticalGroupOrientation ? groupIndex : undefined}
                      isFirstCell={isFirstCell}
                      isLastCell={isLastCell}
                      index={Math.floor(cellIndex / cellCountInGroupRow)}
                      timeCellTemplate={viewModel.props.timeCellTemplate}
                    />
                  </Row>
                );
              })}
            </Fragment>
          );
        })}
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

  get isVerticalGroupOrientation(): boolean {
    const { groupOrientation } = this.props;

    return isVerticalGroupOrientation(groupOrientation);
  }
}
