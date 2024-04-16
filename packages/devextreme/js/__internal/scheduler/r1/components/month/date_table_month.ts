import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/r1/utils/index';
import { DateTableMonthCell } from '@ts/scheduler/r1/components/month/date_table_month_cell';
import type { VNode } from 'inferno';
import { createComponentVNode } from 'inferno';

import type { DateTableProps } from '../base/date_table';
import { DateTable, DateTableDefaultProps } from '../base/date_table';

export class DateTableMonth extends InfernoWrapperComponent<DateTableProps> {
  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  render(): VNode {
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

    const dataCellTemplateComponent = getTemplate(dataCellTemplate);

    return createComponentVNode(2, DateTable, {
      ...restProps,
      viewData,
      groupOrientation,
      addDateTableClass,
      dataCellTemplate: dataCellTemplateComponent,
      cellTemplate: DateTableMonthCell,
      tableRef,
      addVerticalSizesClassToRows,
      width,
    });
  }
}
DateTableMonth.defaultProps = DateTableDefaultProps;
