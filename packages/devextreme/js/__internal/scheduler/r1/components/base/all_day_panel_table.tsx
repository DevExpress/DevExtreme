import type { InfernoEffect } from '@ts/core/r1/runtime/inferno/index';
import { createReRenderEffect, InfernoWrapperComponent } from '@ts/core/r1/runtime/inferno/index';
import type { RefObject } from '@ts/core/r1/types';
import type { ViewCellData } from '@ts/scheduler/types';

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

    return (
      <Table
        className="dx-scheduler-all-day-table"
        height={allDayPanelData ? undefined : DefaultSizes.allDayPanelHeight}
        width={width}
        tableRef={tableRef}
      >
        <AllDayPanelTableBody
          viewData={allDayPanelData ?? AllDayPanelTableBodyDefaultProps.viewData}
          viewContext={viewContext}
          leftVirtualCellWidth={viewData.leftVirtualCellWidth
            ?? AllDayPanelTableBodyDefaultProps.leftVirtualCellWidth}
          rightVirtualCellWidth={viewData.rightVirtualCellWidth
            ?? AllDayPanelTableBodyDefaultProps.rightVirtualCellWidth}
          leftVirtualCellCount={viewData.leftVirtualCellCount}
          rightVirtualCellCount={viewData.rightVirtualCellCount}
          dataCellTemplate={dataCellTemplate}
        />
      </Table>
    );
  }
}

AllDayTable.defaultProps = LayoutDefaultProps;
