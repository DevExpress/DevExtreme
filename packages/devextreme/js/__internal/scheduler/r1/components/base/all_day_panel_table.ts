import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import type { RefObject } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/r1/utils/index';
import type { ViewCellData } from '@ts/scheduler/r1/types';
import type { VNode } from 'inferno';
import { createComponentVNode } from 'inferno';

import { DefaultSizes } from '../const';
import { AllDayPanelTableBody } from './all_day_panel_table_body';
import type { LayoutProps } from './layout_props';
import { LayoutDefaultProps } from './layout_props';
import { Table } from './table';

export interface AllDayPanelTableProps extends LayoutProps {
  tableRef?: RefObject<HTMLTableElement>;
}

export class AllDayTable extends InfernoWrapperComponent<AllDayPanelTableProps> {
  private allDayPanelData: ViewCellData[] | undefined | null = null;

  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  private getAllDayPanelData(): ViewCellData[] | undefined {
    if (this.allDayPanelData !== null) {
      return this.allDayPanelData;
    }

    this.allDayPanelData = this.props.viewData.groupedData[0].allDayPanel;
    return this.allDayPanelData;
  }

  componentWillUpdate(nextProps: AllDayPanelTableProps): void {
    super.componentWillUpdate();

    if (this.props.viewData !== nextProps.viewData) {
      this.allDayPanelData = null;
    }
  }

  render(): VNode {
    const {
      width,
      tableRef,
      viewData,
      dataCellTemplate,
    } = this.props;
    const allDayPanelData = this.getAllDayPanelData();
    const dataCellTemplateComponent = getTemplate(dataCellTemplate);

    return createComponentVNode(2, Table, {
      className: 'dx-scheduler-all-day-table',
      height: allDayPanelData ? undefined : DefaultSizes.allDayPanelHeight,
      width,
      tableRef,
      children: createComponentVNode(2, AllDayPanelTableBody, {
        viewData: allDayPanelData,
        leftVirtualCellWidth: viewData.leftVirtualCellWidth,
        rightVirtualCellWidth: viewData.rightVirtualCellWidth,
        leftVirtualCellCount: viewData.leftVirtualCellCount,
        rightVirtualCellCount: viewData.rightVirtualCellCount,
        dataCellTemplate: dataCellTemplateComponent,
      }),
    });
  }
}
AllDayTable.defaultProps = LayoutDefaultProps;
