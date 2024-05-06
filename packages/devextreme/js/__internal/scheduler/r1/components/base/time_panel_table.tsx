import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate, RefObject } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/r1/utils/index';
import { Fragment } from 'inferno';

import type { GroupOrientation, TimePanelData } from '../../types';
import type { DateTimeCellTemplateProps } from '../types';
import { AllDayPanelTitle } from './all_day_panel_title';
import { CellBase, CellBaseDefaultProps } from './cell';
import { Row, RowDefaultProps } from './row';
import { Table } from './table';
import { TimePanelCell } from './time_panel_cell';

export interface TimePanelTableProps {
  groupOrientation?: GroupOrientation;
  timePanelData: TimePanelData;
  timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
  tableRef?: RefObject<HTMLTableElement>;
}

export const TimePanelTableDefaultProps = {
  timePanelData: {
    groupedData: [],
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0,
  },
};

export class TimePanelTable extends InfernoWrapperComponent<TimePanelTableProps> {
  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  render(): JSX.Element {
    const {
      timePanelData,
      tableRef,
      timeCellTemplate,
      ...restProps
    } = this.props;
    const {
      topVirtualRowHeight,
      bottomVirtualRowHeight,
    } = timePanelData;
    const TimeCellTemplateComponent = getTemplate(timeCellTemplate);

    return (
      // @ts-expect-error TS2786
      <Table
        {...restProps}
        className="dx-scheduler-time-panel"
        topVirtualRowHeight={topVirtualRowHeight ?? 0}
        bottomVirtualRowHeight={bottomVirtualRowHeight ?? 0}
        virtualCellsCount={1}
        tableRef={tableRef}
      >
        {
          timePanelData.groupedData.map(({
            dateTable,
            groupIndex,
            isGroupedAllDayPanel,
            key: fragmentKey,
          }) => (
            <Fragment key={fragmentKey}>
              {
                isGroupedAllDayPanel && (
                  // @ts-expect-error TS2786
                  <Row
                    leftVirtualCellWidth={RowDefaultProps.leftVirtualCellWidth}
                    rightVirtualCellWidth={RowDefaultProps.rightVirtualCellWidth}
                  >
                    {/* @ts-expect-error TS2786 */}
                    <CellBase
                      className="dx-scheduler-time-panel-title-cell"
                      startDate={CellBaseDefaultProps.startDate}
                      endDate={CellBaseDefaultProps.endDate}
                      index={CellBaseDefaultProps.index}
                    >
                      {/* @ts-expect-error TS2786 */}
                      <AllDayPanelTitle/>
                    </CellBase>
                  </Row>
                )
              }
              {
                dateTable.map(({
                  groups,
                  highlighted,
                  index: cellIndex,
                  isFirstGroupCell,
                  isLastGroupCell,
                  key,
                  startDate,
                  text,
                }) => (
                  // @ts-expect-error TS2786
                  <Row
                    key={key}
                    className="dx-scheduler-time-panel-row"
                    leftVirtualCellWidth={RowDefaultProps.leftVirtualCellWidth}
                    rightVirtualCellWidth={RowDefaultProps.rightVirtualCellWidth}
                  >
                    {/* @ts-expect-error TS2786 */}
                    <TimePanelCell
                      startDate={startDate}
                      endDate={CellBaseDefaultProps.endDate}
                      text={text}
                      groups={groups}
                      groupIndex={groupIndex}
                      isFirstGroupCell={isFirstGroupCell}
                      isLastGroupCell={isLastGroupCell}
                      index={cellIndex}
                      timeCellTemplate={TimeCellTemplateComponent}
                      highlighted={highlighted}
                    />
                  </Row>
                ))
              }
            </Fragment>
          ))
        }
      </Table>
    );
  }
}

TimePanelTable.defaultProps = TimePanelTableDefaultProps;
