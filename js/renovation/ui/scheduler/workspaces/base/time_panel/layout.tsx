import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Fragment,
  Template,
  JSXTemplate,
  ForwardRef,
  RefObject,
} from '@devextreme-generator/declarations';
import { Row } from '../row';
import { TimePanelCell as Cell } from './cell';
import { CellBase } from '../cell';
import { Table } from '../table';
import { AllDayPanelTitle } from '../date_table/all_day_panel/title';
import { DateTimeCellTemplateProps, TimePanelData } from '../../types';
import { GroupOrientation } from '../../../types';
import { TimePanel } from '../../../../../component_wrapper/scheduler/time_panel';

export const viewFunction = ({
  props: {
    timePanelData,
    timeCellTemplate,
    tableRef,
  },
  topVirtualRowHeight,
  bottomVirtualRowHeight,
  restAttributes,
}: TimePanelTableLayout): JSX.Element => (
  <Table
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    topVirtualRowHeight={topVirtualRowHeight}
    bottomVirtualRowHeight={bottomVirtualRowHeight}
    virtualCellsCount={1}
    className="dx-scheduler-time-panel"
    tableRef={tableRef}
  >
    {timePanelData
      .groupedData.map(({
        dateTable,
        groupIndex,
        key: fragmentKey,
        isGroupedAllDayPanel,
      }) => (
        <Fragment key={fragmentKey}>
          {isGroupedAllDayPanel && (
            <Row>
              <CellBase className="dx-scheduler-time-panel-title-cell">
                <AllDayPanelTitle />
              </CellBase>
            </Row>
          )}
          {dateTable.map((cell) => {
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
                  groups={groups}
                  groupIndex={groupIndex}
                  isFirstGroupCell={isFirstGroupCell}
                  isLastGroupCell={isLastGroupCell}
                  index={cellIndex}
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
export class TimePanelLayoutProps {
  @OneWay() groupOrientation?: GroupOrientation;

  @OneWay() timePanelData: TimePanelData = {
    groupedData: [],
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0,
  };

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @ForwardRef() tableRef?: RefObject<HTMLTableElement>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
    component: TimePanel,
  },
})
export class TimePanelTableLayout extends JSXComponent(TimePanelLayoutProps) {
  get topVirtualRowHeight(): number {
    return this.props.timePanelData.topVirtualRowHeight ?? 0;
  }

  get bottomVirtualRowHeight(): number {
    return this.props.timePanelData.bottomVirtualRowHeight ?? 0;
  }
}
