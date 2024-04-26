import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/r1/utils/index';

import type { DateTableProps } from '../base/date_table';
import { DateTable, DateTableDefaultProps } from '../base/date_table';
import { DateTableMonthCell } from './date_table_month_cell';

export class DateTableMonth extends InfernoWrapperComponent<DateTableProps> {
  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  render(): JSX.Element {
    const {
      addDateTableClass,
      addVerticalSizesClassToRows,
      dataCellTemplate,
      groupOrientation,
      tableRef,
      viewData,
      width,
      ...restProps
    } = this.props;

    const DataCellTemplateComponent = getTemplate(dataCellTemplate);

    return (
      <DateTable
        {...restProps}
      viewData={viewData}
      groupOrientation={groupOrientation}
      addDateTableClass={addDateTableClass}
      dataCellTemplate={DataCellTemplateComponent}
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
