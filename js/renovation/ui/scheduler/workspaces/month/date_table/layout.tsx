import { Component, JSXComponent } from '@devextreme-generator/declarations';
import { DateTable } from '../../../../../component_wrapper/scheduler/date_table';
import { DateTableLayoutBase, DateTableLayoutProps } from '../../base/date_table/layout';
import { MonthDateTableCell } from './cell';

export const viewFunction = ({
  restAttributes,
  props: {
    viewData,
    dataCellTemplate,
    addDateTableClass,
    groupOrientation,
    tableRef,
    addVerticalSizesClassToRows,
    width,
  },
}: MonthDateTableLayout): JSX.Element => (
  <DateTableLayoutBase
    viewData={viewData}
    groupOrientation={groupOrientation}
    addDateTableClass={addDateTableClass}
    dataCellTemplate={dataCellTemplate}
    cellTemplate={MonthDateTableCell}
    tableRef={tableRef}
    addVerticalSizesClassToRows={addVerticalSizesClassToRows}
    width={width}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
    component: DateTable,
  },
})
export class MonthDateTableLayout extends JSXComponent(DateTableLayoutProps) {}
