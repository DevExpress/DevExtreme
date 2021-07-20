import { Component, JSXComponent } from '@devextreme-generator/declarations';
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
  },
}: MonthDateTableLayout): JSX.Element => (
  <DateTableLayoutBase
    viewData={viewData}
    groupOrientation={groupOrientation}
    addDateTableClass={addDateTableClass}
    dataCellTemplate={dataCellTemplate}
    cellTemplate={MonthDateTableCell}
    tableRef={tableRef}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class MonthDateTableLayout extends JSXComponent(DateTableLayoutProps) {}
