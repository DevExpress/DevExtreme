import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment, Template,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../row';
import { TimePanelCell as Cell } from './cell';
import { CellBase } from '../cell';
import {
  getKeyByGroup,
  getIsGroupedAllDayPanel,
  isVerticalGroupOrientation,
} from '../../utils';
import { Table } from '../table';
import { LayoutProps } from '../layout_props';
import { AllDayPanelTitle } from '../date_table/all_day_panel/title';

export const viewFunction = (viewModel: TimePanelTableLayout): JSX.Element => (
  <Table
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    isVirtual={viewModel.isVirtual}
    topVirtualRowHeight={viewModel.topVirtualRowHeight}
    bottomVirtualRowHeight={viewModel.bottomVirtualRowHeight}
    virtualCellsCount={1}
    className="dx-scheduler-time-panel"
  >
    {viewModel.props.viewData!
      .groupedData.map(({ dateTable, groupIndex }, index) => (
        <Fragment key={getKeyByGroup(groupIndex)}>
          {getIsGroupedAllDayPanel(viewModel.props.viewData!, index) && (
            <Row>
              <CellBase className="dx-scheduler-time-panel-title-cell">
                <AllDayPanelTitle />
              </CellBase>
            </Row>
          )}
          {dateTable.map((cellsRow) => {
            const { cellCountInGroupRow } = viewModel.props.viewData!;
            const {
              groups,
              startDate,
              text,
              index: cellIndex,
              isFirstGroupCell,
              isLastGroupCell,
              key,
            } = cellsRow[0];

            return (
              <Row
                className="dx-scheduler-time-panel-row"
                key={key}
              >
                <Cell
                  startDate={startDate}
                  text={text}
                  groups={viewModel.isVerticalGroupOrientation ? groups : undefined}
                  groupIndex={viewModel.isVerticalGroupOrientation ? groupIndex : undefined}
                  isFirstGroupCell={viewModel.isVerticalGroupOrientation && isFirstGroupCell}
                  isLastGroupCell={viewModel.isVerticalGroupOrientation && isLastGroupCell}
                  index={Math.floor(cellIndex / cellCountInGroupRow)}
                  timeCellTemplate={viewModel.props.timeCellTemplate}
                />
              </Row>
            );
          })}
        </Fragment>
      ))}
  </Table>
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
