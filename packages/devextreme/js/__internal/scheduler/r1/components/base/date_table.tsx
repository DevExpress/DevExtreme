import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate, RefObject } from '@ts/core/r1/types';
import { getTemplate } from '@ts/core/r1/utils/index';

import type { CellTemplateProps, DefaultProps } from '../types';
import { DateTableBody, DateTableBodyDefaultProps } from './date_table_body';
import { DateTableCellBase } from './date_table_cell_base';
import type { LayoutProps } from './layout_props';
import { LayoutDefaultProps } from './layout_props';
import { Table } from './table';

export interface DateTableProps extends LayoutProps {
  cellTemplate: JSXTemplate<CellTemplateProps>;
  tableRef?: RefObject<HTMLTableElement>;
}

export const DateTableDefaultProps: DefaultProps<DateTableProps> = {
  ...LayoutDefaultProps,
  cellTemplate: DateTableCellBase,
};

export class DateTable extends InfernoWrapperComponent<DateTableProps> {
  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  render(): JSX.Element {
    const {
      viewData,
      viewContext,
      tableRef,
      addDateTableClass,
      width,
      cellTemplate,
      dataCellTemplate,
      groupOrientation,
      addVerticalSizesClassToRows,
      ...restProps
    } = this.props;
    const classes = addDateTableClass ? 'dx-scheduler-date-table' : undefined;
    const topVirtualRowHeight = viewData.topVirtualRowHeight ?? 0;
    const bottomVirtualRowHeight = viewData.bottomVirtualRowHeight ?? 0;
    const leftVirtualCellWidth = viewData.leftVirtualCellWidth ?? 0;
    const rightVirtualCellWidth = viewData.rightVirtualCellWidth ?? 0;
    const virtualCellsCount = viewData.groupedData[0].dateTable[0].cells.length;
    const CellTemplateComponent = getTemplate(cellTemplate);
    const DataCellTemplateComponent = getTemplate(dataCellTemplate);

    return (
      // @ts-ignore
      <Table
        {...restProps}
        tableRef={tableRef}
        topVirtualRowHeight={topVirtualRowHeight}
        bottomVirtualRowHeight={bottomVirtualRowHeight}
        leftVirtualCellWidth={leftVirtualCellWidth}
        rightVirtualCellWidth={rightVirtualCellWidth}
        leftVirtualCellCount={viewData.leftVirtualCellCount}
        rightVirtualCellCount={viewData.rightVirtualCellCount}
        virtualCellsCount={virtualCellsCount}
        className={classes}
        width={width}
      >
         {/* @ts-ignore */}
        <DateTableBody
          viewData={viewData}
          viewContext={viewContext}
          cellTemplate={CellTemplateComponent}
          dataCellTemplate={DataCellTemplateComponent}
          leftVirtualCellWidth={leftVirtualCellWidth}
          rightVirtualCellWidth={rightVirtualCellWidth}
          groupOrientation={groupOrientation}
          addVerticalSizesClassToRows={addVerticalSizesClassToRows}
          topVirtualRowHeight={DateTableBodyDefaultProps.topVirtualRowHeight}
          bottomVirtualRowHeight={DateTableBodyDefaultProps.bottomVirtualRowHeight}
          addDateTableClass={DateTableBodyDefaultProps.addDateTableClass}
        />
      </Table>
    );
  }
}

DateTable.defaultProps = DateTableDefaultProps;
