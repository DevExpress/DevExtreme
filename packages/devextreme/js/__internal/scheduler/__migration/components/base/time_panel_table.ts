import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate, RefObject } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/component_wrappers/utils/index';
import type { VNode } from 'inferno';
import {
  createComponentVNode, createFragment,
} from 'inferno';

import type { GroupOrientation, TimePanelData } from '../../types';
import type { DateTimeCellTemplateProps } from '../types';
import { AllDayPanelTitle } from './all_day_panel_title';
import { CellBase } from './cell';
import { Row } from './row';
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

  render(): VNode {
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
    const timeCellTemplateComponent = getTemplate(timeCellTemplate);

    return createComponentVNode(2, Table, {
      ...restProps,
      topVirtualRowHeight: topVirtualRowHeight ?? 0,
      bottomVirtualRowHeight: bottomVirtualRowHeight ?? 0,
      virtualCellsCount: 1,
      className: 'dx-scheduler-time-panel',
      tableRef,
      children: timePanelData.groupedData.map((data) => {
        const {
          dateTable,
          groupIndex,
          isGroupedAllDayPanel,
          key: fragmentKey,
        } = data;
        return createFragment([isGroupedAllDayPanel && createComponentVNode(2, Row, {
          children: createComponentVNode(2, CellBase, {
            className: 'dx-scheduler-time-panel-title-cell',
            children: createComponentVNode(2, AllDayPanelTitle),
          }),
        }), dateTable.map((cell) => {
          const {
            groups,
            highlighted,
            index: cellIndex,
            isFirstGroupCell,
            isLastGroupCell,
            key,
            startDate,
            text,
          } = cell;
          return createComponentVNode(2, Row, {
            className: 'dx-scheduler-time-panel-row',
            children: createComponentVNode(2, TimePanelCell, {
              startDate,
              text,
              groups,
              groupIndex,
              isFirstGroupCell,
              isLastGroupCell,
              index: cellIndex,
              timeCellTemplate: timeCellTemplateComponent,
              highlighted,
            }),
          }, key);
        })], 0, fragmentKey);
      }),
    });
  }
}
TimePanelTable.defaultProps = TimePanelTableDefaultProps;
