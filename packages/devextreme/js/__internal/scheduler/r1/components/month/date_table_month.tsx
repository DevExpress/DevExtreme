import type { InfernoEffect } from '@ts/core/r1/runtime/inferno/index';
import { createReRenderEffect, InfernoWrapperComponent } from '@ts/core/r1/runtime/inferno/index';

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
        cellTemplate={DateTableMonthCell}
        tableRef={tableRef}
        addVerticalSizesClassToRows={addVerticalSizesClassToRows}
        width={width}
      />
    );
  }
}

DateTableMonth.defaultProps = DateTableDefaultProps;
