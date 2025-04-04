import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';

import type { DateTableProps } from '../base/date_table';
import { DateTable, DateTableDefaultProps } from '../base/date_table';
import { DateTableMonthCell } from './date_table_month_cell';

export class DateTableMonth extends InfernoWrapperComponent<DateTableProps> {
  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  render(): JSX.Element {
    const {
      viewData,
      viewContext,
      addDateTableClass,
      addVerticalSizesClassToRows,
      dataCellTemplate,
      groupOrientation,
      tableRef,
      width,
      ...restProps
    } = this.props;

    return (
      <DateTable
        {...restProps}
        viewData={viewData}
        viewContext={viewContext}
        groupOrientation={groupOrientation}
        addDateTableClass={addDateTableClass}
        dataCellTemplate={dataCellTemplate}
        // @ts-expect-error JSX template types issue
        cellTemplate={DateTableMonthCell}
        tableRef={tableRef}
        addVerticalSizesClassToRows={addVerticalSizesClassToRows}
        width={width}
      />
    );
  }
}

DateTableMonth.defaultProps = DateTableDefaultProps;
