import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import type { RefObject } from '@ts/core/r1/types';
import { getTemplate } from '@ts/core/r1/utils/index';
import type { ViewCellData } from '@ts/scheduler/r1/types';

import { DefaultSizes } from '../const';
import { AllDayPanelTableBody, AllDayPanelTableBodyDefaultProps } from './all_day_panel_table_body';
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

  render(): JSX.Element {
    const {
      viewData,
      viewContext,
      width,
      tableRef,
      dataCellTemplate,
    } = this.props;
    const allDayPanelData = this.getAllDayPanelData();
    const DataCellTemplateComponent = getTemplate(dataCellTemplate);

    return (
      // @ts-ignore
      <Table
        className="dx-scheduler-all-day-table"
        height={allDayPanelData ? undefined : DefaultSizes.allDayPanelHeight}
        width={width}
        tableRef={tableRef}
      >
        {/* @ts-ignore */}
        <AllDayPanelTableBody
          viewData={allDayPanelData ?? AllDayPanelTableBodyDefaultProps.viewData}
          viewContext={viewContext}
          leftVirtualCellWidth={viewData.leftVirtualCellWidth
            ?? AllDayPanelTableBodyDefaultProps.leftVirtualCellWidth}
          rightVirtualCellWidth={viewData.rightVirtualCellWidth
            ?? AllDayPanelTableBodyDefaultProps.rightVirtualCellWidth}
          leftVirtualCellCount={viewData.leftVirtualCellCount}
          rightVirtualCellCount={viewData.rightVirtualCellCount}
          dataCellTemplate={DataCellTemplateComponent}
        />
      </Table>
    );
  }
}

AllDayTable.defaultProps = LayoutDefaultProps;
