import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Fragment,
  Template,
  JSXTemplate,
} from '@devextreme-generator/declarations';
import { Row } from '../row';
import { TimePanelCell as Cell } from './cell';
import { CellBase } from '../cell';
import {
  getKeyByGroup,
  getIsGroupedAllDayPanel,
  isVerticalGroupOrientation,
} from '../../utils';
import { Table } from '../table';
import { AllDayPanelTitle } from '../date_table/all_day_panel/title';
import { DateTimeCellTemplateProps, TimePanelData } from '../../types.d';
import { GroupOrientation } from '../../../types.d';

export const viewFunction = ({
  props: {
    groupOrientation,
    timePanelData,
    timeCellTemplate,
  },
  topVirtualRowHeight,
  bottomVirtualRowHeight,
  isVerticalGroupOrientation: isVerticalGrouping,
  restAttributes,
}: TimePanelTableLayout): JSX.Element => (
  <Table
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    topVirtualRowHeight={topVirtualRowHeight}
    bottomVirtualRowHeight={bottomVirtualRowHeight}
    virtualCellsCount={1}
    className="dx-scheduler-time-panel"
  >
    {timePanelData
      .groupedData.map(({ dateTable, groupIndex }, index) => (
        <Fragment key={getKeyByGroup(groupIndex, groupOrientation)}>
          {getIsGroupedAllDayPanel(timePanelData, index) && (
            <Row>
              <CellBase className="dx-scheduler-time-panel-title-cell">
                <AllDayPanelTitle />
              </CellBase>
            </Row>
          )}
          {dateTable.map((cell) => {
            const { cellCountInGroupRow } = timePanelData;
            const {
              groups,
              startDate,
              text,
              index: cellIndex,
              isFirstGroupCell,
              isLastGroupCell,
              key,
            } = cell;

            return (
              <Row
                className="dx-scheduler-time-panel-row"
                key={key}
              >
                <Cell
                  startDate={startDate}
                  text={text}
                  groups={isVerticalGrouping ? groups : undefined}
                  groupIndex={isVerticalGrouping ? groupIndex : undefined}
                  isFirstGroupCell={isVerticalGrouping && isFirstGroupCell}
                  isLastGroupCell={isVerticalGrouping && isLastGroupCell}
                  index={Math.floor(cellIndex / cellCountInGroupRow)}
                  timeCellTemplate={timeCellTemplate}
                />
              </Row>
            );
          })}
        </Fragment>
      ))}
  </Table>
);

@ComponentBindings()
export class TimePanelTableLayoutProps {
  @OneWay() groupOrientation?: GroupOrientation;

  @OneWay() timePanelData: TimePanelData = {
    groupedData: [],
    cellCountInGroupRow: 0,
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0,
  };

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
  },
})
export class TimePanelTableLayout extends JSXComponent(TimePanelTableLayoutProps) {
  get topVirtualRowHeight(): number {
    return this.props.timePanelData.topVirtualRowHeight || 0;
  }

  get bottomVirtualRowHeight(): number {
    return this.props.timePanelData.bottomVirtualRowHeight || 0;
  }

  get isVerticalGroupOrientation(): boolean {
    const { groupOrientation } = this.props;

    return isVerticalGroupOrientation(groupOrientation);
  }
}
